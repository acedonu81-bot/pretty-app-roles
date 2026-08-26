-- ════════════════════════════════════════════════════════════════
-- Fix: favorites.profile_id referenciaba profiles.id (PK autogenerada),
-- pero TODO el código de la app (EmpresarioView.toggleFavorite,
-- DiscoverTab) guarda y compara profile_id contra profiles.user_id
-- (el UUID de auth.users), nunca contra profiles.id. Son columnas
-- distintas con valores distintos.
--
-- Efecto en producción: el INSERT en favorites con profile_id=user_id
-- viola la FK a profiles.id casi siempre (409/23503) salvo coincidencia
-- accidental. El botón "Guardar" del Panel Empresario parecía funcionar
-- en la UI pero nunca persistía nada — confirmado con auditoría real
-- en xpeak.es el 26 ago 2026.
--
-- Fix: apuntar la FK a auth.users(id), que es lo que el código ya
-- guarda de hecho.
-- ════════════════════════════════════════════════════════════════

ALTER TABLE public.favorites
  DROP CONSTRAINT IF EXISTS favorites_profile_id_fkey;

ALTER TABLE public.favorites
  ADD CONSTRAINT favorites_profile_id_fkey
  FOREIGN KEY (profile_id) REFERENCES auth.users(id) ON DELETE CASCADE;
