-- El gate de completitud (foto y/o bio obligatorios) ocultaba perfiles
-- reales de golpe, incluso relajado a OR — decisión explícita del
-- usuario: con volumen real de suscriptores un filtro así no es
-- sostenible sin aviso previo. Se quita del todo; todos los perfiles
-- reales (is_seed=false o admin) vuelven a ser visibles.

DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Anon can view basic profiles" ON public.profiles;

CREATE POLICY "Authenticated users can view profiles"
ON public.profiles FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Anon can view basic profiles"
ON public.profiles FOR SELECT TO anon
USING (true);
