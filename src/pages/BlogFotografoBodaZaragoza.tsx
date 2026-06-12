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
  headline: 'Fotógrafo para bodas en Zaragoza: precio y guía 2026',
  description: 'Cuánto cuesta un fotógrafo para una boda en Zaragoza. Precios reales 2026, La Seo, el Pilar y las mejores localizaciones del Ebro.',
  datePublished: '2026-06-08', dateModified: '2026-06-08',
  author: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
  publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
  url: 'https://xpeak.es/blog/fotografo-boda-zaragoza',
};

const breadcrumb = {
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'Fotógrafo boda Zaragoza', item: 'https://xpeak.es/blog/fotografo-boda-zaragoza' },
  ],
};

const faqStructured = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: '¿Cuánto cuesta un fotógrafo de bodas en Zaragoza?', acceptedAnswer: { '@type': 'Answer', text: 'Un fotógrafo de bodas en Zaragoza cuesta entre 750€ y 2.000€. Los precios son algo más competitivos que en Madrid o Barcelona, con muy buena calidad media en la región aragonesa.' } },
    { '@type': 'Question', name: '¿Se puede fotografiar en la Basílica del Pilar?', acceptedAnswer: { '@type': 'Answer', text: 'El interior de la Basílica no permite sesiones fotográficas privadas durante la ceremonia sin autorización especial. Los exteriores con el Pilar al fondo son libres y muy demandados para postbodas.' } },
    { '@type': 'Question', name: '¿Cuándo reservar fotógrafo de bodas en Zaragoza?', acceptedAnswer: { '@type': 'Answer', text: 'Con 6–9 meses de antelación es suficiente en temporada media. Para bodas en octubre (temporada alta aragonesa) o en primavera, reserva con al menos 10–12 meses.' } },
  ],
};

const PRICES = [
  { perfil: 'Fotógrafo emergente', rango: '600€ – 900€', nota: 'Ideal para bodas íntimas o civiles' },
  { perfil: 'Fotógrafo profesional', rango: '900€ – 1.600€', nota: 'Reportaje completo, álbum digital' },
  { perfil: 'Fotógrafo premium', rango: '1.600€ – 2.500€', nota: 'Edición artística, postboda Pirineos' },
  { perfil: 'Fotógrafo de referencia', rango: '2.500€ – 3.800€', nota: 'Premiado, publicaciones nacionales' },
];

export default function BlogFotografoBodaZaragoza() {
  return (
    <>
      <Helmet>
        <title>Fotógrafo de Bodas en Zaragoza: Precios y Guía 2026 | XPEAK</title>
        <meta name="description" content="¿Cuánto cuesta un fotógrafo de bodas en Zaragoza en 2026? Precios reales, Basílica del Pilar, Pirineos y cómo contratar al mejor fotógrafo para tu boda." />
        <link rel="canonical" href="https://xpeak.es/blog/fotografo-boda-zaragoza" />
        <meta property="og:title" content="Fotógrafo de Bodas en Zaragoza: Precios y Guía 2026" />
        <meta property="og:url" content="https://xpeak.es/blog/fotografo-boda-zaragoza" />
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
            <span className="text-neutral-300">Fotógrafo boda Zaragoza</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-black mb-4 leading-tight">Fotógrafo de Bodas en Zaragoza:<br />Precios y Guía 2026</h1>
          <p className="text-neutral-400 text-sm mb-8">Actualizado junio 2026 · 7 min lectura</p>

          <BlogAnswerBox question="¿Cuánto cuesta un fotógrafo de bodas en Zaragoza?">
            Un fotógrafo de bodas en Zaragoza cuesta entre <strong>750€ y 2.000€</strong>. Los precios son competitivos respecto a Madrid o Barcelona, y la calidad media de los fotógrafos aragoneses es muy alta, especialmente para bodas en fincas o con el Pilar de fondo.
          </BlogAnswerBox>

          <p className="text-neutral-300 mb-6">Zaragoza ofrece una combinación única: arquitectura mudéjar declarada Patrimonio UNESCO, el río Ebro como escenario natural, y acceso rápido a los Pirineos para sesiones de postboda únicas en Europa.</p>

          <BlogInlineCTA role="media" text="¿Buscas fotógrafo para tu boda en Zaragoza? Compara perfiles y disponibilidad en XPEAK." />

          <h2 className="text-2xl font-bold mt-10 mb-4">Precios fotógrafo boda Zaragoza 2026</h2>
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

          <h2 className="text-2xl font-bold mt-10 mb-4">Mejores localizaciones para fotos de boda en Zaragoza</h2>
          <ul className="space-y-3 mb-8 text-neutral-300">
            <li><strong className="text-white">Basílica del Pilar (exterior)</strong> — Icono absoluto. Los reflejos en el Ebro al amanecer son de otro nivel.</li>
            <li><strong className="text-white">La Seo (Catedral de San Salvador)</strong> — Arquitectura mudéjar-gótica. Ideal para bodas religiosas con reportaje en el entorno medieval.</li>
            <li><strong className="text-white">Palacio de la Aljafería</strong> — Fortaleza morisca del s.XI. Requiere permiso previo pero las fotos son espectaculares.</li>
            <li><strong className="text-white">Pirineos aragoneses</strong> — Para sesiones postboda únicas: Ordesa, Benasque, Hecho. A 2h de Zaragoza.</li>
            <li><strong className="text-white">Bodegas del Somontano / Cariñena</strong> — Viñedos en otoño con colores dorados. Muy demandado en octubre.</li>
          </ul>

          <BlogEmailCapture variant="presupuestos" intent="contratar-fotografo" articlePath="/blog/fotografo-boda-zaragoza" />

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
        <BlogScrollCTA role="media" storageKey="xpeak_scrollcta_fotografo_zaragoza" />
      </div>
    </>
  );
}
