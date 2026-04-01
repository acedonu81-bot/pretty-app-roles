import DirectoryView from './DirectoryView';

const MediaView = ({ onNavigate }: { onNavigate?: (view: string) => void }) => (
  <DirectoryView role="media" title="Media & Contenido" subtitle="Fotógrafos, videógrafos y creadores de contenido para eventos nocturnos en Europa." onNavigate={onNavigate} wideCards />
);

export default MediaView;
