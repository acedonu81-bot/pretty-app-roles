-- Rol nuevo 'food-truck' (slug público igual: /directorio/food-truck,
-- /contratar-food-truck). Hasta ahora los food trucks se daban de alta como
-- catering con la etiqueta "Food truck".
--
-- APLICAR JUNTO CON EL DEPLOY: el código en producción anterior no conoce
-- 'food-truck', así que mover los perfiles antes los deja sin directorio.

-- 1. Flash Booking: la etiqueta del formulario avisa a los food trucks.
--    Espejo de ROL_UI_A_SLUG (src/lib/constants.ts).
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

-- 2. Perfiles de catering que en realidad son food trucks pasan al rol nuevo.
--    La etiqueta "Food truck" sobra ahora (es el propio oficio): se cambia por
--    su especialidad.
UPDATE public.profiles
   SET role = 'food-truck',
       roles = ARRAY['food-truck'],
       genres = ARRAY['Hamburguesas gourmet']
 WHERE id = '058f0fd2-61d7-4973-a658-d633cd0e3f56'   -- Vulcano Grill
   AND role = 'catering';

UPDATE public.profiles
   SET role = 'food-truck',
       roles = ARRAY['food-truck'],
       genres = ARRAY['Cocina argentina']
 WHERE id = '11f660ef-661f-4767-9a1a-7c54ff13a6ca'   -- Gula, sabor argentino
   AND role = 'catering';

-- 3. All i Menta hace catering, chef a domicilio Y food truck: sigue con
--    catering como oficio principal y suma food truck como secundario.
UPDATE public.profiles
   SET roles = ARRAY['catering','food-truck'],
       genres = array_remove(genres, 'Food truck')
 WHERE id = '82cad539-f1d5-47aa-a178-66fa7dd62303'   -- All i Menta
   AND role = 'catering';
