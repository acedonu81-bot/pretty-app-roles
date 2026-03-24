import { useState, useEffect, useRef } from 'react';
import { Radio, Mic, MicOff, Volume2, Users, TrendingUp, Send, Zap, Crown, Star, Eye } from 'lucide-react';

const genres = ['Techno', 'House', 'Trance', 'Drum & Bass', 'Minimal'];

const fakeBids = [
  { id: 1, promoter: 'Onyx Club Madrid', avatar: 'ON', gradient: 'linear-gradient(135deg,#00ff88,#00b8ff)', amount: 1200, status: 'new' },
  { id: 2, promoter: 'Horizon Rooftop BCN', avatar: 'HZ', gradient: 'linear-gradient(135deg,#8c52ff,#ff5f56)', amount: 900, status: 'new' },
  { id: 3, promoter: 'Noxe Valencia', avatar: 'NX', gradient: 'linear-gradient(135deg,#f472b6,#a855f7)', amount: 750, status: 'pending' },
];

const fakeChat = [
  { user: 'DJ_Mara_92', text: '🔥🔥🔥 Qué set!!', color: '#00ff88' },
  { user: 'PromoterKing', text: 'Interesado para Ibiza julio', color: '#8c52ff' },
  { user: 'BassBunny', text: 'DROP INCOMING 💣', color: '#00e5ff' },
  { user: 'NightOwl_VLC', text: 'Suena brutal, ¿tracklist?', color: '#ffbc00' },
  { user: 'TechnoVibes', text: 'Esto es otro nivel 🚀', color: '#f472b6' },
];

const EQBar = ({ delay, height }: { delay: number; height: number }) => (
  <div
    className="w-1.5 rounded-full"
    style={{
      background: 'linear-gradient(180deg, hsl(var(--primary)), hsl(var(--secondary)))',
      height: `${height}%`,
      animation: `eqBar 0.4s ${delay}s ease-in-out infinite alternate`,
      boxShadow: '0 0 6px hsla(var(--primary) / 0.4)',
    }}
  />
);

