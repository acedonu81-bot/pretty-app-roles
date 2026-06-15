import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogShare from '@/components/BlogShare';
import BlogTopCTA from '@/components/BlogTopCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogAuthor from '@/components/BlogAuthor';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Fotógrafo de boda: guía de precios y cómo elegir el mejor (2026)', description: 'Cuánto cuesta un fotógrafo de boda en España en 2026. Precios reales, estilos, qué incluye el reportaje y cómo elegir al fotógrafo perfecto para tu boda.', datePublished: '2026-05-10', dateModified: '2026-06-01', author: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/fotografo-boda' };

const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cuesta un fotógrafo de boda en España?', acceptedAnswer: { '@type': 'Answer', text: 'El precio medio de un fotógrafo de boda en España oscila entre 1.200€ y 3.500€ para un reportaje completo. En ciudades como Madrid o Barcelona los precios son más altos (1.800–4.500€), mientras que en ciudades medianas se pueden encontrar buenos profesionales desde 900€. El precio depende del número de horas, si incluye álbum y la experiencia del fotógrafo.' } },
  { '@type': 'Question', name: '¿Qué incluye un reportaje de boda?', acceptedAnswer: { '@type': 'Answer', text: 'Un reportaje de boda completo incluye preparativos de los novios, ceremonia civil o religiosa, sesión de pareja (golden hour), cóctel y banquete hasta el primer baile. La entrega suele ser de 400-800 fotos editadas en alta resolución en 4-8 semanas. El álbum impreso puede estar incluido o ser un extra según el paquete.' } },
  { '@type': 'Question', name: '¿Con cuánta antelación reservar el fotógrafo de boda?', acceptedAnswer: { '@type': 'Answer', text: 'Lo ideal es reservar el fotógrafo de boda con 12-18 meses de antelación, especialmente para bodas en primavera (mayo-junio) u otoño (septiembre-octubre). Los mejores fotógrafos de España tienen agenda llena con 1-2 años de anticipación. Muchas parejas reservan al fotógrafo antes que a la finca o el catering.' } },
  { '@type': 'Question', name: '¿Qué estilo fotográfico elegir para mi boda?', acceptedAnswer: { '@type': 'Answer', text: 'Los principales estilos de fotografía de boda son: reportaje documental (captura momentos naturales sin posados), estilo editorial o de moda (fotos muy trabajadas con posados elaborados), y estilo clásico (formal y atemporal). Lo más recomendable es ver varios bodas completas del fotógrafo para verificar que su estilo encaja con lo que buscas.' } },
] };

const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
  { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
  { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
  { '@type': 'ListItem', position: 3, name: 'Fotógrafo de boda', item: 'https://xpeak.es/blog/fotografo-boda' },
] };

const PRECIOS = [
  { servicio: 'Reportaje básico (ceremonia + cóctel, 4-5h)', precio: '800–1.500€' },
  { servicio: 'Reportaje completo (10-12h, sin álbum)', precio: '1.200–2.800€' },
  { servicio: 'Reportaje completo con álbum de lujo', precio: '2.000–4.500€' },
  { servicio: 'Pack fotógrafo + videógrafo', precio: '3.000–6.000€' },
  { servicio: 'Preboda (sesión de pareja previa)', precio: '200–600€' },
];

const ESTILOS = [
  { estilo: 'Documental / Reportaje', descripcion: 'Captura momentos naturales sin posados. El más demandado actualmente.', para: 'Novios que buscan espontaneidad' },
  { estilo: 'Editorial / Fine Art', descripcion: 'Fotos muy trabajadas, luz cuidada, posados elaborados. Estética de revista.', para: 'Bodas con mucho detalle y producción' },
  { estilo: 'Clásico / Tradicional', descripcion: 'Formal, atemporal, con posados familiares y de pareja.', para: 'Familias más tradicionales' },
  { estilo: 'Mixto', descripcion: 'Combina reportaje documental con algunas fotos posadas clave.', para: 'La mayoría de las parejas' },
];

