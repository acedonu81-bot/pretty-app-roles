-- Nadie puede abrir un chat consigo mismo (bug real, 13 oct 2026).
-- Los profesionales salen en el directorio como cualquier otro y, al pulsar
-- "Mensaje" en su propia ficha, se creaba una conversación con participant_a =
-- participant_b (Rubén Trias, DJ Geliux, Dj eloy). La app ya lo corta en
-- src/lib/conversationPair.ts; esto lo cierra también para cualquier camino
-- futuro. Los triggers de contratación ya excluían ese caso.
--
-- NOT VALID: solo se exige a las filas nuevas. Las 5 conversaciones antiguas
-- consigo mismo (3 vacías y 2 con mensajes de prueba) se dejan como están.
ALTER TABLE public.conversations
  ADD CONSTRAINT conversations_participantes_distintos
  CHECK (participant_a <> participant_b) NOT VALID;
