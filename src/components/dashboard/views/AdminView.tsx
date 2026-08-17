import { useState } from 'react';
import { Users, Shield, MessageSquare, TrendingDown, Tag, LayoutGrid } from 'lucide-react';
import AdminMetrics from './admin/AdminMetrics';
import AdminCharts from './admin/AdminCharts';
import AdminValidations from './admin/AdminValidations';
import AdminUserManagement from './admin/AdminUserManagement';
import AdminFeatureRequests from './admin/AdminFeatureRequests';
import AdminCancellations from './admin/AdminCancellations';
import AdminReviews from './admin/AdminReviews';
import AdminPromoCodes from './admin/AdminPromoCodes';

const TABS = [
  { id: 'overview', label: 'General', icon: LayoutGrid },
  { id: 'users', label: 'Usuarios', icon: Users },
  { id: 'validations', label: 'Validaciones', icon: Shield },
  { id: 'content', label: 'Reseñas', icon: MessageSquare },
  { id: 'business', label: 'Negocio', icon: TrendingDown },
  { id: 'promos', label: 'Códigos Promo', icon: Tag },
] as const;
type TabId = typeof TABS[number]['id'];

const AdminView = ({ onNavigate }: { onNavigate?: (view: string) => void } = {}) => {
  const [tab, setTab] = useState<TabId>('overview');

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">
          Panel <span className="text-gradient">Admin</span>
        </h2>
        <p className="text-sm text-muted-foreground">Control total del sistema XPEAK.</p>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap"
            style={{
              background: tab === t.id ? 'rgba(212,175,55,0.12)' : 'rgba(0,0,0,0.03)',
              border: `1px solid ${tab === t.id ? 'rgba(212,175,55,0.4)' : 'rgba(0,0,0,0.08)'}`,
              color: tab === t.id ? '#8A6D0F' : '#444',
            }}
          >
            <t.icon size={13} />
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <>
          <AdminMetrics />
          <AdminCharts />
        </>
      )}
      {tab === 'users' && <AdminUserManagement />}
      {tab === 'validations' && <AdminValidations />}
      {tab === 'content' && <AdminReviews />}
      {tab === 'business' && (
        <>
          <AdminFeatureRequests />
          <AdminCancellations />
        </>
      )}
      {tab === 'promos' && <AdminPromoCodes />}
    </div>
  );
};

export default AdminView;
