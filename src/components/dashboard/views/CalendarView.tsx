const CalendarView = () => {
  const days = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];
  const dates = [28, 29, 30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">
          <span className="text-gradient">Calendario</span>
        </h2>
        <p className="text-sm text-muted-foreground">Sincroniza tu agenda con eventos y bolos.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
        <div className="glass-panel p-5">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-base font-bold">Agosto 2026</h3>
            <div className="flex gap-1.5">
              <button className="w-7 h-7 rounded flex items-center justify-center text-muted-foreground hover:bg-white/5">←</button>
              <button className="w-7 h-7 rounded flex items-center justify-center text-muted-foreground hover:bg-white/5">→</button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1.5 text-center text-[0.55rem] text-muted-foreground font-bold mb-2">
            {days.map((d) => <div key={d}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1.5 text-center text-sm">
            {dates.map((d, i) => {
              const isOldMonth = d > 20;
              const isConfirmed = d === 5;
              const isPending = d === 6;
              return (
                <div key={i}
                  className={`py-2.5 rounded relative cursor-pointer transition-all ${isOldMonth ? 'text-white/15' : 'hover:bg-white/5'}`}
                  style={{
                    background: isConfirmed ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.02)',
                    border: isConfirmed ? '1px solid rgba(212,175,55,0.3)' : isPending ? '1px solid rgba(255,95,86,0.3)' : '1px solid transparent',
                    color: isConfirmed ? '#D4AF37' : undefined,
                    fontWeight: isConfirmed ? 700 : undefined,
                  }}>
                  {d}
                  {isConfirmed && <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full" style={{ background: '#D4AF37' }} />}
                  {isPending && <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full" style={{ background: '#ff5f56' }} />}
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 mt-5 text-[0.55rem] font-bold text-muted-foreground justify-center">
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ background: '#D4AF37' }} /> Confirmado</span>
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ background: '#ff5f56' }} /> Pendiente</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="glass-panel p-4">
            <div className="flex justify-between items-center mb-3 pb-2" style={{ borderBottom: '1px solid var(--nightlife-border)' }}>
              <h3 className="text-xs font-bold">Próximo Bolo</h3>
              <span className="text-[0.5rem] font-bold px-1.5 py-0.5 rounded" style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37' }}>Agendado</span>
            </div>
            <div className="p-3 rounded-lg relative" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.1)' }}>
              <div className="absolute top-0 left-0 w-0.5 h-full rounded-full" style={{ background: '#D4AF37' }} />
              <h4 className="font-bold text-xs mb-1 ml-2" style={{ color: '#D4AF37' }}>Cierre Sunrise Festival VIP</h4>
              <p className="text-[0.6rem] text-muted-foreground ml-2 mb-2">Horizon Enterprise S.L.</p>
              <p className="text-[0.55rem] text-muted-foreground ml-2">📅 5 Agosto, 02:00h - 05:00h</p>
              <p className="text-[0.55rem] text-muted-foreground ml-2">📍 Stage Principal (Ibiza)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
