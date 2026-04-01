import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { motion, useInView, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Music, UtensilsCrossed, Users, Camera, ArrowRight, Sparkles, X, CheckCircle } from 'lucide-react';
import xpeakLogo from '@/assets/xpeak-logo.png';
import heroBg from '@/assets/hero-bg.jpg';
const HERO_VIDEO_URL = 'https://videos.pexels.com/video-files/3129957/3129957-uhd_2560_1440_25fps.mp4';
import bentoMusica from '@/assets/bento-musica.jpg';
import bentoGastro from '@/assets/bento-gastro.jpg';
import bentoStaff from '@/assets/bento-staff.jpg';
import bentoImagen from '@/assets/bento-imagen.jpg';
import LegalFooter from '@/components/LegalFooter';
import LiveDJsSection from '@/components/dashboard/LiveDJsSection';
import DemoVideoModal from '@/components/DemoVideoModal';

/* ── Fade-in wrapper ── */
const FadeIn = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ── Bento card ── */
const BentoCard = ({
  image, icon, title, subtitle, className = '', onClick,
}: {
  image: string; icon: React.ReactNode; title: string; subtitle: string; className?: string; onClick?: () => void;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const shineX = useMotionValue('-100%');

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
    shineX.set(`${((e.clientX - rect.left) / rect.width) * 100 - 50}%`);
  };
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    shineX.set('-100%');
  };

  return (
    <motion.div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 800, border: '1px solid rgba(212,175,55,0.15)' }}
      whileHover={{ scale: 1.04, y: -8, borderColor: 'rgba(212,175,55,0.45)' }}
      transition={{ type: 'spring', stiffness: 240, damping: 22 }}
      className={`relative overflow-hidden rounded-2xl cursor-pointer group ${className}`}
    >
      <img src={image} alt={title} loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-115" />
      {/* Dark cinema overlay */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, rgba(10,10,10,0.1) 0%, rgba(10,10,10,0.88) 100%)',
      }} />
      {/* Shine sweep */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: useTransform(shineX, x => `radial-gradient(ellipse 60% 80% at calc(${x} + 50%) 50%, rgba(212,175,55,0.12) 0%, transparent 70%)`),
        }}
      />
      {/* Gold border glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400"
        style={{ boxShadow: 'inset 0 0 50px rgba(212,175,55,0.12)' }} />
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end p-6" style={{ transform: 'translateZ(20px)' }}>
        <motion.div
          className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
          whileHover={{ scale: 1.1 }}
          style={{
            background: 'rgba(212,175,55,0.12)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(212,175,55,0.3)',
            color: '#D4AF37',
          }}>
          {icon}
        </motion.div>
        <h3 className="text-xl font-bold text-gradient mb-1">{title}</h3>
        <p className="text-sm transition-colors duration-300 group-hover:text-white/75" style={{ color: 'rgba(255,255,255,0.5)' }}>{subtitle}</p>
        <p className="text-[0.6rem] font-bold mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 tracking-widest uppercase" style={{ color: '#D4AF37' }}>
          Ver detalles →
        </p>
      </div>
    </motion.div>
  );
};

/* ── Stats pill ── */
const StatPill = ({ value, label }: { value: string; label: string }) => (
  <div className="text-center px-6 py-4 rounded-xl"
    style={{
      background: 'rgba(212,175,55,0.04)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(212,175,55,0.1)',
    }}>
    <p className="text-2xl md:text-3xl font-bold text-gradient">{value}</p>
    <p className="text-xs mt-1 tracking-wide uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</p>
  </div>
);

/* ── Role detail data ── */
const ROLE_DETAILS = [
  {
    key: 'musica',
    title: 'Música',
    icon: <Music size={28} />,
    color: '#E2BE50',
    tagline: 'DJs, productores y técnicos de sonido',
    what: 'Profesionales del audio para todo tipo de eventos: clubs, festivales, bodas, eventos corporativos y privados.',
    forPro: ['Crea tu perfil con sesiones de audio reales', 'Incrusta tu perfil de hearthis.at o Mixcloud', 'Recibe Flash Bookings urgentes de empresarios', 'Emite en directo desde tu Escenario Virtual'],
    forBusiness: ['Busca DJs por género, tarifa y zona', 'Escucha sus sesiones antes de contratar', 'Flash Booking para cubrir una noche en menos de 1h', 'Historial de contratos verificado'],
  },
  {
    key: 'gastro',
    title: 'Gastro & Sala',
    icon: <UtensilsCrossed size={28} />,
    color: '#E2BE50',
    tagline: 'Bartenders, chefs y catering premium',
    what: 'Personal especializado en hostelería nocturna: bartenders de nivel, camareros VIP, coordinadores de sala y catering para eventos exclusivos.',
    forPro: ['Muestra tu portfolio con vídeos de tus creaciones', 'Define tu disponibilidad por fechas', 'Recibe ofertas directas de salas y eventos', 'Valoraciones verificadas de cada evento'],
    forBusiness: ['Encuentra bartenders con experiencia en grandes eventos', 'Gestiona contrataciones puntuales o fijas', 'Compara perfiles y tarifarìos de forma transparente'],
  },
  {
    key: 'imagen',
    title: 'Imagen & Media',
    icon: <Camera size={28} />,
    color: '#E2BE50',
    tagline: 'Fotógrafos, videógrafos y maquilladores',
    what: 'Creadores visuales especializados en el sector nocturno: fotógrafos de eventos, videógrafos, maquilladores artísticos y peluquería para artistas.',
    forPro: ['Portfolio de imágenes y vídeos cortos de tu trabajo', 'Perfil público indexado en buscadores', 'Contacto directo con salas y productoras', 'Calendario de disponibilidad integrado'],
    forBusiness: ['Filtra por especialidad, zona y precio', 'Ve portfolios reales antes de contactar', 'Booking rápido para cobertura de eventos de última hora'],
  },
  {
    key: 'staff',
    title: 'Staff & Promoción',
    icon: <Users size={28} />,
    color: '#E2BE50',
    tagline: 'RRPP, hostess, seguridad y promotores',
    what: 'El personal invisible que hace funcionar los eventos: relaciones públicas, promotores, hostess, seguridad y coordinadores de acceso.',
    forPro: ['Primera plataforma que formaliza el rol de RRPP en Europa', 'Define tus tarifas y condiciones sin intermediarios', 'Recibe ofertas de salas verificadas', 'Sistema de valoraciones para construir reputación'],
    forBusiness: ['El nicho más difícil de cubrir — aquí está centralizado', 'Personal verificado con historial de eventos reales', 'Flash Booking para cubrir ausencias de última hora'],
  },
];

/* ── Role Modal ── */
const RoleModal = ({ role, onClose, onJoin }: { role: typeof ROLE_DETAILS[0]; onClose: () => void; onJoin: () => void }) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-2xl overflow-hidden"
        style={{ background: '#111', border: '1px solid rgba(226,190,80,0.2)' }}
      >
        {/* Header */}
        <div className="p-6 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-white/10">
            <X size={16} className="text-white/60" />
          </button>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
            style={{ background: 'rgba(226,190,80,0.1)', border: '1px solid rgba(226,190,80,0.2)', color: '#E2BE50' }}>
            {role.icon}
          </div>
          <h3 className="text-2xl font-bold mb-1">{role.title}</h3>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{role.tagline}</p>
        </div>

        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>{role.what}</p>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#E2BE50' }}>Si eres profesional</p>
            <div className="space-y-2">
              {role.forPro.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#E2BE50' }} />
                  <span className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>Si eres empresario / promotor</p>
            <div className="space-y-2">
              {role.forBusiness.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle size={14} className="mt-0.5 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }} />
                  <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 pt-0">
          <button onClick={onJoin}
            className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #B8941E)', color: '#0A0A0A' }}>
            Crear perfil gratis →
          </button>
        </div>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

/* ── Landing ── */
const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [demoOpen, setDemoOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<typeof ROLE_DETAILS[0] | null>(null);

  return (
    <div className="min-h-screen relative overflow-x-hidden flex flex-col" style={{ background: '#090909' }}>
      {/* ─ Hero background ─ */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <video
          autoPlay muted loop playsInline
          src={HERO_VIDEO_URL}
          poster={heroBg}
          className="w-full h-full object-cover"
          style={{ opacity: 0.15, filter: 'saturate(0.4) blur(2px)' }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #090909 0%, #0d0d0d 50%, #090909 100%)' }} />
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #E2BE50 0%, transparent 65%)', filter: 'blur(90px)', animation: 'orbFloat1 18s ease-in-out infinite' }} />
        <div className="absolute top-[10%] right-[-15%] w-[500px] h-[500px] rounded-full opacity-8"
          style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 65%)', filter: 'blur(100px)', animation: 'orbFloat2 24s ease-in-out infinite' }} />
        <div className="absolute bottom-[10%] left-[30%] w-[400px] h-[400px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #E2BE50 0%, transparent 65%)', filter: 'blur(110px)', animation: 'orbFloat3 20s ease-in-out infinite' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(9,9,9,0.7) 60%, #090909 100%)' }} />
      </div>


      {/* ─ Nav (Glassmorphism) ─ */}
      <nav className="sticky top-0 z-50"
        style={{
          background: 'rgba(10,10,10,0.6)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(212,175,55,0.08)',
        }}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-4 flex justify-between items-center">
          <span className="text-xl font-bold tracking-wider">
            X<span className="text-gradient">PEAK</span>
          </span>
        </div>
      </nav>

      {/* ─ Hero ─ */}
      <header className="max-w-[1200px] mx-auto px-6 md:px-8 pt-28 pb-24 md:pt-40 md:pb-32 text-center">
        <FadeIn>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
            style={{
              background: 'rgba(212,175,55,0.06)',
              border: '1px solid rgba(212,175,55,0.15)',
            }}>
            <Sparkles size={14} style={{ color: '#D4AF37' }} />
            <span className="uppercase tracking-[0.3em] text-[0.65rem] font-semibold" style={{ color: '#D4AF37' }}>
              Directorio Profesional
            </span>
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold leading-[1.05] mb-7 max-w-5xl mx-auto tracking-tight">
            La Élite de los Eventos{' '}
            <span className="text-gradient">en un solo lugar</span>
          </h1>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="text-base md:text-lg max-w-xl mx-auto mb-12 leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.45)' }}>
            Conecta con los mejores profesionales del sector: DJs, bartenders, personal de sala, fotógrafos y mucho más.
          </p>
        </FadeIn>
        <FadeIn delay={0.3}>
          <div className="flex gap-4 justify-center flex-wrap">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/auth')}
              className="group relative inline-flex items-center gap-2.5 text-base font-bold px-10 py-4 rounded-xl transition-all"
              style={{
                background: 'linear-gradient(135deg, #D4AF37, #B8941E)',
                color: '#0A0A0A',
                boxShadow: '0 0 40px rgba(212,175,55,0.25), 0 4px 20px rgba(212,175,55,0.2)',
              }}>
              Unirse al Directorio
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/auth')}
              className="text-sm font-semibold px-8 py-4 rounded-xl transition-all duration-300"
              style={{
                background: 'rgba(212,175,55,0.08)',
                backdropFilter: 'blur(12px)',
                color: '#D4AF37',
                border: '1px solid rgba(212,175,55,0.2)',
              }}>
              Acceder
            </motion.button>
          </div>
        </FadeIn>
      </header>

      {/* ─ Stats ─ */}
      <FadeIn className="max-w-[900px] mx-auto px-6 mb-24">
        <div className="grid grid-cols-3 gap-4">
          <StatPill value="+500" label="Profesionales" />
          <StatPill value="24h" label="Respuesta Media" />
          <StatPill value="100%" label="Verificados" />
        </div>
      </FadeIn>

      {/* ─ DJs en Directo (solo autenticados) ─ */}
      {user && (
        <section className="max-w-[1200px] mx-auto px-6 md:px-8 pb-12">
          <FadeIn>
            <LiveDJsSection onNavigate={() => navigate('/dashboard', { state: { view: 'escenario' } })} />
          </FadeIn>
        </section>
      )}

      {/* ─ Bento Grid ─ */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-8 pb-28">
        <FadeIn>
          <div className="text-center mb-14">
            <p className="uppercase tracking-[0.3em] text-[0.65rem] font-semibold mb-4" style={{ color: '#D4AF37' }}>
              Categorías
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Encuentra tu <span className="text-gradient">talento</span>
            </h2>
          </div>
        </FadeIn>
        <p className="text-center text-xs text-muted-foreground mb-6" style={{ color: 'rgba(255,255,255,0.3)' }}>
          Haz clic en cada categoría para ver qué puedes hacer
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[180px] md:auto-rows-[280px]">
          <FadeIn delay={0} className="md:row-span-2">
            <BentoCard image={bentoMusica} icon={<Music size={20} />} title="Música" subtitle="DJs, productores y técnicos de sonido" className="h-full"
              onClick={() => setActiveRole(ROLE_DETAILS[0])} />
          </FadeIn>
          <FadeIn delay={0.1} className="md:col-span-2">
            <BentoCard image={bentoGastro} icon={<UtensilsCrossed size={20} />} title="Gastro" subtitle="Bartenders, chefs y catering premium" className="h-full"
              onClick={() => setActiveRole(ROLE_DETAILS[1])} />
          </FadeIn>
          <FadeIn delay={0.15} className="md:row-span-2">
            <BentoCard image={bentoImagen} icon={<Camera size={20} />} title="Imagen" subtitle="Fotógrafos, videógrafos y diseñadores" className="h-full"
              onClick={() => setActiveRole(ROLE_DETAILS[2])} />
          </FadeIn>
          <FadeIn delay={0.2} className="md:col-span-2">
            <BentoCard image={bentoStaff} icon={<Users size={20} />} title="Staff" subtitle="RRPP, hostess, seguridad y coordinación" className="h-full"
              onClick={() => setActiveRole(ROLE_DETAILS[3])} />
          </FadeIn>
        </div>
      </section>

      {/* ─ CTA ─ */}
      <FadeIn className="max-w-[1200px] mx-auto px-6 md:px-8 pb-28">
        <div className="rounded-3xl p-12 md:p-20 text-center relative overflow-hidden"
          style={{
            background: 'rgba(212,175,55,0.03)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(212,175,55,0.1)',
          }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #D4AF37 0%, transparent 70%)', filter: 'blur(100px)' }} />
          <h2 className="text-3xl md:text-5xl font-bold mb-5 relative z-10 tracking-tight">
            ¿Listo para <span className="text-gradient">destacar</span>?
          </h2>
          <p className="text-sm md:text-base mb-10 relative z-10 max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Crea tu perfil profesional y conecta con oportunidades exclusivas.
          </p>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/auth')}
            className="relative z-10 text-base font-bold px-12 py-4 rounded-xl transition-all"
            style={{
              background: 'linear-gradient(135deg, #D4AF37, #B8941E)',
              color: '#0A0A0A',
              boxShadow: '0 0 40px rgba(212,175,55,0.2)',
            }}>
            Crear Perfil Gratis
          </motion.button>
        </div>
      </FadeIn>

      <LegalFooter />
      <DemoVideoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
      {activeRole && (
        <RoleModal
          role={activeRole}
          onClose={() => setActiveRole(null)}
          onJoin={() => { setActiveRole(null); navigate('/auth'); }}
        />
      )}
    </div>
  );
};

export default Landing;
