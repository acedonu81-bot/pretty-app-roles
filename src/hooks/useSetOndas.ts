import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface OndaSet { duracion: number; picos: number[] }

/** Formas de onda ya calculadas de los archivos de un usuario, por URL. */
export const useSetOndas = (userId: string | undefined) => {
  const [ondas, setOndas] = useState<Record<string, OndaSet>>({});

  useEffect(() => {
    if (!userId) { setOndas({}); return; }
    let cancelado = false;
    supabase.from('set_ondas').select('set_url, duracion, picos').eq('user_id', userId)
      .then(({ data, error }) => {
        if (cancelado || error || !data) return;
        setOndas(Object.fromEntries(data.map(o => [o.set_url, { duracion: o.duracion, picos: o.picos }])));
      });
    return () => { cancelado = true; };
  }, [userId]);

  return ondas;
};
