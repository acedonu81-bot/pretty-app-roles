import { Star, MapPin, Clock, Phone, Instagram, Navigation, Flame } from 'lucide-react';
import { Profile, getWhatsAppLink, getInstagramLink, getPhoneLink, getLocationLink } from '@/data/profiles';

interface ProfileCardProps {
  profile: Profile;
  onBook?: (profile: Profile) => void;
}

const ProfileCard = ({ profile: p, onBook }: ProfileCardProps) => {
  return (
    <div className="glass-panel p-6 flex flex-col transition-all hover:scale-[1.02] duration-300 relative">
      {/* TOP FINDE badge */}
      {p.topFinde && (
        <div className="absolute -top-2 -right-2 px-3 py-1 rounded-full text-[0.65rem] font-black tracking-wider z-10 flex items-center gap-1"
          style={{
            background: 'linear-gradient(90deg, #ffbc00, #ff8c00)',
            color: '#000',
            boxShadow: '0 0 20px rgba(255,188,0,0.5)',
            animation: 'pulse 2s infinite',
          }}
        >
          <Flame size={12} /> TOP FINDE
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black overflow-hidden" style={{ background: p.gradient, color: 'white' }}>
          <img src={p.photo} alt={p.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-extrabold">{p.name}</h3>
            {p.topFinde && <Flame size={14} style={{ color: '#ffbc00' }} />}
          </div>
          <p className="text-xs text-muted-foreground">{p.specialty}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Star size={12} style={{ color: '#ffbc00' }} /> <span className="font-bold text-foreground">{p.rating}</span> ({p.reviews})</span>
        <span className="flex items-center gap-1"><MapPin size={12} /> {p.zone}</span>
      </div>
      <div className="flex items-center gap-1 mb-3 text-xs text-muted-foreground">
        <Clock size={12} /> {p.experience} de experiencia
      </div>

      <p className="text-xs text-muted-foreground mb-4 flex-1">{p.description}</p>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {p.badges.map(b => (
          <span key={b} className="text-[0.65rem] font-bold px-2 py-1 rounded-full"
            style={{ background: 'hsla(var(--primary) / 0.1)', color: 'hsl(var(--primary))', border: '1px solid hsla(var(--primary) / 0.2)' }}>
            {b}
          </span>
        ))}
      </div>

      {/* Social icons */}
      <div className="flex items-center gap-2 mb-4">
        <a href={getInstagramLink(p.instagram)} target="_blank" rel="noopener noreferrer"
          className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 hover:opacity-80"
          style={{ background: 'rgba(225,48,108,0.15)', color: '#E1306C' }}>
          <Instagram size={16} />
        </a>
        <a href={getPhoneLink(p.phone)} 
          className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 hover:opacity-80"
          style={{ background: 'hsla(var(--accent) / 0.15)', color: 'hsl(var(--accent))' }}>
          <Phone size={16} />
        </a>
        <a href={getLocationLink(p.zone)}  target="_blank" rel="noopener noreferrer"
          className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 hover:opacity-80"
          style={{ background: 'hsla(var(--secondary) / 0.15)', color: 'hsl(var(--secondary))' }}>
          <Navigation size={16} />
        </a>
      </div>

      {/* Price + WhatsApp CTA */}
      <div className="flex items-center justify-between">
        <span className="text-lg font-extrabold" style={{ color: 'hsl(var(--accent))' }}>
          €{p.price}<span className="text-xs text-muted-foreground font-normal">{p.priceUnit}</span>
        </span>
        <a href={getWhatsAppLink(p.phone)} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2 rounded-full font-extrabold text-xs transition-all duration-200 hover:scale-105 active:scale-95 hover:opacity-90"
          style={{
            background: 'linear-gradient(90deg, #25D366, #128C7E)',
            color: 'white',
            boxShadow: '0 4px 15px rgba(37,211,102,0.3)',
          }}
        >
          📲 Contactar
        </a>
      </div>
    </div>
  );
};

export default ProfileCard;
