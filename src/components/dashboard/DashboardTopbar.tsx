import { Search, LogOut, Menu, Gift, Sparkles } from 'lucide-react';
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
  const [readAll, setReadAll] = useState(false);
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
    { title: 'Nuevo mensaje recibido', desc: 'Club Onyx ha visto tu perfil y te ha enviado un mensaje.', time: 'Hace 2 min' },
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
        {isMobile && (
          <button onClick={() => navigate('/')} className="font-bold tracking-wider text-base transition-opacity hover:opacity-70 flex-shrink-0">
            X<span style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>PEAK</span>
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
          <div className="lg:hidden flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold border border-border bg-card/70 text-primary">
            <Gift size={12} />
            <span>{trialDaysRemaining > 0 ? `${trialDaysRemaining} días gratis` : 'Prueba finalizada'}</span>
          </div>
        )}

        {/* Notification trigger — animated pulse orb */}
        <button
          onClick={() => setShowNotif(prev => !prev)}
          className="relative flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
          style={{ width: 40, height: 40 }}
          aria-label="Notificaciones"
        >
          {/* Outer glow rings — only when unread */}
          {!readAll && <>
            <span className="absolute inset-0 rounded-full animate-ping"
              style={{ background: 'rgba(212,175,55,0.15)', animationDuration: '1.8s' }} />
            <span className="absolute inset-[3px] rounded-full animate-ping"
              style={{ background: 'rgba(212,175,55,0.1)', animationDuration: '1.8s', animationDelay: '0.3s' }} />
          </>}

          {/* Core orb — gold when unread, muted when read */}
          <span className="relative flex items-center justify-center w-7 h-7 rounded-full transition-all duration-500"
            style={{
              background: readAll
                ? 'radial-gradient(circle at 40% 35%, rgba(120,120,140,0.5), rgba(80,80,100,0.4))'
                : showNotif
                  ? 'radial-gradient(circle at 40% 35%, #F5D77A, #D4AF37 60%, #B8941E)'
                  : 'radial-gradient(circle at 40% 35%, rgba(212,175,55,0.9), rgba(184,148,30,0.7))',
              boxShadow: readAll
                ? 'none'
                : showNotif
                  ? '0 0 16px rgba(212,175,55,0.7), 0 0 32px rgba(212,175,55,0.3), inset 0 1px 0 rgba(255,255,255,0.3)'
                  : '0 0 10px rgba(212,175,55,0.4), 0 0 20px rgba(212,175,55,0.15), inset 0 1px 0 rgba(255,255,255,0.25)',
            }}>
            <span className="text-[0.6rem] font-black" style={{ color: readAll ? 'rgba(255,255,255,0.3)' : '#000', lineHeight: 1 }}>
              {readAll ? '✓' : notifications.length}
            </span>
          </span>

          {/* Live dot — only when unread */}
          {!readAll && (
            <span className="absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full border border-black"
              style={{ background: '#22c55e', boxShadow: '0 0 6px rgba(34,197,94,0.8)' }} />
          )}
        </button>

        {showNotif && (
          <div
            className="absolute top-12 right-0 w-[320px] max-w-[calc(100vw-1rem)] z-50 rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(8,8,12,0.96)',
              border: '1px solid rgba(212,175,55,0.25)',
              boxShadow: '0 0 0 1px rgba(212,175,55,0.08), 0 20px 60px rgba(0,0,0,0.9), 0 0 40px rgba(212,175,55,0.07)',
              animation: 'fadeIn 0.18s ease',
            }}
          >
            {/* Header */}
            <div className="px-4 py-3 flex items-center justify-between"
              style={{ borderBottom: '1px solid rgba(212,175,55,0.12)', background: 'rgba(212,175,55,0.04)' }}>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />
                <span className="text-xs font-black tracking-wider" style={{ color: '#D4AF37' }}>NOTIFICACIONES</span>
                <span className="text-[0.55rem] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37' }}>
                  {notifications.length}
                </span>
              </div>
              <button onClick={() => { setReadAll(true); setShowNotif(false); }}
                className="text-[0.6rem] font-bold transition-colors hover:text-white"
                style={{ color: 'rgba(255,255,255,0.3)' }}>
                CERRAR
              </button>
            </div>

            {/* Items */}
            <div className="max-h-72 overflow-y-auto">
              {notifications.map((n, i) => (
                <div key={i}
                  className="px-4 py-3 flex gap-3 items-start cursor-pointer group transition-all"
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    background: i === 0 ? 'rgba(212,175,55,0.03)' : 'transparent',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(212,175,55,0.05)')}
                  onMouseLeave={e => (e.currentTarget.style.background = i === 0 ? 'rgba(212,175,55,0.03)' : 'transparent')}
                >
                  {/* Icon orb */}
                  <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5"
                    style={{
                      background: 'radial-gradient(circle at 35% 35%, rgba(212,175,55,0.3), rgba(184,148,30,0.1))',
                      border: '1px solid rgba(212,175,55,0.2)',
                    }}>
                    {n.title.includes('Prueba') || n.title.includes('cumpleaños')
                      ? <Gift size={12} style={{ color: '#D4AF37' }} />
                      : <Sparkles size={12} style={{ color: '#D4AF37' }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate">{n.title}</p>
                    <p className="text-[0.65rem] leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{n.desc}</p>
                    <span className="text-[0.55rem] font-bold mt-1 block" style={{ color: 'rgba(212,175,55,0.5)' }}>{n.time}</span>
                  </div>
                  {/* Unread indicator */}
                  {!readAll && (
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                      style={{ background: '#D4AF37', boxShadow: '0 0 4px rgba(212,175,55,0.6)' }} />
                  )}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 text-center" style={{ borderTop: '1px solid rgba(212,175,55,0.08)' }}>
              <button
                onClick={() => { setReadAll(true); setShowNotif(false); }}
                className="text-[0.6rem] font-bold tracking-wider transition-colors hover:text-white"
                style={{ color: readAll ? 'rgba(34,197,94,0.6)' : 'rgba(212,175,55,0.5)' }}>
                {readAll ? '✓ TODAS LEÍDAS' : 'MARCAR TODAS COMO LEÍDAS'}
              </button>
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
