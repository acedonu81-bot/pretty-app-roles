import { useState, useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import OfertaTab from './flashbooking/OfertaTab';
import DemandaTab from './flashbooking/DemandaTab';
import SolicitudesTab from './flashbooking/SolicitudesTab';

const FlashBookingWallView = () => {
  const currentUser = useProfile();
  const { user } = useAuth();
  const isEmpresario = currentUser.role === 'empresario';
  const [tab, setTab] = useState<'oferta' | 'demanda' | 'solicitudes'>(isEmpresario ? 'demanda' : 'oferta');
  const [pendingCount, setPendingCount] = useState(0);

  // Count pending incoming requests for professionals
  useEffect(() => {
    if (isEmpresario || !user) return;
    supabase.from('flash_bookings' as any)
      .select('id', { count: 'exact', head: true })
      .eq('professional_user_id', user.id)
      .eq('status', 'pending')
      .then(({ count }) => setPendingCount(count ?? 0));
  }, [user, isEmpresario]);

  const tabs = [
    { id: 'oferta' as const, label: 'Oferta', sub: 'profesionales disponibles', color: '#8A6D0F', pulse: false },
    { id: 'demanda' as const, label: 'Demanda', sub: 'ofertas de empresarios', color: '#22c55e', pulse: true },
    ...(!isEmpresario ? [{ id: 'solicitudes' as const, label: 'Solicitudes', sub: 'recibidas', color: '#8A6D0F', pulse: false }] : []),
  ];

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="mb-5">
        <h2 className="text-2xl font-bold mb-1">Flash <span className="text-gradient">Booking</span></h2>
        <p className="text-sm text-muted-foreground">Oferta y demanda en tiempo real. Contratos cerrados en minutos.</p>
      </div>

      <div className="flex gap-2 mb-5 flex-wrap">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all"
            style={{
              background: tab === t.id ? `rgba(${t.color === '#D4AF37' ? '212,175,55' : '34,197,94'},0.12)` : 'rgba(0,0,0,0.03)',
              border: `1px solid ${tab === t.id ? `rgba(${t.color === '#D4AF37' ? '212,175,55' : '34,197,94'},0.4)` : 'var(--nightlife-border)'}`,
              color: tab === t.id ? t.color : '#3d3d4e',
            }}>
            <span className="w-2 h-2 rounded-full flex-shrink-0"
              style={{
                background: tab === t.id ? t.color : '#555',
                boxShadow: tab === t.id ? `0 0 6px ${t.color}cc` : 'none',
              }} />
            {t.label}
            {t.id === 'solicitudes' && pendingCount > 0 && (
              <span className="text-[0.7rem] font-black px-1.5 py-0.5 rounded-full"
                style={{ background: 'rgba(212,175,55,0.2)', color: '#8A6D0F' }}>
                {pendingCount}
              </span>
            )}
            <span className="text-xs opacity-60 ml-0.5 hidden sm:inline">({t.sub})</span>
          </button>
        ))}
      </div>

      {tab === 'oferta'      && <OfertaTab />}
      {tab === 'demanda'     && <DemandaTab />}
      {tab === 'solicitudes' && <SolicitudesTab />}
    </div>
  );
};

export default FlashBookingWallView;
