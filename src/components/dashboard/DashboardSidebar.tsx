import {
  LayoutGrid, Search, MessageSquare, Megaphone, Settings,
  BarChart3, FileText, FileEdit, CalendarDays,
  ChevronDown, Plus, User, Building2, Shield,
} from 'lucide-react';
import GeometricAvatar from './GeometricAvatar';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

// El directorio ya no usa un color distinto por rol (arcoíris sin
// relación con la marca) — un único acento dorado indica "activo",
// coherente con el resto de XPEAK.
const DIRECTORY_ITEMS: { id: string; label: string }[] = [
  { id: 'dj', label: 'DJs, Artistas & Música en Vivo' },
  { id: 'staff', label: 'Camareros' },
  { id: 'azafata', label: 'Azafatas' },
  { id: 'event_manager', label: 'Encargadas de Eventos' },
  { id: 'bailarin', label: 'Instructores & Bailarines' },
  { id: 'makeup', label: 'Maquillaje & Peluquería' },
  { id: 'media', label: 'Media & Contenido' },
  { id: 'mago', label: 'Magos & Ilusionistas' },
  { id: 'humorista', label: 'Humor, Monólogos & Stand-Up' },
  { id: 'animador', label: 'Payasos & Animadores' },
  { id: 'catering', label: 'Catering & Chef' },
  { id: 'vestuario', label: 'Vestuario & Moda' },
  { id: 'promotor', label: 'Promotor & RRPP' },
  { id: 'speaker', label: 'Speakers & Presentadores' },
  { id: 'design', label: 'Diseño & Visuales' },
  { id: 'empresario', label: 'Panel Empresario' },
];
const DIRECTORY_IDS = new Set(DIRECTORY_ITEMS.map(i => i.id));

const ROLE_LABEL: Record<string, string> = { dj: 'DJ', staff: 'Camarero', azafata: 'Azafata', camarero: 'Camarero', makeup: 'Maquillaje', peluqueria: 'Peluquería', media: 'Media', empresario: 'Sala / Club', event_manager: 'Eventos', rookie: 'Promesa', vestuario: 'Estilista', catering: 'Catering & Chef', promotor: 'Promotor & RRPP', ambassador: 'Embajador', design: 'Diseño', mago: 'Mago & Ilusionista', bailarin: 'Instructor / Bailarín', humorista: 'Humorista & Cómico', monologo: 'Monólogo & Stand-Up', animador: 'Payaso & Animador', speaker: 'Speaker & Presentador', 'photo-booth': 'Photo Booth' };

