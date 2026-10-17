import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import SesionesConcurso from '@/components/concurso/SesionesConcurso';
import SiguenosRedes from '@/components/concurso/SiguenosRedes';
import { ProximaEdicionDJ } from '@/components/concurso/CaptacionConcurso';
import { HZ, TONES, clay, clayButton } from '@/components/healthy-zone/clay';

/**
 * Aspirantes del Concurso DJ XPEAK Madrid: solo las sesiones y los votos.
 * Separada de /concurso-dj-madrid (bases, fechas e inscripción) a petición
 * del usuario (13 oct 2026): "en esa página están las sesiones, no hay más".
 * Se llega desde el botón "Ver aspirantes" del banner de Inicio y Feed.
 */
const PATH = '/concurso-dj-madrid/aspirantes';
const URL = `https://xpeak.es${PATH}`;
const TITLE = 'Aspirantes del Concurso DJ XPEAK Madrid: escucha y vota | XPEAK';
const DESC = 'Escucha las sesiones de los DJs que participan en el Concurso DJ XPEAK Madrid y vota a tus favoritas. Las 3 con más me gusta el 2 de noviembre pasan a la final.';

const GOLD = '#D4AF37';

export default function ConcursoDJAspirantes() {
  return (
    <>
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESC} />
        <link rel="canonical" href={URL} />
        <meta property="og:title" content="Aspirantes del Concurso DJ XPEAK Madrid" />
        <meta property="og:description" content={DESC} />
        <meta property="og:url" content={URL} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <link rel="stylesheet" href={HZ.fontsHref} />
      </Helmet>

      {/* Estilo clay del feed (13 oct 2026, "dale clay, un poco de alegría"):
          fondo crema con manchas de color, cabecera inflada con el degradado
          del banner del concurso y botones con volumen. */}
      <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(180deg,#FFFDF7 0%,#FBF3DD 100%)', color: HZ.ink }}>
        <span aria-hidden className="absolute -top-24 -left-24 w-80 h-80 rounded-full opacity-60 pointer-events-none" style={{ background: TONES.sky.bubble, filter: 'blur(70px)' }} />
        <span aria-hidden className="absolute top-[38%] -right-28 w-96 h-96 rounded-full opacity-50 pointer-events-none" style={{ background: TONES.sun.bubble, filter: 'blur(80px)' }} />
        <span aria-hidden className="absolute bottom-40 -left-20 w-72 h-72 rounded-full opacity-40 pointer-events-none" style={{ background: TONES.leaf.bubble, filter: 'blur(70px)' }} />

        {/* Zona segura (15 oct 2026): en la app instalada de iPhone la barra de
            estado es translúcida y esta barra quedaba bajo la hora y el notch.
            En el navegador --sat vale 0 y no cambia nada. */}
        <nav className="relative flex items-center justify-between px-4 sm:px-6 pb-5 pt-[max(1.25rem,var(--sat))] max-w-5xl mx-auto">
          <a href="/" className="text-xl tracking-tight" style={{ color: '#8B6A00', fontFamily: HZ.display, fontWeight: 800 }}>XPEAK</a>
          <div className="flex items-center gap-2 sm:gap-3">
            <a href="/concurso-dj-madrid" className="px-4 py-2 rounded-full text-sm transition-transform hover:-translate-y-0.5"
              style={{ background: HZ.surface, color: TONES.sun.stroke, fontFamily: HZ.body, fontWeight: 800, boxShadow: clay(TONES.sun.rgb, 'sm') }}>
              Bases
            </a>
            <a href="/concurso-dj-madrid#inscripcion" className="px-4 py-2 rounded-full text-sm transition-transform hover:-translate-y-0.5"
              style={{ background: `linear-gradient(135deg,${GOLD},#B8941E)`, color: '#2a1d00', fontFamily: HZ.body, fontWeight: 800, boxShadow: clayButton('184,148,30') }}>
              Participar
            </a>
          </div>
        </nav>

        <main className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-2 pb-20">
          <section className="relative overflow-hidden rounded-[32px] p-6 sm:p-9 mb-10 flex items-center gap-4"
            style={{
              background: 'linear-gradient(120deg,#1d3fd6 0%,#2b6dff 40%,#a52ee0 100%)',
              boxShadow: '14px 18px 36px rgba(74,60,200,0.35), inset -8px -8px 18px rgba(0,0,0,0.18), inset 8px 8px 18px rgba(255,255,255,0.25)',
            }}>
            <span aria-hidden className="absolute -left-10 top-[72%] h-[3px] w-[140%] -rotate-12 opacity-50" style={{ background: '#7fd3ff', filter: 'blur(2px)' }} />
            <span aria-hidden className="absolute -left-10 top-[92%] h-[3px] w-[140%] -rotate-[20deg] opacity-40" style={{ background: '#f08cff', filter: 'blur(2px)' }} />
            <div className="relative flex-1 min-w-0">
              <p className="text-[0.75rem] uppercase tracking-[0.2em] mb-2" style={{ color: '#bfe8ff', fontFamily: HZ.body, fontWeight: 800 }}>
                Concurso DJ XPEAK Madrid · hasta el 2 nov
              </p>
              <h1 className="text-4xl sm:text-6xl leading-none text-white mb-3" style={{ fontFamily: HZ.display, fontWeight: 800 }}>Aspirantes</h1>
              <p className="text-base sm:text-lg max-w-xl" style={{ color: 'rgba(255,255,255,0.9)', fontFamily: HZ.body, fontWeight: 600 }}>
                Escucha las sesiones y vota a tus favoritas. Puede votar cualquier usuario de XPEAK. Las 3 con más me gusta el 2 de noviembre pasan a la final.
              </p>
            </div>
            <img src="/concurso/cascos-hdj-x5.webp" alt="Auriculares Pioneer DJ HDJ-X5, el premio" width={360} height={358}
              className="relative hidden sm:block w-40 md:w-48 h-auto shrink-0 -rotate-6" style={{ filter: 'drop-shadow(0 12px 22px rgba(20,0,60,0.45))' }} />
          </section>

          <SesionesConcurso volverA={PATH} />
          <ProximaEdicionDJ />
          <SiguenosRedes />
        </main>

        <FooterPublic />
      </div>
    </>
  );
}
