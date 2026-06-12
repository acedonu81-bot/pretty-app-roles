import { Helmet } from 'react-helmet-async';
import { Zap, MapPin, Star, TrendingUp } from 'lucide-react';
import FooterPublic from '@/components/FooterPublic';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';

const FORMATOS = [
  { tipo: 'Solista con guitarra o piano', rango: '400€ – 900€', desc: 'Ideal para ceremonias íntimas y cóctel. Repertorio melódico, crea ambiente sin ocupar espacio.' },
  { tipo: 'Dúo (voz + instrumento)', rango: '600€ – 1.200€', desc: 'Mayor presencia sonora que el solista. Perfecto para cócteles de boda y aperitivos.' },
  { tipo: 'Trío / cuarteto de jazz o swing', rango: '900€ – 2.000€', desc: 'Opción premium para bodas con banquete. Muy demandado para estilos gatsby, vintage o elegante.' },
  { tipo: 'Banda pop / rock (5–8 músicos)', rango: '1.500€ – 4.000€', desc: 'Para novios que quieren baile en directo. Toca los grandes éxitos y crea una atmósfera única.' },
  { tipo: 'Cuarteto de cuerda clásico', rango: '800€ – 1.800€', desc: 'Ceremonias religiosas, entradas y salidas nupciales. Repertorio clásico y pop adaptado.' },
  { tipo: 'Grupo flamenco / fusión', rango: '700€ – 2.500€', desc: 'Bodas con identidad española. Muy demandado en Andalucía, Sevilla y Costa del Sol.' },
];

const MOMENTOS = [
  { momento: 'Entrada de invitados y espera', formato: 'Solista, cuarteto de cuerda', nota: 'Tono suave, ambiente elegante antes de la emoción' },
  { momento: 'Entrada de la novia / novios', formato: 'Cuarteto de cuerda, solista', nota: 'Momento cumbre — la canción elegida en directo multiplica la emoción' },
  { momento: 'Firma y momentos solemnes', formato: 'Cuarteto de cuerda, solo piano', nota: 'Pausa musical suave mientras se firma' },
  { momento: 'Salida de la ceremonia', formato: 'Banda pop, dúo festivo', nota: 'Energía alta, aplausos, transición a celebración' },
  { momento: 'Cóctel y aperitivo', formato: 'Jazz trio, dúo, solista', nota: 'Lo más popular para música en vivo — todos circulan y la banda anima de fondo' },
  { momento: 'Baile y pista', formato: 'Banda pop / rock, DJ tras la banda', nota: 'Si el presupuesto permite solo un momento en directo, que sea este' },
];

const CIUDADES = [
  { ciudad: 'Madrid', rango: '800€ – 3.500€', note: 'Mayor oferta de grupos profesionales, todas las formaciones disponibles' },
  { ciudad: 'Barcelona', rango: '900€ – 4.000€', note: 'Alta demanda en bodas internacionales, grupos con repertorio en inglés' },
  { ciudad: 'Sevilla / Andalucía', rango: '600€ – 2.500€', note: 'Fuerte tradición flamenca, grupos de fusión muy populares' },
  { ciudad: 'Valencia', rango: '700€ – 2.800€', note: 'Mercado creciente, buena oferta de jazz y pop' },
  { ciudad: 'Ibiza / Baleares', rango: '1.000€ – 4.500€', note: 'Temporada alta inflaciona precios junio–septiembre, mucha demanda internacional' },
  { ciudad: 'Bilbao / País Vasco', rango: '700€ – 2.200€', note: 'Bodas de alto presupuesto, grupos folk y jazz muy activos' },
];

