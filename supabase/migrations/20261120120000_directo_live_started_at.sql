-- Directos en XPEAK (20 nov 2026): hora de inicio del directo, para que caduque solo
-- si el profesional olvida terminarlo (el cliente descarta los de más de 8 h).
alter table public.profiles add column if not exists live_started_at timestamptz;
-- profiles tiene grants por columna: sin esto, anon/authenticated no pueden leer la columna nueva.
grant select (live_started_at) on public.profiles to anon, authenticated;
grant update (live_started_at) on public.profiles to authenticated;
