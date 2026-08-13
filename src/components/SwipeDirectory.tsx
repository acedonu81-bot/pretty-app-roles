import { useState, useRef } from 'react';
import { MapPin, Zap, BadgeCheck, Star, X as CloseIcon, Plus, Check, MessageCircle, ChevronUp, ArrowLeft, ArrowRight } from 'lucide-react';

/**
 * Vista alternativa de directorio en formato swipe vertical (estilo TikTok/
 * Tinder). Pantalla completa, un perfil a la vez, scroll-snap vertical con
 * gestos táctiles nativos (sin librería — snap-scroll de CSS + swipe simple).
 *
 * NO sustituye el grid SEO — es una capa opcional sobre los mismos datos ya
 * cargados por DirectorioPublico, activable con un botón "Vista Swipe".
 */

interface SwipeProfile {
  user_id: string;
  display_name: string;
  role: string;
  photo_url: string | null;
  zone: string | null;
  specialty: string | null;
  hourly_rate: number;
  bio: string | null;
  is_verified: boolean;
  is_flash_active: boolean;
  avgRating: number;
  reviewCount: number;
}

interface Props {
  profiles: SwipeProfile[];
  onClose?: () => void;
  onOpenProfile: (p: SwipeProfile) => void;
  onBookNow: (p: SwipeProfile) => void;
  onAddToCart: (p: SwipeProfile) => void;
  isInCart: (userId: string) => boolean;
  initialIndex?: number;
  /** true = vista embebida en el flujo de la página (sin overlay ni botón
   * cerrar), usada como vista por defecto en móvil. false/omitido = modal
   * fullscreen con overlay, para activarla manualmente (ej. desde desktop). */
  embedded?: boolean;
}

const initialFor = (name: string) => (name || '?').charAt(0).toUpperCase();

