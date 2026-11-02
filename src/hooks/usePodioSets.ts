import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PuestoPodio {
  puesto: 1 | 2 | 3;
  set_url: string;
  dj_user_id: string;
  nombre: string | null;
  foto: string | null;
  escuchas: number;
  /** De la ficha del set, si el DJ la rellenó. */
  titulo: string | null;
  portada: string | null;
}

/** Los 3 sets más escuchados de los últimos 30 días (podio_sets). */
export const usePodioSets = () => {
  const [podio, setPodio] = useState<PuestoPodio[]>([]);

  useEffect(() => {
    let cancelado = false;
    (async () => {
      const { data, error } = await supabase.rpc('podio_sets');
      if (cancelado || error || !data?.length) return;
      const { data: fichas } = await supabase.from('dj_set_fichas')
        .select('set_url, titulo, portada_url').in('set_url', data.map(p => p.set_url));
      if (cancelado) return;
      const porUrl = new Map((fichas ?? []).map(f => [f.set_url, f]));
      setPodio(data.map(p => ({
        ...p,
        puesto: p.puesto as 1 | 2 | 3,
        titulo: porUrl.get(p.set_url)?.titulo ?? null,
        portada: porUrl.get(p.set_url)?.portada_url ?? null,
      })));
    })();
    return () => { cancelado = true; };
  }, []);

  return podio;
};
