import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { concursoActivo } from '@/lib/concursoMadrid';
import LikeButton from '@/components/LikeButton';
import { Play } from 'lucide-react';
import { HZ, TONES, clay, clayButton, clayInset } from '@/components/healthy-zone/clay';

/**
 * Lista de aspirantes del Concurso DJ XPEAK Madrid: sesiones publicadas con
 * su puesto por me gusta y el botón de votar, y la sesión propia "En
 * revisión" (solo la ve su dueño). Vive en /concurso-dj-madrid/aspirantes:
 * el usuario pidió (13 oct 2026) sacarla de la página de bases, que quedaba
 * enredada.
 */
const CONCURSO = 'dj-madrid-2026';
const GOLD = '#D4AF37';

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
  return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23d4af37&auto_play=true&hide_related=true&show_comments=false&show_reposts=false&visual=false`;
}

// Reproductor bajo demanda (auditoría 13 oct 2026): el iframe de SoundCloud
// mete cookies de terceros (rastreo y su propio aviso de consentimiento) nada
// más abrir la página, sin que nadie haya aceptado nada. Se carga solo al
// pulsar "Escuchar" y entonces arranca solo (hay gesto del usuario).
function Reproductor({ url, titulo }: { url: string; titulo: string }) {
  const [abierto, setAbierto] = useState(false);
  if (abierto) {
    return <iframe title={titulo} src={playerUrl(url)} className="w-full rounded-xl block" height={120} allow="autoplay" />;
  }
  return (
    <button type="button" onClick={() => setAbierto(true)} aria-label={`Escuchar: ${titulo}`}
      className="w-full h-[120px] rounded-xl flex items-center gap-4 px-4 text-left transition-transform active:scale-[0.99]"
      style={{ background: '#ffffff' }}>
      <span className="w-14 h-14 shrink-0 rounded-full flex items-center justify-center"
        style={{ background: `linear-gradient(135deg,${GOLD},#B8941E)`, boxShadow: clayButton('184,148,30') }}>
        <Play size={24} fill="#2a1d00" color="#2a1d00" />
      </span>
      <span className="min-w-0">
        <span className="block text-base" style={{ color: HZ.ink, fontFamily: HZ.display, fontWeight: 800 }}>Escuchar la sesión</span>
        <span className="block text-xs mt-0.5" style={{ color: HZ.inkSoft, fontFamily: HZ.body, fontWeight: 600 }}>Se abre el reproductor de SoundCloud</span>
      </span>
    </button>
  );
}

const AZUL = '#2563EB';

type Propia = { estado: 'pendiente' | 'rechazada'; soundcloud_url: string; display_name: string | null; photo_url: string | null; zone: string | null };

