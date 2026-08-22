import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogAnswerBox from '@/components/BlogAnswerBox';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';

const article = {
  '@context': 'https://schema.org', '@type': 'Article',
  headline: 'Cómo organizar una fiesta de empresa: guía completa y presupuesto 2026',
  description: 'Todo lo que necesitas para organizar una fiesta de empresa exitosa. Presupuesto, checklist, proveedores y errores a evitar en eventos corporativos.',
  datePublished: '2026-06-08', dateModified: '2026-06-08',
  author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' },
  publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
  url: 'https://xpeak.es/blog/como-organizar-fiesta-de-empresa',
};

const breadcrumb = {
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'Cómo organizar fiesta de empresa', item: 'https://xpeak.es/blog/como-organizar-fiesta-de-empresa' },
  ],
};

const faqStructured = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: '¿Cuánto cuesta organizar una fiesta de empresa?', acceptedAnswer: { '@type': 'Answer', text: 'Una fiesta de empresa en España cuesta entre 30€ y 150€ por empleado según el nivel. Un evento para 50 personas con catering, DJ y venue oscila entre 2.500€ y 8.000€. Las empresas suelen destinar 50–80€/persona para la cena de Navidad o team building anual.' } },
    { '@type': 'Question', name: '¿Qué proveedores necesito para una fiesta de empresa?', acceptedAnswer: { '@type': 'Answer', text: 'Los proveedores básicos son: venue o sala de eventos, catering o restaurante, DJ o música en vivo, fotógrafo/videógrafo (opcional), animación o actividades de team building (opcional). Plataformas como XPEAK permiten contratar DJ, staff y media desde un único lugar.' } },
    { '@type': 'Question', name: '¿Con cuánta antelación planificar una fiesta de empresa?', acceptedAnswer: { '@type': 'Answer', text: 'Para la cena de Navidad (el evento más demandado), empieza a buscar venue y proveedores en septiembre-octubre. Para otros eventos corporativos, 6–8 semanas suelen ser suficientes. Los DJs de referencia y venues populares se agotan rápido en diciembre.' } },
  ],
};

const CHECKLIST = [
  { fase: '3–4 meses antes', tareas: ['Definir fecha, presupuesto y nº de asistentes', 'Reservar venue o espacio', 'Confirmar si es cena, cocktail o ambos'] },
  { fase: '6–8 semanas antes', tareas: ['Contratar catering o restaurante', 'Reservar DJ o grupo musical', 'Enviar invitaciones y recoger confirmaciones'] },
  { fase: '2–3 semanas antes', tareas: ['Confirmar menú definitivo y restricciones dietéticas', 'Coordinar logística (transporte, parking)', 'Preparar programa del evento'] },
  { fase: 'Semana del evento', tareas: ['Confirmación final de asistentes al catering', 'Briefing con DJ sobre música y horarios', 'Preparar obsequios o detalles si los hay'] },
];

