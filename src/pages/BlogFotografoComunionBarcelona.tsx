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
  headline: 'Fotógrafo de comunión en Barcelona: precio y guía 2026',
  description: 'Cuánto cuesta un fotógrafo de comunión en Barcelona. Precios reales 2026, mejores sesiones fotográficas, qué incluye y cómo reservar con antelación.',
  datePublished: '2026-06-08', dateModified: '2026-06-08',
  author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' },
  publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
  url: 'https://xpeak.es/blog/fotografo-comunion-barcelona',
};

const breadcrumb = {
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'Fotógrafo comunión Barcelona', item: 'https://xpeak.es/blog/fotografo-comunion-barcelona' },
  ],
};

const faqStructured = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: '¿Cuánto cuesta un fotógrafo de comunión en Barcelona?', acceptedAnswer: { '@type': 'Answer', text: 'Un fotógrafo de comunión en Barcelona cuesta entre 400€ y 1.200€. El precio incluye normalmente la cobertura del día (ceremonia + banquete, 5–7 horas) y una galería online. Barcelona tiene precios un 15–20% superiores a la media nacional por el coste de vida.' } },
    { '@type': 'Question', name: '¿Qué incluye el reportaje de comunión en Barcelona?', acceptedAnswer: { '@type': 'Answer', text: 'El paquete estándar incluye cobertura del día completo (preparativos, iglesia o civiles, banquete), 200–400 fotos editadas en alta resolución, galería online privada y entrega en 3–4 semanas. El álbum impreso es un extra en la mayoría de packs.' } },
    { '@type': 'Question', name: '¿Cuándo reservar fotógrafo de comunión en Barcelona?', acceptedAnswer: { '@type': 'Answer', text: 'Las comuniones en Barcelona se concentran en mayo y junio. Los fotógrafos de referencia se agotan con 6–9 meses de antelación. Reserva antes de diciembre para asegurar el fotógrafo que quieres en tu fecha.' } },
    { '@type': 'Question', name: '¿Hace falta sesión previa de estudio para la comunión?', acceptedAnswer: { '@type': 'Answer', text: 'Muchas familias contratan una sesión de estudio o de parque 1–2 semanas antes del día para conseguir fotos más intimistas y artísticas sin las prisas del día. Tiene un coste adicional de 150–300€ pero los resultados son muy diferentes.' } },
  ],
};

const PRICES = [
  { perfil: 'Fotógrafo emergente', rango: '350€ – 600€', nota: 'Cobertura básica, galería digital' },
  { perfil: 'Fotógrafo profesional', rango: '600€ – 950€', nota: 'Día completo, edición cuidada' },
  { perfil: 'Fotógrafo premium', rango: '950€ – 1.400€', nota: 'Sesión previa incluida, álbum' },
  { perfil: 'Fotógrafo de referencia', rango: '1.400€ – 2.000€', nota: 'Reportaje artístico, publicaciones' },
];

export default function BlogFotografoComunionBarcelona() {
  return (
    <>
      <Helmet>
        <title>Fotógrafo de Comunión en Barcelona: Precios y Guía 2026 | XPEAK</title>
        <meta name="description" content="¿Cuánto cuesta un fotógrafo de comunión en Barcelona en 2026? Precios reales, qué incluye el reportaje y cómo reservar con antelación para mayo y junio." />
        <link rel="canonical" href="https://xpeak.es/blog/fotografo-comunion-barcelona" />
        <meta property="og:title" content="Fotógrafo de Comunión en Barcelona: Precios y Guía 2026" />
        <meta property="og:url" content="https://xpeak.es/blog/fotografo-comunion-barcelona" />
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
            <span className="text-neutral-300">Fotógrafo comunión Barcelona</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-black mb-4 leading-tight">Fotógrafo de Comunión en Barcelona:<br />Precios y Guía 2026</h1>
          <p className="text-neutral-400 text-sm mb-8">Actualizado junio 2026 · 7 min lectura</p>

          <BlogAnswerBox question="¿Cuánto cuesta un fotógrafo de comunión en Barcelona?">
            Un fotógrafo de comunión en Barcelona cuesta entre <strong>400€ y 1.200€</strong>. Los fotógrafos de referencia con agenda llena se sitúan en el rango 900–1.400€. Barcelona tiene precios un 15–20% superiores a la media nacional.
          </BlogAnswerBox>

          <p className="text-neutral-300 mb-6">Barcelona concentra una gran cantidad de fotógrafos especializados en comuniones con estilos muy distintos: desde el reportaje clásico y formal hasta el estilo documental natural o la sesión de moda artística. La clave es elegir el estilo que conecte con la personalidad del niño o niña.</p>

          <BlogInlineCTA role="fotografo" text="¿Buscas fotógrafo de comunión en Barcelona? Compara perfiles verificados y tarifas en XPEAK." />

          <h2 className="text-2xl font-bold mt-10 mb-4">Precios fotógrafo comunión Barcelona 2026</h2>
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm border-collapse">
              <thead><tr style={{ background: 'rgba(79,70,229,0.08)' }}>
                <th className="text-left p-3 border border-white/10">Perfil</th>
                <th className="text-left p-3 border border-white/10">Precio</th>
                <th className="text-left p-3 border border-white/10">Notas</th>
              </tr></thead>
              <tbody>{PRICES.map((p, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)' }}>
                  <td className="p-3 border border-white/10 font-medium">{p.perfil}</td>
                  <td className="p-3 border border-white/10 font-bold" style={{ color: '#4F46E5' }}>{p.rango}</td>
                  <td className="p-3 border border-white/10 text-neutral-400">{p.nota}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">Mejores localizaciones para fotos de comunión en Barcelona</h2>
          <ul className="space-y-3 mb-8 text-neutral-300">
            <li><strong className="text-white">Park Güell</strong> — Las terrazas y el camino del Viaducte son icónicas. Requiere reserva de entrada. Luz excepcional al atardecer.</li>
            <li><strong className="text-white">Barrio Gótico</strong> — Callejuelas medievales y fachadas con encanto. Ideal para el reportaje documental.</li>
            <li><strong className="text-white">Barceloneta / Paseo Marítimo</strong> — Luz mediterránea y ambiente relajado. Muy popular para sesiones casuales al atardecer.</li>
            <li><strong className="text-white">Parque de la Ciutadella</strong> — Fuente monumental y naturaleza. Sin coste de acceso, muy versátil para diferentes estilos.</li>
            <li><strong className="text-white">El Born / Eixample</strong> — Arquitectura modernista como telón de fondo para reportajes urbanos de moda.</li>
          </ul>

          <BlogEmailCapture variant="presupuestos" intent="contratar-fotografo" articlePath="/blog/fotografo-comunion-barcelona" />

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
        <BlogRelatedPosts currentSlug='/blog/fotografo-comunion-barcelona' tag='Fotografía' />
        <FooterPublic />
        <BlogScrollCTA role="fotografo" storageKey="xpeak_scrollcta_fotografo_comunion_bcn" />
      </div>
    </>
  );
}
