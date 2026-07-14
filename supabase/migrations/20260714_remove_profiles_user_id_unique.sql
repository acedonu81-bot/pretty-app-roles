-- Permite varios perfiles por cuenta (ej. DJ + Fotógrafo). Hasta ahora
-- profiles.user_id tenía UNIQUE, heredado del diseño original de un
-- solo perfil por usuario, y bloqueaba a nivel de BD el multi-perfil
-- que ya existe en el frontend (useProfile.tsx createProfile/switchProfile).
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_id_unique;
