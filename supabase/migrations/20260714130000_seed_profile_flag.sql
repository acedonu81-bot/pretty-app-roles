-- Marca los perfiles de relleno/lanzamiento para poder etiquetarlos como
-- "Perfil de ejemplo" en el directorio público sin confundirlos con
-- profesionales reales registrados.
alter table public.profiles add column if not exists is_seed boolean not null default false;

update public.profiles set is_seed = true
where display_name in (
  'Marco Delgado', 'Sofía Ruiz', 'Nadia Ferrer', 'Laura Montés', 'Carlos Reyes',
  'Rubén Castillo', 'Iván Tormos', 'Carmen Blanco', 'Paula Navarro', 'Elena Soto',
  'Jorge Méndez', 'Yara Salsa', 'Kike Bachata', 'Marcos Kizomba', 'Elena Salsa On2'
);
