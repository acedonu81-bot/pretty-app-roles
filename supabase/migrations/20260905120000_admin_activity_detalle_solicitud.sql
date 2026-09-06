-- La linea de una solicitud en el panel no decia QUE se pedia.
--
-- Se veian cinco lineas identicas "Ramon - sin responder - Valencia": el
-- campo `detalle` se gastaba en repetir el estado, que ya lo dice la etiqueta
-- roja de al lado, y el rol pedido, la fecha del evento y el texto del cliente
-- no se seleccionaban pese a estar guardados en flash_bookings desde el
-- principio (professional_role, event_date, event_description).
--
-- Sin eso hay que abrir la BD para saber si Ramon queria un camarero para el
-- sabado o un DJ para diciembre, que es justo lo que el panel venia a evitar.
-- Se anaden dos columnas al final para no romper a quien ya lee la vista.

DROP VIEW IF EXISTS public.admin_activity;

CREATE VIEW public.admin_activity AS

-- Altas de profesionales
SELECT
  'alta'::text            AS tipo,
  p.created_at            AS cuando,
  COALESCE(p.display_name, 'Sin nombre') AS quien,
  p.role                  AS detalle,
  COALESCE(p.zone, '—')   AS lugar,
  NULL::text              AS contacto,
  p.user_id::text         AS ref,
  CASE WHEN p.admin_seen_at IS NULL THEN true ELSE false END AS pendiente,
  NULL::text              AS que_pide,
  NULL::text              AS cuando_evento
FROM public.profiles p
WHERE p.is_seed = false

UNION ALL

-- Solicitudes de reserva (Flash Booking)
SELECT
  CASE WHEN b.status = 'pending' THEN 'solicitud_pendiente' ELSE 'solicitud' END,
  b.created_at,
  COALESCE(NULLIF(trim(b.requester_name), ''), 'Cliente sin nombre'),
  -- `detalle` pasa a decir a quien se pidio y de que rol. El estado ya lo
  -- comunica el color de la fila y la etiqueta "sin responder".
  COALESCE(NULLIF(trim(b.professional_name), ''), 'un profesional')
    || COALESCE(' (' || NULLIF(trim(b.professional_role), '') || ')', ''),
  COALESCE(NULLIF(trim(b.event_location), ''), '—'),
  b.requester_contact,
  b.id::text,
  (b.status = 'pending'),
  -- Lo que el cliente escribio, recortado: la linea es un resumen, el detalle
  -- entero se ve al abrir la solicitud.
  CASE
    WHEN length(trim(COALESCE(b.event_description, ''))) > 120
      THEN left(trim(b.event_description), 117) || '…'
    ELSE NULLIF(trim(b.event_description), '')
  END,
  NULLIF(trim(b.event_date), '')
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
  (d.acknowledged IS NOT TRUE),
  NULL,
  NULL
FROM public.profile_deletions d

UNION ALL

-- Resenas publicadas
SELECT
  'resena',
  r.created_at,
  COALESCE(NULLIF(trim(r.reviewer_name), ''), 'Anónimo'),
  r.rating::text || ' estrellas',
  '—',
  NULL,
  r.id::text,
  (r.approved IS NOT TRUE),
  NULL,
  NULL
FROM public.reviews r

ORDER BY cuando DESC;

COMMENT ON VIEW public.admin_activity IS
  'Línea temporal unificada de todo lo que pasa en XPEAK: altas, solicitudes, bajas y reseñas. Alimenta la pestaña Actividad del panel de admin. pendiente=true marca lo que requiere una acción. que_pide/cuando_evento solo vienen informados en las solicitudes.';

REVOKE ALL ON public.admin_activity FROM anon, authenticated;
GRANT SELECT ON public.admin_activity TO authenticated;
