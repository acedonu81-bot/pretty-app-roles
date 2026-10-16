import { useState } from 'react';
import { Pin, Play } from 'lucide-react';
import { claveSesion, useReproductorConcurso } from '@/components/concurso/ReproductorConcurso';

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
  /** Nombre del perfil, para el título de la barra al anclarla. */
  autor?: string;
  className?: string;
  style?: React.CSSProperties;
}

const conAutoplay = (src: string) =>
  /w\.soundcloud\.com\/player/.test(src) && !/auto_play=/.test(src)
    ? `${src}${src.includes('?') ? '&' : '?'}auto_play=true`
    : src;

export default function EmbedDiferido({ src, alto, tipo, titulo, autor, className, style }: Props) {
  const [cargado, setCargado] = useState(false);
  const { sesion, reproducir } = useReproductorConcurso();
  const enBarra = !!sesion && claveSesion(sesion) === src;

  if (cargado && !enBarra) {
    // "Anclar" (17 oct 2026): pasa la sesión a la barra fija, que sigue sonando
    // al cambiar de página. Vuelve a empezar desde el principio.
    const anclar = () => {
      reproducir({ url: src, embedSrc: src, alto, titulo: autor ? `${titulo} de ${autor}` : titulo, subtitulo: `${tipo ?? 'Audio'} · sigue sonando mientras navegas` });
      setCargado(false);
    };
    return (
      <div className="relative">
        <iframe src={conAutoplay(src)} width="100%" height={alto} allow="autoplay; encrypted-media"
          title={titulo} className={className} style={{ border: 'none', ...style }} />
        <button type="button" onClick={anclar} aria-label="Anclar: seguir escuchando al navegar"
          title="Seguir escuchando mientras navegas"
          className="absolute top-2 right-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[0.75rem] font-black shadow"
          style={{ background: 'rgba(255,253,247,0.96)', border: '1px solid rgba(212,175,55,0.6)', color: '#7a6216' }}>
          <Pin size={12} /> Anclar
        </button>
      </div>
    );
  }
  if (enBarra) {
    return (
      <div className={`w-full flex items-center gap-3 px-4 ${className ?? ''}`}
        style={{ height: Math.min(alto, 76), background: '#FFFDF7', border: '1px solid rgba(122,98,22,0.16)', ...style }}>
        <Pin size={18} style={{ color: '#B8941E' }} />
        <span className="min-w-0">
          <span className="block text-sm font-bold" style={{ color: '#111' }}>Sonando en la barra de abajo</span>
          <span className="block text-xs" style={{ color: '#6b7280' }}>Sigue sonando mientras navegas</span>
        </span>
      </div>
    );
  }
  // Barras de ecualizador en CSS puro (sin librería ni canvas): cada una
  // anima su altura con un delay distinto para que no se vean sincronizadas.
  // Sugiere "esto es audio" de un vistazo, en vez del círculo de play genérico
  // que no se distinguía de cualquier otro botón de la ficha.
  const barras = [0.4, 0.75, 1, 0.55, 0.85, 0.35, 0.65];
  return (
    <button type="button" onClick={() => setCargado(true)} aria-label={`Escuchar ${titulo}`}
      className={`embed-diferido-btn w-full flex items-center gap-3 px-4 text-left transition-colors hover:bg-black/[0.03] ${className ?? ''}`}
      style={{ height: alto, background: '#FFFDF7', border: '1px solid rgba(122,98,22,0.16)', ...style }}>
      <span className="flex items-center justify-center rounded-full flex-shrink-0"
        style={{ width: 44, height: 44, background: 'linear-gradient(135deg,#D4AF37,#B8941E)' }}>
        <Play size={16} fill="#000" color="#000" style={{ marginLeft: 2 }} />
      </span>
      {/* Estáticas hasta pulsar play — nada suena todavía en este estado,
          así que no deben moverse. Solo animan una vez cargado el iframe
          real (ver .eq-bar--sonando más abajo). */}
      <span className="flex items-end gap-[3px] h-6 flex-shrink-0" aria-hidden="true">
        {barras.map((h, i) => (
          <span key={i} className="eq-bar" style={{ '--h': h } as React.CSSProperties} />
        ))}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-bold" style={{ color: '#111' }}>Escuchar {titulo.toLowerCase()}</span>
        {tipo && <span className="block text-xs" style={{ color: '#6b7280' }}>{tipo}</span>}
      </span>
      <style>{`
        .eq-bar {
          width: 3px;
          border-radius: 2px;
          background: linear-gradient(180deg, #D4AF37, #B8941E);
          height: calc(var(--h) * 100%);
          transform-origin: bottom;
        }
      `}</style>
    </button>
  );
}
