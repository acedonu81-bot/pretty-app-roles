import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Zap } from 'lucide-react';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';
import DJResourcesAffiliate from '@/components/DJResourcesAffiliate';

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'Los 10 errores al contratar un DJ para una boda (y cómo evitarlos)', item: 'https://xpeak.es/blog/10-errores-contratar-dj-boda' },
  ],
};

const faqStructured = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: '¿Con cuánta antelación hay que reservar un DJ de boda?', acceptedAnswer: { '@type': 'Answer', text: 'Los buenos DJs de boda se reservan con 6 a 12 meses de antelación. Si tu boda es en temporada alta (mayo a octubre), esperar a 3 meses antes significa quedarte sin las primeras opciones. Empieza a buscar en cuanto tengas fecha y finca.' } },
    { '@type': 'Question', name: '¿Cuánto cobra un DJ para una boda en España?', acceptedAnswer: { '@type': 'Answer', text: 'Los precios en España varían entre 400€ y 1.500€ para DJs de boda según experiencia, equipamiento y ciudad. Elegir solo por precio suele salir caro: un ahorro de 200€ en el DJ puede costar el doble en disgusto si la noche falla.' } },
    { '@type': 'Question', name: '¿Qué debe incluir el contrato de un DJ de boda?', acceptedAnswer: { '@type': 'Answer', text: 'El contrato debe incluir fecha, horario, equipamiento incluido, precio cerrado, política de cancelación y datos fiscales. Un acuerdo de palabra no vale nada si el DJ cancela o el precio sube el día del evento. En XPEAK el contrato digital se genera automáticamente al confirmar la contratación.' } },
  ],
};

