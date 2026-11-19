// Resumen de contactos por profesional (19 nov 2026), para la tarjeta del admin.
// Las cifras llegan como bigint de Postgres y a veces como texto: se normalizan.
export interface FilaContactos {
  user_id: string;
  nombre: string;
  rol: string;
  plan: string | null;
  conversaciones: number | string;
  solicitudes: number | string;
  contactos: number | string;
  ultimo: string | null;
}

export function resumenContactos(filas: FilaContactos[]) {
  const total = filas.length;
  const n = (f: FilaContactos) => Number(f.contactos) || 0;
  const con1 = filas.filter(f => n(f) >= 1).length;
  const con2 = filas.filter(f => n(f) >= 2).length;
  const suma = filas.reduce((a, f) => a + n(f), 0);
  const pct = (x: number) => (total ? Math.round((x / total) * 100) : 0);
  return { total, con1, con2, pct1: pct(con1), pct2: pct(con2), media: total ? suma / total : 0 };
}
