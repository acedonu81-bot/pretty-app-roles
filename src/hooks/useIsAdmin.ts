import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

/**
 * Único punto de verdad para "¿es admin?" — antes DashboardSidebar y
 * AdminGuard hacían cada uno su propia consulta a user_roles por separado,
 * sin compartir estado ni esperar a que useAuth hidrate la sesión primero.
 * Devuelve 'loading' | true | false explícitamente (nunca se queda colgado:
 * si la consulta falla se resuelve a false en vez de quedar pendiente).
 */
export function useIsAdmin(): { isAdmin: boolean; loading: boolean } {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return; // espera a que useAuth resuelva la sesión primero
    if (!user) { setIsAdmin(false); setLoading(false); return; }

    let cancelled = false;
    supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) console.warn('[useIsAdmin] query error:', error.message);
        setIsAdmin(!!data);
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [user, authLoading]);

  return { isAdmin, loading };
}
