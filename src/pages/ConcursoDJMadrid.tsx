import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { estadoInscripcionMadrid, ABRE_CONCURSO as ABRE, CIERRA_CONCURSO as CIERRA } from '@/lib/concursoMadrid';
import { leerEnlaceSoundcloud } from '@/lib/soundcloudEnlace';
import { inscribirSesion } from '@/lib/concursoInscripcion';

/**
 * Concurso DJ XPEAK Madrid, 1ª edición (ficha XDS 71,9, aprobada 11 oct 2026
 * como prueba manual). Fase 1: los me gusta (feed_likes, content_key
 * 'concurso-dj-madrid-2026:<user_id>', solo con cuenta) eligen 3 finalistas;
 * fase 2: el jurado decide entre ellos. Al cierre un admin revisa quién ha
 * votado y anula lo sospechoso. Las inscripciones las revisa un admin en
 * `concurso_inscripciones` (estado 'aceptada') antes de salir aquí.
 */

const PATH = '/concurso-dj-madrid';
const ASPIRANTES = '/concurso-dj-madrid/aspirantes';
const URL = `https://xpeak.es${PATH}`;
const CONCURSO = 'dj-madrid-2026';
const TITLE = 'Concurso DJ Madrid 2026: sube tu sesión y gana unos cascos | XPEAK';
const DESC = 'Primer concurso DJ de XPEAK en Madrid. Del 13 de octubre al 2 de noviembre de 2026: sube tu sesión de SoundCloud, los me gusta eligen 3 finalistas y el jurado decide. El ganador se lleva unos Pioneer DJ HDJ-X5.';

// Fechas en hora de Madrid (CEST hasta el 25 oct, CET después).

const REGISTRO = `/auth?mode=register&role=dj&redirect=${encodeURIComponent(PATH)}`;

const GOLD = '#D4AF37';
const GOLD_TEXT = '#7a6216';
const CREAM = '#FBF3DD';
const MUTED = '#4b5563';

const PASOS = [
  { t: 'Completa tu perfil de DJ', d: 'Gratis. Con foto, bio y tu ciudad de la Comunidad de Madrid: sin perfil completo no se puede entrar al concurso.' },
  { t: 'Pega tu sesión de SoundCloud', d: 'Una mezcla tuya de entre 30 y 80 minutos, publicada en abierto. La revisamos y la publicamos aquí.' },
  { t: 'Consigue me gusta', d: 'Comparte tu sesión. Las 3 con más me gusta pasan a la final y el jurado elige al ganador.' },
];

const FECHAS = [
  { f: '13 oct', t: 'Abren las inscripciones y los me gusta' },
  { f: '2 nov', t: 'Último día para inscribirse y votar' },
  { f: '3 al 8 nov', t: 'Revisamos los votos, salen los 3 finalistas y el jurado los escucha' },
  { f: '9 nov', t: 'Anunciamos al ganador' },
];

const CRITERIOS = [
  { t: 'Técnica de mezcla', d: 'Transiciones limpias, cuadre y control de niveles.' },
  { t: 'Selección musical', d: 'Que los temas tengan sentido juntos y cuenten algo.' },
  { t: 'Energía y lectura', d: 'Cómo construyes la sesión: subidas, respiros y final.' },
  { t: 'Sonido de la grabación', d: 'Que se escuche bien, sin saturar ni cortes.' },
];

const RESUMEN_BASES = [
  { t: 'Quién', d: 'DJs mayores de 18 años que viven en la Comunidad de Madrid, con perfil en XPEAK con foto, bio y ciudad.' },
  { t: 'Plazo', d: 'del 13 de octubre al 2 de noviembre de 2026. Una sesión por persona.' },
  { t: 'Qué subes', d: 'una sesión tuya y pública de SoundCloud, de 30 a 80 minutos.' },
  { t: 'Cómo se gana', d: 'las 3 sesiones con más me gusta pasan a la final y el jurado elige al ganador. Los votos falsos se anulan.' },
  { t: 'Premio', d: 'unos Pioneer DJ HDJ-X5. Antes de enviarlos, el ganador acredita que vive en la Comunidad de Madrid, y al recibirlos sube una foto con ellos a su Instagram mencionando a @xpeaksite.' },
];

