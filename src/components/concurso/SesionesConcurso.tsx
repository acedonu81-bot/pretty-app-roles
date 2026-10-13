import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { concursoActivo } from '@/lib/concursoMadrid';
import LikeButton from '@/components/LikeButton';

/**
 * Lista de aspirantes del Concurso DJ XPEAK Madrid: sesiones publicadas con
 * su puesto por me gusta y el botón de votar, y la sesión propia "En
 * revisión" (solo la ve su dueño). Vive en /concurso-dj-madrid/aspirantes:
 * el usuario pidió (13 oct 2026) sacarla de la página de bases, que quedaba
 * enredada.
 */
const CONCURSO = 'dj-madrid-2026';
const GOLD = '#D4AF37';
const GOLD_TEXT = '#7a6216';
const CREAM = '#FBF3DD';
const MUTED = '#4b5563';

type Participante = {
  user_id: string;
  display_name: string | null;
  photo_url: string | null;
  zone: string | null;
  soundcloud_url: string;
  me_gusta: number;
};

// Los tipos generados de Supabase no incluyen la tabla ni la función del concurso.
const sb = supabase as unknown as {
  rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
  from: (t: string) => {
    select: (c: string) => { eq: (k: string, v: string) => { eq: (k: string, v: string) => { maybeSingle: () => Promise<{ data: unknown }> } } };
  };
};

