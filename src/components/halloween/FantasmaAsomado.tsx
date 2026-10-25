import { useEffect, useState } from 'react';

// PROVISIONAL: fantasmita que se asoma una vez por visita desde el borde
// izquierdo, saluda y se vuelve a esconder (Halloween 25 oct - 1 nov 2026).
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
    const alBajar = () => { if (window.scrollY > 350) asomar(); };
    window.addEventListener('scroll', alBajar, { passive: true });
    const porTiempo = window.setTimeout(asomar, 8000);
    return () => {
      window.removeEventListener('scroll', alBajar);
      window.clearTimeout(porTiempo);
      if (fin) window.clearTimeout(fin);
    };
  }, []);

  if (!visible) return null;
  return (
    <div aria-hidden className="fantasma-asomado fixed z-[55] pointer-events-none"
      style={{ left: 0, top: '52vh' }}>
      <style>{`
        @keyframes fantasmaAsoma {
          0% { transform: translate3d(-110%,0,0) rotate(18deg); }
          18% { transform: translate3d(-28%,0,0) rotate(10deg); }
          30%,72% { transform: translate3d(-24%,-6px,0) rotate(8deg); }
          50% { transform: translate3d(-24%,4px,0) rotate(12deg); }
          100% { transform: translate3d(-110%,0,0) rotate(18deg); }
        }
        .fantasma-asomado img { animation: fantasmaAsoma ${DURACION}ms ease-in-out 1 forwards; will-change: transform; }
      `}</style>
      <img src="/halloween/fantasma.webp" alt="" width={191} height={260}
        className="block w-[84px] md:w-[120px] h-auto"
        style={{ filter: 'drop-shadow(0 10px 18px rgba(74,29,122,0.35))' }} />
    </div>
  );
};

export default FantasmaAsomado;
