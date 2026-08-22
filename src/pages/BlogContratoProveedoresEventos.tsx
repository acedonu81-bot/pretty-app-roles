import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';

const article = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Contrato con proveedores de eventos: qué debe incluir para estar protegido (2026)',
  description: 'Cláusulas imprescindibles en el contrato con DJ, catering, fotógrafo o cualquier proveedor de eventos: cancelación, pagos, incumplimientos y qué evitar.',
  datePublished: '2026-07-16',
  dateModified: '2026-07-16',
  author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' },
  publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } },
  image: 'https://xpeak.es/og-image.jpg',
  url: 'https://xpeak.es/blog/contrato-proveedores-eventos',
};

const faqStructured = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: '¿Es obligatorio firmar contrato con cada proveedor de un evento?', acceptedAnswer: { '@type': 'Answer', text: 'No es obligatorio por ley, pero sí muy recomendable a partir de presupuestos superiores a 200-300€. Sin contrato, cualquier incumplimiento (cancelación, retraso, servicio distinto al acordado) es mucho más difícil de reclamar.' } },
    { '@type': 'Question', name: '¿Qué pasa si un proveedor cancela días antes del evento?', acceptedAnswer: { '@type': 'Answer', text: 'Depende de lo que diga el contrato. Lo habitual en España: si cancela el proveedor con menos de 15 días de antelación, debe devolver la señal y en muchos casos indemnizar con un porcentaje adicional. Esta cláusula debe quedar explícita antes de firmar, no darse por supuesta.' } },
    { '@type': 'Question', name: '¿Cómo se protege el organizador si el servicio no es el acordado?', acceptedAnswer: { '@type': 'Answer', text: 'Especificando en el contrato exactamente qué se incluye: horas, equipo, número de personas de staff, menú del catering. Cuanto más detallado esté el contrato, más fácil es reclamar si el día del evento el servicio no coincide con lo pactado.' } },
    { '@type': 'Question', name: '¿Se puede generar un contrato de evento sin abogado?', acceptedAnswer: { '@type': 'Answer', text: 'Para servicios estándar (DJ, catering, fotografía, staff) sí, usando una plantilla con las cláusulas básicas: partes, fecha y lugar, precio e IVA, qué incluye, cancelación y forma de pago. Para eventos con presupuestos muy altos o condiciones especiales, conviene revisión legal.' } },
  ],
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'Contrato con proveedores de eventos', item: 'https://xpeak.es/blog/contrato-proveedores-eventos' },
  ],
};

const CLAUSULAS = [
  { clausula: 'Datos de las partes', detalle: 'Nombre o razón social, DNI/NIF y domicilio de ambas partes.' },
  { clausula: 'Fecha, hora y lugar exactos', detalle: 'Incluyendo horas de montaje y desmontaje, no solo la actuación o el servicio.' },
  { clausula: 'Qué incluye el servicio', detalle: 'Equipo, número de personas, duración exacta — cualquier extra debe quedar fuera y con precio aparte.' },
  { clausula: 'Precio total con IVA', detalle: 'Y forma de pago: señal al firmar (30-50%) y resto según lo acordado.' },
  { clausula: 'Cláusula de cancelación', detalle: 'Qué ocurre si cancela el organizador o el proveedor, y en qué plazos.' },
  { clausula: 'Fuerza mayor', detalle: 'Qué pasa si el proveedor no puede prestar el servicio por causas ajenas (enfermedad, accidente).' },
];

export default function BlogContratoProveedoresEventos() {
  return (
    <>
      <Helmet>
        <title>Contrato con proveedores de eventos: qué debe incluir (2026) | XPEAK</title>
        <meta name="description" content="Cláusulas imprescindibles en el contrato con DJ, catering, fotógrafo o cualquier proveedor de eventos: cancelación, pagos e incumplimientos." />
        <link rel="canonical" href="https://xpeak.es/blog/contrato-proveedores-eventos" />
        <meta property="og:title" content="Contrato con proveedores de eventos: qué debe incluir — XPEAK Blog" />
        <meta property="og:description" content="Cláusulas imprescindibles para proteger al organizador en cualquier contrato con proveedores de eventos." />
        <meta property="og:url" content="https://xpeak.es/blog/contrato-proveedores-eventos" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>

      <div className="min-h-screen" style={{ background: '#ffffff', color: '#111' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-3xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#0D9488' }}>XPEAK</a>
          <div className="flex items-center gap-3">
            <a href="/blog" className="text-xs font-bold hidden sm:block" style={{ color: '#3d3d4e' }}>Blog</a>
            <a href="/auth?mode=register&role=empresario" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#0D9488,#B8941E)', color: '#000' }}>
              Unirse gratis
            </a>
          </div>
        </nav>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>

          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#0D9488' }}>Organizadores · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Contrato con proveedores de eventos: qué debe incluir para estar protegido</h1>
            <p className="text-base leading-relaxed" style={{ color: '#3d3d4e' }}>
              Da igual si contratas un DJ o un catering para 200 personas: sin un contrato claro, cualquier imprevisto se convierte en un problema difícil de resolver. Esto es lo mínimo que debe incluir.
            </p>
            <time className="text-xs mt-3 block" style={{ color: '#666' }}>16 julio 2026</time>
          </div>

          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Cláusulas que no deben faltar</h2>
              <div className="space-y-3">
                {CLAUSULAS.map((c, i) => (
                  <div key={c.clausula} className="p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(0,0,0,0.025)' : 'rgba(0,0,0,0.015)', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <p className="text-xs font-black mb-1">{c.clausula}</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#333' }}>{c.detalle}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">El error más caro: no detallar qué incluye</h2>
              <p className="text-base leading-relaxed mb-3" style={{ color: '#222' }}>
                El motivo número uno de conflictos con proveedores de eventos no es el precio, sino las expectativas no escritas. "El DJ traía luces" o "el catering incluía barra libre" son frases que, sin estar en el contrato, no se pueden reclamar después.
              </p>
              <p className="text-base leading-relaxed" style={{ color: '#222' }}>
                Cuanto más específico sea el contrato (horas exactas, qué equipo trae cada proveedor, cuántas personas de staff), menos margen hay para interpretaciones distintas el día del evento.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">
                {faqStructured.mainEntity.map((f) => (
                  <div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}>
                    <p className="text-sm font-black mb-2">{f.name}</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#333' }}>{f.acceptedAnswer.text}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(13,148,136,0.04)', border: '1px solid rgba(13,148,136,0.12)' }}>
              <p className="text-sm font-black mb-2">Genera el contrato con un clic, sin plantillas sueltas</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>
                XPEAK genera contratos digitales con los datos fiscales de ambas partes y las cláusulas clave ya incluidas.
              </p>
              <a href="/organizar-eventos" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#0D9488,#B8941E)', color: '#000' }}>
                Ver panel de organización →
              </a>
            </div>
          </div>
        </main>

        <BlogRelatedPosts currentSlug='/blog/contrato-proveedores-eventos' tag='Eventos' />
        <FooterPublic />
        <BlogScrollCTA role="empresario" storageKey="xpeak_scrollcta_contrato_proveedores" />
      </div>
    </>
  );
}
