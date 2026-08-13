import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogAnswerBox from '@/components/BlogAnswerBox';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';

const article = {
  '@context': 'https://schema.org', '@type': 'Article',
  headline: 'Fotógrafo para bodas en Tenerife: precio y guía 2026',
  description: 'Cuánto cuesta un fotógrafo para una boda en Tenerife. Precios reales 2026, fincas volcánicas, el Teide y el mercado de bodas internacionales más activo de Canarias.',
  datePublished: '2026-06-08', dateModified: '2026-06-08',
  author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' },
  publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
  url: 'https://xpeak.es/blog/fotografo-boda-tenerife',
};

const breadcrumb = {
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'Fotógrafo boda Tenerife', item: 'https://xpeak.es/blog/fotografo-boda-tenerife' },
  ],
};

const faqStructured = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: '¿Cuánto cuesta un fotógrafo de bodas en Tenerife?', acceptedAnswer: { '@type': 'Answer', text: 'Un fotógrafo de bodas en Tenerife cuesta entre 1.000€ y 3.500€. Las bodas de destino internacionales suelen contratar fotógrafos de fuera con presupuestos más altos (2.500€–5.000€), mientras las parejas locales tienen acceso a excelentes profesionales en el rango 1.000–2.000€.' } },
    { '@type': 'Question', name: '¿Se puede fotografiar en el Teide?', acceptedAnswer: { '@type': 'Answer', text: 'Las sesiones fotográficas en el Parque Nacional del Teide requieren autorización del Cabildo de Tenerife. El proceso tarda 15–30 días y tiene coste variable. Para postbodas al amanecer en el Teide es una de las experiencias más demandadas de España.' } },
    { '@type': 'Question', name: '¿Tenerife tiene temporada alta para bodas?', acceptedAnswer: { '@type': 'Answer', text: 'Tenerife tiene clima estable todo el año, lo que la hace popular en invierno para bodas de destino de parejas europeas (alemanas, británicas, escandinavas). La temporada más intensa es octubre–mayo.' } },
  ],
};

const PRICES = [
  { perfil: 'Fotógrafo local emergente', rango: '800€ – 1.200€', nota: 'Conoce la isla, buena relación precio/calidad' },
  { perfil: 'Fotógrafo profesional', rango: '1.200€ – 2.200€', nota: 'Reportaje completo, postboda opcional' },
  { perfil: 'Fotógrafo premium', rango: '2.200€ – 3.500€', nota: 'Sesión Teide, edición artística' },
  { perfil: 'Fotógrafo destino internacional', rango: '3.000€ – 6.000€', nota: 'Viajes incluidos, parejas extranjeras' },
];

export default function BlogFotografoBodaTenerife() {
  return (
    <>
      <Helmet>
        <title>Fotógrafo de Bodas en Tenerife: Precios y Guía 2026 | XPEAK</title>
        <meta name="description" content="¿Cuánto cuesta un fotógrafo de bodas en Tenerife en 2026? Precios reales, sesiones en el Teide, fincas volcánicas y cómo contratar al mejor fotógrafo." />
        <link rel="canonical" href="https://xpeak.es/blog/fotografo-boda-tenerife" />
        <meta property="og:title" content="Fotógrafo de Bodas en Tenerife: Precios y Guía 2026" />
        <meta property="og:url" content="https://xpeak.es/blog/fotografo-boda-tenerife" />
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
            <span className="text-neutral-300">Fotógrafo boda Tenerife</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-black mb-4 leading-tight">Fotógrafo de Bodas en Tenerife:<br />Precios y Guía 2026</h1>
          <p className="text-neutral-400 text-sm mb-8">Actualizado junio 2026 · 8 min lectura</p>

          <BlogAnswerBox question="¿Cuánto cuesta un fotógrafo de bodas en Tenerife?">
            Un fotógrafo de bodas en Tenerife cuesta entre <strong>1.000€ y 3.500€</strong>. Las bodas de destino internacionales mueven presupuestos más altos. El clima estable todo el año hace de Tenerife uno de los destinos de boda más activos de España durante el invierno europeo.
          </BlogAnswerBox>

          <p className="text-neutral-300 mb-6">Tenerife es mucho más que playa: el Teide al amanecer, los acantilados de Los Gigantes, los bosques de laurisilva en Anaga o las fincas históricas de La Orotava ofrecen paisajes imposibles para reportajes de boda únicos en Europa.</p>

          <BlogInlineCTA role="fotografo" text="¿Buscas fotógrafo para tu boda en Tenerife? Encuentra los mejores profesionales de la isla en XPEAK." />

          <h2 className="text-2xl font-bold mt-10 mb-4">Precios fotógrafo boda Tenerife 2026</h2>
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

          <h2 className="text-2xl font-bold mt-10 mb-4">Localizaciones imprescindibles para fotos de boda en Tenerife</h2>
          <ul className="space-y-3 mb-8 text-neutral-300">
            <li><strong className="text-white">Parque Nacional del Teide</strong> — Al amanecer el volcán emerge entre nubes. Requiere permiso del Cabildo. Impresionante.</li>
            <li><strong className="text-white">Acantilados de Los Gigantes</strong> — Paredes volcánicas de 600m sobre el mar. Ideal para bodas en barco o sesiones al atardecer.</li>
            <li><strong className="text-white">Pueblo de La Orotava</strong> — Casas coloniales, jardines centenarios y arquitectura canaria. El escenario más fotogénico del interior.</li>
            <li><strong className="text-white">Bosque de Anaga</strong> — Laurisilva con niebla y luz filtrada. Para reportajes con atmósfera mágica.</li>
            <li><strong className="text-white">Playa de Las Teresitas</strong> — Arena dorada y palmeras. La postal canaria clásica para postbodas.</li>
          </ul>

          <BlogEmailCapture variant="presupuestos" intent="contratar-fotografo" articlePath="/blog/fotografo-boda-tenerife" />

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
        <BlogRelatedPosts currentSlug='/blog/fotografo-boda-tenerife' tag='Fotografía' />
        <FooterPublic />
        <BlogScrollCTA role="fotografo" storageKey="xpeak_scrollcta_fotografo_tenerife" />
      </div>
    </>
  );
}
