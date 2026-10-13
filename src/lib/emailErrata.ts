/**
 * Detecta erratas de dominio al escribir el correo en el registro (16 sep 2026,
 * Dj Mege: se dio de alta con "otlook.com", entró sin verificar nada y nunca
 * le llegó ni un correo nuestro). El alta sigue siendo inmediata, sin
 * confirmación por email: esto solo avisa y deja corregirlo con un toque.
 */
const DOMINIOS = [
  'gmail.com', 'hotmail.com', 'hotmail.es', 'outlook.com', 'outlook.es', 'yahoo.com', 'yahoo.es',
  'icloud.com', 'live.com', 'msn.com', 'telefonica.net', 'protonmail.com', 'gmx.com', 'gmx.es', 'me.com',
];

/** Distancia de Damerau-Levenshtein restringida: una transposición de letras vecinas cuenta como 1. */
function distancia(a: string, b: string): number {
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const coste = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + coste);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  }
  return d[a.length][b.length];
}

/** Devuelve el correo corregido si el dominio parece una errata de uno común, o null. */
export function sugerirCorreo(correo: string): string | null {
  const limpio = correo.trim().toLowerCase();
  const arroba = limpio.lastIndexOf('@');
  if (arroba < 1) return null;
  const usuario = limpio.slice(0, arroba);
  const dominio = limpio.slice(arroba + 1);
  if (dominio.length < 4 || DOMINIOS.includes(dominio)) return null;
  const candidatos = DOMINIOS.filter(d => distancia(dominio, d) === 1);
  // Una sola coincidencia clara: si hay dudas entre varias, mejor no sugerir nada.
  return candidatos.length === 1 ? `${usuario}@${candidatos[0]}` : null;
}
