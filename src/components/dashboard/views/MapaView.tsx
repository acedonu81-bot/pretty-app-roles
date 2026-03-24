import { useState } from 'react';
import { MapPin, Star, Users, Music, Shield, CheckCircle } from 'lucide-react';

const cities = [
  { id: 'madrid', name: 'Madrid', x: 48, y: 52, venues: 24, color: 'hsl(var(--primary))' },
  { id: 'barcelona', name: 'Barcelona', x: 72, y: 35, venues: 19, color: 'hsl(var(--secondary))' },
  { id: 'valencia', name: 'Valencia', x: 65, y: 55, venues: 12, color: 'hsl(var(--accent))' },
  { id: 'ibiza', name: 'Ibiza', x: 73, y: 60, venues: 31, color: '#f472b6' },
  { id: 'sevilla', name: 'Sevilla', x: 35, y: 72, venues: 9, color: '#ffbc00' },
  { id: 'malaga', name: 'Málaga / Marbella', x: 42, y: 80, venues: 15, color: '#ff5f56' },
  { id: 'bilbao', name: 'Bilbao', x: 45, y: 18, venues: 7, color: 'hsl(var(--secondary))' },
  { id: 'zaragoza', name: 'Zaragoza', x: 58, y: 34, venues: 5, color: 'hsl(var(--primary))' },
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
    { name: 'Input Club', type: 'Techno Underground', capacity: 600, rating: 4.9, verified: true },
  ],
  valencia: [
    { name: 'Noxe Club', type: 'Techno / Minimal', capacity: 800, rating: 4.7, verified: true },
    { name: 'L\'Umbracle', type: 'Open Air', capacity: 2000, rating: 4.5, verified: false },
  ],
  ibiza: [
    { name: 'Ushuaïa', type: 'EDM / House', capacity: 5000, rating: 5.0, verified: true },
    { name: 'Amnesia', type: 'Techno / Trance', capacity: 5000, rating: 4.9, verified: true },
    { name: 'DC-10', type: 'Underground Techno', capacity: 1500, rating: 4.8, verified: true },
  ],
  sevilla: [
    { name: 'Antique Theatro', type: 'House / Latin', capacity: 1000, rating: 4.5, verified: true },
    { name: 'Custom Sevilla', type: 'Urban / Reggaeton', capacity: 700, rating: 4.3, verified: false },
  ],
  malaga: [
    { name: 'Opium Marbella', type: 'House / Comercial', capacity: 2000, rating: 4.7, verified: true },
    { name: 'Dreamers Marbella', type: 'Beach Club', capacity: 1200, rating: 4.6, verified: true },
  ],
  bilbao: [
    { name: 'Fever Club', type: 'Techno / Bass', capacity: 600, rating: 4.4, verified: true },
  ],
  zaragoza: [
    { name: 'La Casa del Loco', type: 'Indie / Electrónica', capacity: 400, rating: 4.5, verified: false },
  ],
};

const MapaView = () => {
  const [selectedCity, setSelectedCity] = useState<string | null>('madrid');

  const selected = cities.find(c => c.id === selectedCity);
  const venues = selectedCity ? (venueDetails[selectedCity] || []) : [];

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="mb-6">
        <h2 className="text-3xl font-extrabold mb-1">
          Mapa de <span className="text-gradient">Salas</span>
        </h2>
        <p className="text-muted-foreground">Salas verificadas en toda España.</p>
      </div>

      <div className="grid grid-cols-[1fr_360px] gap-5" style={{ height: '70vh' }}>
        {/* Map */}
        <div className="glass-panel p-6 relative overflow-hidden">
          {/* Simplified Spain outline */}
          <div className="absolute inset-6 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--nightlife-border)' }}>
            {/* Spain shape hint */}
            <svg viewBox="0 0 100 100" className="w-full h-full opacity-10" preserveAspectRatio="xMidYMid meet">
              <path d="M25,15 L55,10 L75,15 L82,25 L78,35 L85,45 L80,55 L75,60 L70,75 L55,82 L45,85 L30,78 L25,70 L20,60 L15,50 L18,35 L22,25 Z"
                fill="none" stroke="white" strokeWidth="0.5" />
            </svg>

            {/* City pins */}
            {cities.map(city => {
              const isSelected = selectedCity === city.id;
              return (
                <button
                  key={city.id}
                  onClick={() => setSelectedCity(city.id)}
                  className="absolute flex flex-col items-center transition-all duration-300 group"
                  style={{
                    left: `${city.x}%`,
                    top: `${city.y}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: isSelected ? 10 : 1,
                  }}
                >
                  {/* Ping animation */}
                  {isSelected && (
                    <span className="absolute w-8 h-8 rounded-full animate-ping opacity-30" style={{ background: city.color }} />
                  )}
                  {/* Pin */}
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 relative"
                    style={{
                      background: city.color,
                      boxShadow: isSelected ? `0 0 20px ${city.color}` : `0 0 8px ${city.color}80`,
                      transform: isSelected ? 'scale(1.4)' : 'scale(1)',
                    }}
                  >
                    <MapPin size={10} style={{ color: 'white' }} />
                  </div>
                  {/* Label */}
                  <div className={`mt-1.5 px-2 py-0.5 rounded-md text-[0.6rem] font-extrabold whitespace-nowrap transition-all ${isSelected ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}
                    style={{ background: 'rgba(0,0,0,0.6)', color: isSelected ? city.color : 'white' }}>
                    {city.name} · {city.venues}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="absolute bottom-8 left-8 flex items-center gap-4">
            {[{ label: 'Verificada', color: 'hsl(var(--accent))' }, { label: 'Pendiente', color: 'hsl(var(--muted-foreground))' }].map(l => (
              <div key={l.label} className="flex items-center gap-1.5 text-[0.65rem] text-muted-foreground">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
                {l.label}
              </div>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        <div className="flex flex-col gap-4">
          {/* City header */}
          {selected && (
            <div className="glass-panel p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${selected.color}22` }}>
                  <MapPin size={20} style={{ color: selected.color }} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold">{selected.name}</h3>
                  <p className="text-xs text-muted-foreground">{selected.venues} salas registradas</p>
                </div>
              </div>
            </div>
          )}

          {/* Venues list */}
          <div className="flex-1 overflow-y-auto flex flex-col gap-3">
            {venues.map((v, i) => (
              <div key={i} className="glass-panel-subtle p-4 transition-all hover:scale-[1.01] duration-200">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-extrabold">{v.name}</h4>
                      {v.verified && <CheckCircle size={12} style={{ color: 'hsl(var(--accent))' }} />}
                    </div>
                    <p className="text-xs text-muted-foreground">{v.type}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <Star size={11} style={{ color: '#ffbc00' }} />
                    <span className="font-bold">{v.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Users size={11} /> {v.capacity.toLocaleString()}</span>
                  <span className="flex items-center gap-1"><Music size={11} /> {v.type.split('/')[0].trim()}</span>
                  {v.verified && <span className="flex items-center gap-1" style={{ color: 'hsl(var(--accent))' }}><Shield size={11} /> Verificada</span>}
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
