-- Flash: precio opcional al apuntarse + disponibilidad del profesional para las
-- fechas de la oferta (22 nov 2026).
--
-- `availability` solo la lee su dueño (RLS). El organizador no debe ver las
-- fechas ocupadas de nadie, solo si el profesional está libre en las fechas de
-- SU oferta. Por eso el cálculo vive en una función SECURITY DEFINER que
-- devuelve 'libre' | 'ocupado' | 'sin_datos', y solo la RPC del organizador
-- puede llamarla.

ALTER TABLE public.event_request_responses
  ADD COLUMN IF NOT EXISTS precio numeric(8,2);

ALTER TABLE public.event_request_responses
  DROP CONSTRAINT IF EXISTS event_request_responses_precio_chk;
ALTER TABLE public.event_request_responses
  ADD CONSTRAINT event_request_responses_precio_chk
  CHECK (precio IS NULL OR (precio > 0 AND precio <= 100000));

-- 'sin_datos' si no hay fechas que comparar o el profesional nunca marcó
-- ninguna fecha (no se puede afirmar que esté libre).
CREATE OR REPLACE FUNCTION public.disponibilidad_para_fechas(p_user uuid, p_fechas date[])
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT CASE
    WHEN p_fechas IS NULL OR cardinality(p_fechas) = 0 THEN 'sin_datos'
    WHEN NOT EXISTS (SELECT 1 FROM public.availability a WHERE a.user_id = p_user) THEN 'sin_datos'
    WHEN EXISTS (
      SELECT 1 FROM public.availability a
      WHERE a.user_id = p_user AND a.blocked_date = ANY (p_fechas)
    ) THEN 'ocupado'
    ELSE 'libre'
  END;
$$;

REVOKE ALL ON FUNCTION public.disponibilidad_para_fechas(uuid, date[]) FROM PUBLIC, anon, authenticated;

-- La RPC cambia de tipo de retorno (dos columnas nuevas al final): hay que
-- borrarla antes. El cuerpo es el de producción (no estaba en migraciones),
-- con la misma comprobación de dueño/admin y el mismo orden.
DROP FUNCTION IF EXISTS public.interesados_en_oferta(uuid);

CREATE FUNCTION public.interesados_en_oferta(p_request_id uuid)
RETURNS TABLE(
  id uuid, professional_user_id uuid, nombre text, foto text, mensaje text,
  slot_id uuid, chosen_at timestamptz, hired_at timestamptz, completitud integer,
  created_at timestamptz, precio numeric, disponibilidad text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT er.id, er.professional_user_id,
         COALESCE(NULLIF(trim(p.display_name), ''), 'Profesional'),
         p.photo_url, er.message, er.slot_id, er.chosen_at, er.hired_at,
         public.perfil_completitud(er.professional_user_id),
         er.created_at,
         er.precio,
         public.disponibilidad_para_fechas(
           er.professional_user_id,
           CASE
             WHEN r.event_dates IS NOT NULL AND cardinality(r.event_dates) > 0 THEN r.event_dates
             WHEN r.event_date ~ '^\d{4}-\d{2}-\d{2}$' THEN ARRAY[r.event_date::date]
             ELSE ARRAY[]::date[]
           END
         )
  FROM public.event_request_responses er
  JOIN public.event_requests r ON r.id = er.request_id
  LEFT JOIN public.profiles p ON p.user_id = er.professional_user_id
  WHERE er.request_id = p_request_id
    AND (r.client_user_id = auth.uid()::text OR public.es_admin())
  ORDER BY er.hired_at NULLS LAST,
           er.chosen_at NULLS LAST,
           public.perfil_completitud(er.professional_user_id) DESC,
           er.created_at ASC;
$$;

GRANT EXECUTE ON FUNCTION public.interesados_en_oferta(uuid) TO authenticated;
