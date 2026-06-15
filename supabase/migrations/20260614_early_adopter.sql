alter table public.profiles
  add column if not exists is_early_adopter boolean not null default false;
