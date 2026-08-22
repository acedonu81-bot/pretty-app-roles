import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogAnswerBox from '@/components/BlogAnswerBox';
import BlogAuthor from '@/components/BlogAuthor';
import DJResourcesAffiliate from '@/components/DJResourcesAffiliate';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Precio de azafatas para eventos en Sitges: guía 2026', description: 'Cuánto cobran las azafatas para eventos, Carnaval y festivales en Sitges. Tarifas de plaza turística premium 2026.', datePublished: '2026-04-17', dateModified: '2026-06-30', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/precio-azafatas-sitges' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cobran las azafatas de eventos en Sitges?', acceptedAnswer: { '@type': 'Answer', text: 'En Sitges, una azafata de eventos cobra entre 17€ y 28€/hora bruto, por encima de la media catalana gracias al turismo internacional de alto nivel. Las agencias facturan al cliente entre 180€ y 320€/día por perfil. En Carnaval y en el Festival de Cine Fantástico la demanda se dispara y conviene reservar con antelación.' } },
  { '@type': 'Question', name: '¿Dónde se concentra la demanda de azafatas en Sitges?', acceptedAnswer: { '@type': 'Answer', text: 'El Carnaval de Sitges (febrero) y el Festival Internacional de Cine Fantástico de Sitges (octubre) son los dos grandes picos de demanda de personal de eventos. Fuera de esas fechas, la demanda viene de bodas en villas de la costa y fiestas privadas ligadas al turismo LGTB+ internacional que caracteriza al municipio.' } },
  { '@type': 'Question', name: '¿Con cuánta antelación reservar azafatas para el Carnaval o el Festival de Sitges?', acceptedAnswer: { '@type': 'Answer', text: 'Para el Carnaval de Sitges y el Festival de Cine Fantástico conviene reservar con 2-3 meses de antelación: son las semanas de mayor ocupación hotelera y demanda de personal de todo el año en la localidad. Para bodas o eventos privados en villas, 1-2 meses suele ser suficiente.' } },
  { '@type': 'Question', name: '¿Por qué las tarifas en Sitges son más altas que en otras ciudades catalanas medianas?', acceptedAnswer: { '@type': 'Answer', text: 'Sitges combina turismo internacional de alto poder adquisitivo, una agenda de eventos muy reconocida (Carnaval, Festival de Cine Fantástico) y un mercado de bodas de lujo en villas de la costa, lo que sitúa sus tarifas por encima de la media catalana, aunque por debajo de plazas como Ibiza o Marbella.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Azafatas Sitges', item: 'https://xpeak.es/blog/precio-azafatas-sitges' }] };

const PRECIOS = [
  { perfil: 'Azafata de stand / evento', tarifa: '180–240€/día', nota: 'Jornada completa 8h' },
  { perfil: 'Azafata de imagen', tarifa: '210–320€/día', nota: 'Bodas de lujo y fiestas privadas en villas' },
  { perfil: 'Azafata bilingüe (inglés)', tarifa: '220–300€/día', nota: 'Imprescindible por turismo internacional' },
  { perfil: 'Azafata trilingüe', tarifa: '260–380€/día', nota: 'Festival de Cine Fantástico y eventos internacionales' },
  { perfil: 'Coordinadora de azafatas', tarifa: '240–350€/día', nota: 'Gestión de equipo en Carnaval o festival' },
  { perfil: 'Pack evento en villa (4h)', tarifa: '130–220€', nota: 'Desplazamiento en costa incluido' },
];

