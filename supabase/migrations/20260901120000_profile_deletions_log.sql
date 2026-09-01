-- Registro de perfiles eliminados + encuesta de salida.
--
-- Hasta ahora una baja no dejaba ningún rastro: la fila de profiles
-- desaparecía y no había forma de saber que se había perdido inventario ni de
-- qué tipo. Con 7 camareros y 12 DJs en total, perder uno importa y hay que
-- enterarse el mismo día.
--
-- RGPD Art. 17: quien borra su cuenta ejerce el derecho de supresión, así que
-- aquí NO se guarda ningún dato identificativo (ni nombre, ni email, ni
-- teléfono, ni user_id). Solo el hecho agregado y las métricas de
-- comportamiento — cuánto duró, cuánta actividad tuvo, si le llegó a contactar
-- alguien — que es justo lo necesario para entender por qué abandonan y no
-- permite reidentificar a la persona.

CREATE TABLE IF NOT EXISTS public.profile_deletions (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deleted_at   timestamptz NOT NULL DEFAULT now(),

  -- Quién era, en agregado (sin identificar)
  role         text,
  zone         text,
  had_photo    boolean NOT NULL DEFAULT false,
  had_bio      boolean NOT NULL DEFAULT false,
  had_media    boolean NOT NULL DEFAULT false,
  was_verified boolean NOT NULL DEFAULT false,
  hourly_rate  numeric,
  days_active  integer,

  -- Qué hizo mientras estuvo. Estas cifras son el material para responder
  -- "¿se fue porque no le llegó trabajo?": si messages_received y
  -- bookings_received son 0, la respuesta es que sí y el problema es de
  -- liquidez, no de producto.
  messages_sent      integer NOT NULL DEFAULT 0,
  messages_received  integer NOT NULL DEFAULT 0,
  conversations      integer NOT NULL DEFAULT 0,
  bookings_received  integer NOT NULL DEFAULT 0,
  bookings_created   integer NOT NULL DEFAULT 0,
  favorited_by       integer NOT NULL DEFAULT 0,
  favorites_made     integer NOT NULL DEFAULT 0,
  reviews_received   integer NOT NULL DEFAULT 0,
  profile_score      integer,
  last_activity_at   timestamptz,

  -- Encuesta de salida (opcional — se puede cerrar sin responder)
  exit_reason  text,
  exit_comment text,

  -- Se marca cuando el admin ya ha visto el aviso, para que el banner deje de
  -- salir sin borrar el registro histórico.
  acknowledged boolean NOT NULL DEFAULT false,

  -- Efímero: solo para que el usuario adjunte su encuesta tras la baja.
  -- Se pone a NULL al responder o al caducar (30 min). Ver latest_deletion_id.
  claim_user_id uuid
);

CREATE INDEX IF NOT EXISTS profile_deletions_pending_idx
  ON public.profile_deletions (deleted_at DESC)
  WHERE acknowledged = false;

CREATE INDEX IF NOT EXISTS profile_deletions_recent_idx
  ON public.profile_deletions (deleted_at DESC);

ALTER TABLE public.profile_deletions ENABLE ROW LEVEL SECURITY;

-- Solo admin lee, marca como visto y borra avisos ya gestionados.
DROP POLICY IF EXISTS "Admins read profile deletions" ON public.profile_deletions;
CREATE POLICY "Admins read profile deletions"
  ON public.profile_deletions FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins ack profile deletions" ON public.profile_deletions;
CREATE POLICY "Admins ack profile deletions"
  ON public.profile_deletions FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins delete profile deletions" ON public.profile_deletions;
CREATE POLICY "Admins delete profile deletions"
  ON public.profile_deletions FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- El trigger va en profiles y no en auth.users: un perfil puede desaparecer
-- por borrado de cuenta o por limpieza, y en ambos casos se pierde inventario.
-- BEFORE DELETE es deliberado: en ese momento los mensajes, bookings y
-- favoritos del usuario todavía existen, así que se pueden contar. El handler
-- de SettingsView borra profiles primero, luego el resto.
CREATE OR REPLACE FUNCTION public.log_profile_deletion()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_msg_sent     integer := 0;
  v_msg_recv     integer := 0;
  v_convs        integer := 0;
  v_book_recv    integer := 0;
  v_book_made    integer := 0;
  v_faved_by     integer := 0;
  v_faves        integer := 0;
  v_reviews      integer := 0;
  v_last_act     timestamptz;
