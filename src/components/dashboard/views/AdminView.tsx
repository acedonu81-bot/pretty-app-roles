import { useState } from 'react';
import { Users, DollarSign, Zap, Shield, Trash2, CheckCircle, XCircle, BarChart3, Activity, TrendingUp, RefreshCw } from 'lucide-react';
import { profiles, empresarios } from '@/data/profiles';
import { toast } from 'sonner';

const mockMetrics = {
  totalUsers: 847,
  professionals: 723,
  businesses: 124,
  dailyRevenue: 1247,
  monthlyMRR: 18450,
  activeFlash: 24,
  churnRate: 3.2,
  eliteUsers: 89,
  premiumUsers: 234,
  freeUsers: 524,
};

const revenueData = [
  { month: 'Ene', revenue: 8200 },
  { month: 'Feb', revenue: 9800 },
  { month: 'Mar', revenue: 11500 },
  { month: 'Abr', revenue: 12800 },
  { month: 'May', revenue: 14200 },
  { month: 'Jun', revenue: 15900 },
  { month: 'Jul', revenue: 18450 },
];

const heatmapZones = [
  { zone: 'Malasaña', clicks: 342, intensity: 0.95 },
  { zone: 'Salamanca', clicks: 289, intensity: 0.8 },
  { zone: 'Chueca', clicks: 234, intensity: 0.65 },
  { zone: 'Chamberí', clicks: 178, intensity: 0.5 },
  { zone: 'Lavapiés', clicks: 145, intensity: 0.4 },
  { zone: 'La Latina', clicks: 112, intensity: 0.3 },
];

