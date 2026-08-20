import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';
import BlogScrollCTA from '@/components/BlogScrollCTA';

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Personal extra para hostelería: cómo cubrir picos de temporada sin contratar fijo",
  "description": "Guía B2B para salas, restaurantes y hoteles: cómo contratar personal extra de hostelería para picos de temporada. Camareros por horas, bartenders y personal de sala.",
  "author": { "@type": "Person", "name": "Daniel" },
  "publisher": { "@type": "Organization", "name": "XPEAK", "url": "https://xpeak.es" },
  "datePublished": "2026-06-10",
  "dateModified": "2026-06-10",
  "url": "https://xpeak.es/blog/personal-extra-hosteleria-temporada"
};

const faqStructured = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: '¿Cuánto cuesta un camarero extra por horas en hostelería?', acceptedAnswer: { '@type': 'Answer', text: 'En 2026, un camarero de sala cuesta 12€-16€/hora (96€-128€ la jornada de 8h) y un bartender 14€-20€/hora. Perfiles más cualificados como jefe de sala (18€-25€/h) o maitre (20€-30€/h) suben la tarifa. Los precios varían según ciudad, experiencia y convenio colectivo de hostelería.' } },
    { '@type': 'Question', name: '¿Cuáles son los picos de temporada en hostelería?', acceptedAnswer: { '@type': 'Answer', text: 'Son cuatro: el verano en costa e islas (junio-septiembre), las bodas y eventos privados (abril-octubre), la campaña de Navidad y Nochevieja (noviembre-enero) y los eventos corporativos (septiembre-noviembre y febrero-abril). Cada pico demanda un tipo de personal extra distinto.' } },
    { '@type': 'Question', name: '¿Cómo contrato personal extra para mi negocio?', acceptedAnswer: { '@type': 'Answer', text: 'En XPEAK creas una cuenta de empresario gratis, publicas una oferta con el perfil, número de personas, fecha y ciudad, recibes candidaturas de camareros verificados con disponibilidad confirmada y firmas el contrato digital automático con un clic. Para urgencias, el Flash Booking da respuesta en menos de 1 hora.' } },
  ],
};

