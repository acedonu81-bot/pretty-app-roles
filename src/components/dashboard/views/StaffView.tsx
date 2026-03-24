import { useState } from 'react';
import { UserCheck, Star, MapPin, Clock, Users } from 'lucide-react';
import CheckoutModal from '@/components/dashboard/CheckoutModal';

const staff = [
  {
    id: 1,
    name: 'Lucía Fernández',
    specialty: 'Jefa de Sala & RRPP',
    rating: 4.9,
    reviews: 154,
    location: 'Madrid',
    experience: '10 años',
    price: 280,
    avatar: 'LF',
    gradient: 'linear-gradient(135deg, #f472b6, hsl(var(--primary)))',
    badges: ['Gestión VIP', 'RRPP Premium', 'Idiomas: EN/FR'],
    description: 'Coordinación integral de sala con experiencia en clubs de alto nivel. Gestión de reservados VIP y relaciones públicas.',
  },
  {
    id: 2,
    name: 'Javier Ruiz',
    specialty: 'Barman & Coctelería Molecular',
    rating: 4.7,
    reviews: 89,
    location: 'Barcelona, Ibiza',
    experience: '7 años',
    price: 220,
    avatar: 'JR',
    gradient: 'linear-gradient(135deg, hsl(var(--secondary)), hsl(var(--accent)))',
    badges: ['Flair Bartending', 'Coctelería VIP', 'Certificado WSET'],
    description: 'Especialista en coctelería de espectáculo y molecular. Shows de flair bartending para eventos exclusivos.',
  },
  {
    id: 3,
    name: 'Andrea Molina',
    specialty: 'Hostess & Coordinación de Eventos',
    rating: 5.0,
    reviews: 112,
    location: 'Marbella, Málaga',
    experience: '6 años',
    price: 200,
    avatar: 'AM',
    gradient: 'linear-gradient(135deg, #ffbc00, #ff5f56)',
    badges: ['Protocolo VIP', 'Multilingüe', 'Gestión Listas'],
    description: 'Coordinación de entrada, listas VIP y gestión de invitados para las mejores salas de la Costa del Sol.',
  },
];

const StaffView = () => {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutItem, setCheckoutItem] = useState<{ name: string; price: number; description: string } | null>(null);

  const handleBook = (s: typeof staff[0]) => {
    setCheckoutItem({ name: `${s.name} — ${s.specialty}`, price: s.price, description: s.description });
    setCheckoutOpen(true);
  };

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="mb-6">
        <h2 className="text-3xl font-extrabold mb-1">
          Personal de <span className="text-gradient">Sala</span>
        </h2>
        <p className="text-muted-foreground">Asigna personal y coordina turnos para eventos.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {staff.map(s => (
          <div key={s.id} className="glass-panel p-6 flex flex-col transition-all hover:scale-[1.02] duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black" style={{ background: s.gradient, color: 'white' }}>
                {s.avatar}
              </div>
              <div>
                <h3 className="text-sm font-extrabold">{s.name}</h3>
                <p className="text-xs text-muted-foreground">{s.specialty}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Star size={12} style={{ color: '#ffbc00' }} /> <span className="font-bold text-foreground">{s.rating}</span> ({s.reviews})</span>
              <span className="flex items-center gap-1"><MapPin size={12} /> {s.location}</span>
            </div>
            <div className="flex items-center gap-1 mb-4 text-xs text-muted-foreground">
              <Clock size={12} /> {s.experience} de experiencia
            </div>

            <p className="text-xs text-muted-foreground mb-4 flex-1">{s.description}</p>

            <div className="flex flex-wrap gap-1.5 mb-5">
              {s.badges.map(b => (
                <span key={b} className="text-[0.65rem] font-bold px-2 py-1 rounded-full" style={{ background: 'hsla(var(--secondary) / 0.1)', color: 'hsl(var(--secondary))', border: '1px solid hsla(var(--secondary) / 0.2)' }}>
                  {b}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-lg font-extrabold" style={{ color: 'hsl(var(--accent))' }}>€{s.price}<span className="text-xs text-muted-foreground font-normal">/noche</span></span>
              <button onClick={() => handleBook(s)} className="btn-nightlife-primary !py-2 !px-5 text-xs">
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

export default StaffView;
