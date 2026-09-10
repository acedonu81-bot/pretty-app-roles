-- Migration: fix auth_rls_initplan performance warnings (71 policies)
-- Wraps auth.uid()/auth.role() calls in RLS policies with (select ...) so Postgres
-- evaluates them once per query instead of once per row (initplan optimization).
-- Also consolidates 2 pairs of genuinely redundant permissive policies
-- (multiple_permissive_policies warning). Logic is preserved exactly; only
-- performance characteristics change. See accompanying summary for details.

BEGIN;

DROP POLICY IF EXISTS "Usuarios insertan sus propias solicitudes" ON public.feature_requests;
CREATE POLICY "Usuarios insertan sus propias solicitudes" ON public.feature_requests FOR INSERT TO public
  WITH CHECK (((select auth.uid()) = user_id));

DROP POLICY IF EXISTS "Solo administradores ven las solicitudes" ON public.feature_requests;
CREATE POLICY "Solo administradores ven las solicitudes" ON public.feature_requests FOR SELECT TO public
  USING ((EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = 'admin'::text)))));

DROP POLICY IF EXISTS "Professional and requester can read flash bookings" ON public.flash_bookings;
CREATE POLICY "Professional and requester can read flash bookings" ON public.flash_bookings FOR SELECT TO authenticated
  USING (((professional_user_id = (select auth.uid())) OR (created_by = (select auth.uid()))));

DROP POLICY IF EXISTS "profile_business_views_select_own" ON public.profile_business_views;
CREATE POLICY "profile_business_views_select_own" ON public.profile_business_views FOR SELECT TO authenticated
  USING (((select auth.uid()) = viewed_user_id));

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO public
  WITH CHECK (((select auth.uid()) = user_id));

DROP POLICY IF EXISTS "Employers delete own flash_jobs" ON public.flash_jobs;
CREATE POLICY "Employers delete own flash_jobs" ON public.flash_jobs FOR DELETE TO authenticated
  USING (((select auth.uid()) = employer_id));

DROP POLICY IF EXISTS "Fans manage own subscriptions" ON public.fan_subscriptions;
CREATE POLICY "Fans manage own subscriptions" ON public.fan_subscriptions FOR ALL TO public
  USING (((select auth.uid()) = fan_user_id))
  WITH CHECK (((select auth.uid()) = fan_user_id));

DROP POLICY IF EXISTS "Users read own notifications" ON public.notifications;
CREATE POLICY "Users read own notifications" ON public.notifications FOR SELECT TO authenticated
  USING (((select auth.uid()) = user_id));

DROP POLICY IF EXISTS "Users update own notifications" ON public.notifications;
CREATE POLICY "Users update own notifications" ON public.notifications FOR UPDATE TO authenticated
  USING (((select auth.uid()) = user_id))
  WITH CHECK (((select auth.uid()) = user_id));

DROP POLICY IF EXISTS "Receiver can mark as read" ON public.messages;
CREATE POLICY "Receiver can mark as read" ON public.messages FOR UPDATE TO public
  USING ((EXISTS ( SELECT 1
   FROM conversations c
  WHERE ((c.id = messages.conversation_id) AND ((c.participant_a = (select auth.uid())) OR (c.participant_b = (select auth.uid())))))));

DROP POLICY IF EXISTS "Owner sees own availability" ON public.availability;
CREATE POLICY "Owner sees own availability" ON public.availability FOR SELECT TO public
  USING (((select auth.uid()) = user_id));

DROP POLICY IF EXISTS "Owner manages availability" ON public.availability;
CREATE POLICY "Owner manages availability" ON public.availability FOR INSERT TO public
  WITH CHECK (((select auth.uid()) = user_id));

DROP POLICY IF EXISTS "Owner deletes availability" ON public.availability;
CREATE POLICY "Owner deletes availability" ON public.availability FOR DELETE TO public
  USING (((select auth.uid()) = user_id));

DROP POLICY IF EXISTS "Users can read own roles" ON public.user_roles;
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated
  USING (((select auth.uid()) = user_id));

DROP POLICY IF EXISTS "Owner manage" ON public.fan_club_sessions;
CREATE POLICY "Owner manage" ON public.fan_club_sessions FOR ALL TO public
  USING ((profile_id IN ( SELECT profiles.id
   FROM profiles
  WHERE (profiles.user_id = (select auth.uid())))));

DROP POLICY IF EXISTS "Users manage own favorites" ON public.favorites;
CREATE POLICY "Users manage own favorites" ON public.favorites FOR ALL TO public
  USING (((select auth.uid()) = user_id))
  WITH CHECK (((select auth.uid()) = user_id));

