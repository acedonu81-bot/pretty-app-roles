-- ════════════════════════════════════════════════════════════════
-- Programa de referidos: badge azul de prioridad 6 meses.
--
-- Un profesional invita a otro con su enlace de referido
-- (/auth?mode=register&ref=CODIGO). Cuando el invitado completa su
-- perfil (foto + bio + algún media) por primera vez, el que invitó
-- gana +6 meses de prioridad de listado (badge azul). Cada referido
-- nuevo que complete perfil suma +6 meses más desde ese momento
-- (no se resetea, se acumula sobre lo que quede).
-- ════════════════════════════════════════════════════════════════

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS referral_code text UNIQUE,
  ADD COLUMN IF NOT EXISTS priority_badge_until timestamptz;

-- Genera un código corto y único basado en el user_id, solo si no lo tiene ya.
UPDATE public.profiles
SET referral_code = substr(md5(user_id::text || random()::text), 1, 8)
WHERE referral_code IS NULL;

CREATE OR REPLACE FUNCTION public.gen_referral_code()
RETURNS trigger AS $$
BEGIN
  IF NEW.referral_code IS NULL THEN
    NEW.referral_code := substr(md5(NEW.user_id::text || clock_timestamp()::text || random()::text), 1, 8);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_gen_referral_code ON public.profiles;
CREATE TRIGGER trg_gen_referral_code
  BEFORE INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.gen_referral_code();

-- ── referrals ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inviter_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invitee_user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  rewarded boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (inviter_user_id <> invitee_user_id)
);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view referrals they are part of" ON public.referrals;
CREATE POLICY "Users can view referrals they are part of"
  ON public.referrals FOR SELECT TO authenticated
  USING (auth.uid() IN (inviter_user_id, invitee_user_id));

DROP POLICY IF EXISTS "Anyone can register as invitee" ON public.referrals;
CREATE POLICY "Anyone can register as invitee"
  ON public.referrals FOR INSERT TO authenticated
  WITH CHECK (invitee_user_id = auth.uid());

-- Un perfil se considera "completo" con foto + bio + algún media.
CREATE OR REPLACE FUNCTION public.is_profile_complete(p public.profiles)
RETURNS boolean AS $$
  SELECT p.photo_url IS NOT NULL
     AND p.bio IS NOT NULL AND length(trim(p.bio)) > 0
     AND (
       (p.audio_embed_url IS NOT NULL AND length(trim(p.audio_embed_url)) > 0)
       OR (p.audio_session_urls IS NOT NULL AND array_length(p.audio_session_urls, 1) > 0)
       OR (p.portfolio_urls IS NOT NULL AND array_length(p.portfolio_urls, 1) > 0)
     );
$$ LANGUAGE sql STABLE;

-- Al completar el perfil por primera vez, recompensa al inviter (si lo hay
-- y aún no se ha recompensado) con +6 meses de badge de prioridad.
CREATE OR REPLACE FUNCTION public.reward_referral_on_profile_complete()
RETURNS trigger AS $$
DECLARE
  v_referral public.referrals;
BEGIN
  IF public.is_profile_complete(NEW) AND NOT public.is_profile_complete(OLD) THEN
    SELECT * INTO v_referral FROM public.referrals
      WHERE invitee_user_id = NEW.user_id AND rewarded = false
      LIMIT 1;

    IF FOUND THEN
      UPDATE public.profiles
      SET priority_badge_until = GREATEST(COALESCE(priority_badge_until, now()), now()) + interval '6 months'
      WHERE user_id = v_referral.inviter_user_id;

      UPDATE public.referrals SET rewarded = true WHERE id = v_referral.id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_reward_referral ON public.profiles;
CREATE TRIGGER trg_reward_referral
  AFTER UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.reward_referral_on_profile_complete();
