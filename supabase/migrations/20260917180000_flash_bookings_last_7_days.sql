-- Solicitudes Flash Booking recibidas en los últimos 7 días por profesional,
-- para la señal de escasez visible tanto en el propio dashboard (StatsView)
-- como en la ficha pública que ve el organizador (PublicProfile).
--
-- RLS en flash_bookings solo permite leer las filas propias
-- (professional_user_id = auth.uid() OR created_by = auth.uid() OR
-- es_admin()), así que un organizador visitando la ficha de OTRO
-- profesional nunca puede contar sus solicitudes directamente — de ahí
-- el mismo patrón security definer que ya usa profile_views_last_7_days.
--
-- Excluye es_autorregistro = true: un profesional que se contrata a sí
-- mismo no debe inflar su propia prueba social (mismo criterio que ya
-- aplican StatsView.tsx, ProfileView.tsx y AdminMetrics.tsx).
create or replace function public.flash_bookings_last_7_days(p_professional_user_id uuid)
returns integer
language sql
security definer
set search_path = public
stable
as $$
  select count(*)::integer
  from public.flash_bookings
  where professional_user_id = p_professional_user_id
    and created_at > now() - interval '7 days'
    and es_autorregistro = false;
$$;

grant execute on function public.flash_bookings_last_7_days(uuid) to anon, authenticated;
