import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, ShieldCheck, Truck, Volume2, Smile, Lock, CheckCircle, Loader2 } from 'lucide-react';

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  item: { name: string; price: number; description: string } | null;
}

const crossSellServices = [
  { id: 'sound', icon: Volume2, label: 'Equipo de Sonido Premium', price: 350, color: 'hsl(var(--secondary))' },
  { id: 'transport', icon: Truck, label: 'Transporte VIP', price: 180, color: 'hsl(var(--primary))' },
  { id: 'security', icon: ShieldCheck, label: 'Escolta Personal', price: 275, color: 'hsl(var(--accent))' },
  { id: 'makeup', icon: Smile, label: 'Estilismo & Makeup', price: 220, color: '#f472b6' },
];

const CheckoutModal = ({ open, onClose, item }: CheckoutModalProps) => {
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [step, setStep] = useState<'extras' | 'payment' | 'processing' | 'done'>('extras');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  if (!open || !item) return null;

  const toggleExtra = (id: string) => {
    setSelectedExtras(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);
  };

  const extrasTotal = crossSellServices.filter(s => selectedExtras.includes(s.id)).reduce((a, s) => a + s.price, 0);
  const total = item.price + extrasTotal;

  const handlePay = () => {
    setStep('processing');
    setTimeout(() => setStep('done'), 2500);
  };

  const handleClose = () => {
    setStep('extras');
    setSelectedExtras([]);
    setAcceptedTerms(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <div className="glass-panel w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto animate-[fadeIn_0.3s_ease]">
        {/* Header */}
        <div className="flex items-center justify-between p-6" style={{ borderBottom: '1px solid var(--nightlife-border)' }}>
          <h3 className="text-lg font-extrabold">
            {step === 'done' ? '✅ Pago Confirmado' : 'Checkout Escrow'}
          </h3>
          <button onClick={handleClose} className="p-1 rounded-lg hover:bg-white/5 transition-colors">
            <X size={20} className="text-muted-foreground" />
          </button>
        </div>

        {step === 'done' ? (
          <div className="p-8 text-center">
            <div className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center" style={{ background: 'hsla(var(--accent) / 0.15)', border: '2px solid hsl(var(--accent))' }}>
              <CheckCircle size={40} style={{ color: 'hsl(var(--accent))' }} />
            </div>
            <h4 className="text-xl font-extrabold mb-2">Pago en Escrow</h4>
            <p className="text-muted-foreground text-sm mb-4">
              €{total} retenidos de forma segura. Se liberarán al completar el servicio.
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-6">
              <Lock size={12} /> Protegido con Smart Contract XPEAK
            </div>
            <button onClick={handleClose} className="btn-nightlife-primary text-sm">Cerrar</button>
          </div>
        ) : step === 'processing' ? (
          <div className="p-12 text-center">
            <Loader2 size={48} className="mx-auto mb-5 animate-spin" style={{ color: 'hsl(var(--primary))' }} />
            <p className="text-sm font-bold text-muted-foreground">Procesando pago Escrow...</p>
            <p className="text-xs text-muted-foreground mt-1">Verificando Smart Contract</p>
          </div>
        ) : step === 'payment' ? (
          <div className="p-6">
            {/* Summary */}
            <div className="p-4 rounded-xl mb-5" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--nightlife-border)' }}>
              <p className="text-sm font-bold mb-2">{item.name}</p>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Servicio base</span><span>€{item.price}</span>
              </div>
              {crossSellServices.filter(s => selectedExtras.includes(s.id)).map(s => (
                <div key={s.id} className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>{s.label}</span><span>€{s.price}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm font-extrabold mt-3 pt-3" style={{ borderTop: '1px solid var(--nightlife-border)' }}>
                <span>Total Escrow</span>
                <span style={{ color: 'hsl(var(--accent))' }}>€{total}</span>
              </div>
            </div>

            {/* Fake card form */}
            <div className="space-y-3 mb-5">
              <input type="text" placeholder="Número de tarjeta" value="4242 •••• •••• 4242" readOnly className="nightlife-input text-sm" />
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="MM/AA" value="12/27" readOnly className="nightlife-input text-sm" />
                <input type="text" placeholder="CVC" value="•••" readOnly className="nightlife-input text-sm" />
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-5">
              <Lock size={12} style={{ color: 'hsl(var(--accent))' }} />
              <span>Fondos retenidos en Escrow hasta confirmación del servicio</span>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep('extras')} className="btn-nightlife-secondary flex-1 text-sm">Atrás</button>
              <button onClick={handlePay} className="btn-nightlife-primary flex-1 text-sm">Pagar €{total}</button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            {/* Item */}
            <div className="p-4 rounded-xl mb-5" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--nightlife-border)' }}>
              <p className="text-sm font-extrabold">{item.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
              <p className="text-lg font-extrabold mt-2" style={{ color: 'hsl(var(--accent))' }}>€{item.price}</p>
            </div>

            {/* Cross-sell */}
            <p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground mb-3">Añade servicios extra</p>
            <div className="space-y-2 mb-6">
              {crossSellServices.map(s => {
                const selected = selectedExtras.includes(s.id);
                return (
                  <button
                    key={s.id}
                    onClick={() => toggleExtra(s.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all"
                    style={{
                      background: selected ? 'hsla(var(--primary) / 0.08)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${selected ? 'hsla(var(--primary) / 0.4)' : 'var(--nightlife-border)'}`,
                    }}
                  >
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${s.color}18` }}>
                      <s.icon size={18} style={{ color: s.color }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold">{s.label}</p>
                      <p className="text-xs text-muted-foreground">+€{s.price}</p>
                    </div>
                    <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{
                      background: selected ? 'hsl(var(--primary))' : 'transparent',
                      border: `2px solid ${selected ? 'hsl(var(--primary))' : 'rgba(255,255,255,0.15)'}`,
                    }}>
                      {selected && <CheckCircle size={12} style={{ color: 'white' }} />}
                    </div>
                  </button>
                );
              })}
            </div>

            <button onClick={() => setStep('payment')} className="btn-nightlife-primary w-full text-sm">
              Continuar · €{total}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
