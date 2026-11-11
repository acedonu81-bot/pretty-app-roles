import { useEffect, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';

// Rótulos al instante en todo el panel de admin (11 nov 2026). Los iconos ya
// llevaban `title`, pero el rótulo del navegador tarda ~1 s en salir y en
// tablet no sale nunca: el usuario pasaba por encima y no sabía qué hacía
// cada uno. Este componente escucha dentro del contenedor, toma el `title`
// del elemento (lo guarda en data-tip para que no salga también el nativo)
// y pinta una burbuja fija encima. Vale para cualquier icono nuevo que
// lleve `title`, sin tocar nada más.
export default function RotulosAdmin({ contenedor }: { contenedor: RefObject<HTMLElement> }) {
  const [tip, setTip] = useState<{ texto: string; x: number; y: number; abajo: boolean } | null>(null);

  useEffect(() => {
    const root = contenedor.current;
    if (!root) return;
    const objetivo = (ev: Event) =>
      (ev.target as HTMLElement | null)?.closest?.(':is([title],[data-tip]):not(iframe)') as HTMLElement | null;

    const mostrar = (ev: Event) => {
      const el = objetivo(ev);
      if (!el || !root.contains(el)) return;
      const t = el.getAttribute('title');
      if (t) { el.setAttribute('data-tip', t); el.removeAttribute('title'); if (!el.getAttribute('aria-label')) el.setAttribute('aria-label', t); }
      const texto = el.getAttribute('data-tip');
      if (!texto) return;
      const r = el.getBoundingClientRect();
      const abajo = r.top < 48;
      setTip({ texto, x: r.left + r.width / 2, y: abajo ? r.bottom + 6 : r.top - 6, abajo });
    };
    const ocultar = (ev: Event) => {
      const el = objetivo(ev);
      const hacia = (ev as PointerEvent).relatedTarget as Node | null;
      if (el && hacia && el.contains(hacia)) return;
      setTip(null);
    };
    const quitar = () => setTip(null);

    root.addEventListener('pointerover', mostrar);
    root.addEventListener('pointerout', ocultar);
    root.addEventListener('focusin', mostrar);
    root.addEventListener('focusout', quitar);
    window.addEventListener('scroll', quitar, true);
    return () => {
      root.removeEventListener('pointerover', mostrar);
      root.removeEventListener('pointerout', ocultar);
      root.removeEventListener('focusin', mostrar);
      root.removeEventListener('focusout', quitar);
      window.removeEventListener('scroll', quitar, true);
    };
  }, [contenedor]);

  if (!tip) return null;
  return createPortal(
    <div role="tooltip"
      className="fixed z-[9999] pointer-events-none px-2.5 py-1.5 rounded-lg text-xs font-bold max-w-[260px] text-center"
      style={{
        left: Math.min(Math.max(tip.x, 140), window.innerWidth - 140),
        top: tip.y,
        transform: `translate(-50%, ${tip.abajo ? '0' : '-100%'})`,
        background: '#4A3B0B', color: '#FFFDF7', boxShadow: '0 6px 18px rgba(0,0,0,0.18)',
      }}>
      {tip.texto}
    </div>,
    document.body,
  );
}
