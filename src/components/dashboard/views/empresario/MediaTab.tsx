import { Image, Upload } from 'lucide-react';
import { toast } from 'sonner';

const MediaTab = () => {
  return (
    <div>
      <div className="glass-panel p-4 mb-4 flex items-center justify-between flex-wrap gap-3"
        style={{ border: '1px solid rgba(212,175,55,0.15)' }}>
        <div>
          <h4 className="text-sm font-bold flex items-center gap-2">
            <Image size={14} style={{ color: '#D4AF37' }} /> Media y Contenido
          </h4>
          <p className="text-xs text-muted-foreground">Portfolio, vídeos y fotos de los profesionales disponibles.</p>
        </div>
        <button
          onClick={() => toast.info('Subida de media de sala próximamente.')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all hover:scale-105"
          style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
          <Upload size={13} /> Subir media de mi sala
        </button>
      </div>

      <div className="glass-panel p-12 flex flex-col items-center justify-center gap-3 text-center"
        style={{ border: '1px dashed rgba(212,175,55,0.15)' }}>
        <Image size={32} style={{ color: 'rgba(212,175,55,0.25)' }} />
        <p className="text-sm font-bold text-muted-foreground">Sin contenido todavía</p>
        <p className="text-xs text-muted-foreground max-w-xs">
          Los profesionales podrán subir su portfolio aquí. Próximamente disponible.
        </p>
      </div>
    </div>
  );
};

export default MediaTab;
