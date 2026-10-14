import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Trophy } from 'lucide-react';
import { HZ } from '@/components/healthy-zone/clay';
import { concursoActivo, CIERRA_CONCURSO } from '@/lib/concursoMadrid';
import { useEffect, useState } from 'react';
import { useProfile } from '@/hooks/useProfile';

// PROVISIONAL: banner del Concurso DJ XPEAK Madrid (13 oct - 2 nov 2026), en
// el Feed y en Inicio (en el móvil el Feed no está en la barra de abajo y los
// DJs entran a Inicio). Se oculta solo al cerrar el plazo; después se puede
// borrar el archivo y sus usos en FeedView y ExplorarView.
const MS_DIA = 86_400_000;

// Cuenta atrás hasta el cierre (hora de Madrid, ver CIERRA_CONCURSO). Última
// jornada: cifras en rosa y "Último día" en la etiqueta.
function CuentaAtras({ onFin }: { onFin: () => void }) {
  const [ahora, setAhora] = useState(() => Date.now());
  const resta = Math.max(0, CIERRA_CONCURSO.getTime() - ahora);
  useEffect(() => {
    const t = window.setInterval(() => setAhora(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);
  useEffect(() => { if (resta === 0) onFin(); }, [resta, onFin]);
  const p = (n: number) => String(n).padStart(2, '0');
  const trozos = [
    { v: Math.floor(resta / MS_DIA), l: 'días' },
    { v: Math.floor(resta / 3_600_000) % 24, l: 'horas' },
    { v: Math.floor(resta / 60_000) % 60, l: 'min' },
    { v: Math.floor(resta / 1000) % 60, l: 'seg' },
  ];
  const urgente = resta < MS_DIA;
  const texto = `Quedan ${trozos[0].v} días, ${trozos[1].v} horas y ${trozos[2].v} minutos`;
  return (
    <div className="flex gap-2 mt-3.5" role="timer" aria-label={texto}>
      {trozos.map((t, i) => (
        <div key={t.l} aria-hidden className="min-w-[3.6rem] max-sm:min-w-0 max-sm:flex-1 px-1.5 pt-2 pb-1.5 rounded-2xl text-center"
          style={{
            background: 'rgba(255,255,255,0.16)',
            boxShadow: 'inset 3px 3px 8px rgba(255,255,255,0.28), inset -3px -3px 8px rgba(0,0,0,0.2), 0 6px 12px rgba(20,0,80,0.25)',
          }}>
          <span className="block text-[1.9rem] max-sm:text-2xl leading-none tabular-nums text-white"
            style={{ fontFamily: HZ.display, fontWeight: 800, color: urgente ? '#ff9aa8' : i === 3 ? '#ffe08a' : '#fff', textShadow: '0 2px 8px rgba(20,0,80,0.4)' }}>
            {p(t.v)}
          </span>
          <span className="block text-[0.58rem] uppercase tracking-[0.14em] mt-1" style={{ color: '#bfe8ff', fontFamily: HZ.body, fontWeight: 800 }}>{t.l}</span>
        </div>
      ))}
    </div>
  );
}

const ConcursoFeedBanner = () => {
  // Un organizador no puede participar, solo votar: a él solo le sale
  // "Ver aspirantes" (la página con las sesiones, separada de las bases).
  const { role } = useProfile();
  const [cerrado, setCerrado] = useState(false);
  if (cerrado || !concursoActivo()) return null;
  const ultimoDia = CIERRA_CONCURSO.getTime() - Date.now() < MS_DIA;
  const organizador = role === 'empresario';

  return (
    <>
    {/* Las tipografías del Feed: en Inicio no están cargadas. */}
    <Helmet><link rel="stylesheet" href={HZ.fontsHref} /></Helmet>
    <div
      className="relative flex items-center gap-4 overflow-hidden rounded-3xl p-5 sm:p-6 mb-4"
      style={{
        background: 'linear-gradient(120deg,#1d3fd6 0%,#2b6dff 40%,#a52ee0 100%)',
        boxShadow: '10px 14px 30px rgba(74,60,200,0.35), inset -6px -6px 14px rgba(0,0,0,0.18), inset 6px 6px 14px rgba(255,255,255,0.25)',
      }}
    >
      {/* Haces de luz, mismo aire que el carrusel de Instagram */}
      <span aria-hidden className="absolute -left-10 top-[70%] h-[3px] w-[140%] -rotate-12 opacity-50" style={{ background: '#7fd3ff', filter: 'blur(2px)' }} />
      <span aria-hidden className="absolute -left-10 top-[90%] h-[3px] w-[140%] -rotate-[20deg] opacity-40" style={{ background: '#f08cff', filter: 'blur(2px)' }} />

      <div className="relative flex-1 min-w-0">
        <p className="inline-flex items-center gap-1.5 text-[0.65rem] uppercase tracking-[0.2em] mb-1.5" style={{ color: '#bfe8ff', fontFamily: HZ.body, fontWeight: 800 }}>
          <Trophy size={12} strokeWidth={2.5} /> {ultimoDia ? 'Último día' : 'Hasta el 2 nov'} · Madrid
        </p>
        <p className="text-xl sm:text-2xl leading-tight text-white" style={{ fontFamily: HZ.display, fontWeight: 800 }}>
          Concurso DJ XPEAK Madrid
        </p>
        <p className="text-sm mt-1.5 max-w-md" style={{ color: 'rgba(255,255,255,0.88)', fontFamily: HZ.body }}>
          Para DJs de la Comunidad de Madrid. Sube tu sesión: las 3 con más me gusta van a la final y el jurado elige quién se lleva los Pioneer DJ HDJ-X5.
        </p>
        <CuentaAtras onFin={() => setCerrado(true)} />
        <div className="flex flex-wrap items-center gap-2 mt-3.5">
          {!organizador && (
            <Link to="/concurso-dj-madrid#inscripcion"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm bg-white transition-transform hover:translate-x-0.5"
              style={{ color: '#3a1f9e', fontFamily: HZ.display, fontWeight: 800 }}>
              Participar <ArrowRight size={15} strokeWidth={2.75} />
            </Link>
          )}
          <Link to="/concurso-dj-madrid/aspirantes"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm bg-white transition-transform hover:translate-x-0.5"
            style={{ color: '#3a1f9e', fontFamily: HZ.display, fontWeight: 800 }}>
            Ver aspirantes <ArrowRight size={15} strokeWidth={2.75} />
          </Link>
        </div>
      </div>

      <img
        src="/concurso/cascos-hdj-x5.webp"
        alt="Auriculares Pioneer DJ HDJ-X5"
        width={360}
        height={358}
        loading="lazy"
        className="relative w-24 sm:w-36 h-auto shrink-0 -rotate-6"
        style={{ filter: 'drop-shadow(0 10px 18px rgba(20,0,60,0.45))' }}
      />
    </div>
    </>
  );
};

export default ConcursoFeedBanner;
