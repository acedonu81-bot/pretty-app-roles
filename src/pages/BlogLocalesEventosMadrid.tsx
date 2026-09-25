import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import { EMBLEMATICOS as emblematicos, SALAS as salas, BARES as bares, TERRAZAS as terrazas, HUERTAS_LATINA as huertasLatina, FINCAS as fincas, LocalInvestigado } from '@/data/localesEventosMadrid';

const article = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Locales para eventos en Madrid: guía de salas, terrazas y fincas (2026)',
  description: 'Discotecas, terrazas, azoteas y fincas para despedidas en Madrid y alrededores, con web y contacto directo de cada espacio.',
  datePublished: '2026-09-21',
  dateModified: '2026-09-21',
  author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es/autor/daniel' },
  publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } },
  image: 'https://xpeak.es/img/locales-madrid/generico-discoteca-1.jpg',
  url: 'https://xpeak.es/blog/locales-para-eventos-madrid',
};

const faqStructured = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: '¿Cómo elegir el local adecuado para una fiesta privada en Madrid?', acceptedAnswer: { '@type': 'Answer', text: 'Depende del tipo de evento y del número de invitados: una discoteca con sala privada funciona bien para cumpleaños y despedidas urbanas, una terraza o azotea para algo más tranquilo, y una finca a las afueras cuando el grupo quiere pasar el fin de semana completo fuera de la ciudad.' } },
    { '@type': 'Question', name: '¿Los locales de esta guía cobran comisión por reservar a través de XPEAK?', acceptedAnswer: { '@type': 'Answer', text: 'No. Esta es una guía informativa: cada local se contacta directamente a través de su propia web, teléfono o Instagram. XPEAK no gestiona la reserva del espacio.' } },
    { '@type': 'Question', name: '¿Con cuánta antelación hay que reservar un local para una fiesta o despedida?', acceptedAnswer: { '@type': 'Answer', text: 'Para salas y discotecas en Madrid capital, entre 3 y 6 semanas suele ser suficiente salvo fechas muy señaladas como Navidad o fin de curso. Para fincas de despedida, sobre todo en primavera y verano, conviene reservar con 2 o 3 meses de margen porque la disponibilidad de fin de semana se agota antes.' } },
    { '@type': 'Question', name: '¿Además del local, quién más hace falta para organizar el evento?', acceptedAnswer: { '@type': 'Answer', text: 'El local es solo una parte: la mayoría de eventos necesitan también DJ o música, catering, fotografía o algún tipo de animación según el tipo de celebración. XPEAK reúne a esos profesionales en un directorio aparte, para contratarlos todos desde el mismo carrito de evento.' } },
  ],
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'Locales para eventos en Madrid', item: 'https://xpeak.es/blog/locales-para-eventos-madrid' },
  ],
};


function VenueCard({ local }: { local: LocalInvestigado }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(10,9,8,0.09)' }}>
      <div className="relative" style={{ aspectRatio: '4/3' }}>
        <img src={local.foto} alt={local.nombre} className="w-full h-full object-cover" loading="lazy" />
        <span
          className="absolute top-2.5 left-2.5 text-[10px] font-black uppercase tracking-wide text-white px-2 py-1 rounded-md"
          style={{ background: 'rgba(10,9,8,0.55)', backdropFilter: 'blur(3px)' }}
        >
          {local.zona}
        </span>
      </div>
      <div className="p-4">
        <p className="text-base font-black" style={{ fontFamily: "'Syne', sans-serif" }}>{local.nombre}</p>
        <p className="text-xs mb-3" style={{ color: '#57544d' }}>{local.tipo}</p>
        {local.web && (
          <a href={local.web} target="_blank" rel="noopener noreferrer nofollow" className="text-xs font-black transition-opacity hover:opacity-70" style={{ color: '#0D9488' }}>
            Ver web →
          </a>
        )}
      </div>
    </div>
  );
}