export default function BlogPersonalExtraHosteleria() {
  return (
    <>
      <Helmet>
        <title>Personal Extra para Hostelería: Camareros por Horas para Picos de Temporada 2026</title>
        <meta name="description" content="Cómo contratar camareros por horas y personal extra para hostelería en temporada alta. Guía para salas, restaurantes y hoteles. Camareros Madrid, Barcelona e Ibiza." />
        <link rel="canonical" href="https://xpeak.es/blog/personal-extra-hosteleria-temporada" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
      </Helmet>
      <div style={{ background: '#0A0A0A', color: '#F5F5F0', minHeight: '100vh' }}>
        <div className="max-w-2xl mx-auto px-4 py-12">
          <a href="/blog" style={{ color: '#2563EB', fontSize: '0.8rem', fontWeight: 700 }}>← Blog XPEAK</a>
          <article className="mt-6">
            <span style={{ background: 'rgba(37,99,235,0.1)', color: '#2563EB', border: '1px solid rgba(37,99,235,0.2)', borderRadius: 6, padding: '3px 10px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Hostelería · B2B</span>
            <h1 className="text-3xl font-black mt-4 mb-4 leading-tight">Personal extra para hostelería: cómo cubrir picos de temporada sin contratar fijo</h1>
            <p style={{ color: '#444', fontSize: '0.85rem' }}>Por Daniel · XPEAK · 10 junio 2026</p>

            <p className="mt-6 mb-4" style={{ color: '#222', lineHeight: 1.8 }}>
              Los picos de temporada en hostelería son predecibles pero difíciles de gestionar. Contratar personal fijo para cubrir semanas de alta demanda genera costes fijos durante meses de baja actividad. La solución: <strong style={{ color: '#111' }}>camareros por horas y personal extra puntual</strong>, contratado exactamente cuando lo necesitas.
            </p>

            <h2 className="text-xl font-black mt-8 mb-3">Los 4 picos de temporada en hostelería española</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #777' }}>
                  <th style={{ textAlign: 'left', padding: '8px 0', color: '#2563EB' }}>Temporada</th>
                  <th style={{ textAlign: 'left', padding: '8px 0', color: '#2563EB' }}>Meses</th>
                  <th style={{ textAlign: 'left', padding: '8px 0', color: '#2563EB' }}>Tipo de personal extra</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Verano (costa e islas)', 'Jun–Sep', 'Camareros barra, bartenders, jefes de sala'],
                  ['Bodas y eventos privados', 'Abr–Oct', 'Camareros de boda, maitre, personal cóctel'],
                  ['Navidad y Nochevieja', 'Nov–Ene', 'Camareros cenas empresa, barra libre'],
                  ['Eventos corporativos', 'Sep–Nov y Feb–Abr', 'Personal de sala, azafatas, coordinadores'],
                ].map(([temp, meses, tipo]) => (
                  <tr key={temp} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <td style={{ padding: '10px 0', fontWeight: 700 }}>{temp}</td>
                    <td style={{ padding: '10px 0', color: '#333' }}>{meses}</td>
                    <td style={{ padding: '10px 0', color: '#333' }}>{tipo}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h2 className="text-xl font-black mt-8 mb-3">Precios de camareros extra por horas en España (2026)</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #777' }}>
                  <th style={{ textAlign: 'left', padding: '8px 0', color: '#2563EB' }}>Perfil</th>
                  <th style={{ textAlign: 'left', padding: '8px 0', color: '#2563EB' }}>Precio/hora</th>
                  <th style={{ textAlign: 'left', padding: '8px 0', color: '#2563EB' }}>Precio jornada (8h)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Camarero/a sala', '12€–16€', '96€–128€'],
                  ['Bartender / Barman', '14€–20€', '112€–160€'],
                  ['Jefe de sala', '18€–25€', '144€–200€'],
                  ['Maitre', '20€–30€', '160€–240€'],
                  ['Azafata / Hostess', '14€–18€', '112€–144€'],
                  ['Personal de cocina', '12€–18€', '96€–144€'],
                ].map(([perfil, hora, jornada]) => (
                  <tr key={perfil} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <td style={{ padding: '10px 0', fontWeight: 700 }}>{perfil}</td>
                    <td style={{ padding: '10px 0', color: '#2563EB', fontWeight: 700 }}>{hora}</td>
                    <td style={{ padding: '10px 0', color: '#333' }}>{jornada}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ color: '#333', fontSize: '0.8rem', marginBottom: '1.5rem' }}>* Precios orientativos. Pueden variar según ciudad, experiencia y condiciones del convenio colectivo de hostelería.</p>

            <h2 className="text-xl font-black mt-8 mb-3">Camareros por horas por ciudad</h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { ciudad: 'Camareros Madrid', href: '/contratar-camareros/madrid' },
                { ciudad: 'Camareros Barcelona', href: '/contratar-camareros/barcelona' },
                { ciudad: 'Camareros Ibiza', href: '/contratar-camareros/ibiza' },
                { ciudad: 'Camareros Valencia', href: '/contratar-camareros/valencia' },
                { ciudad: 'Camareros Sevilla', href: '/contratar-camareros/sevilla' },
                { ciudad: 'Camareros Málaga', href: '/contratar-camareros/malaga' },
              ].map(c => (
                <a key={c.ciudad} href={c.href} className="px-3 py-2 rounded-lg text-sm font-bold transition-all hover:scale-105" style={{ background: 'rgba(37,99,235,0.08)', color: '#2563EB', border: '1px solid rgba(37,99,235,0.18)' }}>{c.ciudad}</a>
              ))}
            </div>

            <h2 className="text-xl font-black mt-8 mb-3">Cómo contratar personal extra en XPEAK</h2>
            <ol style={{ color: '#222', lineHeight: 2.2, paddingLeft: '1.2rem' }}>
              <li>Crea tu cuenta de <strong style={{ color: '#111' }}>empresario en XPEAK</strong> (gratis, sin tarjeta).</li>
              <li>Publica una oferta con el perfil, número de personas, fecha y ciudad.</li>
              <li>Recibe candidaturas de camareros verificados con disponibilidad confirmada.</li>
              <li>Firma el contrato digital automático con un clic.</li>
              <li>Para urgencias: usa <strong style={{ color: '#2563EB' }}>Flash Booking</strong> — respuesta en menos de 1 hora.</li>
            </ol>

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

            <div className="mt-8 p-5 rounded-2xl" style={{ background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.2)' }}>
              <p className="font-black text-lg mb-2">¿Necesitas camareros extra para esta temporada?</p>
              <p style={{ color: '#444', fontSize: '0.9rem', marginBottom: '1rem' }}>XPEAK conecta salas, restaurantes y hoteles con camareros por horas verificados en toda España. 0% comisión. Contratos automáticos.</p>
              <a href="/contratar-camareros" className="inline-block px-6 py-3 rounded-xl font-black text-sm transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#2563EB,#B8941E)', color: '#000' }}>Ver camareros disponibles →</a>
            </div>

            <BlogAuthor />
            <BlogShare />
          </article>
        </div>
        <BlogRelatedPosts currentSlug='/blog/personal-extra-hosteleria-temporada' tag='Camareros' />
        <FooterPublic />
        <BlogScrollCTA role="empresario" storageKey="xpeak_scrollcta_personal_extra" />
      </div>
    </>
  );
}
