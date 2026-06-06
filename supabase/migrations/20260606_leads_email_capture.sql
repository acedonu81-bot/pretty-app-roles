-- Tabla para capturar leads del blog antes del registro completo
CREATE TABLE IF NOT EXISTS public.leads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  source text NOT NULL DEFAULT 'blog', -- 'blog', 'lead_magnet', 'scroll_cta'
  article_path text,                    -- qué artículo originó el lead
  intent text,                          -- 'contratar-dj', 'ser-profesional', etc.
  created_at timestamptz DEFAULT now(),
  converted_at timestamptz,             -- cuando se registró de verdad
  UNIQUE(email)
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Solo insert anónimo permitido (el usuario no necesita estar autenticado)
CREATE POLICY "leads_insert_anon" ON public.leads
  FOR INSERT TO anon WITH CHECK (true);

-- Admins pueden leerlos
CREATE POLICY "leads_select_admin" ON public.leads
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE INDEX IF NOT EXISTS leads_email_idx ON public.leads(email);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON public.leads(created_at DESC);