function Featured({ local }: { local: LocalInvestigado }) {
  return (
    <div className="grid md:grid-cols-2 rounded-3xl overflow-hidden mb-4" style={{ border: '1px solid rgba(10,9,8,0.09)' }}>
      <div style={{ aspectRatio: '16/11' }}>
        <img src={local.foto} alt={local.nombre} className="w-full h-full object-cover" loading="lazy" />
      </div>
      <div className="p-7 flex flex-col justify-center">
        <span className="inline-block w-fit text-[10px] font-black uppercase mb-2.5 px-2.5 py-1 rounded-md" style={{ color: '#8a6d1a', background: 'rgba(212,175,55,0.14)' }}>
          {local.zona}
        </span>
        <p className="text-xl font-black mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>{local.nombre}</p>
        <p className="text-sm mb-4" style={{ color: '#57544d' }}>{local.tipo}</p>
        {local.web && (
          <a href={local.web} target="_blank" rel="noopener noreferrer nofollow" className="w-fit text-xs font-black transition-opacity hover:opacity-70" style={{ color: '#0D9488' }}>
            Ver web →
          </a>
        )}
      </div>
    </div>
  );
}

function SectionDivider({ id, title }: { id: string; title: string }) {
  return (
    <div id={id} className="flex items-center gap-4 mt-14 mb-6 scroll-mt-20">
      <span className="text-sm font-black uppercase tracking-wide whitespace-nowrap" style={{ fontFamily: "'Syne', sans-serif" }}>{title}</span>
      <div className="flex-1 h-px" style={{ background: 'rgba(10,9,8,0.09)' }} />
    </div>
  );
}

function Grid({ locales }: { locales: LocalInvestigado[] }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {locales.map((l) => <VenueCard key={l.nombre} local={l} />)}
    </div>
  );
}

