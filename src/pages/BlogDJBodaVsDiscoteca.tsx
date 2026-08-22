import { Helmet } from 'react-helmet-async';
import { Zap, ArrowLeft } from 'lucide-react';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';
import DJResourcesAffiliate from '@/components/DJResourcesAffiliate';
import BlogAnswerBox from '@/components/BlogAnswerBox';

const faqStructured = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Es lo mismo un DJ de boda que un DJ de discoteca?',
      acceptedAnswer: { '@type': 'Answer', text: 'No. Un DJ de club se centra en mezclar un género concreto durante horas para mantener a la pista bailando, sin hablar por micro. Un DJ de boda es más versátil (pop, latina, flamenco, comercial en la misma noche), actúa también como animador presentando momentos especiales al micro, gestiona peticiones en tiempo real y coordina con el equipo de catering y protocolo.' },
    },
    {
      '@type': 'Question',
      name: '¿Cuánto cobra un DJ de boda frente a un DJ residente de discoteca?',
      acceptedAnswer: { '@type': 'Answer', text: 'Un DJ residente de club cobra entre 200€ y 800€ por una noche completa (5-6h). Un DJ de boda (ceremonia, cena y fiesta, 6-8h) cobra entre 400€ y 1.500€, y hasta 800€-3.000€ en versión premium con animación y luces incluidas — el precio es mayor porque el servicio incluye más horas, más versatilidad musical y equipo propio de sonido e iluminación.' },
    },
    {
      '@type': 'Question',
      name: '¿Puede un DJ de discoteca hacer bien una boda?',
      acceptedAnswer: { '@type': 'Answer', text: 'Puede, pero conviene comprobar que tiene experiencia real animando bodas: gestionar momentos protocolarios (entrada, primer baile, discursos), adaptar el volumen según la fase del evento y llevar equipo de sonido propio no es lo mismo que mezclar en cabina de club. Lo ideal es contratar un DJ que ya tenga bodas en su portfolio, no asumir que la experiencia en discoteca se traslada directamente.' },
    },
  ],
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'DJ para bodas vs DJ para discoteca: diferencias y precios 2026', item: 'https://xpeak.es/blog/dj-para-bodas-vs-discoteca' },
  ],
};

