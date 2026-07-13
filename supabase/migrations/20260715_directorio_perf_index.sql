-- Acelera el directorio público (/directorio/:rol): filtra por role + zone
-- y ordena por score. Sin índice, esto hace un seq scan completo de la
-- tabla profiles en cada carga — crítico a medida que crece el número
-- de profesionales registrados.
create index if not exists idx_profiles_role_score
  on public.profiles (role, score desc)
  where display_name is not null;

create index if not exists idx_profiles_zone
  on public.profiles (zone);

-- Acelera la nueva query de reviews por lote de perfiles del directorio.
create index if not exists idx_reviews_reviewed_user_id
  on public.reviews (reviewed_user_id)
  where approved = true;
