import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BarChart3, ChevronLeft, ChevronRight, Heart, Megaphone, MessageCircle, Play } from 'lucide-react';
import ComunicadoInteraccion from './ComunicadoInteraccion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { timeAgo } from '@/lib/timeAgo';
import {
  type Comunicado, type Interaccion, esEnlaceInterno, etiquetaCategoria, ordenarComunicados, resumenSinTitulo, textoPlano, trocearCuerpo,
} from '@/lib/comunicados';

// Carrusel "Comunicados XPEAK" del panel (6 nov 2026), inspirado en "Últimas
// noticias" de Hearthis: tarjeta con imagen, categoría, hace cuánto y título.
// La RLS ya filtra por categoría y caducidad: aquí solo se pinta lo que llega.
// Si no hay nada vigente no se muestra nada (un tablón vacío parece abandonado).

// Tablas nuevas aún sin tipos generados.
const db = supabase as unknown as {
  rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown[] | null }>;
  from: (t: string) => {
    select: (c: string) => { order: (c: string, o: { ascending: boolean }) => { limit: (n: number) => Promise<{ data: unknown[] | null }> }; eq: (k: string, v: string) => Promise<{ data: unknown[] | null }> };
    upsert: (row: Record<string, unknown>, o: { onConflict: string; ignoreDuplicates: boolean }) => Promise<unknown>;
  };
};

const ORO = '#D4AF37';

