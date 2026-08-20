import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';
import DJResourcesAffiliate from '@/components/DJResourcesAffiliate';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: '¿Cuánto cuesta el catering de una boda? Precio por persona en España (2026)', description: 'Guía de precios del catering para bodas en España. Coste por persona según menú, formato y número de invitados. Todo lo que incluye y cómo negociar.', datePublished: '2026-05-04',
  dateModified: '2026-05-25', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/catering-boda-precio-por-persona' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cuesta el catering de una boda por persona?', acceptedAnswer: { '@type': 'Answer', text: 'En España el precio medio del catering de boda oscila entre 60€ y 150€ por persona. Un cóctel de bienvenida más banquete de 3 platos ronda los 75-100€/persona. Los menús premium con maridaje de vinos y postres elaborados pueden superar los 120-150€/persona. Las bodas rurales o en finca propia suelen ser más económicas (50-80€/persona).' } },
  { '@type': 'Question', name: '¿Qué incluye el precio del catering de boda?', acceptedAnswer: { '@type': 'Answer', text: 'Normalmente incluye: cóctel de bienvenida (canapés, bebidas), menú de banquete (entrantes, principal, postre), bebidas durante la cena (vino, agua, refrescos), personal de sala, menaje (vajilla, cubertería, cristalería) y montaje/desmontaje. La tarta nupcial, barra libre nocturna y decoración floral se presupuestan aparte.' } },
  { '@type': 'Question', name: '¿Cuándo se paga el catering de la boda?', acceptedAnswer: { '@type': 'Answer', text: 'Lo habitual es una señal del 20-30% al firmar el contrato (6-12 meses antes), otro pago del 30-40% un mes antes de la boda y el resto el mismo día o dentro de los 15 días siguientes. Nunca pagues el 100% por adelantado.' } },
  { '@type': 'Question', name: '¿Cuántos camareros necesito para el catering de mi boda?', acceptedAnswer: { '@type': 'Answer', text: 'El ratio estándar es 1 camarero por cada 8-10 invitados en servicio a mesa. Para el cóctel de pie, 1 por cada 12-15 personas es suficiente. En una boda de 100 personas necesitarás entre 8 y 12 camareros para el banquete, más 1-2 barmans para la barra libre.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Catering boda precio por persona', item: 'https://xpeak.es/blog/catering-boda-precio-por-persona' }] };

const PRECIOS = [
  { formato: 'Cóctel de pie (2h)', precio: '25–45€/persona', incluye: 'Canapés, bebidas, 1-2 camareros/20 pax' },
  { formato: 'Banquete 3 platos (sin alcohol)', precio: '45–70€/persona', incluye: 'Menú completo, agua y refrescos' },
  { formato: 'Banquete con vino y cava', precio: '65–100€/persona', incluye: 'Lo anterior + vino mesa + cava para el brindis' },
  { formato: 'Menú premium + maridaje', precio: '100–150€/persona', incluye: 'Vinos seleccionados, quesos, postres elaborados' },
  { formato: 'Barra libre nocturna (3h)', precio: '15–30€/persona', incluye: 'Combinados, cervezas, refrescos, 1 barman/50 pax' },
  { formato: 'Todo incluido (cóctel + banquete + barra)', precio: '90–180€/persona', incluye: 'El paquete más contratado en bodas españolas' },
];

