-- Organizadores (13 nov 2026, 2): la tarjeta deja de enseñar "Aún sin contrataciones" y, si no hay,
-- enseña "Se unió en <mes año>". Añade la columna desde (fecha de alta del perfil).

DROP FUNCTION IF EXISTS public.organizadores_visibles();

CREATE FUNCTION public.organizadores_visibles()
RETURNS TABLE(user_id uuid, nombre text, logo text, ciudad text, descripcion text, contrataciones bigint, ofertas_activas bigint, desde timestamptz)
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
         public.organizador_contrataciones(p.user_id),
         (SELECT count(*) FROM public.event_requests er
           WHERE er.client_user_id = p.user_id::text
             AND er.status = 'open'
             AND er.expires_at > now()),
         p.created_at
    FROM public.profiles p
   WHERE p.role::text = 'empresario'
     AND p.mostrar_organizador
     AND p.validation_status = 'approved'
     AND NOT p.is_seed
     AND p.user_id <> 'b8c47c26-33bd-41d7-a869-ba6fa2d22667'::uuid  -- cuenta oficial XPEAK
   ORDER BY 7 DESC, 6 DESC, 2;
END;
$function$;
REVOKE ALL ON FUNCTION public.organizadores_visibles() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.organizadores_visibles() TO authenticated;
