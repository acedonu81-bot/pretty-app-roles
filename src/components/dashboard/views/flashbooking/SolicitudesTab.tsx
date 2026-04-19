import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, Clock, Calendar, MapPin, User, RefreshCw, Phone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface Solicitud {
  id: string;
  requester_name: string | null;
  requester_contact: string | null;
  event_date: string | null;
  event_location: string | null;
  event_description: string | null;
  status: string | null;
  created_at: string | null;
}

const STATUS: Record<string, { label: string; color: string; bg: string }> = {
  pending:   { label: 'Pendiente',  color: '#D4AF37', bg: 'rgba(212,175,55,0.08)' },
  confirmed: { label: 'Aceptada',   color: '#22c55e', bg: 'rgba(34,197,94,0.08)' },
  completed: { label: 'Completada', color: '#22c55e', bg: 'rgba(34,197,94,0.08)' },
  cancelled: { label: 'Rechazada',  color: '#ff5f56', bg: 'rgba(255,95,86,0.08)' },
};

const fmt = (iso: string | null) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
};

const SolicitudesTab = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('flash_bookings' as any)
      .select('id, requester_name, requester_contact, event_date, event_location, event_description, status, created_at')
      .eq('professional_user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);
    setLoading(false);
    if (error) { toast.error('Error al cargar solicitudes'); return; }
    setItems((data ?? []) as Solicitud[]);
  }, [user]);

  useEffect(() => { fetch(); }, [fetch]);

  const updateStatus = async (id: string, status: 'confirmed' | 'cancelled') => {
    setUpdating(id);
    const { error } = await supabase
      .from('flash_bookings' as any)
      .update({ status })
      .eq('id', id);
    setUpdating(null);
    if (error) { toast.error('Error al actualizar'); return; }
    setItems(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    toast.success(status === 'confirmed' ? '¡Solicitud aceptada!' : 'Solicitud rechazada');
  };

  const pending = items.filter(i => i.status === 'pending').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold">Solicitudes recibidas</span>
          {pending > 0 && (
            <span className="text-[0.75rem] font-black px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)' }}>
              {pending} pendiente{pending > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <button onClick={fetch} className="p-1.5 rounded-lg transition-all hover:scale-105"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--nightlife-border)', color: '#8E8EA0' }}>
          <RefreshCw size={12} />
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <p className="text-xs text-muted-foreground animate-pulse">Cargando solicitudes…</p>
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="glass-panel p-10 flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.1)' }}>
            <Clock size={22} style={{ color: 'rgba(212,175,55,0.35)' }} />
          </div>
          <p className="text-sm font-bold">Sin solicitudes todavía</p>
          <p className="text-xs text-muted-foreground max-w-xs">
            Activa tu disponibilidad en la tab <strong>Oferta</strong> para que los empresarios puedan encontrarte y enviarte solicitudes.
          </p>
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="space-y-3">
          {items.map(s => {
            const st = STATUS[s.status ?? ''] ?? { label: s.status ?? '—', color: '#8E8EA0', bg: 'rgba(255,255,255,0.04)' };
            const isPending = s.status === 'pending';
            return (
              <div key={s.id} className="glass-panel p-4"
                style={{ border: isPending ? '1px solid rgba(212,175,55,0.2)' : '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.15)' }}>
                      <User size={15} style={{ color: '#D4AF37' }} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{s.requester_name || 'Empresario'}</p>
                      {s.requester_contact && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Phone size={9} /> {s.requester_contact}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2 py-1 rounded-full flex-shrink-0"
                    style={{ background: st.bg, color: st.color }}>
                    {st.label}
                  </span>
                </div>

                <div className="space-y-1.5 mb-3">
                  {s.event_date && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Calendar size={11} style={{ color: '#D4AF37', flexShrink: 0 }} />
                      {fmt(s.event_date)}
                    </p>
                  )}
                  {s.event_location && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <MapPin size={11} style={{ color: '#D4AF37', flexShrink: 0 }} />
                      {s.event_location}
                    </p>
                  )}
                  {s.event_description && (
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {s.event_description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[0.75rem] text-muted-foreground">{fmt(s.created_at)}</span>
                  {isPending && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateStatus(s.id, 'cancelled')}
                        disabled={updating === s.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105 disabled:opacity-50"
                        style={{ background: 'rgba(255,95,86,0.08)', border: '1px solid rgba(255,95,86,0.2)', color: '#ff5f56' }}>
                        <XCircle size={12} /> Rechazar
                      </button>
                      <button
                        onClick={() => updateStatus(s.id, 'confirmed')}
                        disabled={updating === s.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105 disabled:opacity-50"
                        style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                        <CheckCircle size={12} /> {updating === s.id ? '…' : 'Aceptar'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SolicitudesTab;
