import { useState } from 'react';
import { Eye, MousePointerClick, Crown, TrendingUp } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { subscriptionPlans, mapSubscriptionTierToPlan } from '@/lib/subscriptions';

const TOTAL_SLOTS = 48;
const ITEMS_PER_PAGE = 12;
const totalPages = Math.ceil(TOTAL_SLOTS / ITEMS_PER_PAGE);

const StatsView = () => {
  const profile = useProfile();
  const currentPlan = subscriptionPlans.find(p => p.id === mapSubscriptionTierToPlan(profile.subscription_tier));
  const [currentPage, setCurrentPage] = useState(1);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIdx = Math.min(startIdx + ITEMS_PER_PAGE, TOTAL_SLOTS);
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
          { label: 'Clics WhatsApp', value: '0', icon: MousePointerClick, change: '—' },
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

      {/* Exposure grid - 48 slots */}
      <div className="glass-panel p-5 mb-6">
        <h3 className="text-sm font-bold mb-4">Exposición en el Directorio</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Tu posición en el directorio depende de tu plan de suscripción. Mejora tu plan para aparecer en las primeras posiciones.
        </p>
        <div className="grid grid-cols-6 sm:grid-cols-8 gap-1">
          {Array.from({ length: TOTAL_SLOTS }, (_, i) => {
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

      {/* Paginated ranking listing */}
      <div className="glass-panel p-5 mb-6">
        <h3 className="text-sm font-bold mb-4">Ranking del Directorio</h3>
        <div className="space-y-1">
          {Array.from({ length: endIdx - startIdx }, (_, i) => {
            const pos = startIdx + i + 1;
            const isMe = myPosition === pos;
            return (
              <div key={pos} className="flex items-center gap-3 p-2 rounded-lg"
                style={{
                  background: isMe ? 'rgba(212,175,55,0.1)' : 'rgba(255,255,255,0.02)',
                  border: isMe ? '1px solid rgba(212,175,55,0.3)' : '1px solid transparent',
                }}>
                <span className="text-xs font-black w-8 text-center" style={{ color: isMe ? '#D4AF37' : '#8E8EA0' }}>#{pos}</span>
                <div className="flex-1">
                  <div className="w-20 h-2 rounded" style={{ background: 'rgba(255,255,255,0.05)' }} />
                </div>
                {isMe && <span className="text-[0.55rem] font-bold px-2 py-0.5 rounded" style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37' }}>TÚ</span>}
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} onClick={() => setCurrentPage(i + 1)}
              className="w-7 h-7 rounded text-xs font-bold transition-all"
              style={{
                background: currentPage === i + 1 ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${currentPage === i + 1 ? 'rgba(212,175,55,0.3)' : 'var(--nightlife-border)'}`,
                color: currentPage === i + 1 ? '#D4AF37' : '#8E8EA0',
              }}>
              {i + 1}
            </button>
          ))}
        </div>
        {myPosition === 0 && (
          <p className="text-[0.55rem] text-muted-foreground text-center mt-3">Tu perfil aún no tiene posición asignada en el ranking.</p>
        )}
        {myPosition > TOTAL_SLOTS && (
          <p className="text-[0.55rem] text-center mt-3" style={{ color: '#D4AF37' }}>
            Tu posición actual: <strong>#{myPosition}</strong> — fuera de las primeras {TOTAL_SLOTS} posiciones. Mejora tu plan para subir.
          </p>
        )}
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
