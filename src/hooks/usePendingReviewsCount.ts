import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';

const TRATO_CERRADO = ['confirmed', 'accepted', 'completed', 'closed'];

/** A quién le falta valorar a este usuario (ids), con el mismo criterio de "trato cerrado" que el contador. */
export async function fetchPendingReviewTargets(userId: string, role: string | null | undefined): Promise<string[]> {
  const isEmpresario = role === 'empresario';

  // Lado profesional: organizadores que le contrataron (created_by) que
  // aún no valoró. Lado organizador: profesionales que contrató
  // (professional_user_id) que aún no valoró.
  const flashQuery = isEmpresario
    ? supabase.from('flash_bookings').select('professional_user_id').eq('created_by', userId).in('status', TRATO_CERRADO).not('professional_user_id', 'is', null)
    : supabase.from('flash_bookings').select('created_by').eq('professional_user_id', userId).in('status', TRATO_CERRADO);

  // El filtro por la columna de la tabla joined (event_requests.client_user_id)
  // no se aplica aquí vía .eq() anidado — mismo motivo que HistorialTab.tsx/
  // SolicitudesTab.tsx: se trae sin filtrar por ese lado y se cruza en JS.
  const requestQuery = isEmpresario
    ? supabase.from('event_request_responses' as any).select('professional_user_id, event_requests!inner(client_user_id)').not('hired_at', 'is', null)
    : supabase.from('event_request_responses' as any).select('event_requests!inner(client_user_id)').not('hired_at', 'is', null).eq('professional_user_id', userId);

  const [{ data: flash }, { data: requests }, { data: reviewed }] = await Promise.all([
    flashQuery,
    requestQuery,
    supabase.from('reviews').select('reviewed_user_id').eq('reviewer_id', userId),
  ]);

  const reviewedIds = new Set((reviewed ?? []).map(r => r.reviewed_user_id));
  const targets = new Set<string>();
  // id === userId: autorregistro (el profesional apuntó él mismo un bolo
  // con alguien sin cuenta, created_by = professional_user_id). No hay a
  // quién valorar y la BD rechaza la auto-reseña (reviews_no_self_review):
  // contarlo dejaba el banner fijo y el envío fallando (DJ Poly, 6 oct 2026).
  for (const b of (flash ?? []) as any[]) {
    const id = isEmpresario ? b.professional_user_id : b.created_by;
    if (id && id !== userId && !reviewedIds.has(id)) targets.add(id);
  }
  for (const r of (requests ?? []) as any[]) {
    if (isEmpresario && r.event_requests?.client_user_id !== userId) continue;
    const id = isEmpresario ? r.professional_user_id : r.event_requests?.client_user_id;
    if (id && id !== userId && !reviewedIds.has(id)) targets.add(id);
  }
  return [...targets];
}

// Cuántas contrataciones cerradas (Flash Booking o Event Request) tiene este
// usuario sin haber dejado todavía su reseña a la otra parte. El botón
// "Valorar" vive enterrado en Flash Booking → Solicitudes (profesional) o
// Empresario → Historial (organizador), y hasta ahora solo avisaba la
// campana — fácil de pasar por alto (reportado por el usuario el 3 oct
// 2026 tras no encontrar dónde valorar un bolo). Mismo criterio de "trato
// cerrado" que SolicitudesTab/HistorialTab, solo que aquí basta un count.
export function usePendingReviewsCount(): { count: number; loading: boolean } {
  const { user } = useAuth();
  const { role } = useProfile();
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) { setCount(0); setLoading(false); return; }
    const targets = await fetchPendingReviewTargets(user.id, role);
    setCount(targets.length);
    setLoading(false);
  }, [user?.id, role]);

  useEffect(() => { load(); }, [load]);

  return { count, loading };
}
