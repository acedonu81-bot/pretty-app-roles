-- 16 nov 2026: las cuentas NUEVAS empiezan mostrándose a los profesionales
-- (sección Organizadores) y pueden quitarse cuando quieran. Antes era al revés.
-- Solo cambia el valor por defecto: las cuentas que ya existen conservan su
-- elección (no se les activa nada sin que lo hayan pedido).
ALTER TABLE public.profiles ALTER COLUMN mostrar_organizador SET DEFAULT true;

-- Monterosso (amigo de Daniel, alta del 16 nov): visible desde ya.
UPDATE public.profiles SET mostrar_organizador = true
 WHERE id = '9a78c4e6-eff7-4aa5-8e31-22227d53d4b1' AND role::text = 'empresario';
