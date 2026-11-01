import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toSlug } from '@/data/profiles';

export interface ComentarioSet {
  id: string;
  autor_id: string;
  segundo: number;
  texto: string;
  created_at: string;
  autor: {
    nombre: string;
    /** Perfil público del autor si es profesional; null para empresarios. */
    enlace: string | null;
    foto: string | null;
  };
}

const ANONIMO = { nombre: 'Organizador de eventos', enlace: null, foto: null };

// Comentarios en el segundo exacto de un set (perfil de DJ, fase 2, 1 nov
// 2026). Los empresarios pueden comentar pero no ganan exposición pública
// (decisión del 30 sep): salen como "Organizador de eventos", sin nombre ni
// enlace. Si su perfil no se puede leer por RLS, pasa lo mismo.
export const useSetComentarios = (djUserId: string | undefined, setUrl: string) => {
  const [comentarios, setComentarios] = useState<ComentarioSet[]>([]);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!djUserId) { setComentarios([]); return; }
    let cancelado = false;
    (async () => {
      const { data, error } = await supabase.from('set_comentarios')
        .select('id, autor_id, segundo, texto, created_at')
        .eq('dj_user_id', djUserId).eq('set_url', setUrl)
        .order('segundo', { ascending: true }).limit(200);
      if (cancelado || error || !data) return;
      const ids = [...new Set(data.map(c => c.autor_id))];
      const autores = new Map<string, ComentarioSet['autor']>();
      if (ids.length) {
        const { data: perfiles } = await supabase.from('profiles')
          .select('user_id, display_name, role, photo_url').in('user_id', ids);
        for (const p of perfiles ?? []) {
          if (p.role === 'empresario' || !p.display_name || autores.has(p.user_id)) continue;
          autores.set(p.user_id, { nombre: p.display_name, enlace: `/p/${toSlug(p.display_name)}`, foto: p.photo_url });
        }
      }
      if (cancelado) return;
      setComentarios(data.map(c => ({ ...c, autor: autores.get(c.autor_id) ?? ANONIMO })));
    })();
    return () => { cancelado = true; };
  }, [djUserId, setUrl, version]);

  const recargar = useCallback(() => setVersion(v => v + 1), []);

  const comentar = useCallback(async (autorId: string, segundo: number, texto: string): Promise<string | null> => {
    if (!djUserId) return 'No se pudo comentar.';
    const { error } = await supabase.from('set_comentarios').insert({
      set_url: setUrl, dj_user_id: djUserId, autor_id: autorId, segundo: Math.max(0, Math.floor(segundo)), texto: texto.trim(),
    });
    if (error) {
      // Los mensajes del freno (ráfagas, máximo diario) ya vienen en español.
      if (error.code === 'P0001') return error.message;
      if (error.code === '42501') return 'No puedes comentar en este set.';
      return 'No se pudo publicar el comentario. Inténtalo de nuevo.';
    }
    recargar();
    return null;
  }, [djUserId, setUrl, recargar]);

  const borrar = useCallback(async (id: string) => {
    const { error } = await supabase.from('set_comentarios').delete().eq('id', id);
    if (!error) setComentarios(cs => cs.filter(c => c.id !== id));
    return !error;
  }, []);

  /** Solo el DJ: silencia al autor en todos sus sets y borra lo que le haya comentado. */
  const silenciar = useCallback(async (autorId: string) => {
    if (!djUserId) return false;
    const { error } = await supabase.from('set_silenciados').insert({ dj_user_id: djUserId, autor_id: autorId });
    if (error && error.code !== '23505') return false;
    await supabase.from('set_comentarios').delete().eq('dj_user_id', djUserId).eq('autor_id', autorId);
    recargar();
    return true;
  }, [djUserId, recargar]);

  return { comentarios, comentar, borrar, silenciar };
};
