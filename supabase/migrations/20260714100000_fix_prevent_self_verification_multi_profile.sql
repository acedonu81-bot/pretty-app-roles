-- prevent_self_verification() comprobaba el rol de sistema con
-- `SELECT role FROM profiles WHERE user_id = auth.uid()`, asumiendo un
-- único perfil por usuario. Con multi-perfil (varias filas por
-- user_id) esa subquery devuelve más de una fila y Postgres lanza
-- "more than one row returned by a subquery used as an expression"
-- en cualquier UPDATE de profiles para esas cuentas. Se reemplaza por
-- has_role(), que ya consulta la tabla separada user_roles (rol de
-- sistema real, admin/user), igual que hace prevent_privilege_escalation.
CREATE OR REPLACE FUNCTION public.prevent_self_verification()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    NEW.is_verified := OLD.is_verified;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
