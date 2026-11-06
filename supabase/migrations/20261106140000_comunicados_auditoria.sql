-- 6 nov 2026: arreglos de la auditoría de comunicados.

-- 1) anon tenía ALL sobre las tablas (privilegios por defecto del proyecto).
--    La RLS lo frenaba, pero sobra: solo hace falta leer los públicos.
REVOKE ALL ON public.comunicados, public.comunicado_lecturas, public.comunicado_likes,
  public.comunicado_comentarios, public.comunicado_votos FROM anon;
GRANT SELECT ON public.comunicados TO anon;

-- 2) Un mencionado fuera de la categoría recibía el aviso "XPEAK te ha
--    mencionado" pero no podía abrir el comunicado (RLS). Ahora el mencionado
--    siempre lo ve, y puede dar me gusta, comentar y votar.
CREATE OR REPLACE FUNCTION public.puede_ver_comunicado(p_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT public.is_admin() OR EXISTS (
    SELECT 1 FROM comunicados c
    WHERE c.id = p_id AND c.caduca_at > now()
      AND (public.usuario_en_categoria(auth.uid(), c.categoria)
           OR position(auth.uid()::text in c.cuerpo) > 0)
  )
$$;

DROP POLICY IF EXISTS "Comunicados: leen los de su categoria" ON public.comunicados;
CREATE POLICY "Comunicados: leen los de su categoria o mencionados" ON public.comunicados
  FOR SELECT TO authenticated
  USING (public.is_admin() OR (caduca_at > now() AND (
    public.usuario_en_categoria(auth.uid(), categoria) OR position(auth.uid()::text in cuerpo) > 0)));

-- 3) Enlaces e imágenes solo https o rutas internas (el editor ya lo valida;
--    esto cierra la puerta a javascript: si algún día se publica por otro camino).
ALTER TABLE public.comunicados
  ADD CONSTRAINT comunicados_cta_url_ok CHECK (cta_url IS NULL OR cta_url ~ '^(/[^/]|https://)'),
  ADD CONSTRAINT comunicados_media_https CHECK (
    (imagen_url IS NULL OR imagen_url ~ '^https://') AND (video_url IS NULL OR video_url ~ '^https://'));
