-- Anonymous record of public contact-form submissions (no requester PII),
-- used to power the "alguien contactó a un DJ en Madrid" activity signal.
create table if not exists public.contact_events (
  id uuid primary key default gen_random_uuid(),
  professional_role text not null,
  professional_zone text,
  created_at timestamptz not null default now()
);

alter table public.contact_events enable row level security;

-- Anyone (including anonymous visitors using the public contact form) can log an event
create policy "contact_events_insert_anon" on public.contact_events
  for insert to anon with check (true);

create policy "contact_events_insert_authenticated" on public.contact_events
  for insert to authenticated with check (true);

-- Public read so the landing/dashboard activity feed can show it to anyone
create policy "contact_events_select_public" on public.contact_events
  for select using (true);

create index if not exists contact_events_created_at_idx on public.contact_events(created_at desc);
