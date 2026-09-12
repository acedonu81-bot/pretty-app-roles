-- Auditoría del panel admin (12 sep 2026): el "Limpiar todo" del 4 sep
-- descartó de una vez 21 perfiles reales marcados como 'perfil_invisible'
-- (sin foto o sin zona real). La clave de descarte es 'perfil_invisible|' ||
-- user_id, fija mientras exista ese usuario — así que esos 21 perfiles NUNCA
-- volverán a alertar aunque sigan sin foto/zona semanas después, aunque el
-- panel de Salud siga mostrando "Todo en orden".
--
-- Para crash_cliente y alta_sin_volver el descarte permanente tiene sentido
-- (un crash arreglado no vuelve solo; un alta que nunca volvió no cambia de
-- estado sola). Para perfil_invisible NO: el usuario puede arreglarlo en
-- cualquier momento, y si no lo hace, el admin necesita que se lo recuerden
-- de vez en cuando, no que se calle para siempre con un solo clic.
--
-- Se añade columna admin_alertas_descartadas.reevaluar_en (NULL = permanente,
-- como hasta ahora) y la vista solo respeta el descarte de perfil_invisible
-- si reevaluar_en aún no ha pasado. Los descartes YA existentes de este tipo
-- se reprograman a 7 días desde ahora en vez de reactivarse todos de golpe
-- (evita una alarma masiva instantánea de 21 alertas a la vez).
ALTER TABLE public.admin_alertas_descartadas
  ADD COLUMN IF NOT EXISTS reevaluar_en timestamptz;

UPDATE public.admin_alertas_descartadas
SET reevaluar_en = now() + interval '7 days'
WHERE clave LIKE 'perfil_invisible|%' AND reevaluar_en IS NULL;

CREATE OR REPLACE VIEW public.admin_salud_sistema AS
SELECT * FROM (

SELECT
  'cron_parado'::text AS tipo,
  'critico'::text     AS severidad,
  j.jobname           AS asunto,
  'Última ejecución: ' || COALESCE(to_char(ult.ultima, 'DD/MM HH24:MI'), 'NUNCA')
    || CASE WHEN ult.ultima IS NOT NULL
            THEN ' (hace ' || EXTRACT(DAY FROM now() - ult.ultima)::int || ' días)'
            ELSE '' END AS detalle,
  ult.ultima          AS cuando,
  'cron_parado|' || j.jobname AS clave
FROM cron.job j
LEFT JOIN LATERAL (
  SELECT max(start_time) AS ultima FROM cron.job_run_details d WHERE d.jobid = j.jobid
) ult ON true
WHERE j.active AND j.jobname LIKE 'xpeak%'
  AND (ult.ultima IS NULL OR ult.ultima < now() - interval '48 hours')

UNION ALL

SELECT
  'cron_fallido', 'critico', j.jobname,
  'Falló: ' || COALESCE(left(d.return_message, 120), 'sin mensaje'),
  d.start_time,
  'cron_fallido|' || j.jobname || '|' || to_char(d.start_time, 'YYYYMMDDHH24MI')
FROM cron.job_run_details d
JOIN cron.job j ON j.jobid = d.jobid
WHERE d.status <> 'succeeded'
  AND d.start_time > now() - interval '7 days'
  AND j.jobname LIKE 'xpeak%'

UNION ALL

SELECT
  'crash_cliente', 'critico',
  left(e.message, 80),
  'En ' || COALESCE(e.url, '?') || ' · ' || count(*) OVER (PARTITION BY e.message) || ' vez/veces',
  e.created_at,
  'crash_cliente|' || left(e.message, 80)
FROM public.client_errors e
WHERE e.created_at > now() - interval '7 days'

UNION ALL

SELECT
  'solicitud_sin_responder', 'alto',
  COALESCE(NULLIF(trim(b.requester_name), ''), 'Cliente'),
  'Sin responder hace ' || (EXTRACT(EPOCH FROM now() - b.created_at) / 3600)::int || 'h'
    || COALESCE(' · ' || b.requester_contact, ''),
  b.created_at,
  'solicitud_sin_responder|' || b.id::text
FROM public.flash_bookings b
WHERE b.status = 'pending'
  AND b.created_at > now() - interval '30 days'
  AND b.created_at < now() - interval '4 hours'
  AND COALESCE(b.source, '') <> 'test'
  AND COALESCE(b.requester_contact, '') NOT LIKE '%@xpeak-verify.internal'
  AND COALESCE(b.requester_contact, '') NOT LIKE '%@xpeak-test%'
  AND COALESCE(b.requester_name, '') NOT IN ('Final Test','V1','V2','Block Test','Single Test','Single','E','Verify2','MCP Test Verify')

UNION ALL

SELECT
  'perfil_invisible', 'medio',
  COALESCE(p.display_name, 'Sin nombre'),
  CASE
    WHEN (p.photo_url IS NULL OR length(p.photo_url) < 10)
     AND (p.zone IS NULL OR p.zone = 'España') THEN 'Sin foto y sin ciudad'
    WHEN (p.photo_url IS NULL OR length(p.photo_url) < 10) THEN 'Sin foto'
    ELSE 'Sin ciudad real'
  END,
  p.created_at,
  'perfil_invisible|' || p.user_id::text
FROM public.profiles p
WHERE p.is_seed = false
  AND p.role NOT IN ('empresario', 'pending')
  AND (p.photo_url IS NULL OR length(p.photo_url) < 10
       OR p.zone IS NULL OR p.zone = 'España' OR trim(p.zone) = '')

UNION ALL

SELECT
  'alta_sin_volver', 'medio',
  COALESCE(p.display_name, u.email),
  'Se registró y no ha vuelto (alta ' || to_char(p.created_at, 'DD/MM') || ')',
  p.created_at,
  'alta_sin_volver|' || p.user_id::text
FROM public.profiles p
JOIN auth.users u ON u.id = p.user_id
WHERE p.is_seed = false
  AND p.created_at < now() - interval '2 days'
  AND (u.last_sign_in_at IS NULL OR u.last_sign_in_at < p.created_at + interval '5 minutes')

) alertas
WHERE clave NOT IN (
  SELECT clave FROM public.admin_alertas_descartadas
  WHERE reevaluar_en IS NULL OR reevaluar_en > now()
)
ORDER BY
  CASE severidad WHEN 'critico' THEN 1 WHEN 'alto' THEN 2 ELSE 3 END,
  cuando DESC NULLS FIRST;

COMMENT ON VIEW public.admin_salud_sistema IS
  'Qué está fallando ahora mismo, excluyendo lo ya descartado. Vacía = sistema sano. Los descartes de perfil_invisible expiran a los 7 días (reevaluar_en); el resto de tipos se descarta para siempre, como hasta ahora.';

REVOKE ALL ON public.admin_salud_sistema FROM anon, authenticated;
GRANT SELECT ON public.admin_salud_sistema TO authenticated;
