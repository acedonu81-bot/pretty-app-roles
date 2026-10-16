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
  if (a.estado === 'aceptado' && a.ref === 'ACUERDO') return 'Acepto el acuerdo';
  return a.estado === 'propuesto' ? `Propuesta de contrato ${a.ref}` : `Contrato ${a.ref} aceptado`;
}

// "Acepto" en el propio chat (16 oct 2026, el usuario: la barra de arriba con el
// contrato "da fricción"). Cada parte pulsa Acepto junto al cuadro de escribir;
// cuando han aceptado los dos, el acuerdo queda cerrado. Se guarda como
// [[acuerdo:aceptado|ACUERDO]] para que la campana y el push (trigger de la
// BD) ya lo muestren como "Ha aceptado el contrato" sin tocar la base de datos.
export const REF_ACUERDO = 'ACUERDO';
export const mensajeAcepto = () => mensajeAceptado(REF_ACUERDO);

type MsgMin = { id: string; sender_id: string; content: string; deleted_at?: string | null };

/** Quién ha aceptado en el acuerdo abierto y qué mensajes cerraron uno. */
export function estadoAcepto(msgs: MsgMin[]): { pendientes: Set<string>; cierres: Set<string> } {
  let pendientes = new Set<string>();
  const cierres = new Set<string>();
  for (const m of msgs) {
    if (m.deleted_at) continue;
    const a = leerAcuerdo(m.content);
    if (a?.estado !== 'aceptado' || a.ref !== REF_ACUERDO) continue;
    pendientes.add(m.sender_id);
    if (pendientes.size >= 2) { cierres.add(m.id); pendientes = new Set(); }
  }
  return { pendientes, cierres };
}