BEGIN
  -- Cada conteo va en su propio bloque: si una tabla no existe o cambia de
  -- forma, la baja debe registrarse igualmente. Perder una métrica es
  -- aceptable; perder el aviso entero no.
  BEGIN
    SELECT count(*) INTO v_msg_sent FROM public.messages WHERE sender_id = OLD.user_id;
  EXCEPTION WHEN OTHERS THEN v_msg_sent := 0; END;

  BEGIN
    SELECT count(*) INTO v_msg_recv
    FROM public.messages m
    JOIN public.conversations c ON c.id = m.conversation_id
    WHERE (c.participant_a = OLD.user_id OR c.participant_b = OLD.user_id)
      AND m.sender_id <> OLD.user_id;
  EXCEPTION WHEN OTHERS THEN v_msg_recv := 0; END;

  BEGIN
    SELECT count(*) INTO v_convs FROM public.conversations
    WHERE participant_a = OLD.user_id OR participant_b = OLD.user_id;
  EXCEPTION WHEN OTHERS THEN v_convs := 0; END;

  BEGIN
    SELECT count(*) INTO v_book_recv FROM public.flash_bookings
    WHERE professional_user_id = OLD.user_id;
  EXCEPTION WHEN OTHERS THEN v_book_recv := 0; END;

  BEGIN
    SELECT count(*) INTO v_book_made FROM public.flash_bookings
    WHERE created_by = OLD.user_id;
  EXCEPTION WHEN OTHERS THEN v_book_made := 0; END;

  BEGIN
    SELECT count(*) INTO v_faved_by FROM public.favorites
    WHERE profile_id = OLD.user_id;
  EXCEPTION WHEN OTHERS THEN v_faved_by := 0; END;

  BEGIN
    SELECT count(*) INTO v_faves FROM public.favorites WHERE user_id = OLD.user_id;
  EXCEPTION WHEN OTHERS THEN v_faves := 0; END;

  BEGIN
    SELECT count(*) INTO v_reviews FROM public.reviews
    WHERE reviewed_user_id = OLD.user_id;
  EXCEPTION WHEN OTHERS THEN v_reviews := 0; END;

  BEGIN
    SELECT max(created_at) INTO v_last_act FROM public.messages WHERE sender_id = OLD.user_id;
  EXCEPTION WHEN OTHERS THEN v_last_act := NULL; END;

  INSERT INTO public.profile_deletions (
    role, zone, had_photo, had_bio, had_media, was_verified, hourly_rate, days_active,
    messages_sent, messages_received, conversations,
    bookings_received, bookings_created,
    favorited_by, favorites_made, reviews_received,
    profile_score, last_activity_at, claim_user_id
  ) VALUES (
    OLD.role,
    OLD.zone,
    NULLIF(TRIM(COALESCE(OLD.photo_url, '')), '') IS NOT NULL,
    NULLIF(TRIM(COALESCE(OLD.bio, '')), '') IS NOT NULL,
    (COALESCE(array_length(OLD.portfolio_urls, 1), 0) > 0
      OR NULLIF(TRIM(COALESCE(OLD.audio_embed_url, '')), '') IS NOT NULL),
    COALESCE(OLD.is_verified, false),
    OLD.hourly_rate,
    CASE WHEN OLD.created_at IS NOT NULL
         THEN GREATEST(0, EXTRACT(DAY FROM (now() - OLD.created_at))::integer)
    END,
    v_msg_sent, v_msg_recv, v_convs,
    v_book_recv, v_book_made,
    v_faved_by, v_faves, v_reviews,
    OLD.score,
    COALESCE(v_last_act, OLD.updated_at),
    OLD.user_id
  );
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trg_log_profile_deletion ON public.profiles;
CREATE TRIGGER trg_log_profile_deletion
  BEFORE DELETE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.log_profile_deletion();

-- Limpia los claim_user_id caducados. Se llama desde record_exit_survey, así
-- que no hace falta un cron: cualquier baja posterior barre los anteriores, y
-- de todos modos la ventana de 30 min ya los inutiliza.
CREATE OR REPLACE FUNCTION public.purge_expired_deletion_claims()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.profile_deletions
  SET claim_user_id = NULL
  WHERE claim_user_id IS NOT NULL
    AND deleted_at < now() - interval '30 minutes';
$$;

-- Guarda la respuesta de la encuesta de salida en el registro que el trigger
-- acaba de crear. Va por RPC y no por UPDATE directo porque el usuario ya no
-- tiene perfil (y en breve tampoco sesión), así que no puede pasar por las
-- policies de admin. SECURITY DEFINER con el id devuelto al borrar.
CREATE OR REPLACE FUNCTION public.record_exit_survey(
  p_deletion_id uuid,
  p_reason text,
  p_comment text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profile_deletions
  SET exit_reason = LEFT(p_reason, 60),
      exit_comment = LEFT(NULLIF(TRIM(COALESCE(p_comment, '')), ''), 1000)
  WHERE id = p_deletion_id
    AND claim_user_id = auth.uid()
    AND exit_reason IS NULL                    -- una sola respuesta por baja
    AND deleted_at > now() - interval '1 hour'; -- solo la sesión de baja en curso
END;
$$;

REVOKE ALL ON FUNCTION public.record_exit_survey(uuid, text, text) FROM public;
GRANT EXECUTE ON FUNCTION public.record_exit_survey(uuid, text, text) TO anon, authenticated;

-- El id del registro se devuelve al propio usuario que se está dando de baja,
-- para que pueda adjuntar su encuesta. Se ata a auth.uid(): una función que
-- devolviese "la última baja" a secas permitiría a cualquiera capturar el id de
-- la baja de otra persona y escribirle la respuesta. Por eso el trigger guarda
-- el user_id en una columna efímera que la propia RPC de encuesta limpia.
ALTER TABLE public.profile_deletions
  ADD COLUMN IF NOT EXISTS claim_user_id uuid;  -- idempotencia si la tabla ya existía

COMMENT ON COLUMN public.profile_deletions.claim_user_id IS
  'Efímero: solo para que el usuario adjunte su encuesta de salida en los minutos siguientes a la baja. Se pone a NULL al responder o al caducar (ver purge_expired_deletion_claims). No es un dato de perfil conservado.';

CREATE INDEX IF NOT EXISTS profile_deletions_claim_idx
  ON public.profile_deletions (claim_user_id)
  WHERE claim_user_id IS NOT NULL;

CREATE OR REPLACE FUNCTION public.latest_deletion_id()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.profile_deletions
  WHERE claim_user_id = auth.uid()
    AND deleted_at > now() - interval '30 minutes'
  ORDER BY deleted_at DESC
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.latest_deletion_id() FROM public;
GRANT EXECUTE ON FUNCTION public.latest_deletion_id() TO authenticated;

