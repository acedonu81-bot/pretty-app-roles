import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/**
 * Botón "Volver" global (14 oct 2026: el usuario vio que las bases del
 * concurso y muchas otras páginas públicas no tenían forma de volver atrás;
 * 347 de las páginas con pie público no lo traían). Barra fina en el flujo,
 * encima de cada página, salvo en las que tienen su propia navegación.
 * Si hay una página anterior de la app vuelve a ella; si no (se entró
 * directamente, p. ej. desde Instagram) lleva al inicio.
 */
const SIN_BARRA = ['/', '/dashboard', '/auth'];

export default function BarraVolver() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  if (SIN_BARRA.includes(pathname.replace(/\/+$/, '') || '/')) return null;

  const volver = () => {
    const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0;
    if (idx > 0) navigate(-1);
    else navigate('/');
  };

  return (
    <div className="w-full" style={{ background: '#FFFDF7', borderBottom: '1px solid rgba(212,175,55,0.25)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-1.5">
        <button type="button" onClick={volver}
          className="inline-flex items-center gap-1.5 min-h-[36px] pr-3 text-sm font-bold"
          style={{ color: '#7a6216' }}>
          <ArrowLeft size={16} strokeWidth={2.5} /> Volver
        </button>
      </div>
    </div>
  );
}
