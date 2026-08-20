import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Videógrafo para bodas: precio y qué incluye el vídeo en España (2026)', description: 'Cuánto cuesta contratar un videógrafo para tu boda. Precios por tipo de vídeo, duración, ciudad y diferencias con el fotógrafo. Guía 2026.', datePublished: '2026-05-04',
  dateModified: '2026-05-25', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/videografo-bodas-precio' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cobra un videógrafo de bodas en España?', acceptedAnswer: { '@type': 'Answer', text: 'El precio de un videógrafo de bodas en España varía entre 600€ y 3.000€ dependiendo del nivel de experiencia, ciudad y paquete. Un vídeo de highlights de 3-5 minutos cuesta entre 800€ y 1.500€ con un profesional de nivel medio. Los videógrafos más reconocidos con estilo cinematográfico pueden cobrar 2.500–4.000€.' } },
  { '@type': 'Question', name: '¿Qué incluye el paquete de vídeo de boda?', acceptedAnswer: { '@type': 'Answer', text: 'Lo habitual es: grabación el día de la boda (8-10h), edición y postproducción, vídeo de highlights (3-5 min), vídeo completo de la ceremonia y el banquete (30-90 min), entrega en archivo digital y enlace para compartir. Los paquetes premium añaden un segundo cámara, sesión previa (preboda) y película cinematográfica de autor.' } },
  { '@type': 'Question', name: '¿Es mejor contratar fotógrafo o videógrafo para la boda?', acceptedAnswer: { '@type': 'Answer', text: 'La foto captura momentos congelados para siempre; el vídeo conserva las emociones en movimiento: votos, risas, música. Si el presupuesto obliga a elegir, muchas parejas priorizan la fotografía. Pero si hay margen, el vídeo añade una dimensión emocional que las fotos no pueden dar. Idealmente, contratar ambos con estilo visual coherente.' } },
  { '@type': 'Question', name: '¿Con cuánta antelación contratar el videógrafo de la boda?', acceptedAnswer: { '@type': 'Answer', text: 'Los mejores videógrafos de boda en España se reservan con 12-18 meses de antelación para fechas de temporada alta (mayo-octubre). Para bodas de invierno o entre semana, 6-8 meses suele ser suficiente. Confirmar siempre disponibilidad antes de cerrar la fecha de la boda.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Videógrafo bodas precio', item: 'https://xpeak.es/blog/videografo-bodas-precio' }] };

const PAQUETES = [
  { pack: 'Highlights (3-5 min)', precio: '600–1.200€', incluye: '1 cámara, edición básica, entrega digital' },
  { pack: 'Pack estándar', precio: '1.000–1.800€', incluye: 'Highlights + vídeo ceremonia completa' },
  { pack: 'Pack completo', precio: '1.500–2.500€', incluye: 'Día completo (10h), 2 cámaras, película corta' },
  { pack: 'Pack cinematográfico', precio: '2.000–4.000€', incluye: 'Drone, segunda cámara, preboda, película de autor' },
  { pack: 'Foto + vídeo combinado', precio: '2.500–5.000€', incluye: 'Fotógrafo y videógrafo del mismo estudio' },
];

const CIUDADES = [
  { ciudad: 'Madrid', rango: '1.200–3.500€' },
  { ciudad: 'Barcelona', rango: '1.200–3.800€' },
  { ciudad: 'Valencia', rango: '900–2.500€' },
  { ciudad: 'Sevilla', rango: '800–2.200€' },
  { ciudad: 'Bilbao', rango: '900–2.500€' },
  { ciudad: 'Resto de España', rango: '600–2.000€' },
];

