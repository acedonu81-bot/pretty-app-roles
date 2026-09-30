import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Post } from '@/components/PostCard';

export interface FeedPost extends Post {
  authorUserId: string;
  authorName: string;
  authorPhoto: string | null;
  authorRole: string;
}

interface FeedState {
  posts: FeedPost[];
  loading: boolean;
}

// Feed personalizado del dashboard: posts de profile_posts publicados por
// profesionales a los que el usuario sigue (tabla follows). No hay feed para
// visitantes anónimos ni para nadie sin follows todavía.
export const useFeedPosts = (viewerId: string | undefined): FeedState => {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!viewerId) { setLoading(false); return; }
    let cancelled = false;
    setLoading(true);

    supabase.from('follows').select('followed_user_id').eq('follower_id', viewerId)
      .then(async ({ data: follows }) => {
        if (cancelled) return;
        const followedIds = (follows ?? []).map((f: { followed_user_id: string }) => f.followed_user_id);
        if (followedIds.length === 0) { setPosts([]); setLoading(false); return; }

        const [{ data: rawPosts }, { data: profiles }] = await Promise.all([
          supabase.from('profile_posts' as any).select('id, user_id, content, post_type, media_url, created_at')
            .in('user_id', followedIds).order('created_at', { ascending: false }),
          supabase.from('profiles').select('user_id, display_name, photo_url, role').in('user_id', followedIds),
        ]);
        if (cancelled) return;

        const profileByUserId = new Map((profiles ?? []).map((p: any) => [p.user_id, p]));
        const feedPosts: FeedPost[] = ((rawPosts ?? []) as any[]).map(post => {
          const author = profileByUserId.get(post.user_id);
          return {
            id: post.id,
            content: post.content,
            post_type: post.post_type,
            media_url: post.media_url,
            created_at: post.created_at,
            authorUserId: post.user_id,
            authorName: author?.display_name ?? 'Profesional',
            authorPhoto: author?.photo_url ?? null,
            authorRole: author?.role ?? '',
          };
        });
        setPosts(feedPosts);
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [viewerId]);

  return { posts, loading };
};
