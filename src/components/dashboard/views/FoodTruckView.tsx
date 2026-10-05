import DirectoryView from './DirectoryView';
import type { Profile } from '@/data/profiles';

interface Props { onNavigate?: (view: string) => void; onMessage?: (userId: string, name: string) => void; searchQuery?: string; onViewProfile?: (p: Profile) => void; }
const FoodTruckView = ({ onNavigate, onMessage, searchQuery, onViewProfile }: Props) => (
  <DirectoryView role="food-truck" title="Food Trucks" subtitle="Food trucks y cocina sobre ruedas para bodas, festivales, eventos de empresa y fiestas privadas en España." onNavigate={onNavigate} onMessage={onMessage} wideCards searchQuery={searchQuery} onViewProfile={onViewProfile} />
);

export default FoodTruckView;
