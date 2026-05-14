import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';

const article = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Fotografía en eventos nocturnos: precios y cómo contratar en España (2026)',
  description: 'Cuánto cobra un fotógrafo de eventos nocturnos en España. Precios por tipo de evento, qué incluye y cómo elegir el perfil correcto.',
  datePublished: '2026-05-03',
  author: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
  publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } },
  image: 'https://xpeak.es/og-image.jpg',
  url: 'https://xpeak.es/blog/fotografia-eventos-nocturnos',
};

const faqStructured = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: '¿Cuánto cobra un fotógrafo de discoteca o evento nocturno?', acceptedAnswer: { '@type': 'Answer', text: 'El precio varía entre 200€ y 700€ por noche según experiencia y tipo de evento. Un fotógrafo de sala estándar cobra entre 200-350€/noche. Para eventos especiales (lanzamientos, festivales, premios) el precio sube a 400-800€ o más.' } },
    { '@type': 'Question', name: '¿Qué cámara necesita un fotógrafo de eventos nocturnos?', acceptedAnswer: { '@type': 'Answer', text: 'Necesita una cámara con buen rendimiento en ISO alto: Canon R6, Sony A7 IV, Nikon Z6 o similares. El objetivo más utilizado es un 24-70mm f/2.8 o un 35mm f/1.4. El flash de relleno (tipo Godox) es fundamental para iluminar sin quemar al sujeto en interiores oscuros.' } },
    { '@type': 'Question', name: '¿En cuánto tiempo recibo las fotos después del evento?', acceptedAnswer: { '@type': 'Answer', text: 'El estándar del sector es 48-72 horas para eventos de redes sociales (fotos básicas editadas), y 1-2 semanas para el pack completo con selección y edición profesional. Algunos fotógrafos ofrecen entrega rápida (24h) como servicio premium con sobrecoste.' } },
    { '@type': 'Question', name: '¿Puedo usar las fotos del evento en redes sociales del local?', acceptedAnswer: { '@type': 'Answer', text: 'Sí, pero especifícalo en el contrato. Lo estándar es que el local puede usar las fotos para comunicación propia (redes, web, flyers) sin coste extra. Para uso comercial ampliado (publicidad de pago, venta de imágenes) se negocia aparte.' } },
  ],
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'Fotografía eventos nocturnos', item: 'https://xpeak.es/blog/fotografia-eventos-nocturnos' },
  ],
};

const PRECIOS_EVENTO = [
  { evento: 'Noche de sala / discoteca (4-5h)', min: 200, max: 400, notas: 'Entrega 48-72h, ~200 fotos editadas' },
  { evento: 'Evento especial en sala (5-7h)', min: 300, max: 600, notas: 'Más cobertura, galería extendida' },
  { evento: 'Festival de música (día completo)', min: 500, max: 1.200, notas: 'Acreditación incluida' },
  { evento: 'Lanzamiento de producto / marca', min: 400, max: 900, notas: 'Fotos corporativas y de ambiente' },
  { evento: 'Noche VIP / afterparty exclusivo', min: 350, max: 700, notas: 'Discreción y perfil de invitados' },
  { evento: 'Cobertura semanal (pack mensual)', min: 600, max: 1.500, notas: '4 noches/mes, precio cerrado' },
];

const DIFERENCIAS = [
  { titulo: 'Fotógrafo de eventos diurnos', puntos: ['Flash externo', 'Luz natural o artificial controlada', 'ISO bajo (200-800)', 'Tiempo para composición', 'Más fácil técnicamente'] },
  { titulo: 'Fotógrafo nocturno / de sala', puntos: ['Dominio del flash en ambientes oscuros', 'ISO muy alto (3200-12800)', 'Captura de movimiento en baile', 'Trabajo en multitudes', 'Resistencia física (noche entera)'] },
];

const CHECKLIST = [
  'Portfolio específico de eventos nocturnos (no bodas ni portraits)',
  'Experiencia en tu tipo de venue (sala pequeña vs festival grande)',
  'Equipo con flash externo y cámara full-frame',
  'Política de entrega clara (cuándo, cuántas fotos, formato)',
  'Derechos de uso especificados en contrato',
  'Tarifa por horas extra si el evento se alarga',
];

