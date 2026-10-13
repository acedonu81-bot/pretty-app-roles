import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Trophy } from 'lucide-react';
import { HZ } from '@/components/healthy-zone/clay';
import { concursoActivo } from '@/lib/concursoMadrid';
import { useProfile } from '@/hooks/useProfile';

// PROVISIONAL: banner del Concurso DJ XPEAK Madrid (13 oct - 2 nov 2026), en
// el Feed y en Inicio (en el móvil el Feed no está en la barra de abajo y los
// DJs entran a Inicio). Se oculta solo al cerrar el plazo; después se puede
// borrar el archivo y sus usos en FeedView y ExplorarView.
const ConcursoFeedBanner = () => {
  // Un organizador no puede participar, solo votar: su botón lleva a la lista.
  const { role } = useProfile();
  if (!concursoActivo()) return null;
  const organizador = role === 'empresario';

  return (
    <>
    {/* Las tipografías del Feed: en Inicio no están cargadas. */}
    <Helmet><link rel="stylesheet" href={HZ.fontsHref} /></Helmet>
    <Link
      to={organizador ? "/concurso-dj-madrid#participantes" : "/concurso-dj-madrid#inscripcion"}
      className="group relative flex items-center gap-4 overflow-hidden rounded-3xl p-5 sm:p-6 mb-4 transition-transform hover:scale-[1.01] active:scale-[0.99]"
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
          <Trophy size={12} strokeWidth={2.5} /> Hasta el 2 nov · Madrid
        </p>
        <p className="text-xl sm:text-2xl leading-tight text-white" style={{ fontFamily: HZ.display, fontWeight: 800 }}>
          Concurso DJ XPEAK Madrid
        </p>
        <p className="text-sm mt-1.5 max-w-md" style={{ color: 'rgba(255,255,255,0.88)', fontFamily: HZ.body }}>
          Para DJs de la Comunidad de Madrid. Sube tu sesión: las 3 con más me gusta van a la final y el jurado elige quién se lleva los Pioneer DJ HDJ-X5.
        </p>
        <span className="inline-flex items-center gap-1.5 mt-3 px-4 py-2 rounded-full text-sm bg-white transition-transform group-hover:translate-x-0.5"
          style={{ color: '#3a1f9e', fontFamily: HZ.display, fontWeight: 800 }}>
          {organizador ? 'Votar' : 'Participar'} <ArrowRight size={15} strokeWidth={2.75} />
        </span>
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
    </Link>
    </>
  );
};

export default ConcursoFeedBanner;
