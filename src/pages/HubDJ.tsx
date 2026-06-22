import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';

const ARTICLES = [
  { href: '/blog/cuanto-cobra-un-dj-en-espana', tag: 'Precios', title: '¿Cuánto cobra un DJ en España? Tarifas 2026', desc: 'Guía completa con precios por experiencia, ciudad y tipo de evento.' },
  { href: '/blog/dj-boda-civil-precio-canciones', tag: 'Bodas', title: 'DJ para boda civil: precio y canciones 2026', desc: 'Cuánto cuesta el DJ y qué música poner en cada momento de la boda civil.' },
  { href: '/blog/dj-para-cumpleanos-precio', tag: 'Fiestas', title: 'DJ para cumpleaños: precio y qué incluye 2026', desc: 'Precios por horas, tipo de equipo y cómo elegir el DJ correcto para tu fiesta.' },
  { href: '/blog/dj-para-fiesta-privada-precio', tag: 'Fiestas', title: 'DJ fiesta privada: precio y qué incluye 2026', desc: 'Cuánto cuesta contratar un DJ para una fiesta privada. Precios según invitados y horas.' },
  { href: '/blog/dj-para-eventos-corporativos-precio', tag: 'Empresa', title: 'DJ para eventos corporativos: precio 2026', desc: 'Precios para afterworks, galas, fiestas de empresa y presentaciones.' },
  { href: '/blog/dj-residente-discoteca-precio', tag: 'Discoteca', title: 'DJ residente discoteca: precio y funciones 2026', desc: 'Cuánto cobra un DJ residente. Diferencias con DJ invitado y qué incluye el contrato.' },
  { href: '/blog/dj-para-bodas-vs-discoteca', tag: 'Guía', title: 'DJ bodas vs discoteca: diferencias 2026', desc: '¿Son lo mismo? Diferencias en habilidades, equipo y precios. Cómo elegir el correcto.' },
  { href: '/blog/10-errores-contratar-dj-boda', tag: 'Guía', title: '10 errores al contratar DJ para tu boda', desc: 'Los errores más frecuentes y cómo evitarlos antes de firmar el contrato.' },
  { href: '/blog/disco-movil-para-comuniones', tag: 'Comuniones', title: 'Disco móvil comuniones: precio y qué incluye', desc: 'Paquetes, qué incluye el servicio y cómo elegir el DJ para tu comunión.' },
  { href: '/blog/musica-para-bodas-guia', tag: 'Bodas', title: 'Música para bodas: DJ, banda o playlist 2026', desc: 'Comparativa honesta entre DJ, banda en directo y lista propia. Precios y cuándo elegir cada una.' },
];

const FAQ = [
  { q: '¿Cuánto cuesta contratar un DJ para un evento en España?', a: 'El precio de un DJ varía entre 300€ y 2.500€ según el tipo de evento y la experiencia del profesional. Para una boda completa (ceremonia + cóctel + cena + pista), el rango habitual es 700-1.500€. Para una fiesta privada de 4 horas, entre 350-700€.' },
  { q: '¿Qué diferencia hay entre un DJ de bodas y un DJ de discoteca?', a: 'Un DJ de bodas gestiona una variedad musical amplia, adapta el repertorio a distintas generaciones, gestiona peticiones en directo y cubre toda la jornada (8-10h). Un DJ de discoteca está especializado en un género concreto y en mantener un piso de baile uniforme.' },
  { q: '¿Qué equipo incluye el DJ normalmente?', a: 'El equipo básico incluye dos CDJs o Denon SC, mezclador, dos altavoces PA e iluminación de ambiente. Para espacios de más de 100 personas se suele añadir subwoofer extra. Los DJs de bodas suelen incluir todo el equipo en su caché.' },
  { q: '¿Con cuánta antelación hay que contratar al DJ?', a: 'Para bodas y eventos de fin de semana, lo ideal es reservar con 3-6 meses. Para eventos entre semana o cumpleaños informales, 4-8 semanas suelen ser suficientes. El Flash Booking de XPEAK permite cubrir urgencias en menos de 1h.' },
];

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'DJ para eventos en España: guía completa de precios y tipos (2026)', description: 'Guía definitiva sobre cómo contratar un DJ para cualquier evento en España. Precios reales, diferencias entre tipos de DJ y qué pedir en tu contrato.', datePublished: '2026-05-27', dateModified: '2026-05-27', author: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/dj-para-eventos' };
const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'DJ para eventos', item: 'https://xpeak.es/blog/dj-para-eventos' }] };

