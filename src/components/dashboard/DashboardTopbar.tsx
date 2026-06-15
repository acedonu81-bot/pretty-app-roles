import { Search, LogOut, Menu, Sparkles, Bell, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
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

  const markAllRead = () => {
    const ids = new Set([...dismissed, ...notifications.map(n => n.id)]);
    setDismissed(ids);
    localStorage.setItem('xpeak_notif_dismissed', JSON.stringify([...ids]));
    setShowNotif(false);
  };

  // Solo mostrar novedades si el perfil tiene menos de 7 días (usuarios nuevos)
  const profileAgeDays = profile.created_at
    ? (Date.now() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24)
    : 999;
  const isNewUser = profileAgeDays < 7;

  const notifications = [
    ...(!profile.display_name ? [{
      id: 'incomplete_profile',
      title: 'Perfil incompleto',
      desc: 'Añade tu nombre artístico y guarda para aparecer en el directorio.',
      time: 'Pendiente',
      icon: 'spark' as const,
      urgent: true,
    }] : []),
    ...(isNewUser ? [{
      id: 'ficha_nueva',
      title: 'Nueva: Tu Ficha Pública',
      desc: 'Comparte posts, audio, vídeo e imágenes con fans y empresarios desde Mi Ficha.',
      time: 'Novedad',
      icon: 'spark' as const,
      urgent: false,
    }] : []),
  ];

  const unread = notifications.filter(n => !dismissed.has(n.id));
  const readAll = unread.length === 0;

  return (
    <header
      className={`h-14 px-4 md:px-6 flex items-center justify-between sticky top-0 z-10 gap-3${isNative ? ' native-topbar-offset' : ''}`}
      style={{
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
        borderTop: 'none',
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
            background: searchQuery ? 'rgba(212,175,55,0.05)' : 'rgba(0,0,0,0.03)',
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
              <X size={12} style={{ color: 'rgba(22,20,18,0.65)' }} />
            </button>
          )}
        </div>

      </div>

      <div className="flex items-center gap-2 relative flex-shrink-0">
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
                  ? '0 0 16px rgba(212,175,55,0.7), 0 0 32px rgba(212,175,55,0.3), inset 0 1px 0 rgba(22,20,18,0.35)'
                  : '0 0 10px rgba(212,175,55,0.4), 0 0 20px rgba(212,175,55,0.15), inset 0 1px 0 rgba(22,20,18,0.3)',
            }}>
            <span className="text-xs font-black" style={{ color: (readAll || notifications.length === 0) ? 'rgba(22,20,18,0.35)' : '#000', lineHeight: 1 }}>
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
            className="z-50 rounded-2xl overflow-hidden"
            style={{
              position: isMobile ? 'fixed' : 'absolute',
              top: isMobile ? 64 : 48,
              left: isMobile ? 16 : undefined,
              right: isMobile ? 16 : 0,
              width: isMobile ? 'calc(100vw - 32px)' : 320,
              maxWidth: isMobile ? undefined : 320,
              background: '#ffffff',
              border: '1px solid rgba(212,175,55,0.25)',
              boxShadow: '0 4px 30px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.07)',
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
                style={{ color: 'rgba(22,20,18,0.35)' }}>
                CERRAR
              </button>
            </div>

            {/* Items */}
            <div className="max-h-72 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-8 flex flex-col items-center gap-2 text-center">
                  <Bell size={20} style={{ color: 'rgba(212,175,55,0.2)' }} />
                  <p className="text-xs font-bold" style={{ color: 'rgba(0,0,0,0.1)' }}>Sin notificaciones</p>
                  <p className="text-xs" style={{ color: 'rgba(0,0,0,0.1)' }}>Todo al día por aquí.</p>
                </div>
              ) : notifications.map((n, i) => (
                <div key={n.id}
                  className="px-4 py-3 flex gap-3 items-start cursor-pointer transition-all"
                  style={{
                    borderBottom: '1px solid rgba(0,0,0,0.04)',
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
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(22,20,18,0.65)' }}>{n.desc}</p>
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

        {/* Avatar usuario logueado */}
        <div className="flex items-center gap-2 px-2 py-1 rounded-lg"
          style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}>
          <div className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center text-xs font-black flex-shrink-0"
            style={profile.photo_url
              ? undefined
              : { background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
            {profile.photo_url
              ? <img src={profile.photo_url} alt="" className="w-full h-full object-cover" />
              : (profile.display_name ?? 'X').charAt(0).toUpperCase()}
          </div>
          {!isMobile && profile.display_name && (
            <span className="text-xs font-bold max-w-[90px] truncate" style={{ color: 'rgba(22,20,18,0.75)' }}>
              {profile.display_name}
            </span>
          )}
        </div>

        <button
          onClick={() => navigate('/')}
          className="text-xs py-1.5 px-3 flex items-center gap-2 rounded-lg transition-colors"
          style={{ background: 'rgba(0,0,0,0.05)', border: '1px solid var(--nightlife-border)', color: 'var(--nightlife-text-secondary)' }}
        >
          <LogOut size={13} /> {!isMobile && 'Salir'}
        </button>
      </div>
    </header>
  );
};

export default DashboardTopbar;
