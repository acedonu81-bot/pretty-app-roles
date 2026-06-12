import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Cómo trabajar de RRPP en discoteca en España: guía 2026', description: 'Guía completa para trabajar de relaciones públicas en discotecas y clubs. Qué hace un RRPP, cuánto cobra, cómo conseguir los primeros contratos y cómo crecer.', datePublished: '2026-06-02', dateModified: '2026-06-02', author: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/como-trabajar-de-rrpp-discoteca' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cobra un RRPP de discoteca?', acceptedAnswer: { '@type': 'Answer', text: 'Un RRPP de discoteca cobra por comisión: entre 2€ y 8€ por persona que entra por su lista, o un porcentaje del consumo generado por sus clientes (5-15%). Un RRPP activo con buena red en una ciudad mediana puede ganar 800-2.000€ al mes trabajando solo los fines de semana. Los mejores RRPP en Madrid o Ibiza superan los 3.000€ mensuales en temporada.' } },
  { '@type': 'Question', name: '¿Qué hace exactamente un RRPP de discoteca?', acceptedAnswer: { '@type': 'Answer', text: 'El RRPP gestiona su propia lista de clientes VIP y de acceso: hace captación activa a través de Instagram, WhatsApp y contactos personales, negocia condiciones con la sala (consumición mínima, precio de entrada, mesa), acompaña a sus clientes en el acceso y mantiene la relación para que repitan. También puede gestionar reservas de mesa y organizar entradas grupales.' } },
  { '@type': 'Question', name: '¿Cómo consigo mi primer contrato como RRPP?', acceptedAnswer: { '@type': 'Answer', text: 'Empieza por las salas más pequeñas de tu ciudad: es más fácil demostrar resultados y acumular referencias. Lleva a tus propios amigos durante las primeras semanas y documenta cuántas personas llevas cada noche. Con 3-4 semanas de datos reales, puedes acercarte a salas más grandes con argumentos concretos. La credibilidad se construye con números, no con promesas.' } },
  { '@type': 'Question', name: '¿Necesito estar dado de alta como autónomo para trabajar de RRPP?', acceptedAnswer: { '@type': 'Answer', text: 'Si cobras de forma habitual sí, aunque muchos RRPP empiezan sin estar dados de alta y la sala les paga en mano o como colaboradores puntuales. Para un trabajo regular con ingresos superiores al SMI, lo correcto es darse de alta como autónomo y emitir facturas. Consulta con un gestor sobre el modelo más eficiente para tu situación.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'RRPP discoteca trabajo', item: 'https://xpeak.es/blog/como-trabajar-de-rrpp-discoteca' }] };

const PASOS = [
  { titulo: 'Entiende cómo funciona el modelo de comisión', desc: 'El RRPP no cobra salario fijo — cobra por resultados. Cuantas más personas lleves a la sala, más ganas. Antes de empezar, negocia con la sala qué cuenta como "tu lista": solo entrada directa, o también mesas que reserves. Pon todo por escrito.' },
  { titulo: 'Empieza por salas donde ya conoces gente', desc: 'Tu primer contrato será más fácil de conseguir en una sala donde ya tienes relación con el equipo o donde ya eres cliente habitual. La confianza previa facilita la conversación y te da margen para demostrar resultados sin presión excesiva.' },
  { titulo: 'Construye tu base de seguidores en Instagram', desc: 'Instagram es la herramienta principal del RRPP moderno. Un perfil activo, con stories de los eventos, acceso de tu lista y ambiente de noche te permite captar nuevos clientes pasivamente. Los seguidores locales son oro — los de otra ciudad no te sirven de nada.' },
  { titulo: 'Gestiona tu lista con profesionalidad', desc: 'Usa Google Sheets, Notion o una app específica para llevar el control de quién confirma, quién entra y quién queda pendiente. Las salas valoran a los RRPP que llegan con la lista hecha, sin improvisación en puerta. La gestión limpia = más confianza = mejores condiciones.' },
  { titulo: 'Trabaja con varias salas a la vez', desc: 'Los RRPP senior trabajan con 3-4 salas distintas en noches diferentes (viernes una, sábado otra, domingos en verano otra). Esto multiplica tus ingresos y diversifica tu riesgo. Si una sala baja el nivel o cierra, sigues con las otras.' },
  { titulo: 'Regístrate en plataformas para conseguir contratos', desc: 'XPEAK conecta RRPP y promotores con salas y clubes que buscan profesionales verificados para sus eventos. Tu perfil muestra tu red, ciudad de trabajo y resultados previos. Los dueños de sala buscan activamente RRPP confiables — estar visible es el primer paso.' },
];

export default function BlogRRPPDiscoteca() {
  return (
    <>
      <Helmet>
        <title>Cómo trabajar de RRPP en discoteca en España 2026 | XPEAK</title>
        <meta name="description" content="Guía completa para trabajar de relaciones públicas en discotecas y clubs. Cuánto cobra un RRPP, cómo funciona la comisión y cómo conseguir los primeros contratos." />
        <link rel="canonical" href="https://xpeak.es/blog/como-trabajar-de-rrpp-discoteca" />
        <meta property="og:title" content="Cómo trabajar de RRPP en discoteca en España 2026 — XPEAK" />
        <meta property="og:description" content="Guía práctica para RRPP de discoteca. Modelos de comisión, cómo empezar y cómo conseguir contratos con salas." />
        <meta property="og:url" content="https://xpeak.es/blog/como-trabajar-de-rrpp-discoteca" />
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
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>Para RRPP · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Cómo trabajar de RRPP en discoteca en España: guía 2026</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#8E8EA0' }}>El trabajo de relaciones públicas en discotecas es uno de los más flexibles del sector: sin horario fijo, cobras por resultados y puedes trabajar con varias salas a la vez. Lo que necesitas no es un título — es red de contactos, capacidad de gestión y saber estructurar tu negocio desde el principio.</p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>2 junio 2026</time>
          </div>

          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Cuánto cobra un RRPP de discoteca</h2>
              <div className="space-y-2">
                {[
                  { nivel: 'RRPP en prácticas (primeros 3 meses)', cobro: '2–4€ / persona' },
                  { nivel: 'RRPP activo con lista propia', cobro: '3–6€ / persona o 5-10% consumo' },
                  { nivel: 'RRPP senior con varias salas', cobro: '5–8€ / persona o 10-15% consumo' },
                  { nivel: 'Head of RRPP / jefe de equipo', cobro: 'Fijo + comisión de su equipo' },
                ].map((row, i) => (
                  <div key={row.nivel} className="flex items-center justify-between p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <p className="text-xs font-medium">{row.nivel}</p>
                    <span className="text-xs font-bold ml-4 shrink-0" style={{ color: '#D4AF37' }}>{row.cobro}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-3" style={{ color: '#8E8EA0' }}>Las condiciones varían mucho por sala, ciudad y tipo de evento. Negocia siempre antes de empezar.</p>
            </section>

            <BlogInlineCTA role="general" />

            <section>
              <h2 className="text-lg font-black mb-4">Cómo empezar: 6 pasos</h2>
              <div className="space-y-4">
                {PASOS.map((p, i) => (
                  <div key={p.titulo} className="flex gap-4 p-5 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span className="text-xl font-black shrink-0 w-6 text-center leading-none mt-0.5" style={{ color: 'rgba(212,175,55,0.35)' }}>{i + 1}</span>
                    <div>
                      <p className="text-sm font-black mb-1.5">{p.titulo}</p>
                      <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>{p.desc}</p>
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
                  { href: '/blog/staff-para-eventos', cat: 'Hub Staff', title: 'Staff para eventos: guía completa 2026' },
                  { href: '/blog/promotores-de-eventos-que-hacen', cat: 'Staff', title: 'Promotores de eventos: qué hacen y cuánto cobran' },
                  { href: '/blog/como-ser-promotor-eventos', cat: 'Para Promotores', title: 'Cómo ser promotor de eventos 2026' },
                  { href: '/blog/staff-de-discoteca-funciones-y-salario', cat: 'Staff', title: 'Staff de discoteca: funciones y salarios 2026' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.72)' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>

            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Quieres trabajar de RRPP en eventos?</p>
              <p className="text-xs mb-4" style={{ color: '#8E8EA0' }}>Crea tu perfil en XPEAK gratis. Salas, clubs y promotoras en tu ciudad ven tu red de contactos y te contratan directamente para sus eventos. Sin comisión oculta.</p>
              <a href="/auth?role=staff" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Crear mi perfil de RRPP gratis →</a>
            </div>
          </div>
                  <BlogEmailCapture variant="guia" intent="ser-profesional" articlePath="/blog/como-trabajar-de-rrpp-discoteca" />
</main>
        <BlogAuthor />
        <FooterPublic />
      </div>
    </>
  );
}
