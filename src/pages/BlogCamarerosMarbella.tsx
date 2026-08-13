import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogAnswerBox from '@/components/BlogAnswerBox';
import BlogAuthor from '@/components/BlogAuthor';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Precio de camareros para eventos en Marbella: guía 2026', description: 'Cuánto cobran los camareros y bartenders para bodas de lujo y eventos en villas de Marbella. Tarifas 2026.', datePublished: '2026-06-24', dateModified: '2026-07-21', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/camareros-eventos-marbella' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cobra un camarero de eventos en Marbella?', acceptedAnswer: { '@type': 'Answer', text: 'En Marbella, un camarero de eventos cobra entre 15€ y 23€/hora bruto, muy por encima de la media nacional por el peso del turismo de lujo internacional. Los bartenders de coctelería de autor cobran entre 20€ y 30€/hora. Para una boda completa (6-7h) en una villa o hotel 5 estrellas, el presupuesto de sala suele rondar los 1.300€-2.900€.' } },
  { '@type': 'Question', name: '¿Dónde hay más demanda de camareros para eventos en Marbella?', acceptedAnswer: { '@type': 'Answer', text: 'Las villas privadas de la Milla de Oro y los hoteles 5 estrellas del entorno concentran gran parte de las bodas y eventos de lujo, especialmente en verano. Puerto Banús también genera demanda de bartenders y personal de sala para eventos de marca dirigidos a clientela internacional.' } },
  { '@type': 'Question', name: '¿Con cuánta antelación reservar camareros para una boda en Marbella?', acceptedAnswer: { '@type': 'Answer', text: 'Para bodas en villas y hoteles 5 estrellas de Marbella en temporada alta (junio-septiembre) reserva con 3-4 meses de antelación, ya que los equipos con experiencia en eventos de lujo se agotan primero por la alta demanda internacional.' } },
  { '@type': 'Question', name: '¿Por qué los camareros cuestan más en Marbella que en Málaga?', acceptedAnswer: { '@type': 'Answer', text: 'La combinación de clientela internacional de alto poder adquisitivo, bodas en villas y hoteles 5 estrellas y una exigencia de servicio muy alta sitúa las tarifas de Marbella entre un 25% y un 40% por encima de Málaga o Madrid, con perfiles de coctelería de autor especialmente valorados.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Camareros Marbella', item: 'https://xpeak.es/blog/camareros-eventos-marbella' }] };

const PRECIOS = [
  { perfil: 'Camarero/a de sala', tarifa: '15–20€/hora', nota: 'Cóctel, cena sentada o buffet de lujo' },
  { perfil: 'Bartender / coctelería de autor', tarifa: '20–30€/hora', nota: 'Barra libre premium en villas y hoteles 5*' },
  { perfil: 'Jefe de sala / coordinador', tarifa: '26–38€/hora', nota: 'Gestión de equipo en boda o evento de lujo' },
  { perfil: 'Servicio boda completo (6-7h)', tarifa: '190–360€/persona', nota: 'Cóctel + cena + barra en villa o hotel 5*' },
  { perfil: 'Barra libre con bartender (4h)', tarifa: '220–420€', nota: 'Incluye montaje y desmontaje' },
  { perfil: 'Personal evento en Puerto Banús', tarifa: '18–26€/hora', nota: 'Eventos de marca de clientela internacional' },
];

