import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'DJ para bodas en Valencia: precio y cómo contratar en 2026', description: 'Cuánto cuesta un DJ para una boda en Valencia. Precios reales 2026, zonas de celebración y cómo contratar el mejor DJ en la Comunitat Valenciana.', datePublished: '2026-05-28', dateModified: '2026-05-28', author: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/dj-bodas-valencia' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cuesta un DJ para una boda en Valencia?', acceptedAnswer: { '@type': 'Answer', text: 'Un DJ para boda en Valencia cuesta entre 700€ y 1.800€ para el servicio completo. Los precios en Valencia están en la media nacional o ligeramente por encima (10-15%), más económicos que Madrid o Barcelona. Para bodas solo con pista de baile (4-5h), el rango es 400-900€.' } },
  { '@type': 'Question', name: '¿Cuándo es la temporada alta de bodas en Valencia?', acceptedAnswer: { '@type': 'Answer', text: 'En Valencia la temporada alta es abril-junio y septiembre-octubre. Destaca que abril coincide con el final de Fallas y la Semana Santa, lo que genera mucha competencia por DJs disponibles. Junio es el mes más demandado. El clima mediterráneo permite bodas casi todo el año.' } },
  { '@type': 'Question', name: '¿Qué diferencia tiene contratar un DJ en Valencia frente a Madrid?', acceptedAnswer: { '@type': 'Answer', text: 'En Valencia el mercado es menos saturado que Madrid y los precios son más competitivos (10-20% menos). Las fincas suelen tener menos restricciones de horario en zonas rurales. Sin embargo, las fincas cerca de l\'Albufera o el Marjal pueden tener normativas ambientales estrictas sobre ruido nocturno.' } },
  { '@type': 'Question', name: '¿El DJ cobra desplazamiento en fincas fuera de Valencia ciudad?', acceptedAnswer: { '@type': 'Answer', text: 'La mayoría de DJs de Valencia incluyen desplazamiento dentro de un radio de 50 km. Para fincas en la Marina Alta (Dénia, Jávea), la Safor o el interior, suelen cobrar entre 0,20€ y 0,35€/km adicional. Fincas en Alicante o Castellón pueden tener suplementos de 100-200€.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'DJ bodas Valencia', item: 'https://xpeak.es/blog/dj-bodas-valencia' }] };

const PRECIOS = [
  { servicio: 'Solo pista de baile (4-5h)', precio: '400–900€' },
  { servicio: 'Cóctel + pista de baile', precio: '600–1.200€' },
  { servicio: 'Servicio completo (ceremonia + cóctel + cena + pista)', precio: '800–1.800€' },
  { servicio: 'Pack premium con equipo de luces profesional', precio: '1.100–2.200€' },
];

const ZONAS = [
  { zona: "L'Albufera / Marjal", fincas: 'Cullera, Sueca, Algemesí', nota: 'Vistas al lago, muy fotogénicas' },
  { zona: 'La Safor / Marina Alta', fincas: 'Gandia, Oliva, Dénia, Jávea', nota: 'Ideal para invitados internacionales' },
  { zona: 'Camp de Túria / Serranos', fincas: 'Llíria, Pedralba, Vilamarxant', nota: 'Fincas rurales, más económicas' },
  { zona: 'Valencia capital', fincas: 'Jardines, palacios, hoteles 5*', nota: 'Las más exclusivas' },
];

const serviceSchema = { '@context': 'https://schema.org', '@type': 'Service', name: 'DJs para bodas en Valencia', description: 'Encuentra y contrata DJs verificados para bodas y eventos en Valencia. Presupuestos gratuitos, contratos digitales y 0% comisión.', serviceType: 'DJ para bodas y eventos', areaServed: { '@type': 'City', name: 'Valencia' }, provider: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' }, url: 'https://xpeak.es/blog/dj-bodas-valencia', offers: { '@type': 'Offer', description: 'Presupuestos gratuitos de DJs verificados', price: '0', priceCurrency: 'EUR' } };

export default function BlogDJBodaValencia() {
  return (
    <>
      <Helmet>
        <title>DJ para bodas en Valencia: precio 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cuesta un DJ para una boda en Valencia. Precios reales 2026, zonas de celebración y cómo contratar el mejor DJ en la Comunitat Valenciana." />
        <link rel="canonical" href="https://xpeak.es/blog/dj-bodas-valencia" />
        <meta property="og:title" content="DJ para bodas en Valencia: precio 2026 — XPEAK Blog" />
        <meta property="og:description" content="Precios reales de DJs de boda en Valencia. Zonas, Albufera, Marina Alta y cómo elegir el perfil correcto." />
        <meta property="og:url" content="https://xpeak.es/blog/dj-bodas-valencia" />
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
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>DJ · Valencia · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">DJ para bodas en Valencia: precio y cómo contratar en 2026</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#8E8EA0' }}>Valencia tiene uno de los mercados de bodas más activos de España gracias a su clima mediterráneo y la enorme variedad de fincas. Precios más competitivos que Madrid o Barcelona — te explicamos exactamente cuánto y cómo elegir bien.</p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>28 mayo 2026</time>
          </div>

          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Precios de DJ para boda en Valencia (2026)</h2>
              <div className="space-y-2">
                {PRECIOS.map((row, i) => (
                  <div key={row.servicio} className="flex items-center justify-between p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <p className="text-xs font-medium">{row.servicio}</p>
                    <span className="text-xs font-bold ml-4 shrink-0" style={{ color: '#D4AF37' }}>{row.precio}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-3" style={{ color: '#8E8EA0' }}>Precios específicos para la Comunitat Valenciana 2026. Sin IVA. En la media nacional, 10-20% más económico que Madrid o Barcelona.</p>
            </section>

            <BlogInlineCTA role="dj" />

            <section>
              <h2 className="text-lg font-black mb-4">Zonas de boda en Valencia y el DJ</h2>
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
              <p className="text-xs mt-3" style={{ color: '#8E8EA0' }}>Las fincas cerca de l'Albufera y zonas de huerta protegida pueden tener restricciones de ruido nocturno. Consulta con el venue antes de contratar.</p>
            </section>

            <section>
              <h2 className="text-lg font-black mb-3">Qué diferencia a un DJ de bodas en Valencia</h2>
              <p className="text-sm leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.75)' }}>
                Valencia tiene una escena musical muy rica: DJs locales con formación en electrónica, techno y música latina conviven en el mismo mercado. Para bodas, los DJs valencianos suelen tener experiencia en eventos grandes — la ciudad organiza festivales masivos que han profesionalizado mucho el sector.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
                Un punto a tener en cuenta es la temporada de Fallas (febrero-marzo): los DJs más demandados suelen estar totalmente reservados para esas fechas y para bodas de primavera que se solapan. Si tu boda es en abril, mayo o junio, reserva con al menos 9-10 meses de antelación para no quedarte sin opciones de calidad.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">
                {faqStructured.mainEntity.map(f => (
                  <div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-sm font-bold mb-2">{f.name}</p>
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
                  { href: '/blog/dj-bodas-barcelona', cat: 'SEO Local', title: 'DJ para bodas en Barcelona: precio 2026' },
                  { href: '/blog/cuanto-cobra-un-dj-en-espana', cat: 'DJ', title: 'Cuánto cobra un DJ en España: precios 2026' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.72)' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>

            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Buscas DJ para tu boda en Valencia?</p>
              <p className="text-xs mb-4" style={{ color: '#8E8EA0' }}>XPEAK tiene DJs especializados en bodas en Valencia, L'Albufera, Marina Alta y toda la Comunitat. Perfiles verificados, portfolios reales y contrato digital automático.</p>
              <a href="/contratar-dj/valencia" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Ver DJs de bodas en Valencia →</a>
            </div>
          </div>
                  <BlogEmailCapture variant="presupuestos" intent="contratar-dj" articlePath="/blog/dj-bodas-valencia" />
</main>
        <FooterPublic />
      </div>
    </>
  );
}
