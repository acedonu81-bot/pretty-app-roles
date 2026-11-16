-- Dominio personalizado de Supabase (auth.xpeak.es).
-- Las URLs publicas de Storage pasan a empezar por https://auth.xpeak.es/...
-- Se aceptan ambos dominios: el original sigue valiendo para lo ya guardado.

alter policy "El DJ guarda la onda de sus archivos" on public.set_ondas
  with check (
    (select auth.uid()) = user_id
    and (
      set_url like 'https://ddrqhwravupjzysriblq.supabase.co/storage/v1/object/public/audio-sessions/' || (select auth.uid())::text || '/%'
      or set_url like 'https://auth.xpeak.es/storage/v1/object/public/audio-sessions/' || (select auth.uid())::text || '/%'
    )
  );

alter policy "El DJ actualiza la onda de sus archivos" on public.set_ondas
  with check (
    (select auth.uid()) = user_id
    and (
      set_url like 'https://ddrqhwravupjzysriblq.supabase.co/storage/v1/object/public/audio-sessions/' || (select auth.uid())::text || '/%'
      or set_url like 'https://auth.xpeak.es/storage/v1/object/public/audio-sessions/' || (select auth.uid())::text || '/%'
    )
  );

alter table public.dj_set_fichas drop constraint dj_set_fichas_portada_url_check;
alter table public.dj_set_fichas add constraint dj_set_fichas_portada_url_check
  check (portada_url is null or (char_length(portada_url) <= 500 and (
    portada_url like 'https://ddrqhwravupjzysriblq.supabase.co/storage/v1/object/public/audio-sessions/%'
    or portada_url like 'https://auth.xpeak.es/storage/v1/object/public/audio-sessions/%')));

alter table public.dj_set_fichas drop constraint dj_set_fichas_fondo_url_check;
alter table public.dj_set_fichas add constraint dj_set_fichas_fondo_url_check
  check (fondo_url is null or (char_length(fondo_url) <= 500 and (
    fondo_url like 'https://ddrqhwravupjzysriblq.supabase.co/storage/v1/object/public/audio-sessions/%'
    or fondo_url like 'https://auth.xpeak.es/storage/v1/object/public/audio-sessions/%')));

alter table public.dj_banners drop constraint dj_banners_banner_url_check;
alter table public.dj_banners add constraint dj_banners_banner_url_check
  check (char_length(banner_url) <= 500 and (
    banner_url like 'https://ddrqhwravupjzysriblq.supabase.co/storage/v1/object/public/audio-sessions/%'
    or banner_url like 'https://auth.xpeak.es/storage/v1/object/public/audio-sessions/%'));
