import {
  Headphones, UserCheck, Smile, Building2,
  User, CalendarDays,
  MessageSquare, Radio, Megaphone, Settings, Crown,
  BarChart3, Award, CreditCard,
  Camera, Heart, FileText, ShoppingBag, FileEdit,
} from 'lucide-react';
import GeometricAvatar from './GeometricAvatar';
import { useProfile } from '@/hooks/useProfile';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

// Subtle role accent colors — shown as a small dot on each directory item
const ROLE_COLORS: Record<string, string> = {
  dj:         '#4285F4',   // Google blue — music / digital
  rookie:     '#60A5FA',   // lighter blue — emerging talent
  staff:      '#34D399',   // teal — operations
  makeup:     '#F9A8D4',   // rose — beauty
  media:      '#A78BFA',   // purple — creative / visual
  empresario: '#D4AF37',   // gold — business
};

const navSections = [
  {
    label: 'DIRECTORIO',
    items: [
      { id: 'dj',         icon: Headphones, label: 'DJs & Artistas' },
      { id: 'rookie',     icon: Award,      label: 'DJ / Artista Promesa' },
      { id: 'staff',      icon: UserCheck,  label: 'Staff & Promoción' },
      { id: 'makeup',     icon: Smile,      label: 'Maquillaje & Peluquería' },
      { id: 'media',      icon: Camera,     label: 'Media & Contenido' },
      { id: 'empresario', icon: Building2,  label: 'Panel Empresario' },
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
      { id: 'profile', icon: User,     label: 'Mi Perfil'    },
      { id: 'ficha',   icon: FileEdit, label: 'Mi Ficha'     },
      { id: 'fanclub', icon: Heart,    label: 'Fan Club', pulse: true, badge: 'NEW' },
      { id: 'stats', icon: BarChart3, label: 'Estadísticas' },
      { id: 'subscription', icon: CreditCard, label: 'Suscripción' },
    ],
  },
  {
    label: 'HERRAMIENTAS',
    items: [
      { id: 'calendar',   icon: CalendarDays,  label: 'Calendario' },
      { id: 'messages',   icon: MessageSquare, label: 'Mensajes' },
      { id: 'contracts',  icon: FileText,      label: 'Contratos' },
      { id: 'store',      icon: ShoppingBag,   label: 'Tienda', badge: 'SOON' },
    ],
  },
  {
    label: 'CONFIGURACIÓN',
    items: [
      { id: 'settings', icon: Settings, label: 'Ajustes' },
    ],
  },
];

// Blue accent for tool/integration sections (Calendar, Messages)
const TOOL_BLUE_IDS = new Set(['calendar', 'messages', 'escenario', 'flashbooking']);

const DashboardSidebar = ({ activeView, onViewChange }: SidebarProps) => {
  const { role } = useProfile();
  const isEmpresario = role === 'empresario';

  return (
    <aside
      className="w-[260px] h-full flex flex-col z-10 flex-shrink-0"
      style={{ background: '#080808', borderRight: '1px solid var(--nightlife-border)' }}
    >
      <div className="p-6 flex items-center gap-3" style={{ borderBottom: '1px solid var(--nightlife-border)' }}>
        <button onClick={() => onViewChange('dj')} className="text-left transition-opacity hover:opacity-70">
          <h2 className="text-xl font-black tracking-widest font-display">
            X<span className="text-gradient">PEAK</span>
          </h2>
          <p className="text-[0.75rem] text-muted-foreground mt-0.5 tracking-widest uppercase">Europa · Directorio Profesional</p>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-4">
        {navSections.map((section) => (
          <div key={section.label} className="mb-3">
            <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-2 px-3">
              {section.label}
            </div>
            {section.items.filter(item => item.id !== 'empresario' || isEmpresario).map((item) => {
              const isActive = activeView === item.id;
              const hasPulse = 'pulse' in item && item.pulse;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm font-medium transition-all duration-200 text-left"
                  style={{
                    color: isActive
                      ? (TOOL_BLUE_IDS.has(item.id) ? '#4285F4' : '#D4AF37')
                      : 'var(--nightlife-text-secondary)',
                    background: isActive
                      ? (TOOL_BLUE_IDS.has(item.id) ? 'rgba(66,133,244,0.08)' : 'rgba(212,175,55,0.08)')
                      : undefined,
                    borderLeft: isActive
                      ? `2px solid ${TOOL_BLUE_IDS.has(item.id) ? '#4285F4' : '#D4AF37'}`
                      : '2px solid transparent',
                  }}
                >
                  <item.icon size={18} style={{
                    color: ROLE_COLORS[item.id] ?? (TOOL_BLUE_IDS.has(item.id) ? '#4285F4' : undefined),
                    opacity: isActive ? 1 : 0.7,
                  }} />
                  <span className="flex-1">{item.label}</span>
                  {ROLE_COLORS[item.id] && (
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-200"
                      style={{
                        background: ROLE_COLORS[item.id],
                        opacity: isActive ? 1 : 0.35,
                        boxShadow: isActive ? `0 0 6px ${ROLE_COLORS[item.id]}` : 'none',
                      }}
                    />
                  )}
                  {hasPulse && (
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#D4AF37' }} />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background: '#D4AF37' }} />
                    </span>
                  )}
                  {'badge' in item && (item as any).badge && (
                    <span className="text-xs px-1.5 py-0.5 rounded font-bold"
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

    </aside>
  );
};

export default DashboardSidebar;
