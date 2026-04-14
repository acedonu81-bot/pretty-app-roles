import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { motion, useInView, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Music, UtensilsCrossed, Users, Camera, ArrowRight, Sparkles, X, ChevronLeft, ChevronRight, Building2, Scissors, Headphones, Zap, Radio, Star, CalendarDays, Search, Award, Globe, CheckCircle, Smartphone, Video, Heart } from 'lucide-react';
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

/* ── Rotating word ── */
const ROTATING_WORDS = ['DJs', 'Bartenders', 'Fotógrafos', 'Promotores', 'Staff VIP', 'Productores', 'Maquilladores', 'VJs'];
const RotatingWord = () => {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setIndex(i => (i + 1) % ROTATING_WORDS.length), 2200);
    return () => clearInterval(iv);
  }, []);
  return (
    <span className="relative inline-block" style={{ minWidth: 'min(280px, 60vw)', overflow: 'visible', paddingBottom: '0.15em' }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -24, filter: 'blur(6px)' }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="text-gradient inline-block"
          style={{ lineHeight: 1.15, display: 'inline-block' }}
        >
          {ROTATING_WORDS[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

/* ── Marquee strip ── */
const MARQUEE_ITEMS = ['🎧 DJs & Artistas', '🍹 Bartenders', '📸 Fotógrafos', '🎬 Videógrafos', '💄 Maquilladores', '🎤 Promotores', '🎹 Productores', '💡 VJs', '🎻 Artistas en Vivo', '👑 Staff VIP', '🎙️ Locutores'];
const MarqueeStrip = () => (
  <div className="overflow-hidden py-4 mb-0" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
    <motion.div
      className="flex gap-4 sm:gap-6 md:gap-8 whitespace-nowrap"
      animate={{ x: ['0%', '-50%'] }}
      transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
      style={{ width: 'max-content' }}
    >
      {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
        <span key={i} className="text-sm font-semibold px-4 py-1.5 rounded-full"
          style={{ color: 'rgba(212,175,55,0.7)', background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.1)', letterSpacing: '0.05em' }}>
          {item}
        </span>
      ))}
    </motion.div>
  </div>
);

/* ── Bento card ── */
const BentoCard = ({
  image, icon, title, subtitle, className = '', onClick, children,
}: {
  image: string; icon: React.ReactNode; title: string; subtitle: string; className?: string; onClick?: () => void; children?: React.ReactNode;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const shinePosX = useMotionValue(50);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 180, damping: 18 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 180, damping: 18 });
  const shineOpacity = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const shineBg = useTransform(
    shinePosX,
    x => `radial-gradient(ellipse 55% 75% at ${x}% 50%, rgba(212,175,55,0.18) 0%, transparent 65%)`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(nx);
    mouseY.set(ny);
    shinePosX.set(((e.clientX - rect.left) / rect.width) * 100);
    shineOpacity.set(1);
  };
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    shineOpacity.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 900, border: '1px solid rgba(212,175,55,0.15)' }}
      whileHover={{ scale: 1.04, y: -10, borderColor: 'rgba(212,175,55,0.5)' }}
      transition={{ type: 'spring', stiffness: 220, damping: 22 }}
      className={`relative overflow-hidden rounded-2xl cursor-pointer group ${className}`}
    >
      <img src={image} alt={title} loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        style={{ filter: 'saturate(0.6) brightness(0.8)' }} />
      {/* Dark overlay */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, rgba(10,10,10,0) 0%, rgba(10,10,10,0.5) 50%, rgba(10,10,10,0.82) 100%)',
      }} />
      {/* Shine que sigue el ratón */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ background: shineBg, opacity: shineOpacity }} />
      {/* Borde dorado al hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ boxShadow: 'inset 0 0 60px rgba(212,175,55,0.1)' }} />
      {/* Contenido */}
      <div className="relative z-10 h-full flex flex-col justify-end p-5">
        {children && (
          <div className="mb-3">{children}</div>
        )}
        <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110"
          style={{
            background: 'rgba(212,175,55,0.12)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(212,175,55,0.3)',
            color: '#D4AF37',
          }}>
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gradient mb-1">{title}</h3>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>{subtitle}</p>
        <p className="text-[0.6rem] font-bold mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0 tracking-widest uppercase" style={{ color: '#D4AF37' }}>
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

