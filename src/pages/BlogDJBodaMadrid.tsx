import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';
import RelatedPosts from '@/components/RelatedPosts';
import BlogTopCTA from '@/components/BlogTopCTA';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'DJ para bodas en Madrid: precio y cómo contratar en 2026', description: 'Cuánto cuesta un DJ para una boda en Madrid. Precios reales, zonas de celebración y cómo elegir el mejor DJ para tu boda en la Comunidad de Madrid.', datePublished: '2026-05-28', dateModified: '2026-05-28', author: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/dj-bodas-madrid' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cuesta un DJ para una boda en Madrid?', acceptedAnswer: { '@type': 'Answer', text: 'Un DJ para boda en Madrid cuesta entre 800€ y 2.500€ para el servicio completo (ceremonia + cóctel + cena + pista de baile). Los precios en Madrid son un 20-30% más altos que la media nacional debido a la mayor demanda y coste de vida. Para bodas solo con pista de baile (4-5h), el rango es 500-1.000€.' } },
  { '@type': 'Question', name: '¿Dónde se celebran más bodas en Madrid?', acceptedAnswer: { '@type': 'Answer', text: 'Las zonas más populares para bodas en Madrid son: fincas en la Sierra Norte y Sierra de Guadarrama (Cercedilla, El Escorial, Miraflores), fincas al sur (Aranjuez, Chinchón) y espacios en la ciudad (palacios, hoteles de lujo, azoteas). Las fincas rurales concentran el 60% de las bodas en la Comunidad.' } },
  { '@type': 'Question', name: '¿Con cuánta antelación reservar el DJ de una boda en Madrid?', acceptedAnswer: { '@type': 'Answer', text: 'Madrid tiene una altísima demanda de DJs de bodas en primavera y otoño. Para bodas en sábados de mayo, junio, septiembre u octubre, reserva con mínimo 10-12 meses de antelación. Para bodas en julio, agosto o entre semana, 6-8 meses suelen ser suficientes.' } },
  { '@type': 'Question', name: '¿El DJ cobra desplazamiento en fincas fuera de Madrid capital?', acceptedAnswer: { '@type': 'Answer', text: 'Depende del DJ y la distancia. Muchos DJs de Madrid incluyen el desplazamiento dentro de un radio de 50-60 km. Para fincas más alejadas (Sierra, Toledo, Segovia), es habitual que cobren entre 0,25€ y 0,40€/km adicional o un suplemento fijo de 50-150€.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'DJ bodas Madrid', item: 'https://xpeak.es/blog/dj-bodas-madrid' }] };

const PRECIOS = [
  { servicio: 'Solo pista de baile (4-5h)', precio: '500–1.000€' },
  { servicio: 'Cóctel + pista de baile', precio: '700–1.300€' },
  { servicio: 'Servicio completo (ceremonia + cóctel + cena + pista)', precio: '900–2.000€' },
  { servicio: 'Pack premium con equipo de luces profesional', precio: '1.200–2.500€' },
];

const ZONAS = [
  { zona: 'Sierra Norte / Guadarrama', fincas: 'El Escorial, Cercedilla, Miraflores', nota: 'Rústicas con jardín, muy demandadas' },
  { zona: 'Sur de Madrid', fincas: 'Aranjuez, Chinchón, Valdemoro', nota: 'Más accesibles en precio' },
  { zona: 'Corredor del Henares', fincas: 'Alcalá, Guadalajara (limítrofe)', nota: 'Buena relación calidad-precio' },
  { zona: 'Madrid capital', fincas: 'Palacios, hoteles 5*, azoteas', nota: 'Las más caras, muy exclusivas' },
];

const serviceSchema = { '@context': 'https://schema.org', '@type': 'Service', name: 'DJs para bodas en Madrid', description: 'Encuentra y contrata DJs verificados para bodas y eventos en Madrid. Presupuestos gratuitos, contratos digitales y 0% comisión.', serviceType: 'DJ para bodas y eventos', areaServed: { '@type': 'City', name: 'Madrid' }, provider: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' }, url: 'https://xpeak.es/blog/dj-bodas-madrid', offers: { '@type': 'Offer', description: 'Presupuestos gratuitos de DJs verificados', price: '0', priceCurrency: 'EUR' } };

export default function BlogDJBodaMadrid() {
  return (
    <>
      <Helmet>
        <title>DJ para bodas en Madrid: precio 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cuesta un DJ para una boda en Madrid. Precios reales 2026, zonas de celebración y cómo contratar el mejor DJ en la Comunidad de Madrid." />
        <link rel="canonical" href="https://xpeak.es/blog/dj-bodas-madrid" />
        <meta property="og:title" content="DJ para bodas en Madrid: precio 2026 — XPEAK Blog" />
        <meta property="og:description" content="Precios reales de DJs de boda en Madrid. Zonas, desplazamiento y cómo elegir el perfil correcto." />
        <meta property="og:url" content="https://xpeak.es/blog/dj-bodas-madrid" />
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
            <a href="/blog" className="text-xs font-bold hidden sm:block" style={{ color: '#8E8EA0' }}>Blog</a>
            <a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Unirse gratis</a>
          </div>
        </nav>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#8E8EA0' }}>← Todos los artículos</a>

          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>DJ · Madrid · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">DJ para bodas en Madrid: precio y cómo contratar en 2026</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#8E8EA0' }}>Madrid concentra el mayor número de bodas de España. Los DJs de boda en la Comunidad tienen más demanda y precios más altos que la media nacional — te contamos exactamente cuánto y cómo encontrar el correcto.</p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>28 mayo 2026</time>
          </div>

          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Precios de DJ para boda en Madrid (2026)</h2>
              <div className="space-y-2">
                {PRECIOS.map((row, i) => (
                  <div key={row.servicio} className="flex items-center justify-between p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <p className="text-xs font-medium">{row.servicio}</p>
                    <span className="text-xs font-bold ml-4 shrink-0" style={{ color: '#D4AF37' }}>{row.precio}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-3" style={{ color: '#8E8EA0' }}>Precios específicos para la Comunidad de Madrid 2026. Sin IVA. Un 20-30% por encima de la media nacional.</p>
            </section>

            <BlogInlineCTA role="dj" />

            <section>
              <h2 className="text-lg font-black mb-4">Zonas de boda en Madrid y el DJ</h2>
              <div className="space-y-3">
                {ZONAS.map((z, i) => (
                  <div key={z.zona} className="p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-xs font-bold">{z.zona}</p>
                      <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded ml-3 shrink-0" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37' }}>{z.nota}</span>
                    </div>
                    <p className="text-xs" style={{ color: '#8E8EA0' }}>{z.fincas}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-3" style={{ color: '#8E8EA0' }}>Verifica siempre con el DJ el coste de desplazamiento si la finca está a más de 40 km de Madrid capital.</p>
            </section>

            <section>
              <h2 className="text-lg font-black mb-3">Qué diferencia a un DJ de bodas en Madrid</h2>
              <p className="text-sm leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.75)' }}>
                Madrid tiene un mercado de bodas exigente. Los DJs especializados en bodas en la Comunidad suelen tener experiencia en fincas con limitaciones de horario (muchas cierran a la 1:00 o 2:00), conocimiento de las particularidades acústicas de espacios con piedra o bóveda, y rodaje en coordinación con caterings de alto nivel.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
                También es habitual que los DJs de Madrid trabajen con equipos propios de alta gama (L-Acoustics, d&b audiotechnik) capaces de sonar bien en espacios grandes sin distorsión, algo crucial en fincas de más de 200 invitados.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">
                {faqStructured.mainEntity.map(f => (
                  <div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-sm font-bold mb-2">{f.name}</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>{f.a}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-8">
              <h2 className="text-base font-black mb-3" style={{ color: 'rgba(255,255,255,0.85)' }}>Artículos relacionados</h2>
              <div className="space-y-2">
                {[
                  { href: '/blog/cuanto-cobra-un-dj-en-espana', cat: 'DJ', title: 'Cuánto cobra un DJ en España: precios 2026' },
                  { href: '/blog/dj-para-eventos', cat: 'Hub DJ', title: 'DJ para eventos: guía completa 2026' },
                  { href: '/blog/musica-para-bodas-guia', cat: 'Bodas', title: 'Música para bodas: DJ, banda o playlist 2026' },
                  { href: '/blog/contrato-dj-que-debe-incluir', cat: 'Guía', title: 'Contrato DJ: qué debe incluir 2026' },
                  { href: '/blog/profesionales-bodas', cat: 'Hub Bodas', title: 'Profesionales para bodas: guía completa 2026' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.72)' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>

            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Buscas DJ para tu boda en Madrid?</p>
              <p className="text-xs mb-4" style={{ color: '#8E8EA0' }}>XPEAK tiene DJs especializados en bodas en Madrid y toda la Comunidad. Perfiles verificados, portfolios reales y contrato digital automático.</p>
              <a href="/contratar-dj/madrid" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Ver DJs de bodas en Madrid →</a>
            </div>
          </div>
                  <BlogEmailCapture variant="presupuestos" intent="contratar-dj" articlePath="/blog/dj-bodas-madrid" />
          <RelatedPosts currentSlug="/blog/dj-bodas-madrid" tags={['DJ', 'Bodas']} />
</main>
        <BlogAuthor />
        <FooterPublic />
      </div>
    </>
  );
}
