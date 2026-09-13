-- Cuando un lead deja su email en una búsqueda sin resultados (formulario en
-- DirectoryView, 13 sep 2026), hoy ese lead se guarda pero nadie le avisa
-- cuando el hueco de inventario se cubre: hay que mirarlo a mano en la tabla.
--
-- Este cambio automatiza el aviso: cuando un perfil se completa (pasa a tener
-- display_name real, momento en que empieza a aparecer en el directorio), se
-- busca si algún lead pendiente encaja por rol y región, y se le manda un
-- email. El matching necesita columnas estructuradas — `intent` es texto
-- libre para que lo lea un humano ("mago · saxofonista bilbao"), pero
-- comparar frases libres con LIKE habría sido impreciso (falsos positivos y
-- negativos, ej. "dj bodas madrid" vs region "Comunidad de Madrid").

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS lead_role text,
  ADD COLUMN IF NOT EXISTS lead_region text;

CREATE INDEX IF NOT EXISTS leads_match_pendiente_idx
  ON public.leads (lead_role, lead_region)
  WHERE converted_at IS NULL;

-- SECURITY DEFINER: quien completa su perfil no tiene permiso para leer ni
-- escribir la tabla leads (son leads anónimos de otros usuarios).
CREATE OR REPLACE FUNCTION public.notify_lead_match_on_profile_complete()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_lead record;
  v_rol_nuevo text := lower(trim(COALESCE(NEW.role, '')));
  v_zona_es text;
BEGIN
  v_zona_es := COALESCE(NULLIF(trim(NEW.zone), ''), NEW.region, 'España');

  FOR v_lead IN
    SELECT id, email, lead_role, lead_region
    FROM public.leads
    WHERE converted_at IS NULL
      AND lead_role IS NOT NULL
      AND (
        lower(lead_role) LIKE '%' || v_rol_nuevo || '%'
        OR v_rol_nuevo LIKE '%' || lower(lead_role) || '%'
      )
      AND (lead_region IS NULL OR lead_region = NEW.region OR NEW.region IS NULL)
  LOOP
    BEGIN
      PERFORM net.http_post(
        url     := 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/send-email',
        headers := jsonb_build_object(
          'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkcnFod3JhdnVwanp5c3JpYmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NjkwMTIsImV4cCI6MjA5MDE0NTAxMn0.sHR3zuVWIj6Xw_UBI_kuQCcfEFS3oQWjs0dKUtr2Puk',
          'Content-Type', 'application/json'
        ),
        body := jsonb_build_object(
          'type', 'lead_match_found',
          'data', jsonb_build_object('email', v_lead.email, 'role', NEW.role, 'zone', v_zona_es)
        )
      );
      -- Se marca aunque el envío falle: un lead se avisa una sola vez por
      -- hueco, no una vez por cada profesional nuevo que encaje esa semana.
      UPDATE public.leads SET converted_at = now() WHERE id = v_lead.id;
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'notify_lead_match_on_profile_complete: fallo avisando a %: %', v_lead.email, SQLERRM;
    END;
  END LOOP;

  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS notify_lead_match_on_profile_complete_trigger ON public.profiles;
CREATE TRIGGER notify_lead_match_on_profile_complete_trigger
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  -- Solo la transición "sin nombre" → "con nombre": el momento en que el
  -- perfil empieza a aparecer en fetchDirectoryProfiles (mismo criterio de
  -- visibilidad que usa esa consulta: display_name con más de 1 carácter).
  WHEN (
    length(trim(COALESCE(OLD.display_name, ''))) <= 1
    AND length(trim(COALESCE(NEW.display_name, ''))) > 1
  )
  EXECUTE FUNCTION public.notify_lead_match_on_profile_complete();
