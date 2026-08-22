-- Los perfiles sin foto ni bio (onboarding incompleto) ya no deben ser
-- legibles por otros usuarios ni por anon. El propio dueño siempre puede
-- ver y editar su ficha para poder completarla.

DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Anon can view basic profiles" ON public.profiles;

CREATE POLICY "Authenticated users can view profiles"
ON public.profiles FOR SELECT TO authenticated
USING (
  user_id = auth.uid()
  OR public.has_role(auth.uid(), 'admin')
  OR (photo_url IS NOT NULL AND bio IS NOT NULL AND length(trim(bio)) > 0)
);

CREATE POLICY "Anon can view basic profiles"
ON public.profiles FOR SELECT TO anon
USING (photo_url IS NOT NULL AND bio IS NOT NULL AND length(trim(bio)) > 0);
