import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';
import BlogScrollCTA from '@/components/BlogScrollCTA';

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Checklist para organizar un evento en una sala: todo lo que necesitas contratar",
  "description": "Lista completa con todos los proveedores y pasos para organizar un evento en sala. DJ, camareros, catering, seguridad y más. Descargable.",
  "author": { "@type": "Person", "name": "Daniel" },
  "publisher": { "@type": "Organization", "name": "XPEAK", "url": "https://xpeak.es" },
  "datePublished": "2026-06-10",
  "dateModified": "2026-06-10",
  "url": "https://xpeak.es/blog/checklist-organizar-evento-sala"
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "¿Qué proveedores necesito para organizar un evento en sala?", "acceptedAnswer": { "@type": "Answer", "text": "Los proveedores esenciales son: DJ o grupo musical, camareros y bartenders, seguridad, técnico de sonido, fotógrafo/videógrafo y, si el local no tiene cocina, catering o barra de cócteles. Para eventos corporativos añade azafatas y producción audiovisual." } },
    { "@type": "Question", "name": "¿Con cuánta antelación hay que contratar los proveedores para un evento?", "acceptedAnswer": { "@type": "Answer", "text": "DJ y catering: 1-3 meses de antelación para fechas populares. Camareros: pueden contratarse con 1-2 semanas. Con Flash Booking de XPEAK puedes cubrir necesidades urgentes en menos de 1 hora." } },
    { "@type": "Question", "name": "¿Cuánto cuesta organizar un evento en sala completo?", "acceptedAnswer": { "@type": "Answer", "text": "Depende del tamaño. Para 100 personas: DJ desde 300€, camareros 4-6 personas × 8h × 15€ = 480-720€, barra y consumición variable. Presupuesto orientativo total desde 1.500€ para un evento sencillo." } },
  ]
};

