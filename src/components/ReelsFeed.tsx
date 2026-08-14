import { useEffect, useRef, useState } from 'react';
import { MapPin, Zap, BadgeCheck, Star, Plus, Check, MessageCircle, Volume2, VolumeX } from 'lucide-react';

/**
 * ReelsFeed — feed vertical tipo Instagram/Reels. Scroll vertical infinito
 * (scroll-snap nativo, fluido en móvil), cada profesional a pantalla completa
 * con foto de fondo, datos y acciones superpuestas. Bucle inacabable: la lista
 * se repite, así que aunque haya pocos perfiles el feed nunca "se acaba"
 * (idea del usuario: "como Instagram, aunque lo hayas visto vuelve a salir").
 *
 * Reutiliza la estética de tarjeta de SwipeDirectory pero con gesto vertical
 * en vez de horizontal. No sustituye a SwipeDirectory (que sigue usándose
 * embebido en el directorio) — es la experiencia principal del feed logueado.
 */

export interface ReelsProfile {
  user_id: string;
  display_name: string;
  role: string;
  photo_url: string | null;
  bio_video_url?: string | null;
  zone: string | null;
  specialty: string | null;
  hourly_rate: number;
  bio: string | null;
  is_verified: boolean;
  is_flash_active: boolean;
  is_early_adopter?: boolean;
  avgRating: number;
  reviewCount: number;
}

interface Props {
  profiles: ReelsProfile[];
  onOpenProfile: (p: ReelsProfile) => void;
  onBookNow: (p: ReelsProfile) => void;
  onAddToCart: (p: ReelsProfile) => void;
  isInCart: (userId: string) => boolean;
}

const initialFor = (name: string) => (name?.trim()?.[0] ?? '?').toUpperCase();

// Nº de repeticiones de la lista para simular scroll infinito. Al acercarse al
// final, se re-centra el scroll al bloque del medio (bucle sin costura).
// 6 basta para el efecto y monta menos nodos que 20 (mejor render inicial).
const LOOPS = 6;

/**
 * Fondo de un reel: vídeo si el profesional lo tiene, si no la foto, si no la
 * inicial. Igual que Instagram/TikTok: el vídeo SOLO se reproduce cuando el
 * reel está en pantalla (IntersectionObserver) y solo entonces se carga
 * (preload='none') — así tengas 3 o 3.000 vídeos, el móvil solo procesa el
 * visible. Silenciado + loop + playsInline (autoplay móvil).
 */
