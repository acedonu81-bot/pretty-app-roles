-- La valoración nunca podía enviarse: la RLS y la UI hablaban de estados
-- distintos.
--
-- La política exigía flash_bookings.status = 'accepted', pero SolicitudesTab
-- escribe 'confirmed' desde que se unificó el vocabulario de estados (el propio
-- archivo lo documenta). Y el botón "Valorar" solo aparece con
-- 'confirmed'/'completed'.
--
-- Resultado: el botón se mostraba exactamente en los casos que la RLS iba a
-- rechazar, y en los 2 registros históricos con 'accepted' —los únicos que
-- habrían pasado— el botón no existía. El organizador veía "No se pudo enviar
-- la valoración" para siempre, sin forma de acertar.
--
-- Se aceptan los tres estados que significan "el bolo se hizo": el histórico
-- 'accepted' y los actuales 'confirmed'/'completed'.
DROP POLICY IF EXISTS "reviews_insert_verified_booking" ON public.reviews;

CREATE POLICY "reviews_insert_verified_booking"
ON public.reviews FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.flash_bookings fb
    WHERE fb.created_by = auth.uid()
      AND fb.professional_user_id = reviews.reviewed_user_id
      AND fb.status IN ('accepted', 'confirmed', 'completed')
  )
);
