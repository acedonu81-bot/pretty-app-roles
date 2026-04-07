import DirectoryView from './DirectoryView';

interface Props { onNavigate?: (view: string) => void; onMessage?: (userId: string, name: string) => void; }
const StaffView = ({ onNavigate, onMessage }: Props) => (
  <DirectoryView role="staff" title="Staff & Promoción" subtitle="Azafatas, RRPP, promotores y personal de sala en toda España." onNavigate={onNavigate} onMessage={onMessage} />
);

export default StaffView;
