import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogAnswerBox from '@/components/BlogAnswerBox';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';
import DJResourcesAffiliate from '@/components/DJResourcesAffiliate';
import BlogTopCTA from '@/components/BlogTopCTA';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Precio de azafatas para eventos en España: guía completa 2026', description: 'Cuánto cobran las azafatas para eventos, ferias y congresos en España. Tarifas por horas, perfil y ciudad.', datePublished: '2026-05-04',
  dateModified: '2026-05-25', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/precio-azafatas-eventos-espana' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cobran las azafatas de eventos en España?', acceptedAnswer: { '@type': 'Answer', text: 'El precio medio de una azafata para eventos es de 12-18€/hora bruto para el profesional, aunque las agencias cobran al cliente entre 20-35€/hora por el servicio completo. Para ferias y congresos de varios días el precio suele fijarse por jornada (120-200€/día).' } },
  { '@type': 'Question', name: '¿Qué diferencia hay entre azafata de stand y azafata de imagen?', acceptedAnswer: { '@type': 'Answer', text: 'La azafata de stand trabaja en ferias y exposiciones atendiendo a visitantes, recogiendo contactos y explicando el producto. La azafata de imagen trabaja en eventos de marca, entregas de premios o actos de representación, priorizando la presencia y protocolo sobre las ventas.' } },
  { '@type': 'Question', name: '¿Se necesita contrato para contratar azafatas?', acceptedAnswer: { '@type': 'Answer', text: 'Sí. El trabajo de azafata tiene cobertura legal bajo el Convenio Colectivo de Empresas de Trabajo Temporal. Si contratas directamente (sin agencia), necesitas dar de alta a la persona en Seguridad Social, incluso para trabajos puntuales de un día. XPEAK genera el contrato digital automáticamente.' } },
  { '@type': 'Question', name: '¿Con cuánta antelación debo contratar azafatas para una feria?', acceptedAnswer: { '@type': 'Answer', text: 'Para ferias grandes (FITUR, MWC, IFEMA) reserva con 4-8 semanas de antelación. Para eventos corporativos pequeños con 2-3 semanas suele ser suficiente. Los perfiles más demandados (bilingües, con experiencia en sectores específicos) se agotan antes.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Precio azafatas eventos', item: 'https://xpeak.es/blog/precio-azafatas-eventos-espana' }] };

const PRECIOS = [
  { perfil: 'Azafata de stand / feria', tarifa: '120–180€/día', nota: 'Jornada completa 8h' },
  { perfil: 'Azafata de imagen', tarifa: '150–250€/día', nota: 'Eventos de marca y protocolo' },
  { perfil: 'Azafata bilingüe (inglés)', tarifa: '160–220€/día', nota: '+20-30% sobre tarifa base' },
  { perfil: 'Azafata trilingüe', tarifa: '200–300€/día', nota: 'Para ferias internacionales' },
  { perfil: 'Coordinadora de azafatas', tarifa: '180–280€/día', nota: 'Gestión del equipo completo' },
  { perfil: 'Pack evento corporativo (4h)', tarifa: '80–130€', nota: 'Acto único, media jornada' },
];

