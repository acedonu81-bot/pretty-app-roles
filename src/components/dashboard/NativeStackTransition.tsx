import { AnimatePresence, motion } from 'framer-motion';
import { isNative } from '@/lib/capacitor';

interface NativeStackTransitionProps {
  activeKey: string;
  direction: 'forward' | 'back';
  children: React.ReactNode;
}

const variants = {
  enter: (direction: 'forward' | 'back') => ({
    x: direction === 'forward' ? '100%' : '-100%',
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: 'forward' | 'back') => ({
    x: direction === 'forward' ? '-30%' : '30%',
    opacity: 0,
  }),
};

// En web la navegación del dashboard sigue siendo 100% síncrona: renderView()
// se monta directamente sin pasar por AnimatePresence (ver Dashboard.tsx, que
// ya evita a propósito un key={activeView} ahí para no forzar desmontaje/
// remontaje del subárbol completo). Este wrapper solo introduce esa animación
// de stack (slide + desmontaje real vía AnimatePresence) cuando la app corre
// dentro de Capacitor — en web es pasarela pura, mismo comportamiento de
// siempre.
export function NativeStackTransition({ activeKey, direction, children }: NativeStackTransitionProps) {
  if (!isNative) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait" custom={direction} initial={false}>
      <motion.div
        key={activeKey}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
