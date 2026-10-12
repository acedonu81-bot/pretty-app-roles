/**
 * Pedir el push en momentos de valor (Ficha XDS 7 oct 2026, 74,5 pts).
 *
 * Antes el permiso solo se pedía desde Ajustes y lo tenían 4 de 92 usuarios.
 * Cualquier parte de la app llama a askForPush(motivo) y PushAskCard decide si
 * se muestra: nunca si ya está activado o bloqueado, una vez por sesión como
 * mucho y 14 días de descanso tras un "Ahora no".
 */
export type PushAskMotivo = 'alta' | 'mensaje' | 'solicitud';

export const PUSH_ASK_EVENT = 'xpeak:push-ask';

export function askForPush(motivo: PushAskMotivo) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<PushAskMotivo>(PUSH_ASK_EVENT, { detail: motivo }));
}
