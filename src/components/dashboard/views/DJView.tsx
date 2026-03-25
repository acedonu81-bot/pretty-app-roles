import { useState } from 'react';
import { Flame, Star } from 'lucide-react';
import { profiles } from '@/data/profiles';
import ProfileCard from '@/components/dashboard/ProfileCard';
import CheckoutModal from '@/components/dashboard/CheckoutModal';

const djProfiles = profiles.filter(p => p.role === 'dj');
const topFirst = [...djProfiles].sort((a, b) => (b.topFinde ? 1 : 0) - (a.topFinde ? 1 : 0));

const DJView = () => {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutItem, setCheckoutItem] = useState<{ name: string; price: number; description: string } | null>(null);

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="mb-6">
        <h2 className="text-3xl font-extrabold mb-1">
          Directorio <span className="text-gradient">DJs</span>
        </h2>
        <p className="text-muted-foreground">Encuentra tu DJ ideal para cualquier tipo de evento nocturno en Madrid.</p>
      </div>

      {/* TOP FINDE highlight */}
      {topFirst.some(p => p.topFinde) && (
        <div className="glass-panel p-4 mb-6 flex items-center gap-3" style={{ border: '1px solid rgba(255,188,0,0.3)', background: 'rgba(255,188,0,0.05)' }}>
          <Flame size={20} style={{ color: '#ffbc00' }} />
          <span className="text-sm font-bold" style={{ color: '#ffbc00' }}>
            <Star size={14} className="inline mr-1" style={{ color: '#ffbc00' }} />
            Perfiles TOP FINDE — Destacados y recomendados para este fin de semana
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {topFirst.map(p => (
          <ProfileCard key={p.id} profile={p} />
        ))}
      </div>

      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} item={checkoutItem} />
    </div>
  );
};

export default DJView;
