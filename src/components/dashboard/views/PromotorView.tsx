import { useState } from 'react';
import { Play, Eye, Building2, Users, Shield, Clock, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const streams = [
  {
    name: 'Kaelen', genre: 'Hard Techno', location: 'Berlin, Germany', viewers: 31,
    bg: 'linear-gradient(135deg, #0a0a0a, #1a1a1a)', initials: 'KA',
    seats: ['ON', 'BS', 'HZ', null],
  },
  {
    name: 'Niara', genre: 'Afro House / Organic', location: 'Lagos, Nigeria', viewers: 19,
    bg: 'linear-gradient(135deg, #0a0a0a, #1a1a1a)', initials: 'NI',
    seats: ['ON', 'HZ', null, null],
  },
];

const PromotorView = () => {
  const [showVenueForm, setShowVenueForm] = useState(false);
  const [venueData, setVenueData] = useState({
    venueName: '', capacity: '', hasSecurity: false,
    openingHours: '', closingHours: '', hiredStaff: '',
  });
  const [isVerified, setIsVerified] = useState(false);

  const handleVerify = () => {
    if (!venueData.venueName.trim()) {
      toast.error('Introduce el nombre de tu sala');
      return;
    }
    setIsVerified(true);
    toast.success('¡Sala registrada! Ahora puedes contactar profesionales.');
  };

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">
          Panel <span className="text-gradient">Empresario</span>
        </h2>
        <p className="text-sm text-muted-foreground">Busca profesionales y gestiona contrataciones en tiempo real.</p>
      </div>

      {/* Verification banner */}
      {!isVerified && (
        <div className="glass-panel p-4 mb-6" style={{ border: '1px solid rgba(212,175,55,0.2)' }}>
          <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowVenueForm(!showVenueForm)}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.1)' }}>
                <Building2 size={18} style={{ color: '#D4AF37' }} />
              </div>
              <div>
                <p className="text-sm font-bold">Verifica tu sala para contactar profesionales</p>
                <p className="text-xs text-muted-foreground">Rellena los datos de tu establecimiento</p>
              </div>
            </div>
            {showVenueForm ? <ChevronUp size={18} className="text-muted-foreground" /> : <ChevronDown size={18} className="text-muted-foreground" />}
          </div>

          {showVenueForm && (
            <div className="mt-4 pt-4 space-y-3" style={{ borderTop: '1px solid var(--nightlife-border)' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-[0.65rem] text-muted-foreground uppercase tracking-wider font-bold mb-1 block">Nombre de la sala *</label>
                  <input value={venueData.venueName} onChange={e => setVenueData({ ...venueData, venueName: e.target.value })}
                    placeholder="Ej: Club Onyx" className="nightlife-input !py-2.5 text-sm" />
                </div>
                <div>
                  <label className="text-[0.65rem] text-muted-foreground uppercase tracking-wider font-bold mb-1 block">Aforo</label>
                  <input value={venueData.capacity} onChange={e => setVenueData({ ...venueData, capacity: e.target.value })}
                    placeholder="Ej: 1200 personas" className="nightlife-input !py-2.5 text-sm" />
                </div>
                <div>
                  <label className="text-[0.65rem] text-muted-foreground uppercase tracking-wider font-bold mb-1 block">Horario apertura</label>
                  <input value={venueData.openingHours} onChange={e => setVenueData({ ...venueData, openingHours: e.target.value })}
                    placeholder="Ej: 23:00" className="nightlife-input !py-2.5 text-sm" />
                </div>
                <div>
                  <label className="text-[0.65rem] text-muted-foreground uppercase tracking-wider font-bold mb-1 block">Horario cierre</label>
                  <input value={venueData.closingHours} onChange={e => setVenueData({ ...venueData, closingHours: e.target.value })}
                    placeholder="Ej: 06:00" className="nightlife-input !py-2.5 text-sm" />
                </div>
                <div>
                  <label className="text-[0.65rem] text-muted-foreground uppercase tracking-wider font-bold mb-1 block">Personal contratado</label>
                  <input value={venueData.hiredStaff} onChange={e => setVenueData({ ...venueData, hiredStaff: e.target.value })}
                    placeholder="Ej: 15 personas" className="nightlife-input !py-2.5 text-sm" />
                </div>
                <div className="flex items-center gap-3 py-2">
                  <button
                    onClick={() => setVenueData({ ...venueData, hasSecurity: !venueData.hasSecurity })}
                    className="w-10 h-6 rounded-full transition-all duration-200 flex-shrink-0"
                    style={{
                      background: venueData.hasSecurity ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.1)',
                      border: venueData.hasSecurity ? '1px solid rgba(34,197,94,0.5)' : '1px solid var(--nightlife-border)',
                    }}
                  >
                    <div className="w-4 h-4 rounded-full m-0.5 transition-all duration-200"
                      style={{
                        background: venueData.hasSecurity ? '#22c55e' : 'var(--nightlife-text-secondary)',
                        transform: venueData.hasSecurity ? 'translateX(16px)' : 'translateX(0)',
                      }} />
                  </button>
                  <div>
                    <span className="text-xs font-medium flex items-center gap-1">
                      <Shield size={12} /> ¿Tiene seguridad propia?
                    </span>
                  </div>
                </div>
              </div>
              <button onClick={handleVerify} className="btn-nightlife-primary !py-2.5 !px-6 text-xs">
                Verificar Sala
              </button>
            </div>
          )}
        </div>
      )}

      {isVerified && (
        <div className="glass-panel p-3 mb-6 flex items-center gap-2" style={{ border: '1px solid rgba(34,197,94,0.2)' }}>
          <CheckCircle size={16} style={{ color: '#22c55e' }} />
          <span className="text-xs font-bold" style={{ color: '#22c55e' }}>Empresario verificado — {venueData.venueName}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'SHOWCASES EN VIVO', value: '07', color: '#ff5f56' },
          { label: 'PROFESIONALES FLASH', value: '24', color: '#22c55e' },
          { label: 'CONTACTOS HOY', value: '12', color: '#D4AF37' },
        ].map((s) => (
          <div key={s.label} className="glass-panel p-4">
            <span className="text-[0.55rem] text-muted-foreground font-bold uppercase tracking-wider">{s.label}</span>
            <div className="text-2xl font-bold mt-1" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full" style={{ background: '#ff5f56', animation: 'pulse 2s infinite' }} />
        Showcases en Directo
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {streams.map((stream) => (
          <div key={stream.name} className="glass-panel overflow-hidden group hover:-translate-y-0.5 transition-all duration-300">
            <div className="h-40 relative flex items-center justify-center" style={{ background: stream.bg }}>
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.8))' }} />
              <div className="absolute top-3 left-3 px-2 py-0.5 rounded text-[0.6rem] font-bold" style={{ background: '#ff5f56', color: 'white' }}>LIVE</div>
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded text-[0.6rem] flex items-center gap-1" style={{ background: 'rgba(0,0,0,0.6)' }}>
                <Eye size={10} /> {stream.viewers}
              </div>
              <div className="relative w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-110"
                style={{ background: 'rgba(212,175,55,0.8)' }}>
                <Play size={20} className="ml-0.5" fill="black" stroke="black" />
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-1">
                <h4 className="font-bold text-sm">{stream.name}</h4>
                <span className="text-xs text-muted-foreground">{stream.location}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">{stream.genre}</p>
              <div className="mb-3">
                <span className="text-[0.55rem] text-muted-foreground uppercase tracking-wider font-medium flex items-center gap-1 mb-1.5">
                  <Eye size={10} /> Asientos
                </span>
                <div className="flex gap-2 items-center">
                  {stream.seats.map((seat, i) =>
                    seat ? (
                      <div key={i} className="w-8 h-8 rounded-lg flex items-center justify-center text-[0.55rem] font-bold"
                        style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)' }}>
                        {seat}
                      </div>
                    ) : (
                      <div key={i} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground text-sm"
                        style={{ border: '1px dashed var(--nightlife-border)' }}>+</div>
                    )
                  )}
                </div>
              </div>
              <button
                className="w-full py-2.5 rounded-lg font-bold text-xs transition-all"
                style={{
                  background: stream.seats.filter(Boolean).length === 4 ? 'rgba(255,255,255,0.03)' : 'linear-gradient(90deg, #D4AF37, #B8941E)',
                  color: stream.seats.filter(Boolean).length === 4 ? 'var(--nightlife-text-secondary)' : '#000',
                  cursor: stream.seats.filter(Boolean).length === 4 ? 'not-allowed' : 'pointer',
                  opacity: stream.seats.filter(Boolean).length === 4 ? 0.5 : 1,
                }}
                onClick={() => {
                  if (stream.seats.filter(Boolean).length < 4) {
                    toast.success(`¡Has tomado asiento para ver a ${stream.name}!`);
                  }
                }}
              >
                {stream.seats.filter(Boolean).length === 4 ? 'Completo' : 'Tomar Asiento'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromotorView;
