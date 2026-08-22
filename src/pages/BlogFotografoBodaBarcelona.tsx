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

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Fotógrafo para bodas en Barcelona: precio y guía 2026', description: 'Cuánto cuesta un fotógrafo para una boda en Barcelona. Precios reales 2026, estilos más demandados y cómo contratar el mejor fotógrafo en Cataluña.', datePublished: '2026-06-02', dateModified: '2026-06-02', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/fotografo-boda-barcelona' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cuesta un fotógrafo de boda en Barcelona?', acceptedAnswer: { '@type': 'Answer', text: 'Un fotógrafo de boda en Barcelona cuesta entre 1.400€ y 4.000€ para el reportaje completo. Barcelona tiene una escena fotográfica muy activa con muchos profesionales de nivel internacional. El rango medio para un reportaje completo con álbum es 2.000-3.000€. Para bodas solo de ceremonia y cóctel (4-5h) el rango es 800-1.500€.' } },
  { '@type': 'Question', name: '¿Qué estilo fotográfico es más popular en bodas de Barcelona?', acceptedAnswer: { '@type': 'Answer', text: 'En Barcelona predominan dos estilos: el reportaje documental (fotoperiodismo de boda) — natural, sin posados forzados, con mucha luz ambiente — y el editorial mediterráneo, con sesiones golden hour en entornos naturales del Maresme o Penedès. El estilo oscuro y moody tiene menos presencia que en Madrid. Los novios barceloneses suelen priorizar autenticidad sobre perfección técnica.' } },
  { '@type': 'Question', name: '¿Con cuánta antelación reservar el fotógrafo en Barcelona?', acceptedAnswer: { '@type': 'Answer', text: 'Para bodas en sábados de junio o septiembre en Barcelona, reserva con 12-14 meses de antelación. Los mejores fotógrafos de estilo documental en Barcelona tienen lista de espera. Para bodas en otoño-invierno o entre semana, 6-8 meses suelen ser suficientes.' } },
  { '@type': 'Question', name: '¿Vale la pena contratar fotógrafo y videógrafo juntos en Barcelona?', acceptedAnswer: { '@type': 'Answer', text: 'Sí, muchos fotógrafos de bodas en Barcelona trabajan con videomakers de confianza y ofrecen packs con descuento del 10-20%. El pack fotógrafo + videógrafo en Barcelona ronda los 3.000-5.500€. Si el presupuesto es ajustado, prioriza el fotógrafo — las fotos tienen más uso a largo plazo que el vídeo.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Fotógrafo boda Barcelona', item: 'https://xpeak.es/blog/fotografo-boda-barcelona' }] };

const PRECIOS = [
  { servicio: 'Reportaje básico (ceremonia + cóctel, 4-5h)', precio: '800–1.500€' },
  { servicio: 'Reportaje completo (8-10h, sin álbum)', precio: '1.400–2.500€' },
  { servicio: 'Reportaje completo con álbum impreso', precio: '2.000–4.000€' },
  { servicio: 'Pack fotógrafo + videógrafo', precio: '3.000–5.500€' },
];

export default function BlogFotografoBodaBarcelona() {
  return (
    <>
      <Helmet>
        <title>Fotógrafo para bodas en Barcelona: precio 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cuesta un fotógrafo de boda en Barcelona. Precios reales 2026, estilos más demandados (documental, editorial) y cuándo reservar." />
        <link rel="canonical" href="https://xpeak.es/blog/fotografo-boda-barcelona" />
        <meta property="og:title" content="Fotógrafo para bodas en Barcelona: precio 2026 — XPEAK" />
        <meta property="og:description" content="Precios reales de fotógrafos de boda en Barcelona. Estilos, packs y cuándo reservar." />
        <meta property="og:url" content="https://xpeak.es/blog/fotografo-boda-barcelona" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>
      <div className="min-h-screen" style={{ background: '#ffffff', color: '#111' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-3xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#4F46E5' }}>XPEAK</a>
          <div className="flex items-center gap-3">
            <a href="/blog" className="text-xs font-bold hidden sm:block" style={{ color: '#3d3d4e' }}>Blog</a>
            <a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#4F46E5,#B8941E)', color: '#000' }}>Unirse gratis</a>
          </div>
        </nav>
        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#4F46E5' }}>Fotografía · Barcelona · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Fotógrafo para bodas en Barcelona: precio y guía 2026</h1>
            <p className="text-base leading-relaxed" style={{ color: '#3d3d4e' }}>Barcelona tiene una de las escenas de fotografía de bodas más activas de Europa. Desde el documental puro hasta el editorial mediterráneo — precios reales y cómo encontrar el estilo que se adapta a tu boda.</p>
            <time className="text-xs mt-3 block" style={{ color: '#666' }}>2 junio 2026</time>
          <BlogAnswerBox
            question="¿Cuánto cuesta un fotógrafo para una boda en Barcelona?"
            answer="Un fotógrafo para el reportaje completo de una boda en Barcelona (sin álbum impreso) cuesta entre 1.400 y 2.500€ en 2026. El precio final depende de las horas de cobertura, si incluye álbum físico y si se contrata también videógrafo."
          />

          </div>
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Precios fotógrafo de boda en Barcelona (2026)</h2>
              <div className="space-y-2">
                {PRECIOS.map((row, i) => (
                  <div key={row.servicio} className="flex items-center justify-between p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(0,0,0,0.025)' : 'rgba(0,0,0,0.015)', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <p className="text-xs font-medium">{row.servicio}</p>
                    <span className="text-xs font-bold ml-4 shrink-0" style={{ color: '#4F46E5' }}>{row.precio}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Precios Barcelona 2026. Sin IVA. Similar a Madrid, un 20-30% por encima de la media nacional.</p>
            </section>
            <BlogInlineCTA role="fotografo" />
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
                  { href: '/blog/fotografos-eventos', cat: 'Hub Foto', title: 'Fotógrafos para eventos: guía completa 2026' },
                  { href: '/blog/profesionales-bodas', cat: 'Hub Bodas', title: 'Profesionales para bodas: guía completa 2026' },
                  { href: '/blog/fotografo-comunion-madrid', cat: 'SEO Local', title: 'Fotógrafo comunión Madrid: precio 2026' },
                  { href: '/blog/videografo-bodas-precio', cat: 'Fotografía', title: 'Videógrafo bodas: precio y qué incluye 2026' },
                  { href: '/blog/contratar-fotografo-de-bodas', cat: 'Fotografía', title: 'Contratar fotógrafo de bodas: guía y precios' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(79,70,229,0.1)', color: '#4F46E5', border: '1px solid rgba(79,70,229,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: '#222' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>
            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(79,70,229,0.04)', border: '1px solid rgba(79,70,229,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Buscas fotógrafo para tu boda en Barcelona?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>XPEAK tiene fotógrafos verificados para bodas en Barcelona, Maresme y Penedès. Portfolios reales, reseñas verificadas y contrato digital automático.</p>
              <a href="/contratar-fotografo/barcelona" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#4F46E5,#B8941E)', color: '#000' }}>Ver fotógrafos en Barcelona →</a>
            </div>
          </div>
                  <BlogEmailCapture variant="presupuestos" intent="contratar-staff" articlePath="/blog/fotografo-boda-barcelona" />
</main>
        <DJResourcesAffiliate role="fotografo" />
        <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/fotografo-boda-barcelona' tag='Fotografía' />
        <FooterPublic />
        <BlogScrollCTA role="fotografo" storageKey="xpeak_scrollcta_fotografo_boda_barcelona" />
      </div>
    </>
  );
}
