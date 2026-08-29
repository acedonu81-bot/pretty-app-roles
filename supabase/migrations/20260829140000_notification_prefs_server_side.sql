-- ════════════════════════════════════════════════════════════════
-- Preferencias de notificación de Ajustes, persistidas server-side.
--
-- Los toggles "Mensajes nuevos", "Flash Booking" y "Top Weekend"
-- (SettingsView) solo escribían en localStorage. Como los emails y
-- las push salen del servidor, esas preferencias no se respetaban:
-- el usuario las desactivaba y seguía recibiendo avisos. Además se
-- perdían al cambiar de dispositivo o limpiar el navegador.
--
-- Se reutiliza alert_preferences, creada en 20260825 exactamente por
-- este motivo para las alertas del calendario, en vez de añadir otra
-- tabla que espeje lo mismo.
--
-- Default true: hasta ahora la ausencia de valor equivalía a "activado"
-- (localStorage.getItem(...) !== 'false'), así que se mantiene ese
-- comportamiento para no cambiar en silencio lo que ya recibe la gente.
-- ════════════════════════════════════════════════════════════════

ALTER TABLE public.alert_preferences
  ADD COLUMN IF NOT EXISTS notif_messages    BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS notif_flash       BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS notif_top_weekend BOOLEAN NOT NULL DEFAULT true;
