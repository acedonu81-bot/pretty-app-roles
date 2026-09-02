-- Segunda mitad del arreglo de localizacion del 2 sep 2026 (ver
-- 20260902120000_profile_region_column.sql). Aquel dio a cada perfil su
-- comunidad; este limpia la ciudad en si.
--
-- zone es texto libre que teclea el profesional en Ajustes, sin trim ni
-- normalizacion, asi que en produccion convivian "Barcelona" y
-- "Barcelona, España" como si fueran ciudades distintas: cualquier filtro por
-- igualdad las trata como valores diferentes y esconde perfiles reales.
--
-- Se normaliza en la BD, no en el cliente, para que valga igual para el alta,
-- los ajustes, el panel de admin y cualquier import futuro.

CREATE OR REPLACE FUNCTION public.normalize_zone(p_zone text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
SET search_path = 'public'
AS $$
DECLARE
  z text := btrim(COALESCE(p_zone, ''));
BEGIN
  IF z = '' THEN RETURN NULL; END IF;

  -- Espacios internos repetidos a uno solo.
  z := regexp_replace(z, '\s+', ' ', 'g');

  -- Quita el sufijo de pais: "Barcelona, España" -> "Barcelona". Solo si queda
  -- algo delante, para no vaciar a quien puso literalmente "España".
  z := regexp_replace(z, '\s*,\s*(espa(n|ñ)a|spain)\s*$', '', 'i');

  z := btrim(z);
  IF z = '' THEN RETURN NULL; END IF;

  RETURN z;
END;
$$;

-- Un solo trigger normaliza zone y recalcula region a partir de la zona ya
-- limpia. Sustituye a profiles_sync_region, que solo hacia lo segundo: si se
-- dejaran los dos, el orden entre ellos decidiria si region se calcula sobre
-- el texto sucio o el limpio.
CREATE OR REPLACE FUNCTION public.profiles_sync_region()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
BEGIN
  NEW.zone := public.normalize_zone(NEW.zone);
  NEW.region := public.region_from_zone(NEW.zone);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_set_region ON public.profiles;
CREATE TRIGGER profiles_set_region
  BEFORE INSERT OR UPDATE OF zone ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.profiles_sync_region();

-- Backfill: limpia las zonas ya guardadas y recalcula su comunidad.
UPDATE public.profiles
   SET zone = public.normalize_zone(zone)
 WHERE zone IS NOT NULL
   AND zone IS DISTINCT FROM public.normalize_zone(zone);

UPDATE public.profiles SET region = public.region_from_zone(zone) WHERE zone IS NOT NULL;
