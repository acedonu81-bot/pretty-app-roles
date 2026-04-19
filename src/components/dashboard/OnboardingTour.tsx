import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Zap, MessageCircle, User, Search, Star, Building2, CheckCircle } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';

interface TourStep {
  icon: React.ReactNode;
  title: string;
  body: string;
  highlight?: string;
  view?: string;
  cta?: string;
}

const PROFESSIONAL_STEPS: TourStep[] = [
  {
    icon: <User size={20} />,
    title: '¡Bienvenido/a a XPEAK!',
    body: 'La plataforma donde el talento nocturno encuentra su siguiente contrato. Este tour te explica lo esencial en 60 segundos.',
    highlight: 'Comencemos.',
  },
  {
    icon: <User size={20} />,
    title: 'Completa tu perfil',
    body: 'Foto, bio, rider técnico, tarifa y géneros. Los empresarios buscan por todos estos campos. Un perfil completo multiplica por 5 las visitas.',
    view: 'profile',
    cta: 'Ir a mi perfil →',
  },
  {
    icon: <Search size={20} />,
    title: 'Así te ven los empresarios',
    body: 'Apareces en el Directorio filtrado por rol, zona y sello de verificación. Revisa cómo queda tu ficha.',
    view: 'dj',
    cta: 'Ver Directorio →',
  },
  {
    icon: <Zap size={20} />,
    title: 'Flash Booking',
    body: 'Activa tu disponibilidad y los empresarios te ven en tiempo real. Responde a ofertas urgentes directamente.',
    highlight: 'Sin intermediarios, sin comisiones ocultas.',
  },
  {
    icon: <MessageCircle size={20} />,
    title: 'Mensajes privados',
    body: 'Comunícate directamente con cualquier profesional o empresario. Rápido, directo, sin formularios.',
    view: 'messages',
    cta: 'Ver mensajes →',
  },
  {
    icon: <Star size={20} />,
    title: 'Sello de Oro XPEAK',
    body: 'Sube un vídeo demostrando tu trabajo. El equipo lo revisa en 24h. El sello te posiciona primero en todas las búsquedas.',
    view: 'profile',
    cta: 'Solicitar sello →',
  },
  {
    icon: <CheckCircle size={20} />,
    title: '¡Listo! Ya sabes lo esencial',
    body: 'Explora Fan Club, Escenario Virtual, Estadísticas y más. Cualquier duda, usa el asistente de soporte.',
    highlight: 'Empieza ahora y consigue tu primer booking.',
  },
];

const EMPRESARIO_STEPS: TourStep[] = [
  {
    icon: <Building2 size={20} />,
    title: '¡Bienvenido/a a XPEAK!',
    body: 'El marketplace de talento nocturno. Contrata DJs, staff, makeup y media — con contratos cerrados en minutos.',
    highlight: 'Comencemos.',
  },
  {
    icon: <Search size={20} />,
    title: 'Encuentra el talento',
    body: 'Usa el Directorio para filtrar por rol, zona, disponibilidad y verificación. Cada ficha tiene audio, vídeo y rider técnico.',
    view: 'empresario',
    cta: 'Ir al Panel →',
  },
  {
    icon: <Zap size={20} />,
    title: 'Flash Booking',
    body: 'Publica una oferta que caduca en 2 horas. Los profesionales disponibles ahora mismo te responden directamente.',
    view: 'flashbooking',
    cta: 'Publicar oferta →',
  },
  {
    icon: <MessageCircle size={20} />,
    title: 'Contacto directo',
    body: 'Chatea con cualquier profesional desde su perfil o desde Mensajes. Tú decides con quién hablas.',
    view: 'messages',
    cta: 'Ver mensajes →',
  },
  {
    icon: <Star size={20} />,
    title: 'Top Weekend',
    body: 'Cada semana destacamos a los mejores profesionales disponibles. Ideal para eventos donde necesitas lo mejor.',
    view: 'topweekend',
    cta: 'Ver Top Weekend →',
  },
  {
    icon: <CheckCircle size={20} />,
    title: '¡Todo listo!',
    body: 'Empieza buscando en el Directorio o publica tu primera oferta Flash.',
    highlight: 'El talento que necesitas, cuando lo necesitas.',
  },
];

const TOUR_KEY = 'xpeak_tour_v1_done';

