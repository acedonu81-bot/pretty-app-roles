import { useState, useEffect } from 'react';
import { Gift, Trophy, Clock, Shuffle, CheckCircle, Package, Ticket, Music2, MessageCircle } from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = { Package, Ticket, Music2, MessageCircle };
import { toast } from 'sonner';

interface FanSub { id: string; fan_id: string; amount: number; created_at: string; }

interface Props {
  fans: FanSub[];
}

/** Returns the date of the first Friday of a given month/year */
function firstFridayOf(year: number, month: number): Date {
  const d = new Date(year, month, 1);
  // getDay(): 0=Sun, 5=Fri
  const dayOffset = (5 - d.getDay() + 7) % 7;
  d.setDate(1 + dayOffset);
  return d;
}

/** Returns the next upcoming first-Friday draw date */
function nextDrawDate(): Date {
  const now = new Date();
  // Try this month
  const thisMonth = firstFridayOf(now.getFullYear(), now.getMonth());
  // If draw hasn't passed yet (or is today), use it; otherwise use next month
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (thisMonth >= todayMidnight) return thisMonth;
  // Next month
  const nextMonth = now.getMonth() === 11 ? 0 : now.getMonth() + 1;
  const nextYear  = now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear();
  return firstFridayOf(nextYear, nextMonth);
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return '00:00:00';
  const totalSecs = Math.floor(ms / 1000);
  const days  = Math.floor(totalSecs / 86400);
  const hours = Math.floor((totalSecs % 86400) / 3600);
  const mins  = Math.floor((totalSecs % 3600) / 60);
  const secs  = totalSecs % 60;
  if (days > 0) return `${days}d ${String(hours).padStart(2,'0')}h ${String(mins).padStart(2,'0')}m`;
  return `${String(hours).padStart(2,'0')}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
}

const GIFT_OPTIONS = [
  { id: 'merch',   icon: 'Package',   label: 'Merch firmado' },
  { id: 'event',   icon: 'Ticket',    label: 'Acceso VIP evento' },
  { id: 'track',   icon: 'Music2',    label: 'Track inédito' },
  { id: 'message', icon: 'MessageCircle', label: 'Mensaje personal' },
];

const LotterySection = ({ fans }: Props) => {
  const drawDate  = nextDrawDate();
  const [msLeft, setMsLeft]     = useState(() => drawDate.getTime() - Date.now());
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner]     = useState<FanSub | null>(null);
  const [giftPicked, setGiftPicked] = useState('');
  const [confirmed, setConfirmed]   = useState(false);

  // Load persisted winner from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('xpeak_lottery_winner');
    if (stored) {
      try {
        const { fan, drawKey } = JSON.parse(stored);
        const thisKey = `${drawDate.getFullYear()}-${drawDate.getMonth()}`;
        if (drawKey === thisKey) setWinner(fan);
      } catch { /* ignore */ }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const iv = setInterval(() => {
      setMsLeft(drawDate.getTime() - Date.now());
    }, 1000);
    return () => clearInterval(iv);
  }, [drawDate]);

  const rollWinner = () => {
    if (fans.length === 0) { toast.error('No hay fans activos en el sorteo.'); return; }
    setSpinning(true);
    setWinner(null);
    setConfirmed(false);
    setGiftPicked('');

    // Spin animation — cycle through names for 2 s, then settle
    let ticks = 0;
    const total = 20;
    const iv = setInterval(() => {
      ticks++;
      // Show a random fan during spin
      const randIdx = Math.floor(Math.random() * fans.length);
      setWinner(fans[randIdx]);
      if (ticks >= total) {
        clearInterval(iv);
        // Final random pick
        const finalIdx = Math.floor(Math.random() * fans.length);
        const finalWinner = fans[finalIdx];
        setWinner(finalWinner);
        setSpinning(false);
        // Persist winner for this draw month
        const drawKey = `${drawDate.getFullYear()}-${drawDate.getMonth()}`;
        localStorage.setItem('xpeak_lottery_winner', JSON.stringify({ fan: finalWinner, drawKey }));
        toast.success(`Ganador seleccionado: ${finalWinner.fan_id}`);
      }
    }, 100);
  };

  const confirmGift = () => {
    if (!giftPicked) { toast.error('Selecciona el regalo primero'); return; }
    setConfirmed(true);
    toast.success('¡Regalo del sorteo confirmado y enviado!');
  };

  const isDrawDay = msLeft <= 0;
  const drawLabel = drawDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="glass-panel p-5 relative overflow-hidden"
      style={{ border: '1px solid rgba(212,175,55,0.2)', background: 'rgba(212,175,55,0.02)' }}>
      {/* Background glow */}
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.1) 0%, transparent 70%)' }} />

      {/* Header */}
      <div className="flex items-start gap-4 mb-5 relative">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
          <Trophy size={20} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-bold">Sorteo Mensual del Regalo VIP</h3>
            <span className="text-[0.7rem] font-black px-1.5 py-0.5 rounded-full"
              style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)' }}>
              1er VIERNES DE MES
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Un fan elegido al azar recibe el regalo mensual. El sorteo es automático y transparente.
          </p>
        </div>
      </div>

      {/* Bases del sorteo */}
      <div className="rounded-xl p-4 mb-4 space-y-1.5"
        style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.1)' }}>
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#D4AF37' }}>
          Bases del sorteo
        </p>
        {[
          'Participan todos los fans con suscripción VIP activa en el momento del sorteo',
          'El sorteo se celebra el primer viernes de cada mes a las 20:00h',
          'El ganador se elige aleatoriamente entre todos los participantes elegibles',
          'Un único ganador por sorteo mensual — no acumulable con otros meses',
          'El artista notifica al ganador dentro de las 24h siguientes al sorteo',
          'En caso de no poder contactar al ganador en 48h, se realiza un nuevo sorteo',
        ].map((line, i) => (
          <p key={i} className="text-xs text-muted-foreground leading-relaxed">{line}</p>
        ))}
      </div>

      {/* Draw countdown */}
      <div className="rounded-xl p-4 mb-4 flex items-center gap-4"
        style={{ background: isDrawDay ? 'rgba(212,175,55,0.08)' : 'rgba(0,0,0,0.2)', border: `1px solid ${isDrawDay ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.05)'}` }}>
        <div className="flex-shrink-0">
          <Clock size={22} style={{ color: isDrawDay ? '#D4AF37' : '#8E8EA0' }} className={isDrawDay ? 'animate-pulse' : ''} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground">Próximo sorteo</p>
          <p className="text-xs font-bold capitalize">{drawLabel}</p>
        </div>
        <div className="text-right flex-shrink-0">
          {isDrawDay ? (
            <span className="text-xs font-black" style={{ color: '#D4AF37' }}>¡HOY!</span>
          ) : (
            <span className="text-sm font-black tabular-nums" style={{ color: '#D4AF37' }}>
              {formatCountdown(msLeft)}
            </span>
          )}
        </div>
      </div>

      {/* Participants bar */}
      <div className="flex items-center gap-3 mb-4 px-3 py-2.5 rounded-xl"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <Gift size={14} style={{ color: '#D4AF37' }} />
        <div className="flex-1">
          <p className="text-xs font-bold">{fans.length} fans VIP en el sorteo</p>
          <p className="text-[0.75rem] text-muted-foreground">Todos los suscritos activos participan automáticamente</p>
        </div>
        {fans.length === 0 && (
          <span className="text-[0.75rem] px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(255,95,86,0.1)', color: '#ff5f56', border: '1px solid rgba(255,95,86,0.2)' }}>
            Sin participantes
          </span>
        )}
      </div>

      {/* Winner display */}
      {winner && (
        <div className={`rounded-xl p-4 mb-4 transition-all duration-300 ${spinning ? 'blur-[1px]' : ''}`}
          style={{
            background: confirmed ? 'rgba(34,197,94,0.06)' : 'rgba(212,175,55,0.06)',
            border: `1px solid ${confirmed ? 'rgba(34,197,94,0.3)' : 'rgba(212,175,55,0.25)'}`,
          }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
              {winner.fan_id.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold">{winner.fan_id}</p>
                {confirmed && <CheckCircle size={14} style={{ color: '#22c55e' }} />}
              </div>
              <p className="text-xs text-muted-foreground">
                {spinning ? 'Sorteando...' : confirmed ? 'Regalo confirmado ✓' : '¡Fan ganador del sorteo!'}
              </p>
            </div>
          </div>

          {!confirmed && !spinning && (
            <>
              <p className="text-xs font-bold mb-2" style={{ color: '#D4AF37' }}>Elige el regalo:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                {GIFT_OPTIONS.map(g => (
                  <button key={g.id} type="button"
                    onClick={() => setGiftPicked(g.id)}
                    className="rounded-lg p-2 text-center transition-all hover:scale-105"
                    style={{
                      background: giftPicked === g.id ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${giftPicked === g.id ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.06)'}`,
                      outline: giftPicked === g.id ? '2px solid rgba(212,175,55,0.3)' : 'none',
                    }}>
                    {(() => { const I = ICON_MAP[g.icon]; return I ? <I size={18} style={{ color: giftPicked === g.id ? '#D4AF37' : 'rgba(255,255,255,0.35)', margin: '0 auto 2px' }} /> : null; })()}
                    <p className="text-[0.7rem] text-muted-foreground mt-0.5 leading-tight">{g.label}</p>
                  </button>
                ))}
              </div>
              <button type="button" onClick={confirmGift}
                className="w-full py-2.5 rounded-xl font-bold text-xs transition-all hover:scale-[1.01] disabled:opacity-40"
                style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                Confirmar regalo del sorteo
              </button>
            </>
          )}
        </div>
      )}

      {/* Draw button */}
      <button type="button" onClick={rollWinner}
        disabled={spinning || fans.length === 0}
        className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          background: isDrawDay
            ? 'linear-gradient(90deg,#D4AF37,#B8941E)'
            : 'rgba(212,175,55,0.08)',
          color: isDrawDay ? '#000' : '#D4AF37',
          border: isDrawDay ? 'none' : '1px solid rgba(212,175,55,0.25)',
        }}>
        <Shuffle size={15} className={spinning ? 'animate-spin' : ''} />
        {spinning ? 'Sorteando...' : winner && !spinning ? 'Repetir sorteo' : 'Realizar sorteo'}
      </button>

      {!isDrawDay && (
        <p className="text-center text-[0.75rem] text-muted-foreground mt-2">
          El sorteo oficial es el primer viernes del mes. Puedes hacer pruebas en cualquier momento.
        </p>
      )}
    </div>
  );
};

export default LotterySection;
