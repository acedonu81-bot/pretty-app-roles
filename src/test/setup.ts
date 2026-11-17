import "@testing-library/jest-dom";
import { configure } from "@testing-library/react";

// findBy*/waitFor se rendían al segundo: con toda la batería en paralelo
// (deploy-prod.sh) EventRequestsSection.interesados fallaba sin motivo y
// bloqueaba el despliegue (30 oct 2026). Solo alarga la espera máxima.
configure({ asyncUtilTimeout: 5000 });

// Los archivos de lógica pura corren sin navegador (`@vitest-environment node`,
// 17 nov 2026): arrancan mucho más rápido y ahí no existe window.
if (typeof window !== "undefined") Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});
