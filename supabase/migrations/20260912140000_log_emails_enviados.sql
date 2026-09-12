-- Control absoluto sobre lo que se manda a cada usuario, mientras hay pocos.
--
-- "Ahora quiero tener control absoluto" (12 sep 2026): el admin quiere poder
-- ver, desde el feed de Actividad, exactamente qué email se le mandó a cada
-- profesional/organizador y con qué contenido (el HTML real, no un resumen).
-- email_logs (20260501) solo registraba type+sent_at de los cron de
-- aniversario, para evitar duplicados — nunca guardó asunto ni HTML, y no
-- cubre los envíos transaccionales de send-email (bienvenida, Flash Booking,
-- contratación...), que son la mayoría.
--
-- Este log es una tabla nueva y separada (no se toca email_logs, que sigue
-- siendo el control de duplicados de los cron) que registra CADA email que
-- pasa por la edge function send-email: destinatario, tipo, asunto y el HTML
-- final tal cual se envió.

CREATE TABLE IF NOT EXISTS public.email_send_log (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  to_email    text NOT NULL,
  type        text NOT NULL,
  subject     text NOT NULL,
  html        text NOT NULL,
  sent_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS email_send_log_user_id ON public.email_send_log (user_id, sent_at DESC);
CREATE INDEX IF NOT EXISTS email_send_log_to_email ON public.email_send_log (to_email, sent_at DESC);

COMMENT ON TABLE public.email_send_log IS
  'Cada email que pasa por la edge function send-email, con su HTML completo. Alimenta el tooltip "qué se le mandó" del feed de Actividad del admin.';

ALTER TABLE public.email_send_log ENABLE ROW LEVEL SECURITY;

-- Solo el admin lee, y solo vía RPC (mismo patrón que el resto de tablas
-- sensibles de este proyecto: RLS bloquea todo, service_role de la edge
-- function inserta sin pasar por RLS, y una función SECURITY DEFINER expone
-- lectura solo a quien es_admin()).
CREATE POLICY "Solo admin lee" ON public.email_send_log FOR SELECT TO authenticated
USING (public.es_admin());
REVOKE ALL ON public.email_send_log FROM anon;

CREATE OR REPLACE FUNCTION public.admin_emails_de_usuario(p_user_id uuid)
RETURNS TABLE(id uuid, type text, subject text, html text, sent_at timestamptz)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.es_admin() THEN RAISE EXCEPTION 'Solo admin'; END IF;
  RETURN QUERY
    SELECT l.id, l.type, l.subject, l.html, l.sent_at
    FROM public.email_send_log l
    WHERE l.user_id = p_user_id
    ORDER BY l.sent_at DESC;
END;
$function$;
