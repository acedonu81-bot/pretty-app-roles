import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogAnswerBox from '@/components/BlogAnswerBox';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';

const slug = 'boda-low-cost-checklist-completo';

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Boda low cost: checklist completo de todo lo que necesitas contratar',
  description: 'Guía completa para organizar una boda con presupuesto ajustado en España 2026. Checklist de DJ, fotógrafo, catering, flores, maquillaje y más. Ahorra sin renunciar a calidad.',
  author: { '@type': 'Organization', name: 'XPEAK' },
  publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
  datePublished: '2026-06-07',
  dateModified: '2026-06-07',
  url: `https://xpeak.es/blog/${slug}`,
  mainEntityOfPage: { '@type': 'WebPage', '@id': `https://xpeak.es/blog/${slug}` },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'Boda low cost: checklist completo', item: `https://xpeak.es/blog/${slug}` },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Cuánto cuesta una boda low cost en España?',
      acceptedAnswer: { '@type': 'Answer', text: 'Una boda low cost en España cuesta entre 8.000 y 18.000€ para 80-100 invitados. Los mayores ahorros vienen de elegir viernes o domingo en vez de sábado (ahorra hasta un 30%), contratar en temporada baja (noviembre-marzo) y comparar al menos 3 presupuestos por servicio.' },
    },
    {
      '@type': 'Question',
      name: '¿En qué servicios de boda puedo ahorrar más?',
      acceptedAnswer: { '@type': 'Answer', text: 'Las mayores palancas de ahorro son: 1) DJ vs banda en directo (ahorra 1.000-3.000€), 2) menú reducido con catering de calidad vs restaurante exclusivo (ahorra 20-40%), 3) fotógrafo emergente verificado vs nombre conocido (ahorra 800-2.000€), 4) flores de temporada vs importadas (ahorra 30-50%).' },
    },
    {
      '@type': 'Question',
      name: '¿Cómo contratar todo lo necesario para una boda sin intermediarios?',
      acceptedAnswer: { '@type': 'Answer', text: 'La forma más eficiente es usar plataformas como XPEAK donde los profesionales publican sus tarifas públicamente. Así comparas sin hacer decenas de llamadas, ves valoraciones reales y firmas contrato digital directamente con cada profesional. Sin comisiones de agencia.' },
    },
    {
      '@type': 'Question',
      name: '¿Qué no puede faltar en una boda low cost?',
      acceptedAnswer: { '@type': 'Answer', text: 'Los intocables en cualquier presupuesto: fotógrafo (los recuerdos son para siempre), DJ o música (marca el ritmo de toda la noche) y catering (la comida es lo más comentado). En estas partidas, bajar la calidad afecta directamente a la experiencia. El resto — flores, decoración, invitaciones — tiene mucho margen de optimización.' },
    },
  ],
};

