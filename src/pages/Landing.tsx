import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Helmet } from 'react-helmet-async';
import { motion, useInView, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Music, UtensilsCrossed, Users, Camera, ArrowRight, Sparkles, X, ChevronLeft, ChevronRight, Building2, Scissors, Headphones, Zap, Radio, Star, CalendarDays, Search, Award, Globe, CheckCircle, Smartphone, Video, Heart, Palette, Megaphone, TrendingUp, Shield, FileText } from 'lucide-react';
import xpeakLogo from '@/assets/xpeak-logo.png';
import heroBg from '@/assets/hero-bg.jpg';
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
  const containerRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const iv = setInterval(() => setIndex(i => (i + 1) % ROTATING_WORDS.length), 2200);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const el = textRef.current;
    const parent = containerRef.current;
    if (!el || !parent) return;
    el.style.transform = '';
    const ratio = parent.offsetWidth / el.scrollWidth;
    if (ratio < 1) el.style.transform = `scaleX(${ratio})`;
  }, [index]);

  return (
    <span ref={containerRef} className="relative block w-full overflow-visible" style={{ height: '1.3em' }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-gradient absolute inset-x-0 top-0 bottom-0 flex items-center justify-center overflow-visible"
          style={{ transformOrigin: 'center' }}
        >
          <span ref={textRef} style={{ whiteSpace: 'nowrap', display: 'inline-block' }}>
          {ROTATING_WORDS[index]}
          </span>
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

/* ── Marquee strip ── */
const MARQUEE_ITEMS = ['DJs & Artistas', 'Bartenders', 'Fotógrafos', 'Videógrafos', 'Maquilladores', 'Promotores', 'Productores', 'VJs', 'Artistas en Vivo', 'Staff VIP', 'Locutores'];
const MarqueeStrip = () => (
  <div className="overflow-hidden py-5 mb-0" style={{ maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}>
    <motion.div
      className="flex items-center whitespace-nowrap"
      animate={{ x: ['0%', '-50%'] }}
      transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      style={{ width: 'max-content', gap: 0 }}
    >
      {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
        <span key={i} className="inline-flex items-center">
          <span className="text-xs font-bold tracking-[0.22em] uppercase"
            style={{ color: 'rgba(212,175,55,0.70)' }}>
            {item}
          </span>
          <span aria-hidden="true" className="mx-6 text-[0.75rem]" style={{ color: 'rgba(212,175,55,0.35)' }}>·</span>
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
        style={{ filter: 'saturate(0.75) brightness(0.95)' }} />
      {/* Dark overlay */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, rgba(10,10,10,0) 0%, rgba(10,10,10,0.35) 50%, rgba(10,10,10,0.65) 100%)',
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
        <h3 className="text-xl font-bold text-gradient mb-1">{title}</h3>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>{subtitle}</p>
        <p className="text-xs font-bold mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0 tracking-widest uppercase" style={{ color: '#D4AF37' }}>
          Ver detalles →
        </p>
      </div>
    </motion.div>
  );
};

/* ── Stats pill ── */
const StatPill = ({ value, label }: { value: string; label: React.ReactNode }) => (
  <div className="text-center px-2 py-3 md:px-8 md:py-5 rounded-xl"
    style={{
      background: 'rgba(212,175,55,0.04)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(212,175,55,0.1)',
    }}>
    <p className="text-xl md:text-3xl font-bold text-gradient leading-tight">{value}</p>
    <p className="text-[0.65rem] md:text-xs mt-1.5 tracking-wide uppercase" style={{ color: 'rgba(255,255,255,0.62)' }}>{label}</p>
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
      { icon: <Heart size={22} />,      image: px(2747449), title: 'Mi Ficha Pública', body: 'Comparte posts, audio, vídeo e imágenes con fans y empresarios. Tu ficha es tu tarjeta de presentación permanente en xpeak.es.' },
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
      { icon: <Search size={22} />,  image: px(3379934), title: 'Visibilidad SEO',   body: 'Tu perfil aparece indexado en buscadores. Salas, productoras y agencias de Europa te encuentran cuando te necesitan.' },
      { icon: <Zap size={22} />,     image: px(196644),  title: 'Booking directo',   body: 'Los empresarios filtran por especialidad, zona y precio. Contacto directo sin agencias ni comisiones ocultas.' },
    ],
  },
  {
    key: 'staff', title: 'Staff & Promoción', icon: <Users size={28} />, tagline: 'RRPP, hostess, promotores y azafatas',
    steps: [
      { icon: <Users size={22} />,   image: px(2608517), title: '¿Qué es este rol?',                  body: 'Relaciones públicas, promotores, hostess, azafatas y coordinadores de acceso para clubs, festivales y eventos privados.' },
      { icon: <Globe size={22} />,   image: px(1763075), title: 'Primera plataforma formal para RRPP', body: 'XPEAK formaliza el trabajo de RRPP en Europa. Define tus tarifas y condiciones sin depender de contactos informales.' },
      { icon: <Zap size={22} />,     image: px(2608517), title: 'Ingresos transparentes',              body: 'Publica tus tarifas y disponibilidad. Sin intermediarios ni comisiones. El empresario ve tu perfil y te contacta directamente.' },
      { icon: <Award size={22} />,   image: px(1763075), title: 'Construye reputación',                body: 'Valoraciones verificadas de cada evento. Tu historial habla más que cualquier recomendación de boca en boca.' },
    ],
  },
  {
    key: 'belleza', title: 'Belleza & Estética', icon: <Scissors size={28} />, tagline: 'Maquilladores, peluqueros y estilistas',
    steps: [
      { icon: <Scissors size={22} />,   image: px(3685530), title: '¿Qué es este rol?',        body: 'Maquilladores artísticos, peluqueros de artistas, estilistas para shows, caracterizadores y técnicos de efectos especiales para escenario.' },
      { icon: <Sparkles size={22} />,   image: px(2681751), title: 'Tu trabajo habla',          body: 'Sube fotos y vídeos de tus transformaciones. Los artistas y salas buscan talento visual antes de contactar.' },
      { icon: <Star size={22} />,       image: px(2681751), title: 'Especialización nocturna',  body: 'XPEAK es el único directorio donde artistas, managers y productoras buscan profesionales de belleza del sector nocturno.' },
      { icon: <Smartphone size={22} />, image: px(3685530), title: 'Contacto directo',          body: 'Sin agencias ni intermediarios. Artistas y productoras te encuentran en XPEAK y contactan directamente a través de la plataforma.' },
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
            <div className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full"
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
                  <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: 'rgba(212,175,55,0.75)' }}>
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
const FAQ_ITEMS = [
  { q: '¿Es gratis registrarse?', a: 'Sí. XPEAK es completamente gratuito durante su fase de crecimiento. Todas las funciones — perfil, Flash Booking, mensajería, estadísticas y contratos — están disponibles sin coste ni comisiones.' },
  { q: '¿Necesito experiencia profesional para unirme?', a: 'No. Hay un rol específico llamado "Artista Promesa" pensado para quienes están empezando. La comunidad te puede apoyar con votos para que asciendan a Profesional.' },
  { q: '¿Cómo funciona el Flash Booking?', a: 'Un empresario publica una oferta urgente (fecha, lugar, caché). Los profesionales disponibles en esa zona reciben una notificación y pueden responder. El empresario elige. Todo en menos de una hora.' },
  { q: '¿Soy una sala o promotora? ¿Cómo me registro?', a: 'Elige el rol "Empresario" al registrarte. Es totalmente gratuito y sin límites para contratar: búsqueda en el directorio, Flash Booking ilimitado y mensajería directa. XPEAK no cobra comisiones por contratación. El trato es directo entre sala y profesional.' },
  { q: '¿En qué ciudades funciona?', a: 'Actualmente en toda España: Madrid, Barcelona, Valencia, Sevilla, Ibiza, Málaga y más de 40 ciudades. La expansión a Portugal y resto de Europa está prevista para 2027.' },
  { q: '¿Cómo se verifican los perfiles?', a: 'Los perfiles verificados son revisados manualmente por el equipo de XPEAK. Puedes solicitar verificación desde tu panel de perfil una vez que tengas la información completa.' },
  { q: '¿Puedo cancelar mi suscripción en cualquier momento?', a: 'Sí. Sin permanencia ni penalizaciones. Puedes cancelar desde Mi Perfil > Plan y sigues teniendo acceso hasta el final del período pagado.' },
];



const FaqSection = () => {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="max-w-[800px] mx-auto px-6 md:px-8 pb-16 md:pb-24">
      <FadeIn className="text-center mb-10">
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.25em] mb-4" style={{ color: 'rgba(212,175,55,0.6)' }}>Preguntas frecuentes</p>
        <h2 className="text-3xl md:text-4xl font-black tracking-tight font-display">
          Todo lo que necesitas <span className="text-gradient">saber</span>
        </h2>
      </FadeIn>
      <div className="flex flex-col gap-2">
        {FAQ_ITEMS.map((item, i) => (
          <FadeIn key={i} delay={i * 0.04}>
            <div
              className="glass-panel overflow-hidden transition-all cursor-pointer"
              style={{ border: open === i ? '1px solid rgba(212,175,55,0.2)' : '1px solid rgba(255,255,255,0.05)' }}
              onClick={() => setOpen(open === i ? null : i)}
            >
              <div className="flex items-center justify-between px-5 py-4 gap-3">
                <p className="text-sm font-bold leading-snug" style={{ color: open === i ? '#D4AF37' : 'rgba(255,255,255,0.85)' }}>
                  {item.q}
                </p>
                <motion.span
                  animate={{ rotate: open === i ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0 text-lg font-light leading-none"
                  style={{ color: open === i ? '#D4AF37' : 'rgba(255,255,255,0.3)' }}>
                  +
                </motion.span>
              </div>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <p className="px-5 pb-5 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
};

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [demoOpen, setDemoOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<typeof ROLE_DETAILS[0] | null>(null);
  const [userCount, setUserCount] = useState<number | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterDone, setNewsletterDone] = useState(false);
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  useEffect(() => {
    import('@/integrations/supabase/client').then(({ supabase }) => {
      supabase.from('profiles').select('user_id', { count: 'exact', head: true })
        .then(({ count }) => { if (count !== null) setUserCount(count); });
    });
  }, []);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterLoading(true);
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      await (supabase.from as any)('newsletter_leads').insert({ email: newsletterEmail.trim().toLowerCase() });
      setNewsletterDone(true);
    } catch {
      navigate('/auth');
    } finally {
      setNewsletterLoading(false);
    }
  };

  return (
    <>
    <Helmet>
      <title>XPEAK | Contratar DJs, Staff y Profesionales para Eventos en España</title>
      <meta name="description" content="Contrata DJs verificados, fotógrafos, staff de sala y profesionales para tus eventos. Flash Booking en menos de 1h. Contratos automáticos. Gratis para salas y promotoras. Toda España." />
      <link rel="canonical" href="https://xpeak.es/" />
      <meta property="og:title" content="XPEAK | Contratar DJs, Staff y Profesionales para Eventos en España" />
      <meta property="og:description" content="Contrata DJs verificados, fotógrafos, staff de sala y profesionales para tus eventos. Flash Booking en menos de 1h. Contratos automáticos. Gratis para salas y promotoras." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://xpeak.es/" />
      <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="XPEAK" />
      <meta property="og:locale" content="es_ES" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="XPEAK | Contratar DJs y Profesionales para Eventos" />
      <meta name="twitter:description" content="Flash Booking en menos de 1h. Contratos automáticos. Directorio verificado de DJs, staff, fotógrafos y más." />
      <meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": FAQ_ITEMS.map(item => ({
          "@type": "Question",
          "name": item.q,
          "acceptedAnswer": { "@type": "Answer", "text": item.a }
        }))
      })}</script>
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": "XPEAK — Contratar DJs, Staff y Profesionales para Eventos en España",
        "description": "XPEAK conecta salas, promotoras y organizadores con DJs, camareros, fotógrafos y staff verificados para eventos en España. Flash Booking en menos de 1h.",
        "thumbnailUrl": "https://xpeak.es/og-image.jpg",
        "uploadDate": "2026-01-01T00:00:00+01:00",
        "contentUrl": "https://xpeak.es/hero-dancefloor.mp4",
        "publisher": { "@type": "Organization", "name": "XPEAK", "url": "https://xpeak.es" }
      })}</script>
    </Helmet>
    <div className="min-h-screen relative overflow-x-hidden flex flex-col grain-overlay" style={{ background: 'transparent' }}>
      {/* ─ Hero background ─ */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={heroBg}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.75, filter: 'saturate(0.9) brightness(0.85)' }}
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #E2BE50 0%, transparent 65%)', filter: 'blur(90px)', animation: 'orbFloat1 18s ease-in-out infinite' }} />
        <div className="absolute top-[10%] right-[-15%] w-[500px] h-[500px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 65%)', filter: 'blur(100px)', animation: 'orbFloat2 24s ease-in-out infinite' }} />
        <div className="absolute bottom-[10%] left-[30%] w-[400px] h-[400px] rounded-full opacity-[0.14]"
          style={{ background: 'radial-gradient(circle, #E2BE50 0%, transparent 65%)', filter: 'blur(110px)', animation: 'orbFloat3 20s ease-in-out infinite' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(9,9,9,0.7) 60%, #090909 100%)' }} />
        {/* Grain texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`, backgroundSize: '180px' }} />
      </div>



      {/* ─ Nav (Glassmorphism) ─ */}
      <nav className="sticky top-0 z-50"
        style={{
          background: 'rgba(10,10,10,0.65)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(212,175,55,0.1)',
        }}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-4 md:py-5 flex justify-between items-center">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-2xl font-black tracking-widest transition-opacity hover:opacity-70 font-display">
            X<span className="text-gradient">PEAK</span>
          </button>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/auth')}
              className="hidden sm:block text-xs font-semibold px-4 py-2 rounded-lg transition-all"
              style={{ color: 'rgba(255,255,255,0.45)' }}>
              Acceder
            </button>
            <button onClick={() => navigate('/auth')}
              className="hidden sm:block text-xs font-semibold px-4 py-2 rounded-lg transition-all"
              style={{ color: 'rgba(255,255,255,0.65)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }}>
              <span className="flex items-center gap-1.5"><Building2 size={12} /> Soy empresario</span>
            </button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/auth')}
              className="text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-1.5"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              <Headphones size={13} /> Soy profesional
            </motion.button>
          </div>
        </div>
      </nav>

      {/* ─ Hero ─ */}
      <main>
      <header className="max-w-[1200px] mx-auto px-6 md:px-8 pt-16 pb-12 md:pt-28 md:pb-32 text-center">
        <FadeIn>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 md:mb-8"
            style={{
              background: 'rgba(212,175,55,0.06)',
              border: '1px solid rgba(212,175,55,0.15)',
            }}>
            <Sparkles size={14} style={{ color: '#D4AF37' }} />
            <span className="uppercase tracking-[0.3em] text-xs font-semibold" style={{ color: '#D4AF37' }}>
              Directorio Profesional
            </span>
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black leading-[1.05] mb-4 md:mb-7 max-w-5xl mx-auto tracking-tight text-center font-display">
            <span className="block" style={{ color: 'rgba(255,255,255,0.92)' }}>El talento</span>
            <span className="block text-gradient">de los eventos</span>
            <span className="block" style={{ color: 'rgba(255,255,255,0.92)' }}>está aquí</span>
          </h1>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="text-sm md:text-lg max-w-md mx-auto mb-6 md:mb-8 leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.62)' }}>
            El directorio profesional de eventos y ocio.<br className="hidden md:block" />
            <span style={{ color: 'rgba(255,255,255,0.45)' }}> Conecta · Contrata · Destaca</span>
          </p>
        </FadeIn>
        <FadeIn delay={0.25}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget as HTMLFormElement);
              const q = (fd.get('q') as string) || '';
              const city = (fd.get('city') as string) || '';
              if (user) {
                navigate('/dashboard', { state: { view: 'directorio', search: q, city } });
              } else {
                navigate('/auth');
              }
            }}
            className="relative max-w-xl mx-auto mb-6 md:mb-10 flex flex-col gap-2"
          >
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#D4AF37' }} />
              <input
                name="q"
                placeholder="Busca DJ, Fotógrafo, Bartender..."
                className="w-full pl-10 pr-4 py-3.5 rounded-xl text-sm focus:outline-none"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(212,175,55,0.25)',
                  backdropFilter: 'blur(12px)',
                  color: 'rgba(255,255,255,0.85)',
                }}
              />
            </div>
            <div className="flex gap-2">
              <select
                name="city"
                className="flex-1 py-3.5 px-4 rounded-xl text-sm appearance-none focus:outline-none"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(212,175,55,0.2)',
                  backdropFilter: 'blur(12px)',
                  color: 'rgba(255,255,255,0.65)',
                  minWidth: 0,
                }}
              >
                <option value="" style={{ background: '#0e0e14' }}>Toda España</option>
                {['Madrid','Barcelona','Valencia','Sevilla','Ibiza','Málaga','Bilbao','San Sebastián'].map(c => (
                  <option key={c} value={c} style={{ background: '#0e0e14' }}>{c}</option>
                ))}
              </select>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex-shrink-0 px-5 py-3.5 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}
              >
                <Search size={15} />
              </motion.button>
            </div>
          </form>
        </FadeIn>
        <FadeIn delay={0.35}>
          <p className="text-xs font-bold uppercase tracking-[0.25em] mb-4" style={{ color: 'rgba(255,255,255,0.35)' }}>
            ¿Quién eres?
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-stretch gap-3 max-w-xl mx-auto">
            {/* Profesional */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                if (typeof window !== 'undefined' && (window as any).fbq) (window as any).fbq('track', 'Lead');
                navigate('/auth');
              }}
              className="group flex-1 flex flex-col items-center gap-2 px-6 py-5 rounded-2xl transition-all text-center"
              style={{
                background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(184,148,30,0.08))',
                border: '1.5px solid rgba(212,175,55,0.45)',
                boxShadow: '0 0 32px rgba(212,175,55,0.12)',
              }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-1"
                style={{ background: 'rgba(212,175,55,0.15)' }}>
                <Headphones size={20} style={{ color: '#D4AF37' }} />
              </div>
              <p className="font-black text-base" style={{ color: '#D4AF37' }}>Soy profesional</p>
              <p className="text-xs leading-snug" style={{ color: 'rgba(255,255,255,0.5)' }}>
                DJ, fotógrafo, camarero,<br />staff, maquillador...
              </p>
              <p className="text-xs font-bold mt-1" style={{ color: 'rgba(212,175,55,0.7)' }}>
                Crea tu perfil y consigue contratos →
              </p>
            </motion.button>

            {/* Empresario */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/auth')}
              className="group flex-1 flex flex-col items-center gap-2 px-6 py-5 rounded-2xl transition-all text-center"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))',
                border: '1.5px solid rgba(255,255,255,0.28)',
                boxShadow: '0 0 24px rgba(255,255,255,0.05)',
              }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-1"
                style={{ background: 'rgba(255,255,255,0.12)' }}>
                <Building2 size={20} style={{ color: '#fff' }} />
              </div>
              <p className="font-black text-base" style={{ color: '#fff' }}>Busco talento</p>
              <p className="text-xs leading-snug" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Sala, promotora, agencia<br />o evento privado
              </p>
              <p className="text-xs font-bold mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Contrata sin comisiones →
              </p>
            </motion.button>
          </div>
          <p className="text-center text-xs mt-3" style={{ color: 'rgba(255,255,255,0.28)' }}>Registro siempre gratuito · Sin tarjeta</p>
        </FadeIn>
      </header>


      {/* ─ Stats ─ */}
      <FadeIn className="max-w-[900px] mx-auto px-6 mb-10 md:mb-14">
        <div className="grid grid-cols-3 gap-2 md:gap-4">
          <StatPill value="GRATIS" label={<><span className="md:hidden">Sin tarjeta</span><span className="hidden md:inline">Sin tarjeta · Para siempre</span></>} />
          <StatPill value="España" label={<><span className="md:hidden">Europa 2027</span><span className="hidden md:inline">+ Europa en 2027</span></>} />
          <StatPill value="+40" label="Ciudades activas" />
        </div>
      </FadeIn>

      {/* ─ Nightlife atmosphere strip ─ */}
      <FadeIn className="max-w-[1200px] mx-auto px-6 md:px-8 pb-12 md:pb-16">
        <div className="grid grid-cols-3 gap-2 md:gap-3 h-24 md:h-[130px]">
          {[1190297, 1540406, 1105666].map((id) => (
            <div key={id} className="relative rounded-xl overflow-hidden">
              <img
                src={px(id)}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                style={{ filter: 'saturate(0.85) brightness(0.8)' }}
              />
              <div className="absolute inset-0 rounded-xl" style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(9,9,9,0.55) 100%)' }} />
            </div>
          ))}
        </div>
      </FadeIn>

      {/* ─ DJs en Directo ─ */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-8 pb-12">
        <FadeIn>
          <LiveDJsSection onNavigate={() => user
            ? navigate('/dashboard', { state: { view: 'escenario' } })
            : navigate('/auth')
          } />
        </FadeIn>
      </section>

      {/* ─ Mobile Categories ─ */}
      <section className="block md:hidden max-w-[1200px] mx-auto px-6 pb-10">
        <FadeIn>
          <div className="text-center mb-5">
            <p className="uppercase tracking-[0.3em] text-xs font-semibold mb-2" style={{ color: '#D4AF37' }}>Categorías</p>
            <h2 className="text-2xl font-black tracking-tight font-display">
              Encuentra tu <span className="text-gradient">talento</span>
            </h2>
          </div>
        </FadeIn>
        <div
          className="flex gap-3 overflow-x-auto pb-2"
          style={{ scrollbarWidth: 'none', maskImage: 'linear-gradient(to right, black 80%, transparent 100%)' }}
        >
          {ROLE_DETAILS.map(role => (
            <button
              key={role.key}
              onClick={() => setActiveRole(role)}
              className="flex-none flex items-center gap-2.5 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all active:scale-95"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.14)', whiteSpace: 'nowrap' }}
            >
              <span style={{ color: '#D4AF37' }}>{role.icon}</span>
              {role.title}
            </button>
          ))}
          <div className="flex-none w-6" />
        </div>
      </section>

      {/* ─ Bento Grid ─ */}
      <section className="hidden md:block max-w-[1200px] mx-auto px-6 md:px-8 pb-10 md:pb-16">
        <FadeIn>
          <div className="text-center mb-14">
            <p className="uppercase tracking-[0.3em] text-xs font-semibold mb-4" style={{ color: '#D4AF37' }}>
              Categorías
            </p>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight font-display">
              Encuentra tu <span className="text-gradient">talento</span>
            </h2>
          </div>
        </FadeIn>
        <p className="text-center text-xs text-muted-foreground mb-6" style={{ color: 'rgba(255,255,255,0.55)' }}>
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

      {/* ─ Dos pistas ─ */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-8 pb-12 md:pb-20">
        <FadeIn className="text-center mb-10">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.25em] mb-4" style={{ color: 'rgba(212,175,55,0.6)' }}>¿Quién eres tú?</p>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight font-display mb-3">
            Dos caminos, <span className="text-gradient">una plataforma</span>
          </h2>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pista Profesional */}
          <FadeIn delay={0.05}>
            <div className="rounded-2xl p-6 md:p-8 flex flex-col gap-5"
              style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.14)' }}>
              <div>
                <p className="text-[0.65rem] font-black uppercase tracking-widest mb-2" style={{ color: '#D4AF37' }}>Soy Profesional</p>
                <p className="text-xl font-black leading-tight">Consigue bolos.<br />Construye tu marca.</p>
                <p className="text-xs mt-2 leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  DJ · Bartender · Fotógrafo · Staff · Maquillador · Promotor · VJ
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { icon: <Headphones size={13} />, label: 'DJ / Artista',    color: '#D4AF37' },
                  { icon: <UtensilsCrossed size={13} />, label: 'Bartender',  color: '#FB923C' },
                  { icon: <Camera size={13} />,     label: 'Foto & Vídeo',    color: '#34D399' },
                  { icon: <Users size={13} />,      label: 'Staff & RRPP',    color: '#38BDF8' },
                  { icon: <Scissors size={13} />,   label: 'Estilista',       color: '#F472B6' },
                  { icon: <Megaphone size={13} />,  label: 'Promotor',        color: '#A78BFA' },
                ].map(r => (
                  <span key={r.label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.7rem] font-semibold"
                    style={{ background: `${r.color}10`, border: `1px solid ${r.color}25`, color: 'rgba(255,255,255,0.65)' }}>
                    <span style={{ color: r.color }}>{r.icon}</span>{r.label}
                  </span>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Pista Empresario */}
          <FadeIn delay={0.12}>
            <div className="rounded-2xl p-6 md:p-8 flex flex-col gap-5"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <p className="text-[0.65rem] font-black uppercase tracking-widest" style={{ color: '#F59E0B' }}>Tengo un Local</p>
                  <span className="text-[0.55rem] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.25)' }}>
                    Siempre gratis
                  </span>
                </div>
                <p className="text-xl font-black leading-tight">Tu sala siempre con música.<br />Sin comisiones ni papeleo.</p>
                <p className="text-xs mt-2 leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  Club · Sala de conciertos · Festival · Evento privado · Promotora
                </p>
              </div>
              <div className="flex flex-col gap-2.5">
                {[
                  { icon: <FileText size={13} />,    text: 'Contrato PDF automático en cada contratación — cobertura legal sin esfuerzo' },
                  { icon: <Zap size={13} />,         text: 'Sustitución de emergencia — si tu profesional falla, XPEAK lo cubre en menos de 1h' },
                  { icon: <CalendarDays size={13} />, text: 'Panel de gestión: calendario, historial de pagos y exportación mensual' },
                ].map(item => (
                  <div key={item.text} className="flex items-start gap-2.5 text-xs" style={{ color: 'rgba(255,255,255,0.58)' }}>
                    <span className="flex-shrink-0 mt-0.5" style={{ color: '#F59E0B' }}>{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─ Blog / Guías ─ */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-8 py-12">
        <FadeIn>
          <h2 className="text-2xl md:text-4xl font-black mb-2 tracking-tight font-display">
            Guías y <span className="text-gradient">recursos</span>
          </h2>
          <p className="text-sm mb-8 max-w-md" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Todo lo que necesitas saber antes de contratar para tu evento.
          </p>
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {([
            { href: '/blog/cuanto-cobra-un-dj-en-espana', icon: <Headphones size={18} />, tag: 'DJ', title: '¿Cuánto cobra un DJ en España? Precios 2026', desc: 'Tarifas reales por tipo de evento y duración.' },
            { href: '/blog/dj-para-bodas-vs-discoteca', icon: <Music size={18} />, tag: 'DJ', title: 'DJ de boda vs DJ de discoteca: ¿cuál necesitas?', desc: 'Diferencias, habilidades y cómo elegir el perfil correcto.' },
            { href: '/blog/cuanto-cobra-un-camarero-de-eventos', icon: <UtensilsCrossed size={18} />, tag: 'Camareros', title: '¿Cuánto cobra un camarero de eventos?', desc: 'Precios por hora, por evento y ratio boda vs corporativo.' },
            { href: '/blog/cuantos-camareros-necesito-para-mi-boda', icon: <Users size={18} />, tag: 'Bodas', title: 'Cuántos camareros necesito para mi boda', desc: 'Tabla de ratios por número de invitados y tipo de servicio.' },
          ] as { href: string; icon: React.ReactNode; tag: string; title: string; desc: string }[]).map((post, i) => (
            <FadeIn key={post.href} delay={i * 0.07}>
              <a href={post.href}
                className="group block p-5 rounded-2xl h-full transition-all hover:scale-[1.02]"
                style={{ background: 'rgba(8,8,8,0.72)', backdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,0.09)' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3 flex-shrink-0"
                  style={{ background: 'rgba(212,175,55,0.09)', border: '1px solid rgba(212,175,55,0.18)', color: '#D4AF37' }}>
                  {post.icon}
                </div>
                <span className="inline-block text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded mb-2"
                  style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.18)' }}>
                  {post.tag}
                </span>
                <p className="text-sm font-black leading-snug mb-2">{post.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.62)' }}>{post.desc}</p>
              </a>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ─ Testimonios ─ */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-8 pb-16">
        <FadeIn className="text-center mb-10">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.25em] mb-4" style={{ color: 'rgba(212,175,55,0.6)' }}>Lo que dicen los profesionales</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight font-display">
            La comunidad <span className="text-gradient">habla</span>
          </h2>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {([
            { name: 'Marcos DJ', role: 'DJ Residente · Madrid', avatar: 'M', color: '#D4AF37',
              text: 'En menos de una semana me contactaron dos salas de Madrid a través del directorio. Nunca había conseguido bookings tan rápido sin intermediarios.' },
            { name: 'Laura V.', role: 'Maquilladora · Barcelona', avatar: 'L', color: '#F472B6',
              text: 'Mi perfil en XPEAK me trajo tres artistas nuevos en el primer mes. Por fin un sitio donde el sector nocturno busca talento de imagen de verdad.' },
            { name: 'Club Nocturno NX', role: 'Empresario · Valencia', avatar: 'N', color: '#38BDF8',
              text: 'El Flash Booking nos salvó una noche: publicamos la oferta a las 10pm y a las 11pm teníamos DJ confirmado. Antes eso nos costaba llamadas interminables.' },
          ] as { name: string; role: string; avatar: string; color: string; text: string }[]).map((t, i) => (
            <FadeIn key={t.name} delay={i * 0.08}>
              <div className="glass-panel p-7 h-full flex flex-col gap-5"
                style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-sm leading-relaxed flex-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
                    style={{ background: `${t.color}18`, color: t.color, border: `1px solid ${t.color}30` }}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-xs font-black">{t.name}</p>
                    <p className="text-[0.72rem]" style={{ color: 'rgba(255,255,255,0.48)' }}>{t.role}</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>


      {/* ─ FAQ ─ */}
      <FaqSection />

      {/* ─ CTA ─ */}
      <FadeIn className="max-w-[1200px] mx-auto px-6 md:px-8 pb-16">
        <div className="rounded-3xl p-12 md:p-20 text-center relative overflow-hidden"
          style={{
            background: 'rgba(212,175,55,0.03)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(212,175,55,0.1)',
          }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #D4AF37 0%, transparent 70%)', filter: 'blur(100px)' }} />
          <h2 className="text-2xl md:text-5xl font-black mb-4 relative z-10 tracking-tight font-display leading-tight">
            ¿Listo para <span className="text-gradient">destacar?</span>
          </h2>
          <p className="text-sm mb-8 relative z-10 max-w-xs mx-auto" style={{ color: 'rgba(255,255,255,0.5)' }}>
            2 minutos. Sin tarjeta. Sin trampa.
          </p>
          <div className="relative z-10 flex flex-col sm:flex-row justify-center gap-3">
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/auth')}
              className="inline-flex items-center justify-center gap-2 text-sm font-black px-8 py-4 rounded-xl transition-all"
              style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#0A0A0A', boxShadow: '0 0 40px rgba(212,175,55,0.2)' }}>
              <Headphones size={16} /> Soy Profesional
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/auth')}
              className="inline-flex items-center justify-center gap-2 text-sm font-black px-8 py-4 rounded-xl transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.82)' }}>
              <Building2 size={16} /> Tengo un Local
            </motion.button>
          </div>
          <p className="relative z-10 mt-5 text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Registro gratuito · Sin tarjeta de crédito
          </p>
        </div>
      </FadeIn>

      </main>
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
    </>
  );
};

export default Landing;
