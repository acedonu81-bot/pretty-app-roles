import { useState, useEffect } from 'react';
import { Crown, Eye, Maximize2, Minimize2, Users, Video, Settings, Globe, Zap, Lock } from 'lucide-react';
import { Profile } from '@/data/profiles';
import ProfileCard from '@/components/dashboard/ProfileCard';
import CheckoutModal from '@/components/dashboard/CheckoutModal';
import NightlifeSelect from '@/components/ui/NightlifeSelect';
import OffersWidget from '@/components/dashboard/OffersWidget';
import GeometricAvatar from '@/components/dashboard/GeometricAvatar';
import UpgradeModal from '@/components/dashboard/UpgradeModal';
import { useProfile } from '@/hooks/useProfile';
import { normalizeStreamUrl, parseStreamUrl } from '@/lib/streaming';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface DirectoryViewProps {
  role: string;
  title: string;
  subtitle: string;
  onNavigate?: (view: string) => void;
  onMessage?: (userId: string, name: string) => void;
  wideCards?: boolean;
  searchQuery?: string;
  onViewProfile?: (profile: Profile) => void;
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
          style={{ height: `${h}%`, background: 'linear-gradient(180deg, #D4AF37, #B8941E)', opacity: Math.max(0.3, h / 100) }} />
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
      style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(229,57,53,0.2)', height: isExpanded ? 'min(450px, 60vh)' : 180 }}>
      <div className="flex-1 relative">
        {streamEmbed ? (
          <iframe
            src={streamEmbed.embedUrl}
            className="absolute inset-0 w-full h-full"
            allowFullScreen
            allow="autoplay; encrypted-media; fullscreen"
            sandbox="allow-scripts allow-same-origin allow-presentation"
            style={{ border: 'none' }}
            title={`${profile.name} - ${streamEmbed.type}`}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center"
            style={{
              backgroundImage: 'url(/hero-bg.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}>
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.65)' }} />
            <img src="/xpeak-logo.png" alt="XPEAK" className="relative z-10 w-16 opacity-60" />
          </div>
        )}
      </div>

      {/* Overlay info */}
      <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
        <span className="text-[0.75rem] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1"
          style={{ background: '#E53935', color: '#fff' }}>
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-white" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
          </span>
          LIVE
        </span>
        <span className="text-[0.75rem] font-medium px-1.5 py-0.5 rounded-md flex items-center gap-1"
          style={{ background: 'rgba(0,0,0,0.7)', color: '#fff' }}>
          <Eye size={10} /> {viewerCount}
        </span>
        {streamEmbed && (
          <span className="text-[0.7rem] font-medium px-1.5 py-0.5 rounded-md"
            style={{ background: 'rgba(0,0,0,0.7)', color: '#D4AF37' }}>
            {streamEmbed.type}
          </span>
        )}
      </div>

      <button onClick={onToggle} aria-label={isExpanded ? 'Reducir stream' : 'Ampliar stream'}
        className="absolute top-2 right-2 w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-110 z-10"
        style={{ background: 'rgba(0,0,0,0.6)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
        {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
      </button>

      {/* Profile bar */}
      <div className="flex items-center gap-2 p-2" style={{ background: 'rgba(0,0,0,0.8)' }}>
        <GeometricAvatar role={profile.role as any} seed={profile.id} size={24} isLive />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold truncate">{profile.name}</p>
          <p className="text-xs text-muted-foreground truncate">{profile.specialty}</p>
        </div>
        <span className="text-xs font-bold" style={{ color: '#D4AF37' }}>
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
          <p className="text-xs text-muted-foreground mt-1">Soporta Twitch, YouTube Live y Mixcloud</p>
          {parsed && (
            <p className="text-xs mt-1 font-bold" style={{ color: '#22c55e' }}>✓ {parsed.type} detectado — el vídeo se incrustará automáticamente</p>
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

const CITY_OPTIONS = [
  'Todas las ciudades',
  'Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao',
  'Málaga', 'Ibiza', 'Palma de Mallorca', 'Zaragoza', 'Murcia',
  'Alicante', 'Granada', 'Tenerife', 'Las Palmas de Gran Canaria',
].map(c => ({ value: c, label: c }));

const TIER_ORDER = ['free', 'starter', 'business', 'agency', 'elite', 'premium'];
const TIER_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  free:     { label: 'Free',     color: '#8E8EA0', bg: 'rgba(255,255,255,0.04)' },
  starter:  { label: 'Starter',  color: '#A8C5DA', bg: 'rgba(168,197,218,0.08)' },
  business: { label: 'Business', color: '#D4AF37', bg: 'rgba(212,175,55,0.1)' },
  premium:  { label: 'Business', color: '#D4AF37', bg: 'rgba(212,175,55,0.1)' },
  agency:   { label: 'Agencia',  color: '#D4AF37', bg: 'rgba(212,175,55,0.15)' },
  elite:    { label: 'Agencia',  color: '#D4AF37', bg: 'rgba(212,175,55,0.15)' },
};

const DJ_ROLES = new Set(['dj', 'rookie']);

const DirectoryView = ({ role, title, subtitle, onNavigate, onMessage, wideCards, searchQuery, onViewProfile }: DirectoryViewProps) => {
  const profile = useProfile();
  const isUserFree = profile.subscription_tier === 'free';
  const isDJRole = DJ_ROLES.has(role);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutItem, setCheckoutItem] = useState<{ name: string; price: number; description: string } | null>(null);
  const [realProfiles, setRealProfiles] = useState<Profile[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [expandedStream, setExpandedStream] = useState<number | null>(null);
  const [showStreamSettings, setShowStreamSettings] = useState(false);
  const [streamUrl, setStreamUrl] = useState(profile.stream_url ?? '');
  const [streamTitle, setStreamTitle] = useState(profile.stream_title ?? '');
  const [savingStream, setSavingStream] = useState(false);
  const [filterCity, setFilterCity] = useState('Todas las ciudades');
  const [filterFlash, setFilterFlash] = useState(false);
  const [filterVerified, setFilterVerified] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    setLoadingProfiles(true);
    let query = supabase
      .from('profiles')
      .select('id, user_id, display_name, photo_url, zone, hourly_rate, specialty, subscription_tier, is_live, genres, audio_embed_url, bio, languages, tiktok, category, is_verified, is_flash_active, stream_url, score')
      .eq('role', role)
      .limit(200);

    if (filterCity !== 'Todas las ciudades') {
      query = query.ilike('zone', `%${filterCity}%`);
    }

    query.order('score', { ascending: false }).then(({ data }) => {
      if (!data) { setLoadingProfiles(false); return; }
      const TIER_RANK: Record<string, number> = { agency: 5, elite: 5, business: 4, premium: 4, starter: 2, free: 1 };
      const mapped: Profile[] = data
        .filter(row => row.display_name && row.display_name.trim().length > 1)
        .sort((a, b) => {
          // 1. Live primero
          if ((b.is_live ? 1 : 0) !== (a.is_live ? 1 : 0)) return (b.is_live ? 1 : 0) - (a.is_live ? 1 : 0);
          // 2. Tier mayor primero
          const tierDiff = (TIER_RANK[b.subscription_tier ?? 'free'] ?? 1) - (TIER_RANK[a.subscription_tier ?? 'free'] ?? 1);
          if (tierDiff !== 0) return tierDiff;
          // 3. Verificados antes
          if ((b.is_verified ? 1 : 0) !== (a.is_verified ? 1 : 0)) return (b.is_verified ? 1 : 0) - (a.is_verified ? 1 : 0);
          // 4. Score
          return (b.score ?? 0) - (a.score ?? 0);
        })
        .map((row) => ({
        id: row.id,
        userId: row.user_id,
        name: row.display_name || 'Sin nombre',
        role: role as Profile['role'],
        specialty: row.specialty || '',
        rating: 0,
        reviews: 0,
        location: row.zone || 'España',
        zone: row.zone || '',
        experience: '',
        price: row.hourly_rate ?? 0,
        priceUnit: '/hora',
        avatar: (row.display_name || 'X').charAt(0).toUpperCase(),
        gradient: 'linear-gradient(135deg,#D4AF37,#B8941E)',
        badges: row.genres ?? [],
        description: row.bio || '',
        phone: '',
        instagram: '',
        topWeekend: false,
        photo: row.photo_url || '',
        subscriptionTier: (row.subscription_tier as Profile['subscriptionTier']) ?? 'free',
        isFlashActive: row.is_flash_active ?? false,
        profileViews: (row.score as number) ?? 0,
        contactClicks: 0,
        isLive: row.is_live ?? false,
        isPremium: row.subscription_tier !== 'free',
        languages: row.languages ?? [],
        tiktok: row.tiktok || '',
        streamUrl: row.stream_url || undefined,
        category: (row.category as Profile['category']) ?? 'professional',
        isVerified: row.is_verified ?? false,
      }));
      setRealProfiles(mapped);
      setLoadingProfiles(false);
    });
  }, [role, filterCity]);

  const filteredProfiles = realProfiles.filter(p => {
    if (searchQuery?.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesSearch = p.name.toLowerCase().includes(q) || p.specialty.toLowerCase().includes(q) ||
        p.zone.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }
    if (filterFlash && !p.isFlashActive) return false;
    if (filterVerified && !p.isVerified) return false;
    return true;
  });

  useEffect(() => {
    setStreamUrl(profile.stream_url ?? '');
    setStreamTitle(profile.stream_title ?? '');
  }, [profile.stream_url, profile.stream_title]);

  // Solo aparecen en EN DIRECTO si is_live = true Y tienen stream_url activa
  const liveStreamers = realProfiles
    .filter(p => p.isLive && p.streamUrl)
    .sort((a, b) => b.profileViews - a.profileViews);

  const viewerCounts = liveStreamers.map(() => 0);

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
    : 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3';

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-2xl font-bold mb-1">
            Directorio <span className="text-gradient">{title}</span>
          </h2>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        {isDJRole && (
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowStreamSettings(!showStreamSettings)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all hover:scale-105"
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
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all hover:scale-105"
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
        )}
        {!isDJRole && onNavigate && (
          <button
            onClick={() => onNavigate('flashbooking')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all hover:scale-105"
            style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', color: '#D4AF37' }}>
            <Zap size={14} /> Flash Booking
          </button>
        )}
      </div>

      {isDJRole && showStreamSettings && (
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
      {isDJRole && liveStreamers.length > 0 && (
        <div className="glass-panel p-4 mb-5" style={{ border: '1px solid rgba(229,57,53,0.15)' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#E53935' }} />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background: '#E53935' }} />
              </span>
              <span className="text-xs font-bold" style={{ color: '#E53935' }}>EN DIRECTO</span>
              <span className="text-xs text-muted-foreground">— {title}</span>
              <span className="text-[0.75rem] font-bold px-1.5 py-0.5 rounded"
                style={{ background: 'rgba(212,175,55,0.08)', color: 'rgba(212,175,55,0.5)', border: '1px solid rgba(212,175,55,0.15)' }}>
                DEMO
              </span>
            </div>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
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

      {/* Filtros */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Globe size={12} style={{ color: '#D4AF37' }} />
          <span className="text-xs font-bold" style={{ color: '#D4AF37' }}>ES</span>
        </div>
        <NightlifeSelect
          value={filterCity}
          onChange={setFilterCity}
          options={CITY_OPTIONS}
          placeholder="Todas las ciudades"
          active={filterCity !== 'Todas las ciudades'}
          className="flex-1 min-w-[130px] max-w-[220px]"
        />
        <button
          onClick={() => setFilterFlash(v => !v)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex-shrink-0"
          style={{
            background: filterFlash ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${filterFlash ? 'rgba(34,197,94,0.35)' : 'rgba(255,255,255,0.08)'}`,
            color: filterFlash ? '#22c55e' : '#555',
          }}>
          <Zap size={11} /> Disponible
        </button>
        <button
          onClick={() => setFilterVerified(v => !v)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex-shrink-0"
          style={{
            background: filterVerified ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${filterVerified ? 'rgba(212,175,55,0.35)' : 'rgba(255,255,255,0.08)'}`,
            color: filterVerified ? '#D4AF37' : '#555',
          }}>
          <Crown size={11} /> Verificado
        </button>
        {(filterCity !== 'Todas las ciudades' || filterFlash || filterVerified) && (
          <button onClick={() => { setFilterCity('Todas las ciudades'); setFilterFlash(false); setFilterVerified(false); }}
            className="text-xs font-bold px-2 py-1 rounded transition-all hover:opacity-70 flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.08)' }}>
            Limpiar ✕
          </button>
        )}
        <span className="text-xs ml-auto flex-shrink-0" style={{ color: 'rgba(255,255,255,0.25)' }}>
          {filteredProfiles.length} resultado{filteredProfiles.length !== 1 ? 's' : ''}
        </span>
      </div>

      {loadingProfiles && (
        <div className={`${gridClass} mb-5`}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="glass-panel p-4 animate-pulse">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="h-3 bg-white/5 rounded mb-1.5 w-3/4" />
                  <div className="h-2 bg-white/5 rounded w-1/2" />
                </div>
              </div>
              <div className="h-2 bg-white/5 rounded mb-1.5" />
              <div className="h-2 bg-white/5 rounded w-2/3 mb-3" />
              <div className="flex justify-between items-center">
                <div className="h-4 bg-white/5 rounded w-1/4" />
                <div className="h-7 bg-white/5 rounded-lg w-20" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loadingProfiles && filteredProfiles.length === 0 && (
        <div className="glass-panel p-10 flex flex-col items-center text-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.12)' }}>
            <Users size={20} style={{ color: 'rgba(212,175,55,0.35)' }} />
          </div>
          <div>
            <p className="text-sm font-bold mb-1" style={{ color: 'rgba(255,255,255,0.8)' }}>
              {searchQuery?.trim() ? `Sin resultados para "${searchQuery}"` : 'Sin resultados con estos filtros'}
            </p>
            <p className="text-xs text-muted-foreground mb-3 max-w-[260px] mx-auto">
              Prueba cambiando la ciudad o quitando los filtros de disponibilidad o verificación.
            </p>
            {(filterCity !== 'Todas las ciudades' || filterFlash || filterVerified) && (
              <button onClick={() => { setFilterCity('Todas las ciudades'); setFilterFlash(false); setFilterVerified(false); }}
                className="text-xs font-bold px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                style={{ background: 'rgba(212,175,55,0.08)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }}>
                Quitar filtros
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tier distribution bar */}
      {filteredProfiles.length > 0 && (() => {
        const counts: Record<string, number> = {};
        filteredProfiles.forEach(p => {
          const t = p.subscriptionTier ?? 'free';
          counts[t] = (counts[t] || 0) + 1;
        });
        const tiers = ['agency', 'elite', 'business', 'premium', 'starter', 'free'].filter(t => counts[t]);
        return (
          <div className="flex flex-wrap items-center gap-2 mb-4 p-3 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--nightlife-border)' }}>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mr-1">Niveles:</span>
            {tiers.map(t => {
              const cfg = TIER_CONFIG[t] ?? TIER_CONFIG.free;
              return (
                <span key={t} className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}22` }}>
                  {cfg.label} <span style={{ opacity: 0.7 }}>×{counts[t]}</span>
                </span>
              );
            })}
            {isUserFree && (
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="ml-auto flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full transition-all hover:scale-105"
                style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.25)' }}>
                <Zap size={10} /> Subir de nivel
              </button>
            )}
          </div>
        );
      })()}

      {/* Free user upgrade nudge — sticky bottom banner */}
      {isUserFree && filteredProfiles.length > 3 && (
        <div className="relative mb-5 p-4 rounded-xl flex items-center gap-4 overflow-hidden"
          style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.2)' }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(212,175,55,0.07) 0%, transparent 70%)' }} />
          <Lock size={20} style={{ color: '#D4AF37', flexShrink: 0 }} />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold" style={{ color: '#D4AF37' }}>
              Estás en Free — solo ves una parte del directorio
            </p>
            <p className="text-xs text-muted-foreground">
              Los perfiles Business y Agencia tienen acceso prioritario. Actualiza para enviar mensajes, ver tarifas y aplicar a Flash Bookings.
            </p>
          </div>
          <button
            onClick={() => setShowUpgradeModal(true)}
            className="flex-shrink-0 px-4 py-2 rounded-lg text-xs font-bold transition-all hover:scale-105 active:scale-95"
            style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
            Ver planes
          </button>
        </div>
      )}

      <div className={gridClass}>
        {filteredProfiles.map(p => (
          <ProfileCard key={p.id} profile={p} showPortfolio={wideCards} onMessage={onMessage}
            onNavigateSubscription={() => onNavigate?.('subscription')} onViewProfile={onViewProfile} />
        ))}
      </div>


      <OffersWidget title={`Ofertas para ${title}`} role={role} />
      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} item={checkoutItem} />

      <UpgradeModal
        open={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        role={role}
        onNavigateSubscription={() => { setShowUpgradeModal(false); onNavigate?.('subscription'); }}
      />
    </div>
  );
};

export default DirectoryView;
