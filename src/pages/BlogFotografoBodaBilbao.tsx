import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';
import BlogAnswerBox from '@/components/BlogAnswerBox';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Fotógrafo para bodas en Bilbao: precio y guía 2026', description: 'Cuánto cuesta un fotógrafo para una boda en Bilbao. Precios reales 2026, Caseríos vascos, arquitectura industrial y la luz especial del Cantábrico.', datePublished: '2026-06-03', dateModified: '2026-06-03', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/fotografo-boda-bilbao' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cuesta un fotógrafo de boda en Bilbao?', acceptedAnswer: { '@type': 'Answer', text: 'Un fotógrafo de boda en Bilbao cuesta entre 1.200€ y 3.500€ para el reportaje completo. Los precios en el País Vasco son similares a Barcelona, un 15-25% por encima de la media nacional. Para bodas en caseríos del interior, los precios son similares; para bodas en hoteles de lujo o palacios del casco viejo, pueden subir.' } },
  { '@type': 'Question', name: '¿Qué estilo fotográfico es más popular en Bilbao?', acceptedAnswer: { '@type': 'Answer', text: 'Los fotógrafos vascos destacan por el estilo documental naturalista: aprovechan la luz suave y difusa del norte, muy favorecedora para los retratos, y los espacios de los caseríos con piedra y madera. El Guggenheim, el casco viejo y el puerto de Getxo son localizaciones muy usadas para sesiones. El minimalismo y la autenticidad caracterizan la fotografía de boda vasca.' } },
  { '@type': 'Question', name: '¿Con cuánta antelación reservar el fotógrafo en Bilbao?', acceptedAnswer: { '@type': 'Answer', text: 'En Bilbao se celebran bodas todo el año gracias al clima templado. Los meses más demandados son junio, septiembre y octubre. Para sábados de estos meses, reserva con 8-12 meses de antelación. Diciembre también tiene bodas muy especiales en caseríos con ambiente único.' } },
  { '@type': 'Question', name: '¿Qué tener en cuenta al contratar fotógrafo en Bilbao?', acceptedAnswer: { '@type': 'Answer', text: 'La lluvia es el gran factor. Los fotógrafos de bodas en el País Vasco tienen experiencia con lluvia y saben aprovecharla: reflejos en el suelo mojado, ambiente dramático, luz difusa perfecta para retratos. Si tu boda es al aire libre en Bilbao, asegúrate de que el fotógrafo tenga plan B para lluvia.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Fotógrafo boda Bilbao', item: 'https://xpeak.es/blog/fotografo-boda-bilbao' }] };
const PRECIOS = [
  { servicio: 'Reportaje básico (4-5h, sin álbum)', precio: '800–1.400€' },
  { servicio: 'Reportaje completo (8-10h, sin álbum)', precio: '1.300–2.200€' },
  { servicio: 'Reportaje completo con álbum impreso', precio: '1.800–3.200€' },
  { servicio: 'Pack fotógrafo + videógrafo', precio: '2.800–5.000€' },
];
export default function BlogFotografoBodaBilbao() {
  return (
    <>
      <Helmet>
        <title>Fotógrafo para bodas en Bilbao: precio 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cuesta un fotógrafo de boda en Bilbao. Precios reales 2026, Caseríos vascos, arquitectura industrial y la luz especial del Cantábrico." />
        <link rel="canonical" href="https://xpeak.es/blog/fotografo-boda-bilbao" />
        <meta property="og:title" content="Fotógrafo para bodas en Bilbao: precio 2026 — XPEAK" />
        <meta property="og:description" content="Precios fotógrafos boda Bilbao. Caseríos vascos, arquitectura industrial y la luz especial del Cantábrico." />
        <meta property="og:url" content="https://xpeak.es/blog/fotografo-boda-bilbao" />
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
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>Fotografía · Bilbao · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Fotógrafo para bodas en Bilbao: precio y guía 2026</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#3d3d4e' }}>Los fotógrafos de bodas en el País Vasco tienen una ventaja única: los caseríos centenarios, la luz suave del Cantábrico y los espacios industriales reconvertidos crean un estilo fotográfico muy reconocible. La escena fotográfica vasca es pequeña pero de gran nivel, con fotógrafos que trabajan todo el año gracias al clima templado.</p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>3 junio 2026</time>
          <BlogAnswerBox
            question="¿Cuánto cuesta un fotógrafo para una boda en Bilbao?"
            answer="Un fotógrafo para el reportaje completo de una boda en Bilbao (sin álbum impreso) cuesta entre 1.300 y 2.200€ en 2026. El precio final depende de las horas de cobertura, si incluye álbum físico y si se contrata también videógrafo."
          />

          </div>
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Precios fotógrafo de boda en Bilbao (2026)</h2>
              <div className="space-y-2">
                {PRECIOS.map((row, i) => (
                  <div key={row.servicio} className="flex items-center justify-between p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <p className="text-xs font-medium">{row.servicio}</p>
                    <span className="text-xs font-bold ml-4 shrink-0" style={{ color: '#D4AF37' }}>{row.precio}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Precios Bilbao 2026. Sin IVA.</p>
            </section>
            <BlogInlineCTA role="fotografo" />
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
                  { href: '/blog/dj-bodas-bilbao', cat: 'SEO Local', title: 'DJ para bodas en Bilbao: precio 2026' },
                  { href: '/blog/fotografo-boda-madrid', cat: 'SEO Local', title: 'Fotógrafo para bodas en Madrid: precio 2026' },
                  { href: '/blog/contratar-fotografo-de-bodas', cat: 'Fotografía', title: 'Contratar fotógrafo de bodas: guía y precios' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.72)' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>
            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Buscas fotógrafo para tu boda en Bilbao?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>XPEAK tiene fotógrafos verificados para bodas en Bilbao y el País Vasco. Portfolios reales y contrato digital automático.</p>
              <a href="/contratar-fotografo/bilbao" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Ver fotógrafos en Bilbao →</a>
            </div>
          </div>
                  <BlogEmailCapture variant="presupuestos" intent="contratar-staff" articlePath="/blog/fotografo-boda-bilbao" />
</main>
        <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/fotografo-boda-bilbao' tag='Fotografía' />
        <FooterPublic />
        <BlogScrollCTA role="fotografo" storageKey="xpeak_scrollcta_fotografo_boda_bilbao" />
      </div>
    </>
  );
}
