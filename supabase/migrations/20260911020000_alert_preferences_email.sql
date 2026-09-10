-- Preferencias de notificación por CANAL, no solo por tipo: hasta hoy
-- alert_preferences solo controlaba push/campana (notif_flash, etc.) y el
-- email tenía un único opt-out global (email_opt_out) sin distinguir
-- "mensajes" de "Flash Booking" ni de "recordatorio de bolo mañana".
--
-- notif_flash ya cubre conceptualmente los 4 eventos de Flash Booking (nueva
-- oferta, nueva respuesta, preseleccionado, contratado) — no se separan en
-- columnas distintas porque el usuario los vive como un solo hilo de "algo
-- se movió en mi Flash Booking", pero SÍ se separa bolo_24h, que ya existía
-- como columna propia desde antes de hoy.
ALTER TABLE public.alert_preferences
  ADD COLUMN IF NOT EXISTS email_flash boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS email_bolo_24h boolean NOT NULL DEFAULT true;