// Lista de sesiones subidas (13 oct 2026, petición del usuario): el DJ ve su
// propia sesión aunque esté en revisión (antes solo salían las aceptadas y
// parecía que no se había subido nada). Estilo clay del feed (healthy-zone/
// clay): finalistas en dorado, el resto alterna cielo, verde y lila.
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

  if (lista === null) return <p style={{ color: HZ.inkSoft, fontFamily: HZ.body }}>Cargando sesiones…</p>;

  const activo = concursoActivo();
  // Puesto por me gusta, de más a menos (empate: quien se inscribió antes).
  // Las tarjetas NO se reordenan en el DOM: mover un iframe lo recarga y
  // cortaría la sesión que alguien esté escuchando. Se colocan con CSS order.
  const puesto = new Map(
    [...lista].sort((a, b) => Number(b.me_gusta) - Number(a.me_gusta)).map((p, i) => [p.user_id, i]),
  );

  const pastilla = (bg: string, color: string, rgb: string) => ({
    background: bg, color, fontFamily: HZ.body, fontWeight: 800, boxShadow: clay(rgb, 'sm'),
  });

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <p className="text-lg" style={{ color: HZ.ink, fontFamily: HZ.display, fontWeight: 800 }}>
          {lista.length === 1 ? '1 sesión publicada' : `${lista.length} sesiones publicadas`}
        </p>
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="px-3 py-1.5 rounded-full" style={pastilla(TONES.sun.card, TONES.sun.stroke, TONES.sun.rgb)}>Top 3: a la final</span>
          <span className="px-3 py-1.5 rounded-full" style={pastilla(TONES.leaf.card, TONES.leaf.stroke, TONES.leaf.rgb)}>Publicada</span>
          <span className="px-3 py-1.5 rounded-full" style={pastilla(TONES.sky.card, TONES.sky.stroke, TONES.sky.rgb)}>En revisión</span>
        </div>
      </div>

      {propia && (
        <div className="rounded-[28px] p-5 mb-7"
          style={{ background: propia.estado === 'pendiente' ? TONES.sky.card : '#FDE2E2', boxShadow: clay(propia.estado === 'pendiente' ? TONES.sky.rgb : '185,28,28') }}>
          <div className="flex items-center gap-3 mb-4">
            {propia.photo_url
              ? <img src={propia.photo_url} alt="" className="w-14 h-14 shrink-0 rounded-full object-cover" style={{ boxShadow: clay(TONES.sky.rgb, 'sm') }} />
              : <div className="w-14 h-14 shrink-0 rounded-full" style={{ background: HZ.surface }} />}
            <div className="flex-1 min-w-0">
              <p className="text-lg leading-tight truncate" style={{ color: HZ.ink, fontFamily: HZ.display, fontWeight: 800 }}>{propia.display_name ?? 'Tu sesión'}</p>
              {propia.zone && <p className="text-sm" style={{ color: HZ.inkSoft, fontFamily: HZ.body }}>{propia.zone}</p>}
              <span className="inline-block mt-1.5 text-xs px-3 py-1.5 rounded-full text-white whitespace-nowrap"
                style={{ background: propia.estado === 'pendiente' ? AZUL : '#b91c1c', fontFamily: HZ.body, fontWeight: 800, boxShadow: clayButton(propia.estado === 'pendiente' ? '37,99,235' : '185,28,28') }}>
                {propia.estado === 'pendiente' ? 'En revisión' : 'No admitida'}
              </span>
            </div>
          </div>
          <div className="rounded-2xl p-2" style={{ background: HZ.surface, boxShadow: clayInset }}>
            <Reproductor url={propia.soundcloud_url} titulo="Tu sesión" />
          </div>
          <p className="text-sm mt-4" style={{ color: HZ.inkSoft, fontFamily: HZ.body, fontWeight: 600 }}>
            {propia.estado === 'pendiente'
              ? 'Solo la ves tú. En cuanto la revisemos sale aquí para todos y te avisamos por email para que la compartas.'
              : 'No cumple las bases. Escríbenos a info@xpeak.site y te contamos qué falta.'}
          </p>
        </div>
      )}

      {lista.length === 0 ? (
        <div className="rounded-[28px] p-6" style={{ background: TONES.sun.card, boxShadow: clay(TONES.sun.rgb) }}>
          <p style={{ color: TONES.sun.stroke, fontFamily: HZ.body, fontWeight: 700 }}>
            Todavía no hay sesiones publicadas. Cada inscripción se revisa a mano y aparece aquí en cuanto está aceptada.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {lista.map((p) => {
            const idx = puesto.get(p.user_id) ?? 0;
            const enFinal = idx < 3 && Number(p.me_gusta) > 0;
            // Finalistas en dorado; el resto alterna cielo, verde y lila.
            const tono = enFinal ? TONES.sun : [TONES.sky, TONES.leaf, TONES.lilac][idx % 3];
            return (
              <div key={p.user_id} className="rounded-[28px] p-5 transition-transform hover:-translate-y-0.5"
                style={{ order: idx, background: tono.card, boxShadow: clay(tono.rgb, enFinal ? 'lg' : 'md') }}>
                {/* Estado bajo el nombre (15 oct 2026): a su derecha, en un móvil
                    de 320 px dejaba 74 px para foto y nombre; la foto salía en
                    óvalo y la pastilla tapaba el nombre. */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-base"
                    style={enFinal
                      ? { background: `linear-gradient(135deg,${GOLD},#B8941E)`, color: '#2a1d00', fontFamily: HZ.display, fontWeight: 800, boxShadow: clayButton('184,148,30') }
                      : { background: tono.bubble, color: tono.stroke, fontFamily: HZ.display, fontWeight: 800, boxShadow: clay(tono.rgb, 'sm') }}>
                    {idx + 1}
                  </span>
                  <a href={`/p/${p.user_id}`} className="flex items-center gap-3 flex-1 min-w-0">
                    {p.photo_url
                      ? <img src={p.photo_url} alt="" className="w-12 h-12 shrink-0 rounded-full object-cover" loading="lazy" style={{ boxShadow: clay(tono.rgb, 'sm') }} />
                      : <div className="w-12 h-12 shrink-0 rounded-full" style={{ background: HZ.surface }} />}
                    <div className="min-w-0">
                      <p className="text-lg leading-tight truncate" style={{ color: HZ.ink, fontFamily: HZ.display, fontWeight: 800 }}>{p.display_name ?? 'DJ'}</p>
                      {p.zone && <p className="text-sm" style={{ color: tono.stroke, fontFamily: HZ.body, fontWeight: 700 }}>{p.zone}</p>}
                      <span className="inline-block mt-1.5 text-[0.7rem] px-2.5 py-1 rounded-full whitespace-nowrap"
                        style={enFinal ? pastilla('#FFF7DB', TONES.sun.stroke, TONES.sun.rgb) : pastilla(TONES.leaf.card, TONES.leaf.stroke, TONES.leaf.rgb)}>
                        {enFinal ? 'Ahora en la final' : 'Publicada'}
                      </span>
                    </div>
                  </a>
                </div>
                <div className="rounded-2xl p-2" style={{ background: HZ.surface, boxShadow: clayInset }}>
                  <Reproductor url={p.soundcloud_url} titulo={`Sesión de ${p.display_name ?? 'DJ'}`} />
                </div>
                <div className="flex items-center justify-between flex-wrap gap-2 mt-4 text-sm [&>*]:whitespace-nowrap">
                  {/* Votar solo dentro de plazo y nunca a uno mismo: antes el DJ
                      podía darse me gusta y su contador lo sumaba aunque el ranking
                      no lo cuenta, y se podía seguir votando tras el cierre. */}
                  {user && p.user_id === user.id ? (
                    <>
                      <span className="px-3.5 py-2 rounded-full tabular-nums" style={pastilla('#ffffff', '#E11D48', '225,29,72')}>{Number(p.me_gusta)} me gusta</span>
                      <span className="px-3.5 py-2 rounded-full" style={pastilla(TONES.sky.card, TONES.sky.stroke, TONES.sky.rgb)}>Tu sesión</span>
                    </>
                  ) : !activo ? (
                    <>
                      <span className="px-3.5 py-2 rounded-full tabular-nums" style={pastilla('#ffffff', '#E11D48', '225,29,72')}>{Number(p.me_gusta)} me gusta</span>
                      <span style={{ color: HZ.inkSoft, fontFamily: HZ.body, fontWeight: 700 }}>Votación cerrada</span>
                    </>
                  ) : user ? (
                    <span className="px-3.5 py-2 rounded-full" style={pastilla('#ffffff', '#E11D48', '225,29,72')}>
                      <LikeButton viewerId={user.id} contentKey={`concurso-${CONCURSO}:${p.user_id}`} onChange={cargar} />
                    </span>
                  ) : (
                    <>
                      <span className="px-3.5 py-2 rounded-full tabular-nums" style={pastilla('#ffffff', '#E11D48', '225,29,72')}>{Number(p.me_gusta)} me gusta</span>
                      <a href={`/auth?mode=login&redirect=${encodeURIComponent(volverA)}`} className="px-4 py-2 rounded-full text-white transition-transform hover:-translate-y-0.5"
                        style={{ background: AZUL, fontFamily: HZ.body, fontWeight: 800, boxShadow: clayButton('37,99,235') }}>
                        Entra para votar
                      </a>
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
