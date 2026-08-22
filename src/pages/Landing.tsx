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
          color: '#333',
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
                style={{ color: '#333' }}
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
import { Music, UtensilsCrossed, Users, Camera, Sparkles, X, ChevronLeft, ChevronRight, Building2, Scissors, Headphones, Zap, Star, CalendarDays, Search, Award, Globe, CheckCircle, Smartphone, Video, Heart } from 'lucide-react';
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


/* ── Bento card ── */
const BentoCard = ({
  image, icon, title, subtitle, className = '', href, children, isFresh = false,
}: {
  image: string; icon: React.ReactNode; title: string; subtitle: string; className?: string; href: string; children?: React.ReactNode; isFresh?: boolean;
}) => {
  const cardRef = useRef<HTMLAnchorElement>(null);
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

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
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
    <motion.a
      href={href}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 900, border: '1px solid rgba(212,175,55,0.15)', display: 'block', textDecoration: 'none' }}
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
      {isFresh && (
        <span className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-1 rounded-full text-[0.6rem] font-black uppercase tracking-wide"
          style={{ background: '#15803d', color: '#fff' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Nuevo esta semana
        </span>
      )}
      {/* Contenido */}
      <div className="relative z-10 h-full flex flex-col justify-end p-5">
        {children && (
          <div className="mb-3">{children}</div>
        )}
        <h3 className="text-xl font-bold text-gradient mb-1">{title}</h3>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.85)' }}>{subtitle}</p>
        <p className="text-xs font-bold mt-2 tracking-widest uppercase transition-transform duration-300 group-hover:translate-x-1" style={{ color: '#D4AF37' }}>
          ¿Quién hay aquí? →
        </p>
      </div>
    </motion.a>
  );
};


/* ── Pexels helpers ── */
const px = (id: number) => `/images/pexels/${id}.jpg`;

// All IDs verified visually via Chrome DevTools:
// 1540406=DJ decks | 164745=DJ controller lit | 1190297=concert crowd | 1105666=concert orange lights
// 2747449=audience from stage | 1763075=venue interior | 2608517=VIP staff formal | 3379934=photographer
// 196644=creative notebook | 3685530=makeup artist | 2681751=woman with glam makeup | 34321369=catering tray
// 36933463=gourmet buffet bowls | 29068721=catering shot glasses | 544961=cocktails toast

/* ── Role detail data ── */
/* Mapa categoría de la home → destino real (los keys de ROLE_DETAILS no son slugs del directorio) */
const CATEGORY_DEST: Record<string, string> = {
  musica: '/directorio/dj',
  gastro: '/directorio/catering',
  imagen: '/directorio/fotografo',
  staff: '/directorio/staff',
  belleza: '/directorio/maquillaje',
  empresario: '/auth?mode=register&role=empresario',
};

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
    key: 'belleza', title: 'Belleza & Estética', icon: <Scissors size={28} />, tagline: 'Maquilladores y peluquería a domicilio',
    steps: [
      { icon: <Scissors size={22} />,   image: px(3685530), title: '¿Qué es este rol?',        body: 'Maquilladores artísticos y peluqueras/os a domicilio: para eventos, bodas o para el día a día, caracterizadores y técnicos de efectos especiales.' },
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
      { icon: <Zap size={22} />,         image: px(1190297), title: 'Flash Booking', body: 'Publica una oferta urgente y recibe respuestas de profesionales disponibles en tu zona. Función en fase de lanzamiento.' },
      { icon: <CheckCircle size={22} />, image: px(2747449), title: 'Sin sorpresas',                      body: 'Perfiles con historial verificado, valoraciones reales y tarifas transparentes. El sistema XPEAK protege a ambas partes en cada contratación.' },
    ],
  },
];

