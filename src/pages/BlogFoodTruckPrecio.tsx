import { Helmet } from 'react-helmet-async';
import { Zap, TrendingUp, MapPin, Star } from 'lucide-react';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogAnswerBox from '@/components/BlogAnswerBox';
import BlogShare from '@/components/BlogShare';
import DJResourcesAffiliate from '@/components/DJResourcesAffiliate';
import BlogAuthor from '@/components/BlogAuthor';
import BlogTopCTA from '@/components/BlogTopCTA';

const TABLE = [
  { formato: 'Food truck básico (1 producto)', comensales: '30-60 pax', rango: '350€-600€', nota: 'Cumpleaños, eventos pequeños' },
  { formato: 'Food truck estándar (menú 2-3 opciones)', comensales: '50-100 pax', rango: '600€-1.200€', nota: 'Bodas medianas, evento de empresa' },
  { formato: 'Food truck premium (cocina en directo, chef)', comensales: '80-150 pax', rango: '1.200€-2.000€', nota: 'Bodas grandes, catering gourmet' },
  { formato: 'Varios food trucks / street food market', comensales: '150+ pax', rango: '2.000€-3.000€+', nota: 'Festivales, corporativo grande' },
];

const CITIES = [
  { ciudad: 'Madrid', rango: '350€-1.500€', note: 'Mayor oferta, food trucks tematizados y con imagen de marca' },
  { ciudad: 'Barcelona', rango: '264€-1.683€', note: 'Precio medio en bodas: 799€ (mesas dulces y food truck)' },
  { ciudad: 'Valencia', rango: '300€-1.200€', note: 'Mercado en crecimiento, buena oferta de street food mediterránea' },
  { ciudad: 'Sevilla', rango: '250€-1.000€', note: 'Precios más ajustados que en capitales grandes' },
  { ciudad: 'Bilbao / País Vasco', rango: '300€-1.300€', note: 'Fuerte cultura gastronómica, propuestas de autor' },
  { ciudad: 'Málaga / Costa del Sol', rango: '300€-1.400€', note: 'Temporada alta junio-septiembre, bodas en fincas' },
];

const FAQ = [
  { q: '¿El food truck cobra por hora o por evento?', a: 'A diferencia de otros proveedores de eventos, el food truck casi nunca se cobra por hora. Lo habitual es un precio cerrado por servicio (que incluye un número de horas ya pactado, normalmente 3-4h) o un precio por persona/menú. Pregunta siempre qué incluye antes de comparar presupuestos.' },
  { q: '¿Qué incluye el precio del food truck?', a: 'El precio base suele incluir el vehículo, el personal de cocina y el menú pactado. El desplazamiento (150€-200€ aprox.) casi siempre va aparte si el evento está a más de 30-40 km de la base del food truck. Confirma también si incluye vajilla, menaje o barra de bebidas.' },
  { q: '¿Necesito permiso municipal para un food truck en mi boda?', a: 'Si el evento es en un espacio privado (finca, jardín particular, salón), normalmente no hace falta permiso municipal específico. El food truck sí debe tener en regla su documentación sanitaria y el seguro de responsabilidad civil, algo que puedes pedir ver antes de contratar.' },
  { q: '¿Cuánto cuesta un food truck para una boda de 100 invitados?', a: 'Para 100 invitados, con un menú de 2-3 opciones, el rango habitual está entre 600€ y 1.200€, más el desplazamiento si aplica. Si el menú es más elaborado (cocina en directo, producto premium), puede subir hasta 2.000€.' },
  { q: '¿Cuánto cuesta un food truck para un evento de empresa?', a: 'Los eventos corporativos suelen tener presupuesto por persona (15€-40€/pax según el menú) más un coste fijo de montaje. Para 50-80 asistentes, el total habitual ronda entre 800€ y 1.500€.' },
  { q: '¿Es más barato un food truck que un catering tradicional?', a: 'Depende del formato. Para eventos de menos de 100 personas, el food truck suele salir más económico que un catering con servicio de sala completo. Para banquetes sentados grandes, el catering tradicional puede ajustar mejor el precio por persona.' },
  { q: '¿Puedo contratar varios food trucks para el mismo evento?', a: 'Sí, es habitual en festivales, bodas grandes o eventos corporativos con más de 150 asistentes montar un "street food market" con 2-4 food trucks de propuestas distintas (salado, dulce, bebidas). El coste conjunto suele ir desde 2.000€.' },
];

