import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { BarChart3, Heart, Megaphone, MessageCircle, Play } from 'lucide-react';
import { timeAgo } from '@/lib/timeAgo';
import { type Comunicado, type Interaccion, etiquetaCategoria, trocearCuerpo } from '@/lib/comunicados';

// Piezas compartidas por el carrusel de Inicio, el tablón y el detalle.

export const ORO = '#D4AF37';

interface FotoMencion { display_name: string; photo_url: string | null }
const cacheFotos = new Map<string, FotoMencion | null>();

/** Fotos de los mencionados (una sola consulta, con caché entre comunicados). */
function useFotosMenciones(ids: string[]): Map<string, FotoMencion | null> {
  const [, refrescar] = useState(0);
  const clave = ids.join(',');
  useEffect(() => {
    const faltan = ids.filter(id => !cacheFotos.has(id));
    if (!faltan.length) return;
    let vivo = true;
    (async () => {
      type Fila = { user_id: string; display_name: string; photo_url: string | null };
      const cliente = supabase as unknown as {
        rpc: (f: string, a: object) => Promise<{ data: Fila[] | null }>;
      };
      let data: Fila[] | null = null;
      try { ({ data } = await cliente.rpc('comunicados_menciones_fotos', { p_ids: faltan })); } catch { /* sin fotos: salen las iniciales */ }
      for (const id of faltan) cacheFotos.set(id, null);
      for (const r of data ?? []) cacheFotos.set(r.user_id, { display_name: r.display_name, photo_url: r.photo_url });
      if (vivo) refrescar(n => n + 1);
    })();
    return () => { vivo = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clave]);
  return cacheFotos;
}

function Mencion({ userId, nombre, foto }: { userId: string; nombre: string; foto?: FotoMencion | null }) {
  const url = foto?.photo_url;
  return (
    <Link to={`/p/${userId}`} title={nombre} aria-label={nombre}
      className="inline-flex align-middle mx-1 rounded-full transition-transform hover:scale-110"
      style={{ boxShadow: `0 0 0 2px ${ORO}` }}>
      {url
        ? <img src={url} alt={nombre} loading="lazy" className="w-8 h-8 rounded-full object-cover" />
        : (
          <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: '#FBF3DD', color: '#8B6A00' }}>
            {nombre.trim().charAt(0).toUpperCase()}
          </span>
        )}
    </Link>
  );
}

export function CuerpoConMenciones({ cuerpo, grande = false }: { cuerpo: string; grande?: boolean }) {
  const trozos = trocearCuerpo(cuerpo);
  const fotos = useFotosMenciones([...new Set(trozos.flatMap(t => t.tipo === 'mencion' ? [t.userId] : []))]);
  return (
    <p className={`${grande ? 'text-base' : 'text-sm'} leading-relaxed whitespace-pre-line`} style={{ color: '#374151' }}>
      {trozos.map((t, i) => t.tipo === 'texto'
        ? <span key={i}>{t.valor}</span>
        : <Mencion key={i} userId={t.userId} nombre={t.nombre} foto={fotos.get(t.userId)} />)}
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
