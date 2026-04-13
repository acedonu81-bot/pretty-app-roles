import {
  Headphones, UserCheck, Smile, Building2,
  User, CalendarDays,
  MessageSquare, Radio, Megaphone, Settings, Crown,
  BarChart3, Award, CreditCard,
  Camera, Heart,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GeometricAvatar from './GeometricAvatar';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const navSections = [
  {
    label: 'DIRECTORIO',
    items: [
      { id: 'dj', icon: Headphones, label: 'DJs & Artistas' },
      { id: 'rookie', icon: Award, label: 'DJ / Artista Promesa' },
      { id: 'staff', icon: UserCheck, label: 'Staff & Promoción' },
      { id: 'makeup', icon: Smile, label: 'Maquillaje & Peluquería' },
      { id: 'media', icon: Camera, label: 'Media & Contenido' },
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
      { id: 'fanclub', icon: Heart, label: 'Fan Club', pulse: true, badge: 'NEW' },
      { id: 'stats', icon: BarChart3, label: 'Estadísticas' },
      { id: 'subscription', icon: CreditCard, label: 'Suscripción' },
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
  const navigate = useNavigate();
  return (
    <aside
      className="w-[260px] h-full flex flex-col z-10 flex-shrink-0"
      style={{ background: '#080808', borderRight: '1px solid var(--nightlife-border)' }}
    >
      <div className="p-6 flex items-center gap-3" style={{ borderBottom: '1px solid var(--nightlife-border)' }}>
        <button onClick={() => navigate('/')} className="text-left transition-opacity hover:opacity-70">
          <h2 className="text-xl font-bold tracking-wider">
            X<span className="text-gradient">PEAK</span>
          </h2>
          <p className="text-[0.55rem] text-muted-foreground mt-0.5 tracking-widest uppercase">Europa · Directorio Profesional</p>
        </button>
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

      <a
        href="https://wa.me/34600000000?text=Hola%2C%20necesito%20soporte%20con%20XPEAK"
        target="_blank"
        rel="noopener noreferrer"
        className="p-4 flex items-center gap-3 transition-all hover:opacity-80 group"
        style={{ borderTop: '1px solid var(--nightlife-border)' }}
      >
        {/* WhatsApp icon */}
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all group-hover:scale-110"
          style={{ background: 'rgba(37,211,102,0.12)', border: '1px solid rgba(37,211,102,0.25)' }}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="#25D366">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold truncate">Soporte XPEAK</p>
          <p className="text-[0.6rem] font-bold" style={{ color: '#25D366' }}>WhatsApp · Empresa</p>
        </div>
      </a>
    </aside>
  );
};

export default DashboardSidebar;
