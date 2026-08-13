-- ════════════════════════════════════════════════════════════════
-- Fase 4 (bailarines): buscar pareja de baile.
--
-- Extiende profiles con campos opcionales para que un bailarín
-- profesional marque que busca pareja de baile fija. Solo entre
-- bailarines ya registrados como profesionales — sin tabla nueva,
-- sin cuenta de aficionado, sin matching automático. El contacto
-- reutiliza la mensajería ya existente. Ver spec:
-- docs/superpowers/specs/2026-07-11-bailarines-salsa-bachata-design.md
-- ════════════════════════════════════════════════════════════════

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS seeking_dance_partner boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS dance_level text;
