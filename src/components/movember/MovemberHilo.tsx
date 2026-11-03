import { useLocation } from 'react-router-dom';
import { movemberActivo } from '@/lib/movember';
import { Bigote } from '@/components/movember/Movember';

// Hilo común de Movember en todas las páginas menos la portada (que ya lleva
// su bloque grande): filete dorado fijo arriba con tres bigotes pequeños en
// los márgenes, donde no hay botones ni texto. Mismo papel que la guirnalda de
// Halloween. Sin eventos de ratón.
const MovemberHilo = () => {
  const { pathname } = useLocation();
  if (!movemberActivo() || pathname === '/') return null;
  return (
    <div aria-hidden className="fixed left-0 right-0 z-[60] pointer-events-none"
      style={{ top: 'env(safe-area-inset-top, 0px)' }}>
      <div className="h-[3px]" style={{ background: 'linear-gradient(90deg,#B8941E,#D4AF37,#FBF3DD,#D4AF37,#B8941E)' }} />
      <Bigote ancho={34} borde className="absolute top-[6px] left-[1.5%]" />
      <Bigote ancho={34} borde className="absolute top-[6px] right-[1.5%]" />
      <Bigote ancho={44} borde className="hidden md:block absolute top-[6px] left-1/2 -translate-x-1/2" />
    </div>
  );
};

export default MovemberHilo;
