import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardTopbar from '@/components/dashboard/DashboardTopbar';
import RecentBusinessViewLine from '@/components/dashboard/RecentBusinessViewLine';
import TodaysRequestsLine from '@/components/dashboard/TodaysRequestsLine';
import MobileBottomNav from '@/components/dashboard/MobileBottomNav';
import AdminGuard from '@/components/AdminGuard';
import type { Profile } from '@/data/profiles';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
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
const GrupoMusicalView = lazy(() => import('@/components/dashboard/views/GrupoMusicalView'));
const ContractView = lazy(() => import('@/components/dashboard/views/ContractView'));
const FichaView = lazy(() => import('@/components/dashboard/views/FichaView'));
const AgencyView = lazy(() => import('@/components/dashboard/views/AgencyView'));
const ProfessionalProfilePage = lazy(() => import('@/components/dashboard/ProfessionalProfilePage'));
const SupportChat = lazy(() => import('@/components/dashboard/SupportChat'));
const OnboardingTour = lazy(() => import('@/components/dashboard/OnboardingTour'));
const OnboardingWizard = lazy(() => import('@/components/OnboardingWizard'));
const AmbientBackground = lazy(() => import('@/components/AmbientBackground'));
import { DEFAULT_ZONE } from '@/lib/constants';

const PROFILE_VIEWS = new Set(['profile', 'ficha', 'stats']);

