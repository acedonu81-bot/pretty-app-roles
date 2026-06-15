import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';

const article = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Cuánto cobra un mago para eventos y fiestas en España 2026',
  description: 'Precios reales de magos para eventos corporativos, bodas y fiestas en España 2026. Tarifas por tipo de magia y qué buscar antes de contratar.',
  datePublished: '2026-06-01',
  dateModified: '2026-06-01',
  author: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
  publisher: {
    '@type': 'Organization',
    name: 'XPEAK',
    url: 'https://xpeak.es',
    logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' },
  },
  image: 'https://xpeak.es/og-image.jpg',
  url: 'https://xpeak.es/blog/mago-precio-eventos-espana',
};

const faqStructured = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Cuánto cuesta contratar un mago para un evento de empresa?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Un mago para evento corporativo en España cuesta entre 500€ y 1.500€ dependiendo del formato. La magia de mesa o close-up durante un cóctel (2–3h mezclado con los asistentes) ronda los 500–900€. Un show de escenario de 30–45 minutos para una gala cuesta entre 700€ y 1.500€. Los magos con mayor trayectoria en el circuito corporativo pueden superar los 2.000€.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Cuánto cuesta un mago para una boda?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Para bodas en España el rango habitual es 400–800€. La opción más frecuente es magia de cerca durante el cóctel (60–90 minutos pasando entre los invitados). Si además se quiere un momento de show ante todos los asistentes (gag o número especial), el precio sube entre 100 y 300€ adicionales.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Qué diferencia hay entre magia close-up y magia de escenario?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'La magia close-up o de cerca se realiza a pocos centímetros del espectador, con cartas, monedas y objetos cotidianos. Es perfecta para cócteles y cenas donde los invitados están en pequeños grupos. La magia de escenario se ejecuta ante una audiencia sentada y requiere micrófono, iluminación y espacio escénico. Cada formato tiene requisitos técnicos y precios distintos.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Con cuánta antelación hay que contratar un mago?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Para bodas y eventos en temporada alta (mayo, junio, septiembre, octubre), reserva con 3–6 meses de antelación. Los mejores perfiles se agotan antes en esas fechas. Para eventos corporativos sin fecha fija o en semana, 4–6 semanas suelen ser suficientes. Confirma siempre con señal de reserva (30% del total) para asegurar la fecha.',
      },
    },
  ],
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'Mago precio eventos España', item: 'https://xpeak.es/blog/mago-precio-eventos-espana' },
  ],
};

const PRECIOS = [
  { tipo: 'Magia de mesa / close-up (2–3h cóctel)', precio: '150–350€/hora · 400–700€ pack' },
  { tipo: 'Show completo 30 minutos (escenario)', precio: '300–600€' },
  { tipo: 'Show 60 minutos (gala o cena empresa)', precio: '500–1.000€' },
  { tipo: 'Gala corporativa premium o evento grande', precio: '800–2.000€' },
  { tipo: 'Boda: cóctel + momento show', precio: '400–800€' },
  { tipo: 'Magia virtual / evento online', precio: '200–500€' },
];

