-- Bug encontrado el 13 sep 2026 al verificar el fix de reviews_reconoce_event_requests:
-- 0 reseñas se han guardado NUNCA en toda la tabla reviews, en ningún caso
-- (ni Flash Booking ni Event Request). Causa: supabase-js v2 hace
-- `Prefer: return=representation` por defecto en cualquier .insert(), incluso
-- cuando el código solo destructura `{ error }` y nunca usa la fila devuelta
-- (HistorialTab.tsx y SolicitudesTab.tsx lo hacen así). Con RETURNING,
-- Postgres evalúa también las policies de SELECT sobre la fila insertada —
-- y las únicas dos que había eran "admin ve todo" o "approved = true". Una
-- reseña nace siempre con approved:false (pendiente de moderación), así que
-- el propio autor nunca podía ver su fila recién creada: el INSERT entero
-- se revertía con "new row violates row-level security policy".
--
-- Reproducido de forma aislada con SET LOCAL ROLE authenticated: el INSERT
-- sin RETURNING pasaba limpio; el mismo INSERT con RETURNING (lo que hace
-- supabase-js internamente) fallaba con 42501.

CREATE POLICY "reviews_select_own_pending" ON public.reviews
  FOR SELECT USING (reviewer_id = auth.uid());
