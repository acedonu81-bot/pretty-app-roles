import { useLocation } from 'react-router-dom';
import { movemberActivo } from '@/lib/movember';

// Filete dorado fijo arriba en todas las páginas menos la portada (que ya lleva
// su bloque grande con el bigote). Solo la línea: sin figuras colgando.
const MovemberHilo = () => {
  const { pathname } = useLocation();
  if (!movemberActivo() || pathname === '/') return null;
  return (
    <div aria-hidden className="fixed left-0 right-0 z-[60] pointer-events-none h-[3px]"
      style={{ top: 'env(safe-area-inset-top, 0px)', background: 'linear-gradient(90deg,#B8941E,#D4AF37,#FBF3DD,#D4AF37,#B8941E)' }} />
  );
};

export default MovemberHilo;
