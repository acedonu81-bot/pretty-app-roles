-- Revisión de seguridad (2 nov 2026): registrar_escucha tomaba la IP de la
-- primera entrada de x-forwarded-for, que el cliente puede inventar, así que
-- con un script se podían inflar escuchas y entrar en el podio. Ahora:
--  * IP de cf-connecting-ip (la pone Cloudflare, delante de Supabase, y
--    sobrescribe lo que mande el cliente); si faltara, la ÚLTIMA entrada de
--    x-forwarded-for (la añade el proxy, no el cliente).
--  * Tope de 30 escuchas al día por conexión, sumando todos los sets.
create or replace function public.registrar_escucha(p_dj uuid, p_set_url text, p_visitante uuid)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_cab json := coalesce(current_setting('request.headers', true), '{}')::json;
  v_xff text := coalesce(v_cab->>'x-forwarded-for', '');
  v_ip text := btrim(coalesce(nullif(v_cab->>'cf-connecting-ip', ''),
                              nullif(split_part(v_xff, ',', array_length(string_to_array(v_xff, ','), 1)), ''),
                              ''));
  v_ip_hash text := case when v_ip = '' then null else md5('xpeak-escuchas:' || v_ip) end;
  v_dia date := (now() at time zone 'Europe/Madrid')::date;
begin
  if p_visitante is null or p_dj is null then return false; end if;
  if v_uid = p_dj or public.es_trafico_propio(v_uid) then return false; end if;
  if not public.set_es_del_dj(p_dj, p_set_url) then return false; end if;
  if v_ip_hash is not null and (
    exists (select 1 from public.set_escuchas where set_url = p_set_url and ip_hash = v_ip_hash and dia = v_dia)
    or (select count(*) from public.set_escuchas where ip_hash = v_ip_hash and dia = v_dia) >= 30
  ) then return false; end if;
  if v_uid is not null and exists (
    select 1 from public.set_escuchas where set_url = p_set_url and oyente_id = v_uid and dia = v_dia
  ) then return false; end if;
  insert into public.set_escuchas (set_url, dj_user_id, oyente_id, visitante_id, ip_hash, dia)
  values (p_set_url, p_dj, v_uid, p_visitante, v_ip_hash, v_dia)
  on conflict (set_url, visitante_id, dia) do nothing;
  return found;
end;
$$;

create index if not exists set_escuchas_ip_dia_idx on public.set_escuchas (ip_hash, dia);
