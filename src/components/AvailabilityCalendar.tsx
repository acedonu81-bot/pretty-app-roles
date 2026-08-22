import { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const DAY_LABELS = ['L','M','X','J','V','S','D'];
const MONTH_NAMES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

function buildGrid(year: number, month: number) {
  const first = new Date(year, month, 1).getDay();
  const offset = first === 0 ? 6 : first - 1;
  const days = new Date(year, month + 1, 0).getDate();
  const cells: { day: number; current: boolean }[] = [];
  const prevDays = new Date(year, month, 0).getDate();
  for (let i = offset - 1; i >= 0; i--) cells.push({ day: prevDays - i, current: false });
  for (let d = 1; d <= days; d++) cells.push({ day: d, current: true });
  while (cells.length < 42) cells.push({ day: cells.length - offset - days + 1, current: false });
  return cells;
}

const AvailabilityCalendar = ({ userId }: { userId: string }) => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [blocked, setBlocked] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!userId) return;
    supabase
      .from('availability')
      .select('blocked_date')
      .eq('user_id', userId)
      .then(({ data }) => {
        setBlocked(new Set((data ?? []).map((r: any) => r.blocked_date)));
      });
  }, [userId]);

  const prev = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const next = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const cells = buildGrid(year, month);
  const todayStr = today.toISOString().slice(0, 10);

  return (
    <div className="mt-6">
      <h3 className="text-base font-black mb-3 flex items-center gap-2" style={{ color: '#222', fontFamily: 'Syne, sans-serif' }}>
        <Calendar size={16} style={{ color: '#D4AF37' }} />
        Disponibilidad
      </h3>
      <div className="rounded-2xl p-4" style={{ background: '#fafaf8', border: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="flex items-center justify-between mb-3">
          <button onClick={prev} className="w-6 h-6 rounded flex items-center justify-center hover:bg-black/5">
            <ChevronLeft size={14} style={{ color: '#333' }} />
          </button>
          <span className="text-xs font-bold" style={{ color: '#222' }}>
            {MONTH_NAMES[month]} {year}
          </span>
          <button onClick={next} className="w-6 h-6 rounded flex items-center justify-center hover:bg-black/5">
            <ChevronRight size={14} style={{ color: '#333' }} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-0.5 text-center mb-1">
          {DAY_LABELS.map(d => (
            <div key={d} className="text-[0.6rem] font-bold py-0.5" style={{ color: '#333' }}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-0.5 text-center">
          {cells.map((cell, i) => {
            const dateStr = cell.current ? `${year}-${String(month + 1).padStart(2,'0')}-${String(cell.day).padStart(2,'0')}` : '';
            const isBlocked = cell.current && blocked.has(dateStr);
            const isToday = dateStr === todayStr;
            const isPast = cell.current && dateStr < todayStr;
            const isAvailable = cell.current && !isBlocked && !isPast;
            return (
              <div key={i}
                className="w-full aspect-square flex items-center justify-center rounded text-[0.65rem]"
                style={{
                  color: !cell.current ? 'rgba(22,20,18,0.1)' : isBlocked ? 'rgba(255,95,86,0.5)' : isPast ? 'rgba(22,20,18,0.2)' : isToday ? '#D4AF37' : isAvailable ? 'rgba(34,197,94,0.8)' : '#222',
                  background: isBlocked ? 'rgba(255,95,86,0.06)' : isToday ? 'rgba(212,175,55,0.1)' : isAvailable ? 'rgba(34,197,94,0.05)' : 'transparent',
                  fontWeight: isToday || isBlocked ? 700 : 400,
                  textDecoration: isBlocked ? 'line-through' : undefined,
                  border: isToday ? '1px solid rgba(212,175,55,0.3)' : '1px solid transparent',
                }}>
                {cell.day}
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-4 mt-3 pt-2" style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: 'rgba(34,197,94,0.6)' }} />
            <span className="text-[0.6rem]" style={{ color: '#333' }}>Disponible</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: 'rgba(255,95,86,0.5)' }} />
            <span className="text-[0.6rem]" style={{ color: '#333' }}>No disponible</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
