
-- Web Push: guarda la suscripción del navegador de cada usuario para que
-- el servidor pueda enviar notificaciones reales (edge function send-push).
-- Antes de esta tabla, pushNotifications.ts obtenía la suscripción del
-- navegador pero solo la logueaba a consola — el toggle "Notificaciones
-- push" de SettingsView prometía avisos de Flash Booking que nunca se
-- enviaban porque no había dónde guardar el endpoint.
create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now()
);

create index if not exists push_subscriptions_user_id_idx
  on public.push_subscriptions(user_id);

alter table public.push_subscriptions enable row level security;

create policy "Users manage their own push subscriptions"
  on public.push_subscriptions
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
