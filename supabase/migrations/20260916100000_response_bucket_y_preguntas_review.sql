-- Indicador "Responde en X" (estilo Wallapop) — mediana del tiempo que
-- tarda el profesional en responder al primer mensaje de un empresario en
-- cada conversación, recalculada por el cron xpeak-response-bucket
-- (supabase/functions/response-bucket-recalc). Null = sin conversaciones
-- elegibles todavía, no se muestra el chip.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS response_bucket text
    CHECK (response_bucket IN ('minutos','menos_1h','unas_horas','1_dia','mas_1_dia'));

COMMENT ON COLUMN public.profiles.response_bucket IS
  'Bucket de velocidad de respuesta del profesional, calculado por el cron diario xpeak-response-bucket sobre conversations/messages. Null si aún no tiene conversaciones elegibles (empresario escribió primero y el profesional respondió).';

-- Preguntas estructuradas de la reseña (empresario -> profesional).
-- Obligatorias en el formulario (ReviewModal, HistorialTab.tsx) para
-- reseñas nuevas; null en reseñas anteriores a este cambio, que se
-- completan por separado (ver Task 6).
ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS llego_puntual boolean,
  ADD COLUMN IF NOT EXISTS cumplio_acordado boolean,
  ADD COLUMN IF NOT EXISTS volveria_contratar boolean;

COMMENT ON COLUMN public.reviews.llego_puntual IS '¿El profesional llegó puntual al evento? Null en reseñas anteriores al 16 sep 2026.';
COMMENT ON COLUMN public.reviews.cumplio_acordado IS '¿El profesional cumplió con lo acordado? Null en reseñas anteriores al 16 sep 2026.';
COMMENT ON COLUMN public.reviews.volveria_contratar IS '¿El empresario volvería a contratarlo/a? Null en reseñas anteriores al 16 sep 2026.';
