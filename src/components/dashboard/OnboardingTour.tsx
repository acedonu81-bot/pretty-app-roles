import { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Zap, MessageCircle, User, Search, Star, Building2, CheckCircle } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';

interface TourStep {
  icon: React.ReactNode;
  title: string;
  body: string;
  highlight?: string;
  view?: string; // dashboard view to navigate to on CTA
  cta?: string;
}

const PROFESSIONAL_STEPS: TourStep[] = [
  {
    icon: <User size={22} />,
    title: '¡Bienvenido/a a XPEAK!',
    body: 'La plataforma donde el talento nocturno encuentra su siguiente contrato. Este tour te explica lo esencial en 60 segundos.',
    highlight: 'Comencemos 👇',
  },
  {
    icon: <User size={22} />,
    title: 'Completa tu perfil',
    body: 'Foto, bio, rider técnico, tarifa y géneros. Los empresarios buscan por todos estos campos. Un perfil completo multiplica por 5 las visitas.',
    view: 'profile',
    cta: 'Ir a mi perfil →',
  },
  {
    icon: <Search size={22} />,
    title: 'Así te ven los empresarios',
    body: 'Apareces en el Directorio filtrado por rol, zona y sello de verificación. Revisa cómo queda tu ficha y asegúrate de que la información es correcta.',
    view: 'dj',
    cta: 'Ver Directorio →',
  },
  {
    icon: <Zap size={22} />,
    title: 'Flash Booking — contratos en minutos',
    body: 'Activa tu disponibilidad y los empresarios te ven en tiempo real. También puedes responder a las ofertas urgentes que publican.',
    highlight: '⚡ Sin intermediarios, sin comisiones ocultas.',
  },
  {
    icon: <MessageCircle size={22} />,
    title: 'Mensajes privados',
    body: 'Comunícate directamente con cualquier profesional o empresario. Los mensajes son cifrados y solo visibles entre vosotros.',
    view: 'messages',
    cta: 'Ver mensajes →',
  },
  {
    icon: <Star size={22} />,
    title: 'Sello de Oro XPEAK',
    body: 'Sube un vídeo de 30–90 segundos demostrando tu trabajo. El equipo lo revisa en 24h. El sello te posiciona primero en todas las búsquedas.',
    view: 'profile',
    cta: 'Solicitar sello →',
  },
  {
    icon: <CheckCircle size={22} />,
    title: '¡Listo! Ya sabes lo esencial',
    body: 'Explora el resto a tu ritmo: Fan Club, Escenario Virtual, Estadísticas y más. Cualquier duda, usa el botón de contacto.',
    highlight: 'Empieza ahora y consigue tu primer booking. 🎯',
  },
];

const EMPRESARIO_STEPS: TourStep[] = [
  {
    icon: <Building2 size={22} />,
    title: '¡Bienvenido/a a XPEAK!',
    body: 'El marketplace de talento nocturno. Contrata DJs, staff, makeup, media y más — con perfiles verificados y contratos cerrados en minutos.',
    highlight: 'Comencemos 👇',
  },
  {
    icon: <Search size={22} />,
    title: 'Encuentra el talento que necesitas',
    body: 'Usa el Directorio para filtrar por rol, zona, disponibilidad y sello de verificación. Cada ficha tiene audio, vídeo y rider técnico.',
    view: 'empresario',
    cta: 'Ir al Directorio →',
  },
  {
    icon: <Zap size={22} />,
    title: 'Flash Booking — urgencias resueltas',
    body: 'Publica una oferta que caduca en 2 horas. Los profesionales disponibles ahora mismo te responden directamente. Sin esperas, sin agencias.',
    view: 'flashbooking',
    cta: 'Publicar oferta →',
  },
  {
    icon: <MessageCircle size={22} />,
    title: 'Contacto directo',
    body: 'Chatea con cualquier profesional desde su perfil o desde Mensajes. Sin formularios intermediarios — tú decides con quién hablas.',
    view: 'messages',
    cta: 'Ver mensajes →',
  },
  {
    icon: <Star size={22} />,
    title: 'Top Weekend',
    body: 'Cada semana destacamos a los profesionales más valorados de la plataforma. Ideal para eventos importantes donde necesitas lo mejor.',
    view: 'topweekend',
    cta: 'Ver Top Weekend →',
  },
  {
    icon: <CheckCircle size={22} />,
    title: '¡Todo listo!',
    body: 'Empieza buscando en el Directorio o publica tu primera oferta Flash. Tu historial de contrataciones y estadísticas estarán siempre disponibles.',
    highlight: 'El talento que necesitas, cuando lo necesitas. ⚡',
  },
];