DROP POLICY IF EXISTS "Employers insert own flash_jobs" ON public.flash_jobs;
CREATE POLICY "Employers insert own flash_jobs" ON public.flash_jobs FOR INSERT TO authenticated
  WITH CHECK (((select auth.uid()) = employer_id));

DROP POLICY IF EXISTS "Professionals read own subscribers" ON public.fan_subscriptions;
CREATE POLICY "Professionals read own subscribers" ON public.fan_subscriptions FOR SELECT TO authenticated
  USING ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = fan_subscriptions.professional_profile_id) AND (profiles.user_id = (select auth.uid()))))));

DROP POLICY IF EXISTS "Users insert own survey" ON public.cancellation_surveys;
CREATE POLICY "Users insert own survey" ON public.cancellation_surveys FOR INSERT TO authenticated
  WITH CHECK (((select auth.uid()) = user_id));

DROP POLICY IF EXISTS "Admins read all surveys" ON public.cancellation_surveys;
CREATE POLICY "Admins read all surveys" ON public.cancellation_surveys FOR SELECT TO authenticated
  USING ((EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = 'admin'::text)))));

DROP POLICY IF EXISTS "Admins manage discounts" ON public.retention_discounts;
CREATE POLICY "Admins manage discounts" ON public.retention_discounts FOR ALL TO authenticated
  USING ((EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = 'admin'::text)))));

DROP POLICY IF EXISTS "Users read own discounts" ON public.retention_discounts;
CREATE POLICY "Users read own discounts" ON public.retention_discounts FOR SELECT TO authenticated
  USING (((select auth.uid()) = user_id));

DROP POLICY IF EXISTS "Users insert own votes" ON public.votes;
CREATE POLICY "Users insert own votes" ON public.votes FOR INSERT TO authenticated
  WITH CHECK (((select auth.uid()) = voter_id));

DROP POLICY IF EXISTS "Fan chat participants can read" ON public.fan_messages;
CREATE POLICY "Fan chat participants can read" ON public.fan_messages FOR SELECT TO authenticated
  USING (((sender_id = (select auth.uid())) OR (receiver_id = (select auth.uid()))));

DROP POLICY IF EXISTS "Fan chat sender can insert" ON public.fan_messages;
CREATE POLICY "Fan chat sender can insert" ON public.fan_messages FOR INSERT TO authenticated
  WITH CHECK ((sender_id = (select auth.uid())));

DROP POLICY IF EXISTS "profile_posts_own_insert" ON public.profile_posts;
CREATE POLICY "profile_posts_own_insert" ON public.profile_posts FOR INSERT TO public
  WITH CHECK (((select auth.uid()) = user_id));

DROP POLICY IF EXISTS "profile_posts_own_delete" ON public.profile_posts;
CREATE POLICY "profile_posts_own_delete" ON public.profile_posts FOR DELETE TO public
  USING (((select auth.uid()) = user_id));

DROP POLICY IF EXISTS "Users manage own contracts" ON public.contracts;
CREATE POLICY "Users manage own contracts" ON public.contracts FOR ALL TO public
  USING (((select auth.uid()) = user_id))
  WITH CHECK (((select auth.uid()) = user_id));

DROP POLICY IF EXISTS "Users can insert their own promo uses" ON public.promo_code_uses;
CREATE POLICY "Users can insert their own promo uses" ON public.promo_code_uses FOR INSERT TO authenticated
  WITH CHECK ((user_id = (select auth.uid())));

DROP POLICY IF EXISTS "Users can read their own promo uses" ON public.promo_code_uses;
CREATE POLICY "Users can read their own promo uses" ON public.promo_code_uses FOR SELECT TO authenticated
  USING ((user_id = (select auth.uid())));

DROP POLICY IF EXISTS "Users can manage own viewer session" ON public.live_sessions;
CREATE POLICY "Users can manage own viewer session" ON public.live_sessions FOR ALL TO public
  USING (((select auth.uid()) = viewer_id));

DROP POLICY IF EXISTS "Professional can update own flash bookings" ON public.flash_bookings;
CREATE POLICY "Professional can update own flash bookings" ON public.flash_bookings FOR UPDATE TO authenticated
  USING ((professional_user_id = (select auth.uid())))
  WITH CHECK ((professional_user_id = (select auth.uid())));

DROP POLICY IF EXISTS "Users read own calendar events" ON public.calendar_events;
CREATE POLICY "Users read own calendar events" ON public.calendar_events FOR SELECT TO authenticated
  USING (((select auth.uid()) = user_id));

