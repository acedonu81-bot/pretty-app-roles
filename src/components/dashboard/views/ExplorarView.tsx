/**
 * Pantalla de aterrizaje del dashboard: el mapa de la plataforma.
 *
 * Antes, al entrar caías directamente en el listado de tu propio gremio (un
 * DJ veía DJs) sin haber visto nunca qué más hay aquí, y mucha gente se
 * quedaba sin saber por dónde moverse. Esta vista enseña los 18 gremios con
 * su foto para que se entienda de un vistazo a dónde lleva cada sitio.
 *
 * En cuanto navegas una vez, la vista guardada manda y ya no vuelves a verla
 * (ver resolverVistaInicial en Dashboard.tsx) — no estorba a quien ya sabe
 * moverse. Siempre queda accesible desde el menú.
 *
 * Sin contadores de profesionales a propósito: con el inventario actual la
 * mayoría de gremios saldría a cero y las tarjetas dirían "aquí no hay nadie"
 * justo donde queremos que la gente entre.
 */
interface Props {
  onNavigate?: (view: string) => void;
}

/** Foto por gremio — descargadas de Pexels, una por oficio (900×600). */
const img = (id: string) => `/images/pexels/roles/${id}.jpg`;

/**
 * Los gremios, agrupados igual que el sidebar y /descubrir para que las tres
 * navegaciones cuenten lo mismo. `view` es el id de vista del dashboard, que
 * no siempre coincide con el rol de BD (photo-booth usa la vista de media).
 */
const GRUPOS: { titulo: string; items: { id: string; view: string; nombre: string; gancho: string }[] }[] = [
  {
    titulo: 'Música',
    items: [
      { id: 'dj', view: 'dj', nombre: 'DJs & Artistas', gancho: 'DJs, productores y música en vivo' },
      { id: 'grupo-musical', view: 'grupo-musical', nombre: 'Grupos Musicales', gancho: 'Bandas, orquestas y versiones' },
    ],
  },
  {
    titulo: 'Sala, Barra & Catering',
    items: [
      { id: 'staff', view: 'staff', nombre: 'Sala & Barra', gancho: 'Camareros, bartenders y personal de sala' },
      { id: 'catering', view: 'catering', nombre: 'Catering & Chef', gancho: 'Cocina, barra y showcooking' },
    ],
  },
  {
    titulo: 'Imagen & Media',
    items: [
      { id: 'media', view: 'media', nombre: 'Media & Contenido', gancho: 'Fotografía, vídeo y creadores' },
      { id: 'photo-booth', view: 'media', nombre: 'Photo Booth', gancho: 'Cabinas de fotos y espejos 360' },
      { id: 'design', view: 'design', nombre: 'Diseño & Visuales', gancho: 'Cartelería, VJing y mapping' },
    ],
  },
  {
    titulo: 'Azafatas & RRPP',
    items: [
      { id: 'azafata', view: 'azafata', nombre: 'Azafatas', gancho: 'Congresos, ferias y protocolo' },
      { id: 'event_manager', view: 'event_manager', nombre: 'Encargadas de Eventos', gancho: 'Coordinación y producción' },
      { id: 'promotor', view: 'promotor', nombre: 'Promotor & RRPP', gancho: 'Relaciones públicas y listas' },
      { id: 'speaker', view: 'speaker', nombre: 'Speakers', gancho: 'Presentadores y maestros de ceremonias' },
    ],
  },
  {
    titulo: 'Belleza & Estética',
    items: [
      { id: 'makeup', view: 'makeup', nombre: 'Maquillaje & Peluquería', gancho: 'Novias, eventos y caracterización' },
      { id: 'vestuario', view: 'vestuario', nombre: 'Vestuario & Moda', gancho: 'Estilismo y personal shopper' },
    ],
  },
  {
    titulo: 'Entretenimiento',
    items: [
      { id: 'bailarin', view: 'bailarin', nombre: 'Bailarines & Danza', gancho: 'Shows, coreografías e instructores' },
      { id: 'mago', view: 'mago', nombre: 'Magos & Ilusionistas', gancho: 'Close-up, escenario y mentalismo' },
      { id: 'humorista', view: 'humorista', nombre: 'Humor & Monólogos', gancho: 'Cómicos y stand-up' },
      { id: 'animador', view: 'animador', nombre: 'Payasos & Animadores', gancho: 'Animación infantil y familiar' },
    ],
  },
  {
    titulo: 'Técnica & Producción',
    items: [
      { id: 'tecnico', view: 'tecnico', nombre: 'Técnicos de Sonido y Montaje', gancho: 'Sonido, iluminación y escenario' },
    ],
  },
];

const Tarjeta = ({ item, onNavigate }: { item: { id: string; view: string; nombre: string; gancho: string }; onNavigate?: (v: string) => void }) => (
  <button
    type="button"
    onClick={() => onNavigate?.(item.view)}
    aria-label={`Ver ${item.nombre}`}
    className="group relative w-full overflow-hidden rounded-xl text-left transition-transform duration-200 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0908]"
    style={{ aspectRatio: '3 / 2' }}
  >
    <img
      src={img(item.id)}
      alt=""
      loading="lazy"
      decoding="async"
      width={900}
      height={600}
      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
    />
    {/* Dos capas a propósito: un velo uniforme que baja el contraste de las
        fotos claras (magos, bailarines salían casi blancas) y un degradado
        fuerte abajo. Con una sola capa, un título de dos líneas se salía de la
        zona oscura y quedaba ilegible sobre la imagen. */}
    <div className="absolute inset-0 bg-black/25" />
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 via-45% to-transparent" />
    <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
      <h3 className="text-sm sm:text-base font-semibold leading-tight text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.8)]">{item.nombre}</h3>
      <p className="mt-0.5 text-[11px] sm:text-xs leading-snug text-white/80 line-clamp-2 [text-shadow:0_1px_2px_rgba(0,0,0,0.9)]">{item.gancho}</p>
    </div>
    <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10 transition-colors group-hover:ring-[#D4AF37]/60" />
  </button>
);

const ExplorarView = ({ onNavigate }: Props) => (
  <div className="mx-auto w-full max-w-6xl px-3 py-4 sm:px-4 sm:py-6">
    <header className="mb-5 sm:mb-7">
      <h1 className="text-xl sm:text-2xl font-bold text-white">Explorar XPEAK</h1>
      <p className="mt-1 text-sm text-white/60">
        Todos los profesionales de la plataforma. Toca una categoría para ver quién hay.
      </p>
    </header>

    {/* Una única rejilla continua en vez de una por familia: con grupos de 2
        tarjetas, una rejilla de 4 columnas dejaba media fila vacía y la página
        quedaba llena de huecos. El título de familia ocupa la fila entera y
        hace de separador, así que se sigue leyendo agrupado pero las tarjetas
        aprovechan todo el ancho. */}
    <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 lg:grid-cols-4">
      {GRUPOS.map(grupo => (
        <div key={grupo.titulo} className="contents">
          <h2 className="col-span-full mb-0.5 mt-3 text-xs font-semibold uppercase tracking-wider text-[#D4AF37] first:mt-0">
            {grupo.titulo}
          </h2>
          {grupo.items.map(item => (
            <Tarjeta key={item.id + item.view} item={item} onNavigate={onNavigate} />
          ))}
        </div>
      ))}
    </div>
  </div>
);

export default ExplorarView;
export { GRUPOS as GRUPOS_EXPLORAR };
