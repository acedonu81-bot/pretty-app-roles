import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Cómo contratar personal para un evento en España: guía completa 2026', description: 'Guía paso a paso para contratar personal para eventos en España. Qué perfiles necesitas, precios por categoría y checklist antes de firmar.', datePublished: '2026-05-07',
  dateModified: '2026-05-25', author: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/como-contratar-personal-para-un-evento' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cuesta contratar personal para un evento?', acceptedAnswer: { '@type': 'Answer', text: 'Depende del perfil. Un camarero para eventos cuesta entre 15€ y 25€/hora; un DJ entre 300€ y 1.500€ por evento; un fotógrafo entre 500€ y 2.500€; azafatas entre 120€ y 200€ por jornada. El presupuesto total de personal suele representar el 20-35% del coste total del evento.' } },
  { '@type': 'Question', name: '¿Con cuánta antelación hay que contratar al personal para un evento?', acceptedAnswer: { '@type': 'Answer', text: 'Para bodas y grandes eventos, con 6-12 meses de antelación para DJs y fotógrafos. El personal de sala (camareros, staff) puede contratarse con 4-8 semanas. Para urgencias, XPEAK Flash Booking permite contratar en menos de 2 horas.' } },
  { '@type': 'Question', name: '¿Qué contrato hay que hacer al personal de eventos?', acceptedAnswer: { '@type': 'Answer', text: 'Para trabajadores por cuenta ajena, contrato de duración determinada por obra y servicio. Si contratas autónomos, basta con un contrato de prestación de servicios y su factura con IVA. Siempre especifica: fecha, hora, lugar, funciones, precio y condiciones de cancelación.' } },
  { '@type': 'Question', name: '¿Qué personal necesita un evento de 100 personas?', acceptedAnswer: { '@type': 'Answer', text: 'Para 100 personas: 4-5 camareros (1 por cada 20-25 pax), 1 DJ o amenización musical, 1 fotógrafo/a, y opcionalmente 1-2 azafatas de imagen. Para banquetes formales añade 1 maitre o coordinador de sala. El número varía según el formato (cóctel, sentado, tipo buffet).' } },
  { '@type': 'Question', name: '¿Cómo pago al personal de un evento en negro?', acceptedAnswer: { '@type': 'Answer', text: 'No se recomienda. El pago en negro genera responsabilidad para el organizador ante la Seguridad Social y Hacienda. Lo correcto es contratar autónomos con factura o trabajadores con contrato temporal. Plataformas como XPEAK facilitan el contacto con profesionales que emiten factura correctamente.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Contratar personal para un evento', item: 'https://xpeak.es/blog/como-contratar-personal-para-un-evento' }] };

const PERFILES = [
  { perfil: 'Camarero de sala', precio: '15–25€/h', para: 'Servicio de mesa, buffet, barra libre', ratio: '1 por cada 20-25 pax' },
  { perfil: 'DJ profesional', precio: '300–1.500€/evento', para: 'Música, animación, ambientación', ratio: '1 por evento' },
  { perfil: 'Fotógrafo de eventos', precio: '500–2.500€/evento', para: 'Cobertura fotográfica completa', ratio: '1-2 por evento' },
  { perfil: 'Azafata / Hostess', precio: '120–200€/jornada', para: 'Recepción, entrega de material, imagen', ratio: '1 por cada 50-80 pax' },
  { perfil: 'Barman / Coctelero', precio: '150–400€/evento', para: 'Barra de cócteles, barra libre', ratio: '1 por cada 40-50 pax' },
  { perfil: 'Coordinador de eventos', precio: '800–2.500€/evento', para: 'Gestión integral del día', ratio: '1 por evento' },
  { perfil: 'Maquilladora', precio: '200–600€/sesión', para: 'Bodas, galas, eventos de imagen', ratio: '1-2 según invitadas' },
  { perfil: 'Fotógrafo/videógrafo', precio: '600–3.000€/evento', para: 'Foto y vídeo combinados', ratio: '1-2 por evento' },
];

