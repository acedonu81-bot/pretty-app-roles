import { useCallback, useEffect, useState } from 'react';

const ORIGEN_SC = 'https://w.soundcloud.com';

// Puente con el reproductor embebido de SoundCloud para los comentarios en el
// segundo exacto (perfil de DJ, fase 2, 1 nov 2026). Habla por postMessage,
// el mismo protocolo que usa por dentro su api.js: así no hay que cargar un
// script de w.soundcloud.com ni abrir la CSP (script-src) por él.
export const useSoundcloudWidget = (iframe: HTMLIFrameElement | null) => {
  const [listo, setListo] = useState(false);
  const [posicion, setPosicion] = useState(0);
  const [duracion, setDuracion] = useState(0);
  const [sonando, setSonando] = useState(false);

  const enviar = useCallback((method: string, value?: unknown) => {
    iframe?.contentWindow?.postMessage(JSON.stringify(value === undefined ? { method } : { method, value }), ORIGEN_SC);
  }, [iframe]);

  useEffect(() => {
    setListo(false); setPosicion(0); setDuracion(0); setSonando(false);
    if (!iframe) return;

    const suscribir = () => {
      for (const ev of ['playProgress', 'play', 'pause', 'finish', 'seek']) enviar('addEventListener', ev);
      enviar('getDuration');
    };

    const alMensaje = (e: MessageEvent) => {
      if (e.origin !== ORIGEN_SC || e.source !== iframe.contentWindow) return;
      let datos: { method?: string; value?: unknown };
      try { datos = typeof e.data === 'string' ? JSON.parse(e.data) : e.data; } catch { return; }
      switch (datos?.method) {
        case 'ready': setListo(true); suscribir(); break;
        case 'getDuration': if (typeof datos.value === 'number') setDuracion(datos.value / 1000); break;
        case 'playProgress':
        case 'seek': {
          const v = datos.value as { currentPosition?: number } | undefined;
          if (typeof v?.currentPosition === 'number') setPosicion(v.currentPosition / 1000);
          // La duración llega a veces tarde (o 0) en getDuration: se repite al sonar.
          setDuracion(d => { if (!d) enviar('getDuration'); return d; });
          break;
        }
        case 'play': setSonando(true); break;
        case 'pause':
        case 'finish': setSonando(false); break;
      }
    };

    window.addEventListener('message', alMensaje);
    return () => window.removeEventListener('message', alMensaje);
  }, [iframe, enviar]);

  const saltar = useCallback((segundos: number) => {
    enviar('seekTo', Math.max(0, Math.round(segundos * 1000)));
    enviar('play');
    setPosicion(segundos);
  }, [enviar]);

  const alternar = useCallback(() => enviar('toggle'), [enviar]);
  const pausar = useCallback(() => enviar('pause'), [enviar]);

  return { listo, posicion, duracion, sonando, saltar, alternar, pausar };
};
