import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';
import DJResourcesAffiliate from '@/components/DJResourcesAffiliate';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Catering para comuniones en España: precio por persona y qué incluye (2026)', description: 'Cuánto cuesta el catering de una comunión en España. Precios por persona, formatos de menú y cómo elegir el servicio correcto para tu celebración.', datePublished: '2026-05-07',
  dateModified: '2026-05-25', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/catering-comuniones-precio-persona' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cuesta el catering para una comunión por persona?', acceptedAnswer: { '@type': 'Answer', text: 'El precio medio del catering de comunión en España es de 35€ a 80€ por persona para un menú completo (almuerzo o cena). Un cóctel o aperitivo oscila entre 15€ y 35€/persona. El precio varía según la ciudad, el número de invitados y si incluye bebidas, personal de sala y alquiler de espacio.' } },
  { '@type': 'Question', name: '¿Cuántos camareros necesito para la comunión?', acceptedAnswer: { '@type': 'Answer', text: 'Para una comunión con servicio de mesa, se recomienda 1 camarero por cada 20-25 invitados. Para un buffet o cóctel, 1 por cada 25-35 personas. Siempre añade un maitre o coordinador si hay más de 60 invitados.' } },
  { '@type': 'Question', name: '¿Cómo elegir entre banquete sentado y cóctel para una comunión?', acceptedAnswer: { '@type': 'Answer', text: 'El banquete sentado (con menú por platos) es más formal y cómodo para invitados mayores. El cóctel o buffet es más dinámico, permite socializar con más libertad y suele costar un 20-30% menos. Para comuniones mixtas (niños y mayores), muchos eligen cóctel con zona de mesas para los mayores.' } },
  { '@type': 'Question', name: '¿Qué incluye el precio del catering de una comunión?', acceptedAnswer: { '@type': 'Answer', text: 'Varía por empresa, pero lo habitual incluye: menú por platos o buffet, personal de sala, mantelería y vajilla, y limpieza. Normalmente NO incluye: bebidas alcohólicas premium, tarta de comunión, alquiler del espacio, animación para niños ni DJ. Pide siempre el desglose detallado.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Catering comuniones precio por persona', item: 'https://xpeak.es/blog/catering-comuniones-precio-persona' }] };

const FORMATOS = [
  { formato: 'Cóctel de aperitivo (1-2h)', precio: '15–30€/persona', incluye: 'Canapés, pinchos, bebidas básicas', ideal: 'Como previa al banquete sentado' },
  { formato: 'Banquete sentado (3 platos)', precio: '40–65€/persona', incluye: 'Entrantes, principal, postre, vino y agua', ideal: 'Comuniones formales, familias numerosas' },
  { formato: 'Buffet variado', precio: '30–55€/persona', incluye: 'Múltiples opciones, libre acceso', ideal: 'Comuniones dinámicas con niños' },
  { formato: 'Cóctel + banquete (fórmula mixta)', precio: '55–85€/persona', incluye: 'Aperitivo de pie + menú sentado', ideal: 'La opción más elegida en 2026' },
  { formato: 'Merienda-cena', precio: '25–45€/persona', incluye: 'Bocaditos salados, dulces, refrescos', ideal: 'Comuniones vespertinas o con mucho público joven' },
  { formato: 'Todo incluido (espacio + catering)', precio: '65–120€/persona', incluye: 'Espacio, menú, personal, tarta y barra libre', ideal: 'Quienes quieren zero estrés' },
];

const EXTRAS = [
  { extra: 'Barra libre de destilados', precio: '+8–15€/persona' },
  { extra: 'Tarta de comunión personalizada', precio: '150–400€ según tamaño' },
  { extra: 'Animación infantil (payaso, talleres)', precio: '200–500€ (3h)' },
  { extra: 'Disco móvil para niños', precio: '300–600€' },
  { extra: 'Photocall personalizado', precio: '150–350€' },
  { extra: 'Camarero/a extra', precio: '15–22€/hora' },
  { extra: 'Menú especial niños', precio: '+5–10€/niño' },
  { extra: 'Decoración floral de mesa', precio: '200–600€ dependiendo de las mesas' },
];

