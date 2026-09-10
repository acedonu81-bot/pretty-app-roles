import { useEffect, useState } from 'react';
import { MessageCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Resumen {
  conversation_id: string;
  participante_a: string;
  participante_b: string;
  total_mensajes: number;
  ultimo_mensaje: string;
  contratado: boolean;
}

const hace = (iso: string) => {
  const h = (Date.now() - new Date(iso).getTime()) / 3600000;
  if (h < 1) return 'hace un momento';
  if (h < 24) return `hace ${Math.round(h)} h`;
  return `hace ${Math.round(h / 24)} d`;
};

/**
 * Quién habla con quién, y si llegó a algo — sin leer lo que se dijeron.
 *
 * "¿Llegan a un acuerdo o qué?" (10 sep 2026). La pregunta era saber si el
 * sistema funciona, no auditar conversaciones privadas: se expone actividad
 * (nº de mensajes, cuándo fue el último) y si hay una contratación real
 * asociada a alguno de los dos participantes. El contenido de los mensajes
 * nunca sale de la tabla `messages` — admin_resumen_conversaciones() no lo
 * selecciona.
 */
const AdminConversations = () => {
  const [rows, setRows] = useState<Resumen[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (supabase.rpc as any)('admin_resumen_conversaciones').then(({ data, error }: any) => {
      if (!error) setRows((data as Resumen[]) ?? []);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <h3 className="text-sm font-black mb-1">Conversaciones</h3>
      <p className="text-xs text-muted-foreground mb-4">
        Quién habla con quién y si llegó a contratación. El contenido de los mensajes es privado.
      </p>

      {loading && <p className="text-xs text-muted-foreground animate-pulse">Cargando…</p>}

      {!loading && rows.length === 0 && (
        <p className="text-xs text-muted-foreground">Sin conversaciones activas todavía.</p>
      )}

      {!loading && rows.length > 0 && (
        <div className="flex flex-col gap-2">
          {rows.map(r => (
            <div key={r.conversation_id}
              className="flex items-center justify-between gap-3 px-3.5 py-3 rounded-xl"
              style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.06)' }}>
              <div className="flex items-center gap-2 min-w-0">
                <MessageCircle size={14} style={{ color: '#8A6D0F' }} className="flex-shrink-0" />
                <p className="text-sm font-bold truncate">
                  {r.participante_a} <span className="text-muted-foreground font-normal">↔</span> {r.participante_b}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                {r.contratado && (
                  <span className="flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(34,197,94,0.12)', color: '#16a34a' }}>
                    <CheckCircle2 size={10} /> CONTRATADO
                  </span>
                )}
                <span className="text-xs text-muted-foreground">{r.total_mensajes} msj</span>
                <span className="text-xs text-muted-foreground">{hace(r.ultimo_mensaje)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminConversations;
