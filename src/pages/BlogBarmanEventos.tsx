import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Contratar barman para evento privado: precios y qué incluye en España (2026)', description: 'Cuánto cuesta contratar un barman o coctelero para un evento privado en España. Tarifas, equipo incluido y diferencias con camarero de barra.', datePublished: '2026-05-04', author: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/contratar-barman-evento-privado' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cuesta contratar un barman para un evento privado?', acceptedAnswer: { '@type': 'Answer', text: 'El precio de un barman profesional para eventos privados en España oscila entre 150€ y 400€ por evento (4-6 horas), dependiendo del nivel de coctelería, equipamiento y ciudad. Los barmans de show o flair cobran entre 300€ y 600€.' } },
  { '@type': 'Question', name: '¿El barman trae el equipo y los productos?', acceptedAnswer: { '@type': 'Answer', text: 'Depende del paquete. Muchos barmans ofrecen un servicio todo incluido (coctelería, equipo, hielo, decoración de barra) con un precio por persona. Si traes el alcohol tú, el precio del barman baja significativamente. Especifícalo siempre en el presupuesto.' } },
  { '@type': 'Question', name: '¿Qué diferencia hay entre barman y camarero de barra?', acceptedAnswer: { '@type': 'Answer', text: 'El barman tiene formación específica en coctelería, elaboración de combinados y manejo de equipo profesional de barra. El camarero de barra sirve bebidas estándar pero no tiene formación en coctelería artesanal. Para una barra libre básica un camarero es suficiente; para coctelería de autor necesitas barman.' } },
  { '@type': 'Question', name: '¿Cuántos barmans necesito para mi evento?', acceptedAnswer: { '@type': 'Answer', text: 'La regla general es 1 barman por cada 40-50 personas en un cóctel de barra libre. Para eventos con coctelería artesanal y tiempos de elaboración más largos, 1 por cada 25-30 personas. Si hay más de 100 personas, un coordinador de barra más 2-3 ayudantes es lo óptimo.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Contratar barman evento privado', item: 'https://xpeak.es/blog/contratar-barman-evento-privado' }] };

const PAQUETES = [
  { pack: 'Barman básico (4h, sin alcohol)', precio: '150–250€', para: 'Fiestas privadas pequeñas' },
  { pack: 'Barman + coctelería clásica (5h)', precio: '250–400€', para: 'Bodas, cumpleaños VIP' },
  { pack: 'Pack barra libre (barman + equipo + productos)', precio: '18–35€/persona', para: 'Lo más contratado en bodas' },
  { pack: 'Barman flair / show (pirotecnia de botellas)', precio: '300–600€', para: 'Eventos espectáculo, lanzamientos' },
  { pack: 'Pack cóctel de bienvenida (1-2h, 50-100 pax)', precio: '400–700€', para: 'Recepción de bodas o eventos' },
  { pack: 'Barman semanal (clubs, restaurantes)', precio: '600–1.200€/semana', para: 'Cobertura de temporada' },
];

export default function BlogBarmanEventos() {
  return (
    <>
      <Helmet>
        <title>Contratar barman para evento privado: precios 2026 en España</title>
        <meta name="description" content="Cuánto cuesta contratar un barman o coctelero para un evento privado en España. Tarifas, paquetes y diferencias con camarero de barra. Guía 2026." />
        <link rel="canonical" href="https://xpeak.es/blog/contratar-barman-evento-privado" />
        <meta property="og:title" content="Contratar barman evento privado: precios 2026 — XPEAK Blog" />
        <meta property="og:description" content="Cuánto cuesta contratar un barman para un evento privado en España. Tarifas y paquetes." />
        <meta property="og:url" content="https://xpeak.es/blog/contratar-barman-evento-privado" />
        <meta property="og:type" content="article" /><meta property="og:image" content="https://xpeak.es/og-image.jpg" /><meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" /><meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>
      <div className="min-h-screen" style={{ background: '#090909', color: '#fff' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-3xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#D4AF37' }}>XPEAK</a>
          <div className="flex items-center gap-3"><a href="/blog" className="text-xs font-bold " style={{ color: '#8E8EA0' }}>Blog</a><a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Unirse gratis</a></div>
        </nav>
        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#8E8EA0' }}>← Todos los artículos</a>
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>Camareros · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Contratar barman para evento privado: precios y qué incluye en España (2026)</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#8E8EA0' }}>Un buen barman convierte una barra libre ordinaria en un espectáculo. Guía de precios, paquetes y cuándo vale la pena invertir en coctelería de autor.</p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>4 mayo 2026</time>
          </div>
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Paquetes y precios de barman para eventos</h2>
              <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <table className="w-full text-xs">
                  <thead><tr style={{ background: 'rgba(212,175,55,0.08)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}><th className="text-left px-4 py-3 font-bold">Paquete</th><th className="px-4 py-3 font-bold text-right">Precio</th><th className="px-4 py-3 font-bold text-left hidden sm:table-cell">Ideal para</th></tr></thead>
                  <tbody>{PAQUETES.map((row, i) => (<tr key={row.pack} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="px-4 py-3 font-medium">{row.pack}</td><td className="px-4 py-3 text-right font-bold" style={{ color: '#D4AF37' }}>{row.precio}</td><td className="px-4 py-3 hidden sm:table-cell" style={{ color: '#8E8EA0' }}>{row.para}</td></tr>))}</tbody>
                </table>
              </div>
            </section>
            <section>
              <h2 className="text-lg font-black mb-3">¿Barman o camarero de barra? Cuándo elegir cada uno</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[{ t: 'Camarero de barra', puntos: ['Sirve cervezas, vinos y combinados estándar', 'Más económico (10-15€/h)', 'Suficiente para eventos informales', 'Sin formación en coctelería'], c: '#8E8EA0' }, { t: 'Barman / Coctelero', puntos: ['Elabora cócteles artesanales y de autor', 'Show visual (flair, humo, fuego)', 'Eleva el nivel percibido del evento', 'Formación certificada en mixología'], c: '#D4AF37' }].map(d => (<div key={d.t} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid rgba(255,255,255,0.06)` }}><h3 className="text-xs font-bold mb-3" style={{ color: d.c }}>{d.t}</h3><ul className="space-y-1.5">{d.puntos.map(p => <li key={p} className="text-xs flex items-start gap-2" style={{ color: 'rgba(255,255,255,0.75)' }}><span style={{ color: d.c }}>→</span>{p}</li>)}</ul></div>))}
              </div>
            </section>
            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">{faqStructured.mainEntity.map(f => (<div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}><p className="text-sm font-bold mb-2">{f.name}</p><p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>{f.acceptedAnswer.text}</p></div>))}</div>
            </section>
            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Buscas barman o camarero para tu evento?</p>
              <p className="text-xs mb-4" style={{ color: '#8E8EA0' }}>XPEAK conecta con camareros y barmans verificados en toda España. Contrato digital automático incluido.</p>
              <a href="/contratar-camareros" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Ver camareros en XPEAK →</a>
            </div>
          </div>
        </main>
      <FooterPublic />
      </div>
    </>
  );
}
