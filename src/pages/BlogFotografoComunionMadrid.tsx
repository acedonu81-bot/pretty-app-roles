import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';
import DJResourcesAffiliate from '@/components/DJResourcesAffiliate';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Fotógrafo para comunión en Madrid: precio y guía 2026', description: 'Cuánto cuesta un fotógrafo para una comunión en Madrid. Precios reales 2026 con el sobrecoste de la capital y cómo elegir el mejor fotógrafo para tu comunión.', datePublished: '2026-05-28', dateModified: '2026-05-28', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/fotografo-comunion-madrid' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cuesta un fotógrafo de comunión en Madrid?', acceptedAnswer: { '@type': 'Answer', text: 'Un fotógrafo de comunión en Madrid cuesta entre 400€ y 1.500€. El reportaje completo (ceremonia + sesión exterior + banquete) ronda los 600-1.200€. Los precios en Madrid son un 20-30% superiores a la media nacional. Un reportaje básico de 2-3h puede conseguirse desde 350-600€.' } },
  { '@type': 'Question', name: '¿Cuánto dura un reportaje de comunión?', acceptedAnswer: { '@type': 'Answer', text: 'Un reportaje de comunión completo dura entre 5 y 8 horas: 1h de preparativos en casa, 1-1.5h de ceremonia, 30-45 min de sesión exterior, 1-2h de cóctel y 1-2h de banquete. Muchos fotógrafos ofrecen paquetes de 4-5h sin los preparativos, más económicos, si el banquete es corto.' } },
  { '@type': 'Question', name: '¿Con cuánta antelación reservar el fotógrafo de comunión en Madrid?', acceptedAnswer: { '@type': 'Answer', text: 'En Madrid, mayo y junio están copados. Para comuniones en esos meses (especialmente sábados), reserva con 6-8 meses de antelación mínimo. Los fotógrafos especializados en comuniones en Madrid se agotan antes que en otras ciudades. Para comuniones en septiembre o entre semana, 3-4 meses son suficientes.' } },
  { '@type': 'Question', name: '¿Qué diferencia al fotógrafo de comunión del de bodas?', acceptedAnswer: { '@type': 'Answer', text: 'El fotógrafo de comunión trabaja con niños de 9-12 años — requiere más paciencia, capacidad para dirigir grupos de niños y dominar el movimiento rápido. La edición también es diferente: tonos más cálidos, encuadres más amplios para capturar el dinamismo. Los reportajes son más cortos (5-8h vs 10-12h de boda) y el precio es proporcionalmente menor.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Fotógrafo comunión Madrid', item: 'https://xpeak.es/blog/fotografo-comunion-madrid' }] };

const PRECIOS = [
  { servicio: 'Reportaje básico (ceremonia, 2-3h)', precio: '350–650€' },
  { servicio: 'Reportaje completo (ceremonia + exterior + banquete)', precio: '600–1.200€' },
  { servicio: 'Pack fotógrafo + vídeo de comunión', precio: '900–1.800€' },
  { servicio: 'Reportaje con álbum impreso de lujo', precio: '1.000–2.000€' },
];

const MOMENTOS = [
  { momento: 'Preparativos en casa', desc: 'Vestido, detalles del traje, familia preparándose', importante: 'Emocional para los padres' },
  { momento: 'Ceremonia religiosa o civil', desc: 'Entrada, lecturas, comunión, salida', importante: 'El momento central' },
  { momento: 'Sesión exterior', desc: 'Parque, jardín, calle con luz natural', importante: 'Las fotos que más se guardan' },
  { momento: 'Cóctel y banquete', desc: 'Mesa presidencial, tarta, animación infantil', importante: 'Dinámica y natural' },
];