const ProfileIncompleteBanner = ({ onNavigate, activeView }: { onNavigate: (v: string) => void; activeView: string }) => {
  const ctx = useProfile();
  const [dismissed, setDismissed] = useState(false);

  if (ctx.loading || dismissed) return null;

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

const ROLE_DEFAULT_VIEW: Partial<Record<string, string>> = {
  pending: 'profile', dj: 'profile',
  vestuario: 'vestuario', design: 'design', promotor: 'promotor',
  staff: 'staff', azafata: 'azafata', makeup: 'makeup', peluqueria: 'peluqueria', media: 'media',
  event_manager: 'event_manager', empresario: 'empresario', rookie: 'rookie',
  camarero: 'staff', catering: 'staff',
};

const RoleDefaultView = ({ onViewChange }: { onViewChange: (v: string) => void }) => {
  const { role, loading } = useProfile();
  useEffect(() => {
    if (loading || !role) return;
    if (localStorage.getItem('xpeak_view')) return;
    const target = ROLE_DEFAULT_VIEW[role];
    if (target) onViewChange(target);
  }, [role, loading, onViewChange]);
  return null;
};

// La marca "onboarded" vive en localStorage, así que un dispositivo/navegador
// nuevo (p.ej. el WebView del enlace "Ver mensaje" del email) nunca la tiene
// y vuelve a mostrar el wizard aunque el perfil real ya esté completo en
// Supabase. Este gate usa role/display_name reales para saltarlo y
// re-sincronizar la marca en ese dispositivo.
const WizardGate = ({ showWizard, setShowWizard }: { showWizard: boolean; setShowWizard: (v: boolean) => void }) => {
  const { user } = useAuth();
  const { role, display_name, loading } = useProfile();
  useEffect(() => {
    if (!showWizard || loading || !user) return;
    const isComplete = !!role && role !== 'pending' && !!display_name?.trim();
    if (isComplete) {
      localStorage.setItem(`xpeak_onboarded_${user.id}`, '1');
      setShowWizard(false);
    }
  }, [showWizard, loading, role, display_name, user, setShowWizard]);
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
  // photo-booth no tiene vista propia → usa la de media (fotografía/vídeo)
  'photo-booth': 'media',
};

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<string>(() => {
    const fromState = (location.state as { view?: string })?.view;
    if (fromState) return fromState;
    // Enlaces desde email (ej. "Nueva solicitud Flash Booking") pasan la vista
    // por query param — sin esto, el botón del email siempre caía en la vista
    // guardada en localStorage (o "dj" por defecto), nunca en la sección real.
    const fromQuery = new URLSearchParams(location.search).get('view');
    if (fromQuery) return fromQuery;
    return localStorage.getItem('xpeak_view') || 'dj';
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messagesTarget, setMessagesTarget] = useState<{ userId: string; name: string } | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showWizard, setShowWizard] = useState(false);
  const isMobile = useIsMobile();
  const { user, loading } = useAuth();
  const { role: profileRole } = useProfile();

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
    if (viewAdjusted.current || !profileRole || profileRole === 'pending') return;
    const explicit = (location.state as { view?: string })?.view
      || new URLSearchParams(location.search).get('view')
      || localStorage.getItem('xpeak_view');
    if (explicit) { viewAdjusted.current = true; return; }
    const roleView = ROLE_TO_VIEW[profileRole] ?? profileRole;
    setActiveView(roleView);
    viewAdjusted.current = true;
  }, [profileRole, location]);

  useEffect(() => {
    if (!selectedProfile) return;
    window.history.pushState({ profileOpen: true }, '');
    const onPop = () => setSelectedProfile(null);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [selectedProfile]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth', { replace: true });
    }
  }, [loading, user, navigate]);

  const handleViewChange = (view: string) => {
    setActiveView(view);
    localStorage.setItem('xpeak_view', view);
    if (isMobile) setSidebarOpen(false);
    setSearchQuery('');
  };

  const nav = (view: string) => handleViewChange(view);

  const directoryViews = new Set(['dj', 'staff', 'azafata', 'event_manager', 'makeup', 'peluqueria', 'media', 'ambassador', 'vestuario', 'design', 'promotor', 'camarero', 'catering']);

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (q.trim() && !directoryViews.has(activeView)) {
      handleViewChange('dj');
    }
  };

  const handleMessage = (userId: string, name: string) => {
    setMessagesTarget({ userId, name });
    handleViewChange('messages');
  };

  const renderView = () => {
    switch (activeView) {
      case 'dj': return <DJView onNavigate={nav} onMessage={handleMessage} searchQuery={searchQuery} onViewProfile={setSelectedProfile} />;
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
      case 'admin': return (
        <AdminGuard>
          <AdminView onNavigate={nav} />
        </AdminGuard>
      );
      default: return <DJView onNavigate={nav} onMessage={handleMessage} />;
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
    <RoleDefaultView onViewChange={handleViewChange} />
    <WizardGate showWizard={showWizard} setShowWizard={setShowWizard} />
    <div data-app="dashboard" className="flex h-screen w-screen overflow-hidden grain-overlay" style={{ background: '#f5f4f0' }}>
      <Suspense fallback={null}><AmbientBackground /></Suspense>

      {!isMobile && (
        <DashboardSidebar activeView={activeView} onViewChange={handleViewChange} />
      )}

      {isMobile && (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0 w-[272px] max-w-[85vw] border-r-0" style={{ background: '#ffffff' }}>
            {/* Radix exige un título accesible en todo DialogContent/SheetContent
                para lectores de pantalla; el sidebar ya muestra "XPEAK" visualmente,
                así que el título solo hace falta para accesibilidad, no visible. */}
            <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
            <DashboardSidebar activeView={activeView} onViewChange={handleViewChange} />
          </SheetContent>
        </Sheet>
      )}

      <main className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden relative min-w-0 no-scrollbar">
        <DashboardTopbar onMenuToggle={() => setSidebarOpen(true)} isMobile={isMobile} onSearch={handleSearch} searchQuery={searchQuery} onHome={() => handleViewChange('dj')} />
        <ProfileIncompleteBanner onNavigate={handleViewChange} activeView={activeView} />
        <RecentBusinessViewLine />
        <TodaysRequestsLine />
        <div className={`p-4 md:p-6 flex-1 md:pb-6 ${isMobile ? 'pb-[calc(5rem+env(safe-area-inset-bottom))]' : 'pb-6'}`}
          key={activeView}
          style={{ animation: 'viewEnter 0.22s cubic-bezier(0.22,1,0.36,1) both' }}>
          <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#D4AF37', borderTopColor: 'transparent' }} /></div>}>
            {renderView()}
          </Suspense>
        </div>
      </main>

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

      {selectedProfile && (
        <Suspense fallback={null}>
          <ProfessionalProfilePage
            profile={selectedProfile}
            onClose={() => setSelectedProfile(null)}
            onMessage={handleMessage}
          />
        </Suspense>
      )}
    </div>
    </ProfileProvider>
  );
};

export default Dashboard;
