-- Tabla de códigos promocionales
create table if not exists public.promo_codes (
  id          uuid primary key default gen_random_uuid(),
  code        text not null unique,
  description text,
  discount_percent integer not null check (discount_percent > 0 and discount_percent <= 100),
  plan_id     text,                       -- null = válido para todos los planes
  valid_from  timestamptz default now(),
  valid_until timestamptz,               -- null = sin caducidad
  max_uses    integer,                   -- null = usos ilimitados
  current_uses integer not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz default now()
);

-- Tabla de usos de códigos (para evitar que un usuario use el mismo código dos veces)
create table if not exists public.promo_code_uses (
  id          uuid primary key default gen_random_uuid(),
  code_id     uuid references public.promo_codes(id) on delete cascade,
  user_id     uuid references auth.users(id) on delete cascade,
  used_at     timestamptz default now(),
  unique(code_id, user_id)
);

-- Seguridad: sólo admins escriben, usuarios autenticados leen para validar
alter table public.promo_codes enable row level security;
alter table public.promo_code_uses enable row level security;

-- Política: cualquier autenticado puede leer códigos activos (para validar)
create policy "Authenticated users can read active promo codes"
  on public.promo_codes for select
  to authenticated
  using (is_active = true);

-- Política: autenticados pueden insertar sus propios usos
create policy "Users can insert their own promo uses"
  on public.promo_code_uses for insert
  to authenticated
  with check (user_id = auth.uid());

-- Política: usuarios pueden leer sus propios usos
create policy "Users can read their own promo uses"
  on public.promo_code_uses for select
  to authenticated
  using (user_id = auth.uid());
