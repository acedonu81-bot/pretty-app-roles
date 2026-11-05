import DirectoryView from './DirectoryView';
import type { Profile } from '@/data/profiles';
interface Props { onNavigate?: (view: string) => void; onMessage?: (userId: string, name: string) => void; searchQuery?: string; onViewProfile?: (p: Profile) => void; }
const SECCIONES = [
  { titulo: 'Reyes Magos', tags: ['Rey Mago Melchor', 'Rey Mago Gaspar', 'Grupo de Reyes Magos completo', 'Cabalgata'] },
  { titulo: 'Baltasar', tags: ['Baltasar'] },
  { titulo: 'Papá Noel y Mamá Noel', tags: ['Papá Noel', 'Mamá Noel'] },
  { titulo: 'Pajes, carteros reales y elfos', tags: ['Paje real', 'Cartero real', 'Elfo'] },
];

const NavidadView = ({ onNavigate, onMessage, searchQuery, onViewProfile }: Props) => (
  <DirectoryView role="navidad" title="Especial Navidad" subtitle="Reyes Magos, Baltasar, Papá Noel, pajes y personajes navideños para cenas de empresa, centros comerciales y fiestas." onNavigate={onNavigate} onMessage={onMessage} secciones={SECCIONES} otrosTitulo="Otros personajes navideños" wideCards searchQuery={searchQuery} onViewProfile={onViewProfile} />
);
export default NavidadView;
