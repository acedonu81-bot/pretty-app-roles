-- Fondo propio de la tarjeta del set destacado (rediseño estilo Hearthis,
-- 1 nov 2026). Sin fondo, la tarjeta usa la carátula desenfocada.
-- Solo imágenes de nuestro bucket, como la carátula.
alter table public.dj_set_fichas
  add column fondo_url text check (
    fondo_url is null or (
      char_length(fondo_url) <= 500
      and fondo_url like 'https://ddrqhwravupjzysriblq.supabase.co/storage/v1/object/public/audio-sessions/%'
    )
  );

grant select (fondo_url) on public.dj_set_fichas to anon, authenticated;
grant insert (fondo_url), update (fondo_url) on public.dj_set_fichas to authenticated;
