import { useState } from 'react';
import { useLocation } from 'react-router-dom';
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
import LastCallView from '@/components/dashboard/views/LastCallView';
import TopFindeView from '@/components/dashboard/views/TopFindeView';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent } from '@/components/ui/sheet';

const Dashboard = () => {
  const location = useLocation();
  const initialView = (location.state as { view?: string })?.view || 'dj';
  const [activeView, setActiveView] = useState(initialView);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

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
      case 'messages': return <MessagesView />;
      case 'calendar': return <CalendarView />;
      case 'profile': return <ProfileView />;
      case 'mapa': return <MapaView />;
      case 'escenario': return <EscenarioVirtualView />;
      case 'lastcall': return <LastCallView />;
      case 'topfinde': return <TopFindeView />;
      default: return <DJView />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: 'var(--nightlife-bg)' }}>
      <AmbientBackground />

      {/* Desktop sidebar */}
      {!isMobile && (
        <DashboardSidebar activeView={activeView} onViewChange={handleViewChange} />
      )}

      {/* Mobile sidebar via Sheet */}
      {isMobile && (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0 w-[280px] border-r-0" style={{ background: 'var(--nightlife-card)' }}>
            <DashboardSidebar activeView={activeView} onViewChange={handleViewChange} />
          </SheetContent>
        </Sheet>
      )}

      <main className="flex-1 flex flex-col overflow-y-auto relative min-w-0">
        <DashboardTopbar onMenuToggle={() => setSidebarOpen(true)} isMobile={isMobile} />
        <div className="p-4 md:p-8 flex-1">
          {renderView()}
        </div>
        <LegalFooter />
      </main>
    </div>
  );
};

export default Dashboard;
