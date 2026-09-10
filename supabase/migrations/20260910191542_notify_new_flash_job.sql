-- Una oferta Flash "a todos" no avisaba a nadie.
--
-- El 10 sep 2026 un empresario publicó una oferta desde el panel y no saltó
-- nada: ni campana del profesional, ni campana del admin, ni panel de admin.
-- Solo se veía entrando a mano a la pestaña Flash Booking.
--
-- Causa: flash_bookings (cliente → un profesional concreto) sí tenía todo el
-- sistema de avisos desde el caso Ramón, pero flash_jobs (empresario → oferta
-- abierta a todos) se quedó fuera. Su único trigger era el de rate limit.
--
-- Además hay DOS formularios que insertan en flash_jobs: el tab "Flash" del
-- panel de empresario (FlashTab, sí mandaba email pero no notificación) y el
-- tab "Demanda" de la vista Flash Booking (DemandaTab, no mandaba nada). Por
-- eso el aviso se pone en el trigger y no en el frontend: el trigger es el
-- único punto por el que pasan los dos caminos obligatoriamente.
--
-- SECURITY DEFINER porque quien inserta es el empresario, y no tiene (ni debe
-- tener) permiso para escribir notificaciones en la campana de otros usuarios.
CREATE OR REPLACE FUNCTION public.notify_new_flash_job()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_empresa text;
  v_cuerpo text;
  v_rol text;
  v_dest uuid;
  v_admin uuid;
  v_avisados int := 0;
BEGIN
  SELECT display_name INTO v_empresa
  FROM public.profiles WHERE user_id = NEW.employer_id;
  v_empresa := COALESCE(NULLIF(trim(v_empresa), ''), 'Un organizador');

  v_cuerpo := trim(both ' ' from
    v_empresa || ' busca ' || COALESCE(NULLIF(trim(NEW.role_needed), ''), 'profesionales')
    || CASE WHEN NULLIF(trim(NEW.location), '') IS NOT NULL
            THEN ' en ' || NEW.location ELSE '' END
    || CASE WHEN NULLIF(trim(NEW.pay), '') IS NOT NULL
            THEN ' · ' || NEW.pay ELSE '' END
  );

  v_rol := lower(trim(COALESCE(NEW.role_needed, '')));

  -- Destinatarios: profesionales cuyo rol encaja con lo que se busca. El campo
  -- role_needed es texto libre ("DJ", "camareros", "DJ Techno"), así que se
  -- compara en las dos direcciones. Si el organizador no especifica rol, se
  -- avisa a todos los profesionales: una oferta sin rol es justo la que nadie
  -- vería de otro modo, y son pocos usuarios todavía.
  FOR v_dest IN
    SELECT p.user_id FROM public.profiles p
    WHERE p.user_id IS NOT NULL
      AND p.user_id <> NEW.employer_id
      AND p.role NOT IN ('empresario', 'pending')
      AND p.is_seed_profile IS DISTINCT FROM TRUE
      AND (
        v_rol = ''
        OR lower(p.role) LIKE '%' || v_rol || '%'
        OR v_rol LIKE '%' || lower(p.role) || '%'
      )
  LOOP
    INSERT INTO public.notifications (user_id, type, title, body, link)
    VALUES (
      v_dest, 'flash_job', 'Nueva oferta Flash para ti',
      v_cuerpo, '/dashboard?view=flashbooking'
    );
    v_avisados := v_avisados + 1;
  END LOOP;

  -- Al admin siempre, aunque no encaje ningún profesional: ese caso (oferta
  -- publicada que no llega a nadie) es precisamente el que hay que ver.
  FOR v_admin IN SELECT user_id FROM public.user_roles WHERE role = 'admin' LOOP
    INSERT INTO public.notifications (user_id, type, title, body, link)
    VALUES (
      v_admin, 'admin_flash_job', 'Oferta Flash nueva de un organizador',
      v_cuerpo || ' — ' || v_avisados || ' profesional(es) avisados',
      '/dashboard?view=flashbooking'
    );
  END LOOP;

  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS notify_new_flash_job_trigger ON public.flash_jobs;
CREATE TRIGGER notify_new_flash_job_trigger
  AFTER INSERT ON public.flash_jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_flash_job();

-- Vista para el panel de admin: ofertas Flash vivas y a cuánta gente llegaron.
CREATE OR REPLACE VIEW public.admin_active_flash_jobs AS
SELECT
  j.id,
  j.employer_id,
  p.display_name AS employer_name,
  j.title,
  j.description,
  j.role_needed,
  j.location,
  j.pay,
  j.created_at,
  j.expires_at,
  (j.expires_at > now()) AS activa
FROM public.flash_jobs j
LEFT JOIN public.profiles p ON p.user_id = j.employer_id
-- Sin este filtro la vista repetiría la fuga del 9 sep: GRANT a authenticated
-- deja leer a CUALQUIER usuario logueado, no solo al admin.
WHERE public.es_admin()
ORDER BY j.created_at DESC;

COMMENT ON VIEW public.admin_active_flash_jobs IS
  'Ofertas Flash publicadas por organizadores. Antes del 10 sep 2026 no había forma de verlas desde el panel de admin ni de saber que existían.';

REVOKE ALL ON public.admin_active_flash_jobs FROM anon, authenticated;
GRANT SELECT ON public.admin_active_flash_jobs TO authenticated;
