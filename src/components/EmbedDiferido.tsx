import { useState } from 'react';
import { Play } from 'lucide-react';

/**
 * Reproductor externo (SoundCloud, HearThis, Mixcloud) que solo se carga al
 * pulsar. El widget de SoundCloud son 1,2 MB de JS más la precarga de las
 * pistas (~400 KB): con el iframe directo, abrir cualquier ficha con sesiones
 * los descargaba aunque nadie le diera al play (Lighthouse móvil 30 sep 2026,
 * ficha /p/ con 2,7 MB de peso). Ocupa lo mismo que el iframe para que la
 * página no salte al cambiarlo.
 */
interface Props {
  src: string;
  alto: number;
  tipo?: string;
  titulo: string;
  className?: string;
  style?: React.CSSProperties;
}

const conAutoplay = (src: string) =>
  /w\.soundcloud\.com\/player/.test(src) && !/auto_play=/.test(src)
    ? `${src}${src.includes('?') ? '&' : '?'}auto_play=true`
    : src;

export default function EmbedDiferido({ src, alto, tipo, titulo, className, style }: Props) {
  const [cargado, setCargado] = useState(false);
  if (cargado) {
    return (
      <iframe src={conAutoplay(src)} width="100%" height={alto} allow="autoplay; encrypted-media"
        title={titulo} className={className} style={{ border: 'none', ...style }} />
    );
  }
  return (
    <button type="button" onClick={() => setCargado(true)} aria-label={`Escuchar ${titulo}`}
      className={`w-full flex items-center gap-3 px-4 text-left transition-colors hover:bg-black/[0.03] ${className ?? ''}`}
      style={{ height: alto, background: '#FFFDF7', border: '1px solid rgba(122,98,22,0.16)', ...style }}>
      <span className="flex items-center justify-center rounded-full flex-shrink-0"
        style={{ width: 44, height: 44, background: 'linear-gradient(135deg,#D4AF37,#B8941E)' }}>
        <Play size={18} fill="#000" color="#000" style={{ marginLeft: 2 }} />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-bold" style={{ color: '#111' }}>Escuchar {titulo.toLowerCase()}</span>
        {tipo && <span className="block text-xs" style={{ color: '#6b7280' }}>{tipo}</span>}
      </span>
    </button>
  );
}
