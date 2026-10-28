import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogAnswerBox from '@/components/BlogAnswerBox';
import BlogAuthor from '@/components/BlogAuthor';
import BlogShare from '@/components/BlogShare';
import DJResourcesAffiliate from '@/components/DJResourcesAffiliate';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Precio de maquilladora para eventos en Barcelona: guía 2026', description: 'Precios de maquillaje de novia y de invitada en Barcelona según Fresha, Bodas.net y Cronoshare, con fuente y fecha de consulta.', datePublished: '2026-03-18', dateModified: '2026-10-28', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es/autor/daniel' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/maquillaje-eventos-barcelona' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cobra una maquilladora para eventos en Barcelona?', acceptedAnswer: { '@type': 'Answer', text: 'Según los precios publicados en Fresha, Bodas.net y Cronoshare, consultados el 28 de octubre de 2026, el maquillaje de novia suelto en salón va casi siempre de 47€ a 150€. Un pack de novia con prueba, peinado y maquillaje del día parte de 250€ en Bodas.net, y Cronoshare da un rango de 70€ a 200€ para el maquillaje de novia. No son tarifas oficiales: pide siempre un presupuesto cerrado.' } },
  { '@type': 'Question', name: '¿Qué hay que preguntar antes de contratar maquilladora en Barcelona?', acceptedAnswer: { '@type': 'Answer', text: 'Si el precio incluye la prueba, si los materiales van aparte y si el desplazamiento está incluido. Hay profesionales que lo incluyen dentro de Barcelona ciudad y lo cobran aparte fuera, por ejemplo para bodas en masías y fincas del entorno. Conviene dejar todo por escrito.' } },
  { '@type': 'Question', name: '¿Con cuánta antelación reservar maquilladora para una boda en Barcelona?', acceptedAnswer: { '@type': 'Answer', text: 'No hemos encontrado un plazo oficial. Lo prudente es reservar en cuanto tengas fecha y lugar, sobre todo para fines de semana de primavera y verano, y confirmar por escrito qué incluye el pack.' } },
  { '@type': 'Question', name: '¿Es más caro el maquillaje de novia que el de invitada en Barcelona?', acceptedAnswer: { '@type': 'Answer', text: 'Depende de lo que incluya. En Fresha, el maquillaje de novia suelto va de 47€ a 150€ y el de invitada de 60€ a 185€, así que la diferencia la marcan la prueba y el peinado más que el tipo de clienta. Un pack de novia con prueba, peinado y maquillaje parte de 250€ en Bodas.net.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Maquillaje Barcelona', item: 'https://xpeak.es/blog/maquillaje-eventos-barcelona' }] };

const PRECIOS = [
  { perfil: 'Maquillaje de novia, servicio suelto en salón', tarifa: '47-150€', nota: 'Fresha. Un servicio aislado a 30€; algunos incluyen prueba' },
  { perfil: 'Pack novia con pruebas (recogido y maquillaje)', tarifa: '150€', nota: 'Una peluquería en Fresha: 2 pruebas de maquillaje y 3 de recogido' },
  { perfil: 'Pack novia con prueba, peinado y maquillaje del día', tarifa: 'Desde 250€', nota: 'Una profesional en Bodas.net; materiales aparte' },
  { perfil: 'Maquillaje de invitada o madrina', tarifa: '60-185€', nota: 'Fresha: desde 60€ sin prueba hasta 185€ con prueba' },
  { perfil: 'Maquillaje de novia, rango de plataforma', tarifa: '70-200€', nota: 'Cronoshare, según tipo de maquillaje' },
  { perfil: 'Sesión de maquillaje profesional, media', tarifa: '45€', nota: 'Cronoshare; varía con desplazamiento y extras' },
];

