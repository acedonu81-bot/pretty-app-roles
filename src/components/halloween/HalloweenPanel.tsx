import { useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { halloweenActivo } from '@/lib/halloween';
import { CalabazaDJ } from '@/components/halloween/HalloweenHero';

// PROVISIONAL: franja de Halloween arriba de todas las vistas del panel
// (25 oct - 1 nov 2026). El panel abre en el directorio de DJs, no en
// Explorar ni Feed, así que el banner del concurso no basta para que se vea.
// Organizador: buscar DJ para la noche del 31. Profesional: perfil al día.
// Se puede cerrar (recordado en este navegador); las luces de arriba
// (GuirnaldaLuces) siguen puestas para que el tema no desaparezca del todo.

const NARANJA = '#FF8A1F';
const MORADO = '#8B3FD9';
const CLAVE_CERRADA = 'xp_hw_franja_cerrada';

function leerCerrada() {
  try { return localStorage.getItem(CLAVE_CERRADA) === '1'; } catch { return false; }
}

const HalloweenPanel = ({ isEmpresario, onViewChange }: { isEmpresario: boolean; onViewChange: (v: string) => void }) => {
  const [cerrada, setCerrada] = useState(leerCerrada);
  if (!halloweenActivo() || cerrada) return null;
  const cerrar = () => {
    setCerrada(true);
    try { localStorage.setItem(CLAVE_CERRADA, '1'); } catch { /* sin almacenamiento: vuelve a salir al recargar */ }
  };
  return (
    <div className="relative mx-3 md:mx-6 mt-3 overflow-hidden rounded-2xl pl-4 pr-24 sm:pl-6 sm:pr-36 py-4 sm:py-5"
      style={{
        background: 'linear-gradient(115deg,#4A1D7A 0%,#7A2FC0 55%,#F07212 100%)',
        boxShadow: '8px 12px 26px rgba(122,47,192,0.3), inset -5px -5px 12px rgba(0,0,0,0.16), inset 5px 5px 12px rgba(255,255,255,0.22)',
      }}>
      <p className="text-xs font-extrabold" style={{ color: '#FFD2A6' }}>Semana de Halloween</p>
      <p className="text-lg sm:text-2xl font-black leading-tight text-white font-display mt-0.5">
        {isEmpresario ? '¿Fiesta el 31 y sin DJ? Aún estás a tiempo' : 'La noche más movida del año: que te encuentren'}
      </p>
      <p className="text-sm mt-1 max-w-xl" style={{ color: 'rgba(255,255,255,0.85)' }}>
        {isEmpresario
          ? 'DJs, animadores y staff para tu noche de Halloween, sin comisión.'
          : 'En Halloween se contrata a última hora. Ten tu foto, tus precios y tu música al día.'}
      </p>
      <button type="button" onClick={() => onViewChange(isEmpresario ? 'dj' : 'profile')}
        className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-black text-white transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
        style={{ background: NARANJA, boxShadow: `0 6px 16px rgba(240,114,18,0.45), inset -3px -3px 8px rgba(0,0,0,0.18), inset 3px 3px 8px rgba(255,255,255,0.3)` }}>
        {isEmpresario ? 'Buscar DJ' : 'Revisar mi perfil'} <ArrowRight size={15} strokeWidth={2.75} />
      </button>

      <CalabazaDJ className="absolute right-2 bottom-1 sm:right-5 sm:bottom-2 w-20 sm:w-28 h-auto rotate-6"
        style={{ filter: `drop-shadow(0 8px 16px ${MORADO}88)` }} />
      <button type="button" onClick={cerrar} aria-label="Cerrar aviso de Halloween"
        className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
        style={{ color: 'rgba(255,255,255,0.8)' }}>
        <X size={16} strokeWidth={2.5} />
      </button>
    </div>
  );
};

export default HalloweenPanel;
