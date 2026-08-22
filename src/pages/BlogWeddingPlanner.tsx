import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Wedding Planner: precio y qué hace en España (2026)', description: 'Cuánto cobra un wedding planner en España. Precios por paquete, diferencias entre coordinador y planificador integral, y cómo elegir el perfecto para tu boda.', datePublished: '2026-05-07',
  dateModified: '2026-05-25', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/wedding-planner-precio-espana' };

const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cobra un wedding planner en España?', acceptedAnswer: { '@type': 'Answer', text: 'El precio de un wedding planner en España varía entre 800€ y 6.000€ según el paquete. La coordinación del día cuesta entre 800€ y 2.000€. La planificación parcial (últimos 3 meses) ronda los 1.500–3.500€. La planificación integral desde cero suele costar entre 3.000€ y 8.000€ o un porcentaje del presupuesto total de la boda (normalmente entre el 8% y el 15%).' } },
  { '@type': 'Question', name: '¿Qué hace exactamente un wedding planner?', acceptedAnswer: { '@type': 'Answer', text: 'Un wedding planner coordina todos los proveedores de la boda (catering, DJ, fotógrafo, floristería, etc.), gestiona el timeline del evento, negocia contratos en nombre de los novios, supervisa el montaje y está presente el día de la boda para resolver cualquier imprevisto. Según el paquete, puede encargarse de la búsqueda de espacios, el diseño de la decoración o simplemente coordinar el día.' } },
  { '@type': 'Question', name: '¿Vale la pena contratar un wedding planner?', acceptedAnswer: { '@type': 'Answer', text: 'Para bodas de más de 60 invitados o presupuesto superior a 15.000€, el wedding planner suele amortizarse: ahorra entre 10% y 20% en proveedores gracias a descuentos por volumen, evita errores costosos de última hora y libera a los novios del estrés logístico. Para bodas pequeñas o íntimas, un coordinador del día puede ser suficiente.' } },
  { '@type': 'Question', name: '¿Cuál es la diferencia entre wedding planner y coordinador del día?', acceptedAnswer: { '@type': 'Answer', text: 'El coordinador del día (o "day-of coordinator") solo actúa durante las últimas semanas antes de la boda y el día del evento para ejecutar un plan ya organizado por los propios novios. El wedding planner integral gestiona todo el proceso desde el principio: busca proveedores, negocia, acompaña en visitas y diseña la experiencia completa.' } },
  { '@type': 'Question', name: '¿Con cuánto tiempo de antelación hay que contratar un wedding planner?', acceptedAnswer: { '@type': 'Answer', text: 'Para bodas en temporada alta (mayo–octubre) se recomienda contratar el wedding planner con 12–18 meses de antelación. Para coordinadores de día, 4–6 meses es suficiente. Los mejores planificadores de bodas en España se agotan rápidamente en fin de semana de temporada alta, especialmente en Madrid, Barcelona y el Mediterráneo.' } },
] };

const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Wedding Planner precio España', item: 'https://xpeak.es/blog/wedding-planner-precio-espana' }] };

const PRECIOS = [
  { paquete: 'Coordinación del día', precio: '800–2.000€', incluye: 'Presencia el día de la boda, gestión de proveedores y timeline' },
  { paquete: 'Planificación parcial (3 meses)', precio: '1.500–3.500€', incluye: 'Revisión de contratos, confirmación de proveedores, coordinación completa el día' },
  { paquete: 'Planificación integral', precio: '3.000–8.000€', incluye: 'Búsqueda de espacio, selección de proveedores, diseño, presencia completa' },
  { paquete: 'Porcentaje sobre presupuesto', precio: '8–15% del total', incluye: 'Planificación integral para bodas de gran presupuesto (>40.000€)' },
  { paquete: 'Diseño y decoración', precio: '1.500–5.000€', incluye: 'Concepto visual, coordinación con floristería, montaje decorativo' },
  { paquete: 'Destino (boda fuera de ciudad)', precio: '+500–2.000€', incluye: 'Suplemento por desplazamiento, gestión logística de proveedores locales' },
];

