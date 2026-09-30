import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * ¿Hay algún post nuevo en tu feed desde la última vez que lo revisaste?
 *
 * Mismo patrón que useAdminActivityAlert: corte temporal por usuario (tabla
 * feed_seen) en vez de un contador de "posts totales sin ver" — verde si hay
 * algo nuevo, nada si no.
 */
const VISTO_EVENT = 'xpeak:feed-visto';

export function useFeedAlert(userId: string | undefined): { hayNuevo: boolean; marcarVisto: () => Promise<void> } {
  const [hayNuevo, setHayNuevo] = useState(false);
  // Mismo motivo que useAdminActivityAlert: este hook se monta a la vez en el
  // sidebar y en la pestaña Feed, y supabase.channel(topic) reutiliza el canal
  // si el nombre coincide — un id por instancia evita el error de añadir
  // callbacks a un canal ya suscrito.
  const instanceId = useRef(Math.random().toString(36).slice(2)).current;

  const comprobar = useCallback(async () => {
    const { data, error } = await (supabase.rpc as any)('feed_nuevos');
    if (!error) setHayNuevo((data ?? 0) > 0);
  }, []);

  const marcarVisto = useCallback(async () => {
    await (supabase.rpc as any)('feed_marcar_visto');
    setHayNuevo(false);
    window.dispatchEvent(new Event(VISTO_EVENT));
  }, []);

  useEffect(() => {
    const onVisto = () => setHayNuevo(false);
    window.addEventListener(VISTO_EVENT, onVisto);
    return () => window.removeEventListener(VISTO_EVENT, onVisto);
  }, []);

  useEffect(() => {
    if (!userId) { setHayNuevo(false); return; }

    let cancelled = false;
    const load = async () => { if (!cancelled) await comprobar(); };

    load();
    const timer = setInterval(load, 120_000);
    const channel = supabase
      .channel(`feed-alert-${instanceId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'profile_posts' }, load)
      .subscribe();

    return () => {
      cancelled = true;
      clearInterval(timer);
      supabase.removeChannel(channel);
    };
  }, [userId, comprobar, instanceId]);

  return { hayNuevo, marcarVisto };
}
