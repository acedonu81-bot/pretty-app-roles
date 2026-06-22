import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';

const ARTICLES = [
  { href: '/blog/cuanto-cobra-un-camarero-de-eventos', tag: 'Camareros', title: 'Cuánto cobra un camarero de eventos 2026', desc: 'Precios reales para bodas, eventos de empresa y fiestas privadas.' },
  { href: '/blog/cuantos-camareros-necesito-para-mi-boda', tag: 'Camareros', title: 'Cuántos camareros necesito para mi boda', desc: 'Tabla de ratios por número de invitados y formato de servicio.' },
  { href: '/blog/staff-de-discoteca-funciones-y-salario', tag: 'Discoteca', title: 'Staff de discoteca: funciones y sueldos 2026', desc: 'Hostesses, RRPPs, camareros y coordinadores. Tarifas reales por perfil.' },
  { href: '/blog/precio-azafatas-eventos-espana', tag: 'Azafatas', title: 'Precio azafatas para eventos España 2026', desc: 'Tarifas de azafatas para ferias, congresos y eventos corporativos.' },
  { href: '/blog/contratar-barman-evento-privado', tag: 'Barman', title: 'Barman evento privado: precio 2026', desc: 'Cuánto cuesta un barman para boda, fiesta o evento. Paquetes y qué incluye.' },
  { href: '/blog/promotores-de-eventos-que-hacen', tag: 'Promotores', title: 'Promotores de eventos: funciones y precio 2026', desc: 'Tipos de promotores, funciones reales, tarifas y cómo estructurar el contrato.' },
  { href: '/blog/animadores-infantiles-comuniones-cumpleanos', tag: 'Animadores', title: 'Animadores infantiles: precios 2026 España', desc: 'Tipos de animación, ratios por edad y qué preguntar antes de contratar.' },
  { href: '/blog/personal-de-imagen-ferias-y-congresos', tag: 'Imagen', title: 'Personal de imagen para ferias: precios 2026', desc: 'Azafatas, promotoras y modelos para ferias y congresos. Precios por jornada.' },
  { href: '/blog/como-contratar-personal-para-un-evento', tag: 'Guía', title: 'Contratar personal para un evento: guía 2026', desc: 'Tipos de personal, ratios por invitados, precios y checklist completo.' },
];

const FAQ = [
  { q: '¿Cuánto cuesta contratar personal de sala para un evento?', a: 'Los camareros para eventos en España cobran entre 12€ y 22€/hora. Para una boda de 100 personas necesitas entre 6 y 8 camareros, lo que supone un coste estimado de 600-1.200€ para un turno de 6-8 horas. Las hostesses cuestan entre 15-22€/h y los bármanes entre 15-25€/h.' },
  { q: '¿Cuántos camareros necesito para mi evento?', a: 'La regla estándar: 1 camarero por cada 15 invitados en un servicio de mesa. En cócteles de pie, 1 por cada 20-25. En barras libres, 1 bartender por cada 50. Para una boda de 100 invitados con servicio de mesa: 6-7 camareros mínimo.' },
  { q: '¿Qué diferencia hay entre camarero, barman y hostess?', a: 'El camarero de sala gestiona mesas y sirve los platos y bebidas. El barman trabaja exclusivamente en la barra preparando cócteles y combinados. La hostess gestiona acceso, lista de invitados y zonas VIP. Son perfiles complementarios, no intercambiables.' },
  { q: '¿Puedo contratar personal de sala para una sola noche?', a: 'Sí. XPEAK permite contrataciones puntuales de una sola noche. El Flash Booking notifica al instante a los profesionales disponibles en tu ciudad, ideal para sustituciones de última hora o refuerzos de temporada.' },
];

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Staff para eventos en España: camareros, hostesses y personal profesional (2026)', description: 'Guía completa sobre contratación de personal para eventos en España. Precios, ratios y diferencias entre camareros, azafatas, bármanes y promotores.', datePublished: '2026-05-27', dateModified: '2026-05-27', author: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/staff-para-eventos' };
const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Staff para eventos', item: 'https://xpeak.es/blog/staff-para-eventos' }] };

const TAG_COLOR: Record<string, string> = { Camareros: '#60a5fa', Discoteca: '#34d399', Azafatas: '#f472b6', Barman: '#fbbf24', Promotores: '#a78bfa', Animadores: '#D4AF37', Imagen: '#f472b6', Guía: '#D4AF37' };

export default function HubStaff() {
  return (
    <>
      <Helmet>
        <title>Staff para eventos España: camareros y personal 2026 | XPEAK</title>
        <meta name="description" content="Guía completa sobre contratación de staff para eventos en España. Precios de camareros, azafatas, bármanes, promotores y animadores. Ratios reales 2026." />
        <link rel="canonical" href="https://xpeak.es/blog/staff-para-eventos" />
        <meta property="og:title" content="Staff para eventos España: guía completa 2026 — XPEAK" />
        <meta property="og:description" content="Camareros, azafatas, bármanes y promotores para eventos. Precios y ratios reales en España." />
        <meta property="og:url" content="https://xpeak.es/blog/staff-para-eventos" />
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
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>Staff · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Staff para eventos en España: camareros, hostesses y personal profesional (2026)</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#3d3d4e' }}>Guía completa sobre contratación de personal para eventos. Precios reales, ratios por número de invitados y diferencias entre cada perfil profesional.</p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>27 mayo 2026</time>
          </div>

          <div className="space-y-10">
            <section>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.72)' }}>
                El personal de sala es una de las partidas más infravaloradas en la organización de eventos. Un camarero mal elegido o un ratio insuficiente puede arruinar la experiencia de tus invitados aunque todo lo demás sea perfecto. Esta guía cubre todos los perfiles, sus precios reales y cuántos necesitas según el tipo y tamaño de tu evento.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">Guías por perfil de personal</h2>
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
              <h2 className="text-lg font-black mb-4">Tarifas por perfil (España 2026)</h2>
              <div className="space-y-2">
                {[
                  { perfil: 'Camarero de sala', tarifa: '12–18€/h · 50–90€/noche' },
                  { perfil: 'Hostess / Azafata', tarifa: '15–22€/h · 40–80€/noche' },
                  { perfil: 'Barman / Coctelero', tarifa: '15–25€/h · 60–120€/noche' },
                  { perfil: 'Coordinador de sala', tarifa: '20–35€/h · 80–150€/noche' },
                  { perfil: 'Animador infantil', tarifa: '150–350€ el evento (3-4h)' },
                  { perfil: 'Relaciones Públicas (RRPP)', tarifa: '80–300€/noche + % taquilla' },
                ].map((row, i) => (
                  <div key={row.perfil} className="flex items-center justify-between p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <p className="text-xs font-medium">{row.perfil}</p>
                    <span className="text-xs font-bold ml-4 shrink-0" style={{ color: '#D4AF37' }}>{row.tarifa}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Precios orientativos España 2026. Sin IVA. Variable según ciudad y experiencia.</p>
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
              <p className="text-sm font-black mb-2">¿Necesitas personal para tu evento?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>XPEAK tiene camareros, hostesses, bármanes y promotores verificados en toda España. Flash Booking en menos de 1h. Gratis para organizadores.</p>
              <a href="/contratar-staff" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Ver staff disponible en XPEAK →</a>
            </div>
          </div>
        </main>
        <FooterPublic />
      </div>
    </>
  );
}
