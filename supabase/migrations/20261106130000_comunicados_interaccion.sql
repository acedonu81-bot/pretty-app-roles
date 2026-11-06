-- 6 nov 2026: comunicados con interacción (me gusta, comentarios, encuesta) y
-- opción de publicarlos en la web (/novedades/<slug>) para SEO.
-- Comentarios: el organizador elige si sale con su nombre o como "Un
-- organizador" (empresarios sin exposición pública salvo que ellos quieran).
-- Los comentarios NUNCA salen en la web pública.

ALTER TABLE public.comunicados
  ADD COLUMN IF NOT EXISTS publico boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS comentarios_on boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS encuesta_pregunta text CHECK (encuesta_pregunta IS NULL OR length(encuesta_pregunta) <= 200),
  ADD COLUMN IF NOT EXISTS encuesta_opciones text[] CHECK (encuesta_opciones IS NULL OR array_length(encuesta_opciones, 1) BETWEEN 2 AND 6),
  ADD COLUMN IF NOT EXISTS encuesta_cierra_at timestamptz;

-- Los públicos los lee cualquiera (web y prerender), aunque hayan caducado en el panel.
CREATE POLICY "Comunicados: publicos en la web" ON public.comunicados
  FOR SELECT TO anon, authenticated USING (publico = true);
GRANT SELECT ON public.comunicados TO anon;

-- ¿Puede este usuario ver (y por tanto interactuar con) el comunicado?
CREATE OR REPLACE FUNCTION public.puede_ver_comunicado(p_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT public.is_admin() OR EXISTS (
    SELECT 1 FROM comunicados c
    WHERE c.id = p_id AND c.caduca_at > now()
      AND public.usuario_en_categoria(auth.uid(), c.categoria)
  )
$$;

CREATE TABLE IF NOT EXISTS public.comunicado_likes (
  comunicado_id uuid NOT NULL REFERENCES public.comunicados(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (comunicado_id, user_id)
);
ALTER TABLE public.comunicado_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Likes: dar el suyo" ON public.comunicado_likes
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND public.puede_ver_comunicado(comunicado_id));
CREATE POLICY "Likes: quitar el suyo" ON public.comunicado_likes
  FOR DELETE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Likes: ver los suyos o admin" ON public.comunicado_likes
  FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin());
GRANT SELECT, INSERT, DELETE ON public.comunicado_likes TO authenticated;

CREATE TABLE IF NOT EXISTS public.comunicado_comentarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comunicado_id uuid NOT NULL REFERENCES public.comunicados(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  texto text NOT NULL CHECK (length(trim(texto)) BETWEEN 1 AND 500),
  anonimo boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  -- Red de seguridad por si alguien se salta el filtro del navegador:
  -- ni correos ni teléfonos de 9 cifras (se habla dentro de XPEAK).
  CONSTRAINT comentario_sin_contacto CHECK (
    texto !~* '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}'
    AND regexp_replace(texto, '[\s.\-()]', '', 'g') !~ '(\+34)?[6789][0-9]{8}'
  )
);
CREATE INDEX IF NOT EXISTS comunicado_comentarios_idx ON public.comunicado_comentarios (comunicado_id, created_at);
ALTER TABLE public.comunicado_comentarios ENABLE ROW LEVEL SECURITY;

-- Anónimo solo si quien comenta es organizador (el profesional siempre firma).
CREATE POLICY "Comentarios: escribir" ON public.comunicado_comentarios
  FOR INSERT TO authenticated WITH CHECK (
    user_id = auth.uid()
    AND public.puede_ver_comunicado(comunicado_id)
    AND EXISTS (SELECT 1 FROM comunicados c WHERE c.id = comunicado_id AND c.comentarios_on)
    AND (NOT anonimo OR EXISTS (SELECT 1 FROM profiles p WHERE p.user_id = auth.uid() AND p.role = 'empresario'))
  );
CREATE POLICY "Comentarios: borrar el suyo o admin" ON public.comunicado_comentarios
  FOR DELETE TO authenticated USING (user_id = auth.uid() OR public.is_admin());
-- Lectura directa solo propia o admin: el resto pasa por la RPC, que oculta
-- quién es en los anónimos (si no, el user_id delataría al organizador).
CREATE POLICY "Comentarios: ver propios o admin" ON public.comunicado_comentarios
  FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin());
