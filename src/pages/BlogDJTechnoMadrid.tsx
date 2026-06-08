import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogAnswerBox from '@/components/BlogAnswerBox';
import BlogShare from '@/components/BlogShare';

const article = {
  '@context': 'https://schema.org', '@type': 'Article',
  headline: 'DJ de Techno en Madrid: tarifas, escena y cómo contratar 2026',
  description: 'Guía completa para contratar un DJ de techno en Madrid. Precios reales 2026, los clubs más activos, la escena underground y qué piden las salas.',
  datePublished: '2026-06-08', dateModified: '2026-06-08',
  author: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
  publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
  url: 'https://xpeak.es/blog/dj-techno-madrid',
};

const breadcrumb = {
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'DJ Techno Madrid', item: 'https://xpeak.es/blog/dj-techno-madrid' },
  ],
};

const faqStructured = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: '¿Cuánto cobra un DJ de techno en Madrid?', acceptedAnswer: { '@type': 'Answer', text: 'Un DJ de techno en Madrid cobra entre 100€ y 800€ por sesión de 3–4 horas en clubs underground. Los DJs con bookings internacionales o residencias en clubs top cobran 500€–1.500€. Para eventos privados los precios son negociables.' } },
    { '@type': 'Question', name: '¿Cuáles son los mejores clubs de techno en Madrid?', acceptedAnswer: { '@type': 'Answer', text: 'La escena techno madrileña tiene referentes como Fabrik, Teatro Kapital (planta techno), Mondo Disko, Sala Caracol y Sala El Sol. El circuito underground de salas medianas (200–600 personas) es muy activo los viernes y sábados.' } },
    { '@type': 'Question', name: '¿Cómo consigo un DJ de techno para un evento privado en Madrid?', acceptedAnswer: { '@type': 'Answer', text: 'Plataformas como XPEAK permiten buscar DJs especializados en techno en Madrid con tarifas públicas y disponibilidad en tiempo real. También puedes contactar directamente con los residentes de los clubs o con agencias de booking especializadas.' } },
  ],
};

const TARIFAS = [
  { nivel: 'DJ emergente (< 2 años)', escenario: 'Afterhour, sala pequeña', tarifa: '80€ – 200€', nota: 'Sesiones de 3–4h' },
  { nivel: 'DJ semi-profesional', escenario: 'Sala mediana, evento privado', tarifa: '200€ – 500€', nota: 'Portfolio sólido, redes activas' },
  { nivel: 'DJ residente reconocido', escenario: 'Club top, festival local', tarifa: '500€ – 1.200€', nota: 'Colaboraciones, publicaciones' },
  { nivel: 'DJ artista internacional', escenario: 'Macrofestival, booking exclusivo', tarifa: '1.500€ – 5.000€+', nota: 'Rider técnico, management' },
];

export default function BlogDJTechnoMadrid() {
  return (
    <>
      <Helmet>
        <title>DJ de Techno en Madrid: Tarifas y Guía 2026 | XPEAK</title>
        <meta name="description" content="¿Cuánto cobra un DJ de techno en Madrid? Precios reales 2026, mejores clubs underground, escena madrileña y cómo contratar un DJ de techno para tu evento." />
        <link rel="canonical" href="https://xpeak.es/blog/dj-techno-madrid" />
        <meta property="og:title" content="DJ de Techno en Madrid: Tarifas y Guía 2026" />
        <meta property="og:url" content="https://xpeak.es/blog/dj-techno-madrid" />
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
            <span className="text-neutral-300">DJ Techno Madrid</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-black mb-4 leading-tight">DJ de Techno en Madrid:<br />Tarifas y Guía 2026</h1>
          <p className="text-neutral-400 text-sm mb-8">Actualizado junio 2026 · 8 min lectura</p>

          <BlogAnswerBox question="¿Cuánto cobra un DJ de techno en Madrid?">
            Un DJ de techno en Madrid cobra entre <strong>100€ y 800€</strong> por sesión en clubs. Los artistas con booking internacional o residencias en salas top pueden facturar 500€–1.500€ por noche. Para eventos privados o corporativos los precios dependen de la duración y el perfil.
          </BlogAnswerBox>

          <p className="text-neutral-300 mb-6">
            Madrid tiene una de las escenas techno más activas de Europa. Clubs como Fabrik programan artistas de referencia internacional todas las semanas, mientras el circuito underground de salas medianas alimenta una generación de DJs locales de primer nivel. Si buscas techno para tu evento o sala, aquí tienes todo lo que necesitas saber.
          </p>

          <BlogInlineCTA role="dj" text="¿Buscas DJ de techno en Madrid para tu sala o evento? Encuentra artistas con tarifa pública en XPEAK." />

          <h2 className="text-2xl font-bold mt-10 mb-4">Tarifas DJ techno Madrid 2026</h2>
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm border-collapse">
              <thead><tr style={{ background: 'rgba(212,175,55,0.08)' }}>
                <th className="text-left p-3 border border-white/10">Nivel</th>
                <th className="text-left p-3 border border-white/10">Escenario</th>
                <th className="text-left p-3 border border-white/10">Tarifa</th>
                <th className="text-left p-3 border border-white/10">Notas</th>
              </tr></thead>
              <tbody>{TARIFAS.map((t, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                  <td className="p-3 border border-white/10 font-medium">{t.nivel}</td>
                  <td className="p-3 border border-white/10 text-neutral-400">{t.escenario}</td>
                  <td className="p-3 border border-white/10 font-bold" style={{ color: '#D4AF37' }}>{t.tarifa}</td>
                  <td className="p-3 border border-white/10 text-neutral-400">{t.nota}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">La escena techno de Madrid en 2026</h2>
          <p className="text-neutral-300 mb-4">Madrid concentra el mayor mercado nocturno de España. La escena techno local tiene varias capas:</p>
          <ul className="space-y-3 mb-8 text-neutral-300">
            <li><strong className="text-white">Clubs mainstream-techno</strong> (Fabrik, Kapital) — Programación internacional, 1.500–5.000 asistentes, DJs con cachés de 2.000€+.</li>
            <li><strong className="text-white">Salas medianas underground</strong> (200–600 pax) — El corazón de la escena local. Residentes que empujan subgéneros: dark techno, industrial, hypnotic.</li>
            <li><strong className="text-white">Afterhours y lofts privados</strong> — Sesiones de 06:00 a 14:00. Muy activo en invierno. Precios competitivos (100–300€/sesión).</li>
            <li><strong className="text-white">Eventos de marca / corporativos</strong> — Empresas tech y agencias de moda contratan DJs techno de imagen. Precios 500–1.500€/noche.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-10 mb-4">Qué piden las salas a un DJ de techno</h2>
          <ul className="list-disc list-inside space-y-2 text-neutral-300 mb-8">
            <li>EPK actualizado (Electronic Press Kit) con fotos, bio y tracks recientes</li>
            <li>Presencia en SoundCloud / Mixcloud / Beatport con mixes públicos</li>
            <li>Rider técnico claro (CDJ-3000, Pioneer mixer, monitorización)</li>
            <li>Precio cerrado o tarifa horaria antes de la negociación</li>
            <li>Referencias de otras salas o eventos donde hayas actuado</li>
          </ul>

          <BlogEmailCapture variant="general" intent="contratar-dj" articlePath="/blog/dj-techno-madrid" />

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
        <BlogScrollCTA role="dj" storageKey="xpeak_scrollcta_dj_techno_madrid" />
      </div>
    </>
  );
}
