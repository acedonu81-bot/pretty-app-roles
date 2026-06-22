import { useState, useEffect } from 'react';
import { BarChart3, Activity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface PlanCounts { elite: number; premium: number; starter: number; free: number; total: number; }
interface ZoneCount { zone: string; count: number; }

const AdminCharts = () => {
  const [plans, setPlans] = useState<PlanCounts | null>(null);
  const [zones, setZones] = useState<ZoneCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [eliteRes, premRes, starterRes, freeRes, zoneRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('subscription_tier', 'elite'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).in('subscription_tier', ['premium', 'business']),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('subscription_tier', 'starter'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('subscription_tier', 'free'),
        supabase.from('profiles').select('zone').not('zone', 'is', null).limit(500),
      ]);

      const elite = eliteRes.count ?? 0;
      const premium = premRes.count ?? 0;
      const starter = starterRes.count ?? 0;
      const free = freeRes.count ?? 0;
      setPlans({ elite, premium, starter, free, total: elite + premium + starter + free });

      // Aggregate zones client-side from fetched data
      const zoneCounts: Record<string, number> = {};
      (zoneRes.data ?? []).forEach((r: { zone: string | null }) => {
        if (r.zone) zoneCounts[r.zone] = (zoneCounts[r.zone] ?? 0) + 1;
      });
      const sorted = Object.entries(zoneCounts)
        .map(([zone, count]) => ({ zone, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6);
      setZones(sorted);
      setLoading(false);
    };
    load();
  }, []);

  const maxZone = Math.max(...zones.map(z => z.count), 1);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* MRR — requires Stripe, show placeholder */}
        <div className="glass-panel p-5">
          <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
            <BarChart3 size={14} style={{ color: '#D4AF37' }} /> Crecimiento MRR
          </h3>
          <div className="flex flex-col items-center justify-center h-40 gap-2">
            <p className="text-xs text-muted-foreground">Disponible tras integrar Stripe Connect</p>
            <span className="text-xs font-bold px-2 py-1 rounded"
              style={{ background: 'rgba(212,175,55,0.08)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }}>
              Próximamente
            </span>
          </div>
        </div>

        {/* Zone heatmap — real data */}
        <div className="glass-panel p-5">
          <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
            <Activity size={14} style={{ color: '#D4AF37' }} /> Usuarios por Zona
          </h3>
          {loading ? (
            <div className="space-y-2">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-6 rounded-md animate-pulse" style={{ background: 'rgba(0,0,0,0.05)' }} />
              ))}
            </div>
          ) : zones.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-8">Sin datos de zona aún</p>
          ) : (
            <div className="space-y-2">
              {zones.map((z) => {
                const intensity = z.count / maxZone;
                return (
                  <div key={z.zone} className="flex items-center gap-3">
                    <span className="text-xs font-medium w-20 truncate">{z.zone}</span>
                    <div className="flex-1 h-6 rounded-md overflow-hidden" style={{ background: 'rgba(0,0,0,0.03)' }}>
                      <div className="h-full rounded-md transition-all flex items-center px-2"
                        style={{ width: `${intensity * 100}%`, background: `linear-gradient(90deg, rgba(212,175,55,${intensity * 0.6}), rgba(212,175,55,${intensity}))` }}>
                        <span className="text-[0.75rem] font-bold" style={{ color: '#000' }}>{z.count}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Subscription breakdown — real data */}
      <div className="glass-panel p-5 mb-6">
        <h3 className="text-sm font-bold mb-4">Distribución de Planes</h3>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-16 rounded-lg animate-pulse" style={{ background: 'rgba(0,0,0,0.05)' }} />
            ))}
          </div>
        ) : plans ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Elite', count: plans.elite,   color: '#D4AF37' },
              { label: 'Premium', count: plans.premium, color: '#8B5CF6' },
              { label: 'Starter', count: plans.starter, color: '#3d3d4e' },
              { label: 'Free',   count: plans.free,    color: '#333' },
            ].map((p) => (
              <div key={p.label} className="text-center">
                <p className="text-2xl font-bold" style={{ color: p.color }}>{p.count}</p>
                <p className="text-xs text-muted-foreground">{p.label}</p>
                <p className="text-xs font-bold mt-1">
                  {plans.total > 0 ? ((p.count / plans.total) * 100).toFixed(1) : '0'}%
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
};

export default AdminCharts;