const TAG_COLOR: Record<string, string> = { Precios: '#D4AF37', Bodas: '#f472b6', Fiestas: '#60a5fa', Empresa: '#a78bfa', Discoteca: '#34d399', Guía: '#D4AF37', Comuniones: '#fbbf24' };

export default function HubDJ() {
  return (
    <>
      <Helmet>
        <title>DJ para eventos España: guía completa 2026 | XPEAK</title>
        <meta name="description" content="Todo sobre contratar DJ para bodas, cumpleaños, fiestas privadas y eventos corporativos en España. Precios reales, tipos de DJ y qué incluye el servicio." />
        <link rel="canonical" href="https://xpeak.es/blog/dj-para-eventos" />
        <meta property="og:title" content="DJ para eventos España: guía completa 2026 — XPEAK" />
        <meta property="og:description" content="Precios, tipos de DJ y cómo contratar para cualquier evento en España." />
        <meta property="og:url" content="https://xpeak.es/blog/dj-para-eventos" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
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
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>DJ · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">DJ para eventos en España: guía completa de precios y tipos (2026)</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#3d3d4e' }}>Todo lo que necesitas saber antes de contratar un DJ: precios reales por tipo de evento, diferencias entre perfiles y qué debe incluir el contrato.</p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>27 mayo 2026</time>
          </div>

          <div className="space-y-10">
            <section>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.72)' }}>
                Contratar un DJ en España no es lo mismo para una boda que para una discoteca o un cumpleaños. El perfil correcto, el equipo adecuado y el precio justo dependen del tipo de evento, el número de invitados y la duración del servicio. Esta guía reúne todo lo que necesitas saber en un solo lugar.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>
                Los precios de los DJs en España oscilan entre los 300€ para una sesión corta en una fiesta informal y los 2.500€ o más para un DJ con nombre propio en una boda de lujo. La clave está en saber qué perfil necesitas y qué debe incluir el servicio para no llevarte sorpresas el día del evento.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">Guías por tipo de evento</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ARTICLES.map(a => (
                  <a key={a.href} href={a.href} className="block p-4 rounded-xl transition-all hover:scale-[1.02]" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none' }}>
                    <span className="inline-block text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded mb-2" style={{ background: 'rgba(212,175,55,0.1)', color: TAG_COLOR[a.tag] || '#D4AF37', border: `1px solid ${TAG_COLOR[a.tag] || '#D4AF37'}22` }}>{a.tag}</span>
                    <p className="text-sm font-black leading-snug mb-1">{a.title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{a.desc}</p>
                  </a>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">Precios de DJ según tipo de evento</h2>
              <div className="space-y-2">
                {[
                  { tipo: 'Boda completa (ceremonia + cóctel + cena + pista)', precio: '700–1.500€' },
                  { tipo: 'Fiesta privada / cumpleaños (4h)', precio: '350–700€' },
                  { tipo: 'Evento corporativo / afterwork', precio: '500–1.200€' },
                  { tipo: 'Discoteca / sala nocturna (noche)', precio: '300–2.500€' },
                  { tipo: 'Comunión (disco móvil, 3-4h)', precio: '250–500€' },
                ].map((row, i) => (
                  <div key={row.tipo} className="flex items-center justify-between p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <p className="text-xs font-medium">{row.tipo}</p>
                    <span className="text-xs font-bold ml-4 shrink-0" style={{ color: '#D4AF37' }}>{row.precio}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Precios orientativos en España 2026. Sin IVA. Variable según ciudad y experiencia.</p>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">
                {FAQ.map(f => (
                  <div key={f.q} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-sm font-bold mb-2">{f.q}</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>{f.a}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Buscas DJ para tu evento?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>XPEAK tiene DJs verificados para bodas, fiestas privadas y eventos corporativos en toda España. Compara perfiles y contrata con contrato digital automático.</p>
              <a href="/contratar-dj" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Ver DJs disponibles en XPEAK →</a>
            </div>
          </div>
        </main>
        <FooterPublic />
      </div>
    </>
  );
}
