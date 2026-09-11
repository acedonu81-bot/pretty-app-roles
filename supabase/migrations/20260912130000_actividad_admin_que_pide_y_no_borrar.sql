-- "Sala Aurora Eventos" no aparecía en el feed de Actividad del admin, y
-- cuando aparecía no decía qué pedía el cliente ni para cuándo. Dos bugs:
--
-- 1. admin_activity (vista) nunca exponía event_description/event_date de
--    flash_bookings, aunque el frontend (AdminActivity.tsx) ya sabe pintar
--    "que_pide" y "cuando_evento" desde hace tiempo — solo le llegaban null.
--    Mismo patrón que el fix de campana/push de esta misma sesión, un
--    quinto sitio con el hueco del caso Ramón.
--
-- 2. El botón "Borrar del historial" del feed llama a admin_borrar_actividad,
--    que hacía DELETE físico sobre flash_bookings (y las demás tablas de
--    origen). Eso no solo la quita del feed: borra la fila real, y con ella
--    el mensaje del cliente desaparece TAMBIÉN del email, del historial del
--    empresario y de cualquier sitio que la lea. Así fue como se perdió el
--    rastro de Sala Aurora — alguien pulsó la X para limpiar el feed.
--
-- Ahora "borrar" es "ocultar para el admin que lo pulsó", igual que ya
-- funciona admin_alertas_descartadas para admin_salud_sistema.

