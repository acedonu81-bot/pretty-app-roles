import DirectoryView from './DirectoryView';
import type { Profile } from '@/data/profiles';

interface Props { onNavigate?: (view: string) => void; onMessage?: (userId: string, name: string) => void; searchQuery?: string; onViewProfile?: (p: Profile) => void; }
const TecnicoView = ({ onNavigate, onMessage, searchQuery, onViewProfile }: Props) => (
  <DirectoryView role="tecnico" title="Técnicos de Sonido y Montaje" subtitle="Sonido, iluminación y montaje de escenario en toda España." onNavigate={onNavigate} onMessage={onMessage} searchQuery={searchQuery} onViewProfile={onViewProfile} />
);

export default TecnicoView;
