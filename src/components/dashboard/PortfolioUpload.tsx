import { useState, useRef, useEffect } from 'react';
import { Upload, Image, X, Plus, Video } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { toast } from 'sonner';

const MAX_VIDEO_SECONDS = 60;
const MAX_IMAGE_MB      = 15;
const MAX_VIDEO_MB      = 50;
const MAX_ITEMS_PRO = 12;

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
  const [rightsConfirmed, setRightsConfirmed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const profile = useProfile();
  const maxItems = MAX_ITEMS_PRO;

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

    if (items.length >= maxItems) {
      toast.error(`Máximo ${maxItems} elementos en tu plan.`);
      return;
    }

    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    if (!isVideo && !isImage) {
      toast.error('Solo imágenes (JPG, PNG, WEBP) o vídeos cortos (MP4, MOV)');
      return;
    }

    const limitMB = isVideo ? MAX_VIDEO_MB : MAX_IMAGE_MB;
    if (file.size > limitMB * 1024 * 1024) {
      toast.error(`Máximo ${limitMB}MB por ${isVideo ? 'vídeo' : 'imagen'}`);
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
    const newItem = { name: file.name, url: urlData.publicUrl, storagePath: path, isVideo };
    const next = [...items, newItem];
    setItems(next);
    // Sync public URLs to portfolio_urls column (images only — videos not suited for portfolio grid)
    const imageUrls = next.filter(i => !i.isVideo).map(i => i.url);
    supabase.from('profiles').update({ portfolio_urls: imageUrls } as any).eq('user_id', user.id).then(() => {});
    toast.success('Portfolio actualizado.');
    setUploading(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  const remove = async (item: PortfolioItem) => {
    await supabase.storage.from('audio-sessions').remove([item.storagePath]);
    const next = items.filter(i => i.storagePath !== item.storagePath);
    setItems(next);
    const imageUrls = next.filter(i => !i.isVideo).map(i => i.url);
    supabase.from('profiles').update({ portfolio_urls: imageUrls } as any).eq('user_id', user.id).then(() => {});
    toast.info('Elemento eliminado.');
  };

  return (
    <div className="glass-panel p-4">
      <h4 className="text-sm font-bold mb-1 flex items-center gap-2">
        <Image size={16} style={{ color: '#D4AF37' }} /> Portfolio
        <span className="text-xs text-muted-foreground ml-auto">{items.length}/{maxItems}</span>
      </h4>
      <p className="text-xs text-muted-foreground mb-3">
        Fotos hasta {MAX_IMAGE_MB}MB · Vídeos hasta {MAX_VIDEO_SECONDS}s / {MAX_VIDEO_MB}MB · hasta {MAX_ITEMS_PRO} elementos
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

      {items.length < maxItems && (
        <label className="flex items-start gap-2 mb-3 cursor-pointer">
          <input
            type="checkbox"
            checked={rightsConfirmed}
            onChange={e => setRightsConfirmed(e.target.checked)}
            className="mt-0.5 flex-shrink-0 accent-[#D4AF37]"
          />
          <span className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Declaro que soy titular o tengo autorización para publicar este contenido, conforme a los{' '}
            <a href="/terminos" target="_blank" rel="noopener noreferrer" style={{ color: '#D4AF37' }}>Términos y Condiciones</a>.
          </span>
        </label>
      )}

      {items.length < maxItems && (
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading || !rightsConfirmed}
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
