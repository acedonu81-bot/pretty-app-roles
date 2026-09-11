import { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AnimatePresence } from 'framer-motion';
import DashboardSidebar, { DashboardSidebarInner } from '@/components/dashboard/DashboardSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import DashboardTopbar from '@/components/dashboard/DashboardTopbar';
import RecentBusinessViewLine from '@/components/dashboard/RecentBusinessViewLine';
import TodaysRequestsLine from '@/components/dashboard/TodaysRequestsLine';
import MobileBottomNav from '@/components/dashboard/MobileBottomNav';
import AdminGuard from '@/components/AdminGuard';
import type { Profile } from '@/data/profiles';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { ProfileProvider } from '@/hooks/useProfile';

const DJView = lazy(() => import('@/components/dashboard/views/DJView'));
const StaffView = lazy(() => import('@/components/dashboard/views/StaffView'));
const AzafataView = lazy(() => import('@/components/dashboard/views/AzafataView'));
const EventManagerView = lazy(() => import('@/components/dashboard/views/EventManagerView'));
const MakeupView = lazy(() => import('@/components/dashboard/views/MakeupView'));
const PeluqueriaView = lazy(() => import('@/components/dashboard/views/PeluqueriaView'));
const MediaView = lazy(() => import('@/components/dashboard/views/MediaView'));
const AmbassadorView = lazy(() => import('@/components/dashboard/views/AmbassadorView'));
const VestuarioView = lazy(() => import('@/components/dashboard/views/VestuarioView'));
const DesignView = lazy(() => import('@/components/dashboard/views/DesignView'));
const PromotorView = lazy(() => import('@/components/dashboard/views/PromotorView'));
const CateringView = lazy(() => import('@/components/dashboard/views/CateringView'));
const MagoView = lazy(() => import('@/components/dashboard/views/MagoView'));
const BailarinView = lazy(() => import('@/components/dashboard/views/BailarinView'));
const HumoristaView = lazy(() => import('@/components/dashboard/views/HumoristaView'));
const MonologoView = lazy(() => import('@/components/dashboard/views/MonologoView'));
const AnimadorView = lazy(() => import('@/components/dashboard/views/AnimadorView'));
const SpeakerView = lazy(() => import('@/components/dashboard/views/SpeakerView'));
const SettingsView = lazy(() => import('@/components/dashboard/views/SettingsView'));
const MessagesView = lazy(() => import('@/components/dashboard/views/MessagesView'));
const CalendarView = lazy(() => import('@/components/dashboard/views/CalendarView'));
const ProfileView = lazy(() => import('@/components/dashboard/views/ProfileView'));
const MapaView = lazy(() => import('@/components/dashboard/views/MapaView'));
const FlashBookingWallView = lazy(() => import('@/components/dashboard/views/FlashBookingWallView'));
const TopWeekendView = lazy(() => import('@/components/dashboard/views/TopWeekendView'));
const StatsView = lazy(() => import('@/components/dashboard/views/StatsView'));
const AdminView = lazy(() => import('@/components/dashboard/views/AdminView'));
const EmpresarioView = lazy(() => import('@/components/dashboard/views/EmpresarioView'));
const PhotoBoothView = lazy(() => import('@/components/dashboard/views/PhotoBoothView'));
const TecnicoView = lazy(() => import('@/components/dashboard/views/TecnicoView'));
const ExplorarView = lazy(() => import('@/components/dashboard/views/ExplorarView'));
const GrupoMusicalView = lazy(() => import('@/components/dashboard/views/GrupoMusicalView'));
const ContractView = lazy(() => import('@/components/dashboard/views/ContractView'));
const FichaView = lazy(() => import('@/components/dashboard/views/FichaView'));
const AgencyView = lazy(() => import('@/components/dashboard/views/AgencyView'));
const ResourcesView = lazy(() => import('@/components/dashboard/views/ResourcesView'));
const ProfessionalProfilePage = lazy(() => import('@/components/dashboard/ProfessionalProfilePage'));
const SupportChat = lazy(() => import('@/components/dashboard/SupportChat'));
const OnboardingTour = lazy(() => import('@/components/dashboard/OnboardingTour'));
const OnboardingWizard = lazy(() => import('@/components/OnboardingWizard'));
const AmbientBackground = lazy(() => import('@/components/AmbientBackground'));
import { DEFAULT_ZONE } from '@/lib/constants';
import { logProfileView } from '@/lib/track';

