-- 16 nov 2026: corrige 20261116120000. El valor por defecto en true se aplicaba
-- a TODAS las cuentas nuevas, también a los particulares (se crean con
-- user_metadata.particular = 'true' desde particular-solicitud). Decisión de
-- Daniel: solo se muestran por defecto las EMPRESAS.
--
-- Ahora el defecto vuelve a false y un trigger lo pone a true únicamente cuando
-- una cuenta NUEVA (creada desde el 16 nov 2026) pasa a rol empresario y no es
-- particular. Las cuentas anteriores, incluido el cambio masivo de pending a
-- empresario previsto para el 28 nov, no se tocan: nadie aparece sin haberlo
-- elegido. Cualquiera puede quitarse desde su panel o desde Ajustes.
ALTER TABLE public.profiles ALTER COLUMN mostrar_organizador SET DEFAULT false;

CREATE OR REPLACE FUNCTION public.mostrar_organizador_al_ser_empresa()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role::text = 'empresario'
     AND (TG_OP = 'INSERT' OR OLD.role IS DISTINCT FROM NEW.role)
     AND NEW.created_at >= timestamptz '2026-11-16 00:00:00+01'
     AND NOT EXISTS (
       SELECT 1 FROM auth.users u
        WHERE u.id = NEW.user_id
          AND u.raw_user_meta_data ->> 'particular' = 'true')
  THEN
    NEW.mostrar_organizador := true;
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.mostrar_organizador_al_ser_empresa() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_mostrar_organizador_al_ser_empresa ON public.profiles;
CREATE TRIGGER trg_mostrar_organizador_al_ser_empresa
  BEFORE INSERT OR UPDATE OF role ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.mostrar_organizador_al_ser_empresa();
