import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogAnswerBox from '@/components/BlogAnswerBox';
import BlogAuthor from '@/components/BlogAuthor';
import DJResourcesAffiliate from '@/components/DJResourcesAffiliate';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Precio de azafatas para eventos en Estepona: guía 2026', description: 'Cuánto cobran las azafatas para bodas en villas, eventos hoteleros y actos en Estepona. Tarifas 2026.', datePublished: '2026-06-14', dateModified: '2026-07-25', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/precio-azafatas-estepona' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cobran las azafatas de eventos en Estepona?', acceptedAnswer: { '@type': 'Answer', text: 'En Estepona, una azafata de eventos cobra entre 15€ y 23€/hora bruto, por encima de la media nacional gracias al perfil de turismo de calidad creciente de la zona. Las agencias facturan al cliente entre 150€ y 250€/día por perfil, algo por debajo de Marbella pero claramente en la franja alta de la Costa del Sol.' } },
  { '@type': 'Question', name: '¿Dónde se concentran los eventos en Estepona?', acceptedAnswer: { '@type': 'Answer', text: 'Las villas y fincas privadas del entorno de Estepona, conocida como el "jardín de la Costa del Sol" por sus murales y flores, son el escenario habitual de bodas de gama alta. Los hoteles de la zona también acogen eventos corporativos y celebraciones en temporada alta, con el paseo marítimo y el casco antiguo como puntos de referencia para actos más pequeños.' } },
  { '@type': 'Question', name: '¿Con cuánta antelación reservar azafatas en Estepona?', acceptedAnswer: { '@type': 'Answer', text: 'Para bodas en villas de Estepona en temporada alta (mayo-septiembre) conviene reservar con 2-3 meses de antelación, sobre todo si se necesitan perfiles bilingües por la clientela internacional. Para eventos hoteleros puntuales, 2-3 semanas suele ser suficiente.' } },
  { '@type': 'Question', name: '¿Por qué Estepona es más cara que otras plazas de interior?', acceptedAnswer: { '@type': 'Answer', text: 'El crecimiento del turismo de calidad en Estepona, con villas y fincas de alto standing, ha elevado las tarifas por encima de la media nacional. Aun así, se mantiene por debajo de Marbella, que concentra un volumen mayor de eventos de lujo internacional.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Azafatas Estepona', item: 'https://xpeak.es/blog/precio-azafatas-estepona' }] };

const PRECIOS = [
  { perfil: 'Azafata de stand / feria', tarifa: '150–200€/día', nota: 'Jornada completa 8h' },
  { perfil: 'Azafata de imagen', tarifa: '170–260€/día', nota: 'Eventos de marca y hoteleros' },
  { perfil: 'Azafata bilingüe (inglés)', tarifa: '190–250€/día', nota: 'Muy solicitada por turismo internacional' },
  { perfil: 'Azafata trilingüe', tarifa: '220–320€/día', nota: 'Bodas y eventos de villas' },
  { perfil: 'Coordinadora de azafatas', tarifa: '210–300€/día', nota: 'Gestión de equipo en boda o evento grande' },
  { perfil: 'Pack evento en villa/hotel (4h)', tarifa: '100–170€', nota: 'Estepona y alrededores' },
];

