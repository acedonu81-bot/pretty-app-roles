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
// profesionales a los que el usuario sigue (tabla follows), con las fotos de
// su portfolio como respaldo. Solo 8 de 84 profesionales habían publicado
// algún post alguna vez (30 sep 2026) — sin este respaldo el feed salía
// vacío para casi cualquiera que empezara a seguir gente. El portfolio no
// tiene fecha por foto individual, así que se usa profiles.updated_at como
// aproximación (igual que "Actividad reciente" en DirectorioPublico.tsx).
// Un profesional con posts reales no mezcla también su portfolio — evita
// duplicar/saturar el feed de quien sí publica activamente.
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
          supabase.from('profiles').select('user_id, display_name, photo_url, role, portfolio_urls, updated_at').in('user_id', followedIds),
        ]);
        if (cancelled) return;

        const profileByUserId = new Map((profiles ?? []).map((p: any) => [p.user_id, p]));
        const usersWithPosts = new Set(((rawPosts ?? []) as any[]).map(post => post.user_id));

        const realPosts: FeedPost[] = ((rawPosts ?? []) as any[]).map(post => {
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

        const portfolioPosts: FeedPost[] = (profiles ?? [])
          .filter((author: any) => !usersWithPosts.has(author.user_id) && author.portfolio_urls?.length)
          .flatMap((author: any) =>
            author.portfolio_urls.map((url: string, i: number) => ({
              id: `portfolio-${author.user_id}-${i}`,
              content: '',
              post_type: 'image',
              media_url: url,
              created_at: author.updated_at,
              authorUserId: author.user_id,
              authorName: author.display_name ?? 'Profesional',
              authorPhoto: author.photo_url ?? null,
              authorRole: author.role ?? '',
            }))
          );

        const feedPosts = [...realPosts, ...portfolioPosts]
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setPosts(feedPosts);
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [viewerId]);

  return { posts, loading };
};
