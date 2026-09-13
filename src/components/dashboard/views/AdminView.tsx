import { useState, useEffect, useRef } from 'react';
import { Users, MessageSquare, TrendingDown, Tag, LayoutGrid, Building2, UserMinus, Activity, ShieldCheck, LineChart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AdminMetrics from './admin/AdminMetrics';
import AdminCharts from './admin/AdminCharts';
import AdminHiredContracts from './admin/AdminHiredContracts';
import AdminUserManagement from './admin/AdminUserManagement';
import AdminBusinesses from './admin/AdminBusinesses';
import AdminFeatureRequests from './admin/AdminFeatureRequests';
import AdminCancellations from './admin/AdminCancellations';
import AdminReviews from './admin/AdminReviews';
import AdminPromoCodes from './admin/AdminPromoCodes';
import AdminDeletionAlert from './admin/AdminDeletionAlert';
import AdminNewProfileAlert from './admin/AdminNewProfileAlert';
import AdminInvisibleProfilesAlert from './admin/AdminInvisibleProfilesAlert';
import AdminPendingBookingsAlert from './admin/AdminPendingBookingsAlert';
import AdminActivity from './admin/AdminActivity';
import AdminSaludSistema from './admin/AdminSaludSistema';
import AdminDeletions from './admin/AdminDeletions';
import AdminAnalytics from './admin/AdminAnalytics';
import AdminConversations from './admin/AdminConversations';

const TABS = [
  { id: 'activity', label: 'Actividad', icon: Activity },
  { id: 'salud',    label: 'Salud',     icon: ShieldCheck },
  { id: 'analytics', label: 'Tráfico', icon: LineChart },
  { id: 'overview', label: 'General', icon: LayoutGrid },
  { id: 'users', label: 'Usuarios', icon: Users },
  { id: 'empresarios', label: 'Empresarios', icon: Building2 },
  { id: 'content', label: 'Reseñas', icon: MessageSquare },
  { id: 'business', label: 'Negocio', icon: TrendingDown },
  { id: 'deletions', label: 'Bajas', icon: UserMinus },
  { id: 'promos', label: 'Códigos Promo', icon: Tag },
] as const;
type TabId = typeof TABS[number]['id'];

const AdminView = ({ onNavigate }: { onNavigate?: (view: string) => void } = {}) => {
  const [tab, setTab] = useState<TabId>('activity');

  // Badge de reseñas pendientes en la tab "Reseñas" (13 sep 2026): antes solo
  // se veían entrando a esa pestaña en concreto, así que si el admin no
  // navegaba ahí no se enteraba de que había algo esperando aprobación.
  // Mismo patrón que useDashboardBadges (realtime + refetch en INSERT/UPDATE),
  // pero local a este componente porque solo lo necesita el admin.
  const [reviewsBadge, setReviewsBadge] = useState(0);
  const instanceId = useRef(Math.random().toString(36).slice(2)).current;

  useEffect(() => {
    const refresh = async () => {
      const { count } = await supabase
        .from('reviews')
        .select('id', { count: 'exact', head: true })
        .eq('approved', false);
      setReviewsBadge(count ?? 0);
    };
    refresh();
    const channel = supabase
      .channel(`admin_reviews_badge_${instanceId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'reviews' }, refresh)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'reviews' }, refresh)
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'reviews' }, refresh)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [instanceId]);

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      {/* Fuera del sistema de pestañas a propósito: un alta o una baja hay que
          verlas entres por donde entres, no solo en la pestaña que toque.
          El alta va primero porque es la accionable: revisar rol y zona a
          tiempo evita que el perfil quede invisible en el directorio. */}
      <AdminPendingBookingsAlert />
      <AdminNewProfileAlert onOpenUsers={() => setTab('users')} />
      <AdminInvisibleProfilesAlert onOpenUsers={() => setTab('users')} />
      <AdminDeletionAlert onOpenDeletions={() => setTab('deletions')} />

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
            {t.id === 'content' && reviewsBadge > 0 && (
              <span className="flex items-center justify-center rounded-full text-[0.65rem] font-black"
                style={{ minWidth: 16, height: 16, padding: '0 4px', background: '#dc2626', color: '#fff' }}>
                {reviewsBadge}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === 'activity' && <AdminActivity />}
      {tab === 'salud' && <AdminSaludSistema />}
      {tab === 'analytics' && <AdminAnalytics />}
      {tab === 'overview' && (
        <>
          <AdminMetrics />
          <AdminHiredContracts />
          <AdminCharts />
        </>
      )}
      {tab === 'users' && <AdminUserManagement />}
      {tab === 'deletions' && <AdminDeletions />}
      {tab === 'empresarios' && <AdminBusinesses />}
      {tab === 'content' && <AdminReviews />}
      {tab === 'business' && (
        <>
          <AdminFeatureRequests />
          <AdminCancellations />
          <AdminConversations />
        </>
      )}
      {tab === 'promos' && <AdminPromoCodes />}
    </div>
  );
};

export default AdminView;
