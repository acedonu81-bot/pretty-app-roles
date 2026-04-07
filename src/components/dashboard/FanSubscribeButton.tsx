import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface Props {
  profileId: string;
  professionalName: string;
}

const FanSubscribeButton = ({ profileId, professionalName }: Props) => {
  const { user } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const check = async () => {
      const { data } = await supabase
        .from('fan_subscriptions')
        .select('id, status')
        .eq('fan_id', user.id)
        .eq('professional_profile_id', profileId)
        .eq('status', 'active')
        .maybeSingle();
      setIsSubscribed(!!data);
      setLoading(false);
    };
    check();
  }, [user, profileId]);

  const handleSubscribe = async () => {
    if (!user) { toast.error('Inicia sesión para suscribirte'); return; }
    // Stripe not connected yet — show coming soon
    toast.info('Pago con Stripe · Próximamente', {
      description: `La suscripción Fan Club de ${professionalName} costará 4,99 €/mes. Estamos integrando Stripe Connect.`,
    });
  };

  const handleUnsubscribe = async () => {
    if (!user) return;
    const { error } = await supabase
      .from('fan_subscriptions')
      .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
      .eq('fan_id', user.id)
      .eq('professional_profile_id', profileId);
    if (error) { toast.error('Error al cancelar la suscripción'); return; }
    setIsSubscribed(false);
    toast.success('Suscripción cancelada');
  };

  if (loading) return null;

  if (isSubscribed) {
    return (
      <button onClick={handleUnsubscribe}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all hover:opacity-80"
        style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }}>
        <Heart size={14} fill="#D4AF37" /> Fan Club · Suscrito
      </button>
    );
  }

  return (
    <button onClick={handleSubscribe}
      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
      style={{ background: 'linear-gradient(90deg, #D4AF37, #B8941E)', color: '#000' }}>
      <Heart size={14} /> Suscribirse · 4,99 €/mes
    </button>
  );
};

export default FanSubscribeButton;
