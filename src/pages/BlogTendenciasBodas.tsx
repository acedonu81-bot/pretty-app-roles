import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogEmailCapture from '@/components/BlogEmailCapture';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Tendencias en bodas 2026 en España: decoración, música y experiencias', description: 'Las tendencias más buscadas para bodas en España en 2026. Decoración, música, catering experiencial y qué está pidiendo la nueva generación de novios.', datePublished: '2026-05-04',
  dateModified: '2026-05-25', author: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/tendencias-bodas-2026' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuál es la tendencia más popular en bodas 2026?', acceptedAnswer: { '@type': 'Answer', text: 'Las bodas íntimas (menos de 80 invitados) con experiencias gastronómicas personalizadas y espacios rurales con encanto son la tendencia más fuerte en 2026. Los novios priorizan la calidad de la experiencia sobre el número de invitados y buscan personalización total: desde la música en directo hasta el menú degustación.' } },
  { '@type': 'Question', name: '¿Qué colores se llevan en bodas 2026?', acceptedAnswer: { '@type': 'Answer', text: 'Los tonos tierra y naturales (beige, terracota, verde salvia, blanco roto) dominan la paleta de bodas 2026. Los arreglos florales en tonos melocotón y burdeos son muy demandados. El blanco puro ha cedido terreno ante los tonos marfil y champán tanto en vestidos como en decoración.' } },
  { '@type': 'Question', name: '¿Sigue siendo el DJ la opción más contratada para bodas?', acceptedAnswer: { '@type': 'Answer', text: 'Sí, el DJ sigue siendo la opción más contratada para bodas en España (más del 70% de las bodas). Sin embargo, en 2026 se observa un crecimiento de fórmulas mixtas: grupo en directo para el cóctel y DJ para la fiesta posterior. Las bodas con presupuesto más elevado optan por saxofonista + DJ o cuarteto de cuerdas + DJ.' } },
  { '@type': 'Question', name: '¿Cuál es el presupuesto medio de una boda en España en 2026?', acceptedAnswer: { '@type': 'Answer', text: 'El presupuesto medio de una boda en España en 2026 ronda los 18.000–22.000€ para 80-100 invitados. Las bodas en grandes ciudades (Madrid, Barcelona) pueden superar los 30.000€. Las bodas rurales en provincia pueden cerrarse por 12.000–15.000€ con la misma calidad de experiencia.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Tendencias bodas 2026', item: 'https://xpeak.es/blog/tendencias-bodas-2026' }] };

const TENDENCIAS = [
  { num: '01', titulo: 'Bodas íntimas y micro-bodas', desc: 'Menos de 50 invitados con experiencia gastronómica de alto nivel. Mayor presupuesto por persona, menor estrés total.' },
  { num: '02', titulo: 'Espacios rurales y fincas con encanto', desc: 'El campo supera a los hoteles. Masías, cortijos y fincas históricas con exclusividad de la ubicación durante 2-3 días.' },
  { num: '03', titulo: 'Catering experiencial y estaciones', desc: 'Buffets de ibéricos, ostras al momento, food trucks artesanales. La comida como espectáculo, no solo como servicio.' },
  { num: '04', titulo: 'Música en directo + DJ en fórmula mixta', desc: 'Grupo o artista para el cóctel, DJ para la fiesta. Saxo + DJ es la combinación más buscada en 2026.' },
  { num: '05', titulo: 'Fotografía y vídeo con estilo editorial', desc: 'Fotos con luz natural, sin posados forzados. El estilo documental y cinematográfico desbanca el tradicional.' },
  { num: '06', titulo: 'Personalización total del ambiente', desc: 'Desde el color de la vajilla hasta la playlist del aperitivo. Los novios diseñan cada detalle como si fuera un evento de diseño.' },
];

