
CREATE TABLE public.cancellation_surveys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  plan text NOT NULL,
  reason text NOT NULL,
  comment text,
  retention_accepted boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.cancellation_surveys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own surveys" ON public.cancellation_surveys
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can read own surveys" ON public.cancellation_surveys
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Admins can read all surveys" ON public.cancellation_surveys
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.retention_discounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  plan text NOT NULL,
  discount_percent numeric NOT NULL DEFAULT 30,
  duration_months integer NOT NULL DEFAULT 3,
  activated_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '3 months'),
  UNIQUE(user_id, plan)
);

ALTER TABLE public.retention_discounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own discounts" ON public.retention_discounts
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can insert own discounts" ON public.retention_discounts
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can read all discounts" ON public.retention_discounts
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
