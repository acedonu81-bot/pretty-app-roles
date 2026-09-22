import DirectoryView from './DirectoryView';
import { TODOS_LOS_LOCALES_INVESTIGADOS } from '@/data/localesEventosMadrid';
import type { Profile } from '@/data/profiles';

interface Props {
  onNavigate?: (view: string) => void;
  onMessage?: (userId: string, name: string) => void;
  searchQuery?: string;
  onViewProfile?: (p: Profile) => void;
}

/**
 * Debajo del directorio normal (fichas registradas, contacto directo por
 * XPEAK) va este listado de locales investigados manualmente que aún no se
 * han dado de alta — deliberadamente más ligero que una ficha real: sin
 * mensajería interna, para no fingir una actividad en la plataforma que no
 * existe. Sirve de escaparate para que acaben reclamando su ficha.
 */
function ListadoSinFicha() {
  return (
    <div className="mx-auto w-full max-w-6xl px-3 pb-8 sm:px-4">
      <div className="mt-8 mb-4 flex items-center gap-2">
        <span className="h-4 w-1 flex-shrink-0 rounded-full" style={{ background: 'linear-gradient(180deg,#D4AF37,#B8941E)' }} />
        <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--gold-on-light, #7a6216)' }}>
          Otros locales de Madrid (aún sin ficha en XPEAK)
        </h2>
      </div>
      <p className="mb-4 text-xs" style={{ color: 'rgba(10,9,8,0.55)' }}>
        Locales investigados y verificados por XPEAK. Contacto directo con el local, sin mensajería interna.
      </p>
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 lg:grid-cols-4">
        {TODOS_LOS_LOCALES_INVESTIGADOS.map(local => (
          <div
            key={local.nombre}
            className="rounded-xl p-3"
            style={{ background: '#faf9f7', border: '1px solid rgba(10,9,8,0.08)' }}
          >
            <p className="text-xs font-semibold" style={{ color: '#0a0908' }}>{local.nombre}</p>
            <p className="mt-0.5 text-[11px]" style={{ color: 'rgba(10,9,8,0.55)' }}>{local.zona} · {local.tipo}</p>
            {local.web && (
              <a href={local.web} target="_blank" rel="noopener noreferrer nofollow" className="mt-1.5 inline-block text-[11px] font-semibold" style={{ color: '#8a6d1a' }}>
                Ver web →
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const LocalEventosView = ({ onNavigate, onMessage, searchQuery, onViewProfile }: Props) => (
  <>
    <DirectoryView
      role="local_eventos"
      title="Locales para eventos"
      subtitle="Discotecas, salas, terrazas y fincas de toda España que ceden su espacio para tu evento."
      wideCards
      onNavigate={onNavigate}
      onMessage={onMessage}
      searchQuery={searchQuery}
      onViewProfile={onViewProfile}
    />
    <ListadoSinFicha />
  </>
);

export default LocalEventosView;
