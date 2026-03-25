import { profiles, getEliteRotation } from '@/data/profiles';
import ProfileCard from '@/components/dashboard/ProfileCard';

const staffProfiles = getEliteRotation(profiles.filter(p => p.role === 'staff'));

const StaffView = () => {
  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="mb-5">
        <h2 className="text-2xl font-bold mb-1">
          Personal de <span className="text-gradient">Sala</span>
        </h2>
        <p className="text-sm text-muted-foreground">Azafatas, camareros VIP y RRPP disponibles en Madrid.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {staffProfiles.map(p => (
          <ProfileCard key={p.id} profile={p} />
        ))}
      </div>
    </div>
  );
};

export default StaffView;
