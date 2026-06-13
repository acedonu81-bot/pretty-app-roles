import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AmbientBackground from '@/components/AmbientBackground';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardTopbar from '@/components/dashboard/DashboardTopbar';
import DJView from '@/components/dashboard/views/DJView';
import SettingsView from '@/components/dashboard/views/SettingsView';
import MessagesView from '@/components/dashboard/views/MessagesView';
import CalendarView from '@/components/dashboard/views/CalendarView';
import ProfileView from '@/components/dashboard/views/ProfileView';
import StaffView from '@/components/dashboard/views/StaffView';
import EventManagerView from '@/components/dashboard/views/EventManagerView';
import MakeupView from '@/components/dashboard/views/MakeupView';
import MediaView from '@/components/dashboard/views/MediaView';
import AmbassadorView from '@/components/dashboard/views/AmbassadorView';
import VestuarioView from '@/components/dashboard/views/VestuarioView';
import DesignView from '@/components/dashboard/views/DesignView';
import PromotorView from '@/components/dashboard/views/PromotorView';
import CateringView from '@/components/dashboard/views/CateringView';
import MagoView from '@/components/dashboard/views/MagoView';
import BailarinView from '@/components/dashboard/views/BailarinView';
import HumoristaView from '@/components/dashboard/views/HumoristaView';
import SpeakerView from '@/components/dashboard/views/SpeakerView';
import MapaView from '@/components/dashboard/views/MapaView';
import FlashBookingWallView from '@/components/dashboard/views/FlashBookingWallView';
import TopWeekendView from '@/components/dashboard/views/TopWeekendView';
import StatsView from '@/components/dashboard/views/StatsView';
import AdminView from '@/components/dashboard/views/AdminView';
import EmpresarioView from '@/components/dashboard/views/EmpresarioView';
import ContractView from '@/components/dashboard/views/ContractView';
import FichaView from '@/components/dashboard/views/FichaView';
import AgencyView from '@/components/dashboard/views/AgencyView';
import ProfessionalProfilePage from '@/components/dashboard/ProfessionalProfilePage';
import SupportChat from '@/components/dashboard/SupportChat';
import AdminGuard from '@/components/AdminGuard';
import type { Profile } from '@/data/profiles';
import OnboardingTour from '@/components/dashboard/OnboardingTour';
import OnboardingWizard from '@/components/OnboardingWizard';
import { useProfile } from '@/hooks/useProfile';
import MobileBottomNav from '@/components/dashboard/MobileBottomNav';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { ProfileProvider } from '@/hooks/useProfile';
import { DEFAULT_ZONE } from '@/lib/constants';

const PROFILE_VIEWS = new Set(['profile', 'ficha', 'stats']);

const ProfileIncompleteBanner = ({ onNavigate, activeView }: { onNavigate: (v: string) => void; activeView: string }) => {
  const ctx = useProfile();
  const [dismissed, setDismissed] = useState(false);

  if (ctx.loading || dismissed) return null;

  const steps = [
    !!ctx.photo_url,
    !!(ctx.bio && ctx.bio.trim().length > 20),
    !!(ctx.zone && ctx.zone !== DEFAULT_ZONE),
    !!(ctx.specialty && ctx.specialty.trim().length > 0),
    !!(ctx.instagram && ctx.instagram.trim().length > 0),
    ...(ctx.role !== 'empresario' ? [!!(ctx.audio_embed_url && (ctx.audio_embed_url as string).trim().length > 0)] : []),
  ];
  const percent = Math.round((steps.filter(Boolean).length / steps.length) * 100);

  if (percent >= 100) return null;

  return (
    <div className="mx-4 mt-3 mb-0 flex items-center gap-3 px-4 py-3 rounded-xl text-xs"
      style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.18)' }}>
      <div className="flex-1 flex items-center gap-3 min-w-0">
        <div className="w-20 h-1.5 rounded-full flex-shrink-0" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div className="h-full rounded-full" style={{ width: `${percent}%`, background: 'linear-gradient(90deg,#D4AF37,#B8941E)' }} />
        </div>
        <span style={{ color: 'rgba(255,255,255,0.55)' }}>
          Perfil al <strong style={{ color: '#D4AF37' }}>{percent}%</strong>
          <span className="hidden sm:inline"> — complétalo para aparecer mejor en el directorio</span>
        </span>
      </div>
      <button onClick={() => onNavigate('profile')}
        className="flex-shrink-0 px-3 py-1.5 rounded-lg font-bold transition-all hover:scale-105"
        style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.25)' }}>
        Completar
      </button>
      <button onClick={() => setDismissed(true)} className="flex-shrink-0 text-lg leading-none transition-opacity hover:opacity-60"
        style={{ color: 'rgba(255,255,255,0.25)' }}>×</button>
    </div>
  );
};

