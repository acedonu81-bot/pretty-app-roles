import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';

const TRATO_CERRADO = ['confirmed', 'accepted', 'completed', 'closed'];

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
    const isEmpresario = role === 'empresario';

    // Lado profesional: organizadores que le contrataron (created_by) que
    // aún no valoró. Lado organizador: profesionales que contrató
    // (professional_user_id) que aún no valoró.
    const flashQuery = isEmpresario
      ? supabase.from('flash_bookings').select('professional_user_id').eq('created_by', user.id).in('status', TRATO_CERRADO).not('professional_user_id', 'is', null)
      : supabase.from('flash_bookings').select('created_by').eq('professional_user_id', user.id).in('status', TRATO_CERRADO);

    // El filtro por la columna de la tabla joined (event_requests.client_user_id)
    // no se aplica aquí vía .eq() anidado — mismo motivo que HistorialTab.tsx/
    // SolicitudesTab.tsx: se trae sin filtrar por ese lado y se cruza en JS.
    const requestQuery = isEmpresario
      ? supabase.from('event_request_responses' as any).select('professional_user_id, event_requests!inner(client_user_id)').not('hired_at', 'is', null)
      : supabase.from('event_request_responses' as any).select('event_requests!inner(client_user_id)').not('hired_at', 'is', null).eq('professional_user_id', user.id);

    const [{ data: flash }, { data: requests }, { data: reviewed }] = await Promise.all([
      flashQuery,
      requestQuery,
      supabase.from('reviews').select('reviewed_user_id').eq('reviewer_id', user.id),
    ]);

    const reviewedIds = new Set((reviewed ?? []).map(r => r.reviewed_user_id));
    const targets = new Set<string>();
    for (const b of (flash ?? []) as any[]) {
      const id = isEmpresario ? b.professional_user_id : b.created_by;
      if (id && !reviewedIds.has(id)) targets.add(id);
    }
    for (const r of (requests ?? []) as any[]) {
      if (isEmpresario && r.event_requests?.client_user_id !== user.id) continue;
      const id = isEmpresario ? r.professional_user_id : r.event_requests?.client_user_id;
      if (id && !reviewedIds.has(id)) targets.add(id);
    }

    setCount(targets.size);
    setLoading(false);
  }, [user?.id, role]);

  useEffect(() => { load(); }, [load]);

  return { count, loading };
}
