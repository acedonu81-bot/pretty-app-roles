import { Search, LogOut, Menu, Bell, Volume2, VolumeX } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface TopbarProps {
  onMenuToggle?: () => void;
  isMobile?: boolean;
}

// High quality tech house stream (320kbps)
const MUSIC_URL = 'https://stream.laut.fm/techhouse';

const DashboardTopbar = ({ onMenuToggle, isMobile }: TopbarProps) => {
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(MUSIC_URL);
      audioRef.current.volume = 0.35;
      audioRef.current.addEventListener('error', () => {
        // Fallback stream if primary fails
        if (audioRef.current) {
          audioRef.current.src = 'https://stream.laut.fm/deephouse';
          audioRef.current.play().catch(() => {});
        }
      });
    }
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <header
      className="h-14 px-4 md:px-6 flex items-center justify-between sticky top-0 z-10 gap-3"
      style={{
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--nightlife-border)',
      }}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {isMobile && (
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-lg flex-shrink-0 transition-colors"
            style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', color: '#D4AF37' }}
          >
            <Menu size={20} />
          </button>
        )}

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg flex-1 max-w-[360px]" style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid var(--nightlife-border)',
        }}>
          <Search size={14} className="text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            placeholder={isMobile ? 'Buscar...' : 'Buscar por zona, rol o nombre...'}
            className="bg-transparent border-none outline-none text-foreground w-full text-xs"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 relative flex-shrink-0">
        {/* Music player */}
        <button
          onClick={toggleMusic}
          className="p-2 rounded-lg transition-all duration-200 hover:scale-105"
          style={{
            background: isPlaying ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.04)',
            border: isPlaying ? '1px solid rgba(212,175,55,0.25)' : '1px solid var(--nightlife-border)',
            color: isPlaying ? '#D4AF37' : 'var(--nightlife-text-secondary)',
          }}
          title={isPlaying ? 'Pausar Tech House' : 'Reproducir Tech House'}
        >
          {isPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>

        {/* Notifications */}
        <button
          onClick={() => setShowNotif(!showNotif)}
          className="relative p-2 rounded-lg transition-all duration-200 hover:scale-105"
          style={{
            background: 'rgba(212,175,55,0.08)',
            border: '1px solid rgba(212,175,55,0.15)',
            color: '#D4AF37',
          }}
        >
          <Bell size={16} />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full" style={{ background: '#D4AF37' }} />
        </button>

        {showNotif && (
          <div className="glass-panel absolute top-12 right-0 w-[300px] z-50" style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.8)' }}>
            <div className="p-3 flex justify-between items-center" style={{ borderBottom: '1px solid var(--nightlife-border)' }}>
              <h4 className="text-xs font-bold">Notificaciones</h4>
              <span className="text-[0.6rem] cursor-pointer" style={{ color: '#D4AF37' }}>Marcar leídas</span>
            </div>
            <div className="max-h-60 overflow-y-auto">
              {[
                { title: 'Nuevo contacto WhatsApp', desc: 'Club Onyx ha visto tu perfil y te ha contactado.', time: 'Hace 2 min' },
                { title: 'Flash Booking activado', desc: 'Tu perfil aparece como disponible ahora.', time: 'Hace 1 hora' },
                { title: 'Rotación Elite', desc: 'Tu perfil ha sido mostrado 47 veces esta hora.', time: 'Hace 3 hrs' },
              ].map((n, i) => (
                <div key={i} className="px-3 py-2.5 flex gap-2 items-start cursor-pointer transition-colors hover:bg-white/5" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#D4AF37' }} />
                  <div>
                    <p className="text-xs font-semibold">{n.title}</p>
                    <p className="text-[0.65rem] text-muted-foreground">{n.desc}</p>
                    <span className="text-[0.55rem] text-muted-foreground mt-0.5 block">{n.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => navigate('/')}
          className="text-xs py-1.5 px-3 flex items-center gap-2 rounded-lg transition-colors"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--nightlife-border)', color: 'var(--nightlife-text-secondary)' }}
        >
          <LogOut size={13} /> {!isMobile && 'Salir'}
        </button>
      </div>
    </header>
  );
};

export default DashboardTopbar;
