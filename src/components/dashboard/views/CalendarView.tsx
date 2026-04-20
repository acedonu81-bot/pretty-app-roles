import { useState, useEffect } from 'react';
import { Bell, Clock, Calendar as CalendarIcon, Plus, Trash2, Check, RefreshCw, MapPin } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const MONTH_NAMES_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DAY_LABELS = ['LUN','MAR','MIÉ','JUE','VIE','SÁB','DOM'];

interface CalEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  location: string;
  notes: string;
}

function buildMonthGrid(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const startOffset = (firstDay === 0 ? 6 : firstDay - 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const cells: { day: number; currentMonth: boolean }[] = [];
  for (let i = startOffset - 1; i >= 0; i--) cells.push({ day: daysInPrevMonth - i, currentMonth: false });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, currentMonth: true });
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) cells.push({ day: d, currentMonth: false });
  return cells;
}

const CalendarView = () => {
  const profile = useProfile();
  const { user } = useAuth();
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [gcalConnected, setGcalConnected] = useState(false);
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', date: '', location: '', notes: '' });
  const [selectedDay, setSelectedDay] = useState<{ day: number; month: number; year: number } | null>(null);

  const storageKey = `xpeak_events_${user?.id ?? 'guest'}`;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setEvents(JSON.parse(saved));
    } catch {}
  }, [storageKey]);

  const saveEvents = (evs: CalEvent[]) => {
    setEvents(evs);
    localStorage.setItem(storageKey, JSON.stringify(evs));
  };

  const addEvent = () => {
    if (!form.title.trim() || !form.date) { toast.error('Título y fecha obligatorios'); return; }
    const ev: CalEvent = { id: Date.now().toString(), title: form.title.trim(), date: form.date, location: form.location.trim(), notes: form.notes.trim() };
    saveEvents([...events, ev]);
    setForm({ title: '', date: '', location: '', notes: '' });
    setShowForm(false);
    toast.success('Evento añadido al calendario');
  };

  const deleteEvent = (id: string) => {
    saveEvents(events.filter(e => e.id !== id));
    toast.info('Evento eliminado');
  };

  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); };
  const goToToday = () => { setViewYear(today.getFullYear()); setViewMonth(today.getMonth()); };

  const cells = buildMonthGrid(viewYear, viewMonth);

  const isToday = (day: number, cur: boolean) => cur && day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

  const eventsOnDay = (day: number, cur: boolean) => {
    if (!cur) return [];
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    return events.filter(e => e.date === dateStr);
  };

  const upcomingEvents = [...events]
    .filter(e => e.date >= today.toISOString().slice(0, 10))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  const fmtDate = (d: string) => new Date(d + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

  const toggleNotifications = () => {
    setNotificationsEnabled(p => !p);
    toast[!notificationsEnabled ? 'success' : 'info'](!notificationsEnabled ? 'Alertas activadas' : 'Alertas desactivadas');
  };

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold mb-1"><span className="text-gradient">Calendario</span></h2>
          <p className="text-base text-muted-foreground">Tu agenda de bolos y eventos.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={toggleNotifications}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all"
            style={{ background: notificationsEnabled ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.03)', border: notificationsEnabled ? '1px solid rgba(212,175,55,0.3)' : '1px solid var(--nightlife-border)', color: notificationsEnabled ? '#D4AF37' : '#8E8EA0' }}>
            <Bell size={15} /> {notificationsEnabled ? 'Alertas ON' : 'Alertas'}
          </button>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all hover:scale-105"
            style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
            <Plus size={15} /> Añadir bolo
          </button>
        </div>
      </div>

      {/* Google Calendar banner */}
      {!gcalConnected && (
        <div className="glass-panel p-4 mb-5 flex items-center justify-between gap-4"
          style={{ border: '1px solid rgba(66,133,244,0.25)', background: 'rgba(66,133,244,0.04)' }}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(66,133,244,0.12)' }}>
              <CalendarIcon size={16} style={{ color: '#4285F4' }} />
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: '#4285F4' }}>Sincronizar con Google Calendar</p>
              <p className="text-xs text-muted-foreground">Añade tus bolos a tu agenda personal.</p>
            </div>
          </div>
          <button onClick={() => { window.open('https://calendar.google.com/calendar/r/settings/addcalendar', '_blank'); setGcalConnected(true); toast.success('Abriendo Google Calendar'); }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all hover:scale-[1.02] flex-shrink-0"
            style={{ background: '#4285F4', color: '#fff' }}>
            <RefreshCw size={12} /> Conectar
          </button>
        </div>
      )}
      {gcalConnected && (
        <div className="glass-panel p-3 mb-5 flex items-center gap-3" style={{ border: '1px solid rgba(34,197,94,0.25)' }}>
          <Check size={14} style={{ color: '#22c55e' }} />
          <p className="text-xs font-bold" style={{ color: '#22c55e' }}>Google Calendar conectado.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
        {/* Calendar grid */}
        <div className="glass-panel p-5">
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center gap-3">
              <h3 className="text-base font-bold">{MONTH_NAMES_ES[viewMonth]} {viewYear}</h3>
              {(viewMonth !== today.getMonth() || viewYear !== today.getFullYear()) && (
                <button onClick={goToToday} className="text-xs px-2 py-0.5 rounded font-bold"
                  style={{ background: 'rgba(212,175,55,0.12)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.25)' }}>
                  Hoy
                </button>
              )}
            </div>
            <div className="flex gap-1.5">
              <button onClick={prevMonth} className="w-8 h-8 rounded flex items-center justify-center text-muted-foreground hover:bg-white/5 transition-colors">←</button>
              <button onClick={nextMonth} className="w-8 h-8 rounded flex items-center justify-center text-muted-foreground hover:bg-white/5 transition-colors">→</button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground font-bold mb-2">
            {DAY_LABELS.map(d => <div key={d}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-sm">
            {cells.map((cell, i) => {
              const tod = isToday(cell.day, cell.currentMonth);
              const evs = eventsOnDay(cell.day, cell.currentMonth);
              return (
                <div key={i}
                  className={`py-2 rounded relative transition-all ${!cell.currentMonth ? 'text-white/15' : 'hover:bg-white/5 cursor-pointer'}`}
                  style={{
                    background: tod ? 'rgba(212,175,55,0.15)' : evs.length > 0 ? 'rgba(212,175,55,0.05)' : 'rgba(255,255,255,0.02)',
                    border: tod ? '1px solid rgba(212,175,55,0.5)' : evs.length > 0 ? '1px solid rgba(212,175,55,0.25)' : '1px solid transparent',
                    color: tod ? '#D4AF37' : undefined,
                    fontWeight: tod || evs.length > 0 ? 700 : undefined,
                  }}>
                  {cell.day}
                  {evs.length > 0 && cell.currentMonth && (
                    <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                      {evs.slice(0, 3).map((_, idx) => (
                        <div key={idx} className="w-1 h-1 rounded-full" style={{ background: '#D4AF37' }} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          {/* Upcoming events */}
          <div className="glass-panel p-4">
            <h3 className="text-sm font-bold mb-3">Próximos bolos ({upcomingEvents.length})</h3>
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-6">
                <CalendarIcon size={24} className="mx-auto mb-2" style={{ color: 'rgba(255,255,255,0.1)' }} />
                <p className="text-xs text-muted-foreground">Sin eventos próximos.</p>
                <button onClick={() => setShowForm(true)}
                  className="mt-3 text-xs font-bold px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                  style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }}>
                  + Añadir primer bolo
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {upcomingEvents.map(ev => (
                  <div key={ev.id} className="p-3 rounded-lg relative" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
                    <div className="absolute top-0 left-0 w-0.5 h-full rounded-full" style={{ background: '#D4AF37' }} />
                    <div className="flex items-start justify-between gap-2 ml-2">
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate" style={{ color: '#D4AF37' }}>{ev.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{fmtDate(ev.date)}</p>
                        {ev.location && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <MapPin size={10} /> {ev.location}
                          </p>
                        )}
                      </div>
                      <button onClick={() => deleteEvent(ev.id)}
                        className="p-1 rounded flex-shrink-0 hover:scale-110 transition-all"
                        style={{ color: 'rgba(255,85,85,0.5)' }}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Alert prefs */}
          <div className="glass-panel p-4">
            <h3 className="text-sm font-bold mb-3">Alertas</h3>
            <div className="space-y-2.5">
              {['24h antes del evento', '1h antes del evento', 'Cambios de horario', 'Nuevos bolos'].map(n => (
                <div key={n} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{n}</span>
                  <div className="w-7 h-3.5 rounded-full transition-all cursor-pointer"
                    style={{ background: notificationsEnabled ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.1)' }}>
                    <div className="w-3 h-3 rounded-full transition-all mt-[1px]"
                      style={{ background: notificationsEnabled ? '#D4AF37' : '#555', marginLeft: notificationsEnabled ? '15px' : '1px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add event modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative w-full max-w-sm glass-panel p-6 animate-[fadeIn_0.2s_ease]" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-bold mb-4">Añadir bolo / evento</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Título *</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Ej: Sala Razzmatazz — Cierre" className="nightlife-input text-sm w-full" maxLength={80} />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Fecha *</label>
                <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  className="nightlife-input text-sm w-full" style={{ colorScheme: 'dark' }} />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Lugar</label>
                <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                  placeholder="Ej: Madrid, Sala X" className="nightlife-input text-sm w-full" maxLength={80} />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Notas</label>
                <input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Cache, horario, contacto..." className="nightlife-input text-sm w-full" maxLength={200} />
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--nightlife-border)', color: '#8E8EA0' }}>
                Cancelar
              </button>
              <button onClick={addEvent}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-[1.02]"
                style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
