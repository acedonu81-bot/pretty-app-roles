import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Star, MapPin, BadgeCheck, MessageCircle, FileText, Zap, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Profile } from '@/data/profiles';
import GeometricAvatar from './GeometricAvatar';
import TruncatedDescription from '@/components/TruncatedDescription';
import VoteButton from './VoteButton';
import LegalModal from '@/components/LegalModal';
import ContractModal from './ContractModal';
import { useProfile } from '@/hooks/useProfile';

const HearthisIcon = ({ size = 14 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
  </svg>
);

const milestones = [
  { votes: 50, label: 'Novato Prometedor', color: '#6ee7b7' },
  { votes: 150, label: 'En Ascenso', color: '#fbbf24' },
  { votes: 300, label: 'Favorito del Público', color: '#8A6D0F' },
  { votes: 500, label: '¡Candidato a PRO!', color: '#8A6D0F' },
];

interface ProfileCardProps {
  profile: Profile;
  onBook?: (profile: Profile) => void;
  compact?: boolean;
  showPortfolio?: boolean;
  onMessage?: (userId: string, name: string) => void;
  onNavigateSubscription?: () => void;
  onViewProfile?: (profile: Profile) => void;
}

const ProfileCard = ({ profile: p, onBook, compact, showPortfolio, onMessage, onNavigateSubscription, onViewProfile }: ProfileCardProps) => {
  const currentUser = useProfile();
  const isRookie = p.category === 'rookie';
  const [accepted, setAccepted] = useState(() => localStorage.getItem('xpeak_norms_accepted') === 'true');
  const [showLegal, setShowLegal] = useState(false);
  const [showContract, setShowContract] = useState(false);
  const [imgError, setImgError] = useState(false);
  const realProfileId = (p as any).userId ?? p.userId ?? null;
  const [voteCount, setVoteCount] = useState(0);
  const [hasVotedToday, setHasVotedToday] = useState(false);

  useEffect(() => {
    if (!isRookie || !realProfileId) return;
    supabase.from('votes' as any).select('id', { count: 'exact', head: true }).eq('profile_id', realProfileId)
      .then(({ count }) => setVoteCount(count ?? 0));
    if (currentUser.id) {
      supabase.from('votes' as any).select('id').eq('profile_id', realProfileId).eq('voter_id', currentUser.id)
        .maybeSingle().then(({ data }) => setHasVotedToday(!!data));
    }
  }, [isRookie, realProfileId, currentUser.id]);

  const progress = Math.min((voteCount / 500) * 100, 100);
  const currentMilestone = milestones.filter(m => voteCount >= m.votes).pop();
  const nextMilestone = milestones.find(m => voteCount < m.votes);

  const isDJ = p.role === 'dj';
  const audioUrl = (p as any).audio_embed_url || p.streamUrl;
  const audioLabel = audioUrl
    ? audioUrl.includes('mixcloud') ? 'Mixcloud'
    : audioUrl.includes('soundcloud') ? 'SoundCloud'
    : audioUrl.includes('hearthis') ? 'hearthis.at'
    : null : null;

  const hasPhoto = p.photo && p.photo.length > 5 && !imgError;
  const showsPrice = !['makeup', 'peluqueria', 'vestuario', 'media', 'design'].includes(p.role);
  const priceLabel = showsPrice && p.price > 0 ? `${p.price}€${p.priceUnit}` : null;
  // No todos los roles pueden fijar tarifa de antemano (Wedding Planner,
  // Magos, artistas con caché por evento) — "A consultar" en vez de dejar
  // el precio en blanco sin explicación.
  const priceOnRequest = showsPrice && !(p.price > 0);
  const isEarlyAdopter = (p as any).isEarlyAdopter ?? false;
  const isNew = (p as any).isNew ?? false;

  return (
    <motion.div
      className="rounded-2xl overflow-x-hidden flex flex-col transition-all duration-200 hover:scale-[1.01]"
      style={{
        background: '#ffffff',
        border: isEarlyAdopter ? '4px solid rgba(96,165,250,0.7)' : '1px solid rgba(0,0,0,0.08)',
        boxShadow: isEarlyAdopter ? '0 0 20px rgba(96,165,250,0.2), 0 1px 3px rgba(0,0,0,0.06)' : '0 1px 3px rgba(0,0,0,0.06)',
      }}
      whileHover={{ boxShadow: '0 8px 28px rgba(0,0,0,0.12)' }}
    >
      {/* ── FOTO HERO ── */}
      {/* Cuadrado en desktop, no apaisado: con pb-62% solo cabía una franja de
          un retrato vertical (el 42% de la foto), así que o se cortaba la
          cabeza o el cuerpo — no había object-position que lo salvara. En
          cuadrado entra el 67%: cara y torso, que es lo que se quiere ver.
          Móvil ya iba bien porque su hueco es vertical. */}
      <div className="relative pb-[125%] sm:pb-[100%]">
        <div className="absolute inset-0 rounded-t-2xl sm:rounded-b-none" style={{ overflow: 'hidden' }}>
          {hasPhoto ? (
            <img src={p.photo} alt={p.name} loading="lazy" className="w-full h-full object-cover"
              // Los retratos traen la cara en el tercio superior: centrar el
              // recorte la dejaba a ras del borde. 10% da aire sobre la cabeza.
              style={{ objectPosition: '50% 10%' }}
              onError={() => setImgError(true)} />
          ) : (
            /* Sin foto el hueco es grande (214px de alto en móvil): un avatar
               de 80px centrado dejaba ~63% de fondo vacío, y el degradado a
               rgba(0,0,0,0.6) sobre tarjeta blanca se leía como un bloque gris.
               Un avatar mayor y un fondo dorado suave lo integran con la
               tarjeta en vez de dejar ese hueco gris. */
            <div className="w-full h-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,rgba(212,175,55,0.18),rgba(212,175,55,0.06))' }}>
              <GeometricAvatar role={p.role as any} seed={p.id} size={110} isLive={p.isLive} />
            </div>
          )}
          {/* gradient bottom — desktop only (mobile shows name below photo) */}
          <div className="absolute inset-0 hidden sm:block" style={{ background: 'linear-gradient(to top, rgba(7,7,16,0.9) 0%, transparent 50%)' }} />
        </div>

        {/* Badges top-left — single most-relevant badge on mobile, full set on desktop */}
        <div className="absolute top-2.5 left-2.5 flex gap-1.5 flex-wrap z-10">
          {/* Mobile: only ONE badge, priority Disponible > Pro > Early Adopter */}
          <span className="sm:hidden">
            {p.isFlashActive ? (
              <span className="flex items-center gap-0.5 px-2 py-1 rounded-full text-[0.6rem] font-black"
                style={{ background: 'rgba(34,197,94,0.95)', color: '#fff' }}>
                <Zap size={9} fill="#fff" /> Disponible
              </span>
            ) : (p as any).hasPriorityBadge ? (
              <span className="flex items-center gap-0.5 px-2 py-1 rounded-full text-[0.6rem] font-black"
                style={{ background: 'rgba(37,99,235,0.95)', color: '#fff' }}>
                <BadgeCheck size={9} /> Prioridad
              </span>
            ) : isEarlyAdopter ? (
              <span className="flex items-center gap-0.5 px-2 py-1 rounded-full text-[0.6rem] font-black"
                style={{ background: 'rgba(96,165,250,0.95)', color: '#fff' }}>
                ⭐ Early
              </span>
            ) : isNew ? (
              <span className="flex items-center gap-0.5 px-2 py-1 rounded-full text-[0.6rem] font-black"
                style={{ background: 'rgba(212,175,55,0.95)', color: '#000' }}>
                Nuevo
              </span>
            ) : null}
          </span>
          {/* Desktop: full set */}
          {isEarlyAdopter && (
            <span className="hidden sm:flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[0.6rem] font-black"
              style={{ background: 'rgba(96,165,250,0.9)', color: '#000' }}>
              ⭐ Early Adopter
            </span>
          )}
          {!isEarlyAdopter && isNew && (
            <span className="hidden sm:flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[0.6rem] font-black"
              style={{ background: 'rgba(212,175,55,0.9)', color: '#000' }}>
              Nuevo
            </span>
          )}
          {p.topWeekend && (
            <span className="hidden sm:inline px-2 py-0.5 rounded-full text-[0.6rem] font-black"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>TOP WEEKEND</span>
          )}
          {(p as any).hasPriorityBadge && (
            <span className="hidden sm:flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[0.6rem] font-black"
              style={{ background: 'rgba(37,99,235,0.9)', color: '#fff' }}>
              <BadgeCheck size={9} /> Prioridad
            </span>
          )}
          {p.isFlashActive && (
            <span className="hidden sm:flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[0.6rem] font-black animate-pulse"
              style={{ background: 'rgba(34,197,94,0.9)', color: '#000' }}>
              <Zap size={9} fill="#000" /> Disponible
            </span>
          )}
          {p.role === 'bailarin' && (p as any).seekingDancePartner && (
            <span className="hidden sm:flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[0.6rem] font-black"
              style={{ background: 'rgba(212,175,55,0.9)', color: '#000' }}>
              <Users size={9} /> Busca pareja{(p as any).danceRole === 'lead' ? ' (leader)' : (p as any).danceRole === 'follow' ? ' (follower)' : ''}
            </span>
          )}
        </div>

        {/* Name + specialty overlaid — desktop only */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-3 hidden sm:block" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)' }}>
          <div className="flex items-end justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-black line-clamp-2 break-words" style={{ color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.5)', lineHeight: 1.2 }}>{p.name}</h3>
              {p.specialty && <p className="text-xs truncate sm:whitespace-normal" style={{ color: '#F5D77A' }}>{p.specialty}</p>}
            </div>
            {priceLabel && (
              <span className="text-sm font-black shrink-0" style={{ color: '#F5D77A' }}>{priceLabel}</span>
            )}
            {priceOnRequest && (
              <span className="text-xs font-bold shrink-0" style={{ color: '#F5D77A' }}>A consultar</span>
            )}
          </div>
        </div>
      </div>

      {/* Name + info below photo — mobile only */}
      <div className="px-3 pt-2.5 sm:hidden">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[0.95rem] font-bold leading-snug line-clamp-2 break-words min-w-0" style={{ fontFamily: 'Inter, sans-serif', color: '#111', letterSpacing: '-0.01em' }}>{p.name}</h3>
          {p.rating > 0 && (
            <span className="flex items-center gap-0.5 shrink-0 text-xs" style={{ color: '#111' }}>
              <Star size={11} style={{ color: '#111' }} fill="#111" />
              <span className="font-semibold">{p.rating}</span>
            </span>
          )}
        </div>
        <p className="text-xs truncate mt-0.5" style={{ color: '#717171' }}>
          {[p.location, p.badges?.[0] || p.specialty].filter(Boolean).join(' · ')}
        </p>
        {priceLabel && <p className="text-sm mt-1" style={{ color: '#111' }}><span className="font-bold">{priceLabel.split('€')[0]}€</span><span style={{ color: '#717171' }}>{priceLabel.includes('/') ? priceLabel.slice(priceLabel.indexOf('/')) : ''}</span></p>}
        {priceOnRequest && <p className="text-sm mt-1 font-bold" style={{ color: '#111' }}>A consultar</p>}
      </div>

      {/* ── CUERPO ── */}
      <div className="px-3 pb-3 pt-1 sm:p-3 flex flex-col flex-1 gap-2">

        {/* Rating + zona — desktop only (mobile shows it below photo) */}
        <div className="hidden sm:flex items-center gap-2 text-xs" style={{ color: '#3d3d4e' }}>
          {p.rating > 0 && (
            <span className="flex items-center gap-1">
              <Star size={11} style={{ color: '#8A6D0F' }} fill="#D4AF37" />
              <span className="font-bold" style={{ color: '#222' }}>{p.rating}</span>
              <span>({p.reviews})</span>
            </span>
          )}
          {p.zone && (
            <span className="flex items-center gap-1"><MapPin size={10} />{p.zone.split(',')[0]}</span>
          )}
        </div>

        {/* Descripción — desktop only */}
        {!compact && p.description && (
          <TruncatedDescription
            text={p.description}
            className="hidden sm:block text-xs leading-relaxed"
            style={{ color: '#333' }}
          />
        )}

        {/* Badges géneros — desktop only */}
        {p.badges.length > 0 && (
          <div className="hidden sm:flex flex-wrap gap-1">
            {p.badges.slice(0, 3).map(b => (
              <span key={b} className="text-[0.65rem] font-semibold px-1.5 py-0.5 rounded"
                style={{ background: 'rgba(212,175,55,0.08)', color: '#8A6D0F', border: '1px solid rgba(212,175,55,0.15)' }}>
                {b}
              </span>
            ))}
          </div>
        )}

        {/* Audio link — desktop only */}
        {isDJ && audioUrl && audioLabel && (
          <a href={audioUrl} target="_blank" rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold w-fit transition-all hover:scale-105"
            style={{ background: 'rgba(212,175,55,0.08)', color: '#8A6D0F', border: '1px solid rgba(212,175,55,0.2)' }}>
            <HearthisIcon size={12} /> {audioLabel}
          </a>
        )}

        {/* Portfolio — desktop only */}
        {showPortfolio && p.portfolioUrls && p.portfolioUrls.length > 0 && (
          <div className="hidden sm:grid grid-cols-3 gap-1">
            {p.portfolioUrls.slice(0, 3).map((url, i) => {
              const isVideo = /\.(mp4|webm|mov)$/i.test(url) || /youtube|vimeo|twitch/i.test(url);
              return isVideo ? (
                <div key={i} className="rounded-lg overflow-hidden aspect-square" style={{ background: 'rgba(0,0,0,0.4)' }}>
                  <video src={url} className="w-full h-full object-cover" muted loop playsInline
                    onMouseEnter={e => (e.target as HTMLVideoElement).play()}
                    onMouseLeave={e => { const v = e.target as HTMLVideoElement; v.pause(); v.currentTime = 0; }} />
                </div>
              ) : (
                <div key={i} className="rounded-lg overflow-hidden aspect-square" style={{ background: 'rgba(0,0,0,0.4)' }}>
                  <img src={url} alt="" loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={e => { (e.currentTarget.parentElement as HTMLElement).style.display = 'none'; }} />
                </div>
              );
            })}
          </div>
        )}

        {/* Rookie votes */}
        {isRookie && (
          <div onClick={e => e.stopPropagation()}>
            <VoteButton profileId={realProfileId ?? String(p.id)} voteCount={voteCount}
              hasVotedToday={hasVotedToday} category="rookie"
              onVoted={() => { setVoteCount(c => c + 1); setHasVotedToday(true); }} />
          </div>
        )}

        {/* CTAs */}
        <div className="mt-auto flex flex-col gap-2 pt-1">
          {/* Mobile: single primary CTA → opens profile (Airbnb-style card→detail) */}
          {onViewProfile && (
            <button type="button" onClick={() => onViewProfile(p)}
              className="sm:hidden w-full py-2.5 rounded-xl text-[0.8rem] font-bold transition-all active:scale-[0.98]"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              Ver perfil
            </button>
          )}

          {/* Desktop: full CTA set */}
          {onViewProfile && (
            <button type="button" onClick={() => onViewProfile(p)}
              className="hidden sm:block w-full py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000', boxShadow: '0 4px 15px rgba(212,175,55,0.25)' }}>
              Ver perfil completo →
            </button>
          )}

          <div className="hidden sm:flex gap-2">
            {currentUser.role === 'empresario' && (
              <button type="button" onClick={() => setShowContract(true)}
                className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105"
                style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)', color: '#8A6D0F' }}>
                <FileText size={11} /> Contrato
              </button>
            )}
            <button type="button"
              onClick={() => {
                if (!accepted) { setShowLegal(true); return; }
                if (onMessage && p.userId) onMessage(p.userId, p.name);
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105"
              style={{
                background: 'rgba(0,0,0,0.04)',
                border: '1px solid rgba(0,0,0,0.08)',
                color: '#222',
              }}>
              <MessageCircle size={13} />
              Contactar
            </button>
          </div>
        </div>
      </div>

      <LegalModal open={showLegal} onClose={() => setShowLegal(false)} onAccept={() => { setAccepted(true); localStorage.setItem('xpeak_norms_accepted', 'true'); }} />
      {showContract && <ContractModal professional={p} onClose={() => setShowContract(false)} />}
    </motion.div>
  );
};

export default ProfileCard;
