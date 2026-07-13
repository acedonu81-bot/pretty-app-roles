/**
 * Eventos personalizados vía Plausible (gratis, incluido en el plan actual).
 * @vercel/analytics `track()` requiere plan Pro/Enterprise y descarta
 * los eventos en silencio en el plan Hobby — por eso se usa Plausible aquí.
 */
declare global {
  interface Window {
    plausible?: (eventName: string, options?: { props?: Record<string, string | number | boolean> }) => void;
  }
}

export function track(eventName: string, props?: Record<string, string | number | boolean>) {
  window.plausible?.(eventName, props ? { props } : undefined);
}
