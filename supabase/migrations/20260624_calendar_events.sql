-- Eventos / bolos del calendario del profesional. Antes vivían solo en localStorage;
-- ahora se sincronizan en Supabase para que sigan al usuario entre dispositivos.
CREATE TABLE IF NOT EXISTS public.calendar_events (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  event_date DATE NOT NULL,
  location   TEXT,
  notes      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS calendar_events_user_date_idx
  ON public.calendar_events (user_id, event_date);

ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- El dueño puede leer sus propios eventos
DROP POLICY IF EXISTS "Users read own calendar events" ON public.calendar_events;
CREATE POLICY "Users read own calendar events"
ON public.calendar_events FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- El dueño puede crear sus propios eventos
DROP POLICY IF EXISTS "Users insert own calendar events" ON public.calendar_events;
CREATE POLICY "Users insert own calendar events"
ON public.calendar_events FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- El dueño puede actualizar sus propios eventos
DROP POLICY IF EXISTS "Users update own calendar events" ON public.calendar_events;
CREATE POLICY "Users update own calendar events"
ON public.calendar_events FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- El dueño puede borrar sus propios eventos
DROP POLICY IF EXISTS "Users delete own calendar events" ON public.calendar_events;
CREATE POLICY "Users delete own calendar events"
ON public.calendar_events FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