const CHECKLIST = [
  'Confirmar fecha, horario de inicio y fin (con margen de montaje y desmontaje)',
  'Definir funciones exactas por escrito (no "lo que haga falta")',
  'Acordar el precio y forma de pago por adelantado (señal + resto el día del evento)',
  'Establecer condición de cancelación — cuánto se pierde si cancelas a 7, 15 o 30 días',
  'Confirmar si el profesional aporta equipo propio o lo necesita el organizador',
  'Pedir referencias o ver portfolio antes de confirmar',
  'Firmar un contrato de prestación de servicios aunque sea sencillo',
  'Compartir plano del espacio y briefing de marca/tono del evento',
  'Establecer punto de contacto el día del evento (no cambiar de interlocutor)',
  'Tener un plan B para cada perfil crítico (DJ, fotógrafo, catering)',
];

export default function BlogContratarPersonalEvento() {
  return (
    <>
      <Helmet>
        <title>Contratar personal para un evento: guía 2026 | XPEAK</title>
        <meta name="description" content="Guía paso a paso para contratar personal para eventos en España. Perfiles, precios reales y checklist antes de firmar. Camareros, DJs, fotógrafos, azafatas y más." />
        <link rel="canonical" href="https://xpeak.es/blog/como-contratar-personal-para-un-evento" />
        <meta property="og:title" content="Cómo contratar personal para un evento — XPEAK Blog" />
        <meta property="og:description" content="Guía completa para contratar personal de eventos en España. Precios, perfiles y checklist." />
        <meta property="og:url" content="https://xpeak.es/blog/como-contratar-personal-para-un-evento" />
        <meta property="og:type" content="article" /><meta property="og:image" content="https://xpeak.es/og-image.jpg" /><meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" /><meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>
      <div className="min-h-screen" style={{ background: '#090909', color: '#fff' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-3xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#D4AF37' }}>XPEAK</a>
          <div className="flex items-center gap-3"><a href="/blog" className="text-xs font-bold" style={{ color: '#8E8EA0' }}>Blog</a><a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Unirse gratis</a></div>
        </nav>
        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#8E8EA0' }}>← Todos los artículos</a>
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>Eventos · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Cómo contratar personal para un evento en España: guía completa 2026</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#8E8EA0' }}>Camareros, DJ, fotógrafo, azafatas… contratar el equipo equivocado puede arruinar un evento perfecto. Esta guía te explica qué necesitas, cuánto cuesta y cómo hacerlo bien.</p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>7 mayo 2026</time>
          </div>
          <div className="space-y-10">

            <section>
              <h2 className="text-lg font-black mb-4">Precios de personal de eventos por perfil</h2>
              <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <table className="w-full text-xs">
                  <thead><tr style={{ background: 'rgba(212,175,55,0.08)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}><th className="text-left px-4 py-3 font-bold">Perfil</th><th className="px-4 py-3 font-bold text-right">Precio orientativo</th><th className="px-4 py-3 font-bold text-left hidden sm:table-cell">Ratio</th></tr></thead>
                  <tbody>{PERFILES.map((row, i) => (<tr key={row.perfil} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="px-4 py-3 font-medium">{row.perfil}</td><td className="px-4 py-3 text-right font-bold" style={{ color: '#D4AF37' }}>{row.precio}</td><td className="px-4 py-3 hidden sm:table-cell" style={{ color: '#8E8EA0' }}>{row.ratio}</td></tr>))}</tbody>
                </table>
              </div>
              <p className="text-xs mt-3" style={{ color: '#8E8EA0' }}>Precios orientativos para España 2026. Varían según ciudad, temporada y experiencia del profesional.</p>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">¿Qué personal necesita mi evento?</h2>
              <p className="text-sm leading-relaxed mb-4" style={{ color: '#8E8EA0' }}>El número de profesionales depende de tres factores: número de invitados, formato del evento y nivel de servicio esperado.</p>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { tipo: 'Evento pequeño (hasta 50 pax)', personal: '2 camareros · 1 DJ (opcional) · 1 fotógrafo', precio: '500–1.500€' },
                  { tipo: 'Evento mediano (50–150 pax)', personal: '4–6 camareros · 1 DJ · 1 fotógrafo · 1–2 azafatas', precio: '2.000–5.000€' },
                  { tipo: 'Evento grande (+150 pax)', personal: '8+ camareros · 1 DJ + asistente · 1–2 fotógrafos · 3+ azafatas · coordinador', precio: '5.000–15.000€' },
                ].map(e => (
                  <div key={e.tipo} className="p-4 rounded-xl" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
                    <p className="text-xs font-bold mb-2" style={{ color: '#D4AF37' }}>{e.tipo}</p>
                    <p className="text-xs mb-3" style={{ color: '#8E8EA0' }}>{e.personal}</p>
                    <p className="text-sm font-black" style={{ color: '#D4AF37' }}>{e.precio}</p>
                    <p className="text-[0.65rem]" style={{ color: 'rgba(255,255,255,0.3)' }}>solo personal</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">Cómo contratar: paso a paso</h2>
              <div className="space-y-4">
                {[
                  { n: '01', title: 'Define el briefing del evento', desc: 'Fecha, ubicación, número de invitados, tipo de evento (boda, corporativo, cumpleaños) y tono (formal, informal, temático). Sin un briefing claro, los presupuestos serán imprecisos.' },
                  { n: '02', title: 'Identifica qué perfiles necesitas', desc: 'Usa la tabla de arriba como referencia. Distingue entre perfiles imprescindibles (camareros, DJ) y mejoras opcionales (azafatas, maquilladora). Prioriza según presupuesto.' },
                  { n: '03', title: 'Busca y compara profesionales', desc: 'Plataformas como XPEAK permiten ver perfiles, tarifas y portafolios antes de contactar. Pide siempre 2-3 presupuestos para comparar. Para eventos urgentes, usa Flash Booking.' },
                  { n: '04', title: 'Negocia y confirma por escrito', desc: 'Precio, horario, funciones y condiciones de cancelación. Aunque sea informal, pide confirmación por email o mensaje. Los malentendidos verbales son la causa nº1 de problemas.' },
                  { n: '05', title: 'Coordina el día del evento', desc: 'Comparte el plan del día con todos los proveedores. Define quién es el punto de contacto único. Un coordinador de sala ahorra problemas en eventos medianos y grandes.' },
                ].map(step => (
                  <div key={step.n} className="flex gap-4 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <span className="text-2xl font-black flex-shrink-0" style={{ color: 'rgba(212,175,55,0.2)' }}>{step.n}</span>
                    <div>
                      <p className="text-sm font-bold mb-1">{step.title}</p>
                      <p className="text-xs leading-relaxed" style={{ color: '#8E8EA0' }}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">Checklist: 10 cosas que debes confirmar antes de firmar</h2>
              <div className="space-y-2">
                {CHECKLIST.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-[0.6rem] font-black flex-shrink-0 mt-0.5" style={{ background: 'rgba(212,175,55,0.12)', color: '#D4AF37' }}>{i + 1}</span>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>{item}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">¿Agencia o freelance?</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { tipo: 'Freelance / Autónomo', pros: ['Precio más ajustado', 'Trato directo', 'Mayor flexibilidad', 'Historial verificable en plataformas'], contras: ['Sin sustituto si enferma', 'Menos garantía formal', 'Tienes que coordinar a cada uno'], precio: 'Ahorro del 20-40% vs agencia' },
                  { tipo: 'Agencia de eventos', pros: ['Bolsa de sustitutos', 'Un solo interlocutor', 'Gestión de contratos incluida', 'Seguros de responsabilidad'], contras: ['Precio más alto', 'Menos personalización', 'Menor control del perfil asignado'], precio: '+20-40% sobre tarifa de freelance' },
                ].map(op => (
                  <div key={op.tipo} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <p className="text-sm font-black mb-3" style={{ color: '#D4AF37' }}>{op.tipo}</p>
                    <p className="text-[0.65rem] font-bold uppercase tracking-wider mb-1.5" style={{ color: '#22c55e' }}>Ventajas</p>
                    <ul className="space-y-1 mb-3">{op.pros.map(p => <li key={p} className="text-xs flex items-start gap-1.5"><span style={{ color: '#22c55e' }}>✓</span> <span style={{ color: '#8E8EA0' }}>{p}</span></li>)}</ul>
                    <p className="text-[0.65rem] font-bold uppercase tracking-wider mb-1.5" style={{ color: '#ff5f56' }}>Inconvenientes</p>
                    <ul className="space-y-1 mb-3">{op.contras.map(c => <li key={c} className="text-xs flex items-start gap-1.5"><span style={{ color: '#ff5f56' }}>·</span> <span style={{ color: '#8E8EA0' }}>{c}</span></li>)}</ul>
                    <p className="text-xs font-bold px-2 py-1 rounded-lg inline-block" style={{ background: 'rgba(212,175,55,0.08)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }}>{op.precio}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-3">
                {faqStructured.mainEntity.map(q => (
                  <details key={q.name} className="group rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                    <summary className="flex items-center justify-between px-4 py-3.5 cursor-pointer text-sm font-bold list-none" style={{ background: 'rgba(255,255,255,0.02)' }}>
                      {q.name}
                      <span className="text-xs ml-3 flex-shrink-0" style={{ color: '#D4AF37' }}>+</span>
                    </summary>
                    <div className="px-4 py-3 text-sm leading-relaxed" style={{ color: '#8E8EA0', background: 'rgba(0,0,0,0.2)' }}>
                      {q.acceptedAnswer.text}
                    </div>
                  </details>
                ))}
              </div>
            </section>

            <section className="rounded-2xl p-6 text-center" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)' }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#D4AF37' }}>Encuentra personal verificado en XPEAK</p>
              <h3 className="text-xl font-black mb-3">DJs, camareros, fotógrafos, azafatas y más</h3>
              <p className="text-sm mb-5" style={{ color: '#8E8EA0' }}>Perfiles reales con portfolio, tarifas visibles y contacto directo. Sin comisiones de intermediario.</p>
              <a href="/auth" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                Ver profesionales disponibles →
              </a>
            </section>

            <section>
              <h2 className="text-base font-black mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>Artículos relacionados</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { href: '/blog/staff-para-eventos', cat: 'Hub Staff', title: 'Staff para eventos: guía completa 2026' },
                  { href: '/blog/cuanto-cobra-un-camarero-de-eventos', title: 'Cuánto cobra un camarero de eventos' },
                  { href: '/blog/precio-azafatas-eventos-espana', title: 'Precio de azafatas para eventos en España' },
                  { href: '/blog/contratar-fotografo-de-bodas', title: 'Cómo contratar un fotógrafo de bodas' },
                  { href: '/blog/como-organizar-evento-corporativo', title: 'Cómo organizar un evento corporativo' },
                ].map(a => (
                  <a key={a.href} href={a.href} className="p-3 rounded-lg text-sm font-medium transition-all hover:scale-[1.01]" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)' }}>
                    {a.title} →
                  </a>
                ))}
              </div>
            </section>
          </div>
                  <BlogEmailCapture variant="presupuestos" intent="general" articlePath="/blog/como-contratar-personal-para-un-evento" />
</main>
        <BlogAuthor />
        <FooterPublic />
      </div>
    </>
  );
}
