import { useState, useEffect, useRef } from 'react';
import { Radio, Send, Eye, MessageCircle, MessageSquare, ExternalLink, Crown } from 'lucide-react';
import { toast } from 'sonner';
import { profiles } from '@/data/profiles';
import { useProfile } from '@/hooks/useProfile';
import { normalizeStreamUrl, parseStreamUrl } from '@/lib/streaming';
import { sanitizeInput } from '@/lib/contentFilter';


// Chat starts empty — messages accumulate from live viewers and sendChat()
const fakeChat: { user: string; text: string; color: string }[] = [];

const EscenarioVirtualView = () => {
  const profile = useProfile();
  const [isLive, setIsLive] = useState(false);
  const [chatMessages, setChatMessages] = useState(fakeChat);
  const [chatInput, setChatInput] = useState('');
  const [viewers, setViewers] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [eqHeights, setEqHeights] = useState<number[]>(Array(20).fill(20));
  const [streamUrl, setStreamUrl] = useState(profile.stream_url ?? '');
  const [streamTitle, setStreamTitle] = useState(profile.stream_title ?? '');
  const [savingStream, setSavingStream] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setStreamUrl(profile.stream_url ?? '');
    setStreamTitle(profile.stream_title ?? '');
  }, [profile.stream_url, profile.stream_title]);

  const normalizedStreamUrl = normalizeStreamUrl(streamUrl);
  const streamEmbed = parseStreamUrl(normalizedStreamUrl);

  useEffect(() => {
    if (!isLive) return;
    const iv = setInterval(() => setEqHeights(Array(20).fill(0).map(() => 15 + Math.random() * 85)), 150);
    return () => clearInterval(iv);
  }, [isLive]);

  useEffect(() => {
    if (!isLive) { setViewers(0); return; }
    setViewers(28);
    const iv = setInterval(() => setViewers(v => Math.max(5, v + Math.floor(Math.random() * 9) - 3)), 3000);
    return () => clearInterval(iv);
  }, [isLive]);

  useEffect(() => {
    if (!isLive) { setElapsed(0); return; }
    const iv = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(iv);
  }, [isLive]);

  useEffect(() => {
    if (!isLive) return;
    const phrases = ['🔥 Brutal!', 'Quiero booking!', '👏👏👏', 'Esa transición 🎧', 'Contacta conmigo!', 'DROP! 💣'];
    const users = ['NightRider', 'BeatJunkie', 'ClubQueen', 'PromoMadrid', 'DeepSoul'];
    const colors = ['#D4AF37', '#8E8EA0'];
    const iv = setInterval(() => {
      setChatMessages(prev => [...prev.slice(-40), {
        user: users[Math.floor(Math.random() * users.length)],
        text: phrases[Math.floor(Math.random() * phrases.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
      }]);
    }, 2800);
    return () => clearInterval(iv);
  }, [isLive]);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [chatMessages]);

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const sendChat = () => {
    if (!chatInput.trim()) return;
    const { clean, reason } = sanitizeInput(chatInput);
    if (!clean) { toast.error(reason); return; }
    setChatMessages(prev => [...prev, { user: 'Tú', text: chatInput, color: '#ffffff' }]);
    setChatInput('');
  };

  const handleSaveStream = async () => {
    const trimmedUrl = streamUrl.trim();

    if (trimmedUrl && !streamEmbed) {
      toast.error('La URL no es compatible. Usa Twitch, YouTube Live o Mixcloud.');
      return;
    }

    setSavingStream(true);
    await profile.updateField({
      stream_url: trimmedUrl ? normalizedStreamUrl : null,
      stream_title: streamTitle.trim() || null,
    });
    setSavingStream(false);
    toast.success('Ajustes del directo guardados.');
  };

  const toggleLive = async () => {
    if (streamUrl.trim() && !streamEmbed) {
      toast.error('La URL del streaming no es válida para incrustar el vídeo.');
      return;
    }
    const newLive = !isLive;
    setIsLive(newLive);
    // Persist is_live to DB
    await profile.updateField({ is_live: newLive });
    toast.success(newLive ? '¡Estás en directo!' : 'Has salido del directo.');
  };

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      {/* Top global streamer banner */}
      {(() => {
        const topGlobal = [...profiles].filter(p => p.isLive || p.streamUrl).sort((a, b) => b.profileViews - a.profileViews)[0];
        if (!topGlobal) return null;
        return (
          <div className="glass-panel p-3 mb-4 flex items-center gap-3" style={{ border: '1px solid rgba(212,175,55,0.15)' }}>
            <Crown size={16} style={{ color: '#D4AF37' }} />
            <span className="text-xs font-bold" style={{ color: '#D4AF37' }}>Más visto ahora:</span>
            <span className="text-xs font-semibold">{topGlobal.name}</span>
            <span className="text-[0.6rem] text-muted-foreground">— {topGlobal.specialty}</span>
            <span className="ml-auto text-[0.6rem] flex items-center gap-1 text-muted-foreground">
              <Eye size={10} /> {topGlobal.profileViews.toLocaleString()}
            </span>
          </div>
        );
      })()}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 gap-3">
        <div>
          <h2 className="text-2xl font-bold mb-1">
            Escenario <span className="text-gradient">Virtual</span>
          </h2>
          <p className="text-sm text-muted-foreground">Emite en directo y conecta con empresarios en tiempo real.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button onClick={() => setShowUrlInput(!showUrlInput)}
            className="flex items-center gap-2 px-4 py-3 rounded-lg font-bold text-xs transition-all duration-200"
            style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', color: '#D4AF37' }}>
            <ExternalLink size={14} /> Stream URL
          </button>
          <button onClick={toggleLive}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition-all duration-300 flex-1 sm:flex-initial justify-center"
            style={{
              background: isLive ? 'linear-gradient(90deg, #ff5f56, #ff2d2d)' : 'linear-gradient(90deg, #D4AF37, #B8941E)',
              color: isLive ? 'white' : '#000',
            }}>
            <Radio size={16} className={isLive ? 'animate-pulse' : ''} />
            {isLive ? 'DETENER' : 'EN VIVO'}
          </button>
        </div>
      </div>

      {showUrlInput && (
        <div className="glass-panel p-4 mb-4 animate-[fadeIn_0.3s_ease]">
          <p className="text-xs font-bold mb-2 flex items-center gap-2">
            <ExternalLink size={12} style={{ color: '#D4AF37' }} /> Introduce tu URL de streaming
          </p>
          <p className="text-[0.6rem] text-muted-foreground mb-3">Soporta Twitch, YouTube Live y Mixcloud</p>
          <input value={streamTitle} onChange={e => setStreamTitle(e.target.value)}
            placeholder="Título del directo" className="nightlife-input text-sm !py-2.5 mb-2" />
          <input value={streamUrl} onChange={e => setStreamUrl(e.target.value)}
            placeholder="https://twitch.tv/tu_canal o https://youtube.com/live/..." className="nightlife-input text-sm !py-2.5" />
          {streamEmbed && (
            <p className="text-[0.6rem] mt-2 font-bold" style={{ color: '#22c55e' }}>✓ {streamEmbed.type} detectado</p>
          )}
          <button
            onClick={handleSaveStream}
            disabled={savingStream}
            className="mt-3 w-full rounded-lg border border-border bg-card px-4 py-2 text-xs font-bold text-primary transition-opacity disabled:opacity-60"
          >
            {savingStream ? 'Guardando...' : 'Guardar ajustes del directo'}
          </button>
        </div>
      )}

      {isLive && (
        <div className="flex items-center gap-3 mb-4 px-4 py-2 rounded-lg" style={{ background: 'rgba(255,95,86,0.06)', border: '1px solid rgba(255,95,86,0.2)' }}>
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#ff5f56' }} />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background: '#ff5f56' }} />
          </span>
          <span className="text-xs font-bold" style={{ color: '#ff5f56' }}>EN VIVO</span>
          <span className="text-xs text-muted-foreground">{formatTime(elapsed)}</span>
          <div className="flex items-center gap-1 ml-auto text-xs text-muted-foreground">
            <Eye size={12} /> <span className="font-semibold" style={{ color: '#D4AF37' }}>{viewers}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4" style={{ minHeight: '55vh' }}>
        <div className="flex flex-col gap-4">
          <div className="glass-panel p-5">
            <div className="relative w-full rounded-lg overflow-hidden" style={{ background: 'rgba(0,0,0,0.6)', aspectRatio: '16/9' }}>
              {streamEmbed && isLive ? (
                <iframe src={streamEmbed.embedUrl} className="absolute inset-0 w-full h-full" allowFullScreen allow="autoplay; encrypted-media" sandbox="allow-scripts allow-same-origin allow-presentation" style={{ border: 'none' }} />
              ) : isLive ? (
                <div className="absolute inset-0 flex items-end justify-center gap-1 p-6">
                  {eqHeights.map((h, i) => (
                    <div key={i} className="w-2.5 rounded-full transition-all duration-150"
                      style={{ height: `${h}%`, background: 'linear-gradient(180deg, #D4AF37, #B8941E)', opacity: Math.max(0.3, h / 100) }} />
                  ))}
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.15)' }}>
                    <Radio size={26} style={{ color: 'rgba(212,175,55,0.5)' }} />
                  </div>
                  <p className="text-sm text-muted-foreground">Pulsa <span className="font-bold text-primary">EN VIVO</span> para comenzar</p>
                  {profile.stream_title && <p className="text-[0.65rem] font-semibold text-primary">{profile.stream_title}</p>}
                  {!streamUrl && (
                    <p className="text-[0.6rem] text-muted-foreground mt-1">Configura tu URL de streaming con el botón <span className="font-bold">Stream URL</span></p>
                  )}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => toast.info('Usa Mensajes para contactar directamente.')}
              className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition-all duration-200 hover:scale-[1.01]"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              <MessageCircle size={18} /> Enviar mensaje
            </button>
          </div>
        </div>

        <div className="glass-panel p-3 flex flex-col min-h-0">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare size={14} style={{ color: '#D4AF37' }} />
            <span className="text-[0.6rem] font-bold uppercase tracking-wider">Chat en Directo</span>
            {isLive && (
              <span className="text-[0.5rem] font-semibold px-1.5 py-0.5 rounded ml-auto" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37' }}>
                {viewers} online
              </span>
            )}
          </div>
          <div ref={chatRef} className="flex-1 overflow-y-auto flex flex-col gap-1 mb-2 min-h-0">
            {chatMessages.map((msg, i) => (
              <div key={i} className="text-xs px-2 py-1.5 rounded" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <span className="font-bold mr-1" style={{ color: msg.color }}>{msg.user}</span>
                <span className="text-muted-foreground">{msg.text}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendChat()}
              placeholder="Escribe..." className="nightlife-input flex-1 text-xs !py-2" />
            <button onClick={sendChat} className="px-3 rounded-lg" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', color: '#D4AF37' }}>
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EscenarioVirtualView;
