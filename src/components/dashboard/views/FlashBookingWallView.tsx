import { useState, useEffect } from 'react';
import { Megaphone, Clock, MapPin, Plus, X } from 'lucide-react';
import { empresarios, getWhatsAppLink } from '@/data/profiles';

const WaIcon = ({ size = 14 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

interface Offer {
  id: number;
  author: string;
  avatar: string;
  gradient: string;
  title: string;
  description: string;
  location: string;
  pay: string;
  expiresIn: number;
}

const buildInitialOffers = (): Offer[] => {
  let id = 1;
  const list: Offer[] = [];
  for (const e of empresarios) {
    for (const o of e.offers) {
      list.push({ id: id++, author: e.name, avatar: e.avatar, gradient: e.gradient, ...o });
    }
  }
  return list;
};

const FlashBookingWallView = () => {
  const [offers, setOffers] = useState(buildInitialOffers);
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newPay, setNewPay] = useState('');

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
    if (s < 1800) return '#ff5f56';
    if (s < 3600) return '#D4AF37';
    return '#22c55e';
  };

  const addOffer = () => {
    if (!newTitle.trim()) return;
    setOffers(prev => [{
      id: Date.now(), author: 'Tú (Empresario)', avatar: 'TU', gradient: 'linear-gradient(135deg, #D4AF37, #B8941E)',
      title: newTitle, description: newDesc, location: newLocation || 'Sin especificar', pay: newPay || 'A convenir', expiresIn: 7200,
    }, ...prev]);
    setNewTitle(''); setNewDesc(''); setNewLocation(''); setNewPay('');
    setShowForm(false);
  };

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 gap-3">
        <div>
          <h2 className="text-2xl font-bold mb-1">Flash <span className="text-gradient">Booking</span></h2>
          <p className="text-sm text-muted-foreground">Ofertas urgentes que caducan en 2 horas.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-3 rounded-lg font-bold text-sm transition-all duration-200 hover:scale-105 active:scale-95 w-full sm:w-auto justify-center"
          style={{ background: 'linear-gradient(90deg, #D4AF37, #B8941E)', color: '#000' }}>
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Cancelar' : 'Publicar Urgencia'}
        </button>
      </div>

      {showForm && (
        <div className="glass-panel p-5 mb-5 animate-[fadeIn_0.3s_ease]">
          <h3 className="text-xs font-bold mb-3 flex items-center gap-2">
            <Megaphone size={14} style={{ color: '#D4AF37' }} /> Nueva oferta urgente
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Título (ej: DJ Techno URGENTE)" className="nightlife-input !py-2.5 text-sm" />
            <input value={newLocation} onChange={e => setNewLocation(e.target.value)} placeholder="Ubicación" className="nightlife-input !py-2.5 text-sm" />
            <input value={newPay} onChange={e => setNewPay(e.target.value)} placeholder="Pago (ej: €300)" className="nightlife-input !py-2.5 text-sm" />
            <input value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Descripción breve" className="nightlife-input !py-2.5 text-sm" />
          </div>
          <button onClick={addOffer} className="btn-nightlife-primary !py-2.5 !px-6 text-xs">Publicar (caduca en 2h)</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {offers.map(offer => (
          <div key={offer.id} className="glass-panel p-5 flex flex-col transition-all duration-200"
            style={{ borderColor: offer.expiresIn < 1800 ? 'rgba(255,95,86,0.2)' : undefined }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: offer.gradient, color: 'white' }}>
                {offer.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold">{offer.title}</h3>
                <p className="text-xs text-muted-foreground">{offer.author}</p>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded text-xs font-bold flex-shrink-0"
                style={{ background: `${urgencyColor(offer.expiresIn)}12`, color: urgencyColor(offer.expiresIn), border: `1px solid ${urgencyColor(offer.expiresIn)}30` }}>
                <Clock size={11} />
                {formatCountdown(offer.expiresIn)}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-3 flex-1">{offer.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin size={11} /> {offer.location}</span>
                <span className="font-bold text-sm" style={{ color: '#D4AF37' }}>{offer.pay}</span>
              </div>
              <a href={getWhatsAppLink('34600000000')} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold text-xs transition-all duration-200 hover:scale-105 active:scale-95"
                style={{ background: 'linear-gradient(90deg, #25D366, #128C7E)', color: 'white' }}>
                <WaIcon size={14} /> Responder
              </a>
            </div>
          </div>
        ))}
      </div>

      {offers.length === 0 && (
        <div className="glass-panel p-10 text-center">
          <Megaphone size={36} className="mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No hay ofertas activas. ¡Publica la primera!</p>
        </div>
      )}
    </div>
  );
};

export default FlashBookingWallView;
