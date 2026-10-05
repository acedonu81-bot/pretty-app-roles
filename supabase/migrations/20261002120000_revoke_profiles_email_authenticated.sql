-- SEC-06: profiles.email es legible por CUALQUIER usuario autenticado vía
-- API directa (ej. un "empresario" registrado gratis sin verificación podría
-- hacer supabase.from('profiles').select('email').eq('user_id', X) y leer el
-- email de cualquier profesional, saltándose chat/Flash Booking). Encontrado
-- en auditoría manual 2 oct 2026.
--
-- INTENTO FALLIDO documentado aquí para que nadie lo repita: se probó
-- REVOKE SELECT (email) ON profiles FROM authenticated, igual que
-- 20260901120000_sec01_profiles_column_security.sql ya hizo para `anon`.
-- No funciona: `authenticated` (y `anon`) tienen GRANT SELECT a nivel de
-- TABLA COMPLETA sobre profiles desde su creación, y en Postgres un
-- REVOKE de columna no anula un GRANT de tabla — son privilegios
-- independientes que se combinan por el más permisivo. Verificado con
-- has_column_privilege('authenticated', 'profiles', 'email', 'SELECT')
-- devolviendo true incluso después del REVOKE. Es decir: la protección de
-- SEC-01 para `anon` NUNCA funcionó tampoco — profiles.email sigue siendo
-- legible hoy con la anon key pública. Revertido (GRANT SELECT (email) de
-- vuelta a authenticated) porque el REVOKE también rompía useProfile.tsx,
-- que lee birthday/trial_started_at/referral_code/phone de la PROPIA fila
-- con una lista de columnas explícita (no select('*')) — necesario arreglar
-- primero ese patrón antes de poder revocar nada sin romper el login.
--
-- La única forma real de bloquear esto en Postgres/PostgREST es REVOKE
-- SELECT a nivel de TABLA + volver a GRANT solo en una lista blanca de
-- columnas públicas, o mover email a una tabla aparte (como ya se hizo con
-- phone en 20260326104748 → profile_contacts, RLS user_id = auth.uid()).
-- Cualquiera de las dos es un cambio más grande que esta migración — queda
-- pendiente como deuda de seguridad conocida, no resuelta.
--
-- Lo que SÍ queda de esta migración: tres puntos del código que hacían
-- select('*') o filtraban por email de terceros se migran a RPC
-- SECURITY DEFINER. No bloquean nada a nivel de servidor (el GRANT de tabla
-- sigue abierto), pero reducen qué pide cada componente y centralizan el
-- único sitio que de verdad necesita comparar por email.

-- Permite a cada usuario leer su PROPIA fila completa sin depender de
-- select('*') sobre profiles (SettingsView.tsx export RGPD/informe anual,
-- exportUserData.ts). to_jsonb(p) en vez de listar columnas: la tabla ha
-- ido creciendo por migraciones (12+ ALTER TABLE ADD COLUMN) y una lista
-- explícita se desincroniza sola.
CREATE OR REPLACE FUNCTION public.my_profile()
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT to_jsonb(p) FROM public.profiles p WHERE p.user_id = auth.uid();
$$;

GRANT EXECUTE ON FUNCTION public.my_profile() TO authenticated;

-- AdminBusinesses.tsx lista el email de los empresarios para gestión (hasta
-- 500 filas). Comprueba el rol admin server-side antes de devolver nada —
-- capa adicional aunque el GRANT de tabla ya permitiría leerlo igual.
CREATE OR REPLACE FUNCTION public.profile_emails_for_admin(p_user_ids uuid[])
RETURNS TABLE(user_id uuid, email text)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT p.user_id, p.email FROM public.profiles p
  WHERE p.user_id = ANY(p_user_ids)
    AND public.has_role(auth.uid(), 'admin');
$$;

GRANT EXECUTE ON FUNCTION public.profile_emails_for_admin(uuid[]) TO authenticated;

-- useMarketRateInsight.ts comparaba la tarifa propia con la de otros
-- profesionales de su categoría/zona, excluyendo cuentas internas/demo con
-- .not('email', 'ilike', ...) sobre filas de OTROS usuarios. Se mueve el
-- cálculo entero a RPC: solo sale al cliente el porcentaje ya calculado,
-- nunca una lista de emails de terceros.
CREATE OR REPLACE FUNCTION public.market_rate_percent_diff(p_user_id uuid)
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  WITH me AS (
    SELECT hourly_rate, category, zone
    FROM public.profiles
    -- Solo el propio dueño: sin esto, cualquiera podría pasar el user_id de
    -- otro profesional y descubrir si su tarifa está por encima/debajo de
    -- mercado — un dato que no es suyo para ver.
    WHERE user_id = p_user_id AND p_user_id = auth.uid()
  ),
  peers AS (
    SELECT p.hourly_rate
    FROM public.profiles p, me
    WHERE p.category = me.category
      AND p.zone = me.zone
      AND p.user_id <> p_user_id
      AND p.hourly_rate > 0
      AND me.hourly_rate > 0
      AND p.email NOT ILIKE '%xpeak.es%'
      AND p.email NOT ILIKE '%demo%'
  )
  SELECT CASE
    WHEN COUNT(*) < 5 THEN NULL
    ELSE ROUND((((SELECT hourly_rate FROM me) - AVG(hourly_rate)) / AVG(hourly_rate)) * 100)
  END::integer
  FROM peers;
$$;

GRANT EXECUTE ON FUNCTION public.market_rate_percent_diff(uuid) TO authenticated;

DO $$
BEGIN
  RAISE NOTICE 'SEC-06: RPC de apoyo creadas (my_profile, profile_emails_for_admin, market_rate_percent_diff). profiles.email SIGUE siendo legible por cualquier authenticated/anon vía select directo — ver nota arriba, pendiente de resolver con REVOKE de tabla + lista blanca o tabla separada.';
END $$;
