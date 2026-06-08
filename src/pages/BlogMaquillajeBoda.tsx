import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogShare from '@/components/BlogShare';

const article = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Maquillaje nupcial: precios y cómo elegir tu maquilladora en España (2026)',
  description: 'Guía de precios de maquillaje para novias en España. Cuánto cuesta, qué incluye el servicio y cómo elegir la maquilladora perfecta.',
  datePublished: '2026-05-03',
  dateModified: '2026-05-25',
  author: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
  publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } },
  image: 'https://xpeak.es/og-image.jpg',
  url: 'https://xpeak.es/blog/maquillaje-nupcial-precio-guia',
};

const faqStructured = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: '¿Cuánto cuesta el maquillaje de novia en España?', acceptedAnswer: { '@type': 'Answer', text: 'El precio medio para la novia es de 200-350€, incluyendo prueba y día del evento. En grandes ciudades como Madrid o Barcelona puede superar los 400€ con maquilladores de alta demanda.' } },
    { '@type': 'Question', name: '¿Qué incluye el servicio de maquillaje nupcial?', acceptedAnswer: { '@type': 'Answer', text: 'Normalmente incluye una prueba previa (1-2 semanas antes), el maquillaje del día de la boda y en muchos casos el peinado o al menos una recomendación de estilista. Algunas maquilladoras incluyen kit de retoques.' } },
    { '@type': 'Question', name: '¿Cuándo reservar la maquilladora de boda?', acceptedAnswer: { '@type': 'Answer', text: 'Idealmente con 6-12 meses de antelación, especialmente para fechas de primavera y otoño (temporada alta). Las maquilladoras más solicitadas pueden tener agenda llena hasta 1 año vista.' } },
    { '@type': 'Question', name: '¿Hay descuento si contratan maquillaje para damas de honor?', acceptedAnswer: { '@type': 'Answer', text: 'Sí. La mayoría de maquilladoras ofrecen un pack grupal. El precio por persona baja cuando se contratan 3 o más personas, normalmente entre 80-120€/persona para damas de honor.' } },
  ],
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'Maquillaje nupcial precios', item: 'https://xpeak.es/blog/maquillaje-nupcial-precio-guia' },
  ],
};

const PRECIOS_SERVICIO = [
  { servicio: 'Prueba de maquillaje', min: 80, max: 150, nota: 'Se descuenta del precio final en muchos casos' },
  { servicio: 'Maquillaje novia (día)', min: 150, max: 350, nota: 'Incluye prueba o sin prueba según paquete' },
  { servicio: 'Pack novia completo (prueba + día)', min: 250, max: 500, nota: 'El más contratado' },
  { servicio: 'Damas de honor', min: 70, max: 120, nota: 'Por persona, precio en grupo' },
  { servicio: 'Madres de los novios', min: 80, max: 130, nota: 'Por persona' },
  { servicio: 'Maquillaje + peinado novia', min: 350, max: 650, nota: 'Servicio combinado con estilista' },
  { servicio: 'Desplazamiento', min: 0, max: 80, nota: 'Varía según distancia al venue' },
];

const PRECIOS_CIUDAD = [
  { ciudad: 'Madrid', min: 220, max: 500 },
  { ciudad: 'Barcelona', min: 200, max: 480 },
  { ciudad: 'Valencia', min: 160, max: 320 },
  { ciudad: 'Sevilla', min: 150, max: 300 },
  { ciudad: 'Málaga', min: 140, max: 280 },
  { ciudad: 'Bilbao', min: 170, max: 340 },
  { ciudad: 'Zaragoza', min: 140, max: 270 },
  { ciudad: 'Ibiza', min: 220, max: 450 },
];

