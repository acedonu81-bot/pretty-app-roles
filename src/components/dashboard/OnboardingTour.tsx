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
    title: '¡Ya estás dentro!',
    body: 'XPEAK es donde los profesionales de eventos consiguen bookings sin intermediarios ni comisiones. Este tour dura 60 segundos.',
    highlight: 'Empieza a explorar.',
  },
  {
    icon: <User size={20} />,
    title: 'Completa tu perfil',
    body: 'Foto, bio, tarifa y géneros. Los organizadores buscan por todos estos campos. Un perfil completo multiplica por 5 las visitas.',
    view: 'profile',
    cta: 'Ir a mi perfil →',
  },
  {
    icon: <Search size={20} />,
    title: 'Así te ven los clientes',
    body: 'Tu ficha aparece en el Directorio filtrado por rol, zona y verificación. Cuanto más completa, más arriba sales.',
    view: 'dj',
    cta: 'Ver el Directorio →',
  },
  {
    icon: <Zap size={20} />,
    title: 'Flash Booking',
    body: 'Activa tu disponibilidad y los empresarios te ven en tiempo real. Recibe ofertas urgentes sin moverte del sofá.',
    highlight: 'Sin intermediarios, sin comisiones ocultas.',
    view: 'flashbooking',
    cta: 'Ver Flash Booking →',
  },
  {
    icon: <MessageCircle size={20} />,
    title: 'Mensajes directos',
    body: 'Habla con organizadores y empresarios directamente desde la plataforma. Rápido, privado, sin formularios.',
    view: 'messages',
    cta: 'Ver mensajes →',
  },
  {
    icon: <CheckCircle size={20} />,
    title: '¡Todo listo!',
    body: 'Ya tienes todo lo que necesitas. Empieza completando tu perfil para que te encuentren enseguida.',
    highlight: 'Cualquier duda, usa el chat de soporte.',
  },
];

const EMPRESARIO_STEPS: TourStep[] = [
  {
    icon: <Building2 size={20} />,
    title: '¡Bienvenido/a a XPEAK!',
    body: 'El marketplace de talento para eventos. Contrata DJs, staff, fotógrafos y maquillaje — sin comisiones, directo con el profesional.',
    highlight: 'Empieza a buscar.',
  },
  {
    icon: <Search size={20} />,
    title: 'Directorio de profesionales',
    body: 'Filtra por rol, ciudad, disponibilidad y verificación. Cada ficha tiene audio, fotos y tarifa visible.',
    view: 'empresario',
    cta: 'Ir al directorio →',
  },
  {
    icon: <Zap size={20} />,
    title: 'Flash Booking',
    body: 'Publica una oferta urgente. Los profesionales disponibles ahora mismo te responden en minutos.',
    view: 'flashbooking',
    cta: 'Ver Flash Booking →',
  },
  {
    icon: <MessageCircle size={20} />,
    title: 'Contacto directo',
    body: 'Escribe a cualquier profesional desde su perfil o desde Mensajes. Tú decides sin pasar por nadie más.',
    view: 'messages',
    cta: 'Ver mensajes →',
  },
  {
    icon: <Star size={20} />,
    title: 'Top Weekend',
    body: 'Cada semana destacamos a los mejores profesionales disponibles. Ideal cuando necesitas lo mejor sin buscar mucho.',
    view: 'topweekend',
    cta: 'Ver Top Weekend →',
  },
  {
    icon: <CheckCircle size={20} />,
    title: '¡Todo listo!',
    body: 'Empieza buscando en el Directorio o publica tu primera oferta Flash. Todo gratis, sin comisión.',
    highlight: 'El talento que necesitas, cuando lo necesitas.',
  },
];

const TOUR_KEY = 'xpeak_tour_v2_done';

const BLUE = '#4285F4';
const BLUE_DIM = 'rgba(66,133,244,0.1)';
const BLUE_BORDER = 'rgba(66,133,244,0.22)';
const BLUE_GLOW = 'rgba(66,133,244,0.3)';

interface Props { onNavigate: (view: string) => void; }

