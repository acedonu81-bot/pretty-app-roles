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

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(reg => {
      // Forzar comprobación de versión nueva en cada carga.
      reg.update().catch(() => {});
      // Cuando un SW nuevo toma el control (nuevo deploy), recargar una vez
      // para servir el bundle actualizado — evita que el usuario se quede
      // pegado en una versión vieja cacheada por el SW.
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        refreshing = true;
        window.location.reload();
      });
    }).catch(() => {});
  });
}

createRoot(document.getElementById("root")!).render(<App />);
