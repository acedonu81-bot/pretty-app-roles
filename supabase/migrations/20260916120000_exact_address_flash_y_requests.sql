-- Dirección exacta del evento, separada de la ubicación aproximada
-- (event_location / city) que ya se ve antes de aceptar. Solo se rellena
-- opcionalmente al crear la solicitud y solo se debe mostrar al profesional
-- una vez la reserva está confirmada/aceptada — nunca antes.
ALTER TABLE public.flash_bookings ADD COLUMN IF NOT EXISTS exact_address text;
ALTER TABLE public.event_requests ADD COLUMN IF NOT EXISTS exact_address text;
