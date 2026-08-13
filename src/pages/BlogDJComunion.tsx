import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'DJ para comunión: precio y qué incluye el servicio en España (2026)', description: 'Cuánto cuesta contratar un DJ para una comunión en España. Precios por horas, diferencias con la disco móvil y qué música se pone.', datePublished: '2026-05-27', dateModified: '2026-05-27', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/dj-para-comunion-precio' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cuesta un DJ para una comunión?', acceptedAnswer: { '@type': 'Answer', text: 'Un DJ para comunión en España cuesta entre 300€ y 700€ para una sesión de 3-4 horas. El precio incluye equipo básico (altavoces, CDJs, luces de ambiente) y gestión de peticiones en directo. La disco móvil es la opción más económica (200-400€) pero ofrece menos personalización.' } },
  { '@type': 'Question', name: '¿Qué música se pone en una comunión?', acceptedAnswer: { '@type': 'Answer', text: 'Lo habitual es dividir la pista en dos momentos: durante el banquete se pone música de fondo suave o pop actual para los adultos; al final de la comida, cuando empieza el baile, se mezclan hits infantiles y juveniles (reggaeton, hits del momento) con música de los 80-90 para que bailen los mayores también.' } },
  { '@type': 'Question', name: '¿DJ o disco móvil para una comunión?', acceptedAnswer: { '@type': 'Answer', text: 'La disco móvil (250-500€) suele incluir pantalla de vídeo con videoclips, máquina de humo y karaoke — ideal para comuniones con niños de 8-12 años. El DJ profesional (350-700€) ofrece mejor sonido, más personalización y mayor experiencia en gestión de pista. Para menos de 50 invitados, la disco móvil suele ser suficiente.' } },
  { '@type': 'Question', name: '¿Cuántas horas necesito al DJ en una comunión?', acceptedAnswer: { '@type': 'Answer', text: 'Lo mínimo para una comunión es 3 horas: el cóctel de bienvenida (opcional, fondo suave), el banquete (música de fondo) y la pista de baile (2-3 horas). Si quieres cubrir también la salida de la iglesia o ceremonia civil, añade 30-60 minutos extra.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'DJ para comunión precio', item: 'https://xpeak.es/blog/dj-para-comunion-precio' }] };

const PRECIOS = [
  { horas: '2 horas', precio: '180–320€', uso: 'Solo pista de baile al final' },
  { horas: '3 horas', precio: '280–480€', uso: 'Lo más habitual en comuniones' },
  { horas: '4 horas', precio: '350–600€', uso: 'Cóctel + banquete + pista' },
  { horas: '5 horas', precio: '450–750€', uso: 'Comunión larga con cena' },
];

const EXTRAS = [
  { item: 'Pantalla LED + videoclips', precio: '+80–150€' },
  { item: 'Micrófono inalámbrico (discursos)', precio: '+40–70€' },
  { item: 'Máquina de humo / espuma', precio: '+50–100€' },
  { item: 'Photocall con pantalla', precio: '+100–200€' },
  { item: 'Karaoke infantil', precio: '+60–120€' },
];

export default function BlogDJComunion() {
  return (
    <>
      <Helmet>
        <title>DJ para comunión: precio y qué incluye 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cuesta un DJ para una comunión en España. Precios por horas, diferencias con la disco móvil y qué música poner para niños y adultos." />
        <link rel="canonical" href="https://xpeak.es/blog/dj-para-comunion-precio" />
        <meta property="og:title" content="DJ para comunión: precio y qué incluye 2026 — XPEAK Blog" />
        <meta property="og:description" content="Precios de DJ para comuniones en España. Disco móvil vs DJ y qué música se pone." />
        <meta property="og:url" content="https://xpeak.es/blog/dj-para-comunion-precio" />
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
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>DJ · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">DJ para comunión: precio y qué incluye el servicio en España (2026)</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#3d3d4e' }}>La música es lo que hace que los niños sigan bailando a las 5 de la tarde y los abuelos aguanten hasta las 7. Te contamos cuánto cuesta y qué elegir para tu comunión.</p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>27 mayo 2026</time>
          </div>

          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Precio de DJ para comunión por horas</h2>
              <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <table className="w-full text-xs">
                  <thead>
                    <tr style={{ background: 'rgba(212,175,55,0.08)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <th className="text-left px-4 py-3 font-bold">Duración</th>
                      <th className="px-4 py-3 font-bold text-center">Precio medio</th>
                      <th className="px-4 py-3 font-bold text-left hidden sm:table-cell">Uso típico</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PRECIOS.map((row, i) => (
                      <tr key={row.horas} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td className="px-4 py-3 font-medium">{row.horas}</td>
                        <td className="px-4 py-3 text-center font-bold" style={{ color: '#D4AF37' }}>{row.precio}</td>
                        <td className="px-4 py-3 hidden sm:table-cell" style={{ color: '#3d3d4e' }}>{row.uso}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Precios orientativos España 2026. Equipo básico incluido. Sin IVA.</p>
            </section>

            <BlogInlineCTA role="dj" />

            <section>
              <h2 className="text-lg font-black mb-3">¿DJ o disco móvil para una comunión?</h2>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.75)' }}>
                La principal diferencia es el enfoque. La disco móvil está pensada específicamente para comuniones: incluye pantalla con videoclips, karaoke infantil, máquina de espuma y photocall. El precio es más ajustado (200-450€) pero la calidad de sonido suele ser inferior.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
                Un DJ profesional aporta mejor sonido, más lectura del ambiente y capacidad de adaptarse en tiempo real. Si la comunión tiene más de 60 invitados o quieres que los adultos también disfruten la música, el DJ marca la diferencia. Para comuniones más íntimas o con presupuesto ajustado, la disco móvil es una solución válida.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">Extras de equipo más solicitados</h2>
              <div className="space-y-2">
                {EXTRAS.map((item, i) => (
                  <div key={item.item} className="flex items-center justify-between p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <p className="text-xs font-medium">{item.item}</p>
                    <span className="text-xs font-bold ml-4 shrink-0" style={{ color: '#D4AF37' }}>{item.precio}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-black mb-3">Qué música se pone en una comunión</h2>
              <div className="space-y-3">
                {[
                  { momento: 'Cóctel de bienvenida', musica: 'Pop suave, fondo sin letra, lounge — para que los adultos conversen' },
                  { momento: 'Durante el banquete', musica: 'Pop actual a volumen bajo, éxitos reconocibles, sin reggaeton todavía' },
                  { momento: 'Primer baile / tarta', musica: 'La canción que elija el/la protagonista. Momento especial' },
                  { momento: 'Pista de baile (inicio)', musica: 'Hits del momento, género mixto — para enganchar a los primeros' },
                  { momento: 'Pista de baile (pleno)', musica: 'Reggaeton, pop latino, TikTok hits — los niños se vuelven locos' },
                  { momento: 'Cierre', musica: 'Clásicos de los 80-90 para que bailen también los mayores' },
                ].map((m, i) => (
                  <div key={m.momento} className="p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <p className="text-xs font-bold mb-1">{m.momento}</p>
                    <p className="text-xs" style={{ color: '#3d3d4e' }}>{m.musica}</p>
                  </div>
                ))}
              </div>
            </section>

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
                  { href: '/blog/comuniones-guia-completa', cat: 'Hub Comuniones', title: 'Comuniones en España: guía completa 2026' },
                  { href: '/blog/disco-movil-para-comuniones', cat: 'DJ', title: 'Disco móvil comuniones: precio y qué incluye' },
                  { href: '/blog/cuanto-cuesta-una-comunion-en-espana', cat: 'Comuniones', title: 'Cuánto cuesta una comunión en España 2026' },
                  { href: '/blog/animadores-infantiles-comuniones-cumpleanos', cat: 'Animación', title: 'Animadores infantiles: precios 2026 España' },
                  { href: '/blog/catering-comuniones-precio-persona', cat: 'Catering', title: 'Catering comuniones: precio por persona 2026' },
                  { href: '/blog/cuanto-cobra-un-dj-en-espana', cat: 'DJ', title: 'Cuánto cobra un DJ en España: precios 2026' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.72)' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>

            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Buscas DJ para la comunión?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>En XPEAK encuentras DJs especializados en comuniones y eventos familiares en toda España. Flash Booking en menos de 1h.</p>
              <a href="/contratar-dj" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Ver DJs para comuniones →</a>
            </div>
          </div>
                  <BlogEmailCapture variant="presupuestos" intent="contratar-dj" articlePath="/blog/dj-para-comunion-precio" />
</main>
        <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/dj-para-comunion-precio' tag='DJ' />
        <FooterPublic />
        <BlogScrollCTA role="dj" storageKey="xpeak_scrollcta_dj_comunion" />
      </div>
    </>
  );
}
