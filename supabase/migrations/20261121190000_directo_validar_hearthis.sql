-- Directos (21 nov 2026): se admite también hearthis.at (perfil del profesional, no el panel /live).
-- Solo cambia el regex de enlace; el resto de la función es igual que 20261120130000.
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
        and new.stream_url !~* '^(https?://)?(www\.)?hearthis\.at(:[0-9]+)?/(?!live(/|\?|#|$))[^/?#\s]+'
     or new.stream_url ~ '[\s\\]' then
    raise exception 'El enlace del directo debe ser de Twitch, YouTube o Hearthis';
  end if;
  if new.stream_title is not null and length(new.stream_title) > 80 then
    raise exception 'El título del directo admite 80 caracteres como máximo';
  end if;

  if tg_op = 'INSERT' or old.is_live is distinct from true
     or old.live_started_at is distinct from new.live_started_at then
    new.live_started_at := now();
  end if;
  return new;
end;
$$;
