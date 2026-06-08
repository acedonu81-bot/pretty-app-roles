import { Helmet } from 'react-helmet-async';
import { Zap, TrendingUp, Star } from 'lucide-react';
import FooterPublic from '@/components/FooterPublic';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogShare from '@/components/BlogShare';

const TABLE = [
  { formato: 'Solista voz (sin banda)', momento: 'Ceremonia / cóctel', rango: '300€ – 700€', notas: 'Piano o backing track de acompañamiento' },
  { formato: 'Dúo voz + guitarra', momento: 'Ceremonia + cóctel', rango: '500€ – 1.000€', incluye: 'Repertorio variado, acústico' },
  { formato: 'Trío jazz / soul', momento: 'Cóctel', rango: '800€ – 1.800€', notas: 'Voz + bajo + guitarra o piano' },
  { formato: 'Cantante pop con banda completa', momento: 'Banquete / pista', rango: '1.500€ – 4.000€', notas: 'Grupo 4–6 músicos, repertorio top40' },
];

const FAQ = [
  { q: '¿Cuánto cuesta un cantante para una boda?', a: 'Depende del formato. Un solista para la ceremonia o cóctel cuesta entre 300€ y 700€. Un cantante pop con banda completa para el banquete puede superar los 2.000€. La mayoría de parejas combina cantante en la ceremonia con DJ para la pista.' },
  { q: '¿Es mejor un cantante o un DJ para la pista de baile?', a: 'Depende del estilo de boda. Una banda en directo aporta energía y exclusividad, pero cuesta entre 3 y 5 veces más que un DJ. La fórmula más habitual en bodas españolas es cantante en ceremonia/cóctel + DJ para la pista de baile.' },
  { q: '¿Los cantantes de bodas aceptan peticiones de canciones?', a: 'Generalmente sí, dentro de su repertorio. La mayoría comparte una lista de canciones disponibles antes del evento y permite elegir hasta 3–5 temas específicos. Canciones fuera del repertorio pueden implicar un coste adicional por ensayo.' },
  { q: '¿Qué equipo necesita un cantante para una boda?', a: 'Un solista necesita micrófono, sistema de PA (altavoces) y monitor de escenario. Algunos lo llevan incluido; otros requieren que el local lo provea. Siempre hay que confirmarlo en el contrato.' },
];

export default function BlogCantanteBodas() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Cantante para bodas: precio y cómo contratar en España (2026)',
    description: 'Cuánto cuesta un cantante para una boda en España. Precios por formato (solista, dúo, trío, banda), momentos del evento y cómo elegir.',
    author: { '@type': 'Organization', name: 'XPEAK' },
    publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
    datePublished: '2026-05-23',
    dateModified: '2026-05-23',
    url: 'https://xpeak.es/blog/cantante-para-bodas-precio',
    mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://xpeak.es/blog/cantante-para-bodas-precio' },
  };
  const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'Cantante para bodas: precio y cómo contratar en España (2026)', item: 'https://xpeak.es/blog/cantante-para-bodas-precio' },
  ],
};

