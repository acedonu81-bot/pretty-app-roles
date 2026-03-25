import { Flame, Star } from 'lucide-react';
import { profiles } from '@/data/profiles';
import ProfileCard from '@/components/dashboard/ProfileCard';

const topProfiles = profiles.filter(p => p.topFinde);
const otherProfiles = profiles.filter(p => !p.topFinde).slice(0, 4);

const TopFindeView = () => {
  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="mb-6">
        <h2 className="text-3xl font-extrabold mb-1 flex items-center gap-3">
          <Flame size={28} style={{ color: '#ffbc00' }} />
          TOP <span className="text-gradient">FINDE</span>
          <Star size={22} style={{ color: '#ffbc00' }} />
        </h2>
        <p className="text-muted-foreground">Perfiles destacados y recomendados para este fin de semana en Madrid.</p>
      </div>

      <div className="glass-panel p-4 mb-6 flex items-center gap-3" style={{ border: '1px solid rgba(255,188,0,0.3)', background: 'rgba(255,188,0,0.05)' }}>
        <Flame size={20} style={{ color: '#ffbc00' }} />
        <span className="text-sm font-bold" style={{ color: '#ffbc00' }}>
          Los perfiles con sello TOP FINDE aparecen primero en todas las secciones del directorio
        </span>
      </div>

      <h3 className="text-lg font-extrabold mb-4" style={{ color: '#ffbc00' }}>⭐ Destacados</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-10">
        {topProfiles.map(p => (
          <ProfileCard key={p.id} profile={p} />
        ))}
      </div>

      <h3 className="text-lg font-extrabold mb-4 flex items-center gap-2">
        <Flame size={18} style={{ color: 'hsl(var(--primary))' }} /> Perfiles Activos
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {otherProfiles.map(p => (
          <ProfileCard key={p.id} profile={p} />
        ))}
      </div>
    </div>
  );
};

export default TopFindeView;
