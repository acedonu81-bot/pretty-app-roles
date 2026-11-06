import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Send, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { sanitizeInput } from '@/lib/contentFilter';
import { timeAgo } from '@/lib/timeAgo';
import { type Comunicado, type Interaccion, porcentajes } from '@/lib/comunicados';

// Me gusta, encuesta y comentarios de un comunicado (6 nov 2026). Los
// comentarios llegan por RPC: en los anónimos de organizador no viaja ni el
// nombre ni el id. El organizador elige en cada comentario si firma o no.

interface Comentario {
  id: string; texto: string; created_at: string; anonimo: boolean; es_mio: boolean;
  autor_id: string | null; autor_nombre: string | null; autor_foto: string | null; autor_rol: string | null;
}

type Res = Promise<{ data: unknown; error: { message: string; code?: string } | null }>;
const db = supabase as unknown as {
  rpc: (fn: string, args: Record<string, unknown>) => Res;
  from: (t: string) => {
    insert: (r: Record<string, unknown>) => Res;
    delete: () => { eq: (k: string, v: string) => { eq: (k: string, v: string) => Res } & Res };
  };
};

const ORO = '#D4AF37';

interface Props {
  c: Comunicado;
  inter: Interaccion | undefined;
  onCambio: (i: Interaccion) => void;
}

