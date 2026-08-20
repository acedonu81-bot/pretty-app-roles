import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';

const article = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Cuánto cuesta contratar un cuarteto de cuerda para boda en España 2026',
  description: 'Precios reales de cuartetos de cuerda para bodas en España. Solo ceremonia, ceremonia y cóctel o evento completo. Cuándo reservarlo y alternativas.',
  datePublished: '2026-06-14',
  dateModified: '2026-06-14',
  author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' },
  publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } },
  image: 'https://xpeak.es/og-image.jpg',
  url: 'https://xpeak.es/blog/cuarteto-cuerda-boda-precio',
};

const faqStructured = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Cuánto cuesta un cuarteto de cuerda para una boda?',
      acceptedAnswer: { '@type': 'Answer', text: 'Un cuarteto de cuerda para boda en España cuesta entre 350€ y 600€ para solo la ceremonia (45-60 min), entre 600€ y 1.000€ para ceremonia más cóctel (2-3h) y entre 800€ y 1.500€ para un evento completo incluyendo recepción. El precio varía según la ciudad, la duración y si se necesita equipo de sonido.' }
    },
    {
      '@type': 'Question',
      name: '¿Con cuánta antelación hay que contratar un cuarteto de cuerda?',
      acceptedAnswer: { '@type': 'Answer', text: 'Lo recomendable es reservar el cuarteto con 6-9 meses de antelación, especialmente si la boda es en temporada alta (mayo-octubre). Los cuartetos con buena reputación se agotan rápido los fines de semana de junio y septiembre. Para fechas entre noviembre y marzo, 3-4 meses suele ser suficiente.' }
    },
    {
      '@type': 'Question',
      name: '¿Qué incluye el servicio de un cuarteto de cuerda?',
      acceptedAnswer: { '@type': 'Answer', text: 'Normalmente incluye el repertorio acordado (clásico, pop adaptado o mezcla), los instrumentos, el desplazamiento hasta un radio habitual de 50-100 km, y el montaje y desmontaje. En espacios con mucho ruido ambiente o al aire libre puede ser necesario contratar amplificación aparte, lo que suma 100-200€ adicionales.' }
    },
    {
      '@type': 'Question',
      name: '¿Es mejor un cuarteto, un trío o un dúo para una boda?',
      acceptedAnswer: { '@type': 'Answer', text: 'Depende del presupuesto y del espacio. Un cuarteto (2 violines, viola y cello) ofrece el sonido más completo y es ideal para ceremonias en iglesia o espacios grandes. Un trío (violín, viola y cello) suena muy bien en espacios medianos con un coste un 20-30% menor. El dúo de violín y piano o violín y guitarra es la opción más económica y funciona bien en ceremonias íntimas.' }
    },
  ],
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'Cuarteto de cuerda boda precio', item: 'https://xpeak.es/blog/cuarteto-cuerda-boda-precio' },
  ],
};

const PRECIOS = [
  { formato: 'Solo ceremonia (45-60 min)', precio: '350–600€', para: 'Entrada, firma, salida de la iglesia o sala' },
  { formato: 'Ceremonia + cóctel (2-3h)', precio: '600–1.000€', para: 'El formato más contratado para bodas' },
  { formato: 'Evento completo (4-5h)', precio: '800–1.500€', para: 'Ceremonia, cóctel y parte de la recepción' },
  { formato: 'Dúo acústico', precio: '200–400€', para: 'Alternativa íntima y económica' },
  { formato: 'Trío de cuerda', precio: '350–700€', para: 'Equilibrio entre coste y sonido completo' },
  { formato: 'Cuarteto con amplificación', precio: '+100–200€', para: 'Exteriores o espacios con ruido ambiente' },
];