export default function BlogPrecioAzafatasSitges() {
  return (
    <>
      <Helmet>
        <title>Precio azafatas para eventos en Sitges 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cobran las azafatas para eventos, Carnaval y Festival de Cine Fantástico en Sitges. Tarifas 2026." />
        <link rel="canonical" href="https://xpeak.es/blog/precio-azafatas-sitges" />
        <meta property="og:title" content="Precio azafatas eventos Sitges 2026 — XPEAK Blog" />
        <meta property="og:description" content="Tarifas de azafatas para Carnaval, festivales y bodas de lujo en Sitges." />
        <meta property="og:url" content="https://xpeak.es/blog/precio-azafatas-sitges" />
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
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#059669' }}>Staff · Sitges · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Precio de azafatas para eventos en Sitges: guía 2026</h1>
            <p className="text-base leading-relaxed" style={{ color: '#3d3d4e' }}>Sitges es una de las plazas más caras de Cataluña para contratar azafatas: turismo internacional LGTB+ de alto poder adquisitivo, el Carnaval de Sitges y el Festival de Cine Fantástico marcan los picos de demanda, y las villas de la costa concentran un mercado de bodas de lujo constante.</p>
            <time className="text-xs mt-3 block" style={{ color: '#666' }}>8 julio 2026</time>
            <BlogAnswerBox
              question="¿Cuánto cobran las azafatas en Sitges?"
              answer="Una azafata de eventos en Sitges cobra entre 17€ y 28€/hora bruto, y las agencias facturan entre 180€ y 320€/día por el servicio completo. En Carnaval (febrero) y en el Festival de Cine Fantástico (octubre) la demanda sube con fuerza y conviene reservar con antelación."
            />
          </div>
          <BlogInlineCTA role="azafata" variant="upgrade" />
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Tarifas por perfil de azafata en Sitges</h2>
              <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                <table className="w-full text-xs">
                  <thead><tr style={{ background: 'rgba(5,150,105,0.08)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}><th className="text-left px-4 py-3 font-bold">Perfil</th><th className="px-4 py-3 font-bold text-right">Tarifa</th><th className="px-4 py-3 font-bold text-left hidden sm:table-cell">Nota</th></tr></thead>
                  <tbody>{PRECIOS.map((row, i) => (<tr key={row.perfil} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)', borderBottom: '1px solid rgba(0,0,0,0.04)' }}><td className="px-4 py-3 font-medium">{row.perfil}</td><td className="px-4 py-3 text-right font-bold" style={{ color: '#059669' }}>{row.tarifa}</td><td className="px-4 py-3 hidden sm:table-cell" style={{ color: '#3d3d4e' }}>{row.nota}</td></tr>))}</tbody>
                </table>
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Precios Sitges 2026. Sin IVA. Desplazamiento a villas de la costa puede facturarse aparte.</p>
            </section>
            <section>
              <h2 className="text-lg font-black mb-3">Dónde se concentra la demanda en Sitges</h2>
              <div className="space-y-2">{['Carnaval de Sitges (febrero): uno de los picos de demanda de personal de eventos de toda Cataluña','Festival Internacional de Cine Fantástico de Sitges (octubre): azafatas bilingües y trilingües para prensa y proyecciones','Villas de la costa y el Vinyet: bodas de lujo y fiestas privadas ligadas al turismo internacional','Centro histórico y paseo marítimo: eventos de marca y activaciones vinculadas al turismo LGTB+'].map((item,i) => (<div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.02)' }}><span className="text-xs font-black shrink-0 mt-0.5" style={{ color: '#059669' }}>✓</span><p className="text-xs" style={{ color: '#111' }}>{item}</p></div>))}</div>
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
              <p className="text-sm font-black mb-2">¿Necesitas azafatas para tu evento en Sitges?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>XPEAK conecta organizadores con staff profesional verificado en Sitges. Contrato digital automático incluido.</p>
              <a href="/contratar-staff/sitges" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#059669,#B8941E)', color: '#000' }}>Ver staff en Sitges →</a>
            </div>
          </div>
          <BlogEmailCapture variant="presupuestos" intent="contratar-staff" articlePath="/blog/precio-azafatas-sitges" />
        </main>
        <DJResourcesAffiliate role="azafata" />
        <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/precio-azafatas-sitges' tag='Staff' />
        <FooterPublic />
        <BlogScrollCTA role="azafata" storageKey="xpeak_scrollcta_precio_azafatas_sitges" />
      </div>
    </>
  );
}
