import { useState, useEffect } from 'react';
import { Music, Award, Clock, CheckCircle, XCircle, AlertCircle, TrendingUp, Heart, Share2, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import AudioUpload from '@/components/dashboard/AudioUpload';
import VoteButton from '@/components/dashboard/VoteButton';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

type ValidationStatus = 'pending' | 'approved' | 'rookie' | 'rejected' | 'awaiting_admin';

const statusConfig: Record<ValidationStatus, { label: string; color: string; icon: typeof CheckCircle; bg: string }> = {
  pending:        { label: 'Pendiente de revisión',        color: '#8A6D0F', icon: Clock,         bg: 'rgba(212,175,55,0.08)' },
  approved:       { label: 'Aprobado PRO',                 color: '#22c55e', icon: CheckCircle,   bg: 'rgba(34,197,94,0.08)'  },
  rookie:         { label: 'Promesa',                      color: '#8A6D0F', icon: Award,         bg: 'rgba(212,175,55,0.08)' },
  rejected:       { label: 'Rechazado',                    color: '#ef4444', icon: XCircle,       bg: 'rgba(239,68,68,0.08)'  },
  awaiting_admin: { label: 'Esperando aprobación Admin',   color: '#f59e0b', icon: AlertCircle,   bg: 'rgba(245,158,11,0.08)' },
};

const milestones = [
  { votes: 50,  label: 'Novato Prometedor',    color: '#6ee7b7' },
  { votes: 150, label: 'En Ascenso',           color: '#fbbf24' },
  { votes: 300, label: 'Favorito del Público', color: '#8A6D0F' },
  { votes: 500, label: '¡Candidato a PRO!',    color: '#8A6D0F' },
];

/* ──────────────────── Card pública de un DJ Promesa ──────────────────── */
const RookiePublicCard = ({ dj, userId }: { dj: any; userId: string | undefined }) => {
  const navigate = useNavigate();
  const [voteCount, setVoteCount] = useState<number | null>(null);
  const [votedToday, setVotedToday] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data: vc } = await supabase.rpc('get_vote_count', { p_profile_id: dj.id });
      setVoteCount(vc ?? 0);
      if (userId) {
        const { data: vt } = await supabase.rpc('has_voted_today', { p_voter_id: userId, p_profile_id: dj.id });
        setVotedToday(!!vt);
      }
    };
    load();
  }, [dj.id, userId]);

  const photoUrl = dj.photo_url && dj.photo_url.trim().length > 5 ? dj.photo_url : null;
  const initials = dj.display_name?.charAt(0)?.toUpperCase() || '?';
  const currentMilestone = voteCount !== null ? milestones.filter(m => voteCount >= m.votes).pop() : null;

  return (
    <div className="glass-panel p-4 flex flex-col gap-3 transition-all hover:border-amber-500/20">
      {/* Avatar + info */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center text-base font-bold relative"
          style={{ border: '1px solid rgba(212,175,55,0.35)', background: photoUrl ? undefined : 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
          {photoUrl ? <img src={photoUrl} alt={dj.display_name} className="w-full h-full object-cover" /> : initials}
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-black"
            style={{ background: '#D4AF37', boxShadow: '0 0 6px rgba(212,175,55,0.6)' }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold truncate">{dj.display_name || 'Sin nombre'}</p>
          <p className="text-xs text-muted-foreground truncate">{dj.specialty || 'DJ'}</p>
          <p className="text-xs text-muted-foreground">{dj.zone || 'España'}</p>
        </div>
      </div>

      {/* Milestone badge */}
      {currentMilestone && (
        <span className="self-start text-[0.65rem] font-bold px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(212,175,55,0.1)', color: '#8A6D0F', border: '1px solid rgba(212,175,55,0.2)' }}>
          {currentMilestone.label}
        </span>
      )}

      {/* Vote section */}
      <div className="mt-auto">
        {voteCount === null ? (
          <div className="h-8 bg-white/5 rounded-md animate-pulse" />
        ) : (
          <VoteButton
            profileId={dj.id}
            voteCount={voteCount}
            hasVotedToday={votedToday}
            category="rookie"
            onVoted={() => { setVoteCount(c => (c ?? 0) + 1); setVotedToday(true); }}
          />
        )}
      </div>

      {/* Actions row */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate(`/p/${dj.user_id}`)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105"
          style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
          <ExternalLink size={11} /> Ver perfil
        </button>
        <button
          onClick={() => {
            navigator.clipboard.writeText(`${window.location.origin}/p/${dj.user_id}`);
            toast.success('Enlace copiado');
          }}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs transition-all hover:scale-105"
          style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)', color: '#3d3d4e' }}>
          <Share2 size={11} />
        </button>
      </div>
    </div>
  );
};

/* ──────────────────── Vista principal ──────────────────── */
const RookieView = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isRookie, setIsRookie] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [voteCount, setVoteCount] = useState(0);
  const [rookies, setRookies] = useState<any[]>([]);
  const [myPanelOpen, setMyPanelOpen] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data: p } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      setProfile(p);

      const userIsRookie = p?.role === 'rookie';
      setIsRookie(userIsRookie);

      if (p && userIsRookie) {
        const { data: vc } = await supabase.rpc('get_vote_count', { p_profile_id: p.id });
        setVoteCount(vc ?? 0);
      }

      // Load DJ Promesa directory — role 'rookie' only
      const { data: allRookies } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'rookie')
        .neq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(24);
      setRookies(allRookies || []);

      setLoading(false);
    };
    load();
  }, [user]);

  if (loading) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-1">DJs <span className="text-gradient">Promesa</span></h2>
          <p className="text-sm text-muted-foreground">Descubre y apoya los nuevos talentos de la escena.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="glass-panel p-4 animate-pulse">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg bg-white/5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="h-3 bg-white/5 rounded mb-1.5 w-3/4" />
                  <div className="h-2 bg-white/5 rounded w-1/2" />
                </div>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full mb-3" />
              <div className="h-7 bg-white/5 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const validationStatus: ValidationStatus = (profile as any)?.validation_status || 'pending';
  const status = statusConfig[validationStatus] || statusConfig.pending;
  const StatusIcon = status.icon;
  const progress = Math.min((voteCount / 500) * 100, 100);
  const currentMilestone = milestones.filter(m => voteCount >= m.votes).pop();
  const nextMilestone = milestones.find(m => voteCount < m.votes);

  const completionSteps = [
    { label: 'Perfil creado',          done: true },
    { label: 'Foto de perfil',         done: !!profile?.photo_url && profile.photo_url.trim().length > 5 },
    { label: 'Especialidad definida',  done: !!profile?.specialty && profile.specialty.trim().length > 0 },
    { label: 'Instagram vinculado',    done: !!profile?.instagram && profile.instagram.trim().length > 0 },
    { label: 'Zona configurada',       done: !!profile?.zone && profile.zone.trim().length > 0 },
  ];
  const completionPct = Math.round((completionSteps.filter(s => s.done).length / completionSteps.length) * 100);

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">DJs <span className="text-gradient">Promesa</span></h2>
        <p className="text-sm text-muted-foreground">
          Descubre y apoya los nuevos talentos de la escena. Cada voto les acerca al estatus PRO.
        </p>
      </div>

      {/* ── Mi panel (solo si el usuario es promesa) ── */}
      {isRookie && (
        <div className="mb-6 glass-panel overflow-hidden"
          style={{ border: '1px solid rgba(212,175,55,0.2)' }}>
          <button
            onClick={() => setMyPanelOpen(!myPanelOpen)}
            className="w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(212,175,55,0.1)' }}>
                <Award size={15} style={{ color: '#8A6D0F' }} />
              </div>
              <div>
                <p className="text-sm font-bold">Mi progreso como Promesa</p>
                <p className="text-xs text-muted-foreground">{voteCount}/500 votos · {completionPct}% perfil completo</p>
              </div>
            </div>
            {myPanelOpen
              ? <ChevronUp size={16} style={{ color: '#3d3d4e' }} />
              : <ChevronDown size={16} style={{ color: '#3d3d4e' }} />}
          </button>

          {myPanelOpen && (
            <div className="border-t p-4 animate-[fadeIn_0.2s_ease]"
              style={{ borderColor: 'rgba(212,175,55,0.12)' }}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Estado y progreso */}
                <div className="space-y-3">
                  <div className="p-3 rounded-lg" style={{ background: status.bg, border: `1px solid ${status.color}22` }}>
                    <div className="flex items-center gap-2">
                      <StatusIcon size={16} style={{ color: status.color }} />
                      <p className="text-sm font-bold" style={{ color: status.color }}>{status.label}</p>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Perfil completo</span>
                      <span className="font-bold" style={{ color: '#8A6D0F' }}>{completionPct}%</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.05)' }}>
                      <div className="h-full rounded-full" style={{ width: `${completionPct}%`, background: 'linear-gradient(90deg,#D4AF37,#22c55e)' }} />
                    </div>
                    <div className="mt-2 space-y-1.5">
                      {completionSteps.map(step => (
                        <div key={step.label} className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ background: step.done ? 'rgba(34,197,94,0.15)' : 'rgba(0,0,0,0.05)', border: `1.5px solid ${step.done ? 'rgba(34,197,94,0.4)' : 'rgba(0,0,0,0.08)'}` }}>
                            {step.done && <CheckCircle size={10} style={{ color: '#22c55e' }} />}
                          </div>
                          <span className={`text-xs ${step.done ? 'line-through text-muted-foreground' : ''}`}>{step.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Votos */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Heart size={14} style={{ color: '#8A6D0F' }} />
                    <p className="text-xs font-bold">Votos de la Comunidad</p>
                  </div>
                  <div className="text-center py-3">
                    <div className="text-4xl font-black" style={{ color: '#8A6D0F' }}>{voteCount}</div>
                    <div className="text-xs text-muted-foreground">de 500 necesarios</div>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden mb-2" style={{ background: 'rgba(0,0,0,0.05)' }}>
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${progress}%`, background: 'linear-gradient(90deg,#D4AF37,#22c55e)' }} />
                  </div>
                  <div className="space-y-1.5 mt-3">
                    {milestones.map(m => {
                      const reached = voteCount >= m.votes;
                      return (
                        <div key={m.votes} className="flex items-center gap-2 p-1.5 rounded"
                          style={{ background: reached ? 'rgba(212,175,55,0.06)' : 'transparent' }}>
                          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: reached ? (m as any).color : 'rgba(0,0,0,0.09)' }} />
                          <p className={`text-xs flex-1 ${reached ? 'font-bold' : 'text-muted-foreground'}`}>{m.label}</p>
                          <span className="text-xs text-muted-foreground">{m.votes}v</span>
                          {reached && <CheckCircle size={11} style={{ color: '#22c55e' }} />}
                        </div>
                      );
                    })}
                  </div>
                  {nextMilestone && (
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      Siguiente: <span className="font-bold" style={{ color: '#8A6D0F' }}>{nextMilestone.label}</span> — faltan {nextMilestone.votes - voteCount} votos
                    </p>
                  )}
                  {currentMilestone && (
                    <div className="mt-2 p-2 rounded text-center" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}>
                      <p className="text-xs font-bold" style={{ color: '#8A6D0F' }}>{currentMilestone.label}</p>
                    </div>
                  )}
                </div>

                {/* Subir sesión + consejos */}
                <div className="space-y-3">
                  <AudioUpload />
                  <div className="glass-panel p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp size={12} style={{ color: '#8A6D0F' }} />
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Consejos</p>
                    </div>
                    <div className="space-y-2">
                      {[
                        'Completa tu perfil al 100%',
                        'Sube una sesión de calidad',
                        'Comparte tu enlace de votación',
                        'Conecta Instagram y teléfono',
                      ].map(tip => (
                        <p key={tip} className="text-xs text-muted-foreground flex items-start gap-1.5">
                          <span style={{ color: '#8A6D0F', flexShrink: 0 }}>›</span> {tip}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Directorio de DJs Promesa ── */}
      {rookies.length === 0 ? (
        <div className="glass-panel p-10 flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.1)' }}>
            <Award size={22} style={{ color: 'rgba(212,175,55,0.35)' }} />
          </div>
          <p className="text-sm font-bold">Sé el primero en la escena</p>
          <p className="text-xs text-muted-foreground max-w-[280px] mx-auto leading-relaxed">
            Aún no hay DJs Promesa registrados. Cuando un DJ se una con plan gratuito aparecerá aquí para recibir votos de la comunidad.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-muted-foreground">
              <span className="font-bold" style={{ color: '#8A6D0F' }}>{rookies.length}</span> DJs Promesa en la plataforma
            </p>
            <p className="text-xs text-muted-foreground">Más recientes primero</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {rookies.map(dj => (
              <RookiePublicCard key={dj.id} dj={dj} userId={user?.id} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RookieView;
