-- Badge opt-in "Nuevo en XPEAK" para grupos musicales (16 sep 2026). NO se
-- calcula solo por created_at: un grupo consolidado con años de trayectoria
-- que se da de alta hoy sería técnicamente "nuevo en la plataforma" pero
-- llamarlo así sería engañoso — mismo error que 'rookie'/Sairo. La fecha de
-- alta solo decide elegibilidad (ventana de 180 días, calculada en cliente,
-- ver src/lib/newOnPlatform.ts); esta columna es la decisión real del propio
-- grupo, tomada en Ajustes.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS show_new_badge boolean NOT NULL DEFAULT false;

GRANT SELECT, INSERT, UPDATE (show_new_badge) ON public.profiles TO anon, authenticated;