DROP POLICY IF EXISTS "Users insert own calendar events" ON public.calendar_events;
CREATE POLICY "Users insert own calendar events" ON public.calendar_events FOR INSERT TO authenticated
  WITH CHECK (((select auth.uid()) = user_id));

DROP POLICY IF EXISTS "Users update own calendar events" ON public.calendar_events;
CREATE POLICY "Users update own calendar events" ON public.calendar_events FOR UPDATE TO authenticated
  USING (((select auth.uid()) = user_id))
  WITH CHECK (((select auth.uid()) = user_id));

DROP POLICY IF EXISTS "Users delete own calendar events" ON public.calendar_events;
CREATE POLICY "Users delete own calendar events" ON public.calendar_events FOR DELETE TO authenticated
  USING (((select auth.uid()) = user_id));

DROP POLICY IF EXISTS "Users can view own blocks" ON public.blocked_users;
CREATE POLICY "Users can view own blocks" ON public.blocked_users FOR SELECT TO authenticated
  USING ((blocker_id = (select auth.uid())));

DROP POLICY IF EXISTS "Users can block others" ON public.blocked_users;
CREATE POLICY "Users can block others" ON public.blocked_users FOR INSERT TO authenticated
  WITH CHECK ((blocker_id = (select auth.uid())));

DROP POLICY IF EXISTS "Users can unblock others" ON public.blocked_users;
CREATE POLICY "Users can unblock others" ON public.blocked_users FOR DELETE TO authenticated
  USING ((blocker_id = (select auth.uid())));

DROP POLICY IF EXISTS "Participants can view their conversations" ON public.conversations;
CREATE POLICY "Participants can view their conversations" ON public.conversations FOR SELECT TO authenticated
  USING ((((select auth.uid()) = participant_a) OR ((select auth.uid()) = participant_b)));

DROP POLICY IF EXISTS "Participants can create conversations" ON public.conversations;
CREATE POLICY "Participants can create conversations" ON public.conversations FOR INSERT TO authenticated
  WITH CHECK ((((select auth.uid()) = participant_a) OR ((select auth.uid()) = participant_b)));

DROP POLICY IF EXISTS "Participants can update their conversations" ON public.conversations;
CREATE POLICY "Participants can update their conversations" ON public.conversations FOR UPDATE TO authenticated
  USING ((((select auth.uid()) = participant_a) OR ((select auth.uid()) = participant_b)))
  WITH CHECK ((((select auth.uid()) = participant_a) OR ((select auth.uid()) = participant_b)));

DROP POLICY IF EXISTS "Participants can view messages" ON public.messages;
CREATE POLICY "Participants can view messages" ON public.messages FOR SELECT TO authenticated
  USING ((EXISTS ( SELECT 1
   FROM conversations c
  WHERE ((c.id = messages.conversation_id) AND (((select auth.uid()) = c.participant_a) OR ((select auth.uid()) = c.participant_b))))));

DROP POLICY IF EXISTS "Participants can send messages" ON public.messages;
CREATE POLICY "Participants can send messages" ON public.messages FOR INSERT TO authenticated
  WITH CHECK (((sender_id = (select auth.uid())) AND (EXISTS ( SELECT 1
   FROM conversations c
  WHERE ((c.id = messages.conversation_id) AND (((select auth.uid()) = c.participant_a) OR ((select auth.uid()) = c.participant_b))))) AND (NOT (EXISTS ( SELECT 1
   FROM (blocked_users b
     JOIN conversations c ON ((c.id = messages.conversation_id)))
  WHERE (((b.blocker_id = c.participant_a) AND (b.blocked_id = c.participant_b)) OR ((b.blocker_id = c.participant_b) AND (b.blocked_id = c.participant_a))))))));

DROP POLICY IF EXISTS "Admins actualizan su marca" ON public.admin_activity_seen;
CREATE POLICY "Admins actualizan su marca" ON public.admin_activity_seen FOR UPDATE TO authenticated
  USING (((select auth.uid()) = user_id))
  WITH CHECK (((select auth.uid()) = user_id));

DROP POLICY IF EXISTS "Sender can soft-delete own message" ON public.messages;
CREATE POLICY "Sender can soft-delete own message" ON public.messages FOR UPDATE TO authenticated
  USING ((sender_id = (select auth.uid())))
  WITH CHECK ((sender_id = (select auth.uid())));

DROP POLICY IF EXISTS "Users can view referrals they are part of" ON public.referrals;
CREATE POLICY "Users can view referrals they are part of" ON public.referrals FOR SELECT TO authenticated
  USING ((((select auth.uid()) = inviter_user_id) OR ((select auth.uid()) = invitee_user_id)));

