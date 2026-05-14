import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Star, Clock, Award, CheckCircle, X, MessageCircle, FileText } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Profile } from '@/data/profiles';
import GeometricAvatar from './GeometricAvatar';
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
  { votes: 300, label: 'Favorito del Público', color: '#D4AF37' },
  { votes: 500, label: '¡Candidato a PRO!', color: '#D4AF37' },
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
  const [expanded, setExpanded] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [showLegal, setShowLegal] = useState(false);
  const [showContract, setShowContract] = useState(false);
  // Real vote count from Supabase (only loaded for rookie profiles)
  const realProfileId = (p as any).userId ?? p.userId ?? null;
  const [voteCount, setVoteCount] = useState(0);
  const [hasVotedToday, setHasVotedToday] = useState(false);

  useEffect(() => {
    if (!isRookie || !realProfileId) return;
    // Count total votes for this profile
    supabase
      .from('votes' as any)
      .select('id', { count: 'exact', head: true })
      .eq('profile_id', realProfileId)
      .then(({ count }) => setVoteCount(count ?? 0));
    // Check if current user already voted
    if (currentUser.id) {
      supabase
        .from('votes' as any)
        .select('id')
        .eq('profile_id', realProfileId)
        .eq('voter_id', currentUser.id)
        .maybeSingle()
        .then(({ data }) => setHasVotedToday(!!data));
    }
  }, [isRookie, realProfileId, currentUser.id]);

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
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0); };

  const statusBadges: { label: string; bg: string; color: string; glow?: string }[] = [];
  if (p.isLive) statusBadges.push({ label: 'DISPONIBLE AHORA', bg: 'rgba(34,197,94,0.12)', color: '#22c55e', glow: '0 2px 8px rgba(34,197,94,0.2)' });
  if (p.topWeekend) statusBadges.push({ label: 'TOP WEEKEND', bg: 'linear-gradient(90deg, #D4AF37, #B8941E)', color: '#000' });
  if (isRookie) statusBadges.push({ label: 'PROMESA', bg: 'rgba(255,188,0,0.1)', color: '#ffbc00' });
  if (p.isFlashActive && !p.isLive) statusBadges.push({ label: 'DISPONIBLE', bg: 'rgba(34,197,94,0.12)', color: '#22c55e' });

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
      style={{}}
    >

      {statusBadges.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {statusBadges.map((b) => (
            <span key={b.label} className="text-[0.75rem] font-bold px-2 py-0.5 rounded-md tracking-wide inline-flex items-center gap-1"
              style={{
                background: b.bg,
                color: b.color,
                boxShadow: b.glow,
                border: b.bg.startsWith('rgba') ? `1px solid ${b.color}22` : undefined,
              }}>
              {b.label === 'DISPONIBLE AHORA' && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />}
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
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border border-black animate-pulse" />
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
        {p.rating > 0 && <span className="flex items-center gap-1"><Star size={11} style={{ color: '#D4AF37' }} /> <span className="font-semibold text-foreground">{p.rating}</span> ({p.reviews})</span>}
        <span className="text-muted-foreground">{p.zone}</span>
      </div>
      {p.experience && (
        <div className="flex items-center gap-1 mb-2 text-xs text-muted-foreground">
          <Clock size={11} /> {p.experience}
        </div>
      )}

      {!compact && <p className="hidden sm:block text-xs text-muted-foreground mb-3 flex-1 line-clamp-2">{p.description}</p>}

      <div className="flex flex-wrap gap-1 mb-3 overflow-hidden">
        {p.badges.slice(0, 3).map(b => (
          <span key={b} className="text-xs font-medium px-1.5 sm:px-2 py-0.5 rounded truncate max-w-[120px]"
            style={{ background: 'rgba(212,175,55,0.08)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>
            {b}
          </span>
        ))}
      </div>

      {p.languages && p.languages.length > 0 && (
        <div className="hidden sm:flex flex-wrap gap-1 mb-3">
          {p.languages.map(lang => (
            <span key={lang} className="text-xs font-medium px-1.5 py-0.5 rounded"
              style={{ background: 'rgba(255,255,255,0.04)', color: '#8E8EA0', border: '1px solid rgba(255,255,255,0.08)' }}>
              {lang}
            </span>
          ))}
        </div>
      )}

      {showPortfolio && (
        <div className="mb-3" onClick={e => e.stopPropagation()}>
          <p className="text-xs font-bold mb-2" style={{ color: '#D4AF37' }}>Portfolio</p>
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
                  <span className="text-[0.75rem] text-muted-foreground text-center px-2">Subir trabajo</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {isRookie && (
        <div className="mb-3" onClick={e => e.stopPropagation()}>
          <VoteButton
            profileId={realProfileId ?? String(p.id)}
            voteCount={voteCount}
            hasVotedToday={hasVotedToday}
            category="rookie"
            onVoted={() => { setVoteCount(c => c + 1); setHasVotedToday(true); }}
          />
        </div>
      )}

      {/* Platform links — DJs: audio platforms | Others: TikTok */}
      <div className="hidden sm:flex items-center gap-2 mb-3" onClick={e => e.stopPropagation()}>
        {isDJ && audioUrl && audioLabel && (
          <a href={audioUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105"
            style={{ background: 'rgba(212,175,55,0.08)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }}>
            <HearthisIcon size={12} /> {audioLabel}
          </a>
        )}
        {!isDJ && p.instagram && (
          <a href={`https://instagram.com/${p.instagram}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105"
            style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)' }}>
            Instagram
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
            <div className="text-xs text-muted-foreground">de 500 votos necesarios</div>
          </div>
          <div className="h-2 rounded-full overflow-hidden mb-2" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #D4AF37, #22c55e)' }} />
          </div>
          <div className="flex justify-between text-[0.7rem] text-muted-foreground mb-3">
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
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: reached ? m.color : 'rgba(255,255,255,0.1)' }} />
                  <div className="flex-1">
                    <p className={`text-xs font-bold ${reached ? '' : 'text-muted-foreground'}`}>{m.label}</p>
                    <p className="text-[0.7rem] text-muted-foreground">{m.votes} votos</p>
                  </div>
                  {reached && <CheckCircle size={10} style={{ color: '#22c55e' }} />}
                </div>
              );
            })}
          </div>
          {currentMilestone && (
            <div className="mt-3 p-2 rounded-lg text-center" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}>
              <p className="text-[0.7rem] text-muted-foreground">Nivel actual</p>
              <p className="text-xs font-bold" style={{ color: '#D4AF37' }}>{currentMilestone.label}</p>
            </div>
          )}
          {nextMilestone && (
            <p className="text-[0.7rem] text-muted-foreground text-center mt-2">
              Siguiente: <span className="font-bold" style={{ color: '#D4AF37' }}>{nextMilestone.label}</span> — faltan {nextMilestone.votes - voteCount} votos
            </p>
          )}
        </div>
      )}

      {/* Ver perfil button */}
      {onViewProfile && (
        <div className="mb-2" onClick={e => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => onViewProfile(p)}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95"
            style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
            Ver perfil completo →
          </button>
        </div>
      )}

      {/* Contrato row */}
      {currentUser.role === 'empresario' && (
        <div className="flex gap-2 mb-3" onClick={e => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => setShowContract(true)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all hover:scale-105"
            style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)', color: '#D4AF37' }}>
            <FileText size={12} /> Contrato
          </button>
        </div>
      )}

      <div className="hidden sm:block py-2 mb-2 px-2 rounded-lg" onClick={e => e.stopPropagation()}
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
        <p className="text-xs leading-relaxed text-center" style={{ color: 'rgba(255,255,255,0.35)' }}>
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
        <span className="text-sm sm:text-base font-bold" style={{ color: '#D4AF37' }}>
          {['makeup', 'vestuario', 'media', 'design'].includes(p.role)
            ? 'A consultar'
            : p.price > 0
              ? <>€{p.price}<span className="text-xs text-muted-foreground font-normal">{p.priceUnit}</span></>
              : 'A consultar'
          }
        </span>
        <button
          type="button"
          disabled={!accepted}
          onClick={() => {
            if (!accepted) return;
            if (onMessage && p.userId) onMessage(p.userId, p.name);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs transition-all duration-200 ${
            accepted ? 'hover:scale-105 active:scale-95' : 'opacity-40 cursor-not-allowed'
          }`}
          style={{
            background: accepted ? 'linear-gradient(90deg, #D4AF37, #B8941E)' : 'rgba(255,255,255,0.1)',
            color: accepted ? '#000' : 'rgba(255,255,255,0.4)',
            boxShadow: accepted ? '0 2px 10px rgba(212,175,55,0.2)' : 'none',
          }}
        >
          <MessageCircle size={15} />
          <span className="hidden sm:inline">Enviar mensaje</span>
        </button>
      </div>

      <LegalModal open={showLegal} onClose={() => setShowLegal(false)} />


      {/* Contract modal */}
      {showContract && (
        <ContractModal professional={p} onClose={() => setShowContract(false)} />
      )}
    </motion.div>
  );
};

export default ProfileCard;
