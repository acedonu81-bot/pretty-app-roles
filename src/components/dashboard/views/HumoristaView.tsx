import DirectoryView from './DirectoryView';
import type { Profile } from '@/data/profiles';

interface Props { onNavigate?: (view: string) => void; onMessage?: (userId: string, name: string) => void; searchQuery?: string; onViewProfile?: (p: Profile) => void; }
const HumoristaView = ({ onNavigate, onMessage, searchQuery, onViewProfile }: Props) => (
  <DirectoryView
    role="humorista"
    roles={['humorista', 'monologo']}
    title="Humor & Stand-Up"
    subtitle="Humoristas, monologuistas y cómicos de stand-up para cenas de empresa, bodas y eventos. Guión personalizado incluido."
    onNavigate={onNavigate}
    onMessage={onMessage}
    searchQuery={searchQuery}
    onViewProfile={onViewProfile}
  />
);

export default HumoristaView;
