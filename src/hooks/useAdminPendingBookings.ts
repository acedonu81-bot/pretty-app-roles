import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Cuántas solicitudes de reserva llevan sin responder.
 *
 * Nace del caso del 22 ago 2026: un cliente real pidió un camarero para un
 * cumpleaños y mandó la petición a 5 profesionales. Ninguno respondió y nadie
 * lo supo hasta 12 días después, con el evento encima. El email de aviso al
 * admin sí se envió, pero se perdió entre otros correos — el panel es donde se
 * entra a mirar, así que el escudo del sidebar se pone verde y late mientras
 * haya alguna esperando.
 *
 * Se recarga sola cada 2 minutos y escucha inserts en tiempo real, para que el
 * aviso aparezca sin tener que recargar la página.
 */
export function useAdminPendingBookings(isAdmin: boolean): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isAdmin) { setCount(0); return; }

    let cancelled = false;
    const load = async () => {
      const { count: n, error } = await supabase
        .from('admin_pending_bookings' as any)
        .select('*', { count: 'exact', head: true });
      // Si la vista aún no existe (migración sin aplicar), el panel debe seguir
      // usable: el error se traduce en "no hay avisos", no en una pantalla rota.
      if (!cancelled && !error) setCount(n ?? 0);
    };

    load();
    const timer = setInterval(load, 120_000);
    const channel = supabase
      .channel('admin-pending-bookings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'flash_bookings' }, load)
      .subscribe();

    return () => {
      cancelled = true;
      clearInterval(timer);
      supabase.removeChannel(channel);
    };
  }, [isAdmin]);

  return count;
}