export default function BlogPrecioAzafatasEstepona() {
  return (
    <>
      <Helmet>
        <title>Precio azafatas para eventos en Estepona 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cobran las azafatas para bodas en villas y eventos hoteleros en Estepona. Tarifas 2026." />
        <link rel="canonical" href="https://xpeak.es/blog/precio-azafatas-estepona" />
        <meta property="og:title" content="Precio azafatas eventos Estepona 2026 — XPEAK Blog" />
        <meta property="og:description" content="Tarifas de azafatas para bodas en villas y eventos hoteleros en Estepona." />
        <meta property="og:url" content="https://xpeak.es/blog/precio-azafatas-estepona" />
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
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>Staff · Estepona · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Precio de azafatas para eventos en Estepona: guía 2026</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#3d3d4e' }}>Estepona, conocida como el "jardín de la Costa del Sol" por sus murales y jardines, vive un crecimiento sostenido del turismo de calidad. Esto ha traído más bodas en villas y fincas privadas, con tarifas de azafatas por encima de la media nacional aunque algo por debajo de Marbella.</p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>8 julio 2026</time>
            <BlogAnswerBox
              question="¿Cuánto cobran las azafatas en Estepona?"
              answer="Una azafata de eventos en Estepona cobra entre 15€ y 23€/hora bruto, y las agencias facturan entre 150€ y 250€/día por el servicio completo. Es una tarifa por encima de la media nacional gracias al turismo de calidad de la zona, aunque algo por debajo de Marbella."
            />
          </div>
          <BlogInlineCTA role="azafata" variant="upgrade" />
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Tarifas por perfil de azafata en Estepona</h2>
              <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <table className="w-full text-xs">
                  <thead><tr style={{ background: 'rgba(212,175,55,0.08)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}><th className="text-left px-4 py-3 font-bold">Perfil</th><th className="px-4 py-3 font-bold text-right">Tarifa</th><th className="px-4 py-3 font-bold text-left hidden sm:table-cell">Nota</th></tr></thead>
                  <tbody>{PRECIOS.map((row, i) => (<tr key={row.perfil} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="px-4 py-3 font-medium">{row.perfil}</td><td className="px-4 py-3 text-right font-bold" style={{ color: '#D4AF37' }}>{row.tarifa}</td><td className="px-4 py-3 hidden sm:table-cell" style={{ color: '#3d3d4e' }}>{row.nota}</td></tr>))}</tbody>
                </table>
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Precios Estepona 2026, temporada alta. Sin IVA. Desplazamiento a villas fuera del núcleo urbano puede facturarse aparte.</p>
            </section>
            <section>
              <h2 className="text-lg font-black mb-3">Dónde se concentra la demanda en Estepona</h2>
              <div className="space-y-2">{['Villas y fincas privadas del entorno: bodas de gama alta y celebraciones exclusivas','Hoteles de la zona: eventos corporativos y celebraciones en temporada alta','Casco antiguo y paseo marítimo: actos institucionales y eventos culturales de menor formato','Temporada alta (mayo-septiembre): pico de demanda con mayor afluencia turística'].map((item,i) => (<div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}><span className="text-xs font-black shrink-0 mt-0.5" style={{ color: '#D4AF37' }}>✓</span><p className="text-xs" style={{ color: 'rgba(255,255,255,0.8)' }}>{item}</p></div>))}</div>
            </section>
            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">{faqStructured.mainEntity.map(f => (<div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}><h3 className="text-sm font-bold mb-2">{f.name}</h3><p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>{f.acceptedAnswer.text}</p></div>))}</div>
            </section>
            <section className="mt-8">
              <h2 className="text-base font-black mb-3" style={{ color: 'rgba(255,255,255,0.85)' }}>Artículos relacionados</h2>
              <div className="space-y-2">
                {[
                  { href: '/blog/precio-azafatas-marbella', cat: 'Costa del Sol', title: 'Precio azafatas para eventos en Marbella: guía 2026' },
                  { href: '/blog/precio-azafatas-malaga', cat: 'Costa del Sol', title: 'Precio azafatas para eventos en Málaga: guía 2026' },
                  { href: '/blog/precio-azafatas-fuengirola', cat: 'Costa del Sol', title: 'Precio azafatas para eventos en Fuengirola: guía 2026' },
                  { href: '/blog/staff-para-eventos', cat: 'Hub Staff', title: 'Staff para eventos: guía completa 2026' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.72)' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>
            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Necesitas azafatas para tu evento en Estepona?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>XPEAK conecta organizadores con staff profesional verificado en Estepona. Contrato digital automático incluido.</p>
              <a href="/contratar-staff/estepona" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Ver staff en Estepona →</a>
            </div>
          </div>
          <BlogEmailCapture variant="presupuestos" intent="contratar-staff" articlePath="/blog/precio-azafatas-estepona" />
        </main>
        <DJResourcesAffiliate role="staff" />
        <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/precio-azafatas-estepona' tag='Staff' />
        <FooterPublic />
        <BlogScrollCTA role="azafata" storageKey="xpeak_scrollcta_precio_azafatas_estepona" />
      </div>
    </>
  );
}
