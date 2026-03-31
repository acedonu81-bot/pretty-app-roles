import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { motion, useInView } from 'framer-motion';
import { Music, UtensilsCrossed, Users, Camera, ArrowRight, Sparkles } from 'lucide-react';
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
}) => (
  <motion.div
    whileHover={{ scale: 1.03, y: -6 }}
    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    onClick={onClick}
    className={`relative overflow-hidden rounded-2xl cursor-pointer group ${className}`}
    style={{ border: '1px solid rgba(212,175,55,0.15)' }}
  >
    <img src={image} alt={title} loading="lazy"
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
    {/* Dark cinema overlay */}
    <div className="absolute inset-0" style={{
      background: 'linear-gradient(180deg, rgba(10,10,10,0.2) 0%, rgba(10,10,10,0.85) 100%)',
    }} />
    {/* Gold edge glow on hover */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      style={{ boxShadow: 'inset 0 0 40px rgba(212,175,55,0.15)' }} />
    <div className="relative z-10 h-full flex flex-col justify-end p-6">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
        style={{
          background: 'rgba(212,175,55,0.1)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(212,175,55,0.25)',
          color: '#D4AF37',
        }}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gradient mb-1">{title}</h3>
      <p className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>{subtitle}</p>
    </div>
  </motion.div>
);

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

/* ── Landing ── */
const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div className="min-h-screen relative overflow-x-hidden flex flex-col" style={{ background: '#070B14' }}>
      {/* ─ Hero background ─ */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        {/* Video optional — falls back to poster if unavailable */}
        <video
          autoPlay muted loop playsInline
          src={HERO_VIDEO_URL}
          poster={heroBg}
          className="w-full h-full object-cover"
          style={{ opacity: 0.2, filter: 'saturate(0.6) blur(1px)' }}
        />
        {/* Animated gradient orbs */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #070B14 0%, #0A0F20 50%, #070B14 100%)' }} />
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #E2BE50 0%, transparent 65%)', filter: 'blur(80px)', animation: 'orbFloat1 18s ease-in-out infinite' }} />
        <div className="absolute top-[10%] right-[-15%] w-[500px] h-[500px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 65%)', filter: 'blur(90px)', animation: 'orbFloat2 24s ease-in-out infinite' }} />
        <div className="absolute bottom-[10%] left-[30%] w-[400px] h-[400px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #E2BE50 0%, transparent 65%)', filter: 'blur(100px)', animation: 'orbFloat3 20s ease-in-out infinite' }} />
        {/* Bottom fade */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(7,11,20,0.7) 60%, #070B14 100%)' }} />
      </div>

      {/* ─ Animated SVG wave ─ */}
      <div className="fixed bottom-0 left-0 right-0 -z-10 pointer-events-none" style={{ height: '180px' }}>
        <svg viewBox="0 0 1440 180" preserveAspectRatio="none" className="w-full h-full">
          <path style={{ animation: 'wave1 8s ease-in-out infinite', fill: 'rgba(226,190,80,0.04)' }}
            d="M0,80 C360,140 1080,20 1440,80 L1440,180 L0,180 Z" />
          <path style={{ animation: 'wave2 12s ease-in-out infinite', fill: 'rgba(226,190,80,0.03)' }}
            d="M0,100 C480,40 960,160 1440,100 L1440,180 L0,180 Z" />
          <path style={{ animation: 'wave3 10s ease-in-out infinite', fill: 'rgba(99,102,241,0.03)' }}
            d="M0,120 C600,60 840,150 1440,90 L1440,180 L0,180 Z" />
        </svg>
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
          <div className="flex items-center gap-2.5">
            <img src={xpeakLogo} alt="XPEAK" width={34} height={34} />
            <span className="text-xl font-bold tracking-wider">
              X<span className="text-gradient">PEAK</span>
            </span>
          </div>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[180px] md:auto-rows-[280px]">
          <FadeIn delay={0} className="md:row-span-2">
            <BentoCard image={bentoMusica} icon={<Music size={20} />} title="Música" subtitle="DJs, productores y técnicos de sonido" className="h-full" onClick={() => navigate('/auth')} />
          </FadeIn>
          <FadeIn delay={0.1} className="md:col-span-2">
            <BentoCard image={bentoGastro} icon={<UtensilsCrossed size={20} />} title="Gastro" subtitle="Bartenders, chefs y catering premium" className="h-full" onClick={() => navigate('/auth')} />
          </FadeIn>
          <FadeIn delay={0.15} className="md:row-span-2">
            <BentoCard image={bentoImagen} icon={<Camera size={20} />} title="Imagen" subtitle="Fotógrafos, videógrafos y diseñadores" className="h-full" onClick={() => navigate('/auth')} />
          </FadeIn>
          <FadeIn delay={0.2} className="md:col-span-2">
            <BentoCard image={bentoStaff} icon={<Users size={20} />} title="Staff" subtitle="RRPP, hostess, seguridad y coordinación" className="h-full" onClick={() => navigate('/auth')} />
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
    </div>
  );
};

export default Landing;
