import DirectoryView from './DirectoryView';

interface Props { onNavigate?: (view: string) => void; onMessage?: (userId: string, name: string) => void; }
const AmbassadorView = ({ onNavigate, onMessage }: Props) => (
  <DirectoryView role="ambassador" title="Promoción" subtitle="Brand Ambassadors y promotores para acciones de guerrilla, flyering y captación in-situ." onNavigate={onNavigate} onMessage={onMessage} />
);

export default AmbassadorView;
