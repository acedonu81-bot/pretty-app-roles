-- Banner de opt-in de marketing para los 82 usuarios ya registrados antes de
-- 20260927120000_marketing_consent_registro.sql (nunca dieron consentimiento
-- porque no existía la casilla). Necesitamos distinguir "nunca se le preguntó"
-- de "se le preguntó y dijo que no" para no volver a mostrarle el banner tras
-- rechazarlo, sin depender de localStorage (debe persistir entre dispositivos).

ALTER TABLE public.profiles
  ADD COLUMN marketing_consent_asked_at timestamptz;

COMMENT ON COLUMN public.profiles.marketing_consent_asked_at IS
  'Momento en que se le mostró el banner de opt-in de marketing y respondió (aceptar o rechazar). NULL = aún no se le ha preguntado. Se marca al aceptar y al rechazar, nunca solo al descartar sin elegir.';
