import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SEGUNDOS_ESCUCHA, idVisitante, navegadorNoCuenta, sumarEscuchado } from '@/lib/escuchas';

/**
 * Cuenta el tiempo realmente escuchado de un set y, al llegar a 5 minutos,
 * registra la escucha una sola vez por visita a la página.
 */
export const useContadorEscucha = (djUserId: string | undefined, setUrl: string, sonando: boolean, posicion: number, onRegistrada?: () => void) => {
  const acumulado = useRef(0);
  const anterior = useRef<number | null>(null);
  const enviada = useRef(false);

  useEffect(() => {
    if (!sonando) { anterior.current = null; return; }
    acumulado.current = sumarEscuchado(acumulado.current, anterior.current, posicion);
    anterior.current = posicion;
    if (enviada.current || !djUserId || acumulado.current < SEGUNDOS_ESCUCHA) return;
    enviada.current = true;
    if (navegadorNoCuenta()) return;
    supabase.rpc('registrar_escucha', { p_dj: djUserId, p_set_url: setUrl, p_visitante: idVisitante() })
      .then(({ data }) => { if (data) onRegistrada?.(); }, () => {});
  }, [sonando, posicion, djUserId, setUrl, onRegistrada]);
};
