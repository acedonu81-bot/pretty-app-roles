import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface MarketRateInsight {
  percentDiff: number | null;
  loading: boolean;
}

// El cálculo entero vive en la RPC market_rate_percent_diff (SECURITY
// DEFINER): compara contra otros profesionales de la misma categoría/zona
// excluyendo cuentas internas/demo por email, y ese filtro necesita leer
// profiles.email de terceros — columna bloqueada para 'authenticated' desde
// SEC-06 (2 oct 2026). Antes este hook hacía esa comparación con dos queries
// directas del cliente; ahora el email nunca sale del servidor.
export const useMarketRateInsight = (userId: string | undefined): MarketRateInsight => {
  const [percentDiff, setPercentDiff] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    setLoading(true);

    (supabase.rpc as any)('market_rate_percent_diff', { p_user_id: userId })
      .then(({ data }: { data: number | null }) => {
        setPercentDiff(typeof data === 'number' ? data : null);
        setLoading(false);
      });
  }, [userId]);

  return { percentDiff, loading };
};
