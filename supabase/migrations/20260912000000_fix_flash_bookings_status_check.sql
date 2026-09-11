-- flash_bookings estaba completamente vacía (0 filas) en producción. Causa:
-- esta constraint solo permitía 'open','accepted','rejected','closed','pending',
-- pero SolicitudesTab.tsx (aceptar solicitud) y HistorialTab.tsx (marcar
-- completado/cancelado) escriben 'confirmed'/'completed'/'cancelled' — los
-- mismos valores que ya leen AdminMetrics, GastosTab, HistorialTab,
-- PublicProfile y la RLS de reviews. Cualquier intento de aceptar un Flash
-- Booking fallaba en silencio contra este CHECK. Se amplía sin quitar los
-- valores antiguos (compatibilidad con código/documentación que aún los
-- mencione).
ALTER TABLE public.flash_bookings DROP CONSTRAINT flash_bookings_status_check;
ALTER TABLE public.flash_bookings ADD CONSTRAINT flash_bookings_status_check
  CHECK (status IS NULL OR status = ANY (ARRAY['open','accepted','rejected','closed','pending','confirmed','completed','cancelled']));
