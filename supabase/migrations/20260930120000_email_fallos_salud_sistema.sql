-- "Salud del sistema" no podía ver fallos de email: el cron solo lanza la
-- llamada HTTP y siempre termina "succeeded" aunque send-email rechace todo.
-- 29 sep 2026: los recordatorios de los crons recibieron 403/429 durante un día
-- entero y el panel siguió en verde. send-email registra aquí cada fallo de un
-- envío de confianza (cron, trigger, servicio) o de SMTP; la vista lo muestra.
CREATE TABLE IF NOT EXISTS public.email_fallos (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  type text,
  status int NOT NULL,
  motivo text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.email_fallos ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.email_fallos FROM PUBLIC, anon, authenticated;
CREATE INDEX IF NOT EXISTS email_fallos_created_at_idx ON public.email_fallos (created_at DESC);

-- Nueva alerta en admin_salud_sistema, insertada en la definición vigente
-- (no se reescribe a mano para no pisar las demás ramas). La clave lleva la
-- fecha: descartar la alerta la oculta, pero un fallo de otro día vuelve a salir.
DO $mig$
DECLARE d text;
BEGIN
  d := pg_get_viewdef('public.admin_salud_sistema'::regclass, true);
  IF position('email_fallido' IN d) > 0 THEN RETURN; END IF;
  d := replace(d, $x$SELECT 'crash_cliente'::text$x$, $x$SELECT 'email_fallido'::text,
            'critico'::text,
            COALESCE(f.type, '?'::text),
            ((('Rechazado '::text || count(*)) || ' vez/veces · HTTP '::text) || f.status) || COALESCE(' · '::text || max(f.motivo), ''::text),
            max(f.created_at),
            (((('email_fallido|'::text || COALESCE(f.type, '?'::text)) || '|'::text) || f.status) || '|'::text) || to_char(max(f.created_at), 'YYYYMMDD'::text)
           FROM email_fallos f
          WHERE f.created_at > (now() - '7 days'::interval)
          GROUP BY f.type, f.status
        UNION ALL
         SELECT 'crash_cliente'::text$x$);
  EXECUTE 'CREATE OR REPLACE VIEW public.admin_salud_sistema AS ' || d;
END
$mig$;
