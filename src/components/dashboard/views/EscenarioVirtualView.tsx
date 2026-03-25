import { useState, useEffect, useRef } from 'react';
import { Radio, Send, Users, Eye, MessageSquare, Phone } from 'lucide-react';

const fakeChat = [
  { user: 'PromoterKing', text: 'Interesado para Ibiza julio', color: '#8c52ff' },
  { user: 'ClubManager_BCN', text: 'Buen set, hablamos?', color: '#00e5ff' },
  { user: 'NightOwl_VLC', text: '🔥🔥🔥 Brutal!', color: '#ffbc00' },
  { user: 'DJ_Mara_92', text: 'Qué temazo!!', color: '#00ff88' },
];

const EscenarioVirtualView = () => {
  const [isLive, setIsLive] = useState(false);
  const [chatMessages, setChatMessages] = useState(fakeChat);
  const [chatInput, setChatInput] = useState('');
  const [viewers, setViewers] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [eqHeights, setEqHeights] = useState<number[]>(Array(20).fill(20));
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLive) return;
    const iv = setInterval(() => setEqHeights(prev => prev.map(() => 15 + Math.random() * 85)), 150);
    return () => clearInterval(iv);
  }, [isLive]);

  useEffect(() => {
    if (!isLive) { setViewers(0); return; }
    setViewers(28);
    const iv = setInterval(() => setViewers(v => Math.max(5, v + Math.floor(Math.random() * 9) - 3)), 3000);
    return () => clearInterval(iv);
  }, [isLive]);

  useEffect(() => {
    if (!isLive) return;
    const phrases = ['🔥 Brutal!', 'Quiero booking!', '👏👏👏', 'Esa transición 🎧', 'Contacta conmigo!', 'DROP! 💣'];
    const users = ['NightRider', 'BeatJunkie', 'ClubQueen', 'PromoMadrid', 'DeepSoul'];
    const colors = ['#00ff88', '#8c52ff', '#00e5ff', '#ffbc00', '#ff5f56'];
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
    if (!isLive) { setElapsed(0); return; }
    const iv = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(iv);
  }, [isLive]);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [chatMessages]);

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const sendChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { user: 'Tú', text: chatInput, color: '#ffffff' }]);
    setChatInput('');
  };

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-extrabold mb-1">
            Escenario <span className="text-gradient">Virtual</span>
          </h2>
          <p className="text-muted-foreground">Pincha en directo y conecta con empresarios en tiempo real.</p>
        </div>
        <button
          onClick={() => setIsLive(!isLive)}
          className="flex items-center gap-2 px-8 py-4 rounded-full font-extrabold text-sm transition-all duration-300"
          style={{
            background: isLive ? 'linear-gradient(90deg, hsl(var(--destructive)), #ff2d2d)' : 'linear-gradient(90deg, hsl(var(--primary)), #6b21ff)',
            color: 'white',
            boxShadow: isLive ? '0 0 30px hsla(var(--destructive) / 0.5)' : '0 0 30px hsla(var(--primary) / 0.5)',
          }}
        >
          <Radio size={18} className={isLive ? 'animate-pulse' : ''} />
          {isLive ? 'DETENER STREAM' : 'INICIAR EN VIVO'}
        </button>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5" style={{ minHeight: '60vh' }}>
        {/* Video / EQ area */}
        <div className="flex flex-col gap-5">
          <div className="glass-panel p-6 flex-1 flex flex-col">
            <div className="flex-1 rounded-xl overflow-hidden flex items-center justify-center relative" style={{ background: 'rgba(0,0,0,0.5)' }}>
              {isLive ? (
                <div className="w-full h-full flex items-end justify-center gap-1 p-8">
                  {eqHeights.map((h, i) => (
                    <div
                      key={i}
                      className="w-3 rounded-full transition-all duration-150"
                      style={{
                        height: `${h}%`,
                        background: `linear-gradient(180deg, hsl(var(--primary)), hsl(var(--secondary)))`,
                        boxShadow: '0 0 10px hsla(var(--primary) / 0.4)',
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center">
                  <Radio size={48} className="mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground text-sm">Pulsa "Iniciar en Vivo" para comenzar tu sesión</p>
                </div>
              )}
            </div>

            {/* Contactar button */}
            <button
              className="mt-5 w-full flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-extrabold text-base transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: 'linear-gradient(90deg, hsl(var(--accent)), #00b8ff)',
                color: 'hsl(var(--accent-foreground))',
                boxShadow: '0 0 25px hsla(var(--accent) / 0.3)',
              }}
            >
              <Phone size={20} />
              Contactar al DJ
            </button>
          </div>
        </div>

        {/* Chat */}
        <div className="glass-panel p-4 flex flex-col min-h-0">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare size={16} style={{ color: 'hsl(var(--primary))' }} />
            <span className="text-xs font-extrabold uppercase tracking-wider">Chat en Directo</span>
            {isLive && (
              <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded-full ml-auto" style={{ background: 'hsla(var(--accent) / 0.15)', color: 'hsl(var(--accent))' }}>
                {viewers} online
              </span>
            )}
          </div>
          <div ref={chatRef} className="flex-1 overflow-y-auto flex flex-col gap-1.5 mb-3 min-h-0">
            {chatMessages.map((msg, i) => (
              <div key={i} className="text-xs px-3 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
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
              className="nightlife-input flex-1 text-xs !py-3"
            />
            <button onClick={sendChat} className="px-4 rounded-xl" style={{ background: 'hsla(var(--primary) / 0.2)', border: '1px solid hsla(var(--primary) / 0.4)', color: 'hsl(var(--primary))' }}>
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EscenarioVirtualView;
