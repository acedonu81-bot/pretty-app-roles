import { useState, useEffect } from 'react';
import { Megaphone, Clock, MapPin, Zap, Plus, X } from 'lucide-react';

interface Offer {
  id: number;
  author: string;
  avatar: string;
  gradient: string;
  title: string;
  description: string;
  location: string;
  pay: string;
  createdAt: number;
  expiresIn: number; // seconds remaining
}

const initialOffers: Offer[] = [
  {
    id: 1, author: 'Onyx Club Madrid', avatar: 'ON', gradient: 'linear-gradient(135deg, hsl(var(--primary)), #6b21ff)',
    title: '🚨 DJ Techno URGENTE esta noche', description: 'Necesitamos DJ de techno/minimal para sesión de 00h a 04h. El anterior canceló.', location: 'Madrid Centro', pay: '€350', createdAt: Date.now(), expiresIn: 5400,
  },
  {
    id: 2, author: 'Sala Horizon BCN', avatar: 'HZ', gradient: 'linear-gradient(135deg, #00e5ff, #00ff88)',
    title: '⚡ Camarero/a con experiencia', description: 'Buscamos personal de barra para evento VIP mañana noche. Experiencia en cócteles.', location: 'Barcelona, Eixample', pay: '€120', createdAt: Date.now(), expiresIn: 6800,
  },
  {
    id: 3, author: 'Noxe Valencia', avatar: 'NX', gradient: 'linear-gradient(135deg, #f472b6, #a855f7)',
    title: '💄 Maquilladora UV Body Paint', description: 'Evento temático neon party. Necesitamos estilista con experiencia en pintura UV.', location: 'Valencia', pay: '€200', createdAt: Date.now(), expiresIn: 3200,
  },
  {
    id: 4, author: 'Pacha Ibiza', avatar: 'PA', gradient: 'linear-gradient(135deg, #ffbc00, #ff5f56)',
    title: '🎧 DJ House para pool party', description: 'Sesión de 16h a 20h. Ambiente chill/deep house. Pago al momento.', location: 'Ibiza', pay: '€500', createdAt: Date.now(), expiresIn: 7000,
  },
];

const LastCallView = () => {
  const [offers, setOffers] = useState(initialOffers);
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newPay, setNewPay] = useState('');

  // Countdown timer
  useEffect(() => {
    const iv = setInterval(() => {
      setOffers(prev => prev.map(o => ({ ...o, expiresIn: Math.max(0, o.expiresIn - 1) })).filter(o => o.expiresIn > 0));
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  const formatCountdown = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h}h ${String(m).padStart(2, '0')}m ${String(sec).padStart(2, '0')}s`;
  };

  const urgencyColor = (s: number) => {
    if (s < 1800) return 'hsl(var(--destructive))';
    if (s < 3600) return 'var(--nightlife-yellow)';
    return 'hsl(var(--accent))';
  };

  const addOffer = () => {
    if (!newTitle.trim()) return;
    setOffers(prev => [{
      id: Date.now(), author: 'Tú (Empresario)', avatar: 'TU', gradient: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))',
      title: newTitle, description: newDesc, location: newLocation || 'Sin especificar', pay: newPay || 'A convenir',
      createdAt: Date.now(), expiresIn: 7200,
    }, ...prev]);
    setNewTitle(''); setNewDesc(''); setNewLocation(''); setNewPay('');
    setShowForm(false);
  };

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-extrabold mb-1">
            Last <span className="text-gradient">Call</span> 🔥
          </h2>
          <p className="text-muted-foreground">Ofertas urgentes que caducan en 2 horas. ¡No te las pierdas!</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-6 py-4 rounded-full font-extrabold text-sm transition-all duration-300 hover:scale-105"
          style={{
            background: 'linear-gradient(90deg, hsl(var(--primary)), #6b21ff)',
            color: 'white',
            boxShadow: '0 0 25px hsla(var(--primary) / 0.4)',
          }}
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? 'Cancelar' : 'Publicar Urgencia'}
        </button>
      </div>

      {/* New offer form */}
      {showForm && (
        <div className="glass-panel p-6 mb-6 animate-[fadeIn_0.3s_ease]">
          <h3 className="text-sm font-extrabold mb-4 flex items-center gap-2">
            <Megaphone size={16} style={{ color: 'hsl(var(--accent))' }} /> Nueva oferta urgente
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Título (ej: DJ Techno URGENTE)" className="nightlife-input !py-3" />
            <input value={newLocation} onChange={e => setNewLocation(e.target.value)} placeholder="Ubicación" className="nightlife-input !py-3" />
            <input value={newPay} onChange={e => setNewPay(e.target.value)} placeholder="Pago (ej: €300)" className="nightlife-input !py-3" />
            <input value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Descripción breve" className="nightlife-input !py-3" />
          </div>
          <button onClick={addOffer} className="btn-nightlife-primary !py-3 !px-8 text-sm">
            Publicar (caduca en 2h)
          </button>
        </div>
      )}

      {/* Offers wall */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {offers.map(offer => (
          <div key={offer.id} className="glass-panel p-6 flex flex-col transition-all hover:scale-[1.01] duration-300" style={{
            borderColor: offer.expiresIn < 1800 ? 'rgba(255,95,86,0.3)' : undefined,
          }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black flex-shrink-0" style={{ background: offer.gradient, color: 'white' }}>
                {offer.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-extrabold">{offer.title}</h3>
                <p className="text-xs text-muted-foreground">{offer.author}</p>
              </div>
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-extrabold flex-shrink-0" style={{
                background: `${urgencyColor(offer.expiresIn)}15`,
                color: urgencyColor(offer.expiresIn),
                border: `1px solid ${urgencyColor(offer.expiresIn)}40`,
              }}>
                <Clock size={12} />
                {formatCountdown(offer.expiresIn)}
              </div>
            </div>

            <p className="text-xs text-muted-foreground mb-4 flex-1">{offer.description}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin size={12} /> {offer.location}</span>
                <span className="font-extrabold text-sm" style={{ color: 'hsl(var(--accent))' }}>{offer.pay}</span>
              </div>
              <button className="flex items-center gap-2 px-6 py-3 rounded-full font-extrabold text-xs transition-all hover:scale-105"
                style={{
                  background: 'linear-gradient(90deg, hsl(var(--primary)), #6b21ff)',
                  color: 'white',
                  boxShadow: '0 0 15px hsla(var(--primary) / 0.3)',
                }}
              >
                <Zap size={14} /> Responder
              </button>
            </div>
          </div>
        ))}
      </div>

      {offers.length === 0 && (
        <div className="glass-panel p-12 text-center">
          <Megaphone size={48} className="mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No hay ofertas activas ahora mismo. ¡Publica la primera!</p>
        </div>
      )}
    </div>
  );
};

export default LastCallView;
