import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogAnswerBox from '@/components/BlogAnswerBox';
import BlogAuthor from '@/components/BlogAuthor';
import DJResourcesAffiliate from '@/components/DJResourcesAffiliate';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Precio de azafatas para eventos en Tarragona: guía 2026', description: 'Cuánto cobran las azafatas para eventos institucionales, culturales y corporativos en Tarragona. Tarifas por perfil 2026.', datePublished: '2026-04-04', dateModified: '2026-07-16', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/precio-azafatas-tarragona' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cobran las azafatas de eventos en Tarragona?', acceptedAnswer: { '@type': 'Answer', text: 'En Tarragona, una azafata de eventos cobra entre 13€ y 19€/hora bruto, en línea con la media de ciudades medianas catalanas. Las agencias facturan al cliente entre 130€ y 190€/día por perfil. Los eventos institucionales y culturales ligados al patrimonio romano suelen requerir perfiles con formación en atención al público.' } },
  { '@type': 'Question', name: '¿Dónde se concentran los eventos en Tarragona?', acceptedAnswer: { '@type': 'Answer', text: 'El casco antiguo y el entorno del Anfiteatro Romano concentran gran parte de los eventos culturales e institucionales, declarados Patrimonio de la Humanidad por la UNESCO. También hay una demanda constante de azafatas para eventos corporativos vinculados a la industria química y petroquímica de la zona, y para congresos en el Palacio de Congresos.' } },
  { '@type': 'Question', name: '¿Con cuánta antelación reservar azafatas para un evento en Tarragona?', acceptedAnswer: { '@type': 'Answer', text: 'Para eventos institucionales o culturales en el centro histórico de Tarragona, 3-4 semanas de antelación suele ser suficiente. Para eventos corporativos grandes ligados a la industria química, conviene reservar con 1-2 meses por la magnitud de estos actos.' } },
  { '@type': 'Question', name: '¿Qué perfil de azafata se pide más en Tarragona?', acceptedAnswer: { '@type': 'Answer', text: 'El perfil de azafata de protocolo e institucional es el más demandado por el peso de los eventos culturales y patrimoniales de la ciudad. También hay demanda estable de azafatas bilingües para congresos corporativos del sector químico y logístico.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Azafatas Tarragona', item: 'https://xpeak.es/blog/precio-azafatas-tarragona' }] };

const PRECIOS = [
  { perfil: 'Azafata de stand / feria', tarifa: '130–175€/día', nota: 'Jornada completa 8h' },
  { perfil: 'Azafata de imagen', tarifa: '150–220€/día', nota: 'Eventos de marca y protocolo institucional' },
  { perfil: 'Azafata bilingüe (inglés)', tarifa: '160–210€/día', nota: 'Congresos corporativos y del sector químico' },
  { perfil: 'Azafata de protocolo', tarifa: '150–230€/día', nota: 'Actos institucionales en el casco histórico' },
  { perfil: 'Coordinadora de azafatas', tarifa: '175–260€/día', nota: 'Gestión del equipo completo' },
  { perfil: 'Pack evento corporativo (4h)', tarifa: '80–130€', nota: 'Acto único, media jornada' },
];

