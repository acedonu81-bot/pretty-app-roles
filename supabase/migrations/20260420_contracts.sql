-- Tabla de contratos generados por empresarios en XPEAK
CREATE TABLE IF NOT EXISTS public.contracts (
  id            uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       uuid        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  ref           text        NOT NULL,
  professional_name  text,
  professional_role  text,
  event_type    text,
  event_name    text,
  event_date    text,
  venue         text,
  city          text,
  contratante_nombre text,
  empresa_nombre     text,
  precio_neto   numeric(10,2),
  retencion     numeric(4,2),
  created_at    timestamptz DEFAULT now()
);

ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own contracts"
  ON public.contracts FOR ALL
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
