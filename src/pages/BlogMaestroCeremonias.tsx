import { Helmet } from 'react-helmet-async';
import { Zap, MapPin, Star, TrendingUp } from 'lucide-react';
import FooterPublic from '@/components/FooterPublic';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';

const TABLE = [
  { perfil: 'Maestro de ceremonias junior', experiencia: '< 2 años', rango: '300€ – 600€', nota: 'Bodas pequeñas, eventos locales' },
  { perfil: 'MC profesional', experiencia: '2–5 años', rango: '600€ – 1.200€', nota: 'Bodas civiles, eventos de empresa' },
  { perfil: 'MC senior / presentador', experiencia: '5–10 años', rango: '1.200€ – 2.500€', nota: 'Bodas grandes, galas, festivales' },
  { perfil: 'Presentador TV / referente', experiencia: '+10 años', rango: '2.500€+', nota: 'Galas nacionales, marca personal reconocida' },
];

const CIUDADES = [
  { ciudad: 'Madrid', rango: '700€ – 2.000€', note: 'Mayor oferta y competencia, mercado de referencia' },
  { ciudad: 'Barcelona', rango: '800€ – 2.200€', note: 'Alta demanda en bodas de destino y eventos internacionales' },
  { ciudad: 'Valencia', rango: '500€ – 1.500€', note: 'Mercado creciente, precios algo más competitivos' },
  { ciudad: 'Sevilla', rango: '400€ – 1.200€', note: 'Fuerte tradición nupcial, muchas bodas religiosas y civiles' },
  { ciudad: 'Bilbao', rango: '500€ – 1.400€', note: 'Menos oferta, pero bodas de alto presupuesto' },
  { ciudad: 'Málaga / Costa del Sol', rango: '600€ – 1.800€', note: 'Temporada alta junio–septiembre, bodas de destino' },
];

const FUNCIONES = [
  { titulo: 'Recepción de invitados', desc: 'Da la bienvenida y crea ambiente desde el primer momento, guiando a los invitados a sus lugares.' },
  { titulo: 'Conducción de la ceremonia', desc: 'Presenta los momentos clave (votos, anillos, lecturas), mantiene el ritmo emocional y cubre los silencios.' },
  { titulo: 'Presentación del cóctel', desc: 'Anuncia los entrantes, anima la espera y presenta a los novios en su primera aparición formal.' },
  { titulo: 'Dinámica del banquete', desc: 'Introduce brindis, discursos y sorpresas. Coordina tiempos con cocina y servicios.' },
  { titulo: 'Animación y juegos', desc: 'Propone dinámicas para romper el hielo entre grupos que no se conocen. Opcional según el tono de la boda.' },
  { titulo: 'Coordinación con el DJ', desc: 'Sincroniza entradas, canciones especiales y transiciones musicales con el técnico de sonido.' },
];

const FAQ = [
  { q: '¿Es obligatorio contratar un maestro de ceremonias para una boda?', a: 'No es obligatorio, pero sí muy recomendable para bodas de más de 80 invitados o bodas civiles sin guión oficial. Sin MC, los tiempos se dilatan y los invitados pierden el hilo del evento. Un MC profesional ahorra al menos 30–45 minutos de retrasos acumulados.' },
  { q: '¿Qué diferencia hay entre MC, presentador y animador?', a: 'El MC (maestro de ceremonias) conduce todo el evento con guión y coordinación logística. El presentador se centra en los momentos formales (entradas, discursos). El animador propone juegos y dinámicas de entretenimiento. Muchos profesionales combinan los tres perfiles.' },
  { q: '¿Cuánto tiempo antes hay que contratar al MC?', a: 'Lo ideal es cerrarlo con 6–9 meses de antelación para bodas de verano, que es la temporada alta. En fechas de septiembre a mayo puedes encontrar disponibilidad con 2–3 meses de margen.' },
  { q: '¿El MC trabaja con el DJ o son servicios separados?', a: 'Son servicios separados, pero deben coordinarse. Un buen MC tiene reunión previa con el DJ para sincronizar entradas, canciones especiales y timing del banquete. En XPEAK puedes contratar ambos perfiles y compartir el briefing de evento entre ellos.' },
  { q: '¿Cuántas horas incluye el servicio de maestro de ceremonias?', a: 'Lo habitual son 6–8 horas: desde la recepción de invitados hasta el inicio del baile libre. Algunos MC cobran por horas adicionales si el evento se alarga.' },
];

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Maestro de Ceremonias para Bodas: precio y guía completa 2026',
  description: 'Cuánto cuesta un maestro de ceremonias para una boda en España. Precios por experiencia y ciudad, funciones, diferencias con animador y cómo contratar.',
  author: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
  publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
  datePublished: '2026-05-16',
  dateModified: '2026-05-16',
  url: 'https://xpeak.es/blog/maestro-de-ceremonias-boda-precio-guia',
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://xpeak.es/blog/maestro-de-ceremonias-boda-precio-guia' },
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'Maestro de Ceremonias para Bodas: precio y guía 2026', item: 'https://xpeak.es/blog/maestro-de-ceremonias-boda-precio-guia' },
  ],
};

