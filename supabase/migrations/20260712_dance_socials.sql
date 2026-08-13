-- ════════════════════════════════════════════════════════════════
-- Fase 3 (bailarines): agenda pública de socials/congresos de baile.
--
-- Tabla nueva `dance_socials`, contenido generado por usuarios
-- (bailarines/promotores publican eventos: social de bachata, congreso
-- de salsa, etc.). Página pública /socials, indexable, filtrable por
-- ciudad y estilo. Ver spec:
-- docs/superpowers/specs/2026-07-11-bailarines-salsa-bachata-design.md
-- ════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.dance_socials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_name TEXT NOT NULL,
  style TEXT NOT NULL, -- 'salsa' | 'bachata' | 'kizomba' | 'zouk' | 'mixto' | ...
  city TEXT NOT NULL,
  venue TEXT,
  event_date DATE NOT NULL,
  description TEXT,
  link_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS dance_socials_city_idx ON public.dance_socials (city);
CREATE INDEX IF NOT EXISTS dance_socials_event_date_idx ON public.dance_socials (event_date);

ALTER TABLE public.dance_socials ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede ver la agenda (página pública indexable)
CREATE POLICY "Anyone can read dance socials"
ON public.dance_socials FOR SELECT TO public
USING (true);

-- Solo usuarios con perfil (autenticados) pueden publicar — evita spam anónimo
CREATE POLICY "Authenticated can insert dance socials"
ON public.dance_socials FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- El autor puede editar o borrar su propio evento
CREATE POLICY "Owner can update own dance socials"
ON public.dance_socials FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Owner can delete own dance socials"
ON public.dance_socials FOR DELETE TO authenticated
USING (auth.uid() = user_id);
