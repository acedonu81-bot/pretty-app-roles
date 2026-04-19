import { Headphones, Zap, MessageSquare, User, LayoutGrid } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';

interface MobileBottomNavProps {
  activeView: string;
  onViewChange: (view: string) => void;
  onMenuToggle: () => void;
  unreadCount?: number;
}

// Map role → directorio view
const roleToView: Record<string, string> = {
  dj: 'dj',
  rookie: 'rookie',
  staff: 'staff',
  makeup: 'makeup',
  media: 'media',
  ambassador: 'ambassador',
  empresario: 'empresario',
};

const MobileBottomNav = ({ activeView, onViewChange, onMenuToggle, unreadCount = 0 }: MobileBottomNavProps) => {
  const profile = useProfile();
  const dirView = roleToView[profile.role] ?? 'dj';

  const tabs = [
    {
      id: dirView,
      icon: Headphones,
      label: 'Directorio',
      isActive: ['dj', 'rookie', 'staff', 'makeup', 'media', 'ambassador', 'empresario'].includes(activeView),
    },
    {
      id: 'flashbooking',
      icon: Zap,
      label: 'Flash',
      isActive: activeView === 'flashbooking' || activeView === 'flash',
    },
    {
      id: 'messages',
      icon: MessageSquare,
      label: 'Mensajes',
      isActive: activeView === 'messages',
      badge: unreadCount,
    },
    {
      id: 'profile',
      icon: User,
      label: 'Perfil',
      isActive: activeView === 'profile',
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex items-stretch md:hidden"
      style={{
        background: 'rgba(6,6,8,0.97)',
        borderTop: '1px solid rgba(212,175,55,0.12)',
        backdropFilter: 'blur(20px)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        height: 'calc(56px + env(safe-area-inset-bottom))',
      }}
    >
      {tabs.map(tab => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onViewChange(tab.id)}
          className="flex-1 flex flex-col items-center justify-center gap-0.5 transition-all active:scale-95 relative"
          style={{ minHeight: 44 }}
        >
          <div className="relative">
            <tab.icon
              size={20}
              style={{ color: tab.isActive ? '#D4AF37' : 'rgba(255,255,255,0.35)' }}
            />
            {tab.badge != null && tab.badge > 0 && (
              <span
                className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center text-[0.7rem] font-black"
                style={{ background: '#D4AF37', color: '#000' }}
              >
                {tab.badge > 9 ? '9+' : tab.badge}
              </span>
            )}
          </div>
          <span
            className="text-[0.75rem] font-bold tracking-wide"
            style={{ color: tab.isActive ? '#D4AF37' : 'rgba(255,255,255,0.3)' }}
          >
            {tab.label}
          </span>
          {tab.isActive && (
            <span
              className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[2px] rounded-full"
              style={{ background: '#D4AF37', boxShadow: '0 0 8px rgba(212,175,55,0.7)' }}
            />
          )}
        </button>
      ))}

      {/* Más — opens sheet sidebar */}
      <button
        type="button"
        onClick={onMenuToggle}
        className="flex-1 flex flex-col items-center justify-center gap-0.5 transition-all active:scale-95"
        style={{ minHeight: 44 }}
      >
        <LayoutGrid size={20} style={{ color: 'rgba(255,255,255,0.35)' }} />
        <span className="text-[0.75rem] font-bold tracking-wide" style={{ color: 'rgba(255,255,255,0.3)' }}>
          Más
        </span>
      </button>
    </nav>
  );
};

export default MobileBottomNav;
