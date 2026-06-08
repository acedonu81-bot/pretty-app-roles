import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogAnswerBox from '@/components/BlogAnswerBox';
import BlogShare from '@/components/BlogShare';

const article = {
  '@context': 'https://schema.org', '@type': 'Article',
  headline: 'Grupo musical para boda: precio y guía completa 2026',
  description: 'Cuánto cuesta un grupo musical para una boda en España. Precios reales 2026, tipos de grupos, qué incluye el precio y cómo contratar sin sorpresas.',
  datePublished: '2026-06-08', dateModified: '2026-06-08',
  author: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
  publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
  url: 'https://xpeak.es/blog/grupo-musical-para-boda-precio',
};

const breadcrumb = {
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'Grupo musical para boda precio', item: 'https://xpeak.es/blog/grupo-musical-para-boda-precio' },
  ],
};

const faqStructured = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: '¿Cuánto cuesta un grupo musical para una boda?', acceptedAnswer: { '@type': 'Answer', text: 'Un grupo musical para una boda en España cuesta entre 1.200€ y 5.000€ según el número de músicos, repertorio y ciudad. Un dúo acústico para el cóctel parte desde 600€; una orquesta de 8 piezas para el banquete puede superar los 4.000€.' } },
    { '@type': 'Question', name: '¿Qué tipo de grupo musical es mejor para una boda?', acceptedAnswer: { '@type': 'Answer', text: 'Depende del momento: dúo o trío para la ceremonia y el cóctel (acústico, íntimo), banda de 4–6 para el banquete (versiones pop/rock/soul), y DJ para el cierre nocturno. Muchas parejas combinan grupo en vivo + DJ.' } },
    { '@type': 'Question', name: '¿El grupo musical necesita equipo de sonido propio?', acceptedAnswer: { '@type': 'Answer', text: 'Los grupos profesionales suelen incluir su propio PA (sistema de amplificación). Para bodas en exteriores o fincas grandes, verifica que el equipo cubre el aforo. Algunos grupos cobran extra por el técnico de sonido en venues grandes.' } },
    { '@type': 'Question', name: '¿Con cuánta antelación contratar un grupo musical para boda?', acceptedAnswer: { '@type': 'Answer', text: 'Los mejores grupos de bodas se reservan con 9–12 meses de antelación para temporada alta (mayo–octubre). Fuera de temporada o para bodas en días laborables, 3–4 meses pueden ser suficientes.' } },
  ],
};

const TIPOS = [
  { tipo: 'Dúo acústico (guitarra + voz)', momento: 'Ceremonia / cóctel', rango: '400€ – 900€', nota: 'Ambiente íntimo, versiones acústicas' },
  { tipo: 'Trío jazz / swing', momento: 'Cóctel / aperitivo', rango: '800€ – 1.600€', nota: 'Elegante, jazz standards, bossa nova' },
  { tipo: 'Cuarteto de cuerdas', momento: 'Ceremonia clásica', rango: '900€ – 1.800€', nota: 'Clásico, música barroca y pop clásico' },
  { tipo: 'Banda pop / rock (5–7 músicos)', momento: 'Banquete / fiesta', rango: '1.500€ – 3.500€', nota: 'Versiones hits, muy festivo' },
  { tipo: 'Orquesta (8–12 músicos)', momento: 'Banquete completo', rango: '3.000€ – 6.000€', nota: 'Show completo, canto y baile' },
];

