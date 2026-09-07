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
    className="group relative w-full overflow-hidden rounded-2xl text-left transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2"
    style={{
      aspectRatio: '3 / 2',
      background: '#ffffff',
      border: '1px solid rgba(0,0,0,0.08)',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    }}
    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.12)'; }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'; }}
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
    {/* El bloque de texto lleva SU PROPIO fondo degradado en vez de una franja
        de altura fija: un título de dos líneas crecía por encima de la franja y
        quedaba ilegible sobre la foto (pasaba en "DJs & Artistas", "Sala &
        Barra", "Técnicos de Sonido"). Al ir el degradado en el mismo elemento
        que el texto, la zona oscura crece con él y siempre lo cubre. */}
    <div
      className="absolute inset-x-0 bottom-0 p-3 pt-8 sm:p-4 sm:pt-10"
      style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0.45) 75%, transparent 100%)' }}
    >
      <h3 className="text-sm sm:text-base font-semibold leading-tight text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.9)]">{item.nombre}</h3>
      <p className="mt-0.5 text-[11px] sm:text-xs leading-snug text-white/85 line-clamp-2 [text-shadow:0_1px_2px_rgba(0,0,0,0.95)]">{item.gancho}</p>
    </div>
    <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5 transition-colors group-hover:ring-[#D4AF37]/70" />
  </button>
);

const ExplorarView = ({ onNavigate }: Props) => (
  <div className="mx-auto w-full max-w-6xl px-3 py-4 sm:px-4 sm:py-6">
    <header className="mb-5 sm:mb-7">
      <h1 className="text-xl sm:text-2xl font-bold" style={{ color: '#0a0908' }}>Explorar XPEAK</h1>
      <p className="mt-1 text-sm" style={{ color: 'rgba(10,9,8,0.6)' }}>
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
          {/* --gold-on-light, no el #D4AF37 de marca: el dorado de marca sobre
              blanco no llega al contraste AA para texto pequeño. */}
          <h2 className="col-span-full mb-0.5 mt-3 text-xs font-semibold uppercase tracking-wider first:mt-0" style={{ color: 'var(--gold-on-light, #7a6216)' }}>
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