const FAQ = [
  { q: '¿Cuánto cuesta participar?', a: 'Nada. La inscripción es gratis y el perfil de DJ en XPEAK también.' },
  { q: '¿Quién puede participar?', a: 'DJs mayores de 18 años con perfil en XPEAK y residencia en la Comunidad de Madrid. Una sesión por persona. Al ganador le pedimos un documento que lo acredite antes de enviarle el premio.' },
  { q: '¿Por qué SoundCloud?', a: 'Porque casi todos los DJs ya suben ahí sus sesiones y se puede escuchar sin salir de XPEAK. El enlace tiene que ser a una sesión concreta y pública.' },
  { q: '¿Cómo se elige al ganador?', a: 'En dos fases. Los me gusta de esta página eligen a los 3 finalistas y, entre ellos, el jurado decide quién gana con los criterios de esta página.' },
  { q: '¿Quién puede dar me gusta?', a: 'Cualquiera con cuenta en XPEAK, una vez por sesión. El me gusta que un DJ se dé a sí mismo no cuenta.' },
  { q: '¿Y si alguien hace trampas?', a: 'No hay forma de ganar con bots ni likes comprados. Al cierre revisamos quién ha votado y cómo (cuentas recién creadas, ráfagas de votos, accesos repetidos) y anulamos todo lo que no venga de personas reales. Además, la última palabra la tiene el jurado.' },
  { q: '¿Qué gana el ganador?', a: 'Unos auriculares Pioneer DJ HDJ-X5 y salir destacado en la portada de XPEAK y en nuestro Instagram. Al recibirlos, sube una foto o vídeo con ellos a tu Instagram mencionando o etiquetando a @xpeaksite.' },
];


// Los tipos generados de Supabase no incluyen todavía la tabla ni la función
// del concurso: se tipa a mano lo justo, igual que la analítica en track.ts.
type SbLoose = {
  rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
  from: (t: string) => {
    select: (c: string) => { eq: (k: string, v: string) => { eq: (k: string, v: string) => { maybeSingle: () => Promise<{ data: unknown }> } } };
    insert: (row: Record<string, unknown>) => Promise<{ error: { message: string; code?: string } | null }>;
  };
};
const sb = supabase as unknown as SbLoose;


// Quien sale a completar su perfil vuelve aquí al terminar el asistente de
// bienvenida (OnboardingWizard lee esta clave). Antes acababa en su ficha.
function marcarVuelta() {
  try { sessionStorage.setItem('xpeak_volver_a', PATH); } catch { /* sin almacenamiento: no pasa nada */ }
}

