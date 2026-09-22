-- Campos específicos del rol "Locales para eventos" (local_eventos).
-- aforo, si permite pernoctar, precio por hora Y por evento/noche (muchos
-- locales cobran por horas, no solo tarifa plana por noche), y distancia
-- desde Madrid — dato relevante porque varias fincas de despedida están
-- fuera de la ciudad.
alter table public.profiles
  add column if not exists venue_capacity integer,
  add column if not exists allows_overnight boolean,
  add column if not exists price_per_hour numeric,
  add column if not exists price_per_event numeric,
  add column if not exists distance_from_madrid_km integer;

comment on column public.profiles.venue_capacity is 'Aforo/capacidad de personas, rol local_eventos';
comment on column public.profiles.allows_overnight is 'Si el local permite pernoctar, rol local_eventos';
comment on column public.profiles.price_per_hour is 'Precio por hora, rol local_eventos (opcional, alternativo a price_per_event)';
comment on column public.profiles.price_per_event is 'Precio por evento/noche, rol local_eventos (opcional, alternativo a price_per_hour)';
comment on column public.profiles.distance_from_madrid_km is 'Distancia en km desde Madrid, rol local_eventos';

grant select (venue_capacity, allows_overnight, price_per_hour, price_per_event, distance_from_madrid_km)
  on public.profiles to anon, authenticated;