const OnboardingTour = ({ onNavigate }: Props) => {
  const profile = useProfile();
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!profile.loading && !localStorage.getItem(TOUR_KEY)) {
      // Solo mostrar tour a usuarios nuevos (menos de 7 días)
      const createdAt = (profile as any).created_at;
      const ageDays = createdAt
        ? (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)
        : 999;
      if (ageDays > 7) { localStorage.setItem(TOUR_KEY, '1'); return; }
      const hasOnboarded = Object.keys(localStorage).some(k => k.startsWith('xpeak_onboarded_'));
      if (hasOnboarded) {
        const t = setTimeout(() => setVisible(true), 1200);
        return () => clearTimeout(t);
      }
    }
  }, [profile.loading]);

  if (!visible) return null;

  const isEmpresario = profile.role === 'empresario';
  const steps = isEmpresario ? EMPRESARIO_STEPS : PROFESSIONAL_STEPS;
  const current = steps[step];
  const isLast = step === steps.length - 1;
  const progressPct = ((step + 1) / steps.length) * 100;

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(TOUR_KEY, '1');
  };

  const next = () => { if (isLast) { dismiss(); return; } setStep(s => s + 1); };
  const handleCta = () => {
    if (current.view) onNavigate(current.view);
    next();
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-end justify-center px-3 pb-20 sm:pb-6 sm:pl-[calc(260px+1rem)]">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          className="pointer-events-auto w-full max-w-[360px] rounded-2xl overflow-hidden"
          style={{
            background: '#ffffff',
            border: `1px solid ${BLUE_BORDER}`,
            boxShadow: `0 20px 60px rgba(0,0,0,0.12), 0 0 0 1px rgba(66,133,244,0.1)`,
          }}
        >
          {/* Progress bar */}
          <div className="h-[3px] w-full" style={{ background: 'rgba(66,133,244,0.12)' }}>
            <motion.div className="h-full"
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              style={{ background: `linear-gradient(90deg, ${BLUE}, #6BA3F5)` }} />
          </div>

          <div className="p-3.5 sm:p-5">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: BLUE_DIM, border: `1px solid ${BLUE_BORDER}`, color: BLUE }}>
                  {current.icon}
                </div>
                <div>
                  <p className="text-[0.65rem] font-black tracking-widest uppercase" style={{ color: `${BLUE}99` }}>
                    {step + 1} / {steps.length}
                  </p>
                  <p className="text-[0.88rem] font-bold leading-tight mt-0.5" style={{ color: '#111' }}>
                    {current.title}
                  </p>
                </div>
              </div>
              <button type="button" onClick={dismiss}
                className="p-1.5 rounded-lg transition-all hover:bg-black/5 flex-shrink-0"
                style={{ color: '#333' }} aria-label="Cerrar tour">
                <X size={14} />
              </button>
            </div>

            {/* Body */}
            <p className="text-[0.82rem] leading-relaxed mb-3" style={{ color: '#555' }}>
              {current.body}
            </p>

            {current.highlight && (
              <div className="rounded-xl px-3 py-2.5 mb-3"
                style={{ background: BLUE_DIM, border: `1px solid ${BLUE_BORDER}` }}>
                <p className="text-[0.78rem] font-bold" style={{ color: BLUE }}>{current.highlight}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 mt-4">
              {step > 0 && (
                <button type="button" onClick={() => setStep(s => s - 1)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all hover:bg-black/5"
                  style={{ border: '1px solid rgba(0,0,0,0.08)', color: '#333' }}>
                  <ChevronLeft size={15} />
                </button>
              )}

              {current.cta && !isLast ? (
                <>
                  <button type="button" onClick={handleCta}
                    className="flex-1 py-2.5 rounded-xl font-bold text-[0.8rem] flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] active:scale-95"
                    style={{ background: `linear-gradient(90deg, ${BLUE}, #5A95F5)`, color: '#fff', boxShadow: `0 4px 14px ${BLUE_GLOW}` }}>
                    {current.cta}
                  </button>
                  <button type="button" onClick={next}
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all hover:bg-black/5"
                    style={{ border: '1px solid rgba(0,0,0,0.08)', color: '#333' }}>
                    <ChevronRight size={15} />
                  </button>
                </>
              ) : (
                <button type="button" onClick={next}
                  className="flex-1 py-2.5 rounded-xl font-bold text-[0.8rem] flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] active:scale-95"
                  style={isLast
                    ? { background: `linear-gradient(90deg, ${BLUE}, #5A95F5)`, color: '#fff', boxShadow: `0 4px 14px ${BLUE_GLOW}` }
                    : { background: 'rgba(0,0,0,0.04)', color: '#222', border: '1px solid rgba(0,0,0,0.07)' }
                  }>
                  {isLast ? '¡Empezar! 🎧' : 'Siguiente'}
                  {!isLast && <ChevronRight size={13} />}
                </button>
              )}
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-1.5 mt-3">
              {steps.map((_, i) => (
                <button key={i} type="button" onClick={() => setStep(i)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === step ? 18 : 5,
                    height: 5,
                    background: i === step ? BLUE : 'rgba(0,0,0,0.09)',
                  }}
                  aria-label={`Paso ${i + 1}`} />
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default OnboardingTour;
