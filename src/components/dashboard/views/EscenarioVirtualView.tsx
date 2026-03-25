import { useState, useEffect, useRef } from 'react';
import { Radio, Send, Eye, MessageSquare } from 'lucide-react';

// WhatsApp icon
const WaIcon = ({ size = 18 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const fakeChat = [
  { user: 'PromoterKing', text: 'Interesado para Ibiza julio', color: '#D4AF37' },
  { user: 'ClubManager_BCN', text: 'Buen set, hablamos?', color: '#8E8EA0' },
  { user: 'NightOwl_VLC', text: '🔥🔥🔥 Brutal!', color: '#D4AF37' },
  { user: 'DJ_Mara_92', text: 'Qué temazo!!', color: '#8E8EA0' },
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
    const colors = ['#D4AF37', '#8E8EA0', '#D4AF37', '#8E8EA0', '#D4AF37'];
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 gap-3">
        <div>
          <h2 className="text-2xl font-bold mb-1">
            Escenario <span className="text-gradient">Virtual</span>
          </h2>
          <p className="text-sm text-muted-foreground">Pincha en directo y conecta con empresarios en tiempo real.</p>
        </div>
        <button
          onClick={() => setIsLive(!isLive)}
          className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition-all duration-300 w-full sm:w-auto justify-center"
          style={{
            background: isLive ? 'linear-gradient(90deg, #ff5f56, #ff2d2d)' : 'linear-gradient(90deg, #D4AF37, #B8941E)',
            color: isLive ? 'white' : '#000',
          }}
        >
          <Radio size={16} className={isLive ? 'animate-pulse' : ''} />
          {isLive ? 'DETENER STREAM' : 'INICIAR EN VIVO'}
        </button>
      </div>

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
          <div className="glass-panel p-5 flex-1 flex flex-col">
            <div className="flex-1 rounded-lg overflow-hidden flex items-center justify-center relative" style={{ background: 'rgba(0,0,0,0.6)' }}>
              {isLive ? (
                <div className="w-full h-full flex items-end justify-center gap-1 p-6">
                  {eqHeights.map((h, i) => (
                    <div key={i} className="w-2.5 rounded-full transition-all duration-150"
                      style={{ height: `${h}%`, background: `linear-gradient(180deg, #D4AF37, #B8941E)`, opacity: 0.7 }} />
                  ))}
                </div>
              ) : (
                <div className="text-center">
                  <Radio size={40} className="mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground text-xs">Pulsa "Iniciar en Vivo" para comenzar</p>
                </div>
              )}
            </div>

            <a href="https://wa.me/34600000000?text=Hola%2C%20te%20he%20visto%20en%20NIGHTLIFE%20Madrid" target="_blank" rel="noopener noreferrer"
              className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition-all duration-200 hover:scale-[1.01]"
              style={{ background: 'linear-gradient(90deg, #25D366, #128C7E)', color: 'white' }}>
              <WaIcon size={18} />
              Contactar al DJ
            </a>
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