const CHECKLIST = [
  { fase: '12–18 meses antes', tareas: ['Fijar fecha y presupuesto total', 'Contratar wedding planner', 'Reservar espacio o finca', 'Definir número aproximado de invitados'] },
  { fase: '9–12 meses antes', tareas: ['Contratar catering', 'Reservar fotógrafo y videógrafo', 'Elegir DJ o banda', 'Visitar floristería y definir estilo'] },
  { fase: '6–9 meses antes', tareas: ['Enviar invitaciones', 'Contratar personal de sala', 'Elegir vestido y traje', 'Definir menú con el catering'] },
  { fase: '1–3 meses antes', tareas: ['Confirmar todos los proveedores', 'Ensayo de ceremonia', 'Plan B para lluvia', 'Entrega de timeline al planner'] },
  { fase: 'Semana de la boda', tareas: ['Reunión final con el planner', 'Confirmar llegadas y horarios', 'Preparar sobres con pagos finales', 'Descansar — el planner se encarga del resto'] },
];

export default function BlogWeddingPlanner() {
  return (
    <>
      <Helmet>
        <title>Wedding Planner: precio en España 2026 | XPEAK</title>
        <meta name="description" content="¿Cuánto cobra un wedding planner en España? Precios por paquete, diferencias entre coordinador y planificador integral, y checklist completo para tu boda." />
        <link rel="canonical" href="https://xpeak.es/blog/wedding-planner-precio-espana" />
        <meta property="og:title" content="Wedding Planner: precio y qué hace en España (2026)" />
        <meta property="og:description" content="Precios reales de wedding planners en España. Coordinación del día, planificación parcial e integral. Guía completa 2026." />
        <meta property="og:url" content="https://xpeak.es/blog/wedding-planner-precio-espana" />
        <meta property="og:type" content="article" /><meta property="og:image" content="https://xpeak.es/og-image.jpg" /><meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" /><meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>
      <div className="min-h-screen" style={{ background: '#ffffff', color: '#111' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-3xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#6D28D9' }}>XPEAK</a>
          <div className="flex items-center gap-3">
            <a href="/blog" className="text-xs font-bold" style={{ color: '#3d3d4e' }}>Blog</a>
            <a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#6D28D9,#B8941E)', color: '#000' }}>Unirse gratis</a>
          </div>
        </nav>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>

          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#6D28D9' }}>Bodas · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Wedding Planner en España: precio y qué hace exactamente (2026)</h1>
            <p className="text-base leading-relaxed" style={{ color: '#3d3d4e' }}>Contratar un wedding planner puede ser la diferencia entre una boda perfecta y el caos. Aquí tienes los precios reales por tipo de servicio, qué incluye cada modalidad y cómo saber cuándo merece la pena.</p>
            <time className="text-xs mt-3 block" style={{ color: '#666' }}>7 mayo 2026</time>
          </div>

          <div className="space-y-10">

            {/* TABLA DE PRECIOS */}
            <section>
              <h2 className="text-lg font-black mb-4">Precios de wedding planner en España (2026)</h2>
              <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                <table className="w-full text-xs">
                  <thead>
                    <tr style={{ background: 'rgba(109,40,217,0.08)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                      <th className="text-left px-4 py-3 font-bold">Modalidad</th>
                      <th className="px-4 py-3 font-bold text-right">Precio</th>
                      <th className="px-4 py-3 font-bold text-left hidden sm:table-cell">Qué incluye</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PRECIOS.map((row, i) => (
                      <tr key={row.paquete} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                        <td className="px-4 py-3 font-medium">{row.paquete}</td>
                        <td className="px-4 py-3 text-right font-bold whitespace-nowrap" style={{ color: '#6D28D9' }}>{row.precio}</td>
                        <td className="px-4 py-3 hidden sm:table-cell" style={{ color: '#3d3d4e' }}>{row.incluye}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs mt-3" style={{ color: '#333' }}>Precios orientativos sin IVA (21%). Pueden variar según ciudad, experiencia y complejidad de la boda.</p>
            </section>

            {/* QUÉ HACE */}
            <section>
              <h2 className="text-lg font-black mb-3">¿Qué hace un wedding planner? Funciones reales</h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#222' }}>El wedding planner no es solo "alguien que decora". Sus funciones varían mucho según el paquete contratado, pero en la planificación integral suelen incluir:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: '📋', title: 'Gestión de proveedores', desc: 'Búsqueda, negociación de precios y firma de contratos con todos los proveedores.' },
                  { icon: '📅', title: 'Timeline del día', desc: 'Plan minuto a minuto de la boda: llegadas, ceremonias, banquete y fiesta.' },
                  { icon: '🎨', title: 'Diseño y concepto', desc: 'En modalidades premium incluye dirección artística, paleta de colores y decoración.' },
                  { icon: '💸', title: 'Control del presupuesto', desc: 'Seguimiento de pagos, señales y facturación para no salirse del presupuesto.' },
                  { icon: '🚨', title: 'Gestión de imprevistos', desc: 'Plan B ante lluvia, cancelaciones de última hora o retrasos de proveedores.' },
                  { icon: '📍', title: 'Presencia el día de la boda', desc: 'Coordinación in situ para que los novios no tengan que preocuparse de nada.' },
                ].map(f => (
                  <div key={f.title} className="p-4 rounded-xl flex gap-3" style={{ background: 'rgba(0,0,0,0.025)', border: '1px solid rgba(0,0,0,0.06)' }}>
                    <span className="text-xl flex-shrink-0">{f.icon}</span>
                    <div>
                      <h3 className="text-xs font-bold mb-1">{f.title}</h3>
                      <p className="text-sm leading-relaxed" style={{ color: '#3d3d4e' }}>{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* COORDINADOR VS PLANNER */}
            <section>
              <h2 className="text-lg font-black mb-3">Coordinador del día vs Wedding Planner integral: ¿cuál necesitas?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Coordinador del día',
                    precio: '800–2.000€',
                    ideal: 'Bodas organizadas por los propios novios que necesitan apoyo solo el día del evento',
                    pros: ['Precio muy asequible', 'Libera a los novios el día de la boda', 'Ideal si ya tienes todos los proveedores cerrados'],
                    contras: ['No negocia proveedores', 'No hace seguimiento de meses', 'Llega cuando el trabajo ya está hecho'],
                    c: '#60a5fa',
                  },
                  {
                    title: 'Wedding Planner integral',
                    precio: '3.000–8.000€',
                    ideal: 'Bodas de más de 80 invitados o presupuesto superior a 20.000€',
                    pros: ['Ahorra dinero negociando proveedores', 'Elimina el estrés durante meses', 'Experiencia con imprevistos y soluciones'],
                    contras: ['Inversión inicial alta', 'Necesitas confiar en su criterio', 'Proceso de selección importante'],
                    c: '#6D28D9',
                  },
                ].map(d => (
                  <div key={d.title} className="p-5 rounded-xl" style={{ background: 'rgba(0,0,0,0.025)', border: `1px solid ${d.c}30` }}>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-sm font-black">{d.title}</h3>
                      <span className="text-xs font-bold" style={{ color: d.c }}>{d.precio}</span>
                    </div>
                    <p className="text-sm mb-3 leading-relaxed" style={{ color: '#3d3d4e' }}>{d.ideal}</p>
                    <div className="space-y-1 mb-3">
                      {d.pros.map(p => <p key={p} className="text-xs flex gap-2" style={{ color: '#222' }}><span style={{ color: '#22c55e' }}>✓</span>{p}</p>)}
                    </div>
                    <div className="space-y-1">
                      {d.contras.map(c => <p key={c} className="text-xs flex gap-2" style={{ color: '#222' }}><span style={{ color: '#ff5f56' }}>✗</span>{c}</p>)}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* FACTORES DE PRECIO */}
            <section>
              <h2 className="text-lg font-black mb-3">¿Qué factores influyen en el precio del wedding planner?</h2>
              <div className="space-y-3">
                {[
                  { factor: 'Número de invitados', detalle: 'A más invitados, más proveedores y más complejidad logística. Una boda de 200 personas requiere el doble de coordinación que una de 80.' },
                  { factor: 'Experiencia y reputación', detalle: 'Los planificadores con más de 5 años de experiencia y cartera de referencias cobran entre un 30% y un 50% más. La reputación tiene precio porque evita errores costosos.' },
                  { factor: 'Ciudad y temporada', detalle: 'Madrid y Barcelona son un 20–30% más caros que el resto de España. Mayo–septiembre (temporada alta) puede suponer un suplemento del 10–15%.' },
                  { factor: 'Complejidad de la boda', detalle: 'Bodas destino, ceremonias en idioma extranjero, proveedores internacionales o eventos de varios días multiplican el trabajo y el precio.' },
                  { factor: 'Servicios adicionales', detalle: 'Diseño floral, dirección artística, iluminación especial o gestión de invitados VIP se presupuestan como extras sobre el paquete base.' },
                ].map((item, i) => (
                  <div key={item.factor} className="flex gap-4 p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.025)', border: '1px solid rgba(0,0,0,0.06)' }}>
                    <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black" style={{ background: 'rgba(109,40,217,0.15)', color: '#6D28D9' }}>{i + 1}</div>
                    <div>
                      <h3 className="text-xs font-bold mb-1">{item.factor}</h3>
                      <p className="text-sm leading-relaxed" style={{ color: '#3d3d4e' }}>{item.detalle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* CHECKLIST */}
            <section>
              <h2 className="text-lg font-black mb-4">Checklist de planificación de boda (con wedding planner)</h2>
              <div className="space-y-4">
                {CHECKLIST.map((fase) => (
                  <div key={fase.fase} className="p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.025)', border: '1px solid rgba(0,0,0,0.06)' }}>
                    <h3 className="text-xs font-black mb-3 uppercase tracking-wide" style={{ color: '#6D28D9' }}>{fase.fase}</h3>
                    <ul className="space-y-1.5">
                      {fase.tareas.map(t => (
                        <li key={t} className="text-xs flex items-start gap-2" style={{ color: '#222' }}>
                          <span className="w-3.5 h-3.5 rounded border flex-shrink-0 mt-0.5" style={{ borderColor: 'rgba(109,40,217,0.3)' }} />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* PREGUNTAS A HACER */}
            <section>
              <h2 className="text-lg font-black mb-3">10 preguntas que debes hacer antes de contratar un wedding planner</h2>
              <div className="space-y-2">
                {[
                  '¿Cuántas bodas gestionas al mismo tiempo?',
                  '¿Estarás tú personalmente el día de la boda o vendrá un asistente?',
                  '¿Tienes comisiones de los proveedores que me recomiendas?',
                  '¿Puedo elegir mis propios proveedores o debo usar los tuyos?',
                  '¿Qué pasa si te pones enferma el día de la boda?',
                  '¿Cuántas reuniones están incluidas en el precio?',
                  '¿Tienes seguro de responsabilidad civil?',
                  '¿Puedo hablar con novios anteriores como referencia?',
                  '¿Cómo gestionas los cambios de último minuto?',
                  '¿Qué no incluye tu paquete y qué se factura aparte?',
                ].map((q, i) => (
                  <div key={q} className="flex gap-3 p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <span className="text-xs font-black w-5 flex-shrink-0" style={{ color: '#6D28D9' }}>{i + 1}.</span>
                    <p className="text-xs" style={{ color: '#111' }}>{q}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* VALE LA PENA */}
            <section>
              <h2 className="text-lg font-black mb-3">¿Vale la pena contratar un wedding planner?</h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#222' }}>Depende del tipo de boda. Hay dos escenarios claros donde el wedding planner se amortiza solo:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="p-5 rounded-xl" style={{ background: 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.15)' }}>
                  <h3 className="text-xs font-bold mb-3" style={{ color: '#22c55e' }}>Cuando SÍ merece la pena</h3>
                  <ul className="space-y-2">
                    {['Más de 80 invitados', 'Presupuesto superior a 20.000€', 'Boda en destino fuera de tu ciudad', 'Ambos trabajáis y no tenéis tiempo', 'Boda en más de un día o en varios espacios'].map(p => (
                      <li key={p} className="text-xs flex gap-2" style={{ color: '#222' }}><span style={{ color: '#22c55e' }}>→</span>{p}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-5 rounded-xl" style={{ background: 'rgba(255,95,86,0.04)', border: '1px solid rgba(255,95,86,0.15)' }}>
                  <h3 className="text-xs font-bold mb-3" style={{ color: '#ff5f56' }}>Cuando puede no necesitarlo</h3>
                  <ul className="space-y-2">
                    {['Boda íntima de menos de 40 personas', 'Presupuesto ajustado (menos de 10.000€)', 'Finca con coordinadora incluida', 'Familia muy implicada en la organización', 'Os gusta organizar y tenéis tiempo libre'].map(p => (
                      <li key={p} className="text-xs flex gap-2" style={{ color: '#222' }}><span style={{ color: '#ff5f56' }}>→</span>{p}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="p-4 rounded-xl" style={{ background: 'rgba(109,40,217,0.06)', border: '1px solid rgba(109,40,217,0.15)' }}>
                <p className="text-sm leading-relaxed" style={{ color: '#111' }}>
                  <strong style={{ color: '#6D28D9' }}>Dato clave:</strong> Un buen wedding planner negocia descuentos con proveedores habituales que suelen cubrir entre el 30% y el 70% de su propio honorario. En bodas con presupuesto de 30.000€, un ahorro del 10% en proveedores ya supera los 3.000€ — lo que cuesta el planificador.
                </p>
              </div>
            </section>

            {/* FAQ */}
            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">
                {faqStructured.mainEntity.map((q) => (
                  <div key={q['@type']} className="p-5 rounded-xl" style={{ background: 'rgba(0,0,0,0.025)', border: '1px solid rgba(0,0,0,0.06)' }}>
                    <h3 className="text-sm font-bold mb-2">{q.name}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#3d3d4e' }}>{q.acceptedAnswer.text}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ARTÍCULOS RELACIONADOS */}
            <section>
              <h2 className="text-lg font-black mb-4">Artículos relacionados</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { href: '/blog/profesionales-bodas', tag: 'Hub Bodas', title: 'Profesionales para bodas: guía completa 2026', desc: 'DJ, fotógrafo, catering y más. Todo lo que necesitas para tu boda.' },
                  { href: '/blog/cuanto-cuesta-una-boda-en-espana', title: 'Presupuesto completo de boda en España 2026', tag: 'Bodas' },
                  { href: '/blog/catering-boda-precio-por-persona', title: 'Catering de boda: precio por persona', tag: 'Catering' },
                  { href: '/blog/cuanto-cobra-un-dj-en-espana', title: 'Cuánto cobra un DJ para bodas', tag: 'DJ' },
                  { href: '/blog/contratar-fotografo-de-bodas', title: 'Cómo contratar fotógrafo de bodas', tag: 'Fotografía' },
                ].map(a => (
                  <a key={a.href} href={a.href} className="p-4 rounded-xl transition-all hover:scale-[1.02]" style={{ background: 'rgba(0,0,0,0.025)', border: '1px solid rgba(0,0,0,0.06)', display: 'block', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-wider mb-1 block" style={{ color: '#6D28D9' }}>{a.tag}</span>
                    <span className="text-xs font-bold" style={{ color: '#111' }}>{a.title}</span>
                  </a>
                ))}
              </div>
            </section>

            {/* CTA */}
            <div className="p-6 sm:p-8 rounded-2xl text-center" style={{ background: 'rgba(109,40,217,0.06)', border: '1px solid rgba(109,40,217,0.2)' }}>
              <h2 className="text-lg font-black mb-2">¿Eres wedding planner o profesional de eventos?</h2>
              <p className="text-sm mb-5" style={{ color: '#3d3d4e' }}>Crea tu perfil en XPEAK y recibe solicitudes de bodas y eventos en toda España. Gratis.</p>
              <a href="/auth" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#6D28D9,#B8941E)', color: '#000' }}>
                Crear perfil profesional gratis
              </a>
            </div>

          </div>
                  <BlogEmailCapture variant="presupuestos" intent="contratar-staff" articlePath="/blog/wedding-planner-precio-espana" />
</main>
        <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/wedding-planner-precio-espana' tag='Eventos' />
        <FooterPublic />
        <BlogScrollCTA role="empresario" storageKey="xpeak_scrollcta_wedding_planner" />
      </div>
    </>
  );
}
