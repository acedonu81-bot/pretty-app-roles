import { Zap, MessageSquare, User, Home, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';

interface MobileBottomNavProps {
  activeView: string;
  onViewChange: (view: string) => void;
  onMenuToggle: () => void;
  unreadCount?: number;
}

const roleToView: Record<string, string> = {
  dj: 'dj', staff: 'staff', makeup: 'makeup', media: 'media',
  vestuario: 'vestuario', design: 'design', promotor: 'promotor',
  event_manager: 'event_manager', empresario: 'empresario',
};

const dirViews = new Set(['dj','staff','makeup','media','vestuario','design','promotor','event_manager','empresario','catering','mago','bailarin','humorista','monologo','animador','speaker','ambassador']);

const MobileBottomNav = ({ activeView, onViewChange, onMenuToggle, unreadCount = 0 }: MobileBottomNavProps) => {
  const profile = useProfile();
  const navigate = useNavigate();
  const dirView = roleToView[profile.role] ?? 'dj';

  const tabs = [
    { id: dirView, icon: Home, label: 'Inicio', isActive: dirViews.has(activeView) },
    { id: '__descubrir', icon: Sparkles, label: 'Descubrir', isActive: false },
    { id: 'flashbooking', icon: Zap, label: 'Flash', isActive: activeView === 'flashbooking' || activeView === 'flash' },
    { id: 'messages', icon: MessageSquare, label: 'Chat', isActive: activeView === 'messages', badge: unreadCount },
    { id: 'profile', icon: User, label: 'Perfil', isActive: activeView === 'profile' || activeView === 'settings' },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex items-stretch md:hidden"
      style={{
        background: 'rgba(255,255,255,0.97)',
        borderTop: '1px solid rgba(0,0,0,0.08)',
        backdropFilter: 'blur(20px)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        height: 'calc(64px + env(safe-area-inset-bottom))',
      }}
    >
      {tabs.map(tab => (
        <button
          key={tab.id}
          type="button"
          onClick={() => tab.id === '__descubrir' ? navigate('/descubrir') : onViewChange(tab.id)}
          className="flex-1 flex flex-col items-center justify-center gap-0.5 transition-all active:scale-95 relative"
        >
          <div className="relative">
            <tab.icon
              size={22}
              strokeWidth={tab.isActive ? 2.5 : 1.8}
              style={{ color: tab.isActive ? '#D4AF37' : '#444' }}
            />
            {tab.badge != null && tab.badge > 0 && (
              <span className="absolute -top-1 -right-1.5 min-w-[14px] h-[14px] px-0.5 rounded-full flex items-center justify-center text-[0.6rem] font-black"
                style={{ background: '#ef4444', color: '#fff' }}>
                {tab.badge > 9 ? '9+' : tab.badge}
              </span>
            )}
          </div>
          <span className="text-[0.65rem] font-semibold"
            style={{ color: tab.isActive ? '#D4AF37' : '#444' }}>
            {tab.label}
          </span>
        </button>
      ))}
    </nav>
  );
};

export default MobileBottomNav;
