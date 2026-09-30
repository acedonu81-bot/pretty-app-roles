-- Follows: cualquier usuario logueado sigue a un profesional (nunca al revés,
-- los empresarios no tienen ficha pública). Base para el feed personalizado
-- del dashboard a partir de profile_posts.
-- followed_user_id referencia auth.users (no profiles.user_id, que no tiene
-- UNIQUE) — mismo patrón que favorites.profile_id.
create table public.follows (
  id uuid primary key default gen_random_uuid(),
  follower_id uuid not null references auth.users(id) on delete cascade,
  followed_user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint follows_no_self check (follower_id <> followed_user_id),
  constraint follows_follower_id_followed_user_id_key unique (follower_id, followed_user_id)
);

create index follows_followed_user_id_idx on public.follows (followed_user_id);

alter table public.follows enable row level security;

create policy "Users manage own follows"
  on public.follows for all
  using ((select auth.uid()) = follower_id)
  with check ((select auth.uid()) = follower_id);
