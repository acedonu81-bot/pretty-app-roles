import { toast } from 'sonner';

const history = [
  { venue: 'Club Onyx Madrid', date: '12 Mar 2026', amount: '€ 450', status: 'Liberado', color: '#00ff88' },
  { venue: 'Horizon Rooftop BCN', date: '28 Feb 2026', amount: '€ 650', status: 'En Custodia 🔒', color: '#ffbc00' },
  { venue: 'Base Sound BCN', date: '14 Feb 2026', amount: '€ 380', status: 'Liberado', color: '#00ff88' },
  { venue: 'Noxe Club Valencia', date: '02 Feb 2026', amount: '€ 320', status: 'Liberado', color: '#00ff88' },
];

const earnings = [
  { month: 'E', value: '€800', height: 40 },
  { month: 'F', value: '€1.2k', height: 60 },
  { month: 'M', value: '€1.85k', height: 93 },
  { month: 'A', value: '—', height: 0 },
  { month: 'M', value: '—', height: 0 },
  { month: 'J', value: '—', height: 0 },
];

const WalletView = () => {
  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold mb-1">
          Finanzas & <span className="text-gradient">Wallet</span>
        </h2>
        <p className="text-muted-foreground">Control total de tus ingresos, escrows y movimientos en la plataforma.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Balance */}
        <div className="glass-panel p-6 rounded-2xl text-center">
          <p className="text-sm text-muted-foreground font-bold uppercase mb-2">Saldo Disponible</p>
          <p className="text-5xl font-black mb-1" style={{ color: '#00ff88' }}>€ 2,430</p>
          <p className="text-xs text-muted-foreground">+ €650 en custodia Escrow</p>
        </div>

        {/* Earnings chart */}
        <div className="glass-panel p-6 rounded-2xl">
          <h4 className="font-semibold mb-4">Ingresos 2026</h4>
          <div className="flex items-end gap-2 h-24">
            {earnings.map((e, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[0.65rem] text-muted-foreground">{e.value}</span>
                <div
                  className="w-full rounded-t-md transition-all duration-1000"
                  style={{
                    background: e.height > 0 ? 'linear-gradient(180deg,#8c52ff,#00b8ff)' : 'rgba(255,255,255,0.06)',
                    height: `${e.height}%`,
                    minHeight: 4,
                  }}
                />
                <span className="text-[0.7rem] text-muted-foreground">{e.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Escrow History */}
        <div className="glass-panel p-6 rounded-2xl lg:col-span-2">
          <h4 className="font-semibold mb-4">Historial de Escrow</h4>
          {history.map((h) => (
            <div key={h.venue + h.date} className="flex items-center gap-4 py-3" style={{ borderBottom: '1px solid var(--nightlife-border)' }}>
              <div className="flex-1">
                <p className="font-bold text-sm">{h.venue}</p>
                <p className="text-xs text-muted-foreground">{h.date}</p>
              </div>
              <span className="font-extrabold" style={{ color: h.color }}>{h.amount}</span>
              <span className="text-xs px-3 py-1 rounded-md font-semibold" style={{
                background: `${h.color}15`,
                color: h.color,
                border: `1px solid ${h.color}50`,
              }}>
                {h.status}
              </span>
            </div>
          ))}
          <button
            onClick={() => toast.success('Solicitud de retirada enviada. Procesamiento en 1-2 días hábiles.')}
            className="w-full mt-4 py-3 rounded-xl font-black text-sm"
            style={{ background: 'linear-gradient(90deg,#00ff88,#00b8ff)', color: '#000' }}
          >
            Retirar Saldo → Cuenta Bancaria
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletView;