function playerUrl(url: string) {
  return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23d4af37&auto_play=false&hide_related=true&show_comments=false&show_reposts=false&visual=false`;
}

const AZUL = '#2563EB';
const VERDE = '#059669';

type Propia = { estado: 'pendiente' | 'rechazada'; soundcloud_url: string; display_name: string | null; photo_url: string | null; zone: string | null };

// Lista de sesiones subidas (13 oct 2026, petición del usuario): al enviar el
// enlace la página baja aquí y el DJ ve su propia sesión aunque esté en
// revisión (antes solo salían las aceptadas y parecía que no se había subido
// nada). Colores de la web: crema y dorado, verde publicada, azul en revisión.
export default function SesionesConcurso({ volverA }: { volverA: string }) {
  const { user } = useAuth();
  const [lista, setLista] = useState<Participante[] | null>(null);
  const [propia, setPropia] = useState<Propia | null>(null);

  const cargar = useCallback(() => {
    sb.rpc('concurso_participantes', { p_concurso: CONCURSO })
      .then(({ data, error }) => setLista(error ? [] : ((data as Participante[]) ?? [])));
    if (!user) { setPropia(null); return; }
    Promise.all([
      sb.from('concurso_inscripciones').select('estado, soundcloud_url').eq('concurso', CONCURSO).eq('user_id', user.id).maybeSingle(),
      supabase.from('profiles').select('display_name, photo_url, zone').eq('user_id', user.id).order('is_primary', { ascending: false }).limit(1).maybeSingle(),
    ]).then(([ins, pr]) => {
      const i = ins.data as { estado: string; soundcloud_url: string } | null;
      setPropia(i && i.estado !== 'aceptada'
        ? { estado: i.estado as Propia['estado'], soundcloud_url: i.soundcloud_url, display_name: pr.data?.display_name ?? null, photo_url: pr.data?.photo_url ?? null, zone: pr.data?.zone ?? null }
        : null);
    });
  }, [user]);

  useEffect(() => {
    cargar();
    window.addEventListener('concurso:inscrito', cargar);
    // Recuentos al día para que el orden vaya cambiando con los votos.
    const cada = window.setInterval(() => { if (document.visibilityState === 'visible') cargar(); }, 60_000);
    return () => { window.removeEventListener('concurso:inscrito', cargar); window.clearInterval(cada); };
  }, [cargar]);

  if (lista === null) return <p style={{ color: MUTED }}>Cargando sesiones…</p>;

  const activo = concursoActivo();
  // Puesto por me gusta, de más a menos (empate: quien se inscribió antes).
  // Las tarjetas NO se reordenan en el DOM: mover un iframe lo recarga y
  // cortaría la sesión que alguien esté escuchando. Se colocan con CSS order.
  const puesto = new Map(
    [...lista].sort((a, b) => Number(b.me_gusta) - Number(a.me_gusta)).map((p, i) => [p.user_id, i]),
  );

  return (
    <div className="rounded-3xl p-4 sm:p-6" style={{ background: CREAM, border: `1px solid ${GOLD}66` }}>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <p className="font-bold" style={{ color: GOLD_TEXT }}>
          {lista.length === 1 ? '1 sesión publicada' : `${lista.length} sesiones publicadas`}
        </p>
        <div className="flex items-center gap-2 flex-wrap text-xs font-bold">
          <span className="px-2.5 py-1 rounded-full" style={{ background: `${GOLD}26`, color: GOLD_TEXT }}>Top 3: a la final</span>
          <span className="px-2.5 py-1 rounded-full" style={{ background: `${VERDE}1f`, color: VERDE }}>Publicada</span>
          <span className="px-2.5 py-1 rounded-full" style={{ background: `${AZUL}1a`, color: AZUL }}>En revisión</span>
        </div>
      </div>

      {propia && (
        <div className="rounded-2xl p-4 mb-5 bg-white" style={{ border: `2px dashed ${propia.estado === 'pendiente' ? AZUL : '#b91c1c'}` }}>
          <div className="flex items-center gap-3 mb-3">
            {propia.photo_url
              ? <img src={propia.photo_url} alt="" className="w-12 h-12 rounded-full object-cover" />
              : <div className="w-12 h-12 rounded-full" style={{ background: CREAM }} />}
            <div className="flex-1 min-w-0">
              <p className="font-bold leading-tight">{propia.display_name ?? 'Tu sesión'}</p>
              {propia.zone && <p className="text-sm" style={{ color: MUTED }}>{propia.zone}</p>}
            </div>
            <span className="text-xs font-black px-2.5 py-1 rounded-full text-white" style={{ background: propia.estado === 'pendiente' ? AZUL : '#b91c1c' }}>
              {propia.estado === 'pendiente' ? 'En revisión' : 'No admitida'}
            </span>
          </div>
          <iframe title="Tu sesión" src={playerUrl(propia.soundcloud_url)} className="w-full rounded-lg" height={120} loading="lazy" allow="autoplay" />
          <p className="text-sm mt-3" style={{ color: MUTED }}>
            {propia.estado === 'pendiente'
              ? 'Solo la ves tú. En cuanto la revisemos sale aquí para todos y te avisamos por email para que la compartas.'
              : 'No cumple las bases. Escríbenos a info@xpeak.site y te contamos qué falta.'}
          </p>
        </div>
      )}

      {lista.length === 0 ? (
        <p style={{ color: MUTED }}>
          Todavía no hay sesiones publicadas. Cada inscripción se revisa a mano y aparece aquí en cuanto está aceptada.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {lista.map((p) => {
            const idx = puesto.get(p.user_id) ?? 0;
            const enFinal = idx < 3 && Number(p.me_gusta) > 0;
            return (
              <div key={p.user_id} className="rounded-2xl p-4 bg-white"
                style={{ order: idx, border: enFinal ? `2px solid ${GOLD}` : `1px solid ${GOLD}40`, boxShadow: enFinal ? `0 8px 22px ${GOLD}33` : undefined }}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-sm font-black"
                    style={enFinal ? { background: `linear-gradient(135deg,${GOLD},#B8941E)`, color: '#111' } : { background: CREAM, color: GOLD_TEXT }}>
                    {idx + 1}
                  </span>
                  <a href={`/p/${p.user_id}`} className="flex items-center gap-3 flex-1 min-w-0">
                    {p.photo_url
                      ? <img src={p.photo_url} alt="" className="w-11 h-11 rounded-full object-cover" loading="lazy" />
                      : <div className="w-11 h-11 rounded-full" style={{ background: CREAM }} />}
                    <div className="min-w-0">
                      <p className="font-bold leading-tight truncate">{p.display_name ?? 'DJ'}</p>
                      {p.zone && <p className="text-sm" style={{ color: MUTED }}>{p.zone}</p>}
                    </div>
                  </a>
                  <span className="text-[0.7rem] font-black px-2 py-1 rounded-full shrink-0"
                    style={enFinal ? { background: `${GOLD}26`, color: GOLD_TEXT } : { background: `${VERDE}1f`, color: VERDE }}>
                    {enFinal ? 'Ahora en la final' : 'Publicada'}
                  </span>
                </div>
                <iframe
                  title={`Sesión de ${p.display_name ?? 'DJ'}`}
                  src={playerUrl(p.soundcloud_url)}
                  className="w-full rounded-lg"
                  height={120}
                  loading="lazy"
                  allow="autoplay"
                />
                <div className="flex items-center justify-between mt-3 text-sm">
                  {/* Votar solo dentro de plazo y nunca a uno mismo: antes el DJ
                      podía darse me gusta y su contador lo sumaba aunque el ranking
                      no lo cuenta, y se podía seguir votando tras el cierre. */}
                  {user && p.user_id === user.id ? (
                    <>
                      <span className="font-bold tabular-nums" style={{ color: '#E11D48' }}>{Number(p.me_gusta)} me gusta</span>
                      <span className="font-semibold" style={{ color: AZUL }}>Tu sesión</span>
                    </>
                  ) : !activo ? (
                    <>
                      <span className="font-bold tabular-nums" style={{ color: '#E11D48' }}>{Number(p.me_gusta)} me gusta</span>
                      <span style={{ color: MUTED }}>Votación cerrada</span>
                    </>
                  ) : user ? (
                    <LikeButton viewerId={user.id} contentKey={`concurso-${CONCURSO}:${p.user_id}`} onChange={cargar} />
                  ) : (
                    <>
                      <span className="font-bold tabular-nums" style={{ color: '#E11D48' }}>{Number(p.me_gusta)} me gusta</span>
                      <a href={`/auth?mode=login&redirect=${encodeURIComponent(volverA)}`} className="font-semibold underline" style={{ color: AZUL }}>Entra para votar</a>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
