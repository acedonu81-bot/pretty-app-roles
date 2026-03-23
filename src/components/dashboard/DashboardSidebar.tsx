import {
  Headphones, Star, Users, Shield, UserCheck, Smile,
  CreditCard, User, ShieldCheck, Map, CalendarDays,
  MessageSquare, Radio, Activity, Settings, FileText,
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const navSections = [
  {
    label: 'VISTAS DE ROL',
    items: [
      { id: 'dj', icon: Headphones, label: 'DJ Setup' },
      { id: 'promotor', icon: Star, label: 'Vista Promotor' },
      { id: 'agency', icon: Users, label: 'Agencias & VIP' },
      { id: 'security', icon: Shield, label: 'Seguridad Privada' },
      { id: 'staff', icon: UserCheck, label: 'Personal de Sala' },
      { id: 'makeup', icon: Smile, label: 'Estilismo & Makeup VIP' },
    ],
  },
  {
    label: 'MI CUENTA',
    items: [
      { id: 'wallet', icon: CreditCard, label: 'Finanzas & Wallet', badge: '€2.4k', badgeColor: '#00ff88' },
      { id: 'profile', icon: User, label: 'Mi Perfil Público' },
      { id: 'kyc', icon: ShieldCheck, label: 'KYC & Verificación', badge: '✓ OK', badgeColor: '#00ff88', textColor: '#00ff88' },
      { id: 'mapa', icon: Map, label: 'Mapa de Salas' },
    ],
  },
  {
    label: 'HERRAMIENTAS GLOBALES',
    items: [
      { id: 'calendar', icon: CalendarDays, label: 'Calendario' },
      { id: 'messages', icon: MessageSquare, label: 'Mensajes', badge: '3' },
      { id: 'live', icon: Radio, label: 'Streaming EN VIVO', textColor: '#ff5f56', badge: 'LIVE', badgeColor: '#ff5f56' },
    ],
  },
  {
    label: 'CRISIS Y CONTINGENCIAS',
    items: [
      { id: 'rescue', icon: Activity, label: 'NIGHTLIFE Rescue', textColor: '#ff5f56', border: true },
    ],
  },
  {
    label: 'CONFIGURACIÓN',
    items: [
      { id: 'settings', icon: Settings, label: 'Ajustes / Settings' },
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
      {/* Logo */}
      <div className="p-8" style={{ borderBottom: '1px solid var(--nightlife-border)' }}>
        <h2 className="text-2xl font-extrabold tracking-wider">
          NIGHT<span className="text-gradient">LIFE</span>
        </h2>
      </div>

      {/* Nav */}
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
                    isActive
                      ? 'border-l-[3px]'
                      : 'hover:bg-white/5'
                  }`}
                  style={{
                    color: isActive ? 'var(--nightlife-primary)' : (item.textColor || 'var(--nightlife-text-secondary)'),
                    background: isActive ? 'linear-gradient(90deg, rgba(140,82,255,0.2), transparent)' : (item.border ? 'rgba(255,95,86,0.05)' : undefined),
                    borderColor: isActive ? 'var(--nightlife-primary)' : (item.border ? 'rgba(255,95,86,0.2)' : 'transparent'),
                    border: item.border && !isActive ? '1px solid rgba(255,95,86,0.2)' : undefined,
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
                        border: item.badgeColor === '#00ff88' ? '1px solid rgba(0,255,136,0.3)' : undefined,
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

      {/* User */}
      <div className="p-5 flex items-center gap-3" style={{ borderTop: '1px solid var(--nightlife-border)' }}>
        <div className="w-11 h-11 rounded-full overflow-hidden" style={{ border: '2px solid var(--nightlife-primary)' }}>
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=8c52ff"
            alt="Alex"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="text-sm font-semibold">Alex (DJ Aethel)</p>
          <p className="text-xs font-extrabold text-gradient">Status: Top Tier</p>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
