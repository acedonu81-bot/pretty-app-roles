import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';
import BlogScrollCTA from '@/components/BlogScrollCTA';

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Cómo funciona el Flash Booking de XPEAK: contratar un profesional verificado en menos de 1 hora",
  "description": "Guía completa del sistema Flash Booking de XPEAK. Cómo contratar DJ, camareros o fotógrafo para tu evento con confirmación en menos de 60 minutos.",
  "author": { "@type": "Person", "name": "Daniel" },
  "publisher": { "@type": "Organization", "name": "XPEAK", "url": "https://xpeak.es" },
  "datePublished": "2026-06-10",
  "dateModified": "2026-06-10",
  "url": "https://xpeak.es/blog/como-funciona-flash-booking-xpeak"
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "¿Qué es el Flash Booking de XPEAK?", "acceptedAnswer": { "@type": "Answer", "text": "Flash Booking es el sistema de contratación urgente de XPEAK. Publicas una oferta con fecha, ciudad y presupuesto y los profesionales disponibles en tu zona responden en menos de 60 minutos. Es gratuito para organizadores." } },
    { "@type": "Question", "name": "¿Cuánto tarda en responder un profesional con Flash Booking?", "acceptedAnswer": { "@type": "Answer", "text": "El tiempo medio de primera respuesta es inferior a 60 minutos. Los profesionales con disponibilidad activa reciben una notificación inmediata y pueden aceptar la oferta directamente desde la app." } },
    { "@type": "Question", "name": "¿Flash Booking tiene coste para las salas y organizadores?", "acceptedAnswer": { "@type": "Answer", "text": "No. Flash Booking es completamente gratuito para salas, promotoras y organizadores. XPEAK no cobra comisión sobre ninguna contratación." } },
  ]
};

