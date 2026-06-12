import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogAnswerBox from '@/components/BlogAnswerBox';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';

const article = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Fotógrafo para bodas en Granada: precio y guía 2026',
  description: 'Cuánto cuesta un fotógrafo para una boda en Granada. Precios reales 2026, La Alhambra, el Albaicín y la magia de la luz andaluza.',
  datePublished: '2026-06-08',
  dateModified: '2026-06-08',
  author: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
  publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } },
  image: 'https://xpeak.es/og-image.jpg',
  url: 'https://xpeak.es/blog/fotografo-boda-granada',
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'Fotógrafo boda Granada', item: 'https://xpeak.es/blog/fotografo-boda-granada' },
  ],
};

const faqStructured = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: '¿Cuánto cuesta un fotógrafo de bodas en Granada?', acceptedAnswer: { '@type': 'Answer', text: 'Un fotógrafo de bodas en Granada cuesta entre 800€ y 2.500€. Los reportajes en la Alhambra o el Albaicín tienen un coste adicional por los permisos de localización (150–400€ extra).' } },
    { '@type': 'Question', name: '¿Hace falta permiso para fotografiar en la Alhambra?', acceptedAnswer: { '@type': 'Answer', text: 'Sí. Los reportajes en el recinto de la Alhambra requieren autorización previa del Patronato. Suele gestionarlo el fotógrafo, con un coste de 150–300€ y reserva mínima de 30 días de antelación.' } },
    { '@type': 'Question', name: '¿Cuántas horas suele cubrir un reportaje de boda en Granada?', acceptedAnswer: { '@type': 'Answer', text: 'La cobertura estándar es de 8 a 10 horas. Muchas parejas optan por añadir una sesión de postboda al día siguiente en el Albaicín o los Jardines del Generalife para aprovechar la luz de mañana.' } },
    { '@type': 'Question', name: '¿Cuándo contratar el fotógrafo para una boda en Granada?', acceptedAnswer: { '@type': 'Answer', text: 'En Granada la temporada alta es abril–octubre. Los fotógrafos de referencia se agotan con 9–12 meses de antelación. Fuera de temporada (noviembre–marzo) hay más disponibilidad y precios un 15–20% inferiores.' } },
  ],
};

const PRICES = [
  { perfil: 'Fotógrafo emergente', experiencia: '< 2 años', rango: '600€ – 1.000€', nota: 'Portfolio en construcción, buen precio' },
  { perfil: 'Fotógrafo profesional', experiencia: '2–5 años', rango: '1.000€ – 1.800€', nota: 'Reportaje completo, álbum incluido' },
  { perfil: 'Fotógrafo premium', experiencia: '5–10 años', rango: '1.800€ – 2.800€', nota: 'Edición artística, sesión postboda' },
  { perfil: 'Fotógrafo de referencia', experiencia: '+10 años', rango: '2.800€ – 4.500€', nota: 'Publicaciones, premios nacionales' },
];

