import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogAnswerBox from '@/components/BlogAnswerBox';
import BlogAuthor from '@/components/BlogAuthor';
import DJResourcesAffiliate from '@/components/DJResourcesAffiliate';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Precio de azafatas para eventos en Sevilla: guía 2026', description: 'Cuánto cobran las azafatas para eventos, ferias FIBES y congresos en Sevilla. Tarifas por perfil 2026.', datePublished: '2026-06-23', dateModified: '2026-06-25', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/precio-azafatas-sevilla' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cobran las azafatas de eventos en Sevilla?', acceptedAnswer: { '@type': 'Answer', text: 'En Sevilla una azafata de eventos cobra entre 11€ y 16€/hora bruto, en línea con la media nacional. Las agencias facturan al cliente entre 105€ y 165€/día por perfil. Los congresos grandes en FIBES y las ferias agroalimentarias suben la demanda de personal en fechas puntuales.' } },
  { '@type': 'Question', name: '¿Dónde se concentran los eventos y ferias en Sevilla?', acceptedAnswer: { '@type': 'Answer', text: 'FIBES (Palacio de Exposiciones y Congresos de Sevilla) es el gran recinto de la ciudad, con congresos médicos, profesionales y ferias sectoriales agroalimentarias entre los eventos que más azafatas movilizan. También hay demanda relevante en eventos institucionales del casco histórico y en el sector del turismo y la hostelería.' } },
  { '@type': 'Question', name: '¿Con cuánta antelación reservar azafatas en Sevilla?', acceptedAnswer: { '@type': 'Answer', text: 'Para congresos grandes en FIBES reserva con 4-6 semanas de antelación. Para eventos corporativos puntuales, 2 semanas suele ser suficiente. En temporada de ferias (primavera) la demanda sube y conviene reservar con algo más de margen.' } },
  { '@type': 'Question', name: '¿Qué perfil de azafata se pide más en Sevilla?', acceptedAnswer: { '@type': 'Answer', text: 'El perfil de azafata de congreso (registro, acreditaciones, atención a ponentes) es el más demandado por el peso de FIBES en la actividad ferial de la ciudad. También hay demanda estacional de azafatas de imagen para eventos del sector agroalimentario y turístico.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Azafatas Sevilla', item: 'https://xpeak.es/blog/precio-azafatas-sevilla' }] };

const PRECIOS = [
  { perfil: 'Azafata de stand / feria FIBES', tarifa: '105–155€/día', nota: 'Jornada completa 8h' },
  { perfil: 'Azafata de imagen', tarifa: '135–210€/día', nota: 'Eventos de marca y protocolo' },
  { perfil: 'Azafata bilingüe (inglés)', tarifa: '145–195€/día', nota: 'Demandada en congresos internacionales' },
  { perfil: 'Azafata trilingüe', tarifa: '180–260€/día', nota: 'Congresos con presencia internacional' },
  { perfil: 'Coordinadora de azafatas', tarifa: '160–240€/día', nota: 'Gestión del equipo completo' },
  { perfil: 'Pack evento corporativo (4h)', tarifa: '70–115€', nota: 'Acto único, media jornada' },
];

