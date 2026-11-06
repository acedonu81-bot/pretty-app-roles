-- 6 nov 2026: tablón de comunicados internos (XDS 75,0, aprobado por el usuario).
-- El admin escribe un comunicado, elige la categoría y opcionalmente manda push
-- SOLO a esa categoría. Sale en un carrusel del panel (estilo "Últimas
-- noticias" de Hearthis) y en la campana. Las menciones @[Nombre](user_id)
-- son clicables y avisan al mencionado. Interno: solo con sesión.

-- Categoría de un rol: mismos grupos que DashboardSidebar (DIRECTORY_GROUPS)
-- más organizadores. 'pending' y roles desconocidos dan NULL (no reciben nada).
CREATE OR REPLACE FUNCTION public.categoria_de_rol(p_role text)
RETURNS text LANGUAGE sql IMMUTABLE SET search_path TO 'public' AS $$
  SELECT CASE
    WHEN p_role IN ('dj','grupo-musical','disco-movil','emergentes','rookie') THEN 'musica'
    WHEN p_role IN ('staff','camarero','catering','food-truck','local_eventos','limpieza') THEN 'sala'
    WHEN p_role IN ('media','photo-booth','design') THEN 'imagen'
    WHEN p_role IN ('azafata','event_manager','promotor','speaker') THEN 'azafatas'
    WHEN p_role IN ('makeup','peluqueria','vestuario') THEN 'belleza'
    WHEN p_role IN ('bailarin','mago','humorista','monologo','animador','payaso','navidad') THEN 'entretenimiento'
    WHEN p_role IN ('tecnico','alquiler') THEN 'tecnica'
    WHEN p_role = 'empresario' THEN 'organizadores'
    ELSE NULL
  END
$$;

CREATE TABLE IF NOT EXISTS public.comunicados (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL CHECK (length(trim(titulo)) BETWEEN 1 AND 120),
  cuerpo text NOT NULL DEFAULT '' CHECK (length(cuerpo) <= 4000),
  imagen_url text,
  video_url text,
  cta_texto text CHECK (cta_texto IS NULL OR length(cta_texto) <= 40),
  cta_url text,
  categoria text NOT NULL DEFAULT 'todos' CHECK (categoria IN
    ('todos','musica','sala','imagen','azafatas','belleza','entretenimiento','tecnica','organizadores')),
  push boolean NOT NULL DEFAULT false,
  fijado boolean NOT NULL DEFAULT false,
  caduca_at timestamptz NOT NULL DEFAULT (now() + interval '30 days'),
  destinatarios integer NOT NULL DEFAULT 0,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS comunicados_vigentes_idx ON public.comunicados (caduca_at DESC, created_at DESC);

CREATE TABLE IF NOT EXISTS public.comunicado_lecturas (
  comunicado_id uuid NOT NULL REFERENCES public.comunicados(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  leido_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (comunicado_id, user_id)
);

ALTER TABLE public.comunicados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comunicado_lecturas ENABLE ROW LEVEL SECURITY;

-- ¿Este usuario pertenece a la categoría? Cualquiera de sus perfiles cuenta.
CREATE OR REPLACE FUNCTION public.usuario_en_categoria(p_user uuid, p_categoria text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.user_id = p_user
      AND public.categoria_de_rol(p.role) IS NOT NULL
      AND (p_categoria = 'todos' OR public.categoria_de_rol(p.role) = p_categoria)
  )
$$;

CREATE POLICY "Comunicados: leen los de su categoria" ON public.comunicados
  FOR SELECT TO authenticated
  USING (public.is_admin() OR (caduca_at > now() AND public.usuario_en_categoria(auth.uid(), categoria)));
CREATE POLICY "Comunicados: admin crea" ON public.comunicados
  FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Comunicados: admin edita" ON public.comunicados
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Comunicados: admin borra" ON public.comunicados
  FOR DELETE TO authenticated USING (public.is_admin());

CREATE POLICY "Lecturas: cada uno la suya" ON public.comunicado_lecturas
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Lecturas: propias o admin" ON public.comunicado_lecturas
  FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin());

GRANT SELECT, INSERT, UPDATE, DELETE ON public.comunicados TO authenticated;
GRANT SELECT, INSERT ON public.comunicado_lecturas TO authenticated;

-- Push a un usuario por la función send-push (mismo patrón que
-- push_nueva_reserva_flash). Un fallo no rompe el comunicado.
CREATE OR REPLACE FUNCTION public.comunicado_push(p_user uuid, p_titulo text, p_cuerpo text, p_url text, p_tag text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/send-push',
    headers := jsonb_build_object(
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkcnFod3JhdnVwanp5c3JpYmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NjkwMTIsImV4cCI6MjA5MDE0NTAxMn0.sHR3zuVWIj6Xw_UBI_kuQCcfEFS3oQWjs0dKUtr2Puk',
      'x-internal-secret', (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'send_email_internal_secret'),
      'Content-Type', 'application/json'),
    body := jsonb_build_object('user_id', p_user, 'title', p_titulo, 'body', p_cuerpo, 'url', p_url, 'tag', p_tag));
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'comunicado_push: %', SQLERRM;
END $$;
REVOKE ALL ON FUNCTION public.comunicado_push(uuid, text, text, text, text) FROM PUBLIC, anon, authenticated;

-- Al publicar: aviso en la campana a toda la categoría, push solo si se marcó,
-- y aviso propio (siempre con push) a cada profesional mencionado.
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
      AND (NEW.categoria = 'todos' OR public.categoria_de_rol(p.role) = NEW.categoria)
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

DROP TRIGGER IF EXISTS trg_comunicado_difundir ON public.comunicados;
CREATE TRIGGER trg_comunicado_difundir
  AFTER INSERT ON public.comunicados
  FOR EACH ROW EXECUTE FUNCTION public.comunicado_difundir();

-- Menciones del editor: el admin busca profesionales por nombre.
CREATE OR REPLACE FUNCTION public.admin_buscar_mencion(p_q text)
RETURNS TABLE (user_id uuid, display_name text, role text, photo_url text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT DISTINCT ON (p.user_id) p.user_id, p.display_name, p.role, p.photo_url
  FROM profiles p
  WHERE public.is_admin()
    AND p.user_id IS NOT NULL
    AND COALESCE(p.is_seed, false) = false
    AND public.categoria_de_rol(p.role) IS NOT NULL
    AND length(trim(p_q)) >= 2
    AND p.display_name ILIKE '%' || trim(p_q) || '%'
  ORDER BY p.user_id, p.display_name
  LIMIT 8
$$;
GRANT EXECUTE ON FUNCTION public.admin_buscar_mencion(text) TO authenticated;

-- Fotos y vídeos de los comunicados: lectura pública (las URLs van en el
-- panel con sesión), subida solo admin. Vídeo hasta 100 MB.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('comunicados', 'comunicados', true, 104857600,
  ARRAY['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm','video/quicktime'])
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Comunicados media: admin sube" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'comunicados' AND public.is_admin());
CREATE POLICY "Comunicados media: admin borra" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'comunicados' AND public.is_admin());
