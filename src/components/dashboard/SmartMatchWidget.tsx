import { useState } from 'react';
import { Sparkles, MapPin, Star, Zap, BadgeCheck, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { useSmartMatch, MatchedProfessional } from '@/hooks/useSmartMatch';

const ROLES = [
  { value: 'dj', label: 'DJ / Artista' },
  { value: 'staff', label: 'Staff / Camarero' },
  { value: 'event_manager', label: 'Encargada de Eventos' },
  { value: 'makeup', label: 'Maquillaje / Peluquería' },
  { value: 'media', label: 'Fotógrafo / Vídeo' },
  { value: 'promotor', label: 'Promotor / RRPP' },
  { value: 'catering', label: 'Catering & Chef' },
  { value: 'mago', label: 'Mago & Ilusionista' },
  { value: 'bailarin', label: 'Bailarín & Danza' },
  { value: 'animador', label: 'Payaso & Animador' },
];

const EVENT_TYPES = ['Boda', 'Comunión', 'Evento corporativo', 'Fiesta privada', 'Festival', 'Cumpleaños', 'Inauguración', 'Club / Discoteca'];

const MatchCard = ({ m, onContact }: { m: MatchedProfessional; onContact: (userId: string) => void }) => (
  <div className="p-3 rounded-xl flex gap-3 items-start"
    style={{ background: '#fafaf8', border: '1px solid rgba(212,175,55,0.12)' }}>
    <a href={`/p/${m.user_id}`} className="flex-shrink-0">
      {m.photo_url ? (
        <img src={m.photo_url} alt={m.display_name} className="w-12 h-12 rounded-xl object-cover" />
      ) : (
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black"
          style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37' }}>
          {m.display_name.charAt(0)}
        </div>
      )}
    </a>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1.5 flex-wrap">
        <a href={`/p/${m.user_id}`} className="text-sm font-bold hover:opacity-70 truncate" style={{ color: '#111' }}>
          {m.display_name}
        </a>
        {m.is_verified && <BadgeCheck size={12} style={{ color: '#D4AF37' }} />}
        {m.is_early_adopter && <span className="w-2 h-2 rounded-full" style={{ background: '#3b82f6' }} />}
      </div>
      {m.specialty && <p className="text-xs truncate" style={{ color: '#D4AF37' }}>{m.specialty}</p>}
      <div className="flex flex-wrap gap-1.5 mt-1.5">
        {m.matchReasons.slice(0, 3).map((r, i) => (
          <span key={i} className="text-[0.6rem] px-1.5 py-0.5 rounded-full font-bold"
            style={{ background: 'rgba(212,175,55,0.08)', color: '#B8941E', border: '1px solid rgba(212,175,55,0.15)' }}>
            {r}
          </span>
        ))}
      </div>
    </div>
    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
      {m.estimatedPrice && (
        <span className="text-xs font-bold" style={{ color: '#222' }}>~{m.estimatedPrice}€</span>
      )}
      <button onClick={() => onContact(m.user_id)}
        className="px-2.5 py-1 rounded-lg text-[0.65rem] font-bold transition-all hover:scale-105"
        style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
        Contactar
      </button>
    </div>
  </div>
);

interface Props {
  onViewProfile?: (userId: string) => void;
  onMessage?: (userId: string, name: string) => void;
}

const SmartMatchWidget = ({ onViewProfile, onMessage }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const [role, setRole] = useState('dj');
  const [city, setCity] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventType, setEventType] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [query, setQuery] = useState<{ role: string; city?: string; eventDate?: string; maxBudget?: number; eventType?: string } | null>(null);

  const { results, loading } = useSmartMatch(query);

  const search = () => {
    setQuery({
      role,
      city: city.trim() || undefined,
      eventDate: eventDate || undefined,
      maxBudget: maxBudget ? parseInt(maxBudget) : undefined,
      eventType: eventType || undefined,
    });
  };

  const handleContact = (userId: string) => {
    const pro = results.find(r => r.user_id === userId);
    if (onMessage && pro) onMessage(userId, pro.display_name);
  };

  return (
    <div className="rounded-2xl overflow-hidden mb-5"
      style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.04), rgba(212,175,55,0.01))', border: '1px solid rgba(212,175,55,0.15)' }}>
      <button onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-2.5 px-4 py-3 text-left">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(212,175,55,0.12)' }}>
          <Sparkles size={14} style={{ color: '#D4AF37' }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold" style={{ color: '#222' }}>Encontrar profesional ideal</p>
          <p className="text-xs" style={{ color: '#333' }}>IA analiza disponibilidad, zona, rating y presupuesto</p>
        </div>
        {expanded ? <ChevronUp size={16} style={{ color: '#333' }} /> : <ChevronDown size={16} style={{ color: '#333' }} />}
      </button>

      {expanded && (
        <div className="px-4 pb-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
            <select value={role} onChange={e => setRole(e.target.value)}
              className="px-2.5 py-2 rounded-xl text-xs focus:outline-none appearance-none"
              style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.1)' }}>
              {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
            <input value={city} onChange={e => setCity(e.target.value)}
              placeholder="Ciudad (ej: Madrid)"
              className="px-2.5 py-2 rounded-xl text-xs focus:outline-none"
              style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.1)' }} />
            <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)}
              className="px-2.5 py-2 rounded-xl text-xs focus:outline-none"
              style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.1)' }} />
            <select value={eventType} onChange={e => setEventType(e.target.value)}
              className="px-2.5 py-2 rounded-xl text-xs focus:outline-none appearance-none"
              style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.1)' }}>
              <option value="">Tipo de evento</option>
              {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <input type="number" value={maxBudget} onChange={e => setMaxBudget(e.target.value)}
              placeholder="Presupuesto máx (€)"
              className="px-2.5 py-2 rounded-xl text-xs focus:outline-none"
              style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.1)' }} />
            <button onClick={search}
              className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              <Search size={12} /> Buscar
            </button>
          </div>

          {loading && (
            <div className="py-6 text-center">
              <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin mx-auto mb-2" style={{ borderColor: '#D4AF37', borderTopColor: 'transparent' }} />
              <p className="text-xs" style={{ color: '#333' }}>Analizando profesionales...</p>
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="py-6 text-center rounded-xl" style={{ background: 'rgba(0,0,0,0.02)' }}>
              <p className="text-xs" style={{ color: '#333' }}>No se encontraron profesionales con estos criterios. Prueba ampliando la búsqueda.</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-bold mb-1" style={{ color: '#333' }}>
                {results.length} profesionales recomendados
              </p>
              {results.map(m => (
                <MatchCard key={m.user_id} m={m} onContact={handleContact} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SmartMatchWidget;
