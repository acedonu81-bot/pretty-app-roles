import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';

const article = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Cuánto cuesta un photo booth para boda o evento en España 2026',
  description: 'Precios reales de photo booth para bodas y eventos en España 2026. Tipos, qué incluye cada modalidad y cómo elegir el correcto para tu celebración.',
  datePublished: '2026-06-01',
  dateModified: '2026-06-01',
  author: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
  publisher: {
    '@type': 'Organization',
    name: 'XPEAK',
    url: 'https://xpeak.es',
    logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' },
  },
  image: 'https://xpeak.es/og-image.jpg',
  url: 'https://xpeak.es/blog/photobooth-precio-boda-evento',
};

const faqStructured = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Cuánto cuesta un photo booth para una boda en España?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'El precio de un photo booth para boda en España varía según el tipo: el básico sin impresión (3 horas, entrega digital) cuesta entre 300 y 450€. Con impresión instantánea el rango sube a 450–700€. El photo booth 360° o selfie cabina premium puede costar entre 600 y 900€. Los precios en Madrid y Barcelona suelen ser un 15–25% más caros que en otras ciudades.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Cuántas horas dura un servicio de photo booth?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'El servicio estándar es de 3 horas de funcionamiento activo, que normalmente se sitúan durante el cóctel y las primeras horas de pista de baile. Muchos proveedores ofrecen paquetes de 4 o 5 horas con un coste adicional de 80–150€ por hora extra. Más de 5 horas en un mismo evento es infrecuente.',
      },
    },
    {
      '@type': 'Question',
      name: '¿El photo booth incluye atrezzo y accesorios?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sí, prácticamente todos los paquetes de photo booth incluyen un kit de atrezzo (sombreros, gafas, cartelitos, bigotes, marcos) sin coste adicional. Los proveedores premium ofrecen atrezzo temático o personalizado según el evento. Consulta siempre qué incluye exactamente el pack antes de contratar.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Qué diferencia hay entre photo booth digital y con impresión?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'El photo booth digital entrega las fotos en el momento por QR o enlace, sin papel. Es más económico y ecológico. El servicio con impresión instantánea añade una impresora térmica que entrega copias físicas en 10–20 segundos. Muchas parejas eligen la versión con impresión porque los invitados se llevan un recuerdo físico del evento. El precio de diferencia es de 100–200€.',
      },
    },
  ],
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'Photo booth precio boda', item: 'https://xpeak.es/blog/photobooth-precio-boda-evento' },
  ],
};

const TIPOS = [
  {
    nombre: 'Photo booth básico (digital, sin impresión)',
    desc: 'Cabina o marco con cámara, entrega de fotos por QR o enlace. Sin papel. Incluye atrezzo básico y montaje. Ideal si el presupuesto ajustado es prioridad.',
    precio: '300–450€',
    horas: '3h',
  },
  {
    nombre: 'Photo booth con impresión instantánea',
    desc: 'El clásico: cámara + impresora térmica que entrega copias en 10–20 segundos. Incluye atrezzo, álbum para los novios y galería digital. El más solicitado en bodas.',
    precio: '450–700€',
    horas: '3–4h',
  },
  {
    nombre: 'Photo booth 360°',
    desc: 'Plataforma giratoria con cámara que graba vídeos en cámara lenta de 360°. El resultado se entrega como vídeo breve para redes. Muy popular en eventos de empresa y bodas modernas.',
    precio: '600–900€',
    horas: '3h',
  },
  {
    nombre: 'Selfie booth o mirror booth',
    desc: 'Espejo interactivo táctil con cámara incorporada. Permite firmas digitales, marcos personalizados y animaciones. Estética más elegante, muy usada en galas y eventos premium.',
    precio: '550–850€',
    horas: '3–4h',
  },
];

