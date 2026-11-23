-- Fundadores solo con foto y aprobados (23 nov 2026, decisión de Daniel el 22 nov).
--
-- Antes activar_lanzamiento_redes() marcaba como fundador a todo perfil de oficio
-- creado antes del lanzamiento (167 el 22 nov). Un año de Profesional gratis es
-- para quien ya tiene un perfil presentable: mínimo, foto de perfil y aprobado
-- (110 el 22 nov). El resto queda en el nivel base y puede subir de nivel.
-- Todo lo demás de la función es igual que antes.

CREATE OR REPLACE FUNCTION public.activar_lanzamiento_redes(p_fecha timestamp with time zone)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE n integer;
BEGIN
  IF auth.uid() IS NOT NULL AND NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Solo admin';
  END IF;
  UPDATE public.cobros_config SET lanzamiento = p_fecha;
  INSERT INTO public.redes_fundadores (profile_id, hasta)
  SELECT p.id, p_fecha + interval '1 year'
    FROM public.profiles p
   WHERE p.created_at < p_fecha
     AND p.role IS NOT NULL
     AND p.role NOT IN ('pending', 'empresario', 'particular', 'local_eventos', 'event_manager', 'organizador')
     AND NOT p.is_seed AND NOT p.is_seed_profile
     AND p.validation_status = 'approved'
     AND NULLIF(trim(p.photo_url), '') IS NOT NULL
  ON CONFLICT (profile_id) DO NOTHING;
  GET DIAGNOSTICS n = ROW_COUNT;
  PERFORM public.republicar_redes();
  RETURN n;
END;
$function$;
