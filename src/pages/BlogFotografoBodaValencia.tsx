import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Fotógrafo para bodas en Valencia: precio y guía 2026', description: 'Cuánto cuesta un fotógrafo para una boda en Valencia. Precios reales 2026, fincas de L\'Albufera, estilo mediterráneo y cuándo reservar en la Comunitat.', datePublished: '2026-06-03', dateModified: '2026-06-03', author: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/fotografo-boda-valencia' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cuesta un fotógrafo de boda en Valencia?', acceptedAnswer: { '@type': 'Answer', text: 'Un fotógrafo de boda en Valencia cuesta entre 1.100€ y 3.000€ para el reportaje completo. Los precios en Valencia son ligeramente inferiores a Madrid y Barcelona — en la media nacional o hasta un 10% por encima. El reportaje completo con álbum ronda los 1.500-2.500€. Para reportajes de 4-5h sin álbum, el rango es 700-1.200€.' } },
  { '@type': 'Question', name: '¿Qué estilo fotográfico es más popular en bodas de Valencia?', acceptedAnswer: { '@type': 'Answer', text: 'En Valencia predomina el estilo mediterráneo luminoso: colores cálidos, mucha luz natural y localizaciones exteriores al atardecer. L\'Albufera y los arrozales son un backdrop muy fotogénico que los fotógrafos valencianos aprovechan para sesiones golden hour únicas en España. El estilo documental natural es el más demandado, con postprocesado cálido y saturado.' } },
  { '@type': 'Question', name: '¿Con cuánta antelación reservar el fotógrafo en Valencia?', acceptedAnswer: { '@type': 'Answer', text: 'Para bodas en junio y septiembre en Valencia, reserva con 8-12 meses de antelación. El mercado valenciano es muy activo en primavera tardía y otoño. Los mejores fotógrafos con estilo mediterráneo reconocido se agotan con mucha anticipación. Para bodas en julio o agosto, el calor extremo del interior aconseja buscar fincas con piscina — y los fotógrafos con experiencia en ese contexto.' } },
  { '@type': 'Question', name: '¿Merece la pena hacer sesión en L\'Albufera?', acceptedAnswer: { '@type': 'Answer', text: 'Sí, absolutamente. La sesión en barca por L\'Albufera al atardecer es única — el reflejo del cielo en el agua y la luz dorada dan resultados espectaculares. Muchos fotógrafos valencianos la ofrecen como sesión post-boda (trash the dress o simplemente sesión de pareja). Dura 1-2 horas y tiene un coste adicional de 150-300€ sobre el precio del reportaje base.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Fotógrafo boda Valencia', item: 'https://xpeak.es/blog/fotografo-boda-valencia' }] };
const PRECIOS = [
  { servicio: 'Reportaje básico (4-5h, sin álbum)', precio: '700–1.200€' },
  { servicio: 'Reportaje completo (8-10h, sin álbum)', precio: '1.100–2.000€' },
  { servicio: 'Reportaje completo con álbum impreso', precio: '1.500–3.000€' },
  { servicio: 'Pack fotógrafo + videógrafo', precio: '2.500–5.000€' },
];
export default function BlogFotografoBodaValencia() {
  return (
    <>
      <Helmet>
        <title>Fotógrafo para bodas en Valencia: precio 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cuesta un fotógrafo de boda en Valencia. Precios reales 2026, estilo mediterráneo, L'Albufera y cuándo reservar en la Comunitat Valenciana." />
        <link rel="canonical" href="https://xpeak.es/blog/fotografo-boda-valencia" />
        <meta property="og:title" content="Fotógrafo para bodas en Valencia: precio 2026 — XPEAK" />
        <meta property="og:description" content="Precios fotógrafos boda Valencia. Estilo mediterráneo, L'Albufera y cuándo reservar." />
        <meta property="og:url" content="https://xpeak.es/blog/fotografo-boda-valencia" />
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
            <a href="/blog" className="text-xs font-bold hidden sm:block" style={{ color: '#8E8EA0' }}>Blog</a>
            <a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Unirse gratis</a>
          </div>
        </nav>
        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#8E8EA0' }}>← Todos los artículos</a>
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>Fotografía · Valencia · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Fotógrafo para bodas en Valencia: precio y guía 2026</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#8E8EA0' }}>Valencia ofrece algo que ninguna otra ciudad española tiene: el atardecer sobre L'Albufera. Los fotógrafos valencianos son reconocidos por su estilo mediterráneo cálido y luminoso. Precios más competitivos que Madrid o Barcelona.</p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>3 junio 2026</time>
          </div>
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Precios fotógrafo de boda en Valencia (2026)</h2>
              <div className="space-y-2">
                {PRECIOS.map((row, i) => (
                  <div key={row.servicio} className="flex items-center justify-between p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <p className="text-xs font-medium">{row.servicio}</p>
                    <span className="text-xs font-bold ml-4 shrink-0" style={{ color: '#D4AF37' }}>{row.precio}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-3" style={{ color: '#8E8EA0' }}>Precios Valencia 2026. Sin IVA. En la media nacional, más económico que Madrid o Barcelona.</p>
            </section>
            <BlogInlineCTA role="fotografo" />
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
                  { href: '/blog/fotografos-eventos', cat: 'Hub Foto', title: 'Fotógrafos para eventos: guía completa 2026' },
                  { href: '/blog/profesionales-bodas', cat: 'Hub Bodas', title: 'Profesionales para bodas: guía completa 2026' },
                  { href: '/blog/fotografo-boda-madrid', cat: 'SEO Local', title: 'Fotógrafo para bodas en Madrid: precio 2026' },
                  { href: '/blog/fotografo-boda-barcelona', cat: 'SEO Local', title: 'Fotógrafo para bodas en Barcelona: precio 2026' },
                  { href: '/blog/dj-bodas-valencia', cat: 'SEO Local', title: 'DJ para bodas en Valencia: precio 2026' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.72)' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>
            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Buscas fotógrafo para tu boda en Valencia?</p>
              <p className="text-xs mb-4" style={{ color: '#8E8EA0' }}>XPEAK tiene fotógrafos verificados para bodas en Valencia, L'Albufera y toda la Comunitat. Portfolios reales y contrato digital automático.</p>
              <a href="/contratar-fotografo/valencia" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Ver fotógrafos en Valencia →</a>
            </div>
          </div>
                  <BlogEmailCapture variant="presupuestos" intent="contratar-staff" articlePath="/blog/fotografo-boda-valencia" />
</main>
        <FooterPublic />
      </div>
    </>
  );
}
