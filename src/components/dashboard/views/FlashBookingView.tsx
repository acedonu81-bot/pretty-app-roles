import { useState } from 'react';
import { Zap, Clock, MapPin, ToggleLeft, ToggleRight } from 'lucide-react';
import { toast } from 'sonner';
import { profiles, Profile } from '@/data/profiles';
import { useProfile } from '@/hooks/useProfile';
import FlashBookingRequestModal from '@/components/dashboard/FlashBookingRequestModal';

const flashProfiles = profiles.filter(p => p.isFlashActive);

const FlashBookingView = () => {
  const myProfile = useProfile();
  const [isFlashActive, setIsFlashActive] = useState(true);
  const [selectedPro, setSelectedPro] = useState<Profile | null>(null);

  const toggleFlash = async () => {
    const next = !isFlashActive;
    setIsFlashActive(next);
    await myProfile.updateField({ is_live: next } as any);
    toast.success(next ? 'Flash Booking activado — ¡Ahora eres visible!' : 'Flash Booking desactivado');
  };

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="mb-5">
        <h2 className="text-2xl font-bold mb-1">Flash <span className="text-gradient">Booking</span></h2>
        <p className="text-sm text-muted-foreground">Activa tu disponibilidad en tiempo real. Los empresarios te verán al instante.</p>
      </div>

      {/* Toggle disponibilidad */}
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
            {isFlashActive
              ? <ToggleRight size={40} style={{ color: '#22c55e' }} />
              : <ToggleLeft size={40} style={{ color: 'var(--nightlife-text-secondary)' }} />}
          </button>
        </div>
      </div>

      {/* Feed de profesionales disponibles */}
      <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        Profesionales disponibles ahora
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {flashProfiles.map(p => (
          <div key={p.id} className="glass-panel p-4 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center text-sm font-bold"
                style={{ border: '1px solid rgba(34,197,94,0.3)', background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
                {p.photo ? <img src={p.photo} alt={p.name} className="w-full h-full object-cover" /> : p.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{p.name}</p>
                <p className="text-xs text-muted-foreground truncate">{p.specialty}</p>
              </div>
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin size={11} /> {p.zone}{p.country ? `, ${p.country}` : ''}</span>
              <span className="flex items-center gap-1"><Clock size={11} /> Ahora</span>
            </div>

            <div className="flex items-center justify-between mt-auto">
              <span className="text-sm font-bold" style={{ color: '#D4AF37' }}>
                {p.price > 0 ? `€${p.price}${p.priceUnit}` : 'A consultar'}
              </span>
              <button
                onClick={() => setSelectedPro(p)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-all hover:scale-105"
                style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                <Zap size={12} /> Solicitar
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedPro && (
        <FlashBookingRequestModal
          professionalName={selectedPro.name}
          professionalRole={selectedPro.role}
          onClose={() => setSelectedPro(null)}
        />
      )}
    </div>
  );
};

export default FlashBookingView;
