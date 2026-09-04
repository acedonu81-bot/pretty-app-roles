-- "El espía": una sola vista que responde "¿qué está fallando ahora mismo?".
--
-- Hasta ahora cada problema vivía en su sitio y había que ir a buscarlo uno a
-- uno: los crons en cron.job_run_details, los crashes en client_errors, los
-- perfiles invisibles en su vista, las solicitudes sin responder en otra. Si
-- algo se rompía en silencio (como los 4 crons caídos 4 meses, o los emails
-- que nunca llegaban), nadie se enteraba hasta que el daño ya estaba hecho.
--
-- Cada fila es una alerta accionable con severidad. Si la vista sale vacía,
-- el sistema está sano — eso es lo que hace que mirarla valga la pena.
CREATE OR REPLACE VIEW public.admin_salud_sistema AS
SELECT * FROM (

-- ── Crons que deberían haber corrido y no lo han hecho ──────────────────────
-- Un cron caído no avisa: simplemente deja de pasar lo que tenía que pasar.
-- Es exactamente cómo se perdieron 4 meses de emails sin que nadie lo notara.
SELECT
  'cron_parado'::text AS tipo,
  'critico'::text     AS severidad,
  j.jobname           AS asunto,
  'Última ejecución: ' || COALESCE(to_char(ult.ultima, 'DD/MM HH24:MI'), 'NUNCA')
    || CASE WHEN ult.ultima IS NOT NULL
            THEN ' (hace ' || EXTRACT(DAY FROM now() - ult.ultima)::int || ' días)'
            ELSE '' END AS detalle,
  ult.ultima          AS cuando
FROM cron.job j
LEFT JOIN LATERAL (
  SELECT max(start_time) AS ultima FROM cron.job_run_details d WHERE d.jobid = j.jobid
) ult ON true
WHERE j.active
  AND j.jobname LIKE 'xpeak%'
  -- Margen de 48h: cubre los diarios sin dar falsos positivos por la ventana
  -- entre ejecuciones. Un cron cada 15 min que lleve 2 días parado es grave.
  AND (ult.ultima IS NULL OR ult.ultima < now() - interval '48 hours')

UNION ALL

-- ── Ejecuciones de cron que fallaron ────────────────────────────────────────
SELECT
  'cron_fallido', 'critico', j.jobname,
  'Falló: ' || COALESCE(left(d.return_message, 120), 'sin mensaje'),
  d.start_time
FROM cron.job_run_details d
JOIN cron.job j ON j.jobid = d.jobid
WHERE d.status <> 'succeeded'
  AND d.start_time > now() - interval '7 days'
  AND j.jobname LIKE 'xpeak%'

UNION ALL

-- ── Crashes de React en el navegador de usuarios reales ─────────────────────
SELECT
  'crash_cliente', 'critico',
  left(e.message, 80),
  'En ' || COALESCE(e.url, '?') || ' · ' || count(*) OVER (PARTITION BY e.message) || ' vez/veces',
  e.created_at
FROM public.client_errors e
WHERE e.created_at > now() - interval '7 days'

UNION ALL

-- ── Solicitudes de cliente sin responder ────────────────────────────────────
-- El caso Ramón: un cliente real pidió a 5 profesionales y nadie contestó en
-- 12 días. Aquí sale a las pocas horas.
SELECT
  'solicitud_sin_responder', 'alto',
  COALESCE(NULLIF(trim(b.requester_name), ''), 'Cliente'),
  -- EXTRACT(HOUR) da solo la parte horaria del intervalo (3 para "5 días y 3
  -- horas"), no el total: hay que sacarlo de los segundos.
  'Sin responder hace ' || (EXTRACT(EPOCH FROM now() - b.created_at) / 3600)::int || 'h'
    || COALESCE(' · ' || b.requester_contact, ''),
  b.created_at
FROM public.flash_bookings b
WHERE b.status = 'pending'
  AND b.created_at > now() - interval '30 days'
  AND b.created_at < now() - interval '4 hours'
  -- Fuera las pruebas técnicas: ensucian la señal y hacen que el espía deje
  -- de mirarse. 25 de las 30 pendientes son de las verificaciones del 13 ago.
  AND COALESCE(b.source, '') <> 'test'
  AND COALESCE(b.requester_contact, '') NOT LIKE '%@xpeak-verify.internal'
  AND COALESCE(b.requester_contact, '') NOT LIKE '%@xpeak-test%'
  AND COALESCE(b.requester_name, '') NOT IN ('Final Test','V1','V2','Block Test','Single Test','Single','E','Verify2','MCP Test Verify')

UNION ALL

-- ── Profesionales que no aparecen en ningún directorio de ciudad ────────────
SELECT
  'perfil_invisible', 'medio',
  COALESCE(p.display_name, 'Sin nombre'),
  CASE
    WHEN (p.photo_url IS NULL OR length(p.photo_url) < 10)
     AND (p.zone IS NULL OR p.zone = 'España') THEN 'Sin foto y sin ciudad'
    WHEN (p.photo_url IS NULL OR length(p.photo_url) < 10) THEN 'Sin foto'
    ELSE 'Sin ciudad real'
  END,
  p.created_at
FROM public.profiles p
WHERE p.is_seed = false
  AND p.role NOT IN ('empresario', 'pending')
  AND (p.photo_url IS NULL OR length(p.photo_url) < 10
       OR p.zone IS NULL OR p.zone = 'España' OR trim(p.zone) = '')

UNION ALL

-- ── Altas que nunca volvieron a entrar ──────────────────────────────────────
-- Señal temprana de que algo les echó: registro confuso, email que no llegó,
-- o simplemente que no encontraron valor. Vale la pena mirarlo uno a uno
-- mientras el volumen sea pequeño.
SELECT
  'alta_sin_volver', 'medio',
  COALESCE(p.display_name, u.email),
  'Se registró y no ha vuelto (alta ' || to_char(p.created_at, 'DD/MM') || ')',
  p.created_at
FROM public.profiles p
JOIN auth.users u ON u.id = p.user_id
WHERE p.is_seed = false
  AND p.created_at < now() - interval '2 days'
  AND (u.last_sign_in_at IS NULL OR u.last_sign_in_at < p.created_at + interval '5 minutes')

) alertas
ORDER BY
  CASE severidad WHEN 'critico' THEN 1 WHEN 'alto' THEN 2 ELSE 3 END,
  cuando DESC NULLS FIRST;

COMMENT ON VIEW public.admin_salud_sistema IS
  'Todo lo que está fallando ahora mismo, en un solo sitio: crons parados o con error, crashes de React en clientes reales, solicitudes sin responder, perfiles invisibles y altas que no volvieron. Vacía = sistema sano.';

REVOKE ALL ON public.admin_salud_sistema FROM anon, authenticated;
GRANT SELECT ON public.admin_salud_sistema TO authenticated;
