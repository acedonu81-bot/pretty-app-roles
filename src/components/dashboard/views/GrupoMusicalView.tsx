import DirectoryView from './DirectoryView';
import type { Profile } from '@/data/profiles';

interface Props { onNavigate?: (view: string) => void; onMessage?: (userId: string, name: string) => void; searchQuery?: string; onViewProfile?: (p: Profile) => void; }
const GrupoMusicalView = ({ onNavigate, onMessage, searchQuery, onViewProfile }: Props) => (
  <DirectoryView role="grupo-musical" title="Grupos Musicales" subtitle="Bandas y grupos musicales en directo para bodas y eventos en España." onNavigate={onNavigate} onMessage={onMessage} wideCards searchQuery={searchQuery} onViewProfile={onViewProfile} />
);

export default GrupoMusicalView;
