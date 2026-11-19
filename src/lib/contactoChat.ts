import { estadoAcepto } from '@/lib/acuerdoChat';

// Contacto en el chat (19 nov 2026). Teléfonos, correos y redes no se pueden
// escribir hasta que los dos han aceptado el acuerdo; entonces se desbloquean.
// Decisión de Daniel, con la ficha XDS en 67,6: por debajo del umbral, así que
// cada intento bloqueado se registra (cta_click, detalle chat_contacto_bloqueado,
// sin el texto) para decidir con datos si se mantiene. Si en ~3 semanas hay
// menos de 5 intentos, se quita.

/** Cuenta oficial de XPEAK: con ella no hay acuerdo posible, así que no se bloquea nada nuevo. */
export const XPEAK_USER_ID = 'b8c47c26-33bd-41d7-a869-ba6fa2d22667';

export const AVISO_CONTACTO_BLOQUEADO =
  'Por seguridad no se pueden escribir teléfonos, correos ni redes en el chat. '
  + 'Cuando los dos aceptéis el acuerdo se desbloquean y podéis hablar por donde queráis. '
  + 'Así queda constancia del trato en XPEAK: nos permite protegeros y saber cuántos trabajos se cierran de verdad.';

export const NOTA_CONTACTO_BLOQUEADO =
  'Teléfonos, correos y redes se desbloquean cuando los dos aceptéis el acuerdo. Así queda constancia del trato en XPEAK.';

export const NOTA_CONTACTO_DESBLOQUEADO =
  'Los dos habéis aceptado el acuerdo: ya podéis compartir teléfono, correo y redes en este chat.';

// El filtro general ya frena números, @ y correos. Aquí se añaden las palabras
// que dejaban pasar "te dejo mi instagram: nombre" (caso Daniela y Alfredo,
// 16 nov). Solo en el chat: en las bios la palabra "Instagram" es legítima.
const PALABRAS_DE_CONTACTO = [/\binstagram\b/i, /\binsta\b/i, /\bwhats\s?app\b/i, /\bwasap\b/i, /\btelegram\b/i];

export function mencionaContacto(texto: string): boolean {
  // Sin excepciones, ni siquiera para los mensajes de acuerdo ("[[acuerdo:...]]"):
  // empezar un texto por "[[" bastaba para saltarse el filtro (revisión de
  // seguridad, 19 nov 2026). Un tipo de evento que diga "Instagram" se frena
  // hasta que los dos acepten, y es un caso rarísimo.
  return PALABRAS_DE_CONTACTO.some(p => p.test(texto));
}

type MsgMin = { id: string; sender_id: string; content: string; deleted_at?: string | null };

/** Desbloqueado en cuanto los dos han aceptado las mismas condiciones (aunque el acuerdo se cancele después: un dato ya compartido no se puede retirar). */
export function contactoDesbloqueado(mensajes: MsgMin[]): boolean {
  return estadoAcepto(mensajes).cierres.size > 0;
}
