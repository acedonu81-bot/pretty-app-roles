import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';

const article = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Cómo comparar presupuestos de proveedores de eventos sin perder días (2026)',
  description: 'Método práctico para comparar presupuestos de DJ, catering, fotógrafo y staff sin perder tiempo en llamadas y correos cruzados.',
  datePublished: '2026-07-16',
  dateModified: '2026-07-16',
  author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' },
  publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } },
  image: 'https://xpeak.es/og-image.jpg',
  url: 'https://xpeak.es/blog/comparar-presupuestos-proveedores-eventos',
};

const faqStructured = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: '¿Cuántos presupuestos hay que pedir por cada servicio?', acceptedAnswer: { '@type': 'Answer', text: 'Como mínimo 3 por partida importante (catering, DJ, fotógrafo). Con menos de 3 no tienes referencia real de mercado; con más de 5 el proceso se alarga sin aportar información nueva relevante.' } },
    { '@type': 'Question', name: '¿Qué debe incluir siempre un presupuesto de evento?', acceptedAnswer: { '@type': 'Answer', text: 'Precio con y sin IVA, qué incluye exactamente (horas, equipo, desplazamiento), condiciones de cancelación y forma de pago (señal + resto). Un presupuesto sin estos 4 puntos suele generar sorpresas después.' } },
    { '@type': 'Question', name: '¿El precio más barato es siempre la mejor opción?', acceptedAnswer: { '@type': 'Answer', text: 'No necesariamente. Hay que comparar qué incluye cada presupuesto: un precio más alto que incluye equipo de sonido, iluminación y horas extra puede salir más barato que uno bajo al que luego hay que añadir extras.' } },
    { '@type': 'Question', name: '¿Cómo evitar perder tiempo con proveedores que no responden?', acceptedAnswer: { '@type': 'Answer', text: 'Prioriza plataformas donde el precio ya es público (evita el ida y vuelta de "cuánto cobras") y donde puedas contactar a varios proveedores a la vez desde el mismo sitio, en lugar de gestionar conversaciones sueltas por WhatsApp o email.' } },
  ],
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'Comparar presupuestos de eventos', item: 'https://xpeak.es/blog/comparar-presupuestos-proveedores-eventos' },
  ],
};

export default function BlogComoCompararPresupuestosEventos() {
  return (
    <>
      <Helmet>
        <title>Cómo comparar presupuestos de proveedores de eventos (2026) | XPEAK</title>
        <meta name="description" content="Método práctico para comparar presupuestos de DJ, catering, fotógrafo y staff sin perder días en llamadas y correos cruzados." />
        <link rel="canonical" href="https://xpeak.es/blog/comparar-presupuestos-proveedores-eventos" />
        <meta property="og:title" content="Cómo comparar presupuestos de proveedores de eventos — XPEAK Blog" />
        <meta property="og:description" content="Método práctico para comparar presupuestos de eventos sin perder tiempo en gestiones sueltas." />
        <meta property="og:url" content="https://xpeak.es/blog/comparar-presupuestos-proveedores-eventos" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>

      <div className="min-h-screen" style={{ background: '#ffffff', color: '#111' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-3xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#0D9488' }}>XPEAK</a>
          <div className="flex items-center gap-3">
            <a href="/blog" className="text-xs font-bold hidden sm:block" style={{ color: '#3d3d4e' }}>Blog</a>
            <a href="/auth?mode=register&role=empresario" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#0D9488,#B8941E)', color: '#000' }}>
              Unirse gratis
            </a>
          </div>
        </nav>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>

          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#0D9488' }}>Organizadores · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Cómo comparar presupuestos de proveedores de eventos sin perder días</h1>
            <p className="text-base leading-relaxed" style={{ color: '#3d3d4e' }}>
              Pedir presupuestos por WhatsApp a diez proveedores distintos y esperar respuesta es el mayor cuello de botella al organizar un evento. Este es el método para comparar rápido y sin sorpresas después.
            </p>
            <time className="text-xs mt-3 block" style={{ color: '#666' }}>16 julio 2026</time>
          </div>

          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Por qué el proceso habitual es lento</h2>
              <p className="text-base leading-relaxed mb-3" style={{ color: '#222' }}>
                El flujo típico —buscar en Instagram, mandar mensaje, esperar respuesta, negociar precio por privado— puede tardar días por cada proveedor. Si necesitas comparar DJ, catering, fotógrafo y staff, el proceso completo fácilmente supera las dos semanas solo en la fase de presupuestos.
              </p>
              <p className="text-base leading-relaxed" style={{ color: '#222' }}>
                El problema no es solo el tiempo: al negociar precio en privado con cada uno, es difícil saber si estás pagando de más, porque no tienes ninguna referencia pública de mercado.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">Qué comparar en cada presupuesto (no solo el precio)</h2>
              <div className="space-y-3">
                {[
                  { item: 'Precio con IVA incluido', desc: 'Muchos autónomos dan el precio sin IVA. Pide siempre el total final para comparar de forma justa.' },
                  { item: 'Qué incluye exactamente', desc: 'Horas de servicio, equipo (sonido, luces, cámara extra), desplazamiento y montaje/desmontaje.' },
                  { item: 'Condiciones de cancelación', desc: 'Qué porcentaje se pierde según cuándo canceles — protege tanto a ti como al proveedor.' },
                  { item: 'Forma de pago', desc: 'Señal habitual del 30-50% al reservar, resto antes o después del evento según lo acordado.' },
                ].map((row, i) => (
                  <div key={row.item} className="p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(0,0,0,0.025)' : 'rgba(0,0,0,0.015)', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <p className="text-xs font-black mb-1">{row.item}</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#333' }}>{row.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">Cómo acelerar el proceso</h2>
              <p className="text-base leading-relaxed" style={{ color: '#222' }}>
                Usar un directorio donde el precio ya es público desde el principio elimina el paso más lento (preguntar "¿cuánto cobras?" y esperar respuesta). Poder comparar varios perfiles de la misma categoría en una sola pantalla, con tarifa visible, reduce el proceso de comparación de presupuestos de días a minutos.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">
                {faqStructured.mainEntity.map((f) => (
                  <div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}>
                    <p className="text-sm font-black mb-2">{f.name}</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#333' }}>{f.acceptedAnswer.text}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(13,148,136,0.04)', border: '1px solid rgba(13,148,136,0.12)' }}>
              <p className="text-sm font-black mb-2">Compara presupuestos con tarifas públicas desde el minuto uno</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>
                En XPEAK cada perfil muestra su precio antes de contactar. Sin negociación a ciegas, sin comisión.
              </p>
              <a href="/organizar-eventos" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#0D9488,#B8941E)', color: '#000' }}>
                Ver panel de organización →
              </a>
            </div>
          </div>
        </main>

        <BlogRelatedPosts currentSlug='/blog/comparar-presupuestos-proveedores-eventos' tag='Eventos' />
        <FooterPublic />
        <BlogScrollCTA role="empresario" storageKey="xpeak_scrollcta_comparar_presupuestos" />
      </div>
    </>
  );
}
