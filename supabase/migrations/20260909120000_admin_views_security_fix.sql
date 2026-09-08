-- Cierra una fuga real detectada por el advisor de seguridad de Supabase
-- (6 sep 2026, "Datos de usuario expuestos a través de una vista"): las 5
-- vistas admin_* daban SELECT a 'authenticated', es decir CUALQUIER usuario
-- logueado de XPEAK (no solo admin) podía leerlas directamente vía la API
-- REST de Supabase, sin pasar por AdminGuard (que solo protege la UI de
-- React, no los datos). Exponían:
--   - admin_salud_sistema: email de usuarios en texto plano (JOIN a auth.users)
--   - admin_client_errors: user_agent y user_id de cualquier usuario con error
--   - admin_pending_bookings: requester_contact (tel/email de clientes)
--   - admin_activity / admin_perfiles_invisibles: datos de perfil sin filtrar
--
-- Mismo patrón que ya se corrigió el 1 sep 2026 (fuga de emails a anon,
-- GRANT de tabla en vez de columna) pero en un sitio nuevo que se coló
-- después vía SQL Editor sin pasar por una migración versionada.
--
-- Solución: mismo patrón que panel_analytics_* — la vista base sigue viva
-- para uso interno, pero solo accesible por funciones SECURITY DEFINER que
-- comprueban es_admin() antes de devolver una fila.

REVOKE SELECT ON public.admin_activity FROM authenticated;
REVOKE SELECT ON public.admin_client_errors FROM authenticated;
REVOKE SELECT ON public.admin_pending_bookings FROM authenticated;
REVOKE SELECT ON public.admin_perfiles_invisibles FROM authenticated;
REVOKE SELECT ON public.admin_salud_sistema FROM authenticated;

CREATE OR REPLACE FUNCTION public.panel_admin_activity()
RETURNS TABLE (
  tipo text, cuando timestamptz, quien text, detalle text, lugar text,
  contacto text, ref text, pendiente boolean
)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.es_admin() THEN RAISE EXCEPTION 'Solo admin'; END IF;
  RETURN QUERY SELECT * FROM public.admin_activity;
END;
$function$;

CREATE OR REPLACE FUNCTION public.panel_admin_client_errors()
RETURNS TABLE (
  id uuid, message text, url text, user_agent text, user_id uuid,
  created_at timestamptz, veces_visto_este_mensaje bigint
)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.es_admin() THEN RAISE EXCEPTION 'Solo admin'; END IF;
  RETURN QUERY SELECT * FROM public.admin_client_errors;
END;
$function$;

CREATE OR REPLACE FUNCTION public.panel_admin_pending_bookings()
RETURNS TABLE (
  id uuid, requester_name text, requester_contact text, professional_name text,
  professional_user_id uuid, event_date text, event_location text,
  event_description text, created_at timestamptz, reminder_sent_at timestamptz,
  horas_esperando numeric
)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.es_admin() THEN RAISE EXCEPTION 'Solo admin'; END IF;
  RETURN QUERY SELECT * FROM public.admin_pending_bookings;
END;
$function$;

CREATE OR REPLACE FUNCTION public.panel_admin_perfiles_invisibles()
RETURNS TABLE (
  user_id uuid, display_name text, role text, zone text, created_at timestamptz,
  sin_foto boolean, sin_ciudad_real boolean
)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.es_admin() THEN RAISE EXCEPTION 'Solo admin'; END IF;
  RETURN QUERY SELECT * FROM public.admin_perfiles_invisibles;
END;
$function$;

CREATE OR REPLACE FUNCTION public.panel_admin_salud_sistema()
RETURNS TABLE (
  tipo text, severidad text, asunto text, detalle text, cuando timestamptz, clave text
)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.es_admin() THEN RAISE EXCEPTION 'Solo admin'; END IF;
  RETURN QUERY SELECT * FROM public.admin_salud_sistema;
END;
$function$;

REVOKE EXECUTE ON FUNCTION public.panel_admin_activity() FROM anon;
REVOKE EXECUTE ON FUNCTION public.panel_admin_client_errors() FROM anon;
REVOKE EXECUTE ON FUNCTION public.panel_admin_pending_bookings() FROM anon;
REVOKE EXECUTE ON FUNCTION public.panel_admin_perfiles_invisibles() FROM anon;
REVOKE EXECUTE ON FUNCTION public.panel_admin_salud_sistema() FROM anon;

GRANT EXECUTE ON FUNCTION public.panel_admin_activity() TO authenticated;
GRANT EXECUTE ON FUNCTION public.panel_admin_client_errors() TO authenticated;
GRANT EXECUTE ON FUNCTION public.panel_admin_pending_bookings() TO authenticated;
GRANT EXECUTE ON FUNCTION public.panel_admin_perfiles_invisibles() TO authenticated;
GRANT EXECUTE ON FUNCTION public.panel_admin_salud_sistema() TO authenticated;
