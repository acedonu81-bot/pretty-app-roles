import { X } from 'lucide-react';

interface DemoVideoModalProps {
  open: boolean;
  onClose: () => void;
}

const DemoVideoModal = ({ open, onClose }: DemoVideoModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />
      <div className="relative w-full max-w-2xl glass-panel p-5 animate-[fadeIn_0.3s_ease]" onClick={e => e.stopPropagation()}>
        <button onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 rounded flex items-center justify-center transition-all hover:scale-110"
          style={{ background: 'rgba(255,255,255,0.08)', color: 'white' }}>
          <X size={16} />
        </button>
        <h3 className="text-base font-bold mb-1">
          Mira cómo <span className="text-gradient">XPEAK</span> conecta Europa
        </h3>
        <p className="text-xs text-muted-foreground mb-3">Descubre el directorio profesional del ocio nocturno.</p>
        <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--nightlife-border)' }}>
          <video controls autoPlay muted playsInline className="w-full aspect-video bg-black">
            <source src="https://videos.pexels.com/video-files/3129957/3129957-uhd_2560_1440_25fps.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  );
};

export default DemoVideoModal;
