import { useState, useEffect } from 'react';
import { Crown, Users, Globe, Zap } from 'lucide-react';
import { Profile } from '@/data/profiles';
import ProfileCard from '@/components/dashboard/ProfileCard';
import CheckoutModal from '@/components/dashboard/CheckoutModal';
import NightlifeSelect from '@/components/ui/NightlifeSelect';
import OffersWidget from '@/components/dashboard/OffersWidget';
import { supabase } from '@/integrations/supabase/client';

interface DirectoryViewProps {
  role: string;
  roles?: string[];
  title: string;
  subtitle: string;
  onNavigate?: (view: string) => void;
  onMessage?: (userId: string, name: string) => void;
  wideCards?: boolean;
  searchQuery?: string;
  onViewProfile?: (profile: Profile) => void;
}

const CITY_OPTIONS = [
  'Todas las ciudades',
  'Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao',
  'Málaga', 'Ibiza', 'Palma de Mallorca', 'Zaragoza', 'Murcia',
  'Alicante', 'Granada', 'Tenerife', 'Las Palmas de Gran Canaria',
].map(c => ({ value: c, label: c }));

const DirectoryView = ({ role, roles, title, subtitle, onNavigate, onMessage, wideCards, searchQuery, onViewProfile }: DirectoryViewProps) => {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutItem, setCheckoutItem] = useState<{ name: string; price: number; description: string } | null>(null);
  const [realProfiles, setRealProfiles] = useState<Profile[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [filterCity, setFilterCity] = useState('Todas las ciudades');
  const [filterFlash, setFilterFlash] = useState(false);
  const [filterVerified, setFilterVerified] = useState(false);

  useEffect(() => {
    setLoadingProfiles(true);
    const activeRoles = roles ?? [role];
    let query = supabase
      .from('profiles')
      .select('id, user_id, display_name, photo_url, zone, hourly_rate, specialty, subscription_tier, genres, audio_embed_url, bio, languages, tiktok, category, is_verified, is_flash_active, is_early_adopter, score, role')
      .in('role', activeRoles)
      .limit(200);

    if (filterCity !== 'Todas las ciudades') {
      query = query.ilike('zone', `%${filterCity}%`);
    }

    const reviewsPromise = supabase
      .from('reviews')
      .select('reviewed_user_id, rating')
      .eq('approved', true);

    Promise.all([query.order('score', { ascending: false }), reviewsPromise]).then(([{ data }, { data: reviewsData }]) => {
      if (!data) { setLoadingProfiles(false); return; }

      const ratingMap = new Map<string, { sum: number; count: number }>();
      (reviewsData ?? []).forEach((r: any) => {
        if (!r.reviewed_user_id) return;
        const entry = ratingMap.get(r.reviewed_user_id) || { sum: 0, count: 0 };
        entry.sum += r.rating;
        entry.count += 1;
        ratingMap.set(r.reviewed_user_id, entry);
      });

      const mapped: Profile[] = data
        .filter(row => row.display_name && row.display_name.trim().length > 1)
        .sort((a, b) => {
          const aEarly = (a as any).is_early_adopter ? 1 : 0;
          const bEarly = (b as any).is_early_adopter ? 1 : 0;
          if (bEarly !== aEarly) return bEarly - aEarly;
          if ((b.is_verified ? 1 : 0) !== (a.is_verified ? 1 : 0)) return (b.is_verified ? 1 : 0) - (a.is_verified ? 1 : 0);
          return (b.score ?? 0) - (a.score ?? 0);
        })
        .map((row) => {
          const stats = ratingMap.get(row.user_id);
          return {
          id: row.id,
          userId: row.user_id,
          name: row.display_name || 'Sin nombre',
          role: (row as { role?: string }).role as Profile['role'] ?? role as Profile['role'],
          specialty: row.specialty || '',
          rating: stats ? Math.round((stats.sum / stats.count) * 10) / 10 : 0,
          reviews: stats?.count ?? 0,
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
          isPremium: row.subscription_tier !== 'free',
          languages: row.languages ?? [],
          tiktok: row.tiktok || '',
          category: (row.category as Profile['category']) ?? 'professional',
          isVerified: row.is_verified ?? false,
          isEarlyAdopter: (row as any).is_early_adopter ?? false,
        };});
      setRealProfiles(mapped);
      setLoadingProfiles(false);
    });
  }, [role, roles, filterCity]);

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

  const gridClass = wideCards
    ? 'grid grid-cols-1 sm:grid-cols-2 gap-5'
    : 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3';

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 sm:mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-0.5 sm:mb-1 overflow-visible sm:pb-2" style={{ lineHeight: 1.2 }}>
            Directorio <span className="text-gradient">{title}</span>
          </h2>
          <p className="hidden sm:block text-sm text-muted-foreground">{subtitle}</p>
        </div>
        {onNavigate && (
          <button
            onClick={() => onNavigate('flashbooking')}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all hover:scale-105 self-start sm:self-auto"
            style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', color: '#D4AF37' }}>
            <Zap size={14} /> Flash Booking
          </button>
        )}
      </div>

      {/* Salas activas strip — desktop only (mobile keeps the fold clean; Flash is in bottom nav) */}
      <div className="hidden sm:flex items-center gap-2 mb-4 px-3 py-2 rounded-lg text-xs"
        style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.1)' }}>
        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse" style={{ background: '#D4AF37' }} />
        <span style={{ color: '#222' }}>
          <span style={{ color: '#D4AF37', fontWeight: 700 }}>4 salas & clubs</span>
          {' '}registrados en XPEAK están buscando profesionales como tú
        </span>
        {onNavigate && (
          <button onClick={() => onNavigate('flash')}
            className="ml-auto flex-shrink-0 text-[0.7rem] font-bold px-2 py-1 rounded-md transition-all hover:opacity-80"
            style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>
            Ver ofertas →
          </button>
        )}
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-2 mb-4 sm:mb-5 flex-nowrap sm:flex-wrap overflow-x-auto no-scrollbar -mx-1 px-1 sm:mx-0 sm:px-0">
        <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0">
          <Globe size={12} style={{ color: '#D4AF37' }} />
          <span className="text-xs font-bold" style={{ color: '#D4AF37' }}>ES</span>
        </div>
        <NightlifeSelect
          value={filterCity}
          onChange={setFilterCity}
          options={CITY_OPTIONS}
          placeholder="Todas las ciudades"
          active={filterCity !== 'Todas las ciudades'}
          className="flex-shrink-0 min-w-[150px] sm:flex-1 sm:min-w-[130px] max-w-[220px]"
        />
        <button
          onClick={() => setFilterFlash(v => !v)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex-shrink-0"
          style={{
            background: filterFlash ? 'rgba(34,197,94,0.12)' : 'rgba(0,0,0,0.03)',
            border: `1px solid ${filterFlash ? 'rgba(34,197,94,0.35)' : 'rgba(0,0,0,0.08)'}`,
            color: filterFlash ? '#22c55e' : '#555',
          }}>
          <Zap size={11} /> Disponible
        </button>
        <button
          onClick={() => setFilterVerified(v => !v)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex-shrink-0"
          style={{
            background: filterVerified ? 'rgba(212,175,55,0.12)' : 'rgba(0,0,0,0.03)',
            border: `1px solid ${filterVerified ? 'rgba(212,175,55,0.35)' : 'rgba(0,0,0,0.08)'}`,
            color: filterVerified ? '#D4AF37' : '#555',
          }}>
          <Crown size={11} /> Verificado
        </button>
        {(filterCity !== 'Todas las ciudades' || filterFlash || filterVerified) && (
          <button onClick={() => { setFilterCity('Todas las ciudades'); setFilterFlash(false); setFilterVerified(false); }}
            className="text-xs font-bold px-2 py-1 rounded transition-all hover:opacity-70 flex-shrink-0"
            style={{ background: 'rgba(0,0,0,0.04)', color: '#333', border: '1px solid rgba(0,0,0,0.08)' }}>
            Limpiar ✕
          </button>
        )}
        <span className="hidden sm:inline text-xs ml-auto flex-shrink-0" style={{ color: '#333' }}>
          {filteredProfiles.length} resultado{filteredProfiles.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Contador resultados — móvil, fila propia compacta */}
      <p className="sm:hidden text-xs mb-3" style={{ color: '#717171' }}>
        {filteredProfiles.length} profesional{filteredProfiles.length !== 1 ? 'es' : ''}
      </p>

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
            <p className="text-sm font-bold mb-1" style={{ color: '#333' }}>
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

      <div className={gridClass}>
        {filteredProfiles.map(p => (
          <ProfileCard key={p.id} profile={p} showPortfolio={wideCards} onMessage={onMessage}
            onNavigateSubscription={() => onNavigate?.('subscription')} onViewProfile={onViewProfile} />
        ))}
      </div>

      <OffersWidget title={`Ofertas para ${title}`} role={role} />
      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} item={checkoutItem} />
    </div>
  );
};

export default DirectoryView;
