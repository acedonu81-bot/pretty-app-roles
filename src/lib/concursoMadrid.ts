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

/** Plazo de inscripción y votos (hora de Madrid). Única fuente de las fechas:
 *  la página, los banners de Inicio y Feed y la etiqueta del menú se apagan
 *  a la vez al cerrar. */
export const ABRE_CONCURSO = new Date('2026-10-13T00:00:00+02:00');
export const CIERRA_CONCURSO = new Date('2026-11-03T00:00:00+01:00');

export function concursoActivo(ahora: Date = new Date()): boolean {
  return ahora >= ABRE_CONCURSO && ahora < CIERRA_CONCURSO;
}

/** Del cierre al anuncio del ganador (9 nov): los banners enseñan a los 3 con
 *  más me gusta mientras se revisan los votos y el jurado escucha. */
export const FIN_REVISION_CONCURSO = new Date('2026-11-10T00:00:00+01:00');

export function concursoEnRevision(ahora: Date = new Date()): boolean {
  return ahora >= CIERRA_CONCURSO && ahora < FIN_REVISION_CONCURSO;
}
