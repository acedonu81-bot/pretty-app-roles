import {
  Headphones, UserCheck, Smile, Shirt, Building2,
  User, Map, CalendarDays,
  MessageSquare, Radio, Megaphone, Settings, Crown,
  BarChart3, Zap, Award, CreditCard,
  Camera, Palette, Flag,
} from 'lucide-react';
import GeometricAvatar from './GeometricAvatar';
import xpeakLogo from '@/assets/xpeak-logo.png';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const navSections = [
  {
    label: 'DIRECTORIO',
    items: [
      { id: 'dj', icon: Headphones, label: 'DJs' },
      { id: 'rookie', icon: Award, label: 'DJ Promesa' },
      { id: 'staff', icon: UserCheck, label: 'Personal de Sala' },
      { id: 'makeup', icon: Smile, label: 'Maquillaje & Peluquería' },
      { id: 'vestuario', icon: Shirt, label: 'Vestuario & Moda' },
      { id: 'media', icon: Camera, label: 'Media & Contenido' },
      { id: 'design', icon: Palette, label: 'Diseño & Visuales' },
      { id: 'ambassador', icon: Flag, label: 'Promoción' },
      { id: 'empresario', icon: Building2, label: 'Panel Empresario' },
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
      { id: 'subscription', icon: CreditCard, label: 'Suscripción' },
      { id: 'fanclub', icon: Crown, label: 'Fan Club' },
      { id: 'flash', icon: Zap, label: 'Flash Booking', pulse: true },
      { id: 'mapa', icon: Map, label: 'Directorio Salas' },
    ],
  },
  {
    label: 'HERRAMIENTAS',
    items: [
      { id: 'calendar', icon: CalendarDays, label: 'Calendario' },
      { id: 'messages', icon: MessageSquare, label: 'Mensajes' },
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
      style={{ background: '#0a0a0a', borderRight: '1px solid var(--nightlife-border)' }}
    >
      <div className="p-6 flex items-center gap-3" style={{ borderBottom: '1px solid var(--nightlife-border)' }}>
        <img src={xpeakLogo} alt="XPEAK" width={32} height={32} />
        <div>
          <h2 className="text-xl font-bold tracking-wider">
            X<span className="text-gradient">PEAK</span>
          </h2>
          <p className="text-[0.55rem] text-muted-foreground mt-0.5 tracking-widest uppercase">España · Directorio Profesional</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-4">
        {navSections.map((section) => (
          <div key={section.label} className="mb-3">
            <div className="text-[0.6rem] text-muted-foreground uppercase tracking-widest font-bold mb-2 px-3">
              {section.label}
            </div>
            {section.items.map((item) => {
              const isActive = activeView === item.id;
              const hasPulse = 'pulse' in item && item.pulse;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm font-medium transition-all duration-200 text-left"
                  style={{
                    color: isActive ? '#D4AF37' : 'var(--nightlife-text-secondary)',
                    background: isActive ? 'rgba(212,175,55,0.08)' : undefined,
                    borderLeft: isActive ? '2px solid #D4AF37' : '2px solid transparent',
                  }}
                >
                  <item.icon size={18} />
                  <span className="flex-1">{item.label}</span>
                  {hasPulse && (
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#D4AF37' }} />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background: '#D4AF37' }} />
                    </span>
                  )}
                  {'badge' in item && (item as any).badge && (
                    <span className="text-[0.65rem] px-1.5 py-0.5 rounded font-bold"
                      style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37' }}>
                      {(item as any).badge as string}
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
          <p className="text-xs font-semibold truncate">Soporte NightLife</p>
          <p className="text-[0.6rem] font-bold" style={{ color: '#D4AF37' }}>XPEAK Admin</p>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
