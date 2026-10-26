-- Tarifas reales para los precios de las páginas públicas (26 oct 2026).
-- Excluye cuentas propias/demo (es_trafico_propio), perfiles semilla, rechazados,
-- empresarios y tarifas sin rellenar o por defecto (0, 1, 40 €/h).
create or replace function public.tarifas_publicas(p_roles text[])
returns table(user_id uuid, hourly_rate numeric)
language sql
stable
security definer
set search_path to 'public'
as $$
  select p.user_id, p.hourly_rate::numeric
  from public.profiles p
  where (p.role = any(p_roles) or p.roles && p_roles)
    and p.role <> 'empresario'
    and not coalesce(p.is_seed, false)
    and not coalesce(p.is_seed_profile, false)
    and p.validation_status is distinct from 'rejected'
    and p.hourly_rate between 10 and 2000
    and p.hourly_rate <> 40
    and not public.es_trafico_propio(p.user_id);
$$;

revoke all on function public.tarifas_publicas(text[]) from public;
grant execute on function public.tarifas_publicas(text[]) to anon, authenticated;
