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
import WalletView from '@/components/dashboard/views/WalletView';
import ProfileView from '@/components/dashboard/views/ProfileView';
import StaffView from '@/components/dashboard/views/StaffView';
import MakeupView from '@/components/dashboard/views/MakeupView';
import MapaView from '@/components/dashboard/views/MapaView';
import EscenarioVirtualView from '@/components/dashboard/views/EscenarioVirtualView';
import LastCallView from '@/components/dashboard/views/LastCallView';

const Dashboard = () => {
  const location = useLocation();
  const initialView = (location.state as { view?: string })?.view || 'dj';
  const [activeView, setActiveView] = useState(initialView);

  const renderView = () => {
    switch (activeView) {
      case 'dj': return <DJView />;
      case 'promotor': return <PromotorView />;
      case 'staff': return <StaffView />;
      case 'makeup': return <MakeupView />;
      case 'settings': return <SettingsView />;
      case 'messages': return <MessagesView />;
      case 'calendar': return <CalendarView />;
      case 'wallet': return <WalletView />;
      case 'profile': return <ProfileView />;
      case 'mapa': return <MapaView />;
      case 'escenario': return <EscenarioVirtualView />;
      case 'lastcall': return <LastCallView />;
      default: return <DJView />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: 'var(--nightlife-bg)' }}>
      <AmbientBackground />
      <DashboardSidebar activeView={activeView} onViewChange={setActiveView} />
      <main className="flex-1 flex flex-col overflow-y-auto relative">
        <DashboardTopbar />
        <div className="p-8 flex-1">
          {renderView()}
        </div>
        <LegalFooter />
      </main>
    </div>
  );
};

export default Dashboard;
