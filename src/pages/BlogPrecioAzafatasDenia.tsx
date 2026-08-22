import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogAnswerBox from '@/components/BlogAnswerBox';
import BlogAuthor from '@/components/BlogAuthor';
import DJResourcesAffiliate from '@/components/DJResourcesAffiliate';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Precio de azafatas para eventos en Dénia: guía 2026', description: 'Cuánto cobran las azafatas para eventos gastronómicos, náuticos y corporativos en Dénia. Tarifas por perfil 2026.', datePublished: '2026-05-17', dateModified: '2026-07-31', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/precio-azafatas-denia' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cobran las azafatas de eventos en Dénia?', acceptedAnswer: { '@type': 'Answer', text: 'En Dénia, una azafata de eventos cobra entre 14€ y 20€/hora bruto, por encima de la media nacional gracias a un turismo de calidad creciente y su reconocimiento como Ciudad Creativa de la Gastronomía UNESCO. Las agencias facturan al cliente entre 140€ y 210€/día por perfil. El verano y los eventos gastronómicos concentran la mayor demanda.' } },
  { '@type': 'Question', name: '¿Dónde se concentran los eventos en Dénia?', acceptedAnswer: { '@type': 'Answer', text: 'El puerto de Dénia, con conexión de ferry a Baleares, es un punto neurálgico de actividad y eventos náuticos. El casco histórico y la zona gastronómica, vinculada al reconocimiento UNESCO de la ciudad, acogen presentaciones de producto y eventos de restauración de alto nivel, especialmente en temporada alta.' } },
  { '@type': 'Question', name: '¿Con cuánta antelación reservar azafatas en Dénia?', acceptedAnswer: { '@type': 'Answer', text: 'En temporada alta (junio-septiembre), con el turismo de calidad y los eventos gastronómicos en su punto álgido, conviene reservar con 4-6 semanas de antelación. Fuera de temporada, 2 semanas suele ser suficiente.' } },
  { '@type': 'Question', name: '¿Qué perfil de azafata se pide más en Dénia?', acceptedAnswer: { '@type': 'Answer', text: 'El perfil de imagen para eventos gastronómicos y presentaciones de producto gourmet es el más demandado, ligado al prestigio culinario de la ciudad. También hay demanda de perfiles bilingües para el turismo internacional que llega vía puerto y aeropuerto cercano.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Azafatas Dénia', item: 'https://xpeak.es/blog/precio-azafatas-denia' }] };

const PRECIOS = [
  { perfil: 'Azafata de stand / feria', tarifa: '140–185€/día', nota: 'Jornada completa 8h' },
  { perfil: 'Azafata de imagen gastronómica', tarifa: '165–240€/día', nota: 'Eventos gourmet y presentaciones de producto' },
  { perfil: 'Azafata bilingüe (inglés)', tarifa: '175–225€/día', nota: 'Turismo internacional vía puerto y aeropuerto' },
  { perfil: 'Azafata trilingüe', tarifa: '200–290€/día', nota: 'Eventos náuticos y turismo de calidad' },
  { perfil: 'Coordinadora de azafatas', tarifa: '190–260€/día', nota: 'Gestión de equipo en eventos grandes' },
  { perfil: 'Pack evento en puerto (4h)', tarifa: '90–140€', nota: 'Sube en temporada alta (junio-septiembre)' },
];

export default function BlogPrecioAzafatasDenia() {
  return (
    <>
      <Helmet>
        <title>Precio azafatas para eventos en Dénia 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cobran las azafatas para eventos gastronómicos y náuticos en Dénia. Tarifas por perfil 2026." />
        <link rel="canonical" href="https://xpeak.es/blog/precio-azafatas-denia" />
        <meta property="og:title" content="Precio azafatas eventos Dénia 2026 — XPEAK Blog" />
        <meta property="og:description" content="Tarifas de azafatas para eventos gastronómicos y turísticos en Dénia." />
        <meta property="og:url" content="https://xpeak.es/blog/precio-azafatas-denia" />
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
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#059669' }}>Staff · Dénia · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Precio de azafatas para eventos en Dénia: guía 2026</h1>
            <p className="text-base leading-relaxed" style={{ color: '#3d3d4e' }}>Dénia, Ciudad Creativa de la Gastronomía UNESCO, combina un turismo de calidad creciente con un puerto activo con ferry a Baleares. Las tarifas de azafatas están por encima de la media nacional, con eventos gastronómicos de alto nivel como motor principal.</p>
            <time className="text-xs mt-3 block" style={{ color: '#666' }}>8 julio 2026</time>
            <BlogAnswerBox
              question="¿Cuánto cobran las azafatas en Dénia?"
              answer="Una azafata de eventos en Dénia cobra entre 14€ y 20€/hora bruto, y las agencias facturan entre 140€ y 210€/día por el servicio completo. Los eventos gastronómicos de alto nivel, ligados al reconocimiento UNESCO de la ciudad, elevan la tarifa de los perfiles de imagen."
            />
          </div>
          <BlogInlineCTA role="azafata" variant="upgrade" />
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Tarifas por perfil de azafata en Dénia</h2>
              <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                <table className="w-full text-xs">
                  <thead><tr style={{ background: 'rgba(5,150,105,0.08)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}><th className="text-left px-4 py-3 font-bold">Perfil</th><th className="px-4 py-3 font-bold text-right">Tarifa</th><th className="px-4 py-3 font-bold text-left hidden sm:table-cell">Nota</th></tr></thead>
                  <tbody>{PRECIOS.map((row, i) => (<tr key={row.perfil} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)', borderBottom: '1px solid rgba(0,0,0,0.04)' }}><td className="px-4 py-3 font-medium">{row.perfil}</td><td className="px-4 py-3 text-right font-bold" style={{ color: '#059669' }}>{row.tarifa}</td><td className="px-4 py-3 hidden sm:table-cell" style={{ color: '#3d3d4e' }}>{row.nota}</td></tr>))}</tbody>
                </table>
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Precios Dénia 2026. Sin IVA. Tarifas de temporada alta (junio-septiembre) pueden subir un 10-15%.</p>
            </section>
            <section>
              <h2 className="text-lg font-black mb-3">Dónde se concentra la demanda en Dénia</h2>
              <div className="space-y-2">{['Puerto de Dénia: eventos náuticos y actividad ligada al ferry a Baleares','Casco histórico y zona gastronómica: eventos gourmet vinculados al reconocimiento UNESCO','Espacios de eventos en primera línea de playa: turismo de calidad en temporada alta','Zona comercial y de restauración del centro: presentaciones de producto y activaciones de marca'].map((item,i) => (<div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.02)' }}><span className="text-xs font-black shrink-0 mt-0.5" style={{ color: '#059669' }}>✓</span><p className="text-xs" style={{ color: '#111' }}>{item}</p></div>))}</div>
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
              <p className="text-sm font-black mb-2">¿Necesitas azafatas para tu evento en Dénia?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>XPEAK conecta organizadores con staff profesional verificado en Dénia. Contrato digital automático incluido.</p>
              <a href="/contratar-staff/denia" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#059669,#B8941E)', color: '#000' }}>Ver staff en Dénia →</a>
            </div>
          </div>
          <BlogEmailCapture variant="presupuestos" intent="contratar-staff" articlePath="/blog/precio-azafatas-denia" />
        </main>
        <DJResourcesAffiliate role="azafata" />
        <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/precio-azafatas-denia' tag='Staff' />
        <FooterPublic />
        <BlogScrollCTA role="azafata" storageKey="xpeak_scrollcta_precio_azafatas_denia" />
      </div>
    </>
  );
}
