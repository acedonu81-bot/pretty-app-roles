import { useState } from 'react';
import { Star, MapPin, Clock, Instagram, Navigation, Radio, Heart, Award, CheckCircle, X, Shield } from 'lucide-react';
import { Profile, getWhatsAppLink, getInstagramLink, getLocationLink } from '@/data/profiles';
import GeometricAvatar from './GeometricAvatar';
import VoteButton from './VoteButton';
import LegalModal from '@/components/LegalModal';

const WhatsAppIcon = ({ size = 16 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
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
}

const ProfileCard = ({ profile: p, onBook, compact, showPortfolio }: ProfileCardProps) => {
  const isRookie = p.category === 'rookie';
  const [expanded, setExpanded] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [showLegal, setShowLegal] = useState(false);
  const voteCount = Math.floor(p.profileViews / 5);
  const progress = Math.min((voteCount / 500) * 100, 100);
  const currentMilestone = milestones.filter(m => voteCount >= m.votes).pop();
  const nextMilestone = milestones.find(m => voteCount < m.votes);

  const statusBadges: { label: string; bg: string; color: string; glow?: string }[] = [];
  if (p.isLive) statusBadges.push({ label: 'LIVE', bg: '#E53935', color: '#fff', glow: '0 2px 8px rgba(229,57,53,0.4)' });
  if (p.topWeekend) statusBadges.push({ label: 'TOP WEEKEND', bg: 'linear-gradient(90deg, #D4AF37, #B8941E)', color: '#000' });
  if (p.isPremium) statusBadges.push({ label: 'PREMIUM', bg: 'rgba(212,175,55,0.15)', color: '#D4AF37' });
  if (p.subscriptionTier === 'elite' && !p.isPremium) statusBadges.push({ label: 'ELITE', bg: 'rgba(212,175,55,0.1)', color: '#D4AF37' });
  if (isRookie) statusBadges.push({ label: 'PROMESA', bg: 'rgba(255,188,0,0.1)', color: '#ffbc00' });
  if (p.isFlashActive) statusBadges.push({ label: 'DISPONIBLE', bg: 'rgba(34,197,94,0.12)', color: '#22c55e' });

  return (
    <div
      className="glass-panel p-3 sm:p-5 flex flex-col transition-all hover:border-primary/20 duration-300 relative group cursor-pointer overflow-hidden"
      onClick={() => setExpanded(!expanded)}
    >
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
        <GeometricAvatar role={p.role as any} seed={p.id} size={48} isLive={p.isLive} />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold truncate">{p.name}</h3>
          <p className="text-xs text-muted-foreground">{p.specialty}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Star size={11} style={{ color: '#D4AF37' }} /> <span className="font-semibold text-foreground">{p.rating}</span> ({p.reviews})</span>
        <span className="flex items-center gap-1"><MapPin size={11} /> {p.zone}</span>
      </div>
      <div className="flex items-center gap-1 mb-2 text-xs text-muted-foreground">
        <Clock size={11} /> {p.experience}
      </div>

      {!compact && <p className="text-xs text-muted-foreground mb-3 flex-1 line-clamp-2">{p.description}</p>}

      <div className="flex flex-wrap gap-1 mb-3">
        {p.badges.map(b => (
          <span key={b} className="text-[0.6rem] font-medium px-2 py-0.5 rounded"
            style={{ background: 'rgba(212,175,55,0.08)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>
            {b}
          </span>
        ))}
      </div>

      {/* Portfolio section for creative roles */}
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
              {[1, 2, 3, 4].map(i => (
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

      {/* Social icons */}
      <div className="flex items-center gap-2 mb-3" onClick={e => e.stopPropagation()}>
        <a href={getInstagramLink(p.instagram)} target="_blank" rel="noopener noreferrer"
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
          style={{ background: 'rgba(212,175,55,0.08)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>
          <Instagram size={14} />
        </a>
        <a href={getLocationLink(p.zone)} target="_blank" rel="noopener noreferrer"
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
          style={{ background: 'rgba(212,175,55,0.08)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>
          <Navigation size={14} />
        </a>
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

      {/* Intermediation notice */}
      <div className="py-2 mb-2" onClick={e => e.stopPropagation()}>
        <p className="text-[0.55rem] text-muted-foreground italic text-center">
          XPEAK actúa estrictamente como intermediario entre profesionales y empresas. No existe relación laboral directa con la plataforma.
        </p>
      </div>

      {/* Acceptance checkbox */}
      <div className="mb-3 flex items-start gap-2" onClick={e => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={accepted}
          onChange={() => setAccepted(!accepted)}
          className="mt-0.5 accent-[#D4AF37] flex-shrink-0"
          id={`accept-${p.id}`}
        />
        <label htmlFor={`accept-${p.id}`} className="text-[0.55rem] text-muted-foreground leading-tight cursor-pointer">
          Acepto las{' '}
          <button onClick={(e) => { e.preventDefault(); setShowLegal(true); }} className="underline font-bold" style={{ color: '#D4AF37' }}>
            Normas de la Comunidad
          </button>{' '}
          y entiendo que XPEAK actúa solo como{' '}
          <button onClick={(e) => { e.preventDefault(); setShowLegal(true); }} className="underline font-bold" style={{ color: '#D4AF37' }}>
            intermediario
          </button>{' '}
          sin relación laboral.
        </label>
      </div>

      {/* Price + Contact CTA */}
      <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid var(--nightlife-border)' }}
        onClick={e => e.stopPropagation()}>
        <span className="text-base font-bold" style={{ color: '#D4AF37' }}>
          {['makeup', 'vestuario', 'media', 'design'].includes(p.role)
            ? 'A consultar'
            : <>€{p.price}<span className="text-xs text-muted-foreground font-normal">{p.priceUnit}</span></>
          }
        </span>
        <a
          href={accepted ? getWhatsAppLink(p.phone) : undefined}
          target={accepted ? '_blank' : undefined}
          rel={accepted ? 'noopener noreferrer' : undefined}
          onClick={e => { if (!accepted) e.preventDefault(); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs transition-all duration-200 ${
            accepted ? 'hover:scale-105 active:scale-95' : 'opacity-40 cursor-not-allowed'
          }`}
          style={{
            background: accepted ? 'linear-gradient(90deg, #25D366, #128C7E)' : 'rgba(255,255,255,0.1)',
            color: accepted ? 'white' : 'rgba(255,255,255,0.4)',
            boxShadow: accepted ? '0 2px 10px rgba(37,211,102,0.2)' : 'none',
          }}
        >
          <WhatsAppIcon size={16} />
          Contactar
        </a>
      </div>

      <LegalModal open={showLegal} onClose={() => setShowLegal(false)} />
    </div>
  );
};

export default ProfileCard;
