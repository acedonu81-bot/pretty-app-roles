export const IR_A_VISTA_EVENT = 'xpeak:ir-a-vista';

/**
 * Pide al Dashboard que cambie de vista (y, si hace falta, de ?tab=). Un
 * componente hijo no puede hacerlo con navigate() a secas: la vista activa
 * vive en el estado del Dashboard y la URL solo se lee al cargar.
 */
export function irAVista(vista: string, url?: string): void {
  window.dispatchEvent(new CustomEvent(IR_A_VISTA_EVENT, { detail: { vista, url } }));
}