GRANT SELECT, INSERT, DELETE ON public.comunicado_comentarios TO authenticated;

CREATE TABLE IF NOT EXISTS public.comunicado_votos (
  comunicado_id uuid NOT NULL REFERENCES public.comunicados(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  opcion smallint NOT NULL CHECK (opcion >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (comunicado_id, user_id)
);
ALTER TABLE public.comunicado_votos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Votos: votar una vez" ON public.comunicado_votos
  FOR INSERT TO authenticated WITH CHECK (
    user_id = auth.uid()
    AND public.puede_ver_comunicado(comunicado_id)
    AND EXISTS (
      SELECT 1 FROM comunicados c WHERE c.id = comunicado_id
        AND c.encuesta_opciones IS NOT NULL
        AND opcion < array_length(c.encuesta_opciones, 1)
        AND (c.encuesta_cierra_at IS NULL OR c.encuesta_cierra_at > now())
    )
  );
CREATE POLICY "Votos: ver el suyo o admin" ON public.comunicado_votos
  FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin());
GRANT SELECT, INSERT ON public.comunicado_votos TO authenticated;

-- Contadores para el carrusel en una sola llamada.
CREATE OR REPLACE FUNCTION public.comunicados_interaccion(p_ids uuid[])
RETURNS TABLE (comunicado_id uuid, likes integer, comentarios integer, yo_like boolean, mi_voto smallint, votos integer[])
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT c.id,
    (SELECT count(*)::int FROM comunicado_likes l WHERE l.comunicado_id = c.id),
    (SELECT count(*)::int FROM comunicado_comentarios k WHERE k.comunicado_id = c.id),
    EXISTS (SELECT 1 FROM comunicado_likes l WHERE l.comunicado_id = c.id AND l.user_id = auth.uid()),
    (SELECT v.opcion FROM comunicado_votos v WHERE v.comunicado_id = c.id AND v.user_id = auth.uid()),
    CASE WHEN c.encuesta_opciones IS NULL THEN NULL ELSE ARRAY(
      SELECT (SELECT count(*)::int FROM comunicado_votos v WHERE v.comunicado_id = c.id AND v.opcion = g.i - 1)
      FROM generate_series(1, array_length(c.encuesta_opciones, 1)) AS g(i) ORDER BY g.i
    ) END
  FROM comunicados c
  WHERE c.id = ANY (p_ids) AND public.puede_ver_comunicado(c.id)
$$;
GRANT EXECUTE ON FUNCTION public.comunicados_interaccion(uuid[]) TO authenticated;

-- Comentarios con autor. Anónimo: sin nombre, foto ni id (salvo para el admin
-- y para el propio autor, que puede borrarlo).
CREATE OR REPLACE FUNCTION public.comunicado_comentarios_de(p_id uuid)
RETURNS TABLE (id uuid, texto text, created_at timestamptz, anonimo boolean, es_mio boolean,
  autor_id uuid, autor_nombre text, autor_foto text, autor_rol text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT k.id, k.texto, k.created_at, k.anonimo, k.user_id = auth.uid(),
    CASE WHEN k.anonimo AND NOT public.is_admin() THEN NULL ELSE k.user_id END,
    CASE WHEN k.anonimo AND NOT public.is_admin() THEN NULL ELSE a.display_name END,
    CASE WHEN k.anonimo AND NOT public.is_admin() THEN NULL ELSE a.photo_url END,
    CASE WHEN k.anonimo THEN 'empresario' ELSE a.role END
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

-- Aviso al admin de cada comentario nuevo (para moderar a tiempo).
CREATE OR REPLACE FUNCTION public.comunicado_comentario_aviso()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  INSERT INTO notifications (user_id, type, title, body, link)
  SELECT r.user_id, 'admin_comentario', 'Nuevo comentario en un comunicado', left(NEW.texto, 140),
    '/dashboard?view=explorar&comunicado=' || NEW.comunicado_id
  FROM user_roles r WHERE r.role = 'admin' AND r.user_id <> NEW.user_id;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'comunicado_comentario_aviso: %', SQLERRM;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_comunicado_comentario_aviso ON public.comunicado_comentarios;
CREATE TRIGGER trg_comunicado_comentario_aviso
  AFTER INSERT ON public.comunicado_comentarios
  FOR EACH ROW EXECUTE FUNCTION public.comunicado_comentario_aviso();
