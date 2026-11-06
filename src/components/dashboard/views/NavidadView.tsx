import { useQuery } from '@tanstack/react-query';
import DirectoryView, { fetchDirectoryProfiles } from './DirectoryView';
import ProfileCard from '@/components/dashboard/ProfileCard';
import { ALL_REGIONS_LABEL } from '@/lib/regions';
import type { Profile } from '@/data/profiles';
import { Tarjeta } from './ExplorarView';
interface Props { onNavigate?: (view: string) => void; onMessage?: (userId: string, name: string) => void; searchQuery?: string; onViewProfile?: (p: Profile) => void; }
const SECCIONES = [
  { titulo: 'Reyes Magos', tags: ['Rey Mago Melchor', 'Rey Mago Gaspar', 'Baltasar', 'Grupo de Reyes Magos completo', 'Cabalgata'] },
  { titulo: 'Papá Noel y Mamá Noel', tags: ['Papá Noel', 'Mamá Noel'] },
  { titulo: 'Pajes, carteros reales y elfos', tags: ['Paje real', 'Cartero real', 'Elfo'] },
  { titulo: 'Pasacalles', tags: ['Pasacalles'] },
];

// Lo que ya tenemos en XPEAK y sirve para una cena o fiesta de Navidad. Cada
// bloque lleva al directorio de esa categoria (no duplica perfiles).
// Para Navidad solo DJs generalistas (cena de empresa, familias): se excluyen
// los de un solo estilo de cabina (techno, house...). Decision de Daniel, 5 nov.
const GENERALISTA = ['Todo tipo de música', 'Comercial', 'Top 40', 'Hits actuales', 'Remember', 'Pop Rock', 'Pachanga', 'Disco', 'Reggaetón', 'Hip Hop', 'R&B', 'Latin House'];
const soloGeneralistas = (p: Profile) => ((p.badges ?? []) as string[]).some(b => GENERALISTA.includes(b));

const PARA_NAVIDAD: { titulo: string; items: { id: string; view: string; nombre: string; gancho: string; filtro?: (p: Profile) => boolean }[] }[] = [
  { titulo: 'Sonido e iluminación', items: [
    { id: 'alquiler', view: 'alquiler', nombre: 'Alquiler de Equipos', gancho: 'Sonido, luces, pantallas y escenarios' },
    { id: 'tecnico', view: 'tecnico', nombre: 'Técnicos de Sonido', gancho: 'Montaje y sonido en directo' },
    { id: 'disco-movil', view: 'disco-movil', nombre: 'Disco Móvil', gancho: 'Sonido, luces y DJ para tu fiesta' },
    { id: 'design', view: 'design', nombre: 'Diseño & Visuales', gancho: 'VJing, mapping y ambientación' },
  ] },
  { titulo: 'Música para la cena y la fiesta', items: [
    { id: 'dj', view: 'dj', nombre: 'DJs & Artistas', gancho: 'DJs, productores y música en vivo', filtro: soloGeneralistas },
    { id: 'grupo-musical', view: 'grupo-musical', nombre: 'Grupos Musicales', gancho: 'Bandas, orquestas y versiones' },
  ] },
  { titulo: 'Cena, cóctel y barra', items: [
    { id: 'catering', view: 'catering', nombre: 'Catering & Chef', gancho: 'Cocina, barra y showcooking' },
    { id: 'staff', view: 'staff', nombre: 'Sala & Barra', gancho: 'Camareros, bartenders y personal de sala' },
    { id: 'food-truck', view: 'food-truck', nombre: 'Food Trucks', gancho: 'Cocina sobre ruedas para tu evento' },
  ] },
  { titulo: 'Animación y espectáculo', items: [
    { id: 'mago', view: 'mago', nombre: 'Magos & Ilusionismo', gancho: 'Magia de cerca y espectáculo' },
    { id: 'humorista', view: 'humorista', nombre: 'Humoristas & Monólogos', gancho: 'Humor para tu cena de empresa' },
    { id: 'animador', view: 'animador', nombre: 'Payasos & Animadores', gancho: 'Animación infantil y familiar' },
    { id: 'bailarin', view: 'bailarin', nombre: 'Bailarines & Danza', gancho: 'Shows y clases en directo' },
  ] },
  { titulo: 'Recuerdo y recepción', items: [
    { id: 'photo-booth', view: 'photo-booth', nombre: 'Photo Booth', gancho: 'Fotomatón para tus invitados' },
    { id: 'media', view: 'media', nombre: 'Media & Contenido', gancho: 'Fotografía, vídeo y creadores' },
    { id: 'azafata', view: 'azafata', nombre: 'Azafatas', gancho: 'Recepción, protocolo y acreditaciones' },
    { id: 'speaker', view: 'speaker', nombre: 'Speakers & Presentadores', gancho: 'Presentadores para tu evento' },
  ] },
  { titulo: 'Espacio y después del evento', items: [
    { id: 'local_eventos', view: 'local_eventos', nombre: 'Locales para eventos', gancho: 'Discotecas, salas, terrazas y fincas' },
    { id: 'limpieza', view: 'limpieza', nombre: 'Servicio de Limpieza', gancho: 'Antes, durante y después del evento' },
  ] },
];

