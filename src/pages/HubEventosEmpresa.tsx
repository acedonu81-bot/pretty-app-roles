import { Helmet } from 'react-helmet-async';
import { Zap, Users, Camera, Music, Wand2, UtensilsCrossed, Mic2, Building2, ArrowRight } from 'lucide-react';
import FooterPublic from '@/components/FooterPublic';

const faqStructured = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Cuánto cuesta organizar un evento de empresa en España?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'El coste de un evento corporativo varía enormemente según el número de asistentes y los servicios. Para 50 personas, un evento sencillo (sala + catering + DJ o música) puede rondar los 3.000–6.000€. Para 100 personas, entre 6.000–15.000€. Para 200 o más, el presupuesto habitual está entre 15.000 y 40.000€. Los servicios de entretenimiento (mago, photobooth, animadores) suman entre 400 y 2.000€ adicionales.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Qué profesionales necesito para un evento de empresa de 50 personas?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Para 50 personas recomendamos: DJ o cuarteto musical (500–900€), catering o servicio de barra (1.500–3.000€), fotógrafo corporativo (400–700€) y opcionalmente mago de close-up o photobooth (300–600€). Con un presupuesto de 3.500–5.500€ puedes cubrir todos los servicios básicos con profesionales de nivel.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Qué necesito para un evento de empresa de 100 o 200 personas?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Para 100 personas: sala con equipo de sonido profesional, DJ o grupo en directo (700–1.500€), catering con servicio de mesa (3.000–6.000€), staff de azafatas (400–800€), fotógrafo y/o videógrafo (700–1.200€). Para 200 personas los costes se multiplican: necesitarás producción de sonido y luces propia, personal de atención al cliente y posiblemente un coordinador de evento externo.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Puedo contratar todos los profesionales de un evento de empresa en un solo sitio?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sí. XPEAK centraliza todos los profesionales de eventos corporativos: DJ, catering, staff, azafatas, fotógrafos, magos, animadores y photobooth. Puedes solicitar presupuestos a cada perfil desde una misma plataforma, comparar portfolios verificados y firmar contratos digitales sin salir de la web.',
      },
    },
  ],
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Eventos de empresa', item: 'https://xpeak.es/eventos-empresa' },
  ],
};

const CATEGORIAS = [
  {
    icon: Music,
    titulo: 'DJ para eventos de empresa',
    descripcion: 'Ambiente perfecto para cenas de empresa, teambuildings y galas corporativas.',
    precio: '400–1.200€',
    href: '/contratar-dj/madrid',
  },
  {
    icon: UtensilsCrossed,
    titulo: 'Catering corporativo',
    descripcion: 'Desde finger food y cócteles hasta menús de gala para todo el equipo.',
    precio: '25–80€/persona',
    href: '/contratar-catering',
  },
  {
    icon: Users,
    titulo: 'Staff y azafatas',
    descripcion: 'Personal de atención, recepción y protocolo para eventos corporativos.',
    precio: '150–300€/persona/día',
    href: '/contratar-staff',
  },
  {
    icon: Camera,
    titulo: 'Fotógrafo corporativo',
    descripcion: 'Reportajes de evento, headshots de equipo y contenido para comunicación interna.',
    precio: '400–900€',
    href: '/contratar-fotografo',
  },
  {
    icon: Wand2,
    titulo: 'Mago y humorista',
    descripcion: 'Magia de mesa, shows de 30–60 minutos o monólogos para romper el hielo.',
    precio: '300–1.200€',
    href: '/contratar-mago',
  },
  {
    icon: Zap,
    titulo: 'Animadores y actividades',
    descripcion: 'Teambuilding, actividades de grupo, juegos de empresa y dinamizadores.',
    precio: '300–800€',
    href: '/auth',
  },
  {
    icon: Camera,
    titulo: 'Photo booth',
    descripcion: 'Impresión instantánea, 360°, selfie booth digital. Ideal para eventos con premio o rifa.',
    precio: '350–750€',
    href: '/auth',
  },
  {
    icon: Mic2,
    titulo: 'Cuarteto o música en directo',
    descripcion: 'Cuarteto de cuerda, jazz en directo, banda para cenas de gala.',
    precio: '600–2.000€',
    href: '/auth',
  },
];

