-- Perfil de DJ tipo Hearthis, fase 3 (1 nov 2026): escuchas, podio de los 3
-- sets más escuchados (medallas oro/plata/bronce) y límite de 3 sets en Free.
--
-- Escucha válida: 5 minutos de reproducción real (los cuenta el navegador),
-- una por persona y set al día. "Persona" = visitante (id guardado en su
-- navegador) y, además, IP: borrar el navegador no da escuchas nuevas el
-- mismo día desde la misma conexión. No cuentan el propio DJ ni el tráfico
-- propio (admins, cuentas @xpeak.es, demo: es_trafico_propio).

create table public.set_escuchas (
  id bigint generated always as identity primary key,
  set_url text not null check (char_length(set_url) <= 1000),
  dj_user_id uuid not null references auth.users(id) on delete cascade,
  oyente_id uuid references auth.users(id) on delete set null,
  visitante_id uuid not null,
  ip_hash text,
  dia date not null default (now() at time zone 'Europe/Madrid')::date,
  created_at timestamptz not null default now(),
  unique (set_url, visitante_id, dia)
);

create index set_escuchas_podio_idx on public.set_escuchas (created_at, set_url);
create index set_escuchas_dj_idx on public.set_escuchas (dj_user_id, set_url);
create index set_escuchas_ip_idx on public.set_escuchas (set_url, ip_hash, dia);

-- Sin políticas: nadie la lee ni la escribe directamente; todo por funciones.
alter table public.set_escuchas enable row level security;

create or replace function public.registrar_escucha(p_dj uuid, p_set_url text, p_visitante uuid)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_ip text := split_part(coalesce(current_setting('request.headers', true)::json->>'x-forwarded-for', ''), ',', 1);
  v_ip_hash text := case when v_ip = '' then null else md5('xpeak-escuchas:' || btrim(v_ip)) end;
  v_dia date := (now() at time zone 'Europe/Madrid')::date;
begin
  if p_visitante is null or p_dj is null then return false; end if;
  if v_uid = p_dj or public.es_trafico_propio(v_uid) then return false; end if;
  if not public.set_es_del_dj(p_dj, p_set_url) then return false; end if;
  if v_ip_hash is not null and exists (
    select 1 from public.set_escuchas where set_url = p_set_url and ip_hash = v_ip_hash and dia = v_dia
  ) then return false; end if;
  -- Con sesión, tampoco vale repetir desde otro navegador el mismo día.
  if v_uid is not null and exists (
    select 1 from public.set_escuchas where set_url = p_set_url and oyente_id = v_uid and dia = v_dia
  ) then return false; end if;
  insert into public.set_escuchas (set_url, dj_user_id, oyente_id, visitante_id, ip_hash, dia)
  values (p_set_url, p_dj, v_uid, p_visitante, v_ip_hash, v_dia)
  on conflict (set_url, visitante_id, dia) do nothing;
  return found;
end;
$$;

revoke all on function public.registrar_escucha(uuid, text, uuid) from public;
grant execute on function public.registrar_escucha(uuid, text, uuid) to anon, authenticated;

-- set_es_del_dj se creó solo para authenticated; las escuchas sin sesión la
-- llaman a través de registrar_escucha (security definer), no hace falta más.

-- Podio: los 3 sets más escuchados de los últimos 30 días (ranking vivo: un
-- DJ nuevo puede entrar sin competir con escuchas de hace un año). Solo sets
-- que siguen publicados en un perfil de DJ.
create or replace function public.podio_sets()
returns table (puesto integer, set_url text, dj_user_id uuid, nombre text, foto text, escuchas integer)
language sql
stable
security definer
set search_path = ''
as $$
  with cuenta as (
    select e.set_url, e.dj_user_id, count(*)::integer as escuchas, min(e.created_at) as primera
    from public.set_escuchas e
    where e.created_at > now() - interval '30 days'
    group by e.set_url, e.dj_user_id
  ), vivos as (
    select c.*, p.display_name, p.photo_url
    from cuenta c
    join lateral (
      select pr.display_name, pr.photo_url from public.profiles pr
      where pr.user_id = c.dj_user_id and pr.role = 'dj' and c.set_url = any (pr.audio_session_urls)
      order by pr.created_at limit 1
    ) p on true
  )
  select (row_number() over (order by v.escuchas desc, v.primera asc))::integer, v.set_url, v.dj_user_id, v.display_name, v.photo_url, v.escuchas
  from vivos v
  order by v.escuchas desc, v.primera asc
  limit 3;
$$;

revoke all on function public.podio_sets() from public;
grant execute on function public.podio_sets() to anon, authenticated;

-- Escuchas totales de cada set de un DJ (el número junto a cada set).
create or replace function public.escuchas_sets_dj(p_dj uuid)
returns table (set_url text, escuchas integer)
language sql
stable
security definer
set search_path = ''
as $$
  select e.set_url, count(*)::integer from public.set_escuchas e where e.dj_user_id = p_dj group by e.set_url;
$$;

revoke all on function public.escuchas_sets_dj(uuid) from public;
grant execute on function public.escuchas_sets_dj(uuid) to anon, authenticated;

-- ── Límite de sets en Free ──────────────────────────────────────────────
-- 3 sets en el plan Free (ampliable en los de pago, por decidir). Quien ya
-- tenía más (hoy DJ VIZARD, 6) los conserva: solo se impide AÑADIR por
-- encima de 3, nunca se quitan. Va en la BD porque la columna se escribe
-- desde el navegador.
create or replace function public.limite_sets_free()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_nuevo integer := coalesce(cardinality(new.audio_session_urls), 0);
  v_viejo integer := coalesce(cardinality(old.audio_session_urls), 0);
begin
  if coalesce(new.subscription_tier, 'free') = 'free' and v_nuevo > 3 and v_nuevo > v_viejo then
    raise exception 'En el plan Free puedes tener hasta 3 sets publicados' using errcode = 'P0001';
  end if;
  return new;
end;
$$;

create trigger limite_sets_free
  before update of audio_session_urls on public.profiles
  for each row execute function public.limite_sets_free();
