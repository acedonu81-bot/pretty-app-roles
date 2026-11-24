-- 24 nov 2026 (decisión de Daniel): el nivel base (plan 'free': sin pagar y no
-- fundador) solo sale en el directorio con bio de 40 caracteres o más. La foto ya se
-- exigía (PHOTO_GATE_OR en la web). Fundadores, Profesional, Premium y quien no es
-- profesional (empresario, particular, local...) no cambian.
--
-- directorio_ok lo calcula SIEMPRE la BD (trigger en cualquier INSERT/UPDATE, para que
-- nadie pueda ponérselo a true a mano). Todos los listados lo filtran vía
-- PHOTO_GATE_OR / passesPhotoGate. Un cron diario recalcula por si cambia el plan
-- sin tocar el perfil (fin del año de fundador, 23 nov 2027).

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS directorio_ok boolean NOT NULL DEFAULT true;

CREATE OR REPLACE FUNCTION public.calcular_directorio_ok(p_id uuid, p_role text, p_tier text, p_bio text)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT coalesce(p_role, '') IN ('empresario', 'particular', 'local_eventos', 'event_manager', 'organizador', 'pending')
      OR coalesce(public.plan_para_limites(p_id, p_tier), 'free') <> 'free'
      OR length(trim(coalesce(p_bio, ''))) >= 40;
$$;
REVOKE ALL ON FUNCTION public.calcular_directorio_ok(uuid, text, text, text) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.profiles_directorio_ok()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
BEGIN
  NEW.directorio_ok := public.calcular_directorio_ok(NEW.id, NEW.role, NEW.subscription_tier, NEW.bio);
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.profiles_directorio_ok() FROM PUBLIC, anon, authenticated;

-- zzz_: el último de los BEFORE, ya con bio/rol/plan definitivos.
DROP TRIGGER IF EXISTS zzz_profiles_directorio_ok ON public.profiles;
CREATE TRIGGER zzz_profiles_directorio_ok
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.profiles_directorio_ok();

UPDATE public.profiles p
   SET directorio_ok = public.calcular_directorio_ok(p.id, p.role, p.subscription_tier, p.bio)
 WHERE p.directorio_ok IS DISTINCT FROM public.calcular_directorio_ok(p.id, p.role, p.subscription_tier, p.bio);

SELECT cron.unschedule('xpeak-directorio-ok') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'xpeak-directorio-ok');
SELECT cron.schedule('xpeak-directorio-ok', '15 3 * * *', $$
  UPDATE public.profiles p
     SET directorio_ok = public.calcular_directorio_ok(p.id, p.role, p.subscription_tier, p.bio)
   WHERE p.directorio_ok IS DISTINCT FROM public.calcular_directorio_ok(p.id, p.role, p.subscription_tier, p.bio);
$$);
