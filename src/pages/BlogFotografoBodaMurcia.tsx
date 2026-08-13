import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogAnswerBox from '@/components/BlogAnswerBox';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';
import DJResourcesAffiliate from '@/components/DJResourcesAffiliate';

const article = {
  '@context': 'https://schema.org', '@type': 'Article',
  headline: 'Fotógrafo para bodas en Murcia: precio y guía 2026',
  description: 'Cuánto cuesta un fotógrafo para una boda en Murcia. Precios reales 2026, haciendas y fincas del Segura, huerta murciana y Mar Menor.',
  datePublished: '2026-06-08', dateModified: '2026-06-08',
  author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' },
  publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
  url: 'https://xpeak.es/blog/fotografo-boda-murcia',
};

const breadcrumb = {
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'Fotógrafo boda Murcia', item: 'https://xpeak.es/blog/fotografo-boda-murcia' },
  ],
};

const faqStructured = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: '¿Cuánto cuesta un fotógrafo de bodas en Murcia?', acceptedAnswer: { '@type': 'Answer', text: 'Un fotógrafo de bodas en Murcia cuesta entre 700€ y 1.900€. Los precios son más accesibles que en Madrid o Barcelona, con fotógrafos de gran nivel que conocen las fincas y haciendas de la región.' } },
    { '@type': 'Question', name: '¿Cuál es la mejor época para bodas en Murcia?', acceptedAnswer: { '@type': 'Answer', text: 'La primavera (marzo–mayo) y el otoño (septiembre–noviembre) son las épocas ideales. El verano murciano con calores de 40°C+ complica la logística fotográfica y la comodidad de los invitados.' } },
    { '@type': 'Question', name: '¿Qué localizaciones únicas tiene Murcia para bodas?', acceptedAnswer: { '@type': 'Answer', text: 'Las haciendas y fincas en la huerta murciana, bodegas en Jumilla o Yecla, y el Mar Menor para sesiones costeras. La Catedral de Murcia y el Casino son opciones urbanas icónicas.' } },
  ],
};

const PRICES = [
  { perfil: 'Fotógrafo emergente', rango: '600€ – 900€', nota: 'Gran relación calidad/precio' },
  { perfil: 'Fotógrafo profesional', rango: '900€ – 1.500€', nota: 'Reportaje completo, álbum digital' },
  { perfil: 'Fotógrafo premium', rango: '1.500€ – 2.400€', nota: 'Edición artística, sesión postboda' },
  { perfil: 'Fotógrafo de referencia', rango: '2.400€ – 3.500€', nota: 'Premiado, publicaciones nacionales' },
];

export default function BlogFotografoBodaMurcia() {
  return (
    <>
      <Helmet>
        <title>Fotógrafo de Bodas en Murcia: Precios y Guía 2026 | XPEAK</title>
        <meta name="description" content="¿Cuánto cuesta un fotógrafo de bodas en Murcia en 2026? Precios reales, haciendas, bodegas Jumilla y las mejores localizaciones murcianas para tu boda." />
        <link rel="canonical" href="https://xpeak.es/blog/fotografo-boda-murcia" />
        <meta property="og:title" content="Fotógrafo de Bodas en Murcia: Precios y Guía 2026" />
        <meta property="og:url" content="https://xpeak.es/blog/fotografo-boda-murcia" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
      </Helmet>
      <div className="min-h-screen" style={{ background: '#0A0A0A', color: '#F5F5F0' }}>
        <article className="max-w-3xl mx-auto px-4 py-12">
          <nav className="text-xs text-neutral-500 mb-6 flex gap-2">
            <a href="/" className="hover:text-neutral-300">Inicio</a><span>/</span>
            <a href="/blog" className="hover:text-neutral-300">Blog</a><span>/</span>
            <span className="text-neutral-300">Fotógrafo boda Murcia</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-black mb-4 leading-tight">Fotógrafo de Bodas en Murcia:<br />Precios y Guía 2026</h1>
          <p className="text-neutral-400 text-sm mb-8">Actualizado junio 2026 · 7 min lectura</p>

          <BlogAnswerBox question="¿Cuánto cuesta un fotógrafo de bodas en Murcia?">
            Un fotógrafo de bodas en Murcia cuesta entre <strong>700€ y 1.900€</strong>. Murcia tiene una oferta fotográfica de muy buena calidad a precios más competitivos que las grandes ciudades, con profesionales especializados en las fincas y haciendas de la región.
          </BlogAnswerBox>

          <p className="text-neutral-300 mb-6">La Región de Murcia es uno de los mercados de bodas más activos del sureste español. La combinación de haciendas en la huerta, bodegas premiadas en Jumilla o Yecla, y acceso al Mar Menor hace de Murcia un escenario excepcional para bodas con identidad propia.</p>

          <BlogInlineCTA role="fotografo" text="¿Buscas fotógrafo para tu boda en Murcia? Encuentra los mejores profesionales en XPEAK." />

          <h2 className="text-2xl font-bold mt-10 mb-4">Precios fotógrafo boda Murcia 2026</h2>
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm border-collapse">
              <thead><tr style={{ background: 'rgba(212,175,55,0.08)' }}>
                <th className="text-left p-3 border border-white/10">Perfil</th>
                <th className="text-left p-3 border border-white/10">Precio</th>
                <th className="text-left p-3 border border-white/10">Notas</th>
              </tr></thead>
              <tbody>{PRICES.map((p, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                  <td className="p-3 border border-white/10 font-medium">{p.perfil}</td>
                  <td className="p-3 border border-white/10 font-bold" style={{ color: '#D4AF37' }}>{p.rango}</td>
                  <td className="p-3 border border-white/10 text-neutral-400">{p.nota}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">Mejores localizaciones para fotos de boda en Murcia</h2>
          <ul className="space-y-3 mb-8 text-neutral-300">
            <li><strong className="text-white">Catedral de Murcia</strong> — Fachada barroca única en España. El centro histórico ofrece rincones fotogénicos a pie de calle.</li>
            <li><strong className="text-white">Haciendas de la Vega del Segura</strong> — Fincas históricas con naranjos y palmeras. El escenario más demandado de la región.</li>
            <li><strong className="text-white">Bodegas de Jumilla / Yecla</strong> — Viñedos y arquitectura winery para bodas con encanto rural.</li>
            <li><strong className="text-white">Mar Menor (Los Alcázares, Santiago de la Ribera)</strong> — Puestas de sol sobre la laguna más grande de Europa.</li>
          </ul>

          <BlogEmailCapture variant="presupuestos" intent="contratar-fotografo" articlePath="/blog/fotografo-boda-murcia" />

          <h2 className="text-2xl font-bold mt-10 mb-4">Preguntas frecuentes</h2>
          {faqStructured.mainEntity.map((faq, i) => (
            <div key={i} className="mb-5 p-4 rounded-xl border border-white/10">
              <h3 className="font-semibold text-white mb-2">{faq.name}</h3>
              <p className="text-neutral-400 text-sm">{faq.acceptedAnswer.text}</p>
            </div>
          ))}
          <DJResourcesAffiliate role="fotografo" />
          <BlogAuthor />
          <BlogShare />
        </article>
        <BlogRelatedPosts currentSlug='/blog/fotografo-boda-murcia' tag='Fotografía' />
        <FooterPublic />
        <BlogScrollCTA role="fotografo" storageKey="xpeak_scrollcta_fotografo_murcia" />
      </div>
    </>
  );
}
