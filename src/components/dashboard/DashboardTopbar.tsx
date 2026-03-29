import { Search, LogOut, Menu, Bell, Gift, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { getTrialDaysRemaining, isBirthdayToday, mapSubscriptionTierToPlan } from '@/lib/subscriptions';

interface TopbarProps {
  onMenuToggle?: () => void;
  isMobile?: boolean;
}

const DashboardTopbar = ({ onMenuToggle, isMobile }: TopbarProps) => {
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);
  const profile = useProfile();

  const trialDaysRemaining = useMemo(() => getTrialDaysRemaining(profile.trial_started_at), [profile.trial_started_at]);
  const birthdayOfferActive = useMemo(() => isBirthdayToday(profile.birthday), [profile.birthday]);
  const currentPlan = useMemo(() => mapSubscriptionTierToPlan(profile.subscription_tier), [profile.subscription_tier]);
  const showTrialNotice = currentPlan !== 'free';

  const trialLabel = trialDaysRemaining > 0
    ? `Te quedan ${trialDaysRemaining} ${trialDaysRemaining === 1 ? 'día' : 'días'} de acceso gratuito`
    : 'Tu periodo de prueba ha finalizado. Suscríbete al plan anual y ahorra un 30%.';

  const notifications = [
    ...(showTrialNotice ? [{
      title: trialDaysRemaining > 0 ? 'Prueba activa' : 'Prueba finalizada',
      desc: trialLabel,
      time: 'Ahora',
    }] : []),
    ...(birthdayOfferActive ? [{
      title: 'Descuento de cumpleaños',
      desc: 'Hoy tienes un 40% en la suscripción anual. Aprovecha la oferta.',
      time: 'Hoy',
    }] : []),
    { title: 'Nuevo contacto WhatsApp', desc: 'Club Onyx ha visto tu perfil y te ha contactado.', time: 'Hace 2 min' },
    { title: 'Flash Booking activado', desc: 'Tu perfil aparece como disponible ahora.', time: 'Hace 1 hora' },
  ];

  return (
    <header
      className="h-14 px-4 md:px-6 flex items-center justify-between sticky top-0 z-10 gap-3"
      style={{
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--nightlife-border)',
      }}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {isMobile && (
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-lg flex-shrink-0 transition-colors"
            style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', color: '#D4AF37' }}
          >
            <Menu size={20} />
          </button>
        )}

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg flex-1 max-w-[360px]" style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid var(--nightlife-border)',
        }}>
          <Search size={14} className="text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            placeholder={isMobile ? 'Buscar...' : 'Buscar por zona, rol o nombre...'}
            className="bg-transparent border-none outline-none text-foreground w-full text-xs"
          />
        </div>

        {showTrialNotice && (
          <div
            className="hidden lg:flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold border border-border bg-card/70 text-primary"
          >
            <Gift size={14} />
            <span>{trialLabel}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 relative flex-shrink-0">
        {showTrialNotice && (
          <div className="lg:hidden flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[0.65rem] font-semibold border border-border bg-card/70 text-primary">
            <Gift size={12} />
            <span>{trialDaysRemaining > 0 ? `${trialDaysRemaining} días gratis` : 'Prueba finalizada'}</span>
          </div>
        )}

        <button
          onClick={() => setShowNotif(!showNotif)}
          className="relative p-2 rounded-lg transition-all duration-200 hover:scale-105"
          style={{
            background: 'rgba(212,175,55,0.08)',
            border: '1px solid rgba(212,175,55,0.15)',
            color: '#D4AF37',
          }}
        >
          <Bell size={16} />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full" style={{ background: '#D4AF37' }} />
        </button>

        {showNotif && (
          <div className="glass-panel absolute top-12 right-0 w-[300px] z-50" style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.8)' }}>
            <div className="p-3 flex justify-between items-center" style={{ borderBottom: '1px solid var(--nightlife-border)' }}>
              <h4 className="text-xs font-bold">Notificaciones</h4>
              <span className="text-[0.6rem] cursor-pointer" style={{ color: '#D4AF37' }}>Marcar leídas</span>
            </div>
            <div className="max-h-60 overflow-y-auto">
              {notifications.map((n, i) => (
                <div key={i} className="px-3 py-2.5 flex gap-2 items-start cursor-pointer transition-colors hover:bg-white/5" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <div className="mt-1 flex-shrink-0" style={{ color: '#D4AF37' }}>
                    {n.title.includes('Prueba') ? <Gift size={12} /> : <Sparkles size={12} />}
                  </div>
                  <div>
                    <p className="text-xs font-semibold">{n.title}</p>
                    <p className="text-[0.65rem] text-muted-foreground">{n.desc}</p>
                    <span className="text-[0.55rem] text-muted-foreground mt-0.5 block">{n.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => navigate('/')}
          className="text-xs py-1.5 px-3 flex items-center gap-2 rounded-lg transition-colors"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--nightlife-border)', color: 'var(--nightlife-text-secondary)' }}
        >
          <LogOut size={13} /> {!isMobile && 'Salir'}
        </button>
      </div>
    </header>
  );
};

export default DashboardTopbar;
