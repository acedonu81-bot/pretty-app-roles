import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogShare from '@/components/BlogShare';
const slug = 'dj-bodas-pamplona'; const ciudad = 'Pamplona';
const PRECIOS = [{ servicio: 'Solo pista (4-5h)', precio: '350–800€' },{ servicio: 'Cóctel + pista', precio: '550–1.200€' },{ servicio: 'Servicio completo', precio: '700–1.800€' },{ servicio: 'Pack masía o palacio premium', precio: '1.000–2.000€' }];
const ZONAS = [{ zona: 'Pamplona capital', fincas: 'Palacios de Navarra, casonas históricas', nota: 'Ambiente urbano único' },{ zona: 'Valle de Ulzama / Norte', fincas: 'Caseríos entre hayedos, muy fotogénicos', nota: 'Verde y espectacular' },{ zona: 'Ribera del Ebro', fincas: 'Bodegas de Navarra, masías del sur', nota: 'Vino y clima cálido' },{ zona: 'Pirineos / Roncesvalles', fincas: 'Fincas de montaña con vistas a los Pirineos', nota: 'Para bodas íntimas' }];
const faq = [{ q: `¿Cuánto cuesta un DJ para una boda en ${ciudad}?`, a: `Entre 500€ y 1.800€ servicio completo. Pamplona tiene precios similares a Zaragoza o Bilbao. Las bodas en bodegas de la Ribera Navarra son muy populares en otoño.` },{ q: `¿Los San Fermines afectan a las bodas en julio?`, a: `Sí. Durante los Sanfermines (6-14 julio) los precios de alojamiento y servicios se disparan y muchos proveedores están ocupados. Evita esas fechas o planifícalo con mucha antelación (12-18 meses).` },{ q: `¿Hay música de jota navarra en bodas con DJ?`, a: `Las bodas navarras más tradicionales incluyen un momento de jotas con músico en directo y el DJ lleva la pista de baile después. Muchos DJs locales coordinan bien esta transición.` }];

