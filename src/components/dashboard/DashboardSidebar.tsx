import {
  Headphones, UserCheck, Smile, Briefcase,
  Star, User, Map, CalendarDays,
  MessageSquare, Radio, Megaphone, Settings, Flame,
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
      { id: 'escenario', icon: Radio, label: 'Escenario Virtual', textColor: '#ff5f56', badge: 'LIVE', badgeColor: '#ff5f56' },
      { id: 'lastcall', icon: Megaphone, label: 'Last Call', badge: '🔥', badgeColor: '#ffbc00' },
    ],
  },
  {
    label: 'DESTACADOS',
    items: [
      { id: 'topfinde', icon: Flame, label: 'TOP Finde', badge: '⭐', badgeColor: '#ffbc00' },
    ],
  },
  {
    label: 'MI CUENTA',
    items: [
      { id: 'profile', icon: User, label: 'Mi Perfil' },
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
      className="w-[280px] h-screen flex flex-col z-10 flex-shrink-0"
      style={{
        background: 'var(--nightlife-card)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid var(--nightlife-border)',
      }}
    >
      <div className="p-8" style={{ borderBottom: '1px solid var(--nightlife-border)' }}>
        <h2 className="text-2xl font-extrabold tracking-wider">
          NIGHT<span className="text-gradient">LIFE</span>
        </h2>
        <p className="text-[0.6rem] text-muted-foreground mt-1 tracking-widest uppercase">Directorio Profesional</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-6 py-6">
        {navSections.map((section) => (
          <div key={section.label} className="mb-4">
            <div className="text-xs text-muted-foreground uppercase tracking-widest font-extrabold mb-3">
              {section.label}
            </div>
            {section.items.map((item) => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 text-sm font-semibold transition-all duration-200 text-left ${
                    isActive ? 'border-l-[3px]' : 'hover:bg-white/5'
                  }`}
                  style={{
                    color: isActive ? 'var(--nightlife-primary)' : (item.textColor || 'var(--nightlife-text-secondary)'),
                    background: isActive ? 'linear-gradient(90deg, rgba(140,82,255,0.2), transparent)' : undefined,
                    borderColor: isActive ? 'var(--nightlife-primary)' : 'transparent',
                  }}
                >
                  <item.icon size={20} />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span
                      className="text-[0.7rem] px-2 py-0.5 rounded-full font-extrabold"
                      style={{
                        background: item.badgeColor ? `${item.badgeColor}22` : 'var(--nightlife-primary)',
                        color: item.badgeColor || 'white',
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="p-5 flex items-center gap-3" style={{ borderTop: '1px solid var(--nightlife-border)' }}>
        <div className="w-11 h-11 rounded-full overflow-hidden" style={{ border: '2px solid var(--nightlife-primary)' }}>
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=8c52ff" alt="Alex" className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="text-sm font-semibold">Alex (DJ Aethel)</p>
          <p className="text-xs font-extrabold text-gradient">Perfil Verificado</p>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