CREATE TABLE IF NOT EXISTS public.admin_actividad_ocultada (
  clave          text PRIMARY KEY,
  ocultada_por   uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ocultada_at    timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.admin_actividad_ocultada IS
  'Filas del feed de Actividad que un admin quitó de su vista. La clave es tipo||ref. No borra el dato de origen — antes admin_borrar_actividad hacía DELETE físico y así se perdió el detalle de la solicitud de Sala Aurora (12 sep 2026).';

ALTER TABLE public.admin_actividad_ocultada ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins gestionan ocultos" ON public.admin_actividad_ocultada;
CREATE POLICY "Admins gestionan ocultos"
ON public.admin_actividad_ocultada FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'));

REVOKE ALL ON public.admin_actividad_ocultada FROM anon;

CREATE OR REPLACE VIEW public.admin_activity AS
SELECT * FROM (
  SELECT 'alta'::text AS tipo,
    p.created_at AS cuando,
    COALESCE(p.display_name, 'Sin nombre'::text) AS quien,
    p.role AS detalle,
    COALESCE(p.zone, '—'::text) AS lugar,
    NULL::text AS contacto,
    p.user_id::text AS ref,
    CASE WHEN p.admin_seen_at IS NULL THEN true ELSE false END AS pendiente,
    NULL::text AS que_pide,
    NULL::text AS cuando_evento
  FROM profiles p
  WHERE p.is_seed = false

  UNION ALL
  SELECT
    CASE WHEN b.status = 'pending'::text THEN 'solicitud_pendiente'::text ELSE 'solicitud'::text END AS tipo,
    b.created_at AS cuando,
    COALESCE(NULLIF(TRIM(BOTH FROM b.requester_name), ''::text), 'Cliente sin nombre'::text) AS quien,
    CASE
      WHEN b.status = 'pending'::text THEN 'sin responder'::text
      WHEN b.status = 'accepted'::text THEN 'aceptada'::text
      WHEN b.status = 'declined'::text THEN 'rechazada'::text
      WHEN b.status = 'rejected'::text THEN 'rechazada'::text
      ELSE COALESCE(b.status, 'desconocido'::text)
    END AS detalle,
    COALESCE(NULLIF(TRIM(BOTH FROM b.event_location), ''::text), '—'::text) AS lugar,
    b.requester_contact AS contacto,
    b.id::text AS ref,
    b.status = 'pending'::text AS pendiente,
    NULLIF(TRIM(BOTH FROM b.event_description), '') AS que_pide,
    NULLIF(TRIM(BOTH FROM b.event_date), '') AS cuando_evento
  FROM flash_bookings b

  UNION ALL
  SELECT 'baja'::text AS tipo,
    d.deleted_at AS cuando,
    COALESCE(d.role, 'profesional'::text) || COALESCE(' de '::text || d.zone, ''::text) AS quien,
    COALESCE(d.exit_reason, 'sin motivo'::text) AS detalle,
    COALESCE(d.zone, '—'::text) AS lugar,
    NULL::text AS contacto,
    d.id::text AS ref,
    d.acknowledged IS NOT TRUE AS pendiente,
    NULL::text AS que_pide,
    NULL::text AS cuando_evento
  FROM profile_deletions d

  UNION ALL
  SELECT 'resena'::text AS tipo,
    r.created_at AS cuando,
    COALESCE(NULLIF(TRIM(BOTH FROM r.reviewer_name), ''::text), 'Anónimo'::text) AS quien,
    r.rating::text || ' estrellas'::text AS detalle,
    '—'::text AS lugar,
    NULL::text AS contacto,
    r.id::text AS ref,
    r.approved IS NOT TRUE AS pendiente,
    NULL::text AS que_pide,
    NULL::text AS cuando_evento
  FROM reviews r

  UNION ALL
  SELECT 'oferta_evento'::text AS tipo,
    e.created_at AS cuando,
    COALESCE(NULLIF(TRIM(BOTH FROM e.client_name), ''::text), 'Organizador sin nombre'::text) AS quien,
    (((COALESCE(NULLIF(array_to_string(e.roles_needed, ', '::text), ''::text), 'sin rol'::text) || COALESCE((' · hasta '::text || e.budget_max) || '€'::text, ''::text)) || ' · '::text) || COALESCE((SELECT count(*)::text FROM event_request_responses er WHERE er.request_id = e.id), '0'::text)) || ' interesados'::text AS detalle,
    COALESCE(NULLIF(TRIM(BOTH FROM e.city), ''::text), '—'::text) AS lugar,
    COALESCE(e.contact_phone, e.contact_email) AS contacto,
    e.id::text AS ref,
    e.status = 'open'::text AND e.expires_at > now() AND NOT (EXISTS (SELECT 1 FROM event_request_responses er WHERE er.request_id = e.id)) AS pendiente,
    NULLIF(TRIM(BOTH FROM e.description), '') AS que_pide,
    NULLIF(TRIM(BOTH FROM e.event_date), '') AS cuando_evento
  FROM event_requests e

  UNION ALL
  SELECT 'oferta_flash'::text AS tipo,
    j.created_at AS cuando,
    COALESCE(NULLIF(TRIM(BOTH FROM pj.display_name), ''::text), 'Organizador'::text) AS quien,
    COALESCE(NULLIF(TRIM(BOTH FROM j.title), ''::text), 'sin título'::text) || COALESCE(' · '::text || j.pay, ''::text) AS detalle,
    COALESCE(NULLIF(TRIM(BOTH FROM j.location), ''::text), '—'::text) AS lugar,
    NULL::text AS contacto,
    j.id::text AS ref,
    j.expires_at > now() AS pendiente,
    NULLIF(TRIM(BOTH FROM j.description), '') AS que_pide,
    NULL::text AS cuando_evento
  FROM flash_jobs j
  LEFT JOIN profiles pj ON pj.user_id = j.employer_id

  UNION ALL
  SELECT 'respuesta_oferta'::text AS tipo,
    er.created_at AS cuando,
    COALESCE(NULLIF(TRIM(BOTH FROM pr.display_name), ''::text), 'Profesional'::text) AS quien,
    ('se apuntó a la oferta de '::text || COALESCE(NULLIF(TRIM(BOTH FROM e2.client_name), ''::text), 'un organizador'::text)) || COALESCE((' — "'::text || "left"(er.message, 60)) || '"'::text, ''::text) AS detalle,
    COALESCE(NULLIF(TRIM(BOTH FROM e2.city), ''::text), '—'::text) AS lugar,
    NULL::text AS contacto,
    er.id::text AS ref,
    er.hired_at IS NULL AND e2.status = 'open'::text AS pendiente,
    NULLIF(TRIM(BOTH FROM er.message), '') AS que_pide,
    NULLIF(TRIM(BOTH FROM e2.event_date), '') AS cuando_evento
  FROM event_request_responses er
  JOIN event_requests e2 ON e2.id = er.request_id
  LEFT JOIN profiles pr ON pr.user_id = er.professional_user_id

  UNION ALL
  SELECT 'contratacion'::text AS tipo,
    er2.hired_at AS cuando,
    COALESCE(NULLIF(TRIM(BOTH FROM pr2.display_name), ''::text), 'Profesional'::text) AS quien,
    'CONTRATADO por '::text || COALESCE(NULLIF(TRIM(BOTH FROM e3.client_name), ''::text), 'un organizador'::text) AS detalle,
    COALESCE(NULLIF(TRIM(BOTH FROM e3.city), ''::text), '—'::text) AS lugar,
    NULL::text AS contacto,
    er2.id::text AS ref,
    false AS pendiente,
    NULL::text AS que_pide,
    NULLIF(TRIM(BOTH FROM e3.event_date), '') AS cuando_evento
  FROM event_request_responses er2
  JOIN event_requests e3 ON e3.id = er2.request_id
  LEFT JOIN profiles pr2 ON pr2.user_id = er2.professional_user_id
  WHERE er2.hired_at IS NOT NULL
) act
WHERE NOT EXISTS (
  SELECT 1 FROM public.admin_actividad_ocultada o WHERE o.clave = act.tipo || act.ref
)
ORDER BY cuando DESC;

REVOKE ALL ON public.admin_activity FROM anon, authenticated;

-- DROP necesario: Postgres no permite CREATE OR REPLACE cuando cambia el
-- tipo de retorno (aquí, las dos columnas nuevas).
DROP FUNCTION IF EXISTS public.panel_admin_activity();

CREATE FUNCTION public.panel_admin_activity()
RETURNS TABLE(tipo text, cuando timestamp with time zone, quien text, detalle text, lugar text, contacto text, ref text, pendiente boolean, que_pide text, cuando_evento text)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.es_admin() THEN RAISE EXCEPTION 'Solo admin'; END IF;
  RETURN QUERY SELECT * FROM public.admin_activity;
END;
$function$;

CREATE OR REPLACE FUNCTION public.admin_borrar_actividad(p_tipo text, p_ref text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.es_admin() THEN
    RAISE EXCEPTION 'Solo un administrador puede ocultar actividad';
  END IF;

  IF p_tipo = 'alta' THEN
    RAISE EXCEPTION 'Las altas se gestionan desde Usuarios, no desde Actividad';
  END IF;

  INSERT INTO public.admin_actividad_ocultada (clave, ocultada_por)
  VALUES (p_tipo || p_ref, auth.uid())
  ON CONFLICT (clave) DO NOTHING;

  RETURN true;
END;
$function$;
