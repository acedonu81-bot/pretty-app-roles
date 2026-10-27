import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogAnswerBox from '@/components/BlogAnswerBox';
import BlogAuthor from '@/components/BlogAuthor';
import BlogShare from '@/components/BlogShare';

const URL_POST = 'https://xpeak.es/blog/precio-catering-ibiza';
const TITLE = 'Catering en Ibiza: cuánto cuesta por persona (2026)';
const ANSWER = 'Los precios por persona que hemos podido verificar para una boda en Ibiza van de 120 € (cóctel con estaciones de comida en un hotel, IVA incluido) a entre 180 € y 250 € (menú de boda con chef, camareras y cocina móvil). Para comparar, la media nacional de un banquete de boda es de 225 € por persona.';

const FUENTES = [
  { nombre: 'The Chef Ibiza (ficha en Bodas.net)', href: 'https://www.bodas.net/catering/the-chef-ibiza--e85603', tipo: 'Catering con cocina móvil', precio: 'De 180 € a 250 € por invitado', incluye: 'Comida, servicio de chef, camareras y cocina profesional móvil', nota: 'La ficha no indica si lleva IVA.' },
  { nombre: 'OD Hotels, menú «Ibiza»', href: 'https://www.od-hotels.com/content/uploads/2025/05/odt_comercial_bodas_es.pdf', tipo: 'Hotel, cóctel con estaciones', precio: '120 € por persona', incluye: 'Bebidas de bienvenida, cóctel de 10 aperitivos, 2 estaciones de comida y bodega de vinos, agua, refrescos, cerveza y cava', nota: 'Hasta 150 personas. IVA incluido. Documento de mayo de 2025.' },
  { nombre: 'OD Hotels, menú «Talamanca»', href: 'https://www.od-hotels.com/content/uploads/2025/05/odt_comercial_bodas_es.pdf', tipo: 'Hotel, cóctel y menú tradicional', precio: '150 € por persona', incluye: 'Bebidas de bienvenida, cóctel de 6 aperitivos, 1 entrante, 2 platos principales, 1 postre y bodega', nota: 'Hasta 60 personas. IVA incluido. Documento de mayo de 2025.' },
  { nombre: 'OD Hotels, menú infantil', href: 'https://www.od-hotels.com/content/uploads/2025/05/odt_comercial_bodas_es.pdf', tipo: 'Hotel, menú infantil', precio: '50 € por niño', incluye: 'Menú infantil personalizable', nota: 'IVA incluido. Documento de mayo de 2025.' },
  { nombre: 'OD Hotels, barra libre', href: 'https://www.od-hotels.com/content/uploads/2025/05/odt_comercial_bodas_es.pdf', tipo: 'Hotel, barra libre 3 horas', precio: '80 € o 95 € por persona', incluye: 'Agua, refrescos, cerveza y combinados, con destilados distintos según la opción', nota: 'IVA incluido. Documento de mayo de 2025.' },
  { nombre: 'Bodas.net, informe del sector', href: 'https://www.bodas.net/articulos/cuanto-cuesta-banquete-boda--c8700', tipo: 'Media nacional, banquete de boda', precio: '225 € por persona', incluye: 'Banquete completo; suele incluir el cóctel de bienvenida', nota: 'Dato de España, no de Ibiza. Informe del Sector Nupcial 2026.' },
];

const PREGUNTAS_PRESUPUESTO = [
  'Si el precio por persona lleva IVA o hay que sumarlo.',
  'Quién pone el personal de sala y cuántos camareros van por invitado.',
  'Si las bebidas (vino, cerveza, cava, barra libre) están dentro o se pagan aparte.',
  'Si el menaje, las mesas y la cocina móvil están incluidos o se alquilan por separado.',
  'Qué pasa si el número final de invitados baja o sube, y hasta qué fecha se puede cambiar.',
  'Si hay un mínimo de invitados o un mínimo de gasto.',
  'Cuánto hay que pagar para reservar la fecha y cuándo se paga el resto.',
  'Si el desplazamiento hasta la villa o la finca se cobra aparte.',
];

