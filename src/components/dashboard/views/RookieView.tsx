import { useState, useEffect } from 'react';
import { Music, Award, Clock, CheckCircle, XCircle, AlertCircle, TrendingUp, Heart, Share2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import AudioUpload from '@/components/dashboard/AudioUpload';
import VoteButton from '@/components/dashboard/VoteButton';
import { toast } from 'sonner';

type ValidationStatus = 'pending' | 'approved' | 'rookie' | 'rejected' | 'awaiting_admin';

const statusConfig: Record<ValidationStatus, { label: string; color: string; icon: typeof CheckCircle; bg: string }> = {
  pending: { label: 'Pendiente de revisión', color: '#D4AF37', icon: Clock, bg: 'rgba(212,175,55,0.08)' },
  approved: { label: 'Aprobado PRO', color: '#22c55e', icon: CheckCircle, bg: 'rgba(34,197,94,0.08)' },
  rookie: { label: 'Promesa', color: '#D4AF37', icon: Award, bg: 'rgba(212,175,55,0.08)' },
  rejected: { label: 'Rechazado', color: '#ef4444', icon: XCircle, bg: 'rgba(239,68,68,0.08)' },
  awaiting_admin: { label: 'Esperando aprobación Admin', color: '#f59e0b', icon: AlertCircle, bg: 'rgba(245,158,11,0.08)' },
};

const milestones = [
  { votes: 50, label: 'Novato Prometedor', emoji: '🌱' },
  { votes: 150, label: 'En Ascenso', emoji: '🔥' },
  { votes: 300, label: 'Favorito del Público', emoji: '⭐' },
  { votes: 500, label: '¡Candidato a PRO!', emoji: '👑' },
];

/* ──────────────────── Public Card for non-rookies ──────────────────── */
const RookiePublicCard = ({ dj, userId }: { dj: any; userId: string | undefined }) => {
  const [voteCount, setVoteCount] = useState(0);
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
  const progress = Math.min((voteCount / 500) * 100, 100);

  return (
    <div className="glass-panel p-5 flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-lg overflow-hidden mb-3 flex items-center justify-center text-xl font-bold"
        style={{ background: photoUrl ? undefined : 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
        {photoUrl ? <img src={photoUrl} alt={dj.display_name} className="w-full h-full object-cover" /> : initials}
      </div>
      <p className="text-base font-bold truncate w-full">{dj.display_name || 'Sin nombre'}</p>
      <p className="text-sm text-muted-foreground truncate w-full">{dj.specialty || 'DJ'}</p>
      <p className="text-xs text-muted-foreground">{dj.zone || 'Madrid'}</p>
      <div className="w-full mt-3">
        <div className="flex items-center gap-2 mb-1">
          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #D4AF37, #22c55e)' }} />
          </div>
          <span className="text-xs font-bold" style={{ color: '#D4AF37' }}>{voteCount}/500</span>
        </div>
        <VoteButton profileId={dj.id} voteCount={voteCount} hasVotedToday={votedToday} category="rookie" />
      </div>
      <button
        onClick={() => {
          navigator.clipboard.writeText(`${window.location.origin}/dashboard?promesa=${dj.id}`);
          toast.success('Enlace copiado — compártelo para promocionar a este DJ');
        }}
        className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
        <Share2 size={12} /> Compartir
      </button>
    </div>
  );
};

/* ──────────────────── Main View ──────────────────── */
const RookieView = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [voteCount, setVoteCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isRookie, setIsRookie] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [featuredRookies, setFeaturedRookies] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      // Check admin
      const { data: adminRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();
      setIsAdmin(!!adminRole);

      // Own profile
      const { data: p } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      setProfile(p);

      // Check if user is rookie (free tier)
      const userIsRookie = p?.subscription_tier === 'free';
      setIsRookie(userIsRookie);

      if (p && userIsRookie) {
        const { data: vc } = await supabase.rpc('get_vote_count', { p_profile_id: p.id });
        setVoteCount(vc ?? 0);
      }

      // Load featured rookies (all free-tier profiles, excluding self)
      const { data: rookies } = await supabase
        .from('profiles')
        .select('*')
        .eq('subscription_tier', 'free')
        .neq('user_id', user.id)
        .limit(12);
      setFeaturedRookies(rookies || []);

      setLoading(false);
    };
    load();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-sm text-muted-foreground animate-pulse">Cargando panel Promesa...</div>
      </div>
    );
  }

  /* ── Non-rookie visitors: show public cards ── */
  if (!isRookie && !isAdmin) {
    return (
      <div className="animate-[fadeIn_0.4s_ease]">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-1">DJs <span className="text-gradient">Promesa</span></h2>
          <p className="text-sm text-muted-foreground">Descubre y apoya a los nuevos talentos de la escena. ¡Tu voto cuenta!</p>
        </div>

        {featuredRookies.length === 0 ? (
          <div className="glass-panel p-8 text-center">
            <Award size={32} style={{ color: '#D4AF37' }} className="mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Aún no hay DJs Promesa registrados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredRookies.map(dj => (
              <RookiePublicCard key={dj.id} dj={dj} userId={user?.id} />
            ))}
          </div>
        )}
      </div>
    );
  }

  /* ── Rookie / Admin: full stats dashboard ── */
  if (!profile) {
    return (
      <div className="glass-panel p-8 text-center">
        <Award size={32} style={{ color: '#D4AF37' }} className="mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">No se encontró tu perfil. Completa tu registro primero.</p>
      </div>
    );
  }

  const validationStatus: ValidationStatus = (profile as any).validation_status || 'pending';
  const status = statusConfig[validationStatus] || statusConfig.pending;
  const StatusIcon = status.icon;
  const progress = Math.min((voteCount / 500) * 100, 100);
  const currentMilestone = milestones.filter(m => voteCount >= m.votes).pop();
  const nextMilestone = milestones.find(m => voteCount < m.votes);

  const completionSteps = [
    { label: 'Perfil creado', done: true },
    { label: 'Foto de perfil', done: !!profile.photo_url && profile.photo_url.trim().length > 5 },
    { label: 'Especialidad definida', done: !!profile.specialty && profile.specialty.trim().length > 0 },
    { label: 'Instagram vinculado', done: !!profile.instagram && profile.instagram.trim().length > 0 },
    { label: 'Zona configurada', done: !!profile.zone && profile.zone.trim().length > 0 },
  ];
  const completionPct = Math.round((completionSteps.filter(s => s.done).length / completionSteps.length) * 100);

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">
          Panel <span className="text-gradient">Promesa</span>
        </h2>
        <p className="text-sm text-muted-foreground">Tu camino hacia el estatus PRO. Eres una de nuestras Promesas.</p>
      </div>

      {/* Featured Rookies */}
      {featuredRookies.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-bold mb-3" style={{ color: '#D4AF37' }}>🌟 Otros DJs Promesa</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {featuredRookies.slice(0, 3).map(dj => (
              <RookiePublicCard key={dj.id} dj={dj} userId={user?.id} />
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left column */}
        <div className="flex flex-col gap-4">
          {/* Validation Status */}
          <div className="glass-panel p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Estado de validación</h4>
            <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: status.bg, border: `1px solid ${status.color}22` }}>
              <StatusIcon size={20} style={{ color: status.color }} />
              <div>
                <p className="text-sm font-bold" style={{ color: status.color }}>{status.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {validationStatus === 'pending' && 'Tu perfil está siendo revisado por el equipo.'}
                  {validationStatus === 'rookie' && 'Consigue 500 votos de la comunidad para optar a PRO.'}
                  {validationStatus === 'approved' && '¡Enhorabuena! Tienes acceso completo.'}
                  {validationStatus === 'rejected' && 'Contacta soporte para más información.'}
                  {validationStatus === 'awaiting_admin' && 'Un administrador revisará tu solicitud pronto.'}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Completion - items cross out when done */}
          <div className="glass-panel p-5">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Perfil completo</h4>
              <span className="text-sm font-bold" style={{ color: '#D4AF37' }}>{completionPct}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden mb-4" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${completionPct}%`, background: 'linear-gradient(90deg, #D4AF37, #22c55e)' }} />
            </div>
            <div className="space-y-2.5">
              {completionSteps.map(step => (
                <div key={step.label} className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: step.done ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.05)',
                      border: `1.5px solid ${step.done ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.1)'}`,
                    }}>
                    {step.done && <CheckCircle size={12} style={{ color: '#22c55e' }} />}
                  </div>
                  <span className={`text-sm ${step.done ? 'line-through text-muted-foreground' : 'font-medium'}`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="glass-panel p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Resumen</h4>
            {[
              ['Rol', profile.role?.toUpperCase() || 'DJ'],
              ['Zona', profile.zone || 'Madrid'],
              ['Tarifa', `${profile.hourly_rate}€/h`],
              ['Plan', (profile.subscription_tier || 'free').toUpperCase()],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between py-2 text-sm" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <span className="text-muted-foreground">{k}</span>
                <span className="font-semibold">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Center column - Votes */}
        <div className="flex flex-col gap-4">
          <div className="glass-panel p-5">
            <div className="flex items-center gap-2 mb-4">
              <Heart size={16} style={{ color: '#D4AF37' }} />
              <h4 className="text-sm font-bold">Votos de la Comunidad</h4>
            </div>

            <div className="text-center py-6">
              <div className="text-5xl font-black" style={{ color: '#D4AF37' }}>{voteCount}</div>
              <div className="text-sm text-muted-foreground mt-1">de 500 votos necesarios</div>
            </div>

            <div className="h-3 rounded-full overflow-hidden mb-2" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #D4AF37, #22c55e)' }} />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mb-6">
              <span>0</span>
              <span>{Math.round(progress)}%</span>
              <span>500</span>
            </div>

            <div className="space-y-2">
              {milestones.map(m => {
                const reached = voteCount >= m.votes;
                return (
                  <div key={m.votes} className="flex items-center gap-3 p-2.5 rounded-lg transition-all"
                    style={{
                      background: reached ? 'rgba(212,175,55,0.06)' : 'transparent',
                      border: `1px solid ${reached ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.03)'}`,
                    }}>
                    <span className="text-lg">{m.emoji}</span>
                    <div className="flex-1">
                      <p className={`text-sm font-bold ${reached ? '' : 'text-muted-foreground'}`}>{m.label}</p>
                      <p className="text-xs text-muted-foreground">{m.votes} votos</p>
                    </div>
                    {reached && <CheckCircle size={14} style={{ color: '#22c55e' }} />}
                  </div>
                );
              })}
            </div>

            {currentMilestone && (
              <div className="mt-4 p-3 rounded-lg text-center" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}>
                <p className="text-xs text-muted-foreground">Nivel actual</p>
                <p className="text-sm font-bold" style={{ color: '#D4AF37' }}>{currentMilestone.emoji} {currentMilestone.label}</p>
              </div>
            )}

            {nextMilestone && (
              <p className="text-xs text-muted-foreground text-center mt-2">
                Siguiente: <span className="font-bold" style={{ color: '#D4AF37' }}>{nextMilestone.label}</span> — te faltan {nextMilestone.votes - voteCount} votos
              </p>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          <AudioUpload />

          <div className="glass-panel p-5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={14} style={{ color: '#D4AF37' }} />
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Consejos para crecer</h4>
            </div>
            <div className="space-y-3">
              {[
                { tip: 'Completa tu perfil al 100%', desc: 'Los perfiles completos reciben 3x más visitas.' },
                { tip: 'Sube una sesión de calidad', desc: 'Es obligatorio y demuestra tu nivel real.' },
                { tip: 'Comparte tu perfil', desc: 'Pide a tu comunidad que te vote en la plataforma.' },
                { tip: 'Mantente activo', desc: 'Los perfiles activos aparecen más arriba en el directorio.' },
                { tip: 'Conecta tus redes', desc: 'Instagram y teléfono generan confianza en los empresarios.' },
              ].map(t => (
                <div key={t.tip} className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <p className="text-sm font-semibold mb-0.5">{t.tip}</p>
                  <p className="text-xs text-muted-foreground">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RookieView;
