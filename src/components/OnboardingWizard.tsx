import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ArrowRight, Sparkles, Music2, Briefcase, Camera, Users, Wand2, ChevronRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';

const ROLES = [
  { value: 'dj',           label: 'DJ / Artista',      desc: 'DJ, músico, grupo musical',         icon: Music2,    color: '#D4AF37' },
  { value: 'media',        label: 'Fotógrafo / Vídeo', desc: 'Fotografía y video de eventos',     icon: Camera,    color: '#60a5fa' },
  { value: 'makeup',       label: 'Maquilladora',      desc: 'Maquillaje y estilismo',            icon: Sparkles,  color: '#f472b6' },
  { value: 'staff',        label: 'Staff / Camarero',  desc: 'Personal para eventos',             icon: Users,     color: '#34d399' },
  { value: 'promotor',     label: 'Promotor / RRPP',   desc: 'Relaciones públicas y listas',      icon: Wand2,     color: '#a78bfa' },
  { value: 'empresario',   label: 'Empresario',        desc: 'Busco y contrato profesionales',    icon: Briefcase, color: '#fb923c' },
];

const TIPS: Record<string, { title: string; tips: [string, string][] }> = {
  dj: {
    title: 'Tu perfil de DJ está listo',
    tips: [
      ['Añade tu foto', 'Los DJs con foto reciben 3× más contactos'],
      ['Sube tu mix', 'Un link de SoundCloud o Mixcloud en tu ficha'],
      ['Escribe tu bio', 'Cuéntales tu estilo y dónde has actuado'],
    ],
  },
  media: {
    title: 'Tu perfil de Fotógrafo/Vídeo está listo',
    tips: [
      ['Sube tu portfolio', 'Fotos de tus mejores eventos'],
      ['Define tu especialidad', 'Bodas, corporativo, nightlife...'],
      ['Añade tu tarifa', 'Aparece en búsquedas con precio'],
    ],
  },
  makeup: {
    title: 'Tu perfil de Maquilladora está listo',
    tips: [
      ['Añade tu foto', 'Tu mejor trabajo como portada'],
      ['Escribe tu especialidad', 'Nupcial, editorial, artístico...'],
      ['Activa disponibilidad Flash', 'Para eventos urgentes'],
    ],
  },
  staff: {
    title: 'Tu perfil de Staff está listo',
    tips: [
      ['Añade tu foto', 'Genera confianza con empresarios'],
      ['Define tu especialidad', 'Camarero, azafata, control de acceso...'],
      ['Activa Flash Booking', 'Aparece cuando estés libre'],
    ],
  },
  promotor: {
    title: 'Tu perfil de Promotor está listo',
    tips: [
      ['Añade tus salas habituales', 'Con qué venues trabajas'],
      ['Define tu zona', 'Ciudad y área de trabajo'],
      ['Sube tu bio', 'Cuéntales tu experiencia'],
    ],
  },
  empresario: {
    title: 'Panel de Empresario activado',
    tips: [
      ['Explora el directorio', 'Filtra profesionales por rol y ciudad'],
      ['Publica un Flash Job', 'Encuentra staff para esta noche'],
      ['Contacta directamente', 'Sin intermediarios, sin comisión'],
    ],
  },
};

interface Props {
  onClose: () => void;
  onNavigate: (view: string) => void;
}

