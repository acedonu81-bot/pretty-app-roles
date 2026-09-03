import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * ¿Ha pasado algo NUEVO desde la última vez que el admin revisó la actividad?
 *
 * No cuenta pendientes totales a propósito. Un contador fijo ("31 pendientes")
 * no es una alerta: mezcla lo ya visto con lo que acaba de entrar y obliga a
 * revisar dos veces lo mismo. Lo útil es un corte temporal — todo lo anterior
 * al último repaso ya se conoce — y una señal binaria: verde si hay algo nuevo,
 * nada si no. El número se ve dentro de la propia pestaña Actividad.
 *
 * Nace del caso del 22 ago 2026: un cliente real pidió un camarero, lo mandó a
 * 5 profesionales, nadie respondió y nadie lo supo en 12 días. El aviso tiene
 * que encenderse por cualquier cosa nueva (solicitud, alta, baja, reseña), no
 * solo por un tipo, o el resto vuelve a pasar desapercibido.
 */
export function useAdminActivityAlert(isAdmin: boolean): { hayNuevo: boolean; marcarVisto: () => Promise<void> } {
  const [hayNuevo, setHayNuevo] = useState(false);

  const comprobar = useCallback(async () => {
    const { data, error } = await (supabase.rpc as any)('admin_activity_nuevos');
    // Si la migración aún no está aplicada, el panel debe seguir usable: sin
    // función, no hay aviso, no una pantalla rota.
    if (!error) setHayNuevo((data ?? 0) > 0);
  }, []);

  const marcarVisto = useCallback(async () => {
    await (supabase.rpc as any)('admin_activity_marcar_visto');
    setHayNuevo(false);
  }, []);

  useEffect(() => {
    if (!isAdmin) { setHayNuevo(false); return; }

    let cancelled = false;
    const load = async () => { if (!cancelled) await comprobar(); };

    load();
    const timer = setInterval(load, 120_000);
    const channel = supabase
      .channel('admin-activity-alert')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'flash_bookings' }, load)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'profiles' }, load)
      .subscribe();

    return () => {
      cancelled = true;
      clearInterval(timer);
      supabase.removeChannel(channel);
    };
  }, [isAdmin, comprobar]);

  return { hayNuevo, marcarVisto };
}