export default function BlogFlashBookingComoFunciona() {
  return (
    <>
      <Helmet>
        <title>Cómo Funciona el Flash Booking de XPEAK — Contratar Profesionales en &lt;1 Hora</title>
        <meta name="description" content="Guía completa del Flash Booking de XPEAK. Cómo contratar DJ, camareros o fotógrafo verificado para tu evento con confirmación en menos de 60 minutos. Gratis para organizadores." />
        <link rel="canonical" href="https://xpeak.es/blog/como-funciona-flash-booking-xpeak" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqLd)}</script>
      </Helmet>
      <div style={{ background: '#0A0A0A', color: '#F5F5F0', minHeight: '100vh' }}>
        <div className="max-w-2xl mx-auto px-4 py-12">
          <a href="/blog" style={{ color: '#6D28D9', fontSize: '0.8rem', fontWeight: 700 }}>← Blog XPEAK</a>
          <article className="mt-6">
            <span style={{ background: 'rgba(109,40,217,0.1)', color: '#6D28D9', border: '1px solid rgba(109,40,217,0.2)', borderRadius: 6, padding: '3px 10px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>XPEAK · Flash Booking</span>
            <h1 className="text-3xl font-black mt-4 mb-4 leading-tight">Cómo funciona el Flash Booking de XPEAK: contrata un profesional verificado en menos de 1 hora</h1>
            <p style={{ color: '#444', fontSize: '0.85rem' }}>Por Daniel · XPEAK · 10 junio 2026</p>

            <p className="mt-6 mb-4" style={{ color: '#222', lineHeight: 1.8 }}>
              El Flash Booking es el sistema de contratación urgente de XPEAK. Diseñado para cuando necesitas un DJ para esta noche, camareros para mañana o un fotógrafo para el fin de semana. Sin llamadas, sin grupos de WhatsApp, sin esperas. Publicás la oferta y recibes respuestas de profesionales verificados disponibles en tu zona en menos de 60 minutos.
            </p>

            <h2 className="text-xl font-black mt-8 mb-4">Cómo funciona paso a paso</h2>
            {[
              { n: '01', title: 'Crea tu cuenta gratis', body: 'Regístrate como sala, promotora u organizador. El proceso tarda menos de 2 minutos. Sin tarjeta de crédito. Acceso inmediato al panel de Flash Booking.' },
              { n: '02', title: 'Publica tu oferta', body: 'Describe el evento: categoría profesional que necesitas (DJ, camareros, fotógrafo…), ciudad, fecha y hora, duración estimada y presupuesto orientativo.' },
              { n: '03', title: 'Los profesionales reciben la notificación', body: 'Todos los profesionales verificados con disponibilidad activa en tu zona reciben una notificación inmediata en la app. Pueden ver los detalles y aceptar o declinar la oferta en segundos.' },
              { n: '04', title: 'Recibes las candidaturas', body: 'Las respuestas llegan en tiempo real a tu panel. Puedes ver el perfil completo de cada profesional: portfolio, valoraciones, tarifas y disponibilidad confirmada.' },
              { n: '05', title: 'Elige y firma el contrato digital', body: 'Selecciona al profesional que mejor se adapta. Con un clic se genera el contrato digital automático con todos los datos acordados. PDF listo para facturación.' },
            ].map(step => (
              <div key={step.n} className="flex gap-4 mb-5">
                <div className="text-3xl font-black flex-shrink-0 w-10" style={{ color: 'rgba(109,40,217,0.25)' }}>{step.n}</div>
                <div className="p-4 rounded-xl flex-1" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.07)' }}>
                  <p className="font-black mb-1">{step.title}</p>
                  <p style={{ color: '#333', fontSize: '0.9rem', lineHeight: 1.7 }}>{step.body}</p>
                </div>
              </div>
            ))}

            <h2 className="text-xl font-black mt-8 mb-3">¿Para qué profesionales está disponible?</h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { label: 'DJ', href: '/contratar-dj' },
                { label: 'Camareros', href: '/contratar-camareros' },
                { label: 'Bartenders', href: '/contratar-camareros' },
                { label: 'Fotógrafos', href: '/contratar-fotografo' },
                { label: 'Videógrafos', href: '/contratar-fotografo' },
                { label: 'Staff de sala', href: '/contratar-staff' },
                { label: 'Promotores / RRPP', href: '/contratar-promotores' },
                { label: 'Maquilladores', href: '/contratar-maquillaje' },
                { label: 'Catering', href: '/contratar-catering' },
                { label: 'Disco móvil', href: '/contratar-disco-movil' },
              ].map(p => (
                <a key={p.label} href={p.href} className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105" style={{ background: 'rgba(109,40,217,0.08)', color: '#6D28D9', border: '1px solid rgba(109,40,217,0.2)' }}>{p.label}</a>
              ))}
            </div>

            <h2 className="text-xl font-black mt-8 mb-3">Casos de uso habituales</h2>
            <ul style={{ color: '#222', lineHeight: 2, paddingLeft: '1.2rem' }}>
              <li>DJ cancela el jueves para el sábado → Flash Booking encuentra sustituto en menos de 1h</li>
              <li>Boda con más invitados de lo previsto → camareros extra en 24 horas</li>
              <li>Evento corporativo de última hora → fotógrafo disponible para mañana</li>
              <li>Finca sin equipo de sonido → DJ con disco móvil completa en pocas horas</li>
              <li>Temporada alta en Ibiza → camareros extra para el fin de semana</li>
            </ul>

            <h2 className="text-xl font-black mt-8 mb-3">Preguntas frecuentes</h2>
            {[
              { q: '¿Qué es el Flash Booking de XPEAK?', a: 'Flash Booking es el sistema de contratación urgente de XPEAK. Publicas una oferta con fecha, ciudad y presupuesto y los profesionales disponibles en tu zona responden en menos de 60 minutos. Es gratuito para organizadores.' },
              { q: '¿Cuánto tarda en responder un profesional?', a: 'El tiempo medio de primera respuesta es inferior a 60 minutos. Los profesionales con disponibilidad activa reciben una notificación inmediata y pueden aceptar desde la app.' },
              { q: '¿Flash Booking tiene coste para salas y organizadores?', a: 'No. Flash Booking es completamente gratuito para salas, promotoras y organizadores. XPEAK no cobra comisión sobre ninguna contratación.' },
            ].map(({ q, a }) => (
              <div key={q} className="mb-4 p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)' }}>
                <p className="font-black mb-2">{q}</p>
                <p style={{ color: '#333', fontSize: '0.9rem', lineHeight: 1.7 }}>{a}</p>
              </div>
            ))}

            <div className="mt-8 p-5 rounded-2xl text-center" style={{ background: 'rgba(109,40,217,0.06)', border: '1px solid rgba(109,40,217,0.2)' }}>
              <p className="font-black text-lg mb-2">⚡ Prueba el Flash Booking ahora</p>
              <p style={{ color: '#444', fontSize: '0.9rem', marginBottom: '1rem' }}>Crea tu cuenta gratis y publica tu primera oferta en menos de 2 minutos.</p>
              <a href="/auth" className="inline-block px-6 py-3 rounded-xl font-black text-sm transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#6D28D9,#B8941E)', color: '#000' }}>Empezar gratis →</a>
            </div>

            <BlogAuthor />
            <BlogShare />
          </article>
        </div>
        <BlogRelatedPosts currentSlug='/blog/como-funciona-flash-booking-xpeak' tag='Eventos' />
        <FooterPublic />
        <BlogScrollCTA role="empresario" storageKey="xpeak_scrollcta_flash_booking" />
      </div>
    </>
  );
}
