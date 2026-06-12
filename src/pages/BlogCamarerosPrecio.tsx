import { Helmet } from 'react-helmet-async';
import { Zap, ArrowLeft } from 'lucide-react';
import FooterPublic from '@/components/FooterPublic';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';
import BlogTopCTA from '@/components/BlogTopCTA';

export default function BlogCamarerosPrecio() {
  const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'Cuánto cobra un camarero de eventos por horas en España (2026)', item: 'https://xpeak.es/blog/cuanto-cobra-un-camarero-de-eventos' },
  ],
};

const faqStructured = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: '¿Cuánto cobra un camarero de eventos por horas en España?', acceptedAnswer: { '@type': 'Answer', text: 'Un camarero de eventos en España cobra entre 10€ y 22€/hora según experiencia, zona y tipo de evento. En Madrid y Barcelona los precios suelen ser un 15-20% más altos que la media nacional.' } },
      { '@type': 'Question', name: '¿Cuánto cobra un barman para una boda?', acceptedAnswer: { '@type': 'Answer', text: 'Un bartender profesional para bodas cobra entre 120€ y 280€ por servicio completo (4-6 horas), incluyendo barra y montaje. Los barmanes con especialidad en cócteles o barra libre premium pueden cobrar más.' } },
      { '@type': 'Question', name: '¿Cuántos camareros necesito para mi boda?', acceptedAnswer: { '@type': 'Answer', text: 'La regla estándar es 1 camarero por cada 10 personas en cena sentada, y 1 por cada 15-20 en formato cóctel. Para una boda de 100 personas necesitas entre 5 y 10 camareros.' } },
    ],
  };

  const articleStructured = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Cuánto cobra un camarero de eventos por horas en España (2026)',
    datePublished: '2026-04-01',
    dateModified: '2026-06-08',
    author: { '@type': 'Organization', name: 'XPEAK' },
    publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
    description: 'Guía completa de precios de camareros para eventos en España 2026: bodas, empresas, fiestas privadas. Cuánto cobran y cuántos necesitas.',
  };

  return (
    <>
      <Helmet>
        <title>Cuánto cobra un camarero de eventos 2026 | XPEAK</title>
        <meta name="description" content="Guía completa de precios de camareros para eventos en España 2026: bodas, empresas y fiestas privadas. Cuánto cobran y cuántos necesitas contratar." />
        <link rel="canonical" href="https://xpeak.es/blog/cuanto-cobra-un-camarero-de-eventos" />
        <meta property="og:title" content="Cuánto cobra un camarero de eventos en España 2026 — XPEAK" />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://xpeak.es/blog/cuanto-cobra-un-camarero-de-eventos" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Cuánto cobra un camarero de eventos en España 2026" />
        <meta name="twitter:description" content="Guía completa de precios de camareros para eventos en España 2026: bodas, empresas y fiestas privadas." />
        <meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(articleStructured)}</script>
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

        <article className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
            <BlogTopCTA href="/auth?mode=register&intent=contratar-staff" label="Ver camareros →" />
          <a href="/contratar-camareros" className="inline-flex items-center gap-1.5 text-xs mb-6 transition-opacity hover:opacity-60"
            style={{ color: 'rgba(212,175,55,0.7)' }}>
            <ArrowLeft size={12} /> Contratar camareros
          </a>

          <div className="mb-4">
            <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded"
              style={{ background: 'rgba(212,175,55,0.08)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }}>
              Guía de precios · 2026
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-4 leading-tight">
            Cuánto cobra un camarero de eventos por horas en España (2026)
          </h1>
          <p className="text-sm sm:text-base mb-8 leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Si estás organizando una boda, un evento de empresa o una fiesta privada y necesitas personal de sala, esta guía te da los precios reales del mercado en 2026 — sin intermediarios, sin letra pequeña.
          </p>

          <div className="p-5 rounded-xl mb-8" style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)' }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>Resumen de precios 2026</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                ['Camarero/a de sala', '10€ – 18€/hora'],
                ['Barman / Bartender', '15€ – 22€/hora'],
                ['Jefe de sala', '20€ – 30€/hora'],
                ['Servicio boda completo (4–6h)', '120€ – 250€/persona'],
                ['Barra libre con bartender', '150€ – 350€ (4h)'],
                ['Personal de cocina', '12€ – 20€/hora'],
              ].map(([rol, precio]) => (
                <div key={rol} className="flex items-center justify-between p-3 rounded-lg"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span className="text-xs font-bold">{rol}</span>
                  <span className="text-xs font-black" style={{ color: '#D4AF37' }}>{precio}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl sm:text-2xl font-black mb-3">¿Cuánto cobra un camarero de eventos en España?</h2>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.65)' }}>
                En 2026, el precio medio de un camarero de eventos en España está entre <strong style={{ color: '#fff' }}>10€ y 18€/hora</strong> para personal sin especialización, y entre <strong style={{ color: '#fff' }}>15€ y 22€/hora</strong> para barmanes y personal con más de 3 años de experiencia.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Las zonas con precios más altos son Madrid, Barcelona e Ibiza, donde el coste puede ser un 20-30% superior a la media. Ciudades como Murcia, Zaragoza o Valladolid tienen tarifas más ajustadas.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-black mb-3">Precio de camareros para bodas</h2>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Las bodas son el evento donde más se nota la diferencia entre un camarero genérico y uno especializado. El precio habitual para una boda incluye:
              </p>
              <ul className="space-y-2 mb-4">
                {[
                  'Cóctel de bienvenida (1-1,5h): 1 camarero por cada 20 invitados',
                  'Cena sentada (2-3h): 1 camarero por cada 10 invitados',
                  'Barra libre (2-3h): 1 bartender por cada 30-40 personas',
                  'Recogida y limpieza: incluida en el precio según acuerdo',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
                    <span style={{ color: '#D4AF37' }}>—</span> {item}
                  </li>
                ))}
              </ul>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Para una boda de 100 personas, el presupuesto de personal de sala suele estar entre <strong style={{ color: '#fff' }}>800€ y 2.000€</strong> para un servicio completo de 6-7 horas.
              </p>
            </section>

            <BlogInlineCTA role="staff" />

            <section>
              <h2 className="text-xl sm:text-2xl font-black mb-3">Precio de camareros para eventos de empresa</h2>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.65)' }}>
                En eventos corporativos (presentaciones, cenas de empresa, coffee breaks), el precio varía según el formato:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {[
                  { tipo: 'Coffee break corporativo', precio: '1 camarero/50 personas · 50-100€/evento' },
                  { tipo: 'Cóctel de empresa', precio: '1 camarero/20 personas · 15-20€/h' },
                  { tipo: 'Cena de gala', precio: '1 camarero/8 personas · 18-25€/h' },
                  { tipo: 'Jornada de empresa (8h)', precio: '1 camarero/30 personas · 120-180€/día' },
                ].map(({ tipo, precio }) => (
                  <div key={tipo} className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-xs font-bold mb-1">{tipo}</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{precio}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-black mb-3">¿Cuántos camareros necesito para mi evento?</h2>
              <div className="space-y-3 mb-4">
                {[
                  { formato: 'Cóctel / aperitivo', ratio: '1 camarero / 15-20 personas' },
                  { formato: 'Cena sentada con servicio', ratio: '1 camarero / 8-10 personas' },
                  { formato: 'Buffet libre', ratio: '1 camarero / 25-30 personas' },
                  { formato: 'Barra libre', ratio: '1 bartender / 30-40 personas' },
                  { formato: 'Boda completa (cóctel + cena + barra)', ratio: '1 camarero / 10 invitados (aprox.)' },
                ].map(({ formato, ratio }) => (
                  <div key={formato} className="flex items-center justify-between p-3 rounded-lg text-sm"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ color: 'rgba(255,255,255,0.7)' }}>{formato}</span>
                    <span className="font-bold text-xs" style={{ color: '#D4AF37' }}>{ratio}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-black mb-3">Preguntas frecuentes</h2>
              <div className="space-y-4">
                {[
                  { q: '¿El precio incluye desplazamiento?', a: 'Depende del profesional. En XPEAK cada perfil especifica si incluye desplazamiento o si se factura aparte. Habitual: incluido hasta 30km, a partir de ahí se factura por kilómetro.' },
                  { q: '¿Qué uniforme llevan los camareros?', a: 'El estándar para eventos formales es camisa blanca, pantalón negro y delantal. Para bodas de gala, algunos camareros ofrecen traje o frac por un suplemento. Especifícalo en tu solicitud.' },
                  { q: '¿Puedo cancelar la contratación?', a: 'Sí. Los contratos de XPEAK incluyen cláusulas de cancelación estándar: sin coste hasta 7 días antes, 50% del caché entre 7 y 48 horas, 100% en cancelaciones con menos de 48 horas.' },
                ].map(({ q, a }) => (
                  <div key={q} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <p className="text-sm font-bold mb-2">{q}</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{a}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          
            <section className="mt-8">
              <h2 className="text-base font-black mb-3" style={{ color: 'rgba(255,255,255,0.85)' }}>Artículos relacionados</h2>
              <div className="space-y-2">
                {[
                  { href: '/blog/staff-para-eventos', cat: 'Hub Staff', title: 'Staff para eventos: guía completa 2026' },
                  { href: '/blog/cuantos-camareros-necesito-para-mi-boda', cat: 'Bodas', title: 'Cuántos camareros necesito para mi boda' },
                  { href: '/blog/staff-de-discoteca-funciones-y-salario', cat: 'Staff', title: 'Staff de discoteca: funciones y sueldos 2026' },
                  { href: '/blog/cuanto-cuesta-una-boda-en-espana', cat: 'Bodas', title: 'Cuánto cuesta una boda en España 2026' },
                  { href: '/blog/contratar-barman-evento-privado', cat: 'Staff', title: 'Barman evento privado: precio 2026' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.72)' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>
            <div className="mt-12 rounded-2xl p-7 text-center" style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)' }}>
            <h2 className="text-xl font-black mb-2">Encuentra camareros para tu evento</h2>
            <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Gratis para organizadores · Flash Booking en menos de 1h · Contrato digital automático
            </p>
            <a href="/auth"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-black text-sm transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              <Zap size={14} /> Publicar oferta gratis
            </a>
          </div>
          <BlogAuthor />
          <BlogShare />
        </article>
          <BlogEmailCapture variant="presupuestos" intent="contratar-staff" articlePath="/blog/cuanto-cobra-un-camarero-de-eventos" />
        <FooterPublic />
      </div>
    </>
  );
}
