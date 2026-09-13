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

// Rejilla reutilizada por las tres secciones (Pendientes/Aprobadas/Denegadas):
// mismo layout, solo cambia el color de fondo y los botones de acción.
function ReviewCard({ r, bg, border, actions }: {
  r: PendingReview; bg: string; border: string; actions: React.ReactNode;
}) {
  return (
    <div className="p-4 rounded-xl" style={{ background: bg, border: `1px solid ${border}` }}>
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
      <p className="text-sm mb-3 leading-relaxed" style={{ color: '#222' }}>"{r.comment}"</p>
      <div className="flex gap-2">{actions}</div>
    </div>
  );
}

// Sección colapsable reutilizada por Aprobadas/Denegadas.
function CollapsibleSection({ title, icon, count, badgeBg, badgeColor, open, onToggle, children }: {
  title: string; icon: React.ReactNode; count: number; badgeBg: string; badgeColor: string;
  open: boolean; onToggle: () => void; children: React.ReactNode;
}) {
  return (
    <>
      <button onClick={onToggle}
        className="w-full flex items-center justify-between mt-5 pt-4 text-sm font-bold"
        style={{ borderTop: '1px solid rgba(0,0,0,0.06)', color: '#8A6D0F' }}>
        <span className="flex items-center gap-2">
          {icon}
          {title}
          {count > 0 && (
            <span className="text-[0.75rem] px-2 py-0.5 rounded-full font-bold" style={{ background: badgeBg, color: badgeColor }}>
              {count}
            </span>
          )}
        </span>
        <span style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>▾</span>
      </button>
      {open && children}
    </>
  );
}

