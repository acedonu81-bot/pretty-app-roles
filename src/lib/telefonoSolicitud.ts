// Teléfono opcional de la solicitud del particular (20 nov 2026).
// Devuelve el número normalizado (+34XXXXXXXXX u otro internacional con +) o null si no es válido.
// La misma regla está duplicada en supabase/functions/particular-solicitud/index.ts (Deno no importa de src/).
export function normalizarTelefono(valor: string): string | null {
  const limpio = valor.replace(/[\s.\-()]/g, '');
  if (/^(\+34|0034)?[6-9]\d{8}$/.test(limpio)) return '+34' + limpio.slice(-9);
  if (/^\+\d{8,15}$/.test(limpio)) return limpio;
  return null;
}