const PROFILE_VIEWS = new Set(['profile', 'ficha', 'stats']);

const ProfileIncompleteBanner = ({ onNavigate, activeView }: { onNavigate: (v: string) => void; activeView: string }) => {
  const ctx = useProfile();
  const [dismissed, setDismissed] = useState(false);

  // En "Mi Perfil" la tarjeta de completitud (con checklist accionable) ya
  // cubre este aviso — mostrar también el banner ahí duplica el mismo % y
  // mensaje dos veces seguidas en la misma pantalla.
  if (ctx.loading || dismissed || activeView === 'profile') return null;

  const hasInstagram = !!(ctx.instagram && ctx.instagram.trim().length > 0);
  const steps = [
    !!ctx.photo_url,
    !!(ctx.bio && ctx.bio.trim().length > 20),
    !!(ctx.zone && ctx.zone !== DEFAULT_ZONE),
    !!(ctx.specialty && ctx.specialty.trim().length > 0),
    hasInstagram,
    ...(ctx.role !== 'empresario' ? [!!(
      (ctx.audio_embed_url && (ctx.audio_embed_url as string).trim().length > 0)
      || (Array.isArray(ctx.audio_session_urls) && ctx.audio_session_urls.length > 0)
      || (Array.isArray(ctx.portfolio_urls) && ctx.portfolio_urls.length > 0)
    )] : []),
  ];
  const missingCount = steps.filter(s => !s).length;
  const percent = Math.round((steps.filter(Boolean).length / steps.length) * 100);

  if (percent >= 100) return null;

  // Cuando Instagram es lo único que falta, un mensaje específico apela al
  // motivo real (confianza/validación) en vez del genérico "aparece mejor"
  // — mismo texto que ya usa el campo en ProfileView, reforzado aquí donde
  // el profesional lo ve sin tener que entrar a editar el perfil.
  const instagramOnlyMissing = !hasInstagram && missingCount === 1;

  return (
    <div className="mx-4 mt-3 mb-0 flex items-center gap-3 px-4 py-3 rounded-xl text-xs"
      style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.18)' }}>
      <div className="flex-1 flex items-center gap-3 min-w-0">
        <div className="w-20 h-1.5 rounded-full flex-shrink-0" style={{ background: 'rgba(0,0,0,0.08)' }}>
          <div className="h-full rounded-full" style={{ width: `${percent}%`, background: 'linear-gradient(90deg,#D4AF37,#B8941E)' }} />
        </div>
        <span style={{ color: '#222' }}>
          {instagramOnlyMissing
            ? 'Solo te falta el Instagram'
            : (<>Perfil al <strong style={{ color: '#D4AF37' }}>{percent}%</strong></>)}
          <span className="hidden sm:inline">
            {instagramOnlyMissing
              ? ' — da confianza a quien te contrate'
              : ' — los perfiles con foto, bio y portfolio salen primero en el directorio'}
          </span>
        </span>
      </div>
      <button onClick={() => onNavigate('profile')}
        className="flex-shrink-0 px-3 py-1.5 rounded-lg font-bold transition-all hover:scale-105"
        style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.25)' }}>
        Completar
      </button>
      <button onClick={() => setDismissed(true)} className="flex-shrink-0 text-lg leading-none transition-opacity hover:opacity-60"
        style={{ color: '#333' }}>×</button>
    </div>
  );
};

// NOTA: aquí vivían ROLE_DEFAULT_VIEW y el componente RoleDefaultView, un
// TERCER mecanismo que cambiaba la vista tras montar según su propio mapa —
// con criterios distintos a ROLE_TO_VIEW (p.ej. mandaba los 'dj' a 'profile').
// Competía en carrera con el estado inicial y con el efecto de ajuste, y por
// eso recargar el dashboard te dejaba en un sitio distinto cada vez. Toda esa
// decisión vive ahora en resolverVistaInicial().