const FAQ = [
  { q: '¿Merece la pena contratar música en vivo para una boda?', a: 'Sí, si el presupuesto lo permite. La música en vivo crea momentos únicos e irrepetibles que los invitados recuerdan durante años. El cóctel con trío de jazz o el cuarteto de cuerda en la ceremonia son los momentos con mejor relación impacto-precio. No es necesario tener música en vivo durante todo el evento.' },
  { q: '¿Se puede combinar música en vivo con DJ?', a: 'Es la fórmula más habitual y económica. La banda toca durante el cóctel (1,5h) y parte del banquete, y el DJ cubre el resto de la noche. Así tienes lo mejor de los dos mundos sin el coste de una banda de 6 horas completas.' },
  { q: '¿Qué formato de música en vivo es más económico para una boda?', a: 'El solista con guitarra o piano es la opción más económica (desde 400€) y perfecta para ceremonias íntimas o cócteles. Un dúo (desde 600€) añade más presencia sin disparar el presupuesto. El cuarteto de cuerda (desde 800€) es ideal si buscas elegancia clásica.' },
  { q: '¿Con cuánta antelación hay que contratar músicos para una boda?', a: 'Para bodas de verano (junio–septiembre), lo ideal es contratar con 8–12 meses de antelación. Los buenos grupos se reservan muy pronto para temporada alta. Fuera de temporada alta, 3–6 meses suelen ser suficientes.' },
  { q: '¿Los músicos llevan su propio equipo de sonido?', a: 'Depende del formato. Los solistas y dúos suelen llevar su propio sistema de amplificación. Las bandas de más de 4 músicos pueden requerir técnico de sonido externo y rider técnico. Compruébalo siempre antes de firmar el contrato.' },
];

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Música en Vivo para Bodas: grupos, solistas y cuartetos — guía y precios 2026',
  description: 'Guía completa de música en vivo para bodas en España. Formatos, precios por ciudad, cuándo ponerla y cómo combinarla con DJ.',
  author: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
  publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
  datePublished: '2026-05-16',
  dateModified: '2026-05-16',
  url: 'https://xpeak.es/blog/musica-en-vivo-para-bodas',
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://xpeak.es/blog/musica-en-vivo-para-bodas' },
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'Música en Vivo para Bodas: grupos, solistas y cuartetos 2026', item: 'https://xpeak.es/blog/musica-en-vivo-para-bodas' },
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