export default function BlogLocalesEventosMadrid() {
  return (
    <>
      <Helmet>
        <title>Locales para eventos en Madrid: guía de salas, terrazas y fincas (2026) | XPEAK</title>
        <meta name="description" content="Discotecas, terrazas, azoteas y fincas para despedidas en Madrid y alrededores, con web y contacto directo." />
        <link rel="canonical" href="https://xpeak.es/blog/locales-para-eventos-madrid" />
        <meta property="og:title" content="Locales para eventos en Madrid | XPEAK Blog" />
        <meta property="og:description" content="Guía de salas, terrazas, azoteas y fincas para fiestas y despedidas en Madrid, con contacto directo de cada local." />
        <meta property="og:url" content="https://xpeak.es/blog/locales-para-eventos-madrid" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://xpeak.es/img/locales-madrid/generico-discoteca-1.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://xpeak.es/img/locales-madrid/generico-discoteca-1.jpg" />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>

      <div className="min-h-screen" style={{ background: '#ffffff', color: '#111' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-5xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#0D9488' }}>XPEAK</a>
          <div className="flex items-center gap-3">
            <a href="/blog" className="text-xs font-bold hidden sm:block" style={{ color: '#3d3d4e' }}>Blog</a>
            <a href="/auth?mode=register&role=empresario" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#0D9488,#B8941E)', color: '#000' }}>
              Unirse
            </a>
          </div>
        </nav>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-5 transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>

          {/* Hero con foto de ancho completo */}
          <div className="relative rounded-3xl overflow-hidden mb-8" style={{ height: 380 }}>
            <img src={emblematicos[0].foto} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(10,9,8,0) 0%, rgba(10,9,8,0.2) 40%, rgba(10,9,8,0.92) 100%)' }} />
            <div className="relative z-10 h-full flex flex-col justify-end p-6 sm:p-10">
              <span
                className="inline-flex items-center gap-1.5 w-fit text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-4"
                style={{ background: 'rgba(212,175,55,0.16)', border: '1px solid rgba(212,175,55,0.4)', color: '#D4AF37', backdropFilter: 'blur(4px)' }}
              >
                Organizadores · XPEAK Blog
              </span>
              <h1 className="font-black tracking-tight leading-[1.05] mb-3 text-white" style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(28px,5vw,46px)' }}>
                Locales para eventos en Madrid
              </h1>
              <p className="text-sm sm:text-base max-w-xl" style={{ color: 'rgba(255,255,255,0.75)' }}>
                Discotecas, terrazas, azoteas y fincas para despedidas, con web y contacto directo de cada espacio.
              </p>
            </div>
          </div>

          <div className="max-w-2xl">
            <p
              className="text-xl sm:text-2xl font-bold leading-snug mb-8 pl-5"
              style={{ fontFamily: "'Syne', sans-serif", borderLeft: '4px solid #D4AF37' }}
            >
              Encontrar local es solo el primer paso. Lo demás lo resuelves hablando directamente con cada uno.
            </p>

            <p className="text-base leading-relaxed mb-2" style={{ color: '#222' }}>
              Esta guía reúne locales reales de distintos barrios y tipos de Madrid, más algunas fincas a las afueras pensadas para despedidas de fin de semana completo. Cada local tiene su propia web o contacto, sin intermediarios.
            </p>

            <div className="flex flex-wrap gap-2 mt-6">
              {[
                ['emblematicas', 'Emblemáticas'],
                ['salas', 'Salas y discotecas'],
                ['bares', 'Bares con terraza'],
                ['rooftops', 'Rooftops'],
                ['huertas', 'Huertas y La Latina'],
                ['fincas', 'Fincas para despedidas'],
              ].map(([id, label]) => (
                <a key={id} href={`#${id}`} className="text-xs font-bold px-3.5 py-2 rounded-full transition-colors hover:opacity-70" style={{ background: '#fafaf8', border: '1px solid rgba(10,9,8,0.09)' }}>
                  {label}
                </a>
              ))}
            </div>
            <time className="text-xs mt-6 block" style={{ color: '#666' }}>21 septiembre 2026</time>
          </div>

          <SectionDivider id="emblematicas" title="Discotecas emblemáticas" />
          <Featured local={emblematicos[0]} />
          <Grid locales={emblematicos.slice(1)} />

          <SectionDivider id="salas" title="Salas y discotecas para fiesta privada" />
          <Grid locales={salas} />

          <SectionDivider id="bares" title="Bares con terraza o varias plantas" />
          <Grid locales={bares} />

          <SectionDivider id="rooftops" title="Terrazas y azoteas" />
          <Grid locales={terrazas} />

          <SectionDivider id="huertas" title="Huertas y La Latina" />
          <Grid locales={huertasLatina} />

          <SectionDivider id="fincas" title="Fincas para despedidas de soltero/a (1-2h de Madrid)" />
          <Featured local={fincas[0]} />
          <Grid locales={fincas.slice(1)} />

          <div className="max-w-2xl mt-14">
            <SectionDivider id="faq" title="Preguntas frecuentes" />
            <div className="space-y-4">
              {faqStructured.mainEntity.map((f) => (
                <div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}>
                  <p className="text-sm font-black mb-2">{f.name}</p>
                  <p className="text-sm leading-relaxed" style={{ color: '#333' }}>{f.acceptedAnswer.text}</p>
                </div>
              ))}
            </div>

            <div className="p-6 rounded-2xl text-center mt-10" style={{ background: 'rgba(13,148,136,0.04)', border: '1px solid rgba(13,148,136,0.12)' }}>
              <p className="text-sm font-black mb-2">Con el local decidido, falta el resto del equipo</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>
                En XPEAK encuentras profesionales para tu evento y los añades todos a un mismo carrito, sin buscar por separado.
              </p>
              <a href="/descubrir" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#0D9488,#B8941E)', color: '#000' }}>
                Ver directorio de profesionales →
              </a>
            </div>
          </div>
        </main>

        <BlogRelatedPosts currentSlug='/blog/locales-para-eventos-madrid' tag='Organizadores' />
        <FooterPublic />
        <BlogScrollCTA role="empresario" storageKey="xpeak_scrollcta_locales_madrid" articlePath="/blog/locales-para-eventos-madrid" />
      </div>
    </>
  );
}
