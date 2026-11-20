import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { directoCaducaDesde, directoVigente } from '@/lib/directo';

export interface DirectoActivo {
  id: string;
  user_id: string;
  display_name: string | null;
  role: string | null;
  zone: string | null;
  photo_url: string | null;
  stream_title: string | null;
  stream_url: string;
  live_started_at: string;
}

const COLS = 'id, user_id, display_name, role, zone, photo_url, stream_title, stream_url, is_live, live_started_at';

/**
 * Profesionales en directo ahora mismo (datos reales, sin ejemplos).
 * Con userId devuelve solo los de esa cuenta. Si la consulta falla, devuelve
 * lista vacía: un directo que no se puede comprobar no se anuncia.
 */
export function useDirectoAhora(userId?: string | null, refrescoMs = 60_000) {
  const [directos, setDirectos] = useState<DirectoActivo[]>([]);
  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    let vivo = true;
    const cargar = async () => {
      // live_started_at es nueva y no está en los tipos generados.
      let q = (supabase.from('profiles') as any)
        .select(COLS)
        .eq('is_live', true)
        .not('stream_url', 'is', null)
        .gt('live_started_at', directoCaducaDesde())
        .order('live_started_at', { ascending: false })
        .limit(12);
      if (userId) q = q.eq('user_id', userId);
      const { data, error } = await q;
      if (!vivo) return;
      setDirectos(error ? [] : ((data ?? []) as DirectoActivo[]).filter(d => directoVigente({ ...d, is_live: true })));
      setCargado(true);
    };
    void cargar();
    const t = window.setInterval(() => { if (!document.hidden) void cargar(); }, refrescoMs);
    return () => { vivo = false; window.clearInterval(t); };
  }, [userId, refrescoMs]);

  return { directos, cargado };
}
