// Acuerdo dentro del chat (16 oct 2026). El organizador genera el contrato
// desde la conversación y se envía como mensaje especial; el profesional lo
// acepta con un botón en el mismo chat. Queda escrito y con fecha en la
// conversación de los dos. Formato del contenido del mensaje:
//   [[acuerdo:propuesto|XPEAK-AB12CD|Boda Ana · 12/12/2026 · 500 €]]
//   [[acuerdo:aceptado|XPEAK-AB12CD]]
//   [[acuerdo:cancelado|ACUERDO|<id de la reserva>]]  (lo escribe la RPC cancelar_acuerdo_chat)
export type Acuerdo = { estado: 'propuesto' | 'aceptado' | 'cancelado'; ref: string; resumen: string };

const RE = /^\[\[acuerdo:(propuesto|aceptado|cancelado)\|([A-Za-z0-9-]{4,40})(?:\|([^\]]{0,200}))?\]\]$/;

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
  if (a.estado === 'cancelado') return 'Acuerdo cancelado';
  if (a.estado === 'aceptado' && a.ref === 'ACUERDO') return 'Acepto el acuerdo';
  return a.estado === 'propuesto' ? `Propuesta de contrato ${a.ref}` : `Contrato ${a.ref} aceptado`;
}

// "Acepto" en el propio chat (16 oct 2026, el usuario: la barra de arriba con el
// contrato "da fricción"). Quien acepta primero pone las condiciones mínimas
// (fecha, ciudad, precio y, si quiere, qué evento); la otra parte las ve y
// pulsa ACEPTO. Cuando los dos han aceptado las MISMAS condiciones, el acuerdo
// queda cerrado y se registra como reserva (RPC cerrar_acuerdo_chat). Se guarda
// como [[acuerdo:aceptado|ACUERDO|f=12/12/2026;c=Madrid;p=500;e=Boda]]: la
// campana y el push (trigger de la BD) ya lo muestran como "Ha aceptado el
// contrato". Fecha con barras: "2026-12-12" lo tomaría el filtro por teléfono.
export const REF_ACUERDO = 'ACUERDO';

export interface Condiciones { fecha: string; ciudad: string; precio: string; evento: string }

const limpiar = (v: string) => v.replace(/[[\]|;=]/g, ' ').replace(/\s+/g, ' ').trim();

/** "2026-12-12" (input date) → "12/12/2026"; deja igual si ya viene con barras. */
export const fechaConBarras = (f: string) => /^\d{4}-\d{2}-\d{2}$/.test(f) ? f.split('-').reverse().join('/') : f;
/** "12/12/2026" → "2026-12-12" para inputs de fecha y el contrato. */
export const fechaIso = (f: string) => {
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(f);
  return m ? `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}` : f;
};

export function codificarCondiciones(c: Condiciones): string {
  const partes = [`f=${limpiar(fechaConBarras(c.fecha))}`, `c=${limpiar(c.ciudad)}`, `p=${limpiar(c.precio).replace(/[^0-9.,]/g, '')}`];
  if (limpiar(c.evento)) partes.push(`e=${limpiar(c.evento)}`);
  return partes.join(';').slice(0, 200);
}

export function leerCondiciones(resumen: string): Condiciones | null {
  if (!resumen) return null;
  // Mismo criterio estricto que la RPC cerrar_acuerdo_chat: solo f, c, p, e,
  // sin repetir y con formato fijo. Lo que no cumpla no es un acuerdo válido.
  const v: Record<string, string> = {};
  for (const par of resumen.split(';')) {
    const i = par.indexOf('=');
    const k = i > 0 ? par.slice(0, i) : '';
    if (!['f', 'c', 'p', 'e'].includes(k) || k in v) return null;
    v[k] = par.slice(i + 1).trim();
  }
  if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(v.f ?? '') || !/^\d{1,7}([.,]\d{1,2})?$/.test(v.p ?? '')) return null;
  if (!v.c || v.c.length < 2 || v.c.length > 60 || /[=\]|]/.test(v.c) || /[=\]|]/.test(v.e ?? '')) return null;
  return { fecha: v.f ?? '', ciudad: v.c ?? '', precio: v.p ?? '', evento: v.e ?? '' };
}

export function textoCondiciones(c: Condiciones | null): string {
  if (!c) return '';
  return [c.evento, c.fecha, c.ciudad, c.precio ? `${c.precio} €` : ''].filter(Boolean).join(' · ');
}

export const mensajeAcepto = (c?: Condiciones | string) => {
  const cod = typeof c === 'string' ? c : c ? codificarCondiciones(c) : '';
  return `[[acuerdo:aceptado|${REF_ACUERDO}${cod ? `|${cod}` : ''}]]`;
};

type MsgMin = { id: string; sender_id: string; content: string; deleted_at?: string | null };

/** Acuerdo abierto (quién ha aceptado y con qué condiciones) y mensajes que
 *  cerraron uno. Si alguien acepta con condiciones distintas, empieza de nuevo
 *  con él solo: es una contrapropuesta. */
export function estadoAcepto(msgs: MsgMin[]): { pendientes: Set<string>; condiciones: string; cierres: Set<string> } {
  let pendientes = new Set<string>();
  let condiciones = '';
  const cierres = new Set<string>();
  for (const m of msgs) {
    if (m.deleted_at) continue;
    const a = leerAcuerdo(m.content);
    if (a?.estado !== 'aceptado' || a.ref !== REF_ACUERDO) continue;
    if (pendientes.size > 0 && a.resumen !== condiciones) pendientes = new Set();
    if (pendientes.size === 0) condiciones = a.resumen;
    pendientes.add(m.sender_id);
    if (pendientes.size >= 2) { cierres.add(m.id); pendientes = new Set(); condiciones = ''; }
  }
  return { pendientes, condiciones, cierres };
}
