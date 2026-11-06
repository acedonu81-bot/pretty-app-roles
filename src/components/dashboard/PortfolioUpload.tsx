import { useState, useRef, useEffect } from 'react';
import { Upload, Image, X, Plus, Video } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { compressImage } from '@/lib/image';
import { validarVideo, subirConProgreso, sincronizarSesionesVideo, esImagenAdmitida, MENSAJE_HEIC, MAX_VIDEO_MB, MAX_VIDEO_S } from '@/lib/videoUpload';
import { toast } from 'sonner';

const MAX_IMAGE_MB      = 15;
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
  peluqueria:   { title: 'Sube tus trabajos: cortes, color y recogidos', body: 'Las clientas eligen peluquera a domicilio por lo que ven. Sube tus mejores looks \u2014 los perfiles con portfolio reciben m\u00e1s contactos y posicionan mejor en el directorio.' },
  staff:        { title: 'Una buena foto profesional genera confianza', body: 'Los empresarios contratan camareros que pueden ver: foto profesional + una imagen tuya trabajando en un evento marcan la diferencia frente a un perfil vac\u00edo.' },
  azafata:      { title: 'Una buena foto profesional genera confianza', body: 'Los empresarios contratan azafatas que pueden ver: foto profesional + una imagen tuya trabajando en un evento marcan la diferencia frente a un perfil vac\u00edo.' },
  promotor:     { title: 'Ense\u00f1a tus eventos y tus salas', body: 'Fotos de tus fiestas, colas en la puerta, ambiente dentro: es la prueba de que mueves gente. Los perfiles con portfolio posicionan mejor en el directorio.' },
  catering:     { title: 'Tus platos son tu mejor carta de presentaci\u00f3n', body: 'Sube fotos de tus montajes, platos y barras. Quien organiza un evento elige catering con los ojos \u2014 un perfil sin fotos no compite.' },
  mago:         { title: 'Un clip de tu show vende m\u00e1s que mil palabras', body: 'La magia se contrata vi\u00e9ndola: sube un v\u00eddeo corto de una actuaci\u00f3n real (vale grabado con m\u00f3vil). Los perfiles con v\u00eddeo reciben m\u00e1s contactos.' },
  humorista:    { title: 'Sube un clip de tu mon\u00f3logo', body: 'Que se r\u00edan antes de contratarte: 30-60 segundos de una actuaci\u00f3n real es tu mejor argumento de venta. Los perfiles con v\u00eddeo posicionan mejor.' },
  animador:     { title: 'Fotos de tus fiestas: los padres quieren ver tu trabajo', body: 'Sube fotos de animaciones reales (respetando la privacidad de los menores). Un perfil con fotos transmite la confianza que una familia necesita para contratar.' },
  bailarin:     { title: 'El movimiento no se explica: sube un v\u00eddeo bailando', body: '30-60 segundos de un show o ensayo real. Quien busca espect\u00e1culo de baile decide en los primeros segundos de v\u00eddeo.' },
  speaker:      { title: 'Sube un clip presentando: tu voz es tu portfolio', body: 'Un fragmento de una gala, boda o congreso real muestra tu presencia esc\u00e9nica mejor que cualquier descripci\u00f3n. Los perfiles con v\u00eddeo reciben m\u00e1s contactos.' },
  vestuario:    { title: 'Sube tu book: looks y styling de trabajos reales', body: 'Novias, artistas y producciones eligen estilista por su ojo. Tu book es la prueba \u2014 los perfiles con portfolio posicionan mejor en el directorio.' },
  alquiler:     { title: 'Ense\u00f1a tu equipo: fotos reales, no de cat\u00e1logo', body: 'Sube fotos de tu material montado en eventos y del almac\u00e9n: altavoces, luces, cabinas. Quien alquila quiere saber exactamente qu\u00e9 le llega y en qu\u00e9 estado.' },
  navidad:      { title: 'Ense\u00f1a tu personaje', body: 'Sube fotos con el vestuario completo y, si puedes, de actuaciones reales. Quien contrata Reyes Magos o Pap\u00e1 Noel quiere ver c\u00f3mo luce el personaje.' },
  limpieza:     { title: 'Ense\u00f1a tu trabajo: antes y despu\u00e9s', body: 'Sube fotos de locales y eventos que hayas dejado impecables. Quien contrata limpieza quiere ver el resultado real, no un cat\u00e1logo.' },
  'disco-movil': { title: 'Enseña tu montaje funcionando', body: 'Sube fotos y vídeos de tu equipo montado en un evento real: la pista llena, las luces encendidas y la cabina. Quien organiza quiere ver qué llega a su fiesta.' },
  'food-truck': { title: 'Tu food truck entra por los ojos', body: 'Sube fotos del camión montado en un evento real, de tus platos y de la gente haciendo cola. Quien organiza quiere ver qué llega y cómo queda en su espacio.' },
  'photo-booth': { title: 'Ense\u00f1a tus cabinas en acci\u00f3n', body: 'Fotos de tus photo booth montados en eventos reales, props y ejemplos de impresi\u00f3n. Quien alquila quiere ver exactamente lo que llega a su evento.' },
};
const EMPTY_CTA_DEFAULT = { title: 'Sube tu portfolio \u2014 es tu mejor tarjeta de presentaci\u00f3n', body: 'Los organizadores miran antes de contactar: los perfiles con fotos o v\u00eddeo reciben m\u00e1s visitas y salen mejor posicionados en el directorio y en Google. Tardas un minuto.' };

const PortfolioUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [pct, setPct] = useState<number | null>(null);
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
      const [{ data: fotos }, { data: vids }] = await Promise.all([
        supabase.storage.from('audio-sessions').list(user.id + '/portfolio'),
        supabase.storage.from('audio-sessions').list(user.id + '/video-sessions'),
      ]);
      const mk = (carpeta: string, f: { name: string }, isVideo: boolean): PortfolioItem => {
        const path = `${user.id}/${carpeta}/${f.name}`;
        const { data } = supabase.storage.from('audio-sessions').getPublicUrl(path);
        return { name: f.name.replace(/^\d+-/, ''), url: data.publicUrl, storagePath: path, isVideo };
      };
      const loaded = [
        ...(fotos ?? []).map(f => mk('portfolio', f, false)),
        ...(vids ?? []).map(f => mk('video-sessions', f, true)),
      ];
      if (loaded.length > 0) setItems(loaded);
      setItemsLoaded(true);
    };
    load();
  }, [user]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (inputRef.current) inputRef.current.value = '';
    if (files.length === 0 || !user) return;

    if (items.length >= maxItems) {
      toast.error(`Máximo ${maxItems} elementos en tu plan.`);
      return;
    }

    // Se pueden elegir fotos y vídeos a la vez: las fotos van a portfolio_urls
    // y los vídeos a video_session_urls (columnas distintas, no se pisan).
    const huecos = maxItems - items.length;
    const fotos: File[] = [];
    const videos: File[] = [];
    let noValido = 0, grandes = 0, heic = 0;
    for (const file of files) {
      if (file.type.startsWith('video/') || /\.(mp4|mov|webm)$/i.test(file.name)) { videos.push(file); continue; }
      if (/image\/hei[cf]/i.test(file.type) || /\.hei[cf]$/i.test(file.name)) { heic++; continue; }
      if (!file.type.startsWith('image/')) { noValido++; continue; }
      if (file.size > MAX_IMAGE_MB * 1024 * 1024) { grandes++; continue; }
      fotos.push(file);
    }
    if (heic) toast.error(MENSAJE_HEIC);
    if (noValido) toast.error('Solo fotos (JPG, PNG, WEBP) o vídeos (MP4, MOV, WebM).');
    if (grandes) toast.error(`Máximo ${MAX_IMAGE_MB}MB por foto (${grandes} no se ${grandes === 1 ? 'subió' : 'subieron'})`);
    const lote = [...fotos, ...videos].slice(0, huecos);
    if (fotos.length + videos.length > huecos) toast.error(`Solo caben ${huecos} más: se suben las ${huecos} primeras.`);
    if (lote.length === 0) return;

    setUploading(true);
    const subidas: PortfolioItem[] = [];
    let fallos = 0, hayVideo = false;
    for (const file of lote) {
      const esVideo = videos.includes(file);
      if (esVideo) {
        const motivo = await validarVideo(file);
        if (motivo) { toast.error(`${file.name}: ${motivo}`); fallos++; continue; }
        setPct(0);
        try {
          const path = `${user.id}/video-sessions/${Date.now()}-${subidas.length}-${sanitize(file.name) || 'video.mp4'}`;
          const url = await subirConProgreso(path, file, setPct);
          subidas.push({ name: file.name, url, storagePath: path, isVideo: true });
          hayVideo = true;
        } catch (err: any) { toast.error(err.message); fallos++; }
        setPct(null);
        continue;
      }
      // Compresión a 2560px calidad alta: mantiene calidad de portfolio sin pesar 15MB
      const toUpload = await compressImage(file, 2560, 0.9);
      if (!esImagenAdmitida(toUpload)) { toast.error(MENSAJE_HEIC); fallos++; continue; }
      const safeName = sanitize(toUpload.name) || 'portfolio-item';
      const path = `${user.id}/portfolio/${Date.now()}-${subidas.length}-${safeName}`;
      const { error } = await supabase.storage.from('audio-sessions').upload(path, toUpload);
      if (error) { fallos++; continue; }
      const { data: urlData } = supabase.storage.from('audio-sessions').getPublicUrl(path);
      subidas.push({ name: file.name, url: urlData.publicUrl, storagePath: path, isVideo: false });
    }
    if (subidas.length === 0) {
      setUploading(false);
      toast.error('No se pudo subir nada. Revisa el formato y tu conexión e inténtalo de nuevo.');
      return;
    }

    const next = [...items, ...subidas];
    let syncOk = true;
    if (subidas.some(i => !i.isVideo)) {
      const imageUrls = next.filter(i => !i.isVideo).map(i => i.url);
      const { error } = await supabase.from('profiles').update({ portfolio_urls: imageUrls } as any).eq('user_id', user.id);
      if (error) syncOk = false;
    }
    if (hayVideo && !(await sincronizarSesionesVideo(user.id))) syncOk = false;
    setUploading(false);
    if (!syncOk) {
      toast.error('Se subieron los archivos pero no se pudieron añadir a tu perfil. Inténtalo de nuevo.');
      return;
    }
    setItems(next);
    if (fallos) toast.error(`${fallos} ${fallos === 1 ? 'archivo no se pudo subir' : 'archivos no se pudieron subir'}.`);
    const soloFotos = subidas.every(i => !i.isVideo);
    toast.success(subidas.length === 1 ? 'Añadido a tu perfil.' : soloFotos ? `${subidas.length} fotos añadidas al portfolio.` : `${subidas.length} archivos añadidos a tu perfil.`);
  };

  const remove = async (item: PortfolioItem) => {
    await supabase.storage.from('audio-sessions').remove([item.storagePath]);
    const next = items.filter(i => i.storagePath !== item.storagePath);
    let ok = true;
    if (item.isVideo) ok = await sincronizarSesionesVideo(user.id);
    else {
      const imageUrls = next.filter(i => !i.isVideo).map(i => i.url);
      const { error } = await supabase.from('profiles').update({ portfolio_urls: imageUrls } as any).eq('user_id', user.id);
      ok = !error;
    }
    if (!ok) {
      toast.error('No se pudo eliminar de tu perfil. Inténtalo de nuevo.');
      return;
    }
    setItems(next);
    toast.info('Elemento eliminado.');
  };

  return (
    <div className="glass-panel p-4">
      <h4 className="text-sm font-bold mb-1 flex items-center gap-2">
        <Image size={16} style={{ color: '#8A6D0F' }} /> Fotos y vídeos
        <span className="text-xs text-muted-foreground ml-auto">{items.length}/{maxItems}</span>
      </h4>
      <p className="text-xs text-muted-foreground mb-3">
        Fotos (JPG, PNG, WEBP, hasta {MAX_IMAGE_MB}MB) y vídeos (MP4, MOV, hasta {MAX_VIDEO_S} s y {MAX_VIDEO_MB}MB) · hasta {MAX_ITEMS_PRO} elementos
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
                  preload="metadata"
                  onLoadedMetadata={e => { (e.target as HTMLVideoElement).currentTime = 0.1; }}
                  onMouseEnter={e => (e.target as HTMLVideoElement).play()}
                  onMouseLeave={e => { const v = e.target as HTMLVideoElement; v.pause(); v.currentTime = 0.1; }}
                />
              ) : (
                <img src={item.url} alt={item.name} loading="lazy" className="w-full h-full object-cover" />
              )}
              {item.isVideo && (
                <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[0.75rem] font-bold flex items-center gap-0.5"
                  style={{ background: 'rgba(0,0,0,0.7)', color: '#8A6D0F' }}>
                  <Video size={8} /> VÍD
                </div>
              )}
              <button
                onClick={() => remove(item)}
                aria-label="Eliminar"
                className="absolute top-1 right-1 w-8 h-8 rounded-full flex items-center justify-center sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 transition-opacity"
                style={{ background: 'rgba(0,0,0,0.7)' }}>
                <X size={14} className="text-white" />
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
            {uploading ? (pct !== null ? `Subiendo vídeo… ${pct}%` : 'Subiendo…') : items.length > 0 ? 'Añadir fotos o vídeos' : 'Elegir fotos o vídeos'}
          </span>
        </button>
      )}

      {items.length < maxItems && !rightsConfirmed && (
        <p className="text-xs mt-2 text-center" style={{ color: '#444' }}>Marca la casilla de arriba para activar el botón.</p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm"
        multiple
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  );
};

export default PortfolioUpload;
