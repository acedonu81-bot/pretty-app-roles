import { Search, LogOut, Menu, Sparkles, Bell, X, MessageCircle, Gift, Zap, CalendarCheck } from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { isNative } from '@/lib/capacitor';
import { useDashboardBadges } from '@/hooks/useDashboardBadges';

interface RealNotif { id: string; type: string; title: string; body: string | null; link: string | null; is_read: boolean; created_at: string; }

const timeAgo = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Ahora';
  if (m < 60) return `Hace ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `Hace ${h} h`;
  const d = Math.floor(h / 24);
  return d === 1 ? 'Ayer' : `Hace ${d} días`;
};

interface TopbarProps {
  onMenuToggle?: () => void;
  isMobile?: boolean;
  onSearch?: (q: string) => void;
  searchQuery?: string;
  onHome?: () => void;
  userId?: string;
  isEmpresario?: boolean;
  onViewChange?: (view: string) => void;
}

const DashboardTopbar = ({ onMenuToggle, isMobile, onSearch, searchQuery = '', onHome, userId, isEmpresario = false, onViewChange }: TopbarProps) => {
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);
  // Único por instancia además de por usuario: dos montajes del mismo
  // componente compartirían canal y el segundo fallaría al suscribirse.
  const instanceIdNotif = useRef(Math.random().toString(36).slice(2)).current;
  const [dismissed, setDismissed] = useState<Set<string>>(() => {
    try {
      const s = localStorage.getItem('xpeak_notif_dismissed');
      return new Set(s ? JSON.parse(s) : []);
    } catch { return new Set(); }
  });
  const [realNotifs, setRealNotifs] = useState<RealNotif[]>([]);
  // Contadores en vivo (Flash Booking pendientes / mensajes sin leer) —
  // antes vivían en un icono NotificationBell aparte, que en móvil quedaba
  // pegado a este mismo orbe y al avatar (mismo tamaño, mismo dorado, sin
  // espacio real para 3 elementos). Fusionado en un único icono: estos
  // contadores no tienen concepto de "leído" (son un espejo en vivo, no
  // eventos persistidos), así que se muestran aparte de `notifications`
  // abajo y nunca se les aplica `markAllRead`.
  const { flashBadge, msgBadge } = useDashboardBadges(userId, isEmpresario);
  const profile = useProfile();

  // Load real in-app notifications + subscribe to new ones (realtime)
  const loadNotifs = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from('notifications' as any)
      .select('id, type, title, body, link, is_read, created_at')
      .eq('user_id', user.id)
      .eq('is_read', false)
      .order('created_at', { ascending: false })
      .limit(20);
    if (data) {
      // Respetar las preferencias de notificación de Ajustes (por tipo)
      const typePref: Record<string, string> = { message: 'xpeak_notif_messages', flash: 'xpeak_notif_flash', booking: 'xpeak_notif_flash', top_weekend: 'xpeak_notif_topweekend' };
      const filtered = (data as unknown as RealNotif[]).filter(n => {
        const key = typePref[n.type];
        return !key || localStorage.getItem(key) !== 'false';
      });
      setRealNotifs(filtered);
    }
  }, []);

  useEffect(() => {
    loadNotifs();
    let channel: ReturnType<typeof supabase.channel> | null = null;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      channel = supabase
        .channel(`notif-${user.id}-${instanceIdNotif}`)
        .on('postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
          () => loadNotifs())
        .subscribe();
    });
    return () => { if (channel) supabase.removeChannel(channel); };
  }, [loadNotifs]);

  // Solo mostrar novedades si el perfil tiene menos de 7 días (usuarios nuevos)
  const profileAgeDays = profile.created_at
    ? (Date.now() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24)
    : 999;
  const isNewUser = profileAgeDays < 7;

  // Real notifications (chat messages, etc.) first, then onboarding hints
  const notifications = [
    ...realNotifs.map(n => ({
      id: n.id,
      title: n.title,
      desc: n.body ?? '',
      time: timeAgo(n.created_at),
      icon: (n.type === 'message' ? 'message' : n.type === 'booking' ? 'booking' : 'spark') as 'message' | 'spark' | 'gift' | 'booking',
      urgent: false,
      link: n.link,
      real: true,
    })),
    // !profile.loading: display_name arranca en '' por defecto mientras el
    // perfil real se está cargando (useProfile.tsx:68) — sin este guard, el
    // badge de notificación se "encendía" un instante en cada carga (falso
    // "perfil incompleto") y se apagaba solo en cuanto llegaba el nombre real.
    ...(!profile.loading && !profile.display_name ? [{
      id: 'incomplete_profile',
      title: 'Perfil incompleto',
      desc: 'Añade tu nombre artístico y guarda para aparecer en el directorio.',
      time: 'Pendiente',
      icon: 'spark' as const,
      urgent: true,
      link: null,
      real: false,
    }] : []),
    ...(isNewUser ? [{
      id: 'ficha_nueva',
      title: 'Nueva: Tu Ficha Pública',
      desc: 'Comparte posts, audio, vídeo e imágenes con fans y empresarios desde Mi Ficha.',
      time: 'Novedad',
      icon: 'spark' as const,
      urgent: false,
      link: null,
      real: false,
    }] : []),
  ].filter(n => !dismissed.has(n.id));

  const liveBadgeTotal = flashBadge + msgBadge;
  const readAll = notifications.length === 0 && liveBadgeTotal === 0;

  const markAllRead = async () => {
    const ids = new Set([...dismissed, ...notifications.map(n => n.id)]);
    setDismissed(ids);
    localStorage.setItem('xpeak_notif_dismissed', JSON.stringify([...ids]));
    setShowNotif(false);
    // Persist read state for real notifications in DB
    const realIds = realNotifs.map(n => n.id);
    if (realIds.length) {
      await supabase.from('notifications' as any).update({ is_read: true }).in('id', realIds);
      setRealNotifs([]);
    }
  };

  const openNotif = async (n: { id: string; link: string | null; real: boolean }) => {
    if (n.real) {
      await supabase.from('notifications' as any).update({ is_read: true }).eq('id', n.id);
      setRealNotifs(prev => prev.filter(r => r.id !== n.id));
    }
    setShowNotif(false);
    if (n.link) navigate(n.link);
  };

  return (
    <header
      className={`px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 gap-3${isNative ? ' native-topbar-offset' : ''}`}
      style={{
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 1px 0 rgba(0,0,0,0.05), 0 8px 24px rgba(0,0,0,0.03)',
        paddingTop: 'max(0.75rem, env(safe-area-inset-top))',
        paddingBottom: '0.75rem',
      }}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {isMobile && (
          <button
            onClick={onMenuToggle}
            aria-label="Abrir menú"
            className="p-3 rounded-2xl flex-shrink-0 transition-colors"
            style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', color: '#8A6D0F' }}
          >
            <Menu size={20} />
          </button>
        )}
        {isMobile && (
          <button onClick={() => onHome?.()} className="font-black tracking-widest text-base transition-opacity hover:opacity-70 flex-shrink-0 font-display">
            X<span style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>PEAK</span>
          </button>
        )}

        <div className="flex items-center gap-2 px-4 py-2.5 sm:py-2 rounded-full flex-1 min-w-0 max-w-[360px] transition-all"
          style={{
            background: searchQuery ? 'rgba(212,175,55,0.05)' : '#f5f5f5',
            border: searchQuery ? '1px solid rgba(212,175,55,0.3)' : '1px solid rgba(0,0,0,0.1)',
          }}>
          <Search size={15} className="flex-shrink-0" style={{ color: searchQuery ? '#D4AF37' : '#999' }} />
          <input
            type="text"
            placeholder={isMobile ? 'Buscar DJ, staff, zona...' : 'Buscar por zona, rol o nombre...'}
            className="bg-transparent border-none outline-none w-full text-sm sm:text-xs"
            style={{ color: '#111' }}
            value={searchQuery}
            onChange={e => onSearch?.(e.target.value)}
            onKeyDown={e => e.key === 'Escape' && onSearch?.('')}
          />
          {searchQuery && (
            <button onClick={() => onSearch?.('')} aria-label="Borrar búsqueda" className="flex-shrink-0 transition-opacity hover:opacity-70">
              <X size={12} style={{ color: '#444' }} />
            </button>
          )}
        </div>

      </div>

      <div className="flex items-center gap-3 sm:gap-5 relative flex-shrink-0">
        {/* Notification trigger — animated pulse orb. The ping rings are meant
            to expand past the button's own box (that's the pulse effect), so
            the fix for overlap with the avatar is extra gap on the flex
            container above, not shrinking or clipping the animation. */}
        <button
          onClick={() => setShowNotif(prev => !prev)}
          className="relative flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 flex-shrink-0"
          style={{ width: 28, height: 28 }}
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
              background: readAll
                ? 'radial-gradient(circle at 40% 35%, rgba(120,120,140,0.5), rgba(80,80,100,0.4))'
                : showNotif
                  ? 'radial-gradient(circle at 40% 35%, #F5D77A, #D4AF37 60%, #B8941E)'
                  : 'radial-gradient(circle at 40% 35%, rgba(212,175,55,0.9), rgba(184,148,30,0.7))',
              boxShadow: readAll
                ? 'none'
                : showNotif
                  ? '0 0 16px rgba(212,175,55,0.7), 0 0 32px rgba(212,175,55,0.3), inset 0 1px 0 #444'
                  : '0 0 10px rgba(212,175,55,0.4), 0 0 20px rgba(212,175,55,0.15), inset 0 1px 0 #444',
            }}>
            <span className="text-xs font-black" style={{ color: readAll ? '#444' : '#000', lineHeight: 1 }}>
              {readAll ? '✓' : notifications.length + liveBadgeTotal}
            </span>
          </span>

          {/* Live dot — only when there's something pending (real or live badge) */}
          {!readAll && (
            <span className="absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full border border-black"
              style={{ background: '#22c55e', boxShadow: '0 0 6px rgba(34,197,94,0.8)' }} />
          )}
        </button>

        {showNotif && (
          <div
            className="z-50 rounded-2xl overflow-hidden"
            style={{
              // top fijo en 64px asumía una topbar de altura constante, pero
              // esta reserva safe-area-inset-top (paddingTop: max(0.75rem,
              // env(...)) más arriba) — en un móvil con notch/isla dinámica
              // la topbar real mide bastante más que 64px y el dropdown
              // quedaba con la parte superior tapada detrás de ella. calc()
              // replica el mismo padding que la propia topbar + su alto de
              // contenido (~44px) en vez de asumir un valor fijo.
              position: isMobile ? 'fixed' : 'absolute',
              top: isMobile ? 'calc(max(0.75rem, env(safe-area-inset-top)) + 44px)' : 48,
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
            <div className="px-4 py-3 flex items-center justify-between rounded-t-2xl"
              style={{ background: 'rgba(212,175,55,0.04)' }}>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />
                <span className="text-xs font-black tracking-wider" style={{ color: '#8A6D0F' }}>NOTIFICACIONES</span>
                <span className="text-[0.75rem] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: 'rgba(212,175,55,0.15)', color: '#8A6D0F' }}>
                  {notifications.length + liveBadgeTotal}
                </span>
              </div>
              <button onClick={markAllRead}
                className="text-xs font-bold transition-colors hover:text-white"
                style={{ color: '#444' }}>
                CERRAR
              </button>
            </div>

            {/* Contadores en vivo (Flash Booking / mensajes) — sin concepto
                de "leído", así que van aparte de la lista de abajo y CERRAR
                no los afecta; se apagan solos cuando el contador real baja. */}
            {liveBadgeTotal > 0 && (
              <div className="border-b" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                {flashBadge > 0 && (
                  <button type="button" onClick={() => { onViewChange?.('flashbooking'); setShowNotif(false); }}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors hover:bg-black/5">
                    <span className="flex items-center gap-2 text-xs font-bold" style={{ color: '#222' }}>
                      <Zap size={13} style={{ color: '#D4AF37' }} /> Flash Booking pendientes
                    </span>
                    <span className="text-xs font-black" style={{ color: '#8A6D0F' }}>{flashBadge}</span>
                  </button>
                )}
                {msgBadge > 0 && (
                  <button type="button" onClick={() => { onViewChange?.('messages'); setShowNotif(false); }}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors hover:bg-black/5">
                    <span className="flex items-center gap-2 text-xs font-bold" style={{ color: '#222' }}>
                      <MessageCircle size={13} style={{ color: '#4285F4' }} /> Mensajes sin leer
                    </span>
                    <span className="text-xs font-black" style={{ color: '#4285F4' }}>{msgBadge}</span>
                  </button>
                )}
              </div>
            )}

            {/* Items */}
            <div className="max-h-72 overflow-y-auto py-1">
              {notifications.length === 0 ? (
                <div className="px-4 py-8 flex flex-col items-center gap-2 text-center">
                  <Bell size={20} style={{ color: 'rgba(212,175,55,0.4)' }} />
                  <p className="text-xs font-bold" style={{ color: '#444' }}>Sin notificaciones</p>
                  <p className="text-xs" style={{ color: '#777' }}>Todo al día por aquí.</p>
                </div>
              ) : notifications.map((n, i) => (
                <div key={n.id}
                  onClick={() => openNotif(n)}
                  className="mx-2 my-1 px-3 py-3 flex gap-3 items-start cursor-pointer transition-all rounded-xl"
                  style={{
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
                    {n.icon === 'message'
                      ? <MessageCircle size={12} style={{ color: '#8A6D0F' }} />
                      : n.icon === 'gift'
                      ? <Gift size={12} style={{ color: n.urgent ? '#ef4444' : '#D4AF37' }} />
                      : n.icon === 'booking'
                      ? <CalendarCheck size={12} style={{ color: '#8A6D0F' }} />
                      : <Sparkles size={12} style={{ color: '#8A6D0F' }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate" style={{ color: n.urgent ? '#fca5a5' : undefined }}>{n.title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: '#444' }}>{n.desc}</p>
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
            <div className="px-4 py-2.5 text-center rounded-b-2xl" style={{ background: 'rgba(212,175,55,0.02)' }}>
              <button
                onClick={markAllRead}
                className="text-xs font-bold tracking-wider transition-colors hover:text-white"
                style={{ color: readAll ? 'rgba(34,197,94,0.6)' : 'rgba(212,175,55,0.5)' }}>
                {readAll ? '✓ TODAS LEÍDAS' : 'MARCAR TODAS COMO LEÍDAS'}
              </button>
            </div>
          </div>
        )}

        {/* Avatar usuario logueado — cuadrado redondeado (mismo patrón que
            ProfileSwitcher en el sidebar) y sin dorado brillante, distinto del
            orbe circular de notificaciones a propósito: en móvil, con dos
            elementos circulares dorados del mismo tamaño y sin nombre al
            lado, quedaban pegados/solapados junto a la búsqueda. Los
            contadores en vivo de Flash Booking/mensajes que antes vivían en
            un icono NotificationBell aparte ahora están fusionados dentro
            del propio orbe de arriba — un solo icono de notificaciones,
            no dos compitiendo por el mismo espacio. */}
        <div className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-2xl"
          style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}>
          <div className="w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center text-xs font-black flex-shrink-0"
            style={profile.photo_url
              ? undefined
              : { background: '#3a3632', color: '#fff' }}>
            {profile.photo_url
              ? <img src={profile.photo_url} alt="" className="w-full h-full object-cover" />
              : (profile.display_name ?? 'X').charAt(0).toUpperCase()}
          </div>
          {!isMobile && profile.display_name && (
            <span className="text-xs font-bold max-w-[90px] truncate" style={{ color: '#222' }}>
              {profile.display_name}
            </span>
          )}
        </div>

        {/* Oculto en móvil: en 390-412px de ancho, el botón "Menú + XPEAK +
            búsqueda" a la izquierda y "notificaciones + avatar + Salir" a
            la derecha no caben sin comprimirse/solaparse — y "Salir" ya
            existe en Ajustes (SettingsView.tsx), accesible desde el bottom
            nav. Quitarlo de aquí en móvil libera el espacio real que
            faltaba, en vez de otro parche de tamaños/gaps. */}
        {!isMobile && (
          <button
            onClick={() => navigate('/')}
            className="text-xs py-1.5 px-3 flex items-center gap-2 rounded-full transition-colors"
            style={{ background: 'rgba(0,0,0,0.05)', border: '1px solid var(--nightlife-border)', color: 'var(--nightlife-text-secondary)' }}
          >
            <LogOut size={13} /> Salir
          </button>
        )}
      </div>
    </header>
  );
};

export default DashboardTopbar;
