import DirectoryView from './DirectoryView';
import type { Profile } from '@/data/profiles';

interface Props { onNavigate?: (view: string) => void; onMessage?: (userId: string, name: string) => void; searchQuery?: string; onViewProfile?: (p: Profile) => void; }
const PeluqueriaView = ({ onNavigate, onMessage, searchQuery, onViewProfile }: Props) => (
  <DirectoryView role="peluqueria" title="Peluquería a Domicilio" subtitle="Peluqueras y peluqueros a domicilio para tu evento o para el día a día." onNavigate={onNavigate} onMessage={onMessage} wideCards searchQuery={searchQuery} onViewProfile={onViewProfile} />
);

export default PeluqueriaView;
