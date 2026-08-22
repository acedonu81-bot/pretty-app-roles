import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogAnswerBox from '@/components/BlogAnswerBox';
import BlogAuthor from '@/components/BlogAuthor';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Precio de bailarines e instructores de salsa y bachata en España: guía 2026', description: 'Cuánto cobra un bailarín para eventos y cuánto cuesta una clase particular de salsa, bachata o kizomba en España. Tarifas 2026.', datePublished: '2026-07-11', dateModified: '2026-07-11', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/precio-bailarin-instructor-salsa-bachata' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cobra un bailarín para una boda o evento en España?', acceptedAnswer: { '@type': 'Answer', text: 'Un show de baile profesional (flamenco, latino, danza contemporánea) para boda o evento cuesta entre 200€ y 600€ según duración, número de bailarines y si incluye coreografía personalizada. Los shows de compañía (4-6 bailarines) suben hasta 800-1.500€.' } },
  { '@type': 'Question', name: '¿Cuánto cuesta una clase particular de salsa o bachata?', acceptedAnswer: { '@type': 'Answer', text: 'Una clase particular de salsa, bachata o kizomba con instructor cuesta entre 25€ y 50€/hora en formato individual, y entre 15€ y 30€ por persona en formato pareja o grupo reducido (3-4 personas). Los packs de varias clases suelen tener descuento por volumen.' } },
  { '@type': 'Question', name: '¿Qué diferencia hay entre un bailarín de shows y un instructor de baile?', acceptedAnswer: { '@type': 'Answer', text: 'El bailarín de shows actúa en eventos (bodas, galas, corporativos) con coreografías de espectáculo, normalmente en solitario o compañía. El instructor enseña pasos y técnica a particulares o parejas, en clases sueltas o cursos. Muchos profesionales ofrecen ambos servicios.' } },
  { '@type': 'Question', name: '¿Con cuánta antelación reservar bailarín o instructor?', acceptedAnswer: { '@type': 'Answer', text: 'Para shows en bodas y eventos, reserva con 4-8 semanas de antelación, especialmente en temporada alta (mayo-septiembre). Para clases particulares, muchos instructores tienen disponibilidad esta misma semana — XPEAK permite contactar directamente y ver agenda real.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Precio bailarín e instructor', item: 'https://xpeak.es/blog/precio-bailarin-instructor-salsa-bachata' }] };

const PRECIOS = [
  { perfil: 'Show individual (flamenco, latino, contemporáneo)', tarifa: '200–400€', nota: 'Actuación de 15-30 min' },
  { perfil: 'Show en pareja', tarifa: '350–600€', nota: 'Coreografía sincronizada' },
  { perfil: 'Compañía (4-6 bailarines)', tarifa: '800–1.500€', nota: 'Shows de mayor formato para galas' },
  { perfil: 'Coreografía personalizada primer baile', tarifa: '150–300€', nota: 'Clases + montaje de la coreografía' },
  { perfil: 'Clase particular individual', tarifa: '25–50€/hora', nota: 'Salsa, bachata, kizomba' },
  { perfil: 'Clase en pareja o grupo reducido', tarifa: '15–30€/persona/hora', nota: '3-4 personas, precio por cabeza' },
];