// Perfiles reales del rol, en esta misma pagina aunque tambien salgan en su
// propio directorio (duplicado a proposito, decision de Daniel 5 nov).
const PerfilesDeRol = ({ item, onNavigate, onMessage, onViewProfile }: { item: { id: string; view: string; nombre: string; filtro?: (p: Profile) => boolean }; onNavigate?: (v: string) => void; onMessage?: (userId: string, name: string) => void; onViewProfile?: (p: Profile) => void }) => {
  const { data = [] } = useQuery({
    queryKey: ['directory-profiles', item.id, undefined, ALL_REGIONS_LABEL, undefined],
    queryFn: () => fetchDirectoryProfiles(item.id, undefined, ALL_REGIONS_LABEL, undefined),
    staleTime: 60_000,
  });
  const lista = item.filtro ? data.filter(item.filtro) : data;
  if (lista.length === 0) return null;
  return (
    <div className="mt-3">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-xs font-semibold" style={{ color: '#0a0908' }}>{item.nombre}</h4>
        <button type="button" className="text-xs underline" style={{ color: 'var(--gold-on-light, #7a6216)' }} onClick={() => onNavigate?.(item.view)}>Ver todos</button>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
        {lista.slice(0, 4).map(p => (
          <ProfileCard key={p.id} profile={p} onMessage={onMessage} onNavigateSubscription={() => onNavigate?.('subscription')} onViewProfile={onViewProfile} />
        ))}
      </div>
    </div>
  );
};

const NavidadView = ({ onNavigate, onMessage, searchQuery, onViewProfile }: Props) => (
  <>
    <DirectoryView role="navidad" title="Especial Navidad" subtitle="Reyes Magos, Baltasar, Papá Noel, pajes y personajes navideños para cenas de empresa, centros comerciales y fiestas." secciones={SECCIONES} otrosTitulo="Otros personajes navideños" wideCards onNavigate={onNavigate} onMessage={onMessage} searchQuery={searchQuery} onViewProfile={onViewProfile} />
    <div className="mx-auto w-full max-w-6xl px-3 pb-10 sm:px-4">
      <h2 className="mb-1 mt-8 text-base font-semibold" style={{ color: '#0a0908' }}>Todo para tu evento de Navidad</h2>
      <p className="mb-4 text-xs" style={{ color: 'rgba(10,9,8,0.6)' }}>Además de los personajes, estos profesionales de XPEAK cubren una cena de empresa o una fiesta navideña.</p>
      {PARA_NAVIDAD.map(g => (
        <div key={g.titulo} className="mb-6">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--gold-on-light, #7a6216)' }}>{g.titulo}</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {g.items.map(item => <Tarjeta key={item.id} item={item} onNavigate={onNavigate} />)}
          </div>
          {g.items.map(item => (
            <PerfilesDeRol key={item.id} item={item} onNavigate={onNavigate} onMessage={onMessage} onViewProfile={onViewProfile} />
          ))}
        </div>
      ))}
    </div>
  </>
);
export default NavidadView;
