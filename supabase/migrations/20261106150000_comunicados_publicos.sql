-- 6 nov 2026: el tablón es público. Un comunicado marcado "publico" lo ve
-- cualquiera (sin cuenta) y cualquier usuario con sesión puede dar me gusta,
-- comentar y votar (antes solo la categoría destinataria o los mencionados).
-- Los visitantes ven contadores (me gusta, comentarios, votos), nunca el texto
-- de los comentarios ni quién ha votado.

CREATE OR REPLACE FUNCTION public.puede_ver_comunicado(p_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT public.is_admin() OR EXISTS (
    SELECT 1 FROM comunicados c
    WHERE c.id = p_id AND (
      c.publico
      OR (c.caduca_at > now() AND (
        public.usuario_en_categoria(auth.uid(), c.categoria)
        OR position(auth.uid()::text in c.cuerpo) > 0))
    )
  )
$$;

-- Contadores para la web pública (sin sesión). Solo comunicados publicos.
CREATE OR REPLACE FUNCTION public.comunicados_publicos_interaccion(p_ids uuid[])
RETURNS TABLE (comunicado_id uuid, likes integer, comentarios integer, votos integer[])
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT c.id,
    (SELECT count(*)::int FROM comunicado_likes l WHERE l.comunicado_id = c.id),
    (SELECT count(*)::int FROM comunicado_comentarios k WHERE k.comunicado_id = c.id),
    CASE WHEN c.encuesta_opciones IS NULL THEN NULL ELSE ARRAY(
      SELECT (SELECT count(*)::int FROM comunicado_votos v WHERE v.comunicado_id = c.id AND v.opcion = g.i - 1)
      FROM generate_series(1, array_length(c.encuesta_opciones, 1)) AS g(i) ORDER BY g.i
    ) END
  FROM comunicados c
  WHERE c.id = ANY (p_ids) AND c.publico
$$;
GRANT EXECUTE ON FUNCTION public.comunicados_publicos_interaccion(uuid[]) TO anon, authenticated;
