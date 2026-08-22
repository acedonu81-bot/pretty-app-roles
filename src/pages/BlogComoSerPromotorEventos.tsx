import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Cómo ser promotor de eventos en España: guía completa 2026', description: 'Guía práctica para convertirte en promotor de eventos. Qué hace un promotor, cuánto cobra, cómo empezar y cómo conseguir los primeros contratos.', datePublished: '2026-06-02', dateModified: '2026-06-02', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/como-ser-promotor-eventos' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cobra un promotor de eventos en España?', acceptedAnswer: { '@type': 'Answer', text: 'Un promotor de eventos cobra de tres formas: tarifa fija por evento (150-600€), comisión por asistentes captados (1-5€/persona) o porcentaje sobre taquilla (5-15%). Un promotor activo con buena red puede generar 1.500-4.000€ al mes en temporada alta. Los promotores freelance que trabajan con varias salas simultáneamente son los que más ganan.' } },
  { '@type': 'Question', name: '¿Qué hace exactamente un promotor de eventos?', acceptedAnswer: { '@type': 'Answer', text: 'El promotor gestiona la lista de invitados (listas VIP y de acceso gratuito), hace captación activa de asistentes a través de redes sociales y contactos personales, coordina con la sala las condiciones de acceso y consumición, y en algunos casos también gestiona la comunicación del evento online. Es el puente entre el público y la sala o promotora.' } },
  { '@type': 'Question', name: '¿Necesito experiencia previa para ser promotor de eventos?', acceptedAnswer: { '@type': 'Answer', text: 'No es imprescindible, pero sí necesitas una red social activa y facilidad para relacionarte. Los promotores más efectivos empiezan en su entorno cercano: llevan amigos a eventos, acumulan resultados y con eso consiguen contratos con salas más grandes. La clave es tener métricas reales: cuántas personas llevas cada noche.' } },
  { '@type': 'Question', name: '¿Es necesario ser autónomo para trabajar de promotor?', acceptedAnswer: { '@type': 'Answer', text: 'Depende del volumen y cómo trabajes. Si cobras de forma esporádica, algunas salas te pagan en mano o con factura de la propia promotora. Si tienes ingresos regulares superiores al SMI, deberías darte de alta como autónomo para facturar correctamente. Muchos promotores trabajan como autónomos desde el primer año para poder deducir gastos.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Cómo ser promotor eventos', item: 'https://xpeak.es/blog/como-ser-promotor-eventos' }] };

const PASOS = [
  { titulo: 'Entiende exactamente qué hace un promotor', desc: 'El promotor no es el que organiza el evento — es el que llena la sala. Su trabajo es llevar asistentes: gestionar listas de invitados, hacer captación activa en redes y mover su red de contactos para garantizar aforo. Sin resultados medibles, no hay contrato.' },
  { titulo: 'Empieza con eventos pequeños', desc: 'No intentes entrar directamente a las salas grandes. Ofrécete a promotoras pequeñas, fiestas universitarias o eventos de bares para demostrar que puedes llevar gente. Con 2-3 eventos documentados (cuántas personas llevaste, qué noche era) ya tienes un argumento.' },
  { titulo: 'Construye tu lista de contactos como activo', desc: 'Tu lista de WhatsApp, seguidores de Instagram y base de contactos es tu principal activo. Cuanto más grande y fiel sea, más vale tu trabajo. Los promotores que cobran más son los que pueden garantizar 100+ personas por noche con antelación.' },
  { titulo: 'Define tus condiciones desde el principio', desc: 'Antes de aceptar un trabajo, negocia: tarifa fija vs comisión, condiciones de acceso para tu lista (¿consumición mínima?), cómo se mide tu rendimiento y cuándo cobras. Un contrato o email de confirmación es suficiente para protegerte.' },
  { titulo: 'Usa herramientas digitales para gestionar tu lista', desc: 'Apps de gestión de listas, Google Forms o plataformas especializadas te permiten controlar quién entra por tu lista, cuántos asistentes captaste y cuándo cobrar comisión. Las salas valoran los promotores que traen datos, no solo personas.' },
  { titulo: 'Regístrate en plataformas de eventos profesionales', desc: 'XPEAK conecta promotores con salas, clubes y promotoras que buscan apoyo para sus eventos. Tu perfil muestra tu red, zonas de influencia y experiencia previa. Los empresarios de sala buscan activamente promotores verificados en su ciudad.' },
];

const MODELOS = [
  { modelo: 'Tarifa fija por evento', desc: '150–600€ por noche', pros: 'Seguridad económica, sin riesgo' },
  { modelo: 'Comisión por asistente', desc: '1–5€ por persona captada', pros: 'Sin límite de ingresos' },
  { modelo: '% sobre taquilla', desc: '5–15% de la recaudación', pros: 'Ideal en eventos de pago' },
  { modelo: 'Modelo mixto', desc: 'Fija + comisión', pros: 'El más habitual y equilibrado' },
];