const CHECKLIST = [
  {
    categoria: 'Música & Ambiente',
    emoji: '🎵',
    presupuesto: '500 – 1.400€',
    items: [
      { servicio: 'DJ para boda (6h)', precio: '600 – 1.200€', ahorro: 'Busca DJs con +10 bodas en su historial — calidad sin sobreprecio de "nombre".' },
      { servicio: 'Equipo de sonido incluido', precio: '0€ extra', ahorro: 'Confirma que el DJ lleva altavoces, CDJs y micro. Evita alquilar equipo aparte.' },
      { servicio: 'Hilo musical ceremonia', precio: '0 – 150€', ahorro: 'Muchos DJs incluyen 1h de ceremonia en el precio base. Pregúntalo antes.' },
    ],
    consejo: 'Un DJ verificado con buen equipo propio cuesta lo mismo que alquilar el equipo de un DJ sin experiencia.',
  },
  {
    categoria: 'Foto & Vídeo',
    emoji: '📸',
    presupuesto: '900 – 2.200€',
    items: [
      { servicio: 'Fotógrafo de boda (8h)', precio: '900 – 1.800€', ahorro: 'Fotógrafos con 2-3 años de experiencia tienen portfolios excelentes a la mitad que los "consagrados".' },
      { servicio: 'Álbum impreso', precio: '200 – 500€', ahorro: 'Pídelo como add-on separado. Sin álbum, el pack base baja 300-400€.' },
      { servicio: 'Vídeo (opcional)', precio: '600 – 1.200€', ahorro: 'Si ajustas, prescinde del vídeo. Las fotos bien hechas cubren el recuerdo.' },
    ],
    consejo: 'La foto es la única partida donde no recomendamos ir al más barato. Busca equilibrio: experiencia verificada + portfolio que te guste.',
  },
  {
    categoria: 'Catering & Menú',
    emoji: '🍽️',
    presupuesto: '55 – 95€/persona',
    items: [
      { servicio: 'Menú boda completo (aperitivo + cena)', precio: '65 – 90€/persona', ahorro: 'Reduce entrantes (2 en vez de 4) y elige vinos de denominación de origen española vs importados.' },
      { servicio: 'Tarta de boda', precio: '150 – 400€', ahorro: 'Pastelerías locales: igual de bonitas, precio 40% menor que proveedores "de bodas".' },
      { servicio: 'Barra libre (3h)', precio: '15 – 30€/persona', ahorro: 'Limita la barra libre a 2-3h. El consumo de las primeras horas es casi el total.' },
    ],
    consejo: 'El catering es el 35-45% del presupuesto total. Aquí está el mayor margen de ahorro real.',
  },
  {
    categoria: 'Imagen & Belleza',
    emoji: '💄',
    presupuesto: '150 – 600€',
    items: [
      { servicio: 'Maquillaje novia + peinado', precio: '200 – 450€', ahorro: 'Maquilladora freelance vs salón especializado: misma calidad, 30% menos.' },
      { servicio: 'Prueba de maquillaje', precio: '60 – 100€', ahorro: 'Incluye la prueba en el pack. Es imprescindible y muchas lo cobran aparte.' },
      { servicio: 'Maquillaje damas honor', precio: '60 – 100€/persona', ahorro: 'Opcional. Cada dama puede pagarse el suyo si quiere.' },
    ],
    consejo: 'Una maquilladora con portfolio en Instagram y valoraciones reales ofrece resultados igual de buenos que una agencia.',
  },
  {
    categoria: 'Flores & Decoración',
    emoji: '🌸',
    presupuesto: '400 – 1.500€',
    items: [
      { servicio: 'Ramo de novia', precio: '80 – 200€', ahorro: 'Flores de temporada española: rosas, girasoles, lavanda. 40-50% más baratas que importadas.' },
      { servicio: 'Centros de mesa (10-12 mesas)', precio: '200 – 600€', ahorro: 'Combina flores naturales con elementos no florales (velas, eucalipto) para reducir coste.' },
      { servicio: 'Arco floral ceremonia', precio: '150 – 400€', ahorro: 'Muchos floristas lo alquilan. No hace falta comprarlo.' },
    ],
    consejo: 'La decoración floral es la partida más fácil de optimizar sin que los invitados lo noten.',
  },
  {
    categoria: 'Staff & Coordinación',
    emoji: '👥',
    presupuesto: '200 – 800€',
    items: [
      { servicio: 'Camareros para boda (ratio 1/20)', precio: '120 – 180€/camarero', ahorro: 'Con 80 invitados necesitas 4 camareros. Contrátalos directamente, sin agencia.' },
      { servicio: 'Coordinador día de la boda', precio: '300 – 600€', ahorro: 'Si tienes la logística clara, puedes prescindir. Si no, vale cada euro.' },
      { servicio: 'Personal de parking/accesos', precio: '100 – 200€', ahorro: 'Solo necesario si la finca es grande. Muchas lo incluyen en el alquiler.' },
    ],
    consejo: 'Contratar camareros directamente (sin ETT de intermediario) ahorra entre 20 y 40% por persona.',
  },
];

const RESUMEN_PRESUPUESTO = [
  { partida: 'Finca / Espacio', rango: '1.500 – 5.000€', peso: '15-25%' },
  { partida: 'Catering (90 pax)', rango: '5.400 – 8.100€', peso: '35-45%' },
  { partida: 'Foto & Vídeo', rango: '900 – 2.200€', peso: '8-12%' },
  { partida: 'Música (DJ)', rango: '600 – 1.200€', peso: '4-7%' },
  { partida: 'Flores & Decoración', rango: '400 – 1.500€', peso: '3-8%' },
  { partida: 'Imagen & Belleza', rango: '150 – 600€', peso: '1-3%' },
  { partida: 'Staff & Camareros', rango: '480 – 720€', peso: '3-5%' },
  { partida: 'Invitaciones & Papelería', rango: '100 – 400€', peso: '1-2%' },
  { partida: 'Imprevistos (10%)', rango: '900 – 1.900€', peso: '10%' },
];

