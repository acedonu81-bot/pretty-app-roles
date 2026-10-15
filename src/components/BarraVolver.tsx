import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

/**
 * Botón "Volver" global (14 oct 2026: el usuario vio que las bases del
 * concurso y muchas otras páginas públicas no tenían forma de volver atrás;
 * 347 de las páginas con pie público no lo traían). Barra fina en el flujo,
 * encima de cada página, salvo en las que tienen su propia navegación.
 * Si hay una página anterior de la app vuelve a ella; si no (se entró
 * directamente, p. ej. desde Instagram) lleva al inicio: al panel si hay
 * sesión. Antes llevaba siempre a la portada pública y en la app instalada,
 * que se abre sin historial, "Volver" parecía sacarte de la sesión (15 oct).
 */
const SIN_BARRA = ['/', '/dashboard', '/auth'];
// Páginas con su propia flecha de volver fija arriba: la barra duplicaba
// la navegación (ficha pública: "Volver" y, justo debajo, "← XPEAK").
const CON_VOLVER_PROPIO = ['/p/'];

export default function BarraVolver() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  if (SIN_BARRA.includes(pathname.replace(/\/+$/, '') || '/')) return null;
  if (CON_VOLVER_PROPIO.some(prefijo => pathname.startsWith(prefijo))) return null;

  const volver = () => {
    const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0;
    if (idx > 0) navigate(-1);
    else navigate(user ? '/dashboard' : '/');
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
