import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';
import DJResourcesAffiliate from '@/components/DJResourcesAffiliate';

const article = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'DJ para cumpleaños: precios y qué incluye el servicio en España (2026)',
  description: 'Cuánto cuesta contratar un DJ para un cumpleaños en España. Precios por horas, qué incluye y cómo elegir el perfil correcto.',
  datePublished: '2026-05-03',
  dateModified: '2026-05-25',
  author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' },
  publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } },
  image: 'https://xpeak.es/og-image.jpg',
  url: 'https://xpeak.es/blog/dj-para-cumpleanos-precio',
};

const faqStructured = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: '¿Cuánto cuesta un DJ para un cumpleaños?', acceptedAnswer: { '@type': 'Answer', text: 'El precio típico de un DJ para un cumpleaños en España está entre 300€ y 800€ para una sesión de 4-5 horas. Incluye equipo básico (dos platinas, mezclador, altavoces) e iluminación de ambiente. Los cumpleaños de 18 y 50 años suelen requerir setups más elaborados.' } },
    { '@type': 'Question', name: '¿Qué diferencia hay entre un DJ de discoteca y uno para cumpleaños?', acceptedAnswer: { '@type': 'Answer', text: 'El DJ de cumpleaños gestiona una variedad musical mucho más amplia: necesita adaptarse al gusto de distintas generaciones presentes, leer el ambiente y saber cuándo poner temas más comerciales o más nostálgicos. Un DJ de discoteca suele ceñirse a un género específico.' } },
    { '@type': 'Question', name: '¿Necesito local con licencia musical para contratar un DJ?', acceptedAnswer: { '@type': 'Answer', text: 'Si el evento es en un local privado (tu casa, finca alquilada) no necesitas licencia especial. Si es en un local público, este ya debería estar dado de alta en la SGAE. En cualquier caso, la responsabilidad de la licencia recae sobre el titular del local, no sobre el DJ.' } },
    { '@type': 'Question', name: '¿Con cuánta antelación reservar el DJ del cumpleaños?', acceptedAnswer: { '@type': 'Answer', text: 'Para cumpleaños de fin de semana, reserva con al menos 4-8 semanas de antelación. Para fechas especiales (Nochevieja, puentes, verano) puede ser necesario reservar con 3-6 meses.' } },
  ],
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'DJ para cumpleaños precio', item: 'https://xpeak.es/blog/dj-para-cumpleanos-precio' },
  ],
};

const PRECIOS_HORAS = [
  { horas: '2 horas', precio: '200–350€', uso: 'Aperitivo o cierre de fiesta' },
  { horas: '3 horas', precio: '280–500€', uso: 'Cumpleaños informal, terraza' },
  { horas: '4 horas', precio: '350–650€', uso: 'Lo más habitual en cumpleaños' },
  { horas: '5 horas', precio: '450–800€', uso: 'Fiesta larga con cena y baile' },
  { horas: '6+ horas', precio: '550–1.200€', uso: 'Cumpleaños VIP o evento nocturno' },
];

const PRECIOS_TIPO = [
  { tipo: 'DJ residente / local', precio: '200–450€', perfil: '2-4 años de experiencia, géneros variados' },
  { tipo: 'DJ semicomercial', precio: '400–700€', perfil: 'Experiencia en bodas y eventos privados' },
  { tipo: 'DJ con nombre en la zona', precio: '600–1.200€', perfil: 'Conocido en la escena local' },
  { tipo: 'DJ con nombre nacional', precio: '1.500–5.000€', perfil: 'Redes sociales y sala de referencia' },
];

const EQUIPOS = [
  { item: 'Equipo básico', incluye: '2 CDJs o Denon, mezclador, 2 altavoces PA', precio: 'Incluido (≤4h)' },
  { item: 'Iluminación de ambiente', incluye: 'Par LEDs, moonflower, strobos', precio: '+80–150€' },
  { item: 'Pantalla/proyector', incluye: 'Visuales y karaoke', precio: '+100–200€' },
  { item: 'Micro inalámbrico', incluye: 'Para discursos y karaoke', precio: '+40–80€' },
  { item: 'Máquina de humo/haze', incluye: 'Ambientación visual', precio: '+50–100€' },
  { item: 'Subwoofer extra', incluye: 'Para espacios grandes (+100 personas)', precio: '+80–120€' },
];

