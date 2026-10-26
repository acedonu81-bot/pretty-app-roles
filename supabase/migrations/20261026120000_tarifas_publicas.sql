-- Precio real para las páginas públicas (26 oct 2026). Devuelve solo el
-- resumen (nunca tarifas sueltas ni identificadores) y solo con 5 tarifas o
-- más. Excluye cuentas propias/demo (es_trafico_propio), perfiles semilla,
-- no aprobados, empresarios y tarifas sin rellenar o por defecto (0, 1, 40 €/h).
-- p_user_ids limita el cálculo a los perfiles que ya muestra la página (ciudad);
-- null = todo el país (página de oficio).
create or replace function public.tarifas_publicas(p_roles text[], p_user_ids uuid[] default null)
returns table(n int, min_eur int, max_eur int, p25 numeric, p50 numeric, p75 numeric)
language sql
stable
security definer
set search_path to 'public'
as $$
  select count(*)::int, min(p.hourly_rate), max(p.hourly_rate),
         percentile_cont(0.25) within group (order by p.hourly_rate)::numeric,
         percentile_cont(0.5) within group (order by p.hourly_rate)::numeric,
         percentile_cont(0.75) within group (order by p.hourly_rate)::numeric
  from public.profiles p
  where (p.role = any(p_roles) or p.roles && p_roles)
    and (p_user_ids is null or p.user_id = any(p_user_ids))
    and p.role <> 'empresario'
    and not coalesce(p.is_seed, false)
    and not coalesce(p.is_seed_profile, false)
    -- Solo perfiles aprobados: los mismos que anon ya ve con su tarifa por RLS
    -- ("Anon can view approved profiles"), así que elegir p_user_ids no
    -- permite deducir la tarifa de un perfil que no sea público.
    and p.validation_status = 'approved'
    and p.hourly_rate between 10 and 2000
    and p.hourly_rate <> 40
    and not public.es_trafico_propio(p.user_id)
  having count(*) >= 5;
$$;

revoke all on function public.tarifas_publicas(text[], uuid[]) from public;
grant execute on function public.tarifas_publicas(text[], uuid[]) to anon, authenticated;
