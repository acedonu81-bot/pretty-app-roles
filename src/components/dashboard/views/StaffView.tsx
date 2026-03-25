import DirectoryView from './DirectoryView';

const StaffView = ({ onNavigate }: { onNavigate?: (view: string) => void }) => (
  <DirectoryView role="staff" title="Personal de Sala" subtitle="Azafatas, camareros VIP y RRPP disponibles en Madrid." onNavigate={onNavigate} />
);

export default StaffView;
