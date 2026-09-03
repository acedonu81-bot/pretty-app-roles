-- "Solo el código verde si hay algo nuevo. Lo de ahora ya lo sé."
--
-- El contador de 31 pendientes era ruido, no una alerta: mezclaba lo que el
-- admin ya había visto con lo que acababa de entrar, y obligaba a revisar dos
-- veces lo mismo. Lo que hace falta es un corte temporal: "todo lo anterior a
-- este momento ya lo he visto".
--
-- Una sola fila por admin con la fecha del último repaso. Al entrar en la
-- pestaña Actividad se actualiza, y el escudo se apaga hasta que entre algo
-- nuevo de verdad. Sin números: verde o nada.
CREATE TABLE IF NOT EXISTS public.admin_activity_seen (
  user_id  uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  seen_at  timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.admin_activity_seen IS
  'Hasta cuándo ha revisado cada admin la actividad. Lo anterior a seen_at no vuelve a avisar.';

ALTER TABLE public.admin_activity_seen ENABLE ROW LEVEL SECURITY;

-- Cada admin gestiona su propia marca. La comprobación de rol va aquí y no en
-- el cliente: sin esto cualquier autenticado podría escribir filas.
DROP POLICY IF EXISTS "Admins leen su marca" ON public.admin_activity_seen;
CREATE POLICY "Admins leen su marca"
ON public.admin_activity_seen FOR SELECT TO authenticated
USING (
  auth.uid() = user_id
  AND EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin')
);

DROP POLICY IF EXISTS "Admins escriben su marca" ON public.admin_activity_seen;
CREATE POLICY "Admins escriben su marca"
ON public.admin_activity_seen FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin')
);

DROP POLICY IF EXISTS "Admins actualizan su marca" ON public.admin_activity_seen;
CREATE POLICY "Admins actualizan su marca"
ON public.admin_activity_seen FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Arranca desde ahora: todo lo existente (las 30 solicitudes de agosto y las
-- altas ya revisadas) queda por debajo del corte y no vuelve a avisar. Es
-- literalmente "empieza desde ahora, lo de ahora ya lo sé".
INSERT INTO public.admin_activity_seen (user_id, seen_at)
SELECT user_id, now() FROM public.user_roles WHERE role = 'admin'
ON CONFLICT (user_id) DO UPDATE SET seen_at = now();

-- Cuántas cosas nuevas hay desde el último repaso del admin que consulta.
-- SECURITY DEFINER para poder leer la actividad completa, pero solo responde a
-- admins: un usuario normal recibe 0, no un error que revele la existencia.
CREATE OR REPLACE FUNCTION public.admin_activity_nuevos()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_desde timestamptz;
  v_n integer;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin') THEN
    RETURN 0;
  END IF;

  SELECT seen_at INTO v_desde FROM public.admin_activity_seen WHERE user_id = auth.uid();
  -- Sin marca previa (admin nuevo): se considera que no hay nada nuevo en vez
  -- de volcarle el histórico entero, que es justo el ruido que se quiere evitar.
  IF v_desde IS NULL THEN
    INSERT INTO public.admin_activity_seen (user_id, seen_at) VALUES (auth.uid(), now())
    ON CONFLICT (user_id) DO NOTHING;
    RETURN 0;
  END IF;

  SELECT count(*) INTO v_n FROM public.admin_activity WHERE cuando > v_desde;
  RETURN COALESCE(v_n, 0);
END;
$function$;

-- Marca la actividad como revisada hasta ahora.
CREATE OR REPLACE FUNCTION public.admin_activity_marcar_visto()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin') THEN
    RETURN;
  END IF;
  INSERT INTO public.admin_activity_seen (user_id, seen_at) VALUES (auth.uid(), now())
  ON CONFLICT (user_id) DO UPDATE SET seen_at = now();
END;
$function$;

GRANT EXECUTE ON FUNCTION public.admin_activity_nuevos() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_activity_marcar_visto() TO authenticated;
