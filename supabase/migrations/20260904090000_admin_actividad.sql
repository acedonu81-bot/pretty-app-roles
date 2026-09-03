-- Registro unificado de actividad para el panel de admin.
--
-- "Ahora que estamos empezando necesito saber cada movimiento de cada cosa"
-- (usuario, 4 sep 2026). Hasta ahora cada tipo de suceso vivía en su tabla y
-- había que ir a buscarlo: por eso la solicitud de Ramón (22 ago) estuvo 12
-- días sin que nadie la viera. Esta vista los pone todos en una sola línea
-- temporal, ordenada por fecha.
--
-- Es una VISTA, no una tabla de log: no duplica datos ni hay que mantenerla
-- sincronizada, y cualquier suceso que ya se guarde aparece aquí solo. El coste
-- es un UNION sobre tablas pequeñas — con el volumen actual (decenas de filas)
-- es instantáneo, y si algún día crece se materializa.

CREATE OR REPLACE VIEW public.admin_activity AS

-- Altas de profesionales
SELECT
  'alta'::text            AS tipo,
  p.created_at            AS cuando,
  COALESCE(p.display_name, 'Sin nombre') AS quien,
  p.role                  AS detalle,
  COALESCE(p.zone, '—')   AS lugar,
  NULL::text              AS contacto,
  p.user_id::text         AS ref,
  CASE WHEN p.admin_seen_at IS NULL THEN true ELSE false END AS pendiente
FROM public.profiles p
WHERE p.is_seed = false

UNION ALL

-- Solicitudes de reserva (Flash Booking)
SELECT
  CASE WHEN b.status = 'pending' THEN 'solicitud_pendiente' ELSE 'solicitud' END,
  b.created_at,
  COALESCE(NULLIF(trim(b.requester_name), ''), 'Cliente sin nombre'),
  CASE
    WHEN b.status = 'pending'  THEN 'sin responder'
    WHEN b.status = 'accepted' THEN 'aceptada'
    WHEN b.status = 'declined' THEN 'rechazada'
    WHEN b.status = 'rejected' THEN 'rechazada'
    ELSE COALESCE(b.status, 'desconocido')
  END,
  COALESCE(NULLIF(trim(b.event_location), ''), '—'),
  b.requester_contact,
  b.id::text,
  (b.status = 'pending')
FROM public.flash_bookings b

UNION ALL

-- Bajas de cuenta
-- profile_deletions no guarda el nombre a proposito (RGPD: el log de bajas
-- conserva metricas, no identidad). Se describe por rol y zona.
SELECT
  'baja',
  d.deleted_at,
  COALESCE(d.role, 'profesional') || COALESCE(' de ' || d.zone, ''),
  COALESCE(d.exit_reason, 'sin motivo'),
  COALESCE(d.zone, '—'),
  NULL,
  d.id::text,
  (d.acknowledged IS NOT TRUE)
FROM public.profile_deletions d

UNION ALL

-- Reseñas publicadas
SELECT
  'resena',
  r.created_at,
  COALESCE(NULLIF(trim(r.reviewer_name), ''), 'Anónimo'),
  r.rating::text || ' estrellas',
  '—',
  NULL,
  r.id::text,
  (r.approved IS NOT TRUE)
FROM public.reviews r

ORDER BY cuando DESC;

COMMENT ON VIEW public.admin_activity IS
  'Línea temporal unificada de todo lo que pasa en XPEAK: altas, solicitudes, bajas y reseñas. Alimenta la pestaña Actividad del panel de admin. pendiente=true marca lo que requiere una acción.';

REVOKE ALL ON public.admin_activity FROM anon, authenticated;
GRANT SELECT ON public.admin_activity TO authenticated;
