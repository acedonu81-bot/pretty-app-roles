-- Directos (20 nov 2026): la validación de enlace, rol y hora NO puede vivir solo en el cliente.
-- Cuando un perfil está en directo (is_live = true) el servidor exige:
--   · enlace de Twitch o YouTube anclado al dominio (twitch.tv.evil.com y twitch.tv@evil.com no pasan)
--   · rol que pueda emitir (no empresario ni particular)
--   · título de 80 caracteres como máximo
--   · live_started_at fijado por el servidor (now()), no por el cliente
-- Solo se evalúa cuando cambia algo del directo, para no romper otras ediciones del perfil.
create or replace function public.profiles_validar_directo()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.is_live is not true then
    return new;
  end if;

  if tg_op = 'UPDATE'
     and old.is_live is not distinct from new.is_live
     and old.stream_url is not distinct from new.stream_url
     and old.stream_title is not distinct from new.stream_title
     and old.live_started_at is not distinct from new.live_started_at
     and old.role is not distinct from new.role then
    return new;
  end if;

  if new.role in ('empresario', 'particular') then
    raise exception 'Este tipo de cuenta no puede hacer directos';
  end if;
  if new.stream_url is null
     or new.stream_url !~* '^(https?://)?([a-z0-9-]+\.)*(twitch\.tv|youtube\.com|youtu\.be)(:[0-9]+)?([/?#]|$)'
     or new.stream_url ~ '[\s\\]' then
    raise exception 'El enlace del directo debe ser de Twitch o YouTube';
  end if;
  if new.stream_title is not null and length(new.stream_title) > 80 then
    raise exception 'El título del directo admite 80 caracteres como máximo';
  end if;

  -- La hora de inicio la pone el servidor cuando empieza el directo.
  if tg_op = 'INSERT' or old.is_live is distinct from true
     or old.live_started_at is distinct from new.live_started_at then
    new.live_started_at := now();
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_validar_directo on public.profiles;
create trigger profiles_validar_directo
  before insert or update on public.profiles
  for each row execute function public.profiles_validar_directo();
