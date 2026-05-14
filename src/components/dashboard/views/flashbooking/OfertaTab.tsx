import { useState, useEffect, useRef } from 'react';
import { Zap, Clock, MapPin, Lock, ToggleLeft, ToggleRight, AlertTriangle } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import FlashBookingRequestModal from '@/components/dashboard/FlashBookingRequestModal';

const FREE_DELAY_SECONDS = 15 * 60;

interface FlashProfile {
  id: string;
  name: string;
  photo: string;
  specialty: string;
  zone: string;
  price: number;
  priceUnit: string;
  role: string;
}

const OfertaTab = () => {
  const currentUser = useProfile();
  const isEmpresario = currentUser.role === 'empresario';
  const isFreeUser = currentUser.subscription_tier === 'free';

  const [flashProfiles, setFlashProfiles] = useState<FlashProfile[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [isFlashActive, setIsFlashActive] = useState(() => currentUser.is_flash_active ?? false);

  // Sync toggle state when profile finishes loading
  useEffect(() => {
    setIsFlashActive(currentUser.is_flash_active ?? false);
  }, [currentUser.is_flash_active]);

  const fetchFlashProfiles = () => {
    supabase
      .from('profiles')
      .select('id, user_id, display_name, photo_url, specialty, zone, hourly_rate, role')
      .eq('is_flash_active', true)
      .then(({ data }) => {
        setFlashProfiles((data ?? []).map(p => ({
          id: p.user_id || p.id,
          name: p.display_name || 'Profesional',
          photo: p.photo_url || '',
          specialty: p.specialty || '',
          zone: p.zone || 'España',
          price: p.hourly_rate || 0,
          priceUnit: '/hora',
          role: p.role,
        })));
        setLoadingProfiles(false);
      });
  };

  useEffect(() => {
    fetchFlashProfiles();
    const channel = supabase
      .channel('flash_profiles_realtime')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles' }, () => {
        fetchFlashProfiles();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);
  const [freeCountdown, setFreeCountdown] = useState(0);
  const [freeActivatedAt, setFreeActivatedAt] = useState<number | null>(() => {
    const stored = sessionStorage.getItem('flash_free_activated_at');
    return stored ? parseInt(stored, 10) : null;
  });
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [selectedPro, setSelectedPro] = useState<FlashProfile | null>(null);

  useEffect(() => {
    if (isFreeUser && freeActivatedAt !== null) {
      const elapsed = Math.floor((Date.now() - freeActivatedAt) / 1000);
      const remaining = Math.max(0, FREE_DELAY_SECONDS - elapsed);
      setFreeCountdown(remaining);
      if (remaining > 0) {
        countdownRef.current = setInterval(() => {
          const el = Math.floor((Date.now() - (freeActivatedAt ?? Date.now())) / 1000);
          const rem = Math.max(0, FREE_DELAY_SECONDS - el);
          setFreeCountdown(rem);
          if (rem <= 0) {
            clearInterval(countdownRef.current!);
            toast.success('¡Ya eres visible en Flash Booking!');
          }
        }, 1000);
      }
      return () => { if (countdownRef.current) clearInterval(countdownRef.current); };
    }
  }, [freeActivatedAt, isFreeUser]);

  const fmtCountdown = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, '0')}`;
  };

  const toggleFlash = async () => {
    const next = !isFlashActive;
    const ok = await currentUser.updateField({ is_flash_active: next });
    if (!ok) return;
    setIsFlashActive(next);
    if (next && isFreeUser) {
      const now = Date.now();
      sessionStorage.setItem('flash_free_activated_at', String(now));
      setFreeActivatedAt(now);
      toast.info('Eres usuario gratuito — tu perfil será visible en 15 minutos');
    } else if (next) {
      await currentUser.activateTrial();
      toast.success('¡Flash Booking activado! Eres visible ahora');
    } else {
      sessionStorage.removeItem('flash_free_activated_at');
      setFreeActivatedAt(null);
      setFreeCountdown(0);
      if (countdownRef.current) clearInterval(countdownRef.current);
      toast.success('Flash Booking desactivado');
    }
  };

  return (
    <div>
      {!isEmpresario && (
        <div className="glass-panel p-5 mb-5"
          style={{ border: `1px solid ${isFlashActive ? 'rgba(212,175,55,0.3)' : 'var(--nightlife-border)'}` }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap size={20} style={{ color: isFlashActive ? '#D4AF37' : '#8E8EA0' }} />
              <div>
                <p className="text-sm font-bold">Tu disponibilidad</p>
                <p className="text-xs text-muted-foreground">
                  {isFlashActive
                    ? isFreeUser && freeCountdown > 0
                      ? `Visible en ${fmtCountdown(freeCountdown)} (acceso gratuito, 15 min después)`
                      : 'Estás visible para empresarios ahora mismo'
                    : 'Tu perfil no aparece en el feed Flash'}
                </p>
              </div>
            </div>
            <button onClick={toggleFlash} className="transition-all duration-200 hover:scale-105">
              {isFlashActive
                ? <ToggleRight size={40} style={{ color: '#D4AF37' }} />
                : <ToggleLeft size={40} style={{ color: '#8E8EA0' }} />}
            </button>
          </div>
          {isFreeUser && isFlashActive && freeCountdown > 0 && (
            <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
              style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}>
              <Clock size={13} style={{ color: '#D4AF37' }} />
              <span style={{ color: '#D4AF37' }}>
                Los usuarios de pago tienen prioridad. Visible en <strong>{fmtCountdown(freeCountdown)}</strong>.
                <button onClick={() => toast.info('Actualiza tu plan para acceso inmediato.')}
                  className="ml-2 underline font-bold">Actualizar plan</button>
              </span>
            </div>
          )}
        </div>
      )}

      {isEmpresario && (
        <div className="glass-panel p-4 mb-5 flex items-center gap-3"
          style={{ border: '1px solid rgba(212,175,55,0.15)' }}>
          <AlertTriangle size={14} style={{ color: '#D4AF37' }} />
          <p className="text-xs text-muted-foreground">
            Como empresario puedes ver los profesionales disponibles. Usa la tab <strong>Demanda</strong> para publicar tus propias ofertas.
          </p>
        </div>
      )}

      <div className="flex items-center gap-2 mb-4">
        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{ background: '#D4AF37', boxShadow: '0 0 8px rgba(212,175,55,0.8)' }} />
        <span className="text-xs font-bold" style={{ color: '#D4AF37' }}>Profesionales disponibles ahora</span>
        <span className="text-xs text-muted-foreground">({flashProfiles.length})</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loadingProfiles && Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-panel p-4 animate-pulse">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex-shrink-0" />
              <div className="flex-1">
                <div className="h-3 bg-white/5 rounded mb-1.5 w-3/4" />
                <div className="h-2 bg-white/5 rounded w-1/2" />
              </div>
            </div>
            <div className="flex gap-3 mb-3">
              <div className="h-2 bg-white/5 rounded w-1/3" />
              <div className="h-2 bg-white/5 rounded w-1/4" />
            </div>
            <div className="flex justify-between items-center">
              <div className="h-4 bg-white/5 rounded w-1/4" />
              <div className="h-7 bg-white/5 rounded-lg w-20" />
            </div>
          </div>
        ))}
        {!loadingProfiles && flashProfiles.map(p => (
          <div key={p.id} className="glass-panel p-4 flex flex-col gap-3 transition-all hover:border-amber-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center text-sm font-bold relative"
                style={{ border: '1px solid rgba(212,175,55,0.35)', background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
                {p.photo ? <img src={p.photo} alt={p.name} className="w-full h-full object-cover" /> : p.name.charAt(0)}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-black"
                  style={{ background: '#D4AF37', boxShadow: '0 0 6px rgba(212,175,55,0.8)' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{p.name}</p>
                <p className="text-xs text-muted-foreground truncate">{p.specialty}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin size={11} /> {p.zone}</span>
              <span className="flex items-center gap-1"><Clock size={11} /> Ahora</span>
            </div>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-sm font-bold" style={{ color: '#D4AF37' }}>
                {isEmpresario
                  ? (p.price > 0 ? `€${p.price}${p.priceUnit}` : 'A consultar')
                  : <span className="text-xs font-medium" style={{ color: '#555' }}>Tarifa privada</span>}
              </span>
              {isEmpresario ? (
                <button onClick={() => setSelectedPro(p)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                  <Zap size={12} /> Solicitar
                </button>
              ) : (
                <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.35)' }}>
                  <Lock size={10} /> Solo empresarios
                </span>
              )}
            </div>
          </div>
        ))}
        {!loadingProfiles && flashProfiles.length === 0 && (
          <div className="col-span-full glass-panel p-10 flex flex-col items-center text-center gap-3">
            <div className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.1)' }}>
              <Zap size={24} style={{ color: 'rgba(212,175,55,0.2)' }} />
            </div>
            <div>
              <p className="text-sm font-bold mb-1.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Ningún profesional disponible ahora
              </p>
              <p className="text-xs text-muted-foreground max-w-[280px] mx-auto leading-relaxed">
                {isEmpresario
                  ? 'Los profesionales activarán su disponibilidad cuando busquen trabajo. Publica una oferta en la tab Demanda para ir más rápido.'
                  : 'Activa tu disponibilidad con el toggle de arriba para que los empresarios puedan encontrarte.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {selectedPro && (
        <FlashBookingRequestModal
          professionalName={selectedPro.name}
          professionalRole={selectedPro.role}
          professionalUserId={selectedPro.id}
          onClose={() => setSelectedPro(null)}
        />
      )}
    </div>
  );
};

export default OfertaTab;