export default function HubEventosEmpresa() {
  return (
    <>
      <Helmet>
        <title>Contratar profesionales para eventos de empresa en España | XPEAK</title>
        <meta
          name="description"
          content="DJ, catering, staff, fotógrafo, mago, photobooth y más para tu evento corporativo. Precios reales, perfiles verificados y contrato digital. XPEAK."
        />
        <link rel="canonical" href="https://xpeak.es/eventos-empresa" />
        <meta property="og:title" content="Contratar profesionales para eventos de empresa en España — XPEAK" />
        <meta property="og:description" content="Todos los profesionales para tu evento corporativo en un solo lugar. Perfiles verificados, presupuestos gratis y contrato digital." />
        <meta property="og:url" content="https://xpeak.es/eventos-empresa" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>

      <div className="min-h-screen" style={{ background: '#090909', color: '#fff' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-5xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#D4AF37' }}>XPEAK</a>
          <div className="flex items-center gap-3">
            <a href="/blog" className="text-xs font-bold hidden sm:block" style={{ color: '#8E8EA0' }}>Blog</a>
            <a
              href="/auth"
              className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}
            >
              Unirse gratis
            </a>
          </div>
        </nav>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-20">
          {/* HERO */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 mb-4">
              <Building2 size={14} style={{ color: '#D4AF37' }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#D4AF37' }}>Eventos corporativos</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-5">
              Contratar profesionales para eventos de empresa en España
            </h1>
            <p className="text-sm sm:text-base max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
              DJ, catering, staff de azafatas, fotógrafo corporativo, mago, photobooth y música en directo. Todos los profesionales que necesitas para tu evento de empresa, verificados y con presupuesto gratuito.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-7">
              <a
                href="/auth"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black transition-all hover:scale-105"
                style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}
              >
                Pedir presupuesto gratis
                <ArrowRight size={14} />
              </a>
              <a
                href="#categorias"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all hover:opacity-80"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.8)' }}
              >
                Ver categorías
              </a>
            </div>
          </div>

          {/* CATEGORÍAS */}
          <section id="categorias" className="mb-16">
            <h2 className="text-xl font-black mb-6">Profesionales para eventos corporativos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {CATEGORIAS.map((cat) => {
                const Icon = cat.icon;
                return (
                  <a
                    key={cat.titulo}
                    href={cat.href}
                    className="p-5 rounded-2xl flex flex-col gap-3 transition-all hover:opacity-90 hover:scale-[1.02]"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', textDecoration: 'none' }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-lg" style={{ background: 'rgba(212,175,55,0.1)' }}>
                        <Icon size={16} style={{ color: '#D4AF37' }} />
                      </div>
                      <span className="text-xs font-black" style={{ color: '#D4AF37' }}>{cat.precio}</span>
                    </div>
                    <p className="text-sm font-black leading-tight">{cat.titulo}</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{cat.descripcion}</p>
                    <span className="inline-flex items-center gap-1 text-xs font-bold mt-auto" style={{ color: '#D4AF37' }}>
                      Ver perfiles <ArrowRight size={11} />
                    </span>
                  </a>
                );
              })}
            </div>
          </section>

          {/* PRECIOS ORIENTATIVOS */}
          <section className="mb-16">
            <h2 className="text-xl font-black mb-6">Precios orientativos por número de asistentes</h2>
            <div className="space-y-3">
              {[
                {
                  aforo: 'Hasta 50 personas',
                  servicios: 'DJ o música ambient, catering finger food, fotógrafo 4h',
                  presupuesto: '3.000–6.000€',
                },
                {
                  aforo: '50–100 personas',
                  servicios: 'DJ o cuarteto, catering con servicio, staff 2 azafatas, fotógrafo, mago o photobooth',
                  presupuesto: '6.000–14.000€',
                },
                {
                  aforo: '100–200 personas',
                  servicios: 'Grupo en directo, catering completo, staff 4–6 personas, producción A/V, fotógrafo + vídeo',
                  presupuesto: '14.000–35.000€',
                },
                {
                  aforo: 'Más de 200 personas',
                  servicios: 'Producción integral, varios proveedores, coordinador de evento',
                  presupuesto: 'Desde 35.000€',
                },
              ].map((row, i) => (
                <div
                  key={row.aforo}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-xl"
                  style={{
                    background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)',
                    border: '1px solid rgba(255,255,255,0.04)',
                  }}
                >
                  <div>
                    <p className="text-xs font-black">{row.aforo}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{row.servicios}</p>
                  </div>
                  <span className="text-xs font-black shrink-0" style={{ color: '#D4AF37' }}>{row.presupuesto}</span>
                </div>
              ))}
            </div>
            <p className="text-xs mt-3" style={{ color: '#8E8EA0' }}>Estimaciones orientativas sin IVA. Los precios varían según ciudad, espacio y temporada.</p>
          </section>

          {/* FAQ */}
          <section className="mb-16">
            <h2 className="text-xl font-black mb-6">Preguntas frecuentes sobre eventos de empresa</h2>
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

          {/* LINKS INTERNOS */}
          <section className="mb-16">
            <h2 className="text-base font-black mb-4" style={{ color: 'rgba(255,255,255,0.85)' }}>Categorías destacadas</h2>
            <div className="space-y-2">
              {[
                { href: '/contratar-dj/madrid', cat: 'DJ', title: 'Contratar DJ en Madrid para empresa' },
                { href: '/contratar-staff', cat: 'Staff', title: 'Contratar azafatas y staff para eventos' },
                { href: '/contratar-catering', cat: 'Catering', title: 'Catering para eventos corporativos' },
                { href: '/contratar-mago', cat: 'Entretenimiento', title: 'Contratar mago o humorista para empresa' },
                { href: '/contratar-fotografo', cat: 'Fotografía', title: 'Fotógrafo para evento corporativo' },
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
            <p className="text-sm font-black mb-2">Organiza tu evento de empresa con XPEAK</p>
            <p className="text-xs mb-4" style={{ color: '#8E8EA0' }}>
              Todos los profesionales verificados en una sola plataforma. Presupuestos gratis, contratos digitales y sin comisión oculta.
            </p>
            <a
              href="/auth"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}
            >
              Pedir presupuesto gratis
              <ArrowRight size={13} />
            </a>
          </div>
        </main>

        <FooterPublic />
      </div>
    </>
  );
}
