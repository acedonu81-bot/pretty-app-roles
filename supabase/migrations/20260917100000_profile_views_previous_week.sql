-- Comparativa "↑N vs. semana pasada" para el contador de vistas del
-- Dashboard (ProfileCard.tsx). profile_views_last_7_days (20260818) ya
-- cuenta la semana actual; esta función cuenta la semana anterior (días
-- 8-14) para poder calcular la diferencia en el cliente sin dos queries.
create or replace function public.profile_views_previous_week(p_viewed_user_id uuid)
returns integer
language sql
security definer
set search_path = public
stable
as $$
  select count(*)::integer
  from public.profile_business_views
  where viewed_user_id = p_viewed_user_id
    and created_at <= now() - interval '7 days'
    and created_at > now() - interval '14 days';
$$;

grant execute on function public.profile_views_previous_week(uuid) to anon, authenticated;
