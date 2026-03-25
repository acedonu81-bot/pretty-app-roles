import { useState, useEffect } from 'react';
import { Crown, Radio, Eye } from 'lucide-react';
import { profiles, getEliteRotation } from '@/data/profiles';
import ProfileCard from '@/components/dashboard/ProfileCard';
import CheckoutModal from '@/components/dashboard/CheckoutModal';
import OffersWidget from '@/components/dashboard/OffersWidget';
import GeometricAvatar from '@/components/dashboard/GeometricAvatar';

interface DirectoryViewProps {
  role: string;
  title: string;
  subtitle: string;
  onNavigate?: (view: string) => void;
}

const DirectoryView = ({ role, title, subtitle, onNavigate }: DirectoryViewProps) => {
  const roleProfiles = profiles.filter(p => p.role === role);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutItem, setCheckoutItem] = useState<{ name: string; price: number; description: string } | null>(null);
  const [sortedProfiles, setSortedProfiles] = useState(() => getEliteRotation(roleProfiles));

  useEffect(() => {
    setSortedProfiles(getEliteRotation(roleProfiles));
    const iv = setInterval(() => setSortedProfiles(getEliteRotation(roleProfiles)), 60 * 60 * 1000);
    return () => clearInterval(iv);
  }, [role]);

  // Find top profile by views (featured streamer)
  const topStreamer = [...roleProfiles].sort((a, b) => b.profileViews - a.profileViews)[0];

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-2xl font-bold mb-1">
            Directorio <span className="text-gradient">{title}</span>
          </h2>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <button
          onClick={() => onNavigate?.('escenario')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 hover:scale-105 active:scale-95 shrink-0"
          style={{
            background: 'linear-gradient(90deg, #E53935, #C62828)',
            color: 'white',
            boxShadow: '0 2px 12px rgba(229,57,53,0.3)',
          }}
        >
          <Radio size={16} className="animate-pulse" />
          Emitir en Directo
        </button>
      </div>

      {/* Featured top streamer */}
      {topStreamer && (
        <div className="glass-panel p-4 mb-5 flex items-center gap-4"
          style={{ border: '1px solid rgba(229,57,53,0.2)', background: 'rgba(229,57,53,0.03)' }}>
          <div className="relative">
            <GeometricAvatar role={topStreamer.role as any} seed={topStreamer.id} size={52} isLive={topStreamer.isLive} />
            {topStreamer.isLive && (
              <span className="absolute -top-1 -right-1 text-[0.45rem] font-bold px-1.5 py-0.5 rounded-md animate-pulse"
                style={{ background: '#E53935', color: '#fff' }}>
                LIVE
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Crown size={14} style={{ color: '#D4AF37' }} />
              <span className="text-[0.6rem] font-bold uppercase tracking-wider" style={{ color: '#D4AF37' }}>
                Más visto en {title}
              </span>
            </div>
            <p className="text-sm font-bold truncate mt-0.5">{topStreamer.name}</p>
            <p className="text-xs text-muted-foreground">{topStreamer.specialty}</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground shrink-0">
            <span className="flex items-center gap-1">
              <Eye size={12} /> <span className="font-bold text-foreground">{topStreamer.profileViews.toLocaleString()}</span> visitas
            </span>
            {topStreamer.isLive && (
              <button
                onClick={() => onNavigate?.('escenario')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-[0.65rem] transition-all hover:scale-105"
                style={{ background: 'rgba(229,57,53,0.15)', color: '#E53935', border: '1px solid rgba(229,57,53,0.25)' }}
              >
                <Radio size={10} /> Ver en Directo
              </button>
            )}
          </div>
        </div>
      )}

      {sortedProfiles.some(p => p.subscriptionTier === 'elite') && (
        <div className="p-3 mb-5 rounded-lg flex items-center gap-2" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}>
          <Crown size={16} style={{ color: '#D4AF37' }} />
          <span className="text-xs font-medium" style={{ color: '#D4AF37' }}>
            Perfiles Elite — Posicionamiento prioritario con rotación horaria
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sortedProfiles.map(p => (
          <ProfileCard key={p.id} profile={p} />
        ))}
      </div>

      <OffersWidget title={`Ofertas para ${title}`} role={role} />
      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} item={checkoutItem} />
    </div>
  );
};

export default DirectoryView;