const AdminReviews = () => {
  const [reviews, setReviews] = useState<PendingReview[]>([]);
  // Aprobar/denegar quitaba la reseña de la lista de pendientes y no había
  // ningún otro sitio del panel admin donde volver a verla — el admin lo
  // interpretaba como que se había "borrado" aunque siguiera intacta en la
  // base de datos (13 sep 2026).
  const [approved, setApproved] = useState<PendingReview[]>([]);
  const [rejected, setRejected] = useState<PendingReview[]>([]);
  const [showApproved, setShowApproved] = useState(false);
  const [showRejected, setShowRejected] = useState(false);

  useEffect(() => {
    fetchPending();
    fetchApproved();
    fetchRejected();
  }, []);

  const attachProfessionalNames = async (rows: PendingReview[]) => {
    const userIds = [...new Set(rows.map(r => r.reviewed_user_id).filter(Boolean))];
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, display_name')
        .in('user_id', userIds);
      const nameMap = new Map((profiles ?? []).map(p => [p.user_id, p.display_name]));
      rows.forEach(r => { r.professional_name = nameMap.get(r.reviewed_user_id) || 'Desconocido'; });
    }
    return rows;
  };

  const fetchPending = async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('id, reviewer_name, reviewer_role, event_type, rating, comment, created_at, reviewed_user_id')
      .eq('approved', false)
      .is('rejected_at', null)
      .order('created_at', { ascending: true });
    if (error) { toast.error('Error al cargar reseñas pendientes'); return; }
    setReviews(await attachProfessionalNames((data ?? []) as PendingReview[]));
  };

  const fetchApproved = async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('id, reviewer_name, reviewer_role, event_type, rating, comment, created_at, reviewed_user_id')
      .eq('approved', true)
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) return;
    setApproved(await attachProfessionalNames((data ?? []) as PendingReview[]));
  };

  const fetchRejected = async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('id, reviewer_name, reviewer_role, event_type, rating, comment, created_at, reviewed_user_id')
      .not('rejected_at', 'is', null)
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) return;
    setRejected(await attachProfessionalNames((data ?? []) as PendingReview[]));
  };

  const handleApprove = async (id: string) => {
    const { error } = await supabase.from('reviews').update({ approved: true } as any).eq('id', id);
    if (error) { toast.error('Error al aprobar'); return; }
    toast.success('Reseña aprobada y visible');
    const moved = reviews.find(r => r.id === id);
    setReviews(prev => prev.filter(r => r.id !== id));
    if (moved) setApproved(prev => [moved, ...prev]);
  };

  const handleReject = async (id: string) => {
    // Antes esto hacía DELETE definitivo: una reseña denegada desaparecía
    // sin dejar rastro, sin forma de auditar qué se rechazó ni por qué. Ahora
    // se marca rejected_at en vez de borrar — recuperable desde "Denegadas".
    if (!confirm('¿Denegar esta reseña? Dejará de estar pendiente y no será visible, pero queda guardada en "Denegadas".')) return;
    const { error } = await supabase.from('reviews').update({ rejected_at: new Date().toISOString() }).eq('id', id);
    if (error) { toast.error('Error al denegar'); return; }
    toast.success('Reseña denegada');
    const moved = reviews.find(r => r.id === id);
    setReviews(prev => prev.filter(r => r.id !== id));
    if (moved) setRejected(prev => [moved, ...prev]);
  };

  const handleUnapprove = async (id: string) => {
    if (!confirm('¿Quitar la aprobación? Volverá a la lista de pendientes y dejará de ser visible públicamente.')) return;
    const { error } = await supabase.from('reviews').update({ approved: false } as any).eq('id', id);
    if (error) { toast.error('Error al actualizar'); return; }
    const moved = approved.find(r => r.id === id);
    setApproved(prev => prev.filter(r => r.id !== id));
    if (moved) setReviews(prev => [...prev, moved]);
    toast.success('Reseña movida a pendientes');
  };

  const handleRestore = async (id: string) => {
    const { error } = await supabase.from('reviews').update({ rejected_at: null }).eq('id', id);
    if (error) { toast.error('Error al restaurar'); return; }
    const moved = rejected.find(r => r.id === id);
    setRejected(prev => prev.filter(r => r.id !== id));
    if (moved) setReviews(prev => [...prev, moved]);
    toast.success('Reseña restaurada a pendientes');
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
            <ReviewCard key={r.id} r={r} bg="rgba(0,0,0,0.02)" border="rgba(0,0,0,0.06)" actions={
              <>
                <button onClick={() => handleApprove(r.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105"
                  style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e' }}>
                  <CheckCircle size={11} /> Aprobar
                </button>
                <button onClick={() => handleReject(r.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105"
                  style={{ background: 'rgba(255,95,86,0.08)', border: '1px solid rgba(255,95,86,0.2)', color: '#ff5f56' }}>
                  <XCircle size={11} /> Denegar
                </button>
              </>
            } />
          ))}
        </div>
      )}

      <CollapsibleSection
        title="Reseñas Aprobadas" icon={<CheckCircle size={14} />} count={approved.length}
        badgeBg="rgba(34,197,94,0.12)" badgeColor="#16a34a"
        open={showApproved} onToggle={() => setShowApproved(v => !v)}>
        {approved.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-6">No hay reseñas aprobadas todavía</p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto mt-3">
            {approved.map(r => (
              <ReviewCard key={r.id} r={r} bg="rgba(34,197,94,0.03)" border="rgba(34,197,94,0.12)" actions={
                <button onClick={() => handleUnapprove(r.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105"
                  style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.1)', color: '#555' }}>
                  Quitar aprobación
                </button>
              } />
            ))}
          </div>
        )}
      </CollapsibleSection>

      <CollapsibleSection
        title="Reseñas Denegadas" icon={<XCircle size={14} />} count={rejected.length}
        badgeBg="rgba(255,95,86,0.12)" badgeColor="#ff5f56"
        open={showRejected} onToggle={() => setShowRejected(v => !v)}>
        {rejected.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-6">No hay reseñas denegadas</p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto mt-3">
            {rejected.map(r => (
              <ReviewCard key={r.id} r={r} bg="rgba(255,95,86,0.03)" border="rgba(255,95,86,0.12)" actions={
                <button onClick={() => handleRestore(r.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105"
                  style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.1)', color: '#555' }}>
                  Restaurar a pendientes
                </button>
              } />
            ))}
          </div>
        )}
      </CollapsibleSection>
    </div>
  );
};

export default AdminReviews;
