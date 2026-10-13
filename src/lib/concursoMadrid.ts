/**
 * Quién puede inscribirse en el Concurso DJ XPEAK Madrid. Las bases piden
 * residir en la Comunidad de Madrid y hasta el 13 oct 2026 no se comprobaba
 * en ningún sitio: entraba cualquier DJ con foto y bio. `region` la deriva la
 * BD de la ciudad del perfil ('Madrid' = Comunidad de Madrid, incluidos los
 * pueblos como Alcalá) y solo queda vacía si la ciudad es "España".
 * Es lo que declara el DJ: la prueba real se pide al ganador (ver bases).
 */
type PerfilConcurso = { photo_url: string | null; bio: string | null; region: string | null };

export function estadoInscripcionMadrid(perfiles: PerfilConcurso[]): 'ok' | 'falta_perfil' | 'fuera_de_madrid' {
  if (!perfiles.some(p => !!p.photo_url?.trim() && !!p.bio?.trim())) return 'falta_perfil';
  if (!perfiles.some(p => p.region === 'Madrid')) return 'fuera_de_madrid';
  return 'ok';
}
