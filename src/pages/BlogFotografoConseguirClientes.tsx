import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';
import DJResourcesAffiliate from '@/components/DJResourcesAffiliate';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Cómo conseguir clientes como fotógrafo de eventos en España: guía 2026', description: 'Guía práctica para fotógrafos freelance que quieren conseguir más clientes en bodas, comuniones y eventos. Portfolio, redes sociales, plataformas y precios.', datePublished: '2026-06-02', dateModified: '2026-06-02', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/fotografo-como-conseguir-clientes' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto puede ganar un fotógrafo de eventos freelance en España?', acceptedAnswer: { '@type': 'Answer', text: 'Un fotógrafo de eventos activo puede ganar entre 20.000€ y 60.000€ al año. Una boda completa paga 1.500-3.500€, una comunión 400-1.200€ y un evento corporativo 400-1.000€. Con 2 bodas y 2-3 comuniones al mes en temporada alta (mayo-septiembre) es posible superar los 4.000€ mensuales brutos.' } },
  { '@type': 'Question', name: '¿Necesito estudios de fotografía para trabajar en eventos?', acceptedAnswer: { '@type': 'Answer', text: 'No son imprescindibles, pero sí necesitas dominar la técnica: exposición, ISO, enfoque en movimiento, flash de boda y edición (Lightroom/Capture One). Muchos fotógrafos de bodas son autodidactas con portafolio sólido. Lo que sí valoran los clientes es el estilo consistente y las referencias de eventos anteriores.' } },
  { '@type': 'Question', name: '¿Cómo fijo el precio como fotógrafo de eventos?', acceptedAnswer: { '@type': 'Answer', text: 'Calcula: horas de shooting + horas de edición (ratio aproximado 1:3) + coste de equipo + desplazamiento + impuestos. Para una boda de 8h de shooting, son 24h de edición adicionales. A 30€/hora de trabajo real, son 960€ de coste antes de beneficio. Suma seguro de equipo, copia de seguridad y IRPF — el precio de mercado no es solo "lo que dura la boda".' } },
  { '@type': 'Question', name: '¿Merece la pena especializarse en bodas o ser generalista?', acceptedAnswer: { '@type': 'Answer', text: 'La especialización paga más. Un fotógrafo especialista en bodas puede cobrar 2.500€ de media, mientras que un generalista cobra 1.200-1.500€. La razón: los novios buscan estilos muy concretos, confían más en alguien que solo hace bodas y están dispuestos a pagar más por esa seguridad. Lo mismo aplica para comuniones, eventos corporativos o fotografía nocturna.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Fotógrafo conseguir clientes', item: 'https://xpeak.es/blog/fotografo-como-conseguir-clientes' }] };

const ESTRATEGIAS = [
  { num: '01', titulo: 'Portfolio online bien curado', desc: 'Tu web o perfil de plataforma es lo primero que ven los clientes. Muestra 20-30 fotos máximo por tipo de evento, de distintos momentos y condiciones de luz. Menos es más — mejor 20 fotos perfectas que 100 mediocres.' },
  { num: '02', titulo: 'Instagram como escaparate activo', desc: 'Publica de forma consistente: un feed con tu estilo propio, stories de making-of y reels con antes/después de edición. Los novios pasan horas en Instagram buscando el estilo que quieren para su boda. Si tu perfil tiene coherencia visual, te encontrarán.' },
  { num: '03', titulo: 'Plataformas especializadas en eventos', desc: 'XPEAK conecta fotógrafos con organizadores de bodas, comuniones y eventos corporativos. Tu perfil incluye portfolio, reseñas verificadas y disponibilidad. Los clientes que entran a buscar ya tienen intención de contratar.' },
  { num: '04', titulo: 'Google My Business para fotógrafo local', desc: '"Fotógrafo de bodas en Madrid" genera miles de búsquedas al mes. Un perfil de Google Business con fotos de bodas reales, reseñas y ubicación te coloca en el mapa de los que buscan local. Es gratis y tarda 1 hora en configurar.' },
  { num: '05', titulo: 'Networking con wedding planners y venues', desc: 'Las fincas y los wedding planners son proveedores de referencia para los novios. Si estás en su lista de recomendados, tienes un flujo constante sin hacer marketing. Ofrece sesiones gratuitas en una finca nueva a cambio de figurar en su web.' },
  { num: '06', titulo: 'Reseñas y testimonios en cada proyecto', desc: 'Tras cada boda, pide a los novios que dejen reseña en Google y en tu perfil de plataforma. Una reseña auténtica con fotos del evento vale más que cualquier anuncio de pago. Automatiza el pedido de reseña con un email automático 2 semanas después de la entrega.' },
  { num: '07', titulo: 'Precios claros y paquetes definidos', desc: 'Los clientes odian pedir presupuesto sin saber el rango. Publica tus precios desde en tu web o perfil — "desde X€" elimina la fricción y filtra clientes que no son tu cliente ideal. La transparencia de precios es un diferenciador en fotografía.' },
];

