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

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'DJ para bodas en Málaga: precio y cómo contratar en 2026', description: 'Cuánto cuesta un DJ para una boda en Málaga. Precios reales 2026, zonas de celebración (Costa del Sol, Serranía, Antequera) y cómo contratar el mejor DJ.', datePublished: '2026-06-02', dateModified: '2026-06-02', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/dj-bodas-malaga' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cuesta un DJ para una boda en Málaga?', acceptedAnswer: { '@type': 'Answer', text: 'Un DJ para boda en Málaga cuesta entre 600€ y 1.800€ para el servicio completo. La Costa del Sol (Marbella, Estepona) tiene precios más altos por la concentración de bodas internacionales y de lujo, llegando hasta 2.500€ para servicios premium. Para bodas solo con pista (4-5h) el rango es 350-800€.' } },
  { '@type': 'Question', name: '¿Cuándo es temporada alta de bodas en Málaga?', acceptedAnswer: { '@type': 'Answer', text: 'En Málaga la temporada alta es mayo-junio y septiembre-octubre. El clima permite bodas prácticamente todo el año, aunque julio y agosto son muy calurosos en el interior. La Costa del Sol tiene demanda también en invierno por bodas de extranjeros residentes. Los sábados de septiembre y octubre se reservan con 12-14 meses de antelación.' } },
  { '@type': 'Question', name: '¿Qué diferencia hay entre contratar un DJ en Marbella vs Málaga capital?', acceptedAnswer: { '@type': 'Answer', text: 'Marbella y la Costa del Sol tienen un mercado de bodas de lujo con clientes internacionales y presupuestos muy altos. Los DJs especializados en esa zona cobran un 30-50% más que en Málaga capital o el interior. Si tu boda es en Marbella, busca DJs con experiencia en bodas internacionales y con capacidad para adaptar el repertorio a distintas culturas.' } },
  { '@type': 'Question', name: '¿El DJ habla inglés para bodas internacionales en la Costa del Sol?', acceptedAnswer: { '@type': 'Answer', text: 'Sí, muchos DJs de la Costa del Sol tienen experiencia con bodas de clientes extranjeros (ingleses, escandinavos, alemanes) y pueden hacer el MC en inglés o bilingüe. Es un diferencial importante en esa zona — especifica en tu búsqueda que necesitas DJ con inglés si es tu caso.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'DJ bodas Málaga', item: 'https://xpeak.es/blog/dj-bodas-malaga' }] };

const PRECIOS = [
  { servicio: 'Solo pista de baile (4-5h)', precio: '350–800€' },
  { servicio: 'Cóctel + pista de baile', precio: '550–1.200€' },
  { servicio: 'Servicio completo (ceremonia + cóctel + cena + pista)', precio: '700–1.800€' },
  { servicio: 'Pack premium Costa del Sol / Marbella', precio: '1.200–2.500€' },
];

const ZONAS = [
  { zona: 'Costa del Sol Occidental', fincas: 'Marbella, Estepona, Benahavís', nota: 'Bodas de lujo e internacionales' },
  { zona: 'Costa del Sol Oriental', fincas: 'Nerja, Torrox, Frigiliana', nota: 'Más auténtico, vistas al mar' },
  { zona: 'Serranía de Ronda', fincas: 'Ronda, Gaucín, Benaoján', nota: 'Fincas con paisaje espectacular' },
  { zona: 'Antequera / interior', fincas: 'Antequera, Archidona, Loja', nota: 'Cortijos amplios, más económicos' },
];

const serviceSchema = { '@context': 'https://schema.org', '@type': 'Service', name: 'DJs para bodas en Málaga', description: 'Encuentra y contrata DJs verificados para bodas y eventos en Málaga. Presupuestos gratuitos, contratos digitales y 0% comisión.', serviceType: 'DJ para bodas y eventos', areaServed: { '@type': 'City', name: 'Málaga' }, provider: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' }, url: 'https://xpeak.es/blog/dj-bodas-malaga', offers: { '@type': 'Offer', description: 'Presupuestos gratuitos de DJs verificados', price: '0', priceCurrency: 'EUR' } };

export default function BlogDJBodaMalaga() {
  return (
    <>
      <Helmet>
        <title>DJ para bodas en Málaga: precio 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cuesta un DJ para una boda en Málaga. Precios reales 2026, Costa del Sol, Serranía de Ronda y cómo contratar el mejor DJ en la provincia." />
        <link rel="canonical" href="https://xpeak.es/blog/dj-bodas-malaga" />
        <meta property="og:title" content="DJ para bodas en Málaga: precio 2026 — XPEAK Blog" />
        <meta property="og:description" content="Precios reales de DJs de boda en Málaga. Costa del Sol, Ronda y cómo elegir el perfil correcto." />
        <meta property="og:url" content="https://xpeak.es/blog/dj-bodas-malaga" />
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
      <div className="min-h-screen" style={{ background: '#ffffff', color: '#111' }}>
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
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>DJ · Málaga · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">DJ para bodas en Málaga: precio y cómo contratar en 2026</h1>
            <p className="text-base leading-relaxed" style={{ color: '#3d3d4e' }}>Málaga tiene dos mercados de bodas muy distintos: la Costa del Sol internacional y de lujo, y el interior con cortijos y fincas tradicionales más accesibles. Te explicamos precios para cada zona y cómo elegir el DJ correcto para cada tipo de boda.</p>
            <time className="text-xs mt-3 block" style={{ color: '#666' }}>2 junio 2026</time>
            <BlogAnswerBox
              question="¿Cuánto cuesta un DJ para una boda en Málaga?"
              answer="Un DJ para el servicio completo de una boda en Málaga (ceremonia, cóctel, cena y pista de baile) cuesta entre 700 y 1.800€ en 2026. El precio varía según la duración del evento, el equipo técnico incluido y la experiencia del DJ."
            />
          </div>
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Precios de DJ para boda en Málaga (2026)</h2>
              <div className="space-y-2">
                {PRECIOS.map((row, i) => (
                  <div key={row.servicio} className="flex items-center justify-between p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(0,0,0,0.025)' : 'rgba(0,0,0,0.015)', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <p className="text-xs font-medium">{row.servicio}</p>
                    <span className="text-xs font-bold ml-4 shrink-0" style={{ color: '#D4AF37' }}>{row.precio}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Precios para Málaga provincia 2026. Sin IVA. Marbella y Costa del Sol Occidental tienen precios un 30-50% más altos.</p>
            </section>
            <BlogInlineCTA role="dj" />
            <section>
              <h2 className="text-lg font-black mb-4">Zonas de boda en Málaga</h2>
              <div className="space-y-3">
                {ZONAS.map((z, i) => (
                  <div key={z.zona} className="p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(0,0,0,0.025)' : 'rgba(0,0,0,0.015)', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-xs font-bold">{z.zona}</p>
                      <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded ml-3 shrink-0" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37' }}>{z.nota}</span>
                    </div>
                    <p className="text-xs" style={{ color: '#3d3d4e' }}>{z.fincas}</p>
                  </div>
                ))}
              </div>
            </section>
            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">
                {faqStructured.mainEntity.map(f => (
                  <div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}>
                    <h3 className="text-sm font-bold mb-2">{f.name}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#222' }}>{f.acceptedAnswer.text}</p>
                  </div>
                ))}
              </div>
            </section>
            <section className="mt-8">
              <h2 className="text-base font-black mb-3" style={{ color: '#111' }}>Artículos relacionados</h2>
              <div className="space-y-2">
                {[
                  { href: '/blog/dj-para-eventos', cat: 'Hub DJ', title: 'DJ para eventos: guía completa de precios 2026' },
                  { href: '/blog/profesionales-bodas', cat: 'Hub Bodas', title: 'Profesionales para bodas: guía completa 2026' },
                  { href: '/blog/dj-bodas-sevilla', cat: 'SEO Local', title: 'DJ para bodas en Sevilla: precio 2026' },
                  { href: '/blog/dj-bodas-madrid', cat: 'SEO Local', title: 'DJ para bodas en Madrid: precio 2026' },
                  { href: '/blog/cuanto-cobra-un-dj-en-espana', cat: 'DJ', title: 'Cuánto cobra un DJ en España: precios 2026' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: '#222' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>
            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Buscas DJ para tu boda en Málaga?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>XPEAK tiene DJs especializados en bodas en Málaga, Costa del Sol y Andalucía. Perfiles verificados con experiencia en bodas nacionales e internacionales.</p>
              <a href="/contratar-dj/malaga" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Ver DJs de bodas en Málaga →</a>
            </div>
          </div>
                  <DJResourcesAffiliate role="dj" />

                  <BlogEmailCapture variant="presupuestos" intent="contratar-dj" articlePath="/blog/dj-bodas-malaga" />
</main>
        <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/dj-bodas-malaga' tag='DJ' />
        <FooterPublic />
        <BlogScrollCTA role="dj" storageKey="xpeak_scrollcta_dj_boda_malaga" />
      </div>
    </>
  );
}