const serviceSchema = { '@context': 'https://schema.org', '@type': 'Service', name: `DJs para bodas en Pamplona`, description: `Encuentra y contrata DJs verificados para bodas y eventos en Pamplona. Presupuestos gratuitos, contratos digitales y 0% comisión.`, serviceType: 'DJ para bodas y eventos', areaServed: { '@type': 'City', name: 'Pamplona' }, provider: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' }, url: `https://xpeak.es/blog/dj-bodas-pamplona`, offers: { '@type': 'Offer', description: 'Presupuestos gratuitos de DJs verificados', price: '0', priceCurrency: 'EUR' } };
export default function BlogDJBodaPamplona() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: "DJ para bodas en Pamplona: precio 2026",
    description: "",
    author: { '@type': 'Organization', name: 'XPEAK' },
    publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
    datePublished: '2026-06-07',
    dateModified: '2026-06-07',
    url: "https://xpeak.es/blog/dj-bodas-pamplona",
    mainEntityOfPage: { '@type': 'WebPage', '@id': "https://xpeak.es/blog/dj-bodas-pamplona" },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
      { '@type': 'ListItem', position: 3, name: "DJ para bodas en Pamplona: precio 2026", item: "https://xpeak.es/blog/dj-bodas-pamplona" },
    ],
  };

        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
  return (<><Helmet><title>DJ para bodas en Pamplona: precio 2026 | XPEAK</title><meta name="description" content={`Cuánto cuesta un DJ para una boda en ${ciudad}. Precios 2026, caseríos navarros, bodegas Ribera y cómo contratar.`} /><link rel="canonical" href={`https://xpeak.es/blog/${slug}`} /><meta property="og:title" content={`DJ bodas ${ciudad} 2026 — XPEAK`} /><meta property="og:url" content={`https://xpeak.es/blog/${slug}`} /><meta property="og:type" content="article" /><meta property="og:image" content="https://xpeak.es/og-image.jpg" /><meta property="og:site_name" content="XPEAK" /><meta name="twitter:card" content="summary_large_image" /><script type="application/ld+json">{JSON.stringify(serviceSchema)}</script><script type="application/ld+json">{JSON.stringify(articleSchema)}</script><script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script></Helmet>
  <div className="min-h-screen" style={{ background: '#090909', color: '#fff' }}>
    <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-3xl mx-auto"><a href="/" className="text-lg font-black tracking-tight" style={{ color: '#D4AF37' }}>XPEAK</a><div className="flex items-center gap-3"><a href="/blog" className="text-xs font-bold hidden sm:block" style={{ color: '#8E8EA0' }}>Blog</a><a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Unirse gratis</a></div></nav>
    <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
      <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6" style={{ color: '#8E8EA0' }}>← Todos los artículos</a>
      <div className="mb-8"><p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>DJ · {ciudad} · XPEAK Blog</p><h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">DJ para bodas en {ciudad}: precio y cómo contratar en 2026</h1><p className="text-sm leading-relaxed" style={{ color: '#8E8EA0' }}>{ciudad} ofrece desde palacios históricos en la capital hasta caseríos en los valles del norte y bodegas en la Ribera. Precios reales de 2026 para organizar la música perfecta.</p><time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>4 junio 2026</time></div>
      <div className="space-y-10">
        <section><h2 className="text-lg font-black mb-4">Precios DJ boda en {ciudad} (2026)</h2><div className="space-y-2">{PRECIOS.map((r,i)=>(<div key={r.servicio} className="flex items-center justify-between p-4 rounded-xl" style={{background:i%2===0?'rgba(255,255,255,0.025)':'rgba(255,255,255,0.015)',border:'1px solid rgba(255,255,255,0.04)'}}><p className="text-xs font-medium">{r.servicio}</p><span className="text-xs font-bold ml-4 shrink-0" style={{color:'#D4AF37'}}>{r.precio}</span></div>))}</div><p className="text-xs mt-3" style={{color:'#8E8EA0'}}>Precios orientativos 2026. Sin IVA.</p></section>
        <BlogInlineCTA role="dj" variant="upgrade" />
        <section><h2 className="text-lg font-black mb-4">Zonas de boda en {ciudad}</h2><div className="space-y-3">{ZONAS.map((z,i)=>(<div key={z.zona} className="p-4 rounded-xl" style={{background:i%2===0?'rgba(255,255,255,0.025)':'rgba(255,255,255,0.015)',border:'1px solid rgba(255,255,255,0.04)'}}><div className="flex items-start justify-between mb-1"><p className="text-xs font-bold">{z.zona}</p><span className="text-[0.6rem] font-bold px-2 py-0.5 rounded ml-3 shrink-0" style={{background:'rgba(212,175,55,0.1)',color:'#D4AF37'}}>{z.nota}</span></div><p className="text-xs" style={{color:'#8E8EA0'}}>{z.fincas}</p></div>))}</div></section>
        <section><h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2><div className="space-y-4">{faq.map(f=>(<div key={f.q} className="p-5 rounded-xl" style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)'}}><p className="text-sm font-bold mb-2">{f.q}</p><p className="text-xs leading-relaxed" style={{color:'rgba(255,255,255,0.72)'}}>{f.a}</p></div>))}</div></section>
        <div className="p-6 rounded-2xl text-center" style={{background:'rgba(212,175,55,0.04)',border:'1px solid rgba(212,175,55,0.12)'}}><p className="text-sm font-black mb-2">¿Buscas DJ para tu boda en {ciudad}?</p><p className="text-xs mb-4" style={{color:'#8E8EA0'}}>XPEAK conecta con DJs verificados en Navarra y norte de España. Contrato digital automático.</p><a href="/contratar-dj" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black" style={{background:'linear-gradient(90deg,#D4AF37,#B8941E)',color:'#000'}}>Ver DJs de bodas en {ciudad} →</a></div>
      </div>
              <BlogEmailCapture variant="presupuestos" intent="contratar-dj" articlePath="/blog/dj-bodas-pamplona" />
</main>
    <FooterPublic />
    <BlogScrollCTA role="dj" storageKey={`xpeak_scrollcta_${slug}`} />
  </div></>);
}