export default function BlogCateringComuniones() {
  return (
    <>
      <Helmet>
        <title>Catering comuniones: precio por persona 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cuesta el catering de una comunión en España. Precios por persona, formatos de menú (banquete, cóctel, buffet), extras y cómo elegir el servicio correcto." />
        <link rel="canonical" href="https://xpeak.es/blog/catering-comuniones-precio-persona" />
        <meta property="og:title" content="Catering comuniones: precio por persona 2026 — XPEAK Blog" />
        <meta property="og:description" content="Precios reales del catering para comuniones en España. Formatos, extras y qué incluye cada paquete." />
        <meta property="og:url" content="https://xpeak.es/blog/catering-comuniones-precio-persona" />
        <meta property="og:type" content="article" /><meta property="og:image" content="https://xpeak.es/og-image.jpg" /><meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" /><meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>
      <div className="min-h-screen" style={{ background: '#090909', color: '#fff' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-3xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#D4AF37' }}>XPEAK</a>
          <div className="flex items-center gap-3"><a href="/blog" className="text-xs font-bold" style={{ color: '#3d3d4e' }}>Blog</a><a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Unirse gratis</a></div>
        </nav>
        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>Catering · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Catering para comuniones en España: precio por persona y qué incluye (2026)</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#3d3d4e' }}>El catering es la partida más importante del presupuesto de una comunión. Con estos precios reales y este desglose de formatos, podrás comparar presupuestos sin sorpresas.</p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>7 mayo 2026</time>
          </div>
          <div className="space-y-10">

            <section>
              <h2 className="text-lg font-black mb-2">Precio del catering de comunión: resumen rápido</h2>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: 'Cóctel aperitivo', precio: '15–30€', nota: 'por persona' },
                  { label: 'Banquete completo', precio: '40–65€', nota: 'por persona' },
                  { label: 'Todo incluido', precio: '65–120€', nota: 'por persona' },
                ].map(c => (
                  <div key={c.label} className="p-3 rounded-xl text-center" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}>
                    <p className="text-[0.65rem] text-muted-foreground mb-1">{c.label}</p>
                    <p className="text-lg font-black" style={{ color: '#D4AF37' }}>{c.precio}</p>
                    <p className="text-[0.6rem]" style={{ color: 'rgba(255,255,255,0.3)' }}>{c.nota}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs leading-relaxed" style={{ color: '#3d3d4e' }}>Para una comunión de 80 invitados con banquete completo y cóctel previo, el presupuesto de catering ronda los <strong style={{ color: '#D4AF37' }}>4.800€–6.800€</strong>. El precio por persona baja a medida que aumentan los invitados.</p>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">Formatos de catering para comuniones: precios y cuándo elegir cada uno</h2>
              <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <table className="w-full text-xs">
                  <thead><tr style={{ background: 'rgba(212,175,55,0.08)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}><th className="text-left px-4 py-3 font-bold">Formato</th><th className="px-4 py-3 font-bold text-right">Precio/persona</th><th className="px-4 py-3 font-bold text-left hidden sm:table-cell">Ideal para</th></tr></thead>
                  <tbody>{FORMATOS.map((row, i) => (<tr key={row.formato} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="px-4 py-3 font-medium">{row.formato}</td><td className="px-4 py-3 text-right font-bold" style={{ color: '#D4AF37' }}>{row.precio}</td><td className="px-4 py-3 hidden sm:table-cell" style={{ color: '#3d3d4e' }}>{row.ideal}</td></tr>))}</tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">¿Qué suele incluir y qué no incluye el catering?</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl" style={{ background: 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.15)' }}>
                  <p className="text-sm font-bold mb-3" style={{ color: '#22c55e' }}>✓ Normalmente incluido</p>
                  <ul className="space-y-1.5">
                    {['Menú por platos o buffet (según formato)', 'Personal de sala durante el servicio', 'Mantelería y vajilla', 'Pan, agua y vino básico', 'Servicio de café e infusiones', 'Limpieza posterior del espacio'].map(i => <li key={i} className="text-xs" style={{ color: '#3d3d4e' }}>· {i}</li>)}
                  </ul>
                </div>
                <div className="p-4 rounded-xl" style={{ background: 'rgba(255,95,86,0.04)', border: '1px solid rgba(255,95,86,0.15)' }}>
                  <p className="text-sm font-bold mb-3" style={{ color: '#ff5f56' }}>✗ Normalmente aparte</p>
                  <ul className="space-y-1.5">
                    {['Bebidas alcohólicas premium y destilados', 'Tarta de comunión', 'Alquiler del espacio', 'Animación infantil o DJ', 'Decoración floral', 'Photocall o atrezzo'].map(i => <li key={i} className="text-xs" style={{ color: '#3d3d4e' }}>· {i}</li>)}
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">Extras y su precio en comuniones</h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {EXTRAS.map(e => (
                  <div key={e.extra} className="flex items-center justify-between px-3 py-2.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.75)' }}>{e.extra}</span>
                    <span className="text-xs font-bold flex-shrink-0 ml-3" style={{ color: '#D4AF37' }}>{e.precio}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">Cómo ahorrar en el catering de la comunión sin recortar calidad</h2>
              <div className="space-y-3">
                {[
                  { tip: 'Elige día de diario o sábado de mañana', desc: 'Los domingos al mediodía son los más caros. Un sábado de mañana o un viernes tarde pueden ahorrar un 10-20%.' },
                  { tip: 'Reduce el menú de adultos, no el de niños', desc: 'Los niños suelen comer poco o no comen el menú de adultos. Negocia un precio reducido para menores de 12 años (suele ser la mitad).' },
                  { tip: 'Opta por buffet o cóctel en vez de servicio a mesa', desc: 'El servicio de buffet requiere menos personal de sala. En igualdad de menú, puede ser un 15-25% más barato.' },
                  { tip: 'Compara mínimo 3 empresas con el mismo briefing', desc: 'Proporciona el mismo documento a todas (fecha, número de pax, formato) para comparar en igualdad de condiciones.' },
                  { tip: 'Pregunta por menús de temporada', desc: 'Los ingredientes de temporada son más baratos. Un catering con menú de primavera en mayo puede ser significativamente más ajustado.' },
                ].map(t => (
                  <div key={t.tip} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-sm font-bold mb-1" style={{ color: '#D4AF37' }}>💡 {t.tip}</p>
                    <p className="text-xs leading-relaxed" style={{ color: '#3d3d4e' }}>{t.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-3">
                {faqStructured.mainEntity.map(q => (
                  <details key={q.name} className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                    <summary className="flex items-center justify-between px-4 py-3.5 cursor-pointer text-sm font-bold list-none" style={{ background: 'rgba(255,255,255,0.02)' }}>
                      {q.name}
                      <span className="text-xs ml-3 flex-shrink-0" style={{ color: '#D4AF37' }}>+</span>
                    </summary>
                    <div className="px-4 py-3 text-sm leading-relaxed" style={{ color: '#3d3d4e', background: 'rgba(0,0,0,0.2)' }}>
                      {q.acceptedAnswer.text}
                    </div>
                  </details>
                ))}
              </div>
            </section>

            <section className="rounded-2xl p-6 text-center" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)' }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#D4AF37' }}>¿Buscas catering para tu comunión?</p>
              <h3 className="text-xl font-black mb-3">Encuentra camareros y catering en XPEAK</h3>
              <p className="text-sm mb-5" style={{ color: '#3d3d4e' }}>Profesionales verificados con tarifas reales. También DJs y animación infantil para la comunión perfecta.</p>
              <a href="/contratar-catering" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                Ver profesionales de catering →
              </a>
            </section>

            <section>
              <h2 className="text-base font-black mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>Artículos relacionados</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { href: '/blog/comuniones-guia-completa', cat: 'Hub Comuniones', title: 'Comuniones en España: guía completa 2026' },
                  { href: '/blog/catering-boda-precio-por-persona', title: 'Catering de boda: precio por persona' },
                  { href: '/blog/cuantos-camareros-necesito-para-mi-boda', title: 'Cuántos camareros necesito para mi celebración' },
                  { href: '/blog/disco-movil-para-comuniones', title: 'Disco móvil para comuniones: precios' },
                  { href: '/blog/animadores-infantiles-comuniones-cumpleanos', title: 'Animadores infantiles para comuniones' },
                ].map(a => (
                  <a key={a.href} href={a.href} className="p-3 rounded-lg text-sm font-medium transition-all hover:scale-[1.01]" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)' }}>
                    {a.title} →
                  </a>
                ))}
              </div>
            </section>
          </div>
                  <BlogEmailCapture variant="presupuestos" intent="contratar-staff" articlePath="/blog/catering-comuniones-precio-persona" />
</main>
        <DJResourcesAffiliate role="catering" />
        <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/catering-comuniones-precio-persona' tag='Catering' />
        <FooterPublic />
        <BlogScrollCTA role="general" storageKey="xpeak_scrollcta_catering_comuniones" />
      </div>
    </>
  );
}