export default function BlogCuartetoCuerdaPrecio() {
  return (
    <>
      <Helmet>
        <title>Cuarteto de cuerda para boda: precios 2026 España | XPEAK</title>
        <meta name="description" content="Cuánto cuesta contratar un cuarteto de cuerda para boda en España. Precios por duración, cuándo reservarlo y alternativas como dúo o trío." />
        <link rel="canonical" href="https://xpeak.es/blog/cuarteto-cuerda-boda-precio" />
        <meta property="og:title" content="Cuarteto de cuerda para boda: precios 2026 — XPEAK Blog" />
        <meta property="og:description" content="Precios reales de cuartetos de cuerda para bodas en España. Solo ceremonia, ceremonia y cóctel o evento completo." />
        <meta property="og:url" content="https://xpeak.es/blog/cuarteto-cuerda-boda-precio" />
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
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#DB2777' }}>XPEAK</a>
          <div className="flex items-center gap-3">
            <a href="/blog" className="text-xs font-bold" style={{ color: '#3d3d4e' }}>Blog</a>
            <a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#DB2777,#B8941E)', color: '#000' }}>Unirse gratis</a>
          </div>
        </nav>
        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#DB2777' }}>Música · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Cuánto cuesta contratar un cuarteto de cuerda para boda en España (2026)</h1>
            <p className="text-base leading-relaxed" style={{ color: '#3d3d4e' }}>El cuarteto de cuerda es uno de los elementos que más elevan el nivel de una boda. Precios reales por formato, cuándo reservarlo y qué alternativas existen si el presupuesto es ajustado.</p>
            <time className="text-xs mt-3 block" style={{ color: '#666' }}>14 junio 2026</time>
          </div>
          <div className="space-y-10">

            <section>
              <h2 className="text-lg font-black mb-4">Qué incluye el servicio de un cuarteto de cuerda</h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#222' }}>
                Un cuarteto de cuerda profesional está formado por dos violinistas, una viola y un cello. El servicio estándar incluye el repertorio acordado con los novios, el desplazamiento hasta un radio habitual de 50-100 km desde su sede y el montaje y desmontaje del material.
              </p>
              <p className="text-base leading-relaxed" style={{ color: '#222' }}>
                Muchos grupos ofrecen mezcla de repertorio: obras clásicas para la entrada y firma, versiones instrumentales de canciones pop o bandas sonoras para el cóctel. Es importante aclarar con el grupo qué piezas pueden interpretar y si cobran extra por aprender piezas nuevas fuera de su repertorio habitual.
              </p>
              <div className="mt-4 p-4 rounded-xl text-sm" style={{ background: 'rgba(219,39,119,0.06)', border: '1px solid rgba(219,39,119,0.15)', color: '#222' }}>
                En espacios al aire libre o con mucho ruido ambiente, algunos cuartetos requieren amplificacion. Esto suma entre 100€ y 200€ al precio final. Consúltalo antes de firmar el contrato.
              </div>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">Precios según duración y formato</h2>
              <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                <table className="w-full text-xs">
                  <thead>
                    <tr style={{ background: 'rgba(219,39,119,0.08)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                      <th className="text-left px-4 py-3 font-bold">Formato</th>
                      <th className="px-4 py-3 font-bold text-right">Precio orientativo</th>
                      <th className="px-4 py-3 font-bold text-left hidden sm:table-cell">Cuando usarlo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PRECIOS.map((row, i) => (
                      <tr key={row.formato} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                        <td className="px-4 py-3 font-medium">{row.formato}</td>
                        <td className="px-4 py-3 text-right font-bold" style={{ color: '#DB2777' }}>{row.precio}</td>
                        <td className="px-4 py-3 hidden sm:table-cell" style={{ color: '#3d3d4e' }}>{row.para}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Precios orientativos para España 2026. Pueden variar según ciudad, grupo y desplazamiento.</p>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">Cuándo reservar el cuarteto de cuerda</h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#222' }}>
                Los cuartetos con buena reputación tienen agenda muy limitada en temporada alta. La norma general es reservar con <strong style={{ color: '#111' }}>6-9 meses de antelación</strong> si la boda es entre mayo y octubre.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { mes: 'Noviembre - Marzo', tiempo: '3-4 meses', nota: 'Temporada baja, más disponibilidad' },
                  { mes: 'Abril - Junio', tiempo: '6-9 meses', nota: 'Temporada alta, muy demandado' },
                  { mes: 'Julio - Octubre', tiempo: '6-8 meses', nota: 'Bodas en fincas y exteriores' },
                ].map(r => (
                  <div key={r.mes} className="p-4 rounded-xl text-center" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}>
                    <p className="text-xs font-bold mb-1">{r.mes}</p>
                    <p className="text-base font-black mb-1" style={{ color: '#DB2777' }}>{r.tiempo}</p>
                    <p className="text-[0.65rem]" style={{ color: '#3d3d4e' }}>{r.nota}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">Alternativas al cuarteto de cuerda</h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#222' }}>
                Si el presupuesto no llega a un cuarteto completo o el espacio es reducido, estas opciones ofrecen un resultado excelente con un coste menor:
              </p>
              <div className="space-y-3">
                {[
                  { nombre: 'Trío de cuerda', desc: 'Violin, viola y cello. Sonido muy completo. Un 20-30% más económico que el cuarteto.', precio: '350–700€' },
                  { nombre: 'Dúo de violín y piano', desc: 'Ideal para ceremonias íntimas en interiores. Elegante y emocionante con menos músicos.', precio: '200–450€' },
                  { nombre: 'Violín y guitarra clásica', desc: 'Opción cálida y versátil, funciona muy bien en exteriores sin necesitar amplificación.', precio: '180–380€' },
                  { nombre: 'Saxofón y piano', desc: 'Para quienes prefieren un sonido más jazzístico en el cóctel. Muy popular en eventos de empresa.', precio: '250–500€' },
                ].map(a => (
                  <div key={a.nombre} className="flex items-start gap-4 p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}>
                    <div className="flex-1">
                      <p className="text-sm font-black mb-1">{a.nombre}</p>
                      <p className="text-sm leading-relaxed" style={{ color: '#3d3d4e' }}>{a.desc}</p>
                    </div>
                    <p className="text-sm font-bold flex-shrink-0" style={{ color: '#DB2777' }}>{a.precio}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">
                {faqStructured.mainEntity.map(faq => (
                  <div key={faq.name} className="p-5 rounded-xl" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.07)' }}>
                    <p className="text-sm font-bold mb-2">{faq.name}</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#444' }}>{faq.acceptedAnswer.text}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl p-6 sm:p-8 text-center" style={{ background: 'rgba(219,39,119,0.05)', border: '1px solid rgba(219,39,119,0.15)' }}>
              <p className="text-base font-black mb-2">Encuentra grupos musicales para tu boda</p>
              <p className="text-xs mb-5" style={{ color: '#444' }}>Cuartetos, tríos, grupos de jazz y música en vivo. Perfiles verificados con precio público. Sin comisión.</p>
              <a href="/directorio/grupo-musical"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all hover:scale-105"
                style={{ background: 'linear-gradient(90deg,#DB2777,#B8941E)', color: '#000' }}>
                Ver grupos musicales
              </a>
            </section>

          </div>
        </main>
        <BlogRelatedPosts currentSlug='/blog/cuarteto-cuerda-boda-precio' tag='Bodas' />
        <FooterPublic />
        <BlogScrollCTA role="general" storageKey="xpeak_scrollcta_cuarteto_cuerda_precio" />
      </div>
    </>
  );
}
