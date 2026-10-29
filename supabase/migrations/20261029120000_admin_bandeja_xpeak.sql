-- Bandeja de la cuenta oficial XPEAK en el panel admin (29 oct 2026).
-- El admin lee y responde los chats de la cuenta XPEAK (b8c47c26) sin entrar
-- con ella: todo sale con sender_id = XPEAK, así la notificación dice
-- "XPEAK te ha escrito" y nunca el nombre del admin (regla del 7 oct).
-- Solo se tocan conversaciones donde XPEAK es participante; el resto de chats
-- siguen siendo privados (admin_resumen_conversaciones no lee contenido).

CREATE OR REPLACE FUNCTION public.admin_xpeak_conversaciones()
RETURNS TABLE(conversation_id uuid, otro_id uuid, nombre text, rol text, foto text,
              ultimo_texto text, ultimo_de_xpeak boolean, ultimo_at timestamptz, sin_leer bigint)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE
  v_xpeak constant uuid := 'b8c47c26-33bd-41d7-a869-ba6fa2d22667';
BEGIN
  IF NOT public.es_admin() THEN RAISE EXCEPTION 'Solo admin'; END IF;
  RETURN QUERY
  SELECT c.id,
         o.otro,
         COALESCE(NULLIF(trim(p.display_name), ''), 'Sin nombre'),
         p.role::text,
         p.photo_url,
         u.content,
         u.sender_id = v_xpeak,
         COALESCE(u.created_at, c.last_message_at, c.created_at),
         (SELECT count(*) FROM public.messages m
           WHERE m.conversation_id = c.id AND m.sender_id <> v_xpeak
             AND NOT m.read AND m.deleted_at IS NULL)
    FROM public.conversations c
    CROSS JOIN LATERAL (SELECT CASE WHEN c.participant_a = v_xpeak THEN c.participant_b ELSE c.participant_a END AS otro) o
    LEFT JOIN LATERAL (SELECT pp.display_name, pp.role, pp.photo_url FROM public.profiles pp
                        WHERE pp.user_id = o.otro ORDER BY pp.is_primary DESC LIMIT 1) p ON true
    LEFT JOIN LATERAL (SELECT m.content, m.sender_id, m.created_at FROM public.messages m
                        WHERE m.conversation_id = c.id AND m.deleted_at IS NULL
                        ORDER BY m.created_at DESC LIMIT 1) u ON true
   WHERE v_xpeak IN (c.participant_a, c.participant_b)
   ORDER BY 8 DESC;
END;
$$;

-- Devuelve el hilo y marca como leído lo que escribió el otro.
CREATE OR REPLACE FUNCTION public.admin_xpeak_mensajes(p_conversation uuid)
RETURNS TABLE(id uuid, de_xpeak boolean, content text, photo_url text, video_url text, created_at timestamptz, leido boolean)
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE
  v_xpeak constant uuid := 'b8c47c26-33bd-41d7-a869-ba6fa2d22667';
BEGIN
  IF NOT public.es_admin() THEN RAISE EXCEPTION 'Solo admin'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.conversations c
                  WHERE c.id = p_conversation AND v_xpeak IN (c.participant_a, c.participant_b)) THEN
    RAISE EXCEPTION 'No es una conversación de XPEAK';
  END IF;
  UPDATE public.messages m SET read = true
   WHERE m.conversation_id = p_conversation AND m.sender_id <> v_xpeak AND NOT m.read;
  RETURN QUERY
  SELECT m.id, m.sender_id = v_xpeak, m.content, m.photo_url, m.video_url, m.created_at, m.read
    FROM public.messages m
   WHERE m.conversation_id = p_conversation AND m.deleted_at IS NULL
   ORDER BY m.created_at;
END;
$$;

-- Envía como XPEAK a un usuario; abre la conversación si no existía.
CREATE OR REPLACE FUNCTION public.admin_xpeak_enviar(p_destinatario uuid, p_texto text)
RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE
  v_xpeak constant uuid := 'b8c47c26-33bd-41d7-a869-ba6fa2d22667';
  v_conv uuid;
  v_texto text := trim(p_texto);
BEGIN
  IF NOT public.es_admin() THEN RAISE EXCEPTION 'Solo admin'; END IF;
  IF p_destinatario IS NULL OR p_destinatario = v_xpeak THEN RAISE EXCEPTION 'Destinatario no válido'; END IF;
  IF v_texto IS NULL OR char_length(v_texto) = 0 OR char_length(v_texto) > 4000 THEN
    RAISE EXCEPTION 'El mensaje está vacío o es demasiado largo';
  END IF;

  SELECT c.id INTO v_conv FROM public.conversations c
   WHERE (c.participant_a = v_xpeak AND c.participant_b = p_destinatario)
      OR (c.participant_a = p_destinatario AND c.participant_b = v_xpeak)
   LIMIT 1;
  IF v_conv IS NULL THEN
    INSERT INTO public.conversations (participant_a, participant_b, last_message_at)
    VALUES (p_destinatario, v_xpeak, now()) RETURNING id INTO v_conv;
  END IF;

  INSERT INTO public.messages (conversation_id, sender_id, content) VALUES (v_conv, v_xpeak, v_texto);
  UPDATE public.conversations SET last_message_at = now(), deleted_by_a = false, deleted_by_b = false
   WHERE id = v_conv;
  RETURN v_conv;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_xpeak_conversaciones() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.admin_xpeak_mensajes(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.admin_xpeak_enviar(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_xpeak_conversaciones() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_xpeak_mensajes(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_xpeak_enviar(uuid, text) TO authenticated;
