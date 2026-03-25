import { Users, DollarSign, Zap, Shield, TrendingUp, Activity, Trash2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const mockMetrics = {
  totalUsers: 847,
  professionals: 723,
  businesses: 124,
  monthlyMRR: 18450,
  activeFlash: 24,
  churnRate: 3.2,
};

const AdminMetrics = () => {
  return (
    <>
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
          <button onClick={() => toast.success('Caché limpiada')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105"
            style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', color: '#D4AF37' }}>
            <Trash2 size={12} /> Limpiar Caché
          </button>
          <button onClick={() => toast.success('Sesiones reiniciadas')}
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
    </>
  );
};

export default AdminMetrics;
