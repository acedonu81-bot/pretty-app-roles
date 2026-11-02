-- Perfil de DJ tipo Hearthis (2 nov 2026): reposts de sesiones, lista de
-- seguidores y cifras de la columna lateral (siguiendo, escuchas hoy/ayer).
-- Empresarios: pueden repostear y seguir, pero nunca salen con nombre
-- (decisión del 30 sep: sin exposición pública). Por eso nada de esto se lee
-- de la tabla directamente: todo pasa por funciones que filtran.

create table public.set_reposts (
  id bigint generated always as identity primary key,
  set_url text not null check (char_length(set_url) <= 1000),
  dj_user_id uuid not null references auth.users(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (set_url, user_id)
);

create index set_reposts_dj_idx on public.set_reposts (dj_user_id, set_url);
create index set_reposts_user_idx on public.set_reposts (user_id, created_at desc);

alter table public.set_reposts enable row level security;

create policy "Cada uno ve sus reposts"
  on public.set_reposts for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- Nunca el propio set (inflar) y solo sets publicados de ese DJ.
create policy "Repostear sets de otros"
  on public.set_reposts for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    and user_id <> dj_user_id
    and public.set_es_del_dj(dj_user_id, set_url)
  );

create policy "Quitar mi repost"
  on public.set_reposts for delete
  to authenticated
  using ((select auth.uid()) = user_id);

grant select, insert, delete on public.set_reposts to authenticated;

-- Nombre público de un usuario: el de su perfil profesional; null si solo es
-- empresario (o no tiene perfil). Base de todo lo que enseña quién hizo algo.
create or replace function public.nombre_publico(p_user uuid)
returns table (nombre text, foto text, rol text)
language sql
stable
security definer
set search_path = ''
as $$
  select p.display_name, p.photo_url, p.role
  from public.profiles p
  where p.user_id = p_user and p.role <> 'empresario' and p.display_name is not null
  order by p.created_at
  limit 1;
$$;

revoke all on function public.nombre_publico(uuid) from public, anon, authenticated;

-- Aviso al DJ cuando alguien recomienda uno de sus sets.
create or replace function public.set_reposts_avisar_dj()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare v_nombre text;
begin
  select n.nombre into v_nombre from public.nombre_publico(new.user_id) n;
  insert into public.notifications (user_id, type, title, body, link)
  values (new.dj_user_id, 'repost_set',
    coalesce(v_nombre, 'Un organizador') || ' ha recomendado uno de tus sets',
    'Lo verán quienes le siguen.', '/p/' || new.dj_user_id::text);
  return new;
end;
$$;

create trigger set_reposts_avisar_dj
  after insert on public.set_reposts
  for each row execute function public.set_reposts_avisar_dj();

revoke all on function public.set_reposts_avisar_dj() from public, anon, authenticated;

-- Reposts de cada set de un DJ y si quien mira ya lo ha reposteado.
create or replace function public.reposts_sets_dj(p_dj uuid)
returns table (set_url text, reposts integer, yo boolean)
language sql
stable
security definer
set search_path = ''
as $$
  select r.set_url, count(*)::integer, coalesce(bool_or(r.user_id = auth.uid()), false)
  from public.set_reposts r where r.dj_user_id = p_dj group by r.set_url;
$$;

grant execute on function public.reposts_sets_dj(uuid) to anon, authenticated;

-- Pestaña "Reposts" de un perfil profesional: lo que ha recomendado.
-- Un empresario no tiene perfil público: para él no devuelve nada.
create or replace function public.reposts_de(p_user uuid)
returns table (set_url text, dj_user_id uuid, dj_nombre text, dj_foto text, created_at timestamptz)
language sql
stable
security definer
set search_path = ''
as $$
  select r.set_url, r.dj_user_id, d.nombre, d.foto, r.created_at
  from public.set_reposts r
  cross join lateral public.nombre_publico(r.dj_user_id) d
  where r.user_id = p_user
    and exists (select 1 from public.nombre_publico(p_user))
    and public.set_es_del_dj(r.dj_user_id, r.set_url)
  order by r.created_at desc
  limit 50;
$$;

grant execute on function public.reposts_de(uuid) to anon, authenticated;

-- Reposts para el panel (feed): los de la gente que sigo (solo profesionales,
-- con nombre) y los míos ("Has recomendado..."). Últimos 60 días.
create or replace function public.reposts_feed()
returns table (reposter_id uuid, reposter_nombre text, reposter_foto text, reposter_rol text,
               set_url text, dj_user_id uuid, dj_nombre text, created_at timestamptz, mio boolean)
language sql
stable
security definer
set search_path = ''
as $$
  select r.user_id, quien.nombre, quien.foto, quien.rol, r.set_url, r.dj_user_id, dj.nombre, r.created_at,
         r.user_id = auth.uid()
  from public.set_reposts r
  left join lateral public.nombre_publico(r.user_id) quien on true
  cross join lateral public.nombre_publico(r.dj_user_id) dj
  where auth.uid() is not null
    and r.created_at > now() - interval '60 days'
    and public.set_es_del_dj(r.dj_user_id, r.set_url)
    and (
      r.user_id = auth.uid()
      or (quien.nombre is not null and exists (
        select 1 from public.follows f where f.follower_id = auth.uid() and f.followed_user_id = r.user_id))
    )
  order by r.created_at desc
  limit 50;
$$;

revoke all on function public.reposts_feed() from public, anon;
grant execute on function public.reposts_feed() to authenticated;

-- Pestaña "Seguidores": solo profesionales con nombre; el resto se cuenta.
create or replace function public.seguidores_de(p_user uuid)
returns table (user_id uuid, nombre text, foto text, rol text)
language sql
stable
security definer
set search_path = ''
as $$
  select f.follower_id, n.nombre, n.foto, n.rol
  from public.follows f
  cross join lateral public.nombre_publico(f.follower_id) n
  where f.followed_user_id = p_user
  order by f.created_at desc
  limit 100;
$$;

grant execute on function public.seguidores_de(uuid) to anon, authenticated;

-- Cifras de la columna lateral.
create or replace function public.resumen_artista(p_user uuid)
returns table (seguidores integer, siguiendo integer, escuchas_hoy integer, escuchas_ayer integer, escuchas_total integer)
language sql
stable
security definer
set search_path = ''
as $$
  select
    (select count(*)::integer from public.follows where followed_user_id = p_user),
    (select count(*)::integer from public.follows where follower_id = p_user),
    (select count(*)::integer from public.set_escuchas where dj_user_id = p_user and dia = (now() at time zone 'Europe/Madrid')::date),
    (select count(*)::integer from public.set_escuchas where dj_user_id = p_user and dia = (now() at time zone 'Europe/Madrid')::date - 1),
    (select count(*)::integer from public.set_escuchas where dj_user_id = p_user);
$$;

grant execute on function public.resumen_artista(uuid) to anon, authenticated;
