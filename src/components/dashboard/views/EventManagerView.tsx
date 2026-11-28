import DirectoryView from './DirectoryView';
import type { Profile } from '@/data/profiles';

interface Props { onNavigate?: (view: string) => void; onMessage?: (userId: string, name: string) => void; searchQuery?: string; onViewProfile?: (p: Profile) => void; }
const EventManagerView = ({ onNavigate, onMessage, searchQuery, onViewProfile }: Props) => (
  <DirectoryView role="event_manager" title="Coordinación de eventos" subtitle="Coordinación de eventos, producción y logística en toda España." onNavigate={onNavigate} onMessage={onMessage} searchQuery={searchQuery} onViewProfile={onViewProfile} />
);

export default EventManagerView;
