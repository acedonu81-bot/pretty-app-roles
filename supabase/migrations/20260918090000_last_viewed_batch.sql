-- "Visto hace X" en las tarjetas del listado del dashboard (ProfileCard.tsx):
-- señal pública de actividad reciente de CUALQUIER profesional, no solo la
-- propia. profile_business_views tiene RLS "select_own" (solo lees tus
-- propias filas como profesional viewed), así que un organizador mirando
-- el listado nunca podía ver la última vista de un profesional que no es
-- él mismo — igual que el bug ya documentado en DirectoryView.tsx sobre
-- weeklyViews (17 sep 2026), sin arreglar hasta ahora.
--
-- Recibe un array de user_id (los perfiles visibles en el listado) y
-- devuelve, para cada uno con al menos una vista en las últimas 48h, su
-- timestamp de última vista — el resto no aparece en el resultado (no se
-- expone "nunca visto" ni fechas antiguas, mismo criterio de "ocultar en
-- vez de mostrar un dato flojo" ya aplicado en useScarcitySignal).
create or replace function public.last_viewed_batch(p_user_ids uuid[])
returns table (user_id uuid, last_viewed_at timestamptz)
language sql
security definer
set search_path = public
stable
as $$
  select viewed_user_id as user_id, max(created_at) as last_viewed_at
  from public.profile_business_views
  where viewed_user_id = any(p_user_ids)
    and created_at > now() - interval '48 hours'
  group by viewed_user_id;
$$;

grant execute on function public.last_viewed_batch(uuid[]) to anon, authenticated;