export default function BlogPrecioAzafatasSevilla() {
  return (
    <>
      <Helmet>
        <title>Precio azafatas para eventos en Sevilla 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cobran las azafatas para eventos, FIBES y congresos en Sevilla. Tarifas por perfil 2026." />
        <link rel="canonical" href="https://xpeak.es/blog/precio-azafatas-sevilla" />
        <meta property="og:title" content="Precio azafatas eventos Sevilla 2026 — XPEAK Blog" />
        <meta property="og:description" content="Tarifas de azafatas para FIBES y eventos corporativos en Sevilla." />
        <meta property="og:url" content="https://xpeak.es/blog/precio-azafatas-sevilla" />
        <meta property="og:type" content="article" /><meta property="og:image" content="https://xpeak.es/og-image.jpg" /><meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" /><meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>
      <div className="min-h-screen" style={{ background: '#ffffff', color: '#111' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-3xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#059669' }}>XPEAK</a>
          <div className="flex items-center gap-3"><a href="/blog" className="text-xs font-bold " style={{ color: '#3d3d4e' }}>Blog</a><a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#059669,#B8941E)', color: '#000' }}>Unirse gratis</a></div>
        </nav>
        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#059669' }}>Staff · Sevilla · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Precio de azafatas para eventos en Sevilla: guía 2026</h1>
            <p className="text-base leading-relaxed" style={{ color: '#3d3d4e' }}>Sevilla tiene en FIBES su gran motor de demanda de azafatas, con congresos profesionales y ferias agroalimentarias que marcan el calendario. Los precios se mantienen en línea con la media nacional durante casi todo el año.</p>
            <time className="text-xs mt-3 block" style={{ color: '#666' }}>8 julio 2026</time>
            <BlogAnswerBox
              question="¿Cuánto cobran las azafatas en Sevilla?"
              answer="Una azafata de eventos en Sevilla cobra entre 11€ y 16€/hora bruto, y las agencias facturan entre 105€ y 165€/día por el servicio completo. Los congresos grandes en FIBES pueden subir ligeramente la tarifa de perfiles bilingües en fechas de máxima demanda."
            />
          </div>
          <BlogInlineCTA role="azafata" variant="upgrade" />
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Tarifas por perfil de azafata en Sevilla</h2>
              <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                <table className="w-full text-xs">
                  <thead><tr style={{ background: 'rgba(5,150,105,0.08)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}><th className="text-left px-4 py-3 font-bold">Perfil</th><th className="px-4 py-3 font-bold text-right">Tarifa</th><th className="px-4 py-3 font-bold text-left hidden sm:table-cell">Nota</th></tr></thead>
                  <tbody>{PRECIOS.map((row, i) => (<tr key={row.perfil} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)', borderBottom: '1px solid rgba(0,0,0,0.04)' }}><td className="px-4 py-3 font-medium">{row.perfil}</td><td className="px-4 py-3 text-right font-bold" style={{ color: '#059669' }}>{row.tarifa}</td><td className="px-4 py-3 hidden sm:table-cell" style={{ color: '#3d3d4e' }}>{row.nota}</td></tr>))}</tbody>
                </table>
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Precios Sevilla 2026. Sin IVA. Desplazamiento fuera del área metropolitana puede facturarse aparte.</p>
            </section>
            <section>
              <h2 className="text-lg font-black mb-3">Dónde se concentra la demanda en Sevilla</h2>
              <div className="space-y-2">{['FIBES (Palacio de Exposiciones y Congresos): congresos médicos y profesionales','Ferias agroalimentarias y del sector primario en el recinto ferial de la ciudad','Eventos institucionales y culturales del casco histórico','Sector turístico y hostelero: presentaciones y jornadas del ámbito turístico'].map((item,i) => (<div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.02)' }}><span className="text-xs font-black shrink-0 mt-0.5" style={{ color: '#059669' }}>✓</span><p className="text-xs" style={{ color: '#111' }}>{item}</p></div>))}</div>
            </section>
            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">{faqStructured.mainEntity.map(f => (<div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}><h3 className="text-sm font-bold mb-2">{f.name}</h3><p className="text-sm leading-relaxed" style={{ color: '#222' }}>{f.acceptedAnswer.text}</p></div>))}</div>
            </section>
            <section className="mt-8">
              <h2 className="text-base font-black mb-3" style={{ color: '#111' }}>Artículos relacionados</h2>
              <div className="space-y-2">
                {[
                  { href: '/blog/staff-para-eventos', cat: 'Hub Staff', title: 'Staff para eventos: guía completa 2026' },
                  { href: '/blog/precio-azafatas-eventos-espana', cat: 'Nacional', title: 'Precio azafatas para eventos en España: guía 2026' },
                  { href: '/blog/personal-de-imagen-ferias-y-congresos', cat: 'Staff', title: 'Personal de imagen para ferias y congresos' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(5,150,105,0.1)', color: '#059669', border: '1px solid rgba(5,150,105,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: '#222' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>
            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(5,150,105,0.04)', border: '1px solid rgba(5,150,105,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Necesitas azafatas para tu evento en Sevilla?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>XPEAK conecta organizadores con staff profesional verificado en Sevilla. Contrato digital automático incluido.</p>
              <a href="/contratar-staff/sevilla" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#059669,#B8941E)', color: '#000' }}>Ver staff en Sevilla →</a>
            </div>
          </div>
          <BlogEmailCapture variant="presupuestos" intent="contratar-staff" articlePath="/blog/precio-azafatas-sevilla" />
        </main>
        <DJResourcesAffiliate role="azafata" />
        <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/precio-azafatas-sevilla' tag='Staff' />
        <FooterPublic />
        <BlogScrollCTA role="azafata" storageKey="xpeak_scrollcta_precio_azafatas_sevilla" />
      </div>
    </>
  );
}
