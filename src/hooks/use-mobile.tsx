import * as React from "react";

const MOBILE_BREAKPOINT = 768;

// El valor se calcula ya en el primer render (inicializador lazy), no en un
// useEffect posterior. Con `undefined` inicial el hook devolvía false en el
// render 1 y el valor real en el 2: en móvil el sidebar montaba expandido y
// colapsaba acto seguido (parpadeo). Además shadcn solo lee `defaultOpen` al
// montar el SidebarProvider, así que corregirlo en un segundo render llegaba tarde.
// Guarda de `window` para el prerender SSR (scripts/prerender-*.mjs).
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(() =>
    typeof window === "undefined" ? false : window.innerWidth < MOBILE_BREAKPOINT,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}