export default function BlogBodaLowCost() {
  return (
    <>
      <Helmet>
        <title>Boda low cost: checklist completo de todo lo que necesitas contratar | XPEAK</title>
        <meta name="description" content="Guía completa para organizar una boda con presupuesto ajustado. Checklist de DJ, fotógrafo, catering, flores y staff con precios reales 2026. Ahorra sin perder calidad." />
        <link rel="canonical" href={`https://xpeak.es/blog/${slug}`} />
        <meta property="og:title" content="Boda low cost: checklist completo 2026 — XPEAK" />
        <meta property="og:description" content="Todo lo que necesitas contratar para tu boda con precios reales y consejos para ahorrar. DJ, fotógrafo, catering, maquillaje y más." />
        <meta property="og:url" content={`https://xpeak.es/blog/${slug}`} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="min-h-screen" style={{ background: '#090909', color: '#fff' }}>

        {/* Nav */}
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-3xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#D4AF37' }}>XPEAK</a>
          <div className="flex items-center gap-3">
            <a href="/blog" className="text-xs font-bold hidden sm:block" style={{ color: '#8E8EA0' }}>Blog</a>
            <a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Unirse gratis</a>
          </div>
        </nav>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6" style={{ color: '#8E8EA0' }}>← Todos los artículos</a>

          {/* Header */}
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>Bodas · Presupuesto · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">
              Boda low cost: checklist completo de todo lo que necesitas contratar
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: '#8E8EA0' }}>
              Organizar una boda bonita sin arruinarse es posible. La clave está en saber exactamente qué contratar, en qué orden y dónde está el margen real de ahorro en cada partida.
            </p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>7 junio 2026 · 8 min de lectura</time>
            <BlogAnswerBox
              question="¿Cuánto cuesta una boda low cost en España?"
              answer="Una boda low cost para 80-100 invitados en España cuesta entre 8.000 y 18.000€. Las 5 palancas de ahorro reales son: celebrar en viernes o domingo (ahorra 800-2.000€ en la finca), contratar en temporada baja (noviembre-marzo), comparar 3 presupuestos por servicio, elegir DJ en vez de banda, y contratar directamente sin agencia organizadora."
            />
            <img
              src="/images/blog/boda-low-cost-presupuesto-completo.jpg"
              alt="Copas de cóctel en boda — guía boda low cost presupuesto completo España 2026"
              className="w-full rounded-xl my-6 object-cover"
              style={{ maxHeight: 320, filter: 'brightness(0.9)' }}
              loading="lazy"
            />
          </div>

          <BlogEmailCapture variant="presupuestos" intent="contratar-dj" articlePath={`/blog/${slug}`} />

          {/* Resumen presupuesto */}
          <section className="mb-10">
            <h2 className="text-lg font-black mb-2">¿Cuánto cuesta una boda low cost en España?</h2>
            <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Para 80-100 invitados en 2026, el rango realista es <strong style={{ color: '#D4AF37' }}>8.000 – 18.000€</strong>. La diferencia entre el mínimo y el máximo depende casi por completo de tres decisiones: día de la semana, mes del año y si contratas cada proveedor directamente o a través de una agencia organizadora.
            </p>

            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="px-4 py-3 text-xs font-black uppercase tracking-widest" style={{ background: 'rgba(212,175,55,0.08)', color: '#D4AF37' }}>
                Distribución del presupuesto — 90 invitados
              </div>
              {RESUMEN_PRESUPUESTO.map((r, i) => (
                <div key={r.partida} className="flex items-center justify-between px-4 py-3 gap-4"
                  style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate">{r.partida}</p>
                    <p className="text-[0.65rem] mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>{r.peso} del total</p>
                  </div>
                  <span className="text-xs font-black shrink-0" style={{ color: '#D4AF37' }}>{r.rango}</span>
                </div>
              ))}
            </div>

            <p className="text-xs mt-4 leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
              💡 <strong>Truco número 1:</strong> Cambiar de sábado a viernes o domingo ahorra entre 800 y 2.000€ solo en la finca. Nadie de tus invitados lo recordará al día siguiente.
            </p>
          </section>

          <BlogInlineCTA role="dj" variant="upgrade" />

          {/* Checklist por categoría */}
          <section className="mb-10">
            <h2 className="text-lg font-black mb-6">Checklist completo: qué contratar y cuánto pagar</h2>

            <div className="space-y-6">
              {CHECKLIST.map((cat) => (
                <div key={cat.categoria} className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                  {/* Header categoría */}
                  <div className="flex items-center justify-between px-4 py-3.5"
                    style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{cat.emoji}</span>
                      <span className="font-black text-sm">{cat.categoria}</span>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full"
                      style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }}>
                      {cat.presupuesto}
                    </span>
                  </div>

                  {/* Items */}
                  {cat.items.map((item, i) => (
                    <div key={item.servicio} className="px-4 py-3 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-1"
                      style={{ borderTop: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                      <div>
                        <p className="text-xs font-bold">{item.servicio}</p>
                        <p className="text-[0.65rem] mt-0.5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{item.ahorro}</p>
                      </div>
                      <span className="text-xs font-black self-start mt-0.5 sm:text-right whitespace-nowrap" style={{ color: '#D4AF37' }}>{item.precio}</span>
                    </div>
                  ))}

                  {/* Consejo */}
                  <div className="px-4 py-3" style={{ background: 'rgba(212,175,55,0.04)', borderTop: '1px solid rgba(212,175,55,0.1)' }}>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                      <span className="font-bold" style={{ color: '#D4AF37' }}>Consejo: </span>{cat.consejo}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Las 5 palancas de ahorro */}
          <section className="mb-10">
            <h2 className="text-lg font-black mb-5">Las 5 palancas de ahorro reales</h2>
            <div className="space-y-3">
              {[
                { n: '01', t: 'Contrata directamente, sin agencia organizadora', d: 'Una wedding planner cobra entre 800 y 3.000€. Si tienes tiempo y organización, puedes coordinarlo tú usando plataformas como XPEAK donde los profesionales publican sus tarifas públicamente.' },
                { n: '02', t: 'Compara 3 presupuestos por servicio', d: 'En DJ, fotógrafo y catering — las 3 partidas grandes — pedir 3 presupuestos con el mismo briefing ahorra entre 15 y 30% de media. La diferencia de calidad entre opciones de precio similar es mínima.' },
                { n: '03', t: 'Temporada baja: noviembre a marzo', d: 'Los profesionales bajan precios un 20-35% fuera de temporada. Una boda en enero en un hotel con chimenea puede ser más especial (y más barata) que una en junio.' },
                { n: '04', t: 'DJ en lugar de banda en directo', d: 'Una banda de bodas cuesta entre 2.000 y 6.000€. Un buen DJ con equipo profesional, entre 600 y 1.400€. La diferencia en ambiente percibido por los invitados es menor de lo que crees.' },
                { n: '05', t: 'Firma contratos digitales con cada proveedor', d: 'Un contrato protege tu señal (30-50%) si el proveedor cancela. Plataformas como XPEAK incluyen contrato automático en cada contratación, sin coste adicional.' },
              ].map(item => (
                <div key={item.n} className="flex gap-4 p-4 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span className="text-2xl font-black shrink-0 leading-none" style={{ color: 'rgba(212,175,55,0.3)' }}>{item.n}</span>
                  <div>
                    <p className="text-sm font-black mb-1">{item.t}</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-10">
            <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
            <div className="space-y-3">
              {faqSchema.mainEntity.map(f => (
                <div key={f.name} className="p-5 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-sm font-bold mb-2">{f.name}</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>{f.acceptedAnswer.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Artículos relacionados */}
          <section className="mt-8">
            <h2 className="text-base font-black mb-3" style={{ color: 'rgba(255,255,255,0.85)' }}>Artículos relacionados</h2>
            <div className="space-y-2">
              {[
                { href: '/blog/cuanto-cuesta-una-boda-en-espana', cat: 'Bodas', title: 'Cuánto cuesta una boda en España 2026: desglose completo' },
                { href: '/blog/cuanto-cobra-un-dj-en-espana', cat: 'DJ', title: '¿Cuánto cobra un DJ en España? Precios 2026' },
                { href: '/blog/contratar-fotografo-de-bodas', cat: 'Foto', title: 'Contratar fotógrafo de bodas: guía y precios' },
                { href: '/blog/profesionales-bodas', cat: 'Hub Bodas', title: 'Profesionales para bodas: guía completa 2026' },
              ].map(link => (
                <a key={link.href} href={link.href}
                  className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none' }}>
                  <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0"
                    style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>{link.cat}</span>
                  <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.72)' }}>{link.title}</span>
                </a>
              ))}
            </div>
          </section>

          {/* CTA final */}
          <div className="mt-8 p-6 rounded-2xl text-center" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
            <p className="text-sm font-black mb-2">Contrata DJ, fotógrafo y catering sin comisiones</p>
            <p className="text-xs mb-4" style={{ color: '#8E8EA0' }}>XPEAK conecta con profesionales verificados en toda España. Tarifas públicas, contratos automáticos, 0€ de comisión.</p>
            <a href="/auth?mode=register&role=empresario"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              Buscar profesionales gratis →
            </a>
          </div>

          <BlogEmailCapture variant="presupuestos" intent="contratar-dj" articlePath={`/blog/${slug}`} />
        </main>

        <BlogAuthor />
        <FooterPublic />
        <BlogScrollCTA role="dj" storageKey="xpeak_scrollcta_boda_low_cost" />
      </div>
    </>
  );
}
