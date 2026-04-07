import { CheckCircle, Star } from 'lucide-react';
import { toast } from 'sonner';

const MOCK_BOOKINGS = [
  { id: 1, pro: 'DJ Konrad',  role: 'dj',     event: 'Fabrik · Noche Techno',     date: '15 Mar 2026', pay: '€320', rating: 5, rated: true  },
  { id: 2, pro: 'Luna M.',    role: 'makeup',  event: 'Backstage VIP · BCN',       date: '8 Mar 2026',  pay: '€180', rating: 5, rated: true  },
  { id: 3, pro: 'Carlos V.',  role: 'staff',   event: 'Control entrada Pachá',      date: '1 Mar 2026',  pay: '€90',  rating: 4, rated: false },
  { id: 4, pro: 'DJ Mara',    role: 'dj',      event: 'After — Club Cats',          date: '22 Feb 2026', pay: '€250', rating: 0, rated: false },
  { id: 5, pro: 'Ana R.',     role: 'makeup',  event: 'Estilismo backstage',        date: '14 Feb 2026', pay: '€160', rating: 5, rated: true  },
];

const ROLE_COLOR: Record<string, string> = {
  dj: '#D4AF37', staff: '#8B5CF6', makeup: '#EC4899',
};

const HistorialTab = () => {
  const totalSpend  = MOCK_BOOKINGS.reduce((s, b) => s + parseInt(b.pay.replace('€', '')), 0);
  const ratedCount  = MOCK_BOOKINGS.filter(b => b.rated).length;

  return (
    <div className="space-y-5">
      {/* Reputation card */}
      <div className="glass-panel p-5 relative overflow-hidden"
        style={{ border: '1px solid rgba(212,175,55,0.2)', background: 'rgba(212,175,55,0.02)' }}>
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-5 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #D4AF37 0%, transparent 70%)' }} />
        <div className="flex items-center gap-4 relative">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
            <CheckCircle size={24} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: '#D4AF37' }}>Reputación como Empleador</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black" style={{ color: '#D4AF37' }}>4.8</span>
              <span className="text-xs text-muted-foreground">/ 5.0 · {MOCK_BOOKINGS.length} contrataciones</span>
            </div>
            <p className="text-[0.6rem] text-muted-foreground mt-0.5">
              Los profesionales te califican como empleador. Cuanto más alta tu puntuación, más talento top querrá trabajar contigo.
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-[0.6rem] text-muted-foreground">Gasto total</p>
            <p className="text-lg font-black" style={{ color: '#22c55e' }}>€{totalSpend.toLocaleString()}</p>
            <p className="text-[0.55rem] text-muted-foreground">este mes</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3 mt-4 pt-4" style={{ borderTop: '1px solid rgba(212,175,55,0.1)' }}>
          {[
            { label: 'Pago puntual',  value: '98%',                                      good: true },
            { label: 'Respuesta',     value: '< 2h',                                     good: true },
            { label: 'Repetición',    value: '3 pros',                                    good: true },
            { label: 'Valoraciones',  value: `${ratedCount}/${MOCK_BOOKINGS.length}`,    good: ratedCount === MOCK_BOOKINGS.length },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className="text-base font-black" style={{ color: s.good ? '#22c55e' : '#D4AF37' }}>{s.value}</p>
              <p className="text-[0.55rem] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Booking history */}
      <div className="glass-panel p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold">Contrataciones recientes</h3>
          <span className="text-xs text-muted-foreground">{MOCK_BOOKINGS.length} eventos</span>
        </div>
        <div className="space-y-2">
          {MOCK_BOOKINGS.map(b => (
            <div key={b.id} className="flex items-center gap-3 p-3 rounded-xl group transition-all"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(212,175,55,0.04)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black flex-shrink-0 text-xs"
                style={{ background: `${ROLE_COLOR[b.role] ?? '#D4AF37'}18`, color: ROLE_COLOR[b.role] ?? '#D4AF37', border: `1px solid ${ROLE_COLOR[b.role] ?? '#D4AF37'}30` }}>
                {b.pro.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{b.pro}</p>
                <p className="text-[0.6rem] text-muted-foreground truncate">{b.event} · {b.date}</p>
              </div>
              <span className="text-sm font-bold flex-shrink-0" style={{ color: '#22c55e' }}>{b.pay}</span>
              {b.rated ? (
                <div className="flex items-center gap-0.5 flex-shrink-0">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={10} fill={i < b.rating ? '#D4AF37' : 'none'} style={{ color: '#D4AF37' }} />
                  ))}
                </div>
              ) : (
                <button onClick={() => toast.info('Valoración disponible próximamente')}
                  className="text-[0.55rem] font-bold px-2 py-1 rounded-lg flex-shrink-0 transition-all hover:opacity-80"
                  style={{ background: 'rgba(212,175,55,0.08)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }}>
                  Valorar
                </button>
              )}
              <button onClick={() => toast.success(`Flash Job enviado a ${b.pro}`)}
                className="text-[0.55rem] font-bold px-2 py-1 rounded-lg flex-shrink-0 transition-all hover:scale-105 opacity-0 group-hover:opacity-100"
                style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                Recontratar
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 rounded-xl text-xs" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
        <p className="font-bold mb-1" style={{ color: '#D4AF37' }}>Tu reputación atrae mejor talento</p>
        <p className="text-muted-foreground leading-relaxed">
          Los profesionales con puntuación 4.5+ en XPEAK priorizan empleadores con reputación alta.
          Valora a tus contratados y paga en el plazo acordado para subir tu score.
        </p>
      </div>
    </div>
  );
};

export default HistorialTab;
