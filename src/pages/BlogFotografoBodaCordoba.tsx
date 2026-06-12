import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogAnswerBox from '@/components/BlogAnswerBox';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';

const article = {
  '@context': 'https://schema.org', '@type': 'Article',
  headline: 'Fotógrafo para bodas en Córdoba: precio y guía 2026',
  description: 'Cuánto cuesta un fotógrafo para una boda en Córdoba. Precios reales 2026, La Mezquita-Catedral, Patios cordobeses y la Judería.',
  datePublished: '2026-06-08', dateModified: '2026-06-08',
  author: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
  publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
  url: 'https://xpeak.es/blog/fotografo-boda-cordoba',
};

const breadcrumb = {
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'Fotógrafo boda Córdoba', item: 'https://xpeak.es/blog/fotografo-boda-cordoba' },
  ],
};

const faqStructured = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: '¿Cuánto cuesta un fotógrafo de bodas en Córdoba?', acceptedAnswer: { '@type': 'Answer', text: 'Un fotógrafo de bodas en Córdoba cuesta entre 750€ y 2.000€. Las bodas con acceso a la Mezquita-Catedral o los Patios cordobeses pueden incluir extras por permisos o coordinación con el Cabildo (200–400€).' } },
    { '@type': 'Question', name: '¿Se puede fotografiar dentro de la Mezquita-Catedral de Córdoba?', acceptedAnswer: { '@type': 'Answer', text: 'Las sesiones fotográficas privadas en el interior de la Mezquita-Catedral requieren autorización especial del Cabildo. La Puerta del Perdón y los alrededores son libremente accesibles para reportajes exteriores.' } },
    { '@type': 'Question', name: '¿Cuándo es la mejor época para bodas en Córdoba?', acceptedAnswer: { '@type': 'Answer', text: 'La primavera (marzo–mayo) es la época dorada, especialmente durante el Festival de los Patios en mayo. El otoño (septiembre–noviembre) es también excelente. El verano (julio–agosto) es muy caluroso con temperaturas superiores a 40°C.' } },
  ],
};

const PRICES = [
  { perfil: 'Fotógrafo emergente', rango: '650€ – 950€', nota: 'Conoce la ciudad, buen precio' },
  { perfil: 'Fotógrafo profesional', rango: '950€ – 1.700€', nota: 'Cobertura completa, álbum digital' },
  { perfil: 'Fotógrafo premium', rango: '1.700€ – 2.500€', nota: 'Edición artística, acceso Patios' },
  { perfil: 'Fotógrafo de referencia', rango: '2.500€ – 4.000€', nota: 'Premiado, publicaciones nacionales' },
];

export default function BlogFotografoBodaCordoba() {
  return (
    <>
      <Helmet>
        <title>Fotógrafo de Bodas en Córdoba: Precios y Guía 2026 | XPEAK</title>
        <meta name="description" content="¿Cuánto cuesta un fotógrafo de bodas en Córdoba en 2026? Precios reales, Mezquita-Catedral, Patios cordobeses y las mejores localizaciones para tu boda." />
        <link rel="canonical" href="https://xpeak.es/blog/fotografo-boda-cordoba" />
        <meta property="og:title" content="Fotógrafo de Bodas en Córdoba: Precios y Guía 2026" />
        <meta property="og:url" content="https://xpeak.es/blog/fotografo-boda-cordoba" />
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
            <span className="text-neutral-300">Fotógrafo boda Córdoba</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-black mb-4 leading-tight">Fotógrafo de Bodas en Córdoba:<br />Precios y Guía 2026</h1>
          <p className="text-neutral-400 text-sm mb-8">Actualizado junio 2026 · 7 min lectura</p>

          <BlogAnswerBox question="¿Cuánto cuesta un fotógrafo de bodas en Córdoba?">
            Un fotógrafo de bodas en Córdoba cuesta entre <strong>750€ y 2.000€</strong>. La Mezquita-Catedral, la Judería y los Patios cordobeses son escenarios que producen imágenes de nivel internacional a precios muy competitivos respecto a otras ciudades Patrimonio UNESCO.
          </BlogAnswerBox>

          <p className="text-neutral-300 mb-6">Córdoba es Patrimonio de la Humanidad con tres declaraciones UNESCO (Mezquita-Catedral, Centro Histórico y Festival de los Patios). Para un fotógrafo de bodas, la ciudad es un paraíso: callejuelas con cal blanca, naranjos en flor y una luz andaluza única.</p>

          <BlogInlineCTA role="media" text="¿Buscas fotógrafo para tu boda en Córdoba? Compara perfiles y tarifas en XPEAK." />

          <h2 className="text-2xl font-bold mt-10 mb-4">Precios fotógrafo boda Córdoba 2026</h2>
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

          <h2 className="text-2xl font-bold mt-10 mb-4">Mejores localizaciones para fotos de boda en Córdoba</h2>
          <ul className="space-y-3 mb-8 text-neutral-300">
            <li><strong className="text-white">Mezquita-Catedral</strong> — El monumento más fotografiado de Andalucía. El Patio de los Naranjos en primavera es absolutamente único.</li>
            <li><strong className="text-white">Judería y Calleja de las Flores</strong> — La postal más icónica de Córdoba. Libre de permisos, ideal para reportajes íntimos.</li>
            <li><strong className="text-white">Patios Cordobeses</strong> — Durante mayo (Festival de Patios UNESCO) los geranios en cascada crean decorados naturales imposibles.</li>
            <li><strong className="text-white">Alcázar de los Reyes Cristianos</strong> — Jardines, fuentes y murallas medievales. Sesiones postboda en los jardines al atardecer.</li>
            <li><strong className="text-white">Haciendas del Valle de los Pedroches</strong> — Para bodas rurales con dehesa y encinas centenarias al fondo.</li>
          </ul>

          <BlogEmailCapture variant="presupuestos" intent="contratar-fotografo" articlePath="/blog/fotografo-boda-cordoba" />

          <h2 className="text-2xl font-bold mt-10 mb-4">Preguntas frecuentes</h2>
          {faqStructured.mainEntity.map((faq, i) => (
            <div key={i} className="mb-5 p-4 rounded-xl border border-white/10">
              <h3 className="font-semibold text-white mb-2">{faq.name}</h3>
              <p className="text-neutral-400 text-sm">{faq.acceptedAnswer.text}</p>
            </div>
          ))}
          <BlogAuthor />
          <BlogShare />
        </article>
        <FooterPublic />
        <BlogScrollCTA role="media" storageKey="xpeak_scrollcta_fotografo_cordoba" />
      </div>
    </>
  );
}
