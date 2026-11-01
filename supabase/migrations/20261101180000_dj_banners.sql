-- Banner del perfil de artista del DJ (rediseño estilo Hearthis, 1 nov 2026).
-- Tabla aparte y no columna en profiles: profiles arrastra RLS y grants por
-- columna delicados, y esto solo lo usa la cabecera del DJ.
create table public.dj_banners (
  user_id uuid primary key references auth.users(id) on delete cascade,
  banner_url text not null check (
    char_length(banner_url) <= 500
    and banner_url like 'https://ddrqhwravupjzysriblq.supabase.co/storage/v1/object/public/audio-sessions/%'
  ),
  updated_at timestamptz not null default now()
);

alter table public.dj_banners enable row level security;

create policy "Banners visibles para todos"
  on public.dj_banners for select
  to anon, authenticated
  using (true);

create policy "El DJ pone su banner"
  on public.dj_banners for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "El DJ cambia su banner"
  on public.dj_banners for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "El DJ quita su banner"
  on public.dj_banners for delete
  to authenticated
  using ((select auth.uid()) = user_id);

grant select on public.dj_banners to anon, authenticated;
grant insert, update, delete on public.dj_banners to authenticated;
