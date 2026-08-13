import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Cómo organizar una fiesta de empresa: checklist completo y proveedores (2026)', description: 'Guía paso a paso para organizar la fiesta de empresa perfecta. Checklist, presupuesto, proveedores y timeline. Todo lo que necesitas saber para el evento de fin de año.', datePublished: '2026-05-04',
  dateModified: '2026-05-25', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/como-organizar-fiesta-empresa' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cuesta organizar una fiesta de empresa?', acceptedAnswer: { '@type': 'Answer', text: 'El presupuesto de una fiesta de empresa en España varía entre 40€ y 150€ por persona dependiendo del formato. Una cena de empresa con DJ en restaurante cuesta entre 50€ y 80€/persona. Alquilar un espacio exclusivo con catering, DJ y personal puede superar los 100–120€/persona. Para 50 empleados, el presupuesto habitual ronda los 3.000€ a 8.000€.' } },
  { '@type': 'Question', name: '¿Con cuánta antelación organizar la fiesta de empresa?', acceptedAnswer: { '@type': 'Answer', text: 'Para fiestas de fin de año (noviembre-diciembre) es imprescindible empezar a organizar en agosto-septiembre. Los espacios y DJs para diciembre se reservan con 3-4 meses de antelación mínimo. Para eventos de team building o celebraciones puntuales fuera de temporada alta, 4-6 semanas es suficiente.' } },
  { '@type': 'Question', name: '¿Qué proveedores necesito para una fiesta de empresa?', acceptedAnswer: { '@type': 'Answer', text: 'Los básicos son: espacio o local, catering (o restaurante con menú cerrado), DJ o música, y personal de sala si no lo incluye el espacio. Opcionales según el presupuesto: fotógrafo, animador o showman, photocall, transporte, y coordinador de eventos. Para más de 100 personas es muy recomendable contratar un coordinador.' } },
  { '@type': 'Question', name: '¿Cuál es el formato más habitual para la fiesta de empresa en España?', acceptedAnswer: { '@type': 'Answer', text: 'La cena de empresa en restaurante con menú cerrado y DJ posterior es el formato más contratado en España. Le sigue el cóctel en espacio exclusivo (discoteca privada, azotea, finca) y el team building con actividad de día + cena. En 2026 hay una tendencia creciente hacia experiencias más originales: cenas con chef privado, escape rooms colectivos y eventos deportivos.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Cómo organizar fiesta de empresa', item: 'https://xpeak.es/blog/como-organizar-fiesta-empresa' }] };

const CHECKLIST = [
  { fase: '3-4 meses antes', items: ['Definir presupuesto total por persona', 'Elegir fecha y formato del evento', 'Reservar espacio / local', 'Contratar DJ o música'] },
  { fase: '2 meses antes', items: ['Cerrar catering o restaurante', 'Contratar personal de sala si aplica', 'Confirmar número de asistentes', 'Enviar invitaciones internas'] },
  { fase: '1 mes antes', items: ['Confirmar todos los proveedores', 'Cerrar menú definitivo con alergias', 'Planificar timing del evento', 'Preparar decoración y photocall'] },
  { fase: 'Semana del evento', items: ['Confirmar asistencia final', 'Briefing con todos los proveedores', 'Revisar acceso y logística del espacio', 'Preparar detalles para los empleados'] },
];

const PRESUPUESTO = [
  { partida: 'Espacio / alquiler', porcentaje: '15–25%', ejemplo: '500–2.000€ según aforo' },
  { partida: 'Catering / restaurante', porcentaje: '40–50%', ejemplo: '30–70€/persona' },
  { partida: 'DJ o música', porcentaje: '10–15%', ejemplo: '400–900€ para 4-5h' },
  { partida: 'Personal de sala', porcentaje: '8–12%', ejemplo: '15–20€/h por camarero' },
  { partida: 'Decoración', porcentaje: '5–10%', ejemplo: '200–500€ básico' },
  { partida: 'Fotografía / extras', porcentaje: '5–8%', ejemplo: 'Opcional pero muy recomendado' },
];

