import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogAnswerBox from '@/components/BlogAnswerBox';
import BlogAuthor from '@/components/BlogAuthor';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Precio de azafatas para eventos en Elche: guía 2026', description: 'Cuánto cobran las azafatas para eventos, ferias del calzado y actos corporativos en Elche. Tarifas por perfil 2026.', datePublished: '2026-06-27', dateModified: '2026-07-17', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/precio-azafatas-elche' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cobran las azafatas de eventos en Elche?', acceptedAnswer: { '@type': 'Answer', text: 'En Elche, una azafata de eventos cobra entre 12€ y 17€/hora bruto, en línea o algo por debajo de la media de las grandes capitales, por ser un mercado más comercial e industrial que ferial masivo. Las agencias facturan al cliente entre 110€ y 165€/día por perfil. La industria histórica del calzado de la zona genera demanda constante de perfiles comerciales.' } },
  { '@type': 'Question', name: '¿Dónde se concentran los eventos en Elche?', acceptedAnswer: { '@type': 'Answer', text: 'El Parque Empresarial y las naves del sector del calzado, industria histórica de Elche, concentran ferias y jornadas comerciales durante el año. El centro histórico, junto al Palmeral de Elche (Patrimonio de la Humanidad UNESCO), acoge actos institucionales y culturales, y el Misteri d\'Elx en agosto moviliza personal de organización y protocolo.' } },
  { '@type': 'Question', name: '¿Con cuánta antelación reservar azafatas en Elche?', acceptedAnswer: { '@type': 'Answer', text: 'Para ferias del sector del calzado y jornadas comerciales conviene reservar con 3-4 semanas de antelación. Durante el Misteri d\'Elx en agosto, la demanda de personal de organización sube, así que conviene anticiparse con 4-6 semanas si el evento coincide con esas fechas.' } },
  { '@type': 'Question', name: '¿Qué perfil de azafata se pide más en Elche?', acceptedAnswer: { '@type': 'Answer', text: 'El perfil comercial para ferias y showrooms del sector del calzado es el más demandado. También hay demanda de azafatas de protocolo para actos institucionales vinculados al patrimonio de la ciudad y eventos culturales en el centro histórico.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Azafatas Elche', item: 'https://xpeak.es/blog/precio-azafatas-elche' }] };

const PRECIOS = [
  { perfil: 'Azafata de stand / feria del calzado', tarifa: '110–150€/día', nota: 'Jornada completa 8h' },
  { perfil: 'Azafata de imagen', tarifa: '130–185€/día', nota: 'Presentaciones y showrooms de marca' },
  { perfil: 'Azafata bilingüe (inglés)', tarifa: '145–180€/día', nota: 'Ferias con compradores internacionales' },
  { perfil: 'Azafata de protocolo institucional', tarifa: '120–165€/día', nota: 'Actos culturales y Misteri d\'Elx' },
  { perfil: 'Coordinadora de azafatas', tarifa: '160–215€/día', nota: 'Gestión de equipo en eventos grandes' },
  { perfil: 'Pack evento corporativo (4h)', tarifa: '70–115€', nota: 'Acto único, media jornada' },
];

