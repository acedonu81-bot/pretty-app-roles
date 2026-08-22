-- La política anterior exigía foto Y bio a la vez (AND), pero el
-- comentario original decía "sin foto ni bio" (ninguno de los dos) —
-- error de lógica: ocultaba perfiles reales con solo una de las dos
-- rellena (ej. con foto pero sin bio). Se relaja a foto O bio.

DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Anon can view basic profiles" ON public.profiles;

CREATE POLICY "Authenticated users can view profiles"
ON public.profiles FOR SELECT TO authenticated
USING (
  user_id = auth.uid()
  OR public.has_role(auth.uid(), 'admin')
  OR (photo_url IS NOT NULL OR (bio IS NOT NULL AND length(trim(bio)) > 0))
);

CREATE POLICY "Anon can view basic profiles"
ON public.profiles FOR SELECT TO anon
USING (photo_url IS NOT NULL OR (bio IS NOT NULL AND length(trim(bio)) > 0));