export default function BlogCateringBoda() {
  return (
    <>
      <Helmet>
        <title>Catering boda: precio por persona 2026 | XPEAK</title>
        <meta name="description" content="¿Cuánto cuesta el catering de una boda en España? Precios por persona según menú y formato. Qué incluye, cuándo pagar y cómo negociar con el proveedor." />
        <link rel="canonical" href="https://xpeak.es/blog/catering-boda-precio-por-persona" />
        <meta property="og:title" content="Catering boda: precio por persona 2026 — XPEAK Blog" />
        <meta property="og:description" content="Precios reales del catering de boda en España. Por persona, por formato y todo lo que incluye." />
        <meta property="og:url" content="https://xpeak.es/blog/catering-boda-precio-por-persona" />
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
            <a href="/blog" className="text-xs font-bold" style={{ color: '#3d3d4e' }}>Blog</a>
            <a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Unirse gratis</a>
          </div>
        </nav>
        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>Catering · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">¿Cuánto cuesta el catering de una boda? Precio por persona en España (2026)</h1>
            <p className="text-base leading-relaxed" style={{ color: '#3d3d4e' }}>El catering es la partida más grande del presupuesto de una boda. Aquí tienes los precios reales por formato, qué incluye cada paquete y cómo no llevarte sorpresas el día del evento.</p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>4 mayo 2026</time>
          </div>
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Precios de catering de boda por formato (2026)</h2>
              <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <table className="w-full text-xs">
                  <thead><tr style={{ background: 'rgba(212,175,55,0.08)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}><th className="text-left px-4 py-3 font-bold">Formato</th><th className="px-4 py-3 font-bold text-right">Precio/persona</th><th className="px-4 py-3 font-bold text-left hidden sm:table-cell">Qué incluye</th></tr></thead>
                  <tbody>{PRECIOS.map((row, i) => (<tr key={row.formato} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="px-4 py-3 font-medium">{row.formato}</td><td className="px-4 py-3 text-right font-bold" style={{ color: '#D4AF37' }}>{row.precio}</td><td className="px-4 py-3 hidden sm:table-cell" style={{ color: '#3d3d4e' }}>{row.incluye}</td></tr>))}</tbody>
                </table>
              </div>
            </section>
            <section>
              <h2 className="text-lg font-black mb-3">¿Qué factores disparan (o reducen) el precio?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { t: 'Encarece el catering', puntos: ['Menú con productos de temporada premium', 'Boda en temporada alta (mayo–septiembre)', 'Ciudad grande (Madrid, Barcelona, Sevilla)', 'Equipo propio de catering en finca exclusiva', 'Servicio a mesa vs buffet libre'], c: '#ff5f56' },
                  { t: 'Abarata el catering', puntos: ['Buffet o servicio mixto en lugar de menú cerrado', 'Boda entre semana o en temporada baja', 'Finca con cocina propia integrada', 'Menú de temporada sin carta de vinos seleccionados', 'Menos de 80 invitados (economía de escala)'], c: '#22c55e' },
                ].map(d => (
                  <div key={d.t} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <h3 className="text-xs font-bold mb-3" style={{ color: d.c }}>{d.t}</h3>
                    <ul className="space-y-1.5">{d.puntos.map(p => <li key={p} className="text-xs flex items-start gap-2" style={{ color: 'rgba(255,255,255,0.75)' }}><span style={{ color: d.c }}>→</span>{p}</li>)}</ul>
                  </div>
                ))}
              </div>
            </section>
            <section>
              <h2 className="text-lg font-black mb-3">Lo que nunca incluye el precio por persona</h2>
              <div className="p-5 rounded-xl space-y-2" style={{ background: 'rgba(255,95,86,0.04)', border: '1px solid rgba(255,95,86,0.15)' }}>
                {['Tarta nupcial (se presupuesta aparte: 150–600€)', 'Decoración floral de las mesas', 'Sillas o carpas si el espacio no las tiene', 'Transporte del personal si la finca está fuera de ciudad', 'Propinas al personal (no obligatorias pero habituales: 10–15€/camarero)'].map(item => (
                  <p key={item} className="text-xs flex items-start gap-2" style={{ color: 'rgba(255,255,255,0.72)' }}>
                    <span style={{ color: '#ff5f56' }}>✗</span>{item}
                  </p>
                ))}
              </div>
            </section>
            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">{faqStructured.mainEntity.map(f => (<div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}><h3 className="text-sm font-bold mb-2">{f.name}</h3><p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>{f.acceptedAnswer.text}</p></div>))}</div>
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
              <p className="text-sm font-black mb-2">¿Buscas camareros para tu boda?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>XPEAK conecta con camareros de eventos verificados en toda España. Presupuesto sin compromiso y contrato digital.</p>
              <a href="/contratar-camareros" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Ver camareros en XPEAK →</a>
            </div>
          </div>
                  <BlogEmailCapture variant="presupuestos" intent="contratar-staff" articlePath="/blog/catering-boda-precio-por-persona" />
</main>
        <DJResourcesAffiliate role="catering" />
        <BlogAuthor />
        <FooterPublic />
        <BlogScrollCTA role="general" storageKey="xpeak_scrollcta_catering_boda" />
      </div>
    </>
  );
}
