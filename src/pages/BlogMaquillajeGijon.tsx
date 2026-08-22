import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogAnswerBox from '@/components/BlogAnswerBox';
import BlogAuthor from '@/components/BlogAuthor';
import DJResourcesAffiliate from '@/components/DJResourcesAffiliate';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Precio de maquilladora para eventos en Gijón: guía 2026', description: 'Cuánto cobra una maquilladora para bodas en sidrerías, eventos con vistas al mar y sesiones de foto en Gijón. Tarifas 2026.', datePublished: '2026-06-14', dateModified: '2026-07-30', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/maquillaje-eventos-gijon' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cobra una maquilladora para eventos en Gijón?', acceptedAnswer: { '@type': 'Answer', text: 'En Gijón una maquilladora para novia cobra entre 95€ y 230€, en línea con la media nacional. Para eventos corporativos, el precio por persona ronda 30€-65€. En verano, con el pico de bodas en sidrerías y espacios con vistas al mar, conviene reservar con más antelación.' } },
  { '@type': 'Question', name: '¿Dónde se concentra la demanda de maquilladoras en Gijón?', acceptedAnswer: { '@type': 'Answer', text: 'Las sidrerías y espacios con vistas al Cantábrico concentran gran parte de las bodas de verano en Gijón. También hay demanda de maquillaje para eventos corporativos en el centro de la ciudad y para sesiones de foto ligadas al turismo de costa.' } },
  { '@type': 'Question', name: '¿Con cuánta antelación reservar maquilladora para una boda en Gijón?', acceptedAnswer: { '@type': 'Answer', text: 'En Gijón, temporada alta de bodas (mayo-septiembre), reserva con 2-3 meses de antelación, sobre todo si quieres una prueba de maquillaje previa. Las fechas cercanas a la Semana Grande de agosto son especialmente solicitadas.' } },
  { '@type': 'Question', name: '¿Es más caro el maquillaje de novia que el de invitada en Gijón?', acceptedAnswer: { '@type': 'Answer', text: 'Sí. El maquillaje de novia incluye prueba previa y una sesión más larga (60-90 min), por lo que cuesta entre 95€ y 230€. El de madrina o invitada especial es más rápido (45-60 min) y ronda los 55€-110€ en Gijón.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Maquillaje Gijón', item: 'https://xpeak.es/blog/maquillaje-eventos-gijon' }] };

const PRECIOS = [
  { perfil: 'Maquillaje novia (solo)', tarifa: '95–230€', nota: 'Incluye prueba previa' },
  { perfil: 'Maquillaje novia + peinado', tarifa: '190–410€', nota: 'Servicio integral más demandado' },
  { perfil: 'Madrina / invitada especial', tarifa: '55–110€', nota: 'Sin prueba previa habitualmente' },
  { perfil: 'Pack boda (novia + 3 personas)', tarifa: '320–640€', nota: 'Desplazamiento a sidrería o finca incluido' },
  { perfil: 'Evento corporativo / azafata', tarifa: '30–65€/persona', nota: 'Maquillaje fast-track profesional' },
  { perfil: 'Sesión foto / vídeo', tarifa: '80–190€', nota: 'HD, luz de costa, retoque incluido' },
];

