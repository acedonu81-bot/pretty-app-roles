import { Trophy, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { CuentaAtras } from '@/components/dashboard/views/ConcursoFeedBanner';
import { concursoActivo, CIERRA_CONCURSO } from '@/lib/concursoMadrid';
import { HZ, clay, clayButton } from '@/components/healthy-zone/clay';
import { halloweenActivo } from '@/lib/halloween';
import { CalabazaDJ } from '@/components/halloween/HalloweenHero';

// PROVISIONAL (16 oct 2026): aviso del Concurso DJ XPEAK Madrid en /auth, con la
// cuenta atrás hasta el cierre. 'panel' va en la columna izquierda (solo
// ordenador y tablet); 'compacto' va encima del formulario en móvil. El botón
// no navega: deja al usuario en /auth para que cree la cuenta sin perderse en
// un navegador integrado. Se apaga solo al cerrar el plazo; luego se puede
// borrar el archivo y sus usos en Auth.tsx.
// Cuenta atrás en una línea para la franja del móvil.
function CuentaAtrasLinea({ onFin }: { onFin: () => void }) {
  const [ahora, setAhora] = useState(() => Date.now());
  const resta = Math.max(0, CIERRA_CONCURSO.getTime() - ahora);
  useEffect(() => {
    const t = window.setInterval(() => setAhora(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);
  useEffect(() => { if (resta === 0) onFin(); }, [resta, onFin]);
  const d = Math.floor(resta / 86_400_000), h = Math.floor(resta / 3_600_000) % 24, m = Math.floor(resta / 60_000) % 60;
  return <span className="tabular-nums" role="timer" aria-label={`Quedan ${d} días, ${h} horas y ${m} minutos`}>{d}d {String(h).padStart(2, '0')}h {String(m).padStart(2, '0')}m</span>;
}

type Props = { variante: 'panel' | 'compacto'; onParticipar: () => void };

const ConcursoAuthBanner = ({ variante, onParticipar }: Props) => {
  const [cerrado, setCerrado] = useState(false);
  if (cerrado || !concursoActivo()) return null;
  const compacto = variante === 'compacto';
  // Halloween (25 oct - 1 nov): mismos colores que el banner de la portada.
  const hw = halloweenActivo();
  const fondo = hw ? 'linear-gradient(135deg,#FFF3E6 0%,#FFD9B0 55%,#E3C8FA 100%)' : 'linear-gradient(135deg,#F4F9FF 0%,#D3E6FB 100%)';
  const sombra = hw ? clay('139,63,217', 'sm') : clay('36,119,179', 'sm');
  const tinta = hw ? '#4A1D7A' : '#14407A';
  const acento = hw ? '#7A2FC0' : '#2477B3';
  const boton = hw ? '#F07212' : '#2477B3';
  const botonSombra = clayButton(hw ? '240,114,18' : '36,119,179');

  if (compacto) {
    return (
      <>
      <Helmet><link rel="stylesheet" href={HZ.fontsHref} /></Helmet>
      <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 mb-4" style={{ background: fondo, boxShadow: sombra }}>
        {hw ? <CalabazaDJ className="shrink-0 w-9 h-auto" /> : <Trophy size={18} strokeWidth={2.5} className="shrink-0" style={{ color: acento }} />}
        <div className="min-w-0 flex-1 leading-tight" style={{ fontFamily: HZ.body, color: tinta }}>
          <p className="text-sm whitespace-nowrap" style={{ fontFamily: HZ.display, fontWeight: 800 }}>Concurso DJ Madrid</p>
          <p className="text-[0.75rem] font-bold">Solo Madrid · quedan <CuentaAtrasLinea onFin={() => setCerrado(true)} /></p>
        </div>
        <button type="button" onClick={onParticipar}
          className="shrink-0 px-3 py-2 rounded-full text-xs"
          style={{ background: boton, color: '#fff', boxShadow: botonSombra, fontFamily: HZ.display, fontWeight: 800 }}>
          Participar
        </button>
      </div>
      </>
    );
  }

  return (
    <>
    <Helmet><link rel="stylesheet" href={HZ.fontsHref} /></Helmet>
    <div
      className="relative rounded-2xl p-4 mt-7"
      style={{ background: fondo, boxShadow: sombra }}
    >
      <p className="inline-flex items-center gap-1.5 text-[0.75rem] uppercase tracking-[0.18em]" style={{ color: acento, fontFamily: HZ.body, fontWeight: 800 }}>
        <Trophy size={12} strokeWidth={2.5} /> Concurso activo · Solo Madrid
      </p>
      <p className="leading-tight mt-1 text-xl" style={{ fontFamily: HZ.display, fontWeight: 800, color: tinta }}>
        Concurso DJ XPEAK Madrid
      </p>
      <p className="text-xs mt-1" style={{ color: tinta, fontFamily: HZ.body }}>
        Para DJs de la Comunidad de Madrid. Premio: Pioneer DJ HDJ-X5.
      </p>
      <CuentaAtras onFin={() => setCerrado(true)} claro hw={hw} />
      <button type="button" onClick={onParticipar}
        className="mt-3 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm"
        style={{ background: boton, color: '#fff', boxShadow: botonSombra, fontFamily: HZ.display, fontWeight: 800 }}>
        Quiero participar <ArrowRight size={16} strokeWidth={2.75} />
      </button>
    </div>
    </>
  );
};

export default ConcursoAuthBanner;
