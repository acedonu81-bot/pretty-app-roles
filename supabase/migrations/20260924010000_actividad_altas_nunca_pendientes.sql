-- Actividad admin: las altas nunca cuentan como "pendiente".
--
-- Antes era pendiente mientras admin_seen_at fuera NULL, y lo único que lo
-- rellenaba era el banner verde de AdminNewProfileAlert, que solo aparece con
-- validation_status='pending'. Las altas aprobadas solas (23 sep 2026: Pablo
-- de Lago, Vulcano Grill x2) se quedaban en "Pendientes" para siempre sin que
-- ningún botón del panel pudiera quitarlas.
--
-- Decisión del admin (23 sep 2026): las altas no se aprueban, se revisan según
-- entran; para eso ya está la pestaña "Nuevo". "Pendiente" queda para lo que
-- de verdad espera acción: solicitudes sin responder, bajas, reseñas...
--
-- Se reescribe la vista a partir de su definición real en producción (tiene
-- más ramas que la última migración que la crea) cambiando solo esa columna.
-- CREATE OR REPLACE mantiene los GRANT (solo postgres/service_role).
DO $$
DECLARE
  def text := pg_get_viewdef('public.admin_activity'::regclass, true);
  viejo text := 'CASE
                    WHEN p.admin_seen_at IS NULL THEN true
                    ELSE false
                END AS pendiente';
BEGIN
  IF position(viejo IN def) = 0 THEN
    RAISE EXCEPTION 'admin_activity: no se encuentra la regla de pendiente de altas';
  END IF;
  EXECUTE 'CREATE OR REPLACE VIEW public.admin_activity AS '
    || replace(def, viejo, 'false AS pendiente');
END $$;
