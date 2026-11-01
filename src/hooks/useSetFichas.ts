import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { type SetFicha, tracklistDesdeBD } from '@/lib/setFicha';

/** Fichas de los sets de un usuario, indexadas por URL de la sesión. */
export const useSetFichas = (userId: string | undefined) => {
  const [fichas, setFichas] = useState<Record<string, SetFicha>>({});
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!userId) { setFichas({}); return; }
    let cancelado = false;
    supabase.from('dj_set_fichas')
      .select('set_url, titulo, portada_url, fondo_url, etiquetas, bpm, mood, tracklist')
      .eq('user_id', userId)
      .then(({ data, error }) => {
        // Si la consulta falla (red, tabla aún sin crear) los sets se ven
        // como siempre, sin ficha: nunca debe romper el perfil.
        if (cancelado || error || !data) return;
        const porUrl: Record<string, SetFicha> = {};
        for (const f of data) {
          porUrl[f.set_url] = { ...f, etiquetas: f.etiquetas ?? [], tracklist: tracklistDesdeBD(f.tracklist) };
        }
        setFichas(porUrl);
      });
    return () => { cancelado = true; };
  }, [userId, version]);

  const recargar = useCallback(() => setVersion(v => v + 1), []);
  return { fichas, recargar };
};
