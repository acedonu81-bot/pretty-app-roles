import { useState, useEffect } from 'react';
import { Bell, Clock, Calendar as CalendarIcon, ExternalLink, RefreshCw, Check } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { toast } from 'sonner';

const roleImages: Record<string, string> = {
  dj: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
  staff: 'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
  makeup: 'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
  media: 'https://images.pexels.com/photos/3379934/pexels-photo-3379934.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
  design: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
  empresario: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
  ambassador: 'https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
};

const MONTH_NAMES_ES = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
];

const DAY_LABELS = ['LUN','MAR','MIÉ','JUE','VIE','SÁB','DOM'];

// Demo event: next Saturday after today
function getNextSaturday(): Date {
  const d = new Date();
  const day = d.getDay(); // 0=Sun, 6=Sat
  const daysUntilSat = day === 6 ? 7 : (6 - day);
  d.setDate(d.getDate() + daysUntilSat);
  d.setHours(2, 0, 0, 0);
  return d;
}

/** Returns array of {date, month} cells for a month grid (Mon-start, 42 cells) */
function buildMonthGrid(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  // Convert to Mon-start: Mon=0, Sun=6
  const startOffset = (firstDay === 0 ? 6 : firstDay - 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells: { day: number; currentMonth: boolean }[] = [];

  for (let i = startOffset - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, currentMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, currentMonth: true });
  }
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, currentMonth: false });
  }
  return cells;
}

