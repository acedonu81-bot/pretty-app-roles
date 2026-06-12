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
  headline: 'Catering para boda precio por persona: guía completa 2026',
  description: 'Cuánto cuesta el catering para una boda en España por persona. Precios reales 2026, tipos de servicio, qué incluye y cómo no pagar de más.',
  datePublished: '2026-06-08', dateModified: '2026-06-08',
  author: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
  publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
  url: 'https://xpeak.es/blog/catering-boda-precio-por-persona',
};

const breadcrumb = {
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'Catering boda precio por persona', item: 'https://xpeak.es/blog/catering-boda-precio-por-persona' },
  ],
};

const faqStructured = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: '¿Cuánto cuesta el catering para una boda por persona?', acceptedAnswer: { '@type': 'Answer', text: 'El catering para una boda en España cuesta entre 60€ y 180€ por persona. El rango más habitual para una boda media es 80–120€/persona (cóctel + banquete + servicio). En ciudades como Madrid o Barcelona los precios son un 20–30% superiores.' } },
    { '@type': 'Question', name: '¿Qué incluye el precio del catering de boda?', acceptedAnswer: { '@type': 'Answer', text: 'El precio estándar incluye: aperitivo/cóctel (1–1.5h), banquete de 4–5 platos, bebidas (vino, cava, refrescos, agua), servicio de camareros, montaje y desmontaje de mesas. Las bebidas premium, decoración floral y pastel suelen ser extras.' } },
    { '@type': 'Question', name: '¿Cuántos camareros se necesitan para una boda de 100 personas?', acceptedAnswer: { '@type': 'Answer', text: 'La ratio estándar es 1 camarero por cada 10–15 personas en el banquete. Para una boda de 100 personas necesitas 7–10 camareros más 1 maître o responsable de sala. En el cóctel con pinchos/canapés la ratio sube a 1 por cada 8–10 personas.' } },
    { '@type': 'Question', name: '¿Qué diferencia hay entre catering externo y el servicio del venue?', acceptedAnswer: { '@type': 'Answer', text: 'El venue propio suele ser más barato pero con menos flexibilidad en el menú y la decoración. El catering externo permite personalización total pero suma el coste de transporte y montaje. Compara siempre el precio all-in (por persona con todo incluido) para comparar bien.' } },
  ],
};

const TIPOS = [
  { tipo: 'Catering básico', formato: 'Cóctel + buffet', precio: '55€ – 75€/pers', nota: 'Boda íntima, menú sencillo' },
  { tipo: 'Catering estándar', formato: 'Cóctel + banquete 4 platos', precio: '80€ – 120€/pers', nota: 'El más contratado en España' },
  { tipo: 'Catering premium', formato: 'Cóctel largo + banquete gourmet', precio: '120€ – 160€/pers', nota: 'Chef invitado, productos premium' },
  { tipo: 'Catering de lujo', formato: 'Full service, menú degustación', precio: '160€ – 250€/pers', nota: 'Personalización total, bodas VIP' },
];

