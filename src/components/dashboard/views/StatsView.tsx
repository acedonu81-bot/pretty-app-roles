import { useEffect, useState, useRef } from 'react';

const useCountUp = (target: number, duration = 900) => {
  const [value, setValue] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    if (target === prev.current) return;
    prev.current = target;
    if (target === 0) { setValue(0); return; }
    const start = Date.now();
    const from = value;
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(from + (target - from) * ease));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target]);
  return value;
};
import { Eye, MessageCircle, TrendingUp, Zap, BarChart2, CheckCircle } from 'lucide-react';

// ── SVG Donut Chart ─────────────────────────────────────────────────────────
interface DonutSegment { value: number; color: string; label: string; icon: string }

const DonutChart = ({ segments, size = 140 }: { segments: DonutSegment[]; size?: number }) => {
  const r = 38;
  const cx = 50; const cy = 50;
  const circumference = 2 * Math.PI * r;
  const total = segments.reduce((s, v) => s + (v.value || 0), 0);
  const isEmpty = total === 0;

  let cumulativeFraction = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
      <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
          {/* Track */}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="13" />

          {isEmpty ? (
            <circle cx={cx} cy={cy} r={r} fill="none"
              stroke="rgba(0,0,0,0.08)" strokeWidth="13"
              strokeDasharray={`${circumference * 0.5} ${circumference * 0.5}`}
              strokeDashoffset={0}
              strokeLinecap="round" />
          ) : segments.map((seg, i) => {
            const fraction = seg.value / total;
            const dashLen = fraction * circumference;
            const offset = circumference * (1 - cumulativeFraction);
            cumulativeFraction += fraction;
            if (fraction === 0) return null;
            return (
              <circle key={i}
                cx={cx} cy={cy} r={r}
                fill="none"
                stroke={seg.color}
                strokeWidth="13"
                strokeDasharray={`${dashLen - 1.5} ${circumference - dashLen + 1.5}`}
                strokeDashoffset={offset}
                strokeLinecap="butt"
                style={{ filter: `drop-shadow(0 0 4px ${seg.color}60)`, transition: 'stroke-dasharray 0.8s ease' }}
              />
            );
          })}
        </svg>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-black" style={{ color: 'rgba(22,20,18,0.88)', lineHeight: 1 }}>
            {isEmpty ? '—' : total > 999 ? `${(total / 1000).toFixed(1)}k` : total}
          </span>
          <span className="text-[0.7rem] font-bold uppercase tracking-widest" style={{ color: 'rgba(22,20,18,0.35)' }}>
            total
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-2.5 flex-1">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: seg.color, boxShadow: `0 0 5px ${seg.color}80` }} />
            <span className="text-xs text-muted-foreground flex-1">{seg.label}</span>
            <span className="text-xs font-black" style={{ color: isEmpty ? 'rgba(0,0,0,0.1)' : seg.color }}>
              {seg.value}
            </span>
            {!isEmpty && (
              <span className="text-[0.75rem]" style={{ color: 'rgba(0,0,0,0.1)', minWidth: 28, textAlign: 'right' }}>
                {Math.round((seg.value / total) * 100)}%
              </span>
            )}
          </div>
        ))}
        {isEmpty && (
          <p className="text-xs text-muted-foreground mt-1">Sin actividad registrada todavía.</p>
        )}
      </div>
    </div>
  );
};
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
const MONTH_LABELS = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