// Blue palette (Calendar accent)
const BLUE = '#4285F4';
const BLUE_DIM = 'rgba(66,133,244,0.12)';
const BLUE_BORDER = 'rgba(66,133,244,0.25)';
const BLUE_GLOW = 'rgba(66,133,244,0.35)';

interface Props { onNavigate: (view: string) => void; }

const OnboardingTour = ({ onNavigate }: Props) => {
  const profile = useProfile();
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
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

  const next = () => { if (isLast) { dismiss(); return; } setStep(s => s + 1); };
  const handleCta = () => { if (current.view) onNavigate(current.view); next(); };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-end justify-center pb-6 px-4"
      style={{ paddingLeft: 'max(1rem, calc(260px + 1rem))' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          className="pointer-events-auto w-full max-w-[360px] rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(6,8,16,0.97)',
            border: `1px solid ${BLUE_BORDER}`,
            boxShadow: `0 20px 60px rgba(0,0,0,0.85), 0 0 0 1px rgba(66,133,244,0.08), 0 0 40px ${BLUE_GLOW}`,
            backdropFilter: 'blur(28px)',
          }}
        >
          {/* Progress bar */}
          <div className="h-[3px] w-full" style={{ background: 'rgba(66,133,244,0.1)' }}>
            <motion.div className="h-full"
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              style={{ background: `linear-gradient(90deg, ${BLUE}, #6BA3F5)` }} />
          </div>

          <div className="p-5">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: BLUE_DIM, border: `1px solid ${BLUE_BORDER}`, color: BLUE }}>
                  {current.icon}
                </div>
                <div>
                  <p className="text-[0.68rem] font-black tracking-widest uppercase"
                    style={{ color: `${BLUE}99` }}>
                    Paso {step + 1} de {steps.length}
                  </p>
                  <p className="text-[0.9rem] font-bold leading-tight mt-0.5">{current.title}</p>
                </div>
              </div>
              <button type="button" onClick={dismiss}
                className="p-1.5 rounded-lg transition-all hover:bg-white/8 flex-shrink-0 -mt-0.5 -mr-0.5"
                style={{ color: 'rgba(255,255,255,0.3)' }}
                aria-label="Cerrar tour">
                <X size={14} />
              </button>
            </div>

            {/* Body */}
            <p className="text-[0.82rem] leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.72)' }}>
              {current.body}
            </p>

            {current.highlight && (
              <div className="rounded-xl px-3 py-2.5 mb-3"
                style={{ background: BLUE_DIM, border: `1px solid ${BLUE_BORDER}` }}>
                <p className="text-[0.8rem] font-bold" style={{ color: BLUE }}>{current.highlight}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 mt-4">
              {step > 0 && (
                <button type="button" onClick={() => setStep(s => s - 1)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all hover:bg-white/5"
                  style={{ border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}>
                  <ChevronLeft size={15} />
                </button>
              )}

              {current.cta && !isLast ? (
                <>
                  <button type="button" onClick={handleCta}
                    className="flex-1 py-2.5 rounded-xl font-bold text-[0.8rem] flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] active:scale-95"
                    style={{ background: `linear-gradient(90deg, ${BLUE}, #5A95F5)`, color: '#fff', boxShadow: `0 4px 16px ${BLUE_GLOW}` }}>
                    {current.cta}
                  </button>
                  <button type="button" onClick={next}
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all hover:bg-white/5"
                    style={{ border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}>
                    <ChevronRight size={15} />
                  </button>
                </>
              ) : (
                <button type="button" onClick={next}
                  className="flex-1 py-2.5 rounded-xl font-bold text-[0.8rem] flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] active:scale-95"
                  style={isLast
                    ? { background: `linear-gradient(90deg, ${BLUE}, #5A95F5)`, color: '#fff', boxShadow: `0 4px 16px ${BLUE_GLOW}` }
                    : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.08)' }
                  }>
                  {isLast ? '¡Empezar! 🎧' : 'Siguiente'}
                  {!isLast && <ChevronRight size={13} />}
                </button>
              )}
            </div>

            {/* Step dots */}
            <div className="flex justify-center gap-1.5 mt-3">
              {steps.map((_, i) => (
                <button key={i} type="button" onClick={() => setStep(i)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === step ? 18 : 5,
                    height: 5,
                    background: i === step ? BLUE : 'rgba(255,255,255,0.12)',
                    boxShadow: i === step ? `0 0 8px ${BLUE}` : 'none',
                  }}
                  aria-label={`Ir al paso ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default OnboardingTour;
