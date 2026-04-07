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

/* ── Icons ─────────────────────────────────────────────────────────────── */
const icons: Record<ToastType, JSX.Element> = {
  success: (
    <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
      <circle cx="12" cy="12" r="10.5" stroke="#22c55e" strokeWidth="1.5" />
      <path d="M7.5 12.5l3 3 6-6.5" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
      <circle cx="12" cy="12" r="10.5" stroke="#ef4444" strokeWidth="1.5" />
      <path d="M8.5 8.5l7 7M15.5 8.5l-7 7" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
      <circle cx="12" cy="12" r="10.5" stroke="#D4AF37" strokeWidth="1.5" />
      <path d="M12 11v5.5" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="8" r="1" fill="#D4AF37" />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
      <path d="M12 3.5L21.5 20H2.5L12 3.5Z" stroke="#f59e0b" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M12 10.5v4" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="17" r="0.8" fill="#f59e0b" />
    </svg>
  ),
};

const palette: Record<ToastType, { bar: string; bg: string; border: string; glow: string }> = {
  success: { bar: 'linear-gradient(180deg,#22c55e,#15803d)', bg: 'rgba(34,197,94,0.07)',  border: 'rgba(34,197,94,0.25)',  glow: '0 0 40px rgba(34,197,94,0.08)' },
  error:   { bar: 'linear-gradient(180deg,#ef4444,#b91c1c)', bg: 'rgba(239,68,68,0.07)',  border: 'rgba(239,68,68,0.25)',  glow: '0 0 40px rgba(239,68,68,0.08)' },
  info:    { bar: 'linear-gradient(180deg,#D4AF37,#92710F)', bg: 'rgba(212,175,55,0.06)', border: 'rgba(212,175,55,0.25)', glow: '0 0 40px rgba(212,175,55,0.1)' },
  warning: { bar: 'linear-gradient(180deg,#f59e0b,#b45309)', bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.2)',  glow: '0 0 40px rgba(245,158,11,0.06)' },
};

/* ── Single Toast ──────────────────────────────────────────────────────── */
const XToast = ({ item, onRemove }: { item: ToastItem; onRemove: () => void }) => {
  const p = palette[item.type];
  const dur = (item.duration ?? 4000) / 1000;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -28, scale: 0.88 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      whileHover={{ scale: 1.015 }}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        padding: '15px 20px 15px 20px',
        borderRadius: '16px',
        background: `linear-gradient(135deg, rgba(12,12,12,0.98) 0%, rgba(16,14,10,0.98) 100%)`,
        border: `1px solid ${p.border}`,
        boxShadow: `0 0 0 1px rgba(255,255,255,0.03), 0 4px 8px rgba(0,0,0,0.4), 0 20px 60px rgba(0,0,0,0.85), ${p.glow}`,
        backdropFilter: 'blur(32px)',
        WebkitBackdropFilter: 'blur(32px)',
        minWidth: '340px',
        maxWidth: '440px',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
      onClick={onRemove}
    >
      {/* Left accent bar */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px',
        background: p.bar,
      }} />

      {/* Shine sweep on mount */}
      <motion.div
        initial={{ x: '-100%', skewX: '-12deg' }}
        animate={{ x: '380%', skewX: '-12deg' }}
        transition={{ duration: 0.65, ease: 'easeOut', delay: 0.05 }}
        style={{
          position: 'absolute', top: 0, left: 0, width: '30%', height: '100%',
          background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.04),transparent)',
          pointerEvents: 'none',
        }}
      />

      {/* Icon container */}
      <div style={{
        flexShrink: 0, width: '40px', height: '40px',
        borderRadius: '12px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: p.bg,
        border: `1px solid ${p.border}`,
      }}>
        {icons[item.type]}
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          margin: 0, fontWeight: 700, fontSize: '13.5px',
          color: '#f0f0f0', letterSpacing: '0.01em', lineHeight: 1.35,
          fontFamily: 'Inter, sans-serif',
        }}>
          {item.title}
        </p>
        {item.description && (
          <p style={{
            margin: '3px 0 0', fontSize: '12px',
            color: 'rgba(255,255,255,0.38)', lineHeight: 1.5,
            fontFamily: 'Inter, sans-serif',
          }}>
            {item.description}
          </p>
        )}
      </div>

      {/* XPEAK mark */}
      <span style={{
        flexShrink: 0, fontSize: '9px', fontWeight: 900,
        letterSpacing: '2px', color: 'rgba(212,175,55,0.25)',
        userSelect: 'none', fontFamily: 'Inter, sans-serif',
      }}>
        XPEAK
      </span>

      {/* Progress drain bar */}
      <motion.div
        initial={{ scaleX: 1, originX: 0 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: dur, ease: 'linear' }}
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px',
          background: p.bar, transformOrigin: 'left',
          borderRadius: '0 0 16px 16px',
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
    const id = crypto.randomUUID();
    const duration = item.duration ?? 4000;
    setToasts(prev => [{ ...item, id }, ...prev].slice(0, 5));
    const t = setTimeout(() => remove(id), duration + 300);
    timers.current.set(id, t);
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
      display: 'flex', flexDirection: 'column', gap: '10px',
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
