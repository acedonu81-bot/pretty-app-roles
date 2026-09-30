-- Los avisos al organizador mostraban la fecha en ISO ("2026-10-20"). Mismo
-- formato que notify_new_flash_booking: "20 de octubre". Texto libre se deja tal cual.
CREATE OR REPLACE FUNCTION public.fecha_legible(p text)
RETURNS text LANGUAGE plpgsql IMMUTABLE AS $$
BEGIN
  IF NULLIF(trim(p), '') IS NULL OR trim(p) = 'Por confirmar' THEN RETURN NULL; END IF;
  IF trim(p) ~ '^\d{4}-\d{2}-\d{2}$' THEN
    RETURN extract(day from trim(p)::date)::int::text || ' de ' || (ARRAY['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'])[extract(month from trim(p)::date)::int];
  END IF;
  RETURN trim(p);
EXCEPTION WHEN OTHERS THEN RETURN trim(p);
END $$;

DO $mig$
DECLARE d text;
BEGIN
  d := pg_get_functiondef('public.avisar_organizador_estado_reserva'::regproc);
  d := replace(d, $x$COALESCE(' el ' || NULLIF(NULLIF(trim(NEW.event_date), ''), 'Por confirmar'), '')$x$, $x$COALESCE(' el ' || public.fecha_legible(NEW.event_date), '')$x$);
  d := replace(d, $x$COALESCE(' para el ' || NULLIF(NULLIF(trim(NEW.event_date), ''), 'Por confirmar'), '')$x$, $x$COALESCE(' para el ' || public.fecha_legible(NEW.event_date), '')$x$);
  IF position('fecha_legible' IN d) = 0 THEN RAISE EXCEPTION 'patrón no encontrado'; END IF;
  EXECUTE d;
END
$mig$;
