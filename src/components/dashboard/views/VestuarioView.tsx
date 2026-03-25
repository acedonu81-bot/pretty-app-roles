import { profiles, getEliteRotation } from '@/data/profiles';
import ProfileCard from '@/components/dashboard/ProfileCard';
import OffersWidget from '@/components/dashboard/OffersWidget';

const vestuarioProfiles = getEliteRotation(profiles.filter(p => p.role === 'vestuario'));

const VestuarioView = () => {
  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="mb-5">
        <h2 className="text-2xl font-bold mb-1">
          Vestuario <span className="text-gradient">& Moda</span>
        </h2>
        <p className="text-sm text-muted-foreground">Estilismo, diseño custom y asesoría de imagen nocturna en Madrid.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {vestuarioProfiles.map(p => (
          <ProfileCard key={p.id} profile={p} />
        ))}
      </div>
      <OffersWidget title="Ofertas de Vestuario" />
    </div>
  );
};

export default VestuarioView;
