import { Upload, Radio, Check, X } from 'lucide-react';
import { toast } from 'sonner';

const DJView = () => {
  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-extrabold mb-1">
            Bienvenido a cabina, <span className="text-gradient">Alex</span>
          </h2>
          <p className="text-muted-foreground">Tu resumen semanal musical y ofertas de bookings directas.</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-nightlife-secondary text-sm py-2 px-4 flex items-center gap-2">
            <Upload size={14} /> Subir Sesión
          </button>
          <button
            className="text-sm py-2 px-4 flex items-center gap-2 rounded-full font-semibold transition-all"
            style={{ background: '#ff5f56', color: 'white' }}
            onClick={() => toast.success('🔴 EN VIVO — ¡Showcasing en directo para promotores activos!')}
          >
            <span className="w-2 h-2 rounded-full bg-white" style={{ animation: 'pulse 2s infinite' }} />
            Transmitir Showcase
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {[
          { label: 'PRÓXIMOS BOLOS', value: '04', trend: '↗ +2', trendType: 'positive' },
          { label: 'OFERTAS PENDIENTES', value: '12', trend: '-', trendType: 'neutral' },
          { label: 'PROGRAMA LOYALTY', value: '17', trend: '17/20 Bolos', trendType: 'positive', highlight: true },
          { label: 'RATING GLOBAL', value: '★ 4.9', trend: '/ 5.0', trendType: 'neutral' },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`glass-panel p-5 rounded-2xl relative overflow-hidden`}
            style={stat.highlight ? {
              background: 'linear-gradient(145deg, rgba(140,82,255,0.1), rgba(0,229,255,0.05))',
              border: '1px solid rgba(140,82,255,0.3)',
            } : undefined}
          >
            {stat.highlight && (
              <div className="absolute bottom-0 left-0 h-1.5 w-[85%]" style={{
                background: 'linear-gradient(90deg, #00ff88, #00b8ff)',
                boxShadow: '0 0 15px #00ff88',
              }} />
            )}
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs text-muted-foreground font-extrabold">{stat.label}</span>
              <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                stat.trendType === 'positive'
                  ? 'text-green-400 bg-green-400/10'
                  : 'text-muted-foreground bg-white/5'
              }`}>
                {stat.trend}
              </span>
            </div>
            <div className={`text-3xl font-extrabold ${stat.highlight ? 'text-gradient' : ''}`}>
              {stat.value}
            </div>
            {stat.highlight && (
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                Estás a 3 contrataciones del <strong className="text-foreground">Estatus Platino.</strong>
                <br /><span className="font-extrabold" style={{ color: '#00ff88' }}>Tu comisión bajará al 2% de por vida.</span>
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Booking Requests */}
        <div>
          <h3 className="text-lg font-semibold mb-5">Solicitudes de Promotores</h3>
          <div className="glass-panel p-4 rounded-2xl flex flex-col gap-2">
            {[
              { name: 'Club Onyx - Anniversary Area', date: 'Viernes, 24 Nov • 01:00 - 04:00 (Techno)', price: '€800' },
              { name: 'Horizon Rooftop Summer', date: 'Sábado, 25 Nov • 23:00 - 03:00 (House)', price: '€1,200' },
              { name: 'Base Sound Open Air', date: 'Domingo, 26 Nov • 18:00 - 22:00 (Minimal)', price: '€650' },
            ].map((booking) => (
              <div key={booking.name} className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{
                  background: 'rgba(0,229,255,0.1)', color: 'var(--nightlife-secondary)',
                }}>
                  <Radio size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{booking.name}</h4>
                  <p className="text-xs text-muted-foreground">{booking.date}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--nightlife-secondary)' }}>
                    Oferta: <strong>{booking.price}</strong>
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                    style={{ background: 'rgba(39,201,63,0.1)', color: '#27c93f' }}
                    onClick={() => toast.success(`Oferta de ${booking.name} aceptada`)}
                  >
                    <Check size={18} strokeWidth={2.5} />
                  </button>
                  <button
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                    style={{ background: 'rgba(255,95,86,0.1)', color: '#ff5f56' }}
                  >
                    <X size={18} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Showcase Preview */}
        <div>
          <h3 className="text-lg font-semibold mb-5">Showcase en Directo</h3>
          <div className="glass-panel rounded-2xl overflow-hidden">
            {/* Simulated stream */}
            <div className="relative h-48 flex items-center justify-center" style={{
              background: 'linear-gradient(180deg, #0d0d1a, #070710)',
            }}>
              <div className="absolute bottom-0 left-0 right-0 h-14" style={{
                background: 'linear-gradient(0deg, rgba(140,82,255,0.3), transparent)',
              }} />
              <div className="relative z-10 text-center">
                <div className="text-5xl mb-[-0.5rem]" style={{ filter: 'drop-shadow(0 0 25px rgba(140,82,255,0.8))', animation: 'float 3s ease-in-out infinite' }}>🎧</div>
                <div className="text-3xl opacity-70" style={{ animation: 'float 3s ease-in-out infinite 0.5s' }}>🎛️</div>
              </div>
              {/* EQ Bars */}
              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-[3px] px-8 h-14">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t"
                    style={{
                      background: `linear-gradient(0deg, ${['#8c52ff', '#00b8ff', '#ff5f56', '#00ff88', '#ffbc00'][i % 5]}, ${['#00b8ff', '#8c52ff', '#ffbc00', '#00b8ff', '#ff5f56'][i % 5]})`,
                      height: `${30 + Math.random() * 70}%`,
                      animation: `eqBar ${0.3 + Math.random() * 0.3}s ease-in-out infinite alternate ${i * 0.1}s`,
                      transformOrigin: 'bottom',
                    }}
                  />
                ))}
              </div>
              {/* LIVE Badge */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded text-[0.7rem] font-black tracking-wider flex items-center gap-1.5"
                style={{ background: '#ff5f56', color: 'white' }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white" style={{ animation: 'ping 1s cubic-bezier(0,0,0.2,1) infinite' }} />
                EN DIRECTO
              </div>
            </div>
            {/* Deck Controls */}
            <div className="p-4" style={{ background: 'rgba(0,0,0,0.4)', borderTop: '1px solid var(--nightlife-border)' }}>
              <div className="grid grid-cols-3 items-center gap-4">
                <div>
                  <p className="text-[0.7rem] text-muted-foreground uppercase font-bold mb-1">DECK A</p>
                  <p className="text-sm font-extrabold">Afterlife Vol.7</p>
                  <p className="text-xs" style={{ color: '#8c52ff' }}>Tale of Us • 132 BPM</p>
                  <div className="h-1 bg-white/10 rounded mt-1.5 overflow-hidden"><div className="w-[63%] h-full" style={{ background: '#8c52ff' }} /></div>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black font-mono">132</p>
                  <p className="text-[0.65rem] text-muted-foreground uppercase">BPM</p>
                </div>
                <div className="text-right">
                  <p className="text-[0.7rem] text-muted-foreground uppercase font-bold mb-1">DECK B</p>
                  <p className="text-sm font-extrabold">Sirenian Night</p>
                  <p className="text-xs" style={{ color: '#00b8ff' }}>Innellea • 134 BPM</p>
                  <div className="h-1 bg-white/10 rounded mt-1.5 overflow-hidden"><div className="w-[28%] h-full ml-auto" style={{ background: '#00b8ff' }} /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DJView;
