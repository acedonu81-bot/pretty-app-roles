-- Cobros con Stripe (preparado 13 nov 2026, sin desplegar hasta que Daniel lo diga).
-- Solo el webhook (service role) escribe aquí. El usuario solo lee su fila.

CREATE TABLE IF NOT EXISTS public.suscripciones (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id text UNIQUE NOT NULL,
  stripe_subscription_id text UNIQUE,
  plan text CHECK (plan IN ('starter', 'business')),
  ciclo text CHECK (ciclo IN ('mensual', 'anual')),
  estado text,
  periodo_fin timestamptz,
  cancela_al_final boolean NOT NULL DEFAULT false,
  stripe_evento_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.suscripciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "suscripciones: el dueño lee la suya"
  ON public.suscripciones FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "suscripciones: admin lee todas"
  ON public.suscripciones FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

GRANT SELECT ON public.suscripciones TO authenticated;

-- Eventos de Stripe ya procesados (Stripe reintenta y puede repetir).
CREATE TABLE IF NOT EXISTS public.stripe_eventos (
  id text PRIMARY KEY,
  tipo text NOT NULL,
  recibido_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.stripe_eventos ENABLE ROW LEVEL SECURITY;