export default function BlogVideografoBodas() {
  return (
    <>
      <Helmet>
        <title>Videógrafo bodas: precio y qué incluye 2026 | XPEAK</title>
        <meta name="description" content="¿Cuánto cuesta un videógrafo de boda en España? Precios por paquete, ciudad y tipo de vídeo. Diferencias con el fotógrafo y cuándo contratar." />
        <link rel="canonical" href="https://xpeak.es/blog/videografo-bodas-precio" />
        <meta property="og:title" content="Videógrafo bodas: precio 2026 — XPEAK Blog" />
        <meta property="og:description" content="Precios reales de videógrafos de boda en España. Por paquete, ciudad y tipo de producción." />
        <meta property="og:url" content="https://xpeak.es/blog/videografo-bodas-precio" />
        <meta property="og:type" content="article" /><meta property="og:image" content="https://xpeak.es/og-image.jpg" /><meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" /><meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>
      <div className="min-h-screen" style={{ background: '#ffffff', color: '#111' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-3xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#4F46E5' }}>XPEAK</a>
          <div className="flex items-center gap-3">
            <a href="/blog" className="text-xs font-bold" style={{ color: '#3d3d4e' }}>Blog</a>
            <a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#4F46E5,#B8941E)', color: '#000' }}>Unirse gratis</a>
          </div>
        </nav>
        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#4F46E5' }}>Bodas · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Videógrafo para bodas: precio y qué incluye el vídeo en España (2026)</h1>
            <p className="text-base leading-relaxed" style={{ color: '#3d3d4e' }}>Las fotos congelan momentos, el vídeo conserva las emociones. Guía de precios reales de videógrafos de boda en España, qué incluye cada paquete y cómo elegir el estilo correcto.</p>
            <time className="text-xs mt-3 block" style={{ color: '#666' }}>4 mayo 2026</time>
          </div>
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Precios de videógrafo de boda por paquete</h2>
              <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                <table className="w-full text-xs">
                  <thead><tr style={{ background: 'rgba(79,70,229,0.08)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}><th className="text-left px-4 py-3 font-bold">Paquete</th><th className="px-4 py-3 font-bold text-right">Precio</th><th className="px-4 py-3 font-bold text-left hidden sm:table-cell">Qué incluye</th></tr></thead>
                  <tbody>{PAQUETES.map((row, i) => (<tr key={row.pack} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)', borderBottom: '1px solid rgba(0,0,0,0.04)' }}><td className="px-4 py-3 font-medium">{row.pack}</td><td className="px-4 py-3 text-right font-bold" style={{ color: '#4F46E5' }}>{row.precio}</td><td className="px-4 py-3 hidden sm:table-cell" style={{ color: '#3d3d4e' }}>{row.incluye}</td></tr>))}</tbody>
                </table>
              </div>
            </section>
            <section>
              <h2 className="text-lg font-black mb-4">Precios por ciudad</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {CIUDADES.map(c => (
                  <div key={c.ciudad} className="p-4 rounded-xl text-center" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}>
                    <p className="text-xs font-bold mb-1">{c.ciudad}</p>
                    <p className="text-sm font-black" style={{ color: '#4F46E5' }}>{c.rango}</p>
                  </div>
                ))}
              </div>
            </section>
            <section>
              <h2 className="text-lg font-black mb-3">Videógrafo vs fotógrafo: ¿qué diferencia hay?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { t: 'Fotógrafo de boda', puntos: ['Captura momentos congelados en alta resolución', 'Álbum físico y galería digital entregables', 'Edición disponible en 4-8 semanas', 'Precio medio: 1.000–2.500€', 'Prioridad si el presupuesto es limitado'], c: '#818cf8' },
                  { t: 'Videógrafo de boda', puntos: ['Conserva emociones, música y voz en movimiento', 'Highlights + película larga entregables', 'Edición disponible en 6-12 semanas', 'Precio medio: 1.000–2.500€', 'Complemento ideal si hay presupuesto'], c: '#4F46E5' },
                ].map(d => (
                  <div key={d.t} className="p-5 rounded-xl" style={{ background: 'rgba(0,0,0,0.025)', border: '1px solid rgba(0,0,0,0.06)' }}>
                    <h3 className="text-xs font-bold mb-3" style={{ color: d.c }}>{d.t}</h3>
                    <ul className="space-y-1.5">{d.puntos.map(p => <li key={p} className="text-xs flex items-start gap-2" style={{ color: '#222' }}><span style={{ color: d.c }}>→</span>{p}</li>)}</ul>
                  </div>
                ))}
              </div>
            </section>
            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">{faqStructured.mainEntity.map(f => (<div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}><h3 className="text-sm font-bold mb-2">{f.name}</h3><p className="text-sm leading-relaxed" style={{ color: '#222' }}>{f.acceptedAnswer.text}</p></div>))}</div>
            </section>
            
            <section className="mt-8">
              <h2 className="text-base font-black mb-3" style={{ color: '#111' }}>Artículos relacionados</h2>
              <div className="space-y-2">
                {[
                  { href: '/blog/profesionales-bodas', cat: 'Hub Bodas', title: 'Profesionales para bodas: guía completa 2026' },
                  { href: '/blog/fotografos-eventos', cat: 'Hub Foto', title: 'Fotógrafos para eventos: guía completa 2026' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(79,70,229,0.1)', color: '#4F46E5', border: '1px solid rgba(79,70,229,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: '#222' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>
            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(79,70,229,0.04)', border: '1px solid rgba(79,70,229,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Buscas fotógrafo o videógrafo para tu boda?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>XPEAK conecta con fotógrafos verificados en toda España con precios transparentes y disponibilidad en tiempo real.</p>
              <a href="/contratar-fotografo" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#4F46E5,#B8941E)', color: '#000' }}>Ver fotógrafos en XPEAK →</a>
            </div>
          </div>
                  <BlogEmailCapture variant="presupuestos" intent="contratar-staff" articlePath="/blog/videografo-bodas-precio" />
</main>
        <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/videografo-bodas-precio' tag='Fotografía' />
        <FooterPublic />
        <BlogScrollCTA role="fotografo" storageKey="xpeak_scrollcta_videografo_bodas" />
      </div>
    </>
  );
}
