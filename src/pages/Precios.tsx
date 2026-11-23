import { Helmet } from 'react-helmet-async';
import { CheckCircle, X } from 'lucide-react';
import FooterPublic from '@/components/FooterPublic';
import { cobrosActivos } from '@/lib/pagos';
import { listaVentajas } from '@/lib/ventajasPlan';
import { subscriptionPlans, PRECIOS_ANUALES } from '@/lib/subscriptions';
import AvisoBlackFriday from '@/components/AvisoBlackFriday';

type PlanPublico = {
  nombre: string; precio: string; periodo: string; target: string; color: string; border: string;
  badge?: string; incluye: string[]; noIncluye: string[]; cta: string; href: string; gold?: boolean;
};

const PLANES_ANTES: PlanPublico[] = [
  {
    nombre: 'Profesional',
    precio: '0€',
    periodo: 'para siempre',
    target: 'DJs, fotógrafos, camareros, staff',
    color: '#FFFDF7',
    border: 'rgba(122,98,22,0.16)',
    incluye: [
      'Perfil verificado con portfolio',
      'Aparecer en el directorio',
      'Recibir solicitudes de Flash Booking',
      'Contrato digital automático',
      'Mensajería con empresarios',
      'Calendario de disponibilidad',
    ],
    noIncluye: [
      'Badge verificado prioritario',
    ],
    cta: 'Crear perfil',
    href: '/auth?mode=register&role=profesional',
  },
  {
    nombre: 'Empresario',
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
    ],
    noIncluye: [
      'Gestión de pagos integrada (próx.)',
    ],
    cta: 'Unirse',
    href: '/auth?mode=register&role=empresario',
    gold: true,
  },
];

const FAQ_ANTES = [
  { q: '¿Cuándo habrá planes de pago?', a: 'Estamos desarrollando funcionalidades premium opcionales: badge de verificación prioritaria y analytics avanzados.' },
  { q: '¿Qué incluye el contrato digital?', a: 'El contrato generado por XPEAK incluye: datos fiscales de ambas partes, descripción del servicio, fecha, precio acordado, IRPF calculado automáticamente si el profesional es autónomo, y cláusulas de cancelación estándar del sector. Disponible en PDF listo para firma.' },
];

// ── Versión con cobros activados (18 nov 2026) ───────────────────────────────
// Se enseña solo con VITE_COBROS_ACTIVOS encendido, para que la web no diga a la vez
// "para siempre 0 €" y planes de pago. Las ventajas salen de ventajasPlan.ts (la misma
// fuente que "Mi plan") y los precios de subscriptions.ts: no se repiten a mano.
const euros = (n: number) => n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
const precioMes = (id: 'starter' | 'business') => subscriptionPlans.find(p => p.id === id)!.monthlyPrice;
// Página general: no depende del oficio (lo propio de música, DJ o Flash va en la nota de abajo).
const GENERAL = { profesional: true, musica: false, banner: false, flash: false };

const PLANES_DEFINITIVOS: PlanPublico[] = [
  {
    nombre: 'Profesional',
    precio: euros(precioMes('starter')),
    periodo: `/mes, IVA incluido · o ${euros(PRECIOS_ANUALES.starter)} al año, ahorras 2 meses`,
    target: 'Más visibilidad',
    color: '#FFFDF7',
    border: 'rgba(212,175,55,0.35)',
    incluye: [...listaVentajas('starter', GENERAL), 'Contrato digital automático', 'Calendario de disponibilidad'],
    noIncluye: [],
    cta: 'Crear perfil y elegir plan',
    href: '/auth?mode=register&role=profesional',
  },
  {
    nombre: 'Premium',
    precio: euros(precioMes('business')),
    periodo: `/mes, IVA incluido · o ${euros(PRECIOS_ANUALES.business)} al año, ahorras 2 meses`,
    target: 'Máxima visibilidad',
    color: 'rgba(212,175,55,0.04)',
    border: 'rgba(212,175,55,0.25)',
    incluye: listaVentajas('business', GENERAL),
    noIncluye: [],
    cta: 'Crear perfil y elegir plan',
    href: '/auth?mode=register&role=profesional',
    gold: true,
  },
];

const NOTA_PLANES = 'Precios con IVA incluido y sin permanencia. Las ofertas Flash Booking llegan a los oficios que las reciben; los sets (3, 10 o ilimitados) son para música, y el banner de cabecera, para DJ con Premium.';

const FAQ_DEFINITIVAS = [
  { q: '¿Cuánto cuestan los planes?', a: `Hay dos planes. Profesional cuesta ${euros(precioMes('starter'))} al mes y Premium ${euros(precioMes('business'))} al mes, con IVA incluido. Si pagas por años, ${euros(PRECIOS_ANUALES.starter)} y ${euros(PRECIOS_ANUALES.business)} al año: ahorras 2 meses y recibes un regalo de bienvenida. Sin permanencia.` },
  { q: '¿Puedo cancelar cuando quiera?', a: 'Sí. Desde Mi plan, en Gestionar mi plan. Tu plan sigue activo hasta el último día que ya has pagado, y después pierdes las ventajas del plan.' },
  { q: '¿Qué pasa con mis datos si bajo de plan?', a: 'No se borra nada. Lo que tu plan no incluye (tus redes, las fotos o sets que pasen del límite, el banner) se oculta y vuelve a verse si subes de plan otra vez.' },
  FAQ_ANTES[1],
];


const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Precios', item: 'https://xpeak.es/precios' },
  ],
};


