import { useState, useEffect } from 'react';
import { MapPin, Search, Users, CheckCircle, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import GeometricAvatar from '@/components/dashboard/GeometricAvatar';

const CITIES = [
  'Madrid','Barcelona','Valencia','Sevilla','Zaragoza','Málaga','Murcia',
  'Palma de Mallorca','Alicante','Bilbao','Ibiza','Granada','San Sebastián',
  'Gijón','Santander','A Coruña','Vitoria-Gasteiz','Pamplona','Marbella','Salamanca',
];

const ROLE_LABELS: Record<string, string> = {
  dj: 'DJ / Artista', staff: 'Staff', makeup: 'Maquillaje', media: 'Media',
  design: 'Diseño', promotor: 'Promotor', ambassador: 'Embajador', empresario: 'Empresario',
};

interface CityPro {
  user_id: string;
  display_name: string;
  role: string;
  specialty: string | null;
  zone: string | null;
  photo_url: string | null;
  is_verified: boolean;
}

const MapaView = () => {
  const [selectedCity, setSelectedCity] = useState<string>('Madrid');
  const [searchTerm, setSearchTerm] = useState('');
  const [allProfiles, setAllProfiles] = useState<CityPro[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('profiles')
      .select('user_id, display_name, role, specialty, zone, photo_url, is_verified')
      .limit(500)
      .then(({ data }) => {
        setAllProfiles(data ?? []);
        setLoading(false);
      });
  }, []);

  const cityCount = (city: string) =>
    allProfiles.filter(p => p.zone?.includes(city)).length;

  const cityProfiles = allProfiles.filter(p => p.zone?.includes(selectedCity));

  const filteredCities = CITIES.filter(c =>
    c.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="mb-5">
        <h2 className="text-2xl font-bold mb-1">Profesionales por <span className="text-gradient">Ciudad</span></h2>
        <p className="text-sm text-muted-foreground">Directorio de talento por ubicación en España.</p>
      </div>

      <div className="glass-panel p-3 mb-5">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid var(--nightlife-border)' }}>
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

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
        {/* City list */}
        <div className="flex flex-col gap-2">
          {filteredCities.map(city => {
            const count = loading ? null : cityCount(city);
            const isSelected = selectedCity === city;
            return (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className="flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200"
                style={{
                  background: isSelected ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.02)',
                  border: isSelected ? '1px solid rgba(212,175,55,0.2)' : '1px solid var(--nightlife-border)',
                }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: isSelected ? 'rgba(212,175,55,0.15)' : 'rgba(0,0,0,0.05)' }}>
                  <MapPin size={14} style={{ color: isSelected ? '#D4AF37' : 'var(--nightlife-text-secondary)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold" style={{ color: isSelected ? '#D4AF37' : 'inherit' }}>{city}</p>
                  {count !== null && (
                    <p className="text-xs text-muted-foreground">
                      {count > 0 ? `${count} profesional${count !== 1 ? 'es' : ''}` : 'Sin profesionales aún'}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Professionals panel */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Users size={14} style={{ color: '#8A6D0F' }} />
            <span className="text-xs font-bold" style={{ color: '#8A6D0F' }}>
              {loading ? '…' : cityProfiles.length} profesionales en {selectedCity}
            </span>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <p className="text-xs text-muted-foreground animate-pulse">Cargando…</p>
            </div>
          )}

          {!loading && cityProfiles.length === 0 && (
            <div className="glass-panel p-8 flex flex-col items-center text-center gap-3">
              <MapPin size={24} style={{ color: 'rgba(212,175,55,0.2)' }} />
              <div>
                <p className="text-sm font-bold mb-1" style={{ color: '#333' }}>
                  Sin profesionales aún en {selectedCity}
                </p>
                <p className="text-xs text-muted-foreground max-w-[240px] mx-auto">
                  Sé el primero en registrarte y aparecer aquí.
                </p>
              </div>
            </div>
          )}

          {!loading && cityProfiles.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {cityProfiles.map(pro => (
                <a
                  key={pro.user_id}
                  href={`/p/${pro.user_id}`}
                  className="glass-panel p-4 flex items-center gap-3 transition-all hover:border-primary/20 hover:scale-[1.01]"
                >
                  <div className="flex-shrink-0">
                    {pro.photo_url ? (
                      <img src={pro.photo_url} alt={pro.display_name}
                        className="w-10 h-10 rounded-lg object-cover"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    ) : (
                      <GeometricAvatar role={pro.role as any} seed={pro.user_id.charCodeAt(0)} size={40} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <p className="text-sm font-bold truncate">{pro.display_name || 'Sin nombre'}</p>
                      {pro.is_verified && <CheckCircle size={11} style={{ color: '#22c55e', flexShrink: 0 }} />}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {ROLE_LABELS[pro.role] ?? pro.role}{pro.specialty ? ` · ${pro.specialty}` : ''}
                    </p>
                  </div>
                  <ExternalLink size={12} style={{ color: 'rgba(0,0,0,0.1)', flexShrink: 0 }} />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapaView;
