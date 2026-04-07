import { useState, useRef } from 'react';
import { Star, Clock, Radio, Award, CheckCircle, X, Lock, MessageCircle } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Profile } from '@/data/profiles';
import GeometricAvatar from './GeometricAvatar';
import VoteButton from './VoteButton';
import LegalModal from '@/components/LegalModal';
import FanSubscribeButton from './FanSubscribeButton';
import UpgradeModal from './UpgradeModal';
import { useProfile } from '@/hooks/useProfile';

const TikTokIcon = ({ size = 14 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/>
  </svg>
);

const HearthisIcon = ({ size = 14 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
  </svg>
);

const milestones = [
  { votes: 50, label: 'Novato Prometedor', emoji: '🌱' },
  { votes: 150, label: 'En Ascenso', emoji: '🔥' },
  { votes: 300, label: 'Favorito del Público', emoji: '⭐' },
  { votes: 500, label: '¡Candidato a PRO!', emoji: '👑' },
];

interface ProfileCardProps {
  profile: Profile;
  onBook?: (profile: Profile) => void;
  compact?: boolean;
  showPortfolio?: boolean;
  onMessage?: (userId: string, name: string) => void;
  onNavigateSubscription?: () => void;
}

const ProfileCard = ({ profile: p, onBook, compact, showPortfolio, onMessage, onNavigateSubscription }: ProfileCardProps) => {
  const currentUser = useProfile();
  const canSeePrice = currentUser.role === 'empresario' || currentUser.subscription_tier !== 'free';
  const isRookie = p.category === 'rookie';
  const isPremiumCard = p.subscriptionTier === 'elite' || p.subscriptionTier === 'premium' || p.subscriptionTier === 'business' || p.subscriptionTier === 'agency';
  const isCurrentUserFree = currentUser.subscription_tier === 'free';
  const [expanded, setExpanded] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [showLegal, setShowLegal] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const voteCount = Math.floor(p.profileViews / 5);
  const progress = Math.min((voteCount / 500) * 100, 100);
  const currentMilestone = milestones.filter(m => voteCount >= m.votes).pop();
  const nextMilestone = milestones.find(m => voteCount < m.votes);

  // Tilt effect — only for premium/elite
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPremiumCard || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0); };

  // Map subscription tier to display label
  const tierLabel =
    p.subscriptionTier === 'elite' || p.subscriptionTier === 'agency'
      ? 'AGENCIA'
      : p.subscriptionTier === 'premium' || p.subscriptionTier === 'business'
        ? 'BUSINESS'
        : p.subscriptionTier === 'starter'
          ? 'STARTER'
          : null;

  const statusBadges: { label: string; bg: string; color: string; glow?: string }[] = [];
  if (p.isLive) statusBadges.push({ label: 'LIVE', bg: '#E53935', color: '#fff', glow: '0 2px 8px rgba(229,57,53,0.4)' });
  if (p.topWeekend) statusBadges.push({ label: 'TOP WEEKEND', bg: 'linear-gradient(90deg, #D4AF37, #B8941E)', color: '#000' });
  if (tierLabel === 'AGENCIA') statusBadges.push({ label: 'AGENCIA', bg: 'linear-gradient(90deg,rgba(212,175,55,0.2),rgba(184,148,30,0.2))', color: '#D4AF37', glow: '0 0 8px rgba(212,175,55,0.15)' });
  else if (tierLabel === 'BUSINESS') statusBadges.push({ label: 'BUSINESS', bg: 'rgba(212,175,55,0.12)', color: '#D4AF37' });
  else if (tierLabel === 'STARTER') statusBadges.push({ label: 'STARTER', bg: 'rgba(168,197,218,0.12)', color: '#A8C5DA' });
  if (isRookie) statusBadges.push({ label: 'PROMESA', bg: 'rgba(255,188,0,0.1)', color: '#ffbc00' });
  if (p.isFlashActive) statusBadges.push({ label: 'DISPONIBLE', bg: 'rgba(34,197,94,0.12)', color: '#22c55e' });

  // Social/platform links
  const isDJ = p.role === 'dj' || p.role === 'rookie';
  const audioUrl = (p as any).audio_embed_url || p.streamUrl;
  const audioLabel = audioUrl
    ? audioUrl.includes('mixcloud') ? 'Mixcloud'
    : audioUrl.includes('soundcloud') ? 'SoundCloud'
    : audioUrl.includes('hearthis') ? 'hearthis.at'
    : null
    : null;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="glass-panel p-3 sm:p-5 flex flex-col transition-all duration-300 relative group cursor-pointer overflow-hidden"
      onClick={() => setExpanded(!expanded)}
      style={{
        ...(isPremiumCard ? { rotateX, rotateY, transformStyle: 'preserve-3d', transformPerspective: 800 } : {}),
        ...(isPremiumCard ? {
          border: p.subscriptionTier === 'elite'
            ? '1px solid rgba(212,175,55,0.35)'
            : '1px solid rgba(212,175,55,0.18)',
          boxShadow: p.subscriptionTier === 'elite'
            ? '0 0 24px rgba(212,175,55,0.08), inset 0 0 0 1px rgba(212,175,55,0.05)'
            : '0 0 12px rgba(212,175,55,0.04)',
        } : {}),
      }}
    >
      {/* Elite shimmer top bar */}
      {p.subscriptionTier === 'elite' && (
        <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl"
          style={{ background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)' }} />
      )}

      {/* Premium animated shimmer sweep */}
      {isPremiumCard && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl" style={{ zIndex: 1 }}>
          <motion.div
            className="absolute top-0 bottom-0 w-1/2"
            style={{
              background: p.subscriptionTier === 'elite' || p.subscriptionTier === 'agency'
                ? 'linear-gradient(90deg, transparent, rgba(212,175,55,0.07), transparent)'
                : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)',
            }}
            animate={{ x: ['-100%', '350%'] }}
            transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 4, ease: 'easeInOut' }}
          />
        </div>
      )}

      {/* Agency/Elite pulsing corner accent */}
      {(p.subscriptionTier === 'elite' || p.subscriptionTier === 'agency') && (
        <motion.div
          className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full"
          style={{ background: '#D4AF37', boxShadow: '0 0 6px rgba(212,175,55,0.8)', zIndex: 2 }}
          animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {statusBadges.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {statusBadges.map((b) => (
            <span key={b.label} className="text-[0.55rem] font-bold px-2 py-0.5 rounded-md tracking-wide inline-flex items-center gap-1"
              style={{
                background: b.bg,
                color: b.color,
                boxShadow: b.glow,
                border: b.bg.startsWith('rgba') ? `1px solid ${b.color}22` : undefined,
              }}>
              {b.label === 'LIVE' && <Radio size={8} className="animate-pulse" />}
              {b.label === 'DISPONIBLE' && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />}
              {b.label}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3 mb-3">
        {p.photo && p.photo.length > 5 ? (
          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 relative">
            <img src={p.photo} alt={p.name} className="w-full h-full object-cover" crossOrigin="anonymous"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            {p.isLive && (
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-red-500 border border-black animate-pulse" />
            )}
          </div>
        ) : (
          <GeometricAvatar role={p.role as any} seed={p.id} size={48} isLive={p.isLive} />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <h3 className="text-sm font-bold truncate max-w-full">{p.name}</h3>
            {(p as any).isVerified && (
              <svg viewBox="0 0 24 24" width={13} height={13} fill="#D4AF37" title="Verificado">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#D4AF37" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate max-w-full">{p.specialty}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Star size={11} style={{ color: '#D4AF37' }} /> <span className="font-semibold text-foreground">{p.rating}</span> ({p.reviews})</span>
        <span className="text-muted-foreground">{p.zone}</span>
      </div>
      <div className="flex items-center gap-1 mb-2 text-xs text-muted-foreground">
        <Clock size={11} /> {p.experience}
      </div>

      {!compact && <p className="text-xs text-muted-foreground mb-3 flex-1 line-clamp-2">{p.description}</p>}

      <div className="flex flex-wrap gap-1 mb-3 overflow-hidden">
        {p.badges.slice(0, 3).map(b => (
          <span key={b} className="text-[0.6rem] font-medium px-1.5 sm:px-2 py-0.5 rounded truncate max-w-[120px]"
            style={{ background: 'rgba(212,175,55,0.08)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>
            {b}
          </span>
        ))}
      </div>

      {p.languages && p.languages.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {p.languages.map(lang => (
            <span key={lang} className="text-[0.6rem] font-medium px-1.5 py-0.5 rounded"
              style={{ background: 'rgba(255,255,255,0.04)', color: '#8E8EA0', border: '1px solid rgba(255,255,255,0.08)' }}>
              {lang}
            </span>
          ))}
        </div>
      )}

      {showPortfolio && (
        <div className="mb-3" onClick={e => e.stopPropagation()}>
          <p className="text-[0.65rem] font-bold mb-2" style={{ color: '#D4AF37' }}>Portfolio</p>
          {p.portfolioUrls && p.portfolioUrls.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {p.portfolioUrls.map((url, i) => {
                const isVideo = /\.(mp4|webm|mov)$/i.test(url) || /youtube|vimeo|twitch/i.test(url);
                return isVideo ? (
                  <div key={i} className="rounded-lg overflow-hidden aspect-video" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(212,175,55,0.1)' }}>
                    <video src={url} className="w-full h-full object-cover" muted loop playsInline
                      onMouseEnter={e => (e.target as HTMLVideoElement).play()}
                      onMouseLeave={e => { const v = e.target as HTMLVideoElement; v.pause(); v.currentTime = 0; }} />
                  </div>
                ) : (
                  <div key={i} className="rounded-lg overflow-hidden aspect-square" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(212,175,55,0.1)' }}>
                    <img src={url} alt={`${p.name} trabajo ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {[1,2,3,4].map(i => (
                <div key={i} className="rounded-lg aspect-square flex items-center justify-center"
                  style={{ background: 'rgba(212,175,55,0.04)', border: '1px dashed rgba(212,175,55,0.15)' }}>
                  <span className="text-[0.55rem] text-muted-foreground text-center px-2">Subir trabajo</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {isRookie && (
        <div className="mb-3" onClick={e => e.stopPropagation()}>
          <VoteButton profileId={String(p.id)} voteCount={voteCount} hasVotedToday={false} category="rookie" />
        </div>
      )}

      {/* Platform links — DJs: audio platforms | Others: TikTok */}
      <div className="flex items-center gap-2 mb-3" onClick={e => e.stopPropagation()}>
        {isDJ && audioUrl && audioLabel && (
          <a href={audioUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[0.6rem] font-bold transition-all hover:scale-105"
            style={{ background: 'rgba(212,175,55,0.08)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }}>
            <HearthisIcon size={12} /> {audioLabel}
          </a>
        )}
        {!isDJ && p.tiktok && (
          <a href={`https://tiktok.com/@${p.tiktok}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[0.6rem] font-bold transition-all hover:scale-105"
            style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <TikTokIcon size={12} /> TikTok
          </a>
        )}
      </div>

      {/* Expanded Rookie detail panel */}
      {expanded && isRookie && (
        <div className="mt-2 p-4 rounded-lg animate-[fadeIn_0.3s_ease]" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.15)' }}
          onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Award size={14} style={{ color: '#D4AF37' }} />
              <span className="text-xs font-bold" style={{ color: '#D4AF37' }}>Panel Promesa</span>
            </div>
            <button onClick={() => setExpanded(false)} className="p-1 rounded hover:bg-white/5">
              <X size={12} className="text-muted-foreground" />
            </button>
          </div>
          <div className="text-center py-3">
            <div className="text-3xl font-black" style={{ color: '#D4AF37' }}>{voteCount}</div>
            <div className="text-[0.6rem] text-muted-foreground">de 500 votos necesarios</div>
          </div>
          <div className="h-2 rounded-full overflow-hidden mb-2" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #D4AF37, #22c55e)' }} />
          </div>
          <div className="flex justify-between text-[0.5rem] text-muted-foreground mb-3">
            <span>0</span><span>{Math.round(progress)}%</span><span>500</span>
          </div>
          <div className="space-y-1.5">
            {milestones.map(m => {
              const reached = voteCount >= m.votes;
              return (
                <div key={m.votes} className="flex items-center gap-2 p-1.5 rounded-lg"
                  style={{
                    background: reached ? 'rgba(212,175,55,0.06)' : 'transparent',
                    border: `1px solid ${reached ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.03)'}`,
                  }}>
                  <span className="text-sm">{m.emoji}</span>
                  <div className="flex-1">
                    <p className={`text-[0.6rem] font-bold ${reached ? '' : 'text-muted-foreground'}`}>{m.label}</p>
                    <p className="text-[0.5rem] text-muted-foreground">{m.votes} votos</p>
                  </div>
                  {reached && <CheckCircle size={10} style={{ color: '#22c55e' }} />}
                </div>
              );
            })}
          </div>
          {currentMilestone && (
            <div className="mt-3 p-2 rounded-lg text-center" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}>
              <p className="text-[0.5rem] text-muted-foreground">Nivel actual</p>
              <p className="text-xs font-bold" style={{ color: '#D4AF37' }}>{currentMilestone.emoji} {currentMilestone.label}</p>
            </div>
          )}
          {nextMilestone && (
            <p className="text-[0.5rem] text-muted-foreground text-center mt-2">
              Siguiente: <span className="font-bold" style={{ color: '#D4AF37' }}>{nextMilestone.label}</span> — faltan {nextMilestone.votes - voteCount} votos
            </p>
          )}
        </div>
      )}

      <div className="mb-3" onClick={e => e.stopPropagation()}>
        <FanSubscribeButton profileId={String(p.id)} professionalName={p.name} />
      </div>

      <div className="py-2 mb-2 px-2 rounded-lg" onClick={e => e.stopPropagation()}
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
        <p className="text-[0.65rem] leading-relaxed text-center" style={{ color: 'rgba(255,255,255,0.35)' }}>
          XPEAK actúa como intermediario. Sin relación laboral con la plataforma.
        </p>
      </div>

      <div className="mb-3 flex items-start gap-2 p-2.5 rounded-lg" onClick={e => e.stopPropagation()}
        style={{ background: accepted ? 'rgba(212,175,55,0.04)' : 'transparent', border: `1px solid ${accepted ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.05)'}`, transition: 'all 0.2s' }}>
        <input type="checkbox" checked={accepted} onChange={() => setAccepted(!accepted)}
          className="mt-0.5 accent-[#D4AF37] flex-shrink-0" id={`accept-${p.id}`} />
        <label htmlFor={`accept-${p.id}`} className="text-xs text-muted-foreground leading-snug cursor-pointer break-words">
          Acepto las{' '}
          <button onClick={(e) => { e.preventDefault(); setShowLegal(true); }} className="underline font-semibold" style={{ color: '#D4AF37' }}>
            Normas de la Comunidad
          </button>{' '}
          y entiendo que XPEAK actúa solo como{' '}
          <button onClick={(e) => { e.preventDefault(); setShowLegal(true); }} className="underline font-semibold" style={{ color: '#D4AF37' }}>
            intermediario
          </button>{' '}
          sin relación laboral.
        </label>
      </div>

      <div className="flex items-center justify-between pt-3 gap-2 flex-wrap" style={{ borderTop: '1px solid var(--nightlife-border)' }}
        onClick={e => e.stopPropagation()}>
        <span className="text-sm sm:text-base font-bold whitespace-nowrap" style={{ color: '#D4AF37' }}>
          {['makeup', 'vestuario', 'media', 'design'].includes(p.role)
            ? 'A consultar'
            : canSeePrice
              ? <>€{p.price}<span className="text-xs text-muted-foreground font-normal">{p.priceUnit}</span></>
              : <span className="flex items-center gap-1 text-xs font-medium" style={{ color: '#555' }}><Lock size={11} /> Tarifa privada</span>
          }
        </span>
        <button
          type="button"
          disabled={!accepted}
          onClick={() => {
            if (!accepted) return;
            if (isCurrentUserFree) { setShowUpgrade(true); return; }
            if (onMessage && p.userId) onMessage(p.userId, p.name);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs transition-all duration-200 ${
            accepted ? 'hover:scale-105 active:scale-95' : 'opacity-40 cursor-not-allowed'
          }`}
          style={{
            background: accepted
              ? isCurrentUserFree
                ? 'rgba(212,175,55,0.12)'
                : 'linear-gradient(90deg, #D4AF37, #B8941E)'
              : 'rgba(255,255,255,0.1)',
            color: accepted ? (isCurrentUserFree ? '#D4AF37' : '#000') : 'rgba(255,255,255,0.4)',
            border: accepted && isCurrentUserFree ? '1px solid rgba(212,175,55,0.3)' : 'none',
            boxShadow: accepted && !isCurrentUserFree ? '0 2px 10px rgba(212,175,55,0.2)' : 'none',
          }}
        >
          <MessageCircle size={15} />
          {isCurrentUserFree ? (
            <span className="flex items-center gap-1">Enviar mensaje <Lock size={10} /></span>
          ) : 'Enviar mensaje'}
        </button>

        <UpgradeModal
          open={showUpgrade}
          onClose={() => setShowUpgrade(false)}
          role={currentUser.role}
          trigger="Para enviar mensajes a profesionales necesitas un plan de pago."
          onNavigateSubscription={onNavigateSubscription}
        />
      </div>

      <LegalModal open={showLegal} onClose={() => setShowLegal(false)} />
    </motion.div>
  );
};

export default ProfileCard;
