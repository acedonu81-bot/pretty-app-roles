-- Cantera XPEAK (11 nov 2026): dos avisos en la campana.
-- 1) Un DJ de la Cantera sube una sesión nueva (audio o vídeo) -> aviso a cada admin,
--    para escucharla y decidir si sube al directorio de DJs.
-- 2) Un admin pasa a un DJ a la Cantera -> aviso al propio DJ explicando por qué
--    y cómo salir. Si se marca él solo en Ajustes no se le avisa (ya lo sabe).
CREATE OR REPLACE FUNCTION public.cantera_avisos()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_nombre text := COALESCE(NULLIF(trim(NEW.display_name), ''), 'Un DJ');
BEGIN
  IF NEW.experience_level = 'emergente'
     AND (COALESCE(array_length(NEW.audio_session_urls, 1), 0) > COALESCE(array_length(OLD.audio_session_urls, 1), 0)
       OR COALESCE(array_length(NEW.video_session_urls, 1), 0) > COALESCE(array_length(OLD.video_session_urls, 1), 0)
       OR (NULLIF(NEW.audio_embed_url, '') IS NOT NULL AND NEW.audio_embed_url IS DISTINCT FROM OLD.audio_embed_url))
  THEN
    INSERT INTO notifications (user_id, type, title, body, link)
    SELECT r.user_id, 'admin_cantera_sesion', 'Sesión nueva en la Cantera',
      v_nombre || ' ha subido una sesión. Escúchala y decide si sube al directorio de DJs.',
      '/dashboard?view=admin&tab=emergentes'
    FROM user_roles r WHERE r.role = 'admin' AND r.user_id <> NEW.user_id;
  END IF;

  IF NEW.experience_level = 'emergente' AND OLD.experience_level IS NULL
     AND auth.uid() IS DISTINCT FROM NEW.user_id
  THEN
    INSERT INTO notifications (user_id, type, title, body, link)
    VALUES (NEW.user_id, 'cantera_entrada', 'Ahora estás en la Cantera XPEAK',
      'Estamos revisando uno a uno los perfiles de DJ. Tu perfil pasa a la Cantera XPEAK, el sitio de los DJs que empiezan y tienen proyección. Sube tus sesiones: las escuchamos y, cuando tu nivel lo demuestre, pasas al directorio de DJs.',
      '/dashboard?view=emergentes');
  END IF;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'cantera_avisos: %', SQLERRM;
  RETURN NEW;
END $function$;

DROP TRIGGER IF EXISTS trg_cantera_avisos ON public.profiles;
CREATE TRIGGER trg_cantera_avisos
AFTER UPDATE OF audio_session_urls, video_session_urls, audio_embed_url, experience_level ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.cantera_avisos();
