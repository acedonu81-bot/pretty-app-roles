-- Registro de altas sin captcha desde el navegador de Instagram/Facebook
-- (edge function signup-inapp). Solo lo lee y escribe la service_role para
-- limitar altas por IP y por hora; RLS sin políticas = nadie más lo ve.
create table if not exists public.inapp_signup_attempts (
  id bigint generated always as identity primary key,
  ip text not null,
  created_at timestamptz not null default now()
);
create index if not exists inapp_signup_attempts_ip_created_idx on public.inapp_signup_attempts (ip, created_at);
create index if not exists inapp_signup_attempts_created_idx on public.inapp_signup_attempts (created_at);
alter table public.inapp_signup_attempts enable row level security;
revoke all on public.inapp_signup_attempts from anon, authenticated;