/* ── Landing ── */
const FAQ_ITEMS = [
  { q: '¿Es gratis registrarse?', a: 'Sí. XPEAK es completamente gratuito durante su fase de crecimiento. Todas las funciones — perfil, Flash Booking, mensajería, estadísticas y contratos — están disponibles sin coste ni comisiones.' },
  { q: '¿Necesito experiencia profesional para unirme?', a: 'No. Hay un rol específico llamado "Artista Promesa" pensado para quienes están empezando. La comunidad te puede apoyar con votos para que asciendan a Profesional.' },
  { q: '¿Cómo funciona el Flash Booking?', a: 'Un empresario publica una oferta urgente (fecha, lugar, caché). Los profesionales disponibles en esa zona reciben una notificación y pueden responder. El empresario elige al candidato. El empresario elige al candidato ideal.' },
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
                <p className="text-sm font-bold leading-snug" style={{ color: open === i ? '#8B6A00' : '#333' }}>
                  {item.q}
                </p>
                <motion.span
                  animate={{ rotate: open === i ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0 text-lg font-light leading-none"
                  style={{ color: open === i ? '#8B6A00' : '#444' }}>
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
                    <p className="px-5 pb-5 text-sm leading-relaxed" style={{ color: '#444' }}>
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
  const { user, loading: authLoading } = useAuth();
  const [demoOpen, setDemoOpen] = useState(false);
  const [cityValue, setCityValue] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterDone, setNewsletterDone] = useState(false);
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [communityReviews, setCommunityReviews] = useState<{ reviewer_name: string; reviewer_role: string; reviewer_avatar: string | null; comment: string }[]>([]);
  const [freshRoles, setFreshRoles] = useState<Set<string>>(new Set());

  // Login inteligente: si ya estás logueado como ORGANIZADOR, entras directo al
  // feed (es tu experiencia principal). Al profesional NO se le fuerza a ningún
  // sitio: se queda en la landing ligera y decide (botón "Descubrir" al feed, o
  // "Acceder" a su dashboard) — así nunca queda atrapado sin ver el feed.
  // Se salta una vez por pestaña; "/?stay=1" desactiva el redirect.
  useEffect(() => {
    if (authLoading || !user) return;
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('stay') === '1') return;
      if (sessionStorage.getItem('xpeak_landing_seen') === '1') return;
    } catch { /* sin sessionStorage: continúa */ }

    let cancelled = false;
    supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .order('is_primary', { ascending: false })
      .limit(1)
      .then(({ data }) => {
        if (cancelled) return;
        try { sessionStorage.setItem('xpeak_landing_seen', '1'); } catch { /* noop */ }
        const role = data?.[0]?.role;
        // Solo el organizador salta directo al feed. Profesional y sin-perfil
        // se quedan en la landing (con acceso claro a feed y a su cuenta).
        if (role === 'empresario') navigate('/descubrir', { replace: true });
      });
    return () => { cancelled = true; };
  }, [user, authLoading, navigate]);

  useEffect(() => {
    supabase.from('reviews').select('reviewer_name, reviewer_role, reviewer_avatar, comment')
      .eq('approved', true).order('created_at', { ascending: false }).limit(6)
      .then(({ data }) => { if (data && data.length > 0) setCommunityReviews(data as { reviewer_name: string; reviewer_role: string; reviewer_avatar: string | null; comment: string }[]); });
  }, []);

  useEffect(() => {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    supabase.from('profiles' as any)
      .select('role, display_name')
      .gte('created_at', since)
      .then(({ data }) => {
        if (!data) return;
        const roles = new Set<string>();
        for (const row of data as { role: string; display_name: string | null }[]) {
          if (row.role && row.display_name && row.display_name.trim().length > 1) roles.add(row.role);
        }
        setFreshRoles(roles);
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
      <title>XPEAK — Contratar DJ, Fotógrafo y Staff para Eventos | España</title>
      <meta name="description" content="Encuentra y contrata DJ, fotógrafo, camarero, staff y catering para festivales, clubs, eventos privados y bodas en España. Profesionales verificados. Flash Booking. Gratis." />
      <link rel="canonical" href="https://xpeak.es/" />
      <meta property="og:title" content="XPEAK | Contratar DJs, Staff y Profesionales para Eventos en España" />
      <meta property="og:description" content="Contrata DJs, fotógrafos, camareros, maquilladores y profesionales verificados para bodas, comuniones y eventos en España. Flash Booking. Gratis para organizadores." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://xpeak.es/" />
      <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="XPEAK" />
      <meta property="og:locale" content="es_ES" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="XPEAK | Contratar DJs y Profesionales para Eventos" />
      <meta name="twitter:description" content="Flash Booking. Contratos automáticos. Directorio verificado de DJs, staff, fotógrafos y más." />
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
        "description": "XPEAK conecta salas, promotoras y organizadores con DJs, camareros, fotógrafos y staff verificados para eventos en España. Flash Booking.",
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
        "sameAs": ["https://www.instagram.com/xpeak.es"],
        "description": "Directorio de profesionales verificados para bodas y eventos en España. DJs, fotógrafos, camareros, maquilladores y staff. Flash Booking."
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
    <div className="min-h-screen relative flex flex-col" data-landing="true" style={{ background: '#ffffff', color: '#222', overflowX: 'clip' }}>



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
            className="text-2xl font-black tracking-tight transition-opacity hover:opacity-70 font-display whitespace-nowrap shrink-0"
            style={{ color: '#1a1208' }}>
            X<span className="text-gradient">PEAK</span>
          </button>
          <div className="hidden md:flex items-center gap-5 absolute left-1/2 -translate-x-1/2">
            {[
              { label: 'Descubrir', href: '/descubrir' },
              { label: 'Profesionales', href: '/directorio/dj' },
              { label: 'Eventos', href: '#como-funciona' },
              { label: 'Categorías', href: '#categorias' },
              { label: 'FAQ', href: '#faq' },
            ].map(link => (
              <a key={link.label} href={link.href}
                className="text-xs font-semibold transition-all hover:opacity-60"
                style={{ color: '#444' }}>
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={() => navigate('/auth')}
              className="text-xs font-semibold px-4 py-2 rounded-lg transition-all hover:bg-black/5"
              style={{ color: '#444' }}>
              Acceder
            </button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/descubrir')}
              className="text-xs font-bold px-3 sm:px-5 py-2.5 rounded-xl flex items-center gap-1.5"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              <Sparkles size={13} /><span className="hidden sm:inline">Descubrir</span><span className="sm:hidden">Ver</span>
            </motion.button>
          </div>
        </div>
      </nav>

      {/* ─ Hero ─ */}
      <main>
      <div className="relative" data-hero-dark="true" style={{ background: '#fff', overflowX: 'clip' }}>
        {/* Hero background video — DJ + crowd + lights */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          poster="/videos/hero-poster.jpg"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ filter: 'saturate(1.2) brightness(0.5)', opacity: 0.9, objectPosition: 'center 30%' }}
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        {/* Gradient: subtle top → fades to white at bottom */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.3) 70%, #ffffff 100%)'
        }} />
      <header className="relative max-w-[1200px] mx-auto px-5 md:px-8 pt-12 pb-8 md:pt-20 md:pb-16 text-center">
        <FadeIn>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 md:mb-8 flex-wrap justify-center"
            style={{
              background: 'rgba(255,220,0,0.12)',
              border: '1px solid rgba(255,220,0,0.3)',
            }}>
            <Sparkles size={14} style={{ color: '#FFCC00' }} />
            <span className="uppercase tracking-[0.3em] text-xs font-semibold" style={{ color: '#FFCC00' }}>
              Temporada activa —{' '}
              <a href="/contratar-dj/ibiza" className="underline decoration-dotted underline-offset-2 hover:opacity-80">Ibiza</a>
              {' · '}
              <a href="/contratar-dj/palma-de-mallorca" className="underline decoration-dotted underline-offset-2 hover:opacity-80">Palma</a>
              {' · '}
              <a href="/contratar-dj/malaga" className="underline decoration-dotted underline-offset-2 hover:opacity-80">Costa del Sol</a>
            </span>
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h1
            aria-label="Los mejores profesionales para tu evento en España — DJ, fotógrafo, camareros y staff verificados"
            className="text-3xl sm:text-5xl md:text-8xl font-black mb-3 md:mb-7 max-w-5xl mx-auto tracking-tight text-center font-display"
            style={{ lineHeight: 1.1, paddingBottom: '0.15em', overflow: 'visible' }}
          >
            <span className="block" style={{ color: 'rgba(255,255,255,0.95)' }}>Los mejores profesionales</span>
            <span className="block" style={{ minHeight: '1.3em' }}><span className="text-gradient">para </span><RotatingWord /></span>
          </h1>
        </FadeIn>
        {/* CTA PRIMARIO ÚNICO — un solo camino claro para el organizador.
            El feed Instagram es la puerta principal; el buscador y "soy
            profesional" quedan subordinados debajo. */}
        <FadeIn delay={0.25}>
          <div className="max-w-md mx-auto flex flex-col items-center gap-3 mb-6 md:mb-8">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/descubrir')}
              className="w-full flex items-center justify-center gap-2 px-7 py-4 rounded-2xl text-base font-black transition-all"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000', boxShadow: '0 8px 24px rgba(212,175,55,0.35)' }}
            >
              <Sparkles size={18} /> Descubrir profesionales
            </motion.button>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Desliza y encuentra al profesional perfecto para tu evento
            </p>

            {/* Buscador secundario (para quien ya sabe qué busca) */}
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
              className="w-full flex gap-2 mt-1"
            >
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#D4AF37' }} />
                <input
                  name="q"
                  placeholder="O busca directamente: DJ, fotógrafo…"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none"
                  style={{ background: '#FFFFFF', border: '1px solid rgba(212,175,55,0.3)', color: '#111' }}
                />
              </div>
              <button type="submit" aria-label="Buscar" className="flex-shrink-0 px-4 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}>
                <Search size={15} color="#fff" />
              </button>
            </form>
          </div>

          {/* Enlace secundario discreto para el profesional */}
          <button
            onClick={() => {
              if (typeof window !== 'undefined' && (window as any).fbq) (window as any).fbq('track', 'Lead');
              navigate('/auth?mode=register&role=profesional');
            }}
            className="text-xs font-bold underline decoration-dotted underline-offset-4 transition-opacity hover:opacity-70"
            style={{ color: 'rgba(255,255,255,0.75)' }}
          >
            ¿Eres DJ, fotógrafo o staff? Crea tu perfil gratis →
          </button>

          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 mt-5">
            {[
              '✓ Verificados cada semana',
              '✓ 0€ comisión',
              '✓ Sin tarjeta',
            ].map(t => (
              <span key={t} className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.85)' }}>{t}</span>
            ))}
          </div>
        </FadeIn>


      </header>
      </div>


      {/* ─ TIPOS DE EVENTO ─ */}
      <FadeIn>
        <section id="como-funciona" className="max-w-[1200px] mx-auto px-6 md:px-8 pt-8 pb-10 md:pt-14 md:pb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight" style={{ lineHeight: 1.2 }}>¿Qué estás organizando?</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Boda', color: '#c084fc', border: 'rgba(192,132,252,0.3)', img: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=400', href: '/bodas' },
              { label: 'Cumpleaños', color: '#fb923c', border: 'rgba(251,146,60,0.3)', img: 'https://images.pexels.com/photos/1405528/pexels-photo-1405528.jpeg?auto=compress&cs=tinysrgb&w=400', href: '/directorio/animador' },
              { label: 'Corporativo', color: '#60a5fa', border: 'rgba(96,165,250,0.3)', img: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400', href: '/directorio/staff' },
              { label: 'Comunión', color: '#34d399', border: 'rgba(52,211,153,0.3)', img: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=80&auto=format&fit=crop', href: '/directorio/fotografo' },
              { label: 'Festival', color: '#f472b6', border: 'rgba(244,114,182,0.3)', img: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=400', href: '/directorio/dj' },
              { label: 'Fiesta privada', color: '#D4AF37', border: 'rgba(212,175,55,0.3)', img: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400', href: '/directorio/promotores' },
            ].map(ev => (
              <a key={ev.label} href={ev.href}
                className="group relative rounded-2xl overflow-hidden flex flex-col items-center justify-end text-center transition-all hover:scale-105"
                style={{ aspectRatio: '3/4', border: `1px solid ${ev.border}` }}>
                <img src={ev.img} alt={ev.label} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)' }} />
                <div className="relative z-10 p-3 w-full">
                  <p className="text-sm font-black tracking-wide" style={{ color: '#fff', textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}>{ev.label}</p>
                  <div className="mt-1 h-0.5 w-6 mx-auto rounded-full" style={{ background: ev.color }} />
                </div>
              </a>
            ))}
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
        <div className="relative">
          <div
            className="flex gap-3 overflow-x-auto pb-2"
            style={{ scrollbarWidth: 'none' }}
          >
            {ROLE_DETAILS.map(role => (
              <a
                key={role.key}
                href={CATEGORY_DEST[role.key]}
                className="flex-none flex items-center gap-2.5 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all active:scale-95"
                style={{ background: '#FFFFFF', border: '1px solid rgba(212,175,55,0.2)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', whiteSpace: 'nowrap', color: 'inherit', textDecoration: 'none' }}
              >
                <span style={{ color: '#D4AF37' }}>{role.icon}</span>
                {role.title}
              </a>
            ))}
            <div className="flex-none w-6" />
          </div>
          {/* Indicador de scroll — más explícito que el degradado solo */}
          <div
            className="pointer-events-none absolute right-0 top-0 bottom-2 w-12 flex items-center justify-end pr-1"
            style={{ background: 'linear-gradient(to right, transparent, #FFFFFF 70%)' }}
          >
            <ChevronRight size={18} style={{ color: '#D4AF37' }} />
          </div>
        </div>
      </section>

      {/* ─ Bento Grid ─ */}
      <section id="categorias" className="hidden md:block max-w-[1200px] mx-auto px-6 md:px-8 pb-10 md:pb-16">
        <FadeIn>
          <div className="text-center mb-14">
            <p className="uppercase tracking-[0.3em] text-xs font-semibold mb-4" style={{ color: '#f97316' }}>
              Categorías
            </p>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight font-display" style={{ color: '#111' }}>
              Encuentra tu <span className="text-gradient">talento</span>
            </h2>
          </div>
        </FadeIn>
        <p className="text-center text-xs text-muted-foreground mb-6" style={{ color: '#333' }}>
          Haz clic en cada categoría para ver qué puedes hacer
        </p>
        {/* Fila 1-2: bento asimétrico */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[170px] md:auto-rows-[260px] mb-3 md:mb-4">
          <FadeIn delay={0} className="md:row-span-2">
            <BentoCard image={bentoMusica} icon={<Music size={20} />} title="Música" subtitle="DJs, productores, artistas en vivo, VJs y técnicos de sonido" className="h-full"
              isFresh={freshRoles.has('dj')}
              href={CATEGORY_DEST.musica} />
          </FadeIn>
          <FadeIn delay={0.1} className="md:col-span-2">
            <BentoCard
              image="/images/pexels/1190297.jpg"
              icon={<Building2 size={20} />} title="Empresario" subtitle="Salas, promotoras y agencias de eventos" className="h-full"
              isFresh={freshRoles.has('empresario')}
              href={CATEGORY_DEST.empresario} />
          </FadeIn>
          <FadeIn delay={0.15} className="md:row-span-2">
            <BentoCard image={bentoImagen} icon={<Camera size={20} />} title="Imagen & Media" subtitle="Fotógrafos, videógrafos y creadores" className="h-full"
              isFresh={freshRoles.has('media')}
              href={CATEGORY_DEST.imagen} />
          </FadeIn>
          <FadeIn delay={0.2} className="md:col-span-2">
            <BentoCard image={bentoStaff} icon={<Users size={20} />} title="Staff & Promoción" subtitle="RRPP, hostess, promotores y azafatas" className="h-full"
              isFresh={freshRoles.has('staff') || freshRoles.has('promotor')}
              href={CATEGORY_DEST.staff} />
          </FadeIn>
        </div>
        {/* Fila 3: Belleza + Gastro */}
        <div className="grid grid-cols-2 gap-3 md:gap-4" style={{ height: 180 }}>
          <FadeIn delay={0.25} className="h-full">
            <BentoCard
              image="/images/pexels/2681751.jpg"
              icon={<Scissors size={20} />} title="Belleza & Estética" subtitle="Maquilladores y peluquería a domicilio" className="h-full"
              isFresh={freshRoles.has('makeup') || freshRoles.has('peluqueria')}
              href={CATEGORY_DEST.belleza} />
          </FadeIn>
          <FadeIn delay={0.3} className="h-full">
            <BentoCard image={bentoGastro} icon={<UtensilsCrossed size={20} />} title="Gastro & Sala" subtitle="Bartenders, chefs y catering premium" className="h-full"
              isFresh={freshRoles.has('catering')}
              href={CATEGORY_DEST.gastro} />
          </FadeIn>
        </div>
      </section>


      {/* ─ Testimonios (solo si hay reseñas reales aprobadas) ─ */}
      {communityReviews.length > 0 && (
        <section className="relative overflow-hidden pb-16 pt-16" style={{ background: '#f8f7f4' }}>
          <div className="relative max-w-[1200px] mx-auto px-6 md:px-8">
          <FadeIn className="text-center mb-10">
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.25em] mb-4" style={{ color: '#8b5cf6' }}>Lo que dicen los profesionales</p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight font-display" style={{ color: '#111' }}>
              La comunidad <span className="text-gradient">habla</span>
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {communityReviews.slice(0, 3).map((r) => ({
              name: r.reviewer_name, role: r.reviewer_role,
              avatar: r.reviewer_avatar ?? r.reviewer_name.charAt(0).toUpperCase(),
              text: r.comment,
            })).map((t, i) => (
              <FadeIn key={t.name} delay={i * 0.08}>
                <div className="relative rounded-2xl h-64 flex flex-col justify-between p-5"
                  style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
                    "{t.text}"
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0"
                      style={{ background: 'rgba(212,175,55,0.12)', color: '#B8941E', border: '1px solid rgba(212,175,55,0.3)' }}>
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-xs font-black" style={{ color: '#111' }}>{t.name}</p>
                      <p className="text-[0.68rem]" style={{ color: 'rgba(0,0,0,0.5)' }}>{t.role}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
          </div>
        </section>
      )}


      {/* ─ Guías destacadas (puente blog → directorio) ─ */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-8 pb-16 md:pb-20">
        <FadeIn>
          <div className="text-center mb-10">
            <p className="uppercase tracking-[0.3em] text-xs font-semibold mb-3" style={{ color: '#8b5cf6' }}>Precios reales</p>
            <h2 className="text-2xl md:text-4xl font-black tracking-tight font-display" style={{ color: '#111' }}>
              Antes de contratar, infórmate
            </h2>
          </div>
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { href: '/blog/cuanto-cobra-un-dj-en-espana', label: 'DJ', title: '¿Cuánto cobra un DJ en España?', color: '#8a6a00', bg: 'rgba(212,175,55,0.14)' },
            { href: '/blog/fotografo-boda', label: 'Fotografía', title: 'Fotógrafo de boda: precios y qué mirar', color: '#1d5fc9', bg: 'rgba(96,165,250,0.16)' },
            { href: '/blog/cuantos-camareros-necesito-para-mi-boda', label: 'Staff', title: '¿Cuántos camareros necesitas en tu boda?', color: '#0f7a52', bg: 'rgba(52,211,153,0.16)' },
            { href: '/blog/maquillaje-nupcial-precio-guia', label: 'Belleza', title: 'Maquillaje nupcial: guía de precios', color: '#c22a72', bg: 'rgba(244,114,182,0.16)' },
          ].map(g => (
            <a key={g.href} href={g.href}
              className="group block p-5 rounded-2xl transition-all hover:scale-[1.02]"
              style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
              <span className="inline-block text-[0.65rem] font-black uppercase tracking-widest px-2 py-1 rounded-md mb-3"
                style={{ background: g.bg, color: g.color }}>
                {g.label}
              </span>
              <p className="text-sm font-bold leading-snug mb-3" style={{ color: '#111' }}>{g.title}</p>
              <p className="text-xs font-bold transition-transform duration-300 group-hover:translate-x-1" style={{ color: g.color }}>
                Leer guía →
              </p>
            </a>
          ))}
        </div>
        <p className="text-center mt-6">
          <a href="/blog" className="text-xs font-bold underline decoration-dotted underline-offset-4" style={{ color: '#333' }}>
            Ver todas las guías del blog →
          </a>
        </p>
      </section>

      {/* ─ FAQ ─ */}
      <div id="faq"><FaqSection /></div>

      {/* ─ CTA final limpio ─ */}
      <FadeIn>
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-16 md:py-20 text-center">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.25em] mb-4" style={{ color: '#D4AF37' }}>
            Sé de los primeros en publicarte
          </p>
          <h2 className="text-2xl md:text-4xl font-black mb-4 tracking-tight font-display" style={{ color: '#111', lineHeight: 1.3, overflow: 'visible', clipPath: 'none', WebkitClipPath: 'none' }}>
            <span style={{ display: 'block', paddingBottom: '0.05em' }}>Publica tu tarifa.</span>
            <span style={{ display: 'inline-block', paddingBottom: '0.35em' }}>Recibe bookings.</span>
          </h2>
          <p className="text-sm mb-8 max-w-sm mx-auto" style={{ color: '#333' }}>
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
              style={{ background: 'rgba(22,20,18,0.06)', border: '1px solid rgba(22,20,18,0.12)', color: '#333' }}>
              <Building2 size={16} /> Organizo un Evento
            </motion.button>
          </div>
          <p className="mt-5 text-xs" style={{ color: '#444' }}>
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
