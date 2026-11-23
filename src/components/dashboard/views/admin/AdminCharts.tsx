import { useState, useEffect } from 'react';
import { BarChart3, Activity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { leerCobros, eur, type DatosCobros } from './AdminCobros';

// Planes de hoy (23 nov 2026): Profesional (starter) y Premium (business) de pago,
// fundadores (Profesional sin pagar el primer año) y el resto sin pagar. Antes se
// contaban elite/agency, planes que ya no existen.
interface PlanCounts { starter: number; business: number; free: number; fundadores: number; total: number; }
interface ZoneCount { zone: string; count: number; }

const AdminCharts = ({ cargarCobros = leerCobros }: { cargarCobros?: () => Promise<DatosCobros> } = {}) => {
  const [plans, setPlans] = useState<PlanCounts | null>(null);
  const [zones, setZones] = useState<ZoneCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [cobros, setCobros] = useState<DatosCobros | null | 'fallo'>(null);

  useEffect(() => { cargarCobros().then(setCobros).catch(() => setCobros('fallo')); }, [cargarCobros]);

  useEffect(() => {
    const load = async () => {
      const contar = (tier: string) => supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('subscription_tier', tier);
      const [starterRes, businessRes, freeRes, fundRes, zoneRes] = await Promise.all([
        contar('starter'),
        contar('business'),
        contar('free'),
        (supabase as any).from('redes_fundadores').select('profile_id', { count: 'exact', head: true }),
        supabase.from('profiles').select('zone').not('zone', 'is', null).limit(500),
      ]);

      const starter = starterRes.count ?? 0;
      const business = businessRes.count ?? 0;
      const free = freeRes.count ?? 0;
      setPlans({ starter, business, free, fundadores: fundRes.count ?? 0, total: starter + business + free });

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
        {/* Ingreso mensual recurrente real (Stripe, vía admin-cobros). */}
        <div className="glass-panel p-5">
          <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
            <BarChart3 size={14} style={{ color: '#8A6D0F' }} /> Ingreso mensual recurrente
          </h3>
          {cobros === null ? (
            <div className="h-40 rounded-md animate-pulse" style={{ background: 'rgba(0,0,0,0.05)' }} />
          ) : cobros === 'fallo' ? (
            <p className="text-xs text-muted-foreground text-center py-12">No se han podido leer los cobros de Stripe.</p>
          ) : (
            <div className="flex flex-col gap-2 h-40 justify-center">
              <p className="text-3xl font-black" style={{ color: '#8A6D0F' }}>{eur(cobros.resumen.ingresoMensual)}</p>
              <p className="text-xs text-muted-foreground">Suscripciones vivas, el anual repartido en 12 meses, sin cupones.</p>
              <p className="text-sm">Neto este mes: <span className="font-bold">{eur(cobros.resumen.neto)}</span> · {cobros.resumen.cobros} cobros</p>
              <a href="/dashboard?view=admin&tab=cobros" className="text-xs font-bold underline" style={{ color: '#8A6D0F' }}>Ver cobros y movimientos</a>
            </div>
          )}
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-16 rounded-lg animate-pulse" style={{ background: 'rgba(0,0,0,0.05)' }} />
            ))}
          </div>
        ) : plans ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Premium (pagan)', count: plans.business, color: '#2563EB' },
              { label: 'Profesional (pagan)', count: plans.starter, color: '#8A6D0F' },
              { label: 'Fundadores (sin pagar el 1er año)', count: plans.fundadores, color: '#059669' },
              { label: 'Sin plan de pago', count: plans.free, color: '#4b5563' },
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