function Inscripcion() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  // Estado real de su inscripción: antes solo se sabía si existía, y un DJ
  // pendiente o rechazado veía siempre "Estás dentro".
  const [inscrito, setInscrito] = useState<'pendiente' | 'aceptada' | 'rechazada' | null>(null);
  const [perfil, setPerfil] = useState<ReturnType<typeof estadoInscripcionMadrid> | null>(null);
  const [url, setUrl] = useState('');
  const [acepta, setAcepta] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ahora = new Date();
  const abierta = ahora >= ABRE && ahora < CIERRA;

  useEffect(() => {
    if (!user) return;
    sb.from('concurso_inscripciones').select('estado').eq('concurso', CONCURSO).eq('user_id', user.id).maybeSingle()
      .then(({ data }) => setInscrito(((data as { estado?: string } | null)?.estado as 'pendiente' | 'aceptada' | 'rechazada') ?? null));
    // Foto y bio (lo mismo que exige la policy de inserción) y ciudad en la
    // Comunidad de Madrid (esto solo lo filtra la página: ver concursoMadrid.ts).
    supabase.from('profiles').select('photo_url, bio, region').eq('user_id', user.id)
      .then(({ data }) => setPerfil(estadoInscripcionMadrid(data ?? [])));
  }, [user]);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!acepta) { setError('Tienes que aceptar las bases para inscribirte.'); return; }
    if (!leerEnlaceSoundcloud(url)) {
      setError('Pega el enlace de tu sesión de SoundCloud, del tipo soundcloud.com/tu-nombre/tu-sesion. El de tu perfil no vale: tiene que ser el de la sesión.');
      return;
    }
    setEnviando(true);
    setError(null);
    const res = await inscribirSesion(user.id, url, PATH);
    setEnviando(false);
    if (!res.ok) { setError(res.mensaje); return; }
    setInscrito('pendiente');
    // Al enviar el enlace, a la página de aspirantes: ahí ve la suya en revisión.
    navigate(ASPIRANTES);
  };

  const caja = 'rounded-2xl p-6 sm:p-8';
  const cajaStyle = { background: CREAM, border: `1px solid ${GOLD}55` };

  if (loading) return <div className={caja} style={cajaStyle}>Cargando…</div>;

  if (!abierta) {
    return (
      <div className={caja} style={cajaStyle}>
        <p className="text-lg font-bold mb-2">
          {ahora < ABRE ? 'Las inscripciones abren el 13 de octubre.' : 'Las inscripciones están cerradas.'}
        </p>
        <p style={{ color: MUTED }}>
          {ahora < ABRE
            ? 'Mientras tanto, crea tu perfil de DJ con foto y bio y deja tu sesión preparada en SoundCloud.'
            : 'Estamos revisando los votos y el jurado escucha a los 3 finalistas. Anunciamos al ganador el 9 de noviembre.'}
        </p>
        {ahora < ABRE && !user && (
          <a href={REGISTRO} className="inline-block mt-5 px-5 py-3 rounded-xl font-bold" style={{ background: `linear-gradient(90deg,${GOLD},#B8941E)`, color: '#111' }}>
            Crear mi perfil de DJ
          </a>
        )}
      </div>
    );
  }

  if (!user) {
    return (
      <div className={caja} style={cajaStyle}>
        <p className="text-lg font-bold mb-2">Para inscribirte necesitas un perfil de DJ en XPEAK</p>
        <p className="mb-5" style={{ color: MUTED }}>Es gratis. Completa tu perfil con foto, bio y tu ciudad y vuelve aquí para pegar tu sesión.</p>
        <div className="flex flex-wrap gap-3">
          <a href={REGISTRO} className="px-5 py-3 rounded-xl font-bold" style={{ background: `linear-gradient(90deg,${GOLD},#B8941E)`, color: '#111' }}>
            Crear mi perfil de DJ
          </a>
          <a href="/auth?mode=login" className="px-5 py-3 rounded-xl font-bold border" style={{ borderColor: GOLD, color: GOLD_TEXT }}>
            Ya tengo cuenta
          </a>
        </div>
        <p className="text-sm mt-4" style={{ color: MUTED }}>Si ya tienes cuenta, entra y vuelve a esta página: xpeak.es{PATH}</p>
      </div>
    );
  }

  if (inscrito) {
    const textos = {
      pendiente: { t: 'Estás dentro: revisando tu sesión', d: 'Comprobamos que la sesión es tuya y cumple las bases. En cuanto la aceptemos aparecerá en la lista de participantes y te avisaremos por email para que la compartas.' },
      aceptada: { t: 'Tu sesión ya está publicada', d: 'Ya sale en la lista de participantes. Compártela con tu gente: las 3 sesiones con más me gusta hasta el 2 de noviembre pasan a la final.' },
      rechazada: { t: 'Tu sesión no cumple las bases', d: 'Escríbenos a info@xpeak.site y te contamos qué falta.' },
    }[inscrito];
    return (
      <div className={caja} style={cajaStyle}>
        <p className="text-lg font-bold mb-2">{textos.t}</p>
        <p style={{ color: MUTED }}>{textos.d}</p>
        {inscrito === 'aceptada' && (
          <a href={ASPIRANTES} className="inline-block mt-4 font-bold underline" style={{ color: GOLD_TEXT }}>Ver mi sesión</a>
        )}
      </div>
    );
  }

  if (perfil === 'fuera_de_madrid') {
    return (
      <div className={caja} style={cajaStyle}>
        <p className="text-lg font-bold mb-2">Este concurso es para DJs de la Comunidad de Madrid</p>
        <p className="mb-5" style={{ color: MUTED }}>
          En tu perfil no aparece una ciudad de la Comunidad de Madrid. Si vives aquí, pon tu ciudad en el perfil y vuelve a esta página para inscribirte.
        </p>
        <a href="/dashboard?view=profile" onClick={marcarVuelta} className="inline-block px-5 py-3 rounded-xl font-bold" style={{ background: `linear-gradient(90deg,${GOLD},#B8941E)`, color: '#111' }}>
          Revisar mi ciudad
        </a>
      </div>
    );
  }

  if (perfil === 'falta_perfil') {
    return (
      <div className={caja} style={cajaStyle}>
        <p className="text-lg font-bold mb-2">Te falta completar el perfil</p>
        <p className="mb-5" style={{ color: MUTED }}>
          Para entrar al concurso tu perfil necesita foto y bio. Así el público y el jurado saben quién hay detrás de cada sesión.
        </p>
        <a href="/dashboard" onClick={marcarVuelta} className="inline-block px-5 py-3 rounded-xl font-bold" style={{ background: `linear-gradient(90deg,${GOLD},#B8941E)`, color: '#111' }}>
          Completar mi perfil
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} className={caja} style={cajaStyle}>
      <label htmlFor="sc" className="block text-lg font-bold mb-2">Enlace de tu sesión en SoundCloud</label>
      <input
        id="sc"
        type="text"
        inputMode="url"
        autoComplete="off"
        placeholder="https://soundcloud.com/tu-nombre/tu-sesion"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full rounded-xl px-4 py-3 border bg-white text-base"
        style={{ borderColor: '#e5e7eb' }}
        required
      />
      <label className="flex items-start gap-3 mt-4 text-sm" style={{ color: MUTED }}>
        <input type="checkbox" checked={acepta} onChange={(e) => setAcepta(e.target.checked)} className="mt-1" />
        <span>He leído y acepto las <a href="#bases" className="underline" style={{ color: GOLD_TEXT }}>bases del concurso</a>.</span>
      </label>
      {error && <p className="mt-3 text-sm font-semibold" style={{ color: '#b91c1c' }}>{error}</p>}
      <button
        type="submit"
        disabled={enviando}
        className="mt-5 px-6 py-3 rounded-xl font-bold disabled:opacity-60"
        style={{ background: `linear-gradient(90deg,${GOLD},#B8941E)`, color: '#111' }}
      >
        {enviando ? 'Enviando…' : 'Inscribirme en el concurso'}
      </button>
    </form>
  );
}


