import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface FeedLikeState {
  count: number;
  liked: boolean;
  loading: boolean;
  toggleLike: () => Promise<void>;
}

// Like sobre un content_key de texto (el id que ya genera useFeedPosts.ts:
// 'post-<uuid>' para posts reales, 'audio-<user>-<i>' / 'portfolio-<user>-<i>'
// para contenido sintético) en vez de una FK — las fotos/audios no son filas
// reales en BD.
export const useFeedLike = (viewerId: string | undefined, contentKey: string): FeedLikeState => {
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!viewerId) { setLoading(false); return; }
    let cancelled = false;
    setLoading(true);

    Promise.all([
      supabase.from('feed_likes').select('user_id', { count: 'exact', head: true }).eq('content_key', contentKey),
      supabase.from('feed_likes').select('user_id').eq('content_key', contentKey).eq('user_id', viewerId).maybeSingle(),
    ]).then(([countRes, likedRes]) => {
      if (cancelled) return;
      setCount(countRes.count ?? 0);
      setLiked(!!likedRes.data);
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, [viewerId, contentKey]);

  const toggleLike = async () => {
    if (!viewerId) return;
    if (liked) {
      await supabase.from('feed_likes').delete().eq('user_id', viewerId).eq('content_key', contentKey);
      setLiked(false);
      setCount(c => Math.max(0, c - 1));
    } else {
      await supabase.from('feed_likes').insert({ user_id: viewerId, content_key: contentKey });
      setLiked(true);
      setCount(c => c + 1);
    }
  };

  return { count, liked, loading, toggleLike };
};
