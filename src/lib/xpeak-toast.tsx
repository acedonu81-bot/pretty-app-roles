import { useState, useCallback, useRef, ReactNode, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

/* ── Module-level add function (live binding for shim) ─────────────────── */
export let _add: (item: Omit<ToastItem, 'id'>) => void = () => {};

/* ── Pill compacta (7 oct 2026, elegida por el usuario entre 3 opciones) ──
 * Antes: tarjeta ancha negro+dorado con icono de contorno grande (20px) que a
 * tamaño reducido se leía como un bloque de alerta rojo/verde sólido, y un
 * texto "XPEAK" suelto en la esquina. Ahora: pastilla pequeña de una línea,
 * el color del tipo vive solo en una burbuja diminuta (20px) con el icono en
 * blanco encima — discreta, legible de un vistazo, sin perder el negro de
 * marca. */
const palette: Record<ToastType, { c: string; d: string }> = {
  success: { c: '#22c55e', d: '#15803d' },
  error:   { c: '#ef4444', d: '#b91c1c' },
  info:    { c: '#D4AF37', d: '#92710F' },
  warning: { c: '#f59e0b', d: '#b45309' },
};

const CheckI = () => (
  <svg viewBox="0 0 24 24" fill="none" width="12" height="12">
    <path d="M5 13l4.5 4.5L19.5 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const XI = () => (
  <svg viewBox="0 0 24 24" fill="none" width="12" height="12">
    <path d="M6 6l12 12M18 6L6 18" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
  </svg>
);
const InfoI = () => (
  <svg viewBox="0 0 24 24" fill="none" width="12" height="12">
    <path d="M12 11v5.5" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
    <circle cx="12" cy="7.5" r="1.1" fill="#fff" />
  </svg>
);
const WarnI = () => (
  <svg viewBox="0 0 24 24" fill="none" width="12" height="12">
    <path d="M12 8v4.2" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
    <circle cx="12" cy="15.4" r="1.1" fill="#fff" />
  </svg>
);
const icons: Record<ToastType, JSX.Element> = { success: <CheckI />, error: <XI />, info: <InfoI />, warning: <WarnI /> };

/* ── Single Toast ──────────────────────────────────────────────────────── */
const XToast = ({ item, onRemove }: { item: ToastItem; onRemove: () => void }) => {
  const p = palette[item.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -14, scale: 0.92, transition: { duration: 0.18 } }}
      transition={{ type: 'spring', stiffness: 440, damping: 30 }}
      whileHover={{ scale: 1.02 }}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        borderRadius: '999px',
        background: 'rgba(17,17,17,0.97)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.38), 0 1px 0 rgba(255,255,255,0.05) inset',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        maxWidth: '92vw',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
      onClick={onRemove}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '9px 16px 9px 12px' }}>
        <span style={{
          flexShrink: 0, width: '20px', height: '20px', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `linear-gradient(135deg, ${p.c}, ${p.d})`,
        }}>
          {icons[item.type]}
        </span>
        <div style={{ minWidth: 0 }}>
          <p style={{
            margin: 0, fontWeight: 600, fontSize: '13px', lineHeight: 1.3,
            color: '#fff', fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap',
            overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {item.title}
          </p>
          {item.description && (
            <p style={{
              margin: '1px 0 0', fontSize: '12px', lineHeight: 1.4,
              color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter, sans-serif',
            }}>
              {item.description}
            </p>
          )}
        </div>
      </div>
      {/* Progress drain bar */}
      <motion.div
        initial={{ scaleX: 1, originX: 0 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: (item.duration ?? 4000) / 1000, ease: 'linear' }}
        style={{
          height: '2px',
          background: `linear-gradient(90deg, ${p.c}, ${p.d})`,
          transformOrigin: 'left',
        }}
      />
    </motion.div>
  );
};

/* ── Provider ──────────────────────────────────────────────────────────── */
export const XPeakToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
  }, []);

  const add = useCallback((item: Omit<ToastItem, 'id'>) => {
    // Deduplicar por título+tipo: un doble tap en móvil (muy común cuando el
    // usuario no ve reacción inmediata) podía disparar el mismo submit fallido
    // dos veces y apilar el mismo aviso duplicado uno encima del otro (ej.
    // "Completa todos los campos" x2, visto en grabación real de Clarity).
    setToasts(prev => {
      const dupe = prev.find(t => t.type === item.type && t.title === item.title);
      if (dupe) {
        clearTimeout(timers.current.get(dupe.id));
        const duration = item.duration ?? 4000;
        const t = setTimeout(() => remove(dupe.id), duration + 300);
        timers.current.set(dupe.id, t);
        return prev;
      }
      const id = crypto.randomUUID();
      const duration = item.duration ?? 4000;
      const t = setTimeout(() => remove(id), duration + 300);
      timers.current.set(id, t);
      return [{ ...item, id }, ...prev].slice(0, 5);
    });
  }, [remove]);

  // Register the add function in the module-level variable so the shim can call it
  useLayoutEffect(() => {
    _add = add;
    return () => { _add = () => {}; };
  }, [add]);

  const portal = createPortal(
    <div style={{
      position: 'fixed', top: '20px', left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 9999,
      display: 'flex', flexDirection: 'column', gap: '8px',
      alignItems: 'center', pointerEvents: 'none',
    }}>
      <AnimatePresence mode="popLayout">
        {toasts.map(t => (
          <div key={t.id} style={{ pointerEvents: 'auto' }}>
            <XToast item={t} onRemove={() => remove(t.id)} />
          </div>
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );

  return (
    <>
      {children}
      {portal}
    </>
  );
};
