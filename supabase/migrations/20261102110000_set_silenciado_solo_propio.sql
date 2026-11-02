-- Auditoría RLS (2 nov 2026): set_silenciado(dj, autor) se podía llamar por
-- RPC con dos usuarios cualesquiera (Supabase da EXECUTE a anon por defecto)
-- y revelaba a quién ha silenciado un DJ. La política de comentarios pasa a
-- usar una función que solo responde sobre quien llama (auth.uid()).
create or replace function public.me_ha_silenciado(p_dj uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.set_silenciados s where s.dj_user_id = p_dj and s.autor_id = auth.uid()
  );
$$;

revoke all on function public.me_ha_silenciado(uuid) from public, anon;
grant execute on function public.me_ha_silenciado(uuid) to authenticated;

drop policy "Comentar sets de otros" on public.set_comentarios;
create policy "Comentar sets de otros"
  on public.set_comentarios for insert
  to authenticated
  with check (
    (select auth.uid()) = autor_id
    and autor_id <> dj_user_id
    and public.set_es_del_dj(dj_user_id, set_url)
    and not public.me_ha_silenciado(dj_user_id)
  );

drop function public.set_silenciado(uuid, uuid);

-- set_es_del_dj solo lo necesita la política (authenticated); fuera de anon.
revoke execute on function public.set_es_del_dj(uuid, text) from anon;
