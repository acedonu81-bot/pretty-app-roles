-- Feedback de la web (Ficha XDS 78,3, aprobada 26 oct 2026): una pregunta abierta
-- ("¿Qué es lo que más te falta o te ha frenado?"). Cualquiera puede ENVIAR
-- (también quien no tiene cuenta, p. ej. el particular tras su solicitud) pero
-- solo el admin LEE. El texto llega ya sin emails ni números largos desde el
-- cliente; aquí solo se limita el tamaño.
CREATE TABLE IF NOT EXISTS public.feedback_web (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  user_id uuid DEFAULT auth.uid(),
  rol text CHECK (rol IS NULL OR char_length(rol) <= 40),
  momento text NOT NULL CHECK (char_length(momento) BETWEEN 1 AND 40),
  path text CHECK (path IS NULL OR char_length(path) <= 200),
  texto text NOT NULL CHECK (char_length(texto) BETWEEN 3 AND 1000)
);

ALTER TABLE public.feedback_web ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Cualquiera envía feedback" ON public.feedback_web;
CREATE POLICY "Cualquiera envía feedback"
  ON public.feedback_web FOR INSERT TO anon, authenticated
  WITH CHECK (user_id IS NULL OR user_id = auth.uid());

DROP POLICY IF EXISTS "Admins leen feedback" ON public.feedback_web;
CREATE POLICY "Admins leen feedback"
  ON public.feedback_web FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'));

REVOKE ALL ON public.feedback_web FROM anon, authenticated;
GRANT INSERT (user_id, rol, momento, path, texto) ON public.feedback_web TO anon, authenticated;
GRANT SELECT ON public.feedback_web TO authenticated;
