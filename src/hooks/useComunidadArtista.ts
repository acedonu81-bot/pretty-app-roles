import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Reposts, seguidores y cifras de la columna lateral del perfil de DJ (2 nov
// 2026). Todo pasa por funciones de la BD que no devuelven nombres de
// empresarios. Si algo falla (red, funciones aún sin crear), el perfil se ve
// igual, sin estas piezas.

export interface ResumenArtista {
  seguidores: number; siguiendo: number; escuchas_hoy: number; escuchas_ayer: number; escuchas_total: number;
}

export const useResumenArtista = (userId: string | undefined, version = 0) => {
  const [resumen, setResumen] = useState<ResumenArtista | null>(null);
  useEffect(() => {
    if (!userId) { setResumen(null); return; }
    let cancelado = false;
    supabase.rpc('resumen_artista', { p_user: userId })
      .then(({ data, error }) => { if (!cancelado && !error && data?.[0]) setResumen(data[0]); });
    return () => { cancelado = true; };
  }, [userId, version]);
  return resumen;
};

/** Reposts de cada set del DJ, y alternar el mío. */
export const useRepostsSets = (djUserId: string | undefined, viewerId: string | undefined) => {
  const [porUrl, setPorUrl] = useState<Record<string, { reposts: number; yo: boolean }>>({});
  const [version, setVersion] = useState(0);
  useEffect(() => {
    if (!djUserId) { setPorUrl({}); return; }
    let cancelado = false;
    supabase.rpc('reposts_sets_dj', { p_dj: djUserId })
      .then(({ data, error }) => {
        if (cancelado || error || !data) return;
        setPorUrl(Object.fromEntries(data.map(r => [r.set_url, { reposts: r.reposts, yo: r.yo }])));
      });
    return () => { cancelado = true; };
  }, [djUserId, viewerId, version]);

  const alternar = useCallback(async (setUrl: string) => {
    if (!djUserId || !viewerId) return;
    const actual = porUrl[setUrl];
    if (actual?.yo) {
      const { error } = await supabase.from('set_reposts').delete().eq('set_url', setUrl).eq('user_id', viewerId);
      if (error) { toast.error('No se pudo quitar el repost.'); return; }
    } else {
      const { error } = await supabase.from('set_reposts').insert({ set_url: setUrl, dj_user_id: djUserId, user_id: viewerId });
      if (error && error.code !== '23505') { toast.error('No se pudo repostear este set.'); return; }
      toast.success('Recomendado. Lo verán quienes te siguen.');
    }
    setVersion(v => v + 1);
  }, [djUserId, viewerId, porUrl]);

  return { porUrl, alternar };
};

export interface Seguidor { user_id: string; nombre: string; foto: string | null; rol: string }

/** null = todavía no se sabe (cargando o la función falló): no clasificar a nadie. */
export const useSeguidores = (userId: string | undefined) => {
  const [seguidores, setSeguidores] = useState<Seguidor[] | null>(null);
  useEffect(() => {
    setSeguidores(null);
    if (!userId) return;
    let cancelado = false;
    supabase.rpc('seguidores_de', { p_user: userId })
      .then(({ data, error }) => { if (!cancelado && !error && data) setSeguidores(data); });
    return () => { cancelado = true; };
  }, [userId]);
  return seguidores;
};

export interface RepostHecho { set_url: string; dj_user_id: string; dj_nombre: string | null; dj_foto: string | null; created_at: string }

/** Sets que ha recomendado un profesional (pestaña Reposts de su perfil). */
export const useRepostsDe = (userId: string | undefined, version = 0) => {
  const [reposts, setReposts] = useState<RepostHecho[]>([]);
  useEffect(() => {
    if (!userId) { setReposts([]); return; }
    let cancelado = false;
    supabase.rpc('reposts_de', { p_user: userId })
      .then(({ data, error }) => { if (!cancelado && !error && data) setReposts(data); });
    return () => { cancelado = true; };
  }, [userId, version]);
  return reposts;
};