const LiveStreamView = () => {
  const [isLive, setIsLive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [viewers, setViewers] = useState(0);
  const [chatMessages, setChatMessages] = useState(fakeChat);
  const [chatInput, setChatInput] = useState('');
  const [bids, setBids] = useState(fakeBids);
  const [eqHeights, setEqHeights] = useState<number[]>(Array(24).fill(30));
  const [selectedGenre, setSelectedGenre] = useState('Techno');
  const [volume, setVolume] = useState(75);
  const [bass, setBass] = useState(60);
  const [treble, setTreble] = useState(50);
  const [elapsed, setElapsed] = useState(0);
  const chatRef = useRef<HTMLDivElement>(null);

  // Animate EQ bars
  useEffect(() => {
    if (!isLive) return;
    const iv = setInterval(() => {
      setEqHeights(prev => prev.map(() => 20 + Math.random() * 80));
    }, 150);
    return () => clearInterval(iv);
  }, [isLive]);

  // Simulate viewers
  useEffect(() => {
    if (!isLive) { setViewers(0); return; }
    setViewers(42);
    const iv = setInterval(() => {
      setViewers(v => Math.max(10, v + Math.floor(Math.random() * 11) - 4));
    }, 3000);
    return () => clearInterval(iv);
  }, [isLive]);

  // Auto chat
  useEffect(() => {
    if (!isLive) return;
    const phrases = ['🔥 Brutal!', 'Más techno!', 'DROP! 💣', 'Quiero booking!', '👏👏👏', 'Ibiza vibes 🌴', 'Esa transición 🎧', 'NEXT LEVEL'];
    const users = ['NightRider', 'BeatJunkie', 'ClubQueen', 'RaveKid_22', 'DeepSoul'];
    const colors = ['#00ff88', '#8c52ff', '#00e5ff', '#ffbc00', '#ff5f56'];
    const iv = setInterval(() => {
      setChatMessages(prev => [
        ...prev.slice(-30),
        { user: users[Math.floor(Math.random() * users.length)], text: phrases[Math.floor(Math.random() * phrases.length)], color: colors[Math.floor(Math.random() * colors.length)] },
      ]);
    }, 2500);
    return () => clearInterval(iv);
  }, [isLive]);

  // Elapsed timer
  useEffect(() => {
    if (!isLive) { setElapsed(0); return; }
    const iv = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(iv);
  }, [isLive]);

  // Auto-scroll chat
  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [chatMessages]);

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const sendChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { user: 'Tú (DJ Aethel)', text: chatInput, color: '#ffffff' }]);
    setChatInput('');
  };

  const acceptBid = (id: number) => {
    setBids(prev => prev.map(b => b.id === id ? { ...b, status: 'accepted' } : b));
  };

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-extrabold mb-1">
            Streaming <span className="text-gradient">EN VIVO</span>
          </h2>
          <p className="text-muted-foreground">DJ Deck + Showcase en directo para promotores.</p>
        </div>
        <button
          onClick={() => setIsLive(!isLive)}
          className="flex items-center gap-2 px-6 py-3 rounded-full font-extrabold text-sm transition-all duration-300"
          style={{
            background: isLive ? 'linear-gradient(90deg, hsl(var(--destructive)), #ff2d2d)' : 'linear-gradient(90deg, hsl(var(--primary)), #6b21ff)',
            color: 'white',
            boxShadow: isLive ? '0 0 25px hsla(var(--destructive) / 0.5)' : '0 0 25px hsla(var(--primary) / 0.5)',
          }}
        >
          <Radio size={18} className={isLive ? 'animate-pulse' : ''} />
          {isLive ? 'DETENER STREAM' : 'INICIAR EN VIVO'}
        </button>
      </div>

      {/* Live indicator bar */}
      {isLive && (
        <div className="flex items-center gap-4 mb-5 px-5 py-3 rounded-xl" style={{ background: 'rgba(255,95,86,0.08)', border: '1px solid rgba(255,95,86,0.25)' }}>
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: 'hsl(var(--destructive))' }} />
            <span className="relative inline-flex rounded-full h-3 w-3" style={{ background: 'hsl(var(--destructive))' }} />
          </span>
          <span className="text-sm font-extrabold" style={{ color: 'hsl(var(--destructive))' }}>EN VIVO</span>
          <span className="text-xs text-muted-foreground">{formatTime(elapsed)}</span>
          <div className="flex items-center gap-1 ml-auto text-sm text-muted-foreground">
            <Eye size={14} /> <span className="font-bold" style={{ color: 'hsl(var(--secondary))' }}>{viewers}</span> espectadores
          </div>
        </div>
      )}

      <div className="grid grid-cols-[1fr_340px] gap-5" style={{ height: 'calc(70vh - 40px)' }}>
        {/* Left: DJ Deck */}
        <div className="flex flex-col gap-5">
          {/* EQ Visualizer */}
          <div className="glass-panel p-6 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Zap size={18} style={{ color: 'hsl(var(--accent))' }} />
                <span className="text-sm font-extrabold uppercase tracking-wider">Ecualizador</span>
              </div>
              <div className="flex items-center gap-2">
                {genres.map(g => (
                  <button
                    key={g}
                    onClick={() => setSelectedGenre(g)}
                    className="px-3 py-1 rounded-full text-[0.7rem] font-bold transition-all"
                    style={{
                      background: selectedGenre === g ? 'hsla(var(--primary) / 0.25)' : 'hsla(0 0% 100% / 0.04)',
                      color: selectedGenre === g ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                      border: `1px solid ${selectedGenre === g ? 'hsla(var(--primary) / 0.4)' : 'transparent'}`,
                    }}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* EQ Bars */}
            <div className="flex-1 flex items-end justify-center gap-1.5 px-4 py-2 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
              {eqHeights.map((h, i) => (
                <div
                  key={i}
                  className="w-2 rounded-full transition-all duration-150"
                  style={{
                    height: isLive ? `${h}%` : '15%',
                    background: `linear-gradient(180deg, hsl(var(--primary)), hsl(var(--secondary)))`,
                    opacity: isLive ? 0.9 : 0.2,
                    boxShadow: isLive ? '0 0 8px hsla(var(--primary) / 0.3)' : 'none',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="glass-panel p-5">
            <div className="grid grid-cols-3 gap-6">
              {/* Volume */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Volume2 size={14} style={{ color: 'hsl(var(--secondary))' }} />
                  <span className="text-xs font-bold text-muted-foreground">VOLUMEN</span>
                  <span className="text-xs font-extrabold ml-auto" style={{ color: 'hsl(var(--secondary))' }}>{volume}%</span>
                </div>
                <input type="range" min={0} max={100} value={volume} onChange={e => setVolume(+e.target.value)}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(90deg, hsl(var(--secondary)) ${volume}%, rgba(255,255,255,0.08) ${volume}%)` }}
                />
              </div>
              {/* Bass */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold text-muted-foreground">BASS</span>
                  <span className="text-xs font-extrabold ml-auto" style={{ color: 'hsl(var(--primary))' }}>{bass}%</span>
                </div>
                <input type="range" min={0} max={100} value={bass} onChange={e => setBass(+e.target.value)}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(90deg, hsl(var(--primary)) ${bass}%, rgba(255,255,255,0.08) ${bass}%)` }}
                />
              </div>
              {/* Treble */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold text-muted-foreground">TREBLE</span>
                  <span className="text-xs font-extrabold ml-auto" style={{ color: 'hsl(var(--accent))' }}>{treble}%</span>
                </div>
                <input type="range" min={0} max={100} value={treble} onChange={e => setTreble(+e.target.value)}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(90deg, hsl(var(--accent)) ${treble}%, rgba(255,255,255,0.08) ${treble}%)` }}
                />
              </div>
            </div>

            {/* Mic toggle */}
            <div className="flex items-center gap-3 mt-4 pt-4" style={{ borderTop: '1px solid var(--nightlife-border)' }}>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all"
                style={{
                  background: isMuted ? 'rgba(255,95,86,0.1)' : 'hsla(var(--accent) / 0.1)',
                  border: `1px solid ${isMuted ? 'rgba(255,95,86,0.3)' : 'hsla(var(--accent) / 0.3)'}`,
                  color: isMuted ? 'hsl(var(--destructive))' : 'hsl(var(--accent))',
                }}
              >
                {isMuted ? <MicOff size={14} /> : <Mic size={14} />}
                {isMuted ? 'MIC APAGADO' : 'MIC ACTIVO'}
              </button>
              <span className="text-xs text-muted-foreground ml-auto">Género: <span className="font-bold text-foreground">{selectedGenre}</span></span>
            </div>
          </div>
        </div>

        {/* Right: Chat + Bids */}
        <div className="flex flex-col gap-5">
          {/* Promoter Bids */}
          <div className="glass-panel p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={16} style={{ color: 'hsl(var(--accent))' }} />
              <span className="text-xs font-extrabold uppercase tracking-wider">Pujas de Promotores</span>
            </div>
            <div className="flex flex-col gap-2 max-h-[180px] overflow-y-auto">
              {bids.map(bid => (
                <div key={bid.id} className="flex items-center gap-3 p-3 rounded-xl transition-all" style={{
                  background: bid.status === 'accepted' ? 'hsla(var(--accent) / 0.08)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${bid.status === 'accepted' ? 'hsla(var(--accent) / 0.3)' : 'var(--nightlife-border)'}`,
                }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-[0.6rem] font-black flex-shrink-0"
                    style={{ background: bid.gradient, color: bid.id === 1 ? '#000' : '#fff' }}>
                    {bid.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate">{bid.promoter}</p>
                    <p className="text-[0.7rem] font-extrabold" style={{ color: 'hsl(var(--accent))' }}>€{bid.amount}</p>
                  </div>
                  {bid.status === 'accepted' ? (
                    <span className="text-[0.6rem] font-extrabold px-2 py-1 rounded-full" style={{ background: 'hsla(var(--accent) / 0.15)', color: 'hsl(var(--accent))' }}>
                      ✓ ACEPTADA
                    </span>
                  ) : (
                    <button
                      onClick={() => acceptBid(bid.id)}
                      className="text-[0.6rem] font-extrabold px-3 py-1 rounded-full transition-all hover:scale-105"
                      style={{ background: 'hsla(var(--primary) / 0.2)', color: 'hsl(var(--primary))', border: '1px solid hsla(var(--primary) / 0.4)' }}
                    >
                      ACEPTAR
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Live Chat */}
          <div className="glass-panel p-4 flex-1 flex flex-col min-h-0">
            <div className="flex items-center gap-2 mb-3">
              <Users size={16} style={{ color: 'hsl(var(--primary))' }} />
              <span className="text-xs font-extrabold uppercase tracking-wider">Chat en Directo</span>
              {isLive && <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded-full ml-auto" style={{ background: 'hsla(var(--accent) / 0.15)', color: 'hsl(var(--accent))' }}>{viewers} online</span>}
            </div>
            <div ref={chatRef} className="flex-1 overflow-y-auto flex flex-col gap-1.5 mb-3 min-h-0">
              {chatMessages.map((msg, i) => (
                <div key={i} className="text-xs px-3 py-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <span className="font-extrabold mr-1.5" style={{ color: msg.color }}>{msg.user}</span>
                  <span className="text-muted-foreground">{msg.text}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendChat()}
                placeholder="Escribe en el chat..."
                className="nightlife-input flex-1 text-xs !py-2"
              />
              <button onClick={sendChat} className="px-3 rounded-lg" style={{ background: 'hsla(var(--primary) / 0.2)', border: '1px solid hsla(var(--primary) / 0.4)', color: 'hsl(var(--primary))' }}>
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStreamView;
