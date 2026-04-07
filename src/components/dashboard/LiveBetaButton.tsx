import { useState, useEffect } from 'react';
import { Video } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const GOAL = 50;

const LiveBetaButton = () => {
  const [loading, setLoading] = useState(false);
  const [requested, setRequested] = useState(false);
  const [totalCount, setTotalCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchCount = async () => {
      const { count } = await supabase
        .from('feature_requests')
        .select('*', { count: 'exact', head: true })
        .eq('feature_name', 'live_video');
      setTotalCount(count ?? 0);
    };
    fetchCount();
  }, [requested]);

  const goalReached = totalCount !== null && totalCount >= GOAL;

  const handleRequest = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error('Debes iniciar sesión'); setLoading(false); return; }

    const { error } = await supabase.from('feature_requests').insert({
      user_id: user.id,
      feature_name: 'live_video',
    });

    if (error) {
      if (error.code === '23505') toast.info('Ya solicitaste acceso a Vídeo en Directo');
      else toast.error('Error al enviar solicitud');
    } else {
      toast.success('¡Gracias! Te avisaremos por email cuando esté disponible.');
      if (user.email) {
        supabase.functions.invoke('send-email', {
          body: { type: 'feature_request', data: { email: user.email, feature: 'Vídeo en Directo (Fase Beta)' } },
        }).catch((err: unknown) => console.warn('[LiveBeta] email send failed:', err));
      }
    }
    setRequested(true);
    setLoading(false);
  };

  const label = goalReached
    ? 'Vídeo en Directo (Próximamente – Reserva tu plaza)'
    : requested
      ? 'Solicitud Enviada ✓'
      : 'Habilitar Vídeo en Directo (Fase Beta)';

  return (
    <button
      onClick={handleRequest}
      disabled={loading || requested || goalReached}
      className="group w-full flex items-center gap-3 px-5 py-4 rounded-xl text-sm font-bold transition-all duration-300 disabled:opacity-60"
      style={{
        background: '#0A0A0A',
        border: '1px solid rgba(212,175,55,0.35)',
        color: '#D4AF37',
      }}
      onMouseEnter={e => { if (!requested && !goalReached) (e.currentTarget.style.boxShadow = '0 0 20px rgba(212,175,55,0.2), inset 0 0 20px rgba(212,175,55,0.05)'); }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
    >
      <Video size={20} />
      <span className="flex-1 text-left">{label}</span>
      {!requested && !goalReached && (
        <span className="text-[0.6rem] px-2.5 py-1 rounded-full font-bold tracking-wider"
          style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.2)' }}>
          BETA
        </span>
      )}
    </button>
  );
};

export default LiveBetaButton;