export default function BlogPhotoBoothPrecio() {
  return (
    <>
      <Helmet>
        <title>Cuánto cuesta un photo booth para boda o evento en España 2026 | XPEAK</title>
        <meta
          name="description"
          content="Precios reales de photo booth para bodas y eventos en España 2026. Tipos, qué incluye y cómo elegir entre básico, impresión y 360°."
        />
        <link rel="canonical" href="https://xpeak.es/blog/photobooth-precio-boda-evento" />
        <meta property="og:title" content="Cuánto cuesta un photo booth para boda o evento en España 2026 — XPEAK Blog" />
        <meta property="og:description" content="Guía de precios de photo booth en España 2026. Digital, impresión, 360° y mirror booth." />
        <meta property="og:url" content="https://xpeak.es/blog/photobooth-precio-boda-evento" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>

      <div className="min-h-screen" style={{ background: '#090909', color: '#fff' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-3xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#D4AF37' }}>XPEAK</a>
          <div className="flex items-center gap-3">
            <a href="/blog" className="text-xs font-bold hidden sm:block" style={{ color: '#3d3d4e' }}>Blog</a>
            <a
              href="/auth"
              className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}
            >
              Unirse gratis
            </a>
          </div>
        </nav>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>
            ← Todos los artículos
          </a>

          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>Bodas · Eventos · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">
              Cuánto cuesta un photo booth para boda o evento en España 2026
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: '#3d3d4e' }}>
              El photo booth se ha convertido en uno de los elementos más solicitados en bodas y eventos en España. Da igual si buscas el clásico con impresión, el moderno 360° o la elegante mirror booth — en esta guía encontrarás los precios reales de 2026 y todo lo que incluye cada modalidad.
            </p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>1 junio 2026</time>
          </div>

          <div className="space-y-10">
            {/* TIPOS */}
            <section>
              <h2 className="text-lg font-black mb-4">Tipos de photo booth disponibles en España</h2>
              <div className="space-y-4">
                {TIPOS.map((item, i) => (
                  <div
                    key={item.nombre}
                    className="p-5 rounded-xl"
                    style={{
                      background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)',
                      border: '1px solid rgba(255,255,255,0.05)',
                    }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <p className="text-xs font-black leading-tight">{item.nombre}</p>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-black" style={{ color: '#D4AF37' }}>{item.precio}</p>
                        <p className="text-[0.6rem] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{item.horas}</p>
                      </div>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* PRECIOS RESUMEN */}
            <section>
              <h2 className="text-lg font-black mb-4">Precios por modalidad (España 2026)</h2>
              <div className="space-y-2">
                {[
                  { concepto: 'Photo booth básico digital (3h)', precio: '300–450€' },
                  { concepto: 'Photo booth con impresión (3h)', precio: '450–700€' },
                  { concepto: 'Photo booth 360° (3h)', precio: '600–900€' },
                  { concepto: 'Mirror booth o selfie booth (3h)', precio: '550–850€' },
                  { concepto: 'Hora adicional (cualquier tipo)', precio: '80–150€/h' },
                  { concepto: 'Personalización de marcos y plantillas', precio: '50–120€' },
                  { concepto: 'Álbum impreso para los novios', precio: '60–150€' },
                ].map((row, i) => (
                  <div
                    key={row.concepto}
                    className="flex items-center justify-between p-4 rounded-xl"
                    style={{
                      background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)',
                      border: '1px solid rgba(255,255,255,0.04)',
                    }}
                  >
                    <p className="text-xs font-medium">{row.concepto}</p>
                    <span className="text-xs font-black ml-4 shrink-0" style={{ color: '#D4AF37' }}>{row.precio}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Precios orientativos sin IVA. Madrid y Barcelona son un 15–25% más caros.</p>
            </section>

            {/* QUÉ INCLUYE */}
            <section>
              <h2 className="text-lg font-black mb-4">Qué incluye un servicio de photo booth estándar</h2>
              <p className="text-sm leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.75)' }}>
                La mayoría de los paquetes de photo booth en España incluyen el montaje y desmontaje del equipo (cuenta como tiempo no activo, no se descuenta de las horas contratadas), el kit de atrezzo básico, la iluminación del puesto, un técnico o animador durante toda la actuación y la galería digital de todas las fotos en alta resolución.
              </p>
              <p className="text-sm leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.75)' }}>
                En los paquetes con impresión, se incluyen copias ilimitadas durante las horas contratadas, habitualmente en formato 10x15 cm con marco personalizado. La calidad de impresión varía: los proveedores con impresoras de sublimación de tinte ofrecen un resultado significativamente mejor que las térmicas baratas.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
                Lo que generalmente no está incluido: desplazamiento de larga distancia, personalización avanzada de marcos o plantillas (se cobra aparte), álbum físico para los novios y horas adicionales al paquete contratado.
              </p>
            </section>

            {/* CÓMO ELEGIR */}
            <section>
              <h2 className="text-lg font-black mb-4">Cómo elegir el photo booth para tu evento</h2>
              <p className="text-sm leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.75)' }}>
                El primer criterio es el espacio disponible. Los photo booth 360° necesitan una plataforma circular de al menos 1,5 m de diámetro y espacio alrededor para los espectadores. Las cabinas clásicas requieren un espacio de al menos 2x2 m con techo libre. Si la sala es pequeña o irregular, consulta siempre las dimensiones mínimas con el proveedor.
              </p>
              <p className="text-sm leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.75)' }}>
                Piensa también en el público. Si tus invitados son mayoritariamente adultos mayores, el photo booth clásico con impresión funciona mejor porque el recuerdo físico es más valorado. Si es una boda o evento con gente joven, el 360° o el digital con galería instantánea por QR generan más interacción y contenido para redes.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
                Compara siempre la calidad del material: pide ejemplos de fotos impresas reales, no solo maquetas digitales. La diferencia entre un proveedor de gama media y uno premium es muy visible en la calidad final de la impresión y en la iluminación del puesto.
              </p>
            </section>

            {/* FAQ */}
            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">
                {faqStructured.mainEntity.map((f) => (
                  <div
                    key={f.name}
                    className="p-5 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <p className="text-sm font-black mb-2">{f.name}</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>{f.acceptedAnswer.text}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ARTÍCULOS RELACIONADOS */}
            <section>
              <h2 className="text-base font-black mb-3" style={{ color: 'rgba(255,255,255,0.85)' }}>Artículos relacionados</h2>
              <div className="space-y-2">
                {[
                  { href: '/eventos-empresa', cat: 'Hub', title: 'Contratar profesionales para eventos de empresa' },
                  { href: '/blog/mago-precio-eventos-espana', cat: 'Entretenimiento', title: 'Cuánto cobra un mago para eventos en España 2026' },
                  { href: '/blog/saxofonista-precio-espana', cat: 'Música', title: 'Cuánto cobra un saxofonista en España 2026' },
                  { href: '/blog/profesionales-bodas', cat: 'Bodas', title: 'Profesionales para bodas: guía completa 2026' },
                ].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none' }}
                  >
                    <span
                      className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0"
                      style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}
                    >
                      {link.cat}
                    </span>
                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.72)' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>

            {/* CTA FINAL */}
            <div
              className="p-6 rounded-2xl text-center"
              style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}
            >
              <p className="text-sm font-black mb-2">Solicita presupuesto para tu boda o evento</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>
                XPEAK tiene proveedores de photo booth verificados con galería de trabajos reales. Presupuesto gratis en 24h.
              </p>
              <a
                href="/presupuesto-boda"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105"
                style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}
              >
                Pedir presupuesto para mi boda →
              </a>
            </div>
          </div>
        </main>

        <FooterPublic />
      </div>
    </>
  );
}
