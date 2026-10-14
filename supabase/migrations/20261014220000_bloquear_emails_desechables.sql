-- Bloquea el alta con emails desechables (mailinator, yopmail, temp-mail...).
-- La confirmación por email está desactivada (autoconfirm) para no perder
-- altas del anuncio de Instagram, así que cualquiera podía registrarse con un
-- correo de usar y tirar (14 oct 2026).
--
-- La lista vive solo aquí: la edge function check-email la lee para dar un
-- mensaje claro antes del alta, y este trigger la aplica en el servidor para
-- quien se salte el formulario (signUp directo o signup-inapp). Para bloquear
-- un dominio nuevo basta un INSERT, sin desplegar nada.

CREATE TABLE IF NOT EXISTS public.blocked_email_domains (
  domain text PRIMARY KEY CHECK (domain = lower(domain)),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Sin políticas: solo la leen el trigger (SECURITY DEFINER) y la clave de servicio.
ALTER TABLE public.blocked_email_domains ENABLE ROW LEVEL SECURITY;

INSERT INTO public.blocked_email_domains (domain) VALUES
  ('mailinator.com'), ('mailinator.net'), ('mailinator2.com'), ('yopmail.com'), ('yopmail.fr'),
  ('yopmail.net'), ('guerrillamail.com'), ('guerrillamail.net'), ('guerrillamail.org'),
  ('guerrillamail.biz'), ('guerrillamail.de'), ('guerrillamailblock.com'), ('sharklasers.com'),
  ('grr.la'), ('pokemail.net'), ('spam4.me'), ('10minutemail.com'), ('10minutemail.net'),
  ('10minemail.com'), ('20minutemail.com'), ('temp-mail.org'), ('temp-mail.io'), ('tempmail.com'),
  ('tempmail.net'), ('tempmail.dev'), ('tempmailo.com'), ('tempr.email'), ('tempmail.plus'),
  ('tmpmail.org'), ('tmpmail.net'), ('tmails.net'), ('throwawaymail.com'), ('trashmail.com'),
  ('trashmail.de'), ('trashmail.net'), ('trash-mail.com'), ('getnada.com'), ('nada.email'),
  ('dispostable.com'), ('maildrop.cc'), ('mailnesia.com'), ('mintemail.com'), ('mohmal.com'),
  ('emailondeck.com'), ('fakeinbox.com'), ('fakemail.net'), ('mailcatch.com'), ('mytemp.email'),
  ('moakt.com'), ('burnermail.io'), ('spamgourmet.com'), ('mailpoof.com'), ('inboxkitten.com'),
  ('discard.email'), ('discardmail.com'), ('emailfake.com'), ('email-fake.com'), ('fexbox.org'),
  ('mail.tm'), ('mail.gw'), ('1secmail.com'), ('1secmail.net'), ('1secmail.org'), ('dropmail.me'),
  ('minuteinbox.com'), ('mailtemp.net'), ('tempinbox.com'), ('instantemailaddress.com'),
  ('jetable.org'), ('spambox.us'), ('mvrht.net'), ('harakirimail.com'), ('mailforspam.com'),
  ('anonbox.net'), ('incognitomail.org'), ('owlymail.com'), ('emltmp.com'), ('linshiyouxiang.net'),
  ('crazymailing.com'), ('tempail.com'), ('luxusmail.org'), ('byom.de'), ('wegwerfmail.de'),
  ('einrot.com'), ('spamex.com'), ('mailnull.com'), ('dodgit.com'), ('mailexpire.com'),
  ('correotemporal.org'), ('emailtemporal.org'), ('correo-temporal.com')
ON CONFLICT DO NOTHING;

-- Coincide con el dominio exacto y con sus subdominios (x.mailinator.com).
CREATE OR REPLACE FUNCTION public.email_domain_blocked(p_email text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.blocked_email_domains b
    WHERE lower(split_part(p_email, '@', 2)) = b.domain
       OR lower(split_part(p_email, '@', 2)) LIKE '%.' || b.domain
  );
$$;

REVOKE ALL ON FUNCTION public.email_domain_blocked(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.email_domain_blocked(text) TO service_role;

CREATE OR REPLACE FUNCTION public.block_disposable_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.email IS NOT NULL AND public.email_domain_blocked(NEW.email) THEN
    RAISE EXCEPTION 'Email desechable no permitido: %', split_part(NEW.email, '@', 2)
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS block_disposable_email ON auth.users;
CREATE TRIGGER block_disposable_email
  BEFORE INSERT OR UPDATE OF email ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.block_disposable_email();