/* ── Pexels helpers ── */
const px = (id: number) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop`;

// All IDs verified visually via Chrome DevTools:
// 1540406=DJ decks | 164745=DJ controller lit | 1190297=concert crowd | 1105666=concert orange lights
// 2747449=audience from stage | 1763075=venue interior | 2608517=VIP staff formal | 3379934=photographer
// 196644=creative notebook | 3685530=makeup artist | 2681751=woman with glam makeup | 34321369=catering tray
// 36933463=gourmet buffet bowls | 29068721=catering shot glasses | 544961=cocktails toast

/* ── Role detail data ── */
const ROLE_DETAILS = [
  {
    key: 'musica', title: 'Música', icon: <Music size={28} />, tagline: 'DJs, productores, artistas en vivo, VJs y técnicos de sonido',
    steps: [
      { icon: <Headphones size={22} />, image: px(1540406), title: '¿Qué es este rol?',              body: 'DJs, productores, artistas en vivo, VJs y técnicos de sonido para clubs, festivales, bodas y eventos corporativos en toda Europa.' },
      { icon: <Music size={22} />,      image: px(164745),  title: 'Tu perfil, tu marca',             body: 'Incrusta tus sesiones de hearthis.at, Mixcloud o SoundCloud. Los empresarios escuchan tu trabajo antes de contactarte — sin intermediarios.' },
      { icon: <Zap size={22} />,        image: px(1190297), title: 'Flash Booking',                   body: 'Activa tu disponibilidad en tiempo real y recibe ofertas urgentes de salas que necesitan cubrir una noche con pocas horas de antelación.' },
      { icon: <Radio size={22} />,      image: px(1105666), title: 'Escenario Virtual',               body: 'Emite tus sesiones en directo. Empresarios de toda Europa te ven actuar y pueden contactarte al instante. La vitrina más potente del sector.' },
      { icon: <Heart size={22} />,      image: px(2747449), title: 'Fan Club — ingresos recurrentes', body: 'Monetiza tu audiencia directamente. Tus fans se suscriben desde 4,99€/mes para acceder a sesiones exclusivas, contenido privado y mensajes directos. Tú recibes el 80%.' },
    ],
  },
  {
    key: 'gastro', title: 'Gastro & Sala', icon: <UtensilsCrossed size={28} />, tagline: 'Bartenders, chefs y catering premium',
    steps: [
      { icon: <UtensilsCrossed size={22} />, image: px(34321369), title: '¿Qué es este rol?',         body: 'Bartenders, camareros VIP, chefs de eventos y catering premium para hostelería nocturna y eventos exclusivos en toda Europa.' },
      { icon: <Video size={22} />,           image: px(544961),   title: 'Muestra tu talento',        body: 'Sube vídeos cortos de tus creaciones y cócteles. Tu portfolio habla por ti antes de cualquier entrevista.' },
      { icon: <CalendarDays size={22} />,    image: px(36933463), title: 'Gestión de disponibilidad', body: 'Define tu calendario. Recibe ofertas directas de salas y eventos sin perder tiempo con llamadas interminables.' },
      { icon: <Star size={22} />,            image: px(29068721), title: 'Reputación verificada',     body: 'Cada evento suma una valoración real. La mejor carta de presentación para eventos de mayor categoría.' },
    ],
  },
  {
    key: 'imagen', title: 'Imagen & Media', icon: <Camera size={28} />, tagline: 'Fotógrafos, videógrafos y creadores',
    steps: [
      { icon: <Camera size={22} />,  image: px(3379934), title: '¿Qué es este rol?', body: 'Fotógrafos de eventos, videógrafos, realizadores de contenido y técnicos visuales especializados en el entretenimiento nocturno.' },
      { icon: <Video size={22} />,   image: px(196644),  title: 'Portfolio visual',  body: 'Sube imágenes y vídeos cortos de tu trabajo real. Una galería que muestra tu estilo mejor que cualquier CV.' },
      { icon: <Search size={22} />,  image: px(1190297), title: 'Visibilidad SEO',   body: 'Tu perfil aparece indexado en buscadores. Salas, productoras y agencias de Europa te encuentran cuando te necesitan.' },
      { icon: <Zap size={22} />,     image: px(1763075), title: 'Booking directo',   body: 'Los empresarios filtran por especialidad, zona y precio. Contacto directo sin agencias ni comisiones ocultas.' },
    ],
  },
  {
    key: 'staff', title: 'Staff & Promoción', icon: <Users size={28} />, tagline: 'RRPP, hostess, promotores y azafatas',
    steps: [
      { icon: <Users size={22} />,   image: px(2608517), title: '¿Qué es este rol?',                  body: 'Relaciones públicas, promotores, hostess, azafatas y coordinadores de acceso para clubs, festivales y eventos privados.' },
      { icon: <Globe size={22} />,   image: px(1763075), title: 'Primera plataforma formal para RRPP', body: 'XPEAK formaliza el trabajo de RRPP en Europa. Define tus tarifas y condiciones sin depender de contactos informales.' },
      { icon: <Zap size={22} />,     image: px(1105666), title: 'Ingresos transparentes',              body: 'Publica tus tarifas y disponibilidad. Sin intermediarios ni comisiones. El empresario ve tu perfil y te contacta directamente.' },
      { icon: <Award size={22} />,   image: px(2747449), title: 'Construye reputación',                body: 'Valoraciones verificadas de cada evento. Tu historial habla más que cualquier recomendación de boca en boca.' },
    ],
  },
  {
    key: 'belleza', title: 'Belleza & Estética', icon: <Scissors size={28} />, tagline: 'Maquilladores, peluqueros y estilistas',
    steps: [
      { icon: <Scissors size={22} />,   image: px(3685530), title: '¿Qué es este rol?',        body: 'Maquilladores artísticos, peluqueros de artistas, estilistas para shows, caracterizadores y técnicos de efectos especiales para escenario.' },
      { icon: <Sparkles size={22} />,   image: px(2681751), title: 'Tu trabajo habla',          body: 'Sube fotos y vídeos de tus transformaciones. Los artistas y salas buscan talento visual antes de contactar.' },
      { icon: <Star size={22} />,       image: px(1105666), title: 'Especialización nocturna',  body: 'XPEAK es el único directorio donde artistas, managers y productoras buscan profesionales de belleza del sector nocturno.' },
      { icon: <Smartphone size={22} />, image: px(2608517), title: 'Contacto directo',          body: 'Sin agencias ni intermediarios. Artistas y productoras te encuentran en XPEAK y contactan directamente a través de la plataforma.' },
    ],
  },
  {
    key: 'empresario', title: 'Empresario', icon: <Building2 size={28} />, tagline: 'Salas, promotoras y agencias de eventos',
    steps: [
      { icon: <Building2 size={22} />,   image: px(1763075), title: '¿Para quién es?',                   body: 'Propietarios de clubs, salas de conciertos, agencias de eventos y promotoras que necesitan contratar talento profesional verificado.' },
      { icon: <Search size={22} />,      image: px(1540406), title: 'Encuentra al profesional ideal',     body: 'Filtra por rol, especialidad, zona y precio. Escucha sesiones, ve portfolios y lee valoraciones reales antes de contactar.' },
      { icon: <Zap size={22} />,         image: px(1190297), title: 'Flash Booking — cubre una noche en 1h', body: 'Publica una oferta urgente y recibe respuestas de profesionales disponibles en tu zona en menos de 60 minutos.' },
      { icon: <CheckCircle size={22} />, image: px(2747449), title: 'Sin sorpresas',                      body: 'Perfiles con historial verificado, valoraciones reales y tarifas transparentes. El sistema XPEAK protege a ambas partes en cada contratación.' },
    ],
  },
];

/* ── Role Modal con fichas ── */
const RoleModal = ({ role, onClose, onJoin }: { role: typeof ROLE_DETAILS[0]; onClose: () => void; onJoin: () => void }) => {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const total = role.steps.length;
  const isLast = step === total - 1;
  const cur = role.steps[step];

  const goTo = (next: number) => {
    if (next < 0 || next >= total) return;
    setDir(next > step ? 1 : -1);
    setStep(next);
  };

  const imgVariants = {
    enter: (d: number) => ({ x: d > 0 ? 120 : -120, opacity: 0, scale: 1.05 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (d: number) => ({ x: d > 0 ? -120 : 120, opacity: 0, scale: 0.96 }),
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: 'spring', stiffness: 280, damping: 26 }}
          onClick={e => e.stopPropagation()}
          className="relative w-full max-w-lg rounded-t-3xl sm:rounded-2xl overflow-hidden"
          style={{ background: '#0e0e0e', border: '1px solid rgba(226,190,80,0.18)' }}
        >
          {/* ── Image area ── */}
          <div className="relative h-56 overflow-hidden">
            <AnimatePresence custom={dir} mode="wait">
              <motion.div
                key={`img-${step}`}
                custom={dir}
                variants={imgVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <img
                  src={cur.image}
                  alt={cur.title}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>

            {/* gradient: dark top + heavy dark bottom */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 35%, rgba(14,14,14,0.92) 100%)' }} />

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-white/20"
              style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <X size={14} className="text-white/80" />
            </button>

            {/* Step counter */}
            <div className="absolute top-3 right-3 text-[0.65rem] font-bold px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.35)', letterSpacing: '0.05em' }}>
              {String(step + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </div>

            {/* Bottom: icon badge + title overlaid on image */}
            <AnimatePresence custom={dir} mode="wait">
              <motion.div
                key={`title-${step}`}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.28, delay: 0.08 }}
                className="absolute bottom-0 left-0 right-0 px-5 pb-4 flex items-end gap-3"
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(14px)', border: '1px solid rgba(212,175,55,0.45)', color: '#D4AF37' }}>
                  {cur.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[0.6rem] font-bold uppercase tracking-widest mb-0.5" style={{ color: 'rgba(212,175,55,0.75)' }}>
                    {role.title}
                  </p>
                  <h4 className="text-[1.05rem] font-bold leading-tight text-white" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}>
                    {cur.title}
                  </h4>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Dots ── */}
          <div className="flex justify-center gap-1.5 pt-3 pb-1">
            {role.steps.map((_, i) => (
              <button key={i} onClick={() => goTo(i)}
                className="rounded-full transition-all duration-300"
                style={{ width: i === step ? 22 : 6, height: 6, background: i === step ? '#D4AF37' : 'rgba(255,255,255,0.14)' }} />
            ))}
          </div>

          {/* ── Body text ── */}
          <div className="overflow-hidden" style={{ minHeight: 76 }}>
            <AnimatePresence custom={dir} mode="wait">
              <motion.p
                key={`body-${step}`}
                custom={dir}
                variants={{ enter: d => ({ x: d > 0 ? 40 : -40, opacity: 0 }), center: { x: 0, opacity: 1 }, exit: { opacity: 0, x: 0 } }}
                initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                className="text-sm leading-relaxed px-5 py-3"
                style={{ color: 'rgba(255,255,255,0.62)' }}
              >
                {cur.body}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* ── Navigation ── */}
          <div className="flex items-center gap-3 px-5 pb-6 pt-1">
            <button
              onClick={() => goTo(step - 1)} disabled={step === 0}
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-20 hover:bg-white/8"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <ChevronLeft size={18} />
            </button>
            {isLast ? (
              <button onClick={onJoin}
                className="flex-1 py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #D4AF37, #B8941E)', color: '#0A0A0A' }}>
                Crear perfil gratis →
              </button>
            ) : (
              <button onClick={() => goTo(step + 1)}
                className="flex-1 py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: 'rgba(212,175,55,0.09)', border: '1px solid rgba(212,175,55,0.28)', color: '#D4AF37' }}>
                Siguiente →
              </button>
            )}
            <button
              onClick={() => goTo(step + 1)} disabled={isLast}
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-20 hover:bg-white/8"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

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
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-xl font-bold tracking-wider transition-opacity hover:opacity-70">
            X<span className="text-gradient">PEAK</span>
          </button>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/auth')}
              className="text-xs font-semibold px-4 py-2 rounded-lg transition-all"
              style={{ color: 'rgba(255,255,255,0.6)' }}>
              Acceder
            </button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/auth')}
              className="text-xs font-bold px-5 py-2 rounded-lg"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              Unirse
            </motion.button>
          </div>
        </div>
      </nav>

      {/* ─ Hero ─ */}
      <header className="max-w-[1200px] mx-auto px-4 md:px-8 pt-16 pb-20 md:pt-40 md:pb-44 text-center">
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
            El talento de los <br className="hidden sm:block" />
            <RotatingWord />{' '}
            <span style={{ color: 'rgba(255,255,255,0.9)' }}>está aquí</span>
          </h1>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="text-base md:text-lg max-w-xl mx-auto mb-12 leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.45)' }}>
            El directorio profesional de la noche. Conecta, contrata y destaca en toda Europa.
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

      <MarqueeStrip />

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
        {/* Fila 1-2: bento asimétrico */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[170px] md:auto-rows-[260px] mb-3 md:mb-4">
          <FadeIn delay={0} className="md:row-span-2">
            <BentoCard image={bentoMusica} icon={<Music size={20} />} title="Música" subtitle="DJs, productores, artistas en vivo, VJs y técnicos de sonido" className="h-full"
              onClick={() => setActiveRole(ROLE_DETAILS[0])} />
          </FadeIn>
          <FadeIn delay={0.1} className="md:col-span-2">
            <BentoCard
              image="https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=800"
              icon={<Building2 size={20} />} title="Empresario" subtitle="Salas, promotoras y agencias de eventos" className="h-full"
              onClick={() => setActiveRole(ROLE_DETAILS[5])} />
          </FadeIn>
          <FadeIn delay={0.15} className="md:row-span-2">
            <BentoCard image={bentoImagen} icon={<Camera size={20} />} title="Imagen & Media" subtitle="Fotógrafos, videógrafos y creadores" className="h-full"
              onClick={() => setActiveRole(ROLE_DETAILS[2])} />
          </FadeIn>
          <FadeIn delay={0.2} className="md:col-span-2">
            <BentoCard image={bentoStaff} icon={<Users size={20} />} title="Staff & Promoción" subtitle="RRPP, hostess, promotores y azafatas" className="h-full"
              onClick={() => setActiveRole(ROLE_DETAILS[3])} />
          </FadeIn>
        </div>
        {/* Fila 3: Belleza + Gastro */}
        <div className="grid grid-cols-2 gap-3 md:gap-4" style={{ height: 180 }}>
          <FadeIn delay={0.25} className="h-full">
            <BentoCard
              image="https://images.pexels.com/photos/2681751/pexels-photo-2681751.jpeg?auto=compress&cs=tinysrgb&w=800"
              icon={<Scissors size={20} />} title="Belleza & Estética" subtitle="Maquilladores, peluqueros y estilistas" className="h-full"
              onClick={() => setActiveRole(ROLE_DETAILS[4])} />
          </FadeIn>
          <FadeIn delay={0.3} className="h-full">
            <BentoCard image={bentoGastro} icon={<UtensilsCrossed size={20} />} title="Gastro & Sala" subtitle="Bartenders, chefs y catering premium" className="h-full"
              onClick={() => setActiveRole(ROLE_DETAILS[1])} />
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
