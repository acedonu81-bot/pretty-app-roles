import { useState } from 'react';
import { toast } from 'sonner';
import { Package, Ticket, Music2, MessageCircle } from 'lucide-react';
const ICON_MAP: Record<string, React.ElementType> = { Package, Ticket, Music2, MessageCircle };

interface VipFan { id: string; fan_id: string; amount: number; created_at: string; streak: number; sessionDate: string; giftSent: boolean; }

const GIFT_OPTIONS = [
  { id: 'merch', icon: 'Package', label: 'Merch firmado' },
  { id: 'event', icon: 'Ticket', label: 'Acceso VIP evento' },
  { id: 'track', icon: 'Music2', label: 'Track inédito' },
  { id: 'message', icon: 'MessageCircle', label: 'Mensaje personal' },
];

const VipFanCard = ({ vf }: { vf: VipFan }) => {
  const [giftPicked, setGiftPicked] = useState('');
  const [giftConfirmed, setGiftConfirmed] = useState(vf.giftSent);

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.15)' }}>
      <div className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,rgba(255,255,255,0.15),rgba(255,255,255,0.05))', color: '#fff', fontSize: 14, border: '1px solid rgba(255,255,255,0.15)' }}>
          {vf.fan_id.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold truncate">{vf.fan_id}</p>
            <span className="text-[0.5rem] font-black px-1.5 py-0.5 rounded-full flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>VIP</span>
          </div>
          <p className="text-[0.6rem] text-muted-foreground">
            {vf.streak} meses seguidos · desde {new Date(vf.created_at).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}
          </p>
        </div>
        <span className="text-sm font-black flex-shrink-0" style={{ color: '#22c55e' }}>€47,92</span>
      </div>

      <div className="px-4 pb-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl p-3" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}>
          <p className="text-[0.55rem] font-bold uppercase tracking-wider mb-1" style={{ color: '#D4AF37' }}>Próxima sesión 1:1</p>
          <p className="text-xs font-bold">{vf.sessionDate}</p>
          <button onClick={() => toast.info('Abre Escenario Virtual para iniciar la sesión')}
            className="mt-2 text-[0.55rem] font-bold px-2 py-1 rounded-lg transition-all hover:opacity-80"
            style={{ background: 'rgba(212,175,55,0.12)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }}>
            Confirmar cita
          </button>
        </div>

        <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-[0.55rem] font-bold uppercase tracking-wider mb-1.5"
            style={{ color: giftConfirmed ? '#22c55e' : 'rgba(255,255,255,0.5)' }}>
            {giftConfirmed ? '✓ Regalo enviado' : 'Regalo de abril'}
          </p>
          {giftConfirmed ? (
            <p className="text-[0.6rem] text-muted-foreground">El fan ha recibido su regalo mensual.</p>
          ) : (
            <>
              <div className="flex gap-1 flex-wrap mb-2">
                {GIFT_OPTIONS.map(g => (
                  <button key={g.id} onClick={() => setGiftPicked(g.id)}
                    className="text-base transition-all hover:scale-110"
                    style={{ opacity: giftPicked === g.id ? 1 : 0.35, filter: giftPicked === g.id ? 'drop-shadow(0 0 4px rgba(255,255,255,0.5))' : 'none' }}
                    title={g.label}>
                    {(() => { const I = ICON_MAP[g.icon]; return I ? <I size={16} /> : null; })()}
                  </button>
                ))}
              </div>
              <button
                onClick={() => { if (!giftPicked) { toast.error('Elige un regalo primero'); return; } setGiftConfirmed(true); toast.success('¡Regalo de abril enviado!'); }}
                className="text-[0.55rem] font-bold px-2 py-1 rounded-lg transition-all hover:opacity-80"
                style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>
                Confirmar regalo
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VipFanCard;
