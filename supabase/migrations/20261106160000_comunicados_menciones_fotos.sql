-- 6 nov 2026: las menciones de los comunicados se pintan como circulitos con la
-- foto del profesional. Esta función devuelve foto y nombre SOLO de quien está
-- mencionado en algún comunicado visible para quien pregunta (público, o con
-- sesión), nunca de un perfil cualquiera. Sirve también a /novedades (sin cuenta).
CREATE OR REPLACE FUNCTION public.comunicados_menciones_fotos(p_ids uuid[])
RETURNS TABLE (user_id uuid, display_name text, photo_url text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT DISTINCT ON (p.user_id) p.user_id, p.display_name, p.photo_url
  FROM profiles p
  WHERE p.user_id = ANY (p_ids)
    AND COALESCE(p.is_seed, false) = false
    AND EXISTS (
      SELECT 1 FROM comunicados c
      WHERE position(p.user_id::text in c.cuerpo) > 0
        AND (c.publico OR auth.uid() IS NOT NULL)
    )
  ORDER BY p.user_id
$$;
GRANT EXECUTE ON FUNCTION public.comunicados_menciones_fotos(uuid[]) TO anon, authenticated;
