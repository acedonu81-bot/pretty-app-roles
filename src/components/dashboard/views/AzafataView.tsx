import DirectoryView from './DirectoryView';
import type { Profile } from '@/data/profiles';

interface Props { onNavigate?: (view: string) => void; onMessage?: (userId: string, name: string) => void; searchQuery?: string; onViewProfile?: (p: Profile) => void; }
const AzafataView = ({ onNavigate, onMessage, searchQuery, onViewProfile }: Props) => (
  <DirectoryView role="azafata" title="Azafatas" subtitle="Azafatas de imagen y atención al público en toda España." onNavigate={onNavigate} onMessage={onMessage} searchQuery={searchQuery} onViewProfile={onViewProfile} />
);

export default AzafataView;