// La marca "onboarded" vive en localStorage, así que un dispositivo/navegador
// nuevo (p.ej. el WebView del enlace "Ver mensaje" del email) nunca la tiene
// y vuelve a mostrar el wizard aunque el perfil real ya esté completo en
// Supabase. Este gate usa datos reales del perfil para saltarlo y
// re-sincronizar la marca en ese dispositivo.
//
// role/display_name YA existen desde el alta (los pone handle_new_user), así
// que comprobar solo eso cerraba el wizard en el mismo instante en que se
// abría — nadie llegaba nunca al paso de foto/ciudad/tarifa. Empresario no
// pasa por ese paso (ver OnboardingWizard "selectedRole !== 'empresario'"),
// así que para el resto de roles también se exige foto real y ciudad real.
const WizardGate = ({ showWizard, setShowWizard }: { showWizard: boolean; setShowWizard: (v: boolean) => void }) => {
  const { user } = useAuth();
  const { role, display_name, photo_url, zone, loading } = useProfile();
  useEffect(() => {
    if (!showWizard || loading || !user) return;
    const hasPhoto = !!photo_url && photo_url.length > 10;
    const hasRealZone = !!zone?.trim() && zone !== 'España';
    const isComplete = !!role && role !== 'pending' && !!display_name?.trim()
      && (role === 'empresario' || (hasPhoto && hasRealZone));
    if (isComplete) {
      localStorage.setItem(`xpeak_onboarded_${user.id}`, '1');
      setShowWizard(false);
    }
  }, [showWizard, loading, role, display_name, photo_url, zone, user, setShowWizard]);
  return null;
};

// Rol del perfil → vista del dashboard (su propio listado). Un rol no listado
// usa su propio slug como vista.
const ROLE_TO_VIEW: Record<string, string> = {
  dj: 'dj', staff: 'staff', camarero: 'staff', makeup: 'makeup', media: 'media',
  vestuario: 'vestuario', design: 'design', promotor: 'promotor',
  event_manager: 'event_manager', empresario: 'empresario', catering: 'catering',
  mago: 'mago', bailarin: 'bailarin', humorista: 'humorista', animador: 'animador',
  speaker: 'speaker', monologo: 'monologo', ambassador: 'ambassador',
  // Faltaban aquí y solo funcionaban por el `?? profileRole` de respaldo, que
  // es frágil: cualquier vista cuyo id no coincida exactamente con el rol de BD
  // se rompe en silencio.
  'grupo-musical': 'grupo-musical', azafata: 'azafata', peluqueria: 'peluqueria',
  // photo-booth no tiene vista propia → usa la de media (fotografía/vídeo)
  'photo-booth': 'media',
  // Sin rol elegido todavía: NO se le manda al directorio de DJs (ver más
  // abajo), sino a completar su perfil.
  pending: 'profile',
  // 'rookie' (Promesa) es un profesional que empieza, no un DJ: mandarlo al
  // directorio de DJs daba por hecho su oficio. Va a su perfil, como cualquier
  // rol sin oficio resuelto.
  rookie: 'profile',
};

/**
 * ÚNICO punto que decide qué vista abre el dashboard.
 *
 * Antes lo decidían tres mecanismos con criterios distintos: el estado inicial
 * de activeView (que caía en 'dj'), el componente RoleDefaultView con su propio
 * mapa ROLE_DEFAULT_VIEW, y un efecto con ROLE_TO_VIEW. Según cuál ganase la
 * carrera, recargar el dashboard te dejaba en un sitio o en otro sin lógica
 * aparente.
 *
 * Prioridad, de más a menos específica:
 *   1. Navegación explícita (state del router o ?view=) — un enlace de email
 *      manda a una sección concreta y eso siempre gana.
 *   2. Última vista usada (localStorage) — donde el usuario estaba.
 *   3. 'explorar' — el mapa de gremios, para quien entra por primera vez.
 *   4. 'profile' — sin rol resuelto se completa el perfil, nunca el directorio
 *      de DJs.
 *
 * Por qué 'explorar' y no la vista del propio rol: quien entraba por primera
 * vez caía en el listado de su gremio (un DJ veía DJs) sin haber visto nunca
 * qué más hay aquí, y se quedaba sin saber por dónde moverse. En cuanto
 * navega una vez, la vista guardada manda y ya no vuelve a ver el mapa.
 *
 * Excepciones, porque su destino actual ya está pensado para ellos:
 * empresario (tiene panel propio: viene a contratar, no a explorar gremios)
 * y pending/rookie (tienen que completar el perfil antes que nada).
 */
const SIN_EXPLORAR = new Set(['empresario', 'pending', 'rookie']);

