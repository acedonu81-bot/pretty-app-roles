import DirectoryView from './DirectoryView';
import type { Profile } from '@/data/profiles';

interface Props { onNavigate?: (view: string) => void; onMessage?: (userId: string, name: string) => void; searchQuery?: string; onViewProfile?: (p: Profile) => void; }
const MakeupView = ({ onNavigate, onMessage, searchQuery, onViewProfile }: Props) => (
  <DirectoryView role="makeup" title="Maquillaje" subtitle="Maquillaje nocturno y de novia para eventos en Europa." onNavigate={onNavigate} onMessage={onMessage} wideCards searchQuery={searchQuery} onViewProfile={onViewProfile} />
);

export default MakeupView;