export default function BlogMagoPrecioEventos() {
  return (
    <>
      <Helmet>
        <title>Cuánto cobra un mago para eventos y fiestas en España 2026 | XPEAK</title>
        <meta
          name="description"
          content="Precios reales de magos para eventos de empresa, bodas y fiestas en España 2026. Magia close-up, shows de escenario y galas corporativas."
        />
        <link rel="canonical" href="https://xpeak.es/blog/mago-precio-eventos-espana" />
        <meta property="og:title" content="Cuánto cobra un mago para eventos y fiestas en España 2026 — XPEAK Blog" />
        <meta property="og:description" content="Tarifas reales de magos en España. Close-up, escenario, boda y empresa. Precios 2026." />
        <meta property="og:url" content="https://xpeak.es/blog/mago-precio-eventos-espana" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>

      <div className="min-h-screen" style={{ background: '#090909', color: '#fff' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-3xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#D4AF37' }}>XPEAK</a>
          <div className="flex items-center gap-3">
            <a href="/blog" className="text-xs font-bold hidden sm:block" style={{ color: '#8E8EA0' }}>Blog</a>
            <a
              href="/auth"
              className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}
            >
              Unirse gratis
            </a>
          </div>
        </nav>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#8E8EA0' }}>
            ← Todos los artículos
          </a>

          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>Entretenimiento · Eventos · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">
              Cuánto cobra un mago para eventos y fiestas en España 2026
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: '#8E8EA0' }}>
              La magia sigue siendo uno de los recursos de entretenimiento más efectivos para romper el hielo en bodas, cenas de empresa y fiestas privadas. En esta guía encontrarás los precios reales de 2026 según el tipo de actuación y los criterios clave para elegir al mago correcto.
            </p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>1 junio 2026</time>
          </div>

          <div className="space-y-10">
            {/* TIPOS DE MAGIA */}
            <section>
              <h2 className="text-lg font-black mb-4">Tipos de magia para eventos</h2>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.75)' }}>
                No todos los magos hacen lo mismo. El tipo de actuación determina tanto el precio como la experiencia que vivirán tus invitados. Estos son los formatos más habituales en España:
              </p>
              <div className="space-y-3">
                {[
                  {
                    tipo: 'Magia de cerca o close-up',
                    desc: 'El mago circula entre los grupos durante el cóctel o la cena realizando juegos a pocos centímetros. Cartas, monedas y objetos cotidianos. Muy impactante a nivel individual, ideal para eventos de 20–150 personas.',
                  },
                  {
                    tipo: 'Magia de salón o macromagia',
                    desc: 'Show preparado frente a toda la audiencia. Números más grandes con trucos de mayor escala. Requiere micrófono y espacio escénico mínimo de 3x3m. Funciona bien en cenas de gala y galas corporativas.',
                  },
                  {
                    tipo: 'Mentalismo',
                    desc: 'El mago "lee la mente", adivina números y nombres sin truco aparente. Muy demandado en eventos de empresa por su formato más sofisticado e intelectual. A veces se combina con close-up.',
                  },
                  {
                    tipo: 'Magia cómica o humor',
                    desc: 'Actuación que mezcla magia con humor y participación del público. Muy efectiva para teambuilding, comuniones y bodas con invitados de distintas edades.',
                  },
                ].map((item, i) => (
                  <div
                    key={item.tipo}
                    className="p-4 rounded-xl"
                    style={{
                      background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)',
                      border: '1px solid rgba(255,255,255,0.04)',
                    }}
                  >
                    <p className="text-xs font-black mb-1">{item.tipo}</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* PRECIOS */}
            <section>
              <h2 className="text-lg font-black mb-4">Precios de mago por tipo de evento (España 2026)</h2>
              <div className="space-y-2">
                {PRECIOS.map((row, i) => (
                  <div
                    key={row.tipo}
                    className="flex items-center justify-between p-4 rounded-xl"
                    style={{
                      background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)',
                      border: '1px solid rgba(255,255,255,0.04)',
                    }}
                  >
                    <p className="text-xs font-medium">{row.tipo}</p>
                    <span className="text-xs font-black ml-4 shrink-0" style={{ color: '#D4AF37' }}>{row.precio}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-3" style={{ color: '#8E8EA0' }}>
                Precios orientativos sin IVA para España 2026. Madrid y Barcelona pueden ser un 20–30% más caros.
              </p>
            </section>

            {/* QUÉ BUSCAR */}
            <section>
              <h2 className="text-lg font-black mb-4">Qué buscar en un mago profesional</h2>
              <p className="text-sm leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.75)' }}>
                El criterio más importante no es el precio, sino el historial de actuaciones similares. Un mago que ha trabajado en muchas bodas sabe gestionar la dinámica del cóctel, no interrumpir conversaciones y adaptarse al ritmo del evento. Pide referencias de eventos reales, no solo valoraciones genéricas.
              </p>
              <p className="text-sm leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.75)' }}>
                Revisa vídeos de actuación en directo, preferiblemente grabados por los asistentes al evento (no producción profesional). Las reacciones del público son el mejor indicador de calidad real.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
                Para eventos de empresa, asegúrate de que el mago tiene experiencia con público adulto y entorno profesional. El humor y el nivel de participación que funciona en una boda no siempre encaja en un evento corporativo formal.
              </p>
            </section>

            {/* FAQ */}
            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">
                {faqStructured.mainEntity.map((f) => (
                  <div
                    key={f.name}
                    className="p-5 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <p className="text-sm font-black mb-2">{f.name}</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>{f.acceptedAnswer.text}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ARTÍCULOS RELACIONADOS */}
            <section>
              <h2 className="text-base font-black mb-3" style={{ color: 'rgba(255,255,255,0.85)' }}>Artículos relacionados</h2>
              <div className="space-y-2">
                {[
                  { href: '/eventos-empresa', cat: 'Hub', title: 'Contratar profesionales para eventos de empresa' },
                  { href: '/blog/saxofonista-precio-espana', cat: 'Música', title: 'Cuánto cobra un saxofonista en España 2026' },
                  { href: '/blog/photobooth-precio-boda-evento', cat: 'Photo Booth', title: 'Cuánto cuesta un photo booth para boda 2026' },
                  { href: '/blog/profesionales-bodas', cat: 'Bodas', title: 'Profesionales para bodas: guía completa 2026' },
                ].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none' }}
                  >
                    <span
                      className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0"
                      style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}
                    >
                      {link.cat}
                    </span>
                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.72)' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>

            {/* CTA FINAL */}
            <div
              className="p-6 rounded-2xl text-center"
              style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}
            >
              <p className="text-sm font-black mb-2">Contrata un mago verificado para tu evento</p>
              <p className="text-xs mb-4" style={{ color: '#8E8EA0' }}>
                XPEAK tiene magos con vídeos reales de actuación, reseñas verificadas y contrato digital incluido. Solicita presupuesto gratis.
              </p>
              <a
                href="/contratar-mago"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105"
                style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}
              >
                Ver magos disponibles →
              </a>
            </div>
          </div>
        </main>

        <FooterPublic />
      </div>
    </>
  );
}
