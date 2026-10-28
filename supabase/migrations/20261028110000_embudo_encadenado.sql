-- Embudo rehecho (28 oct 2026). El anterior mezclaba poblaciones y no se
-- podía leer: "Ven un perfil" solo contaba fichas abiertas DENTRO de la app
-- (ignoraba las 321 visitas a /p/... de 30 días, que es donde llega Google),
-- y el último paso eran casi todo registros de la portada/Instagram, así que
-- salía MAYOR que el anterior. Además contact_click no lo disparaba nadie.
--
-- Ahora cada paso es un subconjunto del anterior (misma sesión), así que la
-- caída entre pasos es real. Los registros van aparte (orden 99): no son un
-- paso de este camino, llegan sobre todo por otras puertas.

create or replace function public.analytics_embudo(p_dias integer default 30)
returns table (paso text, orden integer, cantidad bigint)
language sql
security definer
set search_path = public
as $$
  with ev as (
    select event_name, session_id, path
    from public.analytics_events
    where created_at >= now() - (least(greatest(p_dias, 1), 365) || ' days')::interval
      and not public.es_trafico_propio(analytics_events.user_id)
      and session_id is not null
  ),
  s1 as (select distinct session_id from ev where event_name = 'page_view'),
  s2 as (
    select distinct session_id from ev
    where (event_name = 'profile_view' or (event_name = 'page_view' and path like '/p/%'))
      and session_id in (select session_id from s1)
  ),
  s3 as (
    select distinct session_id from ev
    where event_name in ('contact_click', 'flash_request')
      and session_id in (select session_id from s2)
  ),
  s4 as (
    select distinct session_id from ev
    where event_name = 'flash_request'
      and session_id in (select session_id from s3)
  )
  select 'Entran en la web'::text, 1, (select count(*) from s1)
  union all select 'Abren la ficha de un profesional', 2, (select count(*) from s2)
  union all select 'Pulsan "Contactar"', 3, (select count(*) from s3)
  union all select 'Envían la solicitud', 4, (select count(*) from s4)
  union all select 'Se registran (aparte)', 99,
    (select count(distinct session_id) from ev where event_name = 'signup')
  order by 2;
$$;
