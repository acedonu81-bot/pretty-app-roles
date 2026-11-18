-- ════════════════════════════════════════════════════════════════
-- Referidos con descuento (18 nov 2026, decisiones de Daniel).
--
-- Un amigo cuenta cuando se suscribe con tu enlace y paga: 1 amigo = 10 %,
-- 2 o más = 20 % (tope), desde tu siguiente cobro. Nunca en cadena: solo cuenta
-- el padrino directo. Si quien invita está en Esencial, sus amigos se guardan y
-- el descuento se aplica cuando se suscriba. Un amigo que paga con la MISMA
-- tarjeta que quien le invita no cuenta (nadie se invita a sí mismo).
-- El webhook de Stripe recalcula y pone o quita el cupón en la suscripción.
--
-- La insignia azul "Prioridad" (+6 meses por invitado) se sustituye por el
-- descuento: su trigger trg_reward_referral se borra AL LANZAR los cobros (en
-- producción la web vieja aún la anuncia). Hoy: 0 referidos y 0 insignias.
-- ════════════════════════════════════════════════════════════════

-- Huella de la tarjeta con la que paga cada suscriptor (la da Stripe; no es el número).
ALTER TABLE public.suscripciones ADD COLUMN IF NOT EXISTS tarjeta_huella text;

-- El padrino ya no lo inserta el navegador (podía poner cualquier padrino en cualquier
-- momento): solo por registrar_padrino(), con sus comprobaciones.
DROP POLICY IF EXISTS "Anyone can register as invitee" ON public.referrals;

CREATE OR REPLACE FUNCTION public.registrar_padrino(p_codigo text)
RETURNS text
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_yo uuid := auth.uid();
  v_padrino uuid;
  v_creado timestamptz;
BEGIN
  IF v_yo IS NULL THEN RETURN 'sin_sesion'; END IF;
  IF p_codigo IS NULL OR length(trim(p_codigo)) = 0 THEN RETURN 'sin_codigo'; END IF;
  IF EXISTS (SELECT 1 FROM public.referrals WHERE invitee_user_id = v_yo) THEN RETURN 'ya_tiene'; END IF;
  SELECT created_at INTO v_creado FROM auth.users WHERE id = v_yo;
  -- Solo cuentas recién creadas: el enlace se usa al darse de alta, no después.
  IF v_creado IS NULL OR v_creado < now() - interval '7 days' THEN RETURN 'cuenta_antigua'; END IF;
  IF EXISTS (SELECT 1 FROM public.suscripciones WHERE user_id = v_yo AND stripe_subscription_id IS NOT NULL) THEN RETURN 'ya_pago'; END IF;
  SELECT user_id INTO v_padrino FROM public.profiles WHERE referral_code = trim(p_codigo) LIMIT 1;
  IF v_padrino IS NULL THEN RETURN 'codigo_desconocido'; END IF;
  IF v_padrino = v_yo THEN RETURN 'eres_tu'; END IF;
  INSERT INTO public.referrals (inviter_user_id, invitee_user_id)
  VALUES (v_padrino, v_yo)
  ON CONFLICT (invitee_user_id) DO NOTHING;
  RETURN 'ok';
END;
$$;
REVOKE ALL ON FUNCTION public.registrar_padrino(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.registrar_padrino(text) TO authenticated;

-- Amigos que cuentan para el descuento de p_padrino: pagan (o Stripe reintenta el
-- cobro) y no con la misma tarjeta que el padrino.
CREATE OR REPLACE FUNCTION public.amigos_que_pagan(p_padrino uuid)
RETURNS integer
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT count(*)::int
  FROM public.referrals r
  JOIN public.suscripciones s ON s.user_id = r.invitee_user_id
  LEFT JOIN public.suscripciones yo ON yo.user_id = p_padrino
  WHERE r.inviter_user_id = p_padrino
    AND s.estado IN ('active', 'trialing', 'past_due')
    AND (s.tarjeta_huella IS NULL OR yo.tarjeta_huella IS NULL OR s.tarjeta_huella <> yo.tarjeta_huella);
$$;
REVOKE ALL ON FUNCTION public.amigos_que_pagan(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.amigos_que_pagan(uuid) TO service_role;

-- Para la tarjeta "Invita y paga menos" del panel.
CREATE OR REPLACE FUNCTION public.mis_referidos()
RETURNS TABLE (invitados integer, pagando integer)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT
    (SELECT count(*)::int FROM public.referrals WHERE inviter_user_id = auth.uid()),
    public.amigos_que_pagan(auth.uid());
$$;
REVOKE ALL ON FUNCTION public.mis_referidos() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.mis_referidos() TO authenticated;
