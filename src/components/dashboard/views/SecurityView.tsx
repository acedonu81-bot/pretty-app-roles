import { useState } from 'react';
import { Shield, Star, MapPin, Clock, Award, Zap } from 'lucide-react';
import CheckoutModal from '@/components/dashboard/CheckoutModal';

const guards = [
  {
    id: 1,
    name: 'Carlos "Iron" Mendoza',
    specialty: 'Seguridad VIP & Escoltas',
    rating: 4.9,
    reviews: 127,
    location: 'Madrid, Barcelona',
    experience: '12 años',
    price: 450,
    avatar: 'CM',
    gradient: 'linear-gradient(135deg, hsl(var(--primary)), #6b21ff)',
    badges: ['Ex-Militar', 'Licencia C', 'Primeros Auxilios'],
    description: 'Especialista en protección VIP para eventos de alta gama. Ex-militar con formación avanzada en seguridad.',
  },
  {
    id: 2,
    name: 'Elena Vásquez',
    specialty: 'Control de Acceso & Aforo',
    rating: 4.8,
    reviews: 93,
    location: 'Valencia, Alicante',
    experience: '8 años',
    price: 320,
    avatar: 'EV',
    gradient: 'linear-gradient(135deg, hsl(var(--accent)), hsl(var(--secondary)))',
    badges: ['Certificada AENOR', 'Control Aforo', 'Gestión Crisis'],
    description: 'Experta en control de accesos para macro-eventos y festivales. Gestión eficiente de aforo y emergencias.',
  },
  {
    id: 3,
    name: 'Marcos "Tank" Herrera',
    specialty: 'Seguridad de Artistas',
    rating: 5.0,
    reviews: 68,
    location: 'Ibiza, Mallorca',
    experience: '15 años',
    price: 600,
    avatar: 'MH',
    gradient: 'linear-gradient(135deg, #ffbc00, #ff5f56)',
    badges: ['Protección Artistas', 'Anti-Agresión', 'Conducción Evasiva'],
    description: 'Protección personal para DJs y artistas internacionales. Ha trabajado con los headliners de Ushuaïa y Pacha.',
  },
];

const SecurityView = () => {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutItem, setCheckoutItem] = useState<{ name: string; price: number; description: string } | null>(null);

  const handleBook = (guard: typeof guards[0]) => {
    setCheckoutItem({ name: `${guard.name} — ${guard.specialty}`, price: guard.price, description: guard.description });
    setCheckoutOpen(true);
  };

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="mb-6">
        <h2 className="text-3xl font-extrabold mb-1">
          Seguridad <span className="text-gradient">Privada</span>
        </h2>
        <p className="text-muted-foreground">Gestiona escoltas y seguridad profesional para eventos.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {guards.map(g => (
          <div key={g.id} className="glass-panel p-6 flex flex-col transition-all hover:scale-[1.02] duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black" style={{ background: g.gradient, color: 'white' }}>
                {g.avatar}
              </div>
              <div>
                <h3 className="text-sm font-extrabold">{g.name}</h3>
                <p className="text-xs text-muted-foreground">{g.specialty}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Star size={12} style={{ color: '#ffbc00' }} /> <span className="font-bold text-foreground">{g.rating}</span> ({g.reviews})</span>
              <span className="flex items-center gap-1"><MapPin size={12} /> {g.location}</span>
            </div>
            <div className="flex items-center gap-1 mb-4 text-xs text-muted-foreground">
              <Clock size={12} /> {g.experience} de experiencia
            </div>

            <p className="text-xs text-muted-foreground mb-4 flex-1">{g.description}</p>

            <div className="flex flex-wrap gap-1.5 mb-5">
              {g.badges.map(b => (
                <span key={b} className="text-[0.65rem] font-bold px-2 py-1 rounded-full" style={{ background: 'hsla(var(--primary) / 0.1)', color: 'hsl(var(--primary))', border: '1px solid hsla(var(--primary) / 0.2)' }}>
                  {b}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-lg font-extrabold" style={{ color: 'hsl(var(--accent))' }}>€{g.price}<span className="text-xs text-muted-foreground font-normal">/evento</span></span>
              <button onClick={() => handleBook(g)} className="btn-nightlife-primary !py-2 !px-5 text-xs">
                Contratar
              </button>
            </div>
          </div>
        ))}
      </div>

      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} item={checkoutItem} />
    </div>
  );
};

export default SecurityView;
