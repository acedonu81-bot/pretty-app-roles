import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useDashboardBadges, marcarOfertasVistas } from '@/hooks/useDashboardBadges';
import OfertaTab from './flashbooking/OfertaTab';
import DemandaTab from './flashbooking/DemandaTab';
import SolicitudesTab from './flashbooking/SolicitudesTab';

const FlashBookingWallView = () => {
  const currentUser = useProfile();
  const { user } = useAuth();
  const location = useLocation();
  const isEmpresario = currentUser.role === 'empresario';
  // El enlace del email "Nueva solicitud Flash Booking" pasa ?tab=solicitudes
  // para abrir directamente en la solicitud recibida, en vez de la pestaña
  // por defecto (oferta/demanda).
  const tabFromQuery = new URLSearchParams(location.search).get('tab');
  const [tab, setTab] = useState<'oferta' | 'demanda' | 'solicitudes'>(
    tabFromQuery === 'solicitudes' && !isEmpresario ? 'solicitudes'
      : tabFromQuery === 'demanda' ? 'demanda'
      : (isEmpresario ? 'demanda' : 'oferta')
  );
  const [pendingCount, setPendingCount] = useState(0);

  // Ofertas nuevas de organizadores que el profesional aún no ha visto. Un
  // profesional buscó la de Burguerfest y "dio vueltas" sin encontrarla (13 oct
  // 2026): Flash Booking abría en "Oferta" (profesionales disponibles) y las
  // ofertas de organizadores están en "Nueva oferta" (antes "Demanda"). Si hay nuevas, abre ahí
  // (salvo que el enlace pida otra pestaña a propósito o el usuario ya haya
  // elegido una) y, si está en otra, un aviso verde lo lleva.
  const { demandaBadge } = useDashboardBadges(user?.id, isEmpresario);
  const eligioPestana = useRef(!!tabFromQuery);
  const elegir = (t: 'oferta' | 'demanda' | 'solicitudes') => { eligioPestana.current = true; setTab(t); };
  useEffect(() => {
    if (!isEmpresario && demandaBadge > 0 && !eligioPestana.current) {
      eligioPestana.current = true;
      setTab('demanda');
    }
  }, [demandaBadge, isEmpresario]);
  // Verlas en "Nueva oferta" las da por vistas y apaga los globos.
  useEffect(() => {
    if (tab === 'demanda' && !isEmpresario && user?.id && demandaBadge > 0) void marcarOfertasVistas(user.id);
  }, [tab, isEmpresario, user?.id, demandaBadge]);

  // El valor inicial de tab solo se evalúa al MONTAR el componente. Si el
  // usuario ya estaba dentro de esta vista (otra pestaña) y llega aquí vía
  // notificación/email con ?tab=solicitudes, React Router no remonta
  // FlashBookingWallView (misma ruta base) — sin este efecto, el clic en la
  // notificación "no hacía nada" visualmente porque la pestaña no cambiaba
  // (reportado por el usuario el 3 oct 2026, tras valorar y querer volver).
  useEffect(() => {
    if (tabFromQuery === 'solicitudes' && !isEmpresario) setTab('solicitudes');
    if (tabFromQuery === 'demanda') setTab('demanda');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabFromQuery]);

  // Count pending incoming requests for professionals.
  // Se recuenta con cada cambio en flash_bookings: antes se leía una sola vez
  // al montar, así que el badge seguía mostrando el número viejo después de
  // aceptar o rechazar una solicitud hasta recargar la página.
  useEffect(() => {
    if (isEmpresario || !user) return;
    const load = () => {
      supabase.from('flash_bookings' as any)
        .select('id', { count: 'exact', head: true })
        .eq('professional_user_id', user.id)
        .eq('status', 'pending')
        .then(({ count }) => setPendingCount(count ?? 0));
    };
    load();
    // Topic único por usuario e instancia: supabase.channel() devuelve el mismo
    // canal si el topic ya existe, y un remonte rápido mataba la suscripción.
    const channel = supabase
      .channel(`flashwall_pending_${user.id}_${Math.random().toString(36).slice(2)}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'flash_bookings',
        filter: `professional_user_id=eq.${user.id}`,
      }, load)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, isEmpresario]);

  const tabs = [
    { id: 'oferta' as const, label: 'Oferta', sub: 'profesionales disponibles', color: '#8A6D0F', pulse: false },
    { id: 'demanda' as const, label: 'Nueva oferta', sub: 'dj, staff, lo que sea', color: '#22c55e', texto: '#166534', pulse: true },
    ...(!isEmpresario ? [{ id: 'solicitudes' as const, label: 'Solicitudes', sub: 'recibidas', color: '#8A6D0F', pulse: false }] : []),
  ];

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="mb-5">
        <h2 className="text-2xl font-bold mb-1">Flash <span className="text-gradient">Booking</span></h2>
        <p className="text-sm text-muted-foreground">Oferta y demanda en tiempo real. Contratos cerrados en minutos.</p>
      </div>

      {!isEmpresario && demandaBadge > 0 && tab !== 'demanda' && (
        <div className="mb-4 flex items-center gap-3 p-3 rounded-xl"
          style={{ background: 'rgba(22,163,74,0.1)', border: '1.5px solid #16a34a' }}>
          <span className="w-3 h-3 rounded-full flex-shrink-0 motion-safe:[animation:ofertaParpadeo_1.3s_ease-in-out_infinite]" style={{ background: '#16a34a' }} />
          <p className="flex-1 text-sm font-black" style={{ color: '#15803d' }}>
            {demandaBadge === 1 ? 'Tienes 1 oferta nueva de organizadores' : `Tienes ${demandaBadge} ofertas nuevas de organizadores`}
          </p>
          <button type="button" onClick={() => elegir('demanda')}
            className="px-3 py-2 rounded-lg text-xs font-black flex-shrink-0"
            style={{ background: '#15803d', color: '#fff' }}>
            Ver las ofertas
          </button>
        </div>
      )}

      <div className="flex gap-2 mb-5 flex-wrap">
        {tabs.map(t => (
          <button key={t.id} onClick={() => elegir(t.id)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all"
            style={{
              // El dorado de estos tabs es '#8A6D0F': comparar con '#D4AF37'
              // nunca acertaba, así que los tabs dorados salían con fondo verde.
              background: tab === t.id ? `rgba(${t.color === '#22c55e' ? '34,197,94' : '212,175,55'},0.12)` : 'rgba(0,0,0,0.03)',
              border: `1px solid ${tab === t.id ? `rgba(${t.color === '#22c55e' ? '34,197,94' : '212,175,55'},0.4)` : 'var(--nightlife-border)'}`,
              // Texto legible: el verde de marca (#22c55e) sobre su propio fondo
              // pálido daba 1,86:1; la pestaña verde usa un verde oscuro (5,8:1).
              color: tab === t.id ? ('texto' in t ? t.texto : t.color) : '#3d3d4e',
            }}>
            <span className="w-2 h-2 rounded-full flex-shrink-0"
              style={{
                background: tab === t.id ? t.color : '#555',
                boxShadow: tab === t.id ? `0 0 6px ${t.color}cc` : 'none',
              }} />
            {t.label}
            {t.id === 'demanda' && !isEmpresario && demandaBadge > 0 && (
              <span className="text-[0.7rem] font-black px-1.5 py-0.5 rounded-full motion-safe:[animation:ofertaParpadeo_1.3s_ease-in-out_infinite]"
                style={{ background: '#15803d', color: '#fff' }}>
                {demandaBadge} {demandaBadge === 1 ? 'nueva' : 'nuevas'}
              </span>
            )}
            {t.id === 'solicitudes' && pendingCount > 0 && (
              <span className="text-[0.7rem] font-black px-1.5 py-0.5 rounded-full motion-safe:[animation:ofertaParpadeo_1.3s_ease-in-out_infinite]"
                style={{ background: 'rgba(212,175,55,0.35)', color: '#8A6D0F' }}>
                {pendingCount}
              </span>
            )}
            <span className="text-xs opacity-80 ml-0.5 hidden sm:inline">({t.sub})</span>
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
