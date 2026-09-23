-- Reduce the remotely callable database surface to RPCs used by the application.
-- PostgreSQL grants EXECUTE to PUBLIC by default, so revoke inherited and
-- direct grants before restoring the audited client entry points below.
DO $migration$
DECLARE
  fn record;
BEGIN
  FOR fn IN
    SELECT n.nspname AS schema_name,
           p.proname AS function_name,
           pg_get_function_identity_arguments(p.oid) AS identity_arguments
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.prosecdef
  LOOP
    EXECUTE format('REVOKE EXECUTE ON FUNCTION %I.%I(%s) FROM PUBLIC, anon, authenticated',
      fn.schema_name, fn.function_name, fn.identity_arguments);
  END LOOP;
END
$migration$;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

DO $migration$
DECLARE
  fn record;
BEGIN
  FOR fn IN
    SELECT p.oid::regprocedure AS signature,
      CASE WHEN p.proname IN (
        'log_analytics_event',
        'profile_views_last_7_days',
        'flash_bookings_last_7_days'
      ) THEN 'anon, authenticated' ELSE 'authenticated' END AS grant_roles
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.prosecdef
      AND p.proname = ANY(ARRAY[
        'log_analytics_event',
        'profile_views_last_7_days',
        'flash_bookings_last_7_days',
        'flash_bookings_today_count',
        'last_viewed_batch',
        'get_vote_count',
        'completar_preguntas_resena',
        'admin_activity_marcar_visto',
        'admin_emails_de_usuario',
        'es_admin',
        'has_role',
        'is_admin',
        'panel_analytics_dia',
        'panel_analytics_hora',
        'panel_analytics_top',
        'panel_analytics_negocio',
        'panel_analytics_busquedas',
        'panel_analytics_afiliados',
        'panel_analytics_blog',
        'panel_analytics_embudo',
        'panel_analytics_recursos',
        'panel_analytics_usuarios_unicos',
        'panel_analytics_online_ahora',
        'panel_analytics_quien_online'
      ])
  LOOP
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO %s', fn.signature, fn.grant_roles);
  END LOOP;
END
$migration$;

ALTER FUNCTION public.enforce_single_primary_profile() SET search_path = pg_catalog, public;
ALTER FUNCTION public.user_profile_count(uuid) SET search_path = pg_catalog, public;
ALTER FUNCTION public.is_profile_complete(public.profiles) SET search_path = pg_catalog, public;

-- These admin-only policies previously targeted PUBLIC, forcing the role
-- helper functions to remain callable anonymously just to evaluate the RLS
-- checks. Require a signed-in role at the policy boundary instead.
ALTER POLICY "Admins ack profile deletions" ON public.profile_deletions TO authenticated;
ALTER POLICY "Admins delete profile deletions" ON public.profile_deletions TO authenticated;
ALTER POLICY "Admins read profile deletions" ON public.profile_deletions TO authenticated;
ALTER POLICY "Admins delete promo codes" ON public.promo_codes TO authenticated;
ALTER POLICY "Admins insert promo codes" ON public.promo_codes TO authenticated;
ALTER POLICY "Admins read all promo codes" ON public.promo_codes TO authenticated;
ALTER POLICY "Admins update promo codes" ON public.promo_codes TO authenticated;
ALTER POLICY "Admins delete reviews" ON public.reviews TO authenticated;
ALTER POLICY "Admins read all reviews" ON public.reviews TO authenticated;
ALTER POLICY "Admins update reviews" ON public.reviews TO authenticated;
ALTER POLICY "Solo administradores gestionan roles" ON public.user_roles TO authenticated;

