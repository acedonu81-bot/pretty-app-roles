import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AmbientBackground from '@/components/AmbientBackground';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardTopbar from '@/components/dashboard/DashboardTopbar';
import LegalFooter from '@/components/LegalFooter';
import DJView from '@/components/dashboard/views/DJView';
import PromotorView from '@/components/dashboard/views/PromotorView';
import SettingsView from '@/components/dashboard/views/SettingsView';
import MessagesView from '@/components/dashboard/views/MessagesView';
import CalendarView from '@/components/dashboard/views/CalendarView';
import ProfileView from '@/components/dashboard/views/ProfileView';
import StaffView from '@/components/dashboard/views/StaffView';
import MakeupView from '@/components/dashboard/views/MakeupView';
import MapaView from '@/components/dashboard/views/MapaView';
import EscenarioVirtualView from '@/components/dashboard/views/EscenarioVirtualView';
import FlashBookingWallView from '@/components/dashboard/views/FlashBookingWallView';
import TopWeekendView from '@/components/dashboard/views/TopWeekendView';
import StatsView from '@/components/dashboard/views/StatsView';
import FlashBookingView from '@/components/dashboard/views/FlashBookingView';
import AdminView from '@/components/dashboard/views/AdminView';
import EmpresarioView from '@/components/dashboard/views/EmpresarioView';
import AdminGuard from '@/components/AdminGuard';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useEffect } from 'react';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialView = (location.state as { view?: string })?.view || 'dj';
  const [activeView, setActiveView] = useState(initialView);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth', { replace: true });
    }
  }, [loading, user, navigate]);

  const handleViewChange = (view: string) => {
    setActiveView(view);
    if (isMobile) setSidebarOpen(false);
  };

  const renderView = () => {
    switch (activeView) {
      case 'dj': return <DJView />;
      case 'promotor': return <PromotorView />;
      case 'staff': return <StaffView />;
      case 'makeup': return <MakeupView />;
      case 'settings': return <SettingsView />;
      case 'empresario': return <EmpresarioView />;
      case 'messages': return <MessagesView />;
      case 'calendar': return <CalendarView />;
      case 'profile': return <ProfileView />;
      case 'mapa': return <MapaView />;
      case 'escenario': return <EscenarioVirtualView />;
      case 'flashbooking': return <FlashBookingWallView />;
      case 'topweekend': return <TopWeekendView />;
      case 'stats': return <StatsView />;
      case 'flash': return <FlashBookingView />;
      case 'admin': return (
        <AdminGuard>
          <AdminView />
        </AdminGuard>
      );
      default: return <DJView />;
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center" style={{ background: '#000' }}>
        <div className="text-xs text-muted-foreground animate-pulse">Cargando...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: '#000' }}>
      <AmbientBackground />

      {!isMobile && (
        <DashboardSidebar activeView={activeView} onViewChange={handleViewChange} />
      )}

      {isMobile && (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0 w-[260px] border-r-0" style={{ background: '#0a0a0a' }}>
            <DashboardSidebar activeView={activeView} onViewChange={handleViewChange} />
          </SheetContent>
        </Sheet>
      )}

      <main className="flex-1 flex flex-col overflow-y-auto relative min-w-0">
        <DashboardTopbar onMenuToggle={() => setSidebarOpen(true)} isMobile={isMobile} />
        <div className="p-4 md:p-6 flex-1">
          {renderView()}
        </div>
        <LegalFooter />
      </main>
    </div>
  );
};

export default Dashboard;
