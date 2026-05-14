import { Helmet } from 'react-helmet-async';
import { CheckCircle, X } from 'lucide-react';
import FooterPublic from '@/components/FooterPublic';

const PLANES = [
  {
    nombre: 'Gratis — Profesional',
    precio: '0€',
    periodo: 'para siempre',
    target: 'DJs, fotógrafos, camareros, staff',
    color: 'rgba(255,255,255,0.06)',
    border: 'rgba(255,255,255,0.1)',
    incluye: [
      'Perfil verificado con portfolio',
      'Aparecer en el directorio',
      'Recibir solicitudes de Flash Booking',
      'Contrato digital automático',
      'Mensajería con empresarios',
      'Calendario de disponibilidad',
    ],
    noIncluye: [
      'Fan Club (próximamente)',
      'Badge verificado prioritario',
    ],
    cta: 'Crear perfil gratis',
    href: '/auth',
  },
  {
    nombre: 'Gratis — Empresario',
    precio: '0€',
    periodo: 'para siempre',
    target: 'Salas, promotoras, organizadores',
    color: 'rgba(212,175,55,0.04)',
    border: 'rgba(212,175,55,0.25)',
    badge: 'Más popular',
    incluye: [
      'Acceso al directorio completo',
      'Flash Booking sin límite',
      'Contratos digitales automáticos',
      'Mensajería con profesionales',
      'Historial de contrataciones',
      'Sin comisión sobre el caché',
    ],
    noIncluye: [
      'Gestión de pagos integrada (próx.)',
    ],
    cta: 'Unirse gratis',
    href: '/auth',
    gold: true,
  },
];

const FAQ = [
  { q: '¿XPEAK cobra comisión sobre el caché del profesional?', a: 'No. XPEAK es completamente gratuito tanto para profesionales como para empresarios y promotoras. El acuerdo económico se cierra directamente entre las partes. No cobramos porcentaje sobre el caché ni tarifa por contratación.' },
  { q: '¿Cuándo habrá planes de pago?', a: 'Estamos desarrollando funcionalidades premium opcionales: Fan Club para monetización directa entre profesional y fans, badge de verificación prioritaria y analytics avanzados. Estas funcionalidades tendrán coste, pero el acceso básico siempre será gratuito.' },
  { q: '¿Qué incluye el contrato digital?', a: 'El contrato generado por XPEAK incluye: datos fiscales de ambas partes, descripción del servicio, fecha, precio acordado, IRPF calculado automáticamente si el profesional es autónomo, y cláusulas de cancelación estándar del sector. Disponible en PDF listo para firma.' },
];

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Precios', item: 'https://xpeak.es/precios' },
  ],
};

const faqStructured = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
};

export default function Precios() {
  return (
    <>
      <Helmet>
        <title>Precios XPEAK — Gratis para profesionales y empresarios de eventos</title>
        <meta name="description" content="XPEAK es gratis para DJs, fotógrafos, camareros y staff. También gratis para salas, promotoras y organizadores. Sin comisión. Contratos digitales incluidos." />
        <link rel="canonical" href="https://xpeak.es/precios" />
        <meta property="og:title" content="Precios XPEAK — Gratis para todos" />
        <meta property="og:description" content="XPEAK es gratis para profesionales y empresarios de eventos. Sin comisión. Contratos digitales automáticos." />
        <meta property="og:url" content="https://xpeak.es/precios" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
      </Helmet>

      <div className="min-h-screen" style={{ background: '#090909', color: '#fff' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-5xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#D4AF37' }}>XPEAK</a>
          <a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105"
            style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
            Unirse gratis
          </a>
        </nav>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-20">

          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>Precios</p>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">Gratis. Sin trampa.</h1>
            <p className="text-sm max-w-md mx-auto" style={{ color: '#8E8EA0' }}>
              XPEAK no cobra comisión sobre ningún caché ni contratación. El acceso básico es gratuito para siempre, tanto para profesionales como para empresarios.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
            {PLANES.map(plan => (
              <div key={plan.nombre} className="relative p-6 rounded-2xl"
                style={{ background: plan.color, border: `1px solid ${plan.border}` }}>
                {plan.badge && (
                  <span className="absolute -top-3 left-6 px-3 py-1 rounded-full text-[0.6rem] font-black uppercase tracking-wider"
                    style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                    {plan.badge}
                  </span>
                )}
                <p className="text-[0.6rem] font-bold uppercase tracking-wider mb-1" style={{ color: '#8E8EA0' }}>{plan.target}</p>
                <p className="text-lg font-black mb-1">{plan.nombre}</p>
                <div className="flex items-baseline gap-1 mb-5">
                  <span className="text-4xl font-black" style={{ color: plan.gold ? '#D4AF37' : '#fff' }}>{plan.precio}</span>
                  <span className="text-xs" style={{ color: '#8E8EA0' }}>{plan.periodo}</span>
                </div>

                <ul className="space-y-2 mb-6">
                  {plan.incluye.map(item => (
                    <li key={item} className="flex items-start gap-2 text-xs">
                      <CheckCircle size={13} className="mt-0.5 shrink-0" style={{ color: '#22c55e' }} />
                      <span style={{ color: 'rgba(255,255,255,0.8)' }}>{item}</span>
                    </li>
                  ))}
                  {plan.noIncluye.map(item => (
                    <li key={item} className="flex items-start gap-2 text-xs">
                      <X size={13} className="mt-0.5 shrink-0" style={{ color: 'rgba(255,255,255,0.2)' }} />
                      <span style={{ color: 'rgba(255,255,255,0.3)' }}>{item}</span>
                    </li>
                  ))}
                </ul>

                <a href={plan.href}
                  className="block w-full text-center py-3 rounded-xl text-xs font-black transition-all hover:scale-105"
                  style={plan.gold
                    ? { background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }
                    : { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}>
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>

          <div className="mb-16">
            <h2 className="text-xl font-black text-center mb-8">Preguntas frecuentes sobre precios</h2>
            <div className="space-y-4 max-w-2xl mx-auto">
              {FAQ.map(f => (
                <div key={f.q} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-sm font-bold mb-2">{f.q}</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{f.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 rounded-2xl text-center" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
            <p className="text-lg font-black mb-2">¿Aún tienes dudas?</p>
            <p className="text-xs mb-5" style={{ color: '#8E8EA0' }}>Escríbenos a hola@xpeak.es o usa el chat de soporte en el dashboard.</p>
            <a href="/auth" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              Empezar gratis →
            </a>
          </div>

        </main>
        <FooterPublic />
      </div>
    </>
  );
}
