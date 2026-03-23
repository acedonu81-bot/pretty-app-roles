import { ShieldCheck, MapPin } from 'lucide-react';
import { toast } from 'sonner';

const talents = [
  { name: 'Valeria R.', role: 'Azafata de Alta Imagen', rating: '4.9', events: 12, price: '€25/h', seed: 'valeria' },
  { name: 'Mateo G.', role: 'Promotor / RRPP', rating: '4.7', events: 8, price: '€20/h', seed: 'mateo' },
];

const AgencyView = () => {
  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold mb-1">
          Panel de <span className="text-gradient">Personal de Imagen</span>
        </h2>
        <p className="text-muted-foreground">Gestión de staff VIP, verificación KYC y contratos con pagos en custodia (Escrow).</p>
      </div>

      {/* Talent Cards */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
          <ShieldCheck size={18} /> Catálogo Verificado (Anti-Filtros)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {talents.map((talent) => (
            <div key={talent.name} className="glass-panel rounded-2xl overflow-hidden">
              <div className="relative h-60 bg-black">
                <img
                  src={`https://picsum.photos/seed/${talent.seed}/500/500`}
                  alt={talent.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-[0.7rem] font-extrabold flex items-center gap-1"
                  style={{
                    background: 'rgba(0,0,0,0.8)',
                    backdropFilter: 'blur(5px)',
                    border: '1px solid rgba(0,255,136,0.4)',
                    boxShadow: '0 0 10px rgba(0,255,136,0.2)',
                  }}
                >
                  <span style={{ color: '#00ff88' }}>●</span> KYC Verified
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center">
                  <h4 className="text-xl font-bold">{talent.name}</h4>
                  <span className="font-extrabold" style={{ color: 'var(--nightlife-secondary)' }}>{talent.price}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {talent.role} • ★ {talent.rating} ({talent.events} Eventos)
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Escrow Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
            <ShieldCheck size={18} /> Smart Contracts & Escrow
          </h3>
          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 px-3 py-1.5 text-[0.7rem] font-extrabold rounded-bl-lg"
              style={{ background: 'rgba(255,189,46,0.2)', color: '#ffbd2e' }}
            >
              FONDOS EN CUSTODIA
            </div>

            <h4 className="font-semibold mt-2 mb-1">Contrato: Club Onyx (Mesa VIP)</h4>
            <p className="text-sm text-muted-foreground mb-6">Personal: Valeria R. (4 horas)</p>

            <div className="p-4 rounded-lg mb-6" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Depósito del Cliente</span>
                <span className="font-semibold">€100.00</span>
              </div>
              <div className="flex justify-between mb-2 pb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <span className="text-sm" style={{ color: '#ff5f56' }}>Comisión (15%) + Seguro RC</span>
                <span className="font-semibold" style={{ color: '#ff5f56' }}>-€15.00</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="font-extrabold" style={{ color: 'var(--nightlife-secondary)' }}>Neto Garantizado</span>
                <span className="text-xl font-extrabold" style={{ color: 'var(--nightlife-secondary)' }}>€85.00</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center mb-4">
              * El pago se liberará automáticamente al hacer Check-In en la sala (Geofencing GPS).
            </p>

            <button
              className="btn-nightlife-primary w-full flex items-center justify-center gap-2"
              onClick={() => toast.success('Check-In GPS verificado — Fondos liberados hacia tu Wallet')}
            >
              <MapPin size={16} /> Activar Check-In GPS Seguro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgencyView;
