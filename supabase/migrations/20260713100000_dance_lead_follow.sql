-- ════════════════════════════════════════════════════════════════
-- Fase 4 (bailarines) — ampliación: rol de baile (lead/follow).
--
-- En salsa/bachata quien busca pareja necesita especificar si guía
-- ("lead") o sigue ("follow") — dos leads o dos follows no encajan
-- para bailar en pareja. Campo opcional junto a seeking_dance_partner.
-- ════════════════════════════════════════════════════════════════

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS dance_role text; -- 'lead' | 'follow' | 'ambos'
