import { Trophy, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { CuentaAtras } from '@/components/dashboard/views/ConcursoFeedBanner';
import { concursoActivo } from '@/lib/concursoMadrid';
import { HZ, clay, clayButton } from '@/components/healthy-zone/clay';

// PROVISIONAL (16 oct 2026): aviso del Concurso DJ XPEAK Madrid en /auth, con la
// cuenta atrás hasta el cierre. 'panel' va en la columna izquierda (solo
// ordenador y tablet); 'compacto' va encima del formulario en móvil. El botón
// no navega: deja al usuario en /auth para que cree la cuenta sin perderse en
// un navegador integrado. Se apaga solo al cerrar el plazo; luego se puede
// borrar el archivo y sus usos en Auth.tsx.
type Props = { variante: 'panel' | 'compacto'; onParticipar: () => void };

const ConcursoAuthBanner = ({ variante, onParticipar }: Props) => {
  const [cerrado, setCerrado] = useState(false);
  if (cerrado || !concursoActivo()) return null;
  const compacto = variante === 'compacto';

  return (
    <>
    <Helmet><link rel="stylesheet" href={HZ.fontsHref} /></Helmet>
    <div
      className={`rounded-2xl ${compacto ? 'p-3.5 mb-5' : 'p-4 mt-7'}`}
      style={{ background: 'linear-gradient(135deg,#F4F9FF 0%,#D3E6FB 100%)', boxShadow: clay('36,119,179', 'sm') }}
    >
      <p className="inline-flex items-center gap-1.5 text-[0.75rem] uppercase tracking-[0.18em]" style={{ color: '#2477B3', fontFamily: HZ.body, fontWeight: 800 }}>
        <Trophy size={12} strokeWidth={2.5} /> Concurso activo · Solo Madrid
      </p>
      <p className={`leading-tight mt-1 ${compacto ? 'text-base' : 'text-xl'}`} style={{ fontFamily: HZ.display, fontWeight: 800, color: '#14407A' }}>
        Concurso DJ XPEAK Madrid
      </p>
      <p className="text-xs mt-1" style={{ color: '#14407A', fontFamily: HZ.body }}>
        Para DJs de la Comunidad de Madrid. Premio: Pioneer DJ HDJ-X5.
      </p>
      <CuentaAtras onFin={() => setCerrado(true)} claro />
      <button type="button" onClick={onParticipar}
        className="mt-3 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm"
        style={{ background: '#2477B3', color: '#fff', boxShadow: clayButton('36,119,179'), fontFamily: HZ.display, fontWeight: 800 }}>
        Quiero participar <ArrowRight size={16} strokeWidth={2.75} />
      </button>
    </div>
    </>
  );
};

export default ConcursoAuthBanner;
