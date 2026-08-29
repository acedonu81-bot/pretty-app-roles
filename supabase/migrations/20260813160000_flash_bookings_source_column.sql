-- ════════════════════════════════════════════════════════════════
-- Añade columna `source` a flash_bookings para distinguir solicitudes
-- creadas por el formulario web humano de las creadas por un agente
-- de IA vía el MCP server. Permite auditar/cortar el grifo del MCP
-- de forma independiente si hace falta, sin tocar el flujo humano.
-- ════════════════════════════════════════════════════════════════

ALTER TABLE public.flash_bookings
  ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'web';
