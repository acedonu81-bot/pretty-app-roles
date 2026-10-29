import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Respuestas a "¿Qué es lo que más te falta o te ha frenado?" (feedback_web,
// 26 oct 2026). Solo lectura: la RLS ya deja leer solo al admin. El nombre se
// busca aparte porque el particular lo envía sin cuenta y user_id va vacío.

interface Respuesta {
  id: number;
  created_at: string;
  user_id: string | null;
  rol: string | null;
  momento: string;
  path: string | null;
  texto: string;
}

const MOMENTOS: Record<string, string> = {
  dashboard: 'Tarjeta del panel',
  enlace: 'Enlace "Danos tu opinión"',
  recursos: 'Final de Recursos',
  solicitud: 'Tras enviar su solicitud',
};

const fecha = (iso: string) => new Date(iso).toLocaleString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

export default function AdminFeedbackWeb() {
  const [respuestas, setRespuestas] = useState<Respuesta[] | null>(null);
  const [nombres, setNombres] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const { data } = await supabase
        .from('feedback_web')
        .select('id, created_at, user_id, rol, momento, path, texto')
        .order('created_at', { ascending: false })
        .limit(300);
      if (cancelled) return;
      const filas = (data as Respuesta[]) ?? [];
      setRespuestas(filas);
      const ids = [...new Set(filas.map(f => f.user_id).filter((id): id is string => !!id))];
      if (ids.length === 0) return;
      const { data: perfiles } = await (supabase.from('profiles') as any)
        .select('user_id, display_name')
        .in('user_id', ids);
      if (cancelled) return;
      setNombres(Object.fromEntries(((perfiles as { user_id: string; display_name: string | null }[]) ?? [])
        .map(p => [p.user_id, p.display_name || 'Sin nombre'])));
    };
    load();
    return () => { cancelled = true; };
  }, []);

  if (!respuestas) return null;

  return (
    <div className="rounded-2xl p-5 bg-white border" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
      <p className="text-base font-extrabold mb-1" style={{ color: '#1f2937' }}>Lo que nos dicen los usuarios</p>
      <p className="text-xs mb-4" style={{ color: '#4b5563' }}>
        Respuestas a "¿Qué es lo que más te falta o te ha frenado?". Los emails y teléfonos se quitan antes de guardar.
      </p>

      {respuestas.length === 0 ? (
        <p className="text-sm" style={{ color: '#6b7280' }}>Todavía no ha escrito nadie.</p>
      ) : (
        <ul className="space-y-3">
          {respuestas.map(r => (
            <li key={r.id} className="rounded-xl p-3 border" style={{ borderColor: 'rgba(0,0,0,0.06)', background: 'rgba(0,0,0,0.015)' }}>
              <p className="text-sm whitespace-pre-wrap break-words" style={{ color: '#111' }}>{r.texto}</p>
              <p className="text-xs mt-2 flex flex-wrap gap-x-2 gap-y-0.5" style={{ color: '#6b7280' }}>
                <span className="tabular-nums">{fecha(r.created_at)}</span>
                <span>· <b style={{ color: '#374151' }}>{r.user_id ? (nombres[r.user_id] ?? 'Usuario') : 'Sin cuenta'}</b></span>
                {r.rol && <span>· {r.rol}</span>}
                <span>· {MOMENTOS[r.momento] ?? r.momento}</span>
                {r.path && <span>· {r.path}</span>}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
