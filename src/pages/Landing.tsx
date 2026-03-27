import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Music, UtensilsCrossed, Users, Camera, ArrowRight } from 'lucide-react';
import xpeakLogo from '@/assets/xpeak-logo.png';
import heroBg from '@/assets/hero-bg.jpg';
import bentoMusica from '@/assets/bento-musica.jpg';
import bentoGastro from '@/assets/bento-gastro.jpg';
import bentoStaff from '@/assets/bento-staff.jpg';
import bentoImagen from '@/assets/bento-imagen.jpg';
import LegalFooter from '@/components/LegalFooter';
import DemoVideoModal from '@/components/DemoVideoModal';

/* ── Fade-in wrapper ── */
const FadeIn = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ── Bento card ── */
const BentoCard = ({
  image, icon, title, subtitle, className = '',
}: {
  image: string; icon: React.ReactNode; title: string; subtitle: string; className?: string;
}) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -4 }}
    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    className={`relative overflow-hidden rounded-2xl cursor-pointer group ${className}`}
    style={{ border: '1px solid rgba(212,175,55,0.12)' }}
  >
    <img src={image} alt={title} loading="lazy"
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
    <div className="absolute inset-0" style={{
      background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.75) 100%)',
    }} />
    <div className="relative z-10 h-full flex flex-col justify-end p-6">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 backdrop-blur-md"
        style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.25)', color: '#D4AF37' }}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gradient mb-1">{title}</h3>
      <p className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>{subtitle}</p>
    </div>
  </motion.div>
);

/* ── Stats pill ── */
const StatPill = ({ value, label }: { value: string; label: string }) => (
  <div className="glass-panel-subtle px-5 py-3 text-center"
    style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.1)' }}>
    <p className="text-2xl font-bold text-gradient">{value}</p>
    <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</p>
  </div>
);

/* ── Landing ── */
const Landing = () => {
  const navigate = useNavigate();
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div className="min-h-screen relative overflow-x-hidden flex flex-col bg-background">
      {/* ─ Hero background image ─ */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <img src={heroBg} alt="" className="w-full h-full object-cover" style={{ opacity: 0.25 }} />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.95) 70%, #000 100%)',
        }} />
      </div>

      {/* ─ Nav ─ */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl"
        style={{ background: 'rgba(0,0,0,0.7)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <img src={xpeakLogo} alt="XPEAK" width={32} height={32} />
            <span className="text-xl font-bold tracking-wider">
              X<span className="text-gradient">PEAK</span>
            </span>
          </div>
          <button onClick={() => navigate('/auth')}
            className="text-sm font-semibold px-5 py-2 rounded-lg transition-all"
            style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }}>
            Acceder
          </button>
        </div>
      </nav>

      {/* ─ Hero ─ */}
      <header className="max-w-[1200px] mx-auto px-6 md:px-8 pt-24 pb-20 md:pt-32 md:pb-28 text-center">
        <FadeIn>
          <p className="uppercase tracking-[0.3em] text-xs font-semibold mb-6" style={{ color: '#D4AF37' }}>
            Directorio Profesional
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.1] mb-6 max-w-4xl mx-auto">
            La Élite de los Eventos{' '}
            <span className="text-gradient">en un solo lugar</span>
          </h1>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.55)' }}>
            Conecta con los mejores profesionales del sector: DJs, bartenders, personal de sala, fotógrafos y mucho más.
          </p>
        </FadeIn>
        <FadeIn delay={0.3}>
          <div className="flex gap-4 justify-center flex-wrap">
            <button onClick={() => navigate('/auth')}
              className="group relative inline-flex items-center gap-2 text-base font-bold px-8 py-4 rounded-xl transition-all"
              style={{
                background: 'linear-gradient(135deg, #D4AF37, #B8941E)',
                color: '#000',
                boxShadow: '0 0 30px rgba(212,175,55,0.3), 0 4px 15px rgba(212,175,55,0.2)',
              }}>
              Unirse al Directorio
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>
            <button onClick={() => setDemoOpen(true)} className="btn-nightlife-secondary text-base px-8 py-4">
              Ver Demo
            </button>
          </div>
        </FadeIn>
      </header>

      {/* ─ Stats ─ */}
      <FadeIn className="max-w-[800px] mx-auto px-6 mb-20">
        <div className="grid grid-cols-3 gap-3">
          <StatPill value="+500" label="Profesionales" />
          <StatPill value="24h" label="Respuesta Media" />
          <StatPill value="100%" label="Verificados" />
        </div>
      </FadeIn>

      {/* ─ Bento Grid ─ */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-8 pb-24">
        <FadeIn>
          <p className="uppercase tracking-[0.25em] text-xs font-semibold mb-3 text-center" style={{ color: '#D4AF37' }}>
            Categorías
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Encuentra tu <span className="text-gradient">talento</span>
          </h2>
        </FadeIn>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[200px] md:auto-rows-[260px]">
          <FadeIn delay={0} className="md:row-span-2">
            <BentoCard image={bentoMusica} icon={<Music size={20} />} title="Música" subtitle="DJs, productores y técnicos de sonido" className="h-full" />
          </FadeIn>
          <FadeIn delay={0.1} className="md:col-span-2">
            <BentoCard image={bentoGastro} icon={<UtensilsCrossed size={20} />} title="Gastro" subtitle="Bartenders, chefs y catering premium" className="h-full" />
          </FadeIn>
          <FadeIn delay={0.2} className="md:row-span-2">
            <BentoCard image={bentoImagen} icon={<Camera size={20} />} title="Imagen" subtitle="Fotógrafos, videógrafos y diseñadores" className="h-full" />
          </FadeIn>
          <FadeIn delay={0.3} className="md:col-span-2">
            <BentoCard image={bentoStaff} icon={<Users size={20} />} title="Staff" subtitle="RRPP, hostess, seguridad y coordinación" className="h-full" />
          </FadeIn>
        </div>
      </section>

      {/* ─ CTA ─ */}
      <FadeIn className="max-w-[1200px] mx-auto px-6 md:px-8 pb-24">
        <div className="rounded-3xl p-10 md:p-16 text-center relative overflow-hidden"
          style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)', backdropFilter: 'blur(20px)' }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #D4AF37 0%, transparent 70%)', filter: 'blur(80px)' }} />
          <h2 className="text-2xl md:text-4xl font-bold mb-4 relative z-10">
            ¿Listo para <span className="text-gradient">destacar</span>?
          </h2>
          <p className="text-sm md:text-base mb-8 relative z-10" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Crea tu perfil profesional y conecta con oportunidades exclusivas.
          </p>
          <button onClick={() => navigate('/auth')} className="relative z-10 btn-nightlife-primary text-base px-10 py-4">
            Crear Perfil Gratis
          </button>
        </div>
      </FadeIn>

      <LegalFooter />
      <DemoVideoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </div>
  );
};

export default Landing;
