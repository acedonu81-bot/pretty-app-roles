-- feed_nuevos() solo contaba profile_posts. Las fotos de portfolio y los
-- audios subidos como archivo (no links externos pegados) llevan su
-- timestamp real de subida en el propio nombre del archivo en Storage
-- (PortfolioUpload.tsx / AudioUpload.tsx: {user_id}/{carpeta}/{Date.now()}-
-- {nombre}) — se puede extraer con una regex, sin columna nueva. Los links
-- externos de SoundCloud/HearThis/Mixcloud no tienen ningún timestamp real
-- guardado en ningún sitio y quedan fuera del aviso (a propósito).
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create or replace function private.extraer_timestamp_storage(url text)
returns timestamptz
language sql
immutable
as $$
  select case
    when url ~ '/(\d{13})-[^/]+$'
      then to_timestamp((regexp_match(url, '/(\d{13})-[^/]+$'))[1]::bigint / 1000.0)
    else null
  end;
$$;

create or replace function public.feed_nuevos()
returns integer
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  v_desde timestamptz;
  v_n integer;
begin
  select seen_at into v_desde from public.feed_seen where user_id = auth.uid();

  if v_desde is null then
    v_desde := now() - interval '7 days';
    insert into public.feed_seen (user_id, seen_at)
    values (auth.uid(), v_desde)
    on conflict (user_id) do nothing;
  end if;

  select
    (select count(*) from public.profile_posts pp
       join public.follows f on f.followed_user_id = pp.user_id
       where f.follower_id = auth.uid() and pp.created_at > v_desde)
    +
    (select count(*) from (
       select unnest(p.portfolio_urls) as url
       from public.follows f
       join public.profiles p on p.user_id = f.followed_user_id
       where f.follower_id = auth.uid() and p.portfolio_urls is not null
     ) urls
     where private.extraer_timestamp_storage(urls.url) > v_desde)
    +
    (select count(*) from (
       select unnest(p.audio_session_urls) as url
       from public.follows f
       join public.profiles p on p.user_id = f.followed_user_id
       where f.follower_id = auth.uid() and p.audio_session_urls is not null
     ) urls
     where private.extraer_timestamp_storage(urls.url) > v_desde)
  into v_n;

  return coalesce(v_n, 0);
end;
$$;
