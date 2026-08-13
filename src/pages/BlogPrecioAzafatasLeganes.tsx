import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogAnswerBox from '@/components/BlogAnswerBox';
import BlogAuthor from '@/components/BlogAuthor';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Precio de azafatas para eventos en Leganés: guía 2026', description: 'Cuánto cobran las azafatas para congresos universitarios y eventos tecnológicos en Leganés. Tarifas por perfil 2026.', datePublished: '2026-05-15', dateModified: '2026-07-13', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/precio-azafatas-leganes' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cobran las azafatas de eventos en Leganés?', acceptedAnswer: { '@type': 'Answer', text: 'En Leganés, una azafata de eventos cobra entre 12€ y 17€/hora bruto, algo por debajo de Madrid capital. Las agencias facturan al cliente entre 110€ y 170€/día por perfil. El campus principal de la Universidad Carlos III y el entorno tecnológico de la zona generan demanda constante de perfiles cualificados.' } },
  { '@type': 'Question', name: '¿Dónde se concentran los eventos en Leganés?', acceptedAnswer: { '@type': 'Answer', text: 'El campus principal de la Universidad Carlos III de Madrid, ubicado en Leganés, concentra gran parte de la demanda: congresos académicos, jornadas de escuelas de ingeniería y actos institucionales. El parque científico y tecnológico de la zona también genera eventos corporativos ligados a empresas de base tecnológica.' } },
  { '@type': 'Question', name: '¿Con cuánta antelación reservar azafatas en Leganés?', acceptedAnswer: { '@type': 'Answer', text: 'Para congresos universitarios de cierto tamaño en el campus de la Carlos III, reserva con 4-6 semanas de antelación, especialmente si necesitas perfiles bilingües para ponentes internacionales. Para eventos corporativos puntuales, 2 semanas suele ser suficiente.' } },
  { '@type': 'Question', name: '¿Qué perfil de azafata se pide más en Leganés?', acceptedAnswer: { '@type': 'Answer', text: 'El perfil de azafata de congresos académicos es el más demandado por el peso del campus universitario. También hay demanda de azafatas bilingües para eventos del sector tecnológico con participación internacional.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Azafatas Leganés', item: 'https://xpeak.es/blog/precio-azafatas-leganes' }] };

const PRECIOS = [
  { perfil: 'Azafata de congresos universitarios', tarifa: '110–160€/día', nota: 'Campus Universidad Carlos III' },
  { perfil: 'Azafata de imagen', tarifa: '130–190€/día', nota: 'Presentaciones corporativas y tecnológicas' },
  { perfil: 'Azafata bilingüe (inglés)', tarifa: '150–200€/día', nota: 'Congresos con ponentes internacionales' },
  { perfil: 'Azafata de protocolo institucional', tarifa: '140–200€/día', nota: 'Actos del ayuntamiento y organismos públicos' },
  { perfil: 'Coordinadora de azafatas', tarifa: '160–230€/día', nota: 'Gestión del equipo completo' },
  { perfil: 'Pack evento corporativo (4h)', tarifa: '70–110€', nota: 'Acto único, media jornada' },
];

