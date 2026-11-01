import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

/** Banner de la cabecera de artista del DJ (tabla dj_banners), o null. */
export const useDjBanner = (userId: string | undefined) => {
  const [banner, setBanner] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    setBanner(null);
    if (!userId) return;
    let cancelado = false;
    supabase.from('dj_banners').select('banner_url').eq('user_id', userId).maybeSingle()
      // Si falla (red, tabla aún sin crear) la cabecera usa portada o foto.
      .then(({ data, error }) => { if (!cancelado && !error) setBanner(data?.banner_url ?? null); });
    return () => { cancelado = true; };
  }, [userId, version]);

  const recargar = useCallback(() => setVersion(v => v + 1), []);
  return { banner, recargar };
};
