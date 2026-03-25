import {
  Headphones, UserCheck, Smile, Briefcase, Building2,
  User, Map, CalendarDays,
  MessageSquare, Radio, Megaphone, Settings, Crown,
  BarChart3, Zap, ShieldCheck,
} from 'lucide-react';
import GeometricAvatar from './GeometricAvatar';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const navSections = [
  {
    label: 'DIRECTORIO',
    items: [
      { id: 'dj', icon: Headphones, label: 'DJs' },
      { id: 'staff', icon: UserCheck, label: 'Personal de Sala' },
      { id: 'makeup', icon: Smile, label: 'Estilismo & Makeup' },
      { id: 'promotor', icon: Briefcase, label: 'Empresarios' },
    ],
  },
  {
    label: 'EN VIVO',
    items: [
      { id: 'escenario', icon: Radio, label: 'Escenario Virtual' },
      { id: 'flashbooking', icon: Megaphone, label: 'Flash Booking' },
    ],
  },
  {
    label: 'DESTACADOS',
    items: [
      { id: 'topweekend', icon: Crown, label: 'TOP Weekend' },
    ],
  },
  {
    label: 'MI CUENTA',
    items: [
      { id: 'profile', icon: User, label: 'Mi Perfil' },
      { id: 'stats', icon: BarChart3, label: 'Estadísticas' },
      { id: 'flash', icon: Zap, label: 'Flash Booking' },
      { id: 'mapa', icon: Map, label: 'Directorio Salas' },
    ],
  },
  {
    label: 'HERRAMIENTAS',
    items: [
      { id: 'calendar', icon: CalendarDays, label: 'Calendario' },
      { id: 'messages', icon: MessageSquare, label: 'Mensajes', badge: '3' },
    ],
  },
  {
    label: 'CONFIGURACIÓN',
    items: [
      { id: 'settings', icon: Settings, label: 'Ajustes' },
      { id: 'admin', icon: ShieldCheck, label: 'Admin', badge: '⚡' },
    ],
  },
];

const DashboardSidebar = ({ activeView, onViewChange }: SidebarProps) => {
  return (
    <aside
      className="w-[260px] h-full flex flex-col z-10 flex-shrink-0"
      style={{
        background: '#0a0a0a',
        borderRight: '1px solid var(--nightlife-border)',
      }}
    >
      <div className="p-6" style={{ borderBottom: '1px solid var(--nightlife-border)' }}>
        <h2 className="text-xl font-bold tracking-wider">
          NIGHT<span className="text-gradient">LIFE</span>
        </h2>
        <p className="text-[0.55rem] text-muted-foreground mt-1 tracking-widest uppercase">Madrid · Directorio Profesional</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-4">
        {navSections.map((section) => (
          <div key={section.label} className="mb-3">
            <div className="text-[0.6rem] text-muted-foreground uppercase tracking-widest font-bold mb-2 px-3">
              {section.label}
            </div>
            {section.items.map((item) => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm font-medium transition-all duration-200 text-left`}
                  style={{
                    color: isActive ? '#D4AF37' : 'var(--nightlife-text-secondary)',
                    background: isActive ? 'rgba(212,175,55,0.08)' : undefined,
                    borderLeft: isActive ? '2px solid #D4AF37' : '2px solid transparent',
                  }}
                >
                  <item.icon size={18} />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="text-[0.65rem] px-1.5 py-0.5 rounded font-bold"
                      style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37' }}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="p-4 flex items-center gap-3" style={{ borderTop: '1px solid var(--nightlife-border)' }}>
        <GeometricAvatar role="dj" seed={999} size={36} />
        <div className="min-w-0">
          <p className="text-xs font-semibold truncate">Alex (DJ Aethel)</p>
          <p className="text-[0.6rem] font-bold" style={{ color: '#D4AF37' }}>Plan Elite</p>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