export default function BlogFotografoConseguirClientes() {
  return (
    <>
      <Helmet>
        <title>Cómo conseguir clientes como fotógrafo de eventos 2026 | XPEAK</title>
        <meta name="description" content="7 estrategias para que fotógrafos freelance consigan más clientes en bodas, comuniones y eventos en España. Portfolio, Instagram, plataformas y precios." />
        <link rel="canonical" href="https://xpeak.es/blog/fotografo-como-conseguir-clientes" />
        <meta property="og:title" content="Cómo conseguir clientes como fotógrafo de eventos 2026 — XPEAK" />
        <meta property="og:description" content="Guía práctica para fotógrafos freelance de bodas y eventos. Portfolio, Instagram, plataformas y precios." />
        <meta property="og:url" content="https://xpeak.es/blog/fotografo-como-conseguir-clientes" />
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
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#4F46E5' }}>XPEAK</a>
          <div className="flex items-center gap-3">
            <a href="/blog" className="text-xs font-bold hidden sm:block" style={{ color: '#3d3d4e' }}>Blog</a>
            <a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#4F46E5,#B8941E)', color: '#000' }}>Unirse gratis</a>
          </div>
        </nav>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>

          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#4F46E5' }}>Para Fotógrafos · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Cómo conseguir clientes como fotógrafo de eventos en España: guía 2026</h1>
            <p className="text-base leading-relaxed" style={{ color: '#3d3d4e' }}>El mercado de fotografía de eventos en España crece cada año — pero también crece la competencia. Estas 7 estrategias marcan la diferencia entre un fotógrafo que lucha por conseguir clientes y uno con agenda llena de mayo a octubre.</p>
            <time className="text-xs mt-3 block" style={{ color: '#666' }}>2 junio 2026</time>
          </div>

          <div className="space-y-10">
            <section>
              <div className="space-y-4">
                {ESTRATEGIAS.map((e, i) => (
                  <div key={e.num} className="p-5 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(0,0,0,0.025)' : 'rgba(0,0,0,0.015)', border: '1px solid rgba(0,0,0,0.05)' }}>
                    <div className="flex items-start gap-4">
                      <span className="text-2xl font-black shrink-0 leading-none mt-0.5" style={{ color: 'rgba(79,70,229,0.3)' }}>{e.num}</span>
                      <div>
                        <p className="text-sm font-black mb-1.5">{e.titulo}</p>
                        <p className="text-sm leading-relaxed" style={{ color: '#333' }}>{e.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <BlogInlineCTA role="fotografo" />

            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">
                {faqStructured.mainEntity.map(f => (
                  <div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}>
                    <h3 className="text-sm font-bold mb-2">{f.name}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#222' }}>{f.acceptedAnswer.text}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-8">
              <h2 className="text-base font-black mb-3" style={{ color: '#111' }}>Artículos relacionados</h2>
              <div className="space-y-2">
                {[
                  { href: '/blog/fotografos-eventos', cat: 'Hub Foto', title: 'Fotógrafos para eventos: guía completa 2026' },
                  { href: '/blog/videografo-bodas-precio', cat: 'Fotografía', title: 'Videógrafo bodas: precio y qué incluye 2026' },
                  { href: '/blog/como-conseguir-bolos-dj', cat: 'Para DJs', title: 'Cómo conseguir bolos como DJ 2026' },
                  { href: '/blog/contrato-dj-que-debe-incluir', cat: 'Guía', title: 'Contrato para profesionales: qué debe incluir' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(79,70,229,0.1)', color: '#4F46E5', border: '1px solid rgba(79,70,229,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: '#222' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>

            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(79,70,229,0.04)', border: '1px solid rgba(79,70,229,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Eres fotógrafo y buscas más clientes?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>Crea tu perfil en XPEAK gratis. Organizadores de bodas y comuniones en tu zona ven tu portfolio, leen tus reseñas y te contratan directamente. Sin comisión oculta.</p>
              <a href="/auth?role=fotografo" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#4F46E5,#B8941E)', color: '#000' }}>Crear mi perfil de fotógrafo gratis →</a>
            </div>
          </div>
                  <BlogEmailCapture variant="presupuestos" intent="contratar-staff" articlePath="/blog/fotografo-como-conseguir-clientes" />
</main>
        <DJResourcesAffiliate role="fotografo" />
        <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/fotografo-como-conseguir-clientes' tag='Fotografía' />
        <FooterPublic />
        <BlogScrollCTA role="fotografo" storageKey="xpeak_scrollcta_fotografo_conseguir_clientes" />
      </div>
    </>
  );
}
