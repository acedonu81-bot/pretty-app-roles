import DirectoryView from './DirectoryView';

const MakeupView = ({ onNavigate }: { onNavigate?: (view: string) => void }) => (
  <DirectoryView role="makeup" title="Maquillaje & Peluquería" subtitle="Maquillaje nocturno y peluquería de autor para eventos en Europa." onNavigate={onNavigate} wideCards />
);

export default MakeupView;
