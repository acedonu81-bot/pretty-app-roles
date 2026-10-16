import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { cargarInteresadosPendientes, cargarPorConfirmar, leerInteresadosVistos, EVENTO_INTERESADOS } from '@/hooks/useInteresadosPendientes';

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

// Ofertas nuevas de organizadores que el profesional aún no ha visto (13 oct
// 2026: un profesional buscó la de Burguerfest y no la encontró; el menú solo
// avisaba de reservas directas pendientes). Son las notificaciones
// 'event_request' sin leer: se leen al abrir Flash Booking > Demanda.
const EVENTO_OFERTAS_VISTAS = 'xpeak:ofertas-vistas';

/** Marca como leídas las ofertas nuevas y apaga los globos abiertos. */
export async function marcarOfertasVistas(uid: string): Promise<void> {
  await supabase.from('notifications' as any)
    .update({ is_read: true })
    .eq('user_id', uid)
    .eq('type', 'event_request')
    .eq('is_read', false);
  window.dispatchEvent(new Event(EVENTO_OFERTAS_VISTAS));
}

// Avisos de mensajes en la campana (16 oct 2026): cada mensaje nuevo crea una
// notificación 'message' sin leer para quien lo recibe, y leerlo en el chat no
// la tocaba, así que la campana seguía avisando de lo que ya estabas viendo.
// Al leer una conversación se marcan sus avisos (el título es "<nombre> te ha
// escrito"); si ya no queda ningún mensaje sin leer, se apagan todos.
export const EVENTO_AVISOS_MENSAJES = 'xpeak:avisos-mensajes-leidos';

export async function marcarAvisosMensajesLeidos(uid: string, convId: string): Promise<void> {
  try {
    const { data: conv } = await supabase.from('conversations')
      .select('participant_a, participant_b').eq('id', convId).maybeSingle();
    const otro = conv ? (conv.participant_a === uid ? conv.participant_b : conv.participant_a) : null;
    if (otro) {
      const { data: perfil } = await supabase.from('profiles')
        .select('display_name').eq('user_id', otro).order('is_primary', { ascending: false }).limit(1).maybeSingle();
      const nombre = perfil?.display_name?.trim() || 'Un usuario';
      await supabase.from('notifications' as any).update({ is_read: true })
        .eq('user_id', uid).eq('type', 'message').eq('is_read', false)
        .eq('title', `${nombre} te ha escrito`);
    }
    const { data: convs } = await supabase.from('conversations')
      .select('id').or(`participant_a.eq.${uid},participant_b.eq.${uid}`).limit(30);
    const ids = (convs ?? []).map((c: { id: string }) => c.id);
    const { count } = ids.length
      ? await supabase.from('messages').select('id', { count: 'exact', head: true })
        .in('conversation_id', ids).neq('sender_id', uid).eq('read', false)
      : { count: 0 };
    if (!count) {
      await supabase.from('notifications' as any).update({ is_read: true })
        .eq('user_id', uid).eq('type', 'message').eq('is_read', false);
    }
  } catch { /* el aviso se apagará en la siguiente lectura */ }
  window.dispatchEvent(new Event(EVENTO_AVISOS_MENSAJES));
}

export function useDashboardBadges(userId: string | undefined, isEmpresario: boolean) {
  const [flashBadge, setFlashBadge] = useState(0);
  const [msgBadge, setMsgBadge] = useState(0);
  const [demandaBadge, setDemandaBadge] = useState(0);
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
      const respuestas = ((data ?? []) as { id: string }[]).filter(r => !vistos.has(r.id)).length;
      // Y quien se ha apuntado a sus ofertas y aún no ha visto (13 oct 2026:
      // un DJ se apuntó a Burguerfest y el organizador no tenía ningún globo).
      let interesados = 0;
      try {
        const vistosInt = leerInteresadosVistos(uid);
        interesados = (await cargarInteresadosPendientes(uid)).filter(i => !vistosInt.has(i.responseId)).length;
      } catch { /* sin interesados no se rompe el resto del globo */ }
      setFlashBadge(respuestas + interesados);
      return;
    }
    // Al profesional, lo que tiene pendiente de contestar: reservas directas y
    // ofertas en las que ya le han elegido y falta que confirme.
    const { count } = await supabase.from('flash_bookings' as any)
      .select('id', { count: 'exact', head: true })
      .eq('professional_user_id', uid).eq('status', 'pending');
    let porConfirmar = 0;
    try { porConfirmar = (await cargarPorConfirmar(uid)).length; } catch { /* sin esto no se rompe el globo */ }
    setFlashBadge((count ?? 0) + porConfirmar);
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
    // El organizador se entera en vivo de que alguien se apuntó: su aviso
    // llega a la campana (la tabla de candidaturas no tiene realtime).
    let canalInteresados: ReturnType<typeof supabase.channel> | null = null;
    window.addEventListener(EVENTO_INTERESADOS, alVisto);
    canalInteresados = supabase
      .channel(`sidebar_interesados_${userId}_${instanceId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` }, () => {
        refreshFlashBadge(userId);
      })
      .subscribe();
    return () => {
      window.removeEventListener(EVENTO_FLASH_VISTO, alVisto);
      window.removeEventListener(EVENTO_INTERESADOS, alVisto);
      if (canalInteresados) supabase.removeChannel(canalInteresados);
      supabase.removeChannel(channel);
    };
  }, [userId, isEmpresario]);

  useEffect(() => {
    if (!userId || isEmpresario) { setDemandaBadge(0); return; }
    const cargar = async () => {
      const { count } = await supabase.from('notifications' as any)
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('type', 'event_request')
        .eq('is_read', false);
      setDemandaBadge(count ?? 0);
    };
    cargar();
    const channel = supabase
      .channel(`badges_ofertas_${userId}_${instanceId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` }, () => { cargar(); })
      .subscribe();
    window.addEventListener(EVENTO_OFERTAS_VISTAS, cargar);
    return () => {
      window.removeEventListener(EVENTO_OFERTAS_VISTAS, cargar);
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

  return { flashBadge, msgBadge, demandaBadge };
}