const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cuesta un catering de boda en Ibiza por persona?', acceptedAnswer: { '@type': 'Answer', text: 'Con los precios publicados que hemos podido verificar, desde 120 € por persona (cóctel con estaciones de comida en un hotel, IVA incluido, hasta 150 personas) hasta entre 180 € y 250 € por invitado (menú de boda con chef, camareras y cocina móvil). El precio final depende del formato, el número de invitados y las bebidas.' } },
  { '@type': 'Question', name: '¿Cuánto cuesta el catering para una fiesta en una villa de Ibiza?', acceptedAnswer: { '@type': 'Answer', text: 'No hemos encontrado precios por persona publicados para fiestas en villa. Las empresas de catering de la isla suelen dar el precio bajo presupuesto, según menú, personal y desplazamiento. Lo más fiable es pedir presupuesto a varias empresas con las mismas condiciones.' } },
  { '@type': 'Question', name: '¿Qué incluye el precio por persona de un catering de boda?', acceptedAnswer: { '@type': 'Answer', text: 'Depende de la empresa. En el menú de boda con cocina móvil que hemos verificado incluye comida, servicio de chef, camareras y cocina profesional. En los menús de hotel incluye los aperitivos, el menú y una bodega básica. Las bebidas de barra libre suelen ser un extra.' } },
  { '@type': 'Question', name: '¿Cuánto cuesta la barra libre en una boda en Ibiza?', acceptedAnswer: { '@type': 'Answer', text: 'En el documento de bodas de OD Hotels de mayo de 2025, la barra libre de 3 horas cuesta 80 € o 95 € por persona según la opción, con IVA incluido. Es una referencia de un solo establecimiento, no una tarifa de toda la isla.' } },
  { '@type': 'Question', name: '¿Es más caro el catering en Ibiza que en el resto de España?', acceptedAnswer: { '@type': 'Answer', text: 'Con los datos que hemos podido verificar no se puede afirmar. La media nacional de un banquete de boda es de 225 € por persona según el informe del sector de Bodas.net, y los precios de Ibiza que hemos encontrado van de 120 € a 250 € según el formato. No son cifras comparables uno a uno.' } },
] };
const article = { '@context': 'https://schema.org', '@type': 'Article', headline: TITLE, description: 'Precios publicados de catering de boda en Ibiza por persona, con fuente y fecha, qué incluyen y qué preguntar antes de pedir presupuesto.', datePublished: '2026-10-27', dateModified: '2026-10-27', author: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' }, mainEntityOfPage: URL_POST, image: 'https://xpeak.es/og-image.jpg' };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: TITLE, item: URL_POST }] };

export default function BlogCateringIbizaPrecio() {
  return (
    <>
      <Helmet>
        <title>Catering en Ibiza: cuánto cuesta por persona (2026) | XPEAK</title>
        <meta name="description" content="Precios publicados de catering de boda en Ibiza, de 120 € a 250 € por persona según formato, con fuente y fecha. Qué incluye y qué preguntar antes de pedir presupuesto." />
        <link rel="canonical" href={URL_POST} />
        <meta property="og:title" content="Catering en Ibiza: precio por persona 2026 | XPEAK Blog" />
        <meta property="og:description" content="Precios de catering de boda en Ibiza por persona, con la fuente de cada cifra." />
        <meta property="og:url" content={URL_POST} />
        <meta property="og:type" content="article" /><meta property="og:image" content="https://xpeak.es/og-image.jpg" /><meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" /><meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>
      <div className="min-h-screen" style={{ background: '#ffffff', color: '#111' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-5xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#2563EB' }}>XPEAK</a>
          <div className="flex items-center gap-3"><a href="/blog" className="text-xs font-bold" style={{ color: '#3d3d4e' }}>Blog</a></div>
        </nav>
        <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#2563EB' }}>Catering · Ibiza · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">{TITLE}</h1>
            <p className="text-base leading-relaxed" style={{ color: '#3d3d4e' }}>En Ibiza casi nadie publica el precio del catering: casi todo es «pide presupuesto». Aquí tienes los precios por persona que sí están publicados, cada uno con su fuente, su fecha y lo que incluye, para que puedas comparar con lo que te ofrezcan.</p>
            <time className="text-xs mt-3 block" style={{ color: '#666' }}>27 octubre 2026</time>
            <BlogAnswerBox question="¿Cuánto cuesta un catering de boda en Ibiza por persona?" answer={ANSWER} />
          </div>
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Precios publicados, con su fuente</h2>
              <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                <table className="w-full text-xs">
                  <thead><tr style={{ background: 'rgba(37,99,235,0.08)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}><th className="text-left px-4 py-3 font-bold">Fuente</th><th className="text-left px-4 py-3 font-bold">Formato</th><th className="text-left px-4 py-3 font-bold">Precio</th><th className="text-left px-4 py-3 font-bold">Qué incluye</th></tr></thead>
                  <tbody>{FUENTES.map((f, i) => (
                    <tr key={f.nombre + f.precio} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                      <td className="px-4 py-3 font-medium align-top"><a href={f.href} target="_blank" rel="noopener noreferrer nofollow" style={{ color: '#2563EB' }}>{f.nombre}</a></td>
                      <td className="px-4 py-3 align-top">{f.tipo}</td>
                      <td className="px-4 py-3 font-bold align-top whitespace-nowrap">{f.precio}</td>
                      <td className="px-4 py-3 align-top">{f.incluye}. <span style={{ color: '#666' }}>{f.nota}</span></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Precios publicados por cada empresa en su ficha o documento comercial, revisados el 27 de octubre de 2026. Son precios de partida: el presupuesto final depende del menú, el número de invitados y la fecha.</p>
            </section>
            <section>
              <h2 className="text-lg font-black mb-3">Por qué no se pueden comparar uno a uno</h2>
              <p className="text-sm leading-relaxed mb-3" style={{ color: '#3d3d4e' }}>Los 120 € y los 180 € de la tabla no son lo mismo. El menú de hotel incluye el espacio y el servicio del propio hotel, y se limita a un número de invitados. El catering con cocina móvil se monta donde tú elijas, con chef y camareras, y por eso el precio parte más arriba. Antes de decidir por el número más bajo, mira qué está dentro de cada precio.</p>
              <p className="text-sm leading-relaxed" style={{ color: '#3d3d4e' }}>La media nacional de 225 € por persona para un banquete de boda sirve de referencia, pero es un dato de toda España. No te dice si en Ibiza es más barato o más caro.</p>
            </section>
            <section>
              <h2 className="text-lg font-black mb-3">Catering para una fiesta o una villa</h2>
              <p className="text-sm leading-relaxed" style={{ color: '#3d3d4e' }}>Para fiestas privadas, cumpleaños o eventos en villa no hemos encontrado precios por persona publicados. Las empresas que trabajan en la isla dan el precio bajo presupuesto, porque cambia mucho según el menú, el personal y el desplazamiento hasta la casa. Lo más útil es pedir presupuesto a dos o tres empresas con las mismas condiciones: mismo número de invitados, mismo formato y mismas horas.</p>
            </section>
            <section>
              <h2 className="text-lg font-black mb-3">Qué preguntar antes de pedir presupuesto</h2>
              <div className="space-y-2">{PREGUNTAS_PRESUPUESTO.map(p => (<div key={p} className="p-3 rounded-xl text-xs" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', color: '#222' }}>{p}</div>))}</div>
            </section>
            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">{faqStructured.mainEntity.map(f => (<div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}><h3 className="text-sm font-bold mb-2">{f.name}</h3><p className="text-xs leading-relaxed" style={{ color: '#3d3d4e' }}>{f.acceptedAnswer.text}</p></div>))}</div>
            </section>
            <section className="mt-8">
              <h2 className="text-base font-black mb-3" style={{ color: '#111' }}>Artículos relacionados</h2>
              <div className="space-y-2">
                {[
                  { href: '/blog/catering-boda-precio-por-persona', cat: 'Catering', title: 'Catering boda: precio por persona en España (2026)' },
                  { href: '/blog/cuanto-cuesta-un-food-truck-para-evento', cat: 'Food truck', title: 'Cuánto cuesta un food truck para un evento' },
                  { href: '/blog/comparar-presupuestos-proveedores-eventos', cat: 'Eventos', title: 'Cómo comparar presupuestos de proveedores de eventos (2026)' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.75rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(37,99,235,0.1)', color: '#2563EB', border: '1px solid rgba(37,99,235,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: '#222' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>
            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(37,99,235,0.04)', border: '1px solid rgba(37,99,235,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Buscas catering para tu evento?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>Pide presupuesto a empresas de catering desde XPEAK y compara propuestas con las mismas condiciones.</p>
              <a href="/contratar-catering" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#2563EB,#B8941E)', color: '#000' }}>Ver empresas de catering</a>
            </div>
          </div>
          <BlogEmailCapture variant="presupuestos" intent="contratar-staff" articlePath="/blog/precio-catering-ibiza" />
        </main>
        <BlogAuthor />
        <BlogShare />
        <BlogRelatedPosts currentSlug="/blog/precio-catering-ibiza" tag="Catering" />
        <FooterPublic />
        <BlogScrollCTA role="general" storageKey="xpeak_scrollcta_catering_ibiza" articlePath="/blog/precio-catering-ibiza" />
      </div>
    </>
  );
}