export default function BlogGrupoMusicalBoda() {
  return (
    <>
      <Helmet>
        <title>Grupo Musical para Boda: Precio y Guía Completa 2026 | XPEAK</title>
        <meta name="description" content="¿Cuánto cuesta un grupo musical para una boda en España? Precios reales 2026 por tipo de grupo, qué incluye y cómo contratar al mejor grupo para tu boda." />
        <link rel="canonical" href="https://xpeak.es/blog/grupo-musical-para-boda-precio" />
        <meta property="og:title" content="Grupo Musical para Boda: Precio y Guía 2026" />
        <meta property="og:url" content="https://xpeak.es/blog/grupo-musical-para-boda-precio" />
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
            <span className="text-neutral-300">Grupo musical para boda precio</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-black mb-4 leading-tight">Grupo Musical para Boda:<br />Precio y Guía Completa 2026</h1>
          <p className="text-neutral-400 text-sm mb-8">Actualizado junio 2026 · 9 min lectura</p>

          <BlogAnswerBox question="¿Cuánto cuesta un grupo musical para una boda?">
            Un grupo musical para boda en España cuesta entre <strong>400€ y 6.000€</strong> según el formato. Un dúo acústico para el cóctel parte desde 400€; una banda completa de 6 músicos para el banquete ronda los 2.000–3.500€; una orquesta de 10+ piezas puede superar los 5.000€.
          </BlogAnswerBox>

          <p className="text-neutral-300 mb-6">
            La música en vivo marca la diferencia entre una boda memorable y una boda corriente. El grupo musical crea momentos únicos que ningún playlist puede reproducir. Pero contratar el grupo equivocado — o pagarlo de más — es uno de los errores más frecuentes en la planificación de bodas.
          </p>

          <BlogInlineCTA role="staff" text="¿Buscas grupo musical para tu boda? Compara artistas verificados y tarifas reales en XPEAK." />

          <h2 className="text-2xl font-bold mt-10 mb-4">Precios por tipo de grupo musical para boda 2026</h2>
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm border-collapse">
              <thead><tr style={{ background: 'rgba(212,175,55,0.08)' }}>
                <th className="text-left p-3 border border-white/10">Tipo de grupo</th>
                <th className="text-left p-3 border border-white/10">Momento</th>
                <th className="text-left p-3 border border-white/10">Precio</th>
                <th className="text-left p-3 border border-white/10">Notas</th>
              </tr></thead>
              <tbody>{TIPOS.map((t, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                  <td className="p-3 border border-white/10 font-medium">{t.tipo}</td>
                  <td className="p-3 border border-white/10 text-neutral-400">{t.momento}</td>
                  <td className="p-3 border border-white/10 font-bold" style={{ color: '#D4AF37' }}>{t.rango}</td>
                  <td className="p-3 border border-white/10 text-neutral-400">{t.nota}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">¿Qué incluye el precio de un grupo musical para boda?</h2>
          <ul className="list-disc list-inside space-y-2 text-neutral-300 mb-6">
            <li>Actuación en vivo según el tiempo acordado (generalmente 2–4 pases de 45 min)</li>
            <li>Sistema de sonido (PA) propio para venues de hasta 150 personas</li>
            <li>Repertorio personalizable (top de la novia, primer baile, etc.)</li>
            <li>Comunicación previa para adaptar el set-list a tus gustos</li>
          </ul>
          <p className="text-neutral-300 mb-8">Extras habituales con coste adicional: técnico de sonido para venues grandes (+200–400€), desplazamientos superiores a 100 km, alojamiento si la boda es en zona rural alejada, segundo pase nocturno más allá de lo contratado.</p>

          <h2 className="text-2xl font-bold mt-10 mb-4">Grupo musical + DJ: la combinación perfecta</h2>
          <p className="text-neutral-300 mb-6">La tendencia dominante en bodas 2026 es combinar <strong>grupo musical en vivo para el cóctel y el banquete</strong> (ambiente, primeros bailes) con un <strong>DJ para el cierre nocturno</strong> (de 00:00 a 04:00). Esta combinación maximiza el ambiente en cada momento y suele costar entre 2.500€ y 5.000€ en total por ambos servicios.</p>

          <BlogEmailCapture variant="presupuestos" intent="contratar-musico" articlePath="/blog/grupo-musical-para-boda-precio" />

          <h2 className="text-2xl font-bold mt-10 mb-4">Preguntas frecuentes</h2>
          {faqStructured.mainEntity.map((faq, i) => (
            <div key={i} className="mb-5 p-4 rounded-xl border border-white/10">
              <h3 className="font-semibold text-white mb-2">{faq.name}</h3>
              <p className="text-neutral-400 text-sm">{faq.acceptedAnswer.text}</p>
            </div>
          ))}
          <BlogShare />
        </article>
        <FooterPublic />
        <BlogScrollCTA role="dj" storageKey="xpeak_scrollcta_grupo_musical_boda" />
      </div>
    </>
  );
}
