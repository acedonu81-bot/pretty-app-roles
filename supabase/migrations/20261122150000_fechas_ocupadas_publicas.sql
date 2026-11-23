-- Calendario público del profesional (22 nov 2026).
--
-- `availability` solo la lee su dueño por RLS. El calendario del perfil público
-- leía la tabla directamente con la sesión del visitante, así que siempre
-- recibía 0 filas: todos los días salían libres aunque el profesional los
-- hubiera marcado ocupados. Las fechas ocupadas son públicas por diseño ("lo
-- que marcas sale en tu perfil público"), pero solo las FUTURAS: las pasadas
-- cuentan historial de trabajo y no se exponen.
--
-- Devuelve {"fechas": ["YYYY-MM-DD", ...], "ultima_marca": timestamptz|null}.
-- ultima_marca cuenta todas las filas (también pasadas): solo dice si el
-- profesional mantiene el calendario.

CREATE OR REPLACE FUNCTION public.fechas_ocupadas_publicas(p_user uuid)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT jsonb_build_object(
    'fechas', COALESCE(
      (SELECT jsonb_agg(to_char(a.blocked_date, 'YYYY-MM-DD') ORDER BY a.blocked_date)
         FROM public.availability a
        WHERE a.user_id = p_user AND a.blocked_date >= current_date),
      '[]'::jsonb),
    'ultima_marca', (SELECT max(a.created_at) FROM public.availability a WHERE a.user_id = p_user)
  );
$$;

REVOKE ALL ON FUNCTION public.fechas_ocupadas_publicas(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.fechas_ocupadas_publicas(uuid) TO anon, authenticated;
