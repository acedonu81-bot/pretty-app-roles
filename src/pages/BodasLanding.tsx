import { Helmet } from 'react-helmet-async';
import { Zap, Star, Shield, ArrowRight } from 'lucide-react';
import FooterPublic from '@/components/FooterPublic';

const SERVICIOS = [
  {
    emoji: '🎧',
    title: 'DJ de boda',
    desc: 'Profesionales con experiencia en bodas, no en clubs. Saben gestionar ceremonia, cóctel, cena y baile.',
    href: '/contratar-dj',
    precio: 'desde 400€',
    tag: 'Más solicitado',
  },
  {
    emoji: '🍾',
    title: 'Catering de boda',
    desc: 'Banquetes sentados, cócteles, barra libre y menús personalizados. Opciones vegetarianas y sin gluten.',
    href: '/contratar-catering',
    precio: 'desde 50€/persona',
    tag: 'Imprescindible',
  },
  {
    emoji: '📸',
    title: 'Fotógrafo de boda',
    desc: 'Cobertura completa: ceremonia, reportaje de pareja y banquete. Con o sin videógrafo incluido.',
    href: '/contratar-fotografo',
    precio: 'desde 800€',
    tag: '',
  },
  {
    emoji: '🍽️',
    title: 'Camareros de boda',
    desc: 'Personal de sala profesional para el cóctel y el banquete. Ratio correcto según tus invitados.',
    href: '/contratar-camareros',
    precio: 'desde 12€/hora',
    tag: '',
  },
  {
    emoji: '💄',
    title: 'Maquillaje nupcial',
    desc: 'Maquilladores especializados en novias. Incluye prueba previa y servicio el día del evento.',
    href: '/contratar-maquillaje',
    precio: 'desde 150€',
    tag: '',
  },
  {
    emoji: '🎻',
    title: 'Música en vivo',
    desc: 'Solistas, cuartetos de cuerda, grupos de jazz o bandas. Para la ceremonia o el cóctel.',
    href: '/blog/musica-en-vivo-para-bodas',
    precio: 'desde 300€',
    tag: '',
  },
  {
    emoji: '🎤',
    title: 'Maestro de ceremonias',
    desc: 'El MC conduce el evento, anima los discursos y mantiene el ritmo de la noche.',
    href: '/blog/maestro-de-ceremonias-boda-precio-guia',
    precio: 'desde 500€',
    tag: '',
  },
  {
    emoji: '🎵',
    title: 'Disco móvil',
    desc: 'DJ + equipo completo de sonido, luces y efectos. Ideal para fincas sin instalación propia.',
    href: '/contratar-disco-movil',
    precio: 'desde 400€',
    tag: '',
  },
];

const FAQS = [
  {
    q: '¿Cuánto cuesta una boda en España en 2026?',
    a: 'El presupuesto medio de una boda en España es de 20.000€ a 30.000€. Las partidas principales son catering (40–50%), fotografía (10–15%), DJ o música en vivo (8–12%), camareros (8–10%) y maquillaje (3–5%). En ciudades como Madrid o Barcelona el coste es un 20–30% superior a la media nacional.',
  },
  {
    q: '¿Con cuánta antelación debo contratar los proveedores?',
    a: 'Para bodas en temporada alta (mayo–octubre): 9–12 meses para catering y fotógrafo, 6–9 meses para DJ y camareros. Para bodas en temporada baja o fechas entre semana, 3–6 meses suele ser suficiente. Si necesitas proveedores con poca antelación, el Flash Booking de XPEAK puede conseguirte disponibilidad en menos de 1 hora.',
  },
  {
    q: '¿Cuántos camareros necesito para mi boda?',
    a: 'La regla general es 1 camarero por cada 15–20 invitados en servicio de cóctel, y 1 por cada 10 en cena sentada con servicio completo. Para un banquete de 100 personas necesitarás entre 5 y 8 camareros más 1 jefe de sala.',
  },
  {
    q: '¿XPEAK cobra comisión por contratar proveedores?',
    a: 'No. XPEAK es completamente gratuito para organizadores y parejas. El acuerdo se cierra directamente entre el organizador y el profesional, sin intermediarios ni porcentajes sobre el precio.',
  },
  {
    q: '¿Puedo contratar varios proveedores a la vez?',
    a: 'Sí. Con XPEAK puedes gestionar DJ, fotógrafo, camareros y maquillaje en paralelo desde el mismo panel, con contratos digitales independientes para cada profesional.',
  },
];

const BLOG_POSTS = [
  { href: '/blog/10-errores-contratar-dj-boda', emoji: '🎧', title: 'Los 10 errores al contratar un DJ para tu boda', desc: 'Sin contrato, reservar tarde, confundir perfiles… evítalos todos.' },
  { href: '/blog/cuanto-cuesta-una-boda-en-espana', emoji: '💰', title: '¿Cuánto cuesta una boda en España en 2026?', desc: 'Desglose real por partidas: catering, DJ, fotógrafo y más.' },
  { href: '/blog/cuantos-camareros-necesito-para-mi-boda', emoji: '🍽️', title: 'Cuántos camareros necesito para mi boda', desc: 'Tabla de ratios por número de invitados y tipo de servicio.' },
  { href: '/blog/musica-en-vivo-para-bodas', emoji: '🎻', title: 'Música en vivo para bodas: precios 2026', desc: 'Solistas, bandas, jazz y cuartetos de cuerda. Cuándo elegir cada formato.' },
  { href: '/blog/maestro-de-ceremonias-boda-precio-guia', emoji: '🎤', title: 'Maestro de ceremonias: precio y guía 2026', desc: 'Qué hace el MC, cuánto cobra y cómo elegirlo.' },
  { href: '/blog/contratar-fotografo-de-bodas', emoji: '📸', title: 'Cómo contratar un fotógrafo de boda en España', desc: 'Precios por ciudad, qué incluye y cómo elegir el profesional.' },
];

