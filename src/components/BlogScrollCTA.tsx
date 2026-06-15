import { useEffect, useState } from 'react';

interface BlogScrollCTAProps {
  role?: 'dj' | 'staff' | 'azafata' | 'general' | 'empresario';
  storageKey?: string;
}

const CONFIG = {
  dj: {
    label: '¿Buscas DJ para tu evento?',
    sub: 'Recibe 3 presupuestos reales de DJs verificados — gratis y sin compromiso.',
    cta: 'Solicitar presupuestos →',
    href: '/auth?mode=register&intent=contratar-dj',
  },
  staff: {
    label: '¿Necesitas camareros o staff?',
    sub: 'Conecta con profesionales verificados para tu evento en 24h.',
    cta: 'Ver staff disponible →',
    href: '/auth?mode=register&intent=contratar-staff',
  },
  azafata: {
    label: '¿Necesitas azafatas para tu evento?',
    sub: 'Recibe presupuestos de azafatas verificadas — gratis y sin compromiso.',
    cta: 'Solicitar presupuestos →',
    href: '/auth?mode=register&intent=contratar-azafata',
  },
  general: {
    label: '¿Buscas profesionales para tu evento?',
    sub: 'Directorio verificado de DJs, staff y azafatas. 0€ comisión.',
    cta: 'Ver profesionales →',
    href: '/auth?mode=register',
  },
  empresario: {
    label: '¿Organizas eventos o bodas?',
    sub: 'Contrata DJ, camareros y fotógrafo con Flash Booking en menos de 1h.',
    cta: 'Ver profesionales disponibles →',
    href: '/auth?mode=register&role=empresario',
  },
};

export default function BlogScrollCTA({ role = 'general', storageKey }: BlogScrollCTAProps) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const key = storageKey ?? `xpeak_scrollcta_dismissed_${role}`;

  useEffect(() => {
    if (sessionStorage.getItem(key)) {
      setDismissed(true);
      return;
    }

    const handleScroll = () => {
      const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (scrolled > 0.35) setVisible(true);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [key]);

  if (dismissed) return null;

  const c = CONFIG[role];

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 transition-transform duration-500"
      style={{ transform: visible ? 'translateY(0)' : 'translateY(100%)' }}
    >
      <div
        className="mx-auto max-w-3xl mb-3 mx-3 sm:mx-auto rounded-2xl px-4 py-3 flex items-center justify-between gap-4"
        style={{
          background: 'rgba(10,10,10,0.97)',
          border: '1px solid rgba(212,175,55,0.35)',
          boxShadow: '0 -4px 40px rgba(212,175,55,0.12)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="min-w-0">
          <p className="text-xs font-black truncate" style={{ color: '#fff' }}>{c.label}</p>
          <p className="text-[0.65rem] hidden sm:block truncate" style={{ color: 'rgba(255,255,255,0.5)' }}>{c.sub}</p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            href={c.href}
            className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-black transition-all hover:scale-105 whitespace-nowrap"
            style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}
          >
            {c.cta}
          </a>
          <button
            onClick={() => { setDismissed(true); sessionStorage.setItem(key, '1'); }}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:opacity-70 flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