export default function BlogPrecioBailarin() {
  return (
    <>
      <Helmet>
        <title>Precio bailarín e instructor de salsa/bachata España 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cobra un bailarín para eventos y cuánto cuesta una clase de salsa, bachata o kizomba en España. Tarifas 2026." />
        <link rel="canonical" href="https://xpeak.es/blog/precio-bailarin-instructor-salsa-bachata" />
        <meta property="og:title" content="Precio bailarín e instructor salsa/bachata 2026 — XPEAK Blog" />
        <meta property="og:description" content="Tarifas de bailarines para eventos e instructores de salsa y bachata en España." />
        <meta property="og:url" content="https://xpeak.es/blog/precio-bailarin-instructor-salsa-bachata" />
        <meta property="og:type" content="article" /><meta property="og:image" content="https://xpeak.es/og-image.jpg" /><meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" /><meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>
      <div className="min-h-screen" style={{ background: '#ffffff', color: '#111' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-3xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#DB2777' }}>XPEAK</a>
          <div className="flex items-center gap-3"><a href="/blog" className="text-xs font-bold " style={{ color: '#3d3d4e' }}>Blog</a><a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#DB2777,#B8941E)', color: '#000' }}>Unirse gratis</a></div>
        </nav>
        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#DB2777' }}>Baile · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Precio de bailarines e instructores de salsa y bachata en España: guía 2026</h1>
            <p className="text-base leading-relaxed" style={{ color: '#3d3d4e' }}>El mundo del baile se mueve en dos mercados distintos: el show profesional para bodas y eventos, y las clases particulares de salsa, bachata y kizomba, cada vez más demandadas. Esta guía cubre ambos con precios reales de 2026.</p>
            <time className="text-xs mt-3 block" style={{ color: '#666' }}>11 julio 2026</time>
            <BlogAnswerBox
              question="¿Cuánto cuesta contratar un bailarín o una clase de baile?"
              answer="Un show de baile para evento cuesta entre 200€ y 600€ según formato. Una clase particular de salsa o bachata ronda los 25€-50€/hora en individual, o 15€-30€ por persona en grupo reducido. Los precios varían según ciudad y experiencia del profesional."
            />
          </div>
          <BlogInlineCTA role="bailarin" variant="upgrade" />
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Tarifas de bailarines e instructores de baile</h2>
              <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                <table className="w-full text-xs">
                  <thead><tr style={{ background: 'rgba(219,39,119,0.08)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}><th className="text-left px-4 py-3 font-bold">Servicio</th><th className="px-4 py-3 font-bold text-right">Tarifa</th><th className="px-4 py-3 font-bold text-left hidden sm:table-cell">Nota</th></tr></thead>
                  <tbody>{PRECIOS.map((row, i) => (<tr key={row.perfil} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)', borderBottom: '1px solid rgba(0,0,0,0.04)' }}><td className="px-4 py-3 font-medium">{row.perfil}</td><td className="px-4 py-3 text-right font-bold" style={{ color: '#DB2777' }}>{row.tarifa}</td><td className="px-4 py-3 hidden sm:table-cell" style={{ color: '#3d3d4e' }}>{row.nota}</td></tr>))}</tbody>
                </table>
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Precios orientativos España 2026. Sin IVA. Desplazamiento fuera de la ciudad de residencia puede facturarse aparte.</p>
            </section>
            <section>
              <h2 className="text-lg font-black mb-3">Show de evento vs. clases particulares: qué elegir</h2>
              <div className="space-y-2">{[
                'Show de evento: espectáculo de 15-30 min, coreografía cerrada, ideal para bodas, galas y actos corporativos que buscan un momento de impacto visual.',
                'Coreografía de primer baile: el instructor enseña a la pareja de novios una coreografía a medida en varias sesiones antes de la boda.',
                'Clases particulares de salsa/bachata/kizomba: sesiones regulares para aprender a bailar, en formato individual, pareja o grupo reducido.',
                'Muchos profesionales de XPEAK ofrecen ambos servicios — shows para eventos y clases particulares — bajo el mismo perfil.',
              ].map((item,i) => (<div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.02)' }}><span className="text-xs font-black shrink-0 mt-0.5" style={{ color: '#DB2777' }}>✓</span><p className="text-xs" style={{ color: '#111' }}>{item}</p></div>))}</div>
            </section>
            <section>
              <h2 className="text-lg font-black mb-3">Por qué contratar bailarín o instructor en XPEAK</h2>
              <p className="text-base leading-relaxed mb-3" style={{ color: '#222' }}>
                A diferencia de otros directorios que cobran comisión al profesional o requieren plan de pago para destacar, en XPEAK publicar tu perfil y contactar es <strong style={{ color: '#111' }}>100% gratis, sin comisión</strong>. Para eventos con fecha urgente, el <strong style={{ color: '#111' }}>Flash Booking</strong> conecta con bailarines disponibles en horas, no días. Y cada contratación incluye <strong style={{ color: '#111' }}>contrato digital automático</strong>, sin que tengas que redactarlo tú.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">{faqStructured.mainEntity.map(f => (<div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}><h3 className="text-sm font-bold mb-2">{f.name}</h3><p className="text-sm leading-relaxed" style={{ color: '#222' }}>{f.acceptedAnswer.text}</p></div>))}</div>
            </section>
            <section className="mt-8 mb-8">
              <h2 className="text-base font-black mb-3">Contratar bailarines por ciudad</h2>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Bailarín Madrid', href: '/contratar-bailarin/madrid' },
                  { label: 'Bailarín Barcelona', href: '/contratar-bailarin/barcelona' },
                  { label: 'Bailarín Valencia', href: '/contratar-bailarin/valencia' },
                  { label: 'Bailarín Sevilla', href: '/contratar-bailarin/sevilla' },
                  { label: 'Bailarín Málaga', href: '/contratar-bailarin/malaga' },
                  { label: 'Bailarín Bilbao', href: '/contratar-bailarin/bilbao' },
                ].map(c => (
                  <a key={c.href} href={c.href}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105"
                    style={{ background: 'rgba(219,39,119,0.08)', color: '#DB2777', border: '1px solid rgba(219,39,119,0.2)' }}>
                    {c.label}
                  </a>
                ))}
              </div>
            </section>
            <div className="p-6 rounded-2xl text-center mb-6" style={{ background: 'rgba(219,39,119,0.04)', border: '1px solid rgba(219,39,119,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Quieres saber dónde bailar salsa o bachata esta semana?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>Consulta la agenda de socials y congresos de baile en toda España, publicada por la propia comunidad.</p>
              <a href="/socials" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'rgba(219,39,119,0.1)', color: '#8A6D0F', border: '1px solid rgba(219,39,119,0.25)' }}>Ver agenda de socials →</a>
            </div>
            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(219,39,119,0.04)', border: '1px solid rgba(219,39,119,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Buscas bailarín para tu evento o instructor de salsa/bachata?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>XPEAK conecta organizadores con bailarines e instructores verificados en toda España. Gratis, sin comisión, contrato digital automático.</p>
              <a href="/contratar-bailarin" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#DB2777,#B8941E)', color: '#000' }}>Ver bailarines en XPEAK →</a>
            </div>
          </div>
          <BlogEmailCapture variant="presupuestos" intent="contratar-bailarin" articlePath="/blog/precio-bailarin-instructor-salsa-bachata" />
        </main>
        <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/precio-bailarin-instructor-salsa-bachata' tag='Bailarin' />
        <FooterPublic />
        <BlogScrollCTA role="bailarin" storageKey="xpeak_scrollcta_precio_bailarin" />
      </div>
    </>
  );
}
