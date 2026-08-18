-- Contador de vistas de perfil de los últimos 7 días, para prueba social real
-- en el propio perfil público (no solo la "última vista de sala" que ya existe
-- en el dashboard vía profile_business_views + useRecentBusinessView).
-- Reutiliza profile_business_views en vez de crear tabla nueva: cuenta TODAS
-- las vistas (antes solo se insertaba si el visitante era un empresario
-- logueado; ahora cualquier vista real de /p/:slug cuenta).
create or replace function public.profile_views_last_7_days(p_viewed_user_id uuid)
returns integer
language sql
security definer
set search_path = public
stable
as $$
  select count(*)::integer
  from public.profile_business_views
  where viewed_user_id = p_viewed_user_id
    and created_at > now() - interval '7 days';
$$;

grant execute on function public.profile_views_last_7_days(uuid) to anon, authenticated;

-- Solicitudes Flash Booking recibidas hoy por profesional (racha real, no inventada)
create or replace function public.flash_bookings_today_count(p_professional_user_id uuid)
returns integer
language sql
security definer
set search_path = public
stable
as $$
  select count(*)::integer
  from public.flash_bookings
  where professional_user_id = p_professional_user_id
    and created_at > now() - interval '24 hours';
$$;

grant execute on function public.flash_bookings_today_count(uuid) to anon, authenticated;

-- Cron: recordatorio diario de perfil incompleto (24-48h tras registro)
select cron.schedule(
  'xpeak-profile-incomplete-reminder',
  '0 11 * * *',
  $$
    select net.http_post(
      url    := current_setting('app.supabase_url') || '/functions/v1/profile-incomplete-reminder',
      headers := '{"Authorization":"Bearer ' || current_setting('app.service_role_key') || '","Content-Type":"application/json"}'::jsonb,
      body   := '{}'::jsonb
    );
  $$
);

-- Ampliar profile_business_views para aceptar inserts de visitantes anónimos
-- también (antes solo empresarios logueados podían insertar) — necesario
-- para que el contador de vistas del perfil público cuente cualquier visita
-- real, no solo las de organizadores con sesión iniciada.
drop policy if exists "profile_business_views_insert_authenticated" on public.profile_business_views;
create policy "profile_business_views_insert_any" on public.profile_business_views
  for insert
  to authenticated, anon
  with check (true);
