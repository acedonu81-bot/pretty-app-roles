-- 24 nov 2026: de qué comunidad autónoma entra la gente (panel admin).
--
-- Se guarda SOLO la comunidad, una vez por sesión, en una tabla aparte.
-- No se guarda la IP. La comunidad la deduce /api/geo con la cabecera que
-- Vercel ya pone a cada petición, y el navegador la manda aquí.
--
-- Tabla aparte (y no una columna en analytics_events) para no tocar las
-- sobrecargas de log_analytics_event ni las funciones quien_online/panel_*:
-- recrearlas pierde los REVOKE del endurecimiento y crea sobrecargas.

create table if not exists public.analytics_sesion_region (
  session_id text primary key,
  region     text not null,
  created_at timestamptz not null default now()
);

alter table public.analytics_sesion_region enable row level security;
revoke all on public.analytics_sesion_region from anon, authenticated;
-- Sin policies a propósito: solo se toca desde las funciones SECURITY DEFINER.

create index if not exists analytics_sesion_region_created_idx
  on public.analytics_sesion_region (created_at);

-- Lista cerrada: lo que no esté aquí se ignora (nadie puede meter texto libre).
create or replace function public.registrar_region_sesion(p_session_id text, p_region text)
returns void
language plpgsql
security definer
set search_path to 'public'
as $$
begin
  if p_session_id is null or length(p_session_id) < 8 or length(p_session_id) > 64 then
    return;
  end if;
  if p_region is null or p_region not in (
    'Andalucía','Aragón','Asturias','Baleares','Canarias','Cantabria',
    'Castilla y León','Castilla-La Mancha','Cataluña','Ceuta',
    'Comunidad Valenciana','Extremadura','Galicia','La Rioja','Madrid',
    'Melilla','Murcia','Navarra','País Vasco',
    'Fuera de España','España (sin dato)'
  ) then
    return;
  end if;
  insert into public.analytics_sesion_region (session_id, region)
  values (p_session_id, p_region)
  on conflict (session_id) do nothing;
end;
$$;

revoke execute on function public.registrar_region_sesion(text, text) from public;
grant execute on function public.registrar_region_sesion(text, text) to anon, authenticated;

-- Admin: comunidad de cada sesión online ahora (últimos 5 min).
create or replace function public.panel_analytics_region_online()
returns table(session_id text, region text)
language plpgsql
stable
security definer
set search_path to 'public'
as $$
begin
  if not public.es_admin() then raise exception 'Solo admin'; end if;
  return query
    select r.session_id, r.region
    from public.analytics_sesion_region r
    where r.session_id in (
      select e.session_id from public.analytics_events e
      where e.created_at >= now() - interval '5 minutes' and e.session_id is not null
    );
end;
$$;

revoke execute on function public.panel_analytics_region_online() from public, anon;
grant execute on function public.panel_analytics_region_online() to authenticated;

-- Admin: reparto por comunidad en los últimos p_dias días (personas distintas).
create or replace function public.panel_analytics_regiones(p_dias integer default 7)
returns table(region text, personas bigint, visitas bigint)
language plpgsql
stable
security definer
set search_path to 'public'
as $$
begin
  if not public.es_admin() then raise exception 'Solo admin'; end if;
  return query
    select coalesce(r.region, 'Sin dato')::text as region,
           count(distinct coalesce(e.user_id::text, e.session_id)) as personas,
           count(*) as visitas
    from public.analytics_events e
    left join public.analytics_sesion_region r on r.session_id = e.session_id
    where e.event_name = 'page_view'
      and e.created_at >= now() - make_interval(days => greatest(p_dias, 1))
      and e.session_id is not null
      and not public.es_trafico_propio(e.user_id)
    group by 1
    order by personas desc, visitas desc;
end;
$$;

revoke execute on function public.panel_analytics_regiones(integer) from public, anon;
grant execute on function public.panel_analytics_regiones(integer) to authenticated;
