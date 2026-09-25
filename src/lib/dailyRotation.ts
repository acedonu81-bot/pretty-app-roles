// Máximo de la función completeness() duplicada en DirectoryView.tsx y
// DirectorioPublico.tsx: hasMedia(4) + photo(2) + bio(1). Centralizado aquí
// para que los tres sitios que la usan no diverjan sobre qué cuenta como
// "top" a la hora de rotar.
export const COMPLETENESS_MAX = 7;

// Rotación diaria determinista para el directorio (26 sep 2026): entre los
// perfiles que ya empatan en el nivel más alto de completeness (foto+media+
// bio, el "top" del sort de DirectoryView.tsx), el desempate final dejaba
// siempre el mismo orden — con los mismos datos, la query siempre trae las
// filas en el mismo orden de partida y el .sort() de JS es estable, así que
// el primero de la query ganaba el primer puesto todos los días. Con volumen
// bajo por rol (a veces 2-5 perfiles top), eso significa que casi siempre
// se ve al mismo arriba.
//
// hashDaily(id) da un número entre 0 y 1, estable durante todo el día de hoy
// (misma fecha → mismo hash para todos los visitantes) y distinto mañana
// (cambia la fecha, cambia el hash). No es aleatorio de verdad: es FNV-1a
// con una mezcla final (mejor avalancha que un hash simple tipo djb2, que
// con inputs casi idénticos como "id-2026-09-25" vs "id-2026-09-26" —
// difieren en 1 carácter de 17 — apenas cambiaba el resultado y el orden no
// rotaba de verdad; medido y corregido el mismo día al probarlo). Suficiente
// para mezclar el orden sin tabla ni cron nuevos — se recalcula solo porque
// la fecha cambia.
export function hashDaily(id: string, date = new Date()): number {
  const day = date.toISOString().slice(0, 10); // YYYY-MM-DD, hora de UTC
  // La fecha va primero: el hash difunde peor los cambios que quedan al
  // final de la cadena, y el id es lo que se mantiene fijo de un día a otro.
  const s = `${day}:${id}`;
  let hash = 0x811c9dc5; // FNV-1a offset basis (32-bit)
  for (let i = 0; i < s.length; i++) {
    hash ^= s.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193); // FNV prime
  }
  // Mezcla final (MurmurHash3 finalizer, abreviado) para que un cambio de un
  // solo carácter en la fecha se disperse por todos los bits del resultado.
  hash ^= hash >>> 15;
  hash = Math.imul(hash, 0x2c1b3c6d);
  hash ^= hash >>> 12;
  hash = Math.imul(hash, 0x297a2d39);
  hash ^= hash >>> 15;
  // Normaliza a [0, 1) — >>> 0 pasa el int32 con signo a unsigned antes de dividir.
  return (hash >>> 0) / 4294967296;
}
