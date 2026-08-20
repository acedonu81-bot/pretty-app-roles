import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';
import BlogScrollCTA from '@/components/BlogScrollCTA';

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Fiestas de pueblo y verbenas: cómo contratar disco móvil y orquesta en 2026",
  "description": "Guía completa para contratar disco móvil u orquesta para fiestas de pueblo y verbenas en España. Precios, qué incluye y cómo elegir entre DJ y grupo musical.",
  "author": { "@type": "Person", "name": "Daniel" },
  "publisher": { "@type": "Organization", "name": "XPEAK", "url": "https://xpeak.es" },
  "datePublished": "2026-06-10",
  "dateModified": "2026-06-10",
  "url": "https://xpeak.es/blog/disco-movil-verbenas-fiestas-pueblo"
};

const faqStructured = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: '¿Cuánto cuesta una disco móvil para una verbena?', acceptedAnswer: { '@type': 'Answer', text: 'El precio orientativo de una disco móvil para verbena va de 400€ a 1.200€ según la duración: unos 400€-700€ por 4 horas con equipo básico, 600€-900€ por 6 horas con equipo completo y 800€-1.200€ por una noche completa de 8 horas. Para dos días de fiestas de pueblo el rango sube a 1.200€-2.000€.' } },
    { '@type': 'Question', name: '¿Qué es mejor para una fiesta de pueblo, disco móvil u orquesta?', acceptedAnswer: { '@type': 'Answer', text: 'La disco móvil (400€-1.200€) es más económica, tiene repertorio ilimitado de cualquier estilo, incluye sonido y luces y se monta en 2-3 horas: ideal para verbenas modernas. La orquesta (2.000€-8.000€) tiene repertorio fijo, necesita técnico aparte y encaja mejor en verbenas clásicas con público de 50 años en adelante.' } },
    { '@type': 'Question', name: '¿Qué incluye una disco móvil para verbena?', acceptedAnswer: { '@type': 'Answer', text: 'Incluye DJ profesional con experiencia en eventos populares, sistema de sonido (altavoces, amplificadores, subwoofer), iluminación LED de colores y efectos, máquina de humo o cañón de CO₂, mesa de mezclas, cabina completa y montaje y desmontaje, con repertorio adaptable a pop español, flamenco fusión, electrónica, reggaetón y clásicos.' } },
  ],
};

