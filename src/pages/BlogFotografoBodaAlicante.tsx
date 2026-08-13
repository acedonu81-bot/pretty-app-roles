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
  headline: 'Fotógrafo para bodas en Alicante: precio y guía 2026',
  description: 'Cuánto cuesta un fotógrafo para una boda en Alicante. Precios reales 2026, playas, castillos y la luz mediterránea única de la Costa Blanca.',
  datePublished: '2026-06-08', dateModified: '2026-06-08',
  author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' },
  publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
  url: 'https://xpeak.es/blog/fotografo-boda-alicante',
};

const breadcrumb = {
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'Fotógrafo boda Alicante', item: 'https://xpeak.es/blog/fotografo-boda-alicante' },
  ],
};

const faqStructured = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: '¿Cuánto cuesta un fotógrafo de bodas en Alicante?', acceptedAnswer: { '@type': 'Answer', text: 'Un fotógrafo de bodas en Alicante cuesta entre 800€ y 2.200€. Las bodas en fincas y haciendas del interior o frente al Mediterráneo tienen precios similares a otras ciudades levantinas.' } },
    { '@type': 'Question', name: '¿Cuál es la mejor época para bodas fotográficas en Alicante?', acceptedAnswer: { '@type': 'Answer', text: 'La luz mediterránea es excepcional de octubre a abril: menos calor, cielos más dramáticos y atardeceres de oro. El verano tiene más horas de sol pero el calor y el turismo complican la logística.' } },
    { '@type': 'Question', name: '¿Qué incluye el precio del fotógrafo de bodas en Alicante?', acceptedAnswer: { '@type': 'Answer', text: 'Normalmente incluye 8–10 horas de cobertura, 300–600 fotos editadas, galería online y entrega en alta resolución. El álbum impreso, segundo fotógrafo y sesión postboda son extras.' } },
  ],
};

const PRICES = [
  { perfil: 'Fotógrafo emergente', rango: '600€ – 950€', nota: 'Buen precio, portfolio creciente' },
  { perfil: 'Fotógrafo profesional', rango: '950€ – 1.700€', nota: 'Cobertura completa, álbum digital' },
  { perfil: 'Fotógrafo premium', rango: '1.700€ – 2.800€', nota: 'Edición artística, postboda incluida' },
  { perfil: 'Fotógrafo de referencia', rango: '2.800€ – 4.000€', nota: 'Premios nacionales, publicaciones' },
];

export default function BlogFotografoBodaAlicante() {
  return (
    <>
      <Helmet>
        <title>Fotógrafo de Bodas en Alicante: Precios y Guía 2026 | XPEAK</title>
        <meta name="description" content="¿Cuánto cuesta un fotógrafo de bodas en Alicante en 2026? Precios reales, mejores localizaciones en la Costa Blanca y cómo contratar sin sorpresas." />
        <link rel="canonical" href="https://xpeak.es/blog/fotografo-boda-alicante" />
        <meta property="og:title" content="Fotógrafo de Bodas en Alicante: Precios y Guía 2026" />
        <meta property="og:url" content="https://xpeak.es/blog/fotografo-boda-alicante" />
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
            <span className="text-neutral-300">Fotógrafo boda Alicante</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-black mb-4 leading-tight">Fotógrafo de Bodas en Alicante:<br />Precios y Guía 2026</h1>
          <p className="text-neutral-400 text-sm mb-8">Actualizado junio 2026 · 7 min lectura</p>

          <BlogAnswerBox question="¿Cuánto cuesta un fotógrafo de bodas en Alicante?">
            Un fotógrafo de bodas en Alicante cuesta entre <strong>800€ y 2.200€</strong>. La Costa Blanca atrae fotógrafos con gran nivel técnico gracias a la luz mediterránea. La temporada más cara es junio–septiembre.
          </BlogAnswerBox>

          <p className="text-neutral-300 mb-6">Alicante combina playas de postal, el Castillo de Santa Bárbara y fincas en el interior con viñedos. Un escenario excepcional para bodas y para los fotógrafos que saben aprovechar la luz única del Mediterráneo.</p>

          <BlogInlineCTA role="fotografo" text="¿Buscas fotógrafo para tu boda en Alicante? Compara perfiles y tarifas en XPEAK." />

          <h2 className="text-2xl font-bold mt-10 mb-4">Precios fotógrafo boda Alicante 2026</h2>
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

          <h2 className="text-2xl font-bold mt-10 mb-4">Mejores localizaciones para fotos de boda en Alicante</h2>
          <ul className="space-y-3 mb-8 text-neutral-300">
            <li><strong className="text-white">Castillo de Santa Bárbara</strong> — Vistas panorámicas sobre la ciudad y el mar. La Golden Hour desde aquí es espectacular.</li>
            <li><strong className="text-white">Playa del Postiguet</strong> — Arena blanca y aguas turquesas como telón de fondo de una sesión de postboda.</li>
            <li><strong className="text-white">Explanada de España</strong> — Palmeras y mosaico de mármol. Icónica para fotos urbanas con identidad alicantina.</li>
            <li><strong className="text-white">Fincas en Novelda / Villena</strong> — Campos de viñas y olivos para bodas íntimas en el interior provincial.</li>
          </ul>

          <BlogEmailCapture variant="presupuestos" intent="contratar-fotografo" articlePath="/blog/fotografo-boda-alicante" />

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
        <BlogRelatedPosts currentSlug='/blog/fotografo-boda-alicante' tag='Fotografía' />
        <FooterPublic />
        <BlogScrollCTA role="fotografo" storageKey="xpeak_scrollcta_fotografo_alicante" />
      </div>
    </>
  );
}
