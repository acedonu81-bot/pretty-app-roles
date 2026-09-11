-- 25 foreign keys sin índice de cobertura (advisor de performance, 11 sep
-- 2026). Sin índice, cualquier borrado en la tabla referenciada (ej. borrar
-- un usuario) obliga a un escaneo completo de la tabla hija para comprobar
-- la FK, y cualquier JOIN por esa columna es lento. Con el volumen actual
-- (45 profesionales) no se nota, pero es gratis y sin riesgo arreglarlo ya.
CREATE INDEX IF NOT EXISTS idx_admin_alertas_descartadas_descartada_por ON public.admin_alertas_descartadas (descartada_por);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON public.analytics_events (user_id);
CREATE INDEX IF NOT EXISTS idx_blocked_users_blocked_id ON public.blocked_users (blocked_id);
CREATE INDEX IF NOT EXISTS idx_cancellation_surveys_user_id ON public.cancellation_surveys (user_id);
CREATE INDEX IF NOT EXISTS idx_client_errors_user_id ON public.client_errors (user_id);
CREATE INDEX IF NOT EXISTS idx_contracts_user_id ON public.contracts (user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_participant_b ON public.conversations (participant_b);
CREATE INDEX IF NOT EXISTS idx_dance_socials_user_id ON public.dance_socials (user_id);
CREATE INDEX IF NOT EXISTS idx_fan_club_sessions_profile_id ON public.fan_club_sessions (profile_id);
CREATE INDEX IF NOT EXISTS idx_fan_messages_professional_profile_id ON public.fan_messages (professional_profile_id);
CREATE INDEX IF NOT EXISTS idx_fan_messages_receiver_id ON public.fan_messages (receiver_id);
CREATE INDEX IF NOT EXISTS idx_fan_messages_sender_id ON public.fan_messages (sender_id);
CREATE INDEX IF NOT EXISTS idx_fan_subscriptions_professional_profile_id ON public.fan_subscriptions (professional_profile_id);
CREATE INDEX IF NOT EXISTS idx_favorites_profile_id ON public.favorites (profile_id);
CREATE INDEX IF NOT EXISTS idx_feature_requests_user_id ON public.feature_requests (user_id);
CREATE INDEX IF NOT EXISTS idx_flash_bookings_professional_user_id ON public.flash_bookings (professional_user_id);
CREATE INDEX IF NOT EXISTS idx_flash_jobs_employer_id ON public.flash_jobs (employer_id);
CREATE INDEX IF NOT EXISTS idx_live_sessions_streamer_id ON public.live_sessions (streamer_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages (conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages (sender_id);
CREATE INDEX IF NOT EXISTS idx_profile_views_viewer_id ON public.profile_views (viewer_id);
CREATE INDEX IF NOT EXISTS idx_promo_code_uses_user_id ON public.promo_code_uses (user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_inviter_user_id ON public.referrals (inviter_user_id);
CREATE INDEX IF NOT EXISTS idx_retention_discounts_user_id ON public.retention_discounts (user_id);
CREATE INDEX IF NOT EXISTS idx_votes_profile_id ON public.votes (profile_id);
