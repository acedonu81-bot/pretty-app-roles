import { useCallback, useEffect, useRef, useState } from 'react';
import { AtSign, Image as ImageIcon, Loader2, Pin, PinOff, Trash2, Video, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { timeAgo } from '@/lib/timeAgo';
import { CATEGORIAS_COMUNICADO, type Comunicado, etiquetaCategoria, formatoMencion } from '@/lib/comunicados';
import { CuerpoConMenciones } from '@/components/comunicados/ComunicadosCarrusel';

// Editor de comunicados del panel admin (6 nov 2026). Al publicar, un trigger
// avisa en la campana a la categoría elegida, manda push solo si se marca y
// avisa aparte a cada profesional mencionado (ver migración 20261106120000).

type Fila = Record<string, unknown>;
interface Consulta extends PromiseLike<{ data: unknown[] | null; error: { message: string } | null }> {
  order: (c: string, o: { ascending: boolean }) => Consulta;
  limit: (n: number) => Consulta;
  eq: (k: string, v: unknown) => Consulta;
}
const db = supabase as unknown as {
  from: (t: string) => {
    select: (c: string) => Consulta;
    insert: (r: Fila) => Consulta;
    update: (r: Fila) => Consulta;
    delete: () => Consulta;
  };
  rpc: (fn: string, args: Fila) => Promise<{ data: unknown[] | null }>;
};

interface Mencionable { user_id: string; display_name: string; role: string; photo_url: string | null }

const DIAS_CADUCA = [7, 15, 30, 60];
const MAX_VIDEO_MB = 100;

const estiloCampo = { background: '#fff', border: '1px solid rgba(0,0,0,0.12)', color: '#111827' };

export default function AdminComunicados() {
  const [titulo, setTitulo] = useState('');
  const [cuerpo, setCuerpo] = useState('');
  const [categoria, setCategoria] = useState('todos');
  const [push, setPush] = useState(false);
  const [fijado, setFijado] = useState(false);
  const [dias, setDias] = useState(30);
  const [ctaTexto, setCtaTexto] = useState('');
  const [ctaUrl, setCtaUrl] = useState('');
  const [imagenUrl, setImagenUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [subiendo, setSubiendo] = useState<'imagen' | 'video' | null>(null);
  const [publicando, setPublicando] = useState(false);

  const [buscarAbierto, setBuscarAbierto] = useState(false);
  const [q, setQ] = useState('');
  const [resultados, setResultados] = useState<Mencionable[]>([]);
  const area = useRef<HTMLTextAreaElement>(null);
  const cursor = useRef(0);

  const [lista, setLista] = useState<Comunicado[]>([]);
  const [lecturas, setLecturas] = useState<Record<string, number>>({});

  const cargar = useCallback(async () => {
    const [{ data }, { data: lect }] = await Promise.all([
      db.from('comunicados').select('*').order('created_at', { ascending: false }).limit(50),
      db.from('comunicado_lecturas').select('comunicado_id'),
    ]);
    setLista((data ?? []) as Comunicado[]);
    const cuenta: Record<string, number> = {};
    for (const l of (lect ?? []) as { comunicado_id: string }[]) cuenta[l.comunicado_id] = (cuenta[l.comunicado_id] ?? 0) + 1;
    setLecturas(cuenta);
  }, []);
  useEffect(() => { cargar(); }, [cargar]);

  useEffect(() => {
    if (q.trim().length < 2) { setResultados([]); return; }
    const t = setTimeout(async () => {
      const { data } = await db.rpc('admin_buscar_mencion', { p_q: q });
      setResultados((data ?? []) as Mencionable[]);
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  const insertarMencion = (m: Mencionable) => {
    const token = formatoMencion(m.display_name, m.user_id) + ' ';
    const pos = Math.min(cursor.current, cuerpo.length);
    setCuerpo(cuerpo.slice(0, pos) + token + cuerpo.slice(pos));
    cursor.current = pos + token.length;
    setBuscarAbierto(false); setQ(''); setResultados([]);
    requestAnimationFrame(() => {
      area.current?.focus();
      area.current?.setSelectionRange(cursor.current, cursor.current);
    });
  };

  const subir = async (file: File, tipo: 'imagen' | 'video') => {
    if (tipo === 'video' && file.size > MAX_VIDEO_MB * 1024 * 1024) {
      toast.error(`El vídeo pasa de ${MAX_VIDEO_MB} MB`); return;
    }
    setSubiendo(tipo);
    const ext = (file.name.split('.').pop() || (tipo === 'video' ? 'mp4' : 'jpg')).toLowerCase();
    const path = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from('comunicados').upload(path, file, { contentType: file.type });
    setSubiendo(null);
    if (error) { toast.error('No se pudo subir: ' + error.message); return; }
    const url = supabase.storage.from('comunicados').getPublicUrl(path).data.publicUrl;
    if (tipo === 'imagen') setImagenUrl(url); else setVideoUrl(url);
  };

  const limpiar = () => {
    setTitulo(''); setCuerpo(''); setCategoria('todos'); setPush(false); setFijado(false); setDias(30);
    setCtaTexto(''); setCtaUrl(''); setImagenUrl(null); setVideoUrl(null);
  };

  const publicar = async () => {
    if (!titulo.trim()) { toast.error('Falta el título'); return; }
    if (!cuerpo.trim() && !imagenUrl && !videoUrl) { toast.error('Pon texto, imagen o vídeo'); return; }
    if (ctaUrl.trim() && !/^(\/(?!\/)|https:\/\/)/.test(ctaUrl.trim())) {
      toast.error('El enlace del botón debe empezar por / o https://'); return;
    }
    const destino = etiquetaCategoria(categoria);
    if (!window.confirm(`Se publica para "${destino}" y les llega a la campana${push ? ' y por push' : ''}. ¿Seguimos?`)) return;
    setPublicando(true);
    const caduca = new Date(Date.now() + dias * 86400000).toISOString();
    const { error } = await db.from('comunicados').insert({
      titulo: titulo.trim(), cuerpo: cuerpo.trim(), categoria, push, fijado, caduca_at: caduca,
      imagen_url: imagenUrl, video_url: videoUrl,
      cta_texto: ctaTexto.trim() || null, cta_url: ctaUrl.trim() || null,
    });
    setPublicando(false);
    if (error) { toast.error('No se pudo publicar: ' + error.message); return; }
    toast.success('Comunicado publicado');
    limpiar(); cargar();
  };

  const alternarFijado = async (c: Comunicado) => {
    await db.from('comunicados').update({ fijado: !c.fijado }).eq('id', c.id);
    cargar();
  };
  const borrar = async (c: Comunicado) => {
    if (!window.confirm(`¿Borrar "${c.titulo}"? Desaparece del panel de todos.`)) return;
    await db.from('comunicados').delete().eq('id', c.id);
    cargar();
  };

  return (
    <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-6">
      <div className="rounded-2xl p-5 space-y-4" style={{ background: '#FFFDF7', border: '1px solid rgba(212,175,55,0.3)' }}>
        <h3 className="text-lg font-extrabold" style={{ color: '#111827' }}>Nuevo comunicado</h3>

        <input value={titulo} onChange={e => setTitulo(e.target.value)} maxLength={120} placeholder="Título"
          className="w-full rounded-xl px-3 py-2.5 text-sm font-bold" style={estiloCampo} />

        <div>
          <textarea ref={area} value={cuerpo} rows={6} maxLength={4000}
            onChange={e => { setCuerpo(e.target.value); cursor.current = e.target.selectionStart; }}
            onSelect={e => { cursor.current = e.currentTarget.selectionStart; }}
            placeholder="Texto del comunicado. Usa Mencionar para enlazar a un profesional."
            className="w-full rounded-xl px-3 py-2.5 text-sm" style={estiloCampo} />
          <div className="flex flex-wrap gap-2 mt-2">
            <button type="button" onClick={() => setBuscarAbierto(b => !b)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
              style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.4)', color: '#8B6A00' }}>
              <AtSign size={13} /> Mencionar
            </button>
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
              style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.1)', color: '#374151' }}>
              {subiendo === 'imagen' ? <Loader2 size={13} className="animate-spin" /> : <ImageIcon size={13} />} Imagen
              <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) subir(f, 'imagen'); e.target.value = ''; }} />
            </label>
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
              style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.1)', color: '#374151' }}>
              {subiendo === 'video' ? <Loader2 size={13} className="animate-spin" /> : <Video size={13} />} Vídeo
              <input type="file" accept="video/mp4,video/webm,video/quicktime" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) subir(f, 'video'); e.target.value = ''; }} />
            </label>
          </div>

          {buscarAbierto && (
            <div className="mt-2 rounded-xl p-2" style={estiloCampo}>
              <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Busca por nombre (mín. 2 letras)"
                className="w-full px-2 py-1.5 text-sm outline-none" />
              {resultados.map(r => (
                <button key={r.user_id} type="button" onClick={() => insertarMencion(r)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left hover:bg-black/5">
                  {r.photo_url
                    ? <img src={r.photo_url} alt="" className="w-7 h-7 rounded-full object-cover" />
                    : <span className="w-7 h-7 rounded-full" style={{ background: '#FBF3DD' }} />}
                  <span className="text-sm font-semibold">{r.display_name}</span>
                  <span className="text-xs" style={{ color: '#6b7280' }}>{r.role}</span>
                </button>
              ))}
              {q.trim().length >= 2 && !resultados.length && (
                <p className="px-2 py-1.5 text-xs" style={{ color: '#6b7280' }}>Nadie con ese nombre</p>
              )}
            </div>
          )}
        </div>

        {(imagenUrl || videoUrl) && (
          <div className="flex gap-3">
            {imagenUrl && (
              <div className="relative">
                <img src={imagenUrl} alt="" className="h-24 rounded-lg object-cover" />
                <button onClick={() => setImagenUrl(null)} aria-label="Quitar imagen"
                  className="absolute -top-2 -right-2 rounded-full p-1 bg-white shadow"><X size={12} /></button>
              </div>
            )}
            {videoUrl && (
              <div className="relative">
                <video src={videoUrl} muted className="h-24 rounded-lg" />
                <button onClick={() => setVideoUrl(null)} aria-label="Quitar vídeo"
                  className="absolute -top-2 -right-2 rounded-full p-1 bg-white shadow"><X size={12} /></button>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <input value={ctaTexto} onChange={e => setCtaTexto(e.target.value)} maxLength={40} placeholder="Texto del botón (opcional)"
            className="rounded-xl px-3 py-2 text-sm" style={estiloCampo} />
          <input value={ctaUrl} onChange={e => setCtaUrl(e.target.value)} placeholder="/dashboard?view=navidad o https://..."
            className="rounded-xl px-3 py-2 text-sm" style={estiloCampo} />
        </div>
        <p className="text-xs" style={{ color: '#6b7280' }}>
          Para un banner: solo título, imagen y botón, sin texto. Al pulsarlo va directo al enlace.
        </p>

        <div className="grid grid-cols-2 gap-2">
          <label className="text-xs font-bold" style={{ color: '#374151' }}>
            Para quién
            <select value={categoria} onChange={e => setCategoria(e.target.value)}
              className="mt-1 w-full rounded-xl px-3 py-2 text-sm font-normal" style={estiloCampo}>
              {CATEGORIAS_COMUNICADO.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </label>
          <label className="text-xs font-bold" style={{ color: '#374151' }}>
            Visible durante
            <select value={dias} onChange={e => setDias(Number(e.target.value))}
              className="mt-1 w-full rounded-xl px-3 py-2 text-sm font-normal" style={estiloCampo}>
              {DIAS_CADUCA.map(d => <option key={d} value={d}>{d} días</option>)}
            </select>
          </label>
        </div>

        <div className="flex flex-wrap gap-4 text-sm" style={{ color: '#374151' }}>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={push} onChange={e => setPush(e.target.checked)} />
            Avisar por push solo a esta categoría
          </label>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={fijado} onChange={e => setFijado(e.target.checked)} />
            Fijar el primero
          </label>
        </div>
        <p className="text-xs" style={{ color: '#6b7280' }}>
          La campana les llega a todos los de la categoría. El push solo a quien lo tiene activado. Los mencionados reciben su propio aviso.
        </p>

        {(cuerpo.trim() || titulo.trim()) && (
          <div className="rounded-xl p-3" style={{ background: '#fff', border: '1px dashed rgba(212,175,55,0.5)' }}>
            <p className="text-[0.7rem] font-bold uppercase tracking-wide mb-1" style={{ color: '#8B6A00' }}>Vista previa</p>
            <p className="font-bold mb-1">{titulo}</p>
            <CuerpoConMenciones cuerpo={cuerpo} />
          </div>
        )}

        <button onClick={publicar} disabled={publicando || !!subiendo}
          className="w-full py-3 rounded-xl text-sm font-extrabold disabled:opacity-50"
          style={{ background: '#D4AF37', color: '#1f2937' }}>
          {publicando ? 'Publicando...' : 'Publicar'}
        </button>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-extrabold" style={{ color: '#111827' }}>Publicados</h3>
        {!lista.length && <p className="text-sm" style={{ color: '#6b7280' }}>Todavía no hay ninguno.</p>}
        {lista.map(c => {
          const leidos = lecturas[c.id] ?? 0;
          const pct = c.destinatarios ? Math.round((leidos / c.destinatarios) * 100) : 0;
          const caducado = new Date(c.caduca_at).getTime() < Date.now();
          return (
            <div key={c.id} className="rounded-xl p-3 flex gap-3" style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', opacity: caducado ? 0.55 : 1 }}>
              {c.imagen_url && <img src={c.imagen_url} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />}
              <div className="min-w-0 flex-1">
                <p className="font-bold text-sm truncate">{c.titulo}</p>
                <p className="text-xs" style={{ color: '#6b7280' }}>
                  {etiquetaCategoria(c.categoria)} · {timeAgo(c.created_at)}{c.push ? ' · push' : ''}{caducado ? ' · caducado' : ''}
                </p>
                <p className="text-xs mt-1 font-semibold" style={{ color: pct >= 20 ? '#059669' : '#8B6A00' }}>
                  Leído por {leidos} de {c.destinatarios} ({pct} %)
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <button onClick={() => alternarFijado(c)} aria-label={c.fijado ? 'Desfijar' : 'Fijar'}
                  className="p-1.5 rounded-lg hover:bg-black/5" style={{ color: c.fijado ? '#8B6A00' : '#9ca3af' }}>
                  {c.fijado ? <Pin size={15} /> : <PinOff size={15} />}
                </button>
                <button onClick={() => borrar(c)} aria-label="Borrar" className="p-1.5 rounded-lg hover:bg-black/5" style={{ color: '#dc2626' }}>
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
