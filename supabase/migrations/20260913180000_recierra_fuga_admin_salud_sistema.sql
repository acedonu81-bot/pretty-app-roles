-- Reabre la fuga que ya se había cerrado el 9 sep 2026
-- (admin_views_security_fix): la migración 20260912170000
-- (perfil_invisible_descarte_expira) hizo `CREATE OR REPLACE VIEW
-- admin_salud_sistema` y volvió a añadir `GRANT SELECT ... TO authenticated`
-- explícito, sin darse cuenta de que la vista ya estaba pensada para leerse
-- SOLO a través de panel_admin_salud_sistema() (SECURITY DEFINER + chequeo
-- es_admin()). El frontend (AdminSaludSistema.tsx) ya usa ese RPC, nunca la
-- vista directa — el GRANT no servía a nada excepto exponer email y datos de
-- cualquier usuario (JOIN a auth.users) a cualquier cuenta logueada de XPEAK.
--
-- Detectado el 13 sep 2026 por el advisor de seguridad de Supabase
-- (Exposed Auth Users + Security Definer View, ambos CRITICAL).
--
-- Mismo caso que reference_politicas_rls_zombie: un CREATE OR REPLACE VIEW
-- posterior sin revisar el fix de seguridad previo reintroduce la fuga.

REVOKE ALL ON public.admin_salud_sistema FROM anon, authenticated;
