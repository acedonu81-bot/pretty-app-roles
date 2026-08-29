import { useState, useEffect } from 'react';
import { BarChart3, Activity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface PlanCounts { elite: number; agency: number; free: number; total: number; }
interface ZoneCount { zone: string; count: number; }

const AdminCharts = () => {
  const [plans, setPlans] = useState<PlanCounts | null>(null);
  const [zones, setZones] = useState<ZoneCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      // Tiers reales usados por la lógica de negocio activa (DashboardSidebar.tsx,
      // AgencyView.tsx): free/agency/elite. Antes este componente usaba
      // premium/business/starter — nombres que no existen en ningún otro sitio
      // del código, así que en cuanto hubiera el primer usuario `agency` (el
      // tier real, no contado en ningún bucket de antes), "Total" no habría
      // sumado al total de usuarios y ese usuario habría desaparecido del breakdown.
      const [eliteRes, agencyRes, freeRes, zoneRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('subscription_tier', 'elite'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('subscription_tier', 'agency'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('subscription_tier', 'free'),
        supabase.from('profiles').select('zone').not('zone', 'is', null).limit(500),
      ]);

      const elite = eliteRes.count ?? 0;
      const agency = agencyRes.count ?? 0;
      const free = freeRes.count ?? 0;
      setPlans({ elite, agency, free, total: elite + agency + free });

      // Aggregate zones client-side from fetched data. Algunos perfiles
      // guardaron su zona como "Madrid, España" en vez de "Madrid" — sin
      // normalizar, el heatmap las cuenta como dos ciudades distintas y
      // "Madrid" aparece duplicado. Todo el negocio es España, así que el
      // sufijo de país tras la coma se descarta al agrupar.
      const zoneCounts: Record<string, number> = {};
      (zoneRes.data ?? []).forEach((r: { zone: string | null }) => {
        const zone = r.zone?.split(',')[0]?.trim();
        if (zone) zoneCounts[zone] = (zoneCounts[zone] ?? 0) + 1;
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
            <BarChart3 size={14} style={{ color: '#8A6D0F' }} /> Crecimiento MRR
          </h3>
          <div className="flex flex-col items-center justify-center h-40 gap-2">
            <p className="text-xs text-muted-foreground">Disponible tras integrar Stripe Connect</p>
            <span className="text-xs font-bold px-2 py-1 rounded"
              style={{ background: 'rgba(212,175,55,0.08)', color: '#8A6D0F', border: '1px solid rgba(212,175,55,0.2)' }}>
              Próximamente
            </span>
          </div>
        </div>

        {/* Zone heatmap — real data */}
        <div className="glass-panel p-5">
          <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
            <Activity size={14} style={{ color: '#8A6D0F' }} /> Usuarios por Zona
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
          <div className="grid grid-cols-3 gap-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-16 rounded-lg animate-pulse" style={{ background: 'rgba(0,0,0,0.05)' }} />
            ))}
          </div>
        ) : plans ? (
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Elite', count: plans.elite,   color: '#8A6D0F' },
              { label: 'Agency', count: plans.agency, color: '#8B5CF6' },
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
