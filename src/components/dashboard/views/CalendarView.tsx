import { useState, useEffect } from 'react';
import { Bell, Clock, Calendar as CalendarIcon } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { toast } from 'sonner';

const roleImages: Record<string, string> = {
  dj: 'https://images.unsplash.com/photo-1571266028243-3716f02d2d58?w=400&h=200&fit=crop',
  staff: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=200&fit=crop',
  makeup: 'https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=400&h=200&fit=crop',
  media: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=200&fit=crop',
  design: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=200&fit=crop',
  empresario: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop',
  vestuario: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=200&fit=crop',
  ambassador: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=200&fit=crop',
};

const CalendarView = () => {
  const days = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];
  const dates = [28, 29, 30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const profile = useProfile();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Demo next event: 5 days from now
  const [countdown, setCountdown] = useState('');
  const nextEventDate = new Date();
  nextEventDate.setDate(nextEventDate.getDate() + 5);
  nextEventDate.setHours(2, 0, 0, 0);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const diff = nextEventDate.getTime() - now.getTime();
      if (diff <= 0) { setCountdown('¡Es hoy!'); return; }
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      if (d > 0) setCountdown(`${d} días y ${h}h`);
      else setCountdown(`${h}h ${m}min`);
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    if (!notificationsEnabled) {
      toast.success('Notificaciones del calendario activadas. Recibirás alertas antes de tus eventos.');
    } else {
      toast.info('Notificaciones del calendario desactivadas.');
    }
  };

  const roleImg = roleImages[profile.role] || roleImages.dj;

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">
            <span className="text-gradient">Calendario</span>
          </h2>
          <p className="text-base text-muted-foreground">Sincroniza tu agenda con eventos y bolos.</p>
        </div>
        <button onClick={toggleNotifications}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all"
          style={{
            background: notificationsEnabled ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.03)',
            border: notificationsEnabled ? '1px solid rgba(212,175,55,0.3)' : '1px solid var(--nightlife-border)',
            color: notificationsEnabled ? '#D4AF37' : '#8E8EA0',
          }}>
          <Bell size={16} />
          {notificationsEnabled ? 'Alertas ON' : 'Activar Alertas'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
        <div className="flex flex-col gap-5">
          <div className="glass-panel p-5">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-base font-bold">Agosto 2026</h3>
              <div className="flex gap-1.5">
                <button className="w-8 h-8 rounded flex items-center justify-center text-muted-foreground hover:bg-white/5 text-base">←</button>
                <button className="w-8 h-8 rounded flex items-center justify-center text-muted-foreground hover:bg-white/5 text-base">→</button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1.5 text-center text-xs text-muted-foreground font-bold mb-2">
              {days.map((d) => <div key={d}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1.5 text-center text-base">
              {dates.map((d, i) => {
                const isOldMonth = d > 20;
                const isConfirmed = d === 5;
                const isPending = d === 6;
                return (
                  <div key={i}
                    className={`py-3 rounded relative cursor-pointer transition-all ${isOldMonth ? 'text-white/15' : 'hover:bg-white/5'}`}
                    style={{
                      background: isConfirmed ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.02)',
                      border: isConfirmed ? '1px solid rgba(212,175,55,0.3)' : isPending ? '1px solid rgba(255,95,86,0.3)' : '1px solid transparent',
                      color: isConfirmed ? '#D4AF37' : undefined,
                      fontWeight: isConfirmed ? 700 : undefined,
                    }}>
                    {d}
                    {isConfirmed && <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full" style={{ background: '#D4AF37' }} />}
                    {isPending && <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full" style={{ background: '#ff5f56' }} />}
                  </div>
                );
              })}
            </div>
            <div className="flex gap-4 mt-5 text-xs font-bold text-muted-foreground justify-center">
              <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full" style={{ background: '#D4AF37' }} /> Confirmado</span>
              <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f56' }} /> Pendiente</span>
            </div>
          </div>

          {/* Next Event Countdown Card */}
          <div className="glass-panel overflow-hidden" style={{ border: '1px solid rgba(212,175,55,0.2)' }}>
            <div className="relative h-32">
              <img src={roleImg} alt="Próximo evento" className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.3))' }} />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#D4AF37' }}>Próximo Evento</p>
                <h3 className="text-lg font-black mt-1">Cierre Sunrise Festival VIP</h3>
              </div>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CalendarIcon size={18} style={{ color: '#D4AF37' }} />
                <div>
                  <p className="text-sm font-bold">5 Agosto, 02:00h</p>
                  <p className="text-xs text-muted-foreground">📍 Stage Principal (Ibiza)</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1.5" style={{ color: '#D4AF37' }}>
                  <Clock size={16} />
                  <span className="text-lg font-black">{countdown}</span>
                </div>
                <p className="text-xs text-muted-foreground">cuenta atrás</p>
              </div>
            </div>
            {profile.subscription_tier !== 'free' && (
              <div className="px-4 pb-3">
                <div className="text-xs font-bold px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5"
                  style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }}>
                  ⚡ Alerta prioritaria activada
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="glass-panel p-4">
            <div className="flex justify-between items-center mb-3 pb-2" style={{ borderBottom: '1px solid var(--nightlife-border)' }}>
              <h3 className="text-sm font-bold">Próximo Bolo</h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37' }}>Agendado</span>
            </div>
            <div className="p-3 rounded-lg relative" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.1)' }}>
              <div className="absolute top-0 left-0 w-0.5 h-full rounded-full" style={{ background: '#D4AF37' }} />
              <h4 className="font-bold text-sm mb-1 ml-2" style={{ color: '#D4AF37' }}>Cierre Sunrise Festival VIP</h4>
              <p className="text-xs text-muted-foreground ml-2 mb-2">Horizon Enterprise S.L.</p>
              <p className="text-xs text-muted-foreground ml-2">📅 5 Agosto, 02:00h - 05:00h</p>
              <p className="text-xs text-muted-foreground ml-2">📍 Stage Principal (Ibiza)</p>
            </div>
          </div>

          {/* Notification preferences */}
          <div className="glass-panel p-4">
            <h3 className="text-sm font-bold mb-3">Preferencias de alertas</h3>
            <div className="space-y-3">
              {[
                { label: '24h antes del evento', active: notificationsEnabled },
                { label: '1h antes del evento', active: notificationsEnabled },
                { label: 'Cambios de horario', active: true },
                { label: 'Nuevos bolos asignados', active: true },
              ].map(n => (
                <div key={n.label} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{n.label}</span>
                  <div className="w-8 h-4 rounded-full transition-all cursor-pointer"
                    style={{ background: n.active ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.1)' }}>
                    <div className="w-3.5 h-3.5 rounded-full transition-all mt-[1px]"
                      style={{ background: n.active ? '#D4AF37' : '#555', marginLeft: n.active ? '17px' : '1px' }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3 pt-3" style={{ borderTop: '1px solid var(--nightlife-border)' }}>
              ⚡ Los suscriptores Pro/Business reciben alertas urgentes antes que los demás.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