const StatsView = () => {
  const profile = useProfile();
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); // 0-indexed

  const [stats, setStats] = useState({ views: 0, messages: 0, bookings: 0, conversations: 0 });
  const [monthlyMessages, setMonthlyMessages] = useState<number[]>(Array(12).fill(0));
  const [monthlyConvs, setMonthlyConvs]       = useState<number[]>(Array(12).fill(0));
  const [loading, setLoading]                 = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      // ── 1. Basic stats ──────────────────────────────
      const [scoreRes, convsRes, bookingsRes] = await Promise.all([
        supabase.from('profiles').select('score').eq('user_id', user.id).maybeSingle(),
        supabase.from('conversations')
          .select('id', { count: 'exact', head: true })
          .or(`participant_a.eq.${user.id},participant_b.eq.${user.id}`),
        supabase.from('flash_bookings' as any)
          .select('id', { count: 'exact', head: true })
          .eq('professional_user_id', user.id),
      ]);

      // ── 2. My conversations ─────────────────────────
      const { data: myConvs } = await supabase.from('conversations')
        .select('id, created_at')
        .or(`participant_a.eq.${user.id},participant_b.eq.${user.id}`)
        .limit(200);

      const convIds = (myConvs ?? []).map(c => c.id);

      // ── 3. Total messages received ──────────────────
      let msgCount = 0;
      if (convIds.length > 0) {
        const { count } = await supabase.from('messages')
          .select('id', { count: 'exact', head: true })
          .in('conversation_id', convIds)
          .neq('sender_id', user.id);
        msgCount = count ?? 0;
      }

      // ── 4. Annual monthly breakdown ─────────────────
      const yearStart = `${currentYear}-01-01`;
      const yearEnd   = `${currentYear + 1}-01-01`;

      // Messages received per month this year
      const byMonthMsg  = Array(12).fill(0);
      const byMonthConv = Array(12).fill(0);

      if (convIds.length > 0) {
        const { data: yearMsgs } = await supabase.from('messages')
          .select('created_at')
          .in('conversation_id', convIds)
          .neq('sender_id', user.id)
          .gte('created_at', yearStart)
          .lt('created_at', yearEnd);

        (yearMsgs ?? []).forEach(m => {
          const month = new Date(m.created_at).getMonth();
          byMonthMsg[month] = (byMonthMsg[month] ?? 0) + 1;
        });
      }

      // Conversations started per month this year
      (myConvs ?? []).forEach(c => {
        const d = new Date(c.created_at);
        if (d.getFullYear() === currentYear) {
          byMonthConv[d.getMonth()] = (byMonthConv[d.getMonth()] ?? 0) + 1;
        }
      });

      setStats({
        views: (scoreRes.data?.score as number) ?? 0,
        messages: msgCount,
        bookings: bookingsRes.count ?? 0,
        conversations: convsRes.count ?? 0,
      });
      setMonthlyMessages(byMonthMsg);
      setMonthlyConvs(byMonthConv);
      setLoading(false);
    };
    load();
  }, [user]);

  const contactRate = stats.views > 0 ? Math.round((stats.conversations / stats.views) * 100) : 0;
  const animViews    = useCountUp(stats.views);
  const animMessages = useCountUp(stats.messages);
  const animBookings = useCountUp(stats.bookings);
  const animRate     = useCountUp(contactRate);

  // Max value for bar chart scaling
  const maxMsg  = Math.max(...monthlyMessages, 1);
  const maxConv = Math.max(...monthlyConvs, 1);
  const maxBar  = Math.max(maxMsg, maxConv, 1);

  // Best month this year
  const bestMonthIdx  = monthlyMessages.indexOf(Math.max(...monthlyMessages));
  const yearTotalMsgs = monthlyMessages.reduce((a, b) => a + b, 0);
  const yearTotalConvs = monthlyConvs.reduce((a, b) => a + b, 0);

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="mb-5">
        <h2 className="text-2xl font-bold mb-1">
          Mis <span className="text-gradient">Estadísticas</span>
        </h2>
        <p className="text-sm text-muted-foreground">Métricas de rendimiento de tu perfil en el directorio.</p>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Visitas al perfil', value: loading ? '—' : animViews.toString(), icon: Eye, note: 'visitas a tu ficha pública', color: '#4285F4' },
          { label: 'Mensajes recibidos', value: loading ? '—' : animMessages.toString(), icon: MessageCircle, note: 'de otros usuarios', color: '#4285F4' },
          { label: 'Solicitudes Flash', value: loading ? '—' : animBookings.toString(), icon: Zap, note: 'solicitudes recibidas', color: '#D4AF37' },
          { label: 'Tasa de contacto', value: loading ? '—' : `${animRate}%`, icon: TrendingUp, note: 'vistas que escriben', color: '#D4AF37' },
        ].map(s => (
          <div key={s.label} className="glass-panel p-4 relative overflow-hidden">
            {/* top border accent */}
            <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl" style={{ background: s.color, opacity: 0.6 }} />
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{s.label}</span>
              <s.icon size={14} style={{ color: s.color }} />
            </div>
            <div className="text-2xl font-bold mb-1">{s.value}</div>
            <span className="text-xs font-semibold text-muted-foreground">{s.note}</span>
          </div>
        ))}
      </div>

      {/* ── Activity Wheel ── */}
      <div className="glass-panel p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#4285F4', boxShadow: '0 0 6px #4285F4' }} />
          <h3 className="text-sm font-bold">Tu actividad de un vistazo</h3>
        </div>
        <DonutChart
          size={150}
          segments={[
            { value: stats.views,         color: '#4285F4', label: 'Visitas al perfil',           icon: '👁' },
            { value: stats.messages,      color: '#60A5FA', label: 'Mensajes recibidos',          icon: '💬' },
            { value: stats.conversations, color: '#34D399', label: 'Conversaciones activas',      icon: '🗣' },
            { value: stats.bookings,      color: '#D4AF37', label: 'Solicitudes Flash Booking',   icon: '⚡' },
          ]}
        />
      </div>

      {/* ── Annual Chart ── */}
      <div className="glass-panel p-5 mb-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <BarChart2 size={16} style={{ color: '#4285F4' }} />
            <h3 className="text-sm font-bold">Resumen {currentYear}</h3>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: '#4285F4' }} />
              Mensajes
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: 'rgba(66,133,244,0.3)', border: '1px solid #4285F4' }} />
              Conversaciones
            </span>
          </div>
        </div>

        {loading ? (
          <div className="h-32 flex items-center justify-center">
            <span className="text-xs text-muted-foreground animate-pulse">Cargando datos del año...</span>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-1 px-1">
          <div className="flex items-end gap-1.5 min-w-[280px]" style={{ height: 100 }}>
            {MONTH_LABELS.map((label, i) => {
              const msgH  = Math.round((monthlyMessages[i] / maxBar) * 88);
              const convH = Math.round((monthlyConvs[i] / maxBar) * 88);
              const isCurrent = i === currentMonth;
              const isBest    = i === bestMonthIdx && monthlyMessages[i] > 0;
              return (
                <div key={label} className="flex-1 flex flex-col items-center gap-1 group relative">
                  {/* Tooltip */}
                  {(monthlyMessages[i] > 0 || monthlyConvs[i] > 0) && (
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none whitespace-nowrap"
                      style={{
                        background: 'rgba(8,8,12,0.97)',
                        border: '1px solid rgba(66,133,244,0.3)',
                        borderRadius: 6,
                        padding: '4px 8px',
                        fontSize: '0.6rem',
                        fontWeight: 700,
                        color: 'rgba(22,20,18,0.88)',
                      }}>
                      <span style={{ color: '#4285F4' }}>{monthlyMessages[i]} msg</span>
                      {monthlyConvs[i] > 0 && <span style={{ color: 'rgba(66,133,244,0.6)' }}> · {monthlyConvs[i]} conv</span>}
                    </div>
                  )}
                  {/* Bar group */}
                  <div className="flex items-end gap-px w-full" style={{ height: 88 }}>
                    <div className="flex-1 rounded-t-sm transition-all duration-500"
                      style={{
                        height: msgH || 1,
                        background: isBest
                          ? 'linear-gradient(180deg, #60A5FA, #4285F4)'
                          : isCurrent
                            ? 'rgba(66,133,244,0.8)'
                            : 'rgba(66,133,244,0.5)',
                        boxShadow: isBest ? '0 0 8px rgba(66,133,244,0.5)' : undefined,
                      }}
                    />
                    <div className="flex-1 rounded-t-sm transition-all duration-500"
                      style={{
                        height: convH || 0,
                        background: 'rgba(66,133,244,0.2)',
                        border: convH > 0 ? '1px solid rgba(66,133,244,0.35)' : 'none',
                      }}
                    />
                  </div>
                  {/* Month label */}
                  <span className="text-[0.75rem] font-bold"
                    style={{ color: isCurrent ? '#4285F4' : 'rgba(22,20,18,0.3)' }}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
          </div>
        )}

        {/* Year totals row */}
        {!loading && (
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-4 pt-4" style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-0.5">Total mensajes {currentYear}</p>
              <p className="text-lg font-black" style={{ color: '#4285F4' }}>{yearTotalMsgs}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-0.5">Conversaciones nuevas</p>
              <p className="text-lg font-black" style={{ color: 'rgba(66,133,244,0.7)' }}>{yearTotalConvs}</p>
            </div>
            {bestMonthIdx >= 0 && monthlyMessages[bestMonthIdx] > 0 && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-0.5">Mejor mes</p>
                <p className="text-lg font-black" style={{ color: '#60A5FA' }}>{MONTH_LABELS[bestMonthIdx]}</p>
              </div>
            )}
            <div className="sm:ml-auto text-right">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-0.5">Tasa de contacto</p>
              <p className="text-lg font-black" style={{ color: '#D4AF37' }}>{contactRate}%</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Nota visualizaciones ── */}
      <div className="glass-panel p-4 mb-6 flex items-start gap-3"
        style={{ border: '1px solid rgba(66,133,244,0.12)', background: 'rgba(66,133,244,0.03)' }}>
        <Eye size={14} style={{ color: '#4285F4', flexShrink: 0, marginTop: 2 }} />
        <div>
          <p className="text-xs font-bold mb-0.5" style={{ color: '#4285F4' }}>Sobre las visitas al perfil</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Cada vez que alguien abre tu ficha pública en xpeak.es/p/... suma una visita. Incluye tus propias visitas de prueba.
          </p>
        </div>
      </div>

      {/* ── Plan ── */}
      <div className="glass-panel p-5">
        <h3 className="text-sm font-bold mb-3">Tu plan</h3>
        <div className="flex items-center gap-3 p-3 rounded-lg"
          style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.15)' }}>
          <CheckCircle size={20} style={{ color: '#D4AF37' }} />
          <div className="flex-1">
            <p className="text-sm font-bold">Plataforma gratuita</p>
            <p className="text-xs text-muted-foreground">Todas las funciones disponibles sin coste ni comisiones.</p>
          </div>
          <span className="text-[0.75rem] font-bold px-2 py-1 rounded"
            style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37' }}>ACTIVO</span>
        </div>
      </div>
    </div>
  );
};

export default StatsView;
