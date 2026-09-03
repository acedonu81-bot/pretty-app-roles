import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Extraído de DashboardSidebar.tsx (lógica exacta, no reinventada) para que
// tanto el sidebar como la campanita de notificaciones del topbar (Task 7)
// compartan el mismo cálculo de badges en vivo.
export function useDashboardBadges(userId: string | undefined, isEmpresario: boolean) {
  const [flashBadge, setFlashBadge] = useState(0);
  const [msgBadge, setMsgBadge] = useState(0);
  // supabase.channel(topic) devuelve la MISMA instancia si ya existe un canal
  // con ese topic — con nombres fijos, el sidebar (que se desmonta al cerrar
  // el Sheet móvil) y la campanita (montada toda la sesión) compartían canal,
  // y el removeChannel() del sidebar mataba la suscripción de la campanita.
  // Un id por instancia evita que un removeChannel() afecte al otro consumidor.
  const instanceId = useRef(Math.random().toString(36).slice(2)).current;

  const refreshFlashBadge = async (uid: string) => {
    // Cada rol cuenta lo suyo. Antes el empresario salía antes de llegar aquí
    // (`if (isEmpresario) return`) y se quedaba SIN NINGÚN aviso: cuando un
    // profesional aceptaba o rechazaba su solicitud, no se enteraba por ningún
    // canal — ni badge, ni campana, ni email si había dejado teléfono en vez de
    // correo. Es el reverso exacto del fallo del 22 ago, y con la regla de casa
    // ("los empresarios NO esperan") era el lado que menos podía permitírselo.
    const q = supabase.from('flash_bookings' as any).select('id', { count: 'exact', head: true });
    const { count } = isEmpresario
      // Al que contrata le importa lo que le han respondido.
      ? await q.eq('created_by', uid).in('status', ['confirmed', 'accepted', 'rejected', 'declined'])
      // Al profesional, lo que tiene pendiente de contestar.
      : await q.eq('professional_user_id', uid).eq('status', 'pending');
    setFlashBadge(count ?? 0);
  };

  useEffect(() => {
    if (!userId) return;
    refreshFlashBadge(userId);
    const channel = supabase
      .channel(`sidebar_flash_bookings_${userId}_${instanceId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'flash_bookings', filter: `${isEmpresario ? 'created_by' : 'professional_user_id'}=eq.${userId}` }, () => {
        refreshFlashBadge(userId);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'flash_bookings', filter: `${isEmpresario ? 'created_by' : 'professional_user_id'}=eq.${userId}` }, () => {
        refreshFlashBadge(userId);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [userId, isEmpresario]);

  const refreshMsgBadge = async (uid: string) => {
    const { data } = await supabase.from('conversations')
      .select('id')
      .or(`participant_a.eq.${uid},participant_b.eq.${uid}`)
      .limit(30);
    if (!data || data.length === 0) { setMsgBadge(0); return; }
    const ids = data.map((c: { id: string }) => c.id);
    const { count } = await supabase.from('messages')
      .select('id', { count: 'exact', head: true })
      .in('conversation_id', ids)
      .neq('sender_id', uid)
      .eq('read', false);
    setMsgBadge(count ?? 0);
  };

  useEffect(() => {
    if (!userId) return;
    refreshMsgBadge(userId);
    const channel = supabase
      .channel(`badges_msgs_${userId}_${instanceId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => {
        refreshMsgBadge(userId);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages' }, () => {
        refreshMsgBadge(userId);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  return { flashBadge, msgBadge };
}
