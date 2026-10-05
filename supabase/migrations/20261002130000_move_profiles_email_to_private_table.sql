-- SEC-06 (cierre real): profiles.email era legible por CUALQUIER usuario
-- autenticado vía API directa (y de hecho por anon también) porque
-- `authenticated`/`anon` tienen GRANT SELECT a nivel de TABLA COMPLETA sobre
-- profiles — un REVOKE de columna no puede anular eso en Postgres (ver
-- migración 20261002120000, que documenta el intento fallido). La única
-- forma real de proteger una columna por fila es moverla a una tabla propia
-- con RLS de fila, exactamente el mismo patrón que ya se usó para `phone`
-- en 20260326104748 → profile_contacts (RLS user_id = auth.uid()).
--
-- Verificado antes de mover: solo 23 de 86 perfiles tenían email poblado
-- (dato residual de cuentas antiguas); handle_new_user() ya no escribe
-- profiles.email para altas nuevas desde hace tiempo — lo usa solo como
-- fallback de display_name y en el payload de los emails de aviso, nunca lo
-- inserta en la tabla. Ningún select('*') ni select de columna explícita de
-- profiles.email quedaba en el código cliente (auditado 2 oct 2026, los 3
-- puntos que sí lo usaban ya se habían migrado a RPC en la migración
-- anterior) — por eso esta migración no necesita tocar frontend salvo
-- redirigir esas 3 RPC a la tabla nueva.

CREATE TABLE IF NOT EXISTS public.profile_private_data (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profile_private_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner can read own private data"
ON public.profile_private_data FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Owner can upsert own private data"
ON public.profile_private_data FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Owner can update own private data"
ON public.profile_private_data FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Migrar los emails existentes antes de borrar la columna.
INSERT INTO public.profile_private_data (user_id, email)
SELECT user_id, email FROM public.profiles
WHERE email IS NOT NULL AND email <> ''
ON CONFLICT (user_id) DO NOTHING;

ALTER TABLE public.profiles DROP COLUMN IF EXISTS email;

-- handle_new_user() seguía referenciando profiles.email en comentarios de
-- esquema de forma indirecta (no en el INSERT, ver cabecera) — no requiere
-- cambio porque nunca insertaba en esa columna.

-- Reapuntar las 3 RPC creadas en SEC-06 a la tabla nueva, ahora que es la
-- fuente real del dato.
CREATE OR REPLACE FUNCTION public.my_profile()
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT to_jsonb(p) || jsonb_build_object('email', pd.email)
  FROM public.profiles p
  LEFT JOIN public.profile_private_data pd ON pd.user_id = p.user_id
  WHERE p.user_id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.profile_emails_for_admin(p_user_ids uuid[])
RETURNS TABLE(user_id uuid, email text)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT pd.user_id, pd.email FROM public.profile_private_data pd
  WHERE pd.user_id = ANY(p_user_ids)
    AND public.has_role(auth.uid(), 'admin');
$$;

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
    WHERE user_id = p_user_id AND p_user_id = auth.uid()
  ),
  peers AS (
    SELECT p.hourly_rate
    FROM public.profiles p
    JOIN me ON true
    LEFT JOIN public.profile_private_data pd ON pd.user_id = p.user_id
    WHERE p.category = me.category
      AND p.zone = me.zone
      AND p.user_id <> p_user_id
      AND p.hourly_rate > 0
      AND me.hourly_rate > 0
      AND COALESCE(pd.email, '') NOT ILIKE '%xpeak.es%'
      AND COALESCE(pd.email, '') NOT ILIKE '%demo%'
  )
  SELECT CASE
    WHEN COUNT(*) < 5 THEN NULL
    ELSE ROUND((((SELECT hourly_rate FROM me) - AVG(hourly_rate)) / AVG(hourly_rate)) * 100)
  END::integer
  FROM peers;
$$;

DO $$
BEGIN
  RAISE NOTICE 'SEC-06 cerrado de verdad: profiles.email ya no existe, vive en profile_private_data con RLS de fila (user_id = auth.uid()). Nadie puede leer el email de otro vía API, ni anon ni authenticated.';
END $$;
