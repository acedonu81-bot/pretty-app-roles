import { useEffect, useState } from 'react';
import { UserPlus } from 'lucide-react';

type ProfessionalRole =
  | 'dj_pro'
  | 'staff_pro'
  | 'azafata_pro'
  | 'bailarin_pro'
  | 'mago_pro'
  | 'humorista_pro'
  | 'speaker_pro'
  | 'makeup_pro'
  | 'vestuario_pro'
  | 'profesional_pro';

interface BlogScrollCTAProps {
  role?: 'dj' | 'staff' | 'azafata' | 'fotografo' | 'bailarin' | 'general' | 'empresario' | ProfessionalRole;
  storageKey?: string;
}

const CONFIG = {
  dj: {
    label: '¿Buscas DJ para tu evento?',
    sub: 'Recibe 3 presupuestos reales de DJs verificados.',
    cta: 'Solicitar presupuestos →',
    href: '/auth?mode=register&intent=contratar-dj',
  },
  staff: {
    label: '¿Necesitas camareros o staff?',
    sub: 'Conecta con profesionales verificados para tu evento en 24h.',
    cta: 'Ver staff disponible →',
    href: '/auth?mode=register&intent=contratar-staff',
  },
  staff_pro: {
    label: '¿Eres camarero o staff de eventos?',
    sub: 'Publica tu perfil gratis y que los organizadores te encuentren a ti.',
    cta: 'Crear mi perfil →',
    href: '/auth?mode=register&role=staff',
  },
  azafata: {
    label: '¿Necesitas azafatas para tu evento?',
    sub: 'Recibe presupuestos de azafatas verificadas.',
    cta: 'Solicitar presupuestos →',
    href: '/auth?mode=register&intent=contratar-azafata',
  },
  fotografo: {
    label: '¿Buscas fotógrafo para tu evento?',
    sub: 'Portfolios reales y tarifas públicas.',
    cta: 'Ver fotógrafos disponibles →',
    href: '/auth?mode=register&intent=contratar-fotografo',
  },
  bailarin: {
    label: '¿Buscas instructor o bailarín?',
    sub: 'Bailarines para eventos e instructores de salsa/bachata.',
    cta: 'Ver bailarines disponibles →',
    href: '/auth?mode=register&intent=contratar-bailarin',
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
  dj_pro: {
    label: '¿Eres DJ?',
    sub: 'Publica tu tarifa y que te encuentren salas y promotoras.',
    cta: 'Crear mi perfil →',
    href: '/auth?mode=register&role=dj',
  },
  azafata_pro: {
    label: '¿Eres azafata de eventos?',
    sub: 'Publica tu perfil gratis y que te encuentren directamente.',
    cta: 'Crear mi perfil →',
    href: '/auth?mode=register&role=azafata',
  },
  bailarin_pro: {
    label: '¿Eres bailarín o instructor?',
    sub: 'Publica tu perfil y consigue bolos y clases.',
    cta: 'Crear mi perfil →',
    href: '/auth?mode=register&role=bailarin',
  },
  mago_pro: {
    label: '¿Eres mago de eventos?',
    sub: 'Publica tu perfil gratis y que te encuentren directamente.',
    cta: 'Crear mi perfil →',
    href: '/auth?mode=register&role=mago',
  },
  humorista_pro: {
    label: '¿Eres humorista o monologuista?',
    sub: 'Publica tu perfil y consigue bolos en eventos.',
    cta: 'Crear mi perfil →',
    href: '/auth?mode=register&role=humorista',
  },
  speaker_pro: {
    label: '¿Eres speaker o presentador?',
    sub: 'Publica tu perfil y que te encuentren para eventos.',
    cta: 'Crear mi perfil →',
    href: '/auth?mode=register&role=speaker',
  },
  makeup_pro: {
    label: '¿Eres maquilladora de eventos?',
    sub: 'Publica tu perfil gratis y consigue clientas de tu zona.',
    cta: 'Crear mi perfil →',
    href: '/auth?mode=register&role=makeup',
  },
  vestuario_pro: {
    label: '¿Eres estilista o profesional de vestuario?',
    sub: 'Publica tu perfil gratis y que te encuentren directamente.',
    cta: 'Crear mi perfil →',
    href: '/auth?mode=register&role=vestuario',
  },
  profesional_pro: {
    label: '¿Eres profesional de eventos?',
    sub: 'Publica tu perfil y que te contraten directamente. 0% comisión.',
    cta: 'Crear mi perfil →',
    href: '/auth?mode=register&role=profesional',
  },
};

export default function BlogScrollCTA({ role = 'general', storageKey }: BlogScrollCTAProps) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [pulse, setPulse] = useState(true);

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

  useEffect(() => {
    if (!visible || dismissed) return;
    let stopTimer: ReturnType<typeof setTimeout>;
    const runPulse = () => {
      setPulse(true);
      stopTimer = setTimeout(() => setPulse(false), 5000);
    };
    runPulse();
    const repeatTimer = setInterval(runPulse, 9000);
    return () => { clearTimeout(stopTimer); clearInterval(repeatTimer); };
  }, [visible, dismissed]);

  if (dismissed) return null;

  const c = CONFIG[role];

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 transition-transform duration-500"
      style={{ transform: visible ? 'translateY(0)' : 'translateY(100%)' }}
    >
      <div
        className={`max-w-3xl mx-3 mb-3 sm:mx-auto rounded-2xl px-4 py-4 sm:px-6 sm:py-4 flex items-center justify-between gap-4 ${pulse ? 'xpeak-cta-pulse' : ''}`}
        style={{
          background: 'linear-gradient(90deg,#FFFDF7,#FBF3DD)',
          border: '3px solid #D4AF37',
          boxShadow: '0 -6px 40px rgba(212,175,55,0.35), 0 0 0 4px rgba(212,175,55,0.08)',
        }}
        onMouseEnter={() => setPulse(false)}
      >
        <style>{`
          @keyframes xpeakCtaPulse {
            0%, 100% { box-shadow: 0 -6px 40px rgba(212,175,55,0.35), 0 0 0 4px rgba(212,175,55,0.08); transform: scale(1); }
            50% { box-shadow: 0 -14px 80px rgba(212,175,55,0.85), 0 0 0 8px rgba(212,175,55,0.18); transform: scale(1.015); }
          }
          .xpeak-cta-pulse { animation: xpeakCtaPulse 0.9s ease-in-out 5; }
        `}</style>
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0"
            style={{ background: 'rgba(212,175,55,0.18)' }}
          >
            <UserPlus size={20} color="#B8941E" />
          </div>
          <div className="min-w-0">
            <p className="text-sm sm:text-base font-black leading-snug" style={{ color: '#1a1a1a' }}>{c.label}</p>
            <p className="text-xs hidden sm:block truncate" style={{ color: '#6b6b6b' }}>{c.sub}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            href={c.href}
            className="inline-flex items-center px-3 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all hover:scale-105 whitespace-nowrap"
            style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000', boxShadow: '0 2px 20px rgba(212,175,55,0.4)' }}
          >
            <span className="sm:hidden">Crear perfil →</span>
            <span className="hidden sm:inline">{c.cta}</span>
          </a>
          <button
            onClick={() => { setDismissed(true); sessionStorage.setItem(key, '1'); }}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:opacity-70 flex-shrink-0"
            style={{ background: 'rgba(0,0,0,0.06)', color: '#6b6b6b' }}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