DROP POLICY IF EXISTS "Anyone can register as invitee" ON public.referrals;
CREATE POLICY "Anyone can register as invitee" ON public.referrals FOR INSERT TO authenticated
  WITH CHECK ((invitee_user_id = (select auth.uid())));

DROP POLICY IF EXISTS "Authenticated can insert dance socials" ON public.dance_socials;
CREATE POLICY "Authenticated can insert dance socials" ON public.dance_socials FOR INSERT TO authenticated
  WITH CHECK (((select auth.uid()) = user_id));

DROP POLICY IF EXISTS "Owner can update own dance socials" ON public.dance_socials;
CREATE POLICY "Owner can update own dance socials" ON public.dance_socials FOR UPDATE TO authenticated
  USING (((select auth.uid()) = user_id));

DROP POLICY IF EXISTS "Owner can delete own dance socials" ON public.dance_socials;
CREATE POLICY "Owner can delete own dance socials" ON public.dance_socials FOR DELETE TO authenticated
  USING (((select auth.uid()) = user_id));

DROP POLICY IF EXISTS "Admins can read mcp query log" ON public.mcp_query_log;
CREATE POLICY "Admins can read mcp query log" ON public.mcp_query_log FOR SELECT TO authenticated
  USING (has_role((select auth.uid()), 'admin'::text));

DROP POLICY IF EXISTS "leads_select_admin" ON public.leads;
CREATE POLICY "leads_select_admin" ON public.leads FOR SELECT TO authenticated
  USING (has_role((select auth.uid()), 'admin'::text));

DROP POLICY IF EXISTS "Users manage their own alert preferences" ON public.alert_preferences;
CREATE POLICY "Users manage their own alert preferences" ON public.alert_preferences FOR ALL TO public
  USING (((select auth.uid()) = user_id))
  WITH CHECK (((select auth.uid()) = user_id));

DROP POLICY IF EXISTS "Employer can cancel own pending flash bookings" ON public.flash_bookings;
CREATE POLICY "Employer can cancel own pending flash bookings" ON public.flash_bookings FOR UPDATE TO authenticated
  USING (((created_by = (select auth.uid())) AND (status = 'pending'::text)))
  WITH CHECK (((created_by = (select auth.uid())) AND (status = 'cancelled'::text)));

DROP POLICY IF EXISTS "Professional can anonymize own booking on account deletion" ON public.flash_bookings;
CREATE POLICY "Professional can anonymize own booking on account deletion" ON public.flash_bookings FOR UPDATE TO authenticated
  USING ((professional_user_id = (select auth.uid())))
  WITH CHECK (((professional_user_id IS NULL) AND (professional_name = 'Profesional eliminado'::text)));

DROP POLICY IF EXISTS "Users manage their own push subscriptions" ON public.push_subscriptions;
CREATE POLICY "Users manage their own push subscriptions" ON public.push_subscriptions FOR ALL TO public
  USING (((select auth.uid()) = user_id))
  WITH CHECK (((select auth.uid()) = user_id));

DROP POLICY IF EXISTS "Admins read profile deletions" ON public.profile_deletions;
CREATE POLICY "Admins read profile deletions" ON public.profile_deletions FOR SELECT TO public
  USING (has_role((select auth.uid()), 'admin'::text));

DROP POLICY IF EXISTS "Admins ack profile deletions" ON public.profile_deletions;
CREATE POLICY "Admins ack profile deletions" ON public.profile_deletions FOR UPDATE TO public
  USING (has_role((select auth.uid()), 'admin'::text))
  WITH CHECK (has_role((select auth.uid()), 'admin'::text));

DROP POLICY IF EXISTS "Admins delete profile deletions" ON public.profile_deletions;
CREATE POLICY "Admins delete profile deletions" ON public.profile_deletions FOR DELETE TO public
  USING (has_role((select auth.uid()), 'admin'::text));

DROP POLICY IF EXISTS "Admins leen su marca" ON public.admin_activity_seen;
CREATE POLICY "Admins leen su marca" ON public.admin_activity_seen FOR SELECT TO authenticated
  USING ((((select auth.uid()) = user_id) AND (EXISTS ( SELECT 1
   FROM user_roles r
  WHERE ((r.user_id = (select auth.uid())) AND (r.role = 'admin'::text))))));

