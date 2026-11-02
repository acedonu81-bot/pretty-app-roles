import type { ReactNode } from 'react';

// Contadores y pestañas del perfil de DJ tipo Hearthis (fase 1, 1 nov 2026).
// Los paneles se ocultan con CSS en vez de desmontarse: el texto de todas las
// pestañas sigue en el HTML para Google y los iframes ya cargados no se pierden
// al cambiar de pestaña.

export type PestanaDJ = 'sets' | 'reposts' | 'seguidores' | 'sobre' | 'resenas' | 'actividad';

const NOMBRES: Record<PestanaDJ, string> = {
  sets: 'Sets',
  reposts: 'Reposts',
  seguidores: 'Seguidores',
  sobre: 'Sobre mí',
  resenas: 'Reseñas',
  actividad: 'Actividad',
};

export const ContadoresDJ = ({ sets, seguidores, resenas, onIr }: {
  sets: number;
  seguidores: number | null;
  resenas: number;
  onIr?: (p: PestanaDJ) => void;
}) => {
  // Un contador a 0 no se enseña: un "0 seguidores" se lee como señal negativa.
  const contadores = [
    { valor: sets, singular: 'Set', plural: 'Sets', destino: 'sets' as PestanaDJ },
    { valor: seguidores ?? 0, singular: 'Seguidor', plural: 'Seguidores', destino: null },
    { valor: resenas, singular: 'Reseña', plural: 'Reseñas', destino: 'resenas' as PestanaDJ },
  ].filter(c => c.valor > 0);
  if (contadores.length === 0) return null;

  return (
    <div className="flex gap-6 sm:gap-8">
      {contadores.map(c => {
        const texto = (
          <>
            <span className="block text-xl font-black tabular-nums leading-none" style={{ color: '#111' }}>{c.valor}</span>
            <span className="block text-xs font-semibold mt-1" style={{ color: '#777' }}>{c.valor === 1 ? c.singular : c.plural}</span>
          </>
        );
        return c.destino && onIr ? (
          <button key={c.plural} type="button" onClick={() => onIr(c.destino!)} className="text-left hover:opacity-75">{texto}</button>
        ) : (
          <span key={c.plural}>{texto}</span>
        );
      })}
    </div>
  );
};

const PestanasPerfilDJ = ({ pestanas, activa, onCambiar, cuentas = {} }: {
  pestanas: PestanaDJ[];
  activa: PestanaDJ;
  onCambiar: (p: PestanaDJ) => void;
  /** Número junto al nombre, como en Hearthis ("Sets 3"). Sin número si es 0. */
  cuentas?: Partial<Record<PestanaDJ, number>>;
}) => (
  <div role="tablist" aria-label="Secciones del perfil"
    className="flex gap-1 overflow-x-auto overflow-y-hidden -mx-1 px-1"
    style={{ borderBottom: '1px solid rgba(212,175,55,0.3)', scrollbarWidth: 'none' }}>
    {pestanas.map(p => {
      const sel = p === activa;
      return (
        <button key={p} type="button" role="tab" id={`pestana-${p}`} aria-selected={sel} aria-controls={`panel-${p}`}
          onClick={() => onCambiar(p)}
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-3 text-base sm:text-lg font-bold whitespace-nowrap transition-colors"
          style={{
            color: sel ? '#111' : '#777',
            borderBottom: `3px solid ${sel ? '#D4AF37' : 'transparent'}`,
            marginBottom: -1,
          }}>
          {NOMBRES[p]}
          {!!cuentas[p] && (
            <span className="text-xs font-black px-2 py-0.5 rounded-full tabular-nums"
              style={{ background: sel ? 'rgba(37,99,235,0.12)' : 'rgba(0,0,0,0.06)', color: sel ? '#1D4ED8' : '#666' }}>
              {cuentas[p]}
            </span>
          )}
        </button>
      );
    })}
  </div>
);

/**
 * Envuelve las secciones de una pestaña. Para roles que no son DJ no hace
 * nada (pinta los hijos tal cual), así su perfil no cambia.
 */
export const PanelPerfilDJ = ({ id, esDJ, activa, continuacion = false, children }: {
  id: PestanaDJ; esDJ: boolean; activa: PestanaDJ;
  /** Segundo trozo de una pestaña cuyas secciones no van seguidas en la página: sin id para no duplicarlo. */
  continuacion?: boolean;
  children: ReactNode;
}) => {
  if (!esDJ) return <>{children}</>;
  // `hidden` como clase y no como atributo: con el atributo, la clase `flex`
  // de Tailwind gana y el panel se seguiría viendo.
  const clase = activa === id ? 'flex flex-col gap-8' : 'hidden';
  if (continuacion) return <div className={clase}>{children}</div>;
  return (
    <div role="tabpanel" id={`panel-${id}`} aria-labelledby={`pestana-${id}`} className={clase}>
      {children}
    </div>
  );
};

export default PestanasPerfilDJ;
