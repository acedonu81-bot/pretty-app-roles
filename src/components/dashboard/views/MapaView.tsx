import { useState } from 'react';
import { MapPin, Star, Users, Music, CheckCircle } from 'lucide-react';

const cities = [
  { id: 'madrid', name: 'Madrid', x: 48, y: 52, venues: 24, color: '#D4AF37' },
  { id: 'barcelona', name: 'Barcelona', x: 72, y: 35, venues: 19, color: '#8E8EA0' },
  { id: 'valencia', name: 'Valencia', x: 65, y: 55, venues: 12, color: '#8E8EA0' },
  { id: 'ibiza', name: 'Ibiza', x: 73, y: 60, venues: 31, color: '#D4AF37' },
  { id: 'sevilla', name: 'Sevilla', x: 35, y: 72, venues: 9, color: '#8E8EA0' },
  { id: 'malaga', name: 'Málaga', x: 42, y: 80, venues: 15, color: '#8E8EA0' },
  { id: 'bilbao', name: 'Bilbao', x: 45, y: 18, venues: 7, color: '#8E8EA0' },
  { id: 'zaragoza', name: 'Zaragoza', x: 58, y: 34, venues: 5, color: '#8E8EA0' },
];

const venueDetails: Record<string, Array<{ name: string; type: string; capacity: number; rating: number; verified: boolean }>> = {
  madrid: [
    { name: 'Onyx Club', type: 'Techno / Industrial', capacity: 1200, rating: 4.9, verified: true },
    { name: 'Teatro Kapital', type: 'Multi-género', capacity: 3500, rating: 4.7, verified: true },
    { name: 'Fabrik', type: 'Techno / Hard Style', capacity: 4000, rating: 4.8, verified: true },
  ],
  barcelona: [
    { name: 'Razzmatazz', type: 'Multi-sala', capacity: 3000, rating: 4.8, verified: true },
    { name: 'Pacha Barcelona', type: 'House / Comercial', capacity: 1500, rating: 4.6, verified: true },
  ],
  ibiza: [
    { name: 'Ushuaïa', type: 'EDM / House', capacity: 5000, rating: 5.0, verified: true },
    { name: 'Amnesia', type: 'Techno / Trance', capacity: 5000, rating: 4.9, verified: true },
  ],
  valencia: [{ name: 'Noxe Club', type: 'Techno / Minimal', capacity: 800, rating: 4.7, verified: true }],
  sevilla: [{ name: 'Antique Theatro', type: 'House / Latin', capacity: 1000, rating: 4.5, verified: true }],
  malaga: [{ name: 'Opium Marbella', type: 'Beach Club', capacity: 2000, rating: 4.7, verified: true }],
  bilbao: [{ name: 'Fever Club', type: 'Techno / Bass', capacity: 600, rating: 4.4, verified: true }],
  zaragoza: [{ name: 'La Casa del Loco', type: 'Electrónica', capacity: 400, rating: 4.5, verified: false }],
};

const MapaView = () => {
  const [selectedCity, setSelectedCity] = useState<string | null>('madrid');
  const selected = cities.find(c => c.id === selectedCity);
  const venues = selectedCity ? (venueDetails[selectedCity] || []) : [];

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="mb-5">
        <h2 className="text-2xl font-bold mb-1">Mapa de <span className="text-gradient">Salas</span></h2>
        <p className="text-sm text-muted-foreground">Salas verificadas en España.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4" style={{ minHeight: '50vh' }}>
        <div className="glass-panel p-5 relative overflow-hidden">
          <div className="absolute inset-5 rounded-lg" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid var(--nightlife-border)' }}>
            <svg viewBox="0 0 100 100" className="w-full h-full opacity-8" preserveAspectRatio="xMidYMid meet">
              <path d="M25,15 L55,10 L75,15 L82,25 L78,35 L85,45 L80,55 L75,60 L70,75 L55,82 L45,85 L30,78 L25,70 L20,60 L15,50 L18,35 L22,25 Z"
                fill="none" stroke="white" strokeWidth="0.3" />
            </svg>
            {cities.map(city => {
              const isSelected = selectedCity === city.id;
              return (
                <button key={city.id} onClick={() => setSelectedCity(city.id)}
                  className="absolute flex flex-col items-center transition-all duration-300 group"
                  style={{ left: `${city.x}%`, top: `${city.y}%`, transform: 'translate(-50%, -50%)', zIndex: isSelected ? 10 : 1 }}>
                  {isSelected && <span className="absolute w-6 h-6 rounded-full animate-ping opacity-20" style={{ background: '#D4AF37' }} />}
                  <div className="w-4 h-4 rounded-full flex items-center justify-center transition-all"
                    style={{ background: isSelected ? '#D4AF37' : city.color, transform: isSelected ? 'scale(1.3)' : 'scale(1)', boxShadow: isSelected ? '0 0 12px rgba(212,175,55,0.5)' : 'none' }}>
                    <MapPin size={8} style={{ color: isSelected ? '#000' : 'white' }} />
                  </div>
                  <div className={`mt-1 px-1.5 py-0.5 rounded text-[0.5rem] font-bold whitespace-nowrap ${isSelected ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'}`}
                    style={{ background: 'rgba(0,0,0,0.7)', color: isSelected ? '#D4AF37' : 'white' }}>
                    {city.name} · {city.venues}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {selected && (
            <div className="glass-panel p-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.1)' }}>
                  <MapPin size={16} style={{ color: '#D4AF37' }} />
                </div>
                <div>
                  <h3 className="text-xs font-bold">{selected.name}</h3>
                  <p className="text-[0.55rem] text-muted-foreground">{selected.venues} salas</p>
                </div>
              </div>
            </div>
          )}
          <div className="flex-1 overflow-y-auto flex flex-col gap-2">
            {venues.map((v, i) => (
              <div key={i} className="glass-panel-subtle p-3 transition-all hover:border-gold/10">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold">{v.name}</h4>
                      {v.verified && <CheckCircle size={10} style={{ color: '#22c55e' }} />}
                    </div>
                    <p className="text-[0.55rem] text-muted-foreground">{v.type}</p>
                  </div>
                  <div className="flex items-center gap-0.5 text-[0.6rem]">
                    <Star size={9} style={{ color: '#D4AF37' }} />
                    <span className="font-semibold">{v.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[0.55rem] text-muted-foreground">
                  <span className="flex items-center gap-0.5"><Users size={9} /> {v.capacity.toLocaleString()}</span>
                  <span className="flex items-center gap-0.5"><Music size={9} /> {v.type.split('/')[0].trim()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapaView;