const CHECKLIST = [
  { titulo: 'Prueba obligatoria', desc: 'Nunca contrates sin hacer prueba previa. La prueba no es solo ver el resultado, es testear si el maquillaje dura 10-12 horas.' },
  { titulo: 'Portfolio real', desc: 'Pide fotos de bodas anteriores, no solo sesiones de estudio. La iluminación, sudor y emoción del día son diferentes.' },
  { titulo: 'Formación en maquillaje nupcial', desc: 'Busca maquilladoras con formación específica en novias, no solo maquillaje artístico o de editorial.' },
  { titulo: 'Productos profesionales', desc: 'Pregunta qué marcas usa. Makeup Forever, MAC Pro, Charlotte Tilbury o Armani Beauty son referencias. Evita quien use droguería.' },
  { titulo: 'Contrato y señal', desc: 'Exige contrato con fecha, hora, servicios incluidos y política de cancelación. La señal habitual es 20-30% del total.' },
  { titulo: 'Timing del día', desc: 'Calcula cuánto tiempo necesita. Una novia con damas de honor necesita un plan horario riguroso para no llegar tarde a la ceremonia.' },
];

export default function BlogMaquillajeBoda() {
  return (
    <>
      <Helmet>
        <title>Maquillaje nupcial: precios y cómo elegir 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cuesta el maquillaje de novia en España, qué incluye y cómo elegir bien tu maquilladora. Precios por ciudad y tipo de servicio." />
        <link rel="canonical" href="https://xpeak.es/blog/maquillaje-nupcial-precio-guia" />
        <meta property="og:title" content="Maquillaje nupcial: precios 2026 — XPEAK Blog" />
        <meta property="og:description" content="Cuánto cuesta el maquillaje de novia en España, qué incluye y cómo elegir bien tu maquilladora. Precios por ciudad y tipo de servicio." />
        <meta property="og:url" content="https://xpeak.es/blog/maquillaje-nupcial-precio-guia" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Maquillaje nupcial: precios 2026 — XPEAK Blog" />
        <meta name="twitter:description" content="Cuánto cuesta el maquillaje de novia en España y cómo elegir bien tu maquilladora." />
        <meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>

      <div className="min-h-screen" style={{ background: '#090909', color: '#fff' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-3xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#D4AF37' }}>XPEAK</a>
          <div className="flex items-center gap-3">
            <a href="/blog" className="text-xs font-bold hidden sm:block" style={{ color: '#8E8EA0' }}>Blog</a>
            <a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              Unirse gratis
            </a>
          </div>
        </nav>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#8E8EA0' }}>
            ← Todos los artículos
          </a>

          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>Maquillaje · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">
              Maquillaje nupcial: precios y cómo elegir tu maquilladora en España (2026)
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: '#8E8EA0' }}>
              El maquillaje de boda es uno de los detalles más recordados en las fotos. Guía completa de precios, qué incluye y cómo no equivocarte en la elección.
            </p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>3 mayo 2026</time>
          </div>

          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Precios de maquillaje nupcial por tipo de servicio</h2>
              <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <table className="w-full text-xs">
                  <thead>
                    <tr style={{ background: 'rgba(212,175,55,0.08)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <th className="text-left px-4 py-3 font-bold">Servicio</th>
                      <th className="px-4 py-3 font-bold text-right">Desde</th>
                      <th className="px-4 py-3 font-bold text-right">Hasta</th>
                      <th className="px-4 py-3 font-bold text-left hidden sm:table-cell">Nota</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PRECIOS_SERVICIO.map((row, i) => (
                      <tr key={row.servicio} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td className="px-4 py-3 font-medium">{row.servicio}</td>
                        <td className="px-4 py-3 text-right" style={{ color: '#D4AF37' }}>{row.min}€</td>
                        <td className="px-4 py-3 text-right" style={{ color: '#D4AF37' }}>{row.max}€</td>
                        <td className="px-4 py-3 hidden sm:table-cell" style={{ color: '#8E8EA0' }}>{row.nota}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs mt-3" style={{ color: '#8E8EA0' }}>Precios medios en España 2026. Sin IVA. El desplazamiento se cobra aparte según distancia al venue.</p>
            </section>

            <BlogInlineCTA role="makeup" />

            <section>
              <h2 className="text-lg font-black mb-4">Precio del maquillaje de novia por ciudad</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PRECIOS_CIUDAD.map(c => (
                  <div key={c.ciudad} className="p-4 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-xs font-bold mb-2">{c.ciudad}</p>
                    <p className="text-base font-black" style={{ color: '#D4AF37' }}>{c.min}–{c.max}€</p>
                    <p className="text-[0.6rem] mt-1" style={{ color: '#8E8EA0' }}>pack completo</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-black mb-2">¿Qué determina el precio de una maquilladora de novias?</h2>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.75)' }}>
                La experiencia es el factor principal. Una maquilladora con 5+ años especializados en bodas y un portfolio sólido cobrará el doble que alguien que hace bodas como trabajo secundario. Otros factores:
              </p>
              <ul className="space-y-2 text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
                <li className="flex items-start gap-2"><span style={{ color: '#D4AF37' }}>→</span><span><strong>Ciudad:</strong> Madrid y Barcelona son las más caras; ciudades medianas como Zaragoza o Valladolid son más asequibles.</span></li>
                <li className="flex items-start gap-2"><span style={{ color: '#D4AF37' }}>→</span><span><strong>Temporada:</strong> Primavera (abril-junio) y otoño (septiembre-octubre) son las más demandadas. Precios suben un 10-15% en estas fechas.</span></li>
                <li className="flex items-start gap-2"><span style={{ color: '#D4AF37' }}>→</span><span><strong>Número de personas:</strong> Más personas = precio por persona más bajo, pero la maquilladora puede necesitar asistentes.</span></li>
                <li className="flex items-start gap-2"><span style={{ color: '#D4AF37' }}>→</span><span><strong>Airbrush vs. convencional:</strong> El maquillaje aerógrafo (airbrush) tiene mayor duración y cobertura, y normalmente cuesta 50-100€ más.</span></li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">6 cosas que debes comprobar antes de contratar</h2>
              <div className="space-y-3">
                {CHECKLIST.map((item, i) => (
                  <div key={item.titulo} className="flex gap-3 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span className="text-xs font-black mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37' }}>{i + 1}</span>
                    <div>
                      <p className="text-xs font-bold mb-1">{item.titulo}</p>
                      <p className="text-xs leading-relaxed" style={{ color: '#8E8EA0' }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">
                {faqStructured.mainEntity.map(f => (
                  <div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-sm font-bold mb-2">{f.name}</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>{f.acceptedAnswer.text}</p>
                  </div>
                ))}
              </div>
            </section>

            
            <section className="mt-8">
              <h2 className="text-base font-black mb-3" style={{ color: 'rgba(255,255,255,0.85)' }}>Artículos relacionados</h2>
              <div className="space-y-2">
                {[
                  { href: '/blog/profesionales-bodas', cat: 'Hub Bodas', title: 'Profesionales para bodas: guía completa 2026' },
                  { href: '/blog/maquilladora-para-eventos-precio', cat: 'Maquillaje', title: 'Maquilladora para eventos: precios 2026' },
                  { href: '/blog/contratar-fotografo-de-bodas', cat: 'Bodas', title: 'Contratar fotógrafo de bodas: guía y precios' },
                  { href: '/blog/cuanto-cuesta-una-boda-en-espana', cat: 'Bodas', title: 'Cuánto cuesta una boda en España 2026' },
                  { href: '/blog/personal-de-imagen-ferias-y-congresos', cat: 'Imagen', title: 'Personal de imagen para ferias y congresos' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.72)' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>
            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Buscas maquilladora verificada para tu evento?</p>
              <p className="text-xs mb-4" style={{ color: '#8E8EA0' }}>En XPEAK puedes contratar maquilladoras profesionales con portfolio verificado. Gratis para empresarios y organizadores.</p>
              <a href="/auth" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105"
                style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                Ver maquilladoras en XPEAK →
              </a>
            </div>
          </div>
                  <BlogEmailCapture variant="presupuestos" intent="contratar-staff" articlePath="/blog/maquillaje-nupcial-precio-guia" />
</main>
      <FooterPublic />
      </div>
    </>
  );
}
