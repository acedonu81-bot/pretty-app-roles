-- Flag de moderación IA, independiente de validation_status (que ya está en
-- 'pending' para casi todos los perfiles reales existentes y no puede usarse
-- como gate de visibilidad sin ocultar el directorio actual). true = la IA
-- marcó bio/specialty como spam/broma al guardar; el perfil no se oculta de
-- inmediato, solo se excluye del directorio si además el registro es nuevo
-- (mismo criterio de fecha de corte que el filtro de zona genérica).
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ai_moderation_flagged boolean NOT NULL DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ai_moderation_reason text;
