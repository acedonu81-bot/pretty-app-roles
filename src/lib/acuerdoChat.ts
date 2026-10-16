// Acuerdo dentro del chat (16 oct 2026). El organizador genera el contrato
// desde la conversación y se envía como mensaje especial; el profesional lo
// acepta con un botón en el mismo chat. Queda escrito y con fecha en la
// conversación de los dos. Formato del contenido del mensaje:
//   [[acuerdo:propuesto|XPEAK-AB12CD|Boda Ana · 12/12/2026 · 500 €]]
//   [[acuerdo:aceptado|XPEAK-AB12CD]]
export type Acuerdo = { estado: 'propuesto' | 'aceptado'; ref: string; resumen: string };

const RE = /^\[\[acuerdo:(propuesto|aceptado)\|([A-Z0-9-]{4,30})(?:\|([^\]]{0,200}))?\]\]$/;

export function leerAcuerdo(contenido: string | null | undefined): Acuerdo | null {
  const m = RE.exec((contenido ?? '').trim());
  return m ? { estado: m[1] as Acuerdo['estado'], ref: m[2], resumen: m[3] ?? '' } : null;
}

export function mensajePropuesta(ref: string, partes: (string | null | undefined)[]): string {
  const resumen = partes.map(p => (p ?? '').replace(/[[\]|]/g, ' ').trim()).filter(Boolean).join(' · ').slice(0, 200);
  return `[[acuerdo:propuesto|${ref}${resumen ? `|${resumen}` : ''}]]`;
}

export const mensajeAceptado = (ref: string) => `[[acuerdo:aceptado|${ref}]]`;

/** Texto corto para la lista de conversaciones. */
export function vistaPrevia(contenido: string): string {
  const a = leerAcuerdo(contenido);
  if (!a) return contenido;
  return a.estado === 'propuesto' ? `Propuesta de contrato ${a.ref}` : `Contrato ${a.ref} aceptado`;
}