export default function BodasLanding() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Proveedores de Boda en España — XPEAK',
    provider: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
    areaServed: { '@type': 'Country', name: 'España' },
    description: 'Directorio de profesionales para bodas en España: DJs, catering, fotógrafos, camareros, maquillaje y música en vivo. Flash Booking en menos de 1h. Gratis para novios y organizadores.',
    url: 'https://xpeak.es/bodas',
    serviceType: 'Contratación de proveedores de boda',
  };

  const faqStructured = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <Helmet>
        <title>Proveedores para Bodas en España 2026 — DJ, Catering, Fotógrafo | XPEAK</title>
        <meta name="description" content="Contrata DJ, catering, fotógrafo, camareros, maquillaje y música en vivo para tu boda en España. Profesionales verificados, Flash Booking en menos de 1h. Gratis para novios." />
        <meta name="keywords" content="proveedores boda España, contratar DJ boda, catering boda España, fotógrafo boda, camareros boda, maquillaje novia, música en vivo boda, maestro de ceremonias boda" />
        <link rel="canonical" href="https://xpeak.es/bodas" />
        <meta property="og:title" content="Proveedores para Bodas en España 2026 — XPEAK" />
        <meta property="og:description" content="Directorio de profesionales para bodas: DJ, catering, fotógrafo, camareros, maquillaje y música en vivo. Flash Booking en menos de 1h." />
        <meta property="og:url" content="https://xpeak.es/bodas" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
      </Helmet>

      <div className="min-h-screen" style={{ background: '#090909', color: '#fff' }}>

        {/* Nav */}
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-5xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#D4AF37' }}>XPEAK</a>
          <div className="flex items-center gap-3 sm:gap-4">
            <a href="/blog" className="text-xs font-bold hidden sm:block transition-opacity hover:opacity-70" style={{ color: '#8E8EA0' }}>Blog</a>
            <a href="/auth"
              className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              Unirse gratis
            </a>
          </div>
        </nav>

        {/* Hero */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-12 sm:pb-16">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#D4AF37' }}>
              💒 España · Bodas 2026
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 leading-tight">
            Todos los proveedores para tu boda
          </h1>
          <p className="text-sm sm:text-lg mb-8 max-w-2xl leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
            DJ, catering, fotógrafo, camareros, maquillaje y música en vivo. Profesionales verificados en toda España. Flash Booking en menos de 1h. Sin comisión para novios y organizadores.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="/presupuesto-boda"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              <Zap size={15} /> Calcular presupuesto
            </a>
            <a href="/auth"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}>
              Publicar oferta gratis <ArrowRight size={14} />
            </a>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(212,175,55,0.03)' }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-8">
            {[
              { label: 'Flash Booking', value: 'En menos de 1h', icon: <Zap size={16} /> },
              { label: 'Presupuesto medio boda', value: '20.000–30.000€', icon: <Star size={16} /> },
              { label: 'Comisión para novios', value: '0%', icon: <Shield size={16} /> },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37' }}>
                  {s.icon}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest font-bold mb-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{s.label}</p>
                  <p className="text-sm font-black">{s.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Servicios */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <h2 className="text-xl sm:text-2xl font-black mb-2">Proveedores de boda en XPEAK</h2>
          <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Todos los profesionales que necesitas, verificados y con contrato digital automático.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SERVICIOS.map(s => (
              <a key={s.href} href={s.href}
                className="flex items-start gap-4 p-5 rounded-xl transition-all hover:scale-[1.02] group"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <span className="text-3xl flex-shrink-0">{s.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="text-sm font-black">{s.title}</p>
                    {s.tag && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded"
                        style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }}>
                        {s.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-xs leading-relaxed mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>{s.desc}</p>
                  <p className="text-xs font-bold" style={{ color: 'rgba(212,175,55,0.7)' }}>{s.precio}</p>
                </div>
                <ArrowRight size={14} className="flex-shrink-0 mt-1 transition-transform group-hover:translate-x-1"
                  style={{ color: 'rgba(255,255,255,0.2)' }} />
              </a>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
          <h2 className="text-xl sm:text-2xl font-black mb-6 sm:mb-8">Preguntas frecuentes sobre proveedores de boda</h2>
          <div className="space-y-4">
            {FAQS.map(faq => (
              <div key={faq.q} className="p-5 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-sm font-bold mb-2">{faq.q}</p>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Guías del blog */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
          <h2 className="text-xl sm:text-2xl font-black mb-2">Guías para organizar tu boda</h2>
          <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Todo lo que necesitas saber antes de contratar.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {BLOG_POSTS.map(post => (
              <a key={post.href} href={post.href}
                className="flex items-start gap-4 p-5 rounded-xl transition-all hover:scale-[1.02]"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <span className="text-2xl flex-shrink-0">{post.emoji}</span>
                <div>
                  <p className="text-sm font-black leading-snug mb-1.5">{post.title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{post.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* CTA final */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20 text-center">
          <div className="rounded-2xl p-7 sm:p-10"
            style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)' }}>
            <h2 className="text-xl sm:text-3xl font-black mb-3">¿Organizas una boda en España?</h2>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Únete gratis — sin comisión, contratos automáticos, Flash Booking en menos de 1h.
            </p>
            <a href="/auth"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-black text-sm transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              <Zap size={15} /> Empezar gratis
            </a>
          </div>
        </section>

        <FooterPublic />
      </div>
    </>
  );
}
