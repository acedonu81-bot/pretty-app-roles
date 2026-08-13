import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';
import DJResourcesAffiliate from '@/components/DJResourcesAffiliate';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Fotógrafo para comunión: precio y qué incluye en España (2026)', description: 'Cuánto cuesta un fotógrafo para una comunión en España. Precios por paquetes, qué incluye el reportaje y cómo elegir el mejor profesional.', datePublished: '2026-05-27', dateModified: '2026-05-27', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/fotografo-para-comunion-precio' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cuesta un fotógrafo para una comunión?', acceptedAnswer: { '@type': 'Answer', text: 'Un fotógrafo para comunión en España cuesta entre 300€ y 1.200€ según el paquete. Solo ceremonia (1-2h): 250-450€. Ceremonia + banquete (4-6h): 500-900€. Pack completo con álbum impreso: 700-1.500€. El precio varía según la ciudad y la experiencia del fotógrafo.' } },
  { '@type': 'Question', name: '¿Qué incluye el reportaje fotográfico de una comunión?', acceptedAnswer: { '@type': 'Answer', text: 'El reportaje completo incluye fotos de la preparación en casa, la ceremonia religiosa o civil, las fotos familiares en el exterior, el cóctel y el banquete. Se entregan entre 200 y 500 fotos editadas en alta resolución, normalmente en galería digital privada en 3-6 semanas.' } },
  { '@type': 'Question', name: '¿Necesito también videógrafo para la comunión?', acceptedAnswer: { '@type': 'Answer', text: 'Depende de tu presupuesto. Muchos fotógrafos ofrecen packs combinados fotógrafo + videógrafo por 900-2.000€. Si el presupuesto es ajustado, prioriza el fotógrafo — las fotos tienen más valor a largo plazo. Si tienes margen, el vídeo de la comunión suele ser muy emotivo para la familia.' } },
  { '@type': 'Question', name: '¿Con cuánta antelación reservar el fotógrafo de la comunión?', acceptedAnswer: { '@type': 'Answer', text: 'Las comuniones se concentran en mayo y junio, que son los meses más saturados para fotógrafos de eventos. Reserva con al menos 6-8 meses de antelación. Si la comunión es en sábado de mayo, empieza a buscar en octubre-noviembre del año anterior.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Fotógrafo comunión precio', item: 'https://xpeak.es/blog/fotografo-para-comunion-precio' }] };

const PAQUETES = [
  { pack: 'Solo ceremonia (1-2h)', precio: '250–450€', incluye: 'Iglesia/civil + fotos familia exterior' },
  { pack: 'Ceremonia + banquete (4-6h)', precio: '500–900€', incluye: 'Todo el evento, 200-400 fotos editadas' },
  { pack: 'Pack completo con álbum', precio: '700–1.500€', incluye: 'Reportaje completo + álbum impreso 30×30' },
  { pack: 'Fotógrafo + videógrafo', precio: '900–2.000€', incluye: 'Pack combinado, 2 profesionales' },
];

const CIUDADES = [
  { ciudad: 'Madrid', precio: '600–1.400€' },
  { ciudad: 'Barcelona', precio: '600–1.500€' },
  { ciudad: 'Valencia', precio: '450–1.100€' },
  { ciudad: 'Sevilla', precio: '400–1.000€' },
  { ciudad: 'Zaragoza / Bilbao', precio: '350–900€' },
  { ciudad: 'Ciudades medias', precio: '300–750€' },
];

