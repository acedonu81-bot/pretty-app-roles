import { useEffect, useState } from 'react';
import { Eye, MessageCircle, Crown, TrendingUp, Zap, Trophy, Star } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { subscriptionPlans, mapSubscriptionTierToPlan } from '@/lib/subscriptions';

const FEATURED_SLOTS = 48;

const StatsView = () => {
  const profile = useProfile();
  const { user } = useAuth();
  const currentPlan = subscriptionPlans.find(p => p.id === mapSubscriptionTierToPlan(profile.subscription_tier));

  const [stats, setStats] = useState({ views: 0, messages: 0, bookings: 0, conversations: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [scoreRes, convsRes, bookingsRes] = await Promise.all([
        // Profile views stored as score
        supabase.from('profiles').select('score').eq('user_id', user.id).maybeSingle(),
        // Conversations count
        supabase.from('conversations')
          .select('id', { count: 'exact', head: true })
          .or(`participant_a.eq.${user.id},participant_b.eq.${user.id}`),
        // Incoming flash booking requests
        supabase.from('flash_bookings' as any)
          .select('id', { count: 'exact', head: true })
          .eq('professional_user_id', user.id),
      ]);

      // Messages received in conversations where I'm a participant
      let msgCount = 0;
      const { data: myConvs } = await supabase.from('conversations')
        .select('id')
        .or(`participant_a.eq.${user.id},participant_b.eq.${user.id}`)
        .limit(100);
      if (myConvs && myConvs.length > 0) {
        const convIds = myConvs.map(c => c.id);
        const { count } = await supabase.from('messages')
          .select('id', { count: 'exact', head: true })
          .in('conversation_id', convIds)
          .neq('sender_id', user.id);
        msgCount = count ?? 0;
      }

      setStats({
        views: (scoreRes.data?.score as number) ?? 0,
        messages: msgCount,
        bookings: bookingsRes.count ?? 0,
        conversations: convsRes.count ?? 0,
      });
      setLoading(false);
    };
    load();
  }, [user]);

  const contactRate = stats.views > 0 ? Math.round((stats.conversations / stats.views) * 100) : 0;

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="mb-5">
        <h2 className="text-2xl font-bold mb-1">
          Mis <span className="text-gradient">Estadísticas</span>
        </h2>
        <p className="text-sm text-muted-foreground">Métricas de rendimiento de tu perfil en el directorio.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Visualizaciones', value: loading ? '—' : stats.views.toString(), icon: Eye, note: 'visitas a tu perfil' },
          { label: 'Mensajes recibidos', value: loading ? '—' : stats.messages.toString(), icon: MessageCircle, note: 'de otros usuarios' },
          { label: 'Solicitudes Flash', value: loading ? '—' : stats.bookings.toString(), icon: Zap, note: 'booking requests' },
          { label: 'Tasa de contacto', value: loading ? '—' : `${contactRate}%`, icon: TrendingUp, note: 'vistas que escriben' },
        ].map(s => (
          <div key={s.label} className="glass-panel p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[0.6rem] text-muted-foreground font-bold uppercase tracking-wider">{s.label}</span>
              <s.icon size={14} style={{ color: '#D4AF37' }} />
            </div>
            <div className="text-2xl font-bold mb-1">{s.value}</div>
            <span className="text-[0.6rem] font-semibold text-muted-foreground">{s.note}</span>
          </div>
        ))}
      </div>

      {/* Podio */}
      <div className="glass-panel p-5 mb-6 overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(212,175,55,0.06) 0%, transparent 70%)' }} />
        <div className="flex items-center gap-2 mb-1 relative">
          <Trophy size={16} style={{ color: '#D4AF37' }} />
          <h3 className="text-sm font-bold">Pole Position</h3>
          <span className="text-[0.55rem] font-bold px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(212,175,55,0.12)', color: '#D4AF37' }}>ESTA SEMANA</span>
        </div>
        <p className="text-xs text-muted-foreground mb-6 relative">
          El ranking se calcula con usuarios reales cuando haya suficiente actividad.
        </p>
        <div className="flex items-end justify-center gap-4 relative" style={{ height: 180 }}>
          {[
            { rank: 2, height: 90, color: '#A0A0B0', badge: '🥈' },
            { rank: 1, height: 130, color: '#D4AF37', badge: '🥇' },
            { rank: 3, height: 70, color: '#CD7F32', badge: '🥉' },
          ].map(p => (
            <div key={p.rank} className="flex flex-col items-center gap-2 flex-1">
              <span className="text-2xl">{p.badge}</span>
              <div className="text-center mb-1">
                <p className="text-[0.55rem] text-muted-foreground">Sin datos aún</p>
              </div>
              <div className="w-full rounded-t-lg flex items-center justify-center"
                style={{
                  height: p.height,
                  background: `linear-gradient(180deg, ${p.color}15, ${p.color}05)`,
                  border: `1px solid ${p.color}30`,
                  borderBottom: 'none',
                }}>
                <span className="text-xl font-black" style={{ color: `${p.color}60` }}>#{p.rank}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[0.55rem] text-muted-foreground text-center mt-4 relative">
          Actualizado cada lunes. Necesitas plan Business o Agencia para entrar al top.
        </p>
      </div>

      {/* Posiciones destacadas */}
      <div className="glass-panel p-5 mb-6">
        <h3 className="text-sm font-bold mb-1">Posiciones Destacadas <span className="text-muted-foreground font-normal text-xs">(#1 – #48)</span></h3>
        <p className="text-xs text-muted-foreground mb-4">
          Las primeras 48 posiciones son para perfiles Business y Agencia. Mejora tu plan para aparecer aquí.
        </p>
        <div className="grid grid-cols-6 sm:grid-cols-8 gap-1">
          {Array.from({ length: FEATURED_SLOTS }, (_, i) => (
            <div key={i} className="aspect-square rounded flex items-center justify-center text-[0.5rem] font-bold"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--nightlife-border)',
                color: 'var(--nightlife-text-secondary)',
              }}>
              {`#${i + 1}`}
            </div>
          ))}
        </div>
        <p className="text-[0.6rem] text-muted-foreground mt-3">Rotación cada 60 minutos. Activa un plan de pago para mejorar tu posición.</p>
      </div>

      {/* Nota sobre visualizaciones */}
      <div className="glass-panel p-4 mb-6 flex items-start gap-3"
        style={{ border: '1px solid rgba(212,175,55,0.12)', background: 'rgba(212,175,55,0.02)' }}>
        <Eye size={14} style={{ color: '#D4AF37', flexShrink: 0, marginTop: 2 }} />
        <div>
          <p className="text-xs font-bold mb-0.5" style={{ color: '#D4AF37' }}>Sobre el contador de visualizaciones</p>
          <p className="text-[0.6rem] text-muted-foreground leading-relaxed">
            Las visitas se registran cuando alguien accede a tu perfil público en xpeak.site/p/
            Los demás datos (mensajes, solicitudes) son en tiempo real desde Supabase.
          </p>
        </div>
      </div>

      {/* Plan actual */}
      <div className="glass-panel p-5">
        <h3 className="text-sm font-bold mb-3">Plan actual</h3>
        <div className="flex items-center gap-3 p-3 rounded-lg"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--nightlife-border)' }}>
          <Crown size={20} style={{ color: currentPlan?.monthlyPrice ? '#D4AF37' : '#8E8EA0' }} />
          <div className="flex-1">
            <p className="text-sm font-bold">
              {currentPlan?.name ?? 'Free'} · {currentPlan?.monthlyPrice === 0 ? 'Gratis' : `${currentPlan?.monthlyPrice?.toFixed(2).replace('.', ',')}€/mes`}
            </p>
            <p className="text-xs text-muted-foreground">{currentPlan?.features[0] ?? 'Perfil visible en el directorio con funciones básicas.'}</p>
          </div>
          <span className="text-[0.55rem] font-bold px-2 py-1 rounded"
            style={{ background: 'rgba(255,255,255,0.05)', color: '#8E8EA0' }}>ACTIVO</span>
        </div>
      </div>
    </div>
  );
};

export default StatsView;
