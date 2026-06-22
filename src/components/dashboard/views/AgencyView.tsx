import { useState, useEffect } from 'react';
import { Building2, Users, Zap, Heart, TrendingUp, Radio, Star, BarChart3, RefreshCw, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import GeometricAvatar from '@/components/dashboard/GeometricAvatar';

const ROLE_ES: Record<string, string> = {
  dj: 'DJ / Artista', rookie: 'DJ Promesa', staff: 'Staff', event_manager: 'Encargada Eventos',
  promotor: 'Promotor', camarero: 'Camarero', catering: 'Catering',
  makeup: 'Maquillaje', media: 'Media / Foto', empresario: 'Empresario',
};

const ROLE_COLOR: Record<string, string> = {
  dj: '#4285F4', rookie: '#FBBF24', staff: '#34D399', event_manager: '#34D399',
  promotor: '#38BDF8', camarero: '#FB923C', catering: '#F472B6',
  makeup: '#F472B6', media: '#A78BFA', empresario: '#D4AF37',
};

interface ProfileStat {
  id: string;
  display_name: string;
  role: string;
  photo_url: string | null;
  zone: string | null;
  hourly_rate: number;
  is_live: boolean;
  is_primary: boolean;
  flashCount: number;
  flashPending: number;
  fanCount: number;
  voteCount: number;
  flashRevenue: number;
}

const AgencyView = () => {
  const { user } = useAuth();
  const { allProfiles, subscription_tier, switchProfile, profileId } = useProfile();
  const [stats, setStats] = useState<ProfileStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [switching, setSwitching] = useState<string | null>(null);

  const isAgency = subscription_tier === 'agency' || subscription_tier === 'elite';

  useEffect(() => {
    if (!user || !isAgency || allProfiles.length === 0) { setLoading(false); return; }
    loadStats();
  }, [user, allProfiles, isAgency]);

  const loadStats = async () => {
    setLoading(true);
    const profileIds = allProfiles.map(p => p.id);

    const [flashRes, fanRes] = await Promise.all([
      supabase.from('flash_bookings').select('professional_user_id, status, agreed_price').eq('professional_user_id', user!.id),
      supabase.from('fan_subscriptions').select('professional_profile_id, status').in('professional_profile_id', profileIds).eq('status', 'active'),
    ]);

    const flashRows = flashRes.data ?? [];
    const fanRows = fanRes.data ?? [];

    // vote counts per profile
    const voteCounts: Record<string, number> = {};
    await Promise.all(
      allProfiles
        .filter(p => p.role === 'rookie')
        .map(async p => {
          const { data } = await supabase.rpc('get_vote_count', { p_profile_id: p.id });
          voteCounts[p.id] = data ?? 0;
        })
    );

    const result: ProfileStat[] = allProfiles.map(p => {
      const pFlash = flashRows.filter(f => f.professional_user_id === user!.id);
      const pFans = fanRows.filter(f => f.professional_profile_id === p.id);
      return {
        id: p.id,
        display_name: p.display_name,
        role: p.role,
        photo_url: p.photo_url,
        zone: null,
        hourly_rate: 0,
        is_live: false,
        is_primary: p.is_primary,
        flashCount: pFlash.length,
        flashPending: pFlash.filter(f => f.status === 'pending').length,
        fanCount: pFans.length,
        voteCount: voteCounts[p.id] ?? 0,
        flashRevenue: pFlash.reduce((s, f) => s + (f.agreed_price ?? 0), 0),
      };
    });

    // enrich with zone + is_live + hourly_rate
    const { data: fullProfiles } = await supabase
      .from('profiles')
      .select('id, zone, is_live, hourly_rate')
      .in('id', profileIds);
    (fullProfiles ?? []).forEach((fp: any) => {
      const s = result.find(r => r.id === fp.id);
      if (s) { s.zone = fp.zone; s.is_live = fp.is_live; s.hourly_rate = fp.hourly_rate; }
    });

    setStats(result);
    setLoading(false);
  };

  const handleSwitch = async (id: string) => {
    setSwitching(id);
    await switchProfile(id);
    setSwitching(null);
    toast.success('Perfil activo cambiado');
  };

  // ── Agency check — show info if not agency tier ──
  if (!isAgency) {
    return (
      <div className="animate-[fadeIn_0.4s_ease]">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-1">Panel de <span className="text-gradient">Agencia</span></h2>
          <p className="text-sm text-muted-foreground">Gestión centralizada de hasta 5 perfiles profesionales.</p>
        </div>
        <div className="glass-panel p-10 flex flex-col items-center text-center gap-5"
          style={{ border: '1px solid rgba(212,175,55,0.2)' }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
            <Building2 size={28} />
          </div>
          <div>
            <p className="text-lg font-black mb-1">Panel de Agencia</p>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
              El Panel de Agencia permite gestionar hasta 5 perfiles con roles distintos desde un único punto de control. KPIs consolidados, cambio de perfil instantáneo y Sello Agencia exclusivo.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
            {['5 perfiles activos', 'KPIs consolidados', 'Sello Agencia'].map(f => (
              <div key={f} className="p-3 rounded-xl text-center text-xs font-bold"
                style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.12)', color: '#D4AF37' }}>
                {f}
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">Contacta con el equipo de XPEAK para activar el acceso de agencia.</p>
        </div>
      </div>
    );
  }

  // ── KPI agregados ──
  const totalFlash = stats.reduce((s, p) => s + p.flashCount, 0);
  const totalPending = stats.reduce((s, p) => s + p.flashPending, 0);
  const totalFans = stats.reduce((s, p) => s + p.fanCount, 0);
  const totalRevenue = stats.reduce((s, p) => s + p.flashRevenue, 0);
  const liveCount = stats.filter(p => p.is_live).length;
  const topProfile = [...stats].sort((a, b) => b.flashCount - a.flashCount)[0];

  return (
    <div className="animate-[fadeIn_0.4s_ease] space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">Panel de <span className="text-gradient">Agencia</span></h2>
          <p className="text-sm text-muted-foreground">
            {allProfiles.length} perfiles activos · Gestión centralizada
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Agency badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold"
            style={{ background: 'linear-gradient(90deg,rgba(212,175,55,0.15),rgba(184,148,30,0.1))', border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37' }}>
            <Building2 size={12} /> SELLO AGENCIA
          </div>
          <button onClick={loadStats} className="p-2 rounded-lg transition-all hover:scale-105"
            style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)' }}>
            <RefreshCw size={13} style={{ color: '#3d3d4e' }} />
          </button>
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Flash Bookings', value: loading ? '—' : totalFlash, sub: `${totalPending} pendientes`, icon: <Zap size={16} />, color: '#D4AF37' },
          { label: 'Fans activos', value: loading ? '—' : totalFans, sub: 'en todos los perfiles', icon: <Heart size={16} />, color: '#22c55e' },
          { label: 'Ingresos registrados', value: loading ? '—' : `€${totalRevenue.toFixed(0)}`, sub: 'caché acordado total', icon: <TrendingUp size={16} />, color: '#4285F4' },
          { label: 'En directo ahora', value: loading ? '—' : liveCount, sub: `de ${allProfiles.length} perfiles`, icon: <Radio size={16} />, color: '#ef4444' },
        ].map(kpi => (
          <div key={kpi.label} className="glass-panel p-4"
            style={{ border: `1px solid ${kpi.color}18` }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground">{kpi.label}</span>
              <span style={{ color: kpi.color }}>{kpi.icon}</span>
            </div>
            <p className="text-2xl font-black mb-0.5" style={{ color: kpi.color }}>{kpi.value}</p>
            <p className="text-[0.65rem] text-muted-foreground">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Top performer */}
      {!loading && topProfile && topProfile.flashCount > 0 && (
        <div className="glass-panel p-4 flex items-center gap-4"
          style={{ border: '1px solid rgba(212,175,55,0.2)', background: 'rgba(212,175,55,0.03)' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
            <Star size={16} fill="#000" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: 'rgba(212,175,55,0.6)' }}>Perfil más activo</p>
            <p className="font-black truncate">{topProfile.display_name}</p>
            <p className="text-xs text-muted-foreground">{topProfile.flashCount} bookings · {ROLE_ES[topProfile.role] ?? topProfile.role}</p>
          </div>
          <BarChart3 size={20} style={{ color: '#D4AF37', flexShrink: 0 }} />
        </div>
      )}

      {/* Profile cards */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Perfiles de la agencia</p>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allProfiles.map((_, i) => (
              <div key={i} className="glass-panel p-4 animate-pulse">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="h-3 bg-white/5 rounded mb-1.5 w-3/4" />
                    <div className="h-2 bg-white/5 rounded w-1/2" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[...Array(3)].map((_, j) => <div key={j} className="h-10 bg-white/5 rounded-lg" />)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.map(p => {
              const color = ROLE_COLOR[p.role] ?? '#D4AF37';
              const isActive = p.id === profileId;
              return (
                <div key={p.id} className="glass-panel p-4 transition-all"
                  style={{ border: isActive ? `1px solid ${color}40` : '1px solid rgba(0,0,0,0.05)', background: isActive ? `${color}06` : undefined }}>

                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative flex-shrink-0">
                      <GeometricAvatar name={p.display_name} size={40} photoUrl={p.photo_url ?? undefined} />
                      {p.is_live && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 border-2 border-black animate-pulse" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <p className="text-sm font-bold truncate">{p.display_name}</p>
                        {isActive && (
                          <span className="text-[0.55rem] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                            style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}>
                            ACTIVO
                          </span>
                        )}
                      </div>
                      <p className="text-xs truncate" style={{ color }}>{ROLE_ES[p.role] ?? p.role}</p>
                      {p.zone && <p className="text-[0.65rem] text-muted-foreground truncate">{p.zone}</p>}
                    </div>
                  </div>

                  {/* Stats mini-grid */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {[
                      { label: 'Bookings', value: p.flashCount, color: '#D4AF37' },
                      { label: 'Fans', value: p.fanCount, color: '#22c55e' },
                      { label: 'Votos', value: p.role === 'rookie' ? p.voteCount : '—', color: '#4285F4' },
                    ].map(s => (
                      <div key={s.label} className="rounded-lg p-2 text-center"
                        style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.05)' }}>
                        <p className="text-sm font-black" style={{ color: s.color }}>{s.value}</p>
                        <p className="text-[0.6rem] text-muted-foreground">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Pending alert */}
                  {p.flashPending > 0 && (
                    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg mb-3 text-xs font-bold"
                      style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', color: '#D4AF37' }}>
                      <Zap size={11} /> {p.flashPending} booking{p.flashPending > 1 ? 's' : ''} pendiente{p.flashPending > 1 ? 's' : ''}
                    </div>
                  )}

                  {/* Switch button */}
                  {!isActive && (
                    <button
                      onClick={() => handleSwitch(p.id)}
                      disabled={switching === p.id}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all hover:scale-[1.02] disabled:opacity-50"
                      style={{ background: `${color}12`, border: `1px solid ${color}25`, color }}>
                      {switching === p.id ? 'Cambiando...' : <>Cambiar a este perfil <ChevronRight size={11} /></>}
                    </button>
                  )}
                  {isActive && (
                    <div className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold"
                      style={{ background: `${color}08`, border: `1px solid ${color}20`, color: `${color}80` }}>
                      Perfil activo ahora
                    </div>
                  )}
                </div>
              );
            })}

            {/* Empty slot cards */}
            {Array.from({ length: Math.max(0, 5 - allProfiles.length) }).map((_, i) => (
              <div key={`empty-${i}`} className="glass-panel p-4 flex flex-col items-center justify-center gap-2 text-center"
                style={{ border: '1px dashed rgba(0,0,0,0.05)', minHeight: 180 }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.05)' }}>
                  <Users size={14} style={{ color: 'rgba(0,0,0,0.1)' }} />
                </div>
                <p className="text-xs text-muted-foreground">Slot disponible</p>
                <p className="text-[0.65rem] text-muted-foreground">Crea un nuevo perfil en Ajustes</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Revenue breakdown */}
      {!loading && totalRevenue > 0 && (
        <div className="glass-panel p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
            <TrendingUp size={12} style={{ color: '#D4AF37' }} /> Ingresos por perfil
          </p>
          <div className="space-y-2">
            {stats.filter(p => p.flashRevenue > 0).sort((a, b) => b.flashRevenue - a.flashRevenue).map(p => {
              const pct = totalRevenue > 0 ? (p.flashRevenue / totalRevenue) * 100 : 0;
              const color = ROLE_COLOR[p.role] ?? '#D4AF37';
              return (
                <div key={p.id} className="flex items-center gap-3">
                  <p className="text-xs w-28 truncate font-bold" style={{ color }}>{p.display_name}</p>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.05)' }}>
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
                  </div>
                  <p className="text-xs font-bold w-16 text-right" style={{ color }}>€{p.flashRevenue.toFixed(0)}</p>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between mt-4 pt-3"
            style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
            <p className="text-xs font-bold text-muted-foreground">Total agencia</p>
            <p className="text-sm font-black" style={{ color: '#22c55e' }}>€{totalRevenue.toFixed(2)}</p>
          </div>
        </div>
      )}

    </div>
  );
};

export default AgencyView;
