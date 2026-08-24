-- Permite a un admin forzar el aro azul ("early adopter") manualmente desde
-- el panel, como excepción puntual, sin cambiar el cálculo automático
-- (foto+bio+media) que sigue aplicando por defecto al resto de perfiles.
-- Ver src/lib/earlyAdopter.ts.
alter table public.profiles
  add column if not exists is_early_adopter_override boolean not null default false;
