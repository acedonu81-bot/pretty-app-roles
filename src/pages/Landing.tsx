import { useState, useRef, useEffect, useCallback, useMemo } from 'react';

const ALL_CITIES = [
  // Grandes capitales y destinos de ocio
  'Madrid','Barcelona','Valencia','Sevilla','Bilbao','Málaga','Ibiza',
  'Palma de Mallorca','Zaragoza','Murcia','Alicante','Granada','Córdoba',
  'San Sebastián','Santander','Valladolid','Santiago de Compostela','Pamplona',
  'Vitoria-Gasteiz','Logroño',
  // Galicia
  'Vigo','A Coruña','Ourense','Lugo','Pontevedra','Ferrol',
  // Asturias y Cantabria
  'Oviedo','Gijón','Avilés',
  // Canarias
  'Tenerife','Las Palmas de Gran Canaria','Santa Cruz de Tenerife','Lanzarote','Fuerteventura','La Palma',
  // Extremadura
  'Badajoz','Cáceres','Mérida','Plasencia','Don Benito',
  // Castilla y León
  'Salamanca','Burgos','León','Segovia','Ávila','Zamora','Palencia','Soria','Ponferrada',
  // Castilla-La Mancha
  'Toledo','Ciudad Real','Albacete','Cuenca','Guadalajara','Talavera de la Reina','Puertollano',
  // Andalucía (resto)
  'Huelva','Jaén','Almería','Cádiz','Jerez de la Frontera','Marbella','Algeciras',
  'Fuengirola','Torremolinos','Benalmádena','Ronda','Linares','Úbeda','Baeza','El Puerto de Santa María',
  // Aragón (resto)
  'Huesca','Teruel',
  // Cataluña (resto)
  'Tarragona','Lleida','Girona','Badalona','Hospitalet de Llobregat','Sabadell','Terrassa','Mataró','Reus','Sitges',
  // C. Valenciana (resto)
  'Castellón de la Plana','Elche','Torrevieja','Benidorm','Gandia','Dénia',
  // Murcia (resto)
  'Cartagena','Lorca',
  // Baleares
  'Menorca','Formentera',
  // Madrid área
  'Alcalá de Henares','Alcobendas','Getafe','Leganés','Móstoles','Torrejón de Ardoz',
  // Ciudades autónomas
  'Ceuta','Melilla',
];

