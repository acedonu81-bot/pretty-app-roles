import {
  LayoutGrid, Search, MessageSquare, Megaphone, Settings,
  BarChart3, FileText, FileEdit, CalendarDays,
  ChevronDown, ChevronLeft, ChevronRight, Plus, User, Building2, Shield,
} from 'lucide-react';
import GeometricAvatar from './GeometricAvatar';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { useEffect, useState, useRef } from 'react';
import { useDashboardBadges } from '@/hooks/useDashboardBadges';
import { useAdminActivityAlert } from '@/hooks/useAdminActivityAlert';
import { REGIONS, ALL_REGIONS_LABEL, getPresetRegion, setPresetRegion } from '@/lib/regions';
import { toast } from 'sonner';
import {
  Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem,
  SidebarMenuButton, SidebarMenuBadge, SidebarProvider, useSidebar,
} from '@/components/ui/sidebar';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  // El Sheet móvil de Dashboard.tsx reutiliza este mismo componente para no
  // duplicar la navegación — ahí nunca debe colapsar a icon-rail (no hay
  // Sidebar-en-Sheet anidado: el Sheet ya lo pone el padre).
  forceExpanded?: boolean;
}

// El directorio ya no usa un color distinto por rol (arcoíris sin
// relación con la marca) — un único acento dorado indica "activo",
// coherente con el resto de XPEAK.
const DIRECTORY_ITEMS: { id: string; label: string }[] = [
  { id: 'dj', label: 'DJs, Artistas & Música en Vivo' },
  { id: 'grupo-musical', label: 'Grupos Musicales' },
  { id: 'staff', label: 'Camareros' },
  { id: 'azafata', label: 'Azafatas' },
  { id: 'event_manager', label: 'Encargadas de Eventos' },
  { id: 'bailarin', label: 'Instructores & Bailarines' },
  { id: 'makeup', label: 'Maquillaje & Peluquería' },
  { id: 'media', label: 'Media & Contenido' },
  { id: 'photo-booth', label: 'Photo Booth' },
  { id: 'mago', label: 'Magos & Ilusionistas' },
  { id: 'humorista', label: 'Humor, Monólogos & Stand-Up' },
  { id: 'animador', label: 'Payasos & Animadores' },
  { id: 'catering', label: 'Catering & Chef' },
  { id: 'vestuario', label: 'Vestuario & Moda' },
  { id: 'promotor', label: 'Promotor & RRPP' },
  { id: 'speaker', label: 'Speakers & Presentadores' },
  { id: 'design', label: 'Diseño & Visuales' },
];
const DIRECTORY_IDS = new Set(DIRECTORY_ITEMS.map(i => i.id));

// Mismos nombres de categoría que la landing y /descubrir. "Staff" y "Sala"
// se han retirado del vocabulario: ambos significan camareros para media
// España, así que "Staff & Promoción" (que son azafatas) y "Gastro & Sala"
// (que sí son camareros) se confundían entre sí. Ahora cada etiqueta nombra
// literalmente a quien contiene.
const DIRECTORY_GROUPS: { label: string; ids: string[] }[] = [
  { label: 'Música', ids: ['dj', 'grupo-musical'] },
  { label: 'Camareros & Catering', ids: ['staff', 'catering'] },
  { label: 'Imagen & Media', ids: ['media', 'photo-booth', 'design'] },
  { label: 'Azafatas & RRPP', ids: ['azafata', 'event_manager', 'promotor', 'speaker'] },
  { label: 'Belleza & Estética', ids: ['makeup', 'vestuario'] },
  { label: 'Entretenimiento', ids: ['bailarin', 'mago', 'humorista', 'animador'] },
];

const ROLE_LABEL: Record<string, string> = { dj: 'DJ', staff: 'Camarero', azafata: 'Azafata', camarero: 'Camarero', makeup: 'Maquillaje', peluqueria: 'Peluquería', media: 'Media', empresario: 'Sala / Club', event_manager: 'Eventos', rookie: 'Promesa', vestuario: 'Estilista', catering: 'Catering & Chef', promotor: 'Promotor & RRPP', ambassador: 'Embajador', design: 'Diseño', mago: 'Mago & Ilusionista', bailarin: 'Instructor / Bailarín', humorista: 'Humorista & Cómico', monologo: 'Monólogo & Stand-Up', animador: 'Payaso & Animador', speaker: 'Speaker & Presentador', 'photo-booth': 'Photo Booth' };

