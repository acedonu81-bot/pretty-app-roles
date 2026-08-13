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
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

createRoot(document.getElementById("root")!).render(<App />);
