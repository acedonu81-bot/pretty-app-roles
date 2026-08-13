import { useState, useRef, useEffect } from 'react';
import { Upload, Image, X, Plus, Video } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { compressImage } from '@/lib/image';
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

/* Mensaje del CTA de portfolio vac\u00edo, por oficio \u2014 el equivalente a "escuchar antes de contratar" */
const EMPTY_CTA: Record<string, { title: string; body: string }> = {
  media:        { title: 'Sube tus mejores fotos \u2014 tu portfolio decide la contrataci\u00f3n', body: 'Los organizadores eligen fot\u00f3grafo mirando su trabajo, no leyendo su bio. Sube 3-4 fotos de eventos reales y un v\u00eddeo corto si tienes.' },
  makeup:       { title: 'Sube tus trabajos: el antes y despu\u00e9s vende solo', body: 'Novias y artistas eligen maquilladora por lo que ven. Sube tus mejores looks \u2014 los perfiles con portfolio reciben m\u00e1s contactos y posicionan mejor en el directorio.' },
  staff:        { title: 'Una buena foto profesional genera confianza', body: 'Los empresarios contratan staff que pueden ver: foto profesional + una imagen tuya trabajando en un evento marcan la diferencia frente a un perfil vac\u00edo.' },
  promotor:     { title: 'Ense\u00f1a tus eventos y tus salas', body: 'Fotos de tus fiestas, colas en la puerta, ambiente dentro: es la prueba de que mueves gente. Los perfiles con portfolio posicionan mejor en el directorio.' },
  catering:     { title: 'Tus platos son tu mejor carta de presentaci\u00f3n', body: 'Sube fotos de tus montajes, platos y barras. Quien organiza un evento elige catering con los ojos \u2014 un perfil sin fotos no compite.' },
  mago:         { title: 'Un clip de tu show vende m\u00e1s que mil palabras', body: 'La magia se contrata vi\u00e9ndola: sube un v\u00eddeo corto de una actuaci\u00f3n real (vale grabado con m\u00f3vil). Los perfiles con v\u00eddeo reciben m\u00e1s contactos.' },
  humorista:    { title: 'Sube un clip de tu mon\u00f3logo', body: 'Que se r\u00edan antes de contratarte: 30-60 segundos de una actuaci\u00f3n real es tu mejor argumento de venta. Los perfiles con v\u00eddeo posicionan mejor.' },
  animador:     { title: 'Fotos de tus fiestas: los padres quieren ver tu trabajo', body: 'Sube fotos de animaciones reales (respetando la privacidad de los menores). Un perfil con fotos transmite la confianza que una familia necesita para contratar.' },
  bailarin:     { title: 'El movimiento no se explica: sube un v\u00eddeo bailando', body: '30-60 segundos de un show o ensayo real. Quien busca espect\u00e1culo de baile decide en los primeros segundos de v\u00eddeo.' },
  speaker:      { title: 'Sube un clip presentando: tu voz es tu portfolio', body: 'Un fragmento de una gala, boda o congreso real muestra tu presencia esc\u00e9nica mejor que cualquier descripci\u00f3n. Los perfiles con v\u00eddeo reciben m\u00e1s contactos.' },
  vestuario:    { title: 'Sube tu book: looks y styling de trabajos reales', body: 'Novias, artistas y producciones eligen estilista por su ojo. Tu book es la prueba \u2014 los perfiles con portfolio posicionan mejor en el directorio.' },
  'photo-booth': { title: 'Ense\u00f1a tus cabinas en acci\u00f3n', body: 'Fotos de tus photo booth montados en eventos reales, props y ejemplos de impresi\u00f3n. Quien alquila quiere ver exactamente lo que llega a su evento.' },
};
const EMPTY_CTA_DEFAULT = { title: 'Sube tu portfolio \u2014 es tu mejor tarjeta de presentaci\u00f3n', body: 'Los organizadores miran antes de contactar: los perfiles con fotos o v\u00eddeo reciben m\u00e1s visitas y salen mejor posicionados en el directorio y en Google. Tardas un minuto.' };

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
  const [itemsLoaded, setItemsLoaded] = useState(false);
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
      setItemsLoaded(true);
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
    // Imágenes: compresión a 2560px calidad alta — mantiene calidad de portfolio sin pesar 15MB
    const toUpload = isImage ? await compressImage(file, 2560, 0.9) : file;
    const safeName = sanitize(toUpload.name) || 'portfolio-item';
    const path = `${user.id}/portfolio/${Date.now()}-${safeName}`;
    const { error } = await supabase.storage.from('audio-sessions').upload(path, toUpload);
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
        <Image size={16} style={{ color: '#8A6D0F' }} /> Portfolio
        <span className="text-xs text-muted-foreground ml-auto">{items.length}/{maxItems}</span>
      </h4>
      <p className="text-xs text-muted-foreground mb-3">
        Fotos hasta {MAX_IMAGE_MB}MB · Vídeos hasta {MAX_VIDEO_SECONDS}s / {MAX_VIDEO_MB}MB · hasta {MAX_ITEMS_PRO} elementos
      </p>

      {/* CTA: portfolio vacío — mensaje según el oficio */}
      {itemsLoaded && items.length === 0 && (() => {
        const cta = EMPTY_CTA[profile.role ?? ''] ?? EMPTY_CTA_DEFAULT;
        return (
          <div className="rounded-xl px-4 py-4 mb-3 flex items-start gap-3"
            style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.12), rgba(212,175,55,0.04))', border: '1.5px solid rgba(212,175,55,0.4)' }}>
            <span className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.2)' }}>
              <Image size={17} style={{ color: '#D4AF37' }} />
            </span>
            <div>
              <p className="text-sm font-black mb-1" style={{ color: '#8A6D0F' }}>{cta.title}</p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--nightlife-text-secondary)' }}>{cta.body}</p>
            </div>
          </div>
        );
      })()}

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
                <img src={item.url} alt={item.name} loading="lazy" className="w-full h-full object-cover" />
              )}
              {item.isVideo && (
                <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[0.7rem] font-bold flex items-center gap-0.5"
                  style={{ background: 'rgba(0,0,0,0.7)', color: '#8A6D0F' }}>
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
          <span className="text-xs leading-relaxed" style={{ color: '#222' }}>
            Declaro que soy titular o tengo autorización para publicar este contenido, conforme a los{' '}
            <a href="/terminos" target="_blank" rel="noopener noreferrer" style={{ color: '#8A6D0F' }}>Términos y Condiciones</a>.
          </span>
        </label>
      )}

      {items.length < maxItems && (
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading || !rightsConfirmed}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-lg border-2 border-dashed transition-all hover:scale-[1.01]"
          style={{ borderColor: 'rgba(212,175,55,0.2)', color: '#8A6D0F', background: 'rgba(212,175,55,0.03)' }}>
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
