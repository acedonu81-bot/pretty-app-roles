import { Link } from 'react-router-dom';
import { BarChart3, Heart, Megaphone, MessageCircle, Play } from 'lucide-react';
import { timeAgo } from '@/lib/timeAgo';
import { type Comunicado, type Interaccion, etiquetaCategoria, trocearCuerpo } from '@/lib/comunicados';

// Piezas compartidas por el carrusel de Inicio, el tablón y el detalle.

export const ORO = '#D4AF37';

export function CuerpoConMenciones({ cuerpo, grande = false }: { cuerpo: string; grande?: boolean }) {
  return (
    <p className={`${grande ? 'text-base' : 'text-sm'} leading-relaxed whitespace-pre-line`} style={{ color: '#374151' }}>
      {trocearCuerpo(cuerpo).map((t, i) => t.tipo === 'texto'
        ? <span key={i}>{t.valor}</span>
        : (
          <Link key={i} to={`/p/${t.userId}`} className="font-bold underline underline-offset-2"
            style={{ color: '#8B6A00', textDecorationColor: 'rgba(212,175,55,0.5)' }}>
            {t.nombre}
          </Link>
        ))}
    </p>
  );
}

export function Portada({ c }: { c: Pick<Comunicado, 'imagen_url' | 'video_url'> }) {
  if (c.imagen_url) {
    return <img src={c.imagen_url} alt="" loading="lazy" className="w-full h-full object-cover" />;
  }
  if (c.video_url) {
    return (
      <div className="relative w-full h-full bg-[#1f2937]">
        <video src={`${c.video_url}#t=0.5`} muted playsInline preload="metadata" className="w-full h-full object-cover" />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="rounded-full p-3" style={{ background: 'rgba(255,253,247,0.9)' }}>
            <Play size={20} style={{ color: '#8B6A00' }} fill="#8B6A00" />
          </span>
        </span>
      </div>
    );
  }
  return (
    <div className="w-full h-full flex items-end p-4"
      style={{ background: 'linear-gradient(135deg, #FBF3DD 0%, #F3E2AE 100%)' }}>
      <Megaphone size={28} style={{ color: '#8B6A00' }} />
    </div>
  );
}

export function MetaComunicado({ c }: { c: Pick<Comunicado, 'categoria' | 'created_at'> }) {
  return (
    <div className="flex items-center gap-1.5 text-xs" style={{ color: '#6b7280' }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: ORO }} />
      <span className="font-semibold">{etiquetaCategoria(c.categoria)}</span>
      <span>·</span>
      <span>{timeAgo(c.created_at)}</span>
    </div>
  );
}

export function StatsComunicado({ c, i }: { c: Pick<Comunicado, 'encuesta_opciones'>; i: Interaccion | undefined }) {
  const encuesta = (c.encuesta_opciones?.length ?? 0) >= 2;
  if (!i?.likes && !i?.comentarios && !encuesta) return null;
  return (
    <div className="flex items-center gap-3 text-xs" style={{ color: '#6b7280' }}>
      {!!i?.likes && <span className="inline-flex items-center gap-1"><Heart size={12} /> {i.likes}</span>}
      {!!i?.comentarios && <span className="inline-flex items-center gap-1"><MessageCircle size={12} /> {i.comentarios}</span>}
      {encuesta && <span className="inline-flex items-center gap-1"><BarChart3 size={12} /> {i?.mi_voto != null ? 'Has votado' : 'Encuesta'}</span>}
    </div>
  );
}

/** Los títulos no van en h1-h4: la hoja global fuerza Syne 800 (ancha y enorme). */
export function TituloComunicado({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <p role="heading" aria-level={3} className={`font-semibold leading-[1.35] ${className}`} style={{ color: '#111827' }}>{children}</p>
  );
}