DROP POLICY IF EXISTS "Admins escriben su marca" ON public.admin_activity_seen;
CREATE POLICY "Admins escriben su marca" ON public.admin_activity_seen FOR INSERT TO authenticated
  WITH CHECK ((((select auth.uid()) = user_id) AND (EXISTS ( SELECT 1
   FROM user_roles r
  WHERE ((r.user_id = (select auth.uid())) AND (r.role = 'admin'::text))))));

DROP POLICY IF EXISTS "reviews_insert_verified_booking" ON public.reviews;
CREATE POLICY "reviews_insert_verified_booking" ON public.reviews FOR INSERT TO authenticated
  WITH CHECK ((EXISTS ( SELECT 1
   FROM flash_bookings fb
  WHERE ((fb.created_by = (select auth.uid())) AND (fb.professional_user_id = reviews.reviewed_user_id) AND (fb.status = ANY (ARRAY['accepted'::text, 'confirmed'::text, 'completed'::text]))))));

DROP POLICY IF EXISTS "er_update" ON public.event_requests;
CREATE POLICY "er_update" ON public.event_requests FOR UPDATE TO authenticated
  USING (((client_user_id IS NOT NULL) AND (client_user_id = ((select auth.uid()))::text)))
  WITH CHECK (((client_user_id IS NOT NULL) AND (client_user_id = ((select auth.uid()))::text)));

DROP POLICY IF EXISTS "Admins leen client_errors" ON public.client_errors;
CREATE POLICY "Admins leen client_errors" ON public.client_errors FOR SELECT TO authenticated
  USING ((EXISTS ( SELECT 1
   FROM user_roles r
  WHERE ((r.user_id = (select auth.uid())) AND (r.role = 'admin'::text)))));

DROP POLICY IF EXISTS "Admins gestionan descartes" ON public.admin_alertas_descartadas;
CREATE POLICY "Admins gestionan descartes" ON public.admin_alertas_descartadas FOR ALL TO authenticated
  USING ((EXISTS ( SELECT 1
   FROM user_roles r
  WHERE ((r.user_id = (select auth.uid())) AND (r.role = 'admin'::text)))))
  WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles r
  WHERE ((r.user_id = (select auth.uid())) AND (r.role = 'admin'::text)))));

DROP POLICY IF EXISTS "Admins leen analytics" ON public.analytics_events;
CREATE POLICY "Admins leen analytics" ON public.analytics_events FOR SELECT TO authenticated
  USING ((EXISTS ( SELECT 1
   FROM user_roles r
  WHERE ((r.user_id = (select auth.uid())) AND (r.role = 'admin'::text)))));

-- ==========================================================================
-- CONSOLIDATION: multiple_permissive_policies (genuinely redundant only)
-- ==========================================================================

-- flash_bookings (INSERT, authenticated): NO se consolidan con OR.
-- "Authenticated can insert flash bookings" WITH CHECK (auth.uid() IS NOT NULL)
-- es un remanente no versionado (creado fuera de migraciones, ver comentario
-- de 20260707_fix_flash_bookings_insert_rls.sql) que sobrevivió al fix de
-- seguridad de 20260909150000_flash_bookings_require_auth_for_professional.sql:
-- como es PERMISSIVE, se combina con OR con la política restrictiva y permite
-- a CUALQUIER usuario logueado insertar con created_by de otra persona,
-- deshaciendo ese fix por completo. Se elimina, no se fusiona — encontrado
-- al revisar esta migración el 10 sep 2026, antes de aplicarla.
DROP POLICY IF EXISTS "Authenticated can insert flash bookings" ON public.flash_bookings;

DROP POLICY IF EXISTS "Authenticated can insert own bookings" ON public.flash_bookings;
CREATE POLICY "Authenticated can insert own bookings" ON public.flash_bookings FOR INSERT TO authenticated
  WITH CHECK (((created_by IS NULL) OR (created_by = (select auth.uid()))));

-- profiles (UPDATE, authenticated): consolidate
--   "Admins can update any profile" USING (has_role(auth.uid(), 'admin'::text)) WITH CHECK (has_role(auth.uid(), 'admin'::text))
--   "Users can update own profile" USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id))
-- Both policies use the SAME condition for USING and WITH CHECK (symmetric),
-- so OR-combining USING and OR-combining WITH CHECK independently preserves
-- the exact same net permission: a row is updatable (and stays valid) if the
-- caller is an admin OR is updating their own profile.
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Admins or owner can update profile" ON public.profiles FOR UPDATE TO authenticated
  USING ((has_role((select auth.uid()), 'admin'::text)) OR (((select auth.uid()) = user_id)))
  WITH CHECK ((has_role((select auth.uid()), 'admin'::text)) OR (((select auth.uid()) = user_id)));

COMMIT;