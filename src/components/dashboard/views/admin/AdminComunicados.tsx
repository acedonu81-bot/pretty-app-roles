import { useCallback, useEffect, useRef, useState } from 'react';
import { AtSign, BarChart3, ChevronDown, Eye, Globe, Image as ImageIcon, Loader2, Pencil, Pin, PinOff, Plus, Trash2, Video, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { timeAgo } from '@/lib/timeAgo';
import { CADUCA_NUNCA, CATEGORIAS_COMUNICADO, type Comunicado, esParaSiempre, type Interaccion, porcentajes, etiquetaCategoria, formatoMencion, slugNovedad } from '@/lib/comunicados';
import { CuerpoConMenciones, Portada } from '@/components/comunicados/ComunicadosCarrusel';

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
const SIEMPRE = -1; // valor del selector para "Para siempre"
const fechaCaduca = (dias: number) => (dias === SIEMPRE ? CADUCA_NUNCA : new Date(Date.now() + dias * 86400000).toISOString());
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
  const [publico, setPublico] = useState(false);
  const [comentariosOn, setComentariosOn] = useState(true);
  const [conEncuesta, setConEncuesta] = useState(false);
  const [pregunta, setPregunta] = useState('');
  const [opciones, setOpciones] = useState<string[]>(['', '']);
  const [diasEncuesta, setDiasEncuesta] = useState(0);
  // Edición de un comunicado ya publicado. Categoría y push no se tocan (los avisos ya salieron).
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [votosEdit, setVotosEdit] = useState(0);
  const formRef = useRef<HTMLDivElement>(null);

  const [buscarAbierto, setBuscarAbierto] = useState(false);
  const [q, setQ] = useState('');
  const [resultados, setResultados] = useState<Mencionable[]>([]);
  const area = useRef<HTMLTextAreaElement>(null);
  const cursor = useRef(0);

  const [lista, setLista] = useState<Comunicado[]>([]);
  const [lecturas, setLecturas] = useState<Record<string, number>>({});
  const [inter, setInter] = useState<Record<string, Interaccion>>({});
  // Quién ha leído cada comunicado (se carga al desplegar, no antes).
  const [lectoresAbierto, setLectoresAbierto] = useState<string | null>(null);
  const [lectores, setLectores] = useState<Record<string, { nombre: string; rol: string; cuando: string }[]>>({});

  const cargar = useCallback(async () => {
    const [{ data }, { data: lect }] = await Promise.all([
      db.from('comunicados').select('*').order('created_at', { ascending: false }).limit(50),
      db.from('comunicado_lecturas').select('comunicado_id'),
    ]);
    setLista((data ?? []) as Comunicado[]);
    const cuenta: Record<string, number> = {};
    for (const l of (lect ?? []) as { comunicado_id: string }[]) cuenta[l.comunicado_id] = (cuenta[l.comunicado_id] ?? 0) + 1;
    setLecturas(cuenta);
    const ids = ((data ?? []) as Comunicado[]).map(c => c.id);
    if (ids.length) {
      const { data: it } = await db.rpc('comunicados_interaccion', { p_ids: ids });
      const m: Record<string, Interaccion> = {};
      for (const x of (it ?? []) as Interaccion[]) m[x.comunicado_id] = x;
      setInter(m);
    }
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
    setPublico(false); setComentariosOn(true); setConEncuesta(false); setPregunta(''); setOpciones(['', '']); setDiasEncuesta(0);
    setEditandoId(null); setVotosEdit(0);
  };

  const editar = (c: Comunicado) => {
    setEditandoId(c.id);
    setTitulo(c.titulo); setCuerpo(c.cuerpo); setCategoria(c.categoria); setPush(false); setFijado(c.fijado);
    setDias(0); setCtaTexto(c.cta_texto ?? ''); setCtaUrl(c.cta_url ?? '');
    setImagenUrl(c.imagen_url); setVideoUrl(c.video_url);
    setPublico(!!c.publico); setComentariosOn(c.comentarios_on !== false);
    const hay = (c.encuesta_opciones?.length ?? 0) >= 2;
    setConEncuesta(hay); setPregunta(c.encuesta_pregunta ?? ''); setOpciones(hay ? [...(c.encuesta_opciones as string[])] : ['', '']);
    setDiasEncuesta(0);
    setVotosEdit((inter[c.id]?.votos ?? []).reduce((a, b) => a + b, 0));
    requestAnimationFrame(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  const publicar = async () => {
    if (!titulo.trim()) { toast.error('Falta el título'); return; }
    if (!cuerpo.trim() && !imagenUrl && !videoUrl) { toast.error('Pon texto, imagen o vídeo'); return; }
    if (ctaUrl.trim() && !/^(\/(?!\/)|https:\/\/)/.test(ctaUrl.trim())) {
      toast.error('El enlace del botón debe empezar por / o https://'); return;
    }
    const opcionesLimpias = opciones.map(o => o.trim()).filter(Boolean);
    if (conEncuesta && (!pregunta.trim() || opcionesLimpias.length < 2)) {
      toast.error('La encuesta necesita pregunta y al menos 2 opciones'); return;
    }
    const destino = etiquetaCategoria(categoria);
    if (editandoId) {
      const bloqueada = votosEdit > 0;
      setPublicando(true);
      const cambios: Fila = {
        titulo: titulo.trim(), cuerpo: cuerpo.trim(), fijado, imagen_url: imagenUrl, video_url: videoUrl,
        cta_texto: ctaTexto.trim() || null, cta_url: ctaUrl.trim() || null, publico, comentarios_on: comentariosOn,
        encuesta_pregunta: conEncuesta ? pregunta.trim() : null,
        // Con votos ya emitidos las opciones no se tocan (se falsearía el resultado).
        ...(bloqueada ? {} : { encuesta_opciones: conEncuesta ? opcionesLimpias : null }),
        ...(diasEncuesta ? { encuesta_cierra_at: new Date(Date.now() + diasEncuesta * 86400000).toISOString() } : {}),
        ...(dias ? { caduca_at: fechaCaduca(dias) } : {}),
      };
      const { error: errEdit } = await db.from('comunicados').update(cambios).eq('id', editandoId);
      setPublicando(false);
      if (errEdit) { toast.error('No se pudo guardar: ' + errEdit.message); return; }
      toast.success('Cambios guardados');
      limpiar(); cargar();
      return;
    }
    if (!window.confirm(`Se publica para "${destino}" y les llega a la campana${push ? ' y por push' : ''}${publico ? '. También sale en la web pública' : ''}. ¿Seguimos?`)) return;
    setPublicando(true);
    const caduca = fechaCaduca(dias);
    const { error } = await db.from('comunicados').insert({
      titulo: titulo.trim(), cuerpo: cuerpo.trim(), categoria, push, fijado, caduca_at: caduca,
      imagen_url: imagenUrl, video_url: videoUrl,
      cta_texto: ctaTexto.trim() || null, cta_url: ctaUrl.trim() || null,
      publico, comentarios_on: comentariosOn,
      encuesta_pregunta: conEncuesta ? pregunta.trim() : null,
      encuesta_opciones: conEncuesta ? opcionesLimpias : null,
      encuesta_cierra_at: conEncuesta && diasEncuesta ? new Date(Date.now() + diasEncuesta * 86400000).toISOString() : null,
    });
    setPublicando(false);
    if (error) { toast.error('No se pudo publicar: ' + error.message); return; }
    toast.success('Comunicado publicado');
    limpiar(); cargar();
  };

  const verLectores = async (c: Comunicado) => {
    if (lectoresAbierto === c.id) { setLectoresAbierto(null); return; }
    setLectoresAbierto(c.id);
    const { data } = await db.from('comunicado_lecturas').select('user_id, leido_at')
      .eq('comunicado_id', c.id).order('leido_at', { ascending: false }).limit(300);
    const filas = (data ?? []) as { user_id: string; leido_at: string }[];
    if (!filas.length) { setLectores(l => ({ ...l, [c.id]: [] })); return; }
    const { data: perfiles } = await supabase.from('profiles').select('user_id, display_name, role')
      .in('user_id', filas.map(f => f.user_id));
    const porUsuario = new Map<string, { display_name: string | null; role: string }>();
    for (const pr of perfiles ?? []) {
      const previo = porUsuario.get(pr.user_id);
      if (!previo || previo.role === 'pending') porUsuario.set(pr.user_id, { display_name: pr.display_name, role: pr.role });
    }
    setLectores(l => ({
      ...l,
      [c.id]: filas.map(f => ({
        nombre: porUsuario.get(f.user_id)?.display_name || 'Sin nombre',
        rol: porUsuario.get(f.user_id)?.role ?? '',
        cuando: f.leido_at,
      })),
    }));
  };

  const alternarPublico = async (c: Comunicado) => {
    await db.from('comunicados').update({ publico: !c.publico }).eq('id', c.id);
    cargar();
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
      <div ref={formRef} className="rounded-2xl p-5 space-y-4" style={{ background: '#FFFDF7', border: '1px solid rgba(212,175,55,0.3)' }}>
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-lg font-extrabold" style={{ color: '#111827' }}>{editandoId ? 'Editar comunicado' : 'Nuevo comunicado'}</h3>
          {editandoId && (
            <button type="button" onClick={limpiar} className="text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-black/5" style={{ color: '#6b7280' }}>
              Cancelar edición
            </button>
          )}
        </div>
        {editandoId && (
          <p className="text-xs rounded-lg px-3 py-2" style={{ background: 'rgba(212,175,55,0.1)', color: '#6b5200' }}>
            Los avisos de la campana y el push ya salieron con el texto anterior; no se vuelven a enviar. Las menciones nuevas tampoco avisan.
          </p>
        )}

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
            <button type="button" onClick={() => setConEncuesta(v => !v)} aria-pressed={conEncuesta}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
              style={conEncuesta
                ? { background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.4)', color: '#8B6A00' }
                : { background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.1)', color: '#374151' }}>
              <BarChart3 size={13} /> Encuesta
            </button>
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

          {conEncuesta && (
            <div className="mt-2 rounded-xl p-3 space-y-2" style={{ background: '#fff', border: '1px solid rgba(212,175,55,0.4)' }}>
              <p className="text-xs font-bold flex items-center gap-1.5" style={{ color: '#8B6A00' }}><BarChart3 size={13} /> Encuesta</p>
              {votosEdit > 0 && (
                <p className="text-xs" style={{ color: '#6b5200' }}>Ya hay {votosEdit} {votosEdit === 1 ? 'voto' : 'votos'}: las opciones no se pueden cambiar, la pregunta y el cierre sí.</p>
              )}
              <input value={pregunta} onChange={e => setPregunta(e.target.value)} maxLength={200} placeholder="Pregunta"
                className="w-full rounded-lg px-3 py-2 text-sm" style={estiloCampo} />
              {opciones.map((o, i) => (
                <div key={i} className="flex gap-2">
                  <input value={o} maxLength={80} placeholder={`Opción ${i + 1}`} disabled={votosEdit > 0}
                    onChange={e => setOpciones(os => os.map((x, j) => (j === i ? e.target.value : x)))}
                    className="flex-1 rounded-lg px-3 py-2 text-sm disabled:opacity-60" style={estiloCampo} />
                  {opciones.length > 2 && votosEdit === 0 && (
                    <button type="button" onClick={() => setOpciones(os => os.filter((_, j) => j !== i))} aria-label="Quitar opción"
                      className="p-2 rounded-lg hover:bg-black/5"><X size={14} /></button>
                  )}
                </div>
              ))}
              <div className="flex items-center justify-between gap-2">
                {opciones.length < 6 && votosEdit === 0 ? (
                  <button type="button" onClick={() => setOpciones(os => [...os, ''])}
                    className="inline-flex items-center gap-1 text-xs font-bold" style={{ color: '#8B6A00' }}>
                    <Plus size={13} /> Otra opción
                  </button>
                ) : <span />}
                <select value={diasEncuesta} onChange={e => setDiasEncuesta(Number(e.target.value))}
                  className="rounded-lg px-2 py-1.5 text-xs" style={estiloCampo}>
                  <option value={0}>{editandoId ? 'Cierre sin cambios' : 'Sin cierre'}</option>
                  {[1, 3, 7, 14].map(d => <option key={d} value={d}>Cierra en {d} {d === 1 ? 'día' : 'días'}</option>)}
                </select>
              </div>
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
            <select value={categoria} onChange={e => setCategoria(e.target.value)} disabled={!!editandoId}
              className="mt-1 w-full rounded-xl px-3 py-2 text-sm font-normal disabled:opacity-60" style={estiloCampo}>
              {CATEGORIAS_COMUNICADO.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </label>
          <label className="text-xs font-bold" style={{ color: '#374151' }}>
            Visible durante
            <select value={dias} onChange={e => setDias(Number(e.target.value))}
              className="mt-1 w-full rounded-xl px-3 py-2 text-sm font-normal" style={estiloCampo}>
              {editandoId && <option value={0}>Sin cambios</option>}
              {DIAS_CADUCA.map(d => <option key={d} value={d}>{editandoId ? `Ampliar: ${d} días desde hoy` : `${d} días`}</option>)}
              <option value={SIEMPRE}>Para siempre</option>
            </select>
          </label>
        </div>

        <div className="flex flex-wrap gap-4 text-sm" style={{ color: '#374151' }}>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={push} disabled={!!editandoId} onChange={e => setPush(e.target.checked)} />
            Avisar por push solo a esta categoría
          </label>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={fijado} onChange={e => setFijado(e.target.checked)} />
            Fijar el primero
          </label>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={comentariosOn} onChange={e => setComentariosOn(e.target.checked)} />
            Permitir comentarios
          </label>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={publico} onChange={e => setPublico(e.target.checked)} />
            <Globe size={14} /> Publicar también en la web (SEO)
          </label>
        </div>
        {publico && (
          <p className="text-xs rounded-lg px-3 py-2" style={{ background: 'rgba(37,99,235,0.06)', color: '#1e3a8a' }}>
            Sale en xpeak.es/novedades con su propia página para Google (se genera en el rebuild diario). Solo el texto, la imagen y las menciones: los comentarios nunca salen en la web. Úsalo para lo que tenga sustancia: ganadores, nuevos servicios, historias.
          </p>
        )}
        <p className="text-xs" style={{ color: '#6b7280' }}>
          La campana les llega a todos los de la categoría. El push solo a quien lo tiene activado. Los mencionados reciben su propio aviso.
        </p>

        {(cuerpo.trim() || titulo.trim() || imagenUrl || videoUrl || conEncuesta) && (
          <div className="rounded-xl p-3 space-y-3" style={{ background: '#fff', border: '1px dashed rgba(212,175,55,0.5)' }}>
            <p className="text-[0.7rem] font-bold uppercase tracking-wide" style={{ color: '#8B6A00' }}>Vista previa</p>

            <div>
              <p className="text-xs mb-1.5" style={{ color: '#6b7280' }}>Así sale en el carrusel</p>
              <div className="w-full max-w-[280px]">
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(212,175,55,0.25)' }}>
                  <Portada c={{ imagen_url: imagenUrl, video_url: videoUrl }} />
                  <span className="absolute top-2 right-2 text-[0.7rem] font-extrabold px-2 py-0.5 rounded-full"
                    style={{ background: '#D4AF37', color: '#1f2937' }}>Nuevo</span>
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-xs" style={{ color: '#6b7280' }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: '#D4AF37' }} />
                  <span className="font-semibold">{etiquetaCategoria(categoria)}</span>
                  <span>·</span><span>ahora mismo</span>
                </div>
                <p className="mt-1 font-bold leading-[1.35] line-clamp-2" style={{ color: '#111827' }}>{titulo || 'Sin título'}</p>
              </div>
            </div>

            <div>
              <p className="text-xs mb-1.5" style={{ color: '#6b7280' }}>Al abrirlo</p>
              <div className="rounded-xl overflow-hidden" style={{ background: '#FFFDF7', border: '1px solid rgba(0,0,0,0.08)' }}>
                {videoUrl
                  ? <video src={videoUrl} controls playsInline poster={imagenUrl ?? undefined} className="w-full max-h-64 bg-black" />
                  : imagenUrl
                    ? <img src={imagenUrl} alt="" className="w-full max-h-64 object-contain bg-[#FBF3DD]" />
                    : null}
                <div className="p-4 space-y-3">
                  <p className="text-lg font-extrabold" style={{ color: '#111827' }}>{titulo || 'Sin título'}</p>
                  {cuerpo.trim() && <CuerpoConMenciones cuerpo={cuerpo} />}
                  {ctaUrl.trim() && (
                    <span className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-extrabold" style={{ background: '#D4AF37', color: '#1f2937' }}>
                      {ctaTexto.trim() || 'Ver más'}
                    </span>
                  )}
                  {conEncuesta && (
                    <div className="rounded-xl p-3 space-y-2" style={{ background: '#fff', border: '1px solid rgba(212,175,55,0.35)' }}>
                      <p className="font-bold text-sm" style={{ color: '#111827' }}>{pregunta || 'Pregunta de la encuesta'}</p>
                      {opciones.map((o, i) => (
                        <div key={i} className="px-3 py-2 rounded-lg text-sm font-semibold" style={{ border: '1px solid rgba(212,175,55,0.45)', color: '#374151' }}>
                          {o.trim() || `Opción ${i + 1}`}
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-xs" style={{ color: '#6b7280' }}>
                    {comentariosOn ? 'Con me gusta y comentarios.' : 'Sin comentarios (solo me gusta).'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <button onClick={publicar} disabled={publicando || !!subiendo}
          className="w-full py-3 rounded-xl text-sm font-extrabold disabled:opacity-50"
          style={{ background: '#D4AF37', color: '#1f2937' }}>
          {publicando ? (editandoId ? 'Guardando...' : 'Publicando...') : (editandoId ? 'Guardar cambios' : 'Publicar')}
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
                  {etiquetaCategoria(c.categoria)} · {timeAgo(c.created_at)}{c.push ? ' · push' : ''}{c.encuesta_opciones?.length ? ' · encuesta' : ''}{esParaSiempre(c.caduca_at) ? ' · para siempre' : ''}{caducado ? ' · caducado' : ''}
                </p>
                {c.publico && (
                  <a href={`/novedades/${slugNovedad(c.titulo, c.id)}`} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: '#2563EB' }}>
                    <Globe size={11} /> En la web
                  </a>
                )}
                <button type="button" onClick={() => verLectores(c)} aria-expanded={lectoresAbierto === c.id}
                  className="mt-1.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold"
                  style={{ background: pct >= 20 ? 'rgba(5,150,105,0.1)' : 'rgba(212,175,55,0.14)', color: pct >= 20 ? '#047857' : '#8B6A00' }}>
                  <Eye size={13} /> {leidos} {leidos === 1 ? 'lector' : 'lectores'} de {c.destinatarios} · {pct} %
                  <ChevronDown size={13} style={{ transform: lectoresAbierto === c.id ? 'rotate(180deg)' : undefined }} />
                </button>
                {lectoresAbierto === c.id && (
                  <div className="mt-1.5 rounded-lg p-2 max-h-48 overflow-y-auto" style={{ background: '#FFFDF7', border: '1px solid rgba(0,0,0,0.08)' }}>
                    {!lectores[c.id] && <p className="text-xs" style={{ color: '#6b7280' }}>Cargando...</p>}
                    {lectores[c.id]?.length === 0 && <p className="text-xs" style={{ color: '#6b7280' }}>Todavía no lo ha abierto nadie.</p>}
                    {lectores[c.id]?.map((l, i) => (
                      <div key={i} className="flex items-center justify-between gap-2 py-0.5 text-xs" style={{ color: '#374151' }}>
                        <span className="truncate font-semibold">{l.nombre}<span className="font-normal" style={{ color: '#9ca3af' }}> · {l.rol}</span></span>
                        <span className="shrink-0" style={{ color: '#6b7280' }}>{timeAgo(l.cuando)}</span>
                      </div>
                    ))}
                  </div>
                )}
                {inter[c.id] && (
                  <p className="text-xs" style={{ color: '#4b5563' }}>
                    {inter[c.id].likes} me gusta · {inter[c.id].comentarios} comentarios
                  </p>
                )}
                {c.encuesta_opciones && inter[c.id]?.votos && (
                  <div className="mt-1 space-y-0.5">
                    {c.encuesta_opciones.map((o, i) => (
                      <p key={i} className="text-xs" style={{ color: '#374151' }}>
                        {o}: <b>{inter[c.id].votos![i] ?? 0}</b> ({porcentajes(inter[c.id].votos!)[i]} %)
                      </p>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <button onClick={() => editar(c)} aria-label="Editar" title="Editar"
                  className="p-1.5 rounded-lg hover:bg-black/5" style={{ color: editandoId === c.id ? '#8B6A00' : '#6b7280' }}>
                  <Pencil size={15} />
                </button>
                <button onClick={() => alternarFijado(c)} aria-label={c.fijado ? 'Desfijar' : 'Fijar'}
                  className="p-1.5 rounded-lg hover:bg-black/5" style={{ color: c.fijado ? '#8B6A00' : '#9ca3af' }}>
                  {c.fijado ? <Pin size={15} /> : <PinOff size={15} />}
                </button>
                <button onClick={() => alternarPublico(c)} aria-label={c.publico ? 'Quitar de la web' : 'Publicar en la web'}
                  title={c.publico ? 'Quitar de la web' : 'Publicar en la web'}
                  className="p-1.5 rounded-lg hover:bg-black/5" style={{ color: c.publico ? '#2563EB' : '#9ca3af' }}>
                  <Globe size={15} />
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
