-- Registro de errores de pantalla en blanco / crash de React en el cliente.
--
-- "Le he dado a loguear, se ha quedado pensando y luego en blanco" (5 sep
-- 2026). Sin ErrorBoundary en toda la app, cualquier error no capturado en el
-- render se lleva por delante el árbol completo de React sin dejar rastro:
-- ni mensaje al usuario, ni registro en ningún sitio para el admin. AVERIGUAR
-- qué pasó era imposible sin poder reproducirlo en directo.
--
-- Esta tabla es adonde apunta AppErrorBoundary (src/components/AppErrorBoundary.tsx)
-- cada vez que atrapa un crash real de un usuario real, con el mensaje, la
-- pila de componentes y la URL donde pasó.
CREATE TABLE IF NOT EXISTS public.client_errors (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message           text,
  stack             text,
  component_stack   text,
  url               text,
  user_agent        text,
  user_id           uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at        timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.client_errors IS
  'Crashes reales de React capturados por AppErrorBoundary. Antes de esto, una pantalla en blanco no dejaba ningún rastro consultable.';

CREATE INDEX IF NOT EXISTS idx_client_errors_created_at ON public.client_errors (created_at DESC);

ALTER TABLE public.client_errors ENABLE ROW LEVEL SECURITY;

-- Solo admins leen. El insert lo hace la función SECURITY DEFINER de abajo,
-- que no depende de que el usuario tenga sesión válida en ese momento — un
-- crash puede ocurrir precisamente cuando la sesión está a medio cargar.
DROP POLICY IF EXISTS "Admins leen client_errors" ON public.client_errors;
CREATE POLICY "Admins leen client_errors"
ON public.client_errors FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'));

-- SECURITY DEFINER + expuesta como RPC: se llama desde fetch() anónimo (no
-- pasa por supabase-js ni por el cliente autenticado), así que no puede
-- depender de RLS de escritura para 'authenticated'. Cualquiera puede
-- invocarla igual que cualquiera puede disparar un error en su navegador —
-- el límite de tamaño de cada campo (ya recortado en el cliente a 4000
-- caracteres) evita que se use para llenar la tabla de basura grande.
CREATE OR REPLACE FUNCTION public.log_client_error(
  p_message text,
  p_stack text DEFAULT NULL,
  p_component_stack text DEFAULT NULL,
  p_url text DEFAULT NULL,
  p_user_agent text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.client_errors (message, stack, component_stack, url, user_agent, user_id)
  VALUES (
    left(p_message, 500),
    left(p_stack, 4000),
    left(p_component_stack, 4000),
    left(p_url, 500),
    left(p_user_agent, 500),
    auth.uid()
  );
END;
$function$;

GRANT EXECUTE ON FUNCTION public.log_client_error(text, text, text, text, text) TO anon, authenticated;

-- Vista para el panel de admin: últimos crashes, agrupados por mensaje para
-- ver de un vistazo si es un fallo repetido o uno suelto.
CREATE OR REPLACE VIEW public.admin_client_errors AS
SELECT
  id, message, url, user_agent, user_id, created_at,
  count(*) OVER (PARTITION BY message) AS veces_visto_este_mensaje
FROM public.client_errors
ORDER BY created_at DESC
LIMIT 200;

REVOKE ALL ON public.admin_client_errors FROM anon, authenticated;
GRANT SELECT ON public.admin_client_errors TO authenticated;
