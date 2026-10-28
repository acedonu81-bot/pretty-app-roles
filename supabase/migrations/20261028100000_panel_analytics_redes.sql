-- Clics en el Instagram/TikTok de los profesionales, para el panel de Tráfico
-- (28 oct 2026). El front los registra como cta_click con detalle
-- "redes <red> <origen> <user_id del profesional>" (ver clicRedSocial en
-- src/lib/track.ts). Mide cuánta gente se va a las redes del profesional,
-- que es por donde puede escaparse el contacto fuera de XPEAK.
-- Los clics de admins no cuentan: inflarían la cifra con nuestras pruebas.

create or replace function public.panel_analytics_redes(p_dias integer)
returns table (
  cuando timestamptz,
  red text,
  origen text,
  profesional text,
  profesional_user_id uuid,
  quien text,
  session_id text,
  device text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.es_admin() then
    raise exception 'Solo admin';
  end if;

  return query
  select
    e.created_at,
    split_part(e.detalle, ' ', 2),
    split_part(e.detalle, ' ', 3),
    pr.display_name::text,
    pr.user_id,
    q.display_name::text,
    e.session_id::text,
    e.device::text
  from public.analytics_events e
  left join lateral (
    select p.user_id, p.display_name
    from public.profiles p
    where p.user_id::text = split_part(e.detalle, ' ', 4)
    order by p.is_primary desc nulls last
    limit 1
  ) pr on true
  left join lateral (
    select p.display_name
    from public.profiles p
    where p.user_id = e.user_id
    order by p.is_primary desc nulls last
    limit 1
  ) q on true
  where e.event_name = 'cta_click'
    and e.detalle like 'redes %'
    and e.created_at >= now() - make_interval(days => p_dias)
    and (e.user_id is null or not public.has_role(e.user_id, 'admin'))
  order by e.created_at desc
  limit 500;
end;
$$;

revoke execute on function public.panel_analytics_redes(integer) from anon;
