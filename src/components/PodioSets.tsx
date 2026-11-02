import { Headphones } from 'lucide-react';
import Medalla from '@/components/Medalla';
import type { PuestoPodio } from '@/hooks/usePodioSets';
import { tituloPorDefecto } from '@/lib/setFicha';
import { fotoOptimizada } from '@/lib/imagen';

// Podio de los 3 sets más escuchados de XPEAK en los últimos 30 días (fase 3,
// 1 nov 2026), con medallas de oro, plata y bronce bien grandes. El oro va en
// medio y más alto, como un podio de verdad. Sin escuchas no se pinta nada.
const ORDEN_VISUAL: (1 | 2 | 3)[] = [2, 1, 3];

const PodioSets = ({ podio }: { podio: PuestoPodio[] }) => {
  if (!podio.length) return null;
  const porPuesto = new Map(podio.map(p => [p.puesto, p]));

  return (
    <section aria-labelledby="podio-titulo" className="rounded-3xl p-5 sm:p-8"
      style={{ background: 'linear-gradient(180deg,#FFFDF7 0%,#FBF3DD 100%)', border: '1px solid rgba(212,175,55,0.3)' }}>
      <div className="flex items-center gap-2 mb-1">
        <Headphones size={18} style={{ color: '#2563EB' }} />
        <h2 id="podio-titulo" className="text-xl sm:text-2xl font-black" style={{ color: '#111' }}>Los sets más escuchados</h2>
      </div>
      <p className="text-sm mb-6" style={{ color: '#666' }}>Últimos 30 días · cuenta una escucha por persona al día, desde 5 minutos</p>

      <ol className="grid grid-cols-3 gap-2 sm:gap-5 items-end">
        {ORDEN_VISUAL.map(n => {
          const p = porPuesto.get(n);
          if (!p) return <li key={n} aria-hidden="true" />;
          const oro = n === 1;
          return (
            <li key={n} className={`flex flex-col items-center text-center ${n === 1 ? 'order-2' : n === 2 ? 'order-1' : 'order-3'}`}>
              <a href={`/p/${p.dj_user_id}`} className="group flex flex-col items-center w-full">
                <Medalla puesto={n} tam={oro ? 88 : 68} />
                <div className={`relative mt-3 rounded-2xl overflow-hidden ${oro ? 'w-24 h-24 sm:w-36 sm:h-36' : 'w-20 h-20 sm:w-28 sm:h-28'}`}
                  style={{ boxShadow: '0 8px 24px rgba(139,106,0,0.22)', border: '3px solid #fff' }}>
                  {p.portada || p.foto ? (
                    <img src={fotoOptimizada((p.portada || p.foto)!, 300)} alt="" aria-hidden="true"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full" style={{ background: 'linear-gradient(135deg,#E3B54F,#B8941E)' }} />
                  )}
                </div>
                <p className={`font-black mt-2 leading-tight line-clamp-2 ${oro ? 'text-sm sm:text-lg' : 'text-xs sm:text-base'}`} style={{ color: '#111' }}>
                  {p.titulo || tituloPorDefecto(p.set_url, n)}
                </p>
                <p className="text-xs font-semibold truncate max-w-full" style={{ color: '#8B6A00' }}>{p.nombre}</p>
                <p className="text-xs tabular-nums mt-0.5" style={{ color: '#2563EB' }}>
                  {p.escuchas} {p.escuchas === 1 ? 'escucha' : 'escuchas'}
                </p>
              </a>
            </li>
          );
        })}
      </ol>
    </section>
  );
};

export default PodioSets;
