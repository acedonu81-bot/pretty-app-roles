import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Cómo trabajar de camarero en eventos en España: guía completa 2026', description: 'Guía para trabajar de camarero en bodas, comuniones y eventos en España. Requisitos, cuánto cobras, cómo buscar trabajo y plataformas donde encontrar bolos.', datePublished: '2026-06-02', dateModified: '2026-06-02', author: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/como-trabajar-de-camarero-eventos' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cobra un camarero de eventos por día?', acceptedAnswer: { '@type': 'Answer', text: 'Un camarero de eventos cobra entre 80€ y 180€ por jornada (8-10h), dependiendo de la experiencia, ciudad y tipo de evento. En Madrid y Barcelona los precios son más altos. Una boda de 150 personas puede pagarte 100-150€. Si trabajas 10-15 fines de semana al mes en temporada alta puedes superar los 1.500€ mensuales.' } },
  { '@type': 'Question', name: '¿Qué documentación necesito para trabajar de camarero en eventos?', acceptedAnswer: { '@type': 'Answer', text: 'Si trabajas por cuenta ajena (contratado por empresa de catering): solo necesitas DNI/NIE y número de la seguridad social. Si trabajas por tu cuenta (autónomo): necesitas darte de alta en Hacienda (modelo 037) y en la Seguridad Social. Muchos camareros de eventos trabajan para agencias que les contratan evento a evento con contrato temporal.' } },
  { '@type': 'Question', name: '¿Necesito experiencia previa para trabajar en eventos?', acceptedAnswer: { '@type': 'Answer', text: 'No es imprescindible, pero ayuda. Para bodas y eventos de alto standing, las empresas de catering prefieren camareros con experiencia en servicio de mesa, protocolo y bandeja. Si no tienes experiencia, empieza por eventos más informales (barbacoas, cócteles de empresa) y sube progresivamente. Un curso de barismo o servicio puede abrirte puertas rápido.' } },
  { '@type': 'Question', name: '¿Cuál es la diferencia entre camarero de restaurante y camarero de eventos?', acceptedAnswer: { '@type': 'Answer', text: 'El camarero de eventos trabaja por jornadas sueltas (no tiene horario fijo), cobra más por hora que en restaurante, trabaja principalmente fines de semana en temporada de bodas y comuniones (mayo-octubre) y necesita adaptarse rápido a cada equipo y protocolo de servicio. Es más intenso pero más flexible y mejor pagado por hora.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Camarero eventos trabajo', item: 'https://xpeak.es/blog/como-trabajar-de-camarero-eventos' }] };

const PASOS = [
  { paso: 'Documéntate correctamente', desc: 'DNI/NIE actualizado, número de seguridad social. Si quieres trabajar como autónomo: alta en Hacienda (modelo 037) y en RETA. Muchos camareros empiezan con contratos temporales de empresas de catering, sin ser autónomos.' },
  { paso: 'Consigue tu primera experiencia', desc: 'Eventos informales, cócteles de empresa, fiestas privadas. Apúntate a agencias de staffing de hostelería en tu ciudad. Acepta los primeros trabajos aunque paguen poco — las referencias lo valen todo en este sector.' },
  { paso: 'Aprende el protocolo básico de bodas', desc: 'Servicio de mesa, bandeja, descorche de vino, atención a los novios y mesa presidencial. Las bodas son los eventos mejor pagados y los que más trabajo generan en temporada. Conocer el protocolo te hace más contratado.' },
  { paso: 'Crea tu perfil en plataformas de eventos', desc: 'XPEAK conecta a camareros de eventos con organizadores que buscan personal puntual para bodas, comuniones y eventos corporativos. Tu perfil incluye experiencia, disponibilidad y zona de trabajo.' },
  { paso: 'Trabaja tu disponibilidad y puntualidad', desc: 'En eventos, la puntualidad es crítica. Llegar tarde a una boda puede arruinar una relación laboral completa. Los organizadores repiten con los camareros que son fiables — la continuidad es tu mejor activo.' },
  { paso: 'Especialízate para cobrar más', desc: 'Barista, coctelero, sumiller básico, maitre... cada especialización te permite cobrar un 20-40% más. Un camarero que sabe maridaje y habla inglés es mucho más difícil de encontrar y puede pedir más.' },
];