// Términos por los que alguien buscaría cada directorio desde el buscador del
// topbar. Sirve para resolver a qué vista mandar una búsqueda escrita fuera de
// un directorio (ver handleSearch) — antes SIEMPRE mandaba a 'dj' sin mirar el
// texto, así que buscar "camarero" te dejaba filtrando el directorio de DJs y
// devolvía 0 resultados aunque camareros sí existen en XPEAK. Mismo bug de
// fondo que ya se corrigió para el aterrizaje inicial (ver roleRouting.test.ts
// y el comentario de ROLE_TO_VIEW): un valor cae en 'dj' por defecto en vez de
// resolverse de verdad.
// Cubre los 18 oficios que ofrece hoy el wizard de alta (OnboardingWizard.tsx)
// más 'staff' (alias de 'camarero') y los roles legado que ya no se dan de
// alta pero pueden seguir teniendo perfiles reales (design, event_manager,
// monologo, ambassador) — estos últimos con menos sinónimos porque nadie
// nuevo elige ya ese oficio, pero un perfil existente sigue siendo buscable.
const BUSQUEDA_POR_VISTA: Record<string, string[]> = {
  dj: ['dj', 'disc jockey', 'pincha', 'discomovil'],
  'grupo-musical': ['grupo musical', 'grupo', 'banda', 'orquesta', 'musico', 'musicos'],
  media: ['fotografo', 'fotografa', 'foto', 'video', 'videografo', 'videografa'],
  makeup: ['maquillaje', 'maquilladora', 'maquillador', 'makeup'],
  peluqueria: ['peluqueria', 'peluquero', 'peluquera'],
  staff: ['camarero', 'camarera', 'camare', 'staff', 'sala y barra'],
  azafata: ['azafata', 'azafato', 'hostess', 'congreso'],
  promotor: ['promotor', 'rrpp', 'promocion'],
  catering: ['catering', 'chef', 'cocina', 'cocinero'],
  mago: ['mago', 'maga', 'magia', 'ilusionista'],
  humorista: ['humorista', 'comico', 'comica', 'monologuista', 'stand-up', 'standup'],
  animador: ['animador', 'animadora', 'payaso'],
  bailarin: ['bailarin', 'bailarina', 'danza', 'gogo'],
  speaker: ['speaker', 'presentador', 'presentadora', 'maestro de ceremonias', 'ponente'],
  vestuario: ['vestuario', 'estilista', 'styling', 'moda'],
  'photo-booth': ['photo booth', 'photobooth', 'cabina de fotos', 'fotomaton'],
  tecnico: ['tecnico', 'tecnica', 'sonido', 'iluminacion', 'montaje de escenario'],
  // Legado: sin alta activa, sinónimos mínimos por si queda algún perfil real.
  design: ['diseno', 'diseño', 'decoracion'],
  event_manager: ['event manager', 'organizador de eventos', 'wedding planner'],
  monologo: ['monologo', 'monologuista'],
  ambassador: ['ambassador', 'embajador', 'embajadora'],
};

/** Rol al que apunta un término escrito en el buscador, o null si no matchea ninguno. */
export function resolverVistaDeBusqueda(q: string): string | null {
  const texto = q.trim().toLowerCase();
  if (!texto) return null;
  // Comparar también palabra a palabra: sinónimos de varias palabras ("sala y
  // barra", "maestro de ceremonias") deben reconocerse aunque el usuario solo
  // escriba una de ellas ("barra", "ceremonias"), no solo el principio.
  const palabras = texto.split(/\s+/);
  for (const [vista, terminos] of Object.entries(BUSQUEDA_POR_VISTA)) {
    const matchea = terminos.some(t =>
      t.startsWith(texto) || texto.startsWith(t) ||
      t.split(/\s+/).some(palabraTermino => palabras.some(p => palabraTermino.startsWith(p) || p.startsWith(palabraTermino)))
    );
    if (matchea) return vista;
  }
  return null;
}

/**
 * Decide a qué vista debe saltar el buscador del topbar dado el término
 * escrito y la vista donde ya está el usuario.
 *
 * EL bug (9 sep 2026): antes solo se intentaba resolver el oficio cuando la
 * vista activa NO era ya un directorio. Como 'dj' SÍ es un directorio, quien
 * estaba en DJ (la vista por defecto de casi todo el mundo) y buscaba
 * "camarero" se quedaba filtrando dentro de DJ en vez de saltar a Staff —
 * daba 0 resultados con toda razón, y el usuario veía "Directorio Artistas
 * Musicales" para una búsqueda que no tenía nada que ver con música. Ahora
 * SIEMPRE se resuelve el término primero; solo si no apunta a ningún oficio
 * reconocido se respeta quedarse en el directorio actual (o ir a 'explorar'
 * si ni siquiera se estaba en uno).
 */
