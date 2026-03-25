import { useState, useEffect } from 'react';
import { Crown } from 'lucide-react';
import { profiles, getEliteRotation } from '@/data/profiles';
import ProfileCard from '@/components/dashboard/ProfileCard';
import CheckoutModal from '@/components/dashboard/CheckoutModal';

const djProfiles = profiles.filter(p => p.role === 'dj');

const DJView = () => {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutItem, setCheckoutItem] = useState<{ name: string; price: number; description: string } | null>(null);
  const [sortedProfiles, setSortedProfiles] = useState(() => getEliteRotation(djProfiles));

  // Re-sort every 60 minutes (Elite rotation)
  useEffect(() => {
    const iv = setInterval(() => {
      setSortedProfiles(getEliteRotation(djProfiles));
    }, 60 * 60 * 1000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="mb-5">
        <h2 className="text-2xl font-bold mb-1">
          Directorio <span className="text-gradient">DJs</span>
        </h2>
        <p className="text-sm text-muted-foreground">Encuentra tu DJ ideal para cualquier tipo de evento nocturno en Madrid.</p>
      </div>

      {/* Elite banner */}
      {sortedProfiles.some(p => p.subscriptionTier === 'elite') && (
        <div className="p-3 mb-5 rounded-lg flex items-center gap-2" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}>
          <Crown size={16} style={{ color: '#D4AF37' }} />
          <span className="text-xs font-medium" style={{ color: '#D4AF37' }}>
            Perfiles Elite — Posicionamiento prioritario con rotación horaria
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sortedProfiles.map(p => (
          <ProfileCard key={p.id} profile={p} />
        ))}
      </div>

      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} item={checkoutItem} />
    </div>
  );
};

export default DJView;
