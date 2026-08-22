-- Policy huérfana (creada fuera de migraciones, USING (true) para rol
-- `public`) que anulaba el gate de completitud recién aplicado: al
-- combinarse por OR con las policies de authenticated/anon, cualquiera
-- podía seguir leyendo perfiles incompletos.
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
