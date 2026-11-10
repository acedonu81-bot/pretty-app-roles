import { useEffect, useState } from 'react';

// Puente con el reproductor embebido de hearthis para contar escuchas (10 nov
// 2026). Su embed manda a la página { action, id } por postMessage (visto en
// jsembed2026.js y probado en un navegador real el 10 nov 2026):
//  * action "play" / "resume" al sonar, "pause" / "stop" / "finish" al parar;
//  * action NUMÉRICA mientras suena: el segundo por el que va (0, 1, 2...).
export const ORIGEN_HEARTHIS = 'https://hearthis.at';

export type MensajeHearthis = { tipo: 'sonando'; posicion?: number } | { tipo: 'parado' };

export function leerMensajeHearthis(datos: unknown): MensajeHearthis | null {
  const accion = (datos as { action?: unknown } | null)?.action;
  if (typeof accion === 'number' && Number.isFinite(accion) && accion >= 0) return { tipo: 'sonando', posicion: accion };
  if (accion === 'play' || accion === 'resume') return { tipo: 'sonando' };
  if (accion === 'pause' || accion === 'stop' || accion === 'finish') return { tipo: 'parado' };
  return null;
}

export const useHearthisWidget = (iframe: HTMLIFrameElement | null) => {
  const [sonando, setSonando] = useState(false);
  const [posicion, setPosicion] = useState(0);

  useEffect(() => {
    setSonando(false); setPosicion(0);
    if (!iframe) return;
    const alMensaje = (e: MessageEvent) => {
      if (e.origin !== ORIGEN_HEARTHIS || e.source !== iframe.contentWindow) return;
      const m = leerMensajeHearthis(e.data);
      if (!m) return;
      if (m.tipo === 'parado') { setSonando(false); return; }
      setSonando(true);
      if (m.posicion !== undefined) setPosicion(m.posicion);
    };
    window.addEventListener('message', alMensaje);
    return () => window.removeEventListener('message', alMensaje);
  }, [iframe]);

  return { sonando, posicion };
};
