import { useState, useEffect, useCallback } from 'react';
import { Bell, Calendar as CalendarIcon, Plus, Trash2, MapPin, ExternalLink, Download, EyeOff, Eye } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
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
  const ALERT_KEYS = ['24h antes del evento', '1h antes del evento', 'Cambios de horario', 'Nuevos bolos'] as const;
  const [alertPrefs, setAlertPrefs] = useState<Record<string, boolean>>(
    Object.fromEntries(ALERT_KEYS.map(k => [k, false]))
  );
  const notificationsEnabled = Object.values(alertPrefs).some(Boolean);
  const [, setGcalConnected] = useState(false);
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', date: '', location: '', notes: '' });
  const [selectedDay, setSelectedDay] = useState<{ day: number; month: number; year: number } | null>(null);
  const [blockedDates, setBlockedDates] = useState<Set<string>>(new Set());
  const [availMode, setAvailMode] = useState(false);

  const storageKey = `xpeak_events_${user?.id ?? 'guest'}`;
  const alertsKey = `xpeak_alerts_${user?.id ?? 'guest'}`;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(alertsKey);
      if (saved) setAlertPrefs(prev => ({ ...prev, ...JSON.parse(saved) }));
    } catch {}
  }, [alertsKey]);

  const toggleAlert = (key: string) => {
    setAlertPrefs(prev => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem(alertsKey, JSON.stringify(next));
      toast[next[key] ? 'success' : 'info'](`${key}: ${next[key] ? 'activada' : 'desactivada'}`);
      return next;
    });
  };

  // Botón del header: activa o desactiva TODAS las alertas a la vez.
  const toggleAllAlerts = () => {
    const turnOn = !notificationsEnabled;
    const next = Object.fromEntries(ALERT_KEYS.map(k => [k, turnOn]));
    setAlertPrefs(next);
    localStorage.setItem(alertsKey, JSON.stringify(next));
    toast[turnOn ? 'success' : 'info'](turnOn ? 'Todas las alertas activadas' : 'Alertas desactivadas');
  };

  const fetchBlocked = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('availability')
      .select('blocked_date')
      .eq('user_id', user.id);
    setBlockedDates(new Set((data ?? []).map((r: any) => r.blocked_date)));
  }, [user]);

  useEffect(() => { fetchBlocked(); }, [fetchBlocked]);

  const toggleBlocked = async (dateStr: string) => {
    if (!user) return;
    if (blockedDates.has(dateStr)) {
      await supabase.from('availability').delete().eq('user_id', user.id).eq('blocked_date', dateStr);
      setBlockedDates(prev => { const s = new Set(prev); s.delete(dateStr); return s; });
      toast.info('Día marcado como disponible');
    } else {
      await supabase.from('availability').insert({ user_id: user.id, blocked_date: dateStr });
      setBlockedDates(prev => new Set(prev).add(dateStr));
      toast.success('Día marcado como no disponible');
    }
  };

  // true = la tabla calendar_events existe y es usable; false = aún no → fallback localStorage.
  const [remoteOk, setRemoteOk] = useState(true);

  const mapRow = (r: any): CalEvent => ({
    id: r.id, title: r.title, date: r.event_date,
    location: r.location ?? '', notes: r.notes ?? '',
  });

  const loadFromLocal = useCallback(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setEvents(JSON.parse(saved));
    } catch {}
  }, [storageKey]);

  // Migración one-time: sube los eventos que quedaran en localStorage a Supabase.
  const migrateLocalToRemote = useCallback(async () => {
    if (!user) return;
    const migratedKey = `${storageKey}_migrated`;
    if (localStorage.getItem(migratedKey)) return;
    try {
      const saved = localStorage.getItem(storageKey);
      const local: CalEvent[] = saved ? JSON.parse(saved) : [];
      if (local.length) {
        await supabase.from('calendar_events').insert(
          local.map(e => ({ user_id: user.id, title: e.title, event_date: e.date, location: e.location || null, notes: e.notes || null }))
        );
      }
      localStorage.setItem(migratedKey, '1');
    } catch { /* si falla la migración, no bloquea */ }
  }, [user, storageKey]);

  const fetchEvents = useCallback(async () => {
    if (!user) { loadFromLocal(); return; }
    const { data, error } = await supabase
      .from('calendar_events')
      .select('id, title, event_date, location, notes')
      .eq('user_id', user.id)
      .order('event_date', { ascending: true });
    if (error) {
      // Tabla aún no creada → modo localStorage para no romper.
      setRemoteOk(false);
      loadFromLocal();
      return;
    }
    setRemoteOk(true);
    await migrateLocalToRemote();
    const { data: data2 } = await supabase
      .from('calendar_events')
      .select('id, title, event_date, location, notes')
      .eq('user_id', user.id)
      .order('event_date', { ascending: true });
    setEvents(((data2 ?? data) as any[]).map(mapRow));
  }, [user, loadFromLocal, migrateLocalToRemote]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const addEvent = async () => {
    if (!form.title.trim() || !form.date) { toast.error('Título y fecha obligatorios'); return; }
    const base = { title: form.title.trim(), date: form.date, location: form.location.trim(), notes: form.notes.trim() };

    if (user && remoteOk) {
      const { data, error } = await supabase.from('calendar_events')
        .insert({ user_id: user.id, title: base.title, event_date: base.date, location: base.location || null, notes: base.notes || null })
        .select('id, title, event_date, location, notes').single();
      if (error) { toast.error('Error al guardar el evento'); return; }
      setEvents(prev => [...prev, mapRow(data)].sort((a, b) => a.date.localeCompare(b.date)));
    } else {
      const ev: CalEvent = { id: Date.now().toString(), ...base };
      const next = [...events, ev];
      setEvents(next);
      localStorage.setItem(storageKey, JSON.stringify(next));
    }
    setForm({ title: '', date: '', location: '', notes: '' });
    setShowForm(false);
    toast.success('Evento añadido al calendario');
  };

  const deleteEvent = async (id: string) => {
    if (user && remoteOk) {
      const { error } = await supabase.from('calendar_events').delete().eq('id', id).eq('user_id', user.id);
      if (error) { toast.error('Error al eliminar'); return; }
      setEvents(prev => prev.filter(e => e.id !== id));
    } else {
      const next = events.filter(e => e.id !== id);
      setEvents(next);
      localStorage.setItem(storageKey, JSON.stringify(next));
    }
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

  // Para eventos de día completo, la fecha final es EXCLUSIVA (día siguiente).
  const nextDayStr = (date: string) => {
    const d = new Date(date + 'T12:00:00');
    d.setDate(d.getDate() + 1);
    return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  };

  const getGoogleCalURL = (ev: CalEvent) => {
    const d = ev.date.replace(/-/g, '');
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: ev.title,
      dates: `${d}/${nextDayStr(ev.date)}`,
      details: ev.notes || 'Evento añadido desde XPEAK',
      location: ev.location || '',
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  const downloadICS = (ev: CalEvent) => {
    const d = ev.date.replace(/-/g, '');
    const uid = `xpeak-${ev.id}@xpeak.es`;
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//XPEAK//Nightlife Pro//ES',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `DTSTART;VALUE=DATE:${d}`,
      `DTEND;VALUE=DATE:${nextDayStr(ev.date)}`,
      `SUMMARY:${ev.title}`,
      ev.location ? `LOCATION:${ev.location}` : '',
      ev.notes   ? `DESCRIPTION:${ev.notes}` : '',
      `UID:${uid}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].filter(Boolean).join('\r\n');
    const blob = new Blob([lines], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${ev.title.replace(/[^a-z0-9áéíóúüñ]/gi, '_')}.ics`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Archivo .ics descargado — ábrelo para añadir al calendario');
  };

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="mb-6 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-2xl font-bold mb-1"><span className="text-gradient">Calendario</span></h2>
          <p className="text-sm text-muted-foreground">Tu agenda de bolos y eventos.</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button onClick={toggleAllAlerts}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all"
            style={{ background: notificationsEnabled ? 'rgba(212,175,55,0.12)' : 'rgba(0,0,0,0.03)', border: notificationsEnabled ? '1px solid rgba(212,175,55,0.3)' : '1px solid var(--nightlife-border)', color: notificationsEnabled ? '#D4AF37' : '#3d3d4e' }}>
            <Bell size={13} /> <span className="hidden sm:inline">{notificationsEnabled ? 'Alertas ON' : 'Alertas'}</span>
          </button>
          <button onClick={() => setAvailMode(m => !m)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all"
            style={{ background: availMode ? 'rgba(255,95,86,0.12)' : 'rgba(0,0,0,0.03)', border: availMode ? '1px solid rgba(255,95,86,0.3)' : '1px solid var(--nightlife-border)', color: availMode ? '#ff5f56' : '#3d3d4e' }}>
            {availMode ? <EyeOff size={13} /> : <Eye size={13} />} <span className="hidden sm:inline">{availMode ? 'Editando' : 'Disponibilidad'}</span>
          </button>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all hover:scale-105"
            style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
            <Plus size={13} /> <span className="hidden sm:inline">Añadir</span> bolo
          </button>
        </div>
      </div>

      {/* Calendar export hint */}
      <div className="glass-panel p-4 mb-5 flex items-center gap-3"
        style={{ border: '1px solid rgba(66,133,244,0.18)', background: 'rgba(66,133,244,0.03)' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(66,133,244,0.1)' }}>
          <CalendarIcon size={15} style={{ color: '#4285F4' }} />
        </div>
        <p className="text-xs text-muted-foreground flex-1">
          Añade cada bolo directamente a <strong style={{ color: '#1a1a1a' }}>Google Calendar</strong> o <strong style={{ color: '#1a1a1a' }}>Apple Calendar</strong> usando los botones de exportación en cada evento.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
        {/* Calendar grid */}
        <div className="glass-panel p-5">
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center gap-3">
              <h3 className="text-base font-bold">{MONTH_NAMES_ES[viewMonth]} {viewYear}</h3>
              {(viewMonth !== today.getMonth() || viewYear !== today.getFullYear()) && (
                <button onClick={goToToday} className="text-xs px-2 py-0.5 rounded font-bold"
                  style={{ background: 'rgba(212,175,55,0.12)', color: '#8A6D0F', border: '1px solid rgba(212,175,55,0.25)' }}>
                  Hoy
                </button>
              )}
            </div>
            <div className="flex gap-1.5">
              <button onClick={prevMonth} className="w-8 h-8 rounded flex items-center justify-center text-muted-foreground hover:bg-black/5 transition-colors">←</button>
              <button onClick={nextMonth} className="w-8 h-8 rounded flex items-center justify-center text-muted-foreground hover:bg-black/5 transition-colors">→</button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground font-bold mb-2">
            {DAY_LABELS.map(d => <div key={d}>{d}</div>)}
          </div>
          {availMode && (
            <div className="mb-3 px-3 py-2 rounded-lg text-xs" style={{ background: 'rgba(255,95,86,0.06)', border: '1px solid rgba(255,95,86,0.15)', color: 'rgba(255,95,86,0.7)' }}>
              Pulsa un día para marcarlo como <strong>no disponible</strong>. Los empresarios verán tu disponibilidad en tu perfil público.
            </div>
          )}
          <div className="grid grid-cols-7 gap-1 text-center text-sm">
            {cells.map((cell, i) => {
              const tod = isToday(cell.day, cell.currentMonth);
              const evs = eventsOnDay(cell.day, cell.currentMonth);
              const dateStr = cell.currentMonth ? `${viewYear}-${String(viewMonth + 1).padStart(2,'0')}-${String(cell.day).padStart(2,'0')}` : '';
              const isBlocked = cell.currentMonth && blockedDates.has(dateStr);
              return (
                <div key={i}
                  onClick={() => { if (availMode && cell.currentMonth) toggleBlocked(dateStr); }}
                  className={`py-2 rounded relative transition-all ${!cell.currentMonth ? 'text-black/15' : 'hover:bg-black/5 cursor-pointer'}`}
                  style={{
                    background: isBlocked ? 'rgba(255,95,86,0.12)' : tod ? 'rgba(212,175,55,0.15)' : evs.length > 0 ? 'rgba(212,175,55,0.05)' : 'rgba(0,0,0,0.02)',
                    border: isBlocked ? '1px solid rgba(255,95,86,0.35)' : tod ? '1px solid rgba(212,175,55,0.5)' : evs.length > 0 ? '1px solid rgba(212,175,55,0.25)' : '1px solid transparent',
                    color: isBlocked ? '#ff5f56' : tod ? '#D4AF37' : undefined,
                    fontWeight: tod || evs.length > 0 || isBlocked ? 700 : undefined,
                    textDecoration: isBlocked ? 'line-through' : undefined,
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
                <CalendarIcon size={24} className="mx-auto mb-2" style={{ color: 'rgba(0,0,0,0.08)' }} />
                <p className="text-xs text-muted-foreground">Sin eventos próximos.</p>
                <button onClick={() => setShowForm(true)}
                  className="mt-3 text-xs font-bold px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                  style={{ background: 'rgba(212,175,55,0.1)', color: '#8A6D0F', border: '1px solid rgba(212,175,55,0.2)' }}>
                  + Añadir primer bolo
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {upcomingEvents.map(ev => (
                  <div key={ev.id} className="p-3 rounded-lg relative" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
                    <div className="absolute top-0 left-0 w-0.5 h-full rounded-full" style={{ background: '#D4AF37' }} />
                    <div className="ml-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate" style={{ color: '#8A6D0F' }}>{ev.title}</p>
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
                      <div className="flex gap-1.5 mt-2">
                        <a href={getGoogleCalURL(ev)} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 px-2 py-1 rounded text-[0.65rem] font-bold transition-all hover:scale-105"
                          style={{ background: 'rgba(66,133,244,0.1)', border: '1px solid rgba(66,133,244,0.2)', color: '#4285F4' }}>
                          <ExternalLink size={9} /> Google Cal
                        </a>
                        <button onClick={() => downloadICS(ev)}
                          className="flex items-center gap-1 px-2 py-1 rounded text-[0.65rem] font-bold transition-all hover:scale-105"
                          style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)', color: '#3d3d4e' }}>
                          <Download size={9} /> Apple / .ics
                        </button>
                      </div>
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
              {ALERT_KEYS.map(n => {
                const on = alertPrefs[n];
                return (
                  <div key={n} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{n}</span>
                    <button onClick={() => toggleAlert(n)}
                      aria-label={`Alerta ${n}: ${on ? 'activada' : 'desactivada'}`}
                      className="w-7 h-3.5 rounded-full transition-all cursor-pointer flex-shrink-0"
                      style={{ background: on ? 'rgba(212,175,55,0.3)' : 'rgba(0,0,0,0.08)' }}>
                      <div className="w-3 h-3 rounded-full transition-all mt-[1px]"
                        style={{ background: on ? '#C9A227' : '#999', marginLeft: on ? '15px' : '1px' }} />
                    </button>
                  </div>
                );
              })}
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
                  className="nightlife-input text-sm w-full" style={{ colorScheme: 'light' }} />
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
                style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid var(--nightlife-border)', color: '#3d3d4e' }}>
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
