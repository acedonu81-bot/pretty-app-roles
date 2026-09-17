import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ScarcitySignal {
  weeklyProfileViews: number;
  weeklyContactRequests: number;
  lastViewedAt: string | null;
  loading: boolean;
}

export const useScarcitySignal = (userId: string | undefined): ScarcitySignal => {
  const [weeklyProfileViews, setWeeklyProfileViews] = useState(0);
  const [weeklyContactRequests, setWeeklyContactRequests] = useState(0);
  const [lastViewedAt, setLastViewedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    let cancelled = false;
    setLoading(true);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    // weeklyContactRequests usa un RPC security definer (no una query
    // directa a flash_bookings): esta tabla se muestra tanto en el propio
    // dashboard del profesional (RLS sí deja leer las filas propias) como
    // en la ficha pública que ve el organizador (RLS bloquea leer filas
    // ajenas) — sin el RPC, el conteo siempre da 0 para el organizador.
    Promise.all([
      supabase.from('profile_business_views')
        .select('id', { count: 'exact', head: true })
        .eq('viewed_user_id', userId)
        .gte('created_at', sevenDaysAgo),
      supabase.rpc('flash_bookings_last_7_days', { p_professional_user_id: userId }),
      // "Última vez visto" en vez de un contador "en directo": con el
      // volumen real de hoy, un contador de visitantes simultáneos daría
      // 0 casi siempre — contraproducente. Esto es honesto con poco
      // tráfico y sigue dando sensación de actividad reciente.
      supabase.from('profile_business_views')
        .select('created_at')
        .eq('viewed_user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]).then(([viewsRes, bookingsRes, lastViewRes]) => {
      if (cancelled) return;
      setWeeklyProfileViews(viewsRes.count ?? 0);
      setWeeklyContactRequests((bookingsRes.data as number | null) ?? 0);
      setLastViewedAt((lastViewRes.data as { created_at: string } | null)?.created_at ?? null);
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, [userId]);

  return { weeklyProfileViews, weeklyContactRequests, lastViewedAt, loading };
};
