-- ════════════════════════════════════════════════════════════════
-- mcp_query_log — registra cada consulta que un agente de IA (Claude,
-- ChatGPT, Perplexity, etc.) hace al MCP server de XPEAK. Es el activo
-- de retroalimentación: hoy no existe ningún dato de "qué le pregunta
-- la gente a una IA sobre contratar profesionales de eventos" — con
-- el MCP en marcha, cada consulta real queda registrada aquí desde el
-- primer día. Sirve para:
--   1. Ver qué rol/ciudad/presupuesto se pide más (orienta qué páginas
--      de blog reforzar, qué categorías faltan en el directorio).
--   2. Medir tasa de conversión: cuántas búsquedas terminan en una
--      solicitud real (result_count > 0 y luego un insert en
--      flash_bookings correlacionado por session_id).
--   3. Detectar abuso (mismo agente/IP martilleando el MCP) sin
--      depender solo del rate-limit de flash_bookings.
-- ════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.mcp_query_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT,                       -- agrupa varias llamadas del mismo agente/conversación
  action TEXT NOT NULL,                  -- 'buscar_profesionales' | 'solicitar_presupuesto'
  role_requested TEXT,                   -- rol buscado (dj, staff, fotografo...) si aplica
  city_requested TEXT,                   -- ciudad buscada, texto libre tal como llegó
  budget_requested NUMERIC,              -- presupuesto mencionado, si el agente lo pasó
  result_count INT,                      -- cuántos perfiles devolvió la búsqueda
  led_to_booking BOOLEAN DEFAULT false,  -- true si esta sesión terminó en flash_booking real
  raw_params JSONB,                      -- payload completo recibido, para análisis futuro sin perder nada
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.mcp_query_log ENABLE ROW LEVEL SECURITY;

-- Solo el propio edge function (service role) escribe aquí. Nadie
-- público lee ni escribe directo — es un log interno de negocio,
-- no un dato del usuario final.
CREATE POLICY "Service role only" ON public.mcp_query_log
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- Admins pueden consultarlo desde el dashboard interno si se construye esa vista.
CREATE POLICY "Admins can read mcp query log" ON public.mcp_query_log
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_mcp_query_log_created_at ON public.mcp_query_log (created_at DESC);
CREATE INDEX idx_mcp_query_log_role_city ON public.mcp_query_log (role_requested, city_requested);
