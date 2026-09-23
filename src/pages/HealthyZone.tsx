import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import { HZ_GUIDES, HZ_PATH } from '@/data/healthyZone';
import { HZ, TONES, clay, clayButton, BLUE_RGB, GREEN_RGB } from '@/components/healthy-zone/clay';
import HZNav from '@/components/healthy-zone/HZNav';
import HZIcon from '@/components/healthy-zone/HZIcon';
import HZLeadForm from '@/components/healthy-zone/HZLeadForm';

const URL = `https://xpeak.es${HZ_PATH}`;
const TITLE = 'Healthy Zone: tardeos, afterworks y eventos sin alcohol | XPEAK';
const DESC = 'Ocio de día y consciente en Madrid: tardeos, afterworks de empresa, eventos sin alcohol y jornadas de bienestar. Guías prácticas y profesionales para organizarlos.';

const VALORES = [
  { t: 'De día', d: 'Con luz, con tiempo y llegando a casa a una hora normal.' },
  { t: 'Sin excesos', d: 'Se celebra igual. Al día siguiente también se vive.' },
  { t: 'Con gente', d: 'Conversar, moverse, reírse. Socializar de otra manera.' },
];

// Bola decorativa inflada del hero.
function Blob({ style, className = '' }: { style: React.CSSProperties; className?: string }) {
  return <div aria-hidden="true" className={`absolute rounded-full ${className}`} style={style} />;
}

const cloud = {
  background: '#fff',
  boxShadow: `8px 10px 20px rgba(${BLUE_RGB},0.18), inset -6px -6px 12px rgba(${BLUE_RGB},0.12), inset 6px 6px 12px rgba(255,255,255,1)`,
};

