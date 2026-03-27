import { useState, useEffect } from 'react';
import { Crown, Eye, Maximize2, Minimize2, Users, Video, Settings, ExternalLink } from 'lucide-react';
import { profiles, getEliteRotation, Profile } from '@/data/profiles';
import ProfileCard from '@/components/dashboard/ProfileCard';
import CheckoutModal from '@/components/dashboard/CheckoutModal';
import OffersWidget from '@/components/dashboard/OffersWidget';
import GeometricAvatar from '@/components/dashboard/GeometricAvatar';
import LiveBetaButton from '@/components/dashboard/LiveBetaButton';
import { useProfile } from '@/hooks/useProfile';
import { normalizeStreamUrl, parseStreamUrl } from '@/lib/streaming';
import { toast } from 'sonner';

interface DirectoryViewProps {
  role: string;
  title: string;
  subtitle: string;
  onNavigate?: (view: string) => void;
  wideCards?: boolean;
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

/** Single stream tile with real video embed support */
const StreamTile = ({ profile, isExpanded, onToggle, viewerCount }: {
  profile: Profile;
  isExpanded: boolean;
  onToggle: () => void;
  viewerCount: number;
}) => {
  const streamEmbed = parseStreamUrl(profile.streamUrl);

  return (
    <div className="relative rounded-lg overflow-hidden flex flex-col transition-all duration-300"
      style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(229,57,53,0.2)', height: isExpanded ? 450 : 180 }}>
      <div className="flex-1 relative">
        {streamEmbed ? (
          <iframe
            src={streamEmbed.embedUrl}
            className="absolute inset-0 w-full h-full"
            allowFullScreen
            allow="autoplay; encrypted-media; fullscreen"
            style={{ border: 'none' }}
            title={`${profile.name} - ${streamEmbed.type}`}
          />
        ) : (
          <MiniEqualizer />
        )}
      </div>

      {/* Overlay info */}
      <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
        <span className="text-[0.55rem] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1"
          style={{ background: '#E53935', color: '#fff' }}>
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-white" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
          </span>
          LIVE
        </span>
        <span className="text-[0.55rem] font-medium px-1.5 py-0.5 rounded-md flex items-center gap-1"
          style={{ background: 'rgba(0,0,0,0.7)', color: '#fff' }}>
          <Eye size={8} /> {viewerCount}
        </span>
        {streamEmbed && (
          <span className="text-[0.5rem] font-medium px-1.5 py-0.5 rounded-md"
            style={{ background: 'rgba(0,0,0,0.7)', color: '#D4AF37' }}>
            {streamEmbed.type}
          </span>
        )}
      </div>

      <button onClick={onToggle} className="absolute top-2 right-2 w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-110 z-10"
        style={{ background: 'rgba(0,0,0,0.6)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
        {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
      </button>

      {/* Profile bar */}
      <div className="flex items-center gap-2 p-2" style={{ background: 'rgba(0,0,0,0.8)' }}>
        <GeometricAvatar role={profile.role as any} seed={profile.id} size={24} isLive />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold truncate">{profile.name}</p>
          <p className="text-[0.6rem] text-muted-foreground truncate">{profile.specialty}</p>
        </div>
        <span className="text-[0.6rem] font-bold" style={{ color: '#D4AF37' }}>
          {viewerCount} viewers
        </span>
      </div>
    </div>
  );
};

/** Stream settings panel */
const StreamSettingsPanel = ({
  onClose,
  onSave,
  saving,
  streamTitle,
  streamUrl,
  onStreamTitleChange,
  onStreamUrlChange,
}: {
  onClose: () => void;
  onSave: () => Promise<void>;
  saving: boolean;
  streamTitle: string;
  streamUrl: string;
  onStreamTitleChange: (value: string) => void;
  onStreamUrlChange: (value: string) => void;
}) => {
  const parsed = parseStreamUrl(streamUrl);

  return (
    <div className="glass-panel p-4 mb-4 animate-[fadeIn_0.3s_ease]" style={{ border: '1px solid rgba(212,175,55,0.15)' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Settings size={14} style={{ color: '#D4AF37' }} />
          <span className="text-sm font-bold" style={{ color: '#D4AF37' }}>Ajustes del Directo</span>
        </div>
        <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground">Cerrar</button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium mb-1 block">Título del directo</label>
          <input value={streamTitle} onChange={e => onStreamTitleChange(e.target.value)}
            placeholder="Mi sesión en vivo..." className="nightlife-input text-sm !py-2.5 w-full" />
        </div>
        <div>
          <label className="text-xs font-medium mb-1 block">URL de streaming</label>
          <input value={streamUrl} onChange={e => onStreamUrlChange(e.target.value)}
            placeholder="https://twitch.tv/tu_canal o https://youtube.com/live/..."
            className="nightlife-input text-sm !py-2.5 w-full" />
          <p className="text-[0.6rem] text-muted-foreground mt-1">Soporta Twitch, YouTube Live y Mixcloud</p>
          {parsed && (
            <p className="text-[0.65rem] mt-1 font-bold" style={{ color: '#22c55e' }}>✓ {parsed.type} detectado — el vídeo se incrustará automáticamente</p>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={onSave} disabled={saving} className="flex-1 px-4 py-2 rounded-lg text-xs font-bold transition-all hover:scale-105 disabled:opacity-60"
            style={{ background: 'linear-gradient(90deg, #D4AF37, #B8941E)', color: '#000' }}>
            {saving ? 'Guardando...' : 'Guardar ajustes'}
          </button>
        </div>
      </div>
    </div>
  );
};

const DirectoryView = ({ role, title, subtitle, onNavigate, wideCards }: DirectoryViewProps) => {
  const profile = useProfile();
  const roleProfiles = profiles.filter(p => p.role === role);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutItem, setCheckoutItem] = useState<{ name: string; price: number; description: string } | null>(null);
  const [sortedProfiles, setSortedProfiles] = useState(() => getEliteRotation(roleProfiles));
  const [expandedStream, setExpandedStream] = useState<number | null>(null);
  const [showStreamSettings, setShowStreamSettings] = useState(false);
  const [streamUrl, setStreamUrl] = useState(profile.stream_url ?? '');
  const [streamTitle, setStreamTitle] = useState(profile.stream_title ?? '');
  const [savingStream, setSavingStream] = useState(false);

  useEffect(() => {
    setSortedProfiles(getEliteRotation(roleProfiles));
    const iv = setInterval(() => setSortedProfiles(getEliteRotation(roleProfiles)), 60 * 60 * 1000);
    return () => clearInterval(iv);
  }, [role]);

  useEffect(() => {
    setStreamUrl(profile.stream_url ?? '');
    setStreamTitle(profile.stream_title ?? '');
  }, [profile.stream_url, profile.stream_title]);

  const liveStreamers = roleProfiles
    .filter(p => p.isLive || p.streamUrl)
    .sort((a, b) => b.profileViews - a.profileViews);

  const viewerCounts = liveStreamers.map(() => Math.floor(Math.random() * 80) + 10);

  const toggleExpand = (id: number) => {
    setExpandedStream(prev => prev === id ? null : id);
  };

  const handleSaveStream = async () => {
    const normalized = normalizeStreamUrl(streamUrl);

    if (streamUrl.trim() && !parseStreamUrl(normalized)) {
      toast.error('La URL del streaming no es compatible.');
      return;
    }

    setSavingStream(true);
    await profile.updateField({
      stream_url: streamUrl.trim() ? normalized : null,
      stream_title: streamTitle.trim() || null,
    });
    setSavingStream(false);
    toast.success('Ajustes del directo guardados.');
    setShowStreamSettings(false);
  };

  // Grid class based on wideCards prop
  const gridClass = wideCards
    ? 'grid grid-cols-1 sm:grid-cols-2 gap-5'
    : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4';

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-2xl font-bold mb-1">
            Directorio <span className="text-gradient">{title}</span>
          </h2>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowStreamSettings(!showStreamSettings)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all hover:scale-105"
            style={{
              background: 'rgba(212,175,55,0.08)',
              border: '1px solid rgba(212,175,55,0.2)',
              color: '#D4AF37',
            }}
          >
            <Settings size={14} /> Ajustes Directo
          </button>
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
      </div>

      {showStreamSettings && (
        <StreamSettingsPanel
          onClose={() => setShowStreamSettings(false)}
          onSave={handleSaveStream}
          saving={savingStream}
          streamTitle={streamTitle}
          streamUrl={streamUrl}
          onStreamTitleChange={setStreamTitle}
          onStreamUrlChange={setStreamUrl}
        />
      )}

      {/* Live Streams — vertical list ordered by viewers */}
      {liveStreamers.length > 0 && (
        <div className="glass-panel p-4 mb-5" style={{ border: '1px solid rgba(229,57,53,0.15)' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#E53935' }} />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background: '#E53935' }} />
              </span>
              <span className="text-xs font-bold" style={{ color: '#E53935' }}>EN DIRECTO</span>
              <span className="text-[0.65rem] text-muted-foreground">— {title}</span>
            </div>
            <span className="text-[0.65rem] text-muted-foreground flex items-center gap-1">
              <Users size={10} /> {liveStreamers.length} streaming
            </span>
          </div>

          {/* Vertical stack */}
          <div className="flex flex-col gap-3">
            {liveStreamers.map((p, i) => (
              <StreamTile
                key={p.id}
                profile={p}
                isExpanded={expandedStream === p.id}
                onToggle={() => toggleExpand(p.id)}
                viewerCount={viewerCounts[i]}
              />
            ))}
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

      <div className={gridClass}>
        {sortedProfiles.map(p => (
          <ProfileCard key={p.id} profile={p} showPortfolio={wideCards} />
        ))}
      </div>

      <div className="mt-6">
        <LiveBetaButton />
      </div>

      <OffersWidget title={`Ofertas para ${title}`} role={role} />
      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} item={checkoutItem} />
    </div>
  );
};

export default DirectoryView;