const OnboardingWizard = ({ onClose, onNavigate }: Props) => {
  const { user } = useAuth();
  const profile = useProfile();
  // Pre-fill role from URL param if available
  const urlRole = new URLSearchParams(window.location.search).get('role') ?? '';
  const validRoles = ['dj','media','makeup','staff','promotor','empresario'];
  const prefilledRole = validRoles.includes(urlRole) ? urlRole : (validRoles.includes(profile.role ?? '') ? profile.role ?? '' : '');
  const [step, setStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState<string>(prefilledRole);
  const [saving, setSaving] = useState(false);

  const markDone = () => {
    if (user) localStorage.setItem(`xpeak_onboarded_${user.id}`, '1');
    onClose();
  };

  const handleRoleConfirm = async () => {
    if (!selectedRole) return;
    setSaving(true);
    await profile.updateField({ role: selectedRole });
    setSaving(false);
    setStep(1);
  };

  const goToProfile = () => {
    markDone();
    onNavigate(selectedRole === 'empresario' ? 'empresario' : 'profile');
  };

  const roleData = TIPS[selectedRole] ?? TIPS['dj'];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 24px 64px rgba(0,0,0,0.3)' }}
      >
        {/* Progress bar */}
        <div className="h-1 w-full" style={{ background: 'rgba(0,0,0,0.06)' }}>
          <motion.div className="h-full" animate={{ width: step === 0 ? '50%' : '100%' }}
            transition={{ duration: 0.4 }}
            style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)' }} />
        </div>

        <div className="p-7">
          <AnimatePresence mode="wait">

            {/* Step 0 — Elegir rol */}
            {step === 0 && (
              <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="text-center mb-6">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}>
                    <Sparkles size={26} style={{ color: '#D4AF37' }} />
                  </div>
                  <h2 className="text-xl font-black mb-1" style={{ fontFamily: 'Syne, sans-serif', color: 'rgba(22,20,18,0.92)' }}>
                    ¡Bienvenido/a a XPEAK!
                  </h2>
                  <p className="text-sm" style={{ color: 'rgba(22,20,18,0.5)' }}>
                    ¿Cuál es tu perfil?
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-5">
                  {ROLES.map(({ value, label, desc, icon: Icon, color }) => {
                    const active = selectedRole === value;
                    return (
                      <button key={value} onClick={() => setSelectedRole(value)}
                        className="flex flex-col items-start gap-2 p-3 rounded-xl text-left transition-all"
                        style={{
                          background: active ? `${color}15` : 'rgba(0,0,0,0.02)',
                          border: `1.5px solid ${active ? color : 'rgba(0,0,0,0.07)'}`,
                          boxShadow: active ? `0 0 0 3px ${color}20` : 'none',
                        }}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ background: active ? `${color}25` : 'rgba(0,0,0,0.05)' }}>
                          <Icon size={15} style={{ color: active ? color : 'rgba(22,20,18,0.4)' }} />
                        </div>
                        <div>
                          <p className="text-xs font-black leading-tight" style={{ color: active ? 'rgba(22,20,18,0.92)' : 'rgba(22,20,18,0.7)' }}>{label}</p>
                          <p className="text-[10px] leading-tight mt-0.5" style={{ color: 'rgba(22,20,18,0.38)' }}>{desc}</p>
                        </div>
                        {active && <CheckCircle size={12} style={{ color, alignSelf: 'flex-end', marginTop: -4 }} />}
                      </button>
                    );
                  })}
                </div>

                <button onClick={handleRoleConfirm} disabled={!selectedRole || saving}
                  className="w-full py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all"
                  style={{
                    background: selectedRole ? 'linear-gradient(135deg,#D4AF37,#B8941E)' : 'rgba(0,0,0,0.08)',
                    color: selectedRole ? '#000' : 'rgba(22,20,18,0.3)',
                    cursor: selectedRole ? 'pointer' : 'not-allowed',
                  }}>
                  {saving ? 'Guardando...' : 'Continuar'} <ArrowRight size={15} />
                </button>
              </motion.div>
            )}

            {/* Step 1 — Primeros pasos */}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="text-center mb-5">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
                    style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                    <CheckCircle size={22} style={{ color: '#22c55e' }} />
                  </div>
                  <h2 className="text-lg font-black mb-1" style={{ fontFamily: 'Syne, sans-serif', color: 'rgba(22,20,18,0.92)' }}>
                    {roleData.title}
                  </h2>
                  <p className="text-xs" style={{ color: 'rgba(22,20,18,0.5)' }}>3 pasos para destacar desde el primer día</p>
                </div>

                <div className="flex flex-col gap-2 mb-5">
                  {roleData.tips.map(([title, desc], i) => (
                    <div key={title} className="flex items-center gap-3 px-4 py-3 rounded-xl"
                      style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.12)' }}>
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[0.65rem] font-black"
                        style={{ background: '#D4AF37', color: '#000' }}>{i + 1}</div>
                      <div>
                        <p className="text-xs font-bold" style={{ color: 'rgba(22,20,18,0.88)' }}>{title}</p>
                        <p className="text-[0.65rem]" style={{ color: 'rgba(22,20,18,0.5)' }}>{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button onClick={goToProfile}
                  className="w-full py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] mb-2"
                  style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
                  Completar mi perfil <ChevronRight size={15} />
                </button>
                <button onClick={markDone} className="w-full py-2 text-xs font-semibold"
                  style={{ color: 'rgba(22,20,18,0.3)' }}>
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
