import {
  Headphones, UserCheck, Smile, Building2,
  User, CalendarDays,
  MessageSquare, Megaphone, Settings,
  BarChart3,
  Camera, FileText, FileEdit, CalendarCheck,
  Palette, Shirt, Speaker, ChevronDown, Plus, UtensilsCrossed,
  Wand2, Music2, Laugh, Mic2, Theater, PartyPopper,
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
  catering:      '#F59E0B',
  mago:          '#8B5CF6',
  monologo:      '#EF4444',
  bailarin:      '#EC4899',
  humorista:     '#F97316',
  animador:      '#FBBF24',
  speaker:       '#06B6D4',
};

const navSections = [
  {
    label: 'DIRECTORIO',
    items: [
      { id: 'dj',         icon: Headphones, label: 'DJs, Artistas & Música en Vivo' },
      { id: 'staff',         icon: UserCheck,      label: 'Staff & Promoción' },
      { id: 'event_manager', icon: CalendarCheck,  label: 'Encargadas de Eventos' },
      { id: 'makeup',     icon: Smile,      label: 'Maquillaje & Peluquería' },
      { id: 'media',      icon: Camera,     label: 'Media & Contenido' },
      { id: 'vestuario',  icon: Shirt,      label: 'Vestuario & Moda' },
      { id: 'design',     icon: Palette,    label: 'Diseño & Visuales' },
      { id: 'promotor',   icon: Speaker,         label: 'Promotor & RRPP' },
      { id: 'catering',   icon: UtensilsCrossed, label: 'Catering & Chef' },
      { id: 'mago',       icon: Wand2,           label: 'Magos & Ilusionistas' },
      { id: 'bailarin',   icon: Music2,          label: 'Bailarines & Danza' },
      { id: 'humorista',  icon: Laugh,           label: 'Humor, Monólogos & Stand-Up' },
      { id: 'animador',   icon: PartyPopper,     label: 'Payasos & Animadores' },
      { id: 'speaker',    icon: Mic2,            label: 'Speakers & Presentadores' },
      { id: 'empresario', icon: Building2,       label: 'Panel Empresario' },
    ],
  },
  {
    label: 'CONTRATACIÓN',
    items: [
      { id: 'flashbooking', icon: Megaphone, label: 'Flash Booking' },
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

const TOOL_BLUE_IDS = new Set(['calendar', 'messages', 'flashbooking']);
const NO_COUNT_BADGE = new Set(['empresario']);

const ROLE_LABEL: Record<string, string> = { dj: 'DJ', staff: 'Staff', makeup: 'Makeup', media: 'Media', empresario: 'Sala / Club', event_manager: 'Eventos', rookie: 'Promesa', vestuario: 'Estilista', catering: 'Catering & Chef', promotor: 'Promotor & RRPP', ambassador: 'Embajador', design: 'Diseño', mago: 'Mago & Ilusionista', bailarin: 'Bailarín & Danza', humorista: 'Humorista & Cómico', monologo: 'Monólogo & Stand-Up', animador: 'Payaso & Animador', speaker: 'Speaker & Presentador' };

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
        style={{ border: '1px solid rgba(0,0,0,0.08)' }}
      >
        <div style={role === 'empresario' ? { borderRadius: 6, boxShadow: '0 0 0 2px #D4AF37, 0 0 0 4px rgba(212,175,55,0.25)', display:'inline-flex' } : { display:'inline-flex' }}>
          <GeometricAvatar role={role as any} seed={(profileId ?? '').charCodeAt(0) || 0} size={28} />
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="text-xs font-bold truncate leading-tight">{display_name || 'Mi perfil'}</p>
          <p className="text-[0.6rem] font-bold uppercase tracking-wider" style={{ color: 'rgba(212,175,55,0.7)' }}>
            {ROLE_LABEL[role] ?? role}
          </p>
        </div>
        <ChevronDown size={13} style={{ color: '#444', transform: open ? 'rotate(180deg)' : undefined, transition: 'transform 0.2s' }} />
      </button>

      {open && (
        <div className="absolute left-4 right-4 top-full mt-1 rounded-xl overflow-hidden z-50 shadow-xl"
          style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
          {allProfiles.map(p => (
            <button key={p.id} onClick={() => { switchProfile(p.id); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-all hover:bg-black/5"
              style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', background: p.id === profileId ? 'rgba(212,175,55,0.08)' : undefined }}>
              <div style={p.role === 'empresario' ? { borderRadius: 6, boxShadow: '0 0 0 2px #D4AF37, 0 0 0 4px rgba(212,175,55,0.25)', display:'inline-flex' } : { display:'inline-flex' }}>
                <GeometricAvatar role={p.role as any} seed={p.id.charCodeAt(0)} size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate">{p.display_name}</p>
                <p className="text-[0.6rem]" style={{ color: '#444' }}>{ROLE_LABEL[p.role] ?? p.role}</p>
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
  const [roleCounts, setRoleCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!user || isEmpresario) return;
    supabase.from('flash_bookings' as any)
      .select('id', { count: 'exact', head: true })
      .eq('professional_user_id', user.id)
      .eq('status', 'pending')
      .then(({ count }) => setFlashBadge(count ?? 0));
  }, [user, isEmpresario]);

  useEffect(() => {
    supabase.from('profiles' as any)
      .select('role, display_name')
      .then(({ data }) => {
        if (!data) return;
        const counts: Record<string, number> = {};
        for (const row of data as { role: string; display_name: string | null }[]) {
          if (row.role && row.display_name && row.display_name.trim().length > 1) {
            counts[row.role] = (counts[row.role] ?? 0) + 1;
          }
        }
        setRoleCounts(counts);
      });
  }, []);

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
      style={{ background: '#ffffff', borderRight: '1px solid var(--nightlife-border)', paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="px-6 py-4 flex items-center gap-3" style={{ borderBottom: '1px solid var(--nightlife-border)' }}>
        <button onClick={() => onViewChange('dj')} className="text-left transition-opacity hover:opacity-70">
          <h2 className="text-xl font-black tracking-widest font-display">
            X<span className="text-gradient">PEAK</span>
          </h2>
          <p className="text-[0.75rem] text-muted-foreground mt-0.5 tracking-widest uppercase">España · Directorio Profesional</p>
        </button>
      </div>

      <ProfileSwitcher onViewChange={onViewChange} />

      <nav className="flex-1 overflow-y-auto px-4 py-4">
        {navSections.map((section) => {
          let items = section.label === 'MI CUENTA' && isAgency
            ? [...section.items.slice(0, 2), { id: 'agency', icon: Building2, label: 'Panel Agencia', badge: 'AGENCIA' as const }, ...section.items.slice(2)]
            : section.items;
          if (role !== 'dj' && role !== 'rookie') {
            items = items.filter(i => i.id !== 'rookie');
          }
          return (
          <div key={section.label} className="mb-5">
            <div className="text-[0.7rem] text-muted-foreground uppercase tracking-widest font-black mb-2 px-3">
              {section.label}
            </div>
            {items.map((item) => {
              const isActive = activeView === item.id;
              const hasPulse = 'pulse' in item && item.pulse;
              const roleColor = ROLE_COLORS[item.id];
              const isToolBlue = TOOL_BLUE_IDS.has(item.id);
              const iconColor = roleColor ?? (isToolBlue ? '#4285F4' : '#444');
              const count = roleColor && !NO_COUNT_BADGE.has(item.id) ? roleCounts[item.id] : undefined;

              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-[0.9rem] font-semibold transition-all duration-200 text-left"
                  style={item.id === 'empresario' ? {
                    color: '#D4AF37',
                    background: isActive ? 'rgba(212,175,55,0.14)' : 'rgba(212,175,55,0.06)',
                    borderLeft: '2px solid #D4AF37',
                    boxShadow: isActive ? 'inset 0 0 20px rgba(212,175,55,0.05)' : undefined,
                  } : {
                    color: isActive
                      ? (isToolBlue ? '#4285F4' : '#D4AF37')
                      : 'var(--nightlife-text-secondary)',
                    background: isActive
                      ? (isToolBlue ? 'rgba(66,133,244,0.08)' : 'rgba(212,175,55,0.08)')
                      : undefined,
                    borderLeft: isActive
                      ? `2px solid ${isToolBlue ? '#4285F4' : '#D4AF37'}`
                      : '2px solid transparent',
                  }}
                >
                  {/* Icon with colored background for directory roles */}
                  <span
                    className="flex-shrink-0 flex items-center justify-center rounded-lg transition-all duration-200"
                    style={{
                      width: 30,
                      height: 30,
                      background: roleColor
                        ? `rgba(${hexToRgb(roleColor)}, ${isActive ? 0.18 : 0.1})`
                        : isToolBlue
                          ? `rgba(66,133,244,${isActive ? 0.18 : 0.08})`
                          : 'transparent',
                      boxShadow: item.id === 'empresario'
                        ? '0 0 0 2px #D4AF37, 0 0 0 4px rgba(212,175,55,0.2)'
                        : undefined,
                    }}
                  >
                    <item.icon size={16} style={{ color: iconColor, opacity: isActive ? 1 : 0.8 }} />
                  </span>

                  <span className="flex-1 text-[0.82rem]">{item.label}</span>

                  {/* Badge fijo para empresario */}
                  {item.id === 'empresario' && (
                    <span className="text-[0.65rem] px-1.5 py-0.5 rounded-md font-black flex-shrink-0"
                      style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37' }}>
                      4
                    </span>
                  )}

                  {/* Member count for directory roles */}
                  {count !== undefined && count > 0 && (
                    <span
                      className="text-[0.65rem] px-1.5 py-0.5 rounded-md font-black flex-shrink-0 transition-all duration-200"
                      style={{
                        background: `rgba(${hexToRgb(roleColor!)}, ${isActive ? 0.2 : 0.08})`,
                        color: isActive ? roleColor : `rgba(${hexToRgb(roleColor!)}, 0.6)`,
                      }}
                    >
                      {count}
                    </span>
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

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

export default DashboardSidebar;
