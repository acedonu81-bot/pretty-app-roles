-- 6 nov 2026: "Me gusta" en cada comentario de un comunicado.
-- La tabla no tiene políticas: solo se toca por las funciones de abajo.
CREATE TABLE IF NOT EXISTS public.comunicado_comentario_likes (
  comentario_id uuid NOT NULL REFERENCES public.comunicado_comentarios(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (comentario_id, user_id)
);
ALTER TABLE public.comunicado_comentario_likes ENABLE ROW LEVEL SECURITY;

-- Comentarios con autor y con sus me gusta (cambia el tipo devuelto: hay que borrar la función).
DROP FUNCTION IF EXISTS public.comunicado_comentarios_de(uuid);
CREATE FUNCTION public.comunicado_comentarios_de(p_id uuid)
RETURNS TABLE (id uuid, texto text, created_at timestamptz, anonimo boolean, es_mio boolean,
  autor_id uuid, autor_nombre text, autor_foto text, autor_rol text, likes integer, yo_like boolean)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT k.id, k.texto, k.created_at, k.anonimo, k.user_id = auth.uid(),
    CASE WHEN k.anonimo AND NOT public.is_admin() THEN NULL ELSE k.user_id END,
    CASE WHEN k.anonimo AND NOT public.is_admin() THEN NULL ELSE a.display_name END,
    CASE WHEN k.anonimo AND NOT public.is_admin() THEN NULL ELSE a.photo_url END,
    CASE WHEN k.anonimo THEN 'empresario' ELSE a.role END,
    (SELECT count(*)::int FROM comunicado_comentario_likes l WHERE l.comentario_id = k.id),
    EXISTS (SELECT 1 FROM comunicado_comentario_likes l WHERE l.comentario_id = k.id AND l.user_id = auth.uid())
  FROM comunicado_comentarios k
  LEFT JOIN LATERAL (
    SELECT p.display_name, p.photo_url, p.role FROM profiles p
    WHERE p.user_id = k.user_id AND p.role <> 'pending'
    ORDER BY p.is_primary DESC NULLS LAST, p.created_at LIMIT 1
  ) a ON true
  WHERE k.comunicado_id = p_id AND public.puede_ver_comunicado(p_id)
  ORDER BY k.created_at
  LIMIT 200
$$;
GRANT EXECUTE ON FUNCTION public.comunicado_comentarios_de(uuid) TO authenticated;

-- Dar o quitar el me gusta propio a un comentario.
CREATE OR REPLACE FUNCTION public.comunicado_comentario_like(p_comentario uuid)
RETURNS TABLE (likes integer, yo_like boolean)
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE v_com uuid; v_yo boolean;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'sin sesion'; END IF;
  SELECT comunicado_id INTO v_com FROM comunicado_comentarios WHERE id = p_comentario;
  IF v_com IS NULL OR NOT public.puede_ver_comunicado(v_com) THEN RAISE EXCEPTION 'no permitido'; END IF;
  DELETE FROM comunicado_comentario_likes WHERE comentario_id = p_comentario AND user_id = auth.uid();
  v_yo := NOT FOUND;
  IF v_yo THEN
    INSERT INTO comunicado_comentario_likes (comentario_id, user_id) VALUES (p_comentario, auth.uid());
  END IF;
  RETURN QUERY SELECT (SELECT count(*)::int FROM comunicado_comentario_likes WHERE comentario_id = p_comentario), v_yo;
END $$;
REVOKE ALL ON FUNCTION public.comunicado_comentario_like(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.comunicado_comentario_like(uuid) TO authenticated;
