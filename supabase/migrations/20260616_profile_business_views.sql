-- Anonymous record of business ("empresario") views on a professional's public
-- profile, used to show "Una sala de Madrid ha visto tu perfil" on the dashboard.
-- No viewer identity is stored — only the viewer's zone, same anonymization
-- pattern as contact_events.
create table if not exists public.profile_business_views (
  id uuid primary key default gen_random_uuid(),
  viewed_user_id uuid not null,
  viewer_zone text,
  created_at timestamptz not null default now()
);

alter table public.profile_business_views enable row level security;

-- Any logged-in user can log a view (the app only calls insert when the
-- viewer's own profile role is 'empresario' — enforced client-side, see Task 3)
create policy "profile_business_views_insert_authenticated" on public.profile_business_views
  for insert to authenticated with check (true);

-- A professional can only read views of their own profile — this is private
-- feedback to them, not a public activity signal like contact_events
create policy "profile_business_views_select_own" on public.profile_business_views
  for select to authenticated using (auth.uid() = viewed_user_id);

create index if not exists profile_business_views_viewed_user_created_idx
  on public.profile_business_views(viewed_user_id, created_at desc);