export default function BlogTendenciasBodas() {
  return (
    <>
      <Helmet>
        <title>Tendencias bodas 2026 España | XPEAK</title>
        <meta name="description" content="Las tendencias más buscadas para bodas en España en 2026. Bodas íntimas, espacios rurales, catering experiencial y música en directo. Todo lo que piden los novios." />
        <link rel="canonical" href="https://xpeak.es/blog/tendencias-bodas-2026" />
        <meta property="og:title" content="Tendencias bodas 2026 España — XPEAK Blog" />
        <meta property="og:description" content="Todo lo que piden los novios en 2026: bodas íntimas, fincas rurales, catering experiencial y fórmulas mixtas de música." />
        <meta property="og:url" content="https://xpeak.es/blog/tendencias-bodas-2026" />
        <meta property="og:type" content="article" /><meta property="og:image" content="https://xpeak.es/og-image.jpg" /><meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" /><meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>
      <div className="min-h-screen" style={{ background: '#090909', color: '#fff' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-3xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#D4AF37' }}>XPEAK</a>
          <div className="flex items-center gap-3">
            <a href="/blog" className="text-xs font-bold" style={{ color: '#8E8EA0' }}>Blog</a>
            <a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Unirse gratis</a>
          </div>
        </nav>
        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#8E8EA0' }}>← Todos los artículos</a>
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>Bodas · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Tendencias en bodas 2026 en España: decoración, música y experiencias</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#8E8EA0' }}>La generación que se casa en 2026 tiene muy claro lo que quiere: experiencias únicas, personalización total y presupuesto invertido en calidad, no en cantidad de invitados.</p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>4 mayo 2026</time>
          </div>
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-5">Las 6 tendencias más buscadas en bodas 2026</h2>
              <div className="space-y-4">
                {TENDENCIAS.map(t => (
                  <div key={t.num} className="flex gap-4 p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <span className="text-2xl font-black flex-shrink-0" style={{ color: 'rgba(212,175,55,0.3)', lineHeight: 1 }}>{t.num}</span>
                    <div>
                      <p className="text-sm font-black mb-1">{t.titulo}</p>
                      <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>{t.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            <section>
              <h2 className="text-lg font-black mb-4">Música en 2026: qué está eligiendo la gente</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { opcion: 'DJ + Saxo', popularidad: '★★★★★', desc: 'La combinación más contratada. El saxo eleva el cóctel, el DJ anima la fiesta.' },
                  { opcion: 'Grupo en directo', popularidad: '★★★★☆', desc: 'Versiones de pop y soul para el cóctel o primera parte del banquete.' },
                  { opcion: 'DJ solo', popularidad: '★★★★★', desc: 'Sigue siendo la opción más contratada y la más rentable presupuestariamente.' },
                  { opcion: 'Cuarteto de cuerdas', popularidad: '★★★☆☆', desc: 'Para ceremonias religiosas o civiles de corte clásico y elegante.' },
                ].map(o => (
                  <div key={o.opcion} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-bold">{o.opcion}</p>
                      <span className="text-[0.6rem]" style={{ color: '#D4AF37' }}>{o.popularidad}</span>
                    </div>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>{o.desc}</p>
                  </div>
                ))}
              </div>
            </section>
            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">{faqStructured.mainEntity.map(f => (<div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}><p className="text-sm font-bold mb-2">{f.name}</p><p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>{f.acceptedAnswer.text}</p></div>))}</div>
            </section>
            
            <section className="mt-8">
              <h2 className="text-base font-black mb-3" style={{ color: 'rgba(255,255,255,0.85)' }}>Artículos relacionados</h2>
              <div className="space-y-2">
                {[
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
              <p className="text-sm font-black mb-2">¿Buscas DJ o músicos para tu boda?</p>
              <p className="text-xs mb-4" style={{ color: '#8E8EA0' }}>XPEAK conecta con DJs y profesionales de eventos verificados en toda España. Disponibilidad y precios en tiempo real.</p>
              <a href="/contratar-dj" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Ver DJs en XPEAK →</a>
            </div>
          </div>
                  <BlogEmailCapture variant="presupuestos" intent="contratar-dj" articlePath="/blog/tendencias-bodas-2026" />
</main>
        <FooterPublic />
      </div>
    </>
  );
}
