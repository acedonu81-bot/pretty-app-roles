import { useState } from 'react';
import { X, ShieldCheck, Truck, Volume2, Smile, Lock, CheckCircle } from 'lucide-react';

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
  const [step, setStep] = useState<'extras' | 'pending'>('extras');

  if (!open || !item) return null;

  const toggleExtra = (id: string) => {
    setSelectedExtras(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);
  };

  const extrasTotal = crossSellServices.filter(s => selectedExtras.includes(s.id)).reduce((a, s) => a + s.price, 0);
  const total = item.price + extrasTotal;

  const handleClose = () => {
    setStep('extras');
    setSelectedExtras([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <div className="glass-panel w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto animate-[fadeIn_0.3s_ease]">
        {/* Header */}
        <div className="flex items-center justify-between p-6" style={{ borderBottom: '1px solid var(--nightlife-border)' }}>
          <h3 className="text-lg font-extrabold">{item.name}</h3>
          <button onClick={handleClose} className="p-1 rounded-lg hover:bg-white/5 transition-colors">
            <X size={20} className="text-muted-foreground" />
          </button>
        </div>

        {step === 'pending' ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
              style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)' }}>
              <Lock size={28} style={{ color: 'rgba(212,175,55,0.6)' }} />
            </div>
            <h4 className="text-base font-extrabold mb-2">Pago próximamente</h4>
            <p className="text-sm text-muted-foreground mb-2">
              La pasarela de pago está en integración final.
            </p>
            <p className="text-[0.7rem] text-muted-foreground mb-1">
              Resumen de tu pedido:
            </p>
            <p className="text-xl font-black mb-1" style={{ color: '#D4AF37' }}>€{total}</p>
            {selectedExtras.length > 0 && (
              <div className="text-xs text-muted-foreground mb-4 space-y-0.5">
                <p>{item.name} — €{item.price}</p>
                {crossSellServices.filter(s => selectedExtras.includes(s.id)).map(s => (
                  <p key={s.id}>{s.label} — €{s.price}</p>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground mb-6">
              En cuanto esté operativa podrás completar la compra directamente aquí.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setStep('extras')} className="btn-nightlife-secondary flex-1 text-sm">Atrás</button>
              <button onClick={handleClose} className="btn-nightlife-primary flex-1 text-sm">Entendido</button>
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
                      background: selected ? 'hsla(var(--primary) / 0.08)' : 'rgba(0,0,0,0.03)',
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
                      border: `2px solid ${selected ? 'hsl(var(--primary))' : 'rgba(0,0,0,0.1)'}`,
                    }}>
                      {selected && <CheckCircle size={12} style={{ color: '#222' }} />}
                    </div>
                  </button>
                );
              })}
            </div>

            <button onClick={() => setStep('pending')} className="btn-nightlife-primary w-full text-sm">
              Continuar · €{total}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
