import { useEffect, useRef, useState } from 'react';
import { MapPin, Zap, BadgeCheck, Star, Plus, Check, MessageCircle } from 'lucide-react';
import InstallPwaBanner from '@/components/InstallPwaBanner';
import type { ReelsProfile } from '@/components/ReelsFeed';

/**
 * DiscoverList — sustituye al feed swipe (ReelsFeed) en /descubrir para móvil.
 *
 * Motivo (pedido del usuario): en el feed a pantalla completa se pisaban tres
 * gestos en la misma zona táctil — swipe vertical (cambiar de perfil), swipe
 * horizontal (fotos/vídeo del portfolio) y el tap en "+"/Contactar — y los
 * usuarios se confundían constantemente entre pasar de perfil y añadir al
 * carrito. Aquí no hay gestos ambiguos: es scroll normal de página (como
 * cualquier lista), cada ficha es compacta (no ocupa toda la pantalla) y las
 * acciones viven en una barra fija abajo que siempre actúa sobre el perfil
 * que esté centrado en pantalla en ese momento — nunca hay que "acertar" el
 * botón de una ficha en movimiento.
 */

interface Props {
  profiles: ReelsProfile[];
  onOpenProfile: (p: ReelsProfile) => void;
  onBookNow: (p: ReelsProfile) => void;
  onAddToCart: (p: ReelsProfile) => void;
  isInCart: (userId: string) => boolean;
  showCartButton: boolean;
  // Descubrir.tsx pinta su propio banner fijo "Crear cuenta y contactar" para
  // visitantes sin sesión, en el mismo hueco inferior — mostrar además esta
  // barra de acciones ahí duplicaba el espacio y las tapaba entre sí.
  hideActionBar?: boolean;
}

const initialFor = (name: string) => (name?.trim()?.[0] ?? '?').toUpperCase();

function ProfileCard({ p, imgError, onImgError, cardRef }: {
  p: ReelsProfile;
  imgError: boolean;
  onImgError: () => void;
  cardRef: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div ref={cardRef} data-user-id={p.user_id} className="rounded-2xl overflow-hidden mx-4 mb-4"
      style={{ background: '#141210', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="relative w-full" style={{ aspectRatio: '4/3' }}>
        {p.photo_url && !imgError ? (
          <img src={p.photo_url} alt={p.display_name} loading="lazy" onError={onImgError}
            className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-6xl font-black"
            style={{ background: 'linear-gradient(135deg,#2a2410,#1a1608)', color: 'rgba(212,175,55,0.3)' }}>
            {initialFor(p.display_name)}
          </div>
        )}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
          {p.is_flash_active && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.65rem] font-black" style={{ background: '#15803d', color: '#fff' }}>
              <Zap size={10} fill="#fff" /> Disponible ahora
            </span>
          )}
          {p.is_verified && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.65rem] font-black" style={{ background: 'rgba(212,175,55,0.95)', color: '#000' }}>
              <BadgeCheck size={10} /> Verificado
            </span>
          )}
          {p.is_early_adopter && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.65rem] font-black"
              style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
              <Star size={10} fill="#000" /> Fundador
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <h2 className="text-lg font-black leading-tight mb-0.5" style={{ color: '#fff' }}>{p.display_name}</h2>
        {p.specialty && <p className="text-sm font-semibold mb-1.5" style={{ color: 'rgba(212,175,55,0.9)' }}>{p.specialty}</p>}

        <div className="flex items-center gap-3 mb-2 flex-wrap text-xs" style={{ color: 'rgba(255,255,255,0.68)' }}>
          {p.zone && <span className="flex items-center gap-1"><MapPin size={11} />{p.zone.split(',')[0]}</span>}
          {p.reviewCount > 0 && <span className="flex items-center gap-1"><Star size={11} fill="#D4AF37" color="#D4AF37" />{p.avgRating} ({p.reviewCount})</span>}
          {p.hourly_rate > 0 ? <span className="font-black" style={{ color: '#fff' }}>desde {p.hourly_rate}€/h</span>
            : <span className="font-black" style={{ color: '#fff' }}>Precio a consultar</span>}
        </div>

        {p.bio && (
          <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'rgba(255,255,255,0.55)' }}>
            {p.bio.slice(0, 130)}{p.bio.length > 130 ? '…' : ''}
          </p>
        )}
      </div>
    </div>
  );
}

