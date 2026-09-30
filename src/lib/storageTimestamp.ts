/**
 * Fecha real de subida de un archivo de Supabase Storage, extraída de su
 * propio nombre — PortfolioUpload.tsx y AudioUpload.tsx suben con el path
 * `{user_id}/{carpeta}/{Date.now()}-{nombre}`. Sin columna nueva: el
 * timestamp ya vive en el nombre del archivo, solo hace falta leerlo.
 *
 * Devuelve null para links externos (SoundCloud, HearThis, Mixcloud pegados
 * como URL) — no tienen ningún timestamp real guardado en ningún sitio.
 */
export function fechaSubidaStorage(url: string | null | undefined): string | null {
  if (!url) return null;
  const match = url.match(/\/(\d{13})-[^/]+$/);
  if (!match) return null;
  const ms = Number(match[1]);
  const date = new Date(ms);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}
