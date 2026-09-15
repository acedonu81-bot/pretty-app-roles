-- profiles.response_bucket (20260916100000) quedó fuera de la lista de
-- campos protegidos por protect_privileged_fields(). Como profiles tiene
-- una policy de UPDATE normal para el dueño de la fila, cualquier
-- profesional podía hacer update({ response_bucket: 'minutos' }) sobre su
-- propia fila desde el navegador y falsificar su indicador de reputación
-- ("Responde en X") de forma permanente.
--
-- Se añade response_bucket a la lista de campos pinneados a su valor
-- anterior (NEW.x := OLD.x) cuando quien escribe no es admin. Pero
-- response_bucket lo escribe también el cron xpeak-response-bucket-recalc
-- con la service_role_key, que bypassa RLS — el trigger BEFORE UPDATE SÍ
-- se sigue ejecutando igual para esas escrituras (los triggers no dependen
-- de RLS), así que sin más guardas el propio cron se pisaría el valor que
-- intenta escribir.
--
-- La distinción: con service_role_key, auth.uid() es NULL (no hay sesión de
-- usuario asociada al JWT del service role); con una sesión de usuario
-- normal (autenticado o anónimo vía RLS), auth.uid() siempre devuelve un
-- uuid no nulo cuando hay policy de UPDATE que lo permite. Por tanto: si
-- auth.uid() IS NULL, es una escritura de service role (cron) y no se toca
-- nada; si auth.uid() IS NOT NULL Y no es admin, se pinnean los campos
-- privilegiados como antes.
--
-- Esto añade la misma guarda auth.uid() IS NOT NULL al resto de campos ya
-- protegidos (is_verified, is_premium, subscription_tier, role). No cambia
-- su comportamiento: para una escritura de usuario normal auth.uid() nunca
-- es null, así que el bloque se sigue ejecutando exactamente igual que
-- antes; para un admin, el NOT has_role(...) ya los dejaba pasar sin
-- protección, y eso no cambia.
CREATE OR REPLACE FUNCTION public.protect_privileged_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND NOT public.has_role(auth.uid(), 'admin') THEN
    NEW.is_verified := OLD.is_verified;
    NEW.is_premium := OLD.is_premium;
    NEW.subscription_tier := OLD.subscription_tier;
    -- Prevent professional role changes without admin approval
    NEW.role := OLD.role;
    -- Indicador "Responde en X": solo lo escribe el cron
    -- (response-bucket-recalc) vía service_role_key, nunca el propio dueño.
    NEW.response_bucket := OLD.response_bucket;
  END IF;
  RETURN NEW;
END;
$$;