const AdminView = () => {
  const [verifiedProfiles, setVerifiedProfiles] = useState<number[]>([1, 2, 5, 8]);
  const [suspendedProfiles, setSuspendedProfiles] = useState<number[]>([]);

  const toggleVerify = (id: number) => {
    setVerifiedProfiles(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
    toast.success(verifiedProfiles.includes(id) ? 'Verificación eliminada' : 'Perfil verificado con Sello Dorado');
  };

  const toggleSuspend = (id: number) => {
    setSuspendedProfiles(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
    toast.success(suspendedProfiles.includes(id) ? 'Cuenta reactivada' : 'Cuenta suspendida');
  };

  const handleClearCache = () => {
    toast.success('Caché limpiada correctamente');
  };

  const handleResetSessions = () => {
    toast.success('Estados de sesión reiniciados');
  };

  const maxRevenue = Math.max(...revenueData.map(d => d.revenue));

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">
          Panel <span className="text-gradient">Admin</span>
        </h2>
        <p className="text-sm text-muted-foreground">Control total del sistema NIGHTLIFE Madrid.</p>
      </div>

      {/* Server Status */}
      <div className="glass-panel p-4 mb-6 flex items-center justify-between" style={{ border: '1px solid rgba(34,197,94,0.2)' }}>
        <div className="flex items-center gap-3">
          <Activity size={16} style={{ color: '#22c55e' }} />
          <div>
            <p className="text-xs font-bold" style={{ color: '#22c55e' }}>Sistema Online</p>
            <p className="text-[0.6rem] text-muted-foreground">Latencia: 12ms · Uptime: 99.97%</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={handleClearCache}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105"
            style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', color: '#D4AF37' }}>
            <Trash2 size={12} /> Limpiar Caché
          </button>
          <button onClick={handleResetSessions}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105"
            style={{ background: 'rgba(255,95,86,0.08)', border: '1px solid rgba(255,95,86,0.2)', color: '#ff5f56' }}>
            <RefreshCw size={12} /> Reset Sesiones
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {[
          { label: 'Usuarios Total', value: mockMetrics.totalUsers, icon: Users, color: '#D4AF37' },
          { label: 'Profesionales', value: mockMetrics.professionals, icon: Users, color: '#8E8EA0' },
          { label: 'Empresarios', value: mockMetrics.businesses, icon: Shield, color: '#D4AF37' },
          { label: 'MRR Mensual', value: `€${mockMetrics.monthlyMRR.toLocaleString()}`, icon: DollarSign, color: '#22c55e' },
          { label: 'Flash Activos', value: mockMetrics.activeFlash, icon: Zap, color: '#22c55e' },
          { label: 'Churn Rate', value: `${mockMetrics.churnRate}%`, icon: TrendingUp, color: '#ff5f56' },
        ].map((m) => (
          <div key={m.label} className="glass-panel p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <m.icon size={12} style={{ color: m.color }} />
              <span className="text-[0.55rem] text-muted-foreground uppercase tracking-wider font-bold">{m.label}</span>
            </div>
            <p className="text-lg font-bold" style={{ color: m.color }}>{m.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Revenue Chart */}
        <div className="glass-panel p-5">
          <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
            <BarChart3 size={14} style={{ color: '#D4AF37' }} />
            Crecimiento MRR
          </h3>
          <div className="flex items-end gap-2 h-40">
            {revenueData.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[0.5rem] font-bold" style={{ color: '#D4AF37' }}>€{(d.revenue / 1000).toFixed(1)}k</span>
                <div className="w-full rounded-t-md transition-all"
                  style={{
                    height: `${(d.revenue / maxRevenue) * 100}%`,
                    background: 'linear-gradient(180deg, #D4AF37, #B8941E)',
                    opacity: 0.7,
                  }} />
                <span className="text-[0.5rem] text-muted-foreground">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Heatmap */}
        <div className="glass-panel p-5">
          <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
            <Activity size={14} style={{ color: '#D4AF37' }} />
            Heatmap de Clics por Zona
          </h3>
          <div className="space-y-2">
            {heatmapZones.map((z) => (
              <div key={z.zone} className="flex items-center gap-3">
                <span className="text-xs font-medium w-20">{z.zone}</span>
                <div className="flex-1 h-6 rounded-md overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div className="h-full rounded-md transition-all flex items-center px-2"
                    style={{
                      width: `${z.intensity * 100}%`,
                      background: `linear-gradient(90deg, rgba(212,175,55,${z.intensity * 0.6}), rgba(212,175,55,${z.intensity}))`,
                    }}>
                    <span className="text-[0.55rem] font-bold" style={{ color: '#000' }}>{z.clicks}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subscription breakdown */}
      <div className="glass-panel p-5 mb-6">
        <h3 className="text-sm font-bold mb-4">Distribución de Planes</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Elite (€24,95)', count: mockMetrics.eliteUsers, pct: ((mockMetrics.eliteUsers / mockMetrics.totalUsers) * 100).toFixed(1), color: '#D4AF37' },
            { label: 'Premium (€9,95)', count: mockMetrics.premiumUsers, pct: ((mockMetrics.premiumUsers / mockMetrics.totalUsers) * 100).toFixed(1), color: '#8E8EA0' },
            { label: 'Free', count: mockMetrics.freeUsers, pct: ((mockMetrics.freeUsers / mockMetrics.totalUsers) * 100).toFixed(1), color: 'rgba(255,255,255,0.3)' },
          ].map((p) => (
            <div key={p.label} className="text-center">
              <p className="text-2xl font-bold" style={{ color: p.color }}>{p.count}</p>
              <p className="text-[0.6rem] text-muted-foreground">{p.label}</p>
              <p className="text-xs font-bold mt-1">{p.pct}%</p>
            </div>
          ))}
        </div>
      </div>

      {/* User Management */}
      <div className="glass-panel p-5">
        <h3 className="text-sm font-bold mb-4">Gestión de Usuarios</h3>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {profiles.map((p) => (
            <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg transition-all"
              style={{
                background: suspendedProfiles.includes(p.id) ? 'rgba(255,95,86,0.05)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${suspendedProfiles.includes(p.id) ? 'rgba(255,95,86,0.2)' : 'var(--nightlife-border)'}`,
                opacity: suspendedProfiles.includes(p.id) ? 0.5 : 1,
              }}>
              <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                <img src={p.photo} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold truncate">{p.name}</span>
                  {verifiedProfiles.includes(p.id) && (
                    <CheckCircle size={12} style={{ color: '#D4AF37' }} />
                  )}
                  <span className="text-[0.55rem] px-1.5 py-0.5 rounded font-bold"
                    style={{
                      background: p.subscriptionTier === 'elite' ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.05)',
                      color: p.subscriptionTier === 'elite' ? '#D4AF37' : 'var(--nightlife-text-secondary)',
                    }}>
                    {p.subscriptionTier.toUpperCase()}
                  </span>
                </div>
                <p className="text-[0.6rem] text-muted-foreground">{p.role} · {p.zone}</p>
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => toggleVerify(p.id)}
                  className="p-1.5 rounded-md transition-all hover:scale-110"
                  style={{
                    background: verifiedProfiles.includes(p.id) ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.05)',
                    color: verifiedProfiles.includes(p.id) ? '#D4AF37' : 'var(--nightlife-text-secondary)',
                  }}
                  title={verifiedProfiles.includes(p.id) ? 'Quitar verificación' : 'Verificar'}>
                  <CheckCircle size={14} />
                </button>
                <button onClick={() => toggleSuspend(p.id)}
                  className="p-1.5 rounded-md transition-all hover:scale-110"
                  style={{
                    background: suspendedProfiles.includes(p.id) ? 'rgba(255,95,86,0.15)' : 'rgba(255,255,255,0.05)',
                    color: suspendedProfiles.includes(p.id) ? '#ff5f56' : 'var(--nightlife-text-secondary)',
                  }}
                  title={suspendedProfiles.includes(p.id) ? 'Reactivar' : 'Suspender'}>
                  <XCircle size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminView;
