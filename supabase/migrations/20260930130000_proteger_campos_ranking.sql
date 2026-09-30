-- Verificado 30 sep 2026: cualquier profesional con sesión podía ponerse
-- score=999 (el directorio ordena por score), marcarse "emergente verificado"
-- o tocar priority_badge_until/response_bucket con un simple
-- supabase.from('profiles').update(...) sobre su propia fila. RLS permite
-- editar la fila propia y los permisos por columna incluyen esos campos;
-- prevent_privilege_escalation solo cubría suscripción/verificado/billing.
--
-- Igual que prevent_self_verification: si no es admin ni servidor, se
-- conserva el valor anterior en silencio (no rompe pantallas que reenvían el
-- perfil completo). fast_responder_count solo puede subir de uno en uno, que
-- es lo que hace el flujo legítimo (SolicitudesTab al responder en <1h).
CREATE OR REPLACE FUNCTION public.proteger_campos_ranking()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF auth.uid() IS NULL OR public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW; -- servidor (crons, service_role, migraciones) o admin
  END IF;
  NEW.score := OLD.score;
  NEW.priority_badge_until := OLD.priority_badge_until;
  NEW.response_bucket := OLD.response_bucket;
  NEW.emergente_verified_at := OLD.emergente_verified_at;
  NEW.emergente_verified_by := OLD.emergente_verified_by;
  NEW.emergente_sub_nivel := OLD.emergente_sub_nivel;
  NEW.is_seed := OLD.is_seed;
  NEW.is_seed_profile := OLD.is_seed_profile;
  IF COALESCE(NEW.fast_responder_count, 0) NOT IN (COALESCE(OLD.fast_responder_count, 0), COALESCE(OLD.fast_responder_count, 0) + 1) THEN
    NEW.fast_responder_count := OLD.fast_responder_count;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_proteger_campos_ranking ON public.profiles;
CREATE TRIGGER trg_proteger_campos_ranking
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.proteger_campos_ranking();
