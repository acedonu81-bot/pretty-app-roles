import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';
import BlogScrollCTA from '@/components/BlogScrollCTA';

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Con cuánta antelación reservar DJ, fotógrafo y catering para una boda",
  "description": "Guía de plazos: cuándo contratar cada proveedor para tu boda. DJ, fotógrafo, camareros, catering y más. Calendario de reservas 2026.",
  "author": { "@type": "Person", "name": "Daniel" },
  "publisher": { "@type": "Organization", "name": "XPEAK", "url": "https://xpeak.es" },
  "datePublished": "2026-06-10",
  "dateModified": "2026-06-10",
  "url": "https://xpeak.es/blog/antelacion-reservar-proveedores-boda"
};

const faqStructured = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: '¿Con cuánta antelación hay que reservar el DJ para una boda?', acceptedAnswer: { '@type': 'Answer', text: 'Los DJs especializados en bodas tienen la agenda muy cargada de abril a octubre, así que conviene contratarlos entre 6 y 12 meses antes. En temporada alta las primeras opciones se agotan pronto; si hay urgencia, el Flash Booking de XPEAK ofrece disponibilidad en menos de 1 hora.' } },
    { '@type': 'Question', name: '¿Cuándo hay que reservar la finca y el catering?', acceptedAnswer: { '@type': 'Answer', text: 'La finca y el catering premium son lo primero que debe cerrarse: entre 12 y 18 meses antes. Las mejores fincas se reservan con 1 o 2 años de antelación en temporada alta y los caterings de gama alta tienen la agenda llena con mucho tiempo.' } },
    { '@type': 'Question', name: '¿Qué pasa si reservo los proveedores tarde?', acceptedAnswer: { '@type': 'Answer', text: 'Si tu boda es en temporada alta (mayo-septiembre) y empiezas a buscar con menos de 3 meses, lo más probable es que los mejores profesionales estén ocupados. Tendrás que elegir entre profesionales menos experimentados o pagar una prima por disponibilidad urgente.' } },
  ],
};

