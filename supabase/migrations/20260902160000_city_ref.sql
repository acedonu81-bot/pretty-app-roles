-- Tercera pieza del arreglo de localizacion del 2 sep 2026, tras
-- 20260902120000 (region) y 20260902140000 (normalizacion de zone).
--
-- Problema que resuelve: un profesional de un pueblo pequeño (Villajoyosa,
-- Torrevieja, Sanxenxo...) escribe su pueblo real, pero las paginas de ciudad
-- y las busquedas van por ciudades grandes. Sin traduccion, ese profesional es
-- invisible aunque trabaje a 15 km de donde le buscan.
--
-- La alternativa era pedirle que se registrara "en su ciudad mas cercana",
-- pero eso falsea el dato: su ficha diria una ciudad donde no vive. Aqui se
-- guarda su pueblo real en zone Y se deriva ademas la ciudad grande de
-- referencia, para que aparezca en ambas busquedas sin mentir en la ficha.

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city_ref text;

COMMENT ON COLUMN public.profiles.city_ref IS
  'Ciudad grande de referencia para busquedas y paginas SEO, derivada de zone por city_ref_from_zone(). El profesional conserva su pueblo real en zone.';

-- Traduce la zona (pueblo o ciudad) a la ciudad grande bajo la que se busca.
-- Si la zona ya ES una ciudad grande, se devuelve tal cual.
CREATE OR REPLACE FUNCTION public.city_ref_from_zone(p_zone text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
SET search_path = 'public'
AS $$
DECLARE
  z text := lower(public.unaccent_immutable(COALESCE(p_zone, '')));
BEGIN
  IF z = '' THEN RETURN NULL; END IF;

  -- Area de Alicante / Costa Blanca
  IF z ~ '(benidorm|villajoyosa|altea|calpe|calp|denia|javea|xabia|torrevieja|orihuela|santa pola|elche|elx|alacant|alicante)' THEN RETURN 'Alicante'; END IF;
  -- Area de Valencia
  IF z ~ '(gandia|sagunto|cullera|oliva|paterna|torrent|valencia)' THEN RETURN 'Valencia'; END IF;
  IF z ~ '(castellon|vinaros|peniscola|benicassim)' THEN RETURN 'Castellón'; END IF;
  -- Area de Madrid
  IF z ~ '(mostoles|alcala de henares|getafe|leganes|alcorcon|fuenlabrada|torrejon|parla|alcobendas|las rozas|pozuelo|majadahonda|rivas|madrid)' THEN RETURN 'Madrid'; END IF;
  -- Cataluña
  IF z ~ '(badalona|hospitalet|sabadell|terrassa|sitges|mataro|manresa|barcelona)' THEN RETURN 'Barcelona'; END IF;
  IF z ~ '(salou|cambrils|reus|tarragona)' THEN RETURN 'Tarragona'; END IF;
  IF z ~ '(lloret|blanes|figueres|girona|gerona)' THEN RETURN 'Girona'; END IF;
  -- Andalucia
  IF z ~ '(marbella|torremolinos|benalmadena|fuengirola|estepona|mijas|nerja|malaga)' THEN RETURN 'Málaga'; END IF;
  IF z ~ '(dos hermanas|utrera|sevilla)' THEN RETURN 'Sevilla'; END IF;
  IF z ~ '(jerez|algeciras|cadiz)' THEN RETURN 'Cádiz'; END IF;
  IF z ~ '(motril|granada)' THEN RETURN 'Granada'; END IF;
  IF z ~ '(roquetas|el ejido|almeria)' THEN RETURN 'Almería'; END IF;
  IF z ~ '(cordoba)' THEN RETURN 'Córdoba'; END IF;
  IF z ~ '(linares|jaen)' THEN RETURN 'Jaén'; END IF;
  IF z ~ '(huelva)' THEN RETURN 'Huelva'; END IF;
  -- Baleares y Canarias
  IF z ~ '(magaluf|calvia|manacor|palma|mallorca)' THEN RETURN 'Palma'; END IF;
  IF z ~ '(ibiza|eivissa|sant antoni)' THEN RETURN 'Ibiza'; END IF;
  IF z ~ '(mahon|menorca)' THEN RETURN 'Menorca'; END IF;
  IF z ~ '(arona|adeje|puerto de la cruz|tenerife)' THEN RETURN 'Tenerife'; END IF;
  IF z ~ '(maspalomas|gran canaria|las palmas)' THEN RETURN 'Las Palmas'; END IF;
  IF z ~ '(lanzarote|arrecife)' THEN RETURN 'Lanzarote'; END IF;
  IF z ~ '(fuerteventura|corralejo)' THEN RETURN 'Fuerteventura'; END IF;
  -- Norte
  IF z ~ '(barakaldo|getxo|bilbao)' THEN RETURN 'Bilbao'; END IF;
  IF z ~ '(irun|san sebastian|donostia)' THEN RETURN 'San Sebastián'; END IF;
  IF z ~ '(vitoria|gasteiz)' THEN RETURN 'Vitoria'; END IF;
  IF z ~ '(torrelavega|castro urdiales|santander)' THEN RETURN 'Santander'; END IF;
  IF z ~ '(aviles|oviedo)' THEN RETURN 'Oviedo'; END IF;
  IF z ~ '(gijon)' THEN RETURN 'Gijón'; END IF;
  IF z ~ '(pamplona|iruna|tudela)' THEN RETURN 'Pamplona'; END IF;
  IF z ~ '(logrono|calahorra)' THEN RETURN 'Logroño'; END IF;
  -- Galicia
  IF z ~ '(ferrol|a coruna|la coruna|coruna)' THEN RETURN 'A Coruña'; END IF;
  IF z ~ '(sanxenxo|pontevedra|vilagarcia)' THEN RETURN 'Pontevedra'; END IF;
  IF z ~ '(vigo)' THEN RETURN 'Vigo'; END IF;
  IF z ~ '(santiago)' THEN RETURN 'Santiago'; END IF;
  IF z ~ '(ourense|orense)' THEN RETURN 'Ourense'; END IF;
  IF z ~ '(lugo)' THEN RETURN 'Lugo'; END IF;
  -- Resto de capitales
  IF z ~ '(zaragoza)' THEN RETURN 'Zaragoza'; END IF;
  IF z ~ '(huesca)' THEN RETURN 'Huesca'; END IF;
  IF z ~ '(teruel)' THEN RETURN 'Teruel'; END IF;
  IF z ~ '(cartagena)' THEN RETURN 'Cartagena'; END IF;
  IF z ~ '(lorca|murcia)' THEN RETURN 'Murcia'; END IF;
  IF z ~ '(talavera|toledo)' THEN RETURN 'Toledo'; END IF;
  IF z ~ '(albacete)' THEN RETURN 'Albacete'; END IF;
  IF z ~ '(puertollano|ciudad real)' THEN RETURN 'Ciudad Real'; END IF;
  IF z ~ '(guadalajara)' THEN RETURN 'Guadalajara'; END IF;
  IF z ~ '(cuenca)' THEN RETURN 'Cuenca'; END IF;
  IF z ~ '(valladolid)' THEN RETURN 'Valladolid'; END IF;
  IF z ~ '(salamanca)' THEN RETURN 'Salamanca'; END IF;
  IF z ~ '(burgos)' THEN RETURN 'Burgos'; END IF;
  IF z ~ '(ponferrada|leon)' THEN RETURN 'León'; END IF;
  IF z ~ '(zamora)' THEN RETURN 'Zamora'; END IF;
  IF z ~ '(segovia)' THEN RETURN 'Segovia'; END IF;
  IF z ~ '(avila)' THEN RETURN 'Ávila'; END IF;
  IF z ~ '(palencia)' THEN RETURN 'Palencia'; END IF;
  IF z ~ '(soria)' THEN RETURN 'Soria'; END IF;
  IF z ~ '(badajoz|merida|don benito)' THEN RETURN 'Badajoz'; END IF;
  IF z ~ '(caceres|plasencia)' THEN RETURN 'Cáceres'; END IF;

  RETURN NULL;
END;
$$;

-- El trigger unico ya normalizaba zone y derivaba region; ahora tambien
-- city_ref, para que las tres columnas se calculen siempre sobre el mismo
-- texto ya limpio y no puedan desincronizarse entre si.
CREATE OR REPLACE FUNCTION public.profiles_sync_region()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
BEGIN
  NEW.zone     := public.normalize_zone(NEW.zone);
  NEW.region   := public.region_from_zone(NEW.zone);
  NEW.city_ref := public.city_ref_from_zone(NEW.zone);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_set_region ON public.profiles;
CREATE TRIGGER profiles_set_region
  BEFORE INSERT OR UPDATE OF zone ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.profiles_sync_region();

UPDATE public.profiles SET city_ref = public.city_ref_from_zone(zone) WHERE zone IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_city_ref ON public.profiles (city_ref) WHERE city_ref IS NOT NULL;

-- La auditoria de seguridad del 1 sep 2026 cambio los permisos de profiles a
-- GRANT por columna (para cerrar la fuga de emails a anon), asi que toda
-- columna nueva nace sin permiso de lectura: sin esto el REST devuelve 401 y
-- el sitemap se queda sin perfiles, publicando las 2139 URLs sin podar.
GRANT SELECT (region, city_ref) ON public.profiles TO anon, authenticated;
