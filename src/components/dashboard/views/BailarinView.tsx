import DirectoryView from './DirectoryView';
import type { Profile } from '@/data/profiles';

interface Props { onNavigate?: (view: string) => void; onMessage?: (userId: string, name: string) => void; searchQuery?: string; onViewProfile?: (p: Profile) => void; }
const BailarinView = ({ onNavigate, onMessage, searchQuery, onViewProfile }: Props) => (
  <DirectoryView role="bailarin" title="Bailarin" subtitle="Bailarines y compañías de danza para todo tipo de eventos" onNavigate={onNavigate} onMessage={onMessage} searchQuery={searchQuery} onViewProfile={onViewProfile} />
);

export default BailarinView;