export default function BlogDJBodaVsDiscoteca() {
  const articleStructured = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'DJ para bodas vs DJ para discoteca: diferencias, precios y cómo elegir en 2026',
    datePublished: '2026-04-20',
    dateModified: '2026-06-08',
    author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' },
    publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
    description: 'Diferencias entre un DJ de boda y un DJ de discoteca: habilidades, equipamiento, precios y cómo elegir el perfil correcto para tu evento.',
  };

  return (
    <>
      <Helmet>
        <title>DJ bodas vs discoteca: diferencias 2026 | XPEAK</title>
        <meta name="description" content="¿Son lo mismo un DJ de boda y un DJ de discoteca? Diferencias en habilidades, equipamiento y precios. Guía para elegir el perfil correcto en 2026." />
        <link rel="canonical" href="https://xpeak.es/blog/dj-para-bodas-vs-discoteca" />
        <meta property="og:title" content="DJ para bodas vs DJ para discoteca 2026 — XPEAK" />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://xpeak.es/blog/dj-para-bodas-vs-discoteca" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="DJ para bodas vs DJ para discoteca: diferencias y precios 2026" />
        <meta name="twitter:description" content="¿Son lo mismo un DJ de boda y un DJ de discoteca? Diferencias en habilidades, equipamiento y precios." />
        <meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(articleStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>

      <div className="min-h-screen" style={{ background: '#ffffff', color: '#111' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-3xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#D4AF37' }}>XPEAK</a>
          <a href="/auth"
            className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105"
            style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
            Unirse gratis
          </a>
        </nav>
        <a href="/blog" className="block px-4 sm:px-6 pb-2 max-w-3xl mx-auto text-xs" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>

        <article className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/contratar-dj" className="inline-flex items-center gap-1.5 text-xs mb-6 transition-opacity hover:opacity-60"
            style={{ color: 'rgba(212,175,55,0.7)' }}>
            <ArrowLeft size={12} /> Contratar DJ
          </a>

          <div className="mb-4">
            <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded"
              style={{ background: 'rgba(212,175,55,0.08)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }}>
              Guía para organizadores · 2026
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-4 leading-tight">
            DJ para bodas vs DJ para discoteca: diferencias, precios y cómo elegir
          </h1>
          <p className="text-base sm:text-base mb-8 leading-relaxed" style={{ color: '#333' }}>
            No, no son lo mismo. Un DJ de sala y un DJ de boda tienen habilidades muy distintas, y contratar al perfil equivocado puede arruinar la noche. Esta guía te explica las diferencias clave.
          </p>
          <BlogAnswerBox
            question="¿Es lo mismo un DJ de boda que un DJ de discoteca?"
            answer="No. Un DJ residente de club cobra entre 200€ y 800€ por noche y se centra en mezclar sin hablar por micro. Un DJ de boda cobra entre 400€ y 1.500€ (hasta 3.000€ en versión premium) porque además de pinchar actúa como animador, gestiona peticiones en directo y coordina con catering y protocolo."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            {[
              {
                tipo: '🎧 DJ de Discoteca / Club',
                puntos: [
                  'Especialista en un género (techno, house, reggaeton)',
                  'Lector de pista: sube/baja la energía según el baile',
                  'Mezcla técnica continua (beatmatching, efectos)',
                  'Acostumbrado a actuar de 1h a 6h seguidas',
                  'Puede no hablar al micrófono nunca',
                  'Equipo propio o rider técnico específico',
                ],
                color: '#4285F4',
              },
              {
                tipo: '💍 DJ de Boda / Evento',
                puntos: [
                  'Versátil: pop, latina, flamenco, comercial en la misma noche',
                  'Animador: presenta momentos especiales al micro',
                  'Gestiona solicitudes en tiempo real',
                  'Coordina con el equipo de catering y protocolo',
                  'Adapta el volumen según las fases del evento',
                  'Suele incluir iluminación y sonido básico en el precio',
                ],
                color: '#D4AF37',
              },
            ].map(({ tipo, puntos, color }) => (
              <div key={tipo} className="p-5 rounded-xl" style={{ background: 'rgba(0,0,0,0.03)', border: `1px solid ${color}22` }}>
                <p className="text-sm font-black mb-4" style={{ color }}>{tipo}</p>
                <ul className="space-y-2">
                  {puntos.map(p => (
                    <li key={p} className="flex items-start gap-2 text-xs" style={{ color: '#333' }}>
                      <span style={{ color }}>✓</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl sm:text-2xl font-black mb-3">¿Cuánto cobra cada tipo de DJ?</h2>
              <div className="space-y-3">
                {[
                  { tipo: 'DJ residente de club (noche completa, 5-6h)', precio: '200€ – 800€' },
                  { tipo: 'DJ de sala para evento especial (2-3h)', precio: '150€ – 500€' },
                  { tipo: 'DJ de boda (ceremonia + cena + fiesta, 6-8h)', precio: '400€ – 1.500€' },
                  { tipo: 'DJ de boda premium (con animación y luces)', precio: '800€ – 3.000€' },
                  { tipo: 'DJ para evento corporativo (3-4h)', precio: '300€ – 1.000€' },
                  { tipo: 'DJ internacional / conocido', precio: '+2.000€' },
                ].map(({ tipo, precio }) => (
                  <div key={tipo} className="flex items-center justify-between p-3 rounded-lg text-sm"
                    style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}>
                    <span style={{ color: '#222' }}>{tipo}</span>
                    <span className="font-black text-xs ml-4 flex-shrink-0" style={{ color: '#D4AF37' }}>{precio}</span>
                  </div>
                ))}
              </div>
            </section>

            <BlogInlineCTA role="dj" />

            <section>
              <h2 className="text-xl sm:text-2xl font-black mb-3">¿Cuál necesitas para tu evento?</h2>
              <div className="space-y-3">
                {[
                  { evento: 'Boda', recomendacion: 'DJ de bodas con experiencia en presentaciones y micro', icono: '💍' },
                  { evento: 'Club o discoteca', recomendacion: 'DJ residente o freelance especializado en el género de la sala', icono: '🎧' },
                  { evento: 'Festival', recomendacion: 'DJ de sala con carrera y capacidad para actuar en escenario grande', icono: '🎪' },
                  { evento: 'Evento corporativo', recomendacion: 'DJ versátil con experiencia en eventos de empresa y música ambiental', icono: '🏢' },
                  { evento: 'Fiesta privada', recomendacion: 'DJ flexible que adapte el set a tus preferencias en tiempo real', icono: '🎉' },
                  { evento: 'Inauguración / pop-up', recomendacion: 'DJ ambient o deep house con equipo compacto y discreción', icono: '🏪' },
                ].map(({ evento, recomendacion, icono }) => (
                  <div key={evento} className="p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.07)' }}>
                    <p className="text-sm font-bold mb-1">{icono} {evento}</p>
                    <p className="text-xs" style={{ color: '#444' }}>{recomendacion}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-black mb-3">Qué preguntar antes de contratar</h2>
              <ul className="space-y-2">
                {[
                  '¿Tienes experiencia en bodas / clubs / el tipo de evento que organizo?',
                  '¿Puedes hacer una prueba o enviarme una grabación de actuación similar?',
                  '¿Incluyes equipo de sonido y/o iluminación?',
                  '¿Cuánto tiempo necesitas para montar y desmontar?',
                  '¿Aceptas solicitudes de canciones en directo?',
                  '¿Tienes seguro de responsabilidad civil?',
                  '¿Qué pasa si cancelas o tienes una emergencia?',
                ].map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: '#333' }}>
                    <span className="font-black" style={{ color: '#D4AF37' }}>{i + 1}.</span> {p}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section className="mt-8">
              <h2 className="text-base font-black mb-3" style={{ color: '#111' }}>Artículos relacionados</h2>
              <div className="space-y-2">
                {[
                  { href: '/blog/dj-para-eventos', cat: 'Hub DJ', title: 'DJ para eventos: guía completa de precios 2026' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: '#222' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>

          <div className="mt-12 rounded-2xl p-7 text-center" style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)' }}>
            <h2 className="text-xl font-black mb-2">Encuentra el DJ perfecto para tu evento</h2>
            <p className="text-sm mb-5" style={{ color: '#444' }}>
              Perfiles verificados · Flash Booking en menos de 1h · Contrato automático
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href="/contratar-dj"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-black text-sm transition-all hover:scale-105"
                style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                <Zap size={14} /> Buscar DJ gratis
              </a>
              <a href="/contratar-dj"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105"
                style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid #777', color: '#111' }}>
                Ver directorio de DJs
              </a>
            </div>
          </div>

          <section className="mt-10">
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

          <BlogAuthor />
          <BlogShare />
        </article>
          <DJResourcesAffiliate role="dj" />

          <BlogEmailCapture variant="presupuestos" intent="contratar-dj" articlePath="/blog/dj-para-bodas-vs-discoteca" />
        <BlogRelatedPosts currentSlug='/blog/dj-para-bodas-vs-discoteca' tag='DJ' />
        <FooterPublic />
        <BlogScrollCTA role="dj" storageKey="xpeak_scrollcta_dj_boda_vs_discoteca" />
      </div>
    </>
  );
}
