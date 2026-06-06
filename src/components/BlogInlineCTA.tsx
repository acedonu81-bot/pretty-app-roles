interface BlogInlineCTAProps {
  role?: 'dj' | 'staff' | 'makeup' | 'fotografo' | 'general';
  orgLabel?: string;
  variant?: 'default' | 'upgrade';
}

const CONFIG = {
  dj: {
    pro: { label: '¿Eres DJ?', cta: 'Publica tu tarifa gratis →', href: '/auth?mode=register&role=dj' },
    org: { label: '¿Buscas DJ para tu evento?', cta: 'Ver DJs disponibles →', href: '/contratar-dj' },
    upgrade: {
      eyebrow: 'XPEAK · Gratis · Sin compromiso',
      headline: 'Recibe 3 presupuestos de DJs verificados para tu evento',
      sub: 'DJs reales con portfolio verificado. Compara precios y contrata con contrato digital automático.',
      cta: 'Solicitar presupuestos gratis →',
      href: '/auth?mode=register&intent=contratar-dj',
      badge: '3 presupuestos en 24h',
    },
  },
  staff: {
    pro: { label: '¿Eres camarero o staff?', cta: 'Crea tu perfil gratis →', href: '/auth?mode=register&role=staff' },
    org: { label: '¿Necesitas camareros o staff?', cta: 'Ver staff disponible →', href: '/contratar-staff' },
    upgrade: {
      eyebrow: 'XPEAK · Gratis · Sin compromiso',
      headline: 'Encuentra staff verificado para tu evento en 24h',
      sub: 'Camareros, azafatas y promotores con experiencia comprobada. Sin intermediarios.',
      cta: 'Ver staff disponible →',
      href: '/auth?mode=register&intent=contratar-staff',
      badge: 'Respuesta en 24h',
    },
  },
  makeup: {
    pro: { label: '¿Eres maquilladora?', cta: 'Publica tu tarifa gratis →', href: '/auth?mode=register&role=makeup' },
    org: { label: '¿Buscas maquilladora para tu evento?', cta: 'Ver maquilladoras →', href: '/contratar-maquillaje' },
    upgrade: {
      eyebrow: 'XPEAK · Gratis · Sin compromiso',
      headline: 'Recibe presupuestos de maquilladoras verificadas',
      sub: 'Compara portfolios y precios. Contrata con contrato digital.',
      cta: 'Solicitar presupuestos →',
      href: '/auth?mode=register&intent=contratar-makeup',
      badge: 'Presupuesto gratis',
    },
  },
  fotografo: {
    pro: { label: '¿Eres fotógrafo?', cta: 'Publica tu tarifa gratis →', href: '/auth?mode=register&role=media' },
    org: { label: '¿Buscas fotógrafo?', cta: 'Ver fotógrafos →', href: '/contratar-fotografo' },
    upgrade: {
      eyebrow: 'XPEAK · Gratis · Sin compromiso',
      headline: 'Recibe presupuestos de fotógrafos verificados para tu boda',
      sub: 'Compara portfolios reales y precios. Contrata con contrato digital automático.',
      cta: 'Solicitar presupuestos →',
      href: '/auth?mode=register&intent=contratar-fotografo',
      badge: 'Presupuesto gratis',
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
  const c = CONFIG[role];

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
          <p className="text-base font-black leading-snug mb-2" style={{ color: '#fff' }}>{u.headline}</p>
          <p className="text-xs leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.55)' }}>{u.sub}</p>
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
            XPEAK · Directorio verificado · 31 profesionales · 0€ comisión
          </p>
          <p className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.85)' }}>{c.pro.label}</p>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {c.org.label}
          </p>
        </div>
        <div className="flex flex-col gap-2 flex-shrink-0">
          <a href={c.pro.href}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105"
            style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000', whiteSpace: 'nowrap' }}>
            {c.pro.cta}
          </a>
          <a href={c.org.href}
            className="inline-flex items-center justify-center px-5 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105"
            style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.08)', whiteSpace: 'nowrap' }}>
            {c.org.cta}
          </a>
        </div>
      </div>
    </div>
  );
}