export default function BlogCateringBodaPrecio() {
  return (
    <>
      <Helmet>
        <title>Catering Boda Precio por Persona: Guía Completa 2026 | XPEAK</title>
        <meta name="description" content="¿Cuánto cuesta el catering de una boda por persona en España? Precios reales 2026, tipos de servicio, qué incluye y cómo ahorrar sin sacrificar calidad." />
        <link rel="canonical" href="https://xpeak.es/blog/catering-boda-precio-por-persona" />
        <meta property="og:title" content="Catering Boda Precio por Persona: Guía 2026" />
        <meta property="og:url" content="https://xpeak.es/blog/catering-boda-precio-por-persona" />
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
            <span className="text-neutral-300">Catering boda precio por persona</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-black mb-4 leading-tight">Catering para Boda:<br />Precio por Persona y Guía 2026</h1>
          <p className="text-neutral-400 text-sm mb-8">Actualizado junio 2026 · 9 min lectura</p>

          <BlogAnswerBox question="¿Cuánto cuesta el catering de una boda por persona?">
            El catering de una boda en España cuesta entre <strong>60€ y 180€ por persona</strong>. El rango más habitual es 80–120€/persona (cóctel + banquete completo + servicio de camareros). Para 100 invitados, el presupuesto total oscila entre 8.000€ y 16.000€.
          </BlogAnswerBox>

          <p className="text-neutral-300 mb-6">El catering es generalmente la partida más cara de una boda: representa el 35–45% del presupuesto total. Entender qué incluye y qué no el precio por persona es fundamental para no llevarse sorpresas con la factura final.</p>

          <BlogInlineCTA role="staff" text="¿Necesitas camareros para tu boda? Encuentra personal de servicio verificado en XPEAK." />

          <h2 className="text-2xl font-bold mt-10 mb-4">Precios catering de boda por persona 2026</h2>
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm border-collapse">
              <thead><tr style={{ background: 'rgba(212,175,55,0.08)' }}>
                <th className="text-left p-3 border border-white/10">Tipo</th>
                <th className="text-left p-3 border border-white/10">Formato</th>
                <th className="text-left p-3 border border-white/10">Precio/persona</th>
                <th className="text-left p-3 border border-white/10">Ideal para</th>
              </tr></thead>
              <tbody>{TIPOS.map((t, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                  <td className="p-3 border border-white/10 font-medium">{t.tipo}</td>
                  <td className="p-3 border border-white/10 text-neutral-400">{t.formato}</td>
                  <td className="p-3 border border-white/10 font-bold" style={{ color: '#D4AF37' }}>{t.precio}</td>
                  <td className="p-3 border border-white/10 text-neutral-400">{t.nota}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">¿Qué suele incluir el precio del catering de boda?</h2>
          <ul className="list-disc list-inside space-y-2 text-neutral-300 mb-6">
            <li>Aperitivo/cóctel de bienvenida (1–1.5 horas, canapés y bebidas)</li>
            <li>Banquete con primer plato, segundo plato, postre y café</li>
            <li>Bebidas estándar durante el banquete (vino, cava, agua, refrescos)</li>
            <li>Servicio de camareros (ratio 1/10–15 personas)</li>
            <li>Montaje y desmontaje de mesas, mantelería y vajilla</li>
          </ul>
          <p className="text-neutral-300 mb-8">Lo que <strong>NO suele incluir</strong> el precio base: barra libre nocturna (+15–25€/persona), tarta nupcial (+4–8€/persona), decoración floral de mesas, menú de niños (se negocia aparte, suele ser 50% del precio adulto), traslado en venues sin cocina propia (+3–8€/persona).</p>

          <h2 className="text-2xl font-bold mt-10 mb-4">5 claves para no pagar de más en el catering de tu boda</h2>
          <ol className="list-decimal list-inside space-y-3 text-neutral-300 mb-8">
            <li><strong className="text-white">Pide siempre el precio all-in</strong> — Suma todo (cóctel + banquete + bebidas + servicio) y divide por invitado para comparar.</li>
            <li><strong className="text-white">Negocia el mínimo de personas</strong> — Si tienes 80 invitados, pregunta si aplican tarifa de 100. Muchos caterings cobran mínimos.</li>
            <li><strong className="text-white">Compara vino propio vs del catering</strong> — Llevar tu propio vino (corkage fee) puede ahorrar 10–15€/persona en bodas grandes.</li>
            <li><strong className="text-white">Cuidado con las actualizaciones de IPC</strong> — Cierra precio con clausula de no revisión si reservas con 12+ meses de antelación.</li>
            <li><strong className="text-white">Personal de servicio propio en XPEAK</strong> — Contratar camareros directamente puede reducir el coste de personal un 20–30%.</li>
          </ol>

          <BlogEmailCapture variant="presupuestos" intent="contratar-staff" articlePath="/blog/catering-boda-precio-por-persona" />

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
        <BlogScrollCTA role="staff" storageKey="xpeak_scrollcta_catering_boda_precio" />
      </div>
    </>
  );
}
