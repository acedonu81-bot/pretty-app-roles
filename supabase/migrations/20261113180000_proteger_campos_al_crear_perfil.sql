-- Auditoría 13 nov 2026: al CREAR un perfil (perfiles adicionales) no había
-- ninguna protección. La política "Users can insert own profile" solo comprueba
-- user_id, así que por API se podía crear un perfil con is_verified = true,
-- un plan de pago o puntuación de ranking. Al ACTUALIZAR ya lo impedían
-- prevent_privilege_escalation y proteger_campos_ranking; esto cubre el INSERT.
-- Lo que crea el sistema (handle_new_user, service role, admin) no se toca.
CREATE OR REPLACE FUNCTION public.proteger_campos_al_crear_perfil()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;
  NEW.is_verified := false;
  NEW.is_premium := false;
  -- El plan se hereda del perfil que ya tiene la cuenta (lo pone el pago), nunca del cliente.
  NEW.subscription_tier := COALESCE(
    (SELECT p.subscription_tier FROM public.profiles p WHERE p.user_id = NEW.user_id ORDER BY p.is_primary DESC NULLS LAST LIMIT 1),
    'free');
  NEW.annual_billing := false;
  NEW.trial_started_at := now();
  NEW.score := 0;
  NEW.priority_badge_until := NULL;
  NEW.response_bucket := NULL;
  NEW.emergente_verified_at := NULL;
  NEW.emergente_verified_by := NULL;
  NEW.emergente_sub_nivel := NULL;
  NEW.is_seed := false;
  NEW.is_seed_profile := false;
  NEW.fast_responder_count := 0;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_proteger_campos_al_crear_perfil ON public.profiles;
CREATE TRIGGER trg_proteger_campos_al_crear_perfil
  BEFORE INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.proteger_campos_al_crear_perfil();
