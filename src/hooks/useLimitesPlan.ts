import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { limitesDesdeBD, type Limites } from '@/lib/limitesPlan';

// Límites reales de un perfil (plan, fundador y lanzamiento), desde limites_plan.
// null mientras carga o si falla: cada pantalla decide su valor por defecto.
export function useLimitesPlan(profileId: string | null | undefined, recarga: unknown = null): Limites | null {
  const [lim, setLim] = useState<Limites | null>(null);
  useEffect(() => {
    if (!profileId) return;
    let vivo = true;
    (async () => {
      try {
        const { data } = await (supabase.rpc as any)('limites_plan', { p_profile: profileId });
        if (vivo) setLim(limitesDesdeBD(Array.isArray(data) ? data[0] : null));
      } catch { /* sin límites: la pantalla usa su valor por defecto */ }
    })();
    return () => { vivo = false; };
  }, [profileId, recarga]);
  return lim;
}