const ProfileSwitcher = ({ onViewChange }: { onViewChange: (v: string) => void }) => {
  const { display_name, role, photo_url, allProfiles, switchProfile, maxProfiles, profileId } = useProfile();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Colapsado: solo el avatar, sin dropdown (cambiar de perfil exige contexto
  // de texto que no cabe en el rail de iconos — se expande el sidebar para eso).
  if (collapsed) {
    return (
      <div className="flex justify-center pb-3">
        <div style={role === 'empresario' ? { borderRadius: 9, boxShadow: '0 0 0 2px #D4AF37, 0 0 0 4px rgba(212,175,55,0.2)', display: 'inline-flex' } : { display: 'inline-flex' }}>
          {photo_url && photo_url.trim().length > 5 ? (
            <img src={photo_url} alt={display_name || 'Mi perfil'} width={32} height={32} className="rounded-lg object-cover flex-shrink-0" style={{ width: 32, height: 32 }} />
          ) : (
            <GeometricAvatar role={role as any} seed={(profileId ?? '').charCodeAt(0) || 0} size={32} />
          )}
        </div>
      </div>
    );
  }

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

const NavItem = ({ icon: Icon, label, isActive, onClick, badge, badgeColor, iconAlert }: {
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  label: string;
  isActive: boolean;
  onClick: () => void;
  badge?: number;
  badgeColor?: 'gold' | 'blue';
  /** Tiñe el icono de verde y lo hace latir: algo reclama atención aquí.
   *  Se ve incluso con el sidebar colapsado a iconos, que es cuando el número
   *  del badge queda oculto. */
  iconAlert?: boolean;
}) => (
  <SidebarMenuItem>
    <SidebarMenuButton
      onClick={onClick}
      isActive={isActive}
      tooltip={label}
      className="h-auto py-2 px-2.5 rounded-[11px] text-[0.82rem]"
      style={{
        fontWeight: isActive ? 700 : 600,
        color: isActive ? '#B8941E' : '#0a0908',
        background: isActive ? 'rgba(212,175,55,0.16)' : 'transparent',
      }}
    >
      {isActive && (
        <span className="absolute rounded-r-[3px] group-data-[collapsible=icon]:hidden" style={{ left: -14, top: '50%', transform: 'translateY(-50%)', width: 3, height: 16, background: 'linear-gradient(180deg,#D4AF37,#B8941E)' }} />
      )}
      <span
        className={`flex-shrink-0 flex items-center justify-center${iconAlert ? ' motion-safe:animate-pulse' : ''}`}
        style={{ width: 17, height: 17, color: iconAlert ? '#16a34a' : isActive ? '#B8941E' : 'rgba(10,9,8,0.55)' }}
      >
        <Icon size={17} />
      </span>
      <span className="flex-1">{label}</span>
    </SidebarMenuButton>
    {typeof badge === 'number' && badge > 0 && (
      <SidebarMenuBadge
        className="text-[0.62rem] px-1.5 py-0.5 rounded-full font-black leading-none static ml-auto mr-1 group-data-[collapsible=icon]:hidden"
        style={badgeColor === 'blue'
          ? { background: 'rgba(66,133,244,0.14)', color: '#4285F4' }
          : { background: 'rgba(212,175,55,0.18)', color: '#8A6D0F' }}
      >
        {badge}
      </SidebarMenuBadge>
    )}
  </SidebarMenuItem>
);

const GroupLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="text-[0.62rem] font-extrabold uppercase tracking-[0.12em] mb-1.5 px-2.5 group-data-[collapsible=icon]:hidden" style={{ color: 'rgba(10,9,8,0.35)' }}>
    {children}
  </div>
);

// Botón fijo que expande/colapsa el rail — deliberadamente NO usa hover para
// disparar el cambio (con ~10 ítems + submenú de 17 roles, un cursor que
// cruza la franja de refilón dispararía el panel sin que el usuario quisiera
// navegar). El clic es siempre intencional.
//
// Con fondo dorado sólido + flecha simple (no el icono "panel" de lucide,
// que se confundía con otros iconos de documento/panel) — el sidebar arranca
// colapsado por defecto, así que este es el único control visible para
// abrirlo y necesita destacar, no camuflarse con el resto de iconos.
const SidebarCollapseToggle = () => {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === 'collapsed';
  return (
    <button
      onClick={toggleSidebar}
      aria-label={collapsed ? 'Abrir menú' : 'Cerrar menú'}
      title={collapsed ? 'Abrir menú' : 'Cerrar menú'}
      className="flex-shrink-0 flex items-center justify-center rounded-full transition-transform hover:scale-105 active:scale-95"
      style={{
        width: 26, height: 26,
        background: 'linear-gradient(135deg,#E0BC4B,#B8941E)',
        color: '#1a1208',
        boxShadow: '0 1px 3px rgba(184,148,30,0.35)',
      }}
    >
      {collapsed ? <ChevronRight size={15} strokeWidth={2.75} /> : <ChevronLeft size={15} strokeWidth={2.75} />}
    </button>
  );
};

export const DashboardSidebarInner = ({ activeView, onViewChange, forceExpanded }: SidebarProps) => {
  const { role, subscription_tier } = useProfile();
  const { user } = useAuth();
  const { isAdmin } = useIsAdmin();
  // Verde solo si ha entrado algo NUEVO desde el último repaso. Sin número: un
  // contador fijo se convierte en ruido y deja de mirarse.
  const { hayNuevo } = useAdminActivityAlert(isAdmin);
  const { state, setOpen } = useSidebar();
  const collapsed = state === 'collapsed';
  const isAgency = subscription_tier === 'agency' || subscription_tier === 'elite';
  const isEmpresario = role === 'empresario';
  const { flashBadge, msgBadge } = useDashboardBadges(user?.id, isEmpresario);
  // El directorio arranca siempre cerrado — evita que la lista de 16
  // roles domine la barra; se abre solo si el usuario quiere explorar,
  // o automáticamente si la vista activa ya es una de directorio.
  const [dirOpen, setDirOpen] = useState(() => DIRECTORY_IDS.has(activeView));
  // Dentro del directorio, los roles van agrupados por categoría (mismo
  // naming que la landing) en vez de una lista plana de 15 — el grupo que
  // contiene la vista activa se abre solo.
  const [openGroup, setOpenGroup] = useState<string | null>(
    () => DIRECTORY_GROUPS.find(g => g.ids.includes(activeView))?.label ?? null
  );
  const [selectedRegion, setSelectedRegion] = useState(() => getPresetRegion());

  useEffect(() => {
    if (DIRECTORY_IDS.has(activeView)) {
      setDirOpen(true);
      setOpenGroup(DIRECTORY_GROUPS.find(g => g.ids.includes(activeView))?.label ?? null);
    }
  }, [activeView]);

  const homeView = role === 'dj' ? 'dj' : (role ?? 'dj');
  const directoryItems = DIRECTORY_ITEMS;

  return (
    <Sidebar collapsible={forceExpanded ? 'none' : 'icon'} style={{ '--sidebar-width': '272px' } as React.CSSProperties}>
      <SidebarHeader className="p-0 overflow-hidden" style={{ background: '#faf9f6' }}>
        <div className="w-full px-5 pt-[22px] pb-4 flex items-center justify-between group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:gap-2 group-data-[collapsible=icon]:items-center" style={{ borderBottom: '1px solid rgba(10,9,8,0.05)' }}>
          <button onClick={() => onViewChange(homeView)} className="text-left transition-opacity hover:opacity-70">
            <h2 className="text-[1.3rem] font-black tracking-[0.02em] font-display group-data-[collapsible=icon]:text-[1.1rem]">
              X<span className="text-gradient group-data-[collapsible=icon]:hidden">PEAK</span>
            </h2>
            <p className="text-[0.62rem] mt-1 tracking-[0.14em] uppercase font-extrabold group-data-[collapsible=icon]:hidden" style={{ color: 'rgba(10,9,8,0.35)' }}>España · Directorio Profesional</p>
          </button>
          {!forceExpanded && <SidebarCollapseToggle />}
        </div>
        <div className="pt-3">
          <ProfileSwitcher onViewChange={onViewChange} />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 pb-4 no-scrollbar gap-0" style={{ background: '#faf9f6' }}>
        {/* PANEL — lo que se usa cada día, siempre visible sin scroll */}
        <div className="mb-1">
          <GroupLabel>Panel</GroupLabel>
          <SidebarMenu>
            <NavItem icon={LayoutGrid} label="Inicio" isActive={activeView === homeView} onClick={() => onViewChange(homeView)} />
            <NavItem icon={Megaphone} label="Flash Booking" isActive={activeView === 'flashbooking'} onClick={() => onViewChange('flashbooking')} badge={flashBadge} badgeColor="gold" />
            <NavItem icon={MessageSquare} label="Mensajes" isActive={activeView === 'messages'} onClick={() => onViewChange('messages')} badge={msgBadge} badgeColor="blue" />
          </SidebarMenu>
        </div>

        <hr className="my-2.5 mx-1" style={{ border: 'none', borderTop: '1px solid rgba(10,9,8,0.05)' }} />

        {/* DIRECTORIO — colapsado por defecto; dentro, los roles van agrupados
            por categoría (mismo naming que la landing) en vez de una lista
            plana de 15 roles sueltos. Con el rail en icon-only, un clic
            expande el sidebar entero (no tiene sentido navegar 17 roles en
            modo icono). */}
        <div className="mb-1">
          <GroupLabel>Explorar</GroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => {
                  // En modo icono el submenú no se renderiza (17 roles no caben
                  // en una barra de 48px) — sin esto, pulsar aquí colapsado no
                  // hacía nada visible, dando la sensación de que el Directorio
                  // "no sale". Expandir primero, luego abrir el submenú.
                  if (collapsed) setOpen(true);
                  setDirOpen(o => !o);
                }}
                tooltip="Directorio"
                className="h-auto py-2 px-2.5 rounded-[11px]"
              >
                <span className="flex-shrink-0 flex items-center justify-center" style={{ width: 17, height: 17, color: 'rgba(10,9,8,0.55)' }}>
                  <Search size={17} />
                </span>
                <span className="flex-1 text-[0.82rem] font-bold truncate">Directorio</span>
                <ChevronDown size={13} className="group-data-[collapsible=icon]:hidden" style={{ color: 'rgba(10,9,8,0.35)', transform: dirOpen ? 'rotate(180deg)' : undefined, transition: 'transform 0.2s', flexShrink: 0 }} />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          {dirOpen && !collapsed && (
            <div className="flex flex-col gap-0.5 mt-0.5 ml-[30px] pl-2.5 py-0.5" style={{ borderLeft: '1px solid rgba(10,9,8,0.06)', maxHeight: 380, overflowY: 'auto' }}>
              {/* Comunidad — el 80-90% busca cerca de su zona; preseleccionar
                  aquí evita repetir el filtro dentro de cada vista de rol
                  (el desplegable de DirectoryView respeta este mismo valor). */}
              <select
                value={selectedRegion}
                onChange={e => {
                  const region = e.target.value;
                  setSelectedRegion(region);
                  setPresetRegion(region);
                  toast.success(
                    region === ALL_REGIONS_LABEL
                      ? 'Filtro de comunidad quitado'
                      : `Filtrando por ${region} — se aplica al entrar a un rol`
                  );
                }}
                className="mb-1.5 w-full text-[0.72rem] font-bold rounded-lg px-2 py-1.5 outline-none"
                style={{ background: 'rgba(10,9,8,0.035)', color: 'rgba(10,9,8,0.75)', border: '1px solid rgba(10,9,8,0.08)' }}
              >
                <option value={ALL_REGIONS_LABEL}>Todas las comunidades</option>
                {REGIONS.map(r => <option key={r.label} value={r.label}>{r.label}</option>)}
              </select>

              {DIRECTORY_GROUPS.map(group => {
                const items = directoryItems.filter(i => group.ids.includes(i.id));
                if (items.length === 0) return null;
                const groupHasActive = items.some(i => i.id === activeView);
                const isGroupOpen = openGroup === group.label;
                return (
                  <div key={group.label} className="flex flex-col">
                    <button
                      onClick={() => setOpenGroup(o => (o === group.label ? null : group.label))}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-[9px] text-left text-[0.78rem] transition-all"
                      style={{
                        fontWeight: groupHasActive ? 700 : 600,
                        color: groupHasActive ? '#B8941E' : 'rgba(10,9,8,0.7)',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(10,9,8,0.035)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <span className="flex-1 truncate">{group.label}</span>
                      <ChevronDown size={11} style={{ color: 'rgba(10,9,8,0.35)', transform: isGroupOpen ? 'rotate(180deg)' : undefined, transition: 'transform 0.2s', flexShrink: 0 }} />
                    </button>

                    {isGroupOpen && (
                      <div className="flex flex-col gap-0.5 ml-2.5 pl-2.5" style={{ borderLeft: '1px solid rgba(10,9,8,0.06)' }}>
                        {items.map(item => {
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
                );
              })}
            </div>
          )}
        </div>

        <hr className="my-2.5 mx-1" style={{ border: 'none', borderTop: '1px solid rgba(10,9,8,0.05)' }} />

        {/* MI CUENTA */}
        <div className="mb-1">
          <GroupLabel>Mi cuenta</GroupLabel>
          <SidebarMenu>
            <NavItem icon={User} label="Mi Perfil" isActive={activeView === 'profile'} onClick={() => onViewChange('profile')} />
            <NavItem icon={FileEdit} label="Mi Ficha" isActive={activeView === 'ficha'} onClick={() => onViewChange('ficha')} />
            {isAgency && (
              <NavItem icon={Building2} label="Panel Agencia" isActive={activeView === 'agency'} onClick={() => onViewChange('agency')} />
            )}
            <NavItem icon={BarChart3} label="Estadísticas" isActive={activeView === 'stats'} onClick={() => onViewChange('stats')} />
          </SidebarMenu>
        </div>

        <hr className="my-2.5 mx-1" style={{ border: 'none', borderTop: '1px solid rgba(10,9,8,0.05)' }} />

        {/* HERRAMIENTAS */}
        <div className="mb-1">
          <GroupLabel>Herramientas</GroupLabel>
          <SidebarMenu>
            <NavItem icon={CalendarDays} label="Calendario" isActive={activeView === 'calendar'} onClick={() => onViewChange('calendar')} />
            <NavItem icon={FileText} label="Contratos" isActive={activeView === 'contracts'} onClick={() => onViewChange('contracts')} />
          </SidebarMenu>
        </div>

        <hr className="my-2.5 mx-1" style={{ border: 'none', borderTop: '1px solid rgba(10,9,8,0.05)' }} />

        <div className="mb-1">
          <SidebarMenu>
            <NavItem icon={Settings} label="Ajustes" isActive={activeView === 'settings'} onClick={() => onViewChange('settings')} />
            {isAdmin && (
              <NavItem
                icon={Shield}
                label="Panel Admin"
                isActive={activeView === 'admin'}
                onClick={() => onViewChange('admin')}
                iconAlert={hayNuevo}
              />
            )}
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

// El wrapper de SidebarProvider (`flex min-h-svh w-full`) tiene que envolver
// TANTO el sidebar como el <main> para que el layout de shadcn calce bien
// (así lo espera su propio CSS) — por eso en desktop Dashboard.tsx pone el
// provider y usa DashboardSidebarInner directamente. Aquí solo se envuelve
// para el caso móvil, donde el Sheet de Dashboard.tsx ya aísla el contenedor
// y el sidebar es lo único que hay dentro — ahí sí es seguro que el
// SidebarProvider solo contenga al propio sidebar.
// El wrapper de SidebarProvider trae `min-h-svh` de shadcn: dentro del Sheet
// móvil eso lo hace crecer con el contenido (medido: 1690px en una pantalla de
// 843px) en vez de ceñirse al Sheet, así que SidebarContent nunca recibe una
// altura acotada, su `overflow-auto` no tiene nada que recortar y el menú deja
// de hacer scroll — "Ajustes" quedaba fuera de pantalla e inalcanzable.
// Acotarlo a la altura del Sheet devuelve el scroll interno.
const DashboardSidebar = (props: SidebarProps) => (
  <SidebarProvider
    defaultOpen={!props.forceExpanded}
    className="h-full min-h-0"
    style={{ minHeight: 0, height: '100%' } as React.CSSProperties}
  >
    <DashboardSidebarInner {...props} />
  </SidebarProvider>
);

export default DashboardSidebar;
