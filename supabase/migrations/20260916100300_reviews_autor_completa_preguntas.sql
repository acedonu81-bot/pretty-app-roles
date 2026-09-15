-- CompleteReviewModal.submit() (HistorialTab.tsx) hacía un .update() directo
-- sobre public.reviews para rellenar las 3 preguntas nuevas de una reseña
-- antigua. public.reviews NO tiene ninguna policy de UPDATE para el autor
-- (reviewer_id = auth.uid()) — solo existe "Admins update reviews"
-- (20260912160000_rls_admin_reviews_promo_codes.sql). Resultado: el UPDATE
-- de un empresario normal no tocaba ninguna fila, pero PostgREST devuelve
-- 200 con 0 filas afectadas y SIN error, así que la UI mostraba "¡Gracias
-- por completar tu valoración!" y nada se guardaba de verdad.
--
-- No se añade una policy de UPDATE genérica para el autor porque reviews
-- también tiene rating, comment y approved: una policy "reviewer_id =
-- auth.uid()" a nivel de fila permitiría al empresario reescribir su propia
-- puntuación o su propio comentario ya aprobado, o el flag approved — un
-- agujero de seguridad nuevo. En su lugar, una función SECURITY DEFINER que
-- solo el autor puede invocar y que solo puede tocar las 3 columnas nuevas.
CREATE OR REPLACE FUNCTION public.completar_preguntas_resena(
  p_review_id uuid,
  p_llego_puntual boolean,
  p_cumplio_acordado boolean,
  p_volveria_contratar boolean
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.reviews
  SET llego_puntual = p_llego_puntual,
      cumplio_acordado = p_cumplio_acordado,
      volveria_contratar = p_volveria_contratar
  WHERE id = p_review_id AND reviewer_id = auth.uid();

  IF NOT FOUND THEN
    RAISE EXCEPTION 'No se encontró la reseña o no tienes permiso para editarla';
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.completar_preguntas_resena(uuid, boolean, boolean, boolean) TO authenticated;
