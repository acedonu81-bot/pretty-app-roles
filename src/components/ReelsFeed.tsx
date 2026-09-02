import { useEffect, useRef, useState, useMemo } from 'react';
import { MapPin, Zap, BadgeCheck, Star, Plus, Check, MessageCircle, Volume2, VolumeX, ChevronRight } from 'lucide-react';
import { buildReelSlides } from '@/lib/reelSlides';
import InstallPwaBanner from '@/components/InstallPwaBanner';

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
  portfolio_urls?: string[] | null;
  bio_video_url?: string | null;
  video_session_urls?: string[] | null;
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
  // "Mi evento" es una función de empresario (contratar profesionales) — un
  // profesional viendo el feed no tiene por qué poder añadir a un carrito
  // que no le sirve, así que el botón "+" solo se muestra si es empresario.
  showCartButton: boolean;
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
function ReelMedia({ profile: p, eager, imgError, onImgError, soundOn, photoOnly = false, photoUrl }: {
  profile: ReelsProfile;
  eager: boolean;
  imgError: boolean;
  onImgError: () => void;
  soundOn: boolean;
  // Cuando es true, este componente SOLO muestra foto/inicial y nunca monta
  // ni reproduce bio_video_url — usado en el slide 0 (foto) de ReelSlider,
  // donde el vídeo principal ahora vive en su propio slide (ReelVideoSlide).
  // Evita doble reproducción del mismo vídeo en dos sitios a la vez.
  photoOnly?: boolean;
  // URL concreta a mostrar en este slide (foto principal o una del portfolio).
  // Sin esto, todo slide de tipo 'photo' mostraba SIEMPRE p.photo_url — la
  // foto principal se repetía visualmente en cada slide de portfolio.
  photoUrl?: string | null;
}) {
  const displayUrl = photoUrl !== undefined ? photoUrl : p.photo_url;
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  // Solo archivos de vídeo directos (mp4/mov/webm) son reproducibles en <video>.
  // bio_video_url también puede ser un enlace YouTube/Vimeo (necesita iframe, no
  // sirve aquí) → en ese caso mostramos la foto, no un vídeo roto.
  const url = p.bio_video_url ?? '';
  const hasVideo = !photoOnly && /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url);

  // Aplica el estado de sonido global al vídeo (como Instagram: una vez activas
  // el sonido, se mantiene para todos los reels).
  useEffect(() => {
    const v = videoRef.current;
    if (v) v.muted = !soundOn;
  }, [soundOn, visible]);

  useEffect(() => {
    if (photoOnly) return;
    if (!hasVideo) return;
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting && entry.intersectionRatio > 0.6),
      { threshold: [0, 0.6, 1] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasVideo, photoOnly]);

  // Play/pause según visibilidad — nunca reproduce fuera de pantalla.
  useEffect(() => {
    if (photoOnly) return;
    const v = videoRef.current;
    if (!v) return;
    if (visible) { v.play().catch(() => { /* autoplay bloqueado: sin efecto */ }); }
    else { v.pause(); }
  }, [visible, photoOnly]);

  return (
    <div ref={wrapRef} className="absolute inset-0">
      {/* Poster siempre debajo (foto): se ve al instante y mientras carga el vídeo */}
      {displayUrl && !imgError ? (
        <img
          src={displayUrl}
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

      {/* Vídeo encima, solo cuando el reel es visible (se monta bajo demanda).
          Nunca en modo photoOnly: hasVideo ya es false ahí, doble garantía. */}
      {!photoOnly && hasVideo && visible && (
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

/**
 * Slide de vídeo individual (bio_video_url o una sesión) dentro del
 * carrusel horizontal. Mismo criterio de reproducción por visibilidad que
 * ReelMedia: solo carga/reproduce cuando `active` es true (perfil visible
 * verticalmente Y slide horizontal activo). Pantalla completa, sin overlay.
 */
function ReelVideoSlide({ url, active, soundOn }: { url: string; active: boolean; soundOn: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (v) v.muted = !soundOn;
  }, [soundOn, active]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (active) { v.play().catch(() => { /* autoplay bloqueado: sin efecto */ }); }
    else { v.pause(); }
  }, [active]);

  return (
    <div className="absolute inset-0 bg-black">
      {active && (
        <video
          ref={videoRef}
          src={url}
          loop
          playsInline
          preload="none"
          className="absolute inset-0 w-full h-full object-contain"
        />
      )}
    </div>
  );
}

/**
 * ReelSlider — carrusel horizontal DENTRO de una tarjeta del feed vertical.
 * Slide 0 = foto (con el overlay de info/CTAs de siempre). Slides 1+ = vídeo,
 * pantalla completa sin overlay. Scroll-snap-x propio, independiente del
 * scroll-snap-y del contenedor padre — el gesto vertical para cambiar de
 * perfil sigue funcionando sin importar en qué slide horizontal se esté.
 */
function ReelSlider({ profile: p, eager, imgError, onImgError, soundOn, active, inCart, onOpenProfile, onBookNow, onAddToCart, showCartButton }: {
  profile: ReelsProfile;
  eager: boolean;
  imgError: boolean;
  onImgError: () => void;
  soundOn: boolean;
  active: boolean;
  inCart: boolean;
  onOpenProfile: (p: ReelsProfile) => void;
  onBookNow: (p: ReelsProfile) => void;
  onAddToCart: (p: ReelsProfile) => void;
  showCartButton: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [hIdx, setHIdx] = useState(0);
  const slides = useMemo(() => buildReelSlides(p), [p]);

  // Al desmontar/remontar la tarjeta (siguiente perfil tras scroll vertical),
  // el carrusel horizontal ya arranca en scrollLeft 0 por defecto — no hace
  // falta resetear nada manualmente, cada instancia es nueva.

  function onHScroll() {
    const el = trackRef.current;
    if (!el || el.clientWidth === 0) return;
    setHIdx(Math.round(el.scrollLeft / el.clientWidth));
  }

  return (
    <div className="relative w-full h-full">
      <div
        ref={trackRef}
        onScroll={onHScroll}
        className="w-full h-full overflow-x-scroll snap-x snap-mandatory flex"
        style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        {slides.map((slide, i) => (
          <div key={i} className="relative w-full h-full flex-shrink-0 snap-start snap-always" style={{ minWidth: '100%' }}>
            {slide.type === 'photo' ? (
              <>
                <ReelMedia
                  profile={p}
                  eager={eager}
                  imgError={imgError}
                  onImgError={onImgError}
                  soundOn={soundOn}
                  photoOnly
                  photoUrl={slide.url}
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0.4) 100%)' }} />
                <div className="swipe-card-info absolute bottom-0 left-0 right-0 z-20 p-5 max-w-sm" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1.5rem + var(--install-banner-space, 0px))' }}>
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
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black"
                        style={{
                          background: 'linear-gradient(135deg,#D4AF37,#B8941E)',
                          color: '#000',
                          border: '1px solid rgba(255,255,255,0.35)',
                          boxShadow: '0 0 16px rgba(212,175,55,0.5), 0 2px 8px rgba(0,0,0,0.25)',
                        }}>
                        <Star size={11} fill="#000" /> Fundador
                      </span>
                    )}
                  </div>

                  <h2 className="text-2xl font-black mb-1 break-words line-clamp-2" style={{ color: '#fff' }}>{p.display_name}</h2>
                  {p.specialty && <p className="text-sm font-semibold mb-1" style={{ color: 'rgba(212,175,55,0.9)' }}>{p.specialty}</p>}

                  <div className="flex items-center gap-3 mb-2 flex-wrap text-xs" style={{ color: 'rgba(255,255,255,0.78)' }}>
                    {p.zone && <span className="flex items-center gap-1"><MapPin size={11} />{p.zone.split(',')[0]}</span>}
                    {p.reviewCount > 0 && <span className="flex items-center gap-1"><Star size={11} fill="#D4AF37" color="#D4AF37" />{p.avgRating} ({p.reviewCount})</span>}
                    {p.hourly_rate > 0 ? <span className="font-black" style={{ color: '#fff' }}>desde {p.hourly_rate}€/h</span>
                      : <span className="font-black" style={{ color: '#fff' }}>Precio a consultar</span>}
                  </div>

                  {p.bio && (
                    <p className="text-xs leading-relaxed mb-4 line-clamp-2" style={{ color: 'rgba(255,255,255,0.62)' }}>
                      {p.bio.slice(0, 110)}{p.bio.length > 110 ? '…' : ''}
                    </p>
                  )}

                  <div className="flex gap-2">
                    {showCartButton && (
                      <button onClick={() => onAddToCart(p)} disabled={inCart}
                        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-95"
                        style={inCart
                          ? { background: 'rgba(34,197,94,0.2)', border: '1.5px solid rgba(34,197,94,0.5)' }
                          : { background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)' }}>
                        {inCart ? <Check size={18} color="#22c55e" /> : <Plus size={18} color="#fff" />}
                      </button>
                    )}
                    <button onClick={() => onOpenProfile(p)}
                      className="h-12 px-4 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.85)' }}>
                      Ver perfil
                    </button>
                    <button onClick={() => onBookNow(p)}
                      className="flex-1 h-12 px-5 rounded-full flex items-center justify-center gap-1.5 font-black text-sm min-w-0"
                      style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
                      <MessageCircle size={16} /> Contactar
                    </button>
                  </div>
                </div>
                {slides.length > 1 && i === 0 && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20 pointer-events-none w-11 h-11 rounded-full flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg,#F4D35E,#D4AF37)',
                      boxShadow: '0 0 0 1px rgba(255,255,255,0.4), 0 4px 16px rgba(0,0,0,0.5), 0 0 20px rgba(212,175,55,0.6)',
                      animation: 'reel-arrow-pulse 1.6s ease-in-out infinite',
                    }}>
                    <ChevronRight size={24} color="#000" strokeWidth={3} />
                  </div>
                )}
              </>
            ) : (
              <ReelVideoSlide url={slide.url!} active={active && hIdx === i} soundOn={soundOn} />
            )}
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <div className="absolute top-0 left-0 right-0 z-30 flex gap-1 px-3 pt-8"
          style={{ marginTop: 'calc(env(safe-area-inset-top) + 0.5rem)' }}>
          {slides.map((_, i) => (
            <div key={i} className="flex-1 h-[2px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.3)' }}>
              <div className="h-full rounded-full" style={{ width: i === hIdx ? '100%' : '0%', background: 'rgba(255,255,255,0.9)' }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ReelsFeed({ profiles, onOpenProfile, onBookNow, onAddToCart, isInCart, showCartButton }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const [activeIdx, setActiveIdx] = useState(0);
  // Índice absoluto dentro de `items` (el bucle infinito con LOOPS copias de
  // cada perfil) — a diferencia de activeIdx (0..profiles.length-1, usado
  // por el indicador de stories), este identifica de forma única cuál de las
  // LOOPS copias del perfil visible es la que realmente está en pantalla.
  const [absIdx, setAbsIdx] = useState(0);
  // Sonido global del feed (mudo por defecto, como Instagram). Se muestra solo
  // si hay algún profesional con vídeo.
  const [soundOn, setSoundOn] = useState(false);
  // Mismo criterio que hasVideo: solo cuenta vídeos REPRODUCIBLES (archivos
  // directos), no enlaces YouTube/Vimeo → el botón de sonido solo sale si de
  // verdad hay audio que activar.
  const anyVideo = profiles.some(p => /\.(mp4|webm|mov|m4v)(\?|$)/i.test(p.bio_video_url ?? ''));

  // Bloquear scroll del body mientras el feed está montado (es fullscreen).
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Orden estable (por score, el mismo que trae fetchDirectorioProfiles) — un
  // shuffle aquí encima del que ya hacía Descubrir.tsx era redundante y, si
  // `profiles` cambiaba de referencia entre renders sin cambiar de contenido,
  // volvía a barajar el feed entero bajo el usuario (efecto de "parpadeo" y
  // salto a otra ficha a mitad de scroll).
  const base = profiles;

  // Lista repetida para el bucle infinito.
  const items = base.length > 0
    ? Array.from({ length: LOOPS * base.length }, (_, i) => base[i % base.length])
    : [];

  // Profundidad de avance real (perfiles vistos desde el primero, sin contar
  // los saltos de re-centrado del bucle) — usada por el intercepto de "atrás"
  // de más abajo para decidir si retrocede un perfil o no hace nada.
  // prevAbsIdxRef guarda el índice absoluto de scroll síncronamente (a
  // diferencia de activeIdx, que es state y puede leerse stale entre eventos
  // de scroll consecutivos) para poder comparar contra el índice anterior real.
  const backDepthRef = useRef(0);
  const prevAbsIdxRef = useRef<number | null>(null);

  // Arrancar centrado en el bloque del medio para poder scrollear hacia arriba
  // y hacia abajo sin toparse con el borde. El índice visible siempre es 0 (el
  // primer perfil del orden barajado), así que el indicador debe arrancar ahí
  // también — si no, tras un remount (p.ej. volver de "Ver perfil" con el
  // botón atrás del navegador) el indicador se queda en un valor stale.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || profiles.length === 0) return;
    const start = Math.floor(LOOPS / 2) * profiles.length;
    el.scrollTop = start * el.clientHeight;
    setActiveIdx(0);
    setAbsIdx(start);
    prevAbsIdxRef.current = start;
    backDepthRef.current = 0;
  }, [profiles.length]);

  // Re-centrar cuando se acerca a los extremos → bucle sin costura.
  function onScroll() {
    const el = scrollerRef.current;
    if (!el || profiles.length === 0) return;
    const h = el.clientHeight;
    const cur = Math.round(el.scrollTop / h);
    setActiveIdx(cur % profiles.length);
    setAbsIdx(cur);

    const total = items.length;
    const isRecenterJump = cur < profiles.length || cur > total - profiles.length;
    if (!isRecenterJump && prevAbsIdxRef.current !== null && cur !== prevAbsIdxRef.current) {
      const delta = cur - prevAbsIdxRef.current;
      backDepthRef.current = Math.max(0, backDepthRef.current + delta);
    }
    if (!isRecenterJump) prevAbsIdxRef.current = cur;

    if (isRecenterJump) {
      // saltar al bloque equivalente del medio, mismo índice visible
      const mid = Math.floor(LOOPS / 2) * profiles.length + (cur % profiles.length);
      el.scrollTop = mid * h;
      prevAbsIdxRef.current = mid;
    }
  }

  // El botón/gesto "atrás" del dispositivo debe retroceder un perfil dentro
  // del swipe (como en Instagram), no salir de la app — y en el primer perfil
  // no debe hacer nada, para no dejar al usuario "atrapado" a medio gesto ni
  // sacarlo de /descubrir sin querer. Una única entrada de historial centinela
  // basta: el popstate se neutraliza siempre reponiéndola, y backDepthRef
  // decide si además hay que mover el scroll un perfil hacia atrás.
  useEffect(() => {
    if (profiles.length === 0) return;
    window.history.pushState({ xpeakReel: true }, '');
    const onPopState = () => {
      const el = scrollerRef.current;
      window.history.pushState({ xpeakReel: true }, '');
      // El scrollBy dispara onScroll, que ya recalcula backDepthRef a partir
      // del cambio real de posición — no decrementar aquí también, o el mismo
      // "atrás" se contaría dos veces y el segundo "atrás" consecutivo no haría nada.
      if (backDepthRef.current > 0 && el) {
        el.scrollBy({ top: -el.clientHeight, behavior: 'instant' });
      }
      // backDepthRef === 0: primer perfil, no hace nada más que neutralizar el pop.
    };
    window.addEventListener('popstate', onPopState);
    return () => {
      window.removeEventListener('popstate', onPopState);
      // Limpia la entrada centinela para no dejar el historial ensuciado al desmontar.
      if (window.history.state?.xpeakReel) window.history.back();
    };
  }, [profiles.length]);

  if (profiles.length === 0) return null;

  return (
    <div
      ref={scrollerRef}
      onScroll={onScroll}
      className="fixed inset-0 z-[55] overflow-y-scroll snap-y snap-mandatory"
      style={{ background: '#000', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
    >
      <style>{`
        .reels-hide-sb::-webkit-scrollbar{display:none}
        @keyframes reel-arrow-pulse {
          0%, 100% { transform: translateY(-50%) translateX(0) scale(1); filter: brightness(1); }
          50% { transform: translateY(-50%) translateX(6px) scale(1.08); filter: brightness(1.35); }
        }
      `}</style>

      {/* Indicador de posición dentro del ciclo de perfiles únicos (tipo Stories) */}
      {profiles.length > 1 && (
        <div className="fixed top-0 left-0 right-0 z-[70] flex gap-1 px-3"
          style={{ marginTop: 'calc(env(safe-area-inset-top) + 0.5rem)' }}>
          {profiles.map((_, i) => (
            <div key={i} className="flex-1 h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.25)' }}>
              <div className="h-full rounded-full transition-all" style={{
                width: i === activeIdx ? '100%' : '0%',
                background: '#D4AF37',
              }} />
            </div>
          ))}
        </div>
      )}

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
            <ReelSlider
              profile={p}
              eager={i < 3}
              imgError={!!imgErrors[p.user_id]}
              onImgError={() => setImgErrors(e => ({ ...e, [p.user_id]: true }))}
              soundOn={soundOn}
              active={i === absIdx}
              inCart={inCart}
              onOpenProfile={onOpenProfile}
              onBookNow={onBookNow}
              onAddToCart={onAddToCart}
              showCartButton={showCartButton}
            />
          </div>
        );
      })}
      <InstallPwaBanner />
    </div>
  );
}
