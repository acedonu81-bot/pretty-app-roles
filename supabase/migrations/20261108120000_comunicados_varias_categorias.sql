-- 8 nov 2026: un comunicado puede avisar a varias categorias sin duplicarlo.
-- `categoria` sigue siendo la principal; `categorias_extra` suma otras.
-- Lo usan el trigger de avisos, la politica de lectura y puede_ver_comunicado.

ALTER TABLE public.comunicados
  ADD COLUMN IF NOT EXISTS categorias_extra text[] NOT NULL DEFAULT '{}'
  CHECK (categorias_extra <@ ARRAY['musica','sala','imagen','azafatas','belleza','entretenimiento','tecnica','organizadores']::text[]);

-- ¿El usuario esta en la categoria principal o en alguna extra?
CREATE OR REPLACE FUNCTION public.usuario_en_categorias(p_user uuid, p_categoria text, p_extra text[])
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT public.usuario_en_categoria(p_user, p_categoria)
    OR EXISTS (SELECT 1 FROM unnest(COALESCE(p_extra, '{}')) e WHERE public.usuario_en_categoria(p_user, e))
$$;

DROP POLICY IF EXISTS "Comunicados: leen los de su categoria o mencionados" ON public.comunicados;
CREATE POLICY "Comunicados: leen los de su categoria o mencionados" ON public.comunicados
  FOR SELECT TO authenticated
  USING (public.is_admin() OR (caduca_at > now() AND (
    public.usuario_en_categorias(auth.uid(), categoria, categorias_extra)
    OR position(auth.uid()::text in cuerpo) > 0)));

CREATE OR REPLACE FUNCTION public.puede_ver_comunicado(p_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT public.is_admin() OR EXISTS (
    SELECT 1 FROM comunicados c
    WHERE c.id = p_id AND (
      c.publico
      OR (c.caduca_at > now() AND (
        public.usuario_en_categorias(auth.uid(), c.categoria, c.categorias_extra)
        OR position(auth.uid()::text in c.cuerpo) > 0))
    )
  )
$$;

-- Trigger de avisos: igual que antes, pero tambien a las categorias extra.
CREATE OR REPLACE FUNCTION public.comunicado_difundir()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  v_link text := '/dashboard?view=explorar&comunicado=' || NEW.id;
  v_plano text;
  v_menciones uuid[];
  v_user uuid;
  v_n integer := 0;
BEGIN
  v_plano := regexp_replace(COALESCE(NEW.cuerpo, ''), '@\[([^\]]+)\]\([0-9a-f-]{36}\)', '\1', 'g');
  v_plano := btrim(regexp_replace(v_plano, '\s+', ' ', 'g'));
  IF length(v_plano) > 140 THEN v_plano := left(v_plano, 140) || '…'; END IF;

  SELECT COALESCE(array_agg(DISTINCT m[1]::uuid), '{}') INTO v_menciones
  FROM regexp_matches(COALESCE(NEW.cuerpo, ''), '@\[[^\]]+\]\(([0-9a-f-]{36})\)', 'g') AS m
  WHERE EXISTS (SELECT 1 FROM profiles p WHERE p.user_id = m[1]::uuid);

  FOR v_user IN
    SELECT DISTINCT p.user_id FROM profiles p
    WHERE p.user_id IS NOT NULL
      AND COALESCE(p.is_seed, false) = false
      AND public.categoria_de_rol(p.role) IS NOT NULL
      AND (NEW.categoria = 'todos'
           OR public.categoria_de_rol(p.role) = NEW.categoria
           OR public.categoria_de_rol(p.role) = ANY (COALESCE(NEW.categorias_extra, '{}')))
      AND NOT (p.user_id = ANY (v_menciones))
  LOOP
    v_n := v_n + 1;
    INSERT INTO notifications (user_id, type, title, body, link)
    VALUES (v_user, 'comunicado', NEW.titulo, NULLIF(v_plano, ''), v_link);
    IF NEW.push AND EXISTS (SELECT 1 FROM push_subscriptions s WHERE s.user_id = v_user) THEN
      PERFORM public.comunicado_push(v_user, NEW.titulo, COALESCE(NULLIF(v_plano, ''), 'Nuevo comunicado de XPEAK'), v_link, 'comunicado-' || NEW.id);
    END IF;
  END LOOP;

  FOREACH v_user IN ARRAY v_menciones LOOP
    v_n := v_n + 1;
    INSERT INTO notifications (user_id, type, title, body, link)
    VALUES (v_user, 'mencion', 'XPEAK te ha mencionado', NEW.titulo, v_link);
    IF EXISTS (SELECT 1 FROM push_subscriptions s WHERE s.user_id = v_user) THEN
      PERFORM public.comunicado_push(v_user, 'XPEAK te ha mencionado', NEW.titulo, v_link, 'mencion-' || NEW.id);
    END IF;
  END LOOP;

  UPDATE comunicados SET destinatarios = v_n WHERE id = NEW.id;
  RETURN NEW;
END $$;