export default function BlogOrganizarFiestaEmpresa() {
  return (
    <>
      <Helmet>
        <title>Cómo Organizar una Fiesta de Empresa: Guía y Presupuesto 2026 | XPEAK</title>
        <meta name="description" content="Guía completa para organizar una fiesta de empresa en 2026. Presupuesto por persona, checklist de proveedores, errores a evitar y cómo contratar DJ y staff." />
        <link rel="canonical" href="https://xpeak.es/blog/como-organizar-fiesta-de-empresa" />
        <meta property="og:title" content="Cómo Organizar una Fiesta de Empresa: Guía 2026" />
        <meta property="og:url" content="https://xpeak.es/blog/como-organizar-fiesta-de-empresa" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
      </Helmet>
      <div className="min-h-screen" style={{ background: '#ffffff', color: '#111' }}>
        <article className="max-w-3xl mx-auto px-4 py-12">
          <nav className="text-xs text-[#666] mb-6 flex gap-2">
            <a href="/" className="hover:text-[#8A6D0F]">Inicio</a><span>/</span>
            <a href="/blog" className="hover:text-[#8A6D0F]">Blog</a><span>/</span>
            <span className="text-[#333]">Cómo organizar fiesta de empresa</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-black mb-4 leading-tight">Cómo Organizar una Fiesta de Empresa:<br />Guía Completa y Presupuesto 2026</h1>
          <p className="text-[#555] text-sm mb-8">Actualizado junio 2026 · 10 min lectura</p>

          <BlogAnswerBox question="¿Cuánto cuesta organizar una fiesta de empresa?">
            Organizar una fiesta de empresa cuesta entre <strong>30€ y 150€ por persona</strong>. Para un evento de 50 personas con venue, catering y DJ el presupuesto típico es 3.000–7.000€. La cena de Navidad suele ser el evento más caro del año para las empresas.
          </BlogAnswerBox>

          <p className="text-[#333] mb-6">Una buena fiesta de empresa mejora el clima laboral, refuerza la cultura corporativa y genera recuerdos positivos que fidelizan al equipo. Pero organizarla mal — venue inadecuado, DJ que no conecta, catering con esperas largas — puede tener el efecto contrario.</p>

          <BlogInlineCTA role="dj" text="¿Necesitas DJ para tu evento de empresa? Encuentra artistas con tarifa pública y disponibilidad en XPEAK." />

          <h2 className="text-2xl font-bold mt-10 mb-4">Presupuesto fiesta de empresa 2026: referencia por persona</h2>
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm border-collapse">
              <thead><tr style={{ background: 'rgba(109,40,217,0.08)' }}>
                <th className="text-left p-3 border border-black/[0.08]">Partida</th>
                <th className="text-left p-3 border border-black/[0.08]">Básico</th>
                <th className="text-left p-3 border border-black/[0.08]">Estándar</th>
                <th className="text-left p-3 border border-black/[0.08]">Premium</th>
              </tr></thead>
              <tbody>
                {[
                  { p: 'Venue / sala', b: '5–10€', s: '10–20€', pr: '20–40€' },
                  { p: 'Catering (cena)', b: '25–40€', s: '45–70€', pr: '80–120€' },
                  { p: 'DJ / música', b: '5–8€', s: '8–15€', pr: '15–30€' },
                  { p: 'Fotografía', b: '—', s: '3–6€', pr: '8–15€' },
                  { p: 'Decoración', b: '2–4€', s: '4–8€', pr: '10–20€' },
                  { p: 'TOTAL/persona', b: '37–62€', s: '70–119€', pr: '133–225€' },
                ].map((r, i) => (
                  <tr key={i} style={{ background: r.p === 'TOTAL/persona' ? 'rgba(109,40,217,0.06)' : i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)' }}>
                    <td className={`p-3 border border-black/[0.08] ${r.p === 'TOTAL/persona' ? 'font-bold' : 'font-medium'}`}>{r.p}</td>
                    <td className="p-3 border border-black/[0.08] text-[#555]">{r.b}</td>
                    <td className="p-3 border border-black/[0.08]" style={{ color: '#6D28D9' }}>{r.s}</td>
                    <td className="p-3 border border-black/[0.08] text-[#555]">{r.pr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">Checklist para organizar una fiesta de empresa</h2>
          {CHECKLIST.map((fase, i) => (
            <div key={i} className="mb-6 p-4 rounded-xl border border-black/[0.08]">
              <h3 className="font-semibold mb-3" style={{ color: '#6D28D9' }}>{fase.fase}</h3>
              <ul className="space-y-2">
                {fase.tareas.map((t, j) => (
                  <li key={j} className="flex items-start gap-2 text-[#333] text-sm">
                    <span className="mt-0.5 w-4 h-4 rounded border border-black/10 shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <BlogEmailCapture variant="general" intent="contratar-dj" articlePath="/blog/como-organizar-fiesta-de-empresa" />

          <h2 className="text-2xl font-bold mt-10 mb-4">Preguntas frecuentes</h2>
          {faqStructured.mainEntity.map((faq, i) => (
            <div key={i} className="mb-5 p-4 rounded-xl border border-black/[0.08]">
              <h3 className="font-semibold text-[#111] mb-2">{faq.name}</h3>
              <p className="text-[#555] text-sm">{faq.acceptedAnswer.text}</p>
            </div>
          ))}
          <BlogAuthor />
          <BlogShare />
        </article>
        <BlogRelatedPosts currentSlug='/blog/como-organizar-fiesta-de-empresa' tag='Eventos' />
        <FooterPublic />
        <BlogScrollCTA role="dj" storageKey="xpeak_scrollcta_organizar_fiesta_empresa" />
      </div>
    </>
  );
}
