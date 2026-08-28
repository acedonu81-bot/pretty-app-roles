-- Preferencias de alertas del calendario (CalendarView.tsx). Antes vivían
-- solo en localStorage del navegador, así que ningún proceso de servidor
-- (cron de recordatorios) podía leerlas. Esta tabla las espeja server-side.
create table if not exists public.alert_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  bolo_24h boolean not null default false,
  nuevos_bolos boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.alert_preferences enable row level security;

create policy "Users manage their own alert preferences"
  on public.alert_preferences
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