export default function HealthyZone() {
  const collection = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Healthy Zone de XPEAK',
    description: DESC,
    url: URL,
    hasPart: HZ_GUIDES.map((g) => ({ '@type': 'Article', headline: g.h1, url: `https://xpeak.es${g.slug}` })),
  };

  return (
    <>
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESC} />
        <link rel="canonical" href={URL} />
        <meta property="og:title" content="Healthy Zone: la fiesta, de otra forma | XPEAK" />
        <meta property="og:description" content={DESC} />
        <meta property="og:url" content={URL} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <link rel="stylesheet" href={HZ.fontsHref} />
        <script type="application/ld+json">{JSON.stringify(collection)}</script>
      </Helmet>

      <div className="min-h-screen overflow-x-hidden" style={{ background: HZ.bg, color: HZ.ink, fontFamily: HZ.body }}>
        <HZNav />

        <section
          className="relative mx-4 sm:mx-10 mt-6 sm:mt-8 rounded-[36px] sm:rounded-[56px] overflow-hidden min-h-[560px] sm:min-h-[620px]"
          style={{ background: HZ.sky, boxShadow: `20px 24px 48px rgba(${BLUE_RGB},0.18), inset -14px -14px 28px rgba(${BLUE_RGB},0.14), inset 14px 14px 28px rgba(255,255,255,0.7)` }}
        >
          <Blob style={{ right: '6%', top: 'clamp(18px, 5vw, 70px)', width: 'clamp(64px, 16vw, 200px)', height: 'clamp(64px, 16vw, 200px)', background: 'radial-gradient(circle at 35% 30%, #FFF7D6 0%, #FFD86E 55%, #F2B233 100%)', boxShadow: '14px 18px 36px rgba(214,150,20,0.35), inset -10px -12px 20px rgba(190,120,0,0.25)' }} />
          <Blob className="hidden md:block" style={{ right: '33%', top: 120, width: 150, height: 56, ...cloud }} />
          <Blob className="hidden md:block" style={{ right: '4%', top: 300, width: 110, height: 44, ...cloud }} />
          <Blob style={{ left: -80, bottom: -170, width: 760, height: 320, background: '#8FD6AE', boxShadow: 'inset -18px -18px 36px rgba(31,96,70,0.2), inset 18px 18px 36px rgba(255,255,255,0.45)' }} />
          <Blob style={{ right: -120, bottom: -200, width: 860, height: 340, background: '#56BD86', boxShadow: '-10px -8px 30px rgba(31,96,70,0.2), inset -18px -18px 36px rgba(20,80,55,0.25), inset 18px 18px 36px rgba(255,255,255,0.35)' }} />
          <Blob style={{ right: '20%', bottom: 90, width: 64, height: 64, background: '#FFB9A1', boxShadow: '6px 8px 16px rgba(160,70,40,0.3), inset -5px -6px 10px rgba(160,70,40,0.25), inset 5px 5px 10px rgba(255,255,255,0.6)' }} />
          <Blob style={{ right: '13%', bottom: 120, width: 40, height: 40, background: '#B7C6FF', boxShadow: '5px 6px 12px rgba(60,80,180,0.3), inset -4px -4px 8px rgba(60,80,180,0.25), inset 4px 4px 8px rgba(255,255,255,0.6)' }} />

          <div className="relative px-6 pt-24 sm:px-16 sm:pt-20 pb-40 flex flex-col gap-6 max-w-[680px]">
            <span className="self-start rounded-full px-4 py-2 text-xs sm:text-[13px] uppercase" style={{ background: HZ.surface, color: HZ.blue, fontWeight: 800, letterSpacing: '2px', boxShadow: clay(BLUE_RGB, 'sm') }}>
              Healthy Zone by XPEAK
            </span>
            <h1 className="m-0 text-[52px] sm:text-[86px] leading-[0.95]" style={{ fontFamily: HZ.display, fontWeight: 800, letterSpacing: '-2px' }}>
              La fiesta,<br />de otra forma.
            </h1>
            <p className="m-0 text-lg sm:text-[21px] leading-normal max-w-[520px]" style={{ color: '#24433B' }}>
              Tardeos, afterworks, eventos sin alcohol y jornadas de bienestar. De día, con calma y con gente que te apetece ver.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#plan" className="rounded-full px-7 py-4 text-base sm:text-[17px]" style={{ background: HZ.green, color: '#fff', fontWeight: 800, textDecoration: 'none', boxShadow: clayButton(GREEN_RGB) }}>
                Organizar mi plan
              </a>
              <a href="#guias" className="rounded-full px-7 py-4 text-base sm:text-[17px]" style={{ background: HZ.surface, color: HZ.ink, fontWeight: 800, textDecoration: 'none', boxShadow: clay(BLUE_RGB, 'sm') }}>
                Ver ideas
              </a>
            </div>
          </div>
        </section>

        <section id="guias" className="scroll-mt-6 max-w-6xl mx-auto px-4 sm:px-10 pt-16 sm:pt-20 pb-6 flex flex-col gap-8">
          <h2 className="m-0 text-3xl sm:text-[46px]" style={{ fontFamily: HZ.display, fontWeight: 800, letterSpacing: '-1px' }}>Cuatro formas de juntarse</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
            {HZ_GUIDES.map((g) => {
              const t = TONES[g.tone];
              return (
                <a key={g.slug} href={g.slug} className="rounded-[40px] p-7 flex flex-col gap-3.5 min-h-[260px] transition-transform hover:-translate-y-1" style={{ background: t.card, color: HZ.ink, textDecoration: 'none', boxShadow: clay(t.rgb, 'md') }}>
                  <HZIcon tone={g.tone} />
                  <span className="text-[27px]" style={{ fontFamily: HZ.display, fontWeight: 800 }}>{g.short}</span>
                  <span className="text-[15px] leading-normal" style={{ color: HZ.inkSoft }}>{g.cardText}</span>
                  <span className="mt-auto text-sm" style={{ fontWeight: 800 }}>Leer la guía</span>
                </a>
              );
            })}
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-10 py-10">
          <div className="rounded-[36px] sm:rounded-[48px] px-7 py-10 sm:px-14 sm:py-12 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10" style={{ background: HZ.blue, color: '#fff', boxShadow: `18px 22px 44px rgba(${BLUE_RGB},0.35), inset -12px -12px 24px rgba(0,0,0,0.18), inset 12px 12px 24px rgba(255,255,255,0.25)` }}>
            {VALORES.map((v) => (
              <div key={v.t} className="flex flex-col gap-2">
                <span className="text-3xl sm:text-[34px]" style={{ fontFamily: HZ.display, fontWeight: 800 }}>{v.t}</span>
                <span className="text-base leading-normal">{v.d}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-10 pb-20">
          <HZLeadForm origin={HZ_PATH} title="¿Qué quieres montar?" />
        </div>

        <FooterPublic />
      </div>
    </>
  );
}