const ROLE_DEFAULT_VIEW: Partial<Record<string, string>> = {
  pending: 'profile', dj: 'profile',
  vestuario: 'vestuario', design: 'design', promotor: 'promotor',
  staff: 'staff', makeup: 'makeup', media: 'media',
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

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<string>(() => {
    const fromState = (location.state as { view?: string })?.view;
    if (fromState) return fromState;
    return localStorage.getItem('xpeak_view') || 'dj';
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messagesTarget, setMessagesTarget] = useState<{ userId: string; name: string } | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showWizard, setShowWizard] = useState(false);
  const isMobile = useIsMobile();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user && !localStorage.getItem(`xpeak_onboarded_${user.id}`)) {
      setShowWizard(true);
    }
  }, [user]);

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

  const directoryViews = new Set(['dj', 'staff', 'event_manager', 'makeup', 'media', 'ambassador', 'vestuario', 'design', 'promotor', 'camarero', 'catering']);

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
      case 'event_manager': return <EventManagerView onNavigate={nav} onMessage={handleMessage} searchQuery={searchQuery} onViewProfile={setSelectedProfile} />;
      case 'makeup': return <MakeupView onNavigate={nav} onMessage={handleMessage} searchQuery={searchQuery} onViewProfile={setSelectedProfile} />;
      case 'media': return <MediaView onNavigate={nav} onMessage={handleMessage} searchQuery={searchQuery} onViewProfile={setSelectedProfile} />;
      case 'ambassador': return <AmbassadorView onNavigate={nav} onMessage={handleMessage} searchQuery={searchQuery} onViewProfile={setSelectedProfile} />;
      case 'vestuario': return <VestuarioView onNavigate={nav} onMessage={handleMessage} searchQuery={searchQuery} onViewProfile={setSelectedProfile} />;
      case 'design': return <DesignView onNavigate={nav} onMessage={handleMessage} searchQuery={searchQuery} onViewProfile={setSelectedProfile} />;
      case 'promotor': return <PromotorView onNavigate={nav} onMessage={handleMessage} searchQuery={searchQuery} onViewProfile={setSelectedProfile} />;
      case 'catering':  return <CateringView  onNavigate={nav} onMessage={handleMessage} searchQuery={searchQuery} onViewProfile={setSelectedProfile} />;
      case 'mago':      return <MagoView      onNavigate={nav} onMessage={handleMessage} searchQuery={searchQuery} onViewProfile={setSelectedProfile} />;
      case 'bailarin':  return <BailarinView  onNavigate={nav} onMessage={handleMessage} searchQuery={searchQuery} onViewProfile={setSelectedProfile} />;
      case 'humorista': return <HumoristaView onNavigate={nav} onMessage={handleMessage} searchQuery={searchQuery} onViewProfile={setSelectedProfile} />;
      case 'speaker':   return <SpeakerView   onNavigate={nav} onMessage={handleMessage} searchQuery={searchQuery} onViewProfile={setSelectedProfile} />;
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
      <div className="flex h-screen w-screen items-center justify-center" style={{ background: '#242220' }}>
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
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: '#242220' }}>
      <AmbientBackground />

      {!isMobile && (
        <DashboardSidebar activeView={activeView} onViewChange={handleViewChange} />
      )}

      {isMobile && (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0 w-[260px] border-r-0" style={{ background: '#1A1816' }}>
            <DashboardSidebar activeView={activeView} onViewChange={handleViewChange} />
          </SheetContent>
        </Sheet>
      )}

      <main className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden relative min-w-0">
        <DashboardTopbar onMenuToggle={() => setSidebarOpen(true)} isMobile={isMobile} onSearch={handleSearch} searchQuery={searchQuery} onHome={() => handleViewChange('dj')} />
        <ProfileIncompleteBanner onNavigate={handleViewChange} activeView={activeView} />
        <div className={`p-4 md:p-6 flex-1 md:pb-6 ${isMobile ? 'pb-[calc(6rem+env(safe-area-inset-bottom))]' : 'pb-6'}`}
          key={activeView}
          style={{ animation: 'viewEnter 0.22s cubic-bezier(0.22,1,0.36,1) both' }}>
          {renderView()}
        </div>
      </main>

      {isMobile && (
        <MobileBottomNav
          activeView={activeView}
          onViewChange={handleViewChange}
          onMenuToggle={() => setSidebarOpen(true)}
        />
      )}

      {!showWizard && <OnboardingTour onNavigate={handleViewChange} />}
      <SupportChat />
      {showWizard && (
        <OnboardingWizard
          onClose={() => setShowWizard(false)}
          onNavigate={handleViewChange}
        />
      )}

      {selectedProfile && (
        <ProfessionalProfilePage
          profile={selectedProfile}
          onClose={() => setSelectedProfile(null)}
          onMessage={handleMessage}
        />
      )}
    </div>
    </ProfileProvider>
  );
};

export default Dashboard;
