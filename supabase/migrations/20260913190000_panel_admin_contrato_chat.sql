-- El banner de contratos completados (AdminHiredContracts) despliega, al
-- hacer clic en un contrato, si organizador y profesional llegaron a
-- hablar por chat. Pero la RLS de `conversations`/`messages` solo deja ver
-- la fila a sus dos participantes — el admin no lo es, así que consultarlas
-- directo desde el frontend siempre devolvía 0 filas, incluso en un caso
-- real donde sí hubo conversación (verificado 13 sep 2026: Burger Gourmet
-- Fest ↔ profesional, 1 conversación con mensajes, el panel habría mostrado
-- "nunca se escribieron"). Mismo patrón que reference_rls_olvida_admin.
--
-- Se expone SOLO el hecho de que hablaron + cuántos mensajes + fecha del
-- último, nunca el contenido — el chat entre dos usuarios sigue siendo
-- privado, ni el admin lo lee desde aquí.

CREATE OR REPLACE FUNCTION public.panel_admin_contrato_chat(p_user_a uuid, p_user_b uuid)
RETURNS TABLE (hablaron boolean, num_mensajes bigint, ultimo_mensaje timestamptz)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_convo_id uuid;
  v_count bigint;
  v_last timestamptz;
BEGIN
  IF NOT public.es_admin() THEN RAISE EXCEPTION 'Solo admin'; END IF;

  SELECT c.id, c.last_message_at INTO v_convo_id, v_last
  FROM public.conversations c
  WHERE (c.participant_a = p_user_a AND c.participant_b = p_user_b)
     OR (c.participant_a = p_user_b AND c.participant_b = p_user_a)
  LIMIT 1;

  IF v_convo_id IS NULL THEN
    RETURN QUERY SELECT false, 0::bigint, NULL::timestamptz;
    RETURN;
  END IF;

  SELECT count(*) INTO v_count FROM public.messages m
  WHERE m.conversation_id = v_convo_id AND m.deleted_at IS NULL;

  RETURN QUERY SELECT (v_count > 0), v_count, v_last;
END;
$function$;

REVOKE EXECUTE ON FUNCTION public.panel_admin_contrato_chat(uuid, uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.panel_admin_contrato_chat(uuid, uuid) TO authenticated;
