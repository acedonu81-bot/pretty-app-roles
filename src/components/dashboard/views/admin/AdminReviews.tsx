import { useState, useEffect } from 'react';
import { Star, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PendingReview {
  id: string;
  reviewer_name: string;
  reviewer_role: string;
  event_type: string | null;
  rating: number;
  comment: string;
  created_at: string;
  reviewed_user_id: string;
  professional_name?: string;
}

const AdminReviews = () => {
  const [reviews, setReviews] = useState<PendingReview[]>([]);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('id, reviewer_name, reviewer_role, event_type, rating, comment, created_at, reviewed_user_id')
      .eq('approved', false)
      .order('created_at', { ascending: true });
    if (error) { toast.error('Error al cargar reseñas pendientes'); return; }
    const rows = (data ?? []) as PendingReview[];

    const userIds = [...new Set(rows.map(r => r.reviewed_user_id).filter(Boolean))];
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, display_name')
        .in('user_id', userIds);
      const nameMap = new Map((profiles ?? []).map(p => [p.user_id, p.display_name]));
      rows.forEach(r => { r.professional_name = nameMap.get(r.reviewed_user_id) || 'Desconocido'; });
    }

    setReviews(rows);
  };

  const handleAction = async (id: string, approve: boolean) => {
    if (approve) {
      const { error } = await supabase.from('reviews').update({ approved: true } as any).eq('id', id);
      if (error) { toast.error('Error al aprobar'); return; }
      toast.success('Reseña aprobada y visible');
    } else {
      // Rechazar BORRA la reseña de forma definitiva: no hay papelera ni forma
      // de recuperarla, y quien la escribió no puede volver a dejarla. Las
      // otras dos acciones destructivas del panel (bajas y códigos promo) ya
      // confirmaban; esta no, así que un clic de más en el botón equivocado
      // destruía la reseña de un profesional sin remedio.
      if (!confirm('¿Eliminar esta reseña? Se borra de forma definitiva y no se puede recuperar.')) return;
      const { error } = await supabase.from('reviews').delete().eq('id', id);
      if (error) { toast.error('Error al eliminar'); return; }
      toast.success('Reseña eliminada');
    }
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="glass-panel p-5 mb-6">
      <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
        <MessageSquare size={14} style={{ color: '#8A6D0F' }} />
        Reseñas Pendientes
        {reviews.length > 0 && (
          <span className="text-[0.75rem] px-2 py-0.5 rounded-full font-bold"
            style={{ background: 'rgba(212,175,55,0.15)', color: '#8A6D0F' }}>
            {reviews.length}
          </span>
        )}
      </h3>

      {reviews.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-6">No hay reseñas pendientes de aprobación</p>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {reviews.map(r => (
            <div key={r.id} className="p-4 rounded-xl"
              style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.06)' }}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-bold" style={{ color: '#222' }}>
                    {r.reviewer_name}
                    <span className="font-normal text-xs ml-2" style={{ color: '#333' }}>
                      {r.reviewer_role}{r.event_type ? ` · ${r.event_type}` : ''}
                    </span>
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: '#333' }}>
                    Para: <span className="font-bold">{r.professional_name}</span>
                    {' · '}{new Date(r.created_at).toLocaleDateString('es-ES')}
                  </p>
                </div>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(n => (
                    <Star key={n} size={12}
                      fill={n <= r.rating ? '#D4AF37' : 'none'}
                      stroke={n <= r.rating ? '#D4AF37' : 'rgba(22,20,18,0.2)'}
                      strokeWidth={1.5} />
                  ))}
                </div>
              </div>
              <p className="text-sm mb-3 leading-relaxed" style={{ color: '#222' }}>
                "{r.comment}"
              </p>
              <div className="flex gap-2">
                <button onClick={() => handleAction(r.id, true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105"
                  style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e' }}>
                  <CheckCircle size={11} /> Aprobar
                </button>
                <button onClick={() => handleAction(r.id, false)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105"
                  style={{ background: 'rgba(255,95,86,0.08)', border: '1px solid rgba(255,95,86,0.2)', color: '#ff5f56' }}>
                  <XCircle size={11} /> Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
