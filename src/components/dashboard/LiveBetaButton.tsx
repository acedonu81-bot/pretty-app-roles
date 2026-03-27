import { useState } from 'react';
import { Radio } from 'lucide-react';
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
      feature_name: 'live_video_beta',
    });

    if (error) {
      if (error.code === '23505') toast.info('Ya solicitaste acceso al Directo Beta');
      else toast.error('Error al enviar solicitud');
    } else {
      toast.success('¡Solicitud enviada! Te avisaremos cuando esté disponible.');
    }
    setRequested(true);
    setLoading(false);
  };

  return (
    <button
      onClick={handleRequest}
      disabled={loading || requested}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 disabled:opacity-60"
      style={{
        background: requested ? 'rgba(212,175,55,0.05)' : 'rgba(212,175,55,0.08)',
        border: '1px solid rgba(212,175,55,0.2)',
        color: '#D4AF37',
      }}
    >
      <Radio size={18} />
      <span className="flex-1 text-left">
        {requested ? 'Solicitud Enviada ✓' : 'Activar Vídeo en Directo (Beta)'}
      </span>
      {!requested && (
        <span className="text-[0.6rem] px-2 py-0.5 rounded-full font-bold"
          style={{ background: 'rgba(212,175,55,0.15)' }}>BETA</span>
      )}
    </button>
  );
};

export default LiveBetaButton;