export default function SwipeDirectory({ profiles, onClose, onOpenProfile, onBookNow, onAddToCart, isInCart, initialIndex = 0, embedded = false }: Props) {
  const [index, setIndex] = useState(initialIndex);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  // dragX/dragY: desplazamiento en vivo del dedo, para el feedback visual
  // (tarjeta sigue al dedo + overlay "AÑADIDO"/"SIGUIENTE" que aparece al
  // superar el umbral). swipeFeedback se queda un instante tras soltar para
  // que el usuario vea la confirmación antes de que cambie la tarjeta.
  const [dragX, setDragX] = useState(0);
  const [dragY, setDragY] = useState(0);
  const [swipeFeedback, setSwipeFeedback] = useState<'like' | 'next' | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    try { return !localStorage.getItem('xpeak_swipe_onboarding_seen'); } catch { return true; }
  });
  const dismissOnboarding = () => {
    setShowOnboarding(false);
    try { localStorage.setItem('xpeak_swipe_onboarding_seen', '1'); } catch { /* noop */ }
  };
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Navegación circular: al llegar al final, vuelve al primero (y viceversa).
  const goNext = () => setIndex(i => (i + 1) % profiles.length);
  const goPrev = () => setIndex(i => (i - 1 + profiles.length) % profiles.length);

  const HORIZONTAL_THRESHOLD = 90;
  const VERTICAL_THRESHOLD = 60;

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dx = e.touches[0].clientX - touchStart.current.x;
    const dy = e.touches[0].clientY - touchStart.current.y;
    // El gesto dominante (horizontal vs vertical) decide qué se anima —
    // evita que un swipe vertical arrastre la tarjeta lateralmente sin querer.
    if (Math.abs(dx) > Math.abs(dy)) { setDragX(dx); setDragY(0); }
    else { setDragY(dy); setDragX(0); }
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > HORIZONTAL_THRESHOLD) {
      if (dx < 0) {
        // Izquierda → "me gusta" = añadir a Mi evento
        onAddToCart(profiles[index]);
        setSwipeFeedback('like');
      } else {
        // Derecha → siguiente perfil
        setSwipeFeedback('next');
      }
      setTimeout(() => {
        setSwipeFeedback(null);
        if (dx > 0) goNext();
        setDragX(0);
      }, 220);
      return;
    }
    if (Math.abs(dy) > VERTICAL_THRESHOLD) {
      if (dy > 0) goNext(); else goPrev();
    }
    setDragX(0);
    setDragY(0);
  };

  const onWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaY) < 30) return;
    if (e.deltaY > 0) goNext(); else goPrev();
  };

  if (profiles.length === 0) return null;
  const p = profiles[index];
  const inCart = isInCart(p.user_id);

  return (
    <div className={embedded ? 'relative w-full overflow-hidden' : 'fixed inset-0 z-[60] overflow-hidden'}
      style={{
        background: '#000',
        // 100dvh no lo soportan versiones de Safari/iOS anteriores a 15.4 —
        // ahí calc() con una unidad no reconocida invalida toda la
        // declaración y el contenedor colapsa a altura 0 (invisible aunque
        // exista en el DOM). 70vh es un valor fijo de respaldo razonable
        // para una tarjeta de perfil en móvil, sin depender de dvh.
        height: embedded ? '70vh' : undefined,
      }}
      onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} onWheel={onWheel} ref={containerRef}>

      {/* Cerrar — solo en modo modal, la vista embebida no se "cierra" */}
      {!embedded && onClose && (
        <button onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
          <CloseIcon size={18} color="#fff" />
        </button>
      )}

      {/* Indicador de progreso (barras arriba, estilo stories) */}
      <div className={`absolute top-4 left-4 z-20 flex gap-1 ${embedded ? 'right-4' : 'right-16'}`}>
        {profiles.map((_, i) => (
          <div key={i} className="flex-1 h-[2px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.25)' }}>
            <div className="h-full rounded-full transition-all"
              style={{ width: i < index ? '100%' : i === index ? '100%' : '0%', background: '#D4AF37' }} />
          </div>
        ))}
      </div>

      {/* Tarjeta pantalla completa — sigue al dedo durante el arrastre horizontal */}
      <div className="absolute inset-0 transition-transform"
        style={{
          transform: `translateX(${dragX}px) rotate(${dragX / 30}deg)`,
          transition: touchStart.current ? 'none' : 'transform 0.25s ease',
        }}>
        {p.photo_url && !imgErrors[p.user_id] ? (
          <img src={p.photo_url} alt={p.display_name}
            onError={() => setImgErrors(e => ({ ...e, [p.user_id]: true }))}
            className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-8xl font-black"
            style={{ background: 'linear-gradient(135deg,#2a2410,#1a1608)', color: 'rgba(212,175,55,0.3)' }}>
            {initialFor(p.display_name)}
          </div>
        )}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.35) 100%)' }} />
      </div>

      {/* Feedback de swipe horizontal: aparece mientras arrastras o al soltar */}
      {(dragX < -40 || swipeFeedback === 'like') && (
        <div className="absolute top-1/3 left-6 z-30 px-4 py-2 rounded-xl font-black text-lg -rotate-12"
          style={{ background: 'rgba(34,197,94,0.92)', color: '#fff', border: '3px solid #fff' }}>
          ♥ AÑADIDO
        </div>
      )}
      {(dragX > 40 || swipeFeedback === 'next') && (
        <div className="absolute top-1/3 right-6 z-30 px-4 py-2 rounded-xl font-black text-lg rotate-12"
          style={{ background: 'rgba(212,175,55,0.92)', color: '#000', border: '3px solid #fff' }}>
          SIGUIENTE →
        </div>
      )}

      {/* Info inferior */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-5 pb-28 sm:pb-8">
        <div className="flex flex-wrap gap-2 mb-3">
          {p.is_flash_active && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black" style={{ background: '#15803d', color: '#fff' }}>
              <Zap size={11} fill="#fff" /> Disponible ahora
            </span>
          )}
          {p.is_verified && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black" style={{ background: 'rgba(212,175,55,0.95)', color: '#000' }}>
              <BadgeCheck size={11} /> Verificado
            </span>
          )}
        </div>

        <h2 className="text-2xl font-black mb-1" style={{ color: '#fff' }}>{p.display_name}</h2>
        {p.specialty && <p className="text-sm font-semibold mb-1" style={{ color: 'rgba(212,175,55,0.9)' }}>{p.specialty}</p>}

        <div className="flex items-center gap-3 mb-2 flex-wrap text-xs" style={{ color: 'rgba(255,255,255,0.75)' }}>
          {p.zone && <span className="flex items-center gap-1"><MapPin size={11} />{p.zone.split(',')[0]}</span>}
          {p.reviewCount > 0 && <span className="flex items-center gap-1"><Star size={11} fill="#D4AF37" color="#D4AF37" />{p.avgRating} ({p.reviewCount})</span>}
          {p.hourly_rate > 0 && <span className="font-black" style={{ color: '#fff' }}>desde {p.hourly_rate}€/h</span>}
        </div>

        {p.bio && (
          <p className="text-xs leading-relaxed mb-4 line-clamp-2" style={{ color: 'rgba(255,255,255,0.6)' }}>
            {p.bio.slice(0, 110)}{p.bio.length > 110 ? '…' : ''}
          </p>
        )}

        <div className="flex gap-2 relative z-30">
          <button onClick={() => onAddToCart(p)} disabled={inCart}
            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-95"
            style={inCart
              ? { background: 'rgba(34,197,94,0.2)', border: '1.5px solid rgba(34,197,94,0.5)' }
              : { background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)' }}>
            {inCart ? <Check size={18} color="#22c55e" /> : <Plus size={18} color="#fff" />}
          </button>
          <button onClick={() => onOpenProfile(p)}
            className="flex-1 h-12 rounded-full flex items-center justify-center font-bold text-sm"
            style={{ background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.25)', color: '#fff', backdropFilter: 'blur(8px)' }}>
            Ver perfil completo
          </button>
          <button onClick={() => onBookNow(p)}
            className="h-12 px-5 rounded-full flex items-center gap-1.5 font-black text-sm flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
            <MessageCircle size={16} /> <span className="hidden xs:inline">Contactar</span>
          </button>
        </div>

        <p className="text-center text-[0.65rem] mt-3" style={{ color: 'rgba(255,255,255,0.35)' }}>
          {index + 1} / {profiles.length} · desliza para ver más
        </p>
      </div>

      {/* Onboarding: solo la primera vez (localStorage), explica los gestos
          antes de que el usuario tenga que adivinarlos. Se cierra al tocar
          en cualquier sitio o solo. */}
      {showOnboarding && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-3 px-6 py-4 text-center overflow-y-auto"
          style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(4px)' }}
          onClick={dismissOnboarding}>
          <p className="text-xs font-black uppercase tracking-widest" style={{ color: '#D4AF37' }}>Así funciona</p>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center gap-1">
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.2)', border: '1.5px solid rgba(34,197,94,0.5)' }}>
                <ArrowLeft size={16} color="#22c55e" />
              </div>
              <p className="text-[0.6rem] font-bold text-white leading-tight max-w-[70px]">Desliza a la izquierda<br /><span style={{ color: 'rgba(255,255,255,0.5)' }}>añade a tu evento</span></p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.2)', border: '1.5px solid rgba(212,175,55,0.5)' }}>
                <ArrowRight size={16} color="#D4AF37" />
              </div>
              <p className="text-[0.6rem] font-bold text-white leading-tight max-w-[70px]">Desliza a la derecha<br /><span style={{ color: 'rgba(255,255,255,0.5)' }}>siguiente perfil</span></p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.3)' }}>
              <ChevronUp size={16} color="#fff" />
            </div>
            <p className="text-[0.6rem] font-bold text-white leading-tight">Desliza arriba / abajo<br /><span style={{ color: 'rgba(255,255,255,0.5)' }}>navega entre perfiles</span></p>
          </div>

          <button onClick={dismissOnboarding}
            className="mt-1 px-6 py-2.5 rounded-full font-black text-xs flex-shrink-0"
            style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
            Entendido
          </button>
        </div>
      )}
    </div>
  );
}
