import { useState } from 'react';
import { Smile, Star, MapPin, Clock, Sparkles } from 'lucide-react';
import CheckoutModal from '@/components/dashboard/CheckoutModal';

const artists = [
  {
    id: 1,
    name: 'Sofía Delgado',
    specialty: 'Maquillaje Artístico & FX',
    rating: 5.0,
    reviews: 203,
    location: 'Madrid, Toledo',
    experience: '9 años',
    price: 350,
    avatar: 'SD',
    gradient: 'linear-gradient(135deg, #f472b6, #ec4899)',
    badges: ['FX Pro', 'Bodypaint', 'Airbrush'],
    description: 'Maquillaje artístico de alta gama para DJs, performers y eventos temáticos. Especialista en efectos especiales y bodypaint UV.',
  },
  {
    id: 2,
    name: 'Daniela Moreno',
    specialty: 'Peluquería VIP & Extensiones',
    rating: 4.8,
    reviews: 145,
    location: 'Barcelona',
    experience: '11 años',
    price: 280,
    avatar: 'DM',
    gradient: 'linear-gradient(135deg, #ffbc00, #f59e0b)',
    badges: ['Extensiones Premium', 'Color Expert', 'Peinado Evento'],
    description: 'Estilismo capilar completo para artistas y staff VIP. Extensiones, color fantasía y peinados de pasarela para la noche.',
  },
  {
    id: 3,
    name: 'Valentina Ríos',
    specialty: 'Glam & Estilismo Integral',
    rating: 4.9,
    reviews: 176,
    location: 'Ibiza, Marbella',
    experience: '8 años',
    price: 420,
    avatar: 'VR',
    gradient: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))',
    badges: ['Styling Completo', 'Asesoría Imagen', 'Brands Luxury'],
    description: 'Servicio integral de imagen: maquillaje, peinado y asesoría de vestuario para artistas y promotores en eventos de lujo.',
  },
];

const MakeupView = () => {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutItem, setCheckoutItem] = useState<{ name: string; price: number; description: string } | null>(null);

  const handleBook = (a: typeof artists[0]) => {
    setCheckoutItem({ name: `${a.name} — ${a.specialty}`, price: a.price, description: a.description });
    setCheckoutOpen(true);
  };

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="mb-6">
        <h2 className="text-3xl font-extrabold mb-1">
          Estilismo <span className="text-gradient">& Makeup VIP</span>
        </h2>
        <p className="text-muted-foreground">Servicio de peluquería y maquillaje profesional para eventos.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {artists.map(a => (
          <div key={a.id} className="glass-panel p-6 flex flex-col transition-all hover:scale-[1.02] duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black" style={{ background: a.gradient, color: 'white' }}>
                {a.avatar}
              </div>
              <div>
                <h3 className="text-sm font-extrabold">{a.name}</h3>
                <p className="text-xs text-muted-foreground">{a.specialty}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Star size={12} style={{ color: '#ffbc00' }} /> <span className="font-bold text-foreground">{a.rating}</span> ({a.reviews})</span>
              <span className="flex items-center gap-1"><MapPin size={12} /> {a.location}</span>
            </div>
            <div className="flex items-center gap-1 mb-4 text-xs text-muted-foreground">
              <Clock size={12} /> {a.experience} de experiencia
            </div>

            <p className="text-xs text-muted-foreground mb-4 flex-1">{a.description}</p>

            <div className="flex flex-wrap gap-1.5 mb-5">
              {a.badges.map(b => (
                <span key={b} className="text-[0.65rem] font-bold px-2 py-1 rounded-full" style={{ background: 'rgba(244,114,182,0.1)', color: '#f472b6', border: '1px solid rgba(244,114,182,0.2)' }}>
                  {b}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-lg font-extrabold" style={{ color: 'hsl(var(--accent))' }}>€{a.price}<span className="text-xs text-muted-foreground font-normal">/sesión</span></span>
              <button onClick={() => handleBook(a)} className="btn-nightlife-primary !py-2 !px-5 text-xs">
                Reservar
              </button>
            </div>
          </div>
        ))}
      </div>

      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} item={checkoutItem} />
    </div>
  );
};

export default MakeupView;
