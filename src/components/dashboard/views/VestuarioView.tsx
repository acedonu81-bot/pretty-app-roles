import DirectoryView from './DirectoryView';

const VestuarioView = ({ onNavigate }: { onNavigate?: (view: string) => void }) => (
  <DirectoryView role="vestuario" title="Vestuario & Moda" subtitle="Estilismo, diseño custom y asesoría de imagen nocturna en Madrid." onNavigate={onNavigate} />
);

export default VestuarioView;