const TOUR_KEY = 'xpeak_tour_v1_done';

interface Props {
  onNavigate: (view: string) => void;
}

const OnboardingTour = ({ onNavigate }: Props) => {
  const profile = useProfile();
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show tour only once — after a short delay so the dashboard renders first
    if (!profile.loading && !localStorage.getItem(TOUR_KEY)) {
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, [profile.loading]);

  if (!visible) return null;

  const steps = profile.role === 'empresario' ? EMPRESARIO_STEPS : PROFESSIONAL_STEPS;
  const current = steps[step];
  const isLast = step === steps.length - 1;
  const progressPct = ((step + 1) / steps.length) * 100;

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(TOUR_KEY, '1');
  };

  const next = () => {
    if (isLast) { dismiss(); return; }
    setStep(s => s + 1);
  };

  const handleCta = () => {
    if (current.view) onNavigate(current.view);
    next();
  };

  return (
    <div
      className="fixed z-50 bottom-6 left-1/2 -translate-x-1/2 w-[340px] animate-[fadeIn_0.4s_ease]"
      style={{
        background: 'rgba(8,8,12,0.97)',
        border: '1px solid rgba(212,175,55,0.3)',
        borderRadius: 20,
        boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(212,175,55,0.1)',
        backdropFilter: 'blur(24px)',
      }}
    >
      {/* Progress bar */}
      <div className="h-[3px] w-full rounded-t-[20px] overflow-hidden"
        style={{ background: 'rgba(212,175,55,0.1)' }}>
        <div className="h-full transition-all duration-500"
          style={{ width: `${progressPct}%`, background: 'linear-gradient(90deg,#D4AF37,#E8C547)' }} />
      </div>

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
              {current.icon}
            </div>
            <div>
              <p className="text-[0.55rem] font-black tracking-widest" style={{ color: 'rgba(212,175,55,0.6)' }}>
                PASO {step + 1} DE {steps.length}
              </p>
              <p className="text-sm font-bold leading-tight">{current.title}</p>
            </div>
          </div>
          <button onClick={dismiss}
            className="p-1.5 rounded-lg transition-all hover:bg-white/10 flex-shrink-0 -mt-0.5 -mr-0.5"
            style={{ color: 'rgba(255,255,255,0.3)' }}>
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <p className="text-xs text-muted-foreground leading-relaxed mb-3">{current.body}</p>

        {current.highlight && (
          <div className="rounded-xl px-3 py-2 mb-3"
            style={{ background: 'rgba(212,175,55,0.07)', border: '1px solid rgba(212,175,55,0.15)' }}>
            <p className="text-[0.65rem] font-bold" style={{ color: '#D4AF37' }}>{current.highlight}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 mt-4">
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)}
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all hover:bg-white/5"
              style={{ border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}>
              <ChevronLeft size={15} />
            </button>
          )}

          {current.cta && !isLast ? (
            <>
              <button onClick={handleCta}
                className="flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02]"
                style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                {current.cta}
              </button>
              <button onClick={next}
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all hover:bg-white/5"
                style={{ border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}>
                <ChevronRight size={15} />
              </button>
            </>
          ) : (
            <button onClick={next}
              className="flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02]"
              style={{
                background: isLast ? 'linear-gradient(90deg,#D4AF37,#B8941E)' : 'rgba(255,255,255,0.05)',
                color: isLast ? '#000' : 'rgba(255,255,255,0.7)',
                border: isLast ? 'none' : '1px solid rgba(255,255,255,0.08)',
              }}>
              {isLast ? '¡Empezar! 🚀' : 'Siguiente'}
              {!isLast && <ChevronRight size={13} />}
            </button>
          )}
        </div>

        {/* Step dots */}
        <div className="flex justify-center gap-1.5 mt-3">
          {steps.map((_, i) => (
            <button key={i} onClick={() => setStep(i)}
              className="rounded-full transition-all"
              style={{
                width: i === step ? 16 : 5,
                height: 5,
                background: i === step ? '#D4AF37' : 'rgba(255,255,255,0.12)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OnboardingTour;