export default function BlogFotografoComunionMadrid() {
  return (
    <>
      <Helmet>
        <title>Fotógrafo comunión Madrid: precio y guía 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cuesta un fotógrafo para una comunión en Madrid. Precios reales 2026, cuándo reservar y cómo elegir al mejor fotógrafo de comuniones en la capital." />
        <link rel="canonical" href="https://xpeak.es/blog/fotografo-comunion-madrid" />
        <meta property="og:title" content="Fotógrafo comunión Madrid: precio y guía 2026 — XPEAK Blog" />
        <meta property="og:description" content="Precios reales de fotógrafos de comunión en Madrid. Paquetes, momentos clave y cuándo reservar." />
        <meta property="og:url" content="https://xpeak.es/blog/fotografo-comunion-madrid" />
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
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Fotógrafo para comunión en Madrid: precio y guía 2026</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#3d3d4e' }}>Madrid tiene los fotógrafos de comunión más demandados de España — y los más caros. Precios reales, paquetes y todo lo que necesitas saber para no quedarte sin fotógrafo en mayo o junio.</p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>28 mayo 2026</time>
          </div>

          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Precios de fotógrafo de comunión en Madrid (2026)</h2>
              <div className="space-y-2">
                {PRECIOS.map((row, i) => (
                  <div key={row.servicio} className="flex items-center justify-between p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <p className="text-xs font-medium">{row.servicio}</p>
                    <span className="text-xs font-bold ml-4 shrink-0" style={{ color: '#D4AF37' }}>{row.precio}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Precios específicos para Madrid 2026. Sin IVA. Un 20-30% por encima de la media nacional.</p>
            </section>

            <BlogInlineCTA role="fotografo" />

            <section>
              <h2 className="text-lg font-black mb-4">Momentos clave de una comunión</h2>
              <div className="space-y-3">
                {MOMENTOS.map((m, i) => (
                  <div key={m.momento} className="p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-xs font-bold">{m.momento}</p>
                      <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded ml-3 shrink-0" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37' }}>{m.importante}</span>
                    </div>
                    <p className="text-xs" style={{ color: '#3d3d4e' }}>{m.desc}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Habla con el fotógrafo sobre cuál es tu prioridad — no todos los paquetes cubren los 4 momentos.</p>
            </section>

            <section>
              <h2 className="text-lg font-black mb-3">Por qué Madrid es diferente para los fotógrafos de comunión</h2>
              <p className="text-sm leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.75)' }}>
                En Madrid se celebran más comuniones en mayo y junio que en cualquier otra ciudad de España. Esto significa que los fotógrafos especializados en niños tienen la agenda completamente llena desde febrero. No esperes a decidirte — si tienes fecha, reserva ya.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
                Otro factor diferencial es que muchas comuniones en Madrid se celebran en restaurantes con jardín o fincas a las afueras (Pozuelo, Las Rozas, Majadahonda), lo que requiere desplazamiento y a veces suplemento. Los mejores fotógrafos de comunión en Madrid combinan experiencia trabajando con niños, buena gestión de grupos grandes y capacidad para sacar sesiones exteriores rápidas entre ceremonia y banquete.
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
                  { href: '/blog/fotografos-eventos', cat: 'Hub Foto', title: 'Fotógrafos para eventos: guía completa 2026' },
                  { href: '/blog/comuniones-guia-completa', cat: 'Hub Comuniones', title: 'Comuniones en España: guía completa 2026' },
                  { href: '/blog/fotografo-para-comunion-precio', cat: 'Fotografía', title: 'Fotógrafo para comunión: precio y qué incluye 2026' },
                  { href: '/blog/cuanto-cuesta-una-comunion-en-espana', cat: 'Comuniones', title: '¿Cuánto cuesta una comunión en España? 2026' },
                  { href: '/blog/dj-para-comunion-precio', cat: 'DJ', title: 'DJ para comunión: precio y qué incluye 2026' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.72)' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>

            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Buscas fotógrafo para tu comunión en Madrid?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>XPEAK tiene fotógrafos verificados especializados en comuniones en Madrid y toda la Comunidad. Portfolios reales, reseñas verificadas y contrato digital automático.</p>
              <a href="/contratar-fotografo/madrid" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Ver fotógrafos en Madrid →</a>
            </div>
          </div>
                  <BlogEmailCapture variant="presupuestos" intent="contratar-staff" articlePath="/blog/fotografo-comunion-madrid" />
</main>
        <DJResourcesAffiliate role="fotografo" />
        <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/fotografo-comunion-madrid' tag='Fotografía' />
        <FooterPublic />
        <BlogScrollCTA role="fotografo" storageKey="xpeak_scrollcta_fotografo_comunion_madrid" />
      </div>
    </>
  );
}