export default function BlogFotografoComunion() {
  return (
    <>
      <Helmet>
        <title>Fotógrafo para comunión: precio y guía 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cuesta un fotógrafo para una comunión en España. Precios por paquetes, qué incluye el reportaje y cuándo reservar. Guía completa 2026." />
        <link rel="canonical" href="https://xpeak.es/blog/fotografo-para-comunion-precio" />
        <meta property="og:title" content="Fotógrafo para comunión: precio y guía 2026 — XPEAK Blog" />
        <meta property="og:description" content="Precios de fotógrafos para comuniones en España. Paquetes, qué incluye y cuándo reservar." />
        <meta property="og:url" content="https://xpeak.es/blog/fotografo-para-comunion-precio" />
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
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>Fotografía · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Fotógrafo para comunión: precio y qué incluye en España (2026)</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#3d3d4e' }}>Las fotos de la comunión son las que quedan en el álbum familiar para siempre. Te contamos cuánto cuesta un buen fotógrafo, qué incluye y cómo no equivocarte en la elección.</p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>27 mayo 2026</time>
          </div>

          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Precios por paquete de fotografía</h2>
              <div className="space-y-2">
                {PAQUETES.map((p, i) => (
                  <div key={p.pack} className="p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-xs font-bold">{p.pack}</p>
                      <span className="text-xs font-bold ml-3 shrink-0" style={{ color: '#D4AF37' }}>{p.precio}</span>
                    </div>
                    <p className="text-xs" style={{ color: '#3d3d4e' }}>{p.incluye}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Precios orientativos España 2026. Sin IVA. Álbum impreso aumenta entre 200-400€ el paquete base.</p>
            </section>

            <BlogInlineCTA role="fotografo" />

            <section>
              <h2 className="text-lg font-black mb-4">Precio del fotógrafo de comunión por ciudad</h2>
              <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <table className="w-full text-xs">
                  <thead>
                    <tr style={{ background: 'rgba(212,175,55,0.08)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <th className="text-left px-4 py-3 font-bold">Ciudad</th>
                      <th className="px-4 py-3 font-bold text-center">Rango (pack completo)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CIUDADES.map((row, i) => (
                      <tr key={row.ciudad} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td className="px-4 py-3 font-medium">{row.ciudad}</td>
                        <td className="px-4 py-3 text-center font-bold" style={{ color: '#D4AF37' }}>{row.precio}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-black mb-3">Qué preguntar al fotógrafo antes de contratar</h2>
              <div className="space-y-2">
                {[
                  '¿Cuántas fotos editadas entregará? (mínimo 200 para 5h)',
                  '¿En cuánto tiempo entrega la galería? (estándar: 3-6 semanas)',
                  '¿Incluye los derechos de impresión?',
                  '¿Ha fotografiado comuniones antes? Pide ver portfolio específico',
                  '¿Qué pasa si se pone enfermo el día del evento? ¿Tiene backup?',
                  '¿El álbum impreso está incluido o es un extra?',
                ].map((q, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ color: '#D4AF37', fontWeight: 700, fontSize: '0.7rem', marginTop: 1 }}>✓</span>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.72)' }}>{q}</p>
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
                  { href: '/blog/comuniones-guia-completa', cat: 'Hub Comuniones', title: 'Comuniones en España: guía completa 2026' },
                  { href: '/blog/contratar-fotografo-de-bodas', cat: 'Fotografía', title: 'Contratar fotógrafo de bodas: guía y precios' },
                  { href: '/blog/videografo-bodas-precio', cat: 'Fotografía', title: 'Videógrafo bodas: precio y qué incluye 2026' },
                  { href: '/blog/cuanto-cuesta-una-comunion-en-espana', cat: 'Comuniones', title: 'Cuánto cuesta una comunión en España 2026' },
                  { href: '/blog/dj-para-comunion-precio', cat: 'DJ', title: 'DJ para comunión: precio y qué incluye 2026' },
                  { href: '/blog/catering-comuniones-precio-persona', cat: 'Catering', title: 'Catering comuniones: precio por persona 2026' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.72)' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>

            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Buscas fotógrafo para la comunión?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>XPEAK tiene fotógrafos verificados para comuniones en toda España. Compara portfolios y contrata con contrato digital automático.</p>
              <a href="/contratar-fotografo" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Ver fotógrafos en XPEAK →</a>
            </div>
          </div>
                  <BlogEmailCapture variant="presupuestos" intent="contratar-staff" articlePath="/blog/fotografo-para-comunion-precio" />
</main>
        <DJResourcesAffiliate role="fotografo" />
        <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/fotografo-para-comunion-precio' tag='Fotografía' />
        <FooterPublic />
        <BlogScrollCTA role="fotografo" storageKey="xpeak_scrollcta_fotografo_comunion" />
      </div>
    </>
  );
}
