/**
 * Pareja ordenada (participant_a, participant_b) de una conversación, en el
 * mismo orden lexicográfico que usa el trigger de contratación (LEAST/GREATEST)
 * para que ambos caminos encuentren la misma fila.
 *
 * Devuelve null si falta alguien o si las dos personas son la misma: los
 * profesionales salen en el directorio como cualquier otro y, al pulsar
 * "Mensaje" en su propia ficha, se abrían un chat consigo mismos (bug real,
 * 13 oct 2026: Rubén Trias, DJ Geliux y Dj eloy).
 */
export function conversationPair(me: string, other: string): { a: string; b: string } | null {
  if (!me || !other || me === other) return null;
  return me < other ? { a: me, b: other } : { a: other, b: me };
}
