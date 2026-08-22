import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';

const article = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Cómo organizar un evento corporativo paso a paso: guía completa 2026',
  description: 'Guía práctica para organizar eventos de empresa en España: presupuesto, proveedores, timeline y checklist completo.',
  datePublished: '2026-05-03',
  dateModified: '2026-05-25',
  author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' },
  publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } },
  image: 'https://xpeak.es/og-image.jpg',
  url: 'https://xpeak.es/blog/como-organizar-evento-corporativo',
};

const faqStructured = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: '¿Cuánto cuesta organizar un evento corporativo en España?', acceptedAnswer: { '@type': 'Answer', text: 'El coste medio oscila entre 50€ y 200€ por invitado para un evento estándar (catering, venue, AV). Un evento de gala o incentivo puede superar los 300€ por persona. El mayor gasto suele ser el venue (30-40% del presupuesto total).' } },
    { '@type': 'Question', name: '¿Con cuánta antelación hay que planificar un evento corporativo?', acceptedAnswer: { '@type': 'Answer', text: 'Para eventos de más de 100 personas, lo ideal es empezar la planificación con 3-6 meses de antelación. Para eventos pequeños (hasta 50 personas) con 4-8 semanas suele ser suficiente, aunque siempre conviene reservar venue y catering cuanto antes.' } },
    { '@type': 'Question', name: '¿Qué proveedores son imprescindibles en un evento corporativo?', acceptedAnswer: { '@type': 'Answer', text: 'Los indispensables son: venue, catering y AV/sonido. Según el formato del evento puede añadirse: DJ o música en directo, fotógrafo, presentador/moderador, azafatas, transporte y decoración.' } },
    { '@type': 'Question', name: '¿Se puede deducir el gasto de un evento de empresa?', acceptedAnswer: { '@type': 'Answer', text: 'Sí, bajo ciertas condiciones. Los gastos de atención a clientes y proveedores son deducibles al 50% en el Impuesto de Sociedades. Los gastos de formación o team building son deducibles al 100% si se acredita la finalidad empresarial. Consulta siempre con tu asesor fiscal.' } },
  ],
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'Cómo organizar un evento corporativo', item: 'https://xpeak.es/blog/como-organizar-evento-corporativo' },
  ],
};

const TIMELINE = [
  { fase: '3–6 meses antes', tareas: ['Definir objetivo y formato del evento', 'Establecer presupuesto total', 'Elegir fecha (evitar puentes y vacaciones)', 'Buscar y reservar el venue', 'Contratar catering y AV/sonido'] },
  { fase: '2–3 meses antes', tareas: ['Confirmar programa y agenda', 'Contratar DJ, fotógrafo, presentador', 'Diseñar invitaciones y comunicación', 'Gestionar inscripciones/asistencia', 'Confirmar requisitos técnicos con venue'] },
  { fase: '4–6 semanas antes', tareas: ['Enviar invitaciones formales', 'Confirmar número exacto de asistentes', 'Cierre de menú con catering', 'Briefing a todos los proveedores', 'Contratar seguro de evento si aplica'] },
  { fase: '1–2 semanas antes', tareas: ['Visita técnica al venue', 'Confirmar horarios con cada proveedor', 'Preparar materiales y decoración', 'Rehearsal si hay presentaciones', 'Plan B para imprevistos (lluvia, técnicos)'] },
  { fase: 'Día del evento', tareas: ['Coordinador presente desde 2h antes', 'Check técnico de AV y sonido', 'Recepción y acreditación de asistentes', 'Seguir el run of show al minuto', 'Fotos de todos los momentos clave'] },
];

const PRESUPUESTO = [
  { partida: 'Venue', porcentaje: '30–40%', nota: 'Mayor variable. Incluye alquiler + tasas.' },
  { partida: 'Catering', porcentaje: '25–35%', nota: 'Coffee breaks, cócteles, cenas.' },
  { partida: 'AV / Sonido / Iluminación', porcentaje: '10–15%', nota: 'Pantallas, micro, streaming.' },
  { partida: 'Entretenimiento (DJ, música)', porcentaje: '5–10%', nota: 'Según formato del evento.' },
  { partida: 'Fotografía / Video', porcentaje: '5–8%', nota: 'Documentación y contenido.' },
  { partida: 'Decoración y señalética', porcentaje: '5–8%', nota: 'Branding del evento.' },
  { partida: 'Imprevistos', porcentaje: '5–10%', nota: 'Siempre reservar este margen.' },
];

