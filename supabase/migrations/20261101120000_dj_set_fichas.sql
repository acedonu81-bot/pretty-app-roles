-- Perfil de DJ tipo Hearthis, fase 1 (ficha XDS 76,2 aprobada el 1 nov 2026).
-- Cada sesión (archivo en audio-sessions o enlace de SoundCloud/Mixcloud/
-- hearthis guardado en profiles.audio_session_urls) puede tener una ficha:
-- título, portada, etiquetas, BPM, mood y tracklist con minutos. Se enlaza
-- por (user_id, set_url) porque las sesiones ya viven por usuario y no por
-- perfil (hay usuarios con más de un perfil).

create table public.dj_set_fichas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  set_url text not null check (char_length(set_url) <= 1000),
  titulo text check (char_length(titulo) <= 80),
  -- Solo portadas subidas a nuestro bucket: nada de imágenes externas
  -- (píxeles de seguimiento, enlaces que caducan).
  portada_url text check (
    portada_url is null or (
      char_length(portada_url) <= 500
      and portada_url like 'https://ddrqhwravupjzysriblq.supabase.co/storage/v1/object/public/audio-sessions/%'
    )
  ),
  etiquetas text[] not null default '{}' check (cardinality(etiquetas) <= 5),
  bpm smallint check (bpm between 60 and 200),
  mood text check (mood in ('energetico', 'elegante', 'melodico', 'oscuro', 'festivo', 'relajado', 'hipnotico')),
  tracklist jsonb not null default '[]'::jsonb check (
    jsonb_typeof(tracklist) = 'array' and jsonb_array_length(tracklist) <= 60
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, set_url)
);

alter table public.dj_set_fichas enable row level security;

create policy "Fichas de set visibles para todos"
  on public.dj_set_fichas for select
  to anon, authenticated
  using (true);

create policy "El DJ crea sus fichas"
  on public.dj_set_fichas for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "El DJ edita sus fichas"
  on public.dj_set_fichas for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "El DJ borra sus fichas"
  on public.dj_set_fichas for delete
  to authenticated
  using ((select auth.uid()) = user_id);

grant select on public.dj_set_fichas to anon, authenticated;
grant insert, update, delete on public.dj_set_fichas to authenticated;

-- follows solo deja leer a quien sigue (RLS), así que el contador público de
-- seguidores del perfil necesita esta función. Devuelve solo el número.
create or replace function public.contar_seguidores(p_user_id uuid)
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  select count(*)::integer from public.follows where followed_user_id = p_user_id;
$$;

revoke all on function public.contar_seguidores(uuid) from public;
grant execute on function public.contar_seguidores(uuid) to anon, authenticated;
