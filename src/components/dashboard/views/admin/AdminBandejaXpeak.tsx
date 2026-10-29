import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, Send, PenSquare, Search } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Chats de la cuenta oficial XPEAK (29 oct 2026). Lo que se escribe aquí sale
// con remitente XPEAK, nunca con el nombre del admin: el envío lo hace
// admin_xpeak_enviar() en el servidor. Solo se ven conversaciones donde XPEAK
// participa; los chats entre usuarios siguen siendo privados.

export interface Conversacion {
  conversation_id: string;
  otro_id: string;
  nombre: string;
  rol: string | null;
  foto: string | null;
  ultimo_texto: string | null;
  ultimo_de_xpeak: boolean | null;
  ultimo_at: string;
  sin_leer: number | string;
}

interface Mensaje {
  id: string;
  de_xpeak: boolean;
  content: string | null;
  photo_url: string | null;
  video_url: string | null;
  created_at: string;
  leido: boolean;
}

interface Destino { user_id: string; display_name: string | null; role: string | null }

// Los acuerdos del chat van con marcado interno ([[acuerdo:...]]); aquí basta con saber qué pasó.
export const textoVisible = (t: string | null) => {
  if (!t) return '';
  if (t.startsWith('[[acuerdo:propuesto|')) return 'Propuesta de contrato';
  if (t.startsWith('[[acuerdo:cancelado|')) return 'Acuerdo cancelado';
  if (t.startsWith('[[acuerdo:aceptado|')) return 'Acuerdo aceptado';
  return t;
};

const hora = (iso: string) => {
  const d = new Date(iso);
  const hoy = new Date().toDateString() === d.toDateString();
  return hoy
    ? d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    : d.toLocaleString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
};

const rpc = supabase.rpc as any;

