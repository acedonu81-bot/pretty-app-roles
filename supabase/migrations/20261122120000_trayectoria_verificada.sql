-- Trayectoria verificada (22 nov 2026, diseño en
-- docs/superpowers/specs/2026-11-22-trayectoria-verificada-design.md).
-- Lo ejecuta Daniel en el SQL Editor. No toca tablas existentes.
--
-- trayectoria_eventos: los eventos que cada profesional enseña en su ficha.
--   El profesional crea, edita y borra los suyos, pero NUNCA decide la marca:
--   estado y origen los fija el servidor (confirmación del organizador o
--   acuerdo confirmado por las dos partes). El trigger lo fuerza en la API.
-- trayectoria_confirmaciones: a quién se pidió confirmar (solo un hash del
--   correo). Sin políticas: solo la clave de servicio la lee.
-- acuerdo_respuestas: la pregunta "¿se cerró el acuerdo?" a cada parte de una
--   contratación (Flash o solicitud). Fila creada al preguntar, respuesta al
--   contestar. Cada usuario ve solo la suya.

CREATE TABLE IF NOT EXISTS public.trayectoria_eventos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo text NOT NULL CHECK (char_length(titulo) BETWEEN 3 AND 120),
  tipo text CHECK (tipo IS NULL OR char_length(tipo) <= 60),
  fecha date NOT NULL,
  ciudad text CHECK (ciudad IS NULL OR char_length(ciudad) <= 80),
  lugar text CHECK (lugar IS NULL OR char_length(lugar) <= 120),
  foto_url text CHECK (foto_url IS NULL OR foto_url ~ '^https://'),
  origen text NOT NULL DEFAULT 'declarado' CHECK (origen IN ('declarado', 'xpeak')),
  estado text NOT NULL DEFAULT 'declarado' CHECK (estado IN ('declarado', 'pendiente', 'confirmado')),
  confirmado_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS trayectoria_eventos_user_idx ON public.trayectoria_eventos (user_id, fecha DESC);

ALTER TABLE public.trayectoria_eventos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "trayectoria: el dueño ve lo suyo" ON public.trayectoria_eventos;
CREATE POLICY "trayectoria: el dueño ve lo suyo" ON public.trayectoria_eventos
  FOR SELECT TO authenticated USING (user_id = auth.uid());
DROP POLICY IF EXISTS "trayectoria: el dueño crea lo suyo" ON public.trayectoria_eventos;
CREATE POLICY "trayectoria: el dueño crea lo suyo" ON public.trayectoria_eventos
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "trayectoria: el dueño edita lo suyo" ON public.trayectoria_eventos;
CREATE POLICY "trayectoria: el dueño edita lo suyo" ON public.trayectoria_eventos
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "trayectoria: el dueño borra lo suyo" ON public.trayectoria_eventos;
CREATE POLICY "trayectoria: el dueño borra lo suyo" ON public.trayectoria_eventos
  FOR DELETE TO authenticated USING (user_id = auth.uid());
GRANT SELECT, INSERT, UPDATE, DELETE ON public.trayectoria_eventos TO authenticated;

-- La marca la pone el servidor. Desde la API (auth.uid() con valor y no admin):
-- al crear, siempre "declarado"; al editar, la marca se conserva, y si se
-- cambia qué evento es (título, fecha o lugar) deja de estar confirmado.
CREATE OR REPLACE FUNCTION public.trayectoria_proteger_marca()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;
  IF TG_OP = 'INSERT' THEN
    -- Tope de eventos por profesional: la trayectoria es una ficha, no un archivo.
    -- El candado evita que dos inserciones simultáneas pasen el tope a la vez.
    PERFORM pg_advisory_xact_lock(hashtextextended(NEW.user_id::text, 0));
    IF (SELECT count(*) FROM public.trayectoria_eventos WHERE user_id = NEW.user_id) >= 200 THEN
      RAISE EXCEPTION 'Has llegado al máximo de eventos en tu trayectoria';
    END IF;
    NEW.origen := 'declarado';
    NEW.estado := 'declarado';
    NEW.confirmado_at := NULL;
    NEW.created_at := now();
    RETURN NEW;
  END IF;
  NEW.user_id := OLD.user_id;
  NEW.origen := OLD.origen;
  NEW.estado := OLD.estado;
  NEW.confirmado_at := OLD.confirmado_at;
  NEW.created_at := OLD.created_at;
  IF NEW.titulo IS DISTINCT FROM OLD.titulo OR NEW.fecha IS DISTINCT FROM OLD.fecha
     OR NEW.lugar IS DISTINCT FROM OLD.lugar OR NEW.ciudad IS DISTINCT FROM OLD.ciudad THEN
    NEW.origen := 'declarado';
    NEW.estado := 'declarado';
    NEW.confirmado_at := NULL;
    -- Si el evento cambia, deja de ser el de la contratación: se rompe el vínculo.
    UPDATE public.acuerdo_respuestas SET evento_id = NULL WHERE evento_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_trayectoria_proteger_marca ON public.trayectoria_eventos;
