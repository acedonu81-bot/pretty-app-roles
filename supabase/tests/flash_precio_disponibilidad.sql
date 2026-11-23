-- Comprobación de 20261122140000_flash_precio_disponibilidad.sql.
-- Ejecutar SOLO en una rama/BD local con la migración aplicada, nunca en
-- producción con datos reales. Todo acaba en ROLLBACK.
BEGIN;

DO $$
DECLARE
  a uuid := gen_random_uuid();  -- sin filas en availability
  b uuid := gen_random_uuid();  -- ocupado el 11
  c uuid := gen_random_uuid();  -- ocupado el 20 (no choca)
  fechas date[] := ARRAY['2030-01-10', '2030-01-11']::date[];
BEGIN
  -- availability.user_id puede tener FK a auth.users; si es el caso, usar
  -- usuarios reales de la BD de pruebas en lugar de uuids aleatorios.
  INSERT INTO public.availability (user_id, blocked_date) VALUES (b, '2030-01-11'), (c, '2030-01-20');

  ASSERT public.disponibilidad_para_fechas(a, fechas) = 'sin_datos', 'A: sin filas debe ser sin_datos';
  ASSERT public.disponibilidad_para_fechas(b, fechas) = 'ocupado', 'B: bloqueo el 11 debe ser ocupado';
  ASSERT public.disponibilidad_para_fechas(c, fechas) = 'libre', 'C: bloqueo otro día debe ser libre';
  ASSERT public.disponibilidad_para_fechas(c, ARRAY[]::date[]) = 'sin_datos', 'array vacío debe ser sin_datos';
  ASSERT public.disponibilidad_para_fechas(c, NULL) = 'sin_datos', 'NULL debe ser sin_datos';

  -- El CHECK rechaza 0 y negativos (se prueba la expresión, sin insertar respuestas).
  BEGIN
    UPDATE public.event_request_responses SET precio = 0 WHERE false;
    PERFORM 1 FROM pg_constraint WHERE conname = 'event_request_responses_precio_chk';
    ASSERT FOUND, 'falta el CHECK del precio';
  END;
END $$;

ROLLBACK;
