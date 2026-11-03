import { useLocation } from 'react-router-dom';
import { movemberActivo } from '@/lib/movember';
import { dia25nActivo } from '@/lib/dia25n';

// Filete dorado fijo arriba en todas las páginas menos la portada (que ya lleva
// su bloque grande con el bigote). Solo la línea: sin figuras colgando.
const MovemberHilo = () => {
  const { pathname } = useLocation();
  const morado = dia25nActivo();
  if ((!movemberActivo() && !morado) || pathname === '/') return null;
  return (
    <div aria-hidden className="fixed left-0 right-0 z-[60] pointer-events-none h-[3px]"
      style={{ top: 'env(safe-area-inset-top, 0px)', background: morado ? 'linear-gradient(90deg,#5B2DA8,#8B5CD6,#E9DDF8,#8B5CD6,#5B2DA8)' : 'linear-gradient(90deg,#B8941E,#D4AF37,#FBF3DD,#D4AF37,#B8941E)' }} />
  );
};

export default MovemberHilo;
