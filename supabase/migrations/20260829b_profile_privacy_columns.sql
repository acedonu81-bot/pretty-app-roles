-- ════════════════════════════════════════════════════════════════
-- Columnas de privacidad de `profiles`.
--
-- Los toggles "Perfil público en el directorio", "Mostrar estado en
-- línea" y "Emails de mensajes" existían en Ajustes pero no tenían
-- respaldo en BD: los dos primeros eran useState (se desactivaban en
-- pantalla y volvían a ON al recargar) y el tercero escribía en una
-- columna inexistente, fallando con error rojo. El usuario creía
-- haber ocultado su perfil o cortado sus emails y no era cierto.
--
-- El filtrado por is_public se hace en las CONSULTAS del directorio,
-- NO en la RLS: 20260822d quitó a propósito el gate de completitud
-- porque ocultar perfiles desde la policy los borraba de golpe. Se
-- mantiene ese criterio; la RLS sigue permitiendo el SELECT.
-- ════════════════════════════════════════════════════════════════

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_public      BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_online    BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS email_opt_out  BOOLEAN NOT NULL DEFAULT false;

-- El directorio filtra por is_public en cada consulta; el índice evita
-- que ese filtro degrade el listado según crezca la tabla.
CREATE INDEX IF NOT EXISTS idx_profiles_is_public
  ON public.profiles (is_public)
  WHERE is_public = true;
