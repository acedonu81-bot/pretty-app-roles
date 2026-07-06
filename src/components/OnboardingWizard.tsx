import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ArrowRight, Sparkles, Music2, Briefcase, Camera, Users, Wand2, ChevronRight, Megaphone, UtensilsCrossed, Laugh, PartyPopper, PersonStanding, MicVocal, Shirt } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';

const ROLES = [
  { value: 'dj',           label: 'DJ / Artista',        desc: 'DJ, músico, grupo musical',         icon: Music2,         color: '#D4AF37' },
  { value: 'media',        label: 'Fotógrafo / Vídeo',   desc: 'Fotografía y video de eventos',     icon: Camera,         color: '#60a5fa' },
  { value: 'makeup',       label: 'Maquilladora',        desc: 'Maquillaje y estilismo',            icon: Sparkles,       color: '#f472b6' },
  { value: 'staff',        label: 'Staff / Camarero',    desc: 'Personal para eventos',             icon: Users,          color: '#34d399' },
  { value: 'promotor',     label: 'Promotor / RRPP',     desc: 'Relaciones públicas y listas',      icon: Megaphone,      color: '#a78bfa' },
  { value: 'catering',     label: 'Catering / Chef',     desc: 'Cocina, barra y cócteles',          icon: UtensilsCrossed, color: '#fb923c' },
  { value: 'mago',         label: 'Mago / Ilusionista',  desc: 'Magia de cerca y escenario',        icon: Wand2,          color: '#8b5cf6' },
  { value: 'humorista',    label: 'Humorista / Cómico',  desc: 'Monólogos y stand-up',              icon: Laugh,          color: '#f97316' },
  { value: 'animador',     label: 'Animador / Payaso',   desc: 'Animación infantil y familiar',     icon: PartyPopper,    color: '#ec4899' },
  { value: 'bailarin',     label: 'Bailarín / Danza',    desc: 'Shows, coreografías y gogós',       icon: PersonStanding, color: '#06b6d4' },
  { value: 'speaker',      label: 'Speaker / Presentador', desc: 'Maestro de ceremonias, ponente',  icon: MicVocal,       color: '#eab308' },
  { value: 'vestuario',    label: 'Estilista / Vestuario', desc: 'Moda, vestuario y styling',       icon: Shirt,          color: '#10b981' },
  { value: 'photo-booth',  label: 'Photo Booth',         desc: 'Cabinas de fotos y espejos 360',    icon: Camera,         color: '#f43f5e' },
];