export default function BlogPrecioAzafatasTarragona() {
  return (
    <>
      <Helmet>
        <title>Precio azafatas para eventos en Tarragona 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cobran las azafatas para eventos institucionales y corporativos en Tarragona. Tarifas por perfil 2026." />
        <link rel="canonical" href="https://xpeak.es/blog/precio-azafatas-tarragona" />
        <meta property="og:title" content="Precio azafatas eventos Tarragona 2026 — XPEAK Blog" />
        <meta property="og:description" content="Tarifas de azafatas para eventos institucionales, culturales y corporativos en Tarragona." />
        <meta property="og:url" content="https://xpeak.es/blog/precio-azafatas-tarragona" />
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
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#059669' }}>Staff · Tarragona · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Precio de azafatas para eventos en Tarragona: guía 2026</h1>
            <p className="text-base leading-relaxed" style={{ color: '#3d3d4e' }}>Tarragona combina un calendario de eventos institucionales y culturales ligado a su patrimonio romano con una demanda corporativa constante por el peso de la industria química de la zona. Las tarifas se sitúan en línea con la media catalana.</p>
            <time className="text-xs mt-3 block" style={{ color: '#666' }}>8 julio 2026</time>
            <BlogAnswerBox
              question="¿Cuánto cobran las azafatas en Tarragona?"
              answer="Una azafata de eventos en Tarragona cobra entre 13€ y 19€/hora bruto, y las agencias facturan entre 130€ y 190€/día por el servicio completo. Los eventos institucionales del casco histórico y los congresos corporativos del sector químico son los que más demanda generan."
            />
          </div>
          <BlogInlineCTA role="azafata" variant="upgrade" />
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Tarifas por perfil de azafata en Tarragona</h2>
              <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                <table className="w-full text-xs">
                  <thead><tr style={{ background: 'rgba(5,150,105,0.08)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}><th className="text-left px-4 py-3 font-bold">Perfil</th><th className="px-4 py-3 font-bold text-right">Tarifa</th><th className="px-4 py-3 font-bold text-left hidden sm:table-cell">Nota</th></tr></thead>
                  <tbody>{PRECIOS.map((row, i) => (<tr key={row.perfil} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)', borderBottom: '1px solid rgba(0,0,0,0.04)' }}><td className="px-4 py-3 font-medium">{row.perfil}</td><td className="px-4 py-3 text-right font-bold" style={{ color: '#059669' }}>{row.tarifa}</td><td className="px-4 py-3 hidden sm:table-cell" style={{ color: '#3d3d4e' }}>{row.nota}</td></tr>))}</tbody>
                </table>
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Precios Tarragona 2026. Sin IVA. Desplazamiento fuera del área metropolitana puede facturarse aparte.</p>
            </section>
            <section>
              <h2 className="text-lg font-black mb-3">Dónde se concentra la demanda en Tarragona</h2>
              <div className="space-y-2">{['Casco antiguo y Anfiteatro Romano: eventos culturales e institucionales, Patrimonio de la Humanidad UNESCO','Polígono petroquímico y zona industrial: eventos corporativos del sector químico y logístico','Palacio de Congresos: congresos profesionales y actos institucionales','Puerto de Tarragona y paseo marítimo: presentaciones y eventos de empresa'].map((item,i) => (<div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.02)' }}><span className="text-xs font-black shrink-0 mt-0.5" style={{ color: '#059669' }}>✓</span><p className="text-xs" style={{ color: '#111' }}>{item}</p></div>))}</div>
            </section>
            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">{faqStructured.mainEntity.map(f => (<div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}><h3 className="text-sm font-bold mb-2">{f.name}</h3><p className="text-sm leading-relaxed" style={{ color: '#222' }}>{f.acceptedAnswer.text}</p></div>))}</div>
            </section>
            <section className="mt-8">
              <h2 className="text-base font-black mb-3" style={{ color: '#111' }}>Artículos relacionados</h2>
              <div className="space-y-2">
                {[
                  { href: '/blog/precio-azafatas-barcelona', cat: 'Cataluña', title: 'Precio azafatas para eventos en Barcelona: guía 2026' },
                  { href: '/blog/staff-para-eventos', cat: 'Hub Staff', title: 'Staff para eventos: guía completa 2026' },
                  { href: '/blog/precio-azafatas-eventos-espana', cat: 'Nacional', title: 'Precio azafatas para eventos en España: guía 2026' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(5,150,105,0.1)', color: '#059669', border: '1px solid rgba(5,150,105,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: '#222' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>
            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(5,150,105,0.04)', border: '1px solid rgba(5,150,105,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Necesitas azafatas para tu evento en Tarragona?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>XPEAK conecta organizadores con staff profesional verificado en Tarragona. Contrato digital automático incluido.</p>
              <a href="/contratar-staff/tarragona" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#059669,#B8941E)', color: '#000' }}>Ver staff en Tarragona →</a>
            </div>
          </div>
          <BlogEmailCapture variant="presupuestos" intent="contratar-staff" articlePath="/blog/precio-azafatas-tarragona" />
        </main>
        <DJResourcesAffiliate role="staff" />
        <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/precio-azafatas-tarragona' tag='Staff' />
        <FooterPublic />
        <BlogScrollCTA role="azafata" storageKey="xpeak_scrollcta_precio_azafatas_tarragona" />
      </div>
    </>
  );
}
