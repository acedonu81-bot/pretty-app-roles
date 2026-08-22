-- ════════════════════════════════════════════════════════════════
-- Fase 2 (bailarines): clases particulares.
--
-- Extiende profiles con campos opcionales para que un bailarín
-- marque que también da clases particulares de baile (salsa,
-- bachata, kizomba, etc.), sin crear una tabla nueva ni cambiar
-- el modelo de rol existente. Ver spec:
-- docs/superpowers/specs/2026-07-11-bailarines-salsa-bachata-design.md
-- ════════════════════════════════════════════════════════════════

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS offers_classes boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS class_styles text[],
  ADD COLUMN IF NOT EXISTS class_price numeric;
