import { useLayoutEffect, useRef, useState } from 'react';

// Alto que queda libre en el <main> del panel bajo la topbar y los avisos,
// descontando el relleno de la caja de contenido (que en móvil incluye el
// hueco de la barra inferior). Para vistas de alto completo como Mensajes.
// Antes se restaba un "120px" fijo de cabecera, que en iPhone no cuadraba
// (la topbar crece con la muesca) y dejaba hueco o se salía (16 oct 2026).
// Se mide con offsetTop, no con getBoundingClientRect, porque la entrada
// (fadeIn) desplaza la vista 10px mientras dura. `dep`: volver a medir
// cuando cambie algo que mueva el hueco (p. ej. abrir un chat en móvil).
export function useAltoLibreEnPanel<T extends HTMLElement>(dep?: unknown) {
  const ref = useRef<T>(null);
  const [alto, setAlto] = useState<number | null>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    const main = el?.closest('main');
    const caja = main ? Array.from(main.children).find(c => c.contains(el)) as HTMLElement | undefined : undefined;
    if (!el || !main || !caja) return;
    const medir = () => {
      const cs = getComputedStyle(caja);
      setAlto(Math.round(main.clientHeight - caja.offsetTop - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)));
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(main);
    Array.from(main.children).forEach(c => { if (c !== caja) ro.observe(c); });
    return () => ro.disconnect();
  }, [dep]);
  return [ref, alto] as const;
}
