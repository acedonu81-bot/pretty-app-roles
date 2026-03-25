import DirectoryView from './DirectoryView';

const DJView = ({ onNavigate }: { onNavigate?: (view: string) => void }) => (
  <DirectoryView role="dj" title="DJs" subtitle="Encuentra tu DJ ideal para cualquier tipo de evento nocturno en Madrid." onNavigate={onNavigate} />
);

export default DJView;
