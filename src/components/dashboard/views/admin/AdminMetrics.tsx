import { useState, useEffect } from 'react';
import { Users, Zap, Shield, Activity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Metrics {
  totalUsers: number;
  professionals: number;
  businesses: number;
  activeFlash: number;
}

const AdminMetrics = () => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [
        { count: totalUsers },
        { count: businesses },
        { count: activeFlash },
      ] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'empresario'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('is_flash_active', true),
      ]);
      setMetrics({
        totalUsers: totalUsers ?? 0,
        professionals: (totalUsers ?? 0) - (businesses ?? 0),
        businesses: businesses ?? 0,
        activeFlash: activeFlash ?? 0,
      });
      setLoading(false);
    };
    load();
  }, []);

  const kpis = metrics ? [
    { label: 'Usuarios Total',   value: metrics.totalUsers,    icon: Users,  color: '#8A6D0F' },
    { label: 'Profesionales',    value: metrics.professionals, icon: Users,  color: '#3d3d4e' },
    { label: 'Empresarios',      value: metrics.businesses,    icon: Shield, color: '#8A6D0F' },
    { label: 'Flash Activos',    value: metrics.activeFlash,   icon: Zap,    color: '#22c55e' },
  ] : [];

  return (
    <>
      {/* Server Status */}
      <div className="glass-panel p-4 mb-6 flex items-center gap-3" style={{ border: '1px solid rgba(34,197,94,0.2)' }}>
        <Activity size={16} style={{ color: '#22c55e' }} />
        <div>
          <p className="text-xs font-bold" style={{ color: '#22c55e' }}>Sistema Online</p>
          <p className="text-xs text-muted-foreground">Supabase · datos en tiempo real</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass-panel p-3 animate-pulse">
              <div className="h-3 w-16 rounded mb-2" style={{ background: 'rgba(0,0,0,0.05)' }} />
              <div className="h-5 w-10 rounded" style={{ background: 'rgba(0,0,0,0.05)' }} />
            </div>
          ))
        ) : kpis.map((m) => (
          <div key={m.label} className="glass-panel p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <m.icon size={12} style={{ color: m.color }} />
              <span className="text-[0.75rem] text-muted-foreground uppercase tracking-wider font-bold">{m.label}</span>
            </div>
            <p className="text-lg font-bold" style={{ color: m.color }}>{m.value}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default AdminMetrics;
