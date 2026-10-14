import { Zap, MessageSquare, User, Home, type LucideIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useDashboardBadges } from '@/hooks/useDashboardBadges';

interface MobileBottomNavProps {
  activeView: string;
  onViewChange: (view: string) => void;
  onMenuToggle: () => void;
  unreadCount?: number;
}

interface Tab {
  id: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  badge?: number;
  /** Aviso importante (oferta nueva): icono verde que parpadea y globo verde. */
  alerta?: boolean;
}

// Vistas de listado de gremio: con cualquiera de ellas abierta, el tab
// "Inicio" sigue marcado, porque se llega a ellas desde el mapa de gremios.
const dirViews = new Set(['dj','staff','azafata','makeup','peluqueria','media','vestuario','design','promotor','event_manager','empresario','catering','mago','bailarin','humorista','monologo','animador','speaker','ambassador','photo-booth','food-truck','grupo-musical','disco-movil','tecnico','alquiler','local_eventos']);

const TabButton = ({ tab, onClick }: { tab: Tab; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    aria-current={tab.isActive ? 'true' : undefined}
    className="flex-1 flex flex-col items-center justify-center gap-0.5 transition-all active:scale-95 relative"
  >
    <div className="relative">
      {tab.alerta ? (
        <span className="flex items-center justify-center rounded-full motion-safe:[animation:ofertaParpadeo_1.3s_ease-in-out_infinite]"
          style={{ width: 30, height: 30, margin: -4, background: '#16a34a' }}>
          <tab.icon size={18} strokeWidth={2.5} style={{ color: '#fff' }} />
        </span>
      ) : (
        <tab.icon
          size={22}
          strokeWidth={tab.isActive ? 2.5 : 1.8}
          style={{ color: tab.isActive ? '#D4AF37' : '#444' }}
        />
      )}
      {tab.badge != null && tab.badge > 0 && (
        <span className="absolute -top-2 -right-3 min-w-[16px] h-[16px] px-1 rounded-full flex items-center justify-center text-[0.6rem] font-black"
          style={{ background: tab.alerta ? '#15803d' : '#ef4444', color: '#fff', boxShadow: '0 0 0 2px #fff' }}>
          {tab.badge > 9 ? '9+' : tab.badge}
        </span>
      )}
    </div>
    <span className="text-[0.65rem] font-semibold"
      style={{ color: tab.alerta ? '#166534' : tab.isActive ? '#D4AF37' : '#444', fontWeight: tab.alerta ? 800 : undefined }}>
      {tab.alerta && tab.id === 'flashbooking' ? 'Nuevo' : tab.label}
    </span>
  </button>
);

const MobileBottomNav = ({ activeView, onViewChange, onMenuToggle, unreadCount = 0 }: MobileBottomNavProps) => {
  // Los globos salen del mismo cálculo que el menú lateral. Antes el chat no
  // recibía ningún contador y Flash Booking no avisaba de ofertas nuevas
  // (un profesional no encontró la de Burguerfest, 13 oct 2026).
  const { user } = useAuth();
  const { role } = useProfile();
  const { flashBadge, msgBadge, demandaBadge } = useDashboardBadges(user?.id, role === 'empresario');
  const flashTotal = flashBadge + demandaBadge;
  // "Inicio" lleva al mapa de gremios, que es donde aterriza el dashboard.
  // Antes iba al listado del propio gremio; se queda marcado como activo
  // también en esos listados porque se llega a ellos desde aquí — sin eso,
  // navegar a un rol dejaba la barra entera sin ningún tab encendido.
  // Tab bar simétrico de 4: Inicio, Flash Booking, Chat, Perfil — todos con
  // el mismo peso visual, sin FAB elevado (se probó centrado con un hueco
  // invisible y quedó descentrado con solo 3 tabs reales; resucitar el tab
  // de Descubrir no es una opción porque ya no funciona bien, así que se
  // simplifica a un tab bar plano de verdad en vez de fingir simetría).
  const tabs: Tab[] = [
    { id: 'explorar', icon: Home, label: 'Inicio', isActive: activeView === 'explorar' || dirViews.has(activeView) },
    { id: 'flashbooking', icon: Zap, label: 'Flash', isActive: activeView === 'flashbooking' || activeView === 'flash', badge: flashTotal, alerta: flashTotal > 0 },
    { id: 'messages', icon: MessageSquare, label: 'Chat', isActive: activeView === 'messages', badge: Math.max(unreadCount, msgBadge) },
    { id: 'profile', icon: User, label: 'Perfil', isActive: activeView === 'profile' || activeView === 'ficha' || activeView === 'settings' },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex items-stretch md:hidden"
      style={{
        background: 'rgba(255,255,255,0.97)',
        borderTop: '1px solid rgba(0,0,0,0.08)',
        backdropFilter: 'blur(20px)',
        // En Chrome/Samsung Internet sobre Android, la barra de gestos no
        // siempre se reporta en env(safe-area-inset-bottom) (llega como 0px
        // aunque ocupe espacio real), y la fila de iconos quedaba pisada por
        // ella. El max() reserva un mínimo cuando el navegador no informa del
        // inset, y respeta el valor real cuando sí lo hace.
        paddingBottom: 'max(env(safe-area-inset-bottom), 12px)',
        height: 'calc(64px + max(env(safe-area-inset-bottom), 12px))',
        position: 'fixed',
      }}
    >
      {tabs.map(tab => (
        <TabButton key={tab.id} tab={tab} onClick={() => onViewChange(tab.id)} />
      ))}
    </nav>
  );
};

export default MobileBottomNav;
