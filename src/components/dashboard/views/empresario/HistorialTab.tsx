import { CheckCircle, Clock } from 'lucide-react';

const HistorialTab = () => {
  return (
    <div className="space-y-5">
      {/* Reputation card — empty state until bookings table is live */}
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
              <span className="text-3xl font-black" style={{ color: '#D4AF37' }}>—</span>
              <span className="text-xs text-muted-foreground">/ 5.0 · 0 contrataciones</span>
            </div>
            <p className="text-[0.6rem] text-muted-foreground mt-0.5">
              Los profesionales te calificarán como empleador tras cada contratación completada.
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-[0.6rem] text-muted-foreground">Gasto total</p>
            <p className="text-lg font-black" style={{ color: '#22c55e' }}>€0</p>
            <p className="text-[0.55rem] text-muted-foreground">este mes</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3 mt-4 pt-4" style={{ borderTop: '1px solid rgba(212,175,55,0.1)' }}>
          {[
            { label: 'Pago puntual', value: '—' },
            { label: 'Respuesta',    value: '—' },
            { label: 'Repetición',   value: '—' },
            { label: 'Valoraciones', value: '0/0' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className="text-base font-black text-muted-foreground">{s.value}</p>
              <p className="text-[0.55rem] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Empty state */}
      <div className="glass-panel p-10 flex flex-col items-center gap-3 text-center">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.15)' }}>
          <Clock size={22} style={{ color: 'rgba(212,175,55,0.5)' }} />
        </div>
        <p className="text-sm font-bold">Sin contrataciones aún</p>
        <p className="text-xs text-muted-foreground max-w-xs">
          Tu historial de contrataciones aparecerá aquí una vez que completes tu primer Flash Booking.
        </p>
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
