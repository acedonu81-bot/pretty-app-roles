import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogAnswerBox from '@/components/BlogAnswerBox';

const article = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Música para bodas: DJ, banda en directo o lista de reproducción — guía 2026',
  description: 'Comparativa completa entre DJ, banda en directo y música grabada para bodas en España. Precios, ventajas y cuándo elegir cada opción.',
  datePublished: '2026-05-03',
  dateModified: '2026-05-25',
  author: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
  publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } },
  image: 'https://xpeak.es/og-image.jpg',
  url: 'https://xpeak.es/blog/musica-para-bodas-guia',
};

const faqStructured = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: '¿Qué es mejor para una boda, DJ o banda en directo?', acceptedAnswer: { '@type': 'Answer', text: 'Depende del presupuesto y la atmósfera que buscas. Un DJ ofrece más versatilidad musical, ocupa menos espacio y cuesta entre 600-1.500€. Una banda en directo da un toque exclusivo y memorable, pero cuesta entre 2.500-6.000€ y necesita más espacio y logística.' } },
    { '@type': 'Question', name: '¿Qué música se pone en la ceremonia civil?', acceptedAnswer: { '@type': 'Answer', text: 'En ceremonias civiles puedes elegir cualquier música, no hay restricciones religiosas. Las opciones más elegidas: entrada de la novia (instrumentales: Canon in D, A Thousand Years, La vie en rose), firma del acta (música de fondo suave) y salida de la pareja (algo más animado).' } },
    { '@type': 'Question', name: '¿Cuándo empieza a tocar el DJ en una boda?', acceptedAnswer: { '@type': 'Answer', text: 'El DJ suele arrancar con música de fondo durante el cóctel de bienvenida (sin volumen alto), luego transita a música más animada durante la cena y abre la pista de baile después del vals. La pista de baile suele durar 3-4 horas.' } },
    { '@type': 'Question', name: '¿Puedo dar una lista de canciones al DJ de mi boda?', acceptedAnswer: { '@type': 'Answer', text: 'Sí, y es muy recomendable. Prepara: una lista de canciones que sí quieres (peticiones), una lista negra de canciones que bajo ningún concepto quieres escuchar, y algunas canciones especiales para momentos concretos (entrada, vals, final de noche). Un buen DJ las integrará de forma natural.' } },
  ],
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'Música para bodas', item: 'https://xpeak.es/blog/musica-para-bodas-guia' },
  ],
};

const COMPARATIVA = [
  {
    opcion: 'DJ de bodas',
    precio: '600–1.500€',
    ventajas: ['Versatilidad musical total', 'Ocupa poco espacio', 'Gestión de peticiones en directo', 'Incluye equipo de sonido', 'Cubre toda la jornada (8h+)'],
    desventajas: ['Menos espectacular visualmente', 'Depende de grabaciones'],
    ideal: 'La mayoría de bodas, especialmente si quieres variedad musical',
  },
  {
    opcion: 'Banda en directo',
    precio: '2.500–6.000€',
    ventajas: ['Impacto visual y emocional', 'Toque exclusivo y memorable', 'Interacción con los invitados', 'Perfecta para bodas de lujo'],
    desventajas: ['Coste elevado', 'Necesita espacio y camerino', 'Repertorio limitado', 'Descansos entre actuaciones'],
    ideal: 'Bodas de más de 100 invitados con presupuesto alto',
  },
  {
    opcion: 'Cuarteto / Trío',
    precio: '800–2.000€',
    ventajas: ['Elegante para ceremonia y cóctel', 'Más asequible que banda completa', 'Repertorio clásico y pop versiones'],
    desventajas: ['Limitado para pista de baile', 'Suele complementar, no reemplazar al DJ'],
    ideal: 'Ceremonia, cocktail o entrada de la novia',
  },
  {
    opcion: 'Spotify / Lista propia',
    precio: '0–80€',
    ventajas: ['Control total del repertorio', 'Sin coste de artista', 'Simple'],
    desventajas: ['Sin gestión en vivo', 'Problemas técnicos frecuentes', 'Sin lectura del ambiente', 'Nada especial'],
    ideal: 'Solo para bodas muy íntimas o con presupuesto extremadamente ajustado',
  },
];

