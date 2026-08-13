import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';
import DJResourcesAffiliate from '@/components/DJResourcesAffiliate';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'DJ residente de discoteca: precio, funciones y cómo contratarlo en España (2026)', description: 'Qué hace un DJ residente, cuánto cobra y cómo diferenciarlo de un DJ invitado. Precios por ciudad y tipo de sala en España 2026.', datePublished: '2026-05-07',
  dateModified: '2026-05-25', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/dj-residente-discoteca-precio' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cobra un DJ residente de discoteca?', acceptedAnswer: { '@type': 'Answer', text: 'En España, un DJ residente en sala pequeña o mediana cobra entre 200€ y 600€ por noche. En salas de referencia de grandes ciudades (Madrid, Barcelona, Ibiza), el rango es 600€–2.000€. Los cachés mensuales para residencias largas oscilan entre 1.500€ y 8.000€/mes dependiendo del nivel del artista y la sala.' } },
  { '@type': 'Question', name: '¿Qué diferencia hay entre DJ residente y DJ invitado?', acceptedAnswer: { '@type': 'Answer', text: 'El DJ residente toca regularmente en la misma sala (semanalmente o en fechas fijas) y se convierte en imagen del club. El DJ invitado actúa puntualmente, normalmente como acto principal o en sesiones especiales. Los invitados suelen cobrar entre 2x y 10x más que el residente de la misma sala.' } },
  { '@type': 'Question', name: '¿Cuántas horas toca un DJ residente?', acceptedAnswer: { '@type': 'Answer', text: 'Normalmente entre 3 y 5 horas por noche. En salas con varios DJs, el residente suele tocar en los horarios de apertura (warm-up) o cierre (closing). Si hay un headliner invitado, el residente toca antes y después del headliner.' } },
  { '@type': 'Question', name: '¿Cómo contratar un DJ residente para mi discoteca?', acceptedAnswer: { '@type': 'Answer', text: 'Puedes contactar directamente con DJs locales de tu ciudad a través de plataformas especializadas como XPEAK. Antes de confirmar, escucha al menos 2-3 mixes del artista, comprueba que su estilo encaja con tu sala, y acuerda por escrito: fechas, cachés, equipo incluido y cláusula de exclusividad.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'DJ residente discoteca precio', item: 'https://xpeak.es/blog/dj-residente-discoteca-precio' }] };

const PRECIOS_CIUDAD = [
  { ciudad: 'Madrid', sala_pequeña: '200–400€', sala_mediana: '400–800€', sala_grande: '800–2.500€' },
  { ciudad: 'Barcelona', sala_pequeña: '250–450€', sala_mediana: '450–900€', sala_grande: '900–3.000€' },
  { ciudad: 'Ibiza (temporada)', sala_pequeña: '400–700€', sala_mediana: '700–2.000€', sala_grande: '2.000–10.000€' },
  { ciudad: 'Sevilla', sala_pequeña: '150–300€', sala_mediana: '300–600€', sala_grande: '600–1.500€' },
  { ciudad: 'Valencia', sala_pequeña: '150–350€', sala_mediana: '350–700€', sala_grande: '700–2.000€' },
  { ciudad: 'Resto España', sala_pequeña: '120–250€', sala_mediana: '250–500€', sala_grande: '500–1.200€' },
];

export default function BlogDJResidenteDiscoteca() {
  return (
    <>
      <Helmet>
        <title>DJ residente discoteca: precio y funciones 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cobra un DJ residente en España. Precios por ciudad y tipo de sala, diferencias con DJ invitado y cómo contratar el residente perfecto para tu club." />
        <link rel="canonical" href="https://xpeak.es/blog/dj-residente-discoteca-precio" />
        <meta property="og:title" content="DJ residente discoteca: precio 2026 — XPEAK Blog" />
        <meta property="og:description" content="Precios de DJ residente en discotecas de España. Por ciudad, tipo de sala y nivel de artista." />
        <meta property="og:url" content="https://xpeak.es/blog/dj-residente-discoteca-precio" />
        <meta property="og:type" content="article" /><meta property="og:image" content="https://xpeak.es/og-image.jpg" /><meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" /><meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>
      <div className="min-h-screen" style={{ background: '#090909', color: '#fff' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-3xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#D4AF37' }}>XPEAK</a>
          <div className="flex items-center gap-3"><a href="/blog" className="text-xs font-bold" style={{ color: '#3d3d4e' }}>Blog</a><a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Unirse gratis</a></div>
        </nav>
        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>DJ · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">DJ residente de discoteca: precio, funciones y cómo contratarlo en España (2026)</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#3d3d4e' }}>El DJ residente es el corazón sonoro de una sala. Ni es un headliner de festival ni un DJ de boda — es un artista que conoce tu público como nadie. Esta guía te explica qué buscar y cuánto pagar.</p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>7 mayo 2026</time>
          </div>
          <div className="space-y-10">

            <section>
              <h2 className="text-lg font-black mb-4">Precios de DJ residente por ciudad y tamaño de sala</h2>
              <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <table className="w-full text-xs">
                  <thead><tr style={{ background: 'rgba(212,175,55,0.08)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}><th className="text-left px-4 py-3 font-bold">Ciudad</th><th className="px-4 py-3 font-bold text-center">Sala pequeña</th><th className="px-4 py-3 font-bold text-center">Sala mediana</th><th className="px-4 py-3 font-bold text-center hidden sm:table-cell">Sala grande / referencia</th></tr></thead>
                  <tbody>{PRECIOS_CIUDAD.map((row, i) => (<tr key={row.ciudad} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="px-4 py-3 font-bold">{row.ciudad}</td><td className="px-4 py-3 text-center" style={{ color: '#3d3d4e' }}>{row.sala_pequeña}</td><td className="px-4 py-3 text-center font-bold" style={{ color: '#D4AF37' }}>{row.sala_mediana}</td><td className="px-4 py-3 text-center hidden sm:table-cell" style={{ color: '#D4AF37' }}>{row.sala_grande}</td></tr>))}</tbody>
                </table>
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Precios por noche (caché por sesión). Ibiza incluye temporada alta (junio–septiembre).</p>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">Residente vs. invitado: ¿cuál necesita tu sala?</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { tipo: 'DJ Residente', icon: '🏠', color: '#D4AF37', puntos: ['Toca regularmente (semanal o quincenal)', 'Conoce el público y lo fideliza', 'Precio más estable y previsible', 'Se convierte en imagen del club', 'Warm-up y closing habitualmente', 'Caché más bajo que el invitado'], uso: 'Modelo para salas locales y clubes de barrio' },
                  { tipo: 'DJ Invitado', icon: '⭐', color: '#818cf8', puntos: ['Toca en fechas especiales o festivales internos', 'Atrae público nuevo y fans de su estilo', 'Caché entre 2x y 10x más alto', 'Requiere mayor promoción previa', 'No se implica en la identidad de la sala', 'Perfecto para eventos especiales'], uso: 'Necesario para fechas clave, cumpleaños de sala, halloweens, año nuevo' },
                ].map(op => (
                  <div key={op.tipo} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${op.color}22` }}>
                    <p className="text-base font-black mb-3">{op.icon} {op.tipo}</p>
                    <ul className="space-y-1.5 mb-4">{op.puntos.map(p => <li key={p} className="text-xs flex items-start gap-1.5"><span style={{ color: op.color }}>·</span> <span style={{ color: '#3d3d4e' }}>{p}</span></li>)}</ul>
                    <p className="text-xs px-2 py-1.5 rounded-lg" style={{ background: `${op.color}10`, color: op.color, border: `1px solid ${op.color}25` }}>{op.uso}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">Funciones reales del DJ residente</h2>
              <div className="space-y-3">
                {[
                  { titulo: 'Warm-up (apertura)', desc: 'Prepara el ambiente desde las primeras horas. No llena la pista, pero crea la tensión correcta y prepara al público para el headliner o el pico de la noche. Requiere habilidad para leer una sala con poca gente.' },
                  { titulo: 'Set principal', desc: 'En salas sin headliner, el residente dirige la noche completa. Gestiona los picos de energía, adapta el set en tiempo real según la respuesta del público y mantiene el estilo identitario de la sala.' },
                  { titulo: 'Closing (cierre)', desc: 'El arte más subestimado: cerrar una noche bien es tan difícil como abrirla. El residente de closing baja la energía gradualmente o la mantiene alta hasta el último momento según la política de la sala.' },
                  { titulo: 'Identidad sonora', desc: 'A medio plazo, el residente define el sonido del club. Su selección musical construye una comunidad de público fiel que vuelve precisamente por ese estilo. Este valor es intangible pero enorme.' },
                ].map(f => (
                  <div key={f.titulo} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-sm font-bold mb-1" style={{ color: '#D4AF37' }}>{f.titulo}</p>
                    <p className="text-xs leading-relaxed" style={{ color: '#3d3d4e' }}>{f.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">Qué incluir en el contrato con el DJ residente</h2>
              <div className="space-y-2">
                {[
                  'Fechas y horario de cada sesión (inicio y fin exactos del set)',
                  'Caché por sesión y método de pago (transferencia, efectivo, factura)',
                  'Cláusula de exclusividad: ¿puede tocar en otras salas de la misma ciudad?',
                  'Quién aporta el equipo técnico (platos, CDJs, mixer, monitorización)',
                  'Condición de cancelación por parte de la sala y del DJ',
                  'Derechos de imagen: ¿puedes usar fotos y vídeos para redes sociales?',
                  'Duración de la residencia: mínimo de fechas o contrato por temporada',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-[0.6rem] font-black flex-shrink-0 mt-0.5" style={{ background: 'rgba(212,175,55,0.12)', color: '#D4AF37' }}>{i + 1}</span>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>{item}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-3">
                {faqStructured.mainEntity.map(q => (
                  <details key={q.name} className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                    <summary className="flex items-center justify-between px-4 py-3.5 cursor-pointer text-sm font-bold list-none" style={{ background: 'rgba(255,255,255,0.02)' }}>
                      {q.name}
                      <span className="text-xs ml-3 flex-shrink-0" style={{ color: '#D4AF37' }}>+</span>
                    </summary>
                    <div className="px-4 py-3 text-sm leading-relaxed" style={{ color: '#3d3d4e', background: 'rgba(0,0,0,0.2)' }}>
                      {q.acceptedAnswer.text}
                    </div>
                  </details>
                ))}
              </div>
            </section>

            <section className="rounded-2xl p-6 text-center" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)' }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#D4AF37' }}>¿Eres sala o promotor?</p>
              <h3 className="text-xl font-black mb-3">Encuentra tu DJ residente en XPEAK</h3>
              <p className="text-sm mb-5" style={{ color: '#3d3d4e' }}>Directorio de DJs con demos, géneros, tarifas y contacto directo. Flash Booking para urgencias.</p>
              <a href="/contratar-dj" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                Ver DJs disponibles →
              </a>
            </section>

            <section>
              <h2 className="text-base font-black mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>Artículos relacionados</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { href: '/blog/dj-para-eventos', cat: 'Hub DJ', title: 'DJ para eventos: guía completa de precios 2026' },
                  { href: '/blog/cuanto-cobra-un-dj-en-espana', title: '¿Cuánto cobra un DJ en España?' },
                  { href: '/blog/dj-para-bodas-vs-discoteca', title: 'DJ para bodas vs DJ de discoteca' },
                  { href: '/blog/staff-de-discoteca-funciones-y-salario', title: 'Staff de discoteca: funciones y salario' },
                  { href: '/blog/como-organizar-fiesta-empresa', title: 'Cómo organizar una fiesta de empresa' },
                ].map(a => (
                  <a key={a.href} href={a.href} className="p-3 rounded-lg text-sm font-medium transition-all hover:scale-[1.01]" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)' }}>
                    {a.title} →
                  </a>
                ))}
              </div>
            </section>
          </div>
                  <DJResourcesAffiliate />

                  <BlogEmailCapture variant="presupuestos" intent="contratar-dj" articlePath="/blog/dj-residente-discoteca-precio" />
</main>
        <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/dj-residente-discoteca-precio' tag='DJ' />
        <FooterPublic />
        <BlogScrollCTA role="dj" storageKey="xpeak_scrollcta_dj_residente_discoteca" />
      </div>
    </>
  );
}
