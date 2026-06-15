import DirectoryView from './DirectoryView';
import type { Profile } from '@/data/profiles';

interface Props {
  onNavigate?: (v: string) => void;
  onMessage?: (userId: string, name: string) => void;
  searchQuery?: string;
  onViewProfile?: (p: Profile) => void;
}

export default function MonologoView({ onNavigate, onMessage, searchQuery, onViewProfile }: Props) {
  return (
    <DirectoryView
      role="monologo"
      title="Monólogos & Stand-Up"
      subtitle="Monologuistas y cómicos de stand-up para cenas de empresa, bodas y eventos. Guión personalizado incluido."
      onNavigate={onNavigate}
      onMessage={onMessage}
      searchQuery={searchQuery}
      onViewProfile={onViewProfile}
    />
  );
}
