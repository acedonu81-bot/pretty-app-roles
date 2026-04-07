import DirectoryView from './DirectoryView';

interface Props { onNavigate?: (view: string) => void; onMessage?: (userId: string, name: string) => void; }
const DJView = ({ onNavigate, onMessage }: Props) => (
  <DirectoryView role="dj" title="Artistas Musicales" subtitle="DJs, productores, artistas en vivo, VJs y técnicos de sonido para cualquier evento en España." onNavigate={onNavigate} onMessage={onMessage} />
);

export default DJView;
