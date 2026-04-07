import DirectoryView from './DirectoryView';

interface Props { onNavigate?: (view: string) => void; onMessage?: (userId: string, name: string) => void; }
const MakeupView = ({ onNavigate, onMessage }: Props) => (
  <DirectoryView role="makeup" title="Maquillaje & Peluquería" subtitle="Maquillaje nocturno y peluquería de autor para eventos en Europa." onNavigate={onNavigate} onMessage={onMessage} wideCards />
);

export default MakeupView;
