import { useState } from 'react';
import { useProfile } from '@/hooks/useProfile';
import OfertaTab from './flashbooking/OfertaTab';
import DemandaTab from './flashbooking/DemandaTab';

const FlashBookingWallView = () => {
  const currentUser = useProfile();
  const isEmpresario = currentUser.role === 'empresario';
  const [tab, setTab] = useState<'oferta' | 'demanda'>(isEmpresario ? 'demanda' : 'oferta');

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="mb-5">
        <h2 className="text-2xl font-bold mb-1">Flash <span className="text-gradient">Booking</span></h2>
        <p className="text-sm text-muted-foreground">Oferta y demanda en tiempo real. Contratos cerrados en minutos.</p>
      </div>

      <div className="flex gap-2 mb-5">
        <button onClick={() => setTab('oferta')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all"
          style={{
            background: tab === 'oferta' ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${tab === 'oferta' ? 'rgba(212,175,55,0.4)' : 'var(--nightlife-border)'}`,
            color: tab === 'oferta' ? '#D4AF37' : '#8E8EA0',
          }}>
          <span className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: tab === 'oferta' ? '#D4AF37' : '#555', boxShadow: tab === 'oferta' ? '0 0 6px rgba(212,175,55,0.8)' : 'none' }} />
          Oferta <span className="text-[0.6rem] opacity-60 ml-0.5">(profesionales disponibles)</span>
        </button>
        <button onClick={() => setTab('demanda')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all"
          style={{
            background: tab === 'demanda' ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${tab === 'demanda' ? 'rgba(34,197,94,0.3)' : 'var(--nightlife-border)'}`,
            color: tab === 'demanda' ? '#22c55e' : '#8E8EA0',
          }}>
          <span className="w-2 h-2 rounded-full flex-shrink-0 animate-pulse"
            style={{ background: tab === 'demanda' ? '#22c55e' : '#555', boxShadow: tab === 'demanda' ? '0 0 6px rgba(34,197,94,0.8)' : 'none' }} />
          Demanda <span className="text-[0.6rem] opacity-60 ml-0.5">(ofertas de empresarios)</span>
        </button>
      </div>

      {tab === 'oferta' && <OfertaTab />}
      {tab === 'demanda' && <DemandaTab />}
    </div>
  );
};

export default FlashBookingWallView;
