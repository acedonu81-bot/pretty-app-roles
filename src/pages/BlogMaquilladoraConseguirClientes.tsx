import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Cómo conseguir trabajo de maquilladora en España: guía 2026', description: 'Guía práctica para maquilladoras freelance que quieren conseguir más clientes en bodas, comuniones y eventos. Portfolio, redes sociales, precios y plataformas.', datePublished: '2026-06-02', dateModified: '2026-06-02', author: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/maquilladora-conseguir-clientes' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cobra una maquilladora freelance en España?', acceptedAnswer: { '@type': 'Answer', text: 'Una maquilladora freelance cobra entre 80€ y 300€ por servicio según el tipo de evento y la ciudad. Maquillaje de novia completo (prueba + día del evento): 150-350€. Maquillaje de comunión (niña): 50-100€. Maquillaje para evento o gala: 70-150€. En Madrid y Barcelona los precios son un 20-30% más altos. Con 3-4 servicios al fin de semana en temporada alta se superan fácilmente los 1.500€ mensuales.' } },
  { '@type': 'Question', name: '¿Necesito título oficial para trabajar de maquilladora?', acceptedAnswer: { '@type': 'Answer', text: 'No hay título obligatorio para ejercer, pero sí se valoran las certificaciones: FP de Estética (Grado Medio o Superior), cursos homologados de maquillaje nupcial, artístico o aerógrafo. Las marcas como MAC, Charlotte Tilbury o Armani ofrecen formaciones que también abren puertas. Lo que más cuenta para los clientes es el portfolio y las reseñas.' } },
  { '@type': 'Question', name: '¿Cómo fijo el precio como maquilladora de bodas?', acceptedAnswer: { '@type': 'Answer', text: 'Calcula: tiempo de servicio (maquillaje de novia 1.5-2h, prueba 1h) + desplazamiento + materiales consumibles + IRPF. Muchas maquilladoras cobran la prueba por separado (50-80€) y el servicio el día de la boda (120-220€). Para paquetes con damas de honor o familiares, descuento del 10-15% por persona adicional.' } },
  { '@type': 'Question', name: '¿Cómo consigo mis primeras clientas de boda?', acceptedAnswer: { '@type': 'Answer', text: 'Empieza con sesiones a precio reducido a cambio de fotos de calidad para tu portfolio. Contacta fotógrafos de bodas para hacer shootings colaborativos — ellos también necesitan maquilladoras para sus proyectos. Regístrate en plataformas como XPEAK donde novias y organizadores buscan maquilladoras verificadas. Instagram bien trabajado con antes/después es tu mejor herramienta de captación.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Maquilladora conseguir clientes', item: 'https://xpeak.es/blog/maquilladora-conseguir-clientes' }] };

const ESTRATEGIAS = [
  { num: '01', titulo: 'Instagram con before & after reales', desc: 'El maquillaje es el contenido más viral de Instagram. Un reel de transformación de 15 segundos puede conseguirte más clientas que un anuncio de 500€. Muestra tu trabajo real, con luz natural, sin filtros exagerados. Las novias quieren ver cómo quedará en las fotos, no en un estudio de producto.' },
  { num: '02', titulo: 'Portfolio físico y digital impecable', desc: 'Lleva siempre un portfolio en iPad o móvil a las reuniones presenciales. Organiza por tipo de evento: novias, comuniones, galas, maquillaje artístico. Incluye fotos de fotógrafo profesional si puedes — la calidad de la foto también vende tu trabajo.' },
  { num: '03', titulo: 'Colabora con fotógrafos y wedding planners', desc: 'Un fotógrafo de bodas con quien trabajas bien es una fuente constante de referencias. Los wedding planners tienen listas de proveedores recomendados que usan con cada boda. Una relación sólida con 2-3 de cada puede darte la agenda llena sin hacer marketing adicional.' },
  { num: '04', titulo: 'Regístrate en plataformas especializadas', desc: 'XPEAK conecta maquilladoras con novias, organizadores de comuniones y coordinadoras de eventos que buscan profesionales verificadas. Tu perfil incluye portfolio, reseñas y zonas de trabajo. Las clientas que entran ya tienen intención de contratar.' },
  { num: '05', titulo: 'Ofrece prueba antes de la boda', desc: 'La prueba de maquillaje es un servicio de pago (no gratis) que reduce la ansiedad de la novia y asegura que el look del gran día esté definido. Las maquilladoras que ofrecen prueba tienen mayor tasa de conversión y menos cancelaciones el día del evento.' },
  { num: '06', titulo: 'Especialízate para cobrar más', desc: 'Maquillaje de novia, maquillaje artístico, airbrush, efectos especiales FX, maquillaje oncológico... cada especialización te permite acceder a un segmento con menor competencia y mayor disposición a pagar. Dos cursos avanzados pueden doblar tus tarifas en 12 meses.' },
];