export default function BlogFotografiaEventosNocturnos() {
  return (
    <>
      <Helmet>
        <title>Fotografía en eventos nocturnos: precios y cómo contratar en España (2026)</title>
        <meta name="description" content="Cuánto cobra un fotógrafo de discoteca o eventos nocturnos en España. Precios por tipo de evento, equipo necesario y cómo elegir el fotógrafo correcto." />
        <link rel="canonical" href="https://xpeak.es/blog/fotografia-eventos-nocturnos" />
        <meta property="og:title" content="Fotografía eventos nocturnos: precios 2026 — XPEAK Blog" />
        <meta property="og:description" content="Cuánto cobra un fotógrafo de discoteca en España. Precios, qué incluye y cómo elegir el perfil correcto." />
        <meta property="og:url" content="https://xpeak.es/blog/fotografia-eventos-nocturnos" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Fotografía eventos nocturnos: precios 2026 — XPEAK Blog" />
        <meta name="twitter:description" content="Precios y guía para contratar fotógrafo de eventos nocturnos en España." />
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
            <a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              Unirse gratis
            </a>
          </div>
        </nav>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#8E8EA0' }}>
            ← Todos los artículos
          </a>

          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>Fotografía · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">
              Fotografía en eventos nocturnos: precios y cómo contratar en España (2026)
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: '#8E8EA0' }}>
              La fotografía nocturna es una especialidad técnicamente exigente. No cualquier fotógrafo vale. Te explicamos qué buscar y cuánto pagar.
            </p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>3 mayo 2026</time>
          </div>

          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Precios según tipo de evento nocturno</h2>
              <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <table className="w-full text-xs">
                  <thead>
                    <tr style={{ background: 'rgba(212,175,55,0.08)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <th className="text-left px-4 py-3 font-bold">Tipo de evento</th>
                      <th className="px-4 py-3 font-bold text-right">Desde</th>
                      <th className="px-4 py-3 font-bold text-right">Hasta</th>
                      <th className="px-4 py-3 font-bold text-left hidden sm:table-cell">Incluye</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PRECIOS_EVENTO.map((row, i) => (
                      <tr key={row.evento} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td className="px-4 py-3 font-medium">{row.evento}</td>
                        <td className="px-4 py-3 text-right" style={{ color: '#D4AF37' }}>{row.min}€</td>
                        <td className="px-4 py-3 text-right" style={{ color: '#D4AF37' }}>{row.max}€</td>
                        <td className="px-4 py-3 hidden sm:table-cell" style={{ color: '#8E8EA0' }}>{row.notas}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs mt-3" style={{ color: '#8E8EA0' }}>Precios orientativos España 2026. Sin IVA. Desplazamiento no incluido en todos los casos.</p>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">Fotógrafo nocturno vs. fotógrafo de eventos diurnos</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {DIFERENCIAS.map((d, di) => (
                  <div key={d.titulo} className="p-5 rounded-xl" style={{ background: di === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(212,175,55,0.04)', border: di === 0 ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(212,175,55,0.12)' }}>
                    <h3 className="text-xs font-bold mb-3" style={{ color: di === 0 ? '#8E8EA0' : '#D4AF37' }}>{d.titulo}</h3>
                    <ul className="space-y-1.5">
                      {d.puntos.map(p => (
                        <li key={p} className="text-xs flex items-start gap-2" style={{ color: 'rgba(255,255,255,0.75)' }}>
                          <span style={{ color: di === 0 ? '#8E8EA0' : '#D4AF37' }}>→</span>{p}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="text-sm mt-4 leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
                La fotografía nocturna requiere dominio del flash en ambientes oscuros y cambiantes, captura de momentos espontáneos en movimiento y resistencia a trabajar de madrugada. Es una especialidad, no una extensión de la fotografía diurna.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">Checklist antes de contratar</h2>
              <div className="space-y-2">
                {CHECKLIST.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <span className="text-xs font-black shrink-0 mt-0.5" style={{ color: '#D4AF37' }}>✓</span>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.8)' }}>{item}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">
                {faqStructured.mainEntity.map(f => (
                  <div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-sm font-bold mb-2">{f.name}</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>{f.acceptedAnswer.text}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Buscas fotógrafo para tu sala o evento nocturno?</p>
              <p className="text-xs mb-4" style={{ color: '#8E8EA0' }}>XPEAK tiene fotógrafos especializados en eventos nocturnos verificados en toda España. Contrata con contrato digital automático.</p>
              <a href="/contratar-fotografo" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105"
                style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                Ver fotógrafos en XPEAK →
              </a>
            </div>
          </div>
        </main>
      <FooterPublic />
      </div>
    </>
  );
}
