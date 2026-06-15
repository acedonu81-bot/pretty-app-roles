create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  reviewer_name text not null,
  reviewer_role text not null,
  reviewer_avatar text,
  text text not null,
  rating smallint not null default 5 check (rating between 1 and 5),
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;
create policy "Public read approved reviews" on public.reviews for select using (approved = true);

-- Seed con las 3 reseñas actuales ya aprobadas
insert into public.reviews (reviewer_name, reviewer_role, reviewer_avatar, text, rating, approved) values
  ('Marcos DJ', 'DJ Residente · Madrid', 'M', 'En menos de una semana me contactaron dos salas de Madrid a través del directorio. Nunca había conseguido bookings tan rápido sin intermediarios.', 5, true),
  ('Laura V.', 'Maquilladora · Barcelona', 'L', 'Mi perfil en XPEAK me trajo tres clientes nuevos en el primer mes. Por fin un sitio donde el sector de eventos busca talento de imagen de verdad.', 5, true),
  ('Club Nocturno NX', 'Empresario · Valencia', 'N', 'El Flash Booking nos salvó una noche: publicamos la oferta a las 10pm y a las 11pm teníamos DJ confirmado. Antes eso nos costaba llamadas interminables.', 5, true);