const faqStructured = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  return (
    <>
      <Helmet>
        <title>Cantante para bodas: precio en España 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cuesta un cantante para una boda en España 2026. Precios por formato: solista, dúo acústico, trío jazz o banda completa. Guía con precios reales." />
        <meta name="keywords" content="cantante para bodas precio, contratar cantante boda España, música en vivo boda precio, solista boda precio 2026" />
        <link rel="canonical" href="https://xpeak.es/blog/cantante-para-bodas-precio" />
        <meta property="og:title" content="Cantante para bodas: precio y cómo contratar en España 2026" />
        <meta property="og:description" content="Precios por formato de música en vivo para bodas. Solista, dúo, trío jazz o banda completa." />
        <meta property="og:url" content="https://xpeak.es/blog/cantante-para-bodas-precio" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>

      <div className="min-h-screen" style={{ background: '#090909', color: '#fff' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-3xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#D4AF37' }}>XPEAK</a>
          <a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105"
            style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
            Unirse gratis
          </a>
        </nav>

        <a href="/blog" className="block px-4 sm:px-6 pb-2 max-w-3xl mx-auto text-xs" style={{ color: '#8E8EA0' }}>← Todos los artículos</a>
        <article className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-20 sm:pb-24">

          <p className="text-xs mb-6 font-bold" style={{ color: 'rgba(255,255,255,0.3)' }}>
            <a href="/" className="hover:text-white transition-colors">XPEAK</a> › <a href="/blog" className="hover:text-white transition-colors">Blog</a> › <span>Cantante para bodas</span>
          </p>

          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={14} style={{ color: '#D4AF37' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#D4AF37' }}>Blog · Música para bodas</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-4 leading-tight">
            Cantante para bodas: precio y cómo contratar en España (2026)
          </h1>
          <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.35)' }}>XPEAK · 23 de mayo de 2026 · 5 min de lectura</p>

          <p className="text-base leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.7)' }}>
            La música en vivo es uno de los recuerdos más persistentes de una boda. Un cantante bien elegido puede transformar la ceremonia o el cóctel en algo único. Pero los precios varían enormemente según el formato: desde un solista con piano hasta una banda completa de 6 músicos. Esta guía desglosa los rangos reales del mercado español en 2026.
          </p>

          <div className="p-4 rounded-xl mb-8" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}>
            <p className="text-sm font-bold mb-1" style={{ color: '#D4AF37' }}>Resumen rápido</p>
            <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Un solista para la ceremonia o cóctel cuesta entre <strong style={{ color: '#fff' }}>300€ y 700€</strong>.
              Una banda completa para el banquete puede llegar a <strong style={{ color: '#fff' }}>3.000€ – 4.000€</strong>.
              La fórmula más frecuente: cantante en la ceremonia + DJ en la pista de baile.
            </p>
          </div>

          <h2 className="text-xl font-black mb-4">Precios por formato de música en vivo</h2>
          <div className="overflow-x-auto mb-10 rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <table className="w-full text-xs min-w-[520px]">
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                  {['Formato', 'Momento ideal', 'Precio', 'Notas'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-bold uppercase tracking-wider"
                      style={{ color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TABLE.map((row, i) => (
                  <tr key={row.formato} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                    <td className="px-4 py-3 font-bold" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.formato}</td>
                    <td className="px-4 py-3" style={{ color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.momento}</td>
                    <td className="px-4 py-3 font-black whitespace-nowrap" style={{ color: '#D4AF37', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.rango}</td>
                    <td className="px-4 py-3" style={{ color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.notas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-black mb-4">¿En qué momento de la boda actúa el cantante?</h2>
          <ul className="space-y-3 mb-10">
            {[
              { label: 'Ceremonia civil o religiosa', text: 'El momento más emotivo. Un solista con voz y guitarra o piano es el formato más popular. Suele durar 30–60 minutos (entrada, firma, salida).' },
              { label: 'Cóctel de bienvenida', text: 'Música ambiental mientras los invitados esperan y felicitan a los novios. Duración habitual: 60–90 minutos. Jazz, soul o pop acústico son los géneros más demandados.' },
              { label: 'Banquete y pista de baile', text: 'Para animar la pista se necesita una banda completa o DJ. Un solista puede actuar durante los primeros platos como transición entre el cóctel y el baile.' },
            ].map(item => (
              <li key={item.label} className="flex gap-3">
                <Star size={13} className="flex-shrink-0 mt-0.5" style={{ color: '#D4AF37' }} />
                <div>
                  <span className="text-xs font-bold">{item.label}: </span>
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.72)' }}>{item.text}</span>
                </div>
              </li>
            ))}
          </ul>

          <h2 className="text-xl font-black mb-5">Preguntas frecuentes</h2>
          <div className="space-y-4 mb-12">
            {FAQ.map(faq => (
              <div key={faq.q} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-sm font-bold mb-2">{faq.q}</p>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{faq.a}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl overflow-hidden mb-2" style={{ border: '1px solid rgba(212,175,55,0.2)' }}>
            <div className="p-8" style={{ background: 'linear-gradient(135deg,#0e0e14 0%,#181410 100%)', borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
              <span className="text-[0.65rem] font-black uppercase tracking-widest px-2.5 py-1 rounded-full mb-3 inline-block"
                style={{ background: 'rgba(212,175,55,0.12)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.25)' }}>
                ¿Organizas una boda?
              </span>
              <h2 className="text-xl font-black mb-2 leading-snug">Encuentra cantantes y músicos para tu boda en XPEAK</h2>
              <p className="text-sm mb-5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Directorio de profesionales verificados con tarifas públicas. Filtra por formato, ciudad y disponibilidad.
              </p>
              <a href="/auth"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-black text-sm transition-all hover:scale-105"
                style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                <Zap size={15} /> Ver músicos disponibles
              </a>
            </div>
            <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <div>
                <p className="text-sm font-black mb-0.5">¿Eres cantante o músico?</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Crea tu perfil gratis y empieza a recibir solicitudes de boda</p>
              </div>
              <a href="/auth?mode=register"
                className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs transition-all hover:scale-105"
                style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.25)', whiteSpace: 'nowrap' }}>
                Crear perfil →
              </a>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-lg font-black mb-5" style={{ color: 'rgba(255,255,255,0.85)' }}>Artículos relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { href: '/blog/profesionales-bodas', tag: 'Hub Bodas', title: 'Profesionales para bodas: guía completa 2026', desc: 'DJ, fotógrafo, catering y más. Todo lo que necesitas para tu boda.' },
                { href: '/blog/musica-en-vivo-para-bodas', tag: 'Bodas', title: 'Música en vivo para bodas — guía 2026', desc: 'Grupos, solistas, tríos y cuartetos. Cuánto cuesta cada formato.' },
                { href: '/blog/saxofonista-para-bodas-precio', tag: 'Bodas', title: 'Saxofonista para bodas: precio 2026', desc: 'Qué aporta el saxo y cuánto cuesta en boda.' },
                { href: '/blog/musica-para-bodas-guia', tag: 'Bodas', title: 'DJ vs banda en directo: ¿qué elegir?', desc: 'Comparativa completa para la pista de baile de tu boda.' },
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
          <BlogShare />
        </article>
          <BlogEmailCapture variant="presupuestos" intent="contratar-staff" articlePath="/blog/cantante-para-bodas-precio" />
        <FooterPublic />
      </div>
    </>
  );
}