const EMPRESARIO_ROLE = { value: 'empresario', label: 'Busco talento — Empresario', desc: 'Sala, promotora, agencia o evento privado: busco y contrato profesionales', icon: Briefcase, color: '#D4AF37' };

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
  catering: {
    title: 'Tu perfil de Catering está listo',
    tips: [
      ['Sube fotos de tus platos', 'Tu cocina es tu mejor carta de presentación'],
      ['Define tu servicio', 'Catering completo, barra, showcooking...'],
      ['Añade tu tarifa', 'Por persona o por evento'],
    ],
  },
  mago: {
    title: 'Tu perfil de Mago está listo',
    tips: [
      ['Sube un vídeo de tu show', 'La magia se vende viéndola'],
      ['Define tu formato', 'Magia de cerca, escenario, infantil...'],
      ['Añade tu tarifa', 'Por actuación o por hora'],
    ],
  },
  humorista: {
    title: 'Tu perfil de Humorista está listo',
    tips: [
      ['Sube un clip de tu monólogo', 'Que se rían antes de contratarte'],
      ['Define tu registro', 'Bodas, empresas, salas...'],
      ['Añade tu tarifa', 'Por show o por evento'],
    ],
  },
  animador: {
    title: 'Tu perfil de Animador está listo',
    tips: [
      ['Añade fotos de tus eventos', 'Los padres quieren ver tu trabajo'],
      ['Define tu especialidad', 'Cumpleaños, comuniones, bodas...'],
      ['Añade tu tarifa', 'Por hora o por pack de animación'],
    ],
  },
  bailarin: {
    title: 'Tu perfil de Bailarín está listo',
    tips: [
      ['Sube un vídeo bailando', 'El movimiento no se explica, se ve'],
      ['Define tu estilo', 'Flamenco, urbano, gogó, coreografías...'],
      ['Añade tu tarifa', 'Por show individual o compañía'],
    ],
  },
  speaker: {
    title: 'Tu perfil de Speaker está listo',
    tips: [
      ['Sube un clip presentando', 'Tu voz y presencia son tu portfolio'],
      ['Define tu formato', 'MC de bodas, galas, congresos...'],
      ['Añade tu tarifa', 'Por evento o por jornada'],
    ],
  },
  vestuario: {
    title: 'Tu perfil de Estilista está listo',
    tips: [
      ['Sube tu book', 'Looks y styling de trabajos reales'],
      ['Define tu especialidad', 'Novias, artistas, producciones...'],
      ['Añade tu tarifa', 'Por sesión o por proyecto'],
    ],
  },
  'photo-booth': {
    title: 'Tu perfil de Photo Booth está listo',
    tips: [
      ['Sube fotos de tus cabinas', 'Clásica, 360, espejo glamour...'],
      ['Define tu servicio', 'Qué incluye: props, impresión, técnico'],
      ['Añade tu tarifa', 'Por evento o por horas'],
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
  const validRoles = [...ROLES.map(r => r.value), 'empresario'];
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
                  <h2 className="text-xl font-black mb-1" style={{ fontFamily: 'Syne, sans-serif', color: '#111' }}>
                    ¡Bienvenido/a a XPEAK!
                  </h2>
                  <p className="text-sm" style={{ color: '#333' }}>
                    ¿Cuál es tu perfil?
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3 max-h-[42vh] overflow-y-auto pr-1">
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
                          <Icon size={15} style={{ color: active ? color : '#333' }} />
                        </div>
                        <div>
                          <p className="text-xs font-black leading-tight" style={{ color: active ? '#111' : '#222' }}>{label}</p>
                          <p className="text-[10px] leading-tight mt-0.5" style={{ color: '#777' }}>{desc}</p>
                        </div>
                        {active && <CheckCircle size={12} style={{ color, alignSelf: 'flex-end', marginTop: -4 }} />}
                      </button>
                    );
                  })}
                </div>

                {(() => {
                  const { value, label, desc, icon: Icon, color } = EMPRESARIO_ROLE;
                  const active = selectedRole === value;
                  return (
                    <button onClick={() => setSelectedRole(value)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all mb-5"
                      style={{
                        background: active ? `${color}15` : 'rgba(0,0,0,0.02)',
                        border: `1.5px solid ${active ? color : 'rgba(0,0,0,0.07)'}`,
                        boxShadow: active ? `0 0 0 3px ${color}20` : 'none',
                      }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: active ? `${color}25` : 'rgba(0,0,0,0.05)' }}>
                        <Icon size={15} style={{ color: active ? color : '#333' }} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-black leading-tight" style={{ color: active ? '#111' : '#222' }}>{label}</p>
                        <p className="text-[10px] leading-tight mt-0.5" style={{ color: '#777' }}>{desc}</p>
                      </div>
                      {active && <CheckCircle size={12} style={{ color }} />}
                    </button>
                  );
                })()}

                <button onClick={handleRoleConfirm} disabled={!selectedRole || saving}
                  className="w-full py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all"
                  style={{
                    background: selectedRole ? 'linear-gradient(135deg,#D4AF37,#B8941E)' : 'rgba(0,0,0,0.08)',
                    color: selectedRole ? '#000' : '#333',
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
                  <h2 className="text-lg font-black mb-1" style={{ fontFamily: 'Syne, sans-serif', color: '#111' }}>
                    {roleData.title}
                  </h2>
                  <p className="text-xs" style={{ color: '#333' }}>3 pasos para destacar desde el primer día</p>
                </div>

                <div className="flex flex-col gap-2 mb-5">
                  {roleData.tips.map(([title, desc], i) => (
                    <div key={title} className="flex items-center gap-3 px-4 py-3 rounded-xl"
                      style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.12)' }}>
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[0.65rem] font-black"
                        style={{ background: '#D4AF37', color: '#000' }}>{i + 1}</div>
                      <div>
                        <p className="text-xs font-bold" style={{ color: '#222' }}>{title}</p>
                        <p className="text-[0.65rem]" style={{ color: '#333' }}>{desc}</p>
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
                  style={{ color: '#333' }}>
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
