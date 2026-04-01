import { Crown } from 'lucide-react';
import { profiles, getEliteRotation } from '@/data/profiles';
import ProfileCard from '@/components/dashboard/ProfileCard';

// Show ALL roles sorted by views (most requested)
const allSorted = getEliteRotation(profiles).sort((a, b) => b.profileViews - a.profileViews);
const topProfiles = allSorted.slice(0, 8);
const restProfiles = allSorted.slice(8);

const TopWeekendView = () => {
  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="mb-5">
        <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
          <Crown size={24} style={{ color: '#D4AF37' }} />
          TOP <span className="text-gradient">Weekend</span>
        </h2>
        <p className="text-sm text-muted-foreground">Los más solicitados de todos los roles esta semana en Europa.</p>
      </div>

      <div className="p-3 mb-5 rounded-lg flex items-center gap-2" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}>
        <Crown size={14} style={{ color: '#D4AF37' }} />
        <span className="text-xs font-medium" style={{ color: '#D4AF37' }}>
          Los perfiles TOP Weekend aparecen primero en todas las secciones del directorio
        </span>
      </div>

      <h3 className="text-sm font-bold mb-3" style={{ color: '#D4AF37' }}>🏆 Más Solicitados</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        {topProfiles.map(p => (
          <ProfileCard key={p.id} profile={p} />
        ))}
      </div>

      {restProfiles.length > 0 && (
        <>
          <h3 className="text-sm font-bold mb-3 text-muted-foreground">Otros Perfiles Destacados</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {restProfiles.map(p => (
              <ProfileCard key={p.id} profile={p} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TopWeekendView;