export default function BlogEventoCorporativo() {
  return (
    <>
      <Helmet>
        <title>Evento corporativo: guía paso a paso 2026 | XPEAK</title>
        <meta name="description" content="Guía completa para organizar eventos de empresa en España. Presupuesto, proveedores, timeline y checklist completo para tu evento corporativo." />
        <link rel="canonical" href="https://xpeak.es/blog/como-organizar-evento-corporativo" />
        <meta property="og:title" content="Organizar evento corporativo: guía completa 2026 — XPEAK Blog" />
        <meta property="og:description" content="Guía práctica para organizar eventos de empresa en España: presupuesto, proveedores, timeline y checklist completo." />
        <meta property="og:url" content="https://xpeak.es/blog/como-organizar-evento-corporativo" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Organizar evento corporativo: guía 2026 — XPEAK Blog" />
        <meta name="twitter:description" content="Cómo organizar eventos de empresa en España. Presupuesto, proveedores y checklist." />
        <meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>

      <div className="min-h-screen" style={{ background: '#ffffff', color: '#111' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-3xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#6D28D9' }}>XPEAK</a>
          <div className="flex items-center gap-3">
            <a href="/blog" className="text-xs font-bold hidden sm:block" style={{ color: '#3d3d4e' }}>Blog</a>
            <a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#6D28D9,#B8941E)', color: '#000' }}>
              Unirse gratis
            </a>
          </div>
        </nav>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>
            ← Todos los artículos
          </a>

          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#6D28D9' }}>Eventos · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">
              Cómo organizar un evento corporativo paso a paso: guía completa 2026
            </h1>
            <p className="text-base leading-relaxed" style={{ color: '#3d3d4e' }}>
              Desde la definición de objetivos hasta el día del evento. Todo lo que necesitas saber para que tu evento de empresa salga perfecto y dentro de presupuesto.
            </p>
            <time className="text-xs mt-3 block" style={{ color: '#666' }}>3 mayo 2026</time>
          </div>

          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Distribución del presupuesto por partidas</h2>
              <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                <table className="w-full text-xs">
                  <thead>
                    <tr style={{ background: 'rgba(109,40,217,0.08)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                      <th className="text-left px-4 py-3 font-bold">Partida</th>
                      <th className="px-4 py-3 font-bold text-center">% del presupuesto</th>
                      <th className="px-4 py-3 font-bold text-left hidden sm:table-cell">Detalle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PRESUPUESTO.map((row, i) => (
                      <tr key={row.partida} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                        <td className="px-4 py-3 font-medium">{row.partida}</td>
                        <td className="px-4 py-3 text-center font-bold" style={{ color: '#6D28D9' }}>{row.porcentaje}</td>
                        <td className="px-4 py-3 hidden sm:table-cell" style={{ color: '#3d3d4e' }}>{row.nota}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Distribución orientativa. Varía según ciudad, formato y número de invitados.</p>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">Timeline de planificación</h2>
              <div className="space-y-4">
                {TIMELINE.map((fase, i) => (
                  <div key={fase.fase} className="p-5 rounded-xl" style={{ background: 'rgba(0,0,0,0.025)', border: '1px solid rgba(0,0,0,0.05)' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-[0.6rem] font-black shrink-0" style={{ background: 'rgba(109,40,217,0.15)', color: '#6D28D9' }}>{i + 1}</span>
                      <h3 className="text-sm font-black" style={{ color: '#6D28D9' }}>{fase.fase}</h3>
                    </div>
                    <ul className="space-y-1.5">
                      {fase.tareas.map(t => (
                        <li key={t} className="flex items-start gap-2 text-xs" style={{ color: '#222' }}>
                          <span className="mt-1 shrink-0" style={{ color: '#6D28D9' }}>✓</span>
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-black mb-3">Los 3 errores más comunes en eventos corporativos</h2>
              <div className="space-y-3">
                {[
                  { n: '1', titulo: 'No tener coordinador el día del evento', desc: 'El organizador no puede ser coordinador y asistente al mismo tiempo. Siempre asigna a alguien exclusivamente a gestionar proveedores y resolver imprevistos.' },
                  { n: '2', titulo: 'Subestimar el tiempo de AV y montaje', desc: 'Un setup técnico con pantallas, micros inalámbricos y DJ puede necesitar 3-4 horas de montaje. Calcula siempre el doble del tiempo que crees que necesitas.' },
                  { n: '3', titulo: 'No tener plan B para imprevistos', desc: 'Lluvia en un evento al aire libre, DJ enfermo, corte de luz. Define antes qué harás en cada escenario. Los mejores eventos no los diferencia no tener problemas, sino saber resolverlos.' },
                ].map(e => (
                  <div key={e.n} className="p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.025)', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <p className="text-xs font-bold mb-1">{e.n}. {e.titulo}</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#3d3d4e' }}>{e.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
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

            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(109,40,217,0.04)', border: '1px solid rgba(109,40,217,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Necesitas staff, DJ o catering para tu evento corporativo?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>XPEAK conecta organizadores con profesionales verificados en toda España. Contratación rápida, contratos digitales automáticos.</p>
              <a href="/auth" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105"
                style={{ background: 'linear-gradient(90deg,#6D28D9,#B8941E)', color: '#000' }}>
                Buscar profesionales en XPEAK →
              </a>
            </div>
          </div>
                  <BlogEmailCapture variant="presupuestos" intent="general" articlePath="/blog/como-organizar-evento-corporativo" />
</main>
      <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/como-organizar-evento-corporativo' tag='Eventos' />
        <FooterPublic />
        <BlogScrollCTA role="empresario" storageKey="xpeak_scrollcta_evento_corporativo" />
      </div>
    </>
  );
}