export default function BlogAntelacionReservasBoda() {
  return (
    <>
      <Helmet>
        <title>¿Con Cuánta Antelación Reservar DJ, Fotógrafo y Catering para tu Boda? 2026</title>
        <meta name="description" content="Guía completa de plazos: cuándo contratar el DJ, fotógrafo, camareros y catering para una boda. Calendario de reservas con márgenes de seguridad." />
        <link rel="canonical" href="https://xpeak.es/blog/antelacion-reservar-proveedores-boda" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
      </Helmet>
      <div style={{ background: '#0A0A0A', color: '#F5F5F0', minHeight: '100vh' }}>
        <div className="max-w-2xl mx-auto px-4 py-12">
          <a href="/blog" style={{ color: '#D4AF37', fontSize: '0.8rem', fontWeight: 700 }}>← Blog XPEAK</a>
          <article className="mt-6">
            <span style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 6, padding: '3px 10px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Bodas · Planificación</span>
            <h1 className="text-3xl font-black mt-4 mb-4 leading-tight">¿Con cuánta antelación reservar DJ, fotógrafo y catering para tu boda?</h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Por Daniel · XPEAK · 10 junio 2026</p>

            <p className="mt-6 mb-4" style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.8 }}>
              Los mejores proveedores de boda en España se agotan con mucha antelación, especialmente en temporada alta (mayo-octubre). Si reservas tarde, tendrás que conformarte con lo que queda. Esta guía te dice exactamente cuándo contratar cada proveedor.
            </p>

            <h2 className="text-xl font-black mt-8 mb-4">Calendario de reservas para una boda</h2>

            {[
              { plazo: '12-18 meses antes', icon: '🏰', proveedores: [
                { nombre: 'Finca / venue', nota: 'Las mejores fincas se reservan 1-2 años antes en temporada alta.' },
                { nombre: 'Catering de boda', nota: 'Los servicios de catering premium tienen agenda llena con mucha antelación.' },
              ]},
              { plazo: '6-12 meses antes', icon: '📸', proveedores: [
                { nombre: 'Fotógrafo de boda', nota: 'Los fotógrafos top de bodas en España tienen lista de espera. Reserva cuanto antes.', link: '/blog/fotografo-boda' },
                { nombre: 'Videógrafo', nota: 'Similar al fotógrafo: alta demanda en verano y fines de semana.' },
                { nombre: 'DJ para boda', nota: 'Los DJs especializados en bodas tienen agenda muy cargada de abril a octubre.', link: '/contratar-dj' },
                { nombre: 'Grupo musical en vivo', nota: 'Bandas y grupos de jazz para cócteles: se contratan con 6-9 meses de antelación.' },
              ]},
              { plazo: '3-6 meses antes', icon: '🍾', proveedores: [
                { nombre: 'Disco móvil (si no tienes DJ)', nota: 'Opción completa con equipo incluido para fincas sin instalación.', link: '/contratar-disco-movil' },
                { nombre: 'Maquilladora de novia', nota: 'Las maquilladores especializadas en bodas tienen agenda limitada.', link: '/contratar-maquillaje' },
                { nombre: 'Wedding planner', nota: 'Si contratas un organizador externo, hazlo lo antes posible.' },
                { nombre: 'Maestro de ceremonias', nota: 'Para bodas civiles con ceremonia emotiva y personalizada.' },
              ]},
              { plazo: '1-3 meses antes', icon: '🍽️', proveedores: [
                { nombre: 'Camareros y personal de sala', nota: 'Más flexibles que otros proveedores. En XPEAK puedes contratar con pocas semanas.', link: '/contratar-camareros' },
                { nombre: 'Personal de apoyo (azafatas, seguridad)', nota: 'Se pueden contratar con 2-4 semanas de antelación.', link: '/contratar-staff' },
              ]},
              { plazo: 'Última hora (Flash Booking)', icon: '⚡', proveedores: [
                { nombre: 'DJ de sustitución', nota: 'Si tu DJ cancela, usa Flash Booking. Respuesta garantizada en <1 hora.', link: '/contratar-dj' },
                { nombre: 'Camarero extra de última hora', nota: 'Flash Booking cubre bajas inesperadas en el personal de sala.', link: '/contratar-camareros' },
              ]},
            ].map(section => (
              <div key={section.plazo} className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span style={{ fontSize: '1.2rem' }}>{section.icon}</span>
                  <h3 className="text-base font-black" style={{ color: '#D4AF37' }}>{section.plazo}</h3>
                </div>
                <div className="space-y-2 ml-7">
                  {section.proveedores.map(p => (
                    <div key={p.nombre} className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <p className="font-bold text-sm">
                        {p.link ? <a href={p.link} style={{ color: '#D4AF37' }}>{p.nombre}</a> : p.nombre}
                      </p>
                      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', marginTop: 2 }}>{p.nota}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <h2 className="text-xl font-black mt-8 mb-3">¿Qué pasa si reservo tarde?</h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, marginBottom: '1rem' }}>
              Si tu boda es en temporada alta (mayo-septiembre) y empiezas a buscar DJ o fotógrafo con menos de 3 meses, lo más probable es que los mejores profesionales ya estén ocupados. Tendrás que elegir entre profesionales menos experimentados o pagar una prima por disponibilidad urgente.
            </p>
            <p style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.8 }}>
              Para emergencias reales — un DJ que cancela a última hora, personal de sala que no aparece — existe <a href="/contratar-dj" style={{ color: '#D4AF37', fontWeight: 700 }}>Flash Booking de XPEAK</a>: publicas la necesidad y recibes respuestas de profesionales disponibles en tu zona en menos de 60 minutos.
            </p>

            <section className="mt-8">
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">
                {faqStructured.mainEntity.map(f => (
                  <div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <h3 className="text-sm font-bold mb-2">{f.name}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>{f.acceptedAnswer.text}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="mt-8 p-5 rounded-2xl text-center" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)' }}>
              <p className="font-black text-lg mb-2">Contrata tus proveedores de boda en XPEAK</p>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem', marginBottom: '1rem' }}>DJ, fotógrafo, camareros y catering verificados. Contratos digitales automáticos. 0% comisión.</p>
              <a href="/auth" className="inline-block px-6 py-3 rounded-xl font-black text-sm transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Buscar profesionales →</a>
            </div>

            <BlogAuthor />
            <BlogShare />
          </article>
        </div>
        <BlogRelatedPosts currentSlug='/blog/antelacion-reservar-proveedores-boda' tag='DJ' />
        <FooterPublic />
        <BlogScrollCTA role="empresario" storageKey="xpeak_scrollcta_antelacion_boda" />
      </div>
    </>
  );
}
