import { useState } from 'react';
import { Video } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const LiveBetaButton = () => {
  const [loading, setLoading] = useState(false);
  const [requested, setRequested] = useState(false);

  const handleRequest = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error('Debes iniciar sesión'); setLoading(false); return; }

    const { error } = await supabase.from('feature_requests' as any).insert({
      user_id: user.id,
      feature_name: 'live_video',
    });

    if (error) {
      if (error.code === '23505') toast.info('Ya solicitaste acceso a Vídeo en Directo');
      else toast.error('Error al enviar solicitud');
    } else {
      toast.success('Tu perfil ha sido priorizado para la fase de vídeo. Te avisaremos por email.');
    }
    setRequested(true);
    setLoading(false);
  };

  return (
    <button
      onClick={handleRequest}
      disabled={loading || requested}
      className="group w-full flex items-center gap-3 px-5 py-4 rounded-xl text-sm font-bold transition-all duration-300 disabled:opacity-60"
      style={{
        background: '#0A0A0A',
        border: '1px solid rgba(212,175,55,0.35)',
        color: '#D4AF37',
        boxShadow: requested ? 'none' : '0 0 0 0 rgba(212,175,55,0)',
      }}
      onMouseEnter={e => { if (!requested) (e.currentTarget.style.boxShadow = '0 0 20px rgba(212,175,55,0.2), inset 0 0 20px rgba(212,175,55,0.05)'); }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
    >
      <Video size={20} />
      <span className="flex-1 text-left">
        {requested ? 'Solicitud Enviada ✓' : 'Habilitar Vídeo en Directo (Fase Beta)'}
      </span>
      {!requested && (
        <span className="text-[0.6rem] px-2.5 py-1 rounded-full font-bold tracking-wider"
          style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.2)' }}>
          BETA
        </span>
      )}
    </button>
  );
};

export default LiveBetaButton;
