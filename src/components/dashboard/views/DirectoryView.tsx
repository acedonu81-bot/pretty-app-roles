import { useState, useEffect } from 'react';
import { Crown, Eye, Maximize2, Minimize2, Users, Video } from 'lucide-react';
import { profiles, getEliteRotation, Profile } from '@/data/profiles';
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

/** Animated wave equalizer for LIVE indicator */
const MiniEqualizer = () => {
  const [heights, setHeights] = useState(Array(12).fill(30));
  useEffect(() => {
    const iv = setInterval(() => setHeights(Array(12).fill(0).map(() => 15 + Math.random() * 85)), 200);
    return () => clearInterval(iv);
  }, []);
  return (
    <div className="w-full h-full flex items-end justify-center gap-[2px] p-3">
      {heights.map((h, i) => (
        <div key={i} className="w-1.5 rounded-full transition-all duration-150"
          style={{ height: `${h}%`, background: 'linear-gradient(180deg, #D4AF37, #B8941E)', opacity: 0.6 }} />
      ))}
    </div>
  );
};

/** Single stream tile — always shows wave animation instead of broken iframes */
const StreamTile = ({ profile, isExpanded, onToggle, viewerCount }: {
  profile: Profile;
  isExpanded: boolean;
  onToggle: () => void;
  viewerCount: number;
}) => (
  <div className={`relative rounded-lg overflow-hidden flex flex-col ${isExpanded ? 'col-span-2 row-span-2' : ''}`}
    style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(229,57,53,0.2)', minHeight: isExpanded ? 320 : 160 }}>
    {/* Stream content — wave animation */}
    <div className="flex-1 relative">
      <MiniEqualizer />
    </div>

    {/* Overlay info */}
    <div className="absolute top-2 left-2 flex items-center gap-1.5">
      <span className="text-[0.5rem] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1"
        style={{ background: '#E53935', color: '#fff' }}>
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-white" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
        </span>
        LIVE
      </span>
      <span className="text-[0.5rem] font-medium px-1.5 py-0.5 rounded-md flex items-center gap-1"
        style={{ background: 'rgba(0,0,0,0.7)', color: '#fff' }}>
        <Eye size={8} /> {viewerCount}
      </span>
    </div>

    <button onClick={onToggle} className="absolute top-2 right-2 w-6 h-6 rounded flex items-center justify-center transition-all hover:scale-110"
      style={{ background: 'rgba(0,0,0,0.6)', color: '#fff' }}>
      {isExpanded ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
    </button>

    {/* Profile bar */}
    <div className="flex items-center gap-2 p-2" style={{ background: 'rgba(0,0,0,0.8)' }}>
      <GeometricAvatar role={profile.role as any} seed={profile.id} size={24} isLive />
      <div className="flex-1 min-w-0">
        <p className="text-[0.65rem] font-bold truncate">{profile.name}</p>
        <p className="text-[0.5rem] text-muted-foreground truncate">{profile.specialty}</p>
      </div>
      <span className="text-[0.5rem] font-bold" style={{ color: '#D4AF37' }}>
        {profile.profileViews.toLocaleString()} views
      </span>
    </div>
  </div>
);

const DirectoryView = ({ role, title, subtitle, onNavigate }: DirectoryViewProps) => {
  const roleProfiles = profiles.filter(p => p.role === role);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutItem, setCheckoutItem] = useState<{ name: string; price: number; description: string } | null>(null);
  const [sortedProfiles, setSortedProfiles] = useState(() => getEliteRotation(roleProfiles));
  const [expandedStream, setExpandedStream] = useState<number | null>(null);

  useEffect(() => {
    setSortedProfiles(getEliteRotation(roleProfiles));
    const iv = setInterval(() => setSortedProfiles(getEliteRotation(roleProfiles)), 60 * 60 * 1000);
    return () => clearInterval(iv);
  }, [role]);

  const liveStreamers = roleProfiles
    .filter(p => p.isLive || p.streamUrl)
    .sort((a, b) => b.profileViews - a.profileViews)
    .slice(0, 4);

  const viewerCounts = liveStreamers.map((p) => 15 + Math.floor(p.profileViews / 30));

  const toggleExpand = (id: number) => {
    setExpandedStream(prev => prev === id ? null : id);
  };

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-2xl font-bold mb-1">
            Directorio <span className="text-gradient">{title}</span>
          </h2>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        {onNavigate && (
          <button
            onClick={() => onNavigate('escenario')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all hover:scale-105"
            style={{
              background: 'rgba(229,57,53,0.12)',
              border: '1px solid rgba(229,57,53,0.3)',
              color: '#E53935',
            }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#E53935' }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#E53935' }} />
            </span>
            <Video size={14} /> Emitir en Directo
          </button>
        )}
      </div>

      {/* Embedded Live Streams */}
      {liveStreamers.length > 0 && (
        <div className="glass-panel p-4 mb-5" style={{ border: '1px solid rgba(229,57,53,0.15)' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#E53935' }} />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background: '#E53935' }} />
              </span>
              <span className="text-xs font-bold" style={{ color: '#E53935' }}>EN DIRECTO</span>
              <span className="text-[0.6rem] text-muted-foreground">— {title}</span>
            </div>
            <span className="text-[0.6rem] text-muted-foreground flex items-center gap-1">
              <Users size={10} /> {liveStreamers.length} streaming
            </span>
          </div>

          <div className={`grid gap-2 ${
            expandedStream !== null
              ? 'grid-cols-1'
              : liveStreamers.length === 1
                ? 'grid-cols-1'
                : 'grid-cols-1 sm:grid-cols-2'
          }`}
            style={{ minHeight: expandedStream !== null ? 350 : liveStreamers.length === 1 ? 220 : 180 }}
          >
            {expandedStream !== null ? (
              (() => {
                const p = liveStreamers.find(s => s.id === expandedStream);
                if (!p) return null;
                const idx = liveStreamers.indexOf(p);
                return (
                  <StreamTile
                    profile={p}
                    isExpanded
                    onToggle={() => toggleExpand(p.id)}
                    viewerCount={viewerCounts[idx] || 0}
                  />
                );
              })()
            ) : (
              liveStreamers.map((p, i) => (
                <StreamTile
                  key={p.id}
                  profile={p}
                  isExpanded={false}
                  onToggle={() => toggleExpand(p.id)}
                  viewerCount={viewerCounts[i]}
                />
              ))
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