export default function BlogMusicaBoda() {
  return (
    <>
      <Helmet>
        <title>Música para bodas: DJ, banda o playlist 2026 | XPEAK</title>
        <meta name="description" content="Comparativa DJ vs banda en directo vs música grabada para bodas. Precios, ventajas y cuándo elegir cada opción para tu boda en España." />
        <link rel="canonical" href="https://xpeak.es/blog/musica-para-bodas-guia" />
        <meta property="og:title" content="Música para bodas: guía completa 2026 — XPEAK Blog" />
        <meta property="og:description" content="DJ vs banda en directo vs lista propia para bodas. Precios, ventajas y cuándo elegir cada opción." />
        <meta property="og:url" content="https://xpeak.es/blog/musica-para-bodas-guia" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Música para bodas: DJ vs banda 2026 — XPEAK Blog" />
        <meta name="twitter:description" content="Comparativa DJ vs banda en directo para tu boda. Guía de precios y cuándo elegir cada opción." />
        <meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>

      <div className="min-h-screen" style={{ background: '#090909', color: '#fff' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-3xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#D4AF37' }}>XPEAK</a>
          <div className="flex items-center gap-3">
            <a href="/blog" className="text-xs font-bold hidden sm:block" style={{ color: '#8E8EA0' }}>Blog</a>
            <a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              Unirse gratis
            </a>
          </div>
        </nav>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#8E8EA0' }}>
            ← Todos los artículos
          </a>

          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>Bodas · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">
              Música para bodas: DJ, banda en directo o lista de reproducción — guía 2026
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: '#8E8EA0' }}>
              La música es lo que hace bailar a tus invitados a las 3 de la mañana. Comparativa honesta de todas las opciones con precios reales y cuándo elegir cada una.
            </p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>3 mayo 2026</time>
            <BlogAnswerBox
              question="¿Qué música poner en una boda?"
              answer="Una boda tiene cuatro momentos musicales: ceremonia (música clásica o acústica), cóctel (jazz o lounge suave), cena (ambiente discreto de fondo) y baile (pop, latino o el género favorito de los novios). La diferencia entre DJ y banda en directo está en el presupuesto: 600-1.200€ vs 2.000-5.000€, con resultados muy similares para los invitados."
            />
            <img
              src="/images/blog/musica-para-bodas-dj-banda.jpg"
              alt="Público en evento de música en directo — guía de música para bodas: DJ vs banda 2026"
              className="w-full rounded-xl my-6 object-cover"
              style={{ maxHeight: 320, filter: 'brightness(0.85)' }}
              loading="lazy"
            />
          </div>

          <BlogEmailCapture variant="presupuestos" intent="contratar-dj" articlePath="/blog/musica-para-bodas-guia" />
          <BlogInlineCTA role="dj" variant="upgrade" />

          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Comparativa completa de opciones</h2>
              <div className="space-y-4">
                {COMPARATIVA.map(op => (
                  <div key={op.opcion} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-sm font-black">{op.opcion}</h3>
                      <span className="text-xs font-bold" style={{ color: '#D4AF37' }}>{op.precio}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <div>
                        <p className="text-[0.6rem] font-bold uppercase tracking-wider mb-1.5" style={{ color: '#22c55e' }}>Ventajas</p>
                        <ul className="space-y-1">
                          {op.ventajas.map(v => <li key={v} className="text-xs flex items-start gap-1.5" style={{ color: 'rgba(255,255,255,0.75)' }}><span style={{ color: '#22c55e' }}>+</span>{v}</li>)}
                        </ul>
                      </div>
                      <div>
                        <p className="text-[0.6rem] font-bold uppercase tracking-wider mb-1.5" style={{ color: '#ff5f56' }}>Desventajas</p>
                        <ul className="space-y-1">
                          {op.desventajas.map(d => <li key={d} className="text-xs flex items-start gap-1.5" style={{ color: 'rgba(255,255,255,0.75)' }}><span style={{ color: '#ff5f56' }}>−</span>{d}</li>)}
                        </ul>
                      </div>
                    </div>
                    <p className="text-[0.65rem] px-3 py-2 rounded-lg" style={{ background: 'rgba(212,175,55,0.06)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.1)' }}>
                      <strong>Ideal para:</strong> {op.ideal}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-black mb-3">La combinación perfecta: DJ + cuarteto</h2>
              <p className="text-sm leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.75)' }}>
                La opción más popular en bodas con presupuesto medio-alto es combinar un cuarteto de cuerda para la ceremonia y el cóctel (música clásica o versiones instrumentales de pop) con un DJ para la cena y pista de baile.
                Para saber cuánto presupuestar, consulta{' '}
                <a href="/blog/cuanto-cobra-un-dj-en-espana" style={{ color: '#D4AF37' }}>cuánto cobra un DJ en España</a>{' '}
                o usa la <a href="/blog/calculadora-tarifa-dj" style={{ color: '#D4AF37' }}>calculadora de tarifa DJ</a>.
                Antes de contratar, infórmate sobre{' '}
                <a href="/blog/contrato-dj-que-debe-incluir" style={{ color: '#D4AF37' }}>qué debe incluir un contrato de DJ</a>{' '}
                y descarga la{' '}
                <a href="/plantilla-contrato-dj" style={{ color: '#D4AF37' }}>plantilla gratuita</a>.
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { momento: 'Ceremonia', musica: 'Cuarteto o cuerdas', nota: 'Instrumental, clásico o pop versión' },
                  { momento: 'Cóctel', musica: 'Cuarteto + DJ fondo', nota: 'Transición suave' },
                  { momento: 'Cena + Baile', musica: 'DJ completo', nota: 'De ambiente a full energy' },
                ].map(m => (
                  <div key={m.momento} className="p-3 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-xs font-bold mb-1">{m.momento}</p>
                    <p className="text-[0.65rem] font-bold mb-1" style={{ color: '#D4AF37' }}>{m.musica}</p>
                    <p className="text-[0.6rem]" style={{ color: '#8E8EA0' }}>{m.nota}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">
                {faqStructured.mainEntity.map(f => (
                  <div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-sm font-bold mb-2">{f.name}</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>{f.acceptedAnswer.text}</p>
                  </div>
                ))}
              </div>
            </section>

            
            <section className="mt-8">
              <h2 className="text-base font-black mb-3" style={{ color: 'rgba(255,255,255,0.85)' }}>Artículos relacionados</h2>
              <div className="space-y-2">
                {[
                  { href: '/blog/profesionales-bodas', cat: 'Hub Bodas', title: 'Profesionales para bodas: guía completa 2026' },
                  { href: '/blog/dj-para-eventos', cat: 'Hub DJ', title: 'DJ para eventos: guía completa de precios 2026' },
                  { href: '/blog/cuanto-cobra-un-dj-en-espana', cat: 'DJ', title: 'Cuánto cobra un DJ en España: precios 2026' },
                  { href: '/blog/dj-boda-civil-precio-canciones', cat: 'Bodas', title: 'DJ boda civil: precio y canciones 2026' },
                  { href: '/blog/saxofonista-para-bodas-precio', cat: 'Música', title: 'Saxofonista para bodas: precio 2026' },
                  { href: '/blog/cantante-para-bodas-precio', cat: 'Música', title: 'Cantante para bodas: precio en España 2026' },
                  { href: '/blog/musica-en-vivo-para-bodas', cat: 'Música', title: 'Música en vivo para bodas: precios 2026' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.72)' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>
            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Buscas DJ para tu boda?</p>
              <p className="text-xs mb-4" style={{ color: '#8E8EA0' }}>En XPEAK encuentras DJs especializados en bodas con portfolios verificados. Compara perfiles y contrata con contrato digital automático.</p>
              <a href="/contratar-dj" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105"
                style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                Ver DJs de bodas en XPEAK →
              </a>
            </div>
          </div>
        </main>
      <FooterPublic />
      <BlogScrollCTA role="dj" storageKey="xpeak_scrollcta_musica_boda" />
      </div>
    </>
  );
}
