import { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
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

interface AvailabilityCalendarProps {
  userId: string;
  mode?: 'edit' | 'view-request';
  onRequestDate?: (date: string) => void;
}

const AvailabilityCalendar = ({ userId, mode = 'edit', onRequestDate }: AvailabilityCalendarProps) => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [blocked, setBlocked] = useState<Set<string>>(new Set());
  const [showJump, setShowJump] = useState(false);

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
      <div className="rounded-2xl p-4" style={{
  background: '#fdfcfa',
  border: '1px solid rgba(0,0,0,0.06)',
  boxShadow: '0 12px 28px -14px rgba(20,16,8,0.16), 0 3px 8px -2px rgba(20,16,8,0.08)',
}}>
        <div className="flex items-center justify-between mb-3 relative">
          <button onClick={prev} aria-label="Mes anterior"
            className="w-11 h-11 -ml-2 rounded flex items-center justify-center hover:bg-black/5">
            <ChevronLeft size={18} style={{ color: '#222' }} />
          </button>
          <button onClick={() => setShowJump(o => !o)}
            className="flex items-center gap-1 text-xs font-bold px-3 py-2.5 rounded-lg hover:bg-black/5" style={{ color: '#111' }}>
            {MONTH_NAMES[month]} {year}
            <ChevronDown size={12} style={{ color: '#666', transform: showJump ? 'rotate(180deg)' : undefined }} />
          </button>
          <button onClick={next} aria-label="Mes siguiente"
            className="w-11 h-11 -mr-2 rounded flex items-center justify-center hover:bg-black/5">
            <ChevronRight size={18} style={{ color: '#222' }} />
          </button>

          {showJump && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-10 rounded-xl p-2 grid grid-cols-4 gap-1"
              style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', minWidth: 220 }}>
              {MONTH_NAMES.map((m, i) => (
                <button key={m}
                  onClick={() => { setMonth(i); setShowJump(false); }}
                  className="text-[0.7rem] font-bold py-1.5 rounded-lg hover:bg-black/5"
                  style={{ color: i === month ? '#8A6D0F' : '#333', background: i === month ? 'rgba(212,175,55,0.12)' : undefined }}>
                  {m}
                </button>
              ))}
              <div className="col-span-4 flex items-center justify-between mt-1 pt-1.5" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                <button onClick={() => setYear(y => y - 1)} className="text-xs font-bold px-2 py-1 rounded hover:bg-black/5" style={{ color: '#333' }}>‹</button>
                <span className="text-xs font-bold" style={{ color: '#111' }}>{year}</span>
                <button onClick={() => setYear(y => y + 1)} className="text-xs font-bold px-2 py-1 rounded hover:bg-black/5" style={{ color: '#333' }}>›</button>
              </div>
            </div>
          )}
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
            const isClickable = mode === 'view-request' && isAvailable;
            return (
              <div key={i}
                onClick={isClickable ? () => onRequestDate?.(dateStr) : undefined}
                className="w-full aspect-square flex items-center justify-center rounded text-[0.65rem] font-bold"
                style={{
                  cursor: isClickable ? 'pointer' : 'default',
                  color: !cell.current
                    ? 'rgba(22,20,18,0.22)'
                    : isBlocked ? '#fff'
                    : isPast ? 'rgba(22,20,18,0.35)'
                    : isToday ? '#33270a'
                    : isAvailable ? '#fff'
                    : '#222',
                  background: isBlocked
                    ? '#d94848'
                    : isToday ? '#D4AF37'
                    : isAvailable ? '#2fa561'
                    : 'transparent',
                  boxShadow: isBlocked
                    ? '0 4px 10px -3px rgba(196,45,45,0.35)'
                    : isToday ? '0 5px 12px -3px rgba(212,175,55,0.45)'
                    : isAvailable ? '0 4px 10px -3px rgba(21,140,74,0.4)'
                    : 'none',
                  textDecoration: isBlocked ? 'line-through' : undefined,
                }}>
                {cell.day}
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-4 mt-3 pt-2" style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#2fa561', boxShadow: '0 2px 5px rgba(21,140,74,0.4)' }} />
            <span className="text-[0.65rem] font-semibold" style={{ color: '#3a3626' }}>Disponible</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#d94848', boxShadow: '0 2px 5px rgba(196,45,45,0.35)' }} />
            <span className="text-[0.65rem] font-semibold" style={{ color: '#3a3626' }}>No disponible</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
