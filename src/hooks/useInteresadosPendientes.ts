import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

// 13 oct 2026: un DJ se apuntó a la oferta de Burguerfest y el organizador no
// se enteró. Su único aviso era la campana: sin push, sin email, sin globo en
// el menú y con el candidato dentro de una tarjeta plegada. "Interesado
// pendiente" = alguien apuntado a una oferta ABIERTA de este organizador al que
// aún no ha elegido.
export interface InteresadoPendiente {
  responseId: string;
  requestId: string;
  titulo: string;
  professionalUserId: string;
  nombre: string;
  creado: string;
}

/** Algo cambió (alguien se apuntó, el organizador eligió, canceló...): recalcular. */
export const EVENTO_INTERESADOS = 'xpeak:interesados-cambio';
const claveVistos = (uid: string) => `xpeak_interesados_visto_${uid}`;

export function leerInteresadosVistos(uid: string): Set<string> {
  try {
    const crudo = JSON.parse(localStorage.getItem(claveVistos(uid)) ?? '[]');
    return new Set(Array.isArray(crudo) ? crudo.map(String) : []);
  } catch { return new Set(); }
}

/** El globo del menú se apaga al abrir Flash Booking; el aviso de la vista, no. */
export function marcarInteresadosVistos(uid: string, lista: InteresadoPendiente[]): void {
  if (lista.length === 0) return;
  const vistos = leerInteresadosVistos(uid);
  const antes = vistos.size;
  lista.forEach(i => vistos.add(i.responseId));
  if (vistos.size === antes) return;
  try { localStorage.setItem(claveVistos(uid), JSON.stringify([...vistos])); } catch { /* sin almacenamiento */ }
  window.dispatchEvent(new Event(EVENTO_INTERESADOS));
}

export async function cargarInteresadosPendientes(uid: string): Promise<InteresadoPendiente[]> {
  const { data, error } = await supabase
    .from('event_request_responses' as any)
    .select('id, request_id, professional_user_id, created_at, event_requests!inner(client_user_id, client_name, status, expires_at)')
    .is('hired_at', null)
    .is('chosen_at', null)
    .eq('event_requests.client_user_id', uid)
    .eq('event_requests.status', 'open')
    .order('created_at', { ascending: false });
  if (error || !Array.isArray(data)) return [];

  type Fila = {
    id: string; request_id: string; professional_user_id: string; created_at: string;
    event_requests: { client_name: string | null; expires_at: string | null } | null;
  };
  const ahora = Date.now();
  const filas = (data as unknown as Fila[]).filter(f => {
    const caduca = f.event_requests?.expires_at ? new Date(f.event_requests.expires_at).getTime() : Infinity;
    return caduca > ahora;
  });
  if (filas.length === 0) return [];

  const ids = [...new Set(filas.map(f => f.professional_user_id))];
  const { data: perfiles } = await supabase.from('profiles').select('user_id, display_name').in('user_id', ids);
  const nombres = new Map<string, string>();
  for (const p of (perfiles ?? []) as { user_id: string; display_name: string | null }[]) {
    if (!nombres.has(p.user_id) && p.display_name?.trim()) nombres.set(p.user_id, p.display_name.trim());
  }

  return filas.map(f => ({
    responseId: f.id,
    requestId: f.request_id,
    titulo: f.event_requests?.client_name?.trim() || 'tu oferta',
    professionalUserId: f.professional_user_id,
    nombre: nombres.get(f.professional_user_id) ?? 'Un profesional',
    creado: f.created_at,
  }));
}

/**
 * Interesados sin elegir del organizador, siempre al día: al abrir, cuando llega
 * su aviso en vivo (la campana sí tiene realtime; event_request_responses no),
 * al volver a la pestaña y cuando otra parte de la app cambia algo.
 */
