CREATE TABLE IF NOT EXISTS public.flash_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_name TEXT NOT NULL,
  professional_role TEXT,
  requester_name TEXT NOT NULL,
  requester_contact TEXT NOT NULL,
  event_date TEXT,
  event_location TEXT,
  event_description TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.flash_bookings ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede enviar una solicitud (sin login)
CREATE POLICY "Anyone can insert flash bookings"
ON public.flash_bookings FOR INSERT TO public
WITH CHECK (true);

-- Solo usuarios autenticados pueden leer (para el panel del profesional)
CREATE POLICY "Authenticated can read flash bookings"
ON public.flash_bookings FOR SELECT TO authenticated
USING (true);

-- Solo admins pueden actualizar el estado
CREATE POLICY "Authenticated can update status"
ON public.flash_bookings FOR UPDATE TO authenticated
USING (true);
