import { useState } from 'react';
import { MapPin, Star, Users, Music, CheckCircle, Search, Filter } from 'lucide-react';

const cities = [
  // España
  { id: 'madrid', name: 'Madrid', venues: 2 },
  { id: 'barcelona', name: 'Barcelona', venues: 2 },
  { id: 'valencia', name: 'Valencia', venues: 2 },
  { id: 'ibiza', name: 'Ibiza', venues: 3 },
  { id: 'sevilla', name: 'Sevilla', venues: 2 },
  { id: 'malaga', name: 'Málaga', venues: 2 },
  { id: 'bilbao', name: 'Bilbao', venues: 2 },
  { id: 'zaragoza', name: 'Zaragoza', venues: 2 },
  // Portugal
  { id: 'lisboa', name: 'Lisboa', venues: 2 },
  { id: 'porto', name: 'Porto', venues: 2 },
];

const venueDetails: Record<string, Array<{ name: string; type: string; capacity: number; rating: number; verified: boolean; needs: string[] }>> = {
  madrid: [
    { name: 'Teatro Kapital', type: 'Multi-género', capacity: 3500, rating: 4.7, verified: true, needs: ['DJ Comercial', 'Camareros', 'RRPP'] },
    { name: 'Fabrik', type: 'Techno / Hard Style', capacity: 4000, rating: 4.8, verified: true, needs: ['DJ Techno', 'Staff técnico'] },
  ],
  barcelona: [
    { name: 'Razzmatazz', type: 'Multi-sala', capacity: 3000, rating: 4.8, verified: true, needs: ['DJ House', 'Personal de sala'] },
    { name: 'Pacha Barcelona', type: 'House / Comercial', capacity: 1500, rating: 4.6, verified: true, needs: ['DJ House', 'Hostess VIP'] },
  ],
  ibiza: [
    { name: 'Ushuaïa', type: 'EDM / House', capacity: 5000, rating: 5.0, verified: true, needs: ['DJ Internacional', 'Staff completo'] },
    { name: 'Amnesia', type: 'Techno / Trance', capacity: 5000, rating: 4.9, verified: true, needs: ['DJ Techno', 'Seguridad'] },
    { name: 'Hï Ibiza', type: 'House / Tech House', capacity: 4500, rating: 4.9, verified: true, needs: ['DJ House', 'Camareros VIP'] },
  ],
  valencia: [
    { name: 'Noxe Club', type: 'Techno / Minimal', capacity: 800, rating: 4.7, verified: true, needs: ['DJ Minimal', 'Barman'] },
    { name: 'Marina Beach Club', type: 'House / Comercial', capacity: 1200, rating: 4.6, verified: true, needs: ['DJ Comercial', 'Azafatas'] },
  ],
  sevilla: [
    { name: 'Antique Theatro', type: 'House / Latin', capacity: 1000, rating: 4.5, verified: true, needs: ['DJ Latino', 'RRPP'] },
    { name: 'Sala Custom', type: 'Techno / Underground', capacity: 600, rating: 4.4, verified: true, needs: ['DJ Techno', 'Personal de sala'] },
  ],
  malaga: [
    { name: 'Opium Marbella', type: 'Beach Club', capacity: 2000, rating: 4.7, verified: true, needs: ['DJ Comercial', 'Azafatas'] },
    { name: 'Theatro Marbs', type: 'House / Comercial', capacity: 1500, rating: 4.6, verified: true, needs: ['DJ House', 'Camareros'] },
  ],
  bilbao: [
    { name: 'Fever Club', type: 'Techno / Bass', capacity: 600, rating: 4.4, verified: true, needs: ['DJ Bass', 'Camareros'] },
    { name: 'Kubik', type: 'Electrónica', capacity: 500, rating: 4.3, verified: true, needs: ['DJ Electrónica', 'Seguridad'] },
  ],
  zaragoza: [
    { name: 'La Casa del Loco', type: 'Electrónica', capacity: 400, rating: 4.5, verified: true, needs: ['DJ Electrónica', 'Barman'] },
    { name: 'Oasis Club', type: 'Comercial', capacity: 700, rating: 4.3, verified: true, needs: ['DJ Comercial', 'RRPP'] },
  ],
  lisboa: [
    { name: 'Lux Frágil', type: 'Electrónica / House', capacity: 800, rating: 4.9, verified: true, needs: ['DJ House', 'Barman'] },
    { name: 'Music Box', type: 'Indie / Electrónica', capacity: 500, rating: 4.6, verified: true, needs: ['DJ Electrónica', 'Personal de sala'] },
  ],
  porto: [
    { name: 'Plano B', type: 'Alternativo / Electrónica', capacity: 400, rating: 4.7, verified: true, needs: ['DJ Electrónica', 'RRPP'] },
    { name: 'Maus Hábitos', type: 'Experimental / Arte', capacity: 350, rating: 4.5, verified: true, needs: ['DJ Experimental', 'Staff'] },
  ],
};

const MapaView = () => {
  const [selectedCity, setSelectedCity] = useState<string | null>('madrid');
  const [searchTerm, setSearchTerm] = useState('');
  const venues = selectedCity ? (venueDetails[selectedCity] || []) : [];

  const filteredCities = cities.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="mb-5">
        <h2 className="text-2xl font-bold mb-1">Directorio de <span className="text-gradient">Salas</span></h2>
        <p className="text-sm text-muted-foreground">Salas verificadas por ciudad y necesidades de contratación.</p>
      </div>

      <div className="glass-panel p-3 mb-5">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--nightlife-border)' }}>
          <Search size={14} className="text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar ciudad..."
            className="bg-transparent border-none outline-none text-foreground w-full text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
        <div className="flex flex-col gap-2">
          {filteredCities.map(city => {
            const isSelected = selectedCity === city.id;
            return (
              <button
                key={city.id}
                onClick={() => setSelectedCity(city.id)}
                className="flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200"
                style={{
                  background: isSelected ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.02)',
                  border: isSelected ? '1px solid rgba(212,175,55,0.2)' : '1px solid var(--nightlife-border)',
                }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: isSelected ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.05)' }}>
                  <MapPin size={14} style={{ color: isSelected ? '#D4AF37' : 'var(--nightlife-text-secondary)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold" style={{ color: isSelected ? '#D4AF37' : 'inherit' }}>{city.name}</p>
                  <p className="text-[0.65rem] text-muted-foreground">{city.venues} salas</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-3">
          {venues.length > 0 && (
            <div className="flex items-center gap-2 mb-1">
              <Filter size={14} style={{ color: '#D4AF37' }} />
              <span className="text-xs font-bold" style={{ color: '#D4AF37' }}>
                {venues.length} salas en {cities.find(c => c.id === selectedCity)?.name}
              </span>
            </div>
          )}
          {venues.map((v, i) => (
            <div key={i} className="glass-panel p-4 transition-all hover:border-primary/20">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold">{v.name}</h4>
                    {v.verified && <CheckCircle size={12} style={{ color: '#22c55e' }} />}
                  </div>
                  <p className="text-xs text-muted-foreground">{v.type}</p>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <Star size={11} style={{ color: '#D4AF37' }} />
                  <span className="font-semibold">{v.rating}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1"><Users size={11} /> {v.capacity.toLocaleString()} aforo</span>
                <span className="flex items-center gap-1"><Music size={11} /> {v.type.split('/')[0].trim()}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {v.needs.map(need => (
                  <span key={need} className="text-[0.6rem] font-medium px-2 py-0.5 rounded"
                    style={{ background: 'rgba(212,175,55,0.08)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>
                    {need}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapaView;
