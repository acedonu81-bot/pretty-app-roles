import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';
import BlogScrollCTA from '@/components/BlogScrollCTA';

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Cómo organizar una fiesta privada en una villa de Ibiza: permisos, ruido y proveedores",
  "description": "Guía completa para organizar una fiesta privada en una villa de Ibiza: permisos, normativa de ruido, DJ, camareros y catering. Todo lo que necesitas saber.",
  "author": { "@type": "Person", "name": "Daniel" },
  "publisher": { "@type": "Organization", "name": "XPEAK", "url": "https://xpeak.es" },
  "datePublished": "2026-06-10",
  "dateModified": "2026-06-10",
  "url": "https://xpeak.es/blog/fiesta-privada-villa-ibiza"
};

export default function BlogFiestaVillaIbiza() {
  return (
    <>
      <Helmet>
        <title>Fiesta Privada en Villa de Ibiza: Permisos, DJ y Proveedores 2026 | XPEAK</title>
        <meta name="description" content="Cómo organizar una fiesta privada en villa de Ibiza. Normativa de ruido, permisos, DJ villa Ibiza, camareros Ibiza y catering. Guía completa 2026." />
        <link rel="canonical" href="https://xpeak.es/blog/fiesta-privada-villa-ibiza" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <div style={{ background: '#0A0A0A', color: '#F5F5F0', minHeight: '100vh' }}>
        <div className="max-w-2xl mx-auto px-4 py-12">
          <a href="/blog" style={{ color: '#D4AF37', fontSize: '0.8rem', fontWeight: 700 }}>← Blog XPEAK</a>
          <article className="mt-6">
            <span style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 6, padding: '3px 10px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Ibiza · Fiestas Privadas</span>
            <h1 className="text-3xl font-black mt-4 mb-4 leading-tight">Cómo organizar una fiesta privada en una villa de Ibiza: permisos, ruido y proveedores</h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Por Daniel · XPEAK · 10 junio 2026</p>

            <p className="mt-6 mb-4" style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.8 }}>
              Ibiza es el destino favorito para fiestas privadas en villa de toda Europa. Si estás organizando una, hay aspectos clave que debes tener en cuenta: normativa de ruido, proveedores de confianza y logística. Esta guía te lo explica todo.
            </p>

            <h2 className="text-xl font-black mt-8 mb-3">Normativa de ruido en Ibiza para fiestas privadas</h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, marginBottom: '1rem' }}>
              Las Islas Baleares tienen una normativa estricta sobre ruido que afecta a las fiestas en villas privadas:
            </p>
            <ul style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 2, paddingLeft: '1.2rem', marginBottom: '1.5rem' }}>
              <li><strong style={{ color: '#fff' }}>Horario diurno (7h–23h):</strong> nivel máximo 45-50 dB en el exterior.</li>
              <li><strong style={{ color: '#fff' }}>Horario nocturno (23h–7h):</strong> nivel máximo 35-40 dB. La música amplificada exterior está muy limitada.</li>
              <li><strong style={{ color: '#fff' }}>Consejo práctico:</strong> Instala el equipo de sonido en interior o en zonas cerradas si la fiesta se prolonga hasta la madrugada. Muchas villas disponen de espacios interiores acondicionados.</li>
            </ul>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem' }}>* Consulta siempre el Reglamento de Ruidos de la Comunitat Autònoma de les Illes Balears y el plan de ordenación del municipio donde se encuentra la villa.</p>

            <h2 className="text-xl font-black mt-8 mb-3">Proveedores que necesitas para tu fiesta en villa</h2>
            {[
              { emoji: '🎧', title: 'DJ villa Ibiza', desc: 'Un DJ profesional con experiencia en eventos privados de villa. Diferente al DJ de club: sabe leer audiencias pequeñas y adaptarse al ambiente íntimo. Precio orientativo: 300€–1.200€ según duración y nombre.', link: '/contratar-dj/ibiza' },
              { emoji: '🍽️', title: 'Camareros Ibiza', desc: 'Personal de servicio para cócteles, cenas y barra libre. Esencial para fiestas de más de 20 personas. Precio: 14€–20€/hora por persona.', link: '/contratar-camareros/ibiza' },
              { emoji: '🍾', title: 'Catering villa Ibiza', desc: 'Servicios de finger food, cenas en villa y barra de cócteles. Muchos caterings en Ibiza ofrecen paquetes específicos para villas con equipo propio.', link: '/contratar-catering/ibiza' },
              { emoji: '📸', title: 'Fotógrafo / videógrafo', desc: 'Para inmortalizar la fiesta. Los mejores fotógrafos de fiestas privadas en Ibiza trabajan de forma discreta y tienen experiencia con privacidad de clientes.', link: '/contratar-fotografo/ibiza' },
            ].map(p => (
              <div key={p.title} className="flex gap-3 mb-4 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{p.emoji}</span>
                <div>
                  <p className="font-black"><a href={p.link} style={{ color: '#D4AF37' }}>{p.title}</a></p>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem', lineHeight: 1.7, marginTop: 4 }}>{p.desc}</p>
                </div>
              </div>
            ))}

            <h2 className="text-xl font-black mt-8 mb-3">Presupuesto orientativo fiesta villa Ibiza</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <th style={{ textAlign: 'left', padding: '8px 0', color: '#D4AF37' }}>Proveedor</th>
                  <th style={{ textAlign: 'left', padding: '8px 0', color: '#D4AF37' }}>20 pax</th>
                  <th style={{ textAlign: 'left', padding: '8px 0', color: '#D4AF37' }}>50 pax</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['DJ (5h)', '400€–600€', '600€–1.200€'],
                  ['Camareros (2–4 personas, 6h)', '180€–480€', '360€–720€'],
                  ['Catering / cóctel', '600€–1.000€', '1.250€–2.500€'],
                  ['Fotógrafo (3h)', '300€–500€', '300€–500€'],
                  ['Total orientativo', '~1.500€–2.600€', '~2.500€–5.000€'],
                ].map(([prov, p20, p50]) => (
                  <tr key={prov} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', fontWeight: prov.startsWith('Total') ? 700 : 'normal' }}>
                    <td style={{ padding: '10px 0' }}>{prov}</td>
                    <td style={{ padding: '10px 0', color: prov.startsWith('Total') ? '#D4AF37' : 'rgba(255,255,255,0.7)' }}>{p20}</td>
                    <td style={{ padding: '10px 0', color: prov.startsWith('Total') ? '#D4AF37' : 'rgba(255,255,255,0.7)' }}>{p50}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>* Precios orientativos 2026. No incluyen alquiler de villa ni bebidas.</p>

            <div className="mt-8 p-5 rounded-2xl text-center" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)' }}>
              <p className="font-black text-lg mb-2">Contrata DJ, camareros y catering para tu villa en Ibiza</p>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem', marginBottom: '1rem' }}>Profesionales verificados disponibles en Ibiza. Flash Booking disponible para fechas de última hora.</p>
              <a href="/contratar-dj/ibiza" className="inline-block px-6 py-3 rounded-xl font-black text-sm transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Ver DJs en Ibiza →</a>
            </div>

            <BlogAuthor />
            <BlogShare />
          </article>
        </div>
        <FooterPublic />
        <BlogScrollCTA role="empresario" storageKey="xpeak_scrollcta_villa_ibiza" />
      </div>
    </>
  );
}
