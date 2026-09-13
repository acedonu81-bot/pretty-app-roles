-- Las policies de INSERT en `reviews` solo comprobaban flash_bookings, así
-- que una contratación real por la segunda vía (event_request_responses,
-- añadida 10-11 sep 2026) dejaba pasar el botón "Valorar" en el frontend
-- (ya arreglado en SolicitudesTab.tsx y HistorialTab.tsx) pero el INSERT
-- se bloqueaba por RLS sin más explicación: ni error visible más allá de un
-- toast genérico, ni reseña guardada.
--
-- Verificado el 13 sep 2026 con el único caso real de esta vía (Burger
-- Gourmet Fest ↔ Gonzalo DJ, hired_at 10 sep): 0 filas en reviews entre
-- ambos en cualquier dirección, confirmando que nadie ha podido valorar
-- ahí todavía aunque el frontend ya lo intente.

DROP POLICY IF EXISTS "reviews_insert_verified_booking" ON public.reviews;
CREATE POLICY "reviews_insert_verified_booking" ON public.reviews
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.flash_bookings fb
      WHERE fb.created_by = auth.uid()
        AND fb.professional_user_id = reviews.reviewed_user_id
        AND fb.status IN ('accepted', 'confirmed', 'completed')
    )
    OR EXISTS (
      SELECT 1 FROM public.event_request_responses r
      JOIN public.event_requests er ON er.id = r.request_id
      WHERE er.client_user_id = auth.uid()::text
        AND r.professional_user_id = reviews.reviewed_user_id
        AND r.hired_at IS NOT NULL
    )
  );

DROP POLICY IF EXISTS "reviews_insert_verified_booking_reverse" ON public.reviews;
CREATE POLICY "reviews_insert_verified_booking_reverse" ON public.reviews
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.flash_bookings fb
      WHERE fb.professional_user_id = auth.uid()
        AND fb.created_by = reviews.reviewed_user_id
        AND fb.status IN ('accepted', 'confirmed', 'completed')
    )
    OR EXISTS (
      SELECT 1 FROM public.event_request_responses r
      JOIN public.event_requests er ON er.id = r.request_id
      WHERE r.professional_user_id = auth.uid()
        AND er.client_user_id = reviews.reviewed_user_id::text
        AND r.hired_at IS NOT NULL
    )
  );
