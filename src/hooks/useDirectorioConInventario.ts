import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PHOTO_GATE_OR } from '@/lib/constants';

/**
 * Categorías recién abiertas cuyas landings ya muestran perfiles de otro rol
 * como respaldo: mientras su directorio propio esté vacío, "ver directorio"
 * lleva al del respaldo en vez de a una página sin nadie. clave = slug del
 * directorio propio (y rol de BD), valor = slug del directorio de respaldo.
 */
const RESPALDO: Record<string, string> = {
  'disco-movil': 'dj',
};

/**
 * Slug de directorio al que enlazar. Empieza en el propio (es lo que queda en
 * el HTML prerenderizado) y solo cambia al respaldo si la consulta confirma
 * que no hay ningún perfil publicado con ese rol.
 */
export function useDirectorioConInventario(slug: string): string {
  const respaldo = RESPALDO[slug];
  const [destino, setDestino] = useState(slug);

  useEffect(() => {
    if (!respaldo) return;
    let vivo = true;
    supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .or(`role.eq.${slug},roles.cs.{${slug}}`)
      .neq('role', 'empresario')
      .or(PHOTO_GATE_OR)
      .then(({ count, error }) => {
        if (vivo && !error && count === 0) setDestino(respaldo);
      });
    return () => { vivo = false; };
  }, [slug, respaldo]);

  return destino;
}
