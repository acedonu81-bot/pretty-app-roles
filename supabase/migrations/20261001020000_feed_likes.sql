-- Likes del feed: posts reales (profile_posts) y contenido sintético (fotos
-- de portfolio, sesiones de audio) usan el mismo mecanismo — un content_key
-- de texto en vez de una FK a profile_posts.id, porque las fotos/audios no
-- son filas reales en BD, solo URLs dentro de un array en profiles. Formato
-- de content_key: el id del feed post tal cual lo genera useFeedPosts.ts
-- ('post-<uuid>', 'audio-<user_id>-<i>', 'portfolio-<user_id>-<i>').
create table public.feed_likes (
  user_id uuid not null references auth.users(id) on delete cascade,
  content_key text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, content_key)
);

create index feed_likes_content_key_idx on public.feed_likes (content_key);

alter table public.feed_likes enable row level security;

-- Cualquiera autenticado puede LEER conteos de like de cualquier contenido
-- (hace falta para mostrar "12 me gusta" a todo el mundo, no solo al autor).
-- Solo puede insertar/borrar su propio like.
create policy "Authenticated can read feed_likes"
  on public.feed_likes for select
  to authenticated
  using (true);

create policy "Users manage own feed_likes"
  on public.feed_likes for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users delete own feed_likes"
  on public.feed_likes for delete
  to authenticated
  using ((select auth.uid()) = user_id);
