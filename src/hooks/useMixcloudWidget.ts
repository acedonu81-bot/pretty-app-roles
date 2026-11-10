import { useEffect, useState } from 'react';

// Puente con el reproductor embebido de Mixcloud para contar escuchas (10 nov
// 2026). Antes los sets de Mixcloud nunca sumaban: el contador necesita saber
// si suena y por dónde va, y no se le preguntaba. Habla por postMessage con el
// mismo protocolo que su widgetApi.js (leído el 10 nov 2026), así no hay que
// cargar su script ni abrir la CSP.
//
// El iframe apunta a www.mixcloud.com/widget/iframe, que redirige a este origen.
export const ORIGEN_MIXCLOUD = 'https://player-widget.mixcloud.com';

export type MensajeMixcloud =
  | { tipo: 'ready' }
  | { tipo: 'progress'; posicion: number }
  | { tipo: 'play' }
  | { tipo: 'pause' };

/** Traduce un mensaje del reproductor de Mixcloud; null si no es suyo o no interesa. */
export function leerMensajeMixcloud(datos: unknown): MensajeMixcloud | null {
  let m: { mixcloud?: string; type?: string; data?: { eventName?: string; args?: unknown[] } };
  try { m = typeof datos === 'string' ? JSON.parse(datos) : (datos as typeof m); } catch { return null; }
  if (!m || m.mixcloud !== 'playerWidget') return null;
  if (m.type === 'ready') return { tipo: 'ready' };
  if (m.type !== 'event') return null;
  switch (m.data?.eventName) {
    case 'progress': {
      const pos = m.data.args?.[0];
      return typeof pos === 'number' ? { tipo: 'progress', posicion: pos } : null;
    }
    case 'play': return { tipo: 'play' };
    case 'pause':
    case 'ended':
    case 'error': return { tipo: 'pause' };
    default: return null;
  }
}

export const useMixcloudWidget = (iframe: HTMLIFrameElement | null) => {
  const [sonando, setSonando] = useState(false);
  const [posicion, setPosicion] = useState(0);

  useEffect(() => {
    setSonando(false); setPosicion(0);
    if (!iframe) return;
    const pedirApi = () => iframe.contentWindow?.postMessage(JSON.stringify({ type: 'getApi' }), ORIGEN_MIXCLOUD);

    const alMensaje = (e: MessageEvent) => {
      if (e.origin !== ORIGEN_MIXCLOUD || e.source !== iframe.contentWindow) return;
      const m = leerMensajeMixcloud(e.data);
      if (!m) return;
      if (m.tipo === 'ready') pedirApi();
      else if (m.tipo === 'progress') { setPosicion(m.posicion); setSonando(true); }
      else setSonando(m.tipo === 'play');
    };

    window.addEventListener('message', alMensaje);
    // Si el reproductor ya estaba listo antes de escuchar, se le pide igual.
    pedirApi();
    return () => window.removeEventListener('message', alMensaje);
  }, [iframe]);

  return { sonando, posicion };
};