export default function BlogDiscoMovilVerbenas() {
  return (
    <>
      <Helmet>
        <title>Disco Móvil para Verbenas y Fiestas de Pueblo — Precios 2026 | XPEAK</title>
        <meta name="description" content="Cómo contratar disco móvil u orquesta para fiestas de pueblo y verbenas. Precios, diferencias DJ vs orquesta, qué incluye el equipo y cómo contratarlo en España." />
        <link rel="canonical" href="https://xpeak.es/blog/disco-movil-verbenas-fiestas-pueblo" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
      </Helmet>
      <div style={{ background: '#0A0A0A', color: '#F5F5F0', minHeight: '100vh' }}>
        <div className="max-w-2xl mx-auto px-4 py-12">
          <a href="/blog" style={{ color: '#D4AF37', fontSize: '0.8rem', fontWeight: 700 }}>← Blog XPEAK</a>
          <article className="mt-6">
            <span style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 6, padding: '3px 10px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Disco Móvil · Verbenas</span>
            <h1 className="text-3xl font-black mt-4 mb-4 leading-tight">Fiestas de pueblo y verbenas: cómo contratar disco móvil y orquesta en 2026</h1>
            <p style={{ color: '#444', fontSize: '0.85rem' }}>Por Daniel · XPEAK · 10 junio 2026</p>

            <p className="mt-6 mb-4" style={{ color: '#222', lineHeight: 1.8 }}>
              Las fiestas de pueblo y verbenas de verano son uno de los eventos más demandados en España de junio a septiembre. Si eres el encargado de organizar la música, esta guía te explica todo sobre <strong style={{ color: '#111' }}>disco móvil para verbenas</strong>: qué incluye, cuánto cuesta y si es mejor opción que una orquesta.
            </p>

            <h2 className="text-xl font-black mt-8 mb-3">Disco móvil vs orquesta para fiestas de pueblo</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #777' }}>
                  <th style={{ textAlign: 'left', padding: '8px 0', color: '#D4AF37' }}></th>
                  <th style={{ textAlign: 'left', padding: '8px 0', color: '#D4AF37' }}>Disco Móvil</th>
                  <th style={{ textAlign: 'left', padding: '8px 0', color: '#D4AF37' }}>Orquesta</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Precio orientativo', '400€ – 1.200€', '2.000€ – 8.000€'],
                  ['Repertorio', 'Ilimitado (cualquier estilo)', 'Fijo o semifijo'],
                  ['Equipo', 'Incluido (sonido + luces)', 'Necesita técnico aparte'],
                  ['Montaje', '2-3 horas', '4-6 horas'],
                  ['Ideal para', 'Verbenas modernas, bodas, comuniones', 'Verbenas clásicas, público 50+'],
                  ['Contratación urgente', 'Flash Booking disponible', 'Requiere más antelación'],
                ].map(([concepto, disco, orq]) => (
                  <tr key={concepto} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <td style={{ padding: '10px 0', color: '#444', fontWeight: 600 }}>{concepto}</td>
                    <td style={{ padding: '10px 0', fontWeight: 700, color: '#D4AF37' }}>{disco}</td>
                    <td style={{ padding: '10px 0', color: '#333' }}>{orq}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h2 className="text-xl font-black mt-8 mb-3">Qué incluye una disco móvil para verbena</h2>
            <ul style={{ color: '#222', lineHeight: 2, paddingLeft: '1.2rem' }}>
              <li>DJ profesional con experiencia en eventos populares</li>
              <li>Sistema de sonido (altavoces, amplificadores, subwoofer)</li>
              <li>Iluminación LED de colores y efectos (focos, láser, estroboscopio)</li>
              <li>Máquina de humo o cañón de CO₂</li>
              <li>Mesa de mezclas y cabina completa</li>
              <li>Montaje y desmontaje incluidos</li>
              <li>Repertorio adaptable: pop español, flamenco fusión, electrónica, reggaetón, clásicos</li>
            </ul>

            <h2 className="text-xl font-black mt-8 mb-3">Precios de disco móvil para verbenas por duración</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #777' }}>
                  <th style={{ textAlign: 'left', padding: '8px 0', color: '#D4AF37' }}>Duración</th>
                  <th style={{ textAlign: 'left', padding: '8px 0', color: '#D4AF37' }}>Precio orient.</th>
                  <th style={{ textAlign: 'left', padding: '8px 0', color: '#D4AF37' }}>Incluye</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['4 horas', '400€ – 700€', 'Equipo básico, luces LED'],
                  ['6 horas', '600€ – 900€', 'Equipo completo, máquina humo'],
                  ['8 horas (noche completa)', '800€ – 1.200€', 'Equipo premium, efectos especiales'],
                  ['2 días (fiestas pueblo)', '1.200€ – 2.000€', 'Equipo completo + 2 actuaciones'],
                ].map(([dur, precio, incl]) => (
                  <tr key={dur} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <td style={{ padding: '10px 0', fontWeight: 700 }}>{dur}</td>
                    <td style={{ padding: '10px 0', color: '#D4AF37', fontWeight: 700 }}>{precio}</td>
                    <td style={{ padding: '10px 0', color: '#333' }}>{incl}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ color: '#333', fontSize: '0.8rem', marginBottom: '1.5rem' }}>* Precios orientativos para España. Pueden variar según zona geográfica, distancia y temporada.</p>

            <h2 className="text-xl font-black mt-8 mb-3">Ciudades con más demanda de disco móvil para verbenas</h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { c: 'Disco móvil Madrid', h: '/contratar-disco-movil/madrid' },
                { c: 'Disco móvil Valencia', h: '/contratar-disco-movil/valencia' },
                { c: 'Disco móvil Zaragoza', h: '/contratar-disco-movil/zaragoza' },
                { c: 'Disco móvil Murcia', h: '/contratar-disco-movil/murcia' },
                { c: 'Disco móvil Sevilla', h: '/contratar-disco-movil/sevilla' },
                { c: 'Disco móvil Málaga', h: '/contratar-disco-movil/malaga' },
              ].map(({ c, h }) => (
                <a key={c} href={h} className="px-3 py-2 rounded-lg text-sm font-bold" style={{ background: 'rgba(212,175,55,0.08)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.18)' }}>{c}</a>
              ))}
            </div>

            <section className="mt-8">
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

            <div className="mt-8 p-5 rounded-2xl text-center" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)' }}>
              <p className="font-black text-lg mb-2">Contrata disco móvil para tu verbena en XPEAK</p>
              <p style={{ color: '#444', fontSize: '0.9rem', marginBottom: '1rem' }}>DJs con equipo completo verificados en toda España. Contratos automáticos. Flash Booking disponible.</p>
              <a href="/contratar-disco-movil" className="inline-block px-6 py-3 rounded-xl font-black text-sm transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Ver disco móvil disponible →</a>
            </div>

            <BlogAuthor />
            <BlogShare />
          </article>
        </div>
        <BlogRelatedPosts currentSlug='/blog/disco-movil-verbenas-fiestas-pueblo' tag='DJ' />
        <FooterPublic />
        <BlogScrollCTA role="empresario" storageKey="xpeak_scrollcta_disco_movil_verbenas" />
      </div>
    </>
  );
}
