import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';

const ROLE_TIPS: Record<string, { title: string; tips: [string, string][] }> = {
  dj: {
    title: 'Tu perfil de DJ está listo para despegar',
    tips: [
      ['Añade tu foto', 'Los DJs con foto reciben 3× más contactos'],
      ['Sube tu mix o sesión', 'Un link de SoundCloud o Mixcloud en tu ficha'],
      ['Escribe tu bio', 'Cuéntales tu estilo y salas donde has actuado'],
    ],
  },
  rookie: {
    title: 'Bienvenido al programa Artista Promesa',
    tips: [
      ['Completa tu perfil', 'Foto y bio para que la comunidad te conozca'],
      ['Sube una sesión', 'Muestra tu estilo con un mix o track propio'],
      ['Consigue apoyos', 'Otros usuarios pueden votar tu perfil'],
    ],
  },
  staff: {
    title: 'Tu perfil de Staff está activado',
    tips: [
      ['Añade tu foto', 'Genera confianza con empresarios y promotores'],
      ['Define tu especialidad', 'RRPP, azafata, control de acceso...'],
      ['Activa tu disponibilidad', 'Aparece en Flash Booking cuando estés libre'],
    ],
  },
  empresario: {
    title: 'Panel de Empresario activado',
    tips: [
      ['Completa los datos de tu sala', 'Nombre, ciudad y tipo de venue'],
      ['Explora el directorio', 'Filtra profesionales por rol y ciudad'],
      ['Publica un Flash Job', 'Encuentra staff o artistas para esta noche'],
    ],
  },
};

const DEFAULT_TIPS: [string, string][] = [
  ['Añade una foto', 'Genera más confianza y más clics'],
  ['Escribe tu bio', 'Cuéntales quién eres en 2 frases'],
  ['Añade tu ciudad', 'Aparece en búsquedas locales'],
];

const STEPS = ['Bienvenida', 'Primeros pasos'];

interface Props {
  onClose: () => void;
  onNavigate: (view: string) => void;
}

const OnboardingWizard = ({ onClose, onNavigate }: Props) => {
  const { user } = useAuth();
  const profile = useProfile();
  const [step, setStep] = useState(0);

  const role = profile.role ?? '';
  const roleData = ROLE_TIPS[role] ?? {
    title: 'Tu perfil profesional está activado',
    tips: DEFAULT_TIPS,
  };

  const markDone = () => {
    if (user) localStorage.setItem(`xpeak_onboarded_${user.id}`, '1');
    onClose();
  };

  const goToProfile = () => {
    markDone();
    onNavigate('profile');
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{ background: '#0e0e14', border: '1px solid rgba(212,175,55,0.15)' }}
      >
        {/* Progress bar */}
        <div className="h-0.5 w-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <motion.div className="h-full" animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.4 }}
            style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)' }} />
        </div>

        <div className="p-8">
          {/* Steps indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className="flex items-center justify-center w-5 h-5 rounded-full text-[0.6rem] font-black"
                  style={{
                    background: i <= step ? 'linear-gradient(135deg,#D4AF37,#B8941E)' : 'rgba(255,255,255,0.07)',
                    color: i <= step ? '#000' : 'rgba(255,255,255,0.3)',
                  }}>
                  {i < step ? <CheckCircle size={10} /> : i + 1}
                </div>
                <span className="text-[0.65rem] font-bold hidden sm:block"
                  style={{ color: i === step ? '#D4AF37' : 'rgba(255,255,255,0.3)' }}>{s}</span>
                {i < STEPS.length - 1 && <div className="w-6 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Step 0 — Bienvenida */}
            {step === 0 && (
              <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                    style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}>
                    <Sparkles size={28} style={{ color: '#D4AF37' }} />
                  </div>
                  <h2 className="text-xl font-black mb-2 tracking-tight">¡Ya estás dentro de XPEAK!</h2>
                  <p className="text-sm leading-relaxed max-w-sm mx-auto" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {roleData.title}. En 2 minutos tendrás tu perfil listo para que te encuentren.
                  </p>
                </div>
                <button onClick={() => setStep(1)}
                  className="w-full py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                  style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
                  Ver qué hacer ahora <ArrowRight size={16} />
                </button>
              </motion.div>
            )}

            {/* Step 1 — Primeros pasos */}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                <div className="text-center mb-5">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
                    style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                    <CheckCircle size={24} style={{ color: '#22c55e' }} />
                  </div>
                  <h2 className="text-lg font-black mb-1 tracking-tight">3 pasos para destacar</h2>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    Completa tu perfil para aparecer en el directorio y recibir ofertas.
                  </p>
                </div>
                <div className="flex flex-col gap-2 mb-6">
                  {roleData.tips.map(([title, desc]) => (
                    <div key={title} className="flex items-center gap-3 px-4 py-3 rounded-xl"
                      style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.1)' }}>
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#D4AF37' }} />
                      <div>
                        <p className="text-xs font-bold">{title}</p>
                        <p className="text-[0.65rem]" style={{ color: 'rgba(255,255,255,0.4)' }}>{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={goToProfile}
                  className="w-full py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] mb-3"
                  style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
                  Completar mi perfil <ArrowRight size={16} />
                </button>
                <button onClick={markDone} className="w-full py-2 text-xs font-bold transition-colors"
                  style={{ color: 'rgba(255,255,255,0.3)' }}>
                  Lo haré después
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default OnboardingWizard;