export default function BlogFotografoBodaGranada() {
  return (
    <>
      <Helmet>
        <title>Fotógrafo de Bodas en Granada: Precios y Guía 2026 | XPEAK</title>
        <meta name="description" content="¿Cuánto cuesta un fotógrafo de bodas en Granada en 2026? Precios reales, permisos Alhambra, mejores localizaciones y cómo contratar sin sorpresas." />
        <link rel="canonical" href="https://xpeak.es/blog/fotografo-boda-granada" />
        <meta property="og:title" content="Fotógrafo de Bodas en Granada: Precios y Guía 2026" />
        <meta property="og:description" content="Precios reales de fotógrafos de bodas en Granada 2026. Alhambra, Albaicín, Carmen del Agua. Todo lo que necesitas saber antes de contratar." />
        <meta property="og:url" content="https://xpeak.es/blog/fotografo-boda-granada" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
      </Helmet>

      <div className="min-h-screen" style={{ background: '#0A0A0A', color: '#F5F5F0' }}>
        <article className="max-w-3xl mx-auto px-4 py-12">
          <nav className="text-xs text-neutral-500 mb-6 flex gap-2">
            <a href="/" className="hover:text-neutral-300">Inicio</a>
            <span>/</span>
            <a href="/blog" className="hover:text-neutral-300">Blog</a>
            <span>/</span>
            <span className="text-neutral-300">Fotógrafo boda Granada</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-black mb-4 leading-tight">
            Fotógrafo de Bodas en Granada:<br />Precios y Guía 2026
          </h1>
          <p className="text-neutral-400 text-sm mb-8">Actualizado junio 2026 · 8 min lectura</p>

          <BlogAnswerBox question="¿Cuánto cuesta un fotógrafo de bodas en Granada?">
            Un fotógrafo de bodas en Granada cuesta entre <strong>800€ y 2.500€</strong> de media. Los reportajes en la Alhambra o el Albaicín pueden incluir un extra de 150–400€ por permisos de localización. La temporada alta (abril–octubre) tiene precios hasta un 20% superiores.
          </BlogAnswerBox>

          <p className="text-neutral-300 mb-6">
            Granada es uno de los destinos de boda más fotogénicos de España. La Alhambra, el Albaicín, los cármenes de la Vega y la Sierra Nevada al fondo crean un escenario único que atrae a parejas de toda Europa. Pero ese escenario también tiene sus reglas: permisos, horarios y disponibilidad limitada de los fotógrafos top.
          </p>

          <BlogInlineCTA role="media" text="¿Buscas fotógrafo para tu boda en Granada? Compara perfiles, tarifas y disponibilidad en XPEAK." />

          <h2 className="text-2xl font-bold mt-10 mb-4">Tabla de precios fotógrafo boda Granada 2026</h2>
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr style={{ background: 'rgba(212,175,55,0.08)' }}>
                  <th className="text-left p-3 border border-white/10">Perfil</th>
                  <th className="text-left p-3 border border-white/10">Experiencia</th>
                  <th className="text-left p-3 border border-white/10">Precio estimado</th>
                  <th className="text-left p-3 border border-white/10">Incluye</th>
                </tr>
              </thead>
              <tbody>
                {PRICES.map((p, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                    <td className="p-3 border border-white/10 font-medium">{p.perfil}</td>
                    <td className="p-3 border border-white/10 text-neutral-400">{p.experiencia}</td>
                    <td className="p-3 border border-white/10 font-bold" style={{ color: '#D4AF37' }}>{p.rango}</td>
                    <td className="p-3 border border-white/10 text-neutral-400">{p.nota}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">Las mejores localizaciones para fotos de boda en Granada</h2>
          <ul className="space-y-3 mb-8 text-neutral-300">
            <li><strong className="text-white">La Alhambra y el Generalife</strong> — El escenario más icónico. Requiere permiso del Patronato (150–300€). Mejor luz: hora dorada de tarde.</li>
            <li><strong className="text-white">El Albaicín</strong> — Callejuelas con vistas a la Alhambra. Ideal para reportajes urbanos con luz natural. Sin coste extra de permisos.</li>
            <li><strong className="text-white">Cármenes de la Vega</strong> — Jardines privados con fachadas blancas y limoneros. Muy demandados para postbodas románticos.</li>
            <li><strong className="text-white">Sierra Nevada</strong> — Para bodas de mayo–junio con nieve de fondo. Imágenes imposibles en cualquier otra ciudad española.</li>
            <li><strong className="text-white">Catedral de Granada</strong> — Para reportajes urbanos con arquitectura barroca de primer nivel.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-10 mb-4">¿Qué incluye el precio de un fotógrafo de bodas en Granada?</h2>
          <p className="text-neutral-300 mb-4">El precio estándar suele incluir:</p>
          <ul className="list-disc list-inside space-y-2 text-neutral-300 mb-6">
            <li>Cobertura de 8–10 horas (preparativos, ceremonia, banquete)</li>
            <li>Edición completa de 300–600 fotos en alta resolución</li>
            <li>Galería privada online para compartir con invitados</li>
            <li>Álbum impreso (en packs premium)</li>
          </ul>
          <p className="text-neutral-300 mb-8">Lo que suele tener coste adicional: segundo fotógrafo (+200–400€), videógrafo para bodas en combo, permisos en la Alhambra, traslados si la boda es en localidades fuera de Granada capital.</p>

          <BlogEmailCapture variant="presupuestos" intent="contratar-fotografo" articlePath="/blog/fotografo-boda-granada" />

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
        <BlogScrollCTA role="media" storageKey="xpeak_scrollcta_fotografo_granada" />
      </div>
    </>
  );
}
