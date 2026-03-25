import DirectoryView from './DirectoryView';

const AmbassadorView = ({ onNavigate }: { onNavigate?: (view: string) => void }) => (
  <DirectoryView role="ambassador" title="Promoción" subtitle="Brand Ambassadors y promotores para acciones de guerrilla, flyering y captación in-situ." onNavigate={onNavigate} />
);

export default AmbassadorView;