const faqStructured = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map(f => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export default function BlogMaestroCeremonias() {
  return (
    <>
      <Helmet>
        <title>Maestro de ceremonias: precio y guía 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cuesta un maestro de ceremonias para una boda en España 2026. Precios reales por experiencia y ciudad, funciones, diferencias con animador y cómo contratar." />
        <meta name="keywords" content="maestro de ceremonias boda precio, cuánto cuesta MC boda España, presentador bodas, contratar maestro ceremonias, MC boda civil" />
        <link rel="canonical" href="https://xpeak.es/blog/maestro-de-ceremonias-boda-precio-guia" />
        <meta property="og:title" content="Maestro de Ceremonias para Bodas: precio y guía 2026" />
        <meta property="og:description" content="Precios reales de MC para bodas en España. Qué hace, cuánto cobra y cómo elegirlo." />
        <meta property="og:url" content="https://xpeak.es/blog/maestro-de-ceremonias-boda-precio-guia" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Maestro de Ceremonias para Bodas: precio y guía 2026" />
        <meta name="twitter:description" content="Precios reales de MC para bodas en España. Qué hace, cuánto cobra y cómo elegirlo." />
        <meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>

      <div className="min-h-screen" style={{ background: '#090909', color: '#fff' }}>

        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-3xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#D4AF37' }}>XPEAK</a>
          <a href="/auth"
            className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105"
            style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
            Unirse gratis
          </a>
        </nav>

        <a href="/blog" className="block px-4 sm:px-6 pb-2 max-w-3xl mx-auto text-xs" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>
        <article className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-20 sm:pb-24">

          <p className="text-xs mb-6 font-bold" style={{ color: 'rgba(255,255,255,0.3)' }}>
            <a href="/" className="hover:text-white transition-colors">XPEAK</a>
            {' '}›{' '}
            <a href="/blog" className="hover:text-white transition-colors">Blog</a>
            {' '}›{' '}
            <span>Maestro de ceremonias</span>
          </p>

          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={14} style={{ color: '#D4AF37' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#D4AF37' }}>Blog · Guía de precios</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-4 leading-tight">
            Maestro de Ceremonias para Bodas: precio y guía completa 2026
          </h1>
          <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.35)' }}>
            XPEAK · 16 de mayo de 2026 · 6 min de lectura
          </p>

          <p className="text-base leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.7)' }}>
            El <strong style={{ color: '#fff' }}>maestro de ceremonias</strong> es uno de los profesionales más decisivos de una boda y, paradójicamente, uno de los menos visibles en el presupuesto inicial. Su trabajo determina si el evento fluye sin pausas incómodas o si los invitados se pierden entre un momento y el siguiente. Esta guía explica qué hace, cuánto cuesta y cómo elegir el MC correcto para tu boda en España.
          </p>

          <div className="p-4 rounded-xl mb-8" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}>
            <p className="text-sm font-bold mb-1" style={{ color: '#D4AF37' }}>Resumen rápido</p>
            <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Un maestro de ceremonias para bodas en España cuesta entre <strong style={{ color: '#fff' }}>600€ y 1.500€</strong> de media por evento completo (6–8 horas).
              El precio depende de la experiencia, la ciudad y si incluye reuniones de coordinación previas.
              Las bodas de más de 100 invitados casi siempre necesitan MC profesional para mantener el ritmo del evento.
            </p>
          </div>

          <h2 className="text-xl font-black mb-4">¿Qué hace exactamente un maestro de ceremonias?</h2>
          <p className="text-sm mb-5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>
            El MC no es un animador que hace juegos —aunque puede hacerlos. Su función principal es <strong style={{ color: '#fff' }}>conducir el guión del evento</strong> de principio a fin, coordinándose con todos los proveedores (DJ, catering, fotógrafo) para que cada momento ocurra en el momento correcto:
          </p>
          <div className="space-y-3 mb-10">
            {FUNCIONES.map(f => (
              <div key={f.titulo} className="flex gap-3 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <Star size={13} className="flex-shrink-0 mt-0.5" style={{ color: '#D4AF37' }} />
                <div>
                  <p className="text-xs font-bold mb-0.5">{f.titulo}</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-black mb-4">Precio del maestro de ceremonias por experiencia</h2>
          <p className="text-sm mb-5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>
            La experiencia es el factor que más influye en el precio. Un MC que lleva 10 años conduciendo bodas de 200 personas tiene un dominio del timing y la improvisación que no se aprende en un año:
          </p>
          <div className="overflow-x-auto mb-10 rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <table className="w-full text-xs min-w-[520px]">
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                  {['Perfil', 'Experiencia', 'Precio por evento', 'Típico en'].map(h => (
                    <th key={h} className="px-2 sm:px-4 py-3 text-left font-bold uppercase tracking-wider whitespace-nowrap"
                      style={{ color: 'rgba(255,255,255,0.6)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TABLE.map((row, i) => (
                  <tr key={row.perfil} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                    <td className="px-2 sm:px-4 py-3 font-bold" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.perfil}</td>
                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.experiencia}</td>
                    <td className="px-2 sm:px-4 py-3 font-black whitespace-nowrap" style={{ color: '#D4AF37', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.rango}</td>
                    <td className="px-2 sm:px-4 py-3" style={{ color: 'rgba(255,255,255,0.6)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.nota}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-black mb-4">Precio del MC por ciudad en España</h2>
          <p className="text-sm mb-5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>
            La geografía también afecta al precio, especialmente porque muchos MC de referencia cobran desplazamiento cuando trabajan fuera de su ciudad:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
            {CIUDADES.map(c => (
              <div key={c.ciudad} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <MapPin size={12} style={{ color: '#D4AF37' }} />
                  <span className="text-sm font-black">{c.ciudad}</span>
                  <span className="ml-auto text-sm font-bold" style={{ color: '#D4AF37' }}>{c.rango}</span>
                </div>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>{c.note}</p>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-black mb-4">¿MC o animador? Diferencias clave</h2>
          <p className="text-sm mb-5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>
            Es una confusión habitual. Aquí la diferencia real:
          </p>
          <div className="overflow-x-auto mb-10 rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <table className="w-full text-xs min-w-[400px]">
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                  {['Característica', 'Maestro de Ceremonias', 'Animador'].map(h => (
                    <th key={h} className="px-3 sm:px-4 py-3 text-left font-bold uppercase tracking-wider"
                      style={{ color: 'rgba(255,255,255,0.6)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Función principal', 'Conduce el guión del evento', 'Entretiene con juegos y dinámicas'],
                  ['Tono', 'Elegante, formal o íntimo según la boda', 'Festivo, energético'],
                  ['Coordinación', 'Con todos los proveedores', 'Principalmente con el DJ'],
                  ['Guión', 'Personalizado y detallado', 'Estándar con variaciones'],
                  ['Precio medio', '600€ – 1.500€', '300€ – 800€'],
                ].map(([car, mc, anim], i) => (
                  <tr key={car} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                    <td className="px-3 sm:px-4 py-3 font-bold text-xs" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)' }}>{car}</td>
                    <td className="px-3 sm:px-4 py-3 text-xs" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#D4AF37' }}>{mc}</td>
                    <td className="px-3 sm:px-4 py-3 text-xs" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)' }}>{anim}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-black mb-4">Cómo elegir el MC correcto para tu boda</h2>
          <ol className="space-y-3 mb-10">
            {[
              { n: '01', text: 'Pide ver vídeos de bodas anteriores. Un MC debe tener pruebas de su trabajo real, no solo fotos de estudio. Fíjate en cómo habla en los momentos más delicados (votos, brindis).' },
              { n: '02', text: 'Comprueba que hace reunión de coordinación previa. Un MC profesional necesita al menos una videollamada y una visita o llamada con el espacio para conocer la acústica y los tiempos.' },
              { n: '03', text: 'Verifica que se coordina con tu DJ. La sincronía entre MC y DJ es lo que define si el banquete fluye o se convierte en un caos de señales perdidas.' },
            ].map(item => (
              <li key={item.n} className="flex gap-3">
                <span className="text-2xl font-black flex-shrink-0" style={{ color: 'rgba(212,175,55,0.2)', lineHeight: '1.1' }}>{item.n}</span>
                <p className="text-sm leading-relaxed pt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>{item.text}</p>
              </li>
            ))}
          </ol>

          <h2 className="text-xl font-black mb-5">Preguntas frecuentes sobre el maestro de ceremonias</h2>
          <div className="space-y-4 mb-12">
            {FAQ.map(faq => (
              <div key={faq.q} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-sm font-bold mb-2">{faq.q}</p>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{faq.a}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl p-8 text-center" style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)' }}>
            <h2 className="text-xl font-black mb-2">¿Buscas maestro de ceremonias para tu boda?</h2>
            <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Encuentra MCs verificados con portfolio real, tarifas públicas y contratos automáticos en XPEAK.
            </p>
            <a href="/auth"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-black text-sm transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              <Zap size={14} /> Ver MCs en XPEAK — gratis
            </a>
          </div>

          <div className="mt-12">
            <h2 className="text-lg font-black mb-5" style={{ color: 'rgba(255,255,255,0.85)' }}>Artículos relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { href: '/blog/profesionales-bodas', tag: 'Hub Bodas', title: 'Profesionales para bodas: guía completa 2026', desc: 'DJ, fotógrafo, catering y más. Todo lo que necesitas para tu boda.' },
                { href: '/blog/musica-en-vivo-para-bodas', tag: 'Bodas', title: 'Música en vivo para bodas — grupos y precios 2026', desc: 'Solistas, bandas, jazz y cuartetos. Cuánto cuesta cada formato.' },
                { href: '/blog/cuanto-cobra-un-dj-en-espana', tag: 'DJ', title: '¿Cuánto cobra un DJ en España? Tarifas 2026', desc: 'Precio real de un DJ para boda, festival o evento corporativo.' },
                { href: '/blog/cuanto-cuesta-una-boda-en-espana', tag: 'Bodas', title: '¿Cuánto cuesta una boda en España en 2026?', desc: 'Presupuesto completo por partida: catering, música, fotos y más.' },
              ].map(p => (
                <a key={p.href} href={p.href}
                  className="block p-5 rounded-2xl transition-all hover:scale-[1.02]"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <span className="inline-block text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded mb-2"
                    style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.18)' }}>{p.tag}</span>
                  <p className="text-sm font-black leading-snug mb-1">{p.title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{p.desc}</p>
                </a>
              ))}
            </div>
          </div>
          <BlogAuthor />
          <BlogShare />
        </article>
          <BlogEmailCapture variant="presupuestos" intent="contratar-staff" articlePath="/blog/maestro-de-ceremonias-boda-precio-guia" />
        <FooterPublic />
      </div>
    </>
  );
}
