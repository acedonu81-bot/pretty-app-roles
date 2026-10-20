import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/**
 * ¿Esta cuenta puede pedir profesionales? Solo con un perfil de organizador
 * (rol 'empresario'); los admin también, para poder probar. Mismo criterio que
 * el trigger flash_bookings_exige_datos de la base de datos (20 oct 2026).
 */
export function useEsOrganizador(userId?: string) {
  return useQuery({
    queryKey: ['es-organizador', userId],
    enabled: !!userId,
    staleTime: 60_000,
    queryFn: async () => {
      const [org, admin] = await Promise.all([
        supabase.from('profiles').select('role').eq('user_id', userId!).eq('role', 'empresario').limit(1),
        supabase.from('user_roles').select('role').eq('user_id', userId!).eq('role', 'admin').limit(1),
      ]);
      return (org.data?.length ?? 0) > 0 || (admin.data?.length ?? 0) > 0;
    },
  });
}
