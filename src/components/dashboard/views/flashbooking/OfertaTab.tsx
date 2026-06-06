import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, MapPin, ToggleLeft, ToggleRight, AlertTriangle } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import FlashBookingRequestModal from '@/components/dashboard/FlashBookingRequestModal';

interface FlashProfile {
  id: string;
  name: string;
  photo: string;
  specialty: string;
  zone: string;
  price: number;
  priceUnit: string;
  role: string;
  photoError?: boolean;
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { y: 32, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

const OfertaTab = () => {
  const currentUser = useProfile();
  const isEmpresario = currentUser.role === 'empresario';

  const [flashProfiles, setFlashProfiles] = useState<FlashProfile[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [isFlashActive, setIsFlashActive] = useState(() => currentUser.is_flash_active ?? false);
  const [selectedPro, setSelectedPro] = useState<FlashProfile | null>(null);

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

  const toggleFlash = async () => {
    const next = !isFlashActive;
    const ok = await currentUser.updateField({ is_flash_active: next });
    if (!ok) return;
    setIsFlashActive(next);
    toast.success(next ? '¡Flash Booking activado! Eres visible ahora' : 'Flash Booking desactivado');
  };

  return (
    <div>
      {!isEmpresario && (
        <div
          className="glass-panel p-5 mb-5"
          style={{ border: `1px solid ${isFlashActive ? 'rgba(212,175,55,0.3)' : 'var(--nightlife-border)'}` }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap size={20} style={{ color: isFlashActive ? '#D4AF37' : '#8E8EA0' }} />
              <div>
                <p className="text-sm font-bold">Tu disponibilidad</p>
                <p className="text-xs text-muted-foreground">
                  {isFlashActive
                    ? 'Estás visible para empresarios ahora mismo'
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
        </div>
      )}

      {isEmpresario && (
        <div
          className="glass-panel p-4 mb-5 flex items-center gap-3"
          style={{ border: '1px solid rgba(212,175,55,0.15)' }}
        >
          <AlertTriangle size={14} style={{ color: '#D4AF37' }} />
          <p className="text-xs text-muted-foreground">
            Como empresario puedes ver los profesionales disponibles. Usa la tab <strong>Demanda</strong> para publicar tus propias ofertas.
          </p>
        </div>
      )}

      <div className="flex items-center gap-2 mb-4">
        <span
          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{ background: '#D4AF37', boxShadow: '0 0 8px rgba(212,175,55,0.8)' }}
        />
        <span className="text-xs font-bold" style={{ color: '#D4AF37' }}>Profesionales disponibles ahora</span>
        <span className="text-xs text-muted-foreground">({flashProfiles.length})</span>
      </div>

      {loadingProfiles && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="glass-panel animate-pulse rounded-2xl"
              style={{ aspectRatio: '3/4' }}
            />
          ))}
        </div>
      )}

      {!loadingProfiles && flashProfiles.length > 0 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {flashProfiles.map(p => (
              <motion.div
                key={p.id}
                variants={cardVariants}
                exit={cardVariants.exit}
                whileHover={{ scale: 1.02 }}
                layout
                style={{
                  aspectRatio: '3/4',
                  borderRadius: 16,
                  border: '1px solid rgba(212,175,55,0.25)',
                  boxShadow: '0 24px 56px rgba(0,0,0,0.70)',
                  overflow: 'hidden',
                  position: 'relative',
                  cursor: 'pointer',
                }}
              >
                {p.photo && !p.photoError ? (
                  <img
                    src={p.photo}
                    alt={p.name}
                    style={{
                      width: '100%', height: '100%',
                      objectFit: 'cover',
                      position: 'absolute', inset: 0,
                      filter: 'saturate(0.75) brightness(0.85)',
                    }}
                    onError={() => setFlashProfiles(prev =>
                      prev.map(x => x.id === p.id ? { ...x, photoError: true } : x)
                    )}
                  />
                ) : (
                  <div style={{
                    width: '100%', height: '100%',
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(135deg, #D4AF37, #B8941E)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 48, fontWeight: 700, color: '#000',
                  }}>
                    {p.name.charAt(0)}
                  </div>
                )}

                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.50) 45%, transparent 70%)',
                }} />

                <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 10, color: '#D4AF37', letterSpacing: '0.15em' }}>
                    XPEAK
                  </span>
                  <motion.span
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.6, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: '#D4AF37',
                      boxShadow: '0 0 6px rgba(212,175,55,0.8)',
                      display: 'inline-block',
                    }}
                  />
                </div>

                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16 }}>
                  <p style={{
                    fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 13,
                    color: '#D4AF37', letterSpacing: '0.06em',
                    textTransform: 'uppercase', marginBottom: 2,
                  }}>
                    {p.specialty || p.role}
                  </p>
                  <p style={{ fontWeight: 600, fontSize: 15, color: 'rgba(255,255,255,0.95)', marginBottom: 6 }}>
                    {p.name}
                  </p>
                  <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'rgba(255,255,255,0.50)', marginBottom: 12 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <MapPin size={10} /> {p.zone}
                    </span>
                    <span>· Ahora</span>
                  </div>
                  <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: '#D4AF37' }}>
                      {isEmpresario
                        ? (p.price > 0 ? `€${p.price}${p.priceUnit}` : 'A consultar')
                        : <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', fontWeight: 400 }}>Tarifa privada</span>}
                    </span>
                    {isEmpresario ? (
                      <button
                        onClick={e => { e.stopPropagation(); setSelectedPro(p); }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 5,
                          padding: '6px 14px', borderRadius: 8,
                          fontWeight: 700, fontSize: 12,
                          background: 'linear-gradient(90deg, #D4AF37, #B8941E)',
                          color: '#000', border: 'none', cursor: 'pointer',
                        }}
                      >
                        <Zap size={11} /> Solicitar
                      </button>
                    ) : (
                      <span style={{
                        fontSize: 11, color: 'rgba(255,255,255,0.25)', fontWeight: 500,
                        padding: '4px 10px', borderRadius: 6,
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}>
                        Solo empresarios
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {!loadingProfiles && flashProfiles.length === 0 && (
        <div className="glass-panel p-10 flex flex-col items-center text-center gap-3">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.1)' }}
          >
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
