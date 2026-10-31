-- 31 oct 2026: el profesional puede dar un precio orientativo al decir "Sí, puedo" (opcional, sin compromiso hasta cerrar en el chat).
ALTER TABLE public.flash_bookings
  ADD COLUMN IF NOT EXISTS precio_orientativo numeric
  CHECK (precio_orientativo IS NULL OR (precio_orientativo > 0 AND precio_orientativo <= 100000));