export default function BlogMusicaEnVivoBodas() {
  return (
    <>
      <Helmet>
        <title>Música en vivo para bodas: precios 2026 | XPEAK</title>
        <meta name="description" content="Guía completa de música en vivo para bodas en España 2026. Precios por formato (solista, trío jazz, banda pop, cuarteto de cuerda), cuándo ponerla y cómo combinarla con DJ." />
        <meta name="keywords" content="música en vivo boda precio, grupo musical boda España, cuarteto de cuerda boda, banda boda precio, solista boda, trío jazz boda" />
        <link rel="canonical" href="https://xpeak.es/blog/musica-en-vivo-para-bodas" />
        <meta property="og:title" content="Música en Vivo para Bodas: grupos, solistas y cuartetos 2026" />
        <meta property="og:description" content="Precios y formatos de música en vivo para bodas en España. Solistas, tríos, bandas y cuartetos de cuerda." />
        <meta property="og:url" content="https://xpeak.es/blog/musica-en-vivo-para-bodas" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Música en Vivo para Bodas: grupos, solistas y cuartetos 2026" />
        <meta name="twitter:description" content="Precios y formatos de música en vivo para bodas en España." />
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

        <a href="/blog" className="block px-4 sm:px-6 pb-2 max-w-3xl mx-auto text-xs" style={{ color: '#8E8EA0' }}>← Todos los artículos</a>
        <article className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-20 sm:pb-24">

          <p className="text-xs mb-6 font-bold" style={{ color: 'rgba(255,255,255,0.3)' }}>
            <a href="/" className="hover:text-white transition-colors">XPEAK</a>
            {' '}›{' '}
            <a href="/blog" className="hover:text-white transition-colors">Blog</a>
            {' '}›{' '}
            <span>Música en vivo para bodas</span>
          </p>

          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={14} style={{ color: '#D4AF37' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#D4AF37' }}>Blog · Guía de bodas</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-4 leading-tight">
            Música en Vivo para Bodas: grupos, solistas y cuartetos — guía y precios 2026
          </h1>
          <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.35)' }}>
            XPEAK · 16 de mayo de 2026 · 7 min de lectura
          </p>

          <p className="text-base leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.7)' }}>
            La música en vivo es el elemento que más recuerdan los invitados de una boda. El cuarteto de cuerda en la ceremonia, el trío de jazz durante el cóctel o la banda que arranca el baile son momentos que no se olvidan. Pero elegir el formato correcto —y pagarlo sin arruinar el presupuesto— requiere saber exactamente qué opciones existen y cuánto cuesta cada una en España.
          </p>

          <div className="p-4 rounded-xl mb-8" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}>
            <p className="text-sm font-bold mb-1" style={{ color: '#D4AF37' }}>Resumen rápido</p>
            <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
              La música en vivo para bodas cuesta entre <strong style={{ color: '#fff' }}>400€ (solista) y 4.000€ (banda completa)</strong> en España.
              La opción con mejor relación impacto-precio es el <strong style={{ color: '#fff' }}>trío de jazz para el cóctel (900–1.500€)</strong>.
              Lo más habitual es combinar música en vivo en el cóctel con DJ para la noche.
            </p>
          </div>

          <h2 className="text-xl font-black mb-4">Formatos de música en vivo para bodas y precios</h2>
          <p className="text-sm mb-5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>
            No todos los grupos de música en vivo cuestan lo mismo ni sirven para el mismo momento. Aquí los formatos más habituales con precios reales del mercado español 2026:
          </p>
          <div className="space-y-3 mb-10">
            {FORMATOS.map(f => (
              <div key={f.tipo} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex items-start justify-between gap-4 mb-1.5">
                  <p className="text-sm font-bold">{f.tipo}</p>
                  <span className="text-sm font-black flex-shrink-0" style={{ color: '#D4AF37' }}>{f.rango}</span>
                </div>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{f.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-black mb-4">¿En qué momento de la boda poner música en vivo?</h2>
          <p className="text-sm mb-5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>
            No es necesario tener música en vivo durante toda la boda. Elegir el momento correcto maximiza el impacto y permite ajustar el presupuesto:
          </p>
          <div className="overflow-x-auto mb-10 rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <table className="w-full text-xs min-w-[540px]">
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                  {['Momento', 'Formato ideal', 'Nota'].map(h => (
                    <th key={h} className="px-3 sm:px-4 py-3 text-left font-bold uppercase tracking-wider whitespace-nowrap"
                      style={{ color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOMENTOS.map((row, i) => (
                  <tr key={row.momento} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                    <td className="px-3 sm:px-4 py-3 font-bold text-xs" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.momento}</td>
                    <td className="px-3 sm:px-4 py-3 text-xs" style={{ color: '#D4AF37', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.formato}</td>
                    <td className="px-3 sm:px-4 py-3 text-xs" style={{ color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.nota}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-black mb-4">Precio de música en vivo para bodas por ciudad</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
            {CIUDADES.map(c => (
              <div key={c.ciudad} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <MapPin size={12} style={{ color: '#D4AF37' }} />
                  <span className="text-sm font-black">{c.ciudad}</span>
                  <span className="ml-auto text-sm font-bold" style={{ color: '#D4AF37' }}>{c.rango}</span>
                </div>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{c.note}</p>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-black mb-4">¿Música en vivo o DJ? La fórmula que mejor funciona</h2>
          <p className="text-sm mb-5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>
            La pregunta clásica tiene respuesta práctica: <strong style={{ color: '#fff' }}>no es una versus la otra</strong>. La fórmula que más repiten las parejas con presupuesto medio-alto:
          </p>
          <ol className="space-y-3 mb-10">
            {[
              { n: '01', text: 'Cuarteto de cuerda o solista en la ceremonia (1–1,5h). Máximo impacto emocional, menor coste porque el formato es pequeño.' },
              { n: '02', text: 'Trío de jazz o dúo durante el cóctel (1,5h). El momento donde los invitados más agradecen la música en vivo — están de pie, circulando y el grupo crea ambiente sin competir con conversaciones.' },
              { n: '03', text: 'DJ para el banquete y pista de baile (4–6h). Más versatilidad musical, sin pausas entre temas y con la energía que una banda de boda no puede mantener 6 horas seguidas.' },
            ].map(item => (
              <li key={item.n} className="flex gap-3">
                <span className="text-2xl font-black flex-shrink-0" style={{ color: 'rgba(212,175,55,0.2)', lineHeight: '1.1' }}>{item.n}</span>
                <p className="text-sm leading-relaxed pt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>{item.text}</p>
              </li>
            ))}
          </ol>

          <div className="p-4 rounded-xl mb-10" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-xs font-bold mb-2" style={{ color: '#D4AF37' }}>Lo que debes comprobar antes de contratar</p>
            <ul className="space-y-2">
              {[
                'Que el grupo tiene rider técnico y tú sabes si el espacio lo puede asumir.',
                'Que incluyen reunión previa para coordinar repertorio con tus gustos.',
                'Que el contrato especifica número de músicos, horas exactas y política de cancelación.',
                'Si cobran desplazamiento fuera de su ciudad (habitual en grupos de más de 3 músicos).',
              ].map(item => (
                <li key={item} className="flex gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  <Star size={11} className="flex-shrink-0 mt-0.5" style={{ color: '#D4AF37' }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <h2 className="text-xl font-black mb-5">Preguntas frecuentes sobre música en vivo en bodas</h2>
          <div className="space-y-4 mb-12">
            {FAQ.map(faq => (
              <div key={faq.q} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-sm font-bold mb-2">{faq.q}</p>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{faq.a}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl p-8 text-center" style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)' }}>
            <h2 className="text-xl font-black mb-2">¿Buscas músicos para tu boda?</h2>
            <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Encuentra grupos, solistas y cuartetos verificados con portfolio real y tarifas públicas en XPEAK.
            </p>
            <a href="/auth"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-black text-sm transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              <Zap size={14} /> Ver músicos en XPEAK — gratis
            </a>
          </div>

          <div className="mt-12">
            <h2 className="text-lg font-black mb-5" style={{ color: 'rgba(255,255,255,0.85)' }}>Artículos relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { href: '/blog/profesionales-bodas', tag: 'Hub Bodas', title: 'Profesionales para bodas: guía completa 2026', desc: 'DJ, fotógrafo, catering y más. Todo lo que necesitas para tu boda.' },
                { href: '/blog/maestro-de-ceremonias-boda-precio-guia', tag: 'Bodas', title: 'Maestro de ceremonias: precio y guía 2026', desc: 'Qué hace un MC, cuánto cobra y cómo elegirlo para tu boda.' },
                { href: '/blog/cuanto-cobra-un-dj-en-espana', tag: 'DJ', title: '¿Cuánto cobra un DJ en España? Tarifas 2026', desc: 'Precio real de un DJ para boda, festival o evento corporativo.' },
                { href: '/blog/cuanto-cuesta-una-boda-en-espana', tag: 'Bodas', title: '¿Cuánto cuesta una boda en España en 2026?', desc: 'Presupuesto completo por partida: catering, música, fotos y más.' },
              ].map(p => (
                <a key={p.href} href={p.href}
                  className="block p-5 rounded-2xl transition-all hover:scale-[1.02]"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <span className="inline-block text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded mb-2"
                    style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.18)' }}>{p.tag}</span>
                  <p className="text-sm font-black leading-snug mb-1">{p.title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{p.desc}</p>
                </a>
              ))}
            </div>
          </div>
          <BlogAuthor />
          <BlogShare />
        </article>
          <BlogEmailCapture variant="presupuestos" intent="contratar-dj" articlePath="/blog/musica-en-vivo-para-bodas" />
        <FooterPublic />
      </div>
    </>
  );
}
