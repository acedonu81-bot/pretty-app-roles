import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import SesionesConcurso from '@/components/concurso/SesionesConcurso';

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
const GOLD_TEXT = '#7a6216';
const MUTED = '#4b5563';

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
      </Helmet>

      <div className="min-h-screen" style={{ background: '#ffffff', color: '#111' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-5xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: GOLD }}>XPEAK</a>
          <div className="flex items-center gap-2 sm:gap-3">
            <a href="/concurso-dj-madrid" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold" style={{ border: `1px solid ${GOLD}`, color: GOLD_TEXT }}>
              Bases
            </a>
            <a href="/concurso-dj-madrid#inscripcion" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold" style={{ background: `linear-gradient(90deg,${GOLD},#B8941E)`, color: '#111' }}>
              Participar
            </a>
          </div>
        </nav>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-4 pb-20">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: GOLD_TEXT }}>Concurso DJ XPEAK Madrid · hasta el 2 nov</p>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-3">Aspirantes</h1>
          <p className="text-base sm:text-lg leading-relaxed max-w-3xl mb-8" style={{ color: MUTED }}>
            Escucha las sesiones y vota a tus favoritas. Puede votar cualquier usuario de XPEAK. Las 3 con más me gusta el 2 de noviembre pasan a la final.
          </p>
          <SesionesConcurso volverA={PATH} />
        </main>

        <FooterPublic />
      </div>
    </>
  );
}
