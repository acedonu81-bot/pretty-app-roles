import { useState, useEffect } from 'react';
import { Users, Zap, Shield, Activity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Metrics {
  totalUsers: number;
  professionals: number;
  businesses: number;
  activeFlash: number;
  activeFlashRecent: number;
  bookingsTotal: number;
  bookingsPending: number;
  bookingsAccepted: number;
  bookingsRejected: number;
}

const AdminMetrics = () => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      // is_flash_active ("Disponible ahora") no caduca solo — un profesional
      // que lo activó hace meses y no volvió a tocar su perfil sigue contando
      // como "activo" para siempre. activeFlashRecent filtra por updated_at
      // en las últimas 24h como señal aproximada de disponibilidad real —
      // no hay columna dedicada al momento de activar el toggle, así que
      // cualquier edición del perfil (no solo el toggle) cuenta como "reciente".
      const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const [
        { count: totalUsers },
        { count: businesses },
        { count: activeFlash },
        { count: activeFlashRecent },
        { count: bookingsTotal },
        { count: bookingsPending },
        { count: bookingsAccepted },
        { count: bookingsRejected },
      ] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'empresario'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('is_flash_active', true),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('is_flash_active', true).gte('updated_at', since24h),
        supabase.from('flash_bookings').select('id', { count: 'exact', head: true }),
        supabase.from('flash_bookings').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('flash_bookings').select('id', { count: 'exact', head: true }).in('status', ['confirmed', 'accepted', 'completed']),
        supabase.from('flash_bookings').select('id', { count: 'exact', head: true }).eq('status', 'rejected'),
      ]);
      setMetrics({
        totalUsers: totalUsers ?? 0,
        professionals: (totalUsers ?? 0) - (businesses ?? 0),
        businesses: businesses ?? 0,
        activeFlash: activeFlash ?? 0,
        activeFlashRecent: activeFlashRecent ?? 0,
        bookingsTotal: bookingsTotal ?? 0,
        bookingsPending: bookingsPending ?? 0,
        bookingsAccepted: bookingsAccepted ?? 0,
        bookingsRejected: bookingsRejected ?? 0,
      });
      setLoading(false);
    };
    load();
  }, []);

  const kpis = metrics ? [
    { label: 'Usuarios Total',   value: metrics.totalUsers,    icon: Users,  color: '#8A6D0F' },
    { label: 'Profesionales',    value: metrics.professionals, icon: Users,  color: '#555' },
    { label: 'Empresarios',      value: metrics.businesses,    icon: Shield, color: '#8A6D0F' },
    // Renombrado desde "Flash Activos": ese nombre se confundía con
    // solicitudes reales de Flash Booking (flash_bookings, tarjeta aparte
    // abajo) — esto solo cuenta profesionales con el toggle "Disponible
    // ahora" encendido, que hoy no caduca solo.
    { label: 'Prof. Disponibles', value: metrics.activeFlash,  icon: Zap,    color: '#22c55e', sub: `${metrics.activeFlashRecent} en 24h` },
  ] : [];

  const bookingKpis = metrics ? [
    { label: 'Solicitudes Totales', value: metrics.bookingsTotal,    color: '#8A6D0F' },
    { label: 'Pendientes',          value: metrics.bookingsPending,  color: '#D97706' },
    { label: 'Aceptadas',           value: metrics.bookingsAccepted, color: '#22c55e' },
    { label: 'Rechazadas',          value: metrics.bookingsRejected, color: '#dc2626' },
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
            {'sub' in m && (
              <p className="text-[0.65rem] text-muted-foreground mt-0.5">{m.sub}</p>
            )}
          </div>
        ))}
      </div>

      {/* Flash Booking — solicitudes reales creadas por empresarios (tabla
          flash_bookings), distinto de "Prof. Disponibles" arriba. */}
      <p className="text-[0.75rem] text-muted-foreground uppercase tracking-wider font-bold mb-2">Flash Booking</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass-panel p-3 animate-pulse">
              <div className="h-3 w-16 rounded mb-2" style={{ background: 'rgba(0,0,0,0.05)' }} />
              <div className="h-5 w-10 rounded" style={{ background: 'rgba(0,0,0,0.05)' }} />
            </div>
          ))
        ) : bookingKpis.map((m) => (
          <div key={m.label} className="glass-panel p-3">
            <span className="text-[0.75rem] text-muted-foreground uppercase tracking-wider font-bold">{m.label}</span>
            <p className="text-lg font-bold mt-1" style={{ color: m.color }}>{m.value}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default AdminMetrics;