export default function Precios() {
  // Se decide al pintar (no al cargar el archivo) para que dependa solo del interruptor de cobros.
  const LANZADO = cobrosActivos();
  const PLANES = LANZADO ? PLANES_DEFINITIVOS : PLANES_ANTES;
  const FAQ = LANZADO ? FAQ_DEFINITIVAS : FAQ_ANTES;
  const faqStructured = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  return (
    <>
      <Helmet>
        <title>Precios XPEAK: Para profesionales y empresarios de eventos</title>
        <meta name="description" content={LANZADO ? "Planes de XPEAK para profesionales de eventos: Profesional y Premium con IVA incluido y sin permanencia. Contratos digitales incluidos." : "Precios de XPEAK para DJs, fotógrafos, camareros y staff, y para salas, promotoras y organizadores. Contratos digitales incluidos."} />
        <link rel="canonical" href="https://xpeak.es/precios" />
        <meta property="og:title" content="Precios XPEAK" />
        <meta property="og:description" content="Precios de XPEAK para profesionales y empresarios de eventos. Contratos digitales automáticos." />
        <meta property="og:url" content="https://xpeak.es/precios" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
      </Helmet>

      <div className="min-h-screen" style={{ background: '#FFFFFF', color: '#111' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-5xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#8B6A00' }}>XPEAK</a>
          <a href="/auth?mode=register" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105"
            style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
            Unirse
          </a>
        </nav>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-20">

          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#8B6A00' }}>Precios</p>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">Precios</h1>
            <p className="text-sm max-w-xl mx-auto mb-2" style={{ color: '#374151' }}>
              {LANZADO
                ? 'Planes de XPEAK para profesionales de eventos: qué incluye cada uno, cuánto cuesta y cómo se cobra. Contratos digitales incluidos.'
                : 'Precios de XPEAK para profesionales y empresarios de eventos: qué incluye cada plan, cuánto cuesta y cómo se cobra. Contratos digitales incluidos.'}
            </p>
            <p className="text-sm max-w-md mx-auto" style={{ color: '#374151' }}>
              {LANZADO ? 'Sin permanencia. Cancela cuando quieras.' : 'Sin tarjeta de crédito, sin permanencia.'}
            </p>
          </div>

          {LANZADO && <AvisoBlackFriday className="max-w-3xl mx-auto mb-8" />}
          <div className={`grid grid-cols-1 sm:grid-cols-2 ${LANZADO ? 'lg:grid-cols-2 max-w-3xl mx-auto' : ''} gap-6 mb-${LANZADO ? '6' : '16'}`}>
            {PLANES.map(plan => (
              <div key={plan.nombre} className="relative p-6 rounded-2xl"
                style={{ background: plan.color, border: `1px solid ${plan.border}` }}>
                {plan.badge && (
                  <span className="absolute -top-3 left-6 px-3 py-1 rounded-full text-[0.75rem] font-black uppercase tracking-wider"
                    style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                    {plan.badge}
                  </span>
                )}
                <p className="text-[0.75rem] font-bold uppercase tracking-wider mb-1" style={{ color: '#374151' }}>{plan.target}</p>
                <p className="text-lg font-black mb-1">{plan.nombre}</p>
                <div className="flex flex-wrap items-baseline gap-x-1 mb-5">
                  <span className="text-4xl font-black whitespace-nowrap" style={{ color: plan.gold ? '#8B6A00' : '#111' }}>{plan.precio}</span>
                  <span className="text-xs" style={{ color: '#374151' }}>{plan.periodo}</span>
                </div>

                <ul className="space-y-2 mb-6">
                  {plan.incluye.map(item => /^Todo lo de /.test(item) ? (
                    // Igual que en Mi plan: separa lo heredado de lo propio de Premium.
                    <li key={item} className="text-xs font-extrabold" style={{ color: '#8B6A00' }}>{item}</li>
                  ) : (
                    <li key={item} className="flex items-start gap-2 text-xs">
                      <CheckCircle size={13} className="mt-0.5 shrink-0" style={{ color: '#059669' }} />
                      <span style={{ color: '#111' }}>{item}</span>
                    </li>
                  ))}
                  {plan.noIncluye.map(item => (
                    <li key={item} className="flex items-start gap-2 text-xs">
                      <X size={13} className="mt-0.5 shrink-0" style={{ color: '#9ca3af' }} />
                      <span style={{ color: '#6b7280' }}>{item}</span>
                    </li>
                  ))}
                </ul>

                <a href={plan.href}
                  className="block w-full text-center py-3 rounded-xl text-xs font-black transition-all hover:scale-105"
                  style={plan.gold
                    ? { background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }
                    : { background: '#FBF3DD', border: '1px solid rgba(122,98,22,0.16)', color: '#111' }}>
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>

          {LANZADO && <p className="text-xs text-center max-w-2xl mx-auto mb-16" style={{ color: '#6b7280' }}>{NOTA_PLANES}</p>}

          <div className="mb-16">
            <h2 className="text-xl font-black text-center mb-8">Preguntas frecuentes sobre precios</h2>
            <div className="space-y-4 max-w-2xl mx-auto">
              {FAQ.map(f => (
                <div key={f.q} className="p-5 rounded-xl" style={{ background: '#FFFDF7', border: '1px solid rgba(122,98,22,0.16)' }}>
                  <p className="text-sm font-bold mb-2">{f.q}</p>
                  <p className="text-xs leading-relaxed" style={{ color: '#4b5563' }}>{f.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 rounded-2xl text-center" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
            <p className="text-lg font-black mb-2">¿Aún tienes dudas?</p>
            <p className="text-xs mb-5" style={{ color: '#374151' }}>Escríbenos a info@xpeak.site o usa el chat de soporte en el dashboard.</p>
            <a href="/auth?mode=register" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              Empezar →
            </a>
          </div>

        </main>
        <FooterPublic />
      </div>
    </>
  );
}
