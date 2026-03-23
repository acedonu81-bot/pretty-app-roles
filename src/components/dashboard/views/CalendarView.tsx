const CalendarView = () => {
  const days = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];
  const dates = [28, 29, 30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold mb-1">
          Tu <span className="text-gradient">Calendario</span>
        </h2>
        <p className="text-muted-foreground">Sincroniza tu agenda con eventos, bolos, ensayos y reuniones de promotores.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        {/* Calendar Grid */}
        <div className="glass-panel p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-extrabold">Agosto 2026</h3>
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-white/10 transition-colors">←</button>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-white/10 transition-colors">→</button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2 text-center text-xs text-muted-foreground font-bold mb-3">
            {days.map((d) => <div key={d}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-2 text-center text-sm">
            {dates.map((d, i) => {
              const isOldMonth = d > 20;
              const isConfirmed = d === 5;
              const isPending = d === 6;

              return (
                <div
                  key={i}
                  className={`py-3 rounded-lg relative cursor-pointer transition-all ${isOldMonth ? 'text-white/20' : 'hover:bg-white/10'}`}
                  style={{
                    background: isConfirmed ? 'rgba(0,255,136,0.1)' : isPending ? undefined : 'rgba(255,255,255,0.03)',
                    border: isConfirmed ? '1px solid rgba(0,255,136,0.4)' : isPending ? '1px solid rgba(255,188,0,0.5)' : '1px solid transparent',
                    color: isConfirmed ? '#00ff88' : undefined,
                    fontWeight: isConfirmed ? 800 : undefined,
                    transform: isConfirmed ? 'scale(1.05)' : undefined,
                    boxShadow: isConfirmed ? '0 0 15px rgba(0,255,136,0.2)' : undefined,
                  }}
                >
                  {d}
                  {isConfirmed && <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full" style={{ background: '#00ff88' }} />}
                  {isPending && <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full" style={{ background: '#ffbc00', animation: 'pulse 2s infinite' }} />}
                </div>
              );
            })}
          </div>
          <div className="flex gap-5 mt-8 text-xs font-extrabold text-muted-foreground justify-center">
            <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ background: '#00ff88' }} /> Confirmado</span>
            <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ffbc00' }} /> Pendiente</span>
          </div>
        </div>

        {/* Right: next gig */}
        <div className="flex flex-col gap-5">
          <div className="glass-panel p-5 rounded-2xl">
            <div className="flex justify-between items-center mb-4 pb-3" style={{ borderBottom: '1px solid var(--nightlife-border)' }}>
              <h3 className="font-semibold">Tu Próximo Bolo</h3>
              <span className="text-[0.6rem] font-extrabold uppercase px-2 py-0.5 rounded" style={{ background: '#00ff88', color: '#000' }}>Agendado</span>
            </div>
            <div className="p-4 rounded-xl relative overflow-hidden" style={{
              background: 'rgba(0,255,136,0.03)', border: '1px solid rgba(0,255,136,0.2)',
            }}>
              <div className="absolute top-0 left-0 w-1 h-full" style={{ background: '#00ff88', boxShadow: '0 0 10px #00ff88' }} />
              <h4 className="font-bold mb-1" style={{ color: '#00ff88' }}>Cierre Sunrise Festival VIP</h4>
              <p className="text-sm text-muted-foreground mb-3">Promotora: <strong className="text-foreground">Horizon Enterprise S.L.</strong></p>
              <p className="text-xs text-muted-foreground mb-1">📅 5 de Agosto, 02:00h - 05:00h</p>
              <p className="text-xs text-muted-foreground mb-3">📍 Stage Principal (Zona Ibiza)</p>
              <div className="pt-3 flex flex-col gap-1" style={{ borderTop: '1px dashed rgba(255,255,255,0.1)' }}>
                <p className="text-xs font-extrabold mb-1">Staff asignado:</p>
                <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded" style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--nightlife-border)' }}>
                  <span style={{ color: 'var(--nightlife-primary)' }}>◉</span> <strong>Makeup:</strong> BeautyGlow
                </div>
                <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded" style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--nightlife-border)' }}>
                  <span style={{ color: 'var(--nightlife-primary)' }}>◉</span> <strong>Seguridad:</strong> Escolta 'Bulldog'
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