export default function ConcursoDJMadrid() {
  // Enlaces a #bases / #inscripcion / #participantes (13 oct 2026): el ancla
  // se quedaba ~200-280 px corta. En producción la página sale primero como
  // copia prerenderizada (#ssr-snapshot, ver main.tsx) y React monta oculto
  // debajo: hay dos elementos con el mismo id y, al intercambiarse, se
  // conserva el scroll pero la sección cae en otro sitio. Se salta a la copia
  // mientras está y, cuando React se muestra (#root cambia de tamaño), a la
  // sección buena. Hasta 7 s o hasta que el usuario toque.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id || typeof ResizeObserver === 'undefined') return;
    const ir = () => {
      const copia = document.getElementById('ssr-snapshot');
      const destino = copia
        ? Array.from(copia.querySelectorAll<HTMLElement>('[id]')).find((e) => e.id === id)
        : document.getElementById(id);
      destino?.scrollIntoView({ block: 'start' });
    };
    ir();
    // html, body y #root miden siempre el 100% (index.css): su tamaño no
    // cambia. Lo que crece es el contenedor de la página, y el cambio de copia
    // a React se ve cuando se quita #ssr-snapshot.
    const ro = new ResizeObserver(ir);
    const raiz = document.getElementById('root');
    if (raiz?.firstElementChild) ro.observe(raiz.firstElementChild);
    const mo = new MutationObserver(() => { if (!document.getElementById('ssr-snapshot')) ir(); });
    if (raiz?.parentElement) mo.observe(raiz.parentElement, { childList: true });
    const parar = () => {
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener('wheel', parar);
      window.removeEventListener('touchstart', parar);
      window.removeEventListener('keydown', parar);
    };
    window.addEventListener('wheel', parar, { passive: true });
    window.addEventListener('touchstart', parar, { passive: true });
    window.addEventListener('keydown', parar);
    const t = setTimeout(parar, 7000);
    return () => { clearTimeout(t); parar(); };
  }, []);

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  // Evento online: se vota del 13 oct al 2 nov y el jurado elige el 9 nov.
  // Sin sede física, así que va como evento en línea (VirtualLocation).
  const eventLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'Concurso DJ XPEAK Madrid 2026',
    description: 'Concurso gratuito para DJs de la Comunidad de Madrid. Se sube una sesión de SoundCloud de 30 a 80 minutos, los me gusta eligen 3 finalistas y un jurado decide al ganador, que se lleva unos Pioneer DJ HDJ-X5.',
    startDate: '2026-10-13T00:00:00+02:00',
    endDate: '2026-11-09T23:59:00+01:00',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    location: { '@type': 'VirtualLocation', url: URL },
    image: ['https://xpeak.es/concurso/cascos-hdj-x5.webp'],
    organizer: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
    offers: { '@type': 'Offer', url: URL, price: '0', priceCurrency: 'EUR', availability: 'https://schema.org/InStock', validFrom: '2026-10-13T00:00:00+02:00' },
  };
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
      { '@type': 'ListItem', position: 2, name: 'Concurso DJ Madrid', item: URL },
    ],
  };

  return (
    <>
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESC} />
        <link rel="canonical" href={URL} />
        <meta property="og:title" content="Concurso DJ XPEAK Madrid 2026" />
        <meta property="og:description" content="Sube tu sesión de SoundCloud: los me gusta eligen 3 finalistas, el jurado decide y el ganador se lleva unos Pioneer DJ HDJ-X5. Del 13 de octubre al 2 de noviembre." />
        <meta property="og:url" content={URL} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(faqLd)}</script>
        <script type="application/ld+json">{JSON.stringify(eventLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>

      <div className="min-h-screen" style={{ background: '#ffffff', color: '#111' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-5xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#8B6A00' }}>XPEAK</a>
          <div className="flex items-center gap-2 sm:gap-3">
            <a href={ASPIRANTES} className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold" style={{ border: `1px solid ${GOLD}`, color: GOLD_TEXT }}>
              Aspirantes
            </a>
            <a href="#inscripcion" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold" style={{ background: `linear-gradient(90deg,${GOLD},#B8941E)`, color: '#111' }}>
              Inscribirme
            </a>
          </div>
        </nav>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-20">
          <section className="rounded-3xl px-6 py-10 sm:px-12 sm:py-14 mb-12" style={{ background: `linear-gradient(135deg,#FFFDF7,${CREAM})`, border: `1px solid ${GOLD}40` }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: GOLD_TEXT }}>Primera edición · Madrid · 2026</p>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4">Concurso DJ XPEAK Madrid</h1>
            <p className="text-lg sm:text-xl leading-relaxed max-w-3xl mb-6" style={{ color: '#222' }}>
              Sube tu mejor sesión de SoundCloud. Los me gusta eligen a los <strong>3 finalistas</strong>, el jurado decide y el ganador se lleva <strong>unos Pioneer DJ HDJ-X5</strong> y sale destacado en XPEAK.
            </p>
            <div className="flex flex-wrap gap-3 text-sm font-semibold">
              <span className="rounded-full px-4 py-2 bg-white" style={{ border: `1px solid ${GOLD}55` }}>Inscripción gratis</span>
              <span className="rounded-full px-4 py-2 bg-white" style={{ border: `1px solid ${GOLD}55` }}>Del 13 de octubre al 2 de noviembre</span>
              <span className="rounded-full px-4 py-2 bg-white" style={{ border: `1px solid ${GOLD}55` }}>Me gusta + jurado</span>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-black mb-6">Cómo participar</h2>
            <ol className="grid gap-4 md:grid-cols-3">
              {PASOS.map((p, i) => (
                <li key={p.t} className="rounded-2xl p-5 border bg-white" style={{ borderColor: '#eee' }}>
                  <span className="inline-flex w-8 h-8 rounded-full items-center justify-center font-black mb-3" style={{ background: CREAM, color: GOLD_TEXT }}>{i + 1}</span>
                  <p className="font-bold mb-1">{p.t}</p>
                  <p className="text-sm leading-relaxed" style={{ color: MUTED }}>{p.d}</p>
                </li>
              ))}
            </ol>
          </section>

          <section id="inscripcion" className="mb-12 scroll-mt-6">
            <h2 className="text-2xl sm:text-3xl font-black mb-6">Inscripción</h2>
            {/* Las reglas antes del formulario (decisión del usuario, 13 oct
                2026), en resumen: las bases completas son 12 puntos y,
                puestas aquí, mandaban el formulario al final de la página. */}
            <div className="rounded-2xl p-5 sm:p-6 mb-5" style={{ background: '#F9F8F6', border: '1px solid #eee' }}>
              <p className="font-black mb-3">Lo importante de las bases</p>
              <ul className="space-y-2 text-sm leading-relaxed" style={{ color: MUTED }}>
                {RESUMEN_BASES.map((r) => (
                  <li key={r.t}><strong style={{ color: '#111' }}>{r.t}:</strong> {r.d}</li>
                ))}
              </ul>
              <a href="#bases" className="inline-block mt-3 text-sm font-bold underline" style={{ color: GOLD_TEXT }}>Leer las bases completas</a>
            </div>
            <Inscripcion />
          </section>

          <section className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-black mb-6">Cómo se decide</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl p-6" style={{ background: '#F3E8FF', border: '1px solid #d8b4fe' }}>
                <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#7e22ce' }}>Fase 1 · hasta el 2 nov</p>
                <p className="text-lg font-bold mb-1">Los me gusta eligen a los 3 finalistas</p>
                <p className="text-sm leading-relaxed" style={{ color: MUTED }}>Cualquiera con cuenta en XPEAK puede dar un me gusta a cada sesión. El tuyo propio no cuenta.</p>
              </div>
              <div className="rounded-2xl p-6" style={{ background: '#E0EBFF', border: '1px solid #93b4fb' }}>
                <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#1d4ed8' }}>Fase 2 · 3 al 8 nov</p>
                <p className="text-lg font-bold mb-1">El jurado elige al ganador</p>
                <p className="text-sm leading-relaxed" style={{ color: MUTED }}>Escucha las 3 sesiones finalistas y decide con los criterios de abajo.</p>
              </div>
            </div>
            <div className="rounded-2xl p-6 mt-4" style={{ background: CREAM, border: `1px solid ${GOLD}55` }}>
              <p className="text-lg font-bold mb-1">Sin trampas</p>
              <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
                Nada de bots ni likes comprados. Al cierre analizamos quién ha votado y cómo (cuentas recién creadas, ráfagas de votos, accesos repetidos) y anulamos todo lo que no venga de personas reales.
              </p>
            </div>
          </section>

          <section className="mb-12 grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-black mb-5">Fechas</h2>
              <ul className="space-y-3">
                {FECHAS.map((f) => (
                  <li key={f.f} className="flex gap-4">
                    <span className="w-24 shrink-0 font-black" style={{ color: GOLD_TEXT }}>{f.f}</span>
                    <span>{f.t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-black mb-5">Qué valora el jurado en la final</h2>
              <ul className="space-y-3">
                {CRITERIOS.map((c) => (
                  <li key={c.t}>
                    <p className="font-bold">{c.t}</p>
                    <p className="text-sm" style={{ color: MUTED }}>{c.d}</p>
                  </li>
                ))}
              </ul>
              <p className="text-sm mt-3" style={{ color: MUTED }}>Cada criterio cuenta lo mismo.</p>
            </div>
          </section>

          {/* Las sesiones viven en su propia página (13 oct 2026, petición del
              usuario: aquí quedaba enredado). Se conserva el id para los
              enlaces viejos a #participantes. */}
          <section id="participantes" className="mb-12 scroll-mt-6">
            <a href={ASPIRANTES} className="block rounded-3xl p-6 sm:p-8 transition-transform hover:scale-[1.01]" style={{ background: CREAM, border: `1px solid ${GOLD}66` }}>
              <p className="text-2xl sm:text-3xl font-black mb-2">Aspirantes</p>
              <p className="mb-5" style={{ color: MUTED }}>Escucha las sesiones subidas y vota a tus favoritas. Puede votar cualquier usuario de XPEAK.</p>
              <span className="inline-block px-5 py-3 rounded-xl font-bold" style={{ background: `linear-gradient(90deg,${GOLD},#B8941E)`, color: '#111' }}>Ver aspirantes</span>
            </a>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-black mb-6">Preguntas frecuentes</h2>
            <div className="space-y-5">
              {FAQ.map((f) => (
                <div key={f.q}>
                  <h3 className="font-bold mb-1">{f.q}</h3>
                  <p className="leading-relaxed" style={{ color: MUTED }}>{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="bases" className="rounded-2xl p-6 sm:p-8 border scroll-mt-6" style={{ borderColor: '#eee', background: '#F9F8F6' }}>
            <h2 className="text-xl font-black mb-4">Bases del concurso</h2>
            <ol className="list-decimal pl-5 space-y-2 text-sm leading-relaxed" style={{ color: '#333' }}>
              <li><strong>Organiza:</strong> XPEAK (xpeak.es). Contacto: info@xpeak.site.</li>
              <li><strong>Participantes:</strong> personas mayores de 18 años, residentes en la Comunidad de Madrid, con perfil de DJ en XPEAK completo (foto, bio y ciudad de la Comunidad de Madrid). Participar es gratis y no exige compra ni pago de ningún tipo.</li>
              <li><strong>Residencia:</strong> antes de entregar el premio, XPEAK pedirá al ganador un documento que acredite que reside en la Comunidad de Madrid (DNI o certificado de empadronamiento) y una dirección de envío en la Comunidad de Madrid. Si no lo acredita en 15 días, el premio pasa al siguiente clasificado.</li>
              <li><strong>Plazo:</strong> inscripciones y votos desde el 13 de octubre de 2026 a las 00:00 hasta el 2 de noviembre de 2026 a las 23:59 (hora de Madrid).</li>
              <li><strong>Cómo participar:</strong> una sola inscripción por persona, con el enlace a una sesión pública de SoundCloud de entre 30 y 80 minutos, mezclada por el propio participante. No se admiten sesiones de otras personas.</li>
              <li><strong>Revisión:</strong> XPEAK revisa cada inscripción antes de publicarla y puede rechazar las que no cumplan estas bases, incluidas sesiones con contenido ofensivo o que no sean del participante.</li>
              <li><strong>Votación (fase 1):</strong> cualquier persona con cuenta en XPEAK puede dar un me gusta a cada sesión publicada. No cuenta el me gusta que un participante se dé a sí mismo. Las 3 sesiones con más me gusta válidos pasan a la final. Al cierre, XPEAK analiza quién ha votado y cómo (antigüedad de las cuentas, ráfagas de votos, accesos repetidos) y anula los votos de bots, cuentas falsas o compradas; si un participante se beneficia de votos fraudulentos, puede quedar descalificado.</li>
              <li><strong>Empates:</strong> si dos o más sesiones empatan en me gusta válidos en el puesto que da paso a la final, pasa la que se inscribió antes.</li>
              <li><strong>Jurado y fallo (fase 2):</strong> un jurado designado por XPEAK valora las 3 sesiones finalistas según técnica de mezcla, selección musical, energía y lectura, y sonido de la grabación, con el mismo peso. El fallo es inapelable y se anuncia el 9 de noviembre de 2026 en esta página y en el Instagram de XPEAK. El concurso puede declararse desierto si ninguna sesión alcanza un nivel mínimo.</li>
              <li><strong>Premio:</strong> unos auriculares Pioneer DJ HDJ-X5 para el ganador, que además sale destacado en la portada de XPEAK y en su Instagram. El premio no se puede cambiar por dinero. XPEAK contactará con el ganador por el chat de XPEAK; si no responde en 15 días, el premio pasa al siguiente clasificado.</li>
              <li><strong>Cambio de premio:</strong> si por falta de existencias o por causas ajenas a XPEAK no se pudieran entregar los Pioneer DJ HDJ-X5, XPEAK los sustituirá por otros auriculares de DJ de gama y valor equivalentes o superiores.</li>
              <li><strong>Foto con el premio:</strong> al aceptar el premio, el ganador se compromete a publicar en su Instagram, en los 15 días siguientes a recibir los cascos, una foto o vídeo con ellos mencionando o etiquetando a @xpeaksite. XPEAK podrá compartir esa publicación.</li>
              <li><strong>Música y derechos:</strong> cada participante es responsable de que su sesión esté publicada legalmente en SoundCloud. XPEAK solo incrusta el reproductor oficial de SoundCloud y no descarga ni redistribuye la música. Si una sesión deja de estar disponible en SoundCloud (por retirada de la plataforma, por un reclamo de derechos o porque su autor la borra o la hace privada), XPEAK la retirará del concurso y el participante podrá sustituirla por otra que cumpla estas bases mientras el plazo siga abierto.</li>
              <li><strong>Instagram:</strong> este concurso no está patrocinado, avalado ni administrado por Instagram ni por Meta, ni asociado a ellos de ningún modo. Los participantes eximen a Instagram y a Meta de toda responsabilidad y sus datos los recibe XPEAK, no Instagram.</li>
              <li><strong>SoundCloud:</strong> este concurso no está patrocinado, avalado ni administrado por SoundCloud. El organizador y único responsable es XPEAK, y cualquier consulta sobre el concurso se dirige a info@xpeak.site, no a SoundCloud.</li>
              <li><strong>Difusión:</strong> al inscribirse, el participante autoriza a XPEAK a mostrar su nombre de DJ, su foto de perfil y su sesión (mediante el reproductor de SoundCloud) en esta página y en las publicaciones de XPEAK sobre el concurso, mientras dure el concurso y su difusión posterior. Puede retirar esa autorización escribiendo a info@xpeak.site, lo que supone salir del concurso.</li>
              <li><strong>Datos personales:</strong> los datos se usan solo para gestionar el concurso, según la <a href="/privacidad" className="underline">política de privacidad</a> de XPEAK. Puedes pedir que se borre tu inscripción escribiendo a info@xpeak.site.</li>
              <li><strong>Juego limpio:</strong> XPEAK puede anular cualquier participación fraudulenta o que incumpla estas bases.</li>
            </ol>
            <p className="text-xs mt-4" style={{ color: '#666' }}>Bases actualizadas el 13 de octubre de 2026: se detalla qué pasa si una sesión deja de estar disponible en SoundCloud, la autorización de difusión y que SoundCloud no patrocina el concurso.</p>
          </section>
        </main>

        <FooterPublic />
      </div>
    </>
  );
}
