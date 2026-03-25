import { useState, useEffect } from 'react';
import { Building2, Zap, Heart, Search, MapPin, Filter, Plus, Clock, Star, Phone, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import GeometricAvatar from '@/components/dashboard/GeometricAvatar';

interface Pro {
  id: string;
  display_name: string;
  role: string;
  zone: string | null;
  hourly_rate: number;
  specialty: string | null;
  category: string;
  score: number;
  is_verified: boolean;
  phone: string | null;
  instagram: string | null;
}

const zones = ['Todas', 'Malasaña', 'Salamanca', 'Chueca', 'Chamberí', 'Lavapiés', 'La Latina', 'Madrid Centro'];
const levels = ['Todos', 'professional', 'rookie'];
const roleOptions = ['Todos', 'dj', 'staff', 'makeup'];

const EmpresarioView = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState<'discover' | 'flash' | 'favorites'>('discover');
  const [pros, setPros] = useState<Pro[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filterZone, setFilterZone] = useState('Todas');
  const [filterLevel, setFilterLevel] = useState('Todos');
  const [filterRole, setFilterRole] = useState('Todos');
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [searchQuery, setSearchQuery] = useState('');

  // Flash job form
  const [showFlashForm, setShowFlashForm] = useState(false);
  const [flashTitle, setFlashTitle] = useState('');
  const [flashDesc, setFlashDesc] = useState('');
  const [flashPay, setFlashPay] = useState('');
  const [flashLocation, setFlashLocation] = useState('Madrid Centro');
  const [flashRole, setFlashRole] = useState('dj');

  // Geolocation
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    fetchPros();
    fetchFavorites();
    requestLocation();
  }, []);

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          toast.success('Ubicación activada — mostrando profesionales cercanos');
        },
        () => toast.info('Sin acceso a ubicación — mostrando todos los profesionales')
      );
    }
  };

  const fetchPros = async () => {
    const { data } = await (supabase
      .from('profiles')
      .select('*') as any)
      .in('validation_status', ['approved', 'pending']);
    if (data) setPros(data as Pro[]);
  };

  const fetchFavorites = async () => {
    if (!user) return;
    const { data } = await supabase.from('favorites').select('profile_id').eq('user_id', user.id);
    if (data) setFavorites(data.map((d: any) => d.profile_id));
  };

  const toggleFavorite = async (profileId: string) => {
    if (!user) return;
    if (favorites.includes(profileId)) {
      await supabase.from('favorites').delete().eq('user_id', user.id).eq('profile_id', profileId);
      setFavorites(prev => prev.filter(id => id !== profileId));
      toast.success('Eliminado de favoritos');
    } else {
      await supabase.from('favorites').insert({ user_id: user.id, profile_id: profileId } as any);
      setFavorites(prev => [...prev, profileId]);
      toast.success('Guardado en favoritos');
    }
  };

  const submitFlashJob = async () => {
    if (!user || !flashTitle || !flashDesc || !flashPay) { toast.error('Completa todos los campos'); return; }
    const { error } = await supabase.from('flash_jobs').insert({
      employer_id: user.id,
      title: flashTitle,
      description: flashDesc,
      pay: flashPay,
      location: flashLocation,
      role_needed: flashRole,
    } as any);
    if (error) { toast.error('Error al publicar'); return; }
    toast.success('Oferta publicada — visible 24h');
    setShowFlashForm(false);
    setFlashTitle(''); setFlashDesc(''); setFlashPay('');
  };

  const filtered = pros.filter(p => {
    if (filterZone !== 'Todas' && p.zone !== filterZone) return false;
    if (filterLevel !== 'Todos' && p.category !== filterLevel) return false;
    if (filterRole !== 'Todos' && p.role !== filterRole) return false;
    if (p.hourly_rate < priceRange[0] || p.hourly_rate > priceRange[1]) return false;
    if (searchQuery && !p.display_name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (tab === 'favorites' && !favorites.includes(p.id)) return false;
    return true;
  });

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="mb-5">
        <h2 className="text-2xl font-bold mb-1">
          Panel <span className="text-gradient">Empresario</span>
        </h2>
        <p className="text-sm text-muted-foreground">Encuentra y contrata talento profesional para tu sala.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {[
          { id: 'discover' as const, label: 'Descubrir', icon: Search },
          { id: 'flash' as const, label: 'Flash Jobs', icon: Zap },
          { id: 'favorites' as const, label: 'Favoritos', icon: Heart },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all"
            style={{
              background: tab === t.id ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${tab === t.id ? 'rgba(212,175,55,0.3)' : 'var(--nightlife-border)'}`,
              color: tab === t.id ? '#D4AF37' : '#8E8EA0',
            }}>
            <t.icon size={14} /> {t.label}
            {t.id === 'favorites' && favorites.length > 0 && (
              <span className="text-[0.55rem] px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(212,175,55,0.15)' }}>{favorites.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Flash Jobs Tab */}
      {tab === 'flash' && (
        <div className="mb-5">
          <button onClick={() => setShowFlashForm(!showFlashForm)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all hover:scale-105 mb-4"
            style={{ background: 'linear-gradient(90deg, #D4AF37, #B8941E)', color: '#000' }}>
            <Plus size={14} /> Publicar Oferta Urgente (24h)
          </button>

          {showFlashForm && (
            <div className="glass-panel p-5 mb-4">
              <h4 className="text-sm font-bold mb-3">Nueva Oferta Flash</h4>
              <div className="space-y-3">
                <input value={flashTitle} onChange={e => setFlashTitle(e.target.value)} placeholder="Título (ej: DJ Techno URGENTE esta noche)" className="nightlife-input text-sm" />
                <textarea value={flashDesc} onChange={e => setFlashDesc(e.target.value)} placeholder="Descripción del trabajo..." rows={3} className="nightlife-input text-sm resize-y" />
                <div className="grid grid-cols-3 gap-2">
                  <input value={flashPay} onChange={e => setFlashPay(e.target.value)} placeholder="Pago (ej: €350)" className="nightlife-input text-sm" />
                  <select value={flashLocation} onChange={e => setFlashLocation(e.target.value)} className="nightlife-input text-sm">
                    {zones.filter(z => z !== 'Todas').map(z => <option key={z} value={z}>{z}</option>)}
                  </select>
                  <select value={flashRole} onChange={e => setFlashRole(e.target.value)} className="nightlife-input text-sm">
                    <option value="dj">DJ</option>
                    <option value="staff">Staff</option>
                    <option value="makeup">Estilismo</option>
                  </select>
                </div>
                <button onClick={submitFlashJob} className="w-full py-2.5 rounded-lg font-bold text-sm"
                  style={{ background: 'linear-gradient(90deg, #D4AF37, #B8941E)', color: '#000' }}>
                  Publicar Oferta
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filters for Discover & Favorites */}
      {(tab === 'discover' || tab === 'favorites') && (
        <div className="glass-panel p-4 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <Filter size={14} style={{ color: '#D4AF37' }} />
            <span className="text-xs font-bold">Filtros Avanzados</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="text-[0.55rem] text-muted-foreground font-bold uppercase mb-1 block">Buscar</label>
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Nombre..." className="nightlife-input text-sm" />
            </div>
            <div>
              <label className="text-[0.55rem] text-muted-foreground font-bold uppercase mb-1 block">Zona</label>
              <select value={filterZone} onChange={e => setFilterZone(e.target.value)} className="nightlife-input text-sm">
                {zones.map(z => <option key={z} value={z}>{z}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[0.55rem] text-muted-foreground font-bold uppercase mb-1 block">Nivel</label>
              <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)} className="nightlife-input text-sm">
                <option value="Todos">Todos</option>
                <option value="professional">Profesional</option>
                <option value="rookie">Rookie</option>
              </select>
            </div>
            <div>
              <label className="text-[0.55rem] text-muted-foreground font-bold uppercase mb-1 block">Rol</label>
              <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className="nightlife-input text-sm">
                <option value="Todos">Todos</option>
                <option value="dj">DJ</option>
                <option value="staff">Staff</option>
                <option value="makeup">Estilismo</option>
              </select>
            </div>
          </div>
          <div className="mt-3">
            <label className="text-[0.55rem] text-muted-foreground font-bold uppercase mb-1 block">
              Precio: €{priceRange[0]} - €{priceRange[1]}/hora
            </label>
            <input type="range" min={0} max={200} value={priceRange[1]} onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="w-full accent-amber-500" />
          </div>
        </div>
      )}

      {/* Professional cards */}
      {(tab === 'discover' || tab === 'favorites') && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-sm text-muted-foreground">No se encontraron profesionales con estos filtros</p>
            </div>
          ) : filtered.map(p => (
            <div key={p.id} className="glass-panel p-4 transition-all hover:border-primary/20">
              <div className="flex items-center gap-3 mb-3">
                <GeometricAvatar role={p.role as any} seed={p.id.charCodeAt(0)} size={42} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold truncate">{p.display_name || 'Sin nombre'}</span>
                    {p.is_verified && <Star size={12} style={{ color: '#D4AF37' }} fill="#D4AF37" />}
                  </div>
                  <p className="text-[0.6rem] text-muted-foreground">{p.specialty || p.role} · {p.zone || 'Madrid'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-[0.55rem] px-1.5 py-0.5 rounded font-bold"
                  style={{
                    background: p.category === 'professional' ? 'rgba(34,197,94,0.1)' : 'rgba(255,188,0,0.1)',
                    color: p.category === 'professional' ? '#22c55e' : '#ffbc00',
                  }}>
                  {p.category === 'professional' ? 'PRO' : 'ROOKIE'}
                </span>
                <span className="text-xs font-bold" style={{ color: '#D4AF37' }}>€{p.hourly_rate}/hora</span>
              </div>

              <div className="flex gap-2">
                {p.phone && (
                  <a href={`https://wa.me/${p.phone}?text=${encodeURIComponent('Hola, te contacto desde NIGHTLIFE Madrid para un evento.')}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-bold transition-all hover:scale-105"
                    style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: '#25D366' }}>
                    <MessageSquare size={12} /> Contactar
                  </a>
                )}
                <button onClick={() => toggleFavorite(p.id)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-bold transition-all hover:scale-105"
                  style={{
                    background: favorites.includes(p.id) ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${favorites.includes(p.id) ? 'rgba(212,175,55,0.3)' : 'var(--nightlife-border)'}`,
                    color: favorites.includes(p.id) ? '#D4AF37' : '#8E8EA0',
                  }}>
                  <Heart size={12} fill={favorites.includes(p.id) ? '#D4AF37' : 'none'} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {userLocation && (
        <div className="mt-4 glass-panel p-3 flex items-center gap-2">
          <MapPin size={14} style={{ color: '#22c55e' }} />
          <span className="text-[0.6rem] text-muted-foreground">
            Ubicación activa: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)} — Profesionales ordenados por cercanía
          </span>
        </div>
      )}
    </div>
  );
};

export default EmpresarioView;
