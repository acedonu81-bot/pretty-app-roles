import { useState, useEffect } from 'react';
import { Heart, Users, DollarSign, TrendingUp, Crown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';

interface FanSub {
  id: string;
  fan_id: string;
  status: string;
  amount: number;
  created_at: string;
}

const FanClubView = () => {
  const { user } = useAuth();
  const profile = useProfile();
  const [fans, setFans] = useState<FanSub[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const loadFans = async () => {
      // Get the user's profile id first
      const { data: prof } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      if (!prof) { setLoading(false); return; }

      const { data } = await supabase
        .from('fan_subscriptions' as any)
        .select('*')
        .eq('professional_profile_id', prof.id)
        .eq('status', 'active');
      setFans((data as any[]) ?? []);
      setLoading(false);
    };
    loadFans();
  }, [user]);

  const totalRevenue = fans.reduce((s, f) => s + Number(f.amount), 0);
  const professionalShare = totalRevenue * 0.8;
  const platformFee = totalRevenue * 0.2;

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">
          Fan <span className="text-gradient">Club</span>
        </h2>
        <p className="text-base text-muted-foreground">
          Gestiona tus suscriptores y visualiza tus ingresos.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="glass-panel p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(212,175,55,0.1)' }}>
              <Users size={20} style={{ color: '#D4AF37' }} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Fans Activos</p>
              <p className="text-2xl font-black" style={{ color: '#D4AF37' }}>{fans.length}</p>
            </div>
          </div>
        </div>

        <div className="glass-panel p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(34,197,94,0.1)' }}>
              <DollarSign size={20} style={{ color: '#22c55e' }} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Ingresos Mensuales</p>
              <p className="text-2xl font-black" style={{ color: '#22c55e' }}>€{totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="glass-panel p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(212,175,55,0.1)' }}>
              <TrendingUp size={20} style={{ color: '#D4AF37' }} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Tu Parte (80%)</p>
              <p className="text-2xl font-black" style={{ color: '#D4AF37' }}>€{professionalShare.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="glass-panel p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.05)' }}>
              <Crown size={20} className="text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Comisión XPEAK (20%)</p>
              <p className="text-2xl font-black text-muted-foreground">€{platformFee.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue breakdown */}
      <div className="glass-panel p-5 mb-6">
        <h4 className="text-base font-bold mb-4 flex items-center gap-2">
          <Heart size={16} style={{ color: '#D4AF37' }} />
          Detalle de Ingresos
        </h4>
        <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--nightlife-border)' }}>
          <div className="grid grid-cols-3 gap-0 text-xs font-bold p-3"
            style={{ background: 'rgba(212,175,55,0.06)', borderBottom: '1px solid var(--nightlife-border)' }}>
            <span>Concepto</span>
            <span className="text-center">Porcentaje</span>
            <span className="text-right">Importe</span>
          </div>
          <div className="grid grid-cols-3 gap-0 text-sm p-3" style={{ borderBottom: '1px solid var(--nightlife-border)' }}>
            <span>Suscripciones de fans</span>
            <span className="text-center">100%</span>
            <span className="text-right font-bold">€{totalRevenue.toFixed(2)}</span>
          </div>
          <div className="grid grid-cols-3 gap-0 text-sm p-3" style={{ borderBottom: '1px solid var(--nightlife-border)' }}>
            <span style={{ color: '#22c55e' }}>Tu parte neta</span>
            <span className="text-center" style={{ color: '#22c55e' }}>80%</span>
            <span className="text-right font-bold" style={{ color: '#22c55e' }}>€{professionalShare.toFixed(2)}</span>
          </div>
          <div className="grid grid-cols-3 gap-0 text-sm p-3">
            <span className="text-muted-foreground">Comisión plataforma</span>
            <span className="text-center text-muted-foreground">20%</span>
            <span className="text-right text-muted-foreground">€{platformFee.toFixed(2)}</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3 italic">
          Los pagos se procesan mediante Stripe Connect. La liquidación se realiza automáticamente cada mes.
        </p>
      </div>

      {/* Fans list */}
      <div className="glass-panel p-5">
        <h4 className="text-base font-bold mb-4">Mis Fans</h4>
        {loading ? (
          <p className="text-sm text-muted-foreground text-center py-8 animate-pulse">Cargando...</p>
        ) : fans.length === 0 ? (
          <div className="text-center py-10">
            <Heart size={40} className="mx-auto mb-3 text-muted-foreground opacity-30" />
            <p className="text-sm text-muted-foreground mb-2">Aún no tienes suscriptores</p>
            <p className="text-xs text-muted-foreground">
              Cuando los fans se suscriban a tu perfil por 4,99 €/mes, aparecerán aquí.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {fans.map((f) => (
              <div key={f.id} className="flex items-center justify-between p-3 rounded-lg"
                style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.1)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #D4AF37, #B8941E)', color: '#000' }}>
                    <Heart size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Fan #{f.fan_id.slice(0, 8)}</p>
                    <p className="text-xs text-muted-foreground">
                      Desde {new Date(f.created_at).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-bold" style={{ color: '#22c55e' }}>€{Number(f.amount).toFixed(2)}/mes</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stripe Connect CTA */}
      <div className="glass-panel p-5 mt-6 text-center">
        <Crown size={32} className="mx-auto mb-3" style={{ color: '#D4AF37' }} />
        <h4 className="text-base font-bold mb-2">Stripe Connect</h4>
        <p className="text-sm text-muted-foreground mb-4">
          Conecta tu cuenta de Stripe para recibir pagos automáticos de tus fans.
        </p>
        <button className="px-6 py-3 rounded-lg font-bold text-sm"
          style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }}
          onClick={() => {}}>
          Próximamente
        </button>
      </div>
    </div>
  );
};

export default FanClubView;