export default function BlogDJErroresBoda() {
  const articleStructured = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Los 10 errores al contratar un DJ para una boda (y cómo evitarlos)',
    datePublished: '2026-05-18',
    dateModified: '2026-05-18',
    author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' },
    publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
    description: 'Guía para novios: los 10 errores más comunes al contratar un DJ para la boda y cómo evitarlos para que la noche salga perfecta.',
  };

  const errores = [
    {
      num: '01',
      titulo: 'Contratar un DJ de discoteca para una boda',
      texto:
        'El perfil es diferente. Un DJ de club maneja géneros específicos y mezcla de forma técnica durante horas. Un DJ de boda gestiona transiciones entre ceremonia, cóctel, cena y baile, habla al micrófono, adapta el repertorio a todas las edades y sabe leer una sala de 200 personas que incluye desde abuelos hasta adolescentes. Son trabajos distintos. Antes de contratar, pregunta cuántas bodas ha hecho y pide referencias de parejas.',
    },
    {
      num: '02',
      titulo: 'No firmar contrato',
      texto:
        'Es el error que más duele. Un acuerdo de palabra no vale nada si el DJ cancela tres semanas antes, si el equipo falla, o si el precio sube el día del evento. El contrato debe incluir: fecha, horario, equipamiento incluido, precio cerrado, política de cancelación y datos fiscales. En XPEAK el contrato digital se genera automáticamente al confirmar la contratación.',
    },
    {
      num: '03',
      titulo: 'Reservar demasiado tarde',
      texto:
        'Los buenos DJs de boda se reservan con 6 a 12 meses de antelación. Si tu boda es en temporada alta (mayo a octubre), esperar a 3 meses antes significa quedarte sin las primeras opciones. Empieza a buscar en cuanto tengas fecha y finca. Si hay urgencia, el Flash Booking de XPEAK puede conseguirte disponibilidad en menos de 1 hora, pero las opciones son más limitadas.',
    },
    {
      num: '04',
      titulo: 'No hacer un briefing musical previo',
      texto:
        'El DJ no es adivino. Si no le dices qué canciones son importantes para vosotros, qué géneros no quieres que suene nunca, o que el tío Pepe se sube a la pista con "Bamboleo", la noche puede tomar rumbos inesperados. Dedica una reunión de 30 minutos a hablar de: lista de canciones obligatorias, lista de canciones prohibidas, primer baile, baile del ramo y música de fondo para la cena.',
    },
    {
      num: '05',
      titulo: 'Ignorar el equipo técnico incluido',
      texto:
        'Un DJ puede venir con su portátil y unos altavoces Bluetooth de 200€, o con un sistema de PA profesional, mesa Pioneer NXS2 y equipo de iluminación LED. La diferencia en precio es grande, pero también en calidad sonora. Pregunta exactamente qué equipo incluye y si necesitas alquilar aparte algún elemento del local. Para fincas rurales sin instalación propia, una disco móvil completa suele ser la opción más práctica.',
    },
    {
      num: '06',
      titulo: 'No planificar los momentos clave',
      texto:
        'Una boda tiene momentos con música muy específica: la entrada de los novios, el primer baile, el baile con los padres, el corte de la tarta, la apertura del baile y la canción final. Si no lo hablas con el DJ antes, puede haber silencios incómodos o canciones incorrectas en el momento equivocado. Entregadle un cronograma del evento con cada momento y la canción asignada.',
    },
    {
      num: '07',
      titulo: 'Olvidar hablar del volumen y los horarios del local',
      texto:
        'Muchas fincas y salas tienen restricciones de horario y de decibelios. Si el DJ no sabe que hay que bajar el volumen a las 23:00 o que el evento termina a la 1:00, puede haber conflictos con la dirección del local o con los vecinos. Comunica al DJ las restricciones del venue con antelación y asegúrate de que las acepte por escrito.',
    },
    {
      num: '08',
      titulo: 'Elegir por precio, no por calidad',
      texto:
        'El DJ de boda más barato raramente es la mejor elección. Un ahorro de 200€ en el DJ puede costar el doble en disgusto si la noche falla. Busca un equilibrio entre presupuesto y calidad: pide referencias, escucha grabaciones de bodas anteriores y compara. Los precios en España varían entre 400€ y 1.500€ para DJs de boda según experiencia, equipamiento y ciudad.',
    },
    {
      num: '09',
      titulo: 'No preguntar por el plan de contingencia',
      texto:
        '¿Qué pasa si el DJ se pone enfermo el día de la boda? Un profesional serio tiene una red de sustitutos de confianza. Pregunta qué protocolo tiene para cancelaciones de última hora y si incluye sustituto garantizado en el contrato. Sin este punto claro, una baja de urgencia puede dejarte sin música a 12 horas del evento.',
    },
    {
      num: '10',
      titulo: 'No visitar o coordinar el espacio antes del evento',
      texto:
        'Un DJ que llega el día de la boda sin haber visto el espacio nunca pierde tiempo en montaje, puede no saber dónde colocar las cajas de sonido para cubrir bien la pista, o puede encontrarse con que no hay toma eléctrica donde esperaba. Organiza una visita previa al venue o facilita al DJ un plano del espacio y las especificaciones técnicas del local.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>10 errores al contratar DJ para tu boda | XPEAK</title>
        <meta name="description" content="Los 10 errores más frecuentes al contratar un DJ para una boda en España: sin contrato, reservar tarde, confundir perfiles. Guía práctica para novios 2026." />
        <link rel="canonical" href="https://xpeak.es/blog/10-errores-contratar-dj-boda" />
        <meta property="og:title" content="Los 10 errores al contratar un DJ para una boda — XPEAK" />
        <meta property="og:description" content="Guía para novios: los 10 errores más comunes al contratar un DJ para la boda y cómo evitarlos para que la noche salga perfecta." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://xpeak.es/blog/10-errores-contratar-dj-boda" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Los 10 errores al contratar un DJ para una boda — XPEAK" />
        <meta name="twitter:description" content="Guía para novios: los 10 errores más comunes al contratar un DJ para la boda y cómo evitarlos." />
        <meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(articleStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
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
              Guía para novios · 2026
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-4 leading-tight">
            Los 10 errores al contratar un DJ para una boda (y cómo evitarlos)
          </h1>
          <p className="text-base sm:text-base mb-10 leading-relaxed" style={{ color: '#333' }}>
            El DJ puede ser la diferencia entre una boda que la gente recuerda con una sonrisa o una noche que todo el mundo preferiría olvidar. Estos son los errores más frecuentes y cómo esquivarlos.
          </p>

          <div className="space-y-6 mb-12">
            {errores.map(e => (
              <div key={e.num} className="rounded-xl p-5 sm:p-6"
                style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.07)' }}>
                <div className="flex items-start gap-4">
                  <span className="text-2xl sm:text-3xl font-black flex-shrink-0 leading-none pt-0.5"
                    style={{ color: 'rgba(212,175,55,0.25)' }}>
                    {e.num}
                  </span>
                  <div>
                    <h2 className="text-base sm:text-lg font-black mb-2 leading-snug">{e.titulo}</h2>
                    <p className="text-base leading-relaxed" style={{ color: '#444' }}>{e.texto}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen */}
          <div className="rounded-xl p-5 sm:p-6 mb-12"
            style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.15)' }}>
            <h2 className="text-base font-black mb-3" style={{ color: '#D4AF37' }}>En resumen: checklist antes de contratar</h2>
            <ul className="space-y-1.5">
              {[
                'El DJ tiene experiencia demostrable en bodas (no solo clubs)',
                'El contrato incluye precio, horario y equipamiento cerrado',
                'Has hecho un briefing musical con listas de obligatorias y prohibidas',
                'El plan para los momentos clave está coordinado',
                'Conoces el equipo técnico incluido y las necesidades eléctricas',
                'El DJ conoce las restricciones del venue (horario, decibelios)',
                'Hay un plan de contingencia por baja de última hora',
                'El DJ visitará o recibirá el plano del espacio antes del día',
              ].map(item => (
                <li key={item} className="flex items-start gap-2 text-sm" style={{ color: '#333' }}>
                  <span style={{ color: '#D4AF37' }}>✓</span> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="rounded-xl p-6 sm:p-8 mb-12 text-center"
            style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)' }}>
            <p className="text-sm font-bold mb-2">¿Buscas DJ para tu boda?</p>
            <p className="text-xs mb-5" style={{ color: '#333' }}>
              Encuentra DJs verificados con experiencia en bodas. Perfiles con referencias reales, precios públicos y contrato digital automático.
            </p>
            <a href="/contratar-dj"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              <Zap size={14} /> Ver DJs de boda en XPEAK
            </a>
          </div>

          {/* Preguntas frecuentes */}
          <section className="mb-12">
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

          {/* Artículos relacionados */}
          <h2 className="text-lg font-black mb-5">Artículos relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { href: '/blog/dj-para-eventos', cat: 'Hub DJ', title: 'DJ para eventos: guía completa de precios 2026' },
              { href: '/blog/profesionales-bodas', cat: 'Hub Bodas', title: 'Profesionales para bodas: guía completa 2026' },
              { href: '/blog/dj-para-bodas-vs-discoteca', emoji: '🆚', title: 'DJ de boda vs DJ de discoteca: diferencias clave', desc: 'Por qué no son lo mismo y cómo elegir el perfil correcto.' },
              { href: '/blog/cuanto-cobra-un-dj-en-espana', emoji: '💰', title: '¿Cuánto cobra un DJ en España? Precios 2026', desc: 'Tarifas reales por tipo de evento, experiencia y ciudad.' },
              { href: '/blog/musica-para-bodas-guia', emoji: '🎵', title: 'Música para bodas: DJ, banda o lista — guía completa', desc: 'Comparativa completa de opciones musicales para tu boda.' },
              { href: '/blog/cuanto-cuesta-una-boda-en-espana', emoji: '💒', title: '¿Cuánto cuesta una boda en España en 2026?', desc: 'Presupuesto completo por partidas: DJ, catering, fotos y más.' },
            ].map(post => (
              <a key={post.href} href={post.href}
                className="flex items-start gap-4 p-5 rounded-xl transition-all hover:scale-[1.02]"
                style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.07)' }}>
                <span className="text-2xl flex-shrink-0">{post.emoji}</span>
                <div>
                  <p className="text-sm font-black leading-snug mb-1.5">{post.title}</p>
                  <p className="text-sm leading-relaxed" style={{ color: '#333' }}>{post.desc}</p>
                </div>
              </a>
            ))}
          </div>
          <BlogAuthor />
          <BlogShare />
        </article>

          <DJResourcesAffiliate role="dj" />

          <BlogEmailCapture variant="presupuestos" intent="contratar-dj" articlePath="/blog/10-errores-contratar-dj-boda" />
        <BlogRelatedPosts currentSlug='/blog/10-errores-contratar-dj-boda' tag='DJ' />
        <FooterPublic />
        <BlogScrollCTA role="dj" storageKey="xpeak_scrollcta_dj_errores_boda" />
      </div>
    </>
  );
}
