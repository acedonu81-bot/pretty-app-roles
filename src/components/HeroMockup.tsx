import { useState, useEffect } from 'react';

const HeroMockup = () => {
  const [revenue, setRevenue] = useState('$85.4K');
  const [highlight, setHighlight] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRevenue('$92.1K');
      setHighlight(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="glass-panel w-full flex flex-col"
      style={{
        height: 420,
        transform: 'rotateY(-10deg) rotateX(5deg) translateY(-20px)',
        transition: 'transform 0.5s ease',
      }}
    >
      {/* Header */}
      <div className="p-4 flex items-center gap-4" style={{ borderBottom: '1px solid var(--nightlife-border)' }}>
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full" style={{ background: '#ff5f56' }} />
          <span className="w-3 h-3 rounded-full" style={{ background: '#ffbd2e' }} />
          <span className="w-3 h-3 rounded-full" style={{ background: '#27c93f' }} />
        </div>
        <span className="text-muted-foreground text-sm uppercase tracking-wider font-semibold">dashboard / overview</span>
      </div>
      {/* Content */}
      <div className="p-8 flex-1">
        <div className="flex gap-4 mb-6">
          {[
            { label: 'Eventos Activos', value: '24' },
            { label: 'DJs Locales', value: '18' },
          ].map((s) => (
            <div key={s.label} className="flex-1 glass-panel-subtle p-5 flex flex-col gap-2">
              <span className="text-muted-foreground text-xs uppercase font-semibold">{s.label}</span>
              <span className="text-2xl font-extrabold text-foreground">{s.value}</span>
            </div>
          ))}
          <div className="flex-1 p-5 flex flex-col gap-2 rounded-2xl" style={{
            background: 'linear-gradient(145deg, rgba(140,82,255,0.1), rgba(0,229,255,0.1))',
            border: '1px solid rgba(140,82,255,0.3)',
          }}>
            <span className="text-muted-foreground text-xs uppercase font-semibold">Ingresos</span>
            <span className={`text-2xl font-extrabold transition-all duration-500 ${highlight ? 'text-nightlife-secondary' : 'text-foreground'}`}>
              {revenue}
            </span>
          </div>
        </div>
        <div className="rounded-xl p-6 flex flex-col justify-center gap-3" style={{ background: 'rgba(255,255,255,0.02)', height: 120 }}>
          <div className="h-3 rounded w-full" style={{ background: 'linear-gradient(90deg, var(--nightlife-border), transparent)' }} />
          <div className="h-3 rounded w-3/4" style={{ background: 'linear-gradient(90deg, var(--nightlife-secondary), transparent)' }} />
          <div className="h-3 rounded w-1/2" style={{ background: 'linear-gradient(90deg, var(--nightlife-primary), transparent)' }} />
        </div>
      </div>
    </div>
  );
};

export default HeroMockup;
