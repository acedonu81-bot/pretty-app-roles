import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Extraído de DashboardSidebar.tsx (lógica exacta, no reinventada) para que
// tanto el sidebar como la campanita de notificaciones del topbar (Task 7)
// compartan el mismo cálculo de badges en vivo.
// Respuestas ya vistas por el empresario (13 oct 2026). Su globo de Flash
// Booking contaba TODAS las reservas respondidas, para siempre, y ninguna
// acción lo apagaba ("las notificaciones se quedan clavadas"). Se guardan los
// ids ya vistos en este dispositivo y el globo solo cuenta los que faltan.
const ESTADOS_RESPONDIDOS = ['confirmed', 'accepted', 'rejected', 'declined'];
const EVENTO_FLASH_VISTO = 'xpeak:flash-visto';
const claveVistos = (uid: string) => `xpeak_flash_visto_${uid}`;

function leerVistos(uid: string): Set<string> {
  try {
    const crudo = JSON.parse(localStorage.getItem(claveVistos(uid)) ?? '[]');
    return new Set(Array.isArray(crudo) ? crudo.map(String) : []);
  } catch { return new Set(); }
}

/** Marca como vistas las respuestas actuales y avisa a los globos abiertos. */
export async function marcarFlashVisto(uid: string): Promise<void> {
  const { data } = await supabase.from('flash_bookings' as any)
    .select('id')
    .eq('created_by', uid)
    .in('status', ESTADOS_RESPONDIDOS);
  const ids = ((data ?? []) as { id: string }[]).map(r => r.id);
  const vistos = leerVistos(uid);
  ids.forEach(id => vistos.add(id));
  try { localStorage.setItem(claveVistos(uid), JSON.stringify([...vistos])); } catch { /* sin almacenamiento */ }
  window.dispatchEvent(new Event(EVENTO_FLASH_VISTO));
}

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
    if (isEmpresario) {
      // Al que contrata le importa lo que le han respondido y aún no ha visto.
      const { data } = await supabase.from('flash_bookings' as any)
        .select('id')
        .eq('created_by', uid)
        .in('status', ESTADOS_RESPONDIDOS);
      const vistos = leerVistos(uid);
      setFlashBadge(((data ?? []) as { id: string }[]).filter(r => !vistos.has(r.id)).length);
      return;
    }
    // Al profesional, lo que tiene pendiente de contestar.
    const { count } = await supabase.from('flash_bookings' as any)
      .select('id', { count: 'exact', head: true })
      .eq('professional_user_id', uid).eq('status', 'pending');
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
    // Otro globo (sidebar, campanita) o la propia vista marcó lo visto.
    const alVisto = () => { refreshFlashBadge(userId); };
    window.addEventListener(EVENTO_FLASH_VISTO, alVisto);
    return () => {
      window.removeEventListener(EVENTO_FLASH_VISTO, alVisto);
      supabase.removeChannel(channel);
    };
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
