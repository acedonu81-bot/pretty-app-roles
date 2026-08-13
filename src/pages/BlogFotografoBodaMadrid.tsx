import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';
import DJResourcesAffiliate from '@/components/DJResourcesAffiliate';
import BlogAnswerBox from '@/components/BlogAnswerBox';
import BlogTopCTA from '@/components/BlogTopCTA';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Fotógrafo para bodas en Madrid: precio y guía 2026', description: 'Cuánto cuesta un fotógrafo para una boda en Madrid. Precios reales 2026, zonas más demandadas y cómo elegir el mejor fotógrafo en la Comunidad de Madrid.', datePublished: '2026-06-02', dateModified: '2026-06-02', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/fotografo-boda-madrid' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cuesta un fotógrafo de boda en Madrid?', acceptedAnswer: { '@type': 'Answer', text: 'Un fotógrafo de boda en Madrid cuesta entre 1.500€ y 4.500€ para el reportaje completo. Madrid tiene la oferta más amplia de España y también los precios más altos. El rango medio para un reportaje completo (10-12h + álbum) es 2.500-3.500€. Para bodas en fincas de la Sierra o el sur, algunos fotógrafos añaden suplemento de desplazamiento de 50-150€.' } },
  { '@type': 'Question', name: '¿Qué incluye el reportaje de boda en Madrid?', acceptedAnswer: { '@type': 'Answer', text: 'Un reportaje completo de boda en Madrid incluye: preparativos en casa (novia y novio), ceremonia civil o religiosa, sesión exterior (golden hour en jardines o finca), cóctel y banquete hasta el baile. La entrega suele ser de 400-800 fotos editadas en alta resolución, en un plazo de 4-8 semanas. El álbum impreso se negocia aparte en muchos casos.' } },
  { '@type': 'Question', name: '¿Con cuánta antelación reservar el fotógrafo de boda en Madrid?', acceptedAnswer: { '@type': 'Answer', text: 'Madrid es el mercado de bodas más competitivo de España. Para bodas en sábados de mayo, junio o septiembre, reserva el fotógrafo con 12-18 meses de antelación. Los mejores fotógrafos de Madrid tienen agenda llena con 1-2 años de anticipación. Muchas parejas reservan el fotógrafo antes que la finca.' } },
  { '@type': 'Question', name: '¿Qué diferencia a los fotógrafos de boda de Madrid?', acceptedAnswer: { '@type': 'Answer', text: 'Madrid tiene una gran diversidad de estilos: desde el reportaje documental puro hasta el editorial de moda con mucha influencia del fotógrafo argentino-español que domina el mercado premium. Los fotógrafos madrileños son especialmente buenos en interiores con poca luz (fincas con bóveda, palacios, hoteles históricos) — un skill muy demandado dada la arquitectura de los venues de la Comunidad.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Fotógrafo boda Madrid', item: 'https://xpeak.es/blog/fotografo-boda-madrid' }] };

const PRECIOS = [
  { servicio: 'Reportaje básico (ceremonia + cóctel, 4-5h)', precio: '900–1.800€' },
  { servicio: 'Reportaje completo (10-12h, sin álbum)', precio: '1.500–3.000€' },
  { servicio: 'Reportaje completo con álbum de lujo', precio: '2.500–4.500€' },
  { servicio: 'Pack fotógrafo + videógrafo', precio: '3.500–6.500€' },
];

const ZONAS = [
  { zona: 'Sierra de Guadarrama / Norte', fincas: 'El Escorial, Cercedilla, Miraflores', nota: 'Las más demandadas, reserva ya' },
  { zona: 'Sur de Madrid', fincas: 'Aranjuez, Chinchón, Valdemoro', nota: 'Más accesibles, mucha luz' },
  { zona: 'Corredor del Henares', fincas: 'Alcalá, Guadalajara limítrofe', nota: 'Buena relación calidad-precio' },
  { zona: 'Madrid capital', fincas: 'Palacios, hoteles 5*, jardines', nota: 'Máxima exclusividad' },
];

