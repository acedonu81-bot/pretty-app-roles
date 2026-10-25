import { useEffect, useState } from 'react';

// PROVISIONAL: fantasmita con cascos de DJ que se asoma una vez por visita
// desde el borde izquierdo, agarrado al canto de la pantalla, y se vuelve a
// esconder (Halloween 25 oct - 1 nov 2026). La imagen ya viene cortada por la
// izquierda: va pegada al borde y solo se desliza, sin girar.
// Sale al bajar un poco por la página, o a los 8 s si no se baja. Sin eventos
// de ratón: nunca tapa un clic. Con "reducir movimiento" no sale.

const CLAVE = 'xp_hw_fantasma';
const DURACION = 4200;

const FantasmaAsomado = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(CLAVE)) return;
    } catch { /* sin almacenamiento: que salga igual */ }
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    let hecho = false;
    let fin: number | undefined;
    const asomar = () => {
      if (hecho) return;
      hecho = true;
      try { sessionStorage.setItem(CLAVE, '1'); } catch { /* nada */ }
      setVisible(true);
      fin = window.setTimeout(() => setVisible(false), DURACION);
    };
    // En captura: en el móvil y en el panel no se desplaza la ventana sino un
    // contenedor (main con overflow), y su scroll no llega a window.
    const alBajar = (e: Event) => {
      const t = e.target;
      const y = t instanceof Element ? t.scrollTop : window.scrollY;
      if (y > 350) asomar();
    };
    document.addEventListener('scroll', alBajar, { passive: true, capture: true });
    const porTiempo = window.setTimeout(asomar, 8000);
    return () => {
      document.removeEventListener('scroll', alBajar, { capture: true });
      window.clearTimeout(porTiempo);
      if (fin) window.clearTimeout(fin);
    };
  }, []);

  if (!visible) return null;
  return (
    <div aria-hidden className="fantasma-asomado fixed z-[70] pointer-events-none"
      style={{ left: 0, top: '52vh' }}>
      <style>{`
        @keyframes fantasmaAsoma {
          0% { transform: translate3d(-100%,0,0); }
          16% { transform: translate3d(0,0,0); }
          36% { transform: translate3d(0,-5px,0); }
          56% { transform: translate3d(0,3px,0); }
          80% { transform: translate3d(0,0,0); }
          100% { transform: translate3d(-100%,0,0); }
        }
        .fantasma-asomado img { animation: fantasmaAsoma ${DURACION}ms ease-in-out 1 forwards; will-change: transform; }
      `}</style>
      <img src="/halloween/fantasma-dj.webp" alt="" width={191} height={320}
        className="block w-[78px] md:w-[112px] h-auto"
        style={{ filter: 'drop-shadow(4px 8px 14px rgba(74,29,122,0.28))' }} />
    </div>
  );
};

export default FantasmaAsomado;
