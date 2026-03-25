import {
  Headphones, UserCheck, Smile, Briefcase,
  User, Map, CalendarDays,
  MessageSquare, Radio, Megaphone, Settings, Crown,
  BarChart3, Zap,
} from 'lucide-react';

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
      { id: 'lastcall', icon: Megaphone, label: 'Last Call' },
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
      { id: 'mapa', icon: Map, label: 'Mapa de Salas' },
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
        <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0" style={{ border: '1px solid rgba(212,175,55,0.3)' }}>
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=1a1a1a" alt="Alex" className="w-full h-full object-cover" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold truncate">Alex (DJ Aethel)</p>
          <p className="text-[0.6rem] font-bold" style={{ color: '#D4AF37' }}>Plan Elite</p>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
