import { profiles } from '@/data/profiles';
import ProfileCard from '@/components/dashboard/ProfileCard';

const staffProfiles = profiles.filter(p => p.role === 'staff');

const StaffView = () => {
  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="mb-6">
        <h2 className="text-3xl font-extrabold mb-1">
          Personal de <span className="text-gradient">Sala</span>
        </h2>
        <p className="text-muted-foreground">Azafatas, camareros VIP y RRPP disponibles en Madrid.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {staffProfiles.map(p => (
          <ProfileCard key={p.id} profile={p} />
        ))}
      </div>
    </div>
  );
};

export default StaffView;