export default function DiscoverList({ profiles, onOpenProfile, onBookNow, onAddToCart, isInCart, showCartButton, hideActionBar }: Props) {
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const [activeId, setActiveId] = useState<string | null>(profiles[0]?.user_id ?? null);
  const cardsRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);

  // La barra de acciones fija abajo siempre opera sobre la ficha más visible
  // en el viewport en ese momento — así el usuario nunca tiene que acertar un
  // botón que se mueve con la ficha, y no hay ambigüedad entre "qué perfil
  // estoy mirando" y "a quién le doy +".
  useEffect(() => {
    if (profiles.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          const id = (visible[0].target as HTMLElement).dataset.userId;
          if (id) setActiveId(id);
        }
      },
      { threshold: [0.5, 0.75, 1], rootMargin: '-35% 0px -35% 0px' }
    );
    cardsRef.current.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [profiles]);

  if (profiles.length === 0) return null;

  const active = profiles.find(p => p.user_id === activeId) ?? profiles[0];
  const inCart = isInCart(active.user_id);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[55] overflow-y-auto" style={{ background: '#0a0908' }}>
      <div className={hideActionBar ? 'pt-20 pb-24' : 'pt-20 pb-32'}>
        {profiles.map((p) => (
          <ProfileCard
            key={p.user_id}
            p={p}
            imgError={!!imgErrors[p.user_id]}
            onImgError={() => setImgErrors(e => ({ ...e, [p.user_id]: true }))}
            cardRef={(el) => {
              if (el) cardsRef.current.set(p.user_id, el);
              else cardsRef.current.delete(p.user_id);
            }}
          />
        ))}
      </div>

      {/* Barra de acciones fija — siempre las mismas 3 acciones, en el mismo
          sitio, actuando sobre `active` (la ficha centrada en pantalla).
          Oculta cuando Descubrir.tsx ya pinta su banner de "crear cuenta" en
          el mismo hueco (visitante sin sesión). */}
      {!hideActionBar && (
      <div className="fixed bottom-0 left-0 right-0 z-[60] px-4 pt-3"
        style={{
          background: 'linear-gradient(to top, rgba(10,9,8,0.98) 60%, rgba(10,9,8,0))',
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.75rem)',
        }}>
        <div className="max-w-md mx-auto flex items-center gap-2 mb-2 px-1">
          <p className="text-xs font-bold truncate" style={{ color: 'rgba(255,255,255,0.7)' }}>
            {active.display_name}
          </p>
        </div>
        <div className="max-w-md mx-auto flex gap-2">
          {showCartButton && (
            <button onClick={() => onAddToCart(active)} disabled={inCart}
              aria-label="Añadir a mi evento"
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-95"
              style={inCart
                ? { background: 'rgba(34,197,94,0.2)', border: '1.5px solid rgba(34,197,94,0.5)' }
                : { background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.22)' }}>
              {inCart ? <Check size={18} color="#22c55e" /> : <Plus size={18} color="#fff" />}
            </button>
          )}
          <button onClick={() => onOpenProfile(active)}
            className="h-12 px-4 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.85)' }}>
            Ver perfil
          </button>
          <button onClick={() => onBookNow(active)}
            className="flex-1 h-12 px-5 rounded-full flex items-center justify-center gap-1.5 font-black text-sm min-w-0"
            style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
            <MessageCircle size={16} /> Contactar
          </button>
        </div>
      </div>
      )}

      <InstallPwaBanner />
    </div>
  );
}
