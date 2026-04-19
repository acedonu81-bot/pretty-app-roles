import { useState, useRef, useEffect } from 'react';
import { Upload, Image, X, Plus, Video } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const MAX_VIDEO_SECONDS = 30;
const MAX_FILE_MB = 50;
const MAX_ITEMS_FREE = 6;

interface PortfolioItem {
  name: string;
  url: string;
  storagePath: string;
  isVideo: boolean;
}

const sanitize = (name: string) =>
  name
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');

const checkVideoDuration = (file: File): Promise<number> =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(video.duration);
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('No se pudo leer el vídeo'));
    };
    video.src = url;
  });

const PortfolioUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const { data: files } = await supabase.storage
        .from('audio-sessions')
        .list(user.id + '/portfolio');
      if (files && files.length > 0) {
        const loaded = files.map(f => {
          const path = `${user.id}/portfolio/${f.name}`;
          const { data } = supabase.storage.from('audio-sessions').getPublicUrl(path);
          const isVideo = /\.(mp4|mov|webm)$/i.test(f.name);
          return { name: f.name.replace(/^\d+-/, ''), url: data.publicUrl, storagePath: path, isVideo };
        });
        setItems(loaded);
      }
    };
    load();
  }, [user]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (items.length >= MAX_ITEMS_FREE) {
      toast.error(`Máximo ${MAX_ITEMS_FREE} elementos en el portfolio.`);
      return;
    }

    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      toast.error(`Máximo ${MAX_FILE_MB}MB por archivo`);
      return;
    }

    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    if (!isVideo && !isImage) {
      toast.error('Solo imágenes (JPG, PNG, WEBP) o vídeos cortos (MP4, MOV)');
      return;
    }

    if (isVideo) {
      try {
        const duration = await checkVideoDuration(file);
        if (duration > MAX_VIDEO_SECONDS) {
          toast.error(`El vídeo no puede superar los ${MAX_VIDEO_SECONDS} segundos (duración: ${Math.round(duration)}s)`);
          return;
        }
      } catch {
        toast.error('No se pudo verificar la duración del vídeo');
        return;
      }
    }

    setUploading(true);
    const safeName = sanitize(file.name) || 'portfolio-item';
    const path = `${user.id}/portfolio/${Date.now()}-${safeName}`;
    const { error } = await supabase.storage.from('audio-sessions').upload(path, file);
    if (error) {
      toast.error('Error al subir: ' + error.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from('audio-sessions').getPublicUrl(path);
    setItems(prev => [...prev, { name: file.name, url: urlData.publicUrl, storagePath: path, isVideo }]);
    toast.success('Portfolio actualizado.');
    setUploading(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  const remove = async (item: PortfolioItem) => {
    await supabase.storage.from('audio-sessions').remove([item.storagePath]);
    setItems(prev => prev.filter(i => i.storagePath !== item.storagePath));
    toast.info('Elemento eliminado.');
  };

  return (
    <div className="glass-panel p-4">
      <h4 className="text-sm font-bold mb-1 flex items-center gap-2">
        <Image size={16} style={{ color: '#D4AF37' }} /> Portfolio
        <span className="text-xs text-muted-foreground ml-auto">{items.length}/{MAX_ITEMS_FREE}</span>
      </h4>
      <p className="text-xs text-muted-foreground mb-3">
        Fotos (JPG/PNG) o vídeos cortos hasta {MAX_VIDEO_SECONDS}s · máx {MAX_FILE_MB}MB
      </p>

      {items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
          {items.map((item, i) => (
            <div key={i} className="relative aspect-square rounded-lg overflow-hidden group" style={{ background: 'rgba(0,0,0,0.4)' }}>
              {item.isVideo ? (
                <video
                  src={item.url}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                  onMouseEnter={e => (e.target as HTMLVideoElement).play()}
                  onMouseLeave={e => { const v = e.target as HTMLVideoElement; v.pause(); v.currentTime = 0; }}
                />
              ) : (
                <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
              )}
              {item.isVideo && (
                <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[0.7rem] font-bold flex items-center gap-0.5"
                  style={{ background: 'rgba(0,0,0,0.7)', color: '#D4AF37' }}>
                  <Video size={8} /> VÍD
                </div>
              )}
              <button
                onClick={() => remove(item)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: 'rgba(0,0,0,0.7)' }}>
                <X size={10} className="text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {items.length < MAX_ITEMS_FREE && (
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-lg border-2 border-dashed transition-all hover:scale-[1.01]"
          style={{ borderColor: 'rgba(212,175,55,0.2)', color: '#D4AF37', background: 'rgba(212,175,55,0.03)' }}>
          {items.length > 0 ? <Plus size={18} /> : <Upload size={18} />}
          <span className="text-sm font-bold">
            {uploading ? 'Subiendo...' : items.length > 0 ? 'Añadir foto o vídeo' : 'Subir portfolio'}
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm"
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  );
};

export default PortfolioUpload;
