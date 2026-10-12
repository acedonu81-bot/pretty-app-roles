-- Rol disco-movil: sin esta entrada, una petición de Flash Booking marcada
-- "Disco móvil" devuelve NULL y no avisa a ningún profesional.
CREATE OR REPLACE FUNCTION public.flash_rol_ui_a_roles(p_label text)
 RETURNS text[]
 LANGUAGE sql
 IMMUTABLE
 SET search_path TO 'public'
AS $function$
  SELECT CASE lower(trim(p_label))
    WHEN 'dj / artista'         THEN ARRAY['dj']
    WHEN 'fotógrafo'            THEN ARRAY['media']
    WHEN 'camarero / staff'     THEN ARRAY['staff','camarero']
    WHEN 'maquilladora'         THEN ARRAY['makeup','peluqueria']
    WHEN 'grupo musical'        THEN ARRAY['grupo-musical']
    WHEN 'disco móvil'          THEN ARRAY['disco-movil','dj']
    WHEN 'animador'             THEN ARRAY['animador']
    WHEN 'promotor / rrpp'      THEN ARRAY['promotor']
    WHEN 'photo booth'          THEN ARRAY['photo-booth']
    WHEN 'catering'             THEN ARRAY['catering']
    WHEN 'food truck'           THEN ARRAY['food-truck']
    WHEN 'técnico de sonido'    THEN ARRAY['tecnico']
    WHEN 'alquiler de equipos'  THEN ARRAY['alquiler']
    ELSE NULL
  END
$function$;
