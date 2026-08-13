import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogAnswerBox from '@/components/BlogAnswerBox';
import BlogAuthor from '@/components/BlogAuthor';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Precio de camareros para eventos en Vitoria-Gasteiz: guía 2026', description: 'Cuánto cobran los camareros y bartenders para bodas y eventos institucionales en Vitoria-Gasteiz. Tarifas 2026.', datePublished: '2026-03-15', dateModified: '2026-08-09', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/camareros-eventos-vitoria' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cobra un camarero de eventos en Vitoria-Gasteiz?', acceptedAnswer: { '@type': 'Answer', text: 'En Vitoria-Gasteiz, un camarero de eventos cobra entre 11€ y 18€/hora bruto, en línea con la media nacional. Los bartenders con experiencia en coctelería cobran entre 15€ y 22€/hora. Para una boda completa (6-7h), el presupuesto de sala suele rondar los 850€-2.000€.' } },
  { '@type': 'Question', name: '¿Dónde hay más demanda de camareros para eventos en Vitoria-Gasteiz?', acceptedAnswer: { '@type': 'Answer', text: 'Como sede de las instituciones vascas, Vitoria-Gasteiz mueve un volumen alto de eventos institucionales y corporativos durante todo el año. El casco medieval y las fincas del entorno son el escenario habitual de bodas, con picos de actividad cultural en Semana Santa y las fiestas de La Blanca en agosto.' } },
  { '@type': 'Question', name: '¿Con cuánta antelación reservar camareros para una boda en Vitoria-Gasteiz?', acceptedAnswer: { '@type': 'Answer', text: 'Para bodas en temporada alta (mayo-septiembre), reserva con 2-3 meses de antelación. Para eventos corporativos o institucionales puntuales, 3-4 semanas suele ser suficiente dado el peso de la agenda institucional en la ciudad.' } },
  { '@type': 'Question', name: '¿Cuántos camareros necesito para una boda en Vitoria-Gasteiz?', acceptedAnswer: { '@type': 'Answer', text: 'La proporción estándar es 1 camarero por cada 10 invitados en cena sentada y 1 por cada 15-20 en formato cóctel. Para una boda de 100 invitados en Vitoria-Gasteiz, lo habitual es contar con 7-9 camareros más 1 bartender para la barra.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Camareros Vitoria-Gasteiz', item: 'https://xpeak.es/blog/camareros-eventos-vitoria' }] };

const PRECIOS = [
  { perfil: 'Camarero/a de sala', tarifa: '11–18€/hora', nota: 'Cóctel, cena sentada o buffet' },
  { perfil: 'Bartender / coctelería', tarifa: '15–22€/hora', nota: 'Barra libre y coctelería de autor' },
  { perfil: 'Jefe de sala / coordinador', tarifa: '20–29€/hora', nota: 'Gestión del equipo en boda o evento grande' },
  { perfil: 'Servicio boda completo (6-7h)', tarifa: '130–235€/persona', nota: 'Cóctel + cena + barra' },
  { perfil: 'Barra libre con bartender (4h)', tarifa: '155–340€', nota: 'Incluye montaje y desmontaje' },
  { perfil: 'Personal de apoyo eventos institucionales', tarifa: '13–21€/hora', nota: 'Actos oficiales y corporativos' },
];

