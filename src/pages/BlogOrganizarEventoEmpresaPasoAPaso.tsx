import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';

const article = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Cómo organizar un evento de empresa paso a paso (2026)',
  description: 'Checklist completo para organizar un evento corporativo en España: presupuesto, proveedores, timeline y errores más comunes a evitar.',
  datePublished: '2026-07-16',
  dateModified: '2026-07-16',
  author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' },
  publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } },
  image: 'https://xpeak.es/og-image.jpg',
  url: 'https://xpeak.es/blog/organizar-evento-empresa-paso-a-paso',
};

const faqStructured = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: '¿Con cuánta antelación hay que empezar a organizar un evento de empresa?', acceptedAnswer: { '@type': 'Answer', text: 'Para eventos de más de 50 personas, entre 2 y 4 meses de antelación. Para cenas o presentaciones pequeñas, 3-4 semanas suelen ser suficientes. La antelación depende sobre todo de si necesitas reservar espacio y catering, que son los proveedores que antes se agotan en fechas populares.' } },
    { '@type': 'Question', name: '¿Qué porcentaje del presupuesto se destina a cada partida?', acceptedAnswer: { '@type': 'Answer', text: 'Como orientación: catering 35-40%, espacio/alquiler 20-25%, entretenimiento (DJ, música en vivo) 10-15%, staff y azafatas 10%, producción audiovisual y decoración 10-15%. Varía según el tipo de evento — una gala de premios pesa más en producción, un team building pesa más en actividades.' } },
    { '@type': 'Question', name: '¿Qué proveedores hay que contratar primero?', acceptedAnswer: { '@type': 'Answer', text: 'El espacio y el catering son los que se agotan antes y condicionan la fecha, así que se reservan primero. Después DJ o música en vivo, y por último staff, fotografía y decoración, que suelen tener más disponibilidad de última hora.' } },
    { '@type': 'Question', name: '¿Se puede organizar un evento de empresa sin agencia?', acceptedAnswer: { '@type': 'Answer', text: 'Sí, especialmente para eventos de hasta 100-150 personas. Con un buen checklist y comparando proveedores directamente (sin intermediarios), es perfectamente viable gestionarlo internamente y ahorrar la comisión de agencia, que suele ser del 10-20% del presupuesto total.' } },
  ],
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'Organizar evento de empresa paso a paso', item: 'https://xpeak.es/blog/organizar-evento-empresa-paso-a-paso' },
  ],
};

const FASES = [
  { fase: '8-12 semanas antes', tareas: ['Definir objetivo, aforo y presupuesto total', 'Reservar espacio o local', 'Contactar catering y pedir 2-3 presupuestos'] },
  { fase: '4-8 semanas antes', tareas: ['Cerrar DJ, música en vivo o entretenimiento', 'Confirmar staff y personal de sala', 'Definir producción audiovisual (pantallas, sonido, iluminación)'] },
  { fase: '2-4 semanas antes', tareas: ['Firmar contratos con todos los proveedores', 'Confirmar número final de asistentes al catering', 'Preparar timing detallado del evento (minuto a minuto)'] },
  { fase: 'Última semana', tareas: ['Briefing final con cada proveedor', 'Confirmar horarios de montaje y acceso al espacio', 'Tener un plan B para imprevistos (lluvia, bajas de última hora)'] },
];

const ERRORES = [
  { error: 'No pedir varios presupuestos por partida', consecuencia: 'Pagar hasta un 30-40% más de lo necesario sin saberlo, especialmente en catering y espacio.' },
  { error: 'Cerrar el DJ o la música al final', consecuencia: 'Los mejores perfiles en fechas populares (jueves-sábado, primavera y otoño) se agotan antes que el espacio.' },
  { error: 'No especificar horarios de montaje en el contrato', consecuencia: 'El proveedor llega tarde o cobra horas extra que no estaban acordadas.' },
  { error: 'No tener un único punto de contacto por proveedor', consecuencia: 'Mensajes cruzados entre varias personas del equipo generan errores y duplicidad de gestiones.' },
];

