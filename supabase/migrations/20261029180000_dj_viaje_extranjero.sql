-- Sondeo interno (29 oct 2026): ¿viajaría un DJ al extranjero y a qué países?
-- Sirve para medir la oferta antes de decidir si XPEAK abre contratación
-- internacional (ver ficha XDS). No es público: solo lo lee el propio DJ y
-- los admins. Tabla aparte y no columnas en profiles, que tiene grants por
-- columna y rompería la carga de perfiles públicos si se olvida un GRANT.
create table if not exists public.viaje_extranjero (
  user_id uuid primary key references auth.users(id) on delete cascade,
  viajaria boolean not null,
  paises text[] not null default '{}',
  updated_at timestamptz not null default now()
);

alter table public.viaje_extranjero enable row level security;

revoke all on public.viaje_extranjero from anon;
grant select, insert, update on public.viaje_extranjero to authenticated;

create policy "Users manage their own viaje_extranjero"
  on public.viaje_extranjero
  for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Admins read viaje_extranjero"
  on public.viaje_extranjero
  for select
  to authenticated
  using (public.has_role((select auth.uid()), 'admin'));