export default function BlogFotografoBodaMadrid() {
  return (
    <>
      <Helmet>
        <title>Fotógrafo para bodas en Madrid: precio 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cuesta un fotógrafo de boda en Madrid. Precios reales 2026, zonas más demandadas (Sierra, Sur, capital) y cómo reservar con antelación." />
        <link rel="canonical" href="https://xpeak.es/blog/fotografo-boda-madrid" />
        <meta property="og:title" content="Fotógrafo para bodas en Madrid: precio 2026 — XPEAK" />
        <meta property="og:description" content="Precios reales de fotógrafos de boda en Madrid. Zonas, estilos y cuándo reservar." />
        <meta property="og:url" content="https://xpeak.es/blog/fotografo-boda-madrid" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
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
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>Fotografía · Madrid · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Fotógrafo para bodas en Madrid: precio y guía 2026</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#3d3d4e' }}>Madrid concentra más del 25% de las bodas de España y tiene la mayor densidad de fotógrafos especializados. Precios más altos que la media nacional — pero también la mayor variedad de estilos y perfiles.</p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>2 junio 2026</time>
          <BlogAnswerBox
            question="¿Cuánto cuesta un fotógrafo para una boda en Madrid?"
            answer="Un fotógrafo para el reportaje completo de una boda en Madrid (sin álbum impreso) cuesta entre 1.500 y 3.000€ en 2026. El precio final depende de las horas de cobertura, si incluye álbum físico y si se contrata también videógrafo."
          />

          </div>
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Precios fotógrafo de boda en Madrid (2026)</h2>
              <div className="space-y-2">
                {PRECIOS.map((row, i) => (
                  <div key={row.servicio} className="flex items-center justify-between p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <p className="text-xs font-medium">{row.servicio}</p>
                    <span className="text-xs font-bold ml-4 shrink-0" style={{ color: '#D4AF37' }}>{row.precio}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Precios Madrid 2026. Sin IVA. Un 20-35% por encima de la media nacional.</p>
            </section>
            <BlogInlineCTA role="fotografo" />
            <section>
              <h2 className="text-lg font-black mb-4">Zonas de boda en Madrid</h2>
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
                  { href: '/blog/fotografos-eventos', cat: 'Hub Foto', title: 'Fotógrafos para eventos: guía completa 2026' },
                  { href: '/blog/profesionales-bodas', cat: 'Hub Bodas', title: 'Profesionales para bodas: guía completa 2026' },
                  { href: '/blog/fotografo-boda-barcelona', cat: 'SEO Local', title: 'Fotógrafo para bodas en Barcelona: precio 2026' },
                  { href: '/blog/fotografo-comunion-madrid', cat: 'SEO Local', title: 'Fotógrafo comunión Madrid: precio 2026' },
                  { href: '/blog/videografo-bodas-precio', cat: 'Fotografía', title: 'Videógrafo bodas: precio y qué incluye 2026' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.72)' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>
            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Buscas fotógrafo para tu boda en Madrid?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>XPEAK tiene fotógrafos verificados para bodas en Madrid, Sierra Norte y toda la Comunidad. Portfolios reales, reseñas verificadas y contrato digital automático.</p>
              <a href="/contratar-fotografo/madrid" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Ver fotógrafos en Madrid →</a>
            </div>
          </div>
                  <BlogEmailCapture variant="presupuestos" intent="contratar-staff" articlePath="/blog/fotografo-boda-madrid" />
</main>
        <DJResourcesAffiliate role="fotografo" />
        <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/fotografo-boda-madrid' tag='Fotografía' />
        <FooterPublic />
        <BlogScrollCTA role="fotografo" storageKey="xpeak_scrollcta_fotografo_boda_madrid" />
      </div>
    </>
  );
}
