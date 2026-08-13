import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';
import DJResourcesAffiliate from '@/components/DJResourcesAffiliate';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Cómo conseguir bolos como DJ en España: 8 estrategias para 2026', description: 'Guía práctica para DJs freelance que quieren conseguir más bolos: plataformas, redes sociales, precios, portfolio y cómo posicionarse en el mercado.', datePublished: '2026-06-02', dateModified: '2026-06-02', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/como-conseguir-bolos-dj' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto puede ganar un DJ freelance en España?', acceptedAnswer: { '@type': 'Answer', text: 'Un DJ freelance activo en España puede ganar entre 15.000€ y 50.000€ al año. Un bolo de boda paga 800-2.000€, un evento corporativo 500-1.500€ y una noche en discoteca 300-800€. Con 2-3 bolos al mes ya se supera el SMI. Los DJs que trabajan bodas en primavera y otoño más discotecas en verano son los que más ingresos anuales generan.' } },
  { '@type': 'Question', name: '¿Necesito ser autónomo para trabajar de DJ?', acceptedAnswer: { '@type': 'Answer', text: 'Sí, si trabajas de forma habitual necesitas darte de alta como autónomo y emitir facturas. La cuota de autónomos en 2026 con la tarifa plana para nuevos autónomos es de 80€/mes durante el primer año. Puedes facturar con IRPF al 15% (primeros tres años) o al 7% si es tu primera actividad. Algunos DJs usan una sociedad limitada cuando superan los 40.000€ anuales.' } },
  { '@type': 'Question', name: '¿Qué equipo necesito como DJ freelance para bodas?', acceptedAnswer: { '@type': 'Answer', text: 'Para bodas necesitas: controlador o CDJs propios (Pioneer o Denon), sistema de PA profesional (al menos 1.000W por canal para exteriores), subwoofer, sistema de iluminación básico (par LED, barra de luz, luz giratoria) y micro inalámbrico para el MC. La inversión mínima ronda los 5.000-10.000€. Muchos DJs empiezan alquilando el PA y van comprando con los primeros bolos.' } },
  { '@type': 'Question', name: '¿Cómo fijo el precio de mis bolos?', acceptedAnswer: { '@type': 'Answer', text: 'Parte de tus costes reales: coste del equipo (amortización), desplazamiento, horas de preparación y actuación, IRPF y cuota de autónomo. Un DJ con equipo propio y 3 años de experiencia en Madrid debería cobrar mínimo 600€ por un bolo de 4h. Muchos DJs novatos cobran demasiado barato y desvalorizan el mercado. Investiga precios en tu zona antes de fijar tarifa.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Cómo conseguir bolos DJ', item: 'https://xpeak.es/blog/como-conseguir-bolos-dj' }] };

const ESTRATEGIAS = [
  { num: '01', titulo: 'Regístrate en plataformas especializadas', desc: 'Plataformas como XPEAK te conectan directamente con organizadores de bodas, comuniones y eventos corporativos que ya están buscando DJ. No tienes que buscar tú — los clientes llegan a tu perfil.' },
  { num: '02', titulo: 'Crea un perfil en Instagram y TikTok', desc: 'Sube clips de tus sesiones, transiciones y setup. No necesitas muchos seguidores — necesitas contenido específico que aparezca cuando alguien busca "DJ boda Madrid" o "DJ para mi fiesta". El contenido local orgánico funciona mejor que los anuncios.' },
  { num: '03', titulo: 'Publica tus mixes en SoundCloud y Mixcloud', desc: 'Los organizadores de bodas y promotores escuchan muestras antes de contratar. Un mix de 30 minutos grabado bien, etiquetado con géneros y ciudad, es tu mejor carta de presentación. Sube uno por tipo de evento: boda, comunión, fiesta privada.' },
  { num: '04', titulo: 'Empieza por cumpleaños y comuniones', desc: 'El mercado de bodas es el más lucrativo pero el más competitivo. Si estás empezando, cumpleaños y comuniones son la puerta de entrada: presupuestos más bajos, clientes más accesibles y referencias que luego te llevan a bodas.' },
  { num: '05', titulo: 'Fija un precio que no te arruine', desc: 'Cobrar barato para ganar clientes funciona a corto plazo pero te quema. Calcula tus costes reales (equipo, desplazamiento, tiempo de montaje y desmontaje) y añade beneficio. Un DJ que cobra poco genera desconfianza en bodas y eventos premium.' },
  { num: '06', titulo: 'Haz networking con wedding planners y catering', desc: 'Los wedding planners, dueños de fincas y empresas de catering tienen listas de proveedores recomendados. Una relación con 3-4 wedding planners activos puede darte 15-20 bolos al año sin hacer nada más.' },
  { num: '07', titulo: 'Pide reseñas a cada cliente', desc: 'Una reseña en Google o en tu perfil de XPEAK vale más que cualquier publicidad. Tras cada evento, manda un mensaje agradeciendo y pidiendo un valoración rápida. Con 10 reseñas positivas ya tienes un argumento de venta muy sólido.' },
  { num: '08', titulo: 'Especialízate en un tipo de evento', desc: 'El DJ "para todo" compite con todos. El DJ "especialista en bodas civiles íntimas hasta 80 personas" compite con muy pocos. Cuanto más específico sea tu nicho, más fácil es cobrar más y diferenciarte.' },
];

