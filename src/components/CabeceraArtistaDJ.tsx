import { useRef, type ReactNode } from 'react';
import { BadgeCheck, Camera, MapPin } from 'lucide-react';
import { fotoOptimizada } from '@/lib/imagen';

// Cabecera de artista del perfil de DJ, al estilo Hearthis (1 nov 2026):
// banner en tarjeta redondeada con el avatar, el nombre, la ciudad y los
// botones encima. Solo para DJs; el resto de roles mantiene su portada.
// Banner: el que suba el DJ; si no, la portada de su primer set o su foto.
// El velo es marrón dorado y no negro (sin fondos negros en páginas públicas).
// Cámara redonda para cambiar banner o foto: solo la ve el propio DJ.
const BotonCamara = ({ etiqueta, onArchivo, subiendo, className }: {
  etiqueta: string; onArchivo: (f: File) => void; subiendo: boolean; className: string;
}) => {
  const input = useRef<HTMLInputElement>(null);
  return (
    <>
      <button type="button" onClick={() => input.current?.click()} disabled={subiendo} aria-label={etiqueta} title={etiqueta}
        className={`absolute z-10 inline-flex items-center justify-center rounded-full transition-transform hover:scale-105 disabled:opacity-60 ${className}`}
        style={{ width: 40, height: 40, background: 'rgba(46,32,6,0.6)', border: '1.5px solid rgba(255,255,255,0.7)', color: '#fff', backdropFilter: 'blur(6px)' }}>
        {subiendo ? <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> : <Camera size={18} />}
      </button>
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
        onChange={e => { const f = e.target.files?.[0]; e.target.value = ''; if (f) onArchivo(f); }} />
    </>
  );
};

const CabeceraArtistaDJ = ({ nombre, foto, banner, zona, estilos, verificado, acciones, onCambiarBanner, onCambiarFoto, subiendo = null }: {
  nombre: string;
  foto: string | null;
  /** Imagen del banner ya elegida (banner del DJ, portada o foto), o null. */
  banner: string | null;
  zona: string | null;
  estilos: string[];
  verificado: boolean;
  /** Seguir y compartir. */
  acciones: ReactNode;
  /** Solo si quien mira es el propio DJ: cámaras para cambiar banner y foto. */
  onCambiarBanner?: (f: File) => void;
  onCambiarFoto?: (f: File) => void;
  subiendo?: 'banner' | 'foto' | null;
}) => {
  const tieneFoto = !!foto && foto.trim().length > 5;
  const inicial = (nombre || 'X').trim().charAt(0).toUpperCase();
  // Si el banner es la propia foto, se desenfoca un poco: una foto de
  // retrato estirada a lo ancho se ve pixelada y repite la cara del avatar.
  const bannerEsFoto = !!banner && banner === foto;

  return (
    <header className="max-w-6xl mx-auto px-3 sm:px-5 pt-3 sm:pt-5">
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl min-h-[15rem] sm:min-h-[20rem] flex items-end"
        style={{ background: 'linear-gradient(120deg,#E3B54F 0%,#B8941E 55%,#8B6A00 100%)' }}>
        {banner && (
          <img src={fotoOptimizada(banner, 1600)} alt="" aria-hidden="true"
            className={`absolute inset-0 w-full h-full object-cover ${bannerEsFoto ? 'scale-110' : ''}`}
            style={bannerEsFoto ? { filter: 'blur(10px) saturate(1.1)' } : undefined} />
        )}
        {onCambiarBanner && (
          <BotonCamara etiqueta="Cambiar el fondo del banner" onArchivo={onCambiarBanner} subiendo={subiendo === 'banner'} className="top-3 right-3 sm:top-4 sm:right-4" />
        )}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(90deg, rgba(46,32,6,0.78) 0%, rgba(46,32,6,0.45) 45%, rgba(46,32,6,0.12) 100%), linear-gradient(0deg, rgba(46,32,6,0.55) 0%, rgba(46,32,6,0) 55%)',
        }} />

        <div className="relative w-full flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-7 p-5 sm:p-8">
          <div className="relative flex-shrink-0 self-start sm:self-auto">
          {tieneFoto ? (
            <img src={fotoOptimizada(foto, 400)} alt={nombre} loading="eager" {...{ fetchpriority: 'high' }}
              className="w-24 h-24 sm:w-44 sm:h-44 rounded-full object-cover flex-shrink-0"
              style={{ border: '4px solid rgba(255,255,255,0.95)', boxShadow: '0 10px 30px rgba(46,32,6,0.45)', objectPosition: '50% 20%' }} />
          ) : (
            <div className="w-24 h-24 sm:w-44 sm:h-44 rounded-full flex items-center justify-center flex-shrink-0 text-5xl font-black"
              style={{ border: '4px solid rgba(255,255,255,0.95)', background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#fff' }}>
              {inicial}
            </div>
          )}
          {onCambiarFoto && (
            <BotonCamara etiqueta="Cambiar la foto de perfil" onArchivo={onCambiarFoto} subiendo={subiendo === 'foto'} className="bottom-0 right-0 sm:bottom-2 sm:right-2" />
          )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-black tracking-tight break-words" style={{ fontSize: 'clamp(1.9rem, 6vw, 3.25rem)', lineHeight: 1.02, color: '#fff', letterSpacing: '-0.02em', textShadow: '0 2px 18px rgba(46,32,6,0.5)' }}>
                {nombre}
              </h1>
              {verificado && (
                <span className="inline-flex items-center justify-center rounded-full" style={{ background: '#059669', width: 30, height: 30 }}>
                  <BadgeCheck size={20} color="#fff" aria-label="Verificado por XPEAK" />
                </span>
              )}
            </div>
            <p className="text-sm sm:text-base font-semibold mt-2 flex items-center gap-1.5 flex-wrap" style={{ color: 'rgba(255,255,255,0.9)' }}>
              <span style={{ color: '#F3D77A' }}>DJ</span>
              {zona && (<><span aria-hidden="true">·</span><MapPin size={15} />{zona}</>)}
              {estilos.length > 0 && (<><span aria-hidden="true">·</span>{estilos.slice(0, 3).join(', ')}</>)}
            </p>
            <div className="flex items-center gap-2 mt-4 flex-wrap">{acciones}</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CabeceraArtistaDJ;
