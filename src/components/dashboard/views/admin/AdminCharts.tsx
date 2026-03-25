import { BarChart3, Activity } from 'lucide-react';

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

const mockMetrics = {
  totalUsers: 847,
  eliteUsers: 89,
  premiumUsers: 234,
  freeUsers: 524,
};

const maxRevenue = Math.max(...revenueData.map(d => d.revenue));

const AdminCharts = () => {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="glass-panel p-5">
          <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
            <BarChart3 size={14} style={{ color: '#D4AF37' }} /> Crecimiento MRR
          </h3>
          <div className="flex items-end gap-2 h-40">
            {revenueData.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[0.5rem] font-bold" style={{ color: '#D4AF37' }}>€{(d.revenue / 1000).toFixed(1)}k</span>
                <div className="w-full rounded-t-md transition-all"
                  style={{ height: `${(d.revenue / maxRevenue) * 100}%`, background: 'linear-gradient(180deg, #D4AF37, #B8941E)', opacity: 0.7 }} />
                <span className="text-[0.5rem] text-muted-foreground">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-5">
          <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
            <Activity size={14} style={{ color: '#D4AF37' }} /> Heatmap de Clics por Zona
          </h3>
          <div className="space-y-2">
            {heatmapZones.map((z) => (
              <div key={z.zone} className="flex items-center gap-3">
                <span className="text-xs font-medium w-20">{z.zone}</span>
                <div className="flex-1 h-6 rounded-md overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div className="h-full rounded-md transition-all flex items-center px-2"
                    style={{ width: `${z.intensity * 100}%`, background: `linear-gradient(90deg, rgba(212,175,55,${z.intensity * 0.6}), rgba(212,175,55,${z.intensity}))` }}>
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
    </>
  );
};

export default AdminCharts;
