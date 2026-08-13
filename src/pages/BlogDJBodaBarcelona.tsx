import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';
import BlogAnswerBox from '@/components/BlogAnswerBox';
import DJResourcesAffiliate from '@/components/DJResourcesAffiliate';
import BlogTopCTA from '@/components/BlogTopCTA';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'DJ para bodas en Barcelona: precio y cómo contratar en 2026', description: 'Cuánto cuesta un DJ para una boda en Barcelona. Precios reales, zonas de celebración (Maresme, Penedès, Costa) y cómo contratar el mejor DJ en Cataluña.', datePublished: '2026-05-28', dateModified: '2026-05-28', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/dj-bodas-barcelona' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cuesta un DJ para una boda en Barcelona?', acceptedAnswer: { '@type': 'Answer', text: 'Un DJ para boda en Barcelona cuesta entre 800€ y 2.500€ para el servicio completo (ceremonia + cóctel + cena + pista). Los precios en Barcelona son comparables a Madrid, un 20-30% por encima de la media nacional. Para bodas solo con pista de baile (4-5h), el rango es 500-1.000€.' } },
  { '@type': 'Question', name: '¿Cuáles son las mejores zonas para casarse en Barcelona?', acceptedAnswer: { '@type': 'Answer', text: 'Las zonas más populares para bodas en Barcelona son: el Maresme (fincas con vistas al mar), el Penedès y Garraf (fincas entre viñedos, muy fotogénicas), la Costa Daurada (Tarragona, más económica) y Barcelona capital (palacios, hoteles de lujo, rooftops). El Maresme y el Penedès concentran el 65% de las bodas en la provincia.' } },
  { '@type': 'Question', name: '¿Con cuánta antelación reservar el DJ de una boda en Barcelona?', acceptedAnswer: { '@type': 'Answer', text: 'Barcelona tiene temporada alta muy marcada en junio y septiembre. Para bodas en sábados de mayo, junio, septiembre u octubre, reserva con mínimo 10-12 meses de antelación. El Maresme se agota antes que ninguna otra zona. Para bodas en julio, agosto o entre semana, 6-8 meses suelen ser suficientes.' } },
  { '@type': 'Question', name: '¿El DJ cobra desplazamiento en fincas fuera de Barcelona?', acceptedAnswer: { '@type': 'Answer', text: 'La mayoría de DJs de Barcelona cubren gratis desplazamientos dentro de la provincia (hasta 60-70 km). Para fincas en la Costa Daurada, el Penedès profundo o Girona, suelen cobrar entre 0,25€ y 0,40€/km adicional o un suplemento fijo de 50-150€. Siempre consulta antes de firmar.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'DJ bodas Barcelona', item: 'https://xpeak.es/blog/dj-bodas-barcelona' }] };

const PRECIOS = [
  { servicio: 'Solo pista de baile (4-5h)', precio: '500–1.000€' },
  { servicio: 'Cóctel + pista de baile', precio: '700–1.300€' },
  { servicio: 'Servicio completo (ceremonia + cóctel + cena + pista)', precio: '900–2.000€' },
  { servicio: 'Pack premium con equipo de luces profesional', precio: '1.200–2.500€' },
];

const ZONAS = [
  { zona: 'Maresme', fincas: 'Calella, Mataró, Blanes, Arenys', nota: 'Vistas al mar, muy demandadas' },
  { zona: 'Penedès / Garraf', fincas: 'Sitges, Vilafranca, El Vendrell', nota: 'Fincas entre viñedos' },
  { zona: 'Costa Daurada', fincas: 'Tarragona, Salou, Cambrils', nota: 'Más accesibles en precio' },
  { zona: 'Barcelona capital', fincas: 'Palacios, hoteles 5*, rooftops', nota: 'Las más exclusivas' },
];

const serviceSchema = { '@context': 'https://schema.org', '@type': 'Service', name: 'DJs para bodas en Barcelona', description: 'Encuentra y contrata DJs verificados para bodas y eventos en Barcelona. Presupuestos gratuitos, contratos digitales y 0% comisión.', serviceType: 'DJ para bodas y eventos', areaServed: { '@type': 'City', name: 'Barcelona' }, provider: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' }, url: 'https://xpeak.es/blog/dj-bodas-barcelona', offers: { '@type': 'Offer', description: 'Presupuestos gratuitos de DJs verificados', price: '0', priceCurrency: 'EUR' } };

export default function BlogDJBodaBarcelona() {
  return (
    <>
      <Helmet>
        <title>DJ para bodas en Barcelona: precio 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cuesta un DJ para una boda en Barcelona. Precios reales 2026, zonas de celebración (Maresme, Penedès, Costa) y cómo contratar el mejor DJ en Cataluña." />
        <link rel="canonical" href="https://xpeak.es/blog/dj-bodas-barcelona" />
        <meta property="og:title" content="DJ para bodas en Barcelona: precio 2026 — XPEAK Blog" />
        <meta property="og:description" content="Precios reales de DJs de boda en Barcelona. Zonas, Maresme, Penedès y cómo elegir el perfil correcto." />
        <meta property="og:url" content="https://xpeak.es/blog/dj-bodas-barcelona" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
      </Helmet>

      <div className="min-h-screen" style={{ background: '#090909', color: '#fff' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-3xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#D4AF37' }}>XPEAK</a>
          <div className="flex items-center gap-3">
            <a href="/blog" className="text-xs font-bold hidden sm:block" style={{ color: '#3d3d4e' }}>Blog</a>
            <a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Unirse gratis</a>
          </div>
        </nav>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>

          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>DJ · Barcelona · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">DJ para bodas en Barcelona: precio y cómo contratar en 2026</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#3d3d4e' }}>Barcelona es el segundo mercado de bodas más grande de España. El Maresme, el Penedès y los rooftops de la ciudad mueven miles de bodas cada año — te contamos cuánto cuesta un DJ y cómo encontrar el correcto.</p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>28 mayo 2026</time>
            <BlogAnswerBox
              question="¿Cuánto cuesta un DJ para una boda en Barcelona?"
              answer="Un DJ para el servicio completo de una boda en Barcelona (ceremonia, cóctel, cena y pista de baile) cuesta entre 900 y 2.000€ en 2026. El precio varía según la duración del evento, el equipo técnico incluido y la experiencia del DJ."
            />
          </div>

          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Precios de DJ para boda en Barcelona (2026)</h2>
              <div className="space-y-2">
                {PRECIOS.map((row, i) => (
                  <div key={row.servicio} className="flex items-center justify-between p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <p className="text-xs font-medium">{row.servicio}</p>
                    <span className="text-xs font-bold ml-4 shrink-0" style={{ color: '#D4AF37' }}>{row.precio}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Precios específicos para la provincia de Barcelona 2026. Sin IVA. Un 20-30% por encima de la media nacional.</p>
            </section>

            <BlogInlineCTA role="dj" />

            <section>
              <h2 className="text-lg font-black mb-4">Zonas de boda en Barcelona y el DJ</h2>
              <div className="space-y-3">
                {ZONAS.map((z, i) => (
                  <div key={z.zona} className="p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-xs font-bold">{z.zona}</p>
                      <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded ml-3 shrink-0" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37' }}>{z.nota}</span>
                    </div>
                    <p className="text-xs" style={{ color: '#3d3d4e' }}>{z.fincas}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Consulta siempre el suplemento de desplazamiento si la finca está a más de 40 km de Barcelona ciudad.</p>
            </section>

            <section>
              <h2 className="text-lg font-black mb-3">Qué diferencia a un DJ de bodas en Barcelona</h2>
              <p className="text-sm leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.75)' }}>
                El mercado de bodas en Barcelona es exigente y cosmopolita. Muchas fincas del Maresme y Garraf tienen limitaciones de horario nocturno y restricciones de decibelios marcadas por los ayuntamientos costeros. Un DJ con experiencia en la zona conoce estos límites y trabaja con equipos capaces de sonar bien a menor volumen sin perder impacto.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
                Otro factor diferencial en Barcelona es la presencia de invitados internacionales en bodas de expats o turistas residentes. Los DJs con repertorio bilingüe y experiencia en mezclar géneros (comercial español, pop internacional, tech house suave) son muy cotizados. Para fincas de más de 150 invitados en el Penedès, el sistema de audio exterior es clave — muchos DJs trabajan con riders específicos para exteriores.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">
                {faqStructured.mainEntity.map(f => (
                  <div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <h3 className="text-sm font-bold mb-2">{f.name}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>{f.acceptedAnswer.text}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-8">
              <h2 className="text-base font-black mb-3" style={{ color: 'rgba(255,255,255,0.85)' }}>Artículos relacionados</h2>
              <div className="space-y-2">
                {[
                  { href: '/blog/dj-para-eventos', cat: 'Hub DJ', title: 'DJ para eventos: guía completa de precios 2026' },
                  { href: '/blog/profesionales-bodas', cat: 'Hub Bodas', title: 'Profesionales para bodas: guía completa 2026' },
                  { href: '/blog/dj-bodas-madrid', cat: 'SEO Local', title: 'DJ para bodas en Madrid: precio 2026' },
                  { href: '/blog/cuanto-cobra-un-dj-en-espana', cat: 'DJ', title: 'Cuánto cobra un DJ en España: precios 2026' },
                  { href: '/blog/musica-para-bodas-guia', cat: 'Bodas', title: 'Música para bodas: DJ, banda o playlist 2026' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.72)' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>

            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Buscas DJ para tu boda en Barcelona?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>XPEAK tiene DJs especializados en bodas en Barcelona, Maresme, Penedès y toda Cataluña. Perfiles verificados, portfolios reales y contrato digital automático.</p>
              <a href="/contratar-dj/barcelona" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Ver DJs de bodas en Barcelona →</a>
            </div>
          </div>
                  <BlogEmailCapture variant="presupuestos" intent="contratar-dj" articlePath="/blog/dj-bodas-barcelona" />
                  <DJResourcesAffiliate />
</main>
        <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/dj-bodas-barcelona' tag='DJ' />
        <FooterPublic />
        <BlogScrollCTA role="dj" storageKey="xpeak_scrollcta_dj_boda_barcelona" />
      </div>
    </>
  );
}