export default function BlogPrecioAzafatasLeganes() {
  return (
    <>
      <Helmet>
        <title>Precio azafatas para eventos en Leganés 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cobran las azafatas para congresos universitarios y eventos tecnológicos en Leganés. Tarifas 2026." />
        <link rel="canonical" href="https://xpeak.es/blog/precio-azafatas-leganes" />
        <meta property="og:title" content="Precio azafatas eventos Leganés 2026 — XPEAK Blog" />
        <meta property="og:description" content="Tarifas de azafatas para congresos universitarios y eventos tecnológicos en Leganés." />
        <meta property="og:url" content="https://xpeak.es/blog/precio-azafatas-leganes" />
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
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>Staff · Leganés · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Precio de azafatas para eventos en Leganés: guía 2026</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#3d3d4e' }}>Leganés alberga el campus principal de la Universidad Carlos III de Madrid, lo que la convierte en un polo de congresos académicos y eventos del sector tecnológico. Las tarifas de azafatas se sitúan algo por debajo de Madrid capital, con picos de demanda ligados al calendario universitario.</p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>8 julio 2026</time>
            <BlogAnswerBox
              question="¿Cuánto cobran las azafatas en Leganés?"
              answer="Una azafata de eventos en Leganés cobra entre 12€ y 17€/hora bruto, y las agencias facturan entre 110€ y 170€/día por el servicio completo. El campus de la Universidad Carlos III concentra buena parte de la demanda durante el curso académico."
            />
          </div>
          <BlogInlineCTA role="azafata" variant="upgrade" />
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Tarifas por perfil de azafata en Leganés</h2>
              <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <table className="w-full text-xs">
                  <thead><tr style={{ background: 'rgba(212,175,55,0.08)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}><th className="text-left px-4 py-3 font-bold">Perfil</th><th className="px-4 py-3 font-bold text-right">Tarifa</th><th className="px-4 py-3 font-bold text-left hidden sm:table-cell">Nota</th></tr></thead>
                  <tbody>{PRECIOS.map((row, i) => (<tr key={row.perfil} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="px-4 py-3 font-medium">{row.perfil}</td><td className="px-4 py-3 text-right font-bold" style={{ color: '#D4AF37' }}>{row.tarifa}</td><td className="px-4 py-3 hidden sm:table-cell" style={{ color: '#3d3d4e' }}>{row.nota}</td></tr>))}</tbody>
                </table>
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Precios Leganés 2026. Sin IVA. Desplazamiento fuera del municipio puede facturarse aparte.</p>
            </section>
            <section>
              <h2 className="text-lg font-black mb-3">Dónde se concentra la demanda en Leganés</h2>
              <div className="space-y-2">{['Campus de la Universidad Carlos III: congresos académicos y jornadas de ingeniería','Parque científico y tecnológico: eventos corporativos de empresas de base tecnológica','Ayuntamiento y organismos públicos: actos de protocolo institucional','Polígonos empresariales de la zona: presentaciones y jornadas de empresa'].map((item,i) => (<div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}><span className="text-xs font-black shrink-0 mt-0.5" style={{ color: '#D4AF37' }}>✓</span><p className="text-xs" style={{ color: 'rgba(255,255,255,0.8)' }}>{item}</p></div>))}</div>
            </section>
            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">{faqStructured.mainEntity.map(f => (<div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}><h3 className="text-sm font-bold mb-2">{f.name}</h3><p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>{f.acceptedAnswer.text}</p></div>))}</div>
            </section>
            <section className="mt-8">
              <h2 className="text-base font-black mb-3" style={{ color: 'rgba(255,255,255,0.85)' }}>Artículos relacionados</h2>
              <div className="space-y-2">
                {[
                  { href: '/blog/precio-azafatas-getafe', cat: 'Área metropolitana', title: 'Precio azafatas para eventos en Getafe: guía 2026' },
                  { href: '/blog/precio-azafatas-madrid', cat: 'Área metropolitana', title: 'Precio azafatas para eventos en Madrid: guía 2026' },
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
              <p className="text-sm font-black mb-2">¿Necesitas azafatas para tu evento en Leganés?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>XPEAK conecta organizadores con staff profesional verificado en Leganés. Contrato digital automático incluido.</p>
              <a href="/contratar-staff/leganes" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Ver staff en Leganés →</a>
            </div>
          </div>
          <BlogEmailCapture variant="presupuestos" intent="contratar-staff" articlePath="/blog/precio-azafatas-leganes" />
        </main>
        <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/precio-azafatas-leganes' tag='Staff' />
        <FooterPublic />
        <BlogScrollCTA role="azafata" storageKey="xpeak_scrollcta_precio_azafatas_leganes" />
      </div>
    </>
  );
}
