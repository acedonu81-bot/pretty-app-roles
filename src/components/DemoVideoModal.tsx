import { X } from 'lucide-react';

interface DemoVideoModalProps {
  open: boolean;
  onClose: () => void;
}

const DemoVideoModal = ({ open, onClose }: DemoVideoModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div className="relative w-full max-w-3xl glass-panel p-6 animate-[fadeIn_0.3s_ease]" onClick={e => e.stopPropagation()}>
        <button onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
          style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}>
          <X size={18} />
        </button>
        <h3 className="text-xl font-extrabold mb-2">
          Mira cómo <span className="text-gradient">NIGHTLIFE</span> conecta Madrid
        </h3>
        <p className="text-sm text-muted-foreground mb-4">Descubre cómo funciona el directorio profesional del ocio nocturno.</p>
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--nightlife-border)' }}>
          <video controls className="w-full aspect-video bg-black" poster="">
            <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  );
};

export default DemoVideoModal;
