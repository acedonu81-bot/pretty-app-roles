-- Acelera la query del home: reviews donde approved=true ordenadas por created_at desc
create index if not exists idx_reviews_approved_created_at
  on public.reviews (approved, created_at desc)
  where approved = true;

-- Acelera la query del home: profiles recientes (roles frescos, últimos 7 días)
create index if not exists idx_profiles_created_at
  on public.profiles (created_at desc);
