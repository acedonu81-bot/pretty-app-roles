import { Play, Eye } from 'lucide-react';
import { toast } from 'sonner';

const streams = [
  {
    name: 'Kaelen',
    genre: 'Hard Techno',
    location: 'Berlin, Germany',
    viewers: 31,
    bg: 'linear-gradient(135deg, #1a0033, #2d1b69)',
    initials: 'KA',
    seats: ['ON', 'BS', 'HZ', null],
  },
  {
    name: 'Niara',
    genre: 'Afro House / Organic',
    location: 'Lagos, Nigeria',
    viewers: 19,
    bg: 'linear-gradient(135deg, #0a2e1f, #1a5c3a)',
    initials: 'NI',
    seats: ['ON', 'HZ', null, null],
  },
];

const PromotorView = () => {
  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold mb-1">
          Panel <span className="text-gradient">Promotor</span>
        </h2>
        <p className="text-muted-foreground">Escucha DJs en directo y puja por su talento en tiempo real.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        {[
          { label: 'SHOWCASES EN VIVO', value: '07', color: '#ff5f56' },
          { label: 'DJs DISPONIBLES', value: '142', color: '#8c52ff' },
          { label: 'CONTRATOS ACTIVOS', value: '03', color: '#00ff88' },
        ].map((s) => (
          <div key={s.label} className="glass-panel p-5 rounded-2xl">
            <span className="text-xs text-muted-foreground font-extrabold">{s.label}</span>
            <div className="text-3xl font-extrabold mt-2" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Live Streams */}
      <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f56', animation: 'pulse 2s infinite' }} />
        Showcases en Directo
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {streams.map((stream) => (
          <div key={stream.name} className="glass-panel rounded-2xl overflow-hidden group hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5),0_0_30px_rgba(140,82,255,0.2)]">
            {/* Video area */}
            <div className="h-48 relative flex items-center justify-center" style={{ background: stream.bg }}>
              <div className="absolute inset-0" style={{
                background: 'linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.8))',
              }} />
              {/* LIVE badge */}
              <div className="absolute top-4 left-4 px-2.5 py-1 rounded text-[0.7rem] font-black tracking-wider"
                style={{ background: '#ff5f56', color: 'white' }}
              >
                LIVE
              </div>
              {/* Viewers */}
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs flex items-center gap-1.5"
                style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
              >
                <Eye size={12} /> {stream.viewers}
              </div>
              {/* Play button */}
              <div
                className="relative w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-110"
                style={{ background: 'rgba(140,82,255,0.8)', backdropFilter: 'blur(5px)' }}
              >
                <Play size={24} className="ml-1" fill="white" stroke="white" />
              </div>
            </div>

            {/* Info */}
            <div className="p-5">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-lg">{stream.name}</h4>
                <span className="text-xs text-muted-foreground">{stream.location}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{stream.genre}</p>

              {/* Seats */}
              <div className="mb-4">
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold flex items-center gap-1 mb-2">
                  <Eye size={12} /> Asientos Ejecutivos
                </span>
                <div className="flex gap-3 items-center">
                  {stream.seats.map((seat, i) =>
                    seat ? (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black"
                        style={{
                          background: `linear-gradient(135deg, ${['#00ff88,#00b8ff', '#ffbc00,#ff5f56', '#8c52ff,#00b8ff', '#f472b6,#a855f7'][i]})`,
                          color: i < 2 ? '#000' : '#fff',
                          border: '2px solid var(--nightlife-primary)',
                          boxShadow: '0 0 15px rgba(140,82,255,0.4)',
                        }}
                      >
                        {seat}
                      </div>
                    ) : (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground text-lg"
                        style={{ border: '2px dashed var(--nightlife-border)', background: 'rgba(255,255,255,0.03)' }}
                      >
                        +
                      </div>
                    ),
                  )}
                </div>
              </div>

              <button
                className="w-full py-3 rounded-lg font-extrabold uppercase tracking-wider text-sm transition-all"
                style={{
                  background: stream.seats.filter(Boolean).length === 4
                    ? 'rgba(255,255,255,0.05)' : 'linear-gradient(90deg, #ff5f56, #ff2a5f)',
                  color: stream.seats.filter(Boolean).length === 4 ? 'var(--nightlife-text-secondary)' : 'white',
                  boxShadow: stream.seats.filter(Boolean).length < 4 ? '0 4px 15px rgba(255,95,86,0.4)' : 'none',
                  cursor: stream.seats.filter(Boolean).length === 4 ? 'not-allowed' : 'pointer',
                  opacity: stream.seats.filter(Boolean).length === 4 ? 0.6 : 1,
                }}
                onClick={() => {
                  if (stream.seats.filter(Boolean).length < 4) {
                    toast.success(`¡Has tomado asiento para ver a ${stream.name}! Puedes pujar ahora.`);
                  }
                }}
              >
                {stream.seats.filter(Boolean).length === 4 ? 'Subasta Cerrada' : '🎤 Tomar Asiento y Pujar'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromotorView;
