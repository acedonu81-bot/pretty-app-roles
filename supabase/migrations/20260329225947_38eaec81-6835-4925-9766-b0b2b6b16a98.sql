
-- Add is_live column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_live boolean NOT NULL DEFAULT false;

-- Fan subscriptions table
CREATE TABLE public.fan_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fan_id uuid NOT NULL,
  professional_profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'active',
  amount numeric NOT NULL DEFAULT 4.99,
  created_at timestamptz NOT NULL DEFAULT now(),
  cancelled_at timestamptz,
  UNIQUE(fan_id, professional_profile_id)
);

ALTER TABLE public.fan_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Fans can read own subscriptions" ON public.fan_subscriptions
  FOR SELECT TO authenticated USING (fan_id = auth.uid());

CREATE POLICY "Professionals can read their fan subs" ON public.fan_subscriptions
  FOR SELECT TO authenticated USING (
    professional_profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Fans can insert subscriptions" ON public.fan_subscriptions
  FOR INSERT TO authenticated WITH CHECK (fan_id = auth.uid());

CREATE POLICY "Fans can update own subscriptions" ON public.fan_subscriptions
  FOR UPDATE TO authenticated USING (fan_id = auth.uid());

CREATE POLICY "Admins can read all fan subs" ON public.fan_subscriptions
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Fan messages (real-time chat)
CREATE TABLE public.fan_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL,
  receiver_id uuid NOT NULL,
  professional_profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.fan_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can read their messages" ON public.fan_messages
  FOR SELECT TO authenticated USING (
    sender_id = auth.uid() OR receiver_id = auth.uid()
  );

CREATE POLICY "Authenticated can insert messages" ON public.fan_messages
  FOR INSERT TO authenticated WITH CHECK (sender_id = auth.uid());

-- Enable realtime for fan messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.fan_messages;