export default function BlogComoSerPromotorEventos() {
  return (
    <>
      <Helmet>
        <title>Cómo ser promotor de eventos en España: guía 2026 | XPEAK</title>
        <meta name="description" content="Guía completa para ser promotor de eventos. Qué hace un promotor, cuánto cobra, modelos de pago y cómo conseguir los primeros contratos con salas y promotoras." />
        <link rel="canonical" href="https://xpeak.es/blog/como-ser-promotor-eventos" />
        <meta property="og:title" content="Cómo ser promotor de eventos en España: guía 2026 — XPEAK" />
        <meta property="og:description" content="Guía práctica para promotores de eventos. Modelos de cobro, cómo empezar y cómo encontrar salas que te contraten." />
        <meta property="og:url" content="https://xpeak.es/blog/como-ser-promotor-eventos" />
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
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#059669' }}>XPEAK</a>
          <div className="flex items-center gap-3">
            <a href="/blog" className="text-xs font-bold hidden sm:block" style={{ color: '#3d3d4e' }}>Blog</a>
            <a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#059669,#B8941E)', color: '#000' }}>Unirse gratis</a>
          </div>
        </nav>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>

          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#059669' }}>Para Promotores · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Cómo ser promotor de eventos en España: guía completa 2026</h1>
            <p className="text-base leading-relaxed" style={{ color: '#3d3d4e' }}>El promotor de eventos es uno de los perfiles más demandados en la industria del ocio nocturno y los eventos privados. No necesitas título ni experiencia previa — necesitas red de contactos, capacidad de gestión y saber cómo estructurar tu trabajo desde el primer día.</p>
            <time className="text-xs mt-3 block" style={{ color: '#666' }}>2 junio 2026</time>
          </div>

          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Modelos de cobro de un promotor</h2>
              <div className="space-y-3">
                {MODELOS.map((m, i) => (
                  <div key={m.modelo} className="p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(0,0,0,0.025)' : 'rgba(0,0,0,0.015)', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-xs font-bold">{m.modelo}</p>
                      <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded ml-3 shrink-0" style={{ background: 'rgba(5,150,105,0.1)', color: '#059669' }}>{m.desc}</span>
                    </div>
                    <p className="text-xs" style={{ color: '#3d3d4e' }}>{m.pros}</p>
                  </div>
                ))}
              </div>
            </section>

            <BlogInlineCTA role="general" />

            <section>
              <h2 className="text-lg font-black mb-4">Cómo empezar: 6 pasos</h2>
              <div className="space-y-4">
                {PASOS.map((p, i) => (
                  <div key={p.titulo} className="flex gap-4 p-5 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(0,0,0,0.025)' : 'rgba(0,0,0,0.015)', border: '1px solid rgba(0,0,0,0.05)' }}>
                    <span className="text-xl font-black shrink-0 w-6 text-center leading-none mt-0.5" style={{ color: 'rgba(5,150,105,0.35)' }}>{i + 1}</span>
                    <div>
                      <p className="text-sm font-black mb-1.5">{p.titulo}</p>
                      <p className="text-sm leading-relaxed" style={{ color: '#333' }}>{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">
                {faqStructured.mainEntity.map(f => (
                  <div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}>
                    <h3 className="text-sm font-bold mb-2">{f.name}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#222' }}>{f.acceptedAnswer.text}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-8">
              <h2 className="text-base font-black mb-3" style={{ color: '#111' }}>Artículos relacionados</h2>
              <div className="space-y-2">
                {[
                  { href: '/blog/staff-para-eventos', cat: 'Hub Staff', title: 'Staff para eventos: guía completa 2026' },
                  { href: '/blog/promotores-de-eventos-que-hacen', cat: 'Staff', title: 'Promotores de eventos: qué hacen y cuánto cobran' },
                  { href: '/blog/como-trabajar-de-rrpp-discoteca', cat: 'Para RRPP', title: 'Cómo trabajar de RRPP en discoteca 2026' },
                  { href: '/blog/como-conseguir-bolos-dj', cat: 'Para DJs', title: 'Cómo conseguir bolos como DJ 2026' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(5,150,105,0.1)', color: '#059669', border: '1px solid rgba(5,150,105,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: '#222' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>

            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(5,150,105,0.04)', border: '1px solid rgba(5,150,105,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Quieres trabajar de promotor de eventos?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>Crea tu perfil en XPEAK gratis. Salas, clubes y promotoras en tu ciudad ven tu red y te contactan directamente para sus eventos. Sin comisión oculta.</p>
              <a href="/auth?role=promotor" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#059669,#B8941E)', color: '#000' }}>Crear mi perfil de promotor gratis →</a>
            </div>
          </div>
                  <BlogEmailCapture variant="guia" intent="ser-profesional" articlePath="/blog/como-ser-promotor-eventos" />
</main>
        <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/como-ser-promotor-eventos' tag='Staff' />
        <FooterPublic />
        <BlogScrollCTA role="staff" storageKey="xpeak_scrollcta_como_ser_promotor_eventos" />
      </div>
    </>
  );
}
