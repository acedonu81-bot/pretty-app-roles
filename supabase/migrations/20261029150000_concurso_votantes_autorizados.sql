-- (29 oct 2026) Concurso DJ: un empresario real con correo de empresa
-- (p. ej. arteandrinks.com) no podía votar porque solo valen Google y los
-- correos de proveedores grandes (regla del 19 oct contra votos falsos).
-- Abrirlo por rol no sirve: el rol lo elige cada persona al registrarse y el
-- perfil se aprueba solo. Se deja una lista de excepciones que mantiene el
-- admin; un dominio desechable bloqueado sigue sin poder votar aunque esté en la lista.

CREATE TABLE IF NOT EXISTS public.concurso_votantes_autorizados (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  motivo text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.concurso_votantes_autorizados ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.concurso_votantes_autorizados FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.concurso_votante_valido(p_user uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM auth.users u
    WHERE u.id = p_user
      AND NOT public.email_domain_blocked(u.email)
      AND (
        COALESCE(u.raw_app_meta_data->'providers', '[]'::jsonb) ? 'google'
        OR lower(split_part(u.email, '@', 2)) IN (
          'gmail.com','googlemail.com',
          'hotmail.com','hotmail.es','outlook.com','outlook.es','live.com','live.es','msn.com',
          'yahoo.com','yahoo.es','ymail.com','icloud.com','me.com','mac.com',
          'proton.me','protonmail.com','gmx.com','gmx.es','movistar.es','telefonica.net','terra.es','orange.es'
        )
        OR EXISTS (SELECT 1 FROM public.concurso_votantes_autorizados a WHERE a.user_id = u.id)
      )
  );
$function$;

REVOKE EXECUTE ON FUNCTION public.concurso_votante_valido(uuid) FROM anon, authenticated;

INSERT INTO public.concurso_votantes_autorizados (user_id, motivo)
SELECT p.user_id, 'Empresario real con correo de empresa (29 oct 2026)'
  FROM public.profiles p JOIN auth.users u ON u.id = p.user_id
 WHERE p.display_name = 'Navarra On Tour' AND lower(split_part(u.email, '@', 2)) = 'arteandrinks.com'
ON CONFLICT DO NOTHING;