export function resolverDestinoBusqueda(
  q: string, activeView: string, directoryViews: Set<string>
): string | null {
  if (!q.trim()) return null;
  const vistaDelTermino = resolverVistaDeBusqueda(q);
  if (vistaDelTermino && vistaDelTermino !== activeView) return vistaDelTermino;
  if (!vistaDelTermino && !directoryViews.has(activeView)) return 'explorar';
  return null;
}

// Vista sentinela que pasa Auth.tsx tras login: ignora la última vista
// guardada en localStorage (que ganaría si no fuera por esto) pero sigue
// respetando el destino propio de empresario/pending/rookie — el pedido del
// usuario (11 sep 2026) era "no aterrizar donde se invente", no romper esos
// flujos ya pensados a propósito.
export const VISTA_TRAS_LOGIN = '__post_login__';

export function resolverVistaInicial(opts: {
  stateView?: string | null;
  queryView?: string | null;
  guardada?: string | null;
  rol?: string | null;
}): string {
  const { stateView, queryView, guardada, rol } = opts;
  if (stateView === VISTA_TRAS_LOGIN) {
    if (rol && SIN_EXPLORAR.has(rol)) return ROLE_TO_VIEW[rol] ?? rol;
    return 'explorar';
  }
  if (stateView) return stateView;
  if (queryView) return queryView;
  if (guardada) return guardada;
  if (rol && SIN_EXPLORAR.has(rol)) return ROLE_TO_VIEW[rol] ?? rol;
  if (rol) return 'explorar';
  return 'profile';
}

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<string>(() => resolverVistaInicial({
    stateView: (location.state as { view?: string })?.view,
    // Enlaces desde email (ej. "Nueva solicitud Flash Booking") pasan la vista
    // por query param — sin esto, el botón del email caería en la vista
    // guardada, nunca en la sección real.
    queryView: new URLSearchParams(location.search).get('view'),
    guardada: (() => { try { return localStorage.getItem('xpeak_view'); } catch { return null; } })(),
    // El rol aún no está cargado en el primer render; lo aplica el efecto.
    rol: null,
  }));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messagesTarget, setMessagesTarget] = useState<{ userId: string; name: string } | null>(null);
  const [selectedProfile, setSelectedProfileRaw] = useState<Profile | null>(null);

  // Envoltorio para registrar la apertura de ficha en un solo punto: se pasa
  // como onViewProfile a las ~20 vistas de rol, así que hacerlo aquí evita
  // repetir la llamada (y olvidarla) en cada una.
  const setSelectedProfile = useCallback((p: Profile | null) => {
    if (p) logProfileView(p.role ?? 'desconocido');
    setSelectedProfileRaw(p);
  }, []);
  // El buscador de Landing pasa el término escrito en location.state.search
  // junto con la vista ya resuelta — sin esto llegabas a la vista correcta
  // pero el campo de búsqueda aparecía vacío y perdías lo que habías escrito.
  const [searchQuery, setSearchQuery] = useState<string>(() => (location.state as { search?: string })?.search ?? '');
  const [showWizard, setShowWizard] = useState(false);
  const isMobile = useIsMobile();
  const { user, loading } = useAuth();
  const { role: profileRole } = useProfile();

  // Antes usábamos key={activeView} en el contenedor de la vista para
  // disparar la animación de entrada — pero eso fuerza a React a DESMONTAR
  // y volver a montar todo el subárbol en cada cambio (incluye el import()
  // lazy si la vista no estaba ya cargada), lo que en móvil se percibe como
  // un parpadeo/pantalla en blanco entre secciones. Retriggeamos la misma
  // animación CSS a mano (quitar y reponer la clase en el frame siguiente)
  // para tener el mismo fade de entrada sin destruir el DOM.
  const viewContentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = viewContentRef.current;
    if (!el) return;
    el.style.animation = 'none';
    void el.offsetHeight; // fuerza reflow — sin esto el navegador no "ve" el reset
    el.style.animation = 'viewEnter 0.22s cubic-bezier(0.22,1,0.36,1) both';
  }, [activeView]);

  useEffect(() => {
    if (user && !localStorage.getItem(`xpeak_onboarded_${user.id}`)) {
      setShowWizard(true);
    }
  }, [user]);

  // Vista inicial según el ROL del usuario (no siempre 'dj'): un camarero debe
  // ver su listado, no el de DJs. Solo ajusta si el usuario no eligió otra vista
  // ni viene de un enlace con vista específica.
  const viewAdjusted = useRef(false);
  useEffect(() => {
    // 'pending' (registro sin pasar por el wizard de rol) ya NO se ignora.
    // Antes se salía aquí sin ajustar nada y activeView se quedaba en su valor
    // inicial —'dj'—, así que un grupo musical, una azafata o cualquiera que no
    // terminase el wizard aterrizaba en el directorio de DJs y parecía que el
    // sistema le había asignado ese rol.
    if (viewAdjusted.current || !profileRole) return;
    setActiveView(resolverVistaInicial({
      stateView: (location.state as { view?: string })?.view,
      queryView: new URLSearchParams(location.search).get('view'),
      guardada: (() => { try { return localStorage.getItem('xpeak_view'); } catch { return null; } })(),
      rol: profileRole,
    }));
    viewAdjusted.current = true;
  }, [profileRole, location]);

  useEffect(() => {
    if (!selectedProfile) return;
    window.history.pushState({ profileOpen: true }, '');
    const onPop = () => setSelectedProfileRaw(null);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [selectedProfile]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth', { replace: true });
    }
  }, [loading, user, navigate]);

  // keepSearch: la navegación disparada por handleSearch necesita que el
  // término sobreviva al cambio de vista para que el directorio de destino
  // pueda filtrar con él — de lo contrario este mismo setSearchQuery('')
  // borraba la búsqueda un instante antes de que se usara.
  const handleViewChange = (view: string, keepSearch = false) => {
    setActiveView(view);
    localStorage.setItem('xpeak_view', view);
    if (isMobile) setSidebarOpen(false);
    if (!keepSearch) setSearchQuery('');
  };

  const nav = (view: string) => handleViewChange(view);

  // Todas las vistas que son un directorio de profesionales (todos los case
  // del switch de abajo salvo explorar/settings/messages/etc, que no lo son).
  // Estaba incompleto: faltaban mago, bailarin, humorista, monologo, animador,
  // speaker, photo-booth, grupo-musical y tecnico. Con la lista corta, quien
  // ya estaba en, por ejemplo, Técnico y buscaba un nombre propio (sin
  // oficio reconocible) se consideraba "fuera de un directorio" y saltaba a
  // 'explorar' en vez de quedarse filtrando donde ya estaba.
  const directoryViews = new Set([
    'dj', 'staff', 'azafata', 'event_manager', 'makeup', 'peluqueria', 'media',
    'ambassador', 'vestuario', 'design', 'promotor', 'camarero', 'catering',
    'mago', 'bailarin', 'humorista', 'monologo', 'animador', 'speaker',
    'photo-booth', 'grupo-musical', 'tecnico',
  ]);

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    const destino = resolverDestinoBusqueda(q, activeView, directoryViews);
    if (destino) handleViewChange(destino, true);
  };

  const handleMessage = (userId: string, name: string) => {
    setMessagesTarget({ userId, name });
    handleViewChange('messages');
  };

  const renderView = () => {
    switch (activeView) {
      case 'explorar': return <ExplorarView onNavigate={nav} />;
      case 'dj': return <DJView onNavigate={nav} onMessage={handleMessage} searchQuery={searchQuery} onViewProfile={setSelectedProfile} />;
      // 'camarero' es alias de 'staff' (ROLE_ALIASES). Sin este case caía en el
      // default y a un camarero se le abría la vista de DJs como pantalla de
      // inicio: exactamente el rol que estamos a punto de captar en escuelas.
      case 'camarero':
      case 'staff': return <StaffView onNavigate={nav} onMessage={handleMessage} searchQuery={searchQuery} onViewProfile={setSelectedProfile} />;
      case 'azafata': return <AzafataView onNavigate={nav} onMessage={handleMessage} searchQuery={searchQuery} onViewProfile={setSelectedProfile} />;
      case 'event_manager': return <EventManagerView onNavigate={nav} onMessage={handleMessage} searchQuery={searchQuery} onViewProfile={setSelectedProfile} />;
      case 'makeup': return <MakeupView onNavigate={nav} onMessage={handleMessage} searchQuery={searchQuery} onViewProfile={setSelectedProfile} />;
      case 'peluqueria': return <PeluqueriaView onNavigate={nav} onMessage={handleMessage} searchQuery={searchQuery} onViewProfile={setSelectedProfile} />;
      case 'media': return <MediaView onNavigate={nav} onMessage={handleMessage} searchQuery={searchQuery} onViewProfile={setSelectedProfile} />;
      case 'ambassador': return <AmbassadorView onNavigate={nav} onMessage={handleMessage} searchQuery={searchQuery} onViewProfile={setSelectedProfile} />;
      case 'vestuario': return <VestuarioView onNavigate={nav} onMessage={handleMessage} searchQuery={searchQuery} onViewProfile={setSelectedProfile} />;
      case 'design': return <DesignView onNavigate={nav} onMessage={handleMessage} searchQuery={searchQuery} onViewProfile={setSelectedProfile} />;
      case 'promotor': return <PromotorView onNavigate={nav} onMessage={handleMessage} searchQuery={searchQuery} onViewProfile={setSelectedProfile} />;
      case 'catering':  return <CateringView  onNavigate={nav} onMessage={handleMessage} searchQuery={searchQuery} onViewProfile={setSelectedProfile} />;
      case 'mago':      return <MagoView      onNavigate={nav} onMessage={handleMessage} searchQuery={searchQuery} onViewProfile={setSelectedProfile} />;
      case 'bailarin':  return <BailarinView  onNavigate={nav} onMessage={handleMessage} searchQuery={searchQuery} onViewProfile={setSelectedProfile} />;
      case 'humorista': return <HumoristaView onNavigate={nav} onMessage={handleMessage} searchQuery={searchQuery} onViewProfile={setSelectedProfile} />;
      case 'monologo':  return <MonologoView  onNavigate={nav} onMessage={handleMessage} searchQuery={searchQuery} onViewProfile={setSelectedProfile} />;
      case 'animador':  return <AnimadorView  onNavigate={nav} onMessage={handleMessage} searchQuery={searchQuery} onViewProfile={setSelectedProfile} />;
      case 'speaker':   return <SpeakerView   onNavigate={nav} onMessage={handleMessage} searchQuery={searchQuery} onViewProfile={setSelectedProfile} />;
      case 'photo-booth': return <PhotoBoothView onNavigate={nav} onMessage={handleMessage} searchQuery={searchQuery} onViewProfile={setSelectedProfile} />;
      case 'grupo-musical': return <GrupoMusicalView onNavigate={nav} onMessage={handleMessage} searchQuery={searchQuery} onViewProfile={setSelectedProfile} />;
      case 'tecnico':   return <TecnicoView   onNavigate={nav} onMessage={handleMessage} searchQuery={searchQuery} onViewProfile={setSelectedProfile} />;
      case 'settings': return <SettingsView onNavigate={nav} />;
      case 'empresario': return <EmpresarioView onMessage={handleMessage} />;
      case 'messages': return <MessagesView initialUserId={messagesTarget?.userId} initialName={messagesTarget?.name} />;
      case 'calendar':   return <CalendarView />;
      case 'contracts':  return <ContractView />;
      case 'profile': return <ProfileView onNavigate={nav} />;
      case 'ficha':   return <FichaView />;
      case 'mapa': return <MapaView />;
      case 'flashbooking':
      case 'flash': return <FlashBookingWallView />;
      case 'topweekend': return <TopWeekendView />;
      case 'stats': return <StatsView />;
      case 'agency': return <AgencyView />;
      case 'resources': return <ResourcesView />;
      case 'admin': return (
        <AdminGuard>
          <AdminView onNavigate={nav} />
        </AdminGuard>
      );
      // Un rol desconocido o sin definir NO debe caer en el directorio de DJs:
      // era la causa de que perfiles nuevos "aparecieran como DJ". Se le manda
      // a completar su perfil, que es lo que de verdad le falta.
      default: return <ProfileView onNavigate={nav} />;
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center" style={{ background: '#f5f4f0' }}>
        <div className="text-xs text-muted-foreground animate-pulse">Cargando...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <ProfileProvider>
    <Helmet>
      <title>Dashboard | XPEAK</title>
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>
    <WizardGate showWizard={showWizard} setShowWizard={setShowWizard} />
    {/* h-screen es 100vh, que en Chrome Android mide la ventana CON la barra de
        URL oculta — siempre más alto que el espacio visible real. Con el
        overflow-hidden de este contenedor, el layout acababa midiendo más que
        la pantalla: la topbar sticky quedaba parcialmente bajo la barra de URL
        y la bottom nav bajo la barra de gestos (ambas se veían cortadas).
        100dvh sigue el viewport visible, así que nada se sale. Se deja 100vh
        antes como respaldo para navegadores sin soporte de dvh. */}
    <div data-app="dashboard" className="flex w-screen overflow-hidden grain-overlay dvh-screen" style={{ background: '#f5f4f0' }}>
      <Suspense fallback={null}><AmbientBackground /></Suspense>

      {isMobile && (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0 w-[272px] max-w-[85vw] border-r-0" style={{ background: '#ffffff' }}>
            {/* Radix exige un título accesible en todo DialogContent/SheetContent
                para lectores de pantalla; el sidebar ya muestra "XPEAK" visualmente,
                así que el título solo hace falta para accesibilidad, no visible. */}
            <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
            <SheetDescription className="sr-only">Accede a las secciones del panel: inicio, directorio, mensajes, perfil y ajustes.</SheetDescription>
            <DashboardSidebar activeView={activeView} onViewChange={handleViewChange} forceExpanded />
          </SheetContent>
        </Sheet>
      )}

      {/* SidebarProvider debe envolver sidebar + main juntos (así calcula bien
          su CSS de layout, ver ui/sidebar.tsx) — por eso engloba también el
          <main>, no solo el <Sidebar>. En móvil el sidebar vive aparte en el
          Sheet de arriba, así que aquí solo se activa el colapso real en desktop.
          Arranca plegado (icon-rail) a propósito y en cada carga: se abre solo
          con el botón del borde y esa apertura no se persiste entre visitas
          (ver ui/sidebar.tsx). */}
      <SidebarProvider defaultOpen={false} style={{ minHeight: 0, height: '100%' }} className="flex-1 min-w-0">
        {!isMobile && (
          <DashboardSidebarInner activeView={activeView} onViewChange={handleViewChange} />
        )}

        <main
          className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden relative min-w-0 no-scrollbar"
          style={{ transition: 'width 300ms cubic-bezier(0.32,0.72,0,1)' }}
        >
          <DashboardTopbar onMenuToggle={() => setSidebarOpen(true)} isMobile={isMobile} onSearch={handleSearch} searchQuery={searchQuery} onHome={() => handleViewChange('dj')} userId={user?.id} isEmpresario={profileRole === 'empresario'} onViewChange={handleViewChange} />
          <ProfileIncompleteBanner onNavigate={handleViewChange} activeView={activeView} />
          <RecentBusinessViewLine />
          <TodaysRequestsLine />
          <div className={`p-3 md:p-6 flex-1 md:pb-6 ${isMobile ? 'pb-[calc(64px+max(env(safe-area-inset-bottom),12px)+1.5rem)]' : 'pb-6'}`}
            ref={viewContentRef}>
            <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#D4AF37', borderTopColor: 'transparent' }} /></div>}>
              {renderView()}
            </Suspense>
          </div>
        </main>
      </SidebarProvider>

      {isMobile && (
        <MobileBottomNav
          activeView={activeView}
          onViewChange={handleViewChange}
          onMenuToggle={() => setSidebarOpen(true)}
        />
      )}

      <Suspense fallback={null}>
        {!showWizard && <OnboardingTour onNavigate={handleViewChange} />}
        {activeView !== 'messages' && <div className="hidden sm:block"><SupportChat /></div>}
        {showWizard && (
          <OnboardingWizard
            onClose={() => setShowWizard(false)}
            onNavigate={handleViewChange}
          />
        )}
      </Suspense>

      {/* AnimatePresence aquí, no dentro de ProfessionalProfilePage: el exit de
          framer-motion solo se reproduce si el componente que lo declara sigue
          montado un instante más — si el padre lo desmonta de golpe (como hacía
          antes este `{selectedProfile && ...}` fuera de cualquier AnimatePresence),
          la animación de cierre nunca llega a verse. */}
      <AnimatePresence>
        {selectedProfile && (
          <Suspense fallback={null}>
            <ProfessionalProfilePage
              profile={selectedProfile}
              onClose={() => setSelectedProfile(null)}
              onMessage={handleMessage}
            />
          </Suspense>
        )}
      </AnimatePresence>
    </div>
    </ProfileProvider>
  );
};

export default Dashboard;
