import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';
import DJResourcesAffiliate from '@/components/DJResourcesAffiliate';
import BlogAnswerBox from '@/components/BlogAnswerBox';
const slug = 'dj-bodas-salamanca'; const ciudad = 'Salamanca';
const PRECIOS = [{ servicio: 'Solo pista (4-5h)', precio: '280–650€' },{ servicio: 'Cóctel + pista', precio: '450–950€' },{ servicio: 'Servicio completo', precio: '580–1.400€' },{ servicio: 'Pack palacio o convento premium', precio: '800–1.800€' }];
const ZONAS = [{ zona: 'Salamanca capital', fincas: 'Palacios renacentistas, conventos, plazas históricas', nota: 'Patrimonio UNESCO' },{ zona: 'Sierra de Béjar / Gredos', fincas: 'Fincas de montaña, paisajes de sierra', nota: 'Fresco y natural' },{ zona: 'Campo Charro', fincas: 'Dehesas con encinas, fincas de ganadería', nota: 'Bodas rurales, muy amplias' },{ zona: 'Alba de Tormes', fincas: 'Castillos y fincas junto al río Tormes', nota: 'Histórico y romántico' }];
const faq = [{ q: `¿Cuánto cuesta un DJ para una boda en ${ciudad}?`, a: `Entre 400€ y 1.400€. Salamanca tiene precios competitivos. La ciudad universitaria atrae muchas bodas de parejas que estudiaron allí, con presupuestos medios y alta demanda en primavera y otoño.` },{ q: `¿Cuándo es la temporada alta en ${ciudad}?`, a: `Junio y septiembre-octubre son los meses más demandados. La primavera salmantina es suave y perfecta para bodas al exterior. El verano puede ser muy caluroso en la meseta.` },{ q: `¿Los venues del casco histórico de Salamanca permiten música hasta tarde?`, a: `Los espacios dentro del casco histórico (Patrimonio UNESCO) tienen restricciones de ruido. Para bodas con pista de baile hasta las 3-4 de la madrugada, elige fincas en el extrarradio o el Campo Charro.` }];
const faqPageSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };


const serviceSchema = { '@context': 'https://schema.org', '@type': 'Service', name: `DJs para bodas en Salamanca`, description: `Encuentra y contrata DJs verificados para bodas y eventos en Salamanca. Presupuestos gratuitos, contratos digitales y 0% comisión.`, serviceType: 'DJ para bodas y eventos', areaServed: { '@type': 'City', name: 'Salamanca' }, provider: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' }, url: `https://xpeak.es/blog/dj-bodas-salamanca`, offers: { '@type': 'Offer', description: 'Presupuestos gratuitos de DJs verificados', price: '0', priceCurrency: 'EUR' } };
export default function BlogDJBodaSalamanca() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: "DJ para bodas en Salamanca: precio 2026",
    description: "",
    author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' },
    publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
    datePublished: '2026-06-07',
    dateModified: '2026-06-07',
    url: "https://xpeak.es/blog/dj-bodas-salamanca",
    mainEntityOfPage: { '@type': 'WebPage', '@id': "https://xpeak.es/blog/dj-bodas-salamanca" },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
      { '@type': 'ListItem', position: 3, name: "DJ para bodas en Salamanca: precio 2026", item: "https://xpeak.es/blog/dj-bodas-salamanca" },
    ],
  };

        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
  return (<><Helmet><title>DJ para bodas en Salamanca: precio 2026 | XPEAK</title><meta name="description" content={`Cuánto cuesta un DJ para una boda en ${ciudad}. Precios 2026, palacios renacentistas, dehesas y cómo contratar el mejor DJ.`} /><link rel="canonical" href={`https://xpeak.es/blog/${slug}`} /><meta property="og:title" content={`DJ bodas ${ciudad} 2026 — XPEAK`} /><meta property="og:url" content={`https://xpeak.es/blog/${slug}`} /><meta property="og:type" content="article" /><meta property="og:image" content="https://xpeak.es/og-image.jpg" /><meta property="og:site_name" content="XPEAK" /><meta name="twitter:card" content="summary_large_image" /><script type="application/ld+json">{JSON.stringify(serviceSchema)}</script><script type="application/ld+json">{JSON.stringify(articleSchema)}</script><script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script><script type="application/ld+json">{JSON.stringify(faqPageSchema)}</script></Helmet>
  <div className="min-h-screen" style={{ background: '#ffffff', color: '#111' }}>
    <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-3xl mx-auto"><a href="/" className="text-lg font-black tracking-tight" style={{ color: '#D4AF37' }}>XPEAK</a><div className="flex items-center gap-3"><a href="/blog" className="text-xs font-bold hidden sm:block" style={{ color: '#3d3d4e' }}>Blog</a><a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Unirse gratis</a></div></nav>
    <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
      <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>
      <div className="mb-8"><p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>DJ · {ciudad} · XPEAK Blog</p><h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">DJ para bodas en {ciudad}: precio y cómo contratar en 2026</h1><p className="text-base leading-relaxed" style={{ color: '#3d3d4e' }}>{ciudad} es una de las ciudades más bellas de España, con su piedra dorada y palacios renacentistas. Una boda aquí es un evento único. Guía completa de precios para 2026.</p><time className="text-xs mt-3 block" style={{ color: '#666' }}>4 junio 2026</time><BlogAnswerBox question={`¿Cuánto cuesta un DJ para una boda en ${ciudad}?`} answer={`Un DJ para el servicio completo de una boda en ${ciudad} (ceremonia, cóctel, cena y pista de baile) cuesta entre 580 y 1.400€ en 2026. El precio varía según la duración del evento, el equipo técnico incluido y la experiencia del DJ.`} /></div>
      <div className="space-y-10">
        <section><h2 className="text-lg font-black mb-4">Precios DJ boda en {ciudad} (2026)</h2><div className="space-y-2">{PRECIOS.map((r,i)=>(<div key={r.servicio} className="flex items-center justify-between p-4 rounded-xl" style={{background:i%2===0?'rgba(0,0,0,0.025)':'rgba(0,0,0,0.015)',border:'1px solid rgba(0,0,0,0.04)'}}><p className="text-xs font-medium">{r.servicio}</p><span className="text-xs font-bold ml-4 shrink-0" style={{color:'#D4AF37'}}>{r.precio}</span></div>))}</div><p className="text-xs mt-3" style={{color:'#3d3d4e'}}>Precios orientativos 2026. Sin IVA.</p></section>
        <BlogInlineCTA role="dj" variant="upgrade" />
        <section><h2 className="text-lg font-black mb-4">Zonas de boda en {ciudad}</h2><div className="space-y-3">{ZONAS.map((z,i)=>(<div key={z.zona} className="p-4 rounded-xl" style={{background:i%2===0?'rgba(0,0,0,0.025)':'rgba(0,0,0,0.015)',border:'1px solid rgba(0,0,0,0.04)'}}><div className="flex items-start justify-between mb-1"><p className="text-xs font-bold">{z.zona}</p><span className="text-[0.6rem] font-bold px-2 py-0.5 rounded ml-3 shrink-0" style={{background:'rgba(212,175,55,0.1)',color:'#D4AF37'}}>{z.nota}</span></div><p className="text-xs" style={{color:'#3d3d4e'}}>{z.fincas}</p></div>))}</div></section>
        <section><h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2><div className="space-y-4">{faq.map(f=>(<div key={f.q} className="p-5 rounded-xl" style={{background:'rgba(0,0,0,0.03)',border:'1px solid rgba(0,0,0,0.06)'}}><h3 className="text-sm font-bold mb-2">{f.q}</h3><p className="text-sm leading-relaxed" style={{color:'#222'}}>{f.a}</p></div>))}</div></section>
        <div className="p-6 rounded-2xl text-center" style={{background:'rgba(212,175,55,0.04)',border:'1px solid rgba(212,175,55,0.12)'}}><p className="text-sm font-black mb-2">¿Buscas DJ para tu boda en {ciudad}?</p><p className="text-xs mb-4" style={{color:'#3d3d4e'}}>XPEAK conecta con DJs verificados en Castilla y León. Contrato digital automático.</p><a href="/contratar-dj" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black" style={{background:'linear-gradient(90deg,#D4AF37,#B8941E)',color:'#000'}}>Ver DJs de bodas en {ciudad} →</a></div>
      </div>
              <DJResourcesAffiliate role="dj" />

              <BlogEmailCapture variant="presupuestos" intent="contratar-dj" articlePath="/blog/dj-bodas-salamanca" />
</main>
    <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/dj-bodas-salamanca' tag='DJ' />
        <FooterPublic />
    <BlogScrollCTA role="dj" storageKey={`xpeak_scrollcta_${slug}`} />
  </div></>);
}