export default function BlogPrecioAzafatas() {
  return (
    <>
      <Helmet>
        <title>Precio azafatas para eventos España 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cobran las azafatas para eventos, ferias y congresos en España. Tarifas por horas, perfil y ciudad. Guía completa 2026." />
        <link rel="canonical" href="https://xpeak.es/blog/precio-azafatas-eventos-espana" />
        <meta property="og:title" content="Precio azafatas eventos España 2026 — XPEAK Blog" />
        <meta property="og:description" content="Cuánto cobran las azafatas para eventos y ferias en España. Tarifas por perfil y ciudad." />
        <meta property="og:url" content="https://xpeak.es/blog/precio-azafatas-eventos-espana" />
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
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>Staff · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Precio de azafatas para eventos en España: guía completa 2026</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#3d3d4e' }}>Tarifas reales de azafatas para ferias, congresos y eventos corporativos. Lo que cobran, lo que se factura y cómo elegir el perfil correcto.</p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>4 mayo 2026</time>
            <BlogAnswerBox
              question="¿Cuánto cobran las azafatas en España?"
              answer="Una azafata de eventos en España cobra entre 10€ y 18€/hora netos como autónoma, o entre 60€ y 120€ por jornada completa a través de agencia. Las ferias y congresos pagan entre 80€ y 150€/día según el perfil (idiomas, experiencia). Las azafatas de imagen para eventos premium pueden superar los 200€/día."
            />
            <picture>
              <source srcSet="/images/blog/precio-azafatas-eventos-espana.webp" type="image/webp" />
              <img
                src="/images/blog/precio-azafatas-eventos-espana.jpg"
                alt="Azafatas de eventos en feria profesional — precio y tarifas de azafatas en España 2026"
                className="w-full rounded-xl my-6 object-cover"
                style={{ maxHeight: 320, filter: 'brightness(0.9)' }}
                loading="lazy"
                width={800}
                height={450}
              />
            </picture>
          </div>
          <BlogInlineCTA role="azafata" variant="upgrade" />
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Tarifas por perfil de azafata</h2>
              <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <table className="w-full text-xs">
                  <thead><tr style={{ background: 'rgba(212,175,55,0.08)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}><th className="text-left px-4 py-3 font-bold">Perfil</th><th className="px-4 py-3 font-bold text-right">Tarifa</th><th className="px-4 py-3 font-bold text-left hidden sm:table-cell">Nota</th></tr></thead>
                  <tbody>{PRECIOS.map((row, i) => (<tr key={row.perfil} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="px-4 py-3 font-medium">{row.perfil}</td><td className="px-4 py-3 text-right font-bold" style={{ color: '#D4AF37' }}>{row.tarifa}</td><td className="px-4 py-3 hidden sm:table-cell" style={{ color: '#3d3d4e' }}>{row.nota}</td></tr>))}</tbody>
                </table>
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Precios orientativos 2026. Sin IVA. Desplazamiento fuera de la ciudad de residencia se factura aparte.</p>
            </section>
            <section>
              <h2 className="text-lg font-black mb-3">Qué incluye el precio de una azafata de eventos</h2>
              <div className="space-y-2">{['Presencia durante toda la jornada acordada','Uniforme propio (o adaptación al dress code del cliente)','Briefing previo del evento (producto, protocolo, argumentario)','Gestión de registro o acreditación de asistentes','Atención y orientación a los visitantes del stand o evento','Recogida de leads y contactos si se requiere'].map((item,i) => (<div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}><span className="text-xs font-black shrink-0 mt-0.5" style={{ color: '#D4AF37' }}>✓</span><p className="text-xs" style={{ color: 'rgba(255,255,255,0.8)' }}>{item}</p></div>))}</div>
            </section>
            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">{faqStructured.mainEntity.map(f => (<div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}><h3 className="text-sm font-bold mb-2">{f.name}</h3><p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>{f.acceptedAnswer.text}</p></div>))}</div>
            </section>
            
            <section className="mt-8 mb-8">
              <h2 className="text-base font-black mb-3">Contratar staff y azafatas por ciudad</h2>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Staff Madrid', href: '/contratar-staff/madrid' },
                  { label: 'Staff Barcelona', href: '/contratar-staff/barcelona' },
                  { label: 'Staff Sevilla', href: '/contratar-staff/sevilla' },
                  { label: 'Staff Valencia', href: '/contratar-staff/valencia' },
                  { label: 'Staff Málaga', href: '/contratar-staff/malaga' },
                  { label: 'Staff Ibiza', href: '/contratar-staff/ibiza' },
                ].map(c => (
                  <a key={c.href} href={c.href}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105"
                    style={{ background: 'rgba(212,175,55,0.08)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }}>
                    {c.label}
                  </a>
                ))}
              </div>
            </section>

            <section className="mt-8">
              <h2 className="text-base font-black mb-3" style={{ color: 'rgba(255,255,255,0.85)' }}>Artículos relacionados</h2>
              <div className="space-y-2">
                {[
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
              <p className="text-sm font-black mb-2">¿Necesitas azafatas para tu evento o feria?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>XPEAK conecta organizadores con staff profesional verificado en toda España. Contrato digital automático incluido.</p>
              <a href="/contratar-staff" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Ver staff en XPEAK →</a>
            </div>
          </div>
                  <BlogEmailCapture variant="presupuestos" intent="contratar-staff" articlePath="/blog/precio-azafatas-eventos-espana" />
</main>
      <DJResourcesAffiliate role="staff" />
      <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/precio-azafatas-eventos-espana' tag='Staff' />
        <FooterPublic />
      <BlogScrollCTA role="azafata" storageKey="xpeak_scrollcta_precio_azafatas" />
      </div>
    </>
  );
}
