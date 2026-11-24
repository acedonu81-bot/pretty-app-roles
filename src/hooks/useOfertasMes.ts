import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ofertasMesDesdeBD, type OfertasMes } from '@/lib/ofertasMes';

// Ofertas Flash que lleva usadas este mes el profesional y su tope (null = sin tope).
// null mientras carga o si falla: sin datos no se avisa ni se bloquea nada en pantalla
// (el tope real lo pone la BD).
export function useOfertasMes(userId: string | null | undefined, recarga: unknown = null): OfertasMes | null {
  const [datos, setDatos] = useState<OfertasMes | null>(null);
  useEffect(() => {
    if (!userId) return;
    let vivo = true;
    (async () => {
      try {
        const { data } = await (supabase.rpc as any)('mis_ofertas_mes');
        if (vivo) setDatos(ofertasMesDesdeBD(Array.isArray(data) ? data[0] : null));
      } catch { /* sin datos: no se avisa */ }
    })();
    return () => { vivo = false; };
  }, [userId, recarga]);
  return datos;
}
