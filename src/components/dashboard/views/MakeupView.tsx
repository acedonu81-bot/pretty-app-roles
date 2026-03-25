import { profiles } from '@/data/profiles';
import ProfileCard from '@/components/dashboard/ProfileCard';

const makeupProfiles = profiles.filter(p => p.role === 'makeup');

const MakeupView = () => {
  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="mb-6">
        <h2 className="text-3xl font-extrabold mb-1">
          Estilismo <span className="text-gradient">& Makeup</span>
        </h2>
        <p className="text-muted-foreground">Maquillaje nocturno y peluquería de autor en Madrid.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {makeupProfiles.map(p => (
          <ProfileCard key={p.id} profile={p} />
        ))}
      </div>
    </div>
  );
};

export default MakeupView;
