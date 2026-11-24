-- 25 nov 2026, revisión de seguridad de 20261124230000: la exención "no es
-- profesional" miraba solo profiles.role, pero los listados también sacan perfiles
-- por profiles.roles (roles.cs.{dj}). Un 'pending' u 'organizador' con roles=['dj']
-- salía entre los DJs sin bio. Ahora solo está exento quien no tiene NINGÚN oficio
-- ni en role ni en roles.
-- (El plan no se puede falsear: proteger_campos_al_crear_perfil lo fija al crear y
-- prevent_privilege_escalation impide cambiarlo.)

DROP FUNCTION IF EXISTS public.calcular_directorio_ok(uuid, text, text, text);

CREATE OR REPLACE FUNCTION public.calcular_directorio_ok(p_id uuid, p_role text, p_roles text[], p_tier text, p_bio text)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT (
           coalesce(p_role, '') IN ('empresario', 'particular', 'local_eventos', 'event_manager', 'organizador', 'pending')
           AND coalesce(p_roles, '{}'::text[]) <@ ARRAY['empresario', 'particular', 'local_eventos', 'event_manager', 'organizador', 'pending']::text[]
         )
      OR coalesce(public.plan_para_limites(p_id, p_tier), 'free') <> 'free'
      OR length(trim(coalesce(p_bio, ''))) >= 40;
$$;
REVOKE ALL ON FUNCTION public.calcular_directorio_ok(uuid, text, text[], text, text) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.profiles_directorio_ok()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
BEGIN
  NEW.directorio_ok := public.calcular_directorio_ok(NEW.id, NEW.role, NEW.roles, NEW.subscription_tier, NEW.bio);
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.profiles_directorio_ok() FROM PUBLIC, anon, authenticated;

UPDATE public.profiles p
   SET directorio_ok = public.calcular_directorio_ok(p.id, p.role, p.roles, p.subscription_tier, p.bio)
 WHERE p.directorio_ok IS DISTINCT FROM public.calcular_directorio_ok(p.id, p.role, p.roles, p.subscription_tier, p.bio);

SELECT cron.unschedule('xpeak-directorio-ok') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'xpeak-directorio-ok');
SELECT cron.schedule('xpeak-directorio-ok', '15 3 * * *', $$
  UPDATE public.profiles p
     SET directorio_ok = public.calcular_directorio_ok(p.id, p.role, p.roles, p.subscription_tier, p.bio)
   WHERE p.directorio_ok IS DISTINCT FROM public.calcular_directorio_ok(p.id, p.role, p.roles, p.subscription_tier, p.bio);
$$);
