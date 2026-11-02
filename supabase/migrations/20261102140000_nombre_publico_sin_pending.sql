-- nombre_publico devolvía también a las cuentas con rol 'pending' (295, p. ej.
-- votantes del concurso que no han elegido rol): salían con nombre en la
-- pestaña Seguidores. Solo tienen nombre público los profesionales con oficio.
create or replace function public.nombre_publico(p_user uuid)
returns table (nombre text, foto text, rol text)
language sql
stable
security definer
set search_path = ''
as $$
  select p.display_name, p.photo_url, p.role
  from public.profiles p
  where p.user_id = p_user and p.role not in ('empresario', 'pending') and p.display_name is not null
  order by p.created_at
  limit 1;
$$;

revoke all on function public.nombre_publico(uuid) from public, anon, authenticated;