export default function BlogConseguirBolosDJ() {
  return (
    <>
      <Helmet>
        <title>Cómo conseguir bolos como DJ en España 2026 | XPEAK</title>
        <meta name="description" content="8 estrategias para conseguir más bolos como DJ freelance en España. Plataformas, redes sociales, precios y cómo posicionarte en el mercado de bodas y eventos." />
        <link rel="canonical" href="https://xpeak.es/blog/como-conseguir-bolos-dj" />
        <meta property="og:title" content="Cómo conseguir bolos como DJ en España: 8 estrategias 2026 — XPEAK" />
        <meta property="og:description" content="Guía práctica para DJs freelance. Plataformas, redes sociales, precios y cómo diferenciarte en el mercado." />
        <meta property="og:url" content="https://xpeak.es/blog/como-conseguir-bolos-dj" />
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
            <a href="/blog" className="text-xs font-bold hidden sm:block" style={{ color: '#3d3d4e' }}>Blog</a>
            <a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Unirse gratis</a>
          </div>
        </nav>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>

          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>Para DJs · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Cómo conseguir bolos como DJ en España: 8 estrategias para 2026</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#3d3d4e' }}>España mueve más de 180.000 bodas al año, miles de comuniones y decenas de miles de eventos privados. El trabajo está ahí — el problema es que pocos DJs saben cómo llegar a ese mercado. Aquí van las 8 estrategias que funcionan en 2026.</p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>2 junio 2026</time>
          </div>

          <div className="space-y-10">
            <section>
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

            <BlogInlineCTA role="dj" />

            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">
                {faqStructured.mainEntity.map(f => (
                  <div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <h3 className="text-sm font-bold mb-2">{f.name}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>{f.acceptedAnswer.text}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-8">
              <h2 className="text-base font-black mb-3" style={{ color: 'rgba(255,255,255,0.85)' }}>Artículos relacionados</h2>
              <div className="space-y-2">
                {[
                  { href: '/blog/dj-para-eventos', cat: 'Hub DJ', title: 'DJ para eventos: guía completa de precios 2026' },
                  { href: '/blog/cuanto-cobra-un-dj-en-espana', cat: 'DJ', title: 'Cuánto cobra un DJ en España: precios 2026' },
                  { href: '/blog/contrato-dj-que-debe-incluir', cat: 'Guía', title: 'Contrato DJ: qué debe incluir 2026' },
                  { href: '/blog/dj-residente-discoteca-precio', cat: 'DJ', title: 'DJ residente de discoteca: precio y contrato 2026' },
                  { href: '/blog/como-trabajar-de-camarero-eventos', cat: 'Staff', title: 'Cómo trabajar de camarero en eventos 2026' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.72)' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>

            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Eres DJ y buscas más bolos?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>Crea tu perfil en XPEAK gratis. Organizadores de bodas, comuniones y eventos ven tu ficha, escuchan tus mixes y te contratan directamente. Sin comisión oculta.</p>
              <a href="/auth?role=dj" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Crear mi perfil DJ gratis →</a>
            </div>
          </div>
                  <DJResourcesAffiliate role="dj" />

                  <BlogEmailCapture variant="presupuestos" intent="contratar-dj" articlePath="/blog/como-conseguir-bolos-dj" />
</main>
        <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/como-conseguir-bolos-dj' tag='DJ' />
        <FooterPublic />
        <BlogScrollCTA role="dj" storageKey="xpeak_scrollcta_conseguir_bolos_dj" />
      </div>
    </>
  );
}