const ProfileSwitcher = ({ onViewChange }: { onViewChange: (v: string) => void }) => {
  const { display_name, role, photo_url, allProfiles, switchProfile, maxProfiles, profileId } = useProfile();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative px-3.5 pb-3">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-2xl transition-all"
        style={{ background: '#fff', border: '1px solid rgba(10,9,8,0.08)' }}
      >
        <div style={role === 'empresario' ? { borderRadius: 9, boxShadow: '0 0 0 2px #D4AF37, 0 0 0 4px rgba(212,175,55,0.2)', display: 'inline-flex' } : { display: 'inline-flex' }}>
          {photo_url && photo_url.trim().length > 5 ? (
            <img src={photo_url} alt={display_name || 'Mi perfil'} width={32} height={32} className="rounded-lg object-cover flex-shrink-0" style={{ width: 32, height: 32 }} />
          ) : (
            <GeometricAvatar role={role as any} seed={(profileId ?? '').charCodeAt(0) || 0} size={32} />
          )}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="text-[0.8rem] font-extrabold truncate leading-tight">{display_name || 'Mi perfil'}</p>
          <p className="text-[0.6rem] font-extrabold uppercase tracking-wider mt-0.5" style={{ color: '#B8941E' }}>
            {ROLE_LABEL[role] ?? role}
          </p>
        </div>
        <ChevronDown size={13} style={{ color: 'rgba(10,9,8,0.35)', transform: open ? 'rotate(180deg)' : undefined, transition: 'transform 0.2s' }} />
      </button>

      {open && (
        <div className="absolute left-3.5 right-3.5 top-full mt-2 rounded-2xl overflow-hidden z-50 p-1"
          style={{ background: '#fff', border: '1px solid rgba(10,9,8,0.1)', boxShadow: '0 8px 24px rgba(10,9,8,0.1)' }}>
          {allProfiles.map(p => (
            <button key={p.id} onClick={() => { switchProfile(p.id); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-all hover:bg-black/5 rounded-xl"
              style={{ background: p.id === profileId ? 'rgba(212,175,55,0.08)' : undefined }}>
              <div style={p.role === 'empresario' ? { borderRadius: 6, boxShadow: '0 0 0 2px #D4AF37, 0 0 0 4px rgba(212,175,55,0.25)', display: 'inline-flex' } : { display: 'inline-flex' }}>
                {p.photo_url && p.photo_url.trim().length > 5 ? (
                  <img src={p.photo_url} alt={p.display_name} width={24} height={24} className="rounded-lg object-cover flex-shrink-0" style={{ width: 24, height: 24 }} />
                ) : (
                  <GeometricAvatar role={p.role as any} seed={p.id.charCodeAt(0)} size={24} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate">{p.display_name}</p>
                <p className="text-[0.6rem]" style={{ color: 'rgba(10,9,8,0.45)' }}>{ROLE_LABEL[p.role] ?? p.role}</p>
              </div>
              {p.id === profileId && <span className="text-[0.6rem] font-black" style={{ color: '#8A6D0F' }}>●</span>}
            </button>
          ))}
          {allProfiles.length < maxProfiles && (
            <button onClick={() => { setOpen(false); onViewChange('settings'); }}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-bold transition-all hover:bg-black/5 rounded-xl"
              style={{ color: 'rgba(212,175,55,0.85)' }}>
              <Plus size={13} /> Añadir perfil
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const NavItem = ({ icon: Icon, label, isActive, onClick, badge, badgeColor }: {
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  label: string;
  isActive: boolean;
  onClick: () => void;
  badge?: number;
  badgeColor?: 'gold' | 'blue';
}) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-[11px] mb-0.5 text-[0.82rem] text-left transition-all duration-150"
    style={{
      fontWeight: isActive ? 700 : 600,
      color: isActive ? '#B8941E' : '#0a0908',
      background: isActive ? 'rgba(212,175,55,0.16)' : 'transparent',
      position: 'relative',
    }}
    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(10,9,8,0.035)'; }}
    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
  >
    {isActive && (
      <span className="absolute rounded-r-[3px]" style={{ left: -14, top: '50%', transform: 'translateY(-50%)', width: 3, height: 16, background: 'linear-gradient(180deg,#D4AF37,#B8941E)' }} />
    )}
    <span className="flex-shrink-0 flex items-center justify-center" style={{ width: 17, height: 17, color: isActive ? '#B8941E' : 'rgba(10,9,8,0.55)' }}>
      <Icon size={17} />
    </span>
    <span className="flex-1">{label}</span>
    {typeof badge === 'number' && badge > 0 && (
      <span className="text-[0.62rem] px-1.5 py-0.5 rounded-full font-black leading-none"
        style={badgeColor === 'blue'
          ? { background: 'rgba(66,133,244,0.14)', color: '#4285F4' }
          : { background: 'rgba(212,175,55,0.18)', color: '#8A6D0F' }}>
        {badge}
      </span>
    )}
  </button>
);

const GroupLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="text-[0.62rem] font-extrabold uppercase tracking-[0.12em] mb-1.5 px-2.5" style={{ color: 'rgba(10,9,8,0.35)' }}>
    {children}
  </div>
);

const DashboardSidebar = ({ activeView, onViewChange }: SidebarProps) => {
  const { role, subscription_tier } = useProfile();
  const { user } = useAuth();
  const { isAdmin } = useIsAdmin();
  const isAgency = subscription_tier === 'agency' || subscription_tier === 'elite';
  const isEmpresario = role === 'empresario';
  const [flashBadge, setFlashBadge] = useState(0);
  const [msgBadge, setMsgBadge] = useState(0);
  // El directorio arranca siempre cerrado — evita que la lista de 16
  // roles domine la barra; se abre solo si el usuario quiere explorar,
  // o automáticamente si la vista activa ya es una de directorio.
  const [dirOpen, setDirOpen] = useState(() => DIRECTORY_IDS.has(activeView));

  useEffect(() => {
    if (DIRECTORY_IDS.has(activeView)) setDirOpen(true);
  }, [activeView]);

  const refreshFlashBadge = async (uid: string) => {
    const { count } = await supabase.from('flash_bookings' as any)
      .select('id', { count: 'exact', head: true })
      .eq('professional_user_id', uid)
      .eq('status', 'pending');
    setFlashBadge(count ?? 0);
  };

  useEffect(() => {
    if (!user || isEmpresario) return;
    refreshFlashBadge(user.id);
    const channel = supabase
      .channel('sidebar_flash_bookings')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'flash_bookings', filter: `professional_user_id=eq.${user.id}` }, () => {
        refreshFlashBadge(user.id);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'flash_bookings', filter: `professional_user_id=eq.${user.id}` }, () => {
        refreshFlashBadge(user.id);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, isEmpresario]);

  const refreshMsgBadge = async (uid: string) => {
    const { data } = await supabase.from('conversations')
      .select('id')
      .or(`participant_a.eq.${uid},participant_b.eq.${uid}`)
      .limit(30);
    if (!data || data.length === 0) { setMsgBadge(0); return; }
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

  const homeView = role === 'dj' || role === 'rookie' ? 'dj' : (role ?? 'dj');
  let directoryItems = DIRECTORY_ITEMS;
  if (role !== 'dj' && role !== 'rookie') {
    directoryItems = directoryItems.filter(i => i.id !== 'rookie');
  }
  const activeDirLabel = directoryItems.find(i => i.id === activeView)?.label;

  return (
    <aside
      className="w-[272px] h-full flex flex-col z-10 flex-shrink-0"
      style={{
        background: '#faf9f6',
        borderRight: '1px solid rgba(10,9,8,0.08)',
        paddingTop: 'env(safe-area-inset-top)',
      }}
    >
      <div className="px-5 pt-[22px] pb-4" style={{ borderBottom: '1px solid rgba(10,9,8,0.05)' }}>
        <button onClick={() => onViewChange(homeView)} className="text-left transition-opacity hover:opacity-70">
          <h2 className="text-[1.3rem] font-black tracking-[0.02em] font-display">
            X<span className="text-gradient">PEAK</span>
          </h2>
          <p className="text-[0.62rem] mt-1 tracking-[0.14em] uppercase font-extrabold" style={{ color: 'rgba(10,9,8,0.35)' }}>España · Directorio Profesional</p>
        </button>
      </div>

      <div className="pt-3">
        <ProfileSwitcher onViewChange={onViewChange} />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4 no-scrollbar">
        {/* PANEL — lo que se usa cada día, siempre visible sin scroll */}
        <div className="mb-1">
          <GroupLabel>Panel</GroupLabel>
          <NavItem icon={LayoutGrid} label="Inicio" isActive={activeView === homeView} onClick={() => onViewChange(homeView)} />
          <NavItem icon={Megaphone} label="Flash Booking" isActive={activeView === 'flashbooking'} onClick={() => onViewChange('flashbooking')} badge={flashBadge} badgeColor="gold" />
          <NavItem icon={MessageSquare} label="Mensajes" isActive={activeView === 'messages'} onClick={() => onViewChange('messages')} badge={msgBadge} badgeColor="blue" />
        </div>

        <hr className="my-2.5 mx-1" style={{ border: 'none', borderTop: '1px solid rgba(10,9,8,0.05)' }} />

        {/* DIRECTORIO — colapsado por defecto, 16 roles a un clic en vez de siempre expandidos */}
        <div className="mb-1">
          <GroupLabel>Explorar</GroupLabel>
          <button
            onClick={() => setDirOpen(o => !o)}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-[11px] text-left transition-all"
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(10,9,8,0.035)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            <span className="flex-shrink-0 flex items-center justify-center" style={{ width: 17, height: 17, color: 'rgba(10,9,8,0.55)' }}>
              <Search size={17} />
            </span>
            <span className="flex-1 text-[0.82rem] font-bold truncate">
              {dirOpen ? 'Directorio' : (activeDirLabel ?? 'Directorio')}
            </span>
            <span className="text-[0.6rem] font-bold px-1.5 rounded-full flex-shrink-0" style={{ background: 'rgba(10,9,8,0.05)', color: 'rgba(10,9,8,0.4)' }}>
              {directoryItems.length}
            </span>
            <ChevronDown size={13} style={{ color: 'rgba(10,9,8,0.35)', transform: dirOpen ? 'rotate(180deg)' : undefined, transition: 'transform 0.2s', flexShrink: 0 }} />
          </button>

          {dirOpen && (
            <div className="flex flex-col gap-0.5 mt-0.5 ml-[30px] pl-2.5 py-0.5" style={{ borderLeft: '1px solid rgba(10,9,8,0.06)', maxHeight: 380, overflowY: 'auto' }}>
              {directoryItems.map(item => {
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onViewChange(item.id)}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-[9px] text-left text-[0.78rem] transition-all"
                    style={{
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#B8941E' : 'rgba(10,9,8,0.6)',
                      background: isActive ? 'rgba(212,175,55,0.1)' : 'transparent',
                    }}
                    onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(10,9,8,0.035)'; e.currentTarget.style.color = '#0a0908'; } }}
                    onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(10,9,8,0.6)'; } }}
                  >
                    <span className="rounded-full flex-shrink-0" style={{ width: 6, height: 6, background: '#D4AF37', opacity: isActive ? 1 : 0.5 }} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <hr className="my-2.5 mx-1" style={{ border: 'none', borderTop: '1px solid rgba(10,9,8,0.05)' }} />

        {/* MI CUENTA */}
        <div className="mb-1">
          <GroupLabel>Mi cuenta</GroupLabel>
          <NavItem icon={User} label="Mi Perfil" isActive={activeView === 'profile'} onClick={() => onViewChange('profile')} />
          <NavItem icon={FileEdit} label="Mi Ficha" isActive={activeView === 'ficha'} onClick={() => onViewChange('ficha')} />
          {isAgency && (
            <NavItem icon={Building2} label="Panel Agencia" isActive={activeView === 'agency'} onClick={() => onViewChange('agency')} />
          )}
          <NavItem icon={BarChart3} label="Estadísticas" isActive={activeView === 'stats'} onClick={() => onViewChange('stats')} />
        </div>

        <hr className="my-2.5 mx-1" style={{ border: 'none', borderTop: '1px solid rgba(10,9,8,0.05)' }} />

        {/* HERRAMIENTAS */}
        <div className="mb-1">
          <GroupLabel>Herramientas</GroupLabel>
          <NavItem icon={CalendarDays} label="Calendario" isActive={activeView === 'calendar'} onClick={() => onViewChange('calendar')} />
          <NavItem icon={FileText} label="Contratos" isActive={activeView === 'contracts'} onClick={() => onViewChange('contracts')} />
        </div>

        <hr className="my-2.5 mx-1" style={{ border: 'none', borderTop: '1px solid rgba(10,9,8,0.05)' }} />

        <div className="mb-1">
          <NavItem icon={Settings} label="Ajustes" isActive={activeView === 'settings'} onClick={() => onViewChange('settings')} />
          {isAdmin && (
            <NavItem icon={Shield} label="Panel Admin" isActive={activeView === 'admin'} onClick={() => onViewChange('admin')} />
          )}
        </div>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