export default function BlogFoodTruckPrecio() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: '¿Cuánto cuesta un food truck para tu evento? Precios 2026',
    description: 'Guía completa de precios de food trucks para bodas y eventos en España: por formato, por persona y por ciudad. Qué incluye el precio y qué va aparte.',
    author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es/autor/daniel' },
    publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
    datePublished: '2026-09-24',
    dateModified: '2026-09-24',
    url: 'https://xpeak.es/blog/cuanto-cuesta-un-food-truck-para-evento',
    mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://xpeak.es/blog/cuanto-cuesta-un-food-truck-para-evento' },
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
      { '@type': 'ListItem', position: 3, name: '¿Cuánto cuesta un food truck para tu evento? Precios 2026', item: 'https://xpeak.es/blog/cuanto-cuesta-un-food-truck-para-evento' },
    ],
  };

  const faqStructured = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <Helmet>
        <title>¿Cuánto Cuesta un Food Truck? Precio Real 350€-2.000€ (2026) | XPEAK</title>
        <meta name="description" content="Un food truck para boda o evento cuesta entre 350€ y 2.000€ según formato y comensales (15€-70€/persona). Tabla de precios reales 2026, por formato y por ciudad." />
        <meta name="keywords" content="cuánto cuesta un food truck, precio food truck boda, food truck eventos España, food truck precio por persona, contratar food truck 2026" />
        <link rel="canonical" href="https://xpeak.es/blog/cuanto-cuesta-un-food-truck-para-evento" />
        <meta property="og:title" content="¿Cuánto Cuesta un Food Truck? Precio Real 350€-2.000€ (2026)" />
        <meta property="og:description" content="Un food truck para boda o evento cuesta entre 350€ y 2.000€. Tabla de precios reales 2026, por formato y por ciudad." />
        <meta property="og:url" content="https://xpeak.es/blog/cuanto-cuesta-un-food-truck-para-evento" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="¿Cuánto Cuesta un Food Truck? Precio Real 350€-2.000€ (2026)" />
        <meta name="twitter:description" content="Un food truck para boda o evento cuesta entre 350€ y 2.000€. Tabla de precios reales 2026, por formato y por ciudad." />
        <meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>

      <div className="min-h-screen" style={{ background: '#ffffff', color: '#111' }}>

        {/* Nav */}
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-3xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#D4AF37' }}>XPEAK</a>
          <a href="/auth"
            className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105"
            style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
            Unirse
          </a>
        </nav>

        <a href="/blog" className="block px-4 sm:px-6 pb-2 max-w-3xl mx-auto text-xs" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>
        <article className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-20 sm:pb-24">
          <BlogTopCTA href="/contratar-catering" label="Ver proveedores →" articlePath="/blog/cuanto-cuesta-un-food-truck-para-evento" />

          {/* Breadcrumb */}
          <p className="text-xs mb-6 font-bold" style={{ color: '#666' }}>
            <a href="/" className="hover:text-[#8A6D0F] transition-colors">XPEAK</a>
            {' '}›{' '}
            <a href="/contratar-catering" className="hover:text-[#8A6D0F] transition-colors">Contratar catering</a>
            {' '}›{' '}
            <span>Food truck: precios 2026</span>
          </p>

          {/* Cabecera */}
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={14} style={{ color: '#D4AF37' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#D4AF37' }}>Blog · Guía de precios</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-4 leading-tight">
            ¿Cuánto cuesta un food truck para tu evento? Precios 2026
          </h1>
          <p className="text-sm mb-8" style={{ color: '#555' }}>
            XPEAK · 24 de septiembre de 2026 · 6 min de lectura
          </p>

          {/* Intro */}
          <p className="text-base leading-relaxed mb-6" style={{ color: '#222' }}>
            Cada vez más bodas, eventos de empresa y fiestas privadas cambian el banquete clásico por un food truck, pero la pregunta de siempre sigue sin respuesta clara en la mayoría de webs: <strong style={{ color: '#111' }}>¿cuánto cuesta realmente?</strong> A diferencia de otros proveedores, el food truck no suele cobrarse por hora, sino por servicio cerrado o por persona, y el rango va de 350€ para un evento pequeño hasta más de 2.000€ para menús elaborados. Esta guía desglosa esos números a partir de tarifas reales del sector.
          </p>

          <BlogAnswerBox
            question="¿Cuánto cuesta un food truck en España en 2026?"
            answer="Un food truck para boda o evento cuesta entre 350€ y 2.000€ por servicio, o entre 15€ y 70€ por persona según el menú. El precio depende del número de comensales, el tipo de comida (básico o cocina en directo) y si hay que sumar desplazamiento. Para festivales o eventos grandes con varios food trucks, el presupuesto conjunto empieza en 2.000€."
          />

          {/* Tabla por formato */}
          <h2 className="text-xl font-black mb-4">Precio de un food truck por formato</h2>
          <p className="text-base mb-5 leading-relaxed" style={{ color: '#222' }}>
            El factor que más influye en el precio es el tipo de menú y el número de comensales. Esta tabla resume los rangos habituales del mercado español en 2026:
          </p>
          <div className="overflow-x-auto mb-10 rounded-xl" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
            <table className="w-full text-xs min-w-[560px]">
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.04)' }}>
                  {['Formato', 'Comensales', 'Precio', 'Típico en'].map(h => (
                    <th key={h} className="px-2 sm:px-4 py-3 text-left font-bold uppercase tracking-wider whitespace-nowrap"
                      style={{ color: '#333', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TABLE.map((row, i) => (
                  <tr key={row.formato} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)' }}>
                    <td className="px-2 sm:px-4 py-3 font-bold" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>{row.formato}</td>
                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap" style={{ color: '#444', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>{row.comensales}</td>
                    <td className="px-2 sm:px-4 py-3 font-black whitespace-nowrap" style={{ color: '#D4AF37', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>{row.rango}</td>
                    <td className="px-2 sm:px-4 py-3" style={{ color: '#333', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>{row.nota}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <BlogEmailCapture variant="presupuestos" intent="general" articlePath="/blog/cuanto-cuesta-un-food-truck-para-evento" />

          {/* Por ciudad */}
          <h2 className="text-xl font-black mb-4">Precio de un food truck por ciudad</h2>
          <p className="text-base mb-5 leading-relaxed" style={{ color: '#222' }}>
            La oferta y la demanda también varían según la ciudad. Las capitales con más bodas y eventos de empresa suelen tener más variedad de propuestas, pero también precios más altos en los formatos premium.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
            {CITIES.map(c => (
              <div key={c.ciudad} className="p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.07)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <MapPin size={12} style={{ color: '#D4AF37' }} />
                  <span className="text-sm font-black">{c.ciudad}</span>
                  <span className="ml-auto text-sm font-bold" style={{ color: '#D4AF37' }}>{c.rango}</span>
                </div>
                <p className="text-xs" style={{ color: '#333' }}>{c.note}</p>
              </div>
            ))}
          </div>

          <DJResourcesAffiliate role="catering" />

          {/* Lo que no te dicen */}
          <h2 className="text-xl font-black mb-4">Lo que no te dicen en otros artículos</h2>
          <p className="text-base mb-4 leading-relaxed" style={{ color: '#222' }}>
            El precio que ves anunciado en una web casi nunca es el precio final. Antes de comparar presupuestos, ten en cuenta:
          </p>
          <ul className="space-y-3 mb-8">
            {[
              { label: 'Desplazamiento aparte', text: 'Si el evento está a más de 30-40 km de la base del food truck, se suele sumar entre 150€ y 200€ de desplazamiento. Pregunta siempre si el presupuesto ya lo incluye.' },
              { label: 'Precio por persona vs precio cerrado', text: 'Algunos food trucks cobran un precio fijo por el servicio (independiente de cuánta gente coma), otros cobran por persona o por ticket consumido. Compara presupuestos con el mismo criterio o no serán comparables.' },
              { label: 'Documentación en regla', text: 'Cualquier food truck que opere en un evento debe tener seguro de responsabilidad civil y carné/registro sanitario. Pídelo antes de firmar, sobre todo si el evento es en vía pública y requiere permiso municipal.' },
            ].map(item => (
              <li key={item.label} className="flex gap-3">
                <Star size={13} className="flex-shrink-0 mt-0.5" style={{ color: '#D4AF37' }} />
                <div>
                  <span className="text-xs font-bold">{item.label}: </span>
                  <span className="text-xs" style={{ color: '#222' }}>{item.text}</span>
                </div>
              </li>
            ))}
          </ul>

          {/* Cómo ahorrar */}
          <h2 className="text-xl font-black mb-4">¿Cómo conseguir el mejor precio?</h2>
          <p className="text-base mb-4 leading-relaxed" style={{ color: '#222' }}>
            Tres consejos prácticos para organizadores:
          </p>
          <ol className="space-y-3 mb-10">
            {[
              { n: '01', text: 'Pide siempre el precio "todo incluido": desplazamiento, personal, menaje y horas de servicio. Comparar solo el precio base lleva a sorpresas el día del evento.' },
              { n: '02', text: 'Si el evento es grande (150+ invitados), valora contratar 2-3 food trucks distintos en vez de uno solo: reduce colas y suele salir mejor de precio por persona que un único proveedor sobrecargado.' },
              { n: '03', text: 'Contrata con al menos 2-3 meses de antelación en temporada alta (mayo-septiembre). Los mejores food trucks de cada ciudad se reservan con mucha anticipación para bodas de fin de semana.' },
            ].map(item => (
              <li key={item.n} className="flex gap-3">
                <span className="text-2xl font-black flex-shrink-0" style={{ color: 'rgba(212,175,55,0.2)', lineHeight: '1.1' }}>{item.n}</span>
                <p className="text-base leading-relaxed pt-0.5" style={{ color: '#333' }}>{item.text}</p>
              </li>
            ))}
          </ol>

          {/* FAQs */}
          <h2 className="text-xl font-black mb-5">Preguntas frecuentes sobre precios de food trucks</h2>
          <div className="space-y-4 mb-12">
            {FAQ.map(faq => (
              <div key={faq.q} className="p-5 rounded-xl" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.07)' }}>
                <p className="text-sm font-bold mb-2">{faq.q}</p>
                <p className="text-base leading-relaxed" style={{ color: '#444' }}>{faq.a}</p>
              </div>
            ))}
          </div>

          {/* CTA dual — Food truck + Organizador */}
          <div className="rounded-2xl overflow-hidden mb-2" style={{ border: '1px solid rgba(212,175,55,0.2)' }}>
            {/* CTA Food truck */}
            <div className="p-8" style={{ background: 'linear-gradient(135deg,#0e0e14 0%,#181410 100%)', color: '#fff', borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[0.65rem] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(212,175,55,0.12)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.25)' }}>
                  ¿Tienes un food truck?
                </span>
              </div>
              <h2 className="text-xl font-black mb-2 leading-snug">
                Publica tu perfil y empieza a recibir solicitudes
              </h2>
              <p className="text-base mb-5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Da de alta tu food truck en XPEAK dentro de la categoría Catering. Perfil con precio público, zona de trabajo y contacto directo con quien organiza el evento, sin intermediarios.
              </p>
              <div className="flex flex-wrap gap-3 mb-5">
                {['Tarifas públicas', 'Sin comisión por contacto', 'Contratos automáticos'].map(f => (
                  <span key={f} className="flex items-center gap-1.5 text-xs font-bold"
                    style={{ color: 'rgba(212,175,55,0.8)' }}>
                    <Star size={10} style={{ color: '#D4AF37' }} /> {f}
                  </span>
                ))}
              </div>
              <a href="/auth?mode=register&role=catering"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-black text-sm transition-all hover:scale-105 hover:shadow-lg"
                style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                <Zap size={15} /> Crear mi perfil
              </a>
            </div>

            {/* CTA Organizador */}
            <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
              style={{ background: 'rgba(0,0,0,0.02)' }}>
              <div>
                <p className="text-sm font-black mb-0.5">¿Buscas food truck para tu evento?</p>
                <p className="text-xs" style={{ color: '#333' }}>
                  Directorio con tarifas públicas · Contacto directo sin intermediarios
                </p>
              </div>
              <a href="/contratar-catering"
                className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs transition-all hover:scale-105"
                style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.25)', whiteSpace: 'nowrap' }}>
                Ver food trucks disponibles →
              </a>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-lg font-black mb-5" style={{ color: '#111' }}>Artículos relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { href: '/blog/catering-para-eventos-de-empresa', tag: 'Catering', title: 'Catering para eventos de empresa 2026', desc: 'Formatos, precios por persona y cómo elegir el servicio correcto.' },
                { href: '/blog/cuanto-cuesta-una-boda-en-espana', tag: 'Bodas', title: '¿Cuánto cuesta una boda en España en 2026?', desc: 'Presupuesto completo por partida: catering, música, fotos y más.' },
                { href: '/blog/cuanto-cobra-un-dj-en-espana', tag: 'Música', title: '¿Cuánto cobra un DJ en España? Precios 2026', desc: 'Tarifas reales por tipo de evento, duración y ciudad.' },
              ].map(p => (
                <a key={p.href} href={p.href}
                  className="block p-5 rounded-2xl transition-all hover:scale-[1.02]"
                  style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)' }}>
                  <span className="inline-block text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded mb-2"
                    style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.18)' }}>{p.tag}</span>
                  <p className="text-sm font-black leading-snug mb-1">{p.title}</p>
                  <p className="text-base leading-relaxed" style={{ color: '#333' }}>{p.desc}</p>
                </a>
              ))}
            </div>
          </div>
          <BlogAuthor />
          <BlogShare />
          <DJResourcesAffiliate role="catering" />
        </article>
        <BlogRelatedPosts currentSlug='/blog/cuanto-cuesta-un-food-truck-para-evento' tag='Catering' />
        <FooterPublic />
      </div>
    </>
  );
}