-- Event requests remain visible to signed-in professionals while open, but
-- anonymous visitors can no longer read contact details or exact addresses.
-- Owners, hired professionals, and admins can still access their own rows.
DROP POLICY IF EXISTS "er_read" ON public.event_requests;
DROP POLICY IF EXISTS "event_requests_public_read" ON public.event_requests;
DROP POLICY IF EXISTS "event_requests_authenticated_read" ON public.event_requests;
CREATE POLICY "event_requests_authenticated_read"
ON public.event_requests FOR SELECT TO authenticated
USING (
  COALESCE((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
  AND (
    (status = 'open' AND expires_at > now())
    OR client_user_id = auth.uid()::text
    OR EXISTS (
      SELECT 1 FROM public.event_request_responses r
      WHERE r.request_id = event_requests.id
        AND r.professional_user_id = auth.uid()
        AND r.hired_at IS NOT NULL
    )
    OR EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  )
);

-- Notifications are written by trusted database triggers. The former policy
-- let any signed-in user forge notifications for any account.
DROP POLICY IF EXISTS "Authenticated can create notifications" ON public.notifications;
DROP POLICY IF EXISTS "authenticated_can_create_notifications" ON public.notifications;

-- The anonymous votes endpoint only needs aggregate totals in the UI. Keep
-- writes available through the existing policy and limit row reads to owners.
DO $migration$
DECLARE pol record;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'votes' AND cmd = 'SELECT'
      AND policyname <> 'Users can read own votes'
  LOOP
    EXECUTE format('DROP POLICY %I ON public.votes', pol.policyname);
  END LOOP;
END
$migration$;
DROP POLICY IF EXISTS "Users can read own votes" ON public.votes;
CREATE POLICY "Users can read own votes"
ON public.votes FOR SELECT TO authenticated
USING (voter_id = auth.uid());

-- Profile cards need the total vote count, not voter identities. Publish only
-- a counter table and keep the source rows private.
CREATE TABLE IF NOT EXISTS public.profile_vote_counts (
  profile_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  vote_count bigint NOT NULL DEFAULT 0 CHECK (vote_count >= 0)
);
ALTER TABLE public.profile_vote_counts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read profile vote counts" ON public.profile_vote_counts;
CREATE POLICY "Public can read profile vote counts"
ON public.profile_vote_counts FOR SELECT TO anon, authenticated
USING (true);
REVOKE ALL ON public.profile_vote_counts FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.profile_vote_counts TO anon, authenticated;

INSERT INTO public.profile_vote_counts (profile_id, vote_count)
SELECT profile_id, count(*)::bigint FROM public.votes GROUP BY profile_id
ON CONFLICT (profile_id) DO UPDATE SET vote_count = EXCLUDED.vote_count;

CREATE OR REPLACE FUNCTION public.sync_profile_vote_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  v_profile_id uuid;
BEGIN
  v_profile_id := CASE WHEN TG_OP = 'DELETE' THEN OLD.profile_id ELSE NEW.profile_id END;
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.profile_vote_counts (profile_id, vote_count)
    VALUES (v_profile_id, 1)
    ON CONFLICT (profile_id) DO UPDATE
      SET vote_count = public.profile_vote_counts.vote_count + 1;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.profile_vote_counts
    SET vote_count = GREATEST(vote_count - 1, 0)
    WHERE profile_id = v_profile_id;
  END IF;
  IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  RETURN NEW;
END;
$function$;
REVOKE ALL ON FUNCTION public.sync_profile_vote_count() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS sync_profile_vote_count_trigger ON public.votes;
CREATE TRIGGER sync_profile_vote_count_trigger
AFTER INSERT OR DELETE ON public.votes
FOR EACH ROW EXECUTE FUNCTION public.sync_profile_vote_count();

-- Trusted, trigger-only notification writer for actual chat messages.
CREATE OR REPLACE FUNCTION public.create_message_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $function$
DECLARE
  v_recipient uuid;
  v_sender_name text;
  v_body text;
BEGIN
  IF NEW.deleted_at IS NOT NULL THEN RETURN NEW; END IF;

  SELECT CASE WHEN c.participant_a = NEW.sender_id THEN c.participant_b ELSE c.participant_a END
    INTO v_recipient
  FROM public.conversations c
  WHERE c.id = NEW.conversation_id
    AND NEW.sender_id IN (c.participant_a, c.participant_b);

  IF v_recipient IS NULL OR NOT COALESCE((
    SELECT ap.notif_messages FROM public.alert_preferences ap WHERE ap.user_id = v_recipient
  ), true) THEN
    RETURN NEW;
  END IF;

  SELECT COALESCE(NULLIF(trim(p.display_name), ''), 'Un usuario') INTO v_sender_name
  FROM public.profiles p
  WHERE p.user_id = NEW.sender_id
  ORDER BY p.is_primary DESC
  LIMIT 1;

  v_body := COALESCE(NULLIF(NEW.content, ''), 'Te ha enviado una imagen');
  IF length(v_body) > 80 THEN v_body := left(v_body, 80) || '…'; END IF;

  INSERT INTO public.notifications (user_id, type, title, body, link)
  VALUES (v_recipient, 'message', COALESCE(v_sender_name, 'Un usuario') || ' te ha escrito', v_body,
    '/dashboard?view=messages');

  RETURN NEW;
END;
$function$;
REVOKE ALL ON FUNCTION public.create_message_notification() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS trg_create_message_notification ON public.messages;
CREATE TRIGGER trg_create_message_notification
AFTER INSERT ON public.messages
FOR EACH ROW EXECUTE FUNCTION public.create_message_notification();

-- A professional can reply to an organizer's Flash offer by inserting a
-- booking row (this is not a row in public.messages). Create that notification
-- server-side too; the old client insert was forgeable.
CREATE OR REPLACE FUNCTION public.notify_flash_booking_reply_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $function$
DECLARE
  v_sender_name text;
  v_body text;
BEGIN
  IF auth.uid() IS NULL
     OR NEW.professional_user_id IS DISTINCT FROM auth.uid()
     OR NEW.created_by IS NULL
     OR NEW.created_by = NEW.professional_user_id THEN
    RETURN NEW;
  END IF;

  IF NOT COALESCE((
    SELECT ap.notif_messages FROM public.alert_preferences ap WHERE ap.user_id = NEW.created_by
  ), true) THEN
    RETURN NEW;
  END IF;

  SELECT COALESCE(NULLIF(trim(p.display_name), ''), 'Un profesional') INTO v_sender_name
  FROM public.profiles p
  WHERE p.user_id = NEW.professional_user_id
  ORDER BY p.is_primary DESC
  LIMIT 1;

  v_body := COALESCE(NULLIF(NEW.event_description, ''), 'Ha respondido a tu oferta Flash');
  IF length(v_body) > 80 THEN v_body := left(v_body, 80) || '…'; END IF;

  INSERT INTO public.notifications (user_id, type, title, body, link)
  VALUES (NEW.created_by, 'message', COALESCE(v_sender_name, 'Un profesional') || ' te ha escrito', v_body,
    '/dashboard?view=messages');
  RETURN NEW;
END;
$function$;
REVOKE ALL ON FUNCTION public.notify_flash_booking_reply_message() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS trg_flash_booking_reply_notification ON public.flash_bookings;
CREATE TRIGGER trg_flash_booking_reply_notification
AFTER INSERT ON public.flash_bookings
FOR EACH ROW EXECUTE FUNCTION public.notify_flash_booking_reply_message();
