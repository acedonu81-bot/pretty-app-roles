import type { ReactNode } from 'react';

// Contadores y pestañas del perfil de DJ tipo Hearthis (fase 1, 1 nov 2026).
// Los paneles se ocultan con CSS en vez de desmontarse: el texto de todas las
// pestañas sigue en el HTML para Google y los iframes ya cargados no se pierden
// al cambiar de pestaña.

export type PestanaDJ = 'sets' | 'sobre' | 'resenas' | 'actividad';

const NOMBRES: Record<PestanaDJ, string> = {
  sets: 'Sets',
  sobre: 'Sobre mí',
  resenas: 'Reseñas',
  actividad: 'Actividad',
};

interface Props {
  pestanas: PestanaDJ[];
  activa: PestanaDJ;
  onCambiar: (p: PestanaDJ) => void;
  sets: number;
  seguidores: number | null;
  resenas: number;
}

const PestanasPerfilDJ = ({ pestanas, activa, onCambiar, sets, seguidores, resenas }: Props) => {
  // Un contador a 0 no se enseña: un "0 seguidores" se lee como señal negativa.
  const contadores = [
    { valor: sets, singular: 'set', plural: 'sets', destino: 'sets' as PestanaDJ },
    { valor: seguidores ?? 0, singular: 'seguidor', plural: 'seguidores', destino: null },
    { valor: resenas, singular: 'reseña', plural: 'reseñas', destino: 'resenas' as PestanaDJ },
  ].filter(c => c.valor > 0);

  return (
    <div>
      {contadores.length > 0 && (
        <div className="flex flex-wrap gap-x-6 gap-y-1 mb-4">
          {contadores.map(c => {
            const texto = (
              <>
                <span className="text-lg font-black tabular-nums" style={{ color: '#111' }}>{c.valor}</span>{' '}
                <span className="text-sm font-semibold" style={{ color: '#555' }}>{c.valor === 1 ? c.singular : c.plural}</span>
              </>
            );
            return c.destino && pestanas.includes(c.destino) ? (
              <button key={c.plural} type="button" onClick={() => onCambiar(c.destino!)} className="hover:opacity-75">{texto}</button>
            ) : (
              <span key={c.plural}>{texto}</span>
            );
          })}
        </div>
      )}
      <div role="tablist" aria-label="Secciones del perfil"
        className="flex gap-1 overflow-x-auto overflow-y-hidden -mx-1 px-1" style={{ borderBottom: '1px solid rgba(212,175,55,0.3)', scrollbarWidth: 'none' }}>
        {pestanas.map(p => {
          const sel = p === activa;
          return (
            <button key={p} type="button" role="tab" id={`pestana-${p}`} aria-selected={sel} aria-controls={`panel-${p}`}
              onClick={() => onCambiar(p)}
              className="px-3 py-2.5 text-sm font-bold whitespace-nowrap transition-colors"
              style={{
                color: sel ? '#8B6A00' : '#666',
                borderBottom: `2px solid ${sel ? '#D4AF37' : 'transparent'}`,
                marginBottom: -1,
              }}>
              {NOMBRES[p]}
            </button>
          );
        })}
      </div>
    </div>
  );
};

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