export default function BlogFiestaEmpresa() {
  return (
    <>
      <Helmet>
        <title>Fiesta de empresa: cómo organizarla 2026 | XPEAK</title>
        <meta name="description" content="Guía completa para organizar la fiesta de empresa. Checklist por fases, presupuesto por partidas y qué proveedores necesitas. Ideal para cenas de fin de año y team building." />
        <link rel="canonical" href="https://xpeak.es/blog/como-organizar-fiesta-empresa" />
        <meta property="og:title" content="Organizar fiesta de empresa: checklist 2026 — XPEAK Blog" />
        <meta property="og:description" content="Checklist completo, presupuesto y proveedores para organizar la fiesta de empresa perfecta en España." />
        <meta property="og:url" content="https://xpeak.es/blog/como-organizar-fiesta-empresa" />
        <meta property="og:type" content="article" /><meta property="og:image" content="https://xpeak.es/og-image.jpg" /><meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" /><meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>
      <div className="min-h-screen" style={{ background: '#090909', color: '#fff' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-3xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#D4AF37' }}>XPEAK</a>
          <div className="flex items-center gap-3">
            <a href="/blog" className="text-xs font-bold" style={{ color: '#3d3d4e' }}>Blog</a>
            <a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Unirse gratis</a>
          </div>
        </nav>
        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>Eventos · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Cómo organizar una fiesta de empresa: checklist completo y proveedores (2026)</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#3d3d4e' }}>La fiesta de empresa es el evento más estresante del año para quien lo organiza. Con este checklist por fases y la guía de presupuesto, no se te escapa nada.</p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>4 mayo 2026</time>
          </div>
          <div className="space-y-10">

            <section>
              <h2 className="text-lg font-black mb-5">Checklist por fases</h2>
              <div className="space-y-4">
                {CHECKLIST.map(fase => (
                  <div key={fase.fase} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-xs font-black mb-3" style={{ color: '#D4AF37' }}>{fase.fase}</p>
                    <ul className="space-y-2">
                      {fase.items.map(item => (
                        <li key={item} className="flex items-start gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.75)' }}>
                          <span className="flex-shrink-0 mt-0.5 w-3.5 h-3.5 rounded border flex items-center justify-center" style={{ borderColor: 'rgba(212,175,55,0.4)' }}></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">Cómo distribuir el presupuesto</h2>
              <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <table className="w-full text-xs">
                  <thead><tr style={{ background: 'rgba(212,175,55,0.08)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}><th className="text-left px-4 py-3 font-bold">Partida</th><th className="px-4 py-3 font-bold text-right">% del total</th><th className="px-4 py-3 font-bold text-left hidden sm:table-cell">Referencia</th></tr></thead>
                  <tbody>{PRESUPUESTO.map((row, i) => (<tr key={row.partida} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="px-4 py-3 font-medium">{row.partida}</td><td className="px-4 py-3 text-right font-bold" style={{ color: '#D4AF37' }}>{row.porcentaje}</td><td className="px-4 py-3 hidden sm:table-cell" style={{ color: '#3d3d4e' }}>{row.ejemplo}</td></tr>))}</tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">Formatos más contratados en España</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { formato: 'Cena en restaurante + DJ', popularidad: '★★★★★', desc: 'El clásico de fin de año. Menú cerrado, espacio privado y DJ para la sobremesa. Lo más contratado.' },
                  { formato: 'Cóctel en espacio exclusivo', popularidad: '★★★★☆', desc: 'Rooftop, finca o club privado con barra libre y catering de pie. Más informal y dinámico.' },
                  { formato: 'Team building + cena', popularidad: '★★★★☆', desc: 'Actividad de día (karting, escape room, cocina) seguida de cena de empresa. Refuerza la cohesión.' },
                  { formato: 'Evento con showman o actuación', popularidad: '★★★☆☆', desc: 'Monologuista, mago o artista como elemento central del evento. Añade un factor WOW diferencial.' },
                ].map(f => (
                  <div key={f.formato} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-bold">{f.formato}</p>
                      <span className="text-[0.6rem]" style={{ color: '#D4AF37' }}>{f.popularidad}</span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{f.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">{faqStructured.mainEntity.map(f => (<div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}><h3 className="text-sm font-bold mb-2">{f.name}</h3><p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>{f.acceptedAnswer.text}</p></div>))}</div>
            </section>

            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Buscas DJ o camareros para tu fiesta de empresa?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>XPEAK conecta con DJs, camareros y staff verificado para eventos corporativos en toda España. Presupuesto en minutos.</p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <a href="/contratar-dj" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Ver DJs →</a>
                <a href="/contratar-camareros" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}>Ver camareros →</a>
              </div>
            </div>
          </div>
                  <BlogEmailCapture variant="presupuestos" intent="contratar-dj" articlePath="/blog/como-organizar-fiesta-empresa" />
</main>
        <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/como-organizar-fiesta-empresa' tag='Eventos' />
        <FooterPublic />
        <BlogScrollCTA role="empresario" storageKey="xpeak_scrollcta_fiesta_empresa" />
      </div>
    </>
  );
}
