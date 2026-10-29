-- Organizadores que eligen mostrarse a los profesionales (29 oct 2026).
-- Es opcional y empieza apagado: solo aparece quien lo activa en su panel. Los
-- profesionales ven logo, nombre, ciudad, una descripción corta y cuántas
-- contrataciones ha hecho en XPEAK. Nunca teléfono ni email: el contacto es
-- por el chat de la app. La cuenta de contrataciones usa la misma regla que
-- ultima_contratacion_publica: sin autocontratos (creador distinto del profesional).

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS mostrar_organizador boolean NOT NULL DEFAULT false;

-- Contrataciones reales de un organizador. Interna: sin permisos para el cliente.
CREATE OR REPLACE FUNCTION public.organizador_contrataciones(p_user uuid)
RETURNS bigint
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
  SELECT
    (SELECT count(*) FROM public.flash_bookings fb
      WHERE fb.created_by = p_user
        AND fb.status IN ('confirmed', 'completed')
        AND fb.professional_user_id IS NOT NULL
        AND fb.created_by <> fb.professional_user_id)
  + (SELECT count(*) FROM public.event_request_responses err
      JOIN public.event_requests er ON er.id = err.request_id
      WHERE er.client_user_id = p_user::text
        AND err.hired_at IS NOT NULL
        AND err.professional_user_id IS NOT NULL
        AND er.client_user_id <> err.professional_user_id::text);
$function$;
REVOKE ALL ON FUNCTION public.organizador_contrataciones(uuid) FROM PUBLIC, anon, authenticated;

-- Lo que ve un profesional. Empresarios y cuentas sin oficio elegido no ven la sección.
CREATE OR REPLACE FUNCTION public.organizadores_visibles()
RETURNS TABLE(user_id uuid, nombre text, logo text, ciudad text, descripcion text, contrataciones bigint)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Solo con sesión'; END IF;
  IF NOT (public.es_admin() OR EXISTS (
    SELECT 1 FROM public.profiles v
     WHERE v.user_id = auth.uid() AND v.role::text NOT IN ('empresario', 'pending')
  )) THEN
    RETURN;
  END IF;
  RETURN QUERY
  SELECT p.user_id,
         COALESCE(NULLIF(trim(p.display_name), ''), 'Empresa'),
         p.photo_url,
         NULLIF(NULLIF(trim(p.zone), ''), 'España'),
         left(NULLIF(trim(p.bio), ''), 160),
         public.organizador_contrataciones(p.user_id)
    FROM public.profiles p
   WHERE p.role::text = 'empresario'
     AND p.mostrar_organizador
     AND p.validation_status = 'approved'
     AND NOT p.is_seed
   ORDER BY 6 DESC, 2;
END;
$function$;
REVOKE ALL ON FUNCTION public.organizadores_visibles() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.organizadores_visibles() TO authenticated;

-- Para que la propia empresa vea su cifra en la vista previa.
CREATE OR REPLACE FUNCTION public.mis_contrataciones_organizador()
RETURNS bigint
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
  SELECT CASE WHEN auth.uid() IS NULL THEN 0 ELSE public.organizador_contrataciones(auth.uid()) END;
$function$;
REVOKE ALL ON FUNCTION public.mis_contrataciones_organizador() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.mis_contrataciones_organizador() TO authenticated;
