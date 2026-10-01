import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Post } from '@/components/PostCard';
import { fechaSubidaStorage } from '@/lib/storageTimestamp';

export interface FeedPost extends Post {
  authorUserId: string;
  authorName: string;
  authorPhoto: string | null;
  authorRole: string;
  // true cuando created_at viene de profiles.updated_at (fallback) en vez de
  // una fecha real de esa pieza de contenido — un link externo de SoundCloud/
  // HearThis pegado no lleva ningún timestamp propio. La UI no debe mostrar
  // "hace Xd" con esta fecha: es la de la última edición del perfil entero,
  // no la de cuándo se añadió ese contenido, y puede inducir a error (ver
  // caso real 1 oct 2026: Amhara Sound mostraba "hace 1d" por haber tocado
  // otro campo del perfil, no por subir nada nuevo).
  dateIsApproximate: boolean;
}

interface FeedState {
  posts: FeedPost[];
  loading: boolean;
}

// Feed personalizado del dashboard: mezcla todo lo que cada profesional
// seguido tenga — profile_posts, sesiones de audio y portfolio — en vez de
// mostrar solo la "mejor" fuente. Solo 8 de 84 profesionales habían
// publicado algún post alguna vez (30 sep 2026): sin sesiones/portfolio como
// respaldo, el feed salía vacío para casi cualquiera que empezara a seguir
// gente. Ni las sesiones ni las fotos de portfolio tienen fecha individual
// en BD, así que usan profiles.updated_at como aproximación (igual que
// "Actividad reciente" en DirectorioPublico.tsx) — sirve para ordenar el
// feed, no como fecha de publicación exacta de esa pieza de contenido.
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
          supabase.from('profiles').select('user_id, display_name, photo_url, role, portfolio_urls, audio_session_urls, audio_embed_url, updated_at').in('user_id', followedIds),
        ]);
        if (cancelled) return;

        const profileByUserId = new Map((profiles ?? []).map((p: any) => [p.user_id, p]));

        const realPosts: FeedPost[] = ((rawPosts ?? []) as any[]).map(post => {
          const author = profileByUserId.get(post.user_id);
          return {
            id: post.id,
            content: post.content,
            post_type: post.post_type,
            media_url: post.media_url,
            created_at: post.created_at,
            dateIsApproximate: false,
            authorUserId: post.user_id,
            authorName: author?.display_name ?? 'Profesional',
            authorPhoto: author?.photo_url ?? null,
            authorRole: author?.role ?? '',
          };
        });

        const audioPosts: FeedPost[] = (profiles ?? []).flatMap((author: any) => {
          // audio_session_urls es la lista de sesiones sueltas; si no tiene
          // ninguna, se usa el embed principal de la ficha como única pieza.
          const urls: string[] = author.audio_session_urls?.length
            ? author.audio_session_urls
            : author.audio_embed_url
              ? [author.audio_embed_url]
              : [];
          return urls.map((url, i) => {
            // fechaSubidaStorage lee el timestamp real del nombre del archivo
            // (solo audios subidos como .mp3, no links externos pegados de
            // SoundCloud/HearThis/Mixcloud). Sin eso, updated_at del perfil
            // entero es lo único disponible para ordenar el feed, pero NO es
            // una fecha real de esta pieza — se marca como aproximada.
            const fechaReal = fechaSubidaStorage(url);
            return {
              id: `audio-${author.user_id}-${i}`,
              content: '',
              post_type: 'audio',
              media_url: url,
              created_at: fechaReal ?? author.updated_at,
              dateIsApproximate: !fechaReal,
              authorUserId: author.user_id,
              authorName: author.display_name ?? 'Profesional',
              authorPhoto: author.photo_url ?? null,
              authorRole: author.role ?? '',
            };
          });
        });

        const portfolioPosts: FeedPost[] = (profiles ?? [])
          .filter((author: any) => author.portfolio_urls?.length)
          .flatMap((author: any) =>
            author.portfolio_urls.map((url: string, i: number) => {
              const fechaReal = fechaSubidaStorage(url);
              return {
                id: `portfolio-${author.user_id}-${i}`,
                content: '',
                post_type: 'image',
                media_url: url,
                created_at: fechaReal ?? author.updated_at,
                dateIsApproximate: !fechaReal,
                authorUserId: author.user_id,
                authorName: author.display_name ?? 'Profesional',
                authorPhoto: author.photo_url ?? null,
                authorRole: author.role ?? '',
              };
            })
          );

        const feedPosts = [...realPosts, ...audioPosts, ...portfolioPosts]
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setPosts(feedPosts);
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [viewerId]);

  return { posts, loading };
};
