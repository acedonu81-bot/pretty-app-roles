import DirectoryView from './DirectoryView';
import { TODOS_LOS_LOCALES_INVESTIGADOS, type LocalInvestigado } from '@/data/localesEventosMadrid';
import type { Profile } from '@/data/profiles';

interface Props {
  onNavigate?: (view: string) => void;
  onMessage?: (userId: string, name: string) => void;
  searchQuery?: string;
  onViewProfile?: (p: Profile) => void;
}

const CATEGORIA_LABEL: Record<LocalInvestigado['categoria'], string> = {
  emblematico: 'Salas emblemáticas',
  sala: 'Salas y discotecas',
  bar: 'Bares de eventos',
  terraza: 'Terrazas y rooftop',
  'huertas-latina': 'Huertas y La Latina',
  finca: 'Fincas',
};

const CATEGORIA_ORDEN: LocalInvestigado['categoria'][] = ['emblematico', 'sala', 'terraza', 'bar', 'huertas-latina', 'finca'];

/**
 * Misma tarjeta visual que el directorio real (foto + nombre + datos
 * superpuestos), pero sin nada de la interacción de ProfileCard (votos,
 * mensajería, Supabase) — son locales investigados, no perfiles reales en
 * la plataforma, y forzar ese acoplamiento inventaría datos que no existen.
 */
function TarjetaLocalInvestigado({ local }: { local: LocalInvestigado }) {
  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{ background: '#ffffff', border: '1px solid rgba(212,175,55,0.25)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
    >
      <div className="relative pb-[100%]">
        <div className="absolute inset-0" style={{ overflow: 'hidden' }}>
          <img src={local.foto} alt={local.nombre} loading="lazy" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)' }} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-sm font-black line-clamp-2" style={{ color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>{local.nombre}</h3>
          <p className="text-xs" style={{ color: '#F5D77A' }}>{local.zona}</p>
        </div>
      </div>
      <div className="p-3">
        <p className="text-xs" style={{ color: 'rgba(10,9,8,0.65)' }}>{local.tipo}</p>
        {local.web && (
          <a href={local.web} target="_blank" rel="noopener noreferrer nofollow" className="mt-1.5 inline-block text-xs font-semibold" style={{ color: '#8a6d1a' }}>
            Ver web →
          </a>
        )}
      </div>
    </div>
  );
}

/**
 * Debajo del directorio normal (fichas registradas, contacto directo por
 * XPEAK) va este listado de locales investigados manualmente que aún no se
 * han dado de alta — deliberadamente más ligero que una ficha real: sin
 * mensajería interna, para no fingir una actividad en la plataforma que no
 * existe. Sirve de escaparate para que acaben reclamando su ficha.
 *
 * Agrupados por categoría (mismo patrón que los grupos de ExplorarView) en
 * vez de en una sola rejilla mezclada — más fácil de escanear cuando hay
 * varias decenas de locales de tipos muy distintos.
 */
function ListadoSinFicha() {
  const porCategoria = CATEGORIA_ORDEN
    .map(cat => ({ cat, locales: TODOS_LOS_LOCALES_INVESTIGADOS.filter(l => l.categoria === cat) }))
    .filter(g => g.locales.length > 0);

  return (
    <div className="mx-auto w-full max-w-6xl px-3 pb-8 sm:px-4">
      {/* Panel con fondo propio (crema/dorado) para que toda la sección se
          lea de un vistazo como algo distinto del directorio de fichas
          reales de arriba — antes solo se diferenciaba tarjeta a tarjeta
          (borde punteado) y no se notaba lo suficiente. */}
      <div
        className="mt-8 rounded-2xl p-4 sm:p-5"
        style={{ background: 'linear-gradient(180deg, rgba(212,175,55,0.09), rgba(212,175,55,0.03))', border: '1px solid rgba(212,175,55,0.25)' }}
      >
        <div className="mb-1 flex items-center gap-2">
          <span className="h-4 w-1 flex-shrink-0 rounded-full" style={{ background: 'linear-gradient(180deg,#D4AF37,#B8941E)' }} />
          <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--gold-on-light, #7a6216)' }}>
            Otros locales de Madrid (aún sin ficha en XPEAK)
          </h2>
        </div>
        <p className="mb-4 text-xs" style={{ color: 'rgba(10,9,8,0.6)' }}>
          Locales investigados y verificados por XPEAK. Contacto directo con el local, sin mensajería interna.
        </p>

        {porCategoria.map(({ cat, locales }) => (
          <div key={cat} className="mb-6 last:mb-0">
            <h3 className="mb-2 text-xs font-semibold" style={{ color: '#0a0908' }}>{CATEGORIA_LABEL[cat]}</h3>
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 lg:grid-cols-4">
              {locales.map(local => <TarjetaLocalInvestigado key={local.nombre} local={local} />)}
            </div>
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
