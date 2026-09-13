-- "Eliminar" en AdminReviews hacía DELETE definitivo: una reseña denegada
-- desaparecía sin dejar rastro, sin forma de auditar qué se rechazó ni por
-- qué. Se cambia a marcar rejected_at en vez de borrar, para poder listar
-- una tercera sección "Denegadas" en el panel (igual que ya se hizo con
-- "Aprobadas" tras la confusión del 13 sep: aprobar quitaba la reseña de la
-- vista de pendientes y no había ningún otro sitio donde volver a verla).

ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS rejected_at timestamptz;
