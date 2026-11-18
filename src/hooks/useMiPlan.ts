import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { PlanEfectivo } from '@/lib/estadisticasPlan';

// Plan efectivo de mi perfil según la BD (plan de pago, fundador o lanzamiento):
// pre | free | starter | business. undefined mientras carga; null si la consulta falla.
export function useMiPlan(profileId: string | null | undefined): PlanEfectivo | null | undefined {
  const [plan, setPlan] = useState<PlanEfectivo | null | undefined>(undefined);
  useEffect(() => {
    if (!profileId) return;
    let vivo = true;
    (async () => {
      try {
        const { data } = await (supabase.rpc as any)('mi_plan_efectivo', { p_profile: profileId });
        if (vivo) setPlan(typeof data === 'string' ? (data as PlanEfectivo) : null);
      } catch { if (vivo) setPlan(null); }
    })();
    return () => { vivo = false; };
  }, [profileId]);
  return plan;
}
