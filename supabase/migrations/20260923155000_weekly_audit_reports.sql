-- Reports contain security findings: never expose them in public GitHub artifacts.
create table public.weekly_audit_reports (
  id text primary key check (id ~ '^(seo|security)-[0-9]{4}-[0-9]{2}-[0-9]{2}$'),
  kind text not null check (kind in ('seo', 'security')),
  scheduled_date date not null,
  created_at timestamptz not null default now(),
  status text not null check (status in ('complete', 'partial', 'failed')),
  report jsonb not null check (jsonb_typeof(report) = 'object'),
  markdown text not null,
  unique(kind, scheduled_date)
);
alter table public.weekly_audit_reports enable row level security;
revoke all on public.weekly_audit_reports from anon, authenticated;
grant select on public.weekly_audit_reports to authenticated;
grant select, insert, update on public.weekly_audit_reports to service_role;
create policy "Administradores leen auditorias" on public.weekly_audit_reports
  for select to authenticated using ((select public.es_admin()));

-- Only catalog metadata, no business rows, secrets, auth users or function bodies.
create function public.weekly_audit_security_snapshot() returns jsonb
language sql stable security invoker set search_path = pg_catalog
as $$
select jsonb_build_object(
 'tables_without_rls', coalesce((select jsonb_agg(c.relname order by c.relname)
   from pg_class c join pg_namespace n on n.oid=c.relnamespace
   where n.nspname='public' and c.relkind='r' and not c.relrowsecurity), '[]'::jsonb),
 'definer_without_search_path', coalesce((select jsonb_agg(p.proname order by p.proname)
   from pg_proc p join pg_namespace n on n.oid=p.pronamespace
   where n.nspname='public' and p.prosecdef
     and not exists(select 1 from unnest(p.proconfig) v where v like 'search_path=%')), '[]'::jsonb),
 'anon_definer_count', (select count(*) from pg_proc p join pg_namespace n on n.oid=p.pronamespace
   where n.nspname='public' and p.prosecdef and has_function_privilege('anon',p.oid,'EXECUTE')),
 'security_migrations', coalesce((select jsonb_agg(version order by version)
   from supabase_migrations.schema_migrations
   where version in ('20260917150000','20260923110406','20260923150000')), '[]'::jsonb)
);
$$;
revoke all on function public.weekly_audit_security_snapshot() from public, anon, authenticated;
grant execute on function public.weekly_audit_security_snapshot() to service_role;
-- The service role needs catalog migration metadata, never modification rights.
grant usage on schema supabase_migrations to service_role;
grant select(version) on supabase_migrations.schema_migrations to service_role;
