-- Gate de visibilidad: un perfil pending/rejected/awaiting_admin/rookie deja
-- de ser visible para el publico. Solo el dueno de la fila y un admin lo ven
-- mientras no esta approved. Ver docs/superpowers/specs/2026-09-22-revision-alta-nueva-design.md

BEGIN;

DROP POLICY IF EXISTS "Anon can view basic profiles" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;

CREATE POLICY "Anon can view approved profiles" ON public.profiles FOR SELECT TO anon
  USING (validation_status = 'approved');

CREATE POLICY "Authenticated can view approved or own profiles" ON public.profiles FOR SELECT TO authenticated
  USING (
    validation_status = 'approved'
    OR (select auth.uid()) = user_id
    OR has_role((select auth.uid()), 'admin'::text)
  );

-- Backfill: los perfiles pending existentes llevan tiempo visibles sin que
-- nadie los revisara nunca (el campo no bloqueaba nada hasta ahora). El gate
-- nuevo aplica solo hacia adelante, a altas futuras.
UPDATE public.profiles SET validation_status = 'approved' WHERE validation_status = 'pending';

COMMIT;
