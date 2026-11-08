-- 8 nov 2026: Novedades como flujo único (ficha XDS aprobada, 74,5).
-- Un solo tipo de contenido con tres tipos: XPEAK (novedades de la web),
-- Noticias (sector, contenido propio) y Comunidad (tablón con comentarios).
-- Lo que ya existía eran comunicados de XPEAK: el DEFAULT los clasifica así.
-- "Siguiendo" no es un tipo: es una vista del feed que no se copia aquí.

ALTER TABLE public.comunicados
  ADD COLUMN IF NOT EXISTS tipo text NOT NULL DEFAULT 'xpeak'
  CHECK (tipo IN ('xpeak', 'noticia', 'comunidad'));

CREATE INDEX IF NOT EXISTS comunicados_tipo_idx ON public.comunicados (tipo, created_at DESC);