export default function BlogFotografoBoda() {
  return (
    <>
      <Helmet>
        <title>Fotógrafo de boda: precio y guía completa 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cuesta un fotógrafo de boda en España en 2026. Precios reales, estilos, qué incluye el reportaje y cómo contratar al mejor fotógrafo para tu boda." />
        <link rel="canonical" href="https://xpeak.es/blog/fotografo-boda" />
        <meta property="og:title" content="Fotógrafo de boda: precio y guía 2026 — XPEAK" />
        <meta property="og:description" content="Guía completa para contratar fotógrafo de boda. Precios 2026, estilos y qué incluye el reportaje." />
        <meta property="og:url" content="https://xpeak.es/blog/fotografo-boda" />
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
            <a href="/blog" className="text-xs font-bold hidden sm:block" style={{ color: '#8E8EA0' }}>Blog</a>
            <a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Unirse gratis</a>
          </div>
        </nav>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#8E8EA0' }}>← Todos los artículos</a>

          <BlogTopCTA role="fotografo" />

          <div className="mb-8 mt-6">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>Fotografía · España · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Fotógrafo de boda: guía de precios y cómo elegir el mejor (2026)</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#8E8EA0' }}>El fotógrafo de boda es uno de los proveedores más importantes que contratarás. Las fotos son lo único que te queda para siempre. Esta guía te explica cuánto cuesta, qué incluye un reportaje y cómo no equivocarte en la elección.</p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>10 mayo 2026 · Actualizado 1 junio 2026</time>
          </div>

          <div className="space-y-10">

            <section>
              <h2 className="text-lg font-black mb-4">Precios fotógrafo de boda en España (2026)</h2>
              <div className="space-y-2">
                {PRECIOS.map((row, i) => (
                  <div key={row.servicio} className="flex items-center justify-between p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <p className="text-xs font-medium">{row.servicio}</p>
                    <span className="text-xs font-bold ml-4 shrink-0" style={{ color: '#D4AF37' }}>{row.precio}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-3" style={{ color: '#8E8EA0' }}>Precios orientativos 2026 para toda España. Sin IVA. Madrid y Barcelona suelen estar un 20-30% por encima.</p>
            </section>

            <BlogInlineCTA role="fotografo" />

            <section>
              <h2 className="text-lg font-black mb-4">¿Qué incluye un reportaje de boda?</h2>
              <p className="text-sm leading-relaxed mb-4" style={{ color: '#8E8EA0' }}>Un reportaje completo de boda cubre todo el día, desde los preparativos hasta el baile. Esto es lo que debe incluir un paquete estándar:</p>
              <ul className="space-y-3">
                {[
                  'Preparativos de novia y novio (en paralelo si hay segundo fotógrafo)',
                  'Ceremonia civil o religiosa completa',
                  'Sesión de pareja exterior — golden hour o jardines de la finca',
                  'Cóctel: detalles, invitados, momentos espontáneos',
                  'Banquete y primer baile',
                  'Entrega de 400-800 fotos editadas en alta resolución (en 4-8 semanas)',
                  'Galería privada online para compartir con la familia',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
                    <span className="mt-0.5 shrink-0" style={{ color: '#D4AF37' }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-xs mt-4" style={{ color: '#8E8EA0' }}>El álbum impreso puede estar incluido o costar entre 300€ y 900€ adicionales según el tipo y el número de páginas.</p>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">Estilos de fotografía de boda</h2>
              <div className="space-y-3">
                {ESTILOS.map((e) => (
                  <div key={e.estilo} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-sm font-black mb-1" style={{ color: '#D4AF37' }}>{e.estilo}</p>
                    <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>{e.descripcion}</p>
                    <p className="text-xs" style={{ color: '#8E8EA0' }}>Ideal para: {e.para}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">Cómo elegir al fotógrafo de tu boda</h2>
              <p className="text-sm leading-relaxed mb-4" style={{ color: '#8E8EA0' }}>No te quedes solo con las fotos del perfil de Instagram. Sigue estos pasos:</p>
              <ol className="space-y-4">
                {[
                  { titulo: 'Ver bodas completas, no solo las mejores fotos', desc: 'Pide ver una o dos bodas completas de principio a fin. Las mejores fotos siempre quedan bien — lo importante es ver el nivel general.' },
                  { titulo: 'Reunión previa (en persona o videollamada)', desc: 'La química con el fotógrafo es fundamental. Pasará todo el día con vosotros. Si no os sentís cómodos en la reunión, probablemente tampoco el día de la boda.' },
                  { titulo: 'Contrato por escrito', desc: 'Fecha, horas incluidas, entrega estimada, número de fotos, derechos de imagen y condiciones de cancelación. Sin contrato, no hay garantías.' },
                  { titulo: 'Comprobar disponibilidad de backup', desc: 'Pregunta qué pasa si el fotógrafo se pone enfermo el día de la boda. Un profesional serio tiene un plan de contingencia o acuerdos con colegas.' },
                  { titulo: 'No contratar solo por precio', desc: 'El más barato puede salir muy caro. Valora el portfolio, la experiencia, las referencias y el feeling personal, no solo el presupuesto.' },
                ].map((step, i) => (
                  <li key={step.titulo} className="flex gap-4">
                    <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5" style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)' }}>{i + 1}</span>
                    <div>
                      <p className="text-sm font-bold mb-1">{step.titulo}</p>
                      <p className="text-xs leading-relaxed" style={{ color: '#8E8EA0' }}>{step.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section>
              <h2 className="text-lg font-black mb-3">¿Con cuánta antelación reservar?</h2>
              <p className="text-sm leading-relaxed" style={{ color: '#8E8EA0' }}>Reserva el fotógrafo con <strong style={{ color: '#fff' }}>12-18 meses de antelación</strong> para bodas en temporada alta (mayo, junio, septiembre, octubre). Los mejores profesionales tienen agenda llena con 1-2 años de adelanto. Si tu boda es en temporada baja (enero, febrero, noviembre) o entre semana, puedes tener más margen, pero siempre es mejor reservar antes.</p>
            </section>

            <BlogEmailCapture variant="presupuestos" articlePath="/blog/fotografo-boda" />

            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">
                {faqStructured.mainEntity.map((faq) => (
                  <div key={faq['@type']} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-sm font-bold mb-2">{faq.name}</p>
                    <p className="text-xs leading-relaxed" style={{ color: '#8E8EA0' }}>{faq.acceptedAnswer.text}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="p-5 rounded-2xl" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}>
              <h3 className="text-base font-black mb-2">Encuentra fotógrafos de boda verificados en XPEAK</h3>
              <p className="text-xs leading-relaxed mb-4" style={{ color: '#8E8EA0' }}>En XPEAK puedes ver el portfolio completo de fotógrafos de boda en toda España, comparar tarifas reales y contactar directamente sin intermediarios.</p>
              <a href="/contratar-fotografo" className="inline-block px-5 py-2.5 rounded-xl text-sm font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
                Ver fotógrafos disponibles →
              </a>
            </section>

            <BlogShare />
            <BlogAuthor />
          </div>
        </main>
        <FooterPublic />
      </div>
    </>
  );
}
