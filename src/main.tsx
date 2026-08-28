import { createRoot } from "react-dom/client";
import { inject } from "@vercel/analytics";
import { injectSpeedInsights } from "@vercel/speed-insights";
import App from "./App.tsx";
import "./index.css";
import { initCapacitor } from "./lib/capacitor";
import { trackAIReferral } from "./lib/track";

inject({
  beforeSend: (event) => {
    const skip = ['/eliminar-cuenta', '/privacidad', '/cookies', '/terminos', '/aviso-legal'];
    if (skip.some(p => event.url.includes(p))) return null;
    return event;
  },
});
injectSpeedInsights();
initCapacitor();
trackAIReferral();

// Purga de emergencia: dispositivos con el Service Worker antiguo ('xpeak-v2')
// se quedaban sirviendo bundles viejos cacheados (usuarios veían la versión
// anterior de /descubrir pese a los deploys). Al arrancar: desregistrar TODOS
// los SW, borrar TODAS las cachés, y recargar una sola vez limpio. El flag en
// localStorage evita un bucle de recargas.
//
// Tras la purga (o si nunca hubo nada que purgar) se registra el sw.js actual
// — sin esto Chrome/Android nunca considera el sitio "instalable" y jamás
// dispara beforeinstallprompt, así que el banner de instalar PWA en
// /descubrir no tenía forma de aparecer. sw.js ya no tiene fetch handler
// (ver su propio comentario), así que registrarlo no reintroduce el bug de
// caché descontrolada que causó la purga original.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const regs = await navigator.serviceWorker.getRegistrations();
      const hadSW = regs.length > 0;
      if (hadSW && !localStorage.getItem('xpeak_sw_purged_v3')) {
        await Promise.all(regs.map(r => r.unregister()));
        if ('caches' in window) {
          const keys = await caches.keys();
          await Promise.all(keys.map(k => caches.delete(k)));
        }
        localStorage.setItem('xpeak_sw_purged_v3', '1');
        window.location.reload();
        return;
      }
      await navigator.serviceWorker.register('/sw.js');
    } catch { /* continúa sin SW — push e instalabilidad quedan desactivados, no crítico */ }
  });
}

createRoot(document.getElementById("root")!).render(<App />);