export default function BlogPrecioAzafatasElche() {
  return (
    <>
      <Helmet>
        <title>Precio azafatas para eventos en Elche 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cobran las azafatas para eventos y ferias del calzado en Elche. Tarifas por perfil 2026." />
        <link rel="canonical" href="https://xpeak.es/blog/precio-azafatas-elche" />
        <meta property="og:title" content="Precio azafatas eventos Elche 2026 — XPEAK Blog" />
        <meta property="og:description" content="Tarifas de azafatas para ferias y eventos corporativos en Elche." />
        <meta property="og:url" content="https://xpeak.es/blog/precio-azafatas-elche" />
        <meta property="og:type" content="article" /><meta property="og:image" content="https://xpeak.es/og-image.jpg" /><meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" /><meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>
      <div className="min-h-screen" style={{ background: '#090909', color: '#fff' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-3xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#D4AF37' }}>XPEAK</a>
          <div className="flex items-center gap-3"><a href="/blog" className="text-xs font-bold " style={{ color: '#3d3d4e' }}>Blog</a><a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Unirse gratis</a></div>
        </nav>
        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>Staff · Elche · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Precio de azafatas para eventos en Elche: guía 2026</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#3d3d4e' }}>Elche combina una industria histórica del calzado con un patrimonio cultural único (el Palmeral, Patrimonio de la Humanidad). Su mercado de eventos es más comercial que turístico, con tarifas ajustadas y demanda constante de perfiles de feria.</p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>8 julio 2026</time>
            <BlogAnswerBox
              question="¿Cuánto cobran las azafatas en Elche?"
              answer="Una azafata de eventos en Elche cobra entre 12€ y 17€/hora bruto, y las agencias facturan entre 110€ y 165€/día por el servicio completo. Las ferias y showrooms del sector del calzado son el principal motor de demanda durante el año."
            />
          </div>
          <BlogInlineCTA role="azafata" variant="upgrade" />
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Tarifas por perfil de azafata en Elche</h2>
              <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <table className="w-full text-xs">
                  <thead><tr style={{ background: 'rgba(212,175,55,0.08)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}><th className="text-left px-4 py-3 font-bold">Perfil</th><th className="px-4 py-3 font-bold text-right">Tarifa</th><th className="px-4 py-3 font-bold text-left hidden sm:table-cell">Nota</th></tr></thead>
                  <tbody>{PRECIOS.map((row, i) => (<tr key={row.perfil} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="px-4 py-3 font-medium">{row.perfil}</td><td className="px-4 py-3 text-right font-bold" style={{ color: '#D4AF37' }}>{row.tarifa}</td><td className="px-4 py-3 hidden sm:table-cell" style={{ color: '#3d3d4e' }}>{row.nota}</td></tr>))}</tbody>
                </table>
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Precios Elche 2026. Sin IVA. Desplazamiento fuera del área metropolitana puede facturarse aparte.</p>
            </section>
            <section>
              <h2 className="text-lg font-black mb-3">Dónde se concentra la demanda en Elche</h2>
              <div className="space-y-2">{['Parque Empresarial y naves del sector del calzado: ferias y jornadas comerciales','Centro histórico y Palmeral de Elche (Patrimonio de la Humanidad): actos institucionales y culturales','Misteri d\'Elx (agosto): personal de organización y protocolo para el evento cultural más importante de la ciudad','Polígonos industriales de la zona: showrooms y presentaciones de marca B2B'].map((item,i) => (<div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}><span className="text-xs font-black shrink-0 mt-0.5" style={{ color: '#D4AF37' }}>✓</span><p className="text-xs" style={{ color: 'rgba(255,255,255,0.8)' }}>{item}</p></div>))}</div>
            </section>
            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">{faqStructured.mainEntity.map(f => (<div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}><h3 className="text-sm font-bold mb-2">{f.name}</h3><p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>{f.acceptedAnswer.text}</p></div>))}</div>
            </section>
            <section className="mt-8">
              <h2 className="text-base font-black mb-3" style={{ color: 'rgba(255,255,255,0.85)' }}>Artículos relacionados</h2>
              <div className="space-y-2">
                {[
                  { href: '/blog/staff-para-eventos', cat: 'Hub Staff', title: 'Staff para eventos: guía completa 2026' },
                  { href: '/blog/precio-azafatas-eventos-espana', cat: 'Nacional', title: 'Precio azafatas para eventos en España: guía 2026' },
                  { href: '/blog/personal-de-imagen-ferias-y-congresos', cat: 'Staff', title: 'Personal de imagen para ferias y congresos' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.72)' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>
            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Necesitas azafatas para tu evento en Elche?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>XPEAK conecta organizadores con staff profesional verificado en Elche. Contrato digital automático incluido.</p>
              <a href="/contratar-staff/elche" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Ver staff en Elche →</a>
            </div>
          </div>
          <BlogEmailCapture variant="presupuestos" intent="contratar-staff" articlePath="/blog/precio-azafatas-elche" />
        </main>
        <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/precio-azafatas-elche' tag='Staff' />
        <FooterPublic />
        <BlogScrollCTA role="azafata" storageKey="xpeak_scrollcta_precio_azafatas_elche" />
      </div>
    </>
  );
}