export default function BlogTrabajarCamareroEventos() {
  return (
    <>
      <Helmet>
        <title>Cómo trabajar de camarero en eventos en España 2026 | XPEAK</title>
        <meta name="description" content="Guía completa para trabajar de camarero en bodas, comuniones y eventos en España. Requisitos, cuánto cobras, cómo buscar trabajo y plataformas donde registrarte." />
        <link rel="canonical" href="https://xpeak.es/blog/como-trabajar-de-camarero-eventos" />
        <meta property="og:title" content="Cómo trabajar de camarero en eventos en España 2026 — XPEAK" />
        <meta property="og:description" content="Guía práctica para camareros de eventos. Requisitos, cuánto cobrar y cómo encontrar trabajo en bodas y comuniones." />
        <meta property="og:url" content="https://xpeak.es/blog/como-trabajar-de-camarero-eventos" />
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

          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>Para Camareros · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Cómo trabajar de camarero en eventos en España: guía completa 2026</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#8E8EA0' }}>El camarero de eventos es uno de los perfiles más demandados en temporada de bodas. Puedes ganar entre 80€ y 180€ por jornada, sin horario fijo, eligiendo los fines de semana que trabajas. Esta guía te explica cómo empezar y cómo maximizar tus ingresos.</p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>2 junio 2026</time>
          </div>

          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Cuánto cobra un camarero de eventos</h2>
              <div className="space-y-2">
                {[
                  { perfil: 'Camarero sin experiencia (primer año)', tarifa: '70–90€ / jornada' },
                  { perfil: 'Camarero con 1-3 años en eventos', tarifa: '90–130€ / jornada' },
                  { perfil: 'Camarero senior / protocolo de bodas', tarifa: '120–160€ / jornada' },
                  { perfil: 'Jefe de sala / maitre de evento', tarifa: '150–220€ / jornada' },
                  { perfil: 'Barista o coctelero especializado', tarifa: '130–200€ / jornada' },
                ].map((row, i) => (
                  <div key={row.perfil} className="flex items-center justify-between p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <p className="text-xs font-medium">{row.perfil}</p>
                    <span className="text-xs font-bold ml-4 shrink-0" style={{ color: '#D4AF37' }}>{row.tarifa}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-3" style={{ color: '#8E8EA0' }}>Tarifas orientativas España 2026. En Madrid y Barcelona un 20-30% más. Jornada = 8-10 horas.</p>
            </section>

            <BlogInlineCTA role="staff" />

            <section>
              <h2 className="text-lg font-black mb-4">Cómo empezar: 6 pasos</h2>
              <div className="space-y-4">
                {PASOS.map((p, i) => (
                  <div key={p.paso} className="flex gap-4 p-5 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span className="text-xl font-black shrink-0 w-6 text-center leading-none mt-0.5" style={{ color: 'rgba(212,175,55,0.35)' }}>{i + 1}</span>
                    <div>
                      <p className="text-sm font-black mb-1.5">{p.paso}</p>
                      <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>{p.desc}</p>
                    </div>
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
                  { href: '/blog/staff-para-eventos', cat: 'Hub Staff', title: 'Staff para eventos: guía completa 2026' },
                  { href: '/blog/cuanto-cobra-un-camarero-de-eventos', cat: 'Staff', title: 'Cuánto cobra un camarero de eventos 2026' },
                  { href: '/blog/como-conseguir-bolos-dj', cat: 'Para DJs', title: 'Cómo conseguir bolos como DJ 2026' },
                  { href: '/blog/cuantos-camareros-necesito-para-mi-boda', cat: 'Bodas', title: 'Cuántos camareros necesito para mi boda' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.72)' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>

            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Trabajas de camarero en eventos?</p>
              <p className="text-xs mb-4" style={{ color: '#8E8EA0' }}>Crea tu perfil en XPEAK gratis. Organizadores de bodas y comuniones en tu zona ven tu disponibilidad y te contratan directamente. Sin comisión. Sin intermediarios.</p>
              <a href="/auth?role=staff" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Crear mi perfil de camarero gratis →</a>
            </div>
          </div>
                  <BlogEmailCapture variant="presupuestos" intent="general" articlePath="/blog/como-trabajar-de-camarero-eventos" />
</main>
        <BlogAuthor />
        <FooterPublic />
      </div>
    </>
  );
}