export default function BlogMaquillajeGijon() {
  return (
    <>
      <Helmet>
        <title>Precio maquilladora para eventos en Gijón 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cobra una maquilladora para bodas en sidrerías y eventos con vistas al mar en Gijón. Tarifas 2026." />
        <link rel="canonical" href="https://xpeak.es/blog/maquillaje-eventos-gijon" />
        <meta property="og:title" content="Precio maquilladora eventos Gijón 2026 — XPEAK Blog" />
        <meta property="og:description" content="Tarifas de maquilladoras para bodas y eventos en Gijón." />
        <meta property="og:url" content="https://xpeak.es/blog/maquillaje-eventos-gijon" />
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
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#DB2777' }}>Maquillaje · Gijón · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Precio de maquilladora para eventos en Gijón: guía 2026</h1>
            <p className="text-base leading-relaxed" style={{ color: '#3d3d4e' }}>Gijón vive su temporada alta de bodas entre mayo y septiembre, con sidrerías y espacios con vistas al Cantábrico como escenarios más buscados. Las tarifas se mantienen en línea con la media nacional.</p>
            <time className="text-xs mt-3 block" style={{ color: '#666' }}>8 julio 2026</time>
            <BlogAnswerBox
              question="¿Cuánto cobra una maquilladora en Gijón?"
              answer="Una maquilladora de novia en Gijón cobra entre 95€ y 230€, incluyendo prueba previa. El pack boda completo (novia + 3 personas) ronda los 320€-640€. Para eventos corporativos, el precio por persona está entre 30€ y 65€."
            />
          </div>
          <BlogInlineCTA role="makeup" variant="upgrade" />
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Tarifas de maquillaje para eventos en Gijón</h2>
              <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                <table className="w-full text-xs">
                  <thead><tr style={{ background: 'rgba(219,39,119,0.08)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}><th className="text-left px-4 py-3 font-bold">Servicio</th><th className="px-4 py-3 font-bold text-right">Precio</th><th className="px-4 py-3 font-bold text-left hidden sm:table-cell">Nota</th></tr></thead>
                  <tbody>{PRECIOS.map((row, i) => (<tr key={row.perfil} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)', borderBottom: '1px solid rgba(0,0,0,0.04)' }}><td className="px-4 py-3 font-medium">{row.perfil}</td><td className="px-4 py-3 text-right font-bold" style={{ color: '#DB2777' }}>{row.tarifa}</td><td className="px-4 py-3 hidden sm:table-cell" style={{ color: '#3d3d4e' }}>{row.nota}</td></tr>))}</tbody>
                </table>
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Precios Gijón 2026. Desplazamiento a sidrerías o fincas fuera del área urbana puede facturarse aparte.</p>
            </section>
            <section>
              <h2 className="text-lg font-black mb-3">Dónde se concentra la demanda en Gijón</h2>
              <div className="space-y-2">{['Sidrerías y espacios con vistas al Cantábrico: temporada alta de mayo a septiembre','Puerto Deportivo y Playa de San Lorenzo: maquillaje para bodas y eventos al aire libre','Centro de Gijón: maquillaje corporativo y eventos de empresa','Semana Grande de Gijón (agosto): pico de demanda para celebraciones y eventos'].map((item,i) => (<div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.02)' }}><span className="text-xs font-black shrink-0 mt-0.5" style={{ color: '#DB2777' }}>✓</span><p className="text-xs" style={{ color: '#111' }}>{item}</p></div>))}</div>
            </section>
            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">{faqStructured.mainEntity.map(f => (<div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}><h3 className="text-sm font-bold mb-2">{f.name}</h3><p className="text-sm leading-relaxed" style={{ color: '#222' }}>{f.acceptedAnswer.text}</p></div>))}</div>
            </section>
            <section className="mt-8">
              <h2 className="text-base font-black mb-3" style={{ color: '#111' }}>Artículos relacionados</h2>
              <div className="space-y-2">
                {[
                  { href: '/blog/maquilladora-para-eventos-precio', cat: 'Nacional', title: 'Maquilladora para eventos: precios en España 2026' },
                  { href: '/blog/maquillaje-nupcial-precio-guia', cat: 'Bodas', title: 'Maquillaje nupcial: precios y guía 2026' },
                  { href: '/blog/maquillaje-eventos-oviedo', cat: 'Asturias', title: 'Precio maquilladora para eventos en Oviedo 2026' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(219,39,119,0.1)', color: '#DB2777', border: '1px solid rgba(219,39,119,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: '#222' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>
            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(219,39,119,0.04)', border: '1px solid rgba(219,39,119,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Necesitas maquilladora para tu evento en Gijón?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>XPEAK conecta organizadores con maquilladoras profesionales verificadas en Gijón. Contrato digital automático incluido.</p>
              <a href="/contratar-maquillaje/gijon" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#DB2777,#B8941E)', color: '#000' }}>Ver maquilladoras en Gijón →</a>
            </div>
          </div>
          <BlogEmailCapture variant="presupuestos" intent="contratar-makeup" articlePath="/blog/maquillaje-eventos-gijon" />
        </main>
        <DJResourcesAffiliate role="maquillaje" />
        <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/maquillaje-eventos-gijon' tag='Maquillaje' />
        <FooterPublic />
        <BlogScrollCTA role="general" storageKey="xpeak_scrollcta_maquillaje_gijon" />
      </div>
    </>
  );
}
