import { useState } from 'react';
import { FileText, Send } from 'lucide-react';
import { toast } from 'sonner';

const threads = [
  { id: 1, name: 'Onyx Club Madrid', initials: 'ON', gradient: 'linear-gradient(135deg,#00ff88,#00b8ff)', color: '#000', lastMsg: '📄 Contrato Flash pendiente de firma', time: 'Hace 5m', online: true, unread: 2, verified: true },
  { id: 2, name: 'Horizon Rooftop BCN', initials: 'HZ', gradient: 'linear-gradient(135deg,#8c52ff,#ff5f56)', color: '#fff', lastMsg: 'Revisa el contrato que te enviamos', time: 'Hace 1h' },
  { id: 3, name: 'Base Sound BCN', initials: 'BS', gradient: 'linear-gradient(135deg,#ffbc00,#ff5f56)', color: '#000', lastMsg: '¿Ibiza verano? 3 noches en julio 🌴', time: 'Ayer' },
  { id: 4, name: 'Noxe Club Valencia', initials: 'NX', gradient: 'linear-gradient(135deg,#f472b6,#a855f7)', color: '#fff', lastMsg: 'El pago del Escrow ya está listo ✅', time: 'Lun 18 Mar' },
];

const chatMessages = [
  { sender: 'Onyx Club', color: '#00ff88', text: '¡Hola Alex! Queremos proponerte un set de Techno para nuestra Anniversary Party.' },
  { sender: 'Tú', color: '#fff', text: 'Me interesa. ¿Qué presupuesto manejan?' },
  { sender: 'Onyx Club', color: '#00ff88', text: '€800 por 3 horas. ¿Aceptas generar el FlashContract?' },
  { sender: 'system', text: '📄 Se ha generado un Flash Contract automáticamente. Revisa los términos y firma.' },
];

const MessagesView = () => {
  const [activeThread, setActiveThread] = useState(1);
  const [inputMsg, setInputMsg] = useState('');
  const [messages, setMessages] = useState(chatMessages);

  const sendMessage = () => {
    if (!inputMsg.trim()) return;
    setMessages([...messages, { sender: 'Tú', color: '#fff', text: inputMsg }]);
    setInputMsg('');
  };

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="mb-5">
        <h2 className="text-3xl font-extrabold mb-1">
          Bandeja de <span className="text-gradient">Mensajes</span>
        </h2>
        <p className="text-muted-foreground">Comunicaciones cifradas E2E con Promotores, Salas y Equipos.</p>
      </div>

      <div className="grid grid-cols-[300px_1fr] h-[70vh] max-h-[680px] rounded-2xl overflow-hidden" style={{ border: '1px solid var(--nightlife-border)' }}>
        {/* Thread list */}
        <div className="flex flex-col" style={{ borderRight: '1px solid var(--nightlife-border)', background: 'rgba(0,0,0,0.2)' }}>
          <div className="p-4" style={{ borderBottom: '1px solid var(--nightlife-border)' }}>
            <input type="text" placeholder="Buscar conversaciones..." className="nightlife-input text-sm" />
          </div>
          <div className="flex-1 overflow-y-auto">
            {threads.map((t) => (
              <div
                key={t.id}
                onClick={() => setActiveThread(t.id)}
                className="p-4 flex items-start gap-3 cursor-pointer transition-colors"
                style={{
                  borderBottom: '1px solid var(--nightlife-border)',
                  background: activeThread === t.id ? 'rgba(140,82,255,0.1)' : undefined,
                  borderLeft: activeThread === t.id ? '3px solid #8c52ff' : '3px solid transparent',
                }}
              >
                <div className="relative flex-shrink-0">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black"
                    style={{ background: t.gradient, color: t.color }}
                  >
                    {t.initials}
                  </div>
                  {t.online && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full" style={{ background: '#00ff88', border: '2px solid #07070b' }} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-extrabold truncate">
                      {t.name} {t.verified && <span style={{ color: '#00ff88', fontSize: '0.7rem' }}>✓</span>}
                    </p>
                    <span className="text-[0.7rem] text-muted-foreground flex-shrink-0">{t.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{t.lastMsg}</p>
                  {t.unread && (
                    <span className="text-[0.65rem] font-extrabold px-2 py-0.5 rounded-full mt-1 inline-block"
                      style={{ background: '#8c52ff', color: 'white' }}
                    >
                      {t.unread} nuevos
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat */}
        <div className="flex flex-col" style={{ background: 'rgba(0,0,0,0.1)' }}>
          {/* Chat header */}
          <div className="p-4 flex items-center gap-3" style={{ borderBottom: '1px solid var(--nightlife-border)', background: 'rgba(0,0,0,0.25)' }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black"
              style={{ background: 'linear-gradient(135deg,#00ff88,#00b8ff)', color: '#000' }}
            >
              ON
            </div>
            <div>
              <p className="text-sm font-bold">Onyx Club Madrid</p>
              <p className="text-xs text-muted-foreground">En línea ahora</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
            {messages.map((msg, i) =>
              msg.sender === 'system' ? (
                <div key={i} className="text-center py-3">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold" style={{
                    background: 'rgba(140,82,255,0.1)', border: '1px solid rgba(140,82,255,0.3)',
                  }}>
                    <FileText size={14} style={{ color: '#8c52ff' }} />
                    <span>{msg.text}</span>
                  </div>
                </div>
              ) : (
                <div key={i} className={`flex ${msg.sender === 'Tú' ? 'justify-end' : 'justify-start'}`}>
                  <div className="max-w-[70%] px-4 py-3 rounded-2xl text-sm" style={{
                    background: msg.sender === 'Tú' ? 'rgba(140,82,255,0.2)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${msg.sender === 'Tú' ? 'rgba(140,82,255,0.3)' : 'var(--nightlife-border)'}`,
                  }}>
                    <p className="text-xs font-bold mb-1" style={{ color: msg.color }}>{msg.sender}</p>
                    <p className="text-muted-foreground">{msg.text}</p>
                  </div>
                </div>
              ),
            )}
          </div>

          {/* Input */}
          <div className="p-4 flex gap-3" style={{ borderTop: '1px solid var(--nightlife-border)' }}>
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Escribe un mensaje..."
              className="nightlife-input flex-1 text-sm"
            />
            <button
              onClick={sendMessage}
              className="px-4 rounded-lg font-bold text-sm"
              style={{ background: 'rgba(140,82,255,0.2)', border: '1px solid rgba(140,82,255,0.4)', color: '#8c52ff' }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesView;