export default function BlogChecklistEventoSala() {
  return (
    <>
      <Helmet>
        <title>Checklist para Organizar un Evento en Sala — Guía Completa 2026 | XPEAK</title>
        <meta name="description" content="Lista completa de proveedores y pasos para organizar un evento en sala: DJ, camareros, catering, seguridad. Checklist descargable y precios orientativos 2026." />
        <link rel="canonical" href="https://xpeak.es/blog/checklist-organizar-evento-sala" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqLd)}</script>
      </Helmet>
      <div style={{ background: '#0A0A0A', color: '#F5F5F0', minHeight: '100vh' }}>
        <div className="max-w-2xl mx-auto px-4 py-12">
          <a href="/blog" style={{ color: '#D4AF37', fontSize: '0.8rem', fontWeight: 700 }}>← Blog XPEAK</a>
          <article className="mt-6">
            <span style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 6, padding: '3px 10px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Organización · Checklist</span>
            <h1 className="text-3xl font-black mt-4 mb-4 leading-tight">Checklist para organizar un evento en sala: todo lo que necesitas contratar</h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Por Daniel · XPEAK · 10 junio 2026</p>

            <p className="mt-6 mb-4" style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.8 }}>
              Organizar un evento en sala implica coordinar muchos proveedores a la vez. Si se te olvida uno, puede arruinar la noche. Esta guía te da el checklist completo con todos los profesionales que necesitas contratar, en qué orden y con cuánta antelación.
            </p>

            <h2 className="text-xl font-black mt-8 mb-3">Checklist de proveedores por categoría</h2>

            {[
              {
                cat: '🎧 Música y entretenimiento',
                items: [
                  { nombre: 'DJ principal', antelacion: '1-3 meses', precio: 'desde 150€', link: '/contratar-dj' },
                  { nombre: 'DJ de apertura / soporte', antelacion: '2-4 semanas', precio: 'desde 80€', link: '/contratar-dj' },
                  { nombre: 'Artista en vivo (saxo, percusión)', antelacion: '1-2 meses', precio: 'desde 200€', link: '/contratar-dj' },
                  { nombre: 'Técnico de sonido', antelacion: '1-2 semanas', precio: 'desde 80€', link: '/contratar-staff' },
                ]
              },
              {
                cat: '🍽️ Servicio y hostelería',
                items: [
                  { nombre: 'Camareros de barra', antelacion: '1-2 semanas', precio: 'desde 12€/h', link: '/contratar-camareros' },
                  { nombre: 'Bartenders / Coctelería', antelacion: '1-2 semanas', precio: 'desde 15€/h', link: '/contratar-camareros' },
                  { nombre: 'Catering / finger food', antelacion: '3-4 semanas', precio: 'desde 15€/persona', link: '/contratar-catering' },
                  { nombre: 'Jefe de sala / Coordinador', antelacion: '1-2 semanas', precio: 'desde 20€/h', link: '/contratar-camareros' },
                ]
              },
              {
                cat: '📸 Imagen y contenido',
                items: [
                  { nombre: 'Fotógrafo de evento', antelacion: '2-4 semanas', precio: 'desde 150€', link: '/contratar-fotografo' },
                  { nombre: 'Videógrafo / Reels', antelacion: '2-4 semanas', precio: 'desde 200€', link: '/contratar-fotografo' },
                ]
              },
              {
                cat: '🎪 Personal de apoyo',
                items: [
                  { nombre: 'Relaciones públicas / RRPP', antelacion: '1-2 semanas', precio: 'desde 80€/noche', link: '/contratar-promotores' },
                  { nombre: 'Azafatas / Control de lista', antelacion: '1-2 semanas', precio: 'desde 15€/h', link: '/contratar-staff' },
                  { nombre: 'Seguridad / Control de acceso', antelacion: '1-2 semanas', precio: 'desde 18€/h', link: '/contratar-staff' },
                ]
              },
            ].map(section => (
              <div key={section.cat} className="mb-6">
                <h3 className="text-base font-black mb-3">{section.cat}</h3>
                <div className="overflow-x-auto">
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <th style={{ textAlign: 'left', padding: '8px 0', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Proveedor</th>
                        <th style={{ textAlign: 'left', padding: '8px 0', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Antelación</th>
                        <th style={{ textAlign: 'left', padding: '8px 0', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Precio orient.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {section.items.map(item => (
                        <tr key={item.nombre} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '10px 0' }}>
                            <a href={item.link} style={{ color: '#D4AF37', fontWeight: 700 }}>{item.nombre}</a>
                          </td>
                          <td style={{ padding: '10px 0', color: 'rgba(255,255,255,0.6)' }}>{item.antelacion}</td>
                          <td style={{ padding: '10px 0', color: 'rgba(255,255,255,0.6)' }}>{item.precio}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}

            <h2 className="text-xl font-black mt-8 mb-3">Orden recomendado de contratación</h2>
            <ol style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 2, paddingLeft: '1.2rem' }}>
              <li><strong style={{ color: '#D4AF37' }}>3-6 meses antes:</strong> DJ principal y fotógrafo (los más demandados).</li>
              <li><strong style={{ color: '#D4AF37' }}>1-3 meses antes:</strong> Catering, producción audiovisual, artista en vivo.</li>
              <li><strong style={{ color: '#D4AF37' }}>2-4 semanas antes:</strong> Camareros, bartenders, seguridad, RRPP.</li>
              <li><strong style={{ color: '#D4AF37' }}>Última hora:</strong> Usa <a href="/contratar-dj" style={{ color: '#D4AF37' }}>Flash Booking</a> — respuesta garantizada en menos de 1 hora.</li>
            </ol>

            <h2 className="text-xl font-black mt-8 mb-3">Presupuesto orientativo por tamaño de evento</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <th style={{ textAlign: 'left', padding: '8px 0', color: '#D4AF37' }}>Tamaño</th>
                  <th style={{ textAlign: 'left', padding: '8px 0', color: '#D4AF37' }}>Personas</th>
                  <th style={{ textAlign: 'left', padding: '8px 0', color: '#D4AF37' }}>Presupuesto orient.</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Evento íntimo', '50 pax', '800€ – 1.500€'],
                  ['Evento mediano', '100-150 pax', '1.500€ – 3.000€'],
                  ['Evento grande', '200-300 pax', '3.000€ – 6.000€'],
                  ['Macro evento / festival', '+500 pax', '+10.000€'],
                ].map(([size, pax, budget]) => (
                  <tr key={size} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '10px 0', fontWeight: 700 }}>{size}</td>
                    <td style={{ padding: '10px 0', color: 'rgba(255,255,255,0.6)' }}>{pax}</td>
                    <td style={{ padding: '10px 0', color: '#D4AF37', fontWeight: 700 }}>{budget}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>* Precios orientativos. No incluyen alquiler de sala, producción de escenario ni caché de artistas headliners.</p>

            <h2 className="text-xl font-black mt-8 mb-3">Preguntas frecuentes</h2>
            {[
              { q: '¿Qué proveedores necesito para organizar un evento en sala?', a: 'Los esenciales son DJ o música en vivo, camareros y bartenders, seguridad, técnico de sonido y fotógrafo. Para eventos corporativos añade azafatas y producción audiovisual.' },
              { q: '¿Con cuánta antelación hay que contratar los proveedores?', a: 'DJ y catering con 1-3 meses de antelación para fechas populares. Camareros y seguridad con 1-2 semanas. Con Flash Booking de XPEAK puedes cubrir necesidades urgentes en menos de 1 hora.' },
              { q: '¿Cuánto cuesta organizar un evento en sala completo?', a: 'Para 100 personas: DJ desde 300€, 4-6 camareros × 8h × 15€ = 480-720€, más barra. Presupuesto orientativo total desde 1.500€ para un evento sencillo sin artistas headliners.' },
            ].map(({ q, a }) => (
              <div key={q} className="mb-4 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="font-black mb-2">{q}</p>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: 1.7 }}>{a}</p>
              </div>
            ))}

            <div className="mt-8 p-5 rounded-2xl text-center" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)' }}>
              <p className="font-black text-lg mb-2">¿Necesitas contratar proveedores para tu evento?</p>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem', marginBottom: '1rem' }}>En XPEAK encuentras DJ, camareros, catering y más — con contratos digitales automáticos y Flash Booking en menos de 1 hora.</p>
              <a href="/auth" className="inline-block px-6 py-3 rounded-xl font-black text-sm transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Publicar oferta gratis →</a>
            </div>

            <BlogAuthor />
            <BlogShare />
          </article>
        </div>
        <FooterPublic />
        <BlogScrollCTA role="empresario" storageKey="xpeak_scrollcta_checklist_sala" />
      </div>
    </>
  );
}
