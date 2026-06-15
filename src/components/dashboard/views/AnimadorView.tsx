import DirectoryView from './DirectoryView';
import type { Profile } from '@/data/profiles';

interface Props {
  onNavigate?: (v: string) => void;
  onMessage?: (userId: string, name: string) => void;
  searchQuery?: string;
  onViewProfile?: (p: Profile) => void;
}

export default function AnimadorView({ onNavigate, onMessage, searchQuery, onViewProfile }: Props) {
  return (
    <DirectoryView
      role="animador"
      title="Payasos & Animadores"
      subtitle="Animadores, payasos y artistas de calle para cumpleaños, bodas, eventos corporativos y festivales en toda España."
      onNavigate={onNavigate}
      onMessage={onMessage}
      searchQuery={searchQuery}
      onViewProfile={onViewProfile}
    />
  );
}