const CalendarView = () => {
  const profile = useProfile();
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [gcalConnected, setGcalConnected] = useState(false);
  const [showGcalModal, setShowGcalModal] = useState(false);
  const [countdown, setCountdown] = useState('');

  const nextEvent = getNextSaturday();

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const diff = nextEvent.getTime() - now.getTime();
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

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const goToToday = () => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
  };

  const cells = buildMonthGrid(viewYear, viewMonth);

  const isToday = (day: number, currentMonth: boolean) =>
    currentMonth &&
    day === today.getDate() &&
    viewMonth === today.getMonth() &&
    viewYear === today.getFullYear();

  const isEventDay = (day: number, currentMonth: boolean) =>
    currentMonth &&
    day === nextEvent.getDate() &&
    viewMonth === nextEvent.getMonth() &&
    viewYear === nextEvent.getFullYear();

  const addToGoogleCalendar = () => {
    const start = nextEvent.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endDate = new Date(nextEvent.getTime() + 3 * 60 * 60 * 1000);
    const end = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const title = encodeURIComponent('Cierre Sunrise Festival VIP');
    const details = encodeURIComponent('Evento vía XPEAK');
    const location = encodeURIComponent('Stage Principal (Ibiza)');
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
    window.open(url, '_blank');
    toast.success('Abriendo Google Calendar para confirmar el evento.');
  };

  const handleConnectGcal = () => {
    setShowGcalModal(true);
  };

  const confirmGcalConnect = () => {
    // Open Google Calendar so user can subscribe via webcal/iCal
    // In production this would trigger OAuth2; here we guide the user
    const icalUrl = `webcal://calendar.google.com/calendar/ical/es.es%23holiday%40group.v.calendar.google.com/public/basic.ics`;
    window.open('https://calendar.google.com/calendar/r/settings/addcalendar', '_blank');
    setGcalConnected(true);
    setShowGcalModal(false);
    toast.success('¡Redirigiendo a Google Calendar para conectar tu agenda!');
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(prev => !prev);
    toast[!notificationsEnabled ? 'success' : 'info'](
      !notificationsEnabled
        ? 'Notificaciones activadas. Te avisaremos antes de tus eventos.'
        : 'Notificaciones desactivadas.'
    );
  };

  const roleImg = roleImages[profile.role ?? 'dj'] || roleImages.dj;

  const eventDateStr = nextEvent.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });

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

      {/* Google Calendar sync banner */}
      {!gcalConnected ? (
        <div className="glass-panel p-4 mb-5 flex items-center justify-between gap-4"
          style={{ border: '1px solid rgba(66,133,244,0.25)', background: 'rgba(66,133,244,0.04)' }}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(66,133,244,0.12)' }}>
              <CalendarIcon size={18} style={{ color: '#4285F4' }} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold" style={{ color: '#4285F4' }}>¿Combinar con tu Google Calendar personal?</p>
              <p className="text-xs text-muted-foreground truncate">Añade tus bolos de XPEAK directamente a tu agenda de Google.</p>
            </div>
          </div>
          <button onClick={handleConnectGcal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all hover:scale-[1.02] flex-shrink-0"
            style={{ background: '#4285F4', color: '#fff' }}>
            <RefreshCw size={12} /> Conectar
          </button>
        </div>
      ) : (
        <div className="glass-panel p-3 mb-5 flex items-center gap-3"
          style={{ border: '1px solid rgba(34,197,94,0.25)', background: 'rgba(34,197,94,0.04)' }}>
          <Check size={16} style={{ color: '#22c55e' }} />
          <p className="text-xs font-bold" style={{ color: '#22c55e' }}>Google Calendar conectado — tus eventos se sincronizan automáticamente.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
        <div className="flex flex-col gap-5">
          {/* Calendar grid */}
          <div className="glass-panel p-5">
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-3">
                <h3 className="text-base font-bold">
                  {MONTH_NAMES_ES[viewMonth]} {viewYear}
                </h3>
                {(viewMonth !== today.getMonth() || viewYear !== today.getFullYear()) && (
                  <button onClick={goToToday}
                    className="text-[0.6rem] px-2 py-0.5 rounded font-bold transition-all hover:opacity-80"
                    style={{ background: 'rgba(212,175,55,0.12)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.25)' }}>
                    Hoy
                  </button>
                )}
              </div>
              <div className="flex gap-1.5">
                <button onClick={prevMonth}
                  className="w-8 h-8 rounded flex items-center justify-center text-muted-foreground hover:bg-white/5 transition-colors text-base">
                  ←
                </button>
                <button onClick={nextMonth}
                  className="w-8 h-8 rounded flex items-center justify-center text-muted-foreground hover:bg-white/5 transition-colors text-base">
                  →
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1.5 text-center text-xs text-muted-foreground font-bold mb-2">
              {DAY_LABELS.map(d => <div key={d}>{d}</div>)}
            </div>

            <div className="grid grid-cols-7 gap-1.5 text-center text-sm">
              {cells.map((cell, i) => {
                const today_ = isToday(cell.day, cell.currentMonth);
                const event_ = isEventDay(cell.day, cell.currentMonth);
                return (
                  <div key={i}
                    className={`py-2.5 rounded relative cursor-pointer transition-all ${!cell.currentMonth ? 'text-white/15' : 'hover:bg-white/5'}`}
                    style={{
                      background: today_ ? 'rgba(212,175,55,0.15)' : event_ ? 'rgba(212,175,55,0.06)' : 'rgba(255,255,255,0.02)',
                      border: today_
                        ? '1px solid rgba(212,175,55,0.5)'
                        : event_
                          ? '1px solid rgba(212,175,55,0.3)'
                          : '1px solid transparent',
                      color: today_ ? '#D4AF37' : undefined,
                      fontWeight: today_ || event_ ? 700 : undefined,
                    }}>
                    {cell.day}
                    {event_ && cell.currentMonth && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full" style={{ background: '#D4AF37' }} />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex gap-4 mt-5 text-xs font-bold text-muted-foreground justify-center">
              <span className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#D4AF37', border: '1px solid rgba(212,175,55,0.5)' }} />
                Hoy / Confirmado
              </span>
              <span className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f56' }} />
                Pendiente
              </span>
            </div>
          </div>

          {/* Next Event Countdown */}
          <div className="glass-panel overflow-hidden" style={{ border: '1px solid rgba(212,175,55,0.2)' }}>
            <div className="relative h-32">
              <img src={roleImg} alt="Próximo evento" className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.3))' }} />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#D4AF37' }}>Próximo Evento</p>
                  <span className="text-[0.55rem] font-bold px-1.5 py-0.5 rounded"
                    style={{ background: 'rgba(212,175,55,0.2)', color: 'rgba(212,175,55,0.7)', border: '1px solid rgba(212,175,55,0.3)' }}>
                    DEMO
                  </span>
                </div>
                <h3 className="text-lg font-black">Cierre Sunrise Festival VIP</h3>
              </div>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CalendarIcon size={18} style={{ color: '#D4AF37' }} />
                <div>
                  <p className="text-sm font-bold">{eventDateStr}</p>
                  <p className="text-xs text-muted-foreground">Stage Principal (Ibiza)</p>
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
            <div className="px-4 pb-4 flex gap-2">
              <button onClick={addToGoogleCalendar}
                className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all hover:scale-[1.02]"
                style={{ background: 'rgba(66,133,244,0.1)', color: '#4285F4', border: '1px solid rgba(66,133,244,0.2)' }}>
                <ExternalLink size={12} /> Añadir a Google Calendar
              </button>
              {profile.subscription_tier !== 'free' && (
                <div className="text-xs font-bold px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5"
                  style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }}>
                  Alerta prioritaria
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="glass-panel p-4">
            <div className="flex justify-between items-center mb-3 pb-2" style={{ borderBottom: '1px solid var(--nightlife-border)' }}>
              <h3 className="text-sm font-bold">Próximo Bolo</h3>
              <span className="text-[0.55rem] font-bold px-1.5 py-0.5 rounded"
                style={{ background: 'rgba(212,175,55,0.1)', color: 'rgba(212,175,55,0.55)', border: '1px solid rgba(212,175,55,0.15)' }}>
                DEMO
              </span>
            </div>
            <div className="p-3 rounded-lg relative" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.1)' }}>
              <div className="absolute top-0 left-0 w-0.5 h-full rounded-full" style={{ background: '#D4AF37' }} />
              <h4 className="font-bold text-sm mb-1 ml-2" style={{ color: '#D4AF37' }}>Cierre Sunrise Festival VIP</h4>
              <p className="text-xs text-muted-foreground ml-2 mb-2">Horizon Enterprise S.L.</p>
              <p className="text-xs text-muted-foreground ml-2">{eventDateStr}</p>
              <p className="text-xs text-muted-foreground ml-2">Stage Principal (Ibiza)</p>
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
              Los suscriptores Pro/Business reciben alertas urgentes antes que los demás.
            </p>
          </div>
        </div>
      </div>

      {/* Google Calendar modal */}
      {showGcalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setShowGcalModal(false)}>
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }} />
          <div
            className="relative w-full max-w-sm rounded-2xl p-6 flex flex-col gap-4"
            style={{ background: '#0d0d0d', border: '1px solid rgba(66,133,244,0.3)' }}
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(66,133,244,0.12)' }}>
                <CalendarIcon size={20} style={{ color: '#4285F4' }} />
              </div>
              <div>
                <p className="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground">Integración</p>
                <h3 className="text-base font-black">Google Calendar Personal</h3>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Conecta tu Google Calendar para que tus bolos de XPEAK aparezcan automáticamente en tu agenda personal.
            </p>

            <div className="space-y-2">
              {[
                'Tus eventos de XPEAK aparecen en Google Calendar',
                'Recordatorios automáticos en tu móvil',
                'Sincronización bidireccional de disponibilidad',
              ].map(f => (
                <div key={f} className="flex items-start gap-2">
                  <Check size={13} style={{ color: '#4285F4', flexShrink: 0, marginTop: 2 }} />
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.8)' }}>{f}</span>
                </div>
              ))}
            </div>

            <button
              onClick={confirmGcalConnect}
              className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]"
              style={{ background: '#4285F4', color: '#fff' }}>
              Abrir Google Calendar y conectar
            </button>
            <button onClick={() => setShowGcalModal(false)}
              className="text-xs text-muted-foreground text-center hover:text-foreground transition-colors">
              Ahora no
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