export function CuerpoConMenciones({ cuerpo }: { cuerpo: string }) {
  return (
    <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#374151' }}>
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

export default function ComunicadosCarrusel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [lista, setLista] = useState<Comunicado[]>([]);
  const [leidos, setLeidos] = useState<Set<string>>(new Set());
  const [abierto, setAbierto] = useState<Comunicado | null>(null);
  const [inter, setInter] = useState<Record<string, Interaccion>>({});
  const pista = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user?.id) return;
    let vivo = true;
    (async () => {
      const [{ data }, { data: lect }] = await Promise.all([
        db.from('comunicados').select('id, titulo, cuerpo, imagen_url, video_url, cta_texto, cta_url, categoria, push, fijado, caduca_at, destinatarios, created_at, publico, comentarios_on, encuesta_pregunta, encuesta_opciones, encuesta_cierra_at')
          .order('created_at', { ascending: false }).limit(20),
        db.from('comunicado_lecturas').select('comunicado_id').eq('user_id', user.id),
      ]);
      if (!vivo) return;
      // El admin ve también los caducados (para gestionarlos); aquí no.
      const ahora = Date.now();
      setLista(ordenarComunicados(((data ?? []) as Comunicado[]).filter(c => new Date(c.caduca_at).getTime() > ahora)));
      setLeidos(new Set(((lect ?? []) as { comunicado_id: string }[]).map(l => l.comunicado_id)));
      const ids = ((data ?? []) as Comunicado[]).map(c => c.id);
      if (ids.length) {
        const { data: it } = await db.rpc('comunicados_interaccion', { p_ids: ids });
        if (!vivo) return;
        const m: Record<string, Interaccion> = {};
        for (const x of (it ?? []) as Interaccion[]) m[x.comunicado_id] = x;
        setInter(m);
      }
    })();
    return () => { vivo = false; };
  }, [user?.id]);

  const marcarLeido = useCallback((c: Comunicado) => {
    if (!user?.id || leidos.has(c.id)) return;
    setLeidos(s => new Set(s).add(c.id));
    db.from('comunicado_lecturas').upsert({ comunicado_id: c.id, user_id: user.id }, { onConflict: 'comunicado_id,user_id', ignoreDuplicates: true });
  }, [user?.id, leidos]);

  const irA = useCallback((url: string) => {
    if (esEnlaceInterno(url)) navigate(url);
    else window.open(url, '_blank', 'noopener,noreferrer');
  }, [navigate]);

  // Banner: solo imagen y botón, sin texto. Se va directo al enlace.
  const abrir = useCallback((c: Comunicado) => {
    marcarLeido(c);
    if (!c.cuerpo.trim() && !c.video_url && !c.encuesta_opciones?.length && c.cta_url) { irA(c.cta_url); return; }
    setAbierto(c);
  }, [marcarLeido, irA]);

  // Desde la campana o el push: /dashboard?view=explorar&comunicado=<id>
  const idUrl = useMemo(() => new URLSearchParams(location.search).get('comunicado'), [location.search]);
  useEffect(() => {
    if (!idUrl || !lista.length) return;
    const c = lista.find(x => x.id === idUrl);
    if (c) { marcarLeido(c); setAbierto(c); }
    // Solo al llegar el id; marcarLeido cambia con cada lectura.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idUrl, lista]);

  if (!lista.length) return null;

  const mover = (dir: 1 | -1) => {
    const el = pista.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' });
  };

  const Meta = ({ c }: { c: Comunicado }) => (
    <div className="flex items-center gap-1.5 text-xs" style={{ color: '#6b7280' }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: ORO }} />
      <span className="font-semibold">{etiquetaCategoria(c.categoria)}</span>
      <span>·</span>
      <span>{timeAgo(c.created_at)}</span>
    </div>
  );
  const Stats = ({ c }: { c: Comunicado }) => {
    const i = inter[c.id];
    const encuesta = (c.encuesta_opciones?.length ?? 0) >= 2;
    if (!i?.likes && !i?.comentarios && !encuesta) return null;
    return (
      <div className="flex items-center gap-3 text-xs" style={{ color: '#6b7280' }}>
        {!!i?.likes && <span className="inline-flex items-center gap-1"><Heart size={12} /> {i.likes}</span>}
        {!!i?.comentarios && <span className="inline-flex items-center gap-1"><MessageCircle size={12} /> {i.comentarios}</span>}
        {encuesta && <span className="inline-flex items-center gap-1"><BarChart3 size={12} /> {i?.mi_voto != null ? 'Has votado' : 'Encuesta'}</span>}
      </div>
    );
  };
  const Nuevo = ({ c }: { c: Comunicado }) => (leidos.has(c.id) ? null : (
    <span className="absolute top-2.5 left-2.5 text-[0.65rem] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
      style={{ background: ORO, color: '#1f2937' }}>Nuevo</span>
  ));
  // Los títulos NO van en h2/h3: la hoja global fuerza Syne 800 (ancha y enorme)
  // en todos los h1-h4. Aquí son una tarjeta pequeña, van en Inter.
  const titulo = (c: Comunicado, grande: boolean) => (
    <p role="heading" aria-level={3} className={`${grande ? 'text-base' : 'text-sm'} font-semibold leading-[1.35] line-clamp-2 group-hover:underline underline-offset-2`}
      style={{ color: '#111827' }}>{c.titulo}</p>
  );

  return (
    <section className="px-3 md:px-6 pt-4" aria-label="Comunicados XPEAK">
      <div className="mx-auto w-full max-w-6xl sm:px-4">
      <div className="flex items-center justify-between mb-2.5">
        <p role="heading" aria-level={2} className="inline-flex items-center gap-2 text-[0.8rem] font-bold uppercase tracking-wider" style={{ color: '#8B6A00' }}>
          <Megaphone size={14} /> Comunicados XPEAK
        </p>
        {lista.length > 1 && (
          <div className="hidden md:flex gap-1.5">
            {[-1, 1].map(d => (
              <button key={d} onClick={() => mover(d as 1 | -1)} aria-label={d < 0 ? 'Anteriores' : 'Siguientes'}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-black/5"
                style={{ border: '1px solid rgba(0,0,0,0.12)', background: '#fff' }}>
                {d < 0 ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
              </button>
            ))}
          </div>
        )}
      </div>

      {lista.length === 1 ? (
        // Uno solo: fila compacta con la imagen en un recuadro pequeño.
        (() => {
          const c = lista[0];
          const resumen = resumenSinTitulo(c.cuerpo, c.titulo);
          return (
            <button onClick={() => abrir(c)} className="group w-full max-w-2xl text-left rounded-xl p-2.5 flex gap-3 items-center transition-shadow hover:shadow-md"
              style={{ background: '#fff', border: '1px solid rgba(212,175,55,0.3)' }}>
              <div className="relative shrink-0 w-24 sm:w-32 aspect-[3/2] rounded-lg overflow-hidden" style={{ background: '#FBF3DD' }}>
                <Portada c={c} />
                {!leidos.has(c.id) && <span className="absolute top-1 left-1 w-2.5 h-2.5 rounded-full" style={{ background: ORO, boxShadow: '0 0 0 2px #fff' }} aria-label="Nuevo" />}
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <Meta c={c} />
                {titulo(c, true)}
                {resumen && <p className="text-[0.8rem] leading-[1.35] line-clamp-2" style={{ color: '#4b5563' }}>{resumen}</p>}
                <div className="flex items-center gap-3">
                  <Stats c={c} />
                  <span className="inline-flex items-center gap-0.5 text-xs font-bold" style={{ color: '#8B6A00' }}>
                    {(c.encuesta_opciones?.length ?? 0) >= 2 ? 'Leer y votar' : 'Leer y comentar'} <ChevronRight size={13} />
                  </span>
                </div>
              </div>
            </button>
          );
        })()
      ) : (
        <div ref={pista} className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2">
          {lista.map(c => (
            <button key={c.id} onClick={() => abrir(c)} className="group snap-start shrink-0 text-left w-[190px] sm:w-[210px] space-y-1">
              <div className="relative aspect-[3/2] rounded-xl overflow-hidden" style={{ border: '1px solid rgba(212,175,55,0.25)', background: '#FBF3DD' }}>
                <Portada c={c} />
                <Nuevo c={c} />
              </div>
              <Meta c={c} />
              {titulo(c, false)}
              <Stats c={c} />
            </button>
          ))}
        </div>
      )}

      <Dialog open={!!abierto} onOpenChange={o => { if (!o) setAbierto(null); }}>
        <DialogContent className="max-w-xl p-0 overflow-y-auto max-h-[92vh]" style={{ background: '#FFFDF7' }}>
          {abierto && (
            <>
              {abierto.video_url ? (
                <video src={abierto.video_url} controls playsInline poster={abierto.imagen_url ?? undefined} className="w-full max-h-[60vh] bg-black" />
              ) : abierto.imagen_url ? (
                <img src={abierto.imagen_url} alt="" className="w-full max-h-[60vh] object-contain bg-[#FBF3DD]" />
              ) : null}
              <div className="p-5 space-y-3">
                <div className="text-xs" style={{ color: '#6b7280' }}>
                  {etiquetaCategoria(abierto.categoria)} · {timeAgo(abierto.created_at)}
                </div>
                <DialogTitle asChild>
                  <p className="text-xl font-bold leading-[1.35]" style={{ color: '#111827' }}>{abierto.titulo}</p>
                </DialogTitle>
                <DialogDescription className="sr-only">{textoPlano(abierto.cuerpo).slice(0, 140)}</DialogDescription>
                {abierto.cuerpo.trim() && <CuerpoConMenciones cuerpo={abierto.cuerpo} />}
                {abierto.cta_url && (
                  <button onClick={() => { setAbierto(null); irA(abierto.cta_url!); }}
                    className="mt-2 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-extrabold"
                    style={{ background: ORO, color: '#1f2937' }}>
                    {abierto.cta_texto || 'Ver más'} <ChevronRight size={15} />
                  </button>
                )}
                <div className="pt-3" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                  <ComunicadoInteraccion c={abierto} inter={inter[abierto.id]}
                    onCambio={i => setInter(m => ({ ...m, [abierto.id]: i }))} />
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      </div>
    </section>
  );
}
