interface BlogInlineCTAProps {
  role?: 'dj' | 'staff' | 'azafata' | 'makeup' | 'fotografo' | 'bailarin' | 'general';
  orgLabel?: string;
  variant?: 'default' | 'upgrade';
}

const CONFIG = {
  dj: {
    pro: { label: '¿Eres DJ?', cta: 'Publica tu tarifa gratis →', href: '/auth?mode=register&role=dj' },
    org: { label: '¿Buscas DJ para tu evento?', cta: 'Ver DJs disponibles →', href: '/contratar-dj' },
    upgrade: {
      eyebrow: 'XPEAK · Gratis · Sin comisión',
      headline: 'Encuentra DJ verificado para tu evento con Flash Booking',
      sub: 'DJs con portfolio verificado, tarifas públicas y contrato digital automático. Flash Booking: respuesta en menos de 1 hora.',
      cta: 'Ver DJs disponibles →',
      href: '/auth?mode=register&intent=contratar-dj',
      badge: 'Flash Booking <1h',
    },
  },
  staff: {
    pro: { label: '¿Eres camarero o staff?', cta: 'Crea tu perfil gratis →', href: '/auth?mode=register&role=staff' },
    org: { label: '¿Necesitas camareros o staff?', cta: 'Ver staff disponible →', href: '/contratar-staff' },
    upgrade: {
      eyebrow: 'XPEAK · Gratis · Sin comisión',
      headline: 'Encuentra camareros y staff verificado para tu evento',
      sub: 'Personal con experiencia comprobada. Flash Booking disponible para urgencias en menos de 1 hora.',
      cta: 'Ver staff disponible →',
      href: '/auth?mode=register&intent=contratar-staff',
      badge: 'Flash Booking <1h',
    },
  },
  azafata: {
    pro: { label: '¿Eres azafata?', cta: 'Crea tu perfil gratis →', href: '/auth?mode=register&role=azafata' },
    org: { label: '¿Necesitas azafatas para tu evento?', cta: 'Ver azafatas disponibles →', href: '/contratar-azafata' },
    upgrade: {
      eyebrow: 'XPEAK · Gratis · Sin comisión',
      headline: 'Encuentra azafatas verificadas para tu evento',
      sub: 'Profesionales con experiencia comprobada en ferias, congresos y eventos corporativos. Flash Booking disponible para urgencias en menos de 1 hora.',
      cta: 'Ver azafatas disponibles →',
      href: '/auth?mode=register&intent=contratar-azafata',
      badge: 'Flash Booking <1h',
    },
  },
  makeup: {
    pro: { label: '¿Eres maquilladora?', cta: 'Publica tu tarifa gratis →', href: '/auth?mode=register&role=makeup' },
    org: { label: '¿Buscas maquilladora para tu evento?', cta: 'Ver maquilladoras →', href: '/contratar-maquillaje' },
    upgrade: {
      eyebrow: 'XPEAK · Gratis · Sin comisión',
      headline: 'Encuentra maquilladora profesional verificada para tu evento',
      sub: 'Portfolios reales, tarifas públicas y contrato digital automático. Sin intermediarios.',
      cta: 'Ver maquilladoras →',
      href: '/auth?mode=register&intent=contratar-makeup',
      badge: 'Directorio verificado',
    },
  },
  fotografo: {
    pro: { label: '¿Eres fotógrafo?', cta: 'Publica tu tarifa gratis →', href: '/auth?mode=register&role=media' },
    org: { label: '¿Buscas fotógrafo?', cta: 'Ver fotógrafos →', href: '/contratar-fotografo' },
    upgrade: {
      eyebrow: 'XPEAK · Gratis · Sin comisión',
      headline: 'Encuentra fotógrafo verificado para tu boda o evento',
      sub: 'Portfolios reales, tarifas públicas y contrato digital. Flash Booking disponible para fechas urgentes.',
      cta: 'Ver fotógrafos disponibles →',
      href: '/auth?mode=register&intent=contratar-fotografo',
      badge: 'Flash Booking <1h',
    },
  },
  general: {
    pro: { label: '¿Eres profesional de eventos?', cta: 'Publica tu tarifa gratis →', href: '/auth?mode=register&role=profesional' },
    org: { label: '¿Necesitas talento para tu evento?', cta: 'Ver profesionales →', href: '/auth' },
    upgrade: {
      eyebrow: 'XPEAK · Gratis · Sin compromiso',
      headline: 'Recibe presupuestos de profesionales verificados para tu evento',
      sub: 'DJs, staff, azafatas y más. Directorio verificado, 0€ comisión.',
      cta: 'Solicitar presupuestos →',
      href: '/auth?mode=register',
      badge: 'Gratis, sin compromiso',
    },
  },
};

export default function BlogInlineCTA({ role = 'general', variant = 'default' }: BlogInlineCTAProps) {
  const c = CONFIG[role as keyof typeof CONFIG] ?? CONFIG.general;

  if (variant === 'upgrade') {
    const u = c.upgrade;
    return (
      <div className="my-8 rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(212,175,55,0.3)', background: 'linear-gradient(135deg, rgba(212,175,55,0.06) 0%, rgba(212,175,55,0.02) 100%)' }}>
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4 mb-3">
            <p className="text-[0.6rem] font-black uppercase tracking-widest" style={{ color: 'rgba(212,175,55,0.7)' }}>
              {u.eyebrow}
            </p>
            <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded-full shrink-0" style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.25)' }}>
              {u.badge}
            </span>
          </div>
          <p className="text-base font-black leading-snug mb-2" style={{ color: '#111' }}>{u.headline}</p>
          <p className="text-xs leading-relaxed mb-4" style={{ color: '#444' }}>{u.sub}</p>
          <a
            href={u.href}
            className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-black transition-all hover:scale-105"
            style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}
          >
            {u.cta}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="my-8 rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(212,175,55,0.2)', background: 'rgba(212,175,55,0.04)' }}>
      <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[0.6rem] font-black uppercase tracking-widest mb-1" style={{ color: 'rgba(212,175,55,0.6)' }}>
            XPEAK · Directorio verificado · 0€ comisión
          </p>
          <p className="text-sm font-bold" style={{ color: '#111' }}>{c.pro.label}</p>
          <p className="text-xs mt-0.5" style={{ color: '#333' }}>
            {c.org.label}
          </p>
        </div>
        <div className="flex flex-col gap-2 flex-shrink-0">
          {/* CTA principal: registro (lleva a /auth) — antes tenía casi el
              mismo peso visual que el secundario. Ahora es claramente el
              dominante (más padding, sombra) y el secundario reduce tamaño
              de fuente para no competir. */}
          <a href={c.pro.href}
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-black transition-all hover:scale-105"
            style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000', whiteSpace: 'nowrap', boxShadow: '0 4px 14px rgba(212,175,55,0.35)' }}>
            {c.pro.cta}
          </a>
          <a href={c.org.href}
            className="inline-flex items-center justify-center px-5 py-1.5 rounded-xl text-[0.7rem] font-bold transition-all hover:scale-105"
            style={{ background: 'transparent', color: '#666', whiteSpace: 'nowrap' }}>
            {c.org.cta}
          </a>
        </div>
      </div>
    </div>
  );
}
