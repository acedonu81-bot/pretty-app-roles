-- send-email solo comprobaba email_opt_out si recibía user_id, y con .single()
-- (falla con varios perfiles). Los crons mandan solo el email, así que el
-- opt-out se ignoraba. Esta función resuelve por user_id o por email.
CREATE OR REPLACE FUNCTION public.email_opted_out(p_user_id uuid, p_email text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.email_opt_out
      AND p.user_id = COALESCE(
        p_user_id,
        (SELECT u.id FROM auth.users u WHERE lower(u.email) = lower(p_email) LIMIT 1)
      )
  );
$$;
REVOKE ALL ON FUNCTION public.email_opted_out(uuid, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.email_opted_out(uuid, text) TO service_role;
