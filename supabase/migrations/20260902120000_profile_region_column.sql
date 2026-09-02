-- El filtro por comunidad del directorio no encontraba a los profesionales de
-- ciudades no listadas a mano en src/lib/regions.ts. El caso que lo destapó:
-- una profesional de Benidorm (2 sep 2026) no aparecía al filtrar por Comunidad
-- Valenciana, porque la lista solo tenía Valencia/Alicante/Castellón y el filtro
-- era un OR de zone ilike '%ciudad%'.
--
-- Alcance real medido en producción antes del arreglo: de ~37 perfiles con zona,
-- 16 eran invisibles en TODOS los filtros de comunidad — 14 con zone='España'
-- (el valor por defecto del alta), más Benidorm y Pontevedra.
--
-- Causa raíz: zone es texto libre que teclea el usuario ("Benidorm",
-- "Barcelona, España", "Sevilla, España"...), y ninguna lista de ciudades
-- mantenida a mano cubre los ~8.000 municipios. Mismo patrón que el bug de
-- is_primary (31 ago): un filtro escondiendo inventario real.
--
-- Solución: se guarda la comunidad en su propia columna, derivada de zone por
-- una función que sí conoce el mapa provincia/ciudad -> comunidad. El filtro
-- pasa a comparar region por igualdad en vez de adivinar por texto, y los
-- perfiles nuevos la reciben automáticamente vía trigger.

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS region text;

COMMENT ON COLUMN public.profiles.region IS
  'Comunidad autónoma derivada de zone por public.region_from_zone(). La mantiene al día el trigger profiles_set_region; no se edita a mano.';

-- unaccent() no es IMMUTABLE por defecto (depende de diccionario), así que se
-- envuelve para poder usarla dentro de una función IMMUTABLE y en índices.
CREATE OR REPLACE FUNCTION public.unaccent_immutable(text)
RETURNS text
LANGUAGE sql
IMMUTABLE
SET search_path = 'public, extensions'
AS $$ SELECT translate($1,
  'áàäâãéèëêíìïîóòöôõúùüûñçÁÀÄÂÃÉÈËÊÍÌÏÎÓÒÖÔÕÚÙÜÛÑÇ',
  'aaaaaeeeeiiiiooooouuuuncAAAAAEEEEIIIIOOOOOUUUUNC') $$;

-- Deriva la comunidad autónoma a partir del texto libre de zone.
-- Estrategia: buscar la ciudad/provincia dentro del texto (zone puede venir
-- como "Barcelona, España"), de más específico a más genérico. Devuelve NULL
-- si no se reconoce, y para el 'España' por defecto del alta, que no aporta
-- ninguna comunidad concreta.
CREATE OR REPLACE FUNCTION public.region_from_zone(p_zone text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
SET search_path = 'public'
AS $$
DECLARE
  z text := lower(unaccent_immutable(COALESCE(p_zone, '')));
BEGIN
  IF z = '' THEN RETURN NULL; END IF;

  -- Andalucía
  IF z ~ '(sevilla|malaga|marbella|torremolinos|benalmadena|fuengirola|estepona|granada|cordoba|cadiz|jerez|algeciras|almeria|jaen|huelva|roquetas|el ejido|dos hermanas|mijas|nerja|motril|linares|andalucia)' THEN RETURN 'Andalucía'; END IF;
  -- Aragón
  IF z ~ '(zaragoza|huesca|teruel|calatayud|jaca|aragon)' THEN RETURN 'Aragón'; END IF;
  -- Asturias
  IF z ~ '(gijon|oviedo|aviles|langreo|mieres|asturias)' THEN RETURN 'Asturias'; END IF;
  -- Islas Baleares
  IF z ~ '(palma|mallorca|ibiza|eivissa|menorca|mahon|formentera|magaluf|calvia|manacor|baleares|balears)' THEN RETURN 'Islas Baleares'; END IF;
  -- Canarias
  IF z ~ '(tenerife|las palmas|gran canaria|lanzarote|fuerteventura|la palma|gomera|hierro|maspalomas|arona|adeje|puerto de la cruz|canarias)' THEN RETURN 'Canarias'; END IF;
  -- Cantabria
  IF z ~ '(santander|torrelavega|castro urdiales|cantabria)' THEN RETURN 'Cantabria'; END IF;
  -- Castilla-La Mancha
  IF z ~ '(toledo|albacete|ciudad real|guadalajara|cuenca|talavera|puertollano|castilla-la mancha|castilla la mancha)' THEN RETURN 'Castilla-La Mancha'; END IF;
  -- Castilla y León
  IF z ~ '(valladolid|salamanca|burgos|leon|zamora|palencia|segovia|avila|soria|ponferrada|castilla y leon)' THEN RETURN 'Castilla y León'; END IF;
  -- Cataluña
  IF z ~ '(barcelona|girona|gerona|tarragona|lleida|lerida|badalona|hospitalet|sabadell|terrassa|sitges|salou|lloret|matar|reus|manresa|cataluna|catalunya)' THEN RETURN 'Cataluña'; END IF;
  -- Extremadura
  IF z ~ '(badajoz|caceres|merida|plasencia|don benito|extremadura)' THEN RETURN 'Extremadura'; END IF;
  -- Galicia
  IF z ~ '(a coruna|la coruna|coruna|vigo|santiago|pontevedra|ourense|orense|lugo|ferrol|sanxenxo|galicia)' THEN RETURN 'Galicia'; END IF;
  -- Murcia
  IF z ~ '(murcia|cartagena|lorca|molina de segura|mazarron|la manga)' THEN RETURN 'Murcia'; END IF;
  -- Navarra
  IF z ~ '(pamplona|tudela|navarra|iruna)' THEN RETURN 'Navarra'; END IF;
  -- País Vasco
  IF z ~ '(bilbao|san sebastian|donostia|vitoria|gasteiz|barakaldo|getxo|irun|eibar|pais vasco|euskadi)' THEN RETURN 'País Vasco'; END IF;
  -- La Rioja
  IF z ~ '(logrono|calahorra|la rioja)' THEN RETURN 'La Rioja'; END IF;
  -- Comunidad Valenciana (incluye Benidorm y la costa alicantina)
  IF z ~ '(valencia|alicante|alacant|castellon|benidorm|elche|elx|torrevieja|gandia|denia|javea|calpe|altea|villajoyosa|orihuela|sagunto|vinaros|peniscola|cullera|oliva|santa pola|comunidad valenciana|comunitat valenciana)' THEN RETURN 'Comunidad Valenciana'; END IF;
  -- Madrid (al final: "madrid" aparece dentro de otros textos con menos riesgo)
  IF z ~ '(madrid|mostoles|alcala de henares|getafe|leganes|alcorcon|fuenlabrada|torrejon|parla|alcobendas|las rozas|pozuelo|majadahonda|rivas)' THEN RETURN 'Madrid'; END IF;

  -- 'España' genérico y cualquier cosa no reconocida: sin comunidad concreta.
  RETURN NULL;
END;
$$;

-- Mantiene region sincronizada con zone en alta y edición.
CREATE OR REPLACE FUNCTION public.profiles_sync_region()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
BEGIN
  NEW.region := public.region_from_zone(NEW.zone);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_set_region ON public.profiles;
CREATE TRIGGER profiles_set_region
  BEFORE INSERT OR UPDATE OF zone ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.profiles_sync_region();

-- Backfill de los perfiles que ya existen.
UPDATE public.profiles SET region = public.region_from_zone(zone) WHERE zone IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_region ON public.profiles (region) WHERE region IS NOT NULL;
