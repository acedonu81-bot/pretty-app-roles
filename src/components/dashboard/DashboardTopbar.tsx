import { Search, LogOut, Menu, Gift, Sparkles, Bell, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { getTrialDaysRemaining, isBirthdayToday, mapSubscriptionTierToPlan } from '@/lib/subscriptions';
import { isNative } from '@/lib/capacitor';

interface TopbarProps {
  onMenuToggle?: () => void;
  isMobile?: boolean;
  onSearch?: (q: string) => void;
  searchQuery?: string;
  onHome?: () => void;
}

const DashboardTopbar = ({ onMenuToggle, isMobile, onSearch, searchQuery = '', onHome }: TopbarProps) => {
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);
  const [dismissed, setDismissed] = useState<Set<string>>(() => {
    try {
      const s = localStorage.getItem('xpeak_notif_dismissed');
      return new Set(s ? JSON.parse(s) : []);
    } catch { return new Set(); }
  });
  const profile = useProfile();

  // null = not started, number = days remaining (0 = expired)
  const trialDaysRemaining = useMemo(() => getTrialDaysRemaining(profile.trial_started_at), [profile.trial_started_at]);
  const birthdayOfferActive = useMemo(() => isBirthdayToday(profile.birthday), [profile.birthday]);
  const currentPlan = useMemo(() => mapSubscriptionTierToPlan(profile.subscription_tier), [profile.subscription_tier]);
  const isPaidPlan = currentPlan !== 'free';
  const trialNotStarted = isPaidPlan && trialDaysRemaining === null;
  const trialActive = isPaidPlan && trialDaysRemaining !== null && trialDaysRemaining > 0;
  const trialExpired = isPaidPlan && trialDaysRemaining === 0;

  const markAllRead = () => {
    const ids = new Set([...dismissed, ...notifications.map(n => n.id)]);
    setDismissed(ids);
    localStorage.setItem('xpeak_notif_dismissed', JSON.stringify([...ids]));
    setShowNotif(false);
  };

  const trialLabel = trialNotStarted
    ? 'Usa Flash Booking, streaming o sube una sesión para activar tus 15 días gratis'
    : trialActive
      ? `Te quedan ${trialDaysRemaining} ${trialDaysRemaining === 1 ? 'día' : 'días'} de acceso gratuito`
      : 'Tu periodo de prueba ha finalizado. Suscríbete al plan anual y ahorra un 30%.';

  const notifications = [
    ...(trialNotStarted ? [{
      id: 'trial_pending',
      title: 'Prueba no iniciada',
      desc: 'Activa Flash Booking, conecta un stream o sube una sesión — ahí empieza el contador de 15 días.',
      time: 'Pendiente',
      icon: 'spark' as const,
      urgent: false,
    }] : []),
    ...(trialActive ? [{
      id: 'trial_active',
      title: 'Prueba activa',
      desc: trialLabel,
      time: 'Activo',
      icon: 'gift' as const,
      urgent: (trialDaysRemaining ?? 99) <= 3,
    }] : []),
    ...(trialExpired ? [{
      id: 'trial_ended',
      title: 'Prueba finalizada',
      desc: 'Suscríbete para seguir disfrutando de todas las funciones premium.',
      time: 'Vencido',
      icon: 'gift' as const,
      urgent: true,
    }] : []),
    ...(birthdayOfferActive ? [{
      id: 'birthday',
      title: '¡Feliz cumpleaños! 🎂',
      desc: 'Hoy tienes un 40% de descuento en la suscripción anual.',
      time: 'Hoy',
      icon: 'gift' as const,
      urgent: false,
    }] : []),
    ...(currentPlan === 'free' ? [{
      id: 'welcome',
      title: 'Bienvenido a XPEAK',
      desc: 'Activa Starter y aparece verificado en el directorio con Flash Booking habilitado.',
      time: 'Nuevo',
      icon: 'spark' as const,
      urgent: false,
    }] : []),
    ...(!profile.display_name ? [{
      id: 'incomplete_profile',
      title: 'Perfil incompleto',
      desc: 'Añade tu nombre artístico y guarda para aparecer en el directorio.',
      time: 'Pendiente',
      icon: 'spark' as const,
      urgent: true,
    }] : []),
    {
      id: 'ficha_nueva',
      title: 'Nueva: Tu Ficha Pública',
      desc: 'Comparte posts, audio, vídeo e imágenes con fans y empresarios desde Mi Ficha.',
      time: 'Novedad',
      icon: 'spark' as const,
      urgent: false,
    },
  ];

  const unread = notifications.filter(n => !dismissed.has(n.id));
  const readAll = unread.length === 0;

  return (
    <header
      className={`h-14 px-4 md:px-6 flex items-center justify-between sticky top-0 z-10 gap-3${isNative ? ' native-topbar-offset' : ''}`}
      style={{
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--nightlife-border)',
        borderTop: '1.5px solid rgba(66,133,244,0.35)',
      }}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {isMobile && (
          <button
            onClick={onMenuToggle}
            aria-label="Abrir menú"
            className="p-3 rounded-lg flex-shrink-0 transition-colors"
            style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', color: '#D4AF37' }}
          >
            <Menu size={20} />
          </button>
        )}
        {isMobile && (
          <button onClick={() => onHome?.()} className="font-black tracking-widest text-base transition-opacity hover:opacity-70 flex-shrink-0 font-display">
            X<span style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>PEAK</span>
          </button>
        )}

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg flex-1 max-w-[360px] transition-all"
          style={{
            background: searchQuery ? 'rgba(212,175,55,0.05)' : 'rgba(255,255,255,0.03)',
            border: searchQuery ? '1px solid rgba(212,175,55,0.3)' : '1px solid var(--nightlife-border)',
          }}>
          <Search size={14} className="flex-shrink-0" style={{ color: searchQuery ? '#D4AF37' : undefined }} />
          <input
            type="text"
            placeholder={isMobile ? 'Buscar...' : 'Buscar por zona, rol o nombre...'}
            className="bg-transparent border-none outline-none text-foreground w-full text-xs"
            value={searchQuery}
            onChange={e => onSearch?.(e.target.value)}
            onKeyDown={e => e.key === 'Escape' && onSearch?.('')}
          />
          {searchQuery && (
            <button onClick={() => onSearch?.('')} aria-label="Borrar búsqueda" className="flex-shrink-0 transition-opacity hover:opacity-70">
              <X size={12} style={{ color: 'rgba(255,255,255,0.4)' }} />
            </button>
          )}
        </div>

        {isPaidPlan && (
          <div
            className="hidden lg:flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold border bg-card/70"
            style={{
              borderColor: trialExpired ? 'rgba(239,68,68,0.3)' : trialNotStarted ? 'rgba(212,175,55,0.2)' : 'rgba(212,175,55,0.35)',
              color: trialExpired ? '#fca5a5' : '#D4AF37',
            }}
          >
            <Gift size={14} />
            <span>{trialLabel}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 relative flex-shrink-0">
        {isPaidPlan && (
          <div className="lg:hidden flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold border bg-card/70"
            style={{
              borderColor: trialExpired ? 'rgba(239,68,68,0.3)' : 'rgba(212,175,55,0.3)',
              color: trialExpired ? '#fca5a5' : '#D4AF37',
            }}>
            <Gift size={12} />
            <span>
              {trialNotStarted ? 'Activa tu prueba' : trialActive ? `${trialDaysRemaining} días gratis` : 'Prueba finalizada'}
            </span>
          </div>
        )}

        {/* Notification trigger — animated pulse orb */}
        <button
          onClick={() => setShowNotif(prev => !prev)}
          className="relative flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
          style={{ width: 40, height: 40 }}
          aria-label="Notificaciones"
        >
          {/* Outer glow rings — only when there are unread notifications */}
          {!readAll && notifications.length > 0 && <>
            <span className="absolute inset-0 rounded-full animate-ping"
              style={{ background: 'rgba(212,175,55,0.15)', animationDuration: '1.8s' }} />
            <span className="absolute inset-[3px] rounded-full animate-ping"
              style={{ background: 'rgba(212,175,55,0.1)', animationDuration: '1.8s', animationDelay: '0.3s' }} />
          </>}

          {/* Core orb */}
          <span className="relative flex items-center justify-center w-7 h-7 rounded-full transition-all duration-500"
            style={{
              background: readAll || notifications.length === 0
                ? 'radial-gradient(circle at 40% 35%, rgba(120,120,140,0.5), rgba(80,80,100,0.4))'
                : showNotif
                  ? 'radial-gradient(circle at 40% 35%, #F5D77A, #D4AF37 60%, #B8941E)'
                  : 'radial-gradient(circle at 40% 35%, rgba(212,175,55,0.9), rgba(184,148,30,0.7))',
              boxShadow: readAll || notifications.length === 0
                ? 'none'
                : showNotif
                  ? '0 0 16px rgba(212,175,55,0.7), 0 0 32px rgba(212,175,55,0.3), inset 0 1px 0 rgba(255,255,255,0.3)'
                  : '0 0 10px rgba(212,175,55,0.4), 0 0 20px rgba(212,175,55,0.15), inset 0 1px 0 rgba(255,255,255,0.25)',
            }}>
            <span className="text-xs font-black" style={{ color: (readAll || notifications.length === 0) ? 'rgba(255,255,255,0.3)' : '#000', lineHeight: 1 }}>
              {(readAll || notifications.length === 0) ? '✓' : notifications.length}
            </span>
          </span>

          {/* Live dot — only when there are unread real notifications */}
          {!readAll && notifications.length > 0 && (
            <span className="absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full border border-black"
              style={{ background: '#22c55e', boxShadow: '0 0 6px rgba(34,197,94,0.8)' }} />
          )}
        </button>

        {showNotif && (
          <div
            className="absolute top-12 w-[calc(100vw-2rem)] sm:w-[320px] max-w-[320px] z-50 rounded-2xl overflow-hidden"
            style={{
              right: isMobile ? undefined : 0,
              left: isMobile ? '50%' : undefined,
              transform: isMobile ? 'translateX(-50%)' : undefined,
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
                <span className="text-[0.75rem] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37' }}>
                  {notifications.length}
                </span>
              </div>
              <button onClick={markAllRead}
                className="text-xs font-bold transition-colors hover:text-white"
                style={{ color: 'rgba(255,255,255,0.3)' }}>
                CERRAR
              </button>
            </div>

            {/* Items */}
            <div className="max-h-72 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-8 flex flex-col items-center gap-2 text-center">
                  <Bell size={20} style={{ color: 'rgba(212,175,55,0.2)' }} />
                  <p className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.2)' }}>Sin notificaciones</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.15)' }}>Todo al día por aquí.</p>
                </div>
              ) : notifications.map((n, i) => (
                <div key={n.id}
                  className="px-4 py-3 flex gap-3 items-start cursor-pointer transition-all"
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    background: n.urgent ? 'rgba(239,68,68,0.04)' : i === 0 ? 'rgba(212,175,55,0.03)' : 'transparent',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = n.urgent ? 'rgba(239,68,68,0.07)' : 'rgba(212,175,55,0.05)')}
                  onMouseLeave={e => (e.currentTarget.style.background = n.urgent ? 'rgba(239,68,68,0.04)' : i === 0 ? 'rgba(212,175,55,0.03)' : 'transparent')}
                >
                  {/* Icon orb */}
                  <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5"
                    style={{
                      background: n.urgent
                        ? 'radial-gradient(circle at 35% 35%, rgba(239,68,68,0.3), rgba(185,28,28,0.1))'
                        : 'radial-gradient(circle at 35% 35%, rgba(212,175,55,0.3), rgba(184,148,30,0.1))',
                      border: n.urgent ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(212,175,55,0.2)',
                    }}>
                    {n.icon === 'gift'
                      ? <Gift size={12} style={{ color: n.urgent ? '#ef4444' : '#D4AF37' }} />
                      : <Sparkles size={12} style={{ color: '#D4AF37' }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate" style={{ color: n.urgent ? '#fca5a5' : undefined }}>{n.title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{n.desc}</p>
                    <span className="text-[0.75rem] font-bold mt-1 block" style={{ color: n.urgent ? 'rgba(239,68,68,0.6)' : 'rgba(212,175,55,0.5)' }}>{n.time}</span>
                  </div>
                  {/* Unread indicator */}
                  {!readAll && (
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                      style={{ background: n.urgent ? '#ef4444' : '#D4AF37', boxShadow: n.urgent ? '0 0 4px rgba(239,68,68,0.6)' : '0 0 4px rgba(212,175,55,0.6)' }} />
                  )}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 text-center" style={{ borderTop: '1px solid rgba(212,175,55,0.08)' }}>
              <button
                onClick={markAllRead}
                className="text-xs font-bold tracking-wider transition-colors hover:text-white"
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
