-- Auditoría de seguridad 17 sep 2026: 3 funciones sin search_path fijado
-- (advisor function_search_path_mutable) — fija 'public' explícito para
-- evitar que un search_path distinto en tiempo de ejecución resuelva
-- nombres de tabla/función contra un esquema inesperado.

create or replace function public.enforce_single_primary_profile()
returns trigger
language plpgsql
set search_path to 'public'
as $function$
begin
  if new.is_primary = true then
    update public.profiles set is_primary = false
    where user_id = new.user_id and id <> new.id;
  end if;
  return new;
end;
$function$;

create or replace function public.is_profile_complete(p profiles)
returns boolean
language sql
stable
set search_path to 'public'
as $function$
  select p.photo_url is not null
     and p.bio is not null and length(trim(p.bio)) > 0
     and (
       (p.audio_embed_url is not null and length(trim(p.audio_embed_url)) > 0)
       or (p.audio_session_urls is not null and array_length(p.audio_session_urls, 1) > 0)
       or (p.portfolio_urls is not null and array_length(p.portfolio_urls, 1) > 0)
     );
$function$;

create or replace function public.user_profile_count(p_user_id uuid)
returns integer
language sql
stable
set search_path to 'public'
as $function$
  select count(*)::integer from public.profiles where user_id = p_user_id;
$function$;
