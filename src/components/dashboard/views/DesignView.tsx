import DirectoryView from './DirectoryView';

const DesignView = ({ onNavigate }: { onNavigate?: (view: string) => void }) => (
  <DirectoryView role="design" title="Diseño & Visuales" subtitle="Diseñadores gráficos, VJs y motion graphics para salas y eventos en Madrid." onNavigate={onNavigate} wideCards />
);

export default DesignView;