export default function AdminBandejaXpeak({ onSinLeer }: { onSinLeer?: (n: number) => void }) {
  const [convs, setConvs] = useState<Conversacion[] | null>(null);
  const [error, setError] = useState(false);
  const [activa, setActiva] = useState<Conversacion | null>(null);
  const [nuevo, setNuevo] = useState<Destino | null>(null);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [texto, setTexto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const [q, setQ] = useState('');
  const [resultados, setResultados] = useState<Destino[]>([]);
  const finRef = useRef<HTMLDivElement>(null);

  const cargarConvs = useCallback(async () => {
    const { data, error: e } = await rpc('admin_xpeak_conversaciones');
    if (e) { setError(true); setConvs([]); return; }
    const filas = (data as Conversacion[]) ?? [];
    setConvs(filas);
    onSinLeer?.(filas.reduce((s, c) => s + Number(c.sin_leer), 0));
  }, [onSinLeer]);

  const cargarHilo = useCallback(async (id: string) => {
    const { data } = await rpc('admin_xpeak_mensajes', { p_conversation: id });
    setMensajes((data as Mensaje[]) ?? []);
  }, []);

  useEffect(() => {
    cargarConvs();
    const t = setInterval(cargarConvs, 60_000);
    return () => clearInterval(t);
  }, [cargarConvs]);

  useEffect(() => {
    if (!activa) return;
    cargarHilo(activa.conversation_id).then(cargarConvs);
    const t = setInterval(() => cargarHilo(activa.conversation_id), 20_000);
    return () => clearInterval(t);
  }, [activa, cargarHilo, cargarConvs]);

  useEffect(() => { finRef.current?.scrollIntoView({ block: 'end' }); }, [mensajes]);

  useEffect(() => {
    if (!buscando || q.trim().length < 2) { setResultados([]); return; }
    const t = setTimeout(async () => {
      const { data } = await (supabase.from('profiles') as any)
        .select('user_id, display_name, role')
        .ilike('display_name', `%${q.trim()}%`)
        .neq('user_id', 'b8c47c26-33bd-41d7-a869-ba6fa2d22667')
        .limit(8);
      setResultados((data as Destino[]) ?? []);
    }, 250);
    return () => clearTimeout(t);
  }, [q, buscando]);

  const destinatario = activa?.otro_id ?? nuevo?.user_id ?? null;
  const nombreDestino = activa?.nombre ?? nuevo?.display_name ?? '';

  const enviar = async () => {
    const limpio = texto.trim();
    if (!limpio || !destinatario || enviando) return;
    setEnviando(true);
    const { data, error: e } = await rpc('admin_xpeak_enviar', { p_destinatario: destinatario, p_texto: limpio });
    setEnviando(false);
    if (e) { toast.error('No se ha podido enviar'); return; }
    setTexto('');
    await cargarConvs();
    if (activa) { await cargarHilo(activa.conversation_id); return; }
    // Conversación nueva: abrirla ya con su id.
    setNuevo(null);
    setActiva({ conversation_id: data as string, otro_id: destinatario, nombre: nombreDestino, rol: nuevo?.role ?? null,
      foto: null, ultimo_texto: limpio, ultimo_de_xpeak: true, ultimo_at: new Date().toISOString(), sin_leer: 0 });
  };

  const cerrar = () => { setActiva(null); setNuevo(null); setMensajes([]); setTexto(''); };

  if (convs === null) return <p className="text-sm text-muted-foreground">Cargando…</p>;
  if (error) {
    return (
      <p className="text-sm rounded-xl p-4" style={{ background: 'rgba(217,119,6,0.08)', color: '#92400e' }}>
        La bandeja aún no está activa en la base de datos (falta aplicar la migración admin_bandeja_xpeak).
      </p>
    );
  }

  const enHilo = !!(activa || nuevo);

  return (
    <div className="rounded-2xl bg-white border overflow-hidden grid md:grid-cols-[300px_1fr]" style={{ borderColor: 'rgba(0,0,0,0.08)', minHeight: 480 }}>
      {/* Lista */}
      <div className={`${enHilo ? 'hidden md:flex' : 'flex'} flex-col border-r`} style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
          <p className="text-sm font-extrabold" style={{ color: '#1f2937' }}>Chats de XPEAK</p>
          <button onClick={() => { setBuscando(b => !b); setQ(''); }} className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg"
            style={{ color: '#8A6D0F', background: 'rgba(212,175,55,0.1)' }}>
            <PenSquare size={13} /> Nuevo
          </button>
        </div>
        {buscando && (
          <div className="px-3 py-2 border-b" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
            <label className="flex items-center gap-2 rounded-lg px-2 py-1.5 border" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
              <Search size={13} style={{ color: '#6b7280' }} />
              <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar usuario por nombre"
                className="flex-1 text-sm outline-none bg-transparent" />
            </label>
            {resultados.map(r => (
              <button key={r.user_id} className="w-full text-left text-sm px-2 py-1.5 rounded-lg hover:bg-black/5"
                onClick={() => {
                  setBuscando(false); setQ('');
                  const ya = convs.find(c => c.otro_id === r.user_id);
                  if (ya) { setNuevo(null); setActiva(ya); } else { setActiva(null); setMensajes([]); setNuevo(r); }
                }}>
                <b>{r.display_name || 'Sin nombre'}</b> <span style={{ color: '#6b7280' }}>· {r.role ?? 'sin rol'}</span>
              </button>
            ))}
          </div>
        )}
        <ul className="flex-1 overflow-y-auto" style={{ maxHeight: 560 }}>
          {convs.length === 0 && <li className="px-4 py-6 text-sm" style={{ color: '#6b7280' }}>Todavía no hay conversaciones.</li>}
          {convs.map(c => {
            const n = Number(c.sin_leer);
            const sel = activa?.conversation_id === c.conversation_id;
            return (
              <li key={c.conversation_id}>
                <button onClick={() => { setNuevo(null); setActiva(c); }}
                  className="w-full text-left px-4 py-3 border-b flex gap-3 items-start"
                  style={{ borderColor: 'rgba(0,0,0,0.05)', background: sel ? 'rgba(212,175,55,0.08)' : undefined }}>
                  <span className="flex-1 min-w-0">
                    <span className="flex items-center justify-between gap-2">
                      <b className="text-sm truncate" style={{ color: '#111' }}>{c.nombre}</b>
                      <span className="text-[0.7rem] tabular-nums flex-shrink-0" style={{ color: '#6b7280' }}>{hora(c.ultimo_at)}</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="text-xs truncate flex-1" style={{ color: n ? '#111' : '#6b7280', fontWeight: n ? 700 : 400 }}>
                        {c.ultimo_de_xpeak ? 'Tú: ' : ''}{textoVisible(c.ultimo_texto) || 'Foto o vídeo'}
                      </span>
                      {n > 0 && (
                        <span className="rounded-full text-[0.7rem] font-black px-1.5" style={{ background: '#dc2626', color: '#fff' }}>{n}</span>
                      )}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Hilo */}
      <div className={`${enHilo ? 'flex' : 'hidden md:flex'} flex-col`}>
        {!enHilo ? (
          <p className="m-auto text-sm px-6 text-center" style={{ color: '#6b7280' }}>
            Elige una conversación o pulsa "Nuevo". Lo que escribas aquí le llega como XPEAK.
          </p>
        ) : (
          <>
            <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
              <button onClick={cerrar} className="md:hidden p-1 -ml-1" aria-label="Volver"><ArrowLeft size={16} /></button>
              <b className="text-sm" style={{ color: '#111' }}>{nombreDestino || 'Sin nombre'}</b>
              <span className="text-xs" style={{ color: '#6b7280' }}>{activa?.rol ?? nuevo?.role ?? ''}</span>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2" style={{ maxHeight: 480, background: '#FFFDF7' }}>
              {nuevo && <p className="text-xs text-center" style={{ color: '#6b7280' }}>Conversación nueva. El primer mensaje la abre.</p>}
              {mensajes.map(m => (
                <div key={m.id} className={`flex ${m.de_xpeak ? 'justify-end' : 'justify-start'}`}>
                  <div className="max-w-[80%] rounded-2xl px-3 py-2 text-sm"
                    style={m.de_xpeak
                      ? { background: 'rgba(212,175,55,0.16)', color: '#1f2937' }
                      : { background: '#fff', border: '1px solid rgba(0,0,0,0.08)', color: '#111' }}>
                    {m.content && <p className="whitespace-pre-wrap break-words">{textoVisible(m.content)}</p>}
                    {m.photo_url && <a href={m.photo_url} target="_blank" rel="noreferrer" className="text-xs underline">Ver foto</a>}
                    {m.video_url && <a href={m.video_url} target="_blank" rel="noreferrer" className="text-xs underline ml-2">Ver vídeo</a>}
                    <p className="text-[0.7rem] mt-1 text-right" style={{ color: '#6b7280' }}>
                      {hora(m.created_at)}{m.de_xpeak ? (m.leido ? ' · leído' : ' · enviado') : ''}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={finRef} />
            </div>
            <div className="flex items-end gap-2 px-3 py-3 border-t" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
              <textarea value={texto} onChange={e => setTexto(e.target.value)} rows={2} maxLength={4000}
                placeholder="Escribe como XPEAK…"
                onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) enviar(); }}
                className="flex-1 resize-none rounded-xl border px-3 py-2 text-sm outline-none"
                style={{ borderColor: 'rgba(0,0,0,0.12)' }} />
              <button onClick={enviar} disabled={!texto.trim() || enviando}
                className="flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-bold disabled:opacity-40"
                style={{ background: '#D4AF37', color: '#1f2937' }}>
                <Send size={14} /> Enviar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