export default function BlogOrganizarEventoEmpresaPasoAPaso() {
  return (
    <>
      <Helmet>
        <title>Cómo organizar un evento de empresa paso a paso (2026) | XPEAK</title>
        <meta name="description" content="Checklist completo para organizar un evento corporativo en España: presupuesto por partidas, timeline de contratación y errores más comunes a evitar." />
        <link rel="canonical" href="https://xpeak.es/blog/organizar-evento-empresa-paso-a-paso" />
        <meta property="og:title" content="Cómo organizar un evento de empresa paso a paso — XPEAK Blog" />
        <meta property="og:description" content="Checklist completo: presupuesto por partidas, timeline y errores a evitar al organizar un evento corporativo." />
        <meta property="og:url" content="https://xpeak.es/blog/organizar-evento-empresa-paso-a-paso" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>

      <div className="min-h-screen" style={{ background: '#ffffff', color: '#111' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-3xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#0D9488' }}>XPEAK</a>
          <div className="flex items-center gap-3">
            <a href="/blog" className="text-xs font-bold hidden sm:block" style={{ color: '#3d3d4e' }}>Blog</a>
            <a href="/auth?mode=register&role=empresario" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#0D9488,#B8941E)', color: '#000' }}>
              Unirse gratis
            </a>
          </div>
        </nav>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>

          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#0D9488' }}>Organizadores · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Cómo organizar un evento de empresa paso a paso</h1>
            <p className="text-base leading-relaxed" style={{ color: '#3d3d4e' }}>
              Un checklist realista, sin florituras: qué contratar primero, cuánto presupuesto asignar a cada partida y qué errores cuestan más tiempo y dinero cuando organizas un evento corporativo sin agencia.
            </p>
            <time className="text-xs mt-3 block" style={{ color: '#666' }}>16 julio 2026</time>
          </div>

          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Timeline: qué hacer y cuándo</h2>
              <div className="space-y-3">
                {FASES.map((f, i) => (
                  <div key={f.fase} className="p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(0,0,0,0.025)' : 'rgba(0,0,0,0.015)', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <p className="text-xs font-black mb-2" style={{ color: '#0D9488' }}>{f.fase}</p>
                    <ul className="space-y-1">
                      {f.tareas.map(t => (
                        <li key={t} className="text-sm leading-relaxed" style={{ color: '#333' }}>• {t}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">Presupuesto: cómo repartirlo por partidas</h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#222' }}>
                No hay una regla fija, pero esta distribución orientativa evita que una partida se coma el presupuesto de las demás:
              </p>
              <div className="space-y-2">
                {[
                  { partida: 'Catering', pct: '35-40%' },
                  { partida: 'Espacio / alquiler', pct: '20-25%' },
                  { partida: 'Entretenimiento (DJ, música en vivo)', pct: '10-15%' },
                  { partida: 'Staff y azafatas', pct: '10%' },
                  { partida: 'Producción audiovisual y decoración', pct: '10-15%' },
                ].map((row, i) => (
                  <div key={row.partida} className="flex items-center justify-between p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(0,0,0,0.025)' : 'rgba(0,0,0,0.015)', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <p className="text-xs font-medium">{row.partida}</p>
                    <span className="text-xs font-black ml-4 shrink-0" style={{ color: '#0D9488' }}>{row.pct}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">Errores que más cuestan (tiempo y dinero)</h2>
              <div className="space-y-3">
                {ERRORES.map((e, i) => (
                  <div key={e.error} className="p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(0,0,0,0.025)' : 'rgba(0,0,0,0.015)', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <p className="text-xs font-black mb-1">{e.error}</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#333' }}>{e.consecuencia}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">
                {faqStructured.mainEntity.map((f) => (
                  <div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}>
                    <p className="text-sm font-black mb-2">{f.name}</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#333' }}>{f.acceptedAnswer.text}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(13,148,136,0.04)', border: '1px solid rgba(13,148,136,0.12)' }}>
              <p className="text-sm font-black mb-2">Organiza tu evento sin hojas de cálculo sueltas</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>
                Compara proveedores, firma contratos digitales y controla el presupuesto de cada partida desde un único panel. Gratis, sin comisión.
              </p>
              <a href="/organizar-eventos" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#0D9488,#B8941E)', color: '#000' }}>
                Ver panel de organización →
              </a>
            </div>
          </div>
        </main>

        <BlogRelatedPosts currentSlug='/blog/organizar-evento-empresa-paso-a-paso' tag='Eventos' />
        <FooterPublic />
        <BlogScrollCTA role="empresario" storageKey="xpeak_scrollcta_organizar_evento_empresa" />
      </div>
    </>
  );
}