CREATE TRIGGER trg_trayectoria_proteger_marca
  BEFORE INSERT OR UPDATE ON public.trayectoria_eventos
  FOR EACH ROW EXECUTE FUNCTION public.trayectoria_proteger_marca();

CREATE TABLE IF NOT EXISTS public.trayectoria_confirmaciones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  evento_id uuid NOT NULL REFERENCES public.trayectoria_eventos(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_hash text NOT NULL,
  enviado_at timestamptz NOT NULL DEFAULT now(),
  confirmado_at timestamptz
);
CREATE INDEX IF NOT EXISTS trayectoria_confirmaciones_email_idx ON public.trayectoria_confirmaciones (email_hash, enviado_at);
CREATE INDEX IF NOT EXISTS trayectoria_confirmaciones_user_idx ON public.trayectoria_confirmaciones (user_id, enviado_at);
ALTER TABLE public.trayectoria_confirmaciones ENABLE ROW LEVEL SECURITY;
-- Sin políticas a propósito: ni el profesional ni el público ven los hashes.

CREATE TABLE IF NOT EXISTS public.acuerdo_respuestas (
  origen text NOT NULL CHECK (origen IN ('flash', 'solicitud')),
  origen_id uuid NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  respuesta text CHECK (respuesta IN ('si', 'no')),
  preguntado_at timestamptz NOT NULL DEFAULT now(),
  respondido_at timestamptz,
  evento_id uuid REFERENCES public.trayectoria_eventos(id) ON DELETE SET NULL,
  PRIMARY KEY (origen, origen_id, user_id)
);
ALTER TABLE public.acuerdo_respuestas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "acuerdos: cada uno ve la suya" ON public.acuerdo_respuestas;
CREATE POLICY "acuerdos: cada uno ve la suya" ON public.acuerdo_respuestas
  FOR SELECT TO authenticated USING (user_id = auth.uid());
GRANT SELECT ON public.acuerdo_respuestas TO authenticated;

-- Lectura pública de la trayectoria: nunca devuelve correos ni hashes.
CREATE OR REPLACE FUNCTION public.trayectoria_publica(p_user_id uuid)
RETURNS TABLE (id uuid, titulo text, tipo text, fecha date, ciudad text, lugar text, foto_url text, estado text, origen text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT e.id, e.titulo, e.tipo, e.fecha, e.ciudad, e.lugar, e.foto_url, e.estado, e.origen
  FROM public.trayectoria_eventos e
  WHERE e.user_id = p_user_id
  ORDER BY e.fecha DESC
  LIMIT 100;
$$;
GRANT EXECUTE ON FUNCTION public.trayectoria_publica(uuid) TO anon, authenticated;

-- Contador para tarjetas del directorio, en una sola llamada para muchos perfiles.
CREATE OR REPLACE FUNCTION public.trayectoria_confirmados(p_user_ids uuid[])
RETURNS TABLE (user_id uuid, confirmados int)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT e.user_id, count(*)::int
  FROM public.trayectoria_eventos e
  WHERE e.user_id = ANY (p_user_ids[1:200]) AND (e.estado = 'confirmado' OR e.origen = 'xpeak')
  GROUP BY e.user_id;
$$;
GRANT EXECUTE ON FUNCTION public.trayectoria_confirmados(uuid[]) TO anon, authenticated;

-- Comparación para el panel de admin: cuántas contrataciones preguntadas
-- cierran según las dos partes (ambos_no = nadie dijo que sí y alguien dijo que no),
-- y de dónde vienen los eventos de las trayectorias.
CREATE OR REPLACE FUNCTION public.acuerdos_comparacion()
RETURNS TABLE (preguntadas int, ambos_si int, solo_uno_si int, ambos_no int, sin_respuesta int, eventos_xpeak int, eventos_fuera int)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Solo admin';
  END IF;
  RETURN QUERY
  WITH por_origen AS (
    SELECT a.origen, a.origen_id,
      count(*) FILTER (WHERE a.respuesta = 'si') AS si,
      count(*) FILTER (WHERE a.respuesta = 'no') AS no,
      count(*) FILTER (WHERE a.respuesta IS NULL) AS nulas,
      count(*) AS total
    FROM public.acuerdo_respuestas a
    GROUP BY a.origen, a.origen_id
  )
  SELECT
    (SELECT count(*) FROM por_origen)::int,
    (SELECT count(*) FROM por_origen WHERE si >= 2)::int,
    (SELECT count(*) FROM por_origen WHERE si = 1)::int,
    (SELECT count(*) FROM por_origen WHERE si = 0 AND no >= 1)::int,
    (SELECT count(*) FROM por_origen WHERE nulas = total)::int,
    (SELECT count(*) FROM public.trayectoria_eventos WHERE origen = 'xpeak')::int,
    (SELECT count(*) FROM public.trayectoria_eventos WHERE origen = 'declarado')::int;
END;
$$;
GRANT EXECUTE ON FUNCTION public.acuerdos_comparacion() TO authenticated;
