import { useState, useEffect } from 'react';
import { Crown } from 'lucide-react';
import { Profile } from '@/data/profiles';
import ProfileCard from '@/components/dashboard/ProfileCard';
import { supabase } from '@/integrations/supabase/client';

const TopWeekendView = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('profiles')
      .select('id, user_id, display_name, photo_url, zone, hourly_rate, specialty, is_live, genres, bio, languages, tiktok, category, is_verified, is_flash_active, stream_url, role')
      .neq('role', 'empresario')
      .not('display_name', 'is', null)
      .not('photo_url', 'is', null)
      .limit(200)
      .then(({ data }) => {
        if (!data) { setLoading(false); return; }
        const mapped: Profile[] = data.map(row => ({
          id: row.id,
          userId: row.user_id,
          name: row.display_name || 'Sin nombre',
          role: (row.role as Profile['role']) ?? 'dj',
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
          subscriptionTier: 'free' as Profile['subscriptionTier'],
          isFlashActive: row.is_flash_active ?? false,
          profileViews: 0,
          contactClicks: 0,
          isLive: row.is_live ?? false,
          isPremium: false,
          languages: row.languages ?? [],
          tiktok: row.tiktok || '',
          streamUrl: row.stream_url || undefined,
          category: (row.category as Profile['category']) ?? 'professional',
          isVerified: row.is_verified ?? false,
        }));

        // Sort: verified first, then profiles with bio, then alphabetical
        const sorted = mapped.sort((a, b) => {
          if (a.isVerified !== b.isVerified) return a.isVerified ? -1 : 1;
          if (!!a.description !== !!b.description) return a.description ? -1 : 1;
          return a.name.localeCompare(b.name);
        });
        setProfiles(sorted);
        setLoading(false);
      });
  }, []);

  const topProfiles = profiles.slice(0, 8);
  const restProfiles = profiles.slice(8);

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="mb-5">
        <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
          <Crown size={24} style={{ color: '#D4AF37' }} />
          TOP <span className="text-gradient">Weekend</span>
        </h2>
        <p className="text-sm text-muted-foreground">Los perfiles más destacados del directorio esta semana.</p>
      </div>

      <div className="p-3 mb-5 rounded-lg flex items-center gap-2" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}>
        <Crown size={14} style={{ color: '#D4AF37' }} />
        <span className="text-xs font-medium" style={{ color: '#D4AF37' }}>
          Profesionales verificados y con perfil completo — los más listos para contratar
        </span>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <p className="text-xs text-muted-foreground animate-pulse">Cargando perfiles…</p>
        </div>
      )}

      {!loading && profiles.length === 0 && (
        <div className="glass-panel p-10 flex flex-col items-center text-center gap-3">
          <Crown size={28} style={{ color: 'rgba(212,175,55,0.2)' }} />
          <div>
            <p className="text-sm font-bold mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Aún no hay perfiles TOP
            </p>
            <p className="text-xs text-muted-foreground max-w-[260px] mx-auto leading-relaxed">
              Cuando los profesionales se registren y completen sus perfiles aparecerán aquí.
            </p>
          </div>
        </div>
      )}

      {!loading && topProfiles.length > 0 && (
        <>
          <h3 className="text-sm font-bold mb-3" style={{ color: '#D4AF37' }}>Más Destacados</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
            {topProfiles.map(p => (
              <ProfileCard key={p.userId ?? p.id} profile={p} />
            ))}
          </div>
        </>
      )}

      {!loading && restProfiles.length > 0 && (
        <>
          <h3 className="text-sm font-bold mb-3 text-muted-foreground">Otros Perfiles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {restProfiles.map(p => (
              <ProfileCard key={p.userId ?? p.id} profile={p} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TopWeekendView;
