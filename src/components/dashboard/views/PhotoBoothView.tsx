import DirectoryView from './DirectoryView';
import type { Profile } from '@/data/profiles';

interface Props { onNavigate?: (view: string) => void; onMessage?: (userId: string, name: string) => void; searchQuery?: string; onViewProfile?: (p: Profile) => void; }
const PhotoBoothView = ({ onNavigate, onMessage, searchQuery, onViewProfile }: Props) => (
  <DirectoryView role="photo-booth" title="Photo Booth" subtitle="Cabinas de fotos y experiencias fotográficas para eventos en España." onNavigate={onNavigate} onMessage={onMessage} wideCards searchQuery={searchQuery} onViewProfile={onViewProfile} />
);

export default PhotoBoothView;