export default function BlogCamarerosVitoria() {
  return (
    <>
      <Helmet>
        <title>Precio camareros para eventos en Vitoria-Gasteiz 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cobran los camareros y bartenders para bodas y eventos institucionales en Vitoria-Gasteiz. Tarifas 2026." />
        <link rel="canonical" href="https://xpeak.es/blog/camareros-eventos-vitoria" />
        <meta property="og:title" content="Precio camareros eventos Vitoria-Gasteiz 2026 — XPEAK Blog" />
        <meta property="og:description" content="Tarifas de camareros y bartenders para bodas y eventos en Vitoria-Gasteiz." />
        <meta property="og:url" content="https://xpeak.es/blog/camareros-eventos-vitoria" />
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
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>Staff · Vitoria-Gasteiz · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Precio de camareros para eventos en Vitoria-Gasteiz: guía 2026</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#3d3d4e' }}>Vitoria-Gasteiz combina un volumen alto de eventos institucionales y corporativos, propio de su papel como sede de las instituciones vascas, con bodas en su casco medieval y fincas del entorno. Semana Santa y las fiestas de La Blanca marcan los picos culturales del año.</p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>8 julio 2026</time>
            <BlogAnswerBox
              question="¿Cuánto cobran los camareros de eventos en Vitoria-Gasteiz?"
              answer="Un camarero de eventos en Vitoria-Gasteiz cobra entre 11€ y 18€/hora bruto, y un bartender con experiencia en coctelería entre 15€ y 22€/hora. Para una boda completa de 6-7 horas, el presupuesto de personal de sala suele estar entre 850€ y 2.000€."
            />
          </div>
          <BlogInlineCTA role="staff" variant="upgrade" />
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Tarifas por perfil de camarero en Vitoria-Gasteiz</h2>
              <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <table className="w-full text-xs">
                  <thead><tr style={{ background: 'rgba(212,175,55,0.08)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}><th className="text-left px-4 py-3 font-bold">Perfil</th><th className="px-4 py-3 font-bold text-right">Tarifa</th><th className="px-4 py-3 font-bold text-left hidden sm:table-cell">Nota</th></tr></thead>
                  <tbody>{PRECIOS.map((row, i) => (<tr key={row.perfil} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="px-4 py-3 font-medium">{row.perfil}</td><td className="px-4 py-3 text-right font-bold" style={{ color: '#D4AF37' }}>{row.tarifa}</td><td className="px-4 py-3 hidden sm:table-cell" style={{ color: '#3d3d4e' }}>{row.nota}</td></tr>))}</tbody>
                </table>
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Precios Vitoria-Gasteiz 2026. Sin IVA. Desplazamiento fuera del área urbana puede facturarse aparte.</p>
            </section>
            <section>
              <h2 className="text-lg font-black mb-3">Dónde se concentra la demanda en Vitoria-Gasteiz</h2>
              <div className="space-y-2">{['Entorno institucional: cenas y actos oficiales del Gobierno Vasco','Casco medieval de Vitoria-Gasteiz: bodas y celebraciones con encanto histórico','Fincas del entorno: bodas de temporada alta (mayo-septiembre)','Semana Santa y fiestas de La Blanca (agosto): eventos culturales de mayor afluencia'].map((item,i) => (<div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}><span className="text-xs font-black shrink-0 mt-0.5" style={{ color: '#D4AF37' }}>✓</span><p className="text-xs" style={{ color: 'rgba(255,255,255,0.8)' }}>{item}</p></div>))}</div>
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
                  { href: '/blog/cuanto-cobra-un-camarero-de-eventos', cat: 'Nacional', title: 'Cuánto cobra un camarero de eventos en España 2026' },
                  { href: '/blog/dj-bodas-vitoria', cat: 'DJ Bodas', title: 'DJ para bodas en Vitoria-Gasteiz: precio 2026' },
                  { href: '/blog/camareros-eventos-pamplona', cat: 'Norte', title: 'Precio camareros para eventos en Pamplona 2026' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.72)' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>
            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Necesitas camareros para tu evento en Vitoria-Gasteiz?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>XPEAK conecta organizadores con staff profesional verificado en Vitoria-Gasteiz. Contrato digital automático incluido.</p>
              <a href="/contratar-staff/vitoria" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Ver camareros en Vitoria-Gasteiz →</a>
            </div>
          </div>
          <BlogEmailCapture variant="presupuestos" intent="contratar-staff" articlePath="/blog/camareros-eventos-vitoria" />
        </main>
        <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/camareros-eventos-vitoria' tag='Camareros' />
        <FooterPublic />
        <BlogScrollCTA role="staff" storageKey="xpeak_scrollcta_camareros_vitoria" />
      </div>
    </>
  );
}
