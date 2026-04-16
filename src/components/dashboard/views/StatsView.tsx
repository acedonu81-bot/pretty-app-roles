import { Eye, MessageCircle, Crown, TrendingUp, Star, Trophy } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { subscriptionPlans, mapSubscriptionTierToPlan } from '@/lib/subscriptions';

const PODIUM = [
  { rank: 2, name: 'Luna M.', role: 'Makeup Artist', score: 4821, badge: '🥈', height: 110, color: '#A0A0B0', glow: 'rgba(160,160,176,0.25)' },
  { rank: 1, name: 'DJ Konrad', role: 'DJ Techno', score: 6350, badge: '🥇', height: 150, color: '#D4AF37', glow: 'rgba(212,175,55,0.4)' },
  { rank: 3, name: 'Carlos V.', role: 'Staff VIP', score: 3940, badge: '🥉', height: 85, color: '#CD7F32', glow: 'rgba(205,127,50,0.2)' },
];

const FEATURED_SLOTS = 48;

const StatsView = () => {
  const profile = useProfile();
  const currentPlan = subscriptionPlans.find(p => p.id === mapSubscriptionTierToPlan(profile.subscription_tier));
  // Simulated user position (0 = not ranked yet)
  const myPosition = 0;

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="mb-5">
        <h2 className="text-2xl font-bold mb-1">
          Mis <span className="text-gradient">Estadísticas</span>
        </h2>
        <p className="text-sm text-muted-foreground">Métricas de rendimiento de tu perfil en el directorio.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Visualizaciones', value: '0', icon: Eye, change: '—' },
          { label: 'Mensajes recibidos', value: '0', icon: MessageCircle, change: '—' },
          { label: 'Apariciones Directorio', value: '0', icon: Crown, change: '—' },
          { label: 'Tasa de contacto', value: '0%', icon: TrendingUp, change: '—' },
        ].map(s => (
          <div key={s.label} className="glass-panel p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[0.6rem] text-muted-foreground font-bold uppercase tracking-wider">{s.label}</span>
              <s.icon size={14} style={{ color: '#D4AF37' }} />
            </div>
            <div className="text-2xl font-bold mb-1">{s.value}</div>
            <span className="text-[0.6rem] font-semibold text-muted-foreground">{s.change} esta semana</span>
          </div>
        ))}
      </div>

      {/* ═══ POLE POSITION PODIUM ═══ */}
      <div className="glass-panel p-5 mb-6 overflow-hidden relative">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(212,175,55,0.06) 0%, transparent 70%)' }} />

        <div className="flex items-center gap-2 mb-1 relative">
          <Trophy size={16} style={{ color: '#D4AF37' }} />
          <h3 className="text-sm font-bold">Pole Position</h3>
          <span className="text-[0.55rem] font-bold px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(212,175,55,0.12)', color: '#D4AF37' }}>ESTA SEMANA</span>
          <span className="text-[0.55rem] font-bold px-1.5 py-0.5 rounded"
            style={{ background: 'rgba(212,175,55,0.08)', color: 'rgba(212,175,55,0.5)', border: '1px solid rgba(212,175,55,0.15)' }}>
            DEMO
          </span>
        </div>
        <p className="text-xs text-muted-foreground mb-6 relative">
          Top 3 de ejemplo — se actualizará con datos reales cuando haya suficientes usuarios activos.
        </p>

        {/* Podium */}
        <div className="flex items-end justify-center gap-4 relative" style={{ height: 220 }}>
          {PODIUM.map(p => (
            <div key={p.rank} className="flex flex-col items-center gap-2 flex-1">
              {/* Crown/medal */}
              <span className="text-2xl">{p.badge}</span>

              {/* Score */}
              <div className="text-center">
                <p className="text-xs font-black" style={{ color: p.color }}>{p.name}</p>
                <p className="text-[0.55rem] text-muted-foreground">{p.role}</p>
                <div className="flex items-center justify-center gap-0.5 mt-0.5">
                  <Star size={8} style={{ color: p.color }} />
                  <span className="text-[0.6rem] font-bold" style={{ color: p.color }}>{p.score.toLocaleString()}</span>
                </div>
              </div>

              {/* Podium block */}
              <div className="w-full rounded-t-lg flex items-center justify-center relative overflow-hidden transition-all"
                style={{
                  height: p.height,
                  background: `linear-gradient(180deg, ${p.color}22, ${p.color}08)`,
                  border: `1px solid ${p.color}44`,
                  borderBottom: 'none',
                  boxShadow: `0 0 20px ${p.glow}, inset 0 1px 0 ${p.color}33`,
                }}>
                {/* Shimmer sweep */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div className="absolute top-0 bottom-0 w-1/2 animate-[shimmerPodium_3s_ease-in-out_infinite]"
                    style={{ background: `linear-gradient(90deg, transparent, ${p.color}15, transparent)` }} />
                </div>
                <span className="text-xl font-black relative z-10" style={{ color: p.color }}>#{p.rank}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[0.55rem] text-muted-foreground text-center mt-4 relative">
          Actualizado cada lunes. Alcanza el podio con un plan Business o Agencia.
        </p>
      </div>

      {/* Exposure grid — primeras 48 posiciones destacadas */}
      <div className="glass-panel p-5 mb-6">
        <h3 className="text-sm font-bold mb-1">Posiciones Destacadas <span className="text-muted-foreground font-normal text-xs">(#1 – #48)</span></h3>
        <p className="text-xs text-muted-foreground mb-4">
          Las primeras 48 posiciones son para perfiles Business y Agencia. Mejora tu plan para aparecer aquí.
        </p>
        <div className="grid grid-cols-6 sm:grid-cols-8 gap-1">
          {Array.from({ length: FEATURED_SLOTS }, (_, i) => {
            const isMySlot = myPosition > 0 && myPosition === i + 1;
            return (
              <div key={i} className="aspect-square rounded flex items-center justify-center text-[0.5rem] font-bold"
                style={{
                  background: isMySlot ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.03)',
                  border: isMySlot ? '1px solid rgba(212,175,55,0.5)' : '1px solid var(--nightlife-border)',
                  color: isMySlot ? '#D4AF37' : 'var(--nightlife-text-secondary)',
                }}>
                {`#${i + 1}`}
              </div>
            );
          })}
        </div>
        <p className="text-[0.6rem] text-muted-foreground mt-3">Rotación cada 60 minutos. Activa un plan de pago para mejorar tu posición.</p>
      </div>

      {/* Current plan */}
      <div className="glass-panel p-5">
        <h3 className="text-sm font-bold mb-3">Plan actual</h3>
        <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--nightlife-border)' }}>
          <Crown size={20} style={{ color: currentPlan?.monthlyPrice ? '#D4AF37' : '#8E8EA0' }} />
          <div className="flex-1">
            <p className="text-sm font-bold">
              {currentPlan?.name ?? 'Free'} · {currentPlan?.monthlyPrice === 0 ? 'Gratis' : `${currentPlan?.monthlyPrice?.toFixed(2).replace('.', ',')}€/mes`}
            </p>
            <p className="text-xs text-muted-foreground">{currentPlan?.features[0] ?? 'Perfil visible en el directorio con funciones básicas.'}</p>
          </div>
          <span className="text-[0.55rem] font-bold px-2 py-1 rounded" style={{ background: 'rgba(255,255,255,0.05)', color: '#8E8EA0' }}>ACTIVO</span>
        </div>
      </div>
    </div>
  );
};

export default StatsView;