export default function BlogMaquilladoraConseguirClientes() {
  return (
    <>
      <Helmet>
        <title>Cómo conseguir trabajo de maquilladora en España 2026 | XPEAK</title>
        <meta name="description" content="Guía práctica para maquilladoras freelance. Cómo conseguir clientas de bodas, comuniones y eventos. Portfolio, Instagram, plataformas y precios." />
        <link rel="canonical" href="https://xpeak.es/blog/maquilladora-conseguir-clientes" />
        <meta property="og:title" content="Cómo conseguir trabajo de maquilladora en España 2026 — XPEAK" />
        <meta property="og:description" content="Estrategias para maquilladoras freelance que quieren conseguir más clientas en bodas y eventos. Portfolio, Instagram y plataformas." />
        <meta property="og:url" content="https://xpeak.es/blog/maquilladora-conseguir-clientes" />
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
            <a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Unirse gratis</a>
          </div>
        </nav>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#8E8EA0' }}>← Todos los artículos</a>

          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>Para Maquilladoras · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Cómo conseguir trabajo de maquilladora en España: guía 2026</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#8E8EA0' }}>El mercado de maquillaje para bodas y eventos en España mueve más de 300 millones de euros al año. Las maquilladoras freelance con buena presencia online y buen portfolio tienen agenda llena de mayo a octubre. Aquí están las 6 estrategias que marcan la diferencia.</p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>2 junio 2026</time>
          </div>

          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Tarifas orientativas</h2>
              <div className="space-y-2">
                {[
                  { servicio: 'Maquillaje novia (prueba)', precio: '50–90€' },
                  { servicio: 'Maquillaje novia (día del evento)', precio: '120–250€' },
                  { servicio: 'Maquillaje dama de honor / familiar', precio: '60–120€' },
                  { servicio: 'Maquillaje comunión (niña)', precio: '50–90€' },
                  { servicio: 'Maquillaje gala / evento corporativo', precio: '70–150€' },
                ].map((row, i) => (
                  <div key={row.servicio} className="flex items-center justify-between p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <p className="text-xs font-medium">{row.servicio}</p>
                    <span className="text-xs font-bold ml-4 shrink-0" style={{ color: '#D4AF37' }}>{row.precio}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-3" style={{ color: '#8E8EA0' }}>Tarifas orientativas España 2026. Madrid y Barcelona un 20-30% más. Sin IVA.</p>
            </section>

            <BlogInlineCTA role="makeup" />

            <section>
              <h2 className="text-lg font-black mb-4">6 estrategias para conseguir más clientas</h2>
              <div className="space-y-4">
                {ESTRATEGIAS.map((e, i) => (
                  <div key={e.num} className="p-5 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="flex items-start gap-4">
                      <span className="text-2xl font-black shrink-0 leading-none mt-0.5" style={{ color: 'rgba(212,175,55,0.3)' }}>{e.num}</span>
                      <div>
                        <p className="text-sm font-black mb-1.5">{e.titulo}</p>
                        <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>{e.desc}</p>
                      </div>
                    </div>
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

            <section className="mt-8">
              <h2 className="text-base font-black mb-3" style={{ color: 'rgba(255,255,255,0.85)' }}>Artículos relacionados</h2>
              <div className="space-y-2">
                {[
                  { href: '/blog/maquillaje-nupcial-precio-guia', cat: 'Maquillaje', title: 'Maquillaje nupcial: precios y cómo elegir tu maquilladora' },
                  { href: '/blog/profesionales-bodas', cat: 'Hub Bodas', title: 'Profesionales para bodas: guía completa 2026' },
                  { href: '/blog/fotografo-como-conseguir-clientes', cat: 'Para Fotógrafos', title: 'Cómo conseguir clientes como fotógrafo 2026' },
                  { href: '/blog/como-conseguir-bolos-dj', cat: 'Para DJs', title: 'Cómo conseguir bolos como DJ 2026' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.72)' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>

            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Eres maquilladora y quieres más clientas?</p>
              <p className="text-xs mb-4" style={{ color: '#8E8EA0' }}>Crea tu perfil en XPEAK gratis. Novias y organizadores de eventos en tu zona ven tu portfolio, leen tus reseñas y te contactan directamente. Sin comisión oculta.</p>
              <a href="/auth?role=maquillaje" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Crear mi perfil de maquilladora gratis →</a>
            </div>
          </div>
                  <BlogEmailCapture variant="guia" intent="ser-profesional" articlePath="/blog/maquilladora-conseguir-clientes" />
</main>
        <FooterPublic />
      </div>
    </>
  );
}