export default function BlogMaquillajeBarcelona() {
  return (
    <>
      <Helmet>
        <title>Precio maquilladora para eventos en Barcelona 2026 | XPEAK</title>
        <meta name="description" content="Precios de maquillaje de novia y de invitada en Barcelona según Fresha, Bodas.net y Cronoshare, con fuente y fecha de consulta." />
        <link rel="canonical" href="https://xpeak.es/blog/maquillaje-eventos-barcelona" />
        <meta property="og:title" content="Precio maquilladora eventos Barcelona 2026 | XPEAK Blog" />
        <meta property="og:description" content="Precios publicados de maquillaje de novia y de invitada en Barcelona, con fuente." />
        <meta property="og:url" content="https://xpeak.es/blog/maquillaje-eventos-barcelona" />
        <meta property="og:type" content="article" /><meta property="og:image" content="https://xpeak.es/og-image.jpg" /><meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" /><meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>
      <div className="min-h-screen" style={{ background: '#ffffff', color: '#111' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-5xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#DB2777' }}>XPEAK</a>
          <div className="flex items-center gap-3"><a href="/blog" className="text-xs font-bold " style={{ color: '#3d3d4e' }}>Blog</a><a href="/auth?mode=register" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#DB2777,#B8941E)', color: '#000' }}>Unirse</a></div>
        </nav>
        <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#DB2777' }}>Maquillaje · Barcelona · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Precio de maquilladora para eventos en Barcelona: guía 2026</h1>
            <p className="text-base leading-relaxed" style={{ color: '#3d3d4e' }}>Sobre el precio de una maquilladora en Barcelona circulan muchas cifras y casi ninguna dice de dónde sale. Aquí recogemos solo los precios publicados en Fresha, Bodas.net y Cronoshare, con la fuente y la fecha en que los consultamos.</p>
            <time className="text-xs mt-3 block" style={{ color: '#666' }}>28 octubre 2026</time>
            <BlogAnswerBox
              question="¿Cuánto cobra una maquilladora en Barcelona?"
              answer="Según Fresha, Bodas.net y Cronoshare (consultados el 28 de octubre de 2026), el maquillaje de novia en salón va casi siempre de 47€ a 150€, un pack con prueba, peinado y maquillaje del día parte de 250€ y una sesión de maquillaje profesional ronda de media 45€. Son precios publicados, no una tarifa oficial."
            />
          </div>
          <BlogInlineCTA role="makeup" variant="upgrade" articlePath="/blog/maquillaje-eventos-barcelona" />
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Tarifas de maquillaje para eventos en Barcelona</h2>
              <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                <table className="w-full text-xs">
                  <thead><tr style={{ background: 'rgba(219,39,119,0.08)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}><th className="text-left px-4 py-3 font-bold">Servicio</th><th className="px-4 py-3 font-bold text-right">Precio</th><th className="px-4 py-3 font-bold text-left hidden sm:table-cell">Nota</th></tr></thead>
                  <tbody>{PRECIOS.map((row, i) => (<tr key={row.perfil} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)', borderBottom: '1px solid rgba(0,0,0,0.04)' }}><td className="px-4 py-3 font-medium">{row.perfil}</td><td className="px-4 py-3 text-right font-bold" style={{ color: '#DB2777' }}>{row.tarifa}</td><td className="px-4 py-3 hidden sm:table-cell" style={{ color: '#3d3d4e' }}>{row.nota}</td></tr>))}</tbody>
                </table>
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Precios publicados, consultados el 28 de octubre de 2026. Proceden de fichas y anuncios individuales sin fecha de publicación, así que pueden haber cambiado. Pregunta siempre si incluyen prueba, materiales y desplazamiento.</p>
              <p className="text-xs mt-2" style={{ color: '#3d3d4e' }}>Fuentes:{' '}
                <a href="https://www.fresha.com/lp/en/tt/bridal-makeup/in/es-barcelona" rel="nofollow noopener" target="_blank" className="underline">Fresha</a>,{' '}
                <a href="https://www.bodas.net/belleza-novias/maquillaje-novias-barcelona--e50543" rel="nofollow noopener" target="_blank" className="underline">Bodas.net</a> y{' '}
                <a href="https://www.cronoshare.com/servicios/maquilladoras-profesionales/barcelona/barcelona" rel="nofollow noopener" target="_blank" className="underline">Cronoshare</a>.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-black mb-3">Dónde se concentra la demanda en Barcelona</h2>
              <div className="space-y-2">{['Masías y fincas del Penedès, Maresme y Garraf: maquillaje de novia a domicilio en temporada alta','Sector moda y diseño (showrooms, desfiles): demanda constante de maquillaje editorial','Estudios de foto del Eixample y 22@: sesiones de producto y campañas de marca','Hoteles del centro: maquillaje de invitada y madrina para bodas urbanas'].map((item,i) => (<div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.02)' }}><span className="text-xs font-black shrink-0 mt-0.5" style={{ color: '#DB2777' }}>✓</span><p className="text-xs" style={{ color: '#111' }}>{item}</p></div>))}</div>
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
                  { href: '/blog/contratar-fotografo-de-bodas', cat: 'Fotografía', title: 'Fotógrafo de bodas: precio y guía 2026' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.75rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(219,39,119,0.1)', color: '#DB2777', border: '1px solid rgba(219,39,119,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: '#222' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>
            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(219,39,119,0.04)', border: '1px solid rgba(219,39,119,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Necesitas maquilladora para tu evento en Barcelona?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>XPEAK conecta organizadores con maquilladoras profesionales verificadas en Barcelona. Contrato digital automático incluido.</p>
              <a href="/contratar-maquillaje/barcelona" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#DB2777,#B8941E)', color: '#000' }}>Ver maquilladoras en Barcelona →</a>
            </div>
          </div>
          <BlogEmailCapture variant="presupuestos" intent="contratar-makeup" articlePath="/blog/maquillaje-eventos-barcelona" />
        </main>
        <DJResourcesAffiliate role="maquillaje" />
        <BlogAuthor />
        <BlogShare />
        <BlogRelatedPosts currentSlug='/blog/maquillaje-eventos-barcelona' tag='Maquillaje' />
        <FooterPublic />
        <BlogScrollCTA role="makeup_pro" storageKey="xpeak_scrollcta_maquillaje_barcelona_v2" articlePath="/blog/maquillaje-eventos-barcelona" />
      </div>
    </>
  );
}
