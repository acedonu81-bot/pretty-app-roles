import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { MetaComunicado, Portada, StatsComunicado, TituloComunicado } from './ComunicadoPartes';
import { type Comunicado, ordenarComunicados, resumenSinTitulo, slugNovedad } from '@/lib/comunicados';

// Franja "Novedades de la comunidad" de la portada pública (6 nov 2026): las 3
// últimas novedades públicas, para que quien llega de Google vea movimiento.
// Solo se pinta si hay alguna; es cliente (no entra en el HTML prerenderizado)
// y va por debajo del primer pantallazo, así que no afecta a LCP ni CLS.

type Corta = Pick<Comunicado, 'id' | 'titulo' | 'cuerpo' | 'imagen_url' | 'video_url' | 'categoria' | 'fijado' | 'created_at' | 'encuesta_opciones'>;
interface Cuenta { comunicado_id: string; likes: number; comentarios: number; votos: number[] | null }

const db = supabase as unknown as {
  from: (t: string) => { select: (c: string) => { eq: (k: string, v: boolean) => { order: (c: string, o: { ascending: boolean }) => { limit: (n: number) => Promise<{ data: unknown[] | null }> } } } };
  rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown[] | null }>;
};

export default function NovedadesFranja() {
  const [lista, setLista] = useState<Corta[]>([]);
  const [cuentas, setCuentas] = useState<Record<string, Cuenta>>({});

  useEffect(() => {
    let vivo = true;
    db.from('comunicados')
      .select('id, titulo, cuerpo, imagen_url, video_url, categoria, fijado, created_at, encuesta_opciones')
      .eq('publico', true).order('created_at', { ascending: false }).limit(12)
      .then(async ({ data }) => {
        if (!vivo) return;
        const filas = ordenarComunicados((data ?? []) as Corta[]).slice(0, 3);
        setLista(filas);
        if (!filas.length) return;
        const { data: k } = await db.rpc('comunicados_publicos_interaccion', { p_ids: filas.map(f => f.id) });
        if (!vivo) return;
        const m: Record<string, Cuenta> = {};
        for (const x of (k ?? []) as Cuenta[]) m[x.comunicado_id] = x;
        setCuentas(m);
      });
    return () => { vivo = false; };
  }, []);

  if (!lista.length) return null;

  return (
    <section className="max-w-[1200px] mx-auto px-6 md:px-8 pb-16 md:pb-20" aria-label="Novedades de la comunidad">
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <p className="uppercase tracking-[0.3em] text-xs font-semibold mb-3" style={{ color: '#8a6a00' }}>Lo que pasa en XPEAK</p>
          <h2 className="text-2xl md:text-4xl font-black tracking-tight font-display" style={{ color: '#111' }}>Novedades de la comunidad</h2>
        </div>
        <Link to="/novedades" className="hidden sm:inline-flex items-center gap-1 text-sm font-bold shrink-0" style={{ color: '#8a6a00' }}>
          Ver todas <ChevronRight size={15} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {lista.map(n => {
          const resumen = resumenSinTitulo(n.cuerpo, n.titulo);
          const k = cuentas[n.id];
          return (
            <Link key={n.id} to={`/novedades/${slugNovedad(n.titulo, n.id)}`}
              className="group rounded-2xl overflow-hidden flex flex-col transition-all hover:shadow-lg"
              style={{ background: '#fff', border: '1px solid rgba(212,175,55,0.3)' }}>
              <div className="aspect-[16/9] w-full" style={{ background: '#FBF3DD' }}><Portada c={n} /></div>
              <div className="p-4 space-y-1.5 flex-1 flex flex-col">
                <MetaComunicado c={n} />
                <TituloComunicado className="text-base line-clamp-2 group-hover:underline underline-offset-2">{n.titulo}</TituloComunicado>
                {resumen && <p className="text-sm leading-[1.4] line-clamp-3" style={{ color: '#4b5563' }}>{resumen}</p>}
                <div className="pt-1 mt-auto">
                  <StatsComunicado c={n} i={k ? { comunicado_id: k.comunicado_id, likes: k.likes, comentarios: k.comentarios, yo_like: false, mi_voto: null, votos: k.votos } : undefined} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="sm:hidden mt-5 text-center">
        <Link to="/novedades" className="inline-flex items-center gap-1 text-sm font-bold" style={{ color: '#8a6a00' }}>
          Ver todas las novedades <ChevronRight size={15} />
        </Link>
      </div>
    </section>
  );
}