function ReelMedia({ profile: p, eager, imgError, onImgError, soundOn }: {
  profile: ReelsProfile;
  eager: boolean;
  imgError: boolean;
  onImgError: () => void;
  soundOn: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const hasVideo = !!p.bio_video_url;

  // Aplica el estado de sonido global al vídeo (como Instagram: una vez activas
  // el sonido, se mantiene para todos los reels).
  useEffect(() => {
    const v = videoRef.current;
    if (v) v.muted = !soundOn;
  }, [soundOn, visible]);

  useEffect(() => {
    if (!hasVideo) return;
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting && entry.intersectionRatio > 0.6),
      { threshold: [0, 0.6, 1] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasVideo]);

  // Play/pause según visibilidad — nunca reproduce fuera de pantalla.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (visible) { v.play().catch(() => { /* autoplay bloqueado: sin efecto */ }); }
    else { v.pause(); }
  }, [visible]);

  return (
    <div ref={wrapRef} className="absolute inset-0">
      {/* Poster siempre debajo (foto): se ve al instante y mientras carga el vídeo */}
      {p.photo_url && !imgError ? (
        <img
          src={p.photo_url}
          alt={p.display_name}
          loading={eager ? 'eager' : 'lazy'}
          onError={onImgError}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-8xl font-black"
          style={{ background: 'linear-gradient(135deg,#2a2410,#1a1608)', color: 'rgba(212,175,55,0.3)' }}>
          {initialFor(p.display_name)}
        </div>
      )}

      {/* Vídeo encima, solo cuando el reel es visible (se monta bajo demanda) */}
      {hasVideo && visible && (
        <video
          ref={videoRef}
          src={p.bio_video_url ?? undefined}
          poster={p.photo_url ?? undefined}
          loop
          playsInline
          preload="none"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
    </div>
  );
}

export default function ReelsFeed({ profiles, onOpenProfile, onBookNow, onAddToCart, isInCart }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const [activeIdx, setActiveIdx] = useState(0);
  // Sonido global del feed (mudo por defecto, como Instagram). Se muestra solo
  // si hay algún profesional con vídeo.
  const [soundOn, setSoundOn] = useState(false);
  const anyVideo = profiles.some(p => p.bio_video_url);

  // Bloquear scroll del body mientras el feed está montado (es fullscreen).
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Lista repetida para el bucle infinito.
  const items = profiles.length > 0
    ? Array.from({ length: LOOPS * profiles.length }, (_, i) => profiles[i % profiles.length])
    : [];

  // Arrancar centrado en el bloque del medio para poder scrollear hacia arriba
  // y hacia abajo sin toparse con el borde.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || profiles.length === 0) return;
    const start = Math.floor(LOOPS / 2) * profiles.length;
    el.scrollTop = start * el.clientHeight;
  }, [profiles.length]);

  // Re-centrar cuando se acerca a los extremos → bucle sin costura.
  function onScroll() {
    const el = scrollerRef.current;
    if (!el || profiles.length === 0) return;
    const h = el.clientHeight;
    const cur = Math.round(el.scrollTop / h);
    setActiveIdx(cur % profiles.length);
    const total = items.length;
    if (cur < profiles.length || cur > total - profiles.length) {
      // saltar al bloque equivalente del medio, mismo índice visible
      const mid = Math.floor(LOOPS / 2) * profiles.length + (cur % profiles.length);
      el.scrollTop = mid * h;
    }
  }

  if (profiles.length === 0) return null;

  return (
    <div
      ref={scrollerRef}
      onScroll={onScroll}
      className="fixed inset-0 z-[55] overflow-y-scroll snap-y snap-mandatory"
      style={{ background: '#000', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
    >
      <style>{`.reels-hide-sb::-webkit-scrollbar{display:none}`}</style>

      {/* Botón de sonido global (solo si hay vídeos) — mudo por defecto como
          Instagram; toca para oír el audio de los vídeos. */}
      {anyVideo && (
        <button
          onClick={() => setSoundOn(s => !s)}
          aria-label={soundOn ? 'Silenciar' : 'Activar sonido'}
          className="fixed top-0 left-0 z-[70] m-3 w-11 h-11 rounded-full flex items-center justify-center active:scale-95"
          style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(10px)', marginTop: 'calc(env(safe-area-inset-top) + 0.5rem)' }}>
          {soundOn ? <Volume2 size={20} color="#fff" /> : <VolumeX size={20} color="#fff" />}
        </button>
      )}
      {items.map((p, i) => {
        const inCart = isInCart(p.user_id);
        return (
          <div key={i} className="relative w-full snap-start snap-always" style={{ height: '100dvh', contentVisibility: 'auto', containIntrinsicSize: '100dvh' } as React.CSSProperties}>
            {/* Fondo: vídeo (si lo tiene y está visible), foto, o inicial */}
            <ReelMedia
              profile={p}
              eager={i < 3}
              imgError={!!imgErrors[p.user_id]}
              onImgError={() => setImgErrors(e => ({ ...e, [p.user_id]: true }))}
              soundOn={soundOn}
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0.4) 100%)' }} />

            {/* Info inferior + acciones */}
            <div className="absolute bottom-0 left-0 right-0 z-20 p-5" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1.5rem)' }}>
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
                {p.is_early_adopter && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black" style={{ background: 'rgba(96,165,250,0.95)', color: '#fff' }}>
                    <Star size={11} fill="#fff" /> Fundador
                  </span>
                )}
              </div>

              <h2 className="text-2xl font-black mb-1" style={{ color: '#fff' }}>{p.display_name}</h2>
              {p.specialty && <p className="text-sm font-semibold mb-1" style={{ color: 'rgba(212,175,55,0.9)' }}>{p.specialty}</p>}

              <div className="flex items-center gap-3 mb-2 flex-wrap text-xs" style={{ color: 'rgba(255,255,255,0.78)' }}>
                {p.zone && <span className="flex items-center gap-1"><MapPin size={11} />{p.zone.split(',')[0]}</span>}
                {p.reviewCount > 0 && <span className="flex items-center gap-1"><Star size={11} fill="#D4AF37" color="#D4AF37" />{p.avgRating} ({p.reviewCount})</span>}
                {p.hourly_rate > 0 && <span className="font-black" style={{ color: '#fff' }}>desde {p.hourly_rate}€/h</span>}
              </div>

              {p.bio && (
                <p className="text-xs leading-relaxed mb-4 line-clamp-2" style={{ color: 'rgba(255,255,255,0.62)' }}>
                  {p.bio.slice(0, 110)}{p.bio.length > 110 ? '…' : ''}
                </p>
              )}

              <div className="flex gap-2">
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
                  Ver perfil
                </button>
                <button onClick={() => onBookNow(p)}
                  className="h-12 px-5 rounded-full flex items-center gap-1.5 font-black text-sm flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
                  <MessageCircle size={16} /> Contactar
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
