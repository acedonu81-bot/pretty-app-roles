import { useState, useEffect } from 'react';

const HeroMockup = () => {
  const [highlight, setHighlight] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHighlight(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="glass-panel w-full flex flex-col"
      style={{
        height: 380,
        transform: 'rotateY(-8deg) rotateX(4deg) translateY(-10px)',
        transition: 'transform 0.5s ease',
      }}
    >
      <div className="p-3 flex items-center gap-3" style={{ borderBottom: '1px solid var(--nightlife-border)' }}>
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f56' }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#D4AF37' }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#27c93f' }} />
        </div>
        <span className="text-muted-foreground text-xs uppercase tracking-wider font-medium">nightlife / directorio</span>
      </div>
      <div className="p-6 flex-1">
        <div className="flex gap-3 mb-5">
          {[
            { label: 'DJs Activos', value: '142' },
            { label: 'Flash Booking', value: '24' },
            { label: 'Salas Madrid', value: '38' },
          ].map((s) => (
            <div key={s.label} className="flex-1 glass-panel-subtle p-4 flex flex-col gap-1.5">
              <span className="text-muted-foreground text-[0.55rem] uppercase font-medium">{s.label}</span>
              <span className="text-xl font-bold text-foreground">{s.value}</span>
            </div>
          ))}
        </div>
        {/* Mini profile grid */}
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="aspect-square rounded-lg flex items-center justify-center"
              style={{
                background: i < 2 ? 'rgba(212,175,55,0.1)' : 'rgba(255,255,255,0.02)',
                border: i < 2 ? '1px solid rgba(212,175,55,0.2)' : '1px solid var(--nightlife-border)',
              }}>
              <div className="w-5 h-5 rounded" style={{ background: i < 2 ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.05)' }} />
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <div className="h-2 rounded flex-1" style={{ background: 'linear-gradient(90deg, rgba(212,175,55,0.4), transparent)' }} />
          <div className="h-2 rounded flex-[0.6]" style={{ background: 'linear-gradient(90deg, rgba(212,175,55,0.2), transparent)' }} />
        </div>
      </div>
    </div>
  );
};

export default HeroMockup;