export default function ComunicadoInteraccion({ c, inter, onCambio }: Props) {
  const { user } = useAuth();
  const { role, allProfiles } = useProfile();
  const { isAdmin } = useIsAdmin();
  const esOrganizador = role === 'empresario' || (allProfiles ?? []).some(p => p.role === 'empresario');

  const base: Interaccion = inter ?? { comunicado_id: c.id, likes: 0, comentarios: 0, yo_like: false, mi_voto: null, votos: null };
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [texto, setTexto] = useState('');
  const [anonimo, setAnonimo] = useState(true);
  const [enviando, setEnviando] = useState(false);

  const cargarComentarios = useCallback(async () => {
    const { data } = await db.rpc('comunicado_comentarios_de', { p_id: c.id });
    setComentarios((data ?? []) as Comentario[]);
  }, [c.id]);
  useEffect(() => { if (c.comentarios_on !== false) cargarComentarios(); }, [c.comentarios_on, cargarComentarios]);

  const meGusta = async () => {
    if (!user?.id) return;
    const yo = !base.yo_like;
    onCambio({ ...base, yo_like: yo, likes: base.likes + (yo ? 1 : -1) });
    const { error } = yo
      ? await db.from('comunicado_likes').insert({ comunicado_id: c.id, user_id: user.id })
      : await db.from('comunicado_likes').delete().eq('comunicado_id', c.id).eq('user_id', user.id);
    if (error && error.code !== '23505') onCambio(base);
  };

  const votar = async (i: number) => {
    if (!user?.id || base.mi_voto !== null) return;
    const votos = [...(base.votos ?? (c.encuesta_opciones ?? []).map(() => 0))];
    votos[i] = (votos[i] ?? 0) + 1;
    onCambio({ ...base, mi_voto: i, votos });
    const { error } = await db.from('comunicado_votos').insert({ comunicado_id: c.id, user_id: user.id, opcion: i });
    if (error && error.code !== '23505') { onCambio(base); toast.error('No se pudo votar'); }
  };

  const comentar = async () => {
    const t = texto.trim();
    if (!t || !user?.id) return;
    const filtro = sanitizeInput(t);
    if (!filtro.clean) { toast.error(filtro.reason ?? 'Texto no permitido'); return; }
    setEnviando(true);
    const { error } = await db.from('comunicado_comentarios').insert({
      comunicado_id: c.id, user_id: user.id, texto: t, anonimo: esOrganizador && anonimo,
    });
    setEnviando(false);
    if (error) {
      toast.error(error.message.includes('comentario_sin_contacto')
        ? 'No compartas datos de contacto aquí. Usa los mensajes de XPEAK.'
        : 'No se pudo publicar el comentario');
      return;
    }
    setTexto('');
    onCambio({ ...base, comentarios: base.comentarios + 1 });
    cargarComentarios();
  };

  const borrar = async (id: string) => {
    const { error } = await db.from('comunicado_comentarios').delete().eq('id', id);
    if (error) return;
    setComentarios(cs => cs.filter(x => x.id !== id));
    onCambio({ ...base, comentarios: Math.max(0, base.comentarios - 1) });
  };

  const opciones = c.encuesta_opciones ?? [];
  const cerrada = !!c.encuesta_cierra_at && new Date(c.encuesta_cierra_at).getTime() < Date.now();
  const verResultados = base.mi_voto !== null || cerrada;
  const pct = porcentajes(base.votos ?? opciones.map(() => 0));
  const totalVotos = (base.votos ?? []).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-4">
      {opciones.length >= 2 && (
        <div className="rounded-xl p-3 space-y-2" style={{ background: '#fff', border: '1px solid rgba(212,175,55,0.35)' }}>
          {c.encuesta_pregunta && <p className="font-bold text-sm" style={{ color: '#111827' }}>{c.encuesta_pregunta}</p>}
          {opciones.map((o, i) => verResultados ? (
            <div key={i} className="relative rounded-lg overflow-hidden text-sm" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
              <div className="absolute inset-y-0 left-0" style={{ width: `${pct[i]}%`, background: i === base.mi_voto ? 'rgba(212,175,55,0.35)' : 'rgba(212,175,55,0.15)' }} />
              <div className="relative flex justify-between px-3 py-2">
                <span className={i === base.mi_voto ? 'font-bold' : ''}>{o}</span>
                <span className="font-semibold">{pct[i]} %</span>
              </div>
            </div>
          ) : (
            <button key={i} onClick={() => votar(i)}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-colors hover:bg-[#FBF3DD]"
              style={{ border: '1px solid rgba(212,175,55,0.45)', color: '#374151' }}>{o}</button>
          ))}
          <p className="text-xs" style={{ color: '#6b7280' }}>
            {totalVotos} {totalVotos === 1 ? 'voto' : 'votos'}{cerrada ? ' · encuesta cerrada' : ''}
          </p>
        </div>
      )}

      <div className="flex items-center gap-4 text-sm" style={{ color: '#4b5563' }}>
        <button onClick={meGusta} className="inline-flex items-center gap-1.5 font-semibold" aria-pressed={base.yo_like}>
          <Heart size={18} fill={base.yo_like ? '#dc2626' : 'none'} style={{ color: base.yo_like ? '#dc2626' : '#6b7280' }} />
          {base.likes > 0 ? base.likes : ''} Me gusta
        </button>
        {c.comentarios_on !== false && (
          <span className="inline-flex items-center gap-1.5">
            <MessageCircle size={18} /> {base.comentarios} {base.comentarios === 1 ? 'comentario' : 'comentarios'}
          </span>
        )}
      </div>

      {c.comentarios_on !== false && (
        <div className="space-y-3">
          {comentarios.map(k => (
            <div key={k.id} className="flex gap-2.5">
              {k.autor_foto
                ? <img src={k.autor_foto} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
                : <span className="w-8 h-8 rounded-full shrink-0" style={{ background: '#FBF3DD' }} />}
              <div className="min-w-0 flex-1 rounded-xl px-3 py-2" style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)' }}>
                <div className="flex items-center gap-2 text-xs" style={{ color: '#6b7280' }}>
                  {k.autor_id && k.autor_nombre
                    ? <Link to={`/p/${k.autor_id}`} className="font-bold" style={{ color: '#111827' }}>{k.autor_nombre}</Link>
                    : <span className="font-bold" style={{ color: '#111827' }}>{k.anonimo ? 'Un organizador' : 'Usuario de XPEAK'}</span>}
                  {k.anonimo && k.autor_nombre && <span>(anónimo para el resto)</span>}
                  <span>{timeAgo(k.created_at)}</span>
                  {(k.es_mio || isAdmin) && (
                    <button onClick={() => borrar(k.id)} aria-label="Borrar comentario" className="ml-auto p-0.5" style={{ color: '#9ca3af' }}>
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
                <p className="text-sm whitespace-pre-line break-words" style={{ color: '#374151' }}>{k.texto}</p>
              </div>
            </div>
          ))}

          <div className="space-y-2">
            <div className="flex gap-2">
              <textarea value={texto} onChange={e => setTexto(e.target.value)} maxLength={500} rows={2}
                placeholder="Escribe un comentario"
                className="flex-1 rounded-xl px-3 py-2 text-sm resize-none"
                style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.12)' }} />
              <button onClick={comentar} disabled={enviando || !texto.trim()} aria-label="Publicar comentario"
                className="self-end p-2.5 rounded-xl disabled:opacity-40" style={{ background: ORO, color: '#1f2937' }}>
                <Send size={16} />
              </button>
            </div>
            <div className="flex flex-wrap gap-1" aria-label="Añadir emoji">
              {['👏', '🔥', '🎧', '❤️', '😂', '🙌', '👍', '🤔'].map(e => (
                <button key={e} type="button" onClick={() => setTexto(t => (t + e).slice(0, 500))}
                  className="w-8 h-8 rounded-lg text-lg leading-none hover:bg-[#FBF3DD]" aria-label={`Añadir ${e}`}>{e}</button>
              ))}
            </div>
            {esOrganizador && (
              <div className="flex gap-3 text-xs" style={{ color: '#4b5563' }}>
                <label className="inline-flex items-center gap-1.5 cursor-pointer">
                  <input type="radio" checked={anonimo} onChange={() => setAnonimo(true)} /> Como "Un organizador"
                </label>
                <label className="inline-flex items-center gap-1.5 cursor-pointer">
                  <input type="radio" checked={!anonimo} onChange={() => setAnonimo(false)} /> Con mi nombre
                </label>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
