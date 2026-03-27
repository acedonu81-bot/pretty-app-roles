import DirectoryView from './DirectoryView';

const MakeupView = ({ onNavigate }: { onNavigate?: (view: string) => void }) => (
  <DirectoryView role="makeup" title="Maquillaje & Peluquería" subtitle="Maquillaje nocturno y peluquería de autor en Madrid." onNavigate={onNavigate} wideCards />
);

export default MakeupView;