export default function BlogDJCumpleanos() {
  return (
    <>
      <Helmet>
        <title>DJ para cumpleaños: precio y qué incluye 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cuesta contratar un DJ para un cumpleaños en España. Precios por horas, tipo de equipo y cómo elegir el DJ correcto para tu fiesta." />
        <link rel="canonical" href="https://xpeak.es/blog/dj-para-cumpleanos-precio" />
        <meta property="og:title" content="DJ para cumpleaños: precios 2026 — XPEAK Blog" />
        <meta property="og:description" content="Cuánto cuesta contratar un DJ para un cumpleaños en España. Precios por horas y qué incluye el servicio." />
        <meta property="og:url" content="https://xpeak.es/blog/dj-para-cumpleanos-precio" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="DJ para cumpleaños: precios 2026 — XPEAK Blog" />
        <meta name="twitter:description" content="Cuánto cuesta contratar un DJ para un cumpleaños en España." />
        <meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>

      <div className="min-h-screen" style={{ background: '#ffffff', color: '#111' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-3xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#D4AF37' }}>XPEAK</a>
          <div className="flex items-center gap-3">
            <a href="/blog" className="text-xs font-bold hidden sm:block" style={{ color: '#3d3d4e' }}>Blog</a>
            <a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              Unirse gratis
            </a>
          </div>
        </nav>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>
            ← Todos los artículos
          </a>

          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>DJ · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">
              DJ para cumpleaños: precios y qué incluye el servicio en España (2026)
            </h1>
            <p className="text-base leading-relaxed" style={{ color: '#3d3d4e' }}>
              Un DJ marca la diferencia entre una fiesta de cumpleaños memorable y una con el Bluetooth del móvil. Te contamos cuánto cuesta y qué debes pedir.
            </p>
            <time className="text-xs mt-3 block" style={{ color: '#666' }}>3 mayo 2026</time>
          </div>

          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Precio de DJ para cumpleaños según horas de servicio</h2>
              <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                <table className="w-full text-xs">
                  <thead>
                    <tr style={{ background: 'rgba(212,175,55,0.08)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                      <th className="text-left px-4 py-3 font-bold">Duración</th>
                      <th className="px-4 py-3 font-bold text-center">Precio medio</th>
                      <th className="px-4 py-3 font-bold text-left hidden sm:table-cell">Uso típico</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PRECIOS_HORAS.map((row, i) => (
                      <tr key={row.horas} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                        <td className="px-4 py-3 font-medium">{row.horas}</td>
                        <td className="px-4 py-3 text-center font-bold" style={{ color: '#D4AF37' }}>{row.precio}</td>
                        <td className="px-4 py-3 hidden sm:table-cell" style={{ color: '#3d3d4e' }}>{row.uso}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Precios orientativos en España 2026. Equipo básico incluido. Sin IVA.</p>
            </section>

            <BlogInlineCTA role="dj" />

            <section>
              <h2 className="text-lg font-black mb-4">Precio según perfil del DJ</h2>
              <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                <table className="w-full text-xs">
                  <thead>
                    <tr style={{ background: 'rgba(212,175,55,0.08)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                      <th className="text-left px-4 py-3 font-bold">Perfil</th>
                      <th className="px-4 py-3 font-bold text-center">Precio 4h</th>
                      <th className="px-4 py-3 font-bold text-left hidden sm:table-cell">Descripción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PRECIOS_TIPO.map((row, i) => (
                      <tr key={row.tipo} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                        <td className="px-4 py-3 font-medium">{row.tipo}</td>
                        <td className="px-4 py-3 text-center font-bold" style={{ color: '#D4AF37' }}>{row.precio}</td>
                        <td className="px-4 py-3 hidden sm:table-cell" style={{ color: '#3d3d4e' }}>{row.perfil}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">Extras de equipo y su coste</h2>
              <div className="space-y-2">
                {EQUIPOS.map((item, i) => (
                  <div key={item.item} className="flex items-center justify-between p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(0,0,0,0.025)' : 'rgba(0,0,0,0.015)', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <div>
                      <p className="text-xs font-bold">{item.item}</p>
                      <p className="text-[0.65rem] mt-0.5" style={{ color: '#3d3d4e' }}>{item.incluye}</p>
                    </div>
                    <span className="text-xs font-bold ml-4 shrink-0" style={{ color: '#D4AF37' }}>{item.precio}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-black mb-3">¿DJ de discoteca o DJ de eventos privados para mi cumpleaños?</h2>
              <p className="text-base leading-relaxed mb-3" style={{ color: '#222' }}>
                Para un cumpleaños privado, el perfil ideal es un DJ con experiencia en eventos sociales, no un techno-DJ de sala. La diferencia es la gestión de peticiones y el rango musical.
              </p>
              <p className="text-base leading-relaxed" style={{ color: '#222' }}>
                Un DJ de eventos privados sabe cómo manejar peticiones en directo, adaptar el ritmo a la edad de los invitados y dar paso a momentos especiales (soplar las velas, discursos). Un DJ de discoteca está entrenado para mantener un piso de baile durante horas con un género definido — muy diferente.
              </p>
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
                  { href: '/blog/dj-para-eventos', cat: 'Hub DJ', title: 'DJ para eventos: guía completa de precios 2026' },
                  { href: '/blog/cuanto-cobra-un-dj-en-espana', cat: 'DJ', title: 'Cuánto cobra un DJ en España: precios 2026' },
                  { href: '/blog/dj-para-fiesta-privada-precio', cat: 'DJ', title: 'DJ fiesta privada: precio y qué incluye 2026' },
                  { href: '/blog/animadores-infantiles-comuniones-cumpleanos', cat: 'Infantil', title: 'Animadores infantiles: precios 2026 España' },
                  { href: '/blog/disco-movil-para-comuniones', cat: 'DJ', title: 'Disco móvil comuniones: precio y qué incluye' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: '#222' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>
            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Buscas DJ para tu cumpleaños?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>En XPEAK encuentras DJs verificados para eventos privados en toda España. Flash Booking disponible en menos de 1h.</p>
              <a href="/contratar-dj" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105"
                style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                Ver DJs en XPEAK →
              </a>
            </div>
          </div>
                  <BlogEmailCapture variant="presupuestos" intent="contratar-dj" articlePath="/blog/dj-para-cumpleanos-precio" />
                  <DJResourcesAffiliate role="dj" />
</main>
      <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/dj-para-cumpleanos-precio' tag='DJ' />
        <FooterPublic />
        <BlogScrollCTA role="dj" storageKey="xpeak_scrollcta_dj_cumpleanos" />
      </div>
    </>
  );
}
