import {
  Headphones, UserCheck, Smile, Building2,
  User, CalendarDays,
  MessageSquare, Radio, Megaphone, Settings,
  BarChart3, Award,
  Camera, FileText, FileEdit, CalendarCheck,
  Palette, Shirt, Speaker, ChevronDown, Plus,
} from 'lucide-react';
import GeometricAvatar from './GeometricAvatar';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

// Subtle role accent colors — shown as a small dot on each directory item
const ROLE_COLORS: Record<string, string> = {
  dj:            '#4285F4',
  rookie:        '#60A5FA',
  staff:         '#34D399',
  event_manager: '#2DD4BF',
  makeup:        '#F9A8D4',
  media:         '#A78BFA',
  empresario:    '#D4AF37',
  vestuario:     '#FB923C',
  design:        '#E879F9',
  promotor:      '#38BDF8',
};

const navSections = [
  {
    label: 'DIRECTORIO',
    items: [
      { id: 'dj',         icon: Headphones, label: 'DJs & Artistas' },
      { id: 'rookie',     icon: Award,      label: 'DJ / Artista Promesa' },
      { id: 'staff',         icon: UserCheck,      label: 'Staff & Promoción' },
      { id: 'event_manager', icon: CalendarCheck,  label: 'Encargadas de Eventos' },
      { id: 'makeup',     icon: Smile,      label: 'Maquillaje & Peluquería' },
      { id: 'media',      icon: Camera,     label: 'Media & Contenido' },
      { id: 'vestuario',  icon: Shirt,      label: 'Vestuario & Moda' },
      { id: 'design',     icon: Palette,    label: 'Diseño & Visuales' },
      { id: 'promotor',   icon: Speaker,    label: 'Promotores' },
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
      { id: 'stats', icon: BarChart3, label: 'Estadísticas' },
    ],
  },
  {
    label: 'HERRAMIENTAS',
    items: [
      { id: 'calendar',   icon: CalendarDays,  label: 'Calendario' },
      { id: 'messages',   icon: MessageSquare, label: 'Mensajes' },
      { id: 'contracts',  icon: FileText,      label: 'Contratos' },
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

const ROLE_LABEL: Record<string, string> = { dj: 'DJ', staff: 'Staff', makeup: 'Makeup', media: 'Media', empresario: 'Sala', event_manager: 'Eventos', rookie: 'Promesa', vestuario: 'Estilista' };

const ProfileSwitcher = ({ onViewChange }: { onViewChange: (v: string) => void }) => {
  const { display_name, role, photo_url, allProfiles, switchProfile, maxProfiles, profileId } = useProfile();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (allProfiles.length <= 1 && maxProfiles <= 1) return null;

  return (
    <div ref={ref} className="relative px-4 pb-3 pt-2" style={{ borderBottom: '1px solid var(--nightlife-border)' }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all hover:bg-white/5"
        style={{ border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <GeometricAvatar role={role as any} seed={(profileId ?? '').charCodeAt(0) || 0} size={28} />
        <div className="flex-1 min-w-0 text-left">
          <p className="text-xs font-bold truncate leading-tight">{display_name || 'Mi perfil'}</p>
          <p className="text-[0.6rem] font-bold uppercase tracking-wider" style={{ color: 'rgba(212,175,55,0.7)' }}>
            {ROLE_LABEL[role] ?? role}
          </p>
        </div>
        <ChevronDown size={13} style={{ color: 'rgba(255,255,255,0.3)', transform: open ? 'rotate(180deg)' : undefined, transition: 'transform 0.2s' }} />
      </button>

      {open && (
        <div className="absolute left-4 right-4 top-full mt-1 rounded-xl overflow-hidden z-50 shadow-xl"
          style={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)' }}>
          {allProfiles.map(p => (
            <button key={p.id} onClick={() => { switchProfile(p.id); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-all hover:bg-white/5"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: p.id === profileId ? 'rgba(212,175,55,0.06)' : undefined }}>
              <GeometricAvatar role={p.role as any} seed={p.id.charCodeAt(0)} size={24} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate">{p.display_name}</p>
                <p className="text-[0.6rem]" style={{ color: 'rgba(255,255,255,0.35)' }}>{ROLE_LABEL[p.role] ?? p.role}</p>
              </div>
              {p.id === profileId && <span className="text-[0.6rem] font-black" style={{ color: '#D4AF37' }}>●</span>}
            </button>
          ))}
          {allProfiles.length < maxProfiles && (
            <button onClick={() => { setOpen(false); onViewChange('settings'); }}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-bold transition-all hover:bg-white/5"
              style={{ color: 'rgba(212,175,55,0.7)' }}>
              <Plus size={13} /> Añadir perfil
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const DashboardSidebar = ({ activeView, onViewChange }: SidebarProps) => {
  const { role, subscription_tier } = useProfile();
  const { user } = useAuth();
  const isAgency = subscription_tier === 'agency' || subscription_tier === 'elite';
  const isEmpresario = role === 'empresario';
  const [flashBadge, setFlashBadge] = useState(0);
  const [msgBadge, setMsgBadge] = useState(0);

  useEffect(() => {
    if (!user || isEmpresario) return;
    supabase.from('flash_bookings' as any)
      .select('id', { count: 'exact', head: true })
      .eq('professional_user_id', user.id)
      .eq('status', 'pending')
      .then(({ count }) => setFlashBadge(count ?? 0));
  }, [user, isEmpresario]);

  const refreshMsgBadge = async (uid: string) => {
    const { data } = await supabase.from('conversations')
      .select('id')
      .or(`participant_a.eq.${uid},participant_b.eq.${uid}`)
      .limit(30);
    if (!data || data.length === 0) return;
    const ids = data.map((c: { id: string }) => c.id);
    const { count } = await supabase.from('messages')
      .select('id', { count: 'exact', head: true })
      .in('conversation_id', ids)
      .neq('sender_id', uid)
      .eq('read', false);
    setMsgBadge(count ?? 0);
  };

  useEffect(() => {
    if (!user) return;
    refreshMsgBadge(user.id);
    const channel = supabase
      .channel('sidebar_msgs')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => {
        refreshMsgBadge(user.id);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages' }, () => {
        refreshMsgBadge(user.id);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

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

      <ProfileSwitcher onViewChange={onViewChange} />

      <nav className="flex-1 overflow-y-auto px-4 py-4">
        {navSections.map((section) => {
          let items = section.label === 'MI CUENTA' && isAgency
            ? [...section.items.slice(0, 2), { id: 'agency', icon: Building2, label: 'Panel Agencia', badge: 'AGENCIA' as const }, ...section.items.slice(2)]
            : section.items;
          // "Artista Promesa" only visible for dj/rookie roles
          if (role !== 'dj' && role !== 'rookie') {
            items = items.filter(i => i.id !== 'rookie');
          }
          return (
          <div key={section.label} className="mb-3">
            <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-2 px-3">
              {section.label}
            </div>
            {items.map((item) => {
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
                  {item.id === 'flashbooking' && flashBadge > 0 && (
                    <span className="text-xs px-1.5 py-0.5 rounded-full font-black"
                      style={{ background: 'rgba(212,175,55,0.2)', color: '#D4AF37' }}>
                      {flashBadge}
                    </span>
                  )}
                  {item.id === 'messages' && msgBadge > 0 && (
                    <span className="text-xs px-1.5 py-0.5 rounded-full font-black"
                      style={{ background: 'rgba(66,133,244,0.2)', color: '#4285F4' }}>
                      {msgBadge}
                    </span>
                  )}
                  {'badge' in item && (item as any).badge && item.id !== 'flashbooking' && (
                    <span className="text-xs px-1.5 py-0.5 rounded font-bold"
                      style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37' }}>
                      {(item as any).badge as string}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          );
        })}
      </nav>

    </aside>
  );
};

export default DashboardSidebar;
