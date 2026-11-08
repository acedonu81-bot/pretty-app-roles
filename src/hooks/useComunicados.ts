import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { type Comunicado, type Interaccion, ordenarComunicados } from '@/lib/comunicados';

// Comunicados vigentes del usuario + lo que ya ha leído + sus contadores
// (me gusta, comentarios, votos). La RLS ya filtra por categoría y caducidad.
// Lo comparten el carrusel de Inicio y la página del tablón.

// Tablas nuevas aún sin tipos generados.
const db = supabase as unknown as {
  rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown[] | null }>;
  from: (t: string) => {
    select: (c: string) => {
      order: (c: string, o: { ascending: boolean }) => { limit: (n: number) => Promise<{ data: unknown[] | null }> };
      eq: (k: string, v: string) => Promise<{ data: unknown[] | null }>;
    };
    upsert: (row: Record<string, unknown>, o: { onConflict: string; ignoreDuplicates: boolean }) => Promise<unknown>;
  };
};

const COLUMNAS = 'id, titulo, cuerpo, imagen_url, video_url, cta_texto, cta_url, categoria, tipo, push, fijado, caduca_at, destinatarios, created_at, publico, comentarios_on, encuesta_pregunta, encuesta_opciones, encuesta_cierra_at';

export function useComunicados(limite = 30) {
  const { user } = useAuth();
  const [lista, setLista] = useState<Comunicado[]>([]);
  const [leidos, setLeidos] = useState<Set<string>>(new Set());
  const [inter, setInter] = useState<Record<string, Interaccion>>({});
  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    let vivo = true;
    (async () => {
      const [{ data }, { data: lect }] = await Promise.all([
        db.from('comunicados').select(COLUMNAS).order('created_at', { ascending: false }).limit(limite),
        db.from('comunicado_lecturas').select('comunicado_id').eq('user_id', user.id),
      ]);
      if (!vivo) return;
      // El admin ve también los caducados (para gestionarlos); aquí no.
      const ahora = Date.now();
      setLista(ordenarComunicados(((data ?? []) as Comunicado[]).filter(c => new Date(c.caduca_at).getTime() > ahora)));
      setLeidos(new Set(((lect ?? []) as { comunicado_id: string }[]).map(l => l.comunicado_id)));
      setCargado(true);
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
  }, [user?.id, limite]);

  const marcarLeido = useCallback((c: Pick<Comunicado, 'id'>) => {
    if (!user?.id || leidos.has(c.id)) return;
    setLeidos(s => new Set(s).add(c.id));
    // El constructor de supabase-js es perezoso: sin .then() la petición NO sale.
    // Así estuvo 6-7 nov 2026: 0 lecturas guardadas aunque hubiera me gusta y comentarios.
    void Promise.resolve(
      db.from('comunicado_lecturas').upsert({ comunicado_id: c.id, user_id: user.id }, { onConflict: 'comunicado_id,user_id', ignoreDuplicates: true }),
    ).catch(() => { /* si falla, se reintenta la próxima vez que lo abra */ });
  }, [user?.id, leidos]);

  return { lista, leidos, inter, setInter, marcarLeido, cargado };
}
