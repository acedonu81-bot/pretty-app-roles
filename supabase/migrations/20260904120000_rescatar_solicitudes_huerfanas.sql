-- Las solicitudes enviadas sin cuenta quedaban ilegibles para siempre.
--
-- La RLS de lectura de flash_bookings es:
--   professional_user_id = auth.uid()  OR  created_by = auth.uid()
-- Con created_by = NULL, el organizador NUNCA podía volver a ver su propia
-- solicitud: ni en su Historial ni en ninguna otra vista. 34 de 36 filas
-- quedaron así, incluidas las 5 de Ramón (22 ago 2026), que además llevan su
-- teléfono como único rastro.
--
-- El código ya no fuerza NULL cuando hay sesión. Falta el otro caso: quien
-- contacta sin cuenta y se registra DESPUÉS con el mismo email. Este trigger
-- le devuelve sus solicitudes al crear la cuenta, en vez de dejarle un panel
-- vacío con el histórico perdido.
CREATE OR REPLACE FUNCTION public.reclamar_solicitudes_huerfanas()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Solo por email y con coincidencia exacta (normalizada): el teléfono no se
  -- puede cruzar de forma fiable con auth.users, y emparejar de más le daría a
  -- alguien las solicitudes de otra persona. Ante la duda, no se reclama.
  IF NEW.email IS NULL OR trim(NEW.email) = '' THEN
    RETURN NEW;
  END IF;

  UPDATE public.flash_bookings
     SET created_by = NEW.id
   WHERE created_by IS NULL
     AND lower(trim(requester_contact)) = lower(trim(NEW.email));

  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS reclamar_solicitudes_al_registrarse ON auth.users;
CREATE TRIGGER reclamar_solicitudes_al_registrarse
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.reclamar_solicitudes_huerfanas();

-- Y para las cuentas que YA existen: se reclama lo que les corresponda por
-- email. Es idempotente — solo toca filas con created_by NULL.
UPDATE public.flash_bookings b
   SET created_by = u.id
  FROM auth.users u
 WHERE b.created_by IS NULL
   AND b.requester_contact IS NOT NULL
   AND lower(trim(b.requester_contact)) = lower(trim(u.email));
