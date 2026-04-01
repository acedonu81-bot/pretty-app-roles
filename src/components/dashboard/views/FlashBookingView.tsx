import { useState } from 'react';
import { Zap, Clock, MapPin, Crown, ToggleLeft, ToggleRight } from 'lucide-react';
import { toast } from 'sonner';
import { profiles } from '@/data/profiles';

const flashProfiles = profiles.filter(p => p.isFlashActive);

const FlashBookingView = () => {
  const [isFlashActive, setIsFlashActive] = useState(true);

  const toggleFlash = () => {
    setIsFlashActive(!isFlashActive);
    toast.success(isFlashActive ? 'Flash Booking desactivado' : 'Flash Booking activado — ¡Ahora eres visible!');
  };

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="mb-5">
        <h2 className="text-2xl font-bold mb-1">
          Flash <span className="text-gradient">Booking</span>
        </h2>
        <p className="text-sm text-muted-foreground">Activa tu disponibilidad en tiempo real. Los empresarios te verán al instante.</p>
      </div>

      {/* Toggle */}
      <div className="glass-panel p-5 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap size={20} style={{ color: isFlashActive ? '#22c55e' : 'var(--nightlife-text-secondary)' }} />
            <div>
              <p className="text-sm font-bold">Tu disponibilidad</p>
              <p className="text-xs text-muted-foreground">
                {isFlashActive ? 'Estás visible para empresarios ahora mismo' : 'Tu perfil no aparece en el feed Flash'}
              </p>
            </div>
          </div>
          <button onClick={toggleFlash} className="transition-all duration-200 hover:scale-105">
            {isFlashActive ? (
              <ToggleRight size={40} style={{ color: '#22c55e' }} />
            ) : (
              <ToggleLeft size={40} style={{ color: 'var(--nightlife-text-secondary)' }} />
            )}
          </button>
        </div>
      </div>

      {/* Flash feed */}
      <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        Profesionales disponibles ahora
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {flashProfiles.map(p => (
          <div key={p.id} className="glass-panel p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center text-sm font-bold"
                style={{ border: '1px solid rgba(34,197,94,0.3)', background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
                {p.photo ? <img src={p.photo} alt={p.name} className="w-full h-full object-cover" /> : p.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.specialty}</p>
              </div>
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
              <span className="flex items-center gap-1"><MapPin size={11} /> {p.zone}</span>
              <span className="flex items-center gap-1"><Clock size={11} /> Disponible ahora</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold" style={{ color: '#D4AF37' }}>€{p.price}{p.priceUnit}</span>
              <a href={`https://wa.me/${p.phone}?text=${encodeURIComponent('Hola, te he visto en XPEAK y me interesa tu perfil para un evento. ¿Hablamos?')}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-all hover:scale-105"
                style={{ background: 'linear-gradient(90deg, #25D366, #128C7E)', color: 'white' }}>
                <svg viewBox="0 0 24 24" width={14} height={14} fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Contactar
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlashBookingView;