const CitySearch = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    return ALL_CITIES.filter(c =>
      c.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').includes(q)
    ).slice(0, 8);
  }, [query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const select = (city: string) => {
    setQuery(city);
    onChange(city);
    setOpen(false);
  };

  const clear = () => {
    setQuery('');
    onChange('');
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative flex-1">
      <input
        type="text"
        name="city"
        value={query}
        placeholder="Ciudad (opcional)"
        autoComplete="off"
        onChange={e => { setQuery(e.target.value); onChange(''); setOpen(true); }}
        onFocus={() => setOpen(true)}
        className="w-full py-3.5 px-4 rounded-xl text-sm focus:outline-none"
        style={{
          background: '#FFFFFF',
          border: `1px solid ${open && suggestions.length ? 'rgba(212,175,55,0.5)' : 'rgba(212,175,55,0.3)'}`,
          color: 'rgba(22,20,18,0.85)',
          boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
        }}
      />
      {query && (
        <button
          type="button"
          onClick={clear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          tabIndex={-1}
        >
          <X size={13} />
        </button>
      )}
      {open && suggestions.length > 0 && (
        <ul
          className="absolute z-50 w-full mt-1 rounded-xl overflow-hidden"
          style={{ background: '#fff', border: '1px solid rgba(212,175,55,0.25)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
        >
          {suggestions.map(city => (
            <li key={city}>
              <button
                type="button"
                onMouseDown={() => select(city)}
                className="w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-amber-50"
                style={{ color: 'rgba(22,20,18,0.85)' }}
              >
                {city}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Helmet } from 'react-helmet-async';
import { motion, useInView, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Music, UtensilsCrossed, Users, Camera, ArrowRight, Sparkles, X, ChevronLeft, ChevronRight, Building2, Scissors, Headphones, Zap, Radio, Star, CalendarDays, Search, Award, Globe, CheckCircle, Smartphone, Video, Heart, Palette, Megaphone, TrendingUp, Shield, FileText } from 'lucide-react';
import xpeakLogo from '@/assets/xpeak-logo.png';
import bentoMusica from '@/assets/bento-musica.jpg';
import bentoGastro from '@/assets/bento-gastro.jpg';
import bentoStaff from '@/assets/bento-staff.jpg';
import bentoImagen from '@/assets/bento-imagen.jpg';
import LegalFooter from '@/components/LegalFooter';
import DemoVideoModal from '@/components/DemoVideoModal';

/* ── Fade-in wrapper ── */
const FadeIn = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ── Rotating word ── */
const ROTATING_WORDS = ['tu fiesta', 'tu festival', 'tu evento', 'tu club', 'tu comunión', 'tu boda'];
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
const MARQUEE_ITEMS = ['Bodas', 'Eventos Corporativos', 'Comuniones', 'Fiestas Privadas', 'Festivales', 'Cumpleaños', 'Despedidas', 'Eventos Deportivos', 'Presentaciones', 'Cenas de Empresa'];
const MARQUEE_COLORS = ['#D4AF37','#8b5cf6','#f97316','#10b981','#ec4899','#0ea5e9','#D4AF37','#8b5cf6','#f97316','#10b981'];
const MarqueeStrip = () => (
  <div className="overflow-hidden py-4 mb-0" style={{ background: '#f8f7f4', maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}>
    <motion.div
      className="flex items-center whitespace-nowrap"
      animate={{ x: ['0%', '-50%'] }}
      transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      style={{ width: 'max-content', gap: 0 }}
    >
      {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
        <span key={i} className="inline-flex items-center">
          <span className="text-xs font-bold tracking-[0.22em] uppercase"
            style={{ color: MARQUEE_COLORS[i % MARQUEE_COLORS.length] }}>
            {item}
          </span>
          <span aria-hidden="true" className="mx-6 text-[0.75rem]" style={{ color: 'rgba(0,0,0,0.2)' }}>·</span>
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
const StatPill = ({ value, label, color = '#D4AF37', bg = 'rgba(212,175,55,0.08)' }: { value: string; label: React.ReactNode; color?: string; bg?: string }) => (
  <div className="text-center px-2 py-3 md:px-8 md:py-5 rounded-2xl"
    style={{
      background: bg,
      border: `1px solid ${color}30`,
    }}>
    <p className="text-xl md:text-3xl font-bold leading-tight" style={{ color }}>{value}</p>
    <p className="text-[0.65rem] md:text-xs mt-1.5 tracking-wide uppercase" style={{ color: 'rgba(22,20,18,0.55)' }}>{label}</p>
  </div>
);

/* ── Pexels helpers ── */
const px = (id: number) => `/images/pexels/${id}.jpg`;

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
      { icon: <Headphones size={22} />, image: px(1540406), title: '¿Qué es este rol?',  body: 'DJs, productores, artistas en vivo, VJs y técnicos de sonido para bodas, festivales, eventos corporativos y privados en toda España.' },
      { icon: <Music size={22} />,      image: px(164745),  title: 'Tu perfil, tu marca', body: 'Incrusta tus sesiones de Mixcloud o SoundCloud. Los organizadores escuchan tu trabajo antes de contactarte — sin intermediarios.' },
      { icon: <Zap size={22} />,        image: px(1190297), title: 'Flash Booking',       body: 'Activa tu disponibilidad en tiempo real y recibe ofertas urgentes de eventos que necesitan cubrir una fecha con pocas horas de antelación.' },
      { icon: <Star size={22} />,       image: px(1105666), title: 'Reputación verificada', body: 'Cada evento suma una valoración real. Tu historial habla más que cualquier recomendación de boca en boca y te abre puertas a mejores contratos.' },
      { icon: <Heart size={22} />,      image: px(2747449), title: 'Mi Ficha Pública',    body: 'Comparte posts, audio, vídeo e imágenes con organizadores y fans. Tu ficha es tu tarjeta de presentación permanente en xpeak.es.' },
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
      { icon: <Globe size={22} />,   image: px(1763075), title: 'Primera plataforma formal para RRPP', body: 'XPEAK formaliza el trabajo de RRPP en España. Define tus tarifas y condiciones sin depender de contactos informales.' },
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
      { icon: <Zap size={22} />,         image: px(1190297), title: 'Flash Booking — próximamente', body: 'Publica una oferta urgente y recibe respuestas de profesionales disponibles en tu zona. Función en fase de lanzamiento.' },
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
          role="dialog"
          aria-modal="true"
          aria-labelledby="role-modal-title"
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
          <div className="flex items-center gap-3 px-5 pt-1" style={{ paddingBottom: 'calc(1.5rem + var(--sab, 0px))' }}>
            <button
              onClick={() => goTo(step - 1)} disabled={step === 0}
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-20 hover:bg-white/8"
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
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-20 hover:bg-white/8"
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
  { q: '¿Cómo funciona el Flash Booking?', a: 'Un empresario publica una oferta urgente (fecha, lugar, caché). Los profesionales disponibles en esa zona reciben una notificación y pueden responder. El empresario elige al candidato. Esta función está en fase de lanzamiento y estará disponible próximamente.' },
  { q: '¿Organizo eventos o bodas? ¿Cómo me registro?', a: 'Elige el rol "Empresario" al registrarte. Es totalmente gratuito y sin límites para contratar: búsqueda en el directorio, Flash Booking ilimitado y mensajería directa. XPEAK no cobra comisiones por contratación. El trato es directo entre organizador y profesional.' },
  { q: '¿En qué ciudades funciona?', a: 'En toda España: Madrid, Barcelona, Valencia, Sevilla, Ibiza, Málaga y más de 40 ciudades. Si no encuentras tu ciudad, puedes registrarte igualmente — los organizadores buscan por zona.' },
  { q: '¿Cómo se verifican los perfiles?', a: 'Los perfiles verificados son revisados manualmente por el equipo de XPEAK. Puedes solicitar verificación desde tu panel de perfil una vez que tengas la información completa.' },
  { q: '¿Puedo cancelar mi suscripción en cualquier momento?', a: 'Sí. Sin permanencia ni penalizaciones. Puedes cancelar desde Mi Perfil > Plan y sigues teniendo acceso hasta el final del período pagado.' },
];



const FaqSection = () => {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="max-w-[800px] mx-auto px-6 md:px-8 pb-16 md:pb-24">
      <FadeIn className="text-center mb-10">
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.25em] mb-4" style={{ color: '#7A5800' }}>Preguntas frecuentes</p>
        <h2 className="text-3xl md:text-4xl font-black tracking-tight font-display">
          Todo lo que necesitas <span className="text-gradient">saber</span>
        </h2>
      </FadeIn>
      <div className="flex flex-col gap-2">
        {FAQ_ITEMS.map((item, i) => (
          <FadeIn key={i} delay={i * 0.04}>
            <div
              className="glass-panel overflow-hidden transition-all cursor-pointer"
              style={{ background: '#FFFFFF', border: open === i ? '1px solid rgba(212,175,55,0.2)' : '1px solid rgba(0,0,0,0.08)', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}
              onClick={() => setOpen(open === i ? null : i)}
            >
              <div className="flex items-center justify-between px-5 py-4 gap-3">
                <p className="text-sm font-bold leading-snug" style={{ color: open === i ? '#8B6A00' : 'rgba(22,20,18,0.85)' }}>
                  {item.q}
                </p>
                <motion.span
                  animate={{ rotate: open === i ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0 text-lg font-light leading-none"
                  style={{ color: open === i ? '#8B6A00' : 'rgba(22,20,18,0.35)' }}>
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
                    <p className="px-5 pb-5 text-sm leading-relaxed" style={{ color: 'rgba(22,20,18,0.65)' }}>
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
  const [cityValue, setCityValue] = useState('');
  const [userCount, setUserCount] = useState<number | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterDone, setNewsletterDone] = useState(false);
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [communityReviews, setCommunityReviews] = useState<{ reviewer_name: string; reviewer_role: string; reviewer_avatar: string | null; comment: string }[]>([]);

  useEffect(() => {
    supabase.from('profiles').select('user_id', { count: 'exact', head: true })
      .then(({ count }) => { if (count !== null) setUserCount(count); });
    supabase.from('reviews').select('reviewer_name, reviewer_role, reviewer_avatar, comment')
      .eq('approved', true).order('created_at', { ascending: false }).limit(6)
      .then(({ data }) => { if (data && data.length > 0) setCommunityReviews(data as { reviewer_name: string; reviewer_role: string; reviewer_avatar: string | null; comment: string }[]); });
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
      <title>XPEAK — Contratar DJ, Fotógrafo y Staff para Eventos | España</title>
      <meta name="description" content="Encuentra y contrata DJ, fotógrafo, camarero, staff y catering para festivales, clubs, eventos privados y bodas en España. Profesionales verificados. Flash Booking próximamente. Gratis." />
      <link rel="canonical" href="https://xpeak.es/" />
      <meta property="og:title" content="XPEAK | Contratar DJs, Staff y Profesionales para Eventos en España" />
      <meta property="og:description" content="Contrata DJs, fotógrafos, camareros, maquilladores y profesionales verificados para bodas, comuniones y eventos en España. Flash Booking próximamente. Gratis para organizadores." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://xpeak.es/" />
      <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="XPEAK" />
      <meta property="og:locale" content="es_ES" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="XPEAK | Contratar DJs y Profesionales para Eventos" />
      <meta name="twitter:description" content="Flash Booking próximamente. Contratos automáticos. Directorio verificado de DJs, staff, fotógrafos y más." />
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
        "description": "XPEAK conecta salas, promotoras y organizadores con DJs, camareros, fotógrafos y staff verificados para eventos en España. Flash Booking próximamente.",
        "thumbnailUrl": "https://xpeak.es/og-image.jpg",
        "uploadDate": "2026-01-01T00:00:00+01:00",
        "contentUrl": "https://xpeak.es/hero-dancefloor.mp4",
        "publisher": { "@type": "Organization", "name": "XPEAK", "url": "https://xpeak.es" }
      })}</script>
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "XPEAK",
        "url": "https://xpeak.es",
        "logo": { "@type": "ImageObject", "url": "https://xpeak.es/favicon.png" },
        "sameAs": [],
        "description": "Directorio de profesionales verificados para bodas y eventos en España. DJs, fotógrafos, camareros, maquilladores y staff. Flash Booking próximamente."
      })}</script>
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "XPEAK",
        "url": "https://xpeak.es",
        "potentialAction": {
          "@type": "SearchAction",
          "target": { "@type": "EntryPoint", "urlTemplate": "https://xpeak.es/contratar-dj?q={search_term_string}" },
          "query-input": "required name=search_term_string"
        }
      })}</script>
    </Helmet>
    <div className="min-h-screen relative flex flex-col" data-landing="true" style={{ background: '#ffffff', color: 'rgba(22,20,18,0.88)', overflowX: 'clip' }}>



      {/* ─ Nav ─ */}
      <nav className="sticky top-0 z-50"
        style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0,0,0,0.07)',
        }}>
        <div className="max-w-[1800px] mx-auto px-6 md:px-10 py-4 md:py-5 flex justify-between items-center">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-2xl font-black tracking-tight transition-opacity hover:opacity-70 font-display"
            style={{ color: '#1a1208' }}>
            X<span className="text-gradient">PEAK</span>
          </button>
          <div className="hidden md:flex items-center gap-5 absolute left-1/2 -translate-x-1/2">
            {[
              { label: 'Profesionales', href: '/directorio/dj' },
              { label: 'Cómo funciona', href: '#como-funciona' },
              { label: 'Categorías', href: '#categorias' },
              { label: 'FAQ', href: '#faq' },
            ].map(link => (
              <a key={link.label} href={link.href}
                className="text-xs font-semibold transition-all hover:opacity-60"
                style={{ color: 'rgba(22,20,18,0.6)' }}>
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={() => navigate('/auth')}
              className="hidden sm:block text-xs font-semibold px-4 py-2 rounded-lg transition-all hover:bg-black/5"
              style={{ color: 'rgba(22,20,18,0.6)' }}>
              Acceder
            </button>
            <button onClick={() => navigate('/auth?mode=register&role=empresario')}
              className="text-xs font-semibold px-3 sm:px-4 py-2 rounded-lg transition-all"
              style={{ color: 'rgba(22,20,18,0.7)', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '10px' }}>
              <span className="flex items-center gap-1"><Building2 size={12} /><span className="hidden sm:inline">Soy </span>Organizador</span>
            </button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/auth?mode=register&role=profesional')}
              className="text-xs font-bold px-3 sm:px-5 py-2.5 rounded-xl flex items-center gap-1.5"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              <Headphones size={13} /><span className="hidden sm:inline">Soy </span>Profesional
            </motion.button>
          </div>
        </div>
      </nav>

      {/* ─ Hero ─ */}
      <main>
      <div className="relative" data-hero-dark="true" style={{ background: '#fff', overflowX: 'clip' }}>
        {/* Festival crowd photo — vibrant */}
        <img
          src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1920&q=90&auto=format&fit=crop"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ filter: 'saturate(1.3) brightness(0.55)', opacity: 0.85, objectPosition: 'center 30%' }}
        />
        {/* Gradient: subtle top → fades to white at bottom */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.3) 70%, #ffffff 100%)'
        }} />
      <header className="relative max-w-[1200px] mx-auto px-6 md:px-8 pt-16 pb-12 md:pt-28 md:pb-32 text-center">
        <FadeIn>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 md:mb-8"
            style={{
              background: 'rgba(255,220,0,0.12)',
              border: '1px solid rgba(255,220,0,0.3)',
            }}>
            <Sparkles size={14} style={{ color: '#FFCC00' }} />
            <span className="uppercase tracking-[0.3em] text-xs font-semibold" style={{ color: '#FFCC00' }}>
              Temporada activa — Ibiza · Palma · Costa del Sol
            </span>
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h1
            aria-label="Los mejores profesionales para tu evento en España — DJ, fotógrafo, camareros y staff verificados"
            className="text-4xl sm:text-6xl md:text-8xl font-black mb-4 md:mb-7 max-w-5xl mx-auto tracking-tight text-center font-display"
            style={{ lineHeight: 1.1, paddingBottom: '0.15em', overflow: 'visible' }}
          >
            <span className="block" style={{ color: 'rgba(255,255,255,0.95)' }}>Los mejores profesionales</span>
            <span className="block"><span className="text-gradient">para </span><RotatingWord /></span>
          </h1>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="text-sm md:text-lg max-w-md mx-auto mb-6 md:mb-8 leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.65)' }}>
            Clubs · Festivales · Eventos Privados · Bodas · Corporativos<br />
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>DJ, fotógrafo, camarero, staff — verificados en toda España. Gratis.</span>
          </p>
        </FadeIn>
        <FadeIn delay={0.25}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget as HTMLFormElement);
              const q = (fd.get('q') as string) || '';
              const city = cityValue;
              if (user) {
                navigate('/dashboard', { state: { view: 'directorio', search: q, city } });
              } else {
                const params = new URLSearchParams();
                if (q) params.set('q', q);
                if (city) params.set('city', city);
                navigate('/directorio/dj' + (params.toString() ? '?' + params.toString() : ''));
              }
            }}
            className="relative max-w-xl mx-auto mb-6 md:mb-10 flex flex-col gap-2"
          >
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#D4AF37' }} />
              <input
                name="q"
                placeholder="Busca DJ para tu evento, camarero, fotógrafo..."
                className="w-full pl-10 pr-4 py-3.5 rounded-xl text-sm focus:outline-none"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid rgba(212,175,55,0.35)',
                  color: 'rgba(22,20,18,0.9)',
                  boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
                }}
              />
            </div>
            <div className="flex gap-2">
              <CitySearch value={cityValue} onChange={setCityValue} />
              <motion.button
                type="submit"
                aria-label="Buscar profesionales"
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
        <FadeIn delay={0.3}>
          <div className="flex flex-wrap justify-center gap-2 mb-6 mt-2">
            {[
              { label: 'DJ Ibiza', href: '/contratar-dj/ibiza' },
              { label: 'DJ Mallorca', href: '/contratar-dj/palma' },
              { label: 'DJ Costa del Sol', href: '/contratar-dj/malaga' },
              { label: 'DJ Madrid', href: '/contratar-dj/madrid' },
              { label: 'Camareros Ibiza', href: '/contratar-camareros/ibiza' },
              { label: 'Flash Booking', href: '/blog/como-funciona-flash-booking-xpeak' },
            ].map(item => (
              <a key={item.label} href={item.href}
                className="px-3 py-1.5 rounded-full text-xs font-bold transition-all hover:scale-105"
                style={{ background: 'rgba(212,175,55,0.12)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.25)' }}>
                {item.label}
              </a>
            ))}
          </div>
        </FadeIn>
        <FadeIn delay={0.35}>
          <p className="text-xs font-bold uppercase tracking-[0.25em] mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>
            ¿Quién eres?
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-stretch gap-3 max-w-xl mx-auto">
            {/* Profesional */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                if (typeof window !== 'undefined' && (window as any).fbq) (window as any).fbq('track', 'Lead');
                navigate('/auth?mode=register&role=profesional');
              }}
              className="group flex-1 flex flex-col items-center gap-2 px-6 py-5 rounded-2xl transition-all text-center"
              style={{
                background: '#FFFFFF',
                border: '1.5px solid #C09010',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-1"
                style={{ background: 'rgba(139,106,0,0.1)' }}>
                <Headphones size={20} style={{ color: '#8B6A00' }} />
              </div>
              <p className="font-black text-base" style={{ color: 'rgba(22,20,18,0.92)' }}>Soy profesional</p>
              <p className="text-xs leading-snug" style={{ color: 'rgba(22,20,18,0.55)' }}>
                DJ, fotógrafo, camarero,<br />staff, maquillador...
              </p>
              <p className="text-xs font-bold mt-1" style={{ color: '#8B6A00' }}>
                Crea tu perfil y consigue contratos →
              </p>
            </motion.button>

            {/* Empresario */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/auth?mode=register&role=empresario')}
              className="group flex-1 flex flex-col items-center gap-2 px-6 py-5 rounded-2xl transition-all text-center"
              style={{
                background: '#FFFFFF',
                border: '1.5px solid rgba(0,0,0,0.1)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-1"
                style={{ background: 'rgba(0,0,0,0.08)' }}>
                <Building2 size={20} style={{ color: 'rgba(22,20,18,0.7)' }} />
              </div>
              <p className="font-black text-base" style={{ color: 'rgba(22,20,18,0.92)' }}>Busco talento</p>
              <p className="text-xs leading-snug" style={{ color: 'rgba(22,20,18,0.6)' }}>
                Sala, promotora, agencia<br />o evento privado
              </p>
              <p className="text-xs font-bold mt-1" style={{ color: 'rgba(22,20,18,0.6)' }}>
                Contrata sin comisiones →
              </p>
            </motion.button>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 mt-4">
            {[
              '✓ 31 profesionales publicados',
              '✓ 0€ comisión para contratar',
              '✓ Sin tarjeta de crédito',
            ].map(t => (
              <span key={t} className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.38)' }}>{t}</span>
            ))}
          </div>
        </FadeIn>

        {/* ── Floating activity pills ── */}
        <div className="relative h-20 mt-6 overflow-hidden pointer-events-none select-none hidden md:block" aria-hidden="true">
          {[
            { text: 'DJ contratado en Madrid', delay: 0, duration: 24, top: 2 },
            { text: 'Catering confirmado en Ibiza', delay: 8, duration: 28, top: 2 },
            { text: 'Fotógrafo disponible en Valencia', delay: 16, duration: 26, top: 2 },
            { text: 'Speaker reservado en Barcelona', delay: 4, duration: 30, top: 36 },
            { text: 'Mago reservado en Sevilla', delay: 12, duration: 27, top: 36 },
            { text: 'Flash Booking activo — Mallorca', delay: 20, duration: 25, top: 36 },
          ].map((pill, i) => (
            <div
              key={i}
              className="absolute whitespace-nowrap text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{
                top: pill.top,
                left: '100%',
                background: 'rgba(212,175,55,0.08)',
                border: '1px solid rgba(212,175,55,0.18)',
                color: 'rgba(255,255,255,0.55)',
                animation: `floatPill ${pill.duration}s ${pill.delay}s linear infinite`,
              }}
            >
              {pill.text}
            </div>
          ))}
        </div>
        <style>{`
          @keyframes floatPill {
            0%   { transform: translateX(0); }
            100% { transform: translateX(calc(-100vw - 400px)); }
          }
        `}</style>

      </header>
      </div>

      {/* ─ Stats ─ */}
      <FadeIn className="max-w-[900px] mx-auto px-6 mb-10 md:mb-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          <StatPill value="47+" label="Profesionales publicados" color="#D4AF37" bg="rgba(212,175,55,0.08)" />
          <StatPill value="⚡" label="Flash Booking · Próximamente" color="#8b5cf6" bg="rgba(139,92,246,0.08)" />
          <StatPill value="0€" label={<><span className="md:hidden">Comisión</span><span className="hidden md:inline">Comisión para contratar</span></>} color="#10b981" bg="rgba(16,185,129,0.08)" />
          <StatPill value="España" label="Nacional" color="#f97316" bg="rgba(249,115,22,0.08)" />
        </div>
      </FadeIn>

      {/* ─ TIPOS DE EVENTO ─ */}
      <FadeIn>
        <section className="max-w-[1200px] mx-auto px-6 md:px-8 pt-16 pb-12 md:pt-20 md:pb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-3" style={{ lineHeight: 1.2, paddingBottom: '0.15em', overflow: 'visible' }}>¿Qué estás organizando?</h2>
            <p className="text-sm" style={{ color: '#8E8EA0' }}>Encuentra el profesional perfecto para cada ocasión</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Boda', color: '#c084fc', border: 'rgba(192,132,252,0.3)', img: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=400' },
              { label: 'Cumpleaños', color: '#fb923c', border: 'rgba(251,146,60,0.3)', img: 'https://images.pexels.com/photos/1405528/pexels-photo-1405528.jpeg?auto=compress&cs=tinysrgb&w=400' },
              { label: 'Corporativo', color: '#60a5fa', border: 'rgba(96,165,250,0.3)', img: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400' },
              { label: 'Comunión', color: '#34d399', border: 'rgba(52,211,153,0.3)', img: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=80&auto=format&fit=crop' },
              { label: 'Festival', color: '#f472b6', border: 'rgba(244,114,182,0.3)', img: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=400' },
              { label: 'Fiesta privada', color: '#D4AF37', border: 'rgba(212,175,55,0.3)', img: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400' },
            ].map(ev => (
              <a key={ev.label} href="/directorio/dj"
                className="group relative rounded-2xl overflow-hidden flex flex-col items-center justify-end text-center transition-all hover:scale-105"
                style={{ aspectRatio: '3/4', border: `1px solid ${ev.border}` }}>
                <img src={ev.img} alt={ev.label} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0" style={{ background: `linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)` }} />
                <div className="relative z-10 p-3 w-full">
                  <p className="text-sm font-black tracking-wide" style={{ color: '#fff', textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}>{ev.label}</p>
                  <div className="mt-1 h-0.5 w-6 rounded-full" style={{ background: ev.color }} />
                </div>
              </a>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* ─ CÓMO FUNCIONA ─ */}
      <FadeIn>
        <section id="como-funciona" className="w-full py-12 md:py-20" style={{ background: '#fff' }}>
        <div className="max-w-[1100px] mx-auto px-6 md:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>Sin registro. Sin comisión.</p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4" style={{ color: 'rgba(22,20,18,0.92)' }}>Tan fácil como esto</h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: 'rgba(22,20,18,0.55)' }}>
              Busca el profesional que necesitas y contáctale directamente. Sin intermediarios, sin comisiones, sin complicaciones.
            </p>
          </div>

          <div className="mb-14">
            <p className="text-xs font-black uppercase tracking-widest mb-6 text-center" style={{ color: 'rgba(22,20,18,0.3)' }}>Si organizas un evento</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { step: '1', title: 'Busca el profesional', body: 'DJs, fotógrafos, camareros, maquilladores… Filtra por ciudad, tipo de evento y precio.' },
                { step: '2', title: 'Contáctale gratis', body: 'Sin crear cuenta. Rellena un formulario en 30 segundos y el profesional te responde directamente.' },
                { step: '3', title: 'Contrata sin comisión', body: 'El trato es entre tú y el profesional. XPEAK no cobra ninguna comisión por la contratación.' },
              ].map(s => (
                <div key={s.step} className="relative p-6 rounded-2xl text-center"
                  style={{ background: '#f9f8f6', border: '1px solid rgba(0,0,0,0.07)' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black mx-auto mb-4"
                    style={{ background: '#D4AF37', color: '#000', boxShadow: '0 2px 8px rgba(212,175,55,0.2)' }}>{s.step}</div>
                  <h3 className="text-base font-black mb-2" style={{ color: 'rgba(22,20,18,0.9)', lineHeight: 1.2, paddingBottom: '0.15em', overflow: 'visible' }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(22,20,18,0.55)' }}>{s.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 mb-10">
            <div className="flex-1 h-px" style={{ background: 'rgba(0,0,0,0.08)' }} />
            <p className="text-xs font-black uppercase tracking-widest" style={{ color: 'rgba(22,20,18,0.3)' }}>Si eres profesional</p>
            <div className="flex-1 h-px" style={{ background: 'rgba(0,0,0,0.08)' }} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { step: '1', title: 'Crea tu perfil', body: 'Gratis. Sube fotos, tu bio y tu precio. En 5 minutos estás visible.' },
              { step: '2', title: 'Recibe contactos', body: 'Clientes de bodas, eventos y fiestas te escriben directamente sin intermediarios.' },
              { step: '3', title: 'Flash Booking', body: 'Activa tu disponibilidad y recibe ofertas urgentes de eventos en tu zona.' },
              { step: '4', title: 'Cobra lo que mereces', body: 'Sin comisiones. El trato es tuyo. XPEAK solo pone en contacto.' },
            ].map(s => (
              <div key={s.step} className="p-5 rounded-2xl"
                style={{ background: '#f9f8f6', border: '1px solid rgba(0,0,0,0.07)' }}>
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-[0.65rem] font-black mb-3 block"
                  style={{ background: '#D4AF37', color: '#000' }}>{s.step}</span>
                <h3 className="text-sm font-black mb-1" style={{ color: 'rgba(22,20,18,0.9)', lineHeight: 1.2, paddingBottom: '0.15em', overflow: 'visible' }}>{s.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(22,20,18,0.55)' }}>{s.body}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <a href="/directorio/dj"
              className="px-8 py-4 rounded-2xl font-black text-base text-center transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000', boxShadow: '0 8px 30px rgba(212,175,55,0.25)' }}>
              Buscar profesionales →
            </a>
            <a href="/auth"
              className="px-8 py-4 rounded-2xl font-black text-base text-center transition-all hover:scale-105"
              style={{ background: 'rgba(22,20,18,0.06)', border: '1px solid rgba(22,20,18,0.12)', color: 'rgba(22,20,18,0.85)' }}>
              Crear mi perfil gratis →
            </a>
          </div>
        </div>
        </section>
      </FadeIn>


      {/* ─ Mobile Categories ─ */}
      <section className="block md:hidden max-w-[1200px] mx-auto px-6 pb-10">
        <FadeIn>
          <div className="text-center mb-5">
            <p className="uppercase tracking-[0.3em] text-xs font-semibold mb-2" style={{ color: '#8B6A00' }}>Categorías</p>
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
              onClick={() => navigate('/directorio/' + role.key)}
              className="flex-none flex items-center gap-2.5 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all active:scale-95"
              style={{ background: '#FFFFFF', border: '1px solid rgba(212,175,55,0.2)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', whiteSpace: 'nowrap' }}
            >
              <span style={{ color: '#D4AF37' }}>{role.icon}</span>
              {role.title}
            </button>
          ))}
          <div className="flex-none w-6" />
        </div>
      </section>

      {/* ─ Bento Grid ─ */}
      <section id="categorias" className="hidden md:block max-w-[1200px] mx-auto px-6 md:px-8 pb-10 md:pb-16">
        <FadeIn>
          <div className="text-center mb-14">
            <p className="uppercase tracking-[0.3em] text-xs font-semibold mb-4" style={{ color: '#f97316' }}>
              Categorías
            </p>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight font-display" style={{ color: 'rgba(22,20,18,0.92)' }}>
              Encuentra tu <span className="text-gradient">talento</span>
            </h2>
          </div>
        </FadeIn>
        <p className="text-center text-xs text-muted-foreground mb-6" style={{ color: 'rgba(22,20,18,0.5)' }}>
          Haz clic en cada categoría para ver qué puedes hacer
        </p>
        {/* Fila 1-2: bento asimétrico */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[170px] md:auto-rows-[260px] mb-3 md:mb-4">
          <FadeIn delay={0} className="md:row-span-2">
            <BentoCard image={bentoMusica} icon={<Music size={20} />} title="Música" subtitle="DJs, productores, artistas en vivo, VJs y técnicos de sonido" className="h-full"
              onClick={() => navigate('/directorio/' + ROLE_DETAILS[0].key)} />
          </FadeIn>
          <FadeIn delay={0.1} className="md:col-span-2">
            <BentoCard
              image="/images/pexels/1190297.jpg"
              icon={<Building2 size={20} />} title="Empresario" subtitle="Salas, promotoras y agencias de eventos" className="h-full"
              onClick={() => navigate('/directorio/' + ROLE_DETAILS[5].key)} />
          </FadeIn>
          <FadeIn delay={0.15} className="md:row-span-2">
            <BentoCard image={bentoImagen} icon={<Camera size={20} />} title="Imagen & Media" subtitle="Fotógrafos, videógrafos y creadores" className="h-full"
              onClick={() => navigate('/directorio/' + ROLE_DETAILS[2].key)} />
          </FadeIn>
          <FadeIn delay={0.2} className="md:col-span-2">
            <BentoCard image={bentoStaff} icon={<Users size={20} />} title="Staff & Promoción" subtitle="RRPP, hostess, promotores y azafatas" className="h-full"
              onClick={() => navigate('/directorio/' + ROLE_DETAILS[3].key)} />
          </FadeIn>
        </div>
        {/* Fila 3: Belleza + Gastro */}
        <div className="grid grid-cols-2 gap-3 md:gap-4" style={{ height: 180 }}>
          <FadeIn delay={0.25} className="h-full">
            <BentoCard
              image="/images/pexels/2681751.jpg"
              icon={<Scissors size={20} />} title="Belleza & Estética" subtitle="Maquilladores, peluqueros y estilistas" className="h-full"
              onClick={() => navigate('/directorio/' + ROLE_DETAILS[4].key)} />
          </FadeIn>
          <FadeIn delay={0.3} className="h-full">
            <BentoCard image={bentoGastro} icon={<UtensilsCrossed size={20} />} title="Gastro & Sala" subtitle="Bartenders, chefs y catering premium" className="h-full"
              onClick={() => navigate('/directorio/' + ROLE_DETAILS[1].key)} />
          </FadeIn>
        </div>
      </section>


      {/* ─ Testimonios ─ */}
      <section className="relative overflow-hidden pb-16 pt-16" style={{ background: '#f8f7f4' }}>
        <div className="relative max-w-[1200px] mx-auto px-6 md:px-8">
        <FadeIn className="text-center mb-10">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.25em] mb-4" style={{ color: '#8b5cf6' }}>Lo que dicen los profesionales</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight font-display" style={{ color: 'rgba(22,20,18,0.92)' }}>
            La comunidad <span className="text-gradient">habla</span>
          </h2>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(communityReviews.length > 0 ? communityReviews.slice(0, 3).map((r, i) => ({
            name: r.reviewer_name, role: r.reviewer_role,
            avatar: r.reviewer_avatar ?? r.reviewer_name.charAt(0).toUpperCase(),
            text: r.comment,
            photo: [
              'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80',
              'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=600&q=80',
              'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
            ][i] ?? null,
          })) : [
            { name: 'Marcos DJ', role: 'DJ Residente · Madrid', avatar: 'M',
              photo: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80',
              text: 'En menos de una semana me contactaron dos salas de Madrid a través del directorio. Nunca había conseguido bookings tan rápido sin intermediarios.' },
            { name: 'Laura V.', role: 'Maquilladora · Barcelona', avatar: 'L',
              photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=600&q=80',
              text: 'Mi perfil en XPEAK me trajo tres clientes nuevos en el primer mes. Por fin un sitio donde el sector de eventos busca talento de imagen de verdad.' },
            { name: 'Club Nocturno NX', role: 'Empresario · Valencia', avatar: 'N',
              photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
              text: 'El Flash Booking nos salvó una noche: publicamos la oferta a las 10pm y a las 11pm teníamos DJ confirmado. Antes eso nos costaba llamadas interminables.' },
          ]).map((t, i) => (
            <FadeIn key={t.name} delay={i * 0.08}>
              <div className="relative overflow-hidden rounded-2xl h-64 flex flex-col justify-end"
                style={{ border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
                {/* Foto de fondo */}
                {t.photo && (
                  <img src={t.photo} alt={t.name} loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover" />
                )}
                {/* Gradiente oscuro de abajo hacia arriba */}
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)' }} />
                {/* Contenido sobre el gradiente */}
                <div className="relative z-10 p-5">
                  <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.88)' }}>
                    "{t.text}"
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0"
                      style={{ background: 'rgba(212,175,55,0.25)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.4)' }}>
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-xs font-black text-white">{t.name}</p>
                      <p className="text-[0.68rem]" style={{ color: 'rgba(255,255,255,0.6)' }}>{t.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
        </div>
      </section>

      {/* ─ Blog / Guías ─ */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-8 py-12" style={{ background: '#fff' }}>
        <FadeIn>
          <h2 className="text-2xl md:text-4xl font-black mb-2 tracking-tight font-display" style={{ color: 'rgba(22,20,18,0.92)' }}>
            Guías y <span className="text-gradient">recursos</span>
          </h2>
          <p className="text-sm mb-8 max-w-md" style={{ color: 'rgba(22,20,18,0.55)' }}>
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
                style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 2px 10px rgba(0,0,0,0.07)' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3 flex-shrink-0"
                  style={{ background: 'rgba(212,175,55,0.09)', border: '1px solid rgba(212,175,55,0.18)', color: '#D4AF37' }}>
                  {post.icon}
                </div>
                <span className="inline-block text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded mb-2"
                  style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.18)' }}>
                  {post.tag}
                </span>
                <p className="text-sm font-black leading-snug mb-2">{post.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(22,20,18,0.62)' }}>{post.desc}</p>
              </a>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ─ FAQ ─ */}
      <div id="faq"><FaqSection /></div>

      {/* ─ CTA final limpio ─ */}
      <FadeIn>
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-16 md:py-20 text-center">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.25em] mb-4" style={{ color: '#D4AF37' }}>
            47 profesionales ya publicados
          </p>
          <h2 className="text-2xl md:text-4xl font-black mb-4 tracking-tight font-display" style={{ color: 'rgba(22,20,18,0.92)', lineHeight: 1.3, overflow: 'visible', clipPath: 'none', WebkitClipPath: 'none' }}>
            <span style={{ display: 'block', paddingBottom: '0.05em' }}>Publica tu tarifa.</span>
            <span style={{ display: 'inline-block', paddingBottom: '0.35em' }}>Recibe bookings.</span>
          </h2>
          <p className="text-sm mb-8 max-w-sm mx-auto" style={{ color: 'rgba(22,20,18,0.55)' }}>
            Los organizadores ven tu perfil, tu tarifa y te contactan directamente. Sin intermediarios. Sin comisiones.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/auth?mode=register&role=profesional')}
              className="inline-flex items-center justify-center gap-2 text-sm font-black px-8 py-4 rounded-xl transition-all"
              style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000', boxShadow: '0 8px 30px rgba(212,175,55,0.25)' }}>
              <Headphones size={16} /> Soy Profesional
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/auth?mode=register&role=empresario')}
              className="inline-flex items-center justify-center gap-2 text-sm font-black px-8 py-4 rounded-xl transition-all"
              style={{ background: 'rgba(22,20,18,0.06)', border: '1px solid rgba(22,20,18,0.12)', color: 'rgba(22,20,18,0.85)' }}>
              <Building2 size={16} /> Organizo un Evento
            </motion.button>
          </div>
          <p className="mt-5 text-xs" style={{ color: 'rgba(22,20,18,0.35)' }}>
            Registro gratuito · Sin tarjeta de crédito
          </p>
        </div>
      </FadeIn>

      </main>
      <LegalFooter />
      <DemoVideoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </div>
    </>
  );
};

export default Landing;
