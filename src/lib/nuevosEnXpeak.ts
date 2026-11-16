// Lógica de la tarjeta "Nuevo en XPEAK" del Inicio (16 nov 2026). Separada del
// componente para poder probarla sin pintar nada.

export type NuevoProfesional = {
  user_id: string;
  display_name: string;
  role: string;
  zone: string | null;
  photo_url: string | null;
  portada_url: string | null;
  creado: string;
};

const MS_DIA = 86_400_000;
const fmtMadrid = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit' });

// Día natural de Madrid como número de días (no 24 h): quien entró a las 00:30
// ya es "hoy" y quien entró ayer a las 23:50 ya es "ayer".
function diaMadrid(ms: number): number {
  const [y, m, d] = fmtMadrid.format(new Date(ms)).split('-').map(Number);
  return Date.UTC(y, m - 1, d) / MS_DIA;
}

export function etiquetaAlta(iso: string, ahora: number = Date.now()): string {
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return '';
  const dias = diaMadrid(ahora) - diaMadrid(t);
  if (dias <= 0) return 'hoy';
  if (dias === 1) return 'ayer';
  return `hace ${dias} días`;
}

export function siguienteIndice(i: number, n: number): number {
  return n <= 1 ? 0 : (i + 1) % n;
}

// La URL de la foto sale de la BD y va dentro de url() en CSS: solo https y sin
// caracteres que rompan esa cadena (comillas, paréntesis, espacios, barra invertida).
export function imagenSegura(u: string | null | undefined): string | null {
  if (!u || !/^https:\/\//.test(u) || /["'()\s\\]/.test(u)) return null;
  return u;
}
