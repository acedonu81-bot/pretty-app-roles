import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import AmbientBackground from '@/components/AmbientBackground';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardTopbar from '@/components/dashboard/DashboardTopbar';
import DJView from '@/components/dashboard/views/DJView';
import PromotorView from '@/components/dashboard/views/PromotorView';
import AgencyView from '@/components/dashboard/views/AgencyView';
import SettingsView from '@/components/dashboard/views/SettingsView';
import MessagesView from '@/components/dashboard/views/MessagesView';
import CalendarView from '@/components/dashboard/views/CalendarView';
import WalletView from '@/components/dashboard/views/WalletView';
import ProfileView from '@/components/dashboard/views/ProfileView';
import KYCView from '@/components/dashboard/views/KYCView';
import PlaceholderView from '@/components/dashboard/views/PlaceholderView';
import LiveStreamView from '@/components/dashboard/views/LiveStreamView';

const Dashboard = () => {
  const location = useLocation();
  const initialView = (location.state as { view?: string })?.view || 'dj';
  const [activeView, setActiveView] = useState(initialView);

  const renderView = () => {
    switch (activeView) {
      case 'dj': return <DJView />;
      case 'promotor': return <PromotorView />;
      case 'agency': return <AgencyView />;
      case 'settings': return <SettingsView />;
      case 'messages': return <MessagesView />;
      case 'calendar': return <CalendarView />;
      case 'wallet': return <WalletView />;
      case 'profile': return <ProfileView />;
      case 'kyc': return <KYCView />;
      case 'security': return <PlaceholderView title="Seguridad Privada" subtitle="Gestiona escoltas y seguridad para eventos." />;
      case 'staff': return <PlaceholderView title="Personal de Sala" subtitle="Asigna personal y coordina turnos." />;
      case 'makeup': return <PlaceholderView title="Estilismo Makeup" subtitle="Servicio de peluquería y maquillaje VIP." />;
      case 'mapa': return <PlaceholderView title="Mapa Salas" subtitle="Salas verificadas en toda España." />;
      case 'live': return <LiveStreamView />;
      case 'rescue': return <PlaceholderView title="NIGHTLIFE Rescue" subtitle="Sistema de emergencia y reemplazo de DJ." />;
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
      </main>
    </div>
  );
};

export default Dashboard;
