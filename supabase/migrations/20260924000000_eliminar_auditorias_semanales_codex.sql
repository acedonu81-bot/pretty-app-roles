-- Retirada de las auditorías semanales que montó Codex el 23 sep 2026
-- (tabla weekly_audit_reports, función de snapshot y grant de lectura de
-- migraciones a service_role). También se borró la edge function
-- weekly-audit-gateway y el secreto AUDIT_RUNNER_TOKEN.
DROP FUNCTION IF EXISTS public.weekly_audit_security_snapshot();
DROP TABLE IF EXISTS public.weekly_audit_reports;
REVOKE SELECT (version) ON supabase_migrations.schema_migrations FROM service_role;
