import DirectoryView from './DirectoryView';

interface Props { onNavigate?: (view: string) => void; onMessage?: (userId: string, name: string) => void; }
const MediaView = ({ onNavigate, onMessage }: Props) => (
  <DirectoryView role="media" title="Media & Contenido" subtitle="Fotógrafos, videógrafos y creadores de contenido para eventos nocturnos en Europa." onNavigate={onNavigate} onMessage={onMessage} wideCards />
);

export default MediaView;