export function useInteresadosPendientes(userId: string | undefined, activo: boolean) {
  const [pendientes, setPendientes] = useState<InteresadoPendiente[]>([]);
  const [cargado, setCargado] = useState(false);
  const instanceId = useRef(Math.random().toString(36).slice(2)).current;

  const recargar = useCallback(async () => {
    if (!userId || !activo) return;
    try {
      setPendientes(await cargarInteresadosPendientes(userId));
    } catch {
      setPendientes([]);
    } finally {
      setCargado(true);
    }
  }, [userId, activo]);

  useEffect(() => {
    if (!userId || !activo) { setPendientes([]); setCargado(false); return; }
    void recargar();
    const channel = supabase
      .channel(`interesados_${userId}_${instanceId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` }, () => { void recargar(); })
      .subscribe();
    const alVolver = () => { if (document.visibilityState === 'visible') void recargar(); };
    window.addEventListener(EVENTO_INTERESADOS, recargar);
    document.addEventListener('visibilitychange', alVolver);
    return () => {
      window.removeEventListener(EVENTO_INTERESADOS, recargar);
      document.removeEventListener('visibilitychange', alVolver);
      supabase.removeChannel(channel);
    };
  }, [userId, activo, recargar, instanceId]);

  return { pendientes, cargado, recargar };
}

// Lado del profesional: el organizador ya le ha elegido y falta SU confirmación.
// Es lo único que tiene que hacer para cerrar el bolo, y antes no tenía ningún
// aviso fijo: solo la campana y un enlace que no abría la oferta (13 oct 2026).
export interface PorConfirmar {
  responseId: string;
  requestId: string;
  titulo: string;
  organizadorId: string | null;
}

export async function cargarPorConfirmar(uid: string): Promise<PorConfirmar[]> {
  const { data, error } = await supabase
    .from('event_request_responses' as any)
    .select('id, request_id, event_requests!inner(client_user_id, client_name, status, expires_at)')
    .eq('professional_user_id', uid)
    .is('hired_at', null)
    .not('chosen_at', 'is', null)
    .eq('event_requests.status', 'open');
  if (error || !Array.isArray(data)) return [];
  type Fila = { id: string; request_id: string; event_requests: { client_user_id: string | null; client_name: string | null; expires_at: string | null } | null };
  const ahora = Date.now();
  return (data as unknown as Fila[])
    .filter(f => (f.event_requests?.expires_at ? new Date(f.event_requests.expires_at).getTime() : Infinity) > ahora)
    .map(f => ({
      responseId: f.id,
      requestId: f.request_id,
      titulo: f.event_requests?.client_name?.trim() || 'Un organizador',
      organizadorId: f.event_requests?.client_user_id ?? null,
    }));
}

/** Ofertas en las que el profesional está elegido y aún no ha confirmado. */
export function usePorConfirmar(userId: string | undefined, activo: boolean) {
  const [porConfirmar, setPorConfirmar] = useState<PorConfirmar[]>([]);
  const instanceId = useRef(Math.random().toString(36).slice(2)).current;

  const recargar = useCallback(async () => {
    if (!userId || !activo) return;
    try { setPorConfirmar(await cargarPorConfirmar(userId)); } catch { setPorConfirmar([]); }
  }, [userId, activo]);

  useEffect(() => {
    if (!userId || !activo) { setPorConfirmar([]); return; }
    void recargar();
    const channel = supabase
      .channel(`por_confirmar_${userId}_${instanceId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` }, () => { void recargar(); })
      .subscribe();
    const alVolver = () => { if (document.visibilityState === 'visible') void recargar(); };
    window.addEventListener(EVENTO_INTERESADOS, recargar);
    document.addEventListener('visibilitychange', alVolver);
    return () => {
      window.removeEventListener(EVENTO_INTERESADOS, recargar);
      document.removeEventListener('visibilitychange', alVolver);
      supabase.removeChannel(channel);
    };
  }, [userId, activo, recargar, instanceId]);

  return { porConfirmar, recargar };
}