export default function BlogCamarerosMarbella() {
  return (
    <>
      <Helmet>
        <title>Precio camareros para eventos en Marbella 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cobran los camareros y bartenders para bodas de lujo en villas y hoteles 5* de Marbella. Tarifas 2026." />
        <link rel="canonical" href="https://xpeak.es/blog/camareros-eventos-marbella" />
        <meta property="og:title" content="Precio camareros eventos Marbella 2026 — XPEAK Blog" />
        <meta property="og:description" content="Tarifas de camareros y bartenders para bodas de lujo en Marbella." />
        <meta property="og:url" content="https://xpeak.es/blog/camareros-eventos-marbella" />
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
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>Staff · Marbella · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Precio de camareros para eventos en Marbella: guía 2026</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#3d3d4e' }}>Marbella tiene uno de los mercados de eventos más exigentes de España: bodas en villas de la Milla de Oro y hoteles 5 estrellas con clientela internacional de alto poder adquisitivo. Las tarifas de camareros y bartenders son de las más altas del país.</p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>8 julio 2026</time>
            <BlogAnswerBox
              question="¿Cuánto cobran los camareros de eventos en Marbella?"
              answer="Un camarero de eventos en Marbella cobra entre 15€ y 23€/hora bruto, y un bartender de coctelería de autor entre 20€ y 30€/hora. Para una boda completa de 6-7 horas en una villa o hotel 5 estrellas, el presupuesto de personal de sala suele estar entre 1.300€ y 2.900€."
            />
          </div>
          <BlogInlineCTA role="staff" variant="upgrade" />
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Tarifas por perfil de camarero en Marbella</h2>
              <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <table className="w-full text-xs">
                  <thead><tr style={{ background: 'rgba(212,175,55,0.08)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}><th className="text-left px-4 py-3 font-bold">Perfil</th><th className="px-4 py-3 font-bold text-right">Tarifa</th><th className="px-4 py-3 font-bold text-left hidden sm:table-cell">Nota</th></tr></thead>
                  <tbody>{PRECIOS.map((row, i) => (<tr key={row.perfil} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="px-4 py-3 font-medium">{row.perfil}</td><td className="px-4 py-3 text-right font-bold" style={{ color: '#D4AF37' }}>{row.tarifa}</td><td className="px-4 py-3 hidden sm:table-cell" style={{ color: '#3d3d4e' }}>{row.nota}</td></tr>))}</tbody>
                </table>
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Precios Marbella 2026, temporada alta. Sin IVA. Desplazamiento a villas fuera del núcleo urbano puede facturarse aparte.</p>
            </section>
            <section>
              <h2 className="text-lg font-black mb-3">Dónde se concentra la demanda en Marbella</h2>
              <div className="space-y-2">{['Villas privadas de la Milla de Oro: bodas y celebraciones de alto presupuesto','Hoteles 5 estrellas del entorno: servicio de sala formal para bodas y eventos de lujo','Puerto Banús: bartenders y personal para eventos de marca de clientela internacional','Temporada alta (junio-septiembre): pico de demanda con la máxima afluencia turística'].map((item,i) => (<div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}><span className="text-xs font-black shrink-0 mt-0.5" style={{ color: '#D4AF37' }}>✓</span><p className="text-xs" style={{ color: 'rgba(255,255,255,0.8)' }}>{item}</p></div>))}</div>
            </section>
            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">{faqStructured.mainEntity.map(f => (<div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}><h3 className="text-sm font-bold mb-2">{f.name}</h3><p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>{f.acceptedAnswer.text}</p></div>))}</div>
            </section>
            <section className="mt-8">
              <h2 className="text-base font-black mb-3" style={{ color: 'rgba(255,255,255,0.85)' }}>Artículos relacionados</h2>
              <div className="space-y-2">
                {[
                  { href: '/blog/precio-azafatas-marbella', cat: 'Marbella', title: 'Precio azafatas para eventos en Marbella: guía 2026' },
                  { href: '/blog/camareros-eventos-malaga', cat: 'Costa del Sol', title: 'Precio camareros para eventos en Málaga: guía 2026' },
                  { href: '/blog/cuantos-camareros-necesito-para-mi-boda', cat: 'Bodas', title: 'Cuántos camareros necesito para mi boda' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.72)' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>
            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Necesitas camareros para tu evento en Marbella?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>XPEAK conecta organizadores con staff profesional verificado en Marbella. Contrato digital automático incluido.</p>
              <a href="/contratar-staff/marbella" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Ver camareros en Marbella →</a>
            </div>
          </div>
          <BlogEmailCapture variant="presupuestos" intent="contratar-staff" articlePath="/blog/camareros-eventos-marbella" />
        </main>
        <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/camareros-eventos-marbella' tag='Camareros' />
        <FooterPublic />
        <BlogScrollCTA role="staff" storageKey="xpeak_scrollcta_camareros_marbella" />
      </div>
    </>
  );
}
