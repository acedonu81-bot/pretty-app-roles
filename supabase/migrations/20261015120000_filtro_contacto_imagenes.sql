-- Filtro automático de datos de contacto en imágenes subidas (15 oct 2026,
-- Ficha XDS "Filtro automático de datos de contacto en fotos", 75,7).
-- Política: los Términos (apartado 12) prohíben teléfono/WhatsApp/email/webs en
-- las fotos. Cada imagen nueva en storage se revisa con un modelo de visión
-- (edge function scan-image-contact). Modo 'sombra' = solo registra y avisa;
-- modo 'activo' = además oculta la imagen al público (original a un bucket
-- privado, nunca se borra). Empieza en 'sombra' una semana (mitigación de la ficha).

CREATE TABLE IF NOT EXISTS public.image_contact_config (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  modo text NOT NULL DEFAULT 'sombra' CHECK (modo IN ('apagado', 'sombra', 'activo'))
);
INSERT INTO public.image_contact_config (id, modo) VALUES (true, 'sombra') ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS public.image_contact_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket text NOT NULL,
  path text NOT NULL,
  owner_id uuid,
  nivel text NOT NULL CHECK (nivel IN ('alto', 'bajo')),
  tipos text[] NOT NULL DEFAULT '{}',
  texto text,
  estado text NOT NULL CHECK (estado IN ('sombra', 'oculta', 'restaurada', 'falso_positivo', 'no_revisada')),
  created_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz
);
CREATE INDEX IF NOT EXISTS image_contact_flags_estado_idx ON public.image_contact_flags (estado, created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS image_contact_flags_obj_idx ON public.image_contact_flags (bucket, path) WHERE estado IN ('sombra', 'oculta');

ALTER TABLE public.image_contact_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.image_contact_flags ENABLE ROW LEVEL SECURITY;

-- Solo admins leen/gestionan; la función escribe con clave de servicio.
DROP POLICY IF EXISTS "admin gestiona config filtro" ON public.image_contact_config;
CREATE POLICY "admin gestiona config filtro" ON public.image_contact_config
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "admin gestiona flags imagenes" ON public.image_contact_flags;
CREATE POLICY "admin gestiona flags imagenes" ON public.image_contact_flags
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
GRANT SELECT, INSERT, UPDATE, DELETE ON public.image_contact_config, public.image_contact_flags TO authenticated, service_role;

-- Bucket privado para los originales retirados (nunca se borran).
INSERT INTO storage.buckets (id, name, public) VALUES ('contact-quarantine', 'contact-quarantine', false)
  ON CONFLICT (id) DO NOTHING;

-- Cada imagen nueva en cualquier bucket público dispara la revisión.
CREATE OR REPLACE FUNCTION public.scan_image_contact_trigger() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions AS $$
DECLARE
  v_secret text;
  v_modo text;
  v_anon text := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkcnFod3JhdnVwanp5c3JpYmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NjkwMTIsImV4cCI6MjA5MDE0NTAxMn0.sHR3zuVWIj6Xw_UBI_kuQCcfEFS3oQWjs0dKUtr2Puk';
BEGIN
  IF NEW.bucket_id NOT IN ('audio-sessions', 'portfolios') OR NEW.name !~* '\.(jpe?g|png|webp)$' THEN
    RETURN NEW;
  END IF;
  BEGIN
    SELECT modo INTO v_modo FROM public.image_contact_config WHERE id;
    IF COALESCE(v_modo, 'sombra') = 'apagado' THEN RETURN NEW; END IF;
    SELECT decrypted_secret INTO v_secret FROM vault.decrypted_secrets WHERE name = 'send_email_internal_secret';
    IF v_secret IS NOT NULL THEN
      PERFORM net.http_post(
        url := 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/scan-image-contact',
        headers := jsonb_build_object('Authorization', 'Bearer ' || v_anon, 'x-internal-secret', v_secret, 'Content-Type', 'application/json'),
        body := jsonb_build_object('bucket', NEW.bucket_id, 'name', NEW.name));
    END IF;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'scan_image_contact: %', SQLERRM; -- nunca bloquea la subida
  END;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS scan_image_contact ON storage.objects;
CREATE TRIGGER scan_image_contact AFTER INSERT ON storage.objects
  FOR EACH ROW EXECUTE FUNCTION public.scan_image_contact_trigger();
