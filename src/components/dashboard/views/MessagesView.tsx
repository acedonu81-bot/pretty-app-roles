import { useState } from 'react';
import { FileText, Send, Shield, Download } from 'lucide-react';

interface Thread {
  id: number;
  name: string;
  initials: string;
  gradient: string;
  color: string;
  lastMsg: string;
  time: string;
  online?: boolean;
  unread: number;
  verified?: boolean;
}

const initialThreads: Thread[] = [
  { id: 1, name: 'Onyx Club Madrid', initials: 'ON', gradient: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000', lastMsg: 'Documento de protección de datos', time: 'Hace 5m', online: true, unread: 2, verified: true },
  { id: 2, name: 'Horizon Rooftop', initials: 'HZ', gradient: 'linear-gradient(135deg,#333,#1a1a1a)', color: '#fff', lastMsg: 'Revisa las condiciones de uso', time: 'Hace 1h', unread: 1 },
  { id: 3, name: 'Base Sound BCN', initials: 'BS', gradient: 'linear-gradient(135deg,#333,#1a1a1a)', color: '#fff', lastMsg: '¿Ibiza verano? 3 noches', time: 'Ayer', unread: 0 },
];

const privacyDocContent = `DOCUMENTO DE PROTECCIÓN DE DATOS Y CONDICIONES DE USO — XPEAK

1. XPEAK actúa exclusivamente como intermediario tecnológico entre profesionales del sector nocturno y empresarios/salas. NO somos una agencia de contratación.

2. No existe relación laboral entre XPEAK y los profesionales registrados. Toda relación contractual se establece directamente entre las partes.

3. XPEAK no cobra comisiones por contratación. El modelo de negocio se basa en suscripciones y pases de visibilidad.

4. Los datos personales se tratan conforme al RGPD (UE) 2016/679. El usuario puede solicitar la eliminación de sus datos en cualquier momento desde Ajustes > Gestión de Contenido.

5. Los audios, fotos y vídeos subidos son propiedad del usuario. XPEAK obtiene licencia de uso limitada para mostrarlos en la plataforma.

6. Cualquier disputa entre profesional y empresario es ajena a XPEAK. Recomendamos que ambas partes formalicen sus acuerdos por escrito de forma independiente.`;

const chatMessages = [
  { sender: 'Onyx Club', color: '#D4AF37', text: '¡Hola! Queremos proponerte una colaboración para nuestra Anniversary Party.' },
  { sender: 'Tú', color: '#fff', text: 'Me interesa. ¿Qué condiciones ofrecen?' },
  { sender: 'Onyx Club', color: '#D4AF37', text: '€800 por 3 horas. ¿Te parece bien?' },
  { sender: 'system', text: 'Se ha compartido el documento de Protección de Datos y Condiciones de Uso de XPEAK. Recuerda: XPEAK no contrata, solo intermedia.' },
];

const MessagesView = () => {
  const [threads, setThreads] = useState<Thread[]>(initialThreads);
  const [activeThread, setActiveThread] = useState(1);
  const [inputMsg, setInputMsg] = useState('');
  const [messages, setMessages] = useState(chatMessages);
  const [showPrivacyDoc, setShowPrivacyDoc] = useState(false);

  const selectThread = (id: number) => {
    setActiveThread(id);
    setThreads(prev => prev.map(t => t.id === id ? { ...t, unread: 0 } : t));
  };

  const totalUnread = threads.reduce((sum, t) => sum + t.unread, 0);

  const sendMessage = () => {
    if (!inputMsg.trim()) return;
    setMessages([...messages, { sender: 'Tú', color: '#fff', text: inputMsg }]);
    setInputMsg('');
  };

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-1">
          <span className="text-gradient">Mensajes</span>
          {totalUnread > 0 && (
            <span className="ml-2 text-sm px-2 py-0.5 rounded-full" style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37' }}>
              {totalUnread}
            </span>
          )}
        </h2>
        <p className="text-sm text-muted-foreground">Comunicaciones con empresarios y salas. XPEAK solo intermedia, no contrata.</p>
      </div>

      {/* Privacy Document Modal */}
      {showPrivacyDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowPrivacyDoc(false)}>
          <div className="glass-panel p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-4">
              <Shield size={18} style={{ color: '#D4AF37' }} />
              <h3 className="text-sm font-bold">Protección de Datos y Condiciones</h3>
            </div>
            <pre className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed font-sans">{privacyDocContent}</pre>
            <button onClick={() => setShowPrivacyDoc(false)}
              className="mt-4 w-full py-2.5 rounded-lg font-bold text-xs"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              Entendido
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] h-[65vh] max-h-[600px] rounded-lg overflow-hidden" style={{ border: '1px solid var(--nightlife-border)' }}>
        <div className="flex flex-col" style={{ borderRight: '1px solid var(--nightlife-border)', background: 'rgba(0,0,0,0.3)' }}>
          <div className="p-3" style={{ borderBottom: '1px solid var(--nightlife-border)' }}>
            <input type="text" placeholder="Buscar..." className="nightlife-input text-xs !py-2" />
          </div>
          <div className="flex-1 overflow-y-auto">
            {threads.map((t) => (
              <div key={t.id} onClick={() => selectThread(t.id)}
                className="p-3 flex items-start gap-2 cursor-pointer transition-colors"
                style={{
                  borderBottom: '1px solid var(--nightlife-border)',
                  background: activeThread === t.id ? 'rgba(212,175,55,0.06)' : undefined,
                  borderLeft: activeThread === t.id ? '2px solid #D4AF37' : '2px solid transparent',
                }}>
                <div className="relative flex-shrink-0">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[0.55rem] font-bold" style={{ background: t.gradient, color: t.color }}>{t.initials}</div>
                  {t.online && <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full" style={{ background: '#22c55e', border: '1.5px solid #000' }} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-bold truncate">{t.name}</p>
                    <span className="text-[0.55rem] text-muted-foreground flex-shrink-0">{t.time}</span>
                  </div>
                  <p className="text-[0.6rem] text-muted-foreground truncate">{t.lastMsg}</p>
                  {t.unread > 0 && (
                    <span className="text-[0.5rem] font-bold px-1.5 py-0.5 rounded mt-0.5 inline-block" style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37' }}>
                      {t.unread} nuevos
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col" style={{ background: 'rgba(0,0,0,0.15)' }}>
          <div className="p-3 flex items-center gap-2" style={{ borderBottom: '1px solid var(--nightlife-border)', background: 'rgba(0,0,0,0.3)' }}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[0.5rem] font-bold" style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>ON</div>
            <div>
              <p className="text-xs font-bold">Onyx Club Madrid</p>
              <p className="text-[0.55rem] text-muted-foreground">En línea</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
            {messages.map((msg, i) =>
              msg.sender === 'system' ? (
                <div key={i} className="text-center py-2">
                  <div className="inline-flex flex-col items-center gap-1.5 px-4 py-3 rounded-lg text-xs" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}>
                    <div className="flex items-center gap-1.5">
                      <Shield size={12} style={{ color: '#D4AF37' }} />
                      <span className="font-medium">{msg.text}</span>
                    </div>
                    <button onClick={() => setShowPrivacyDoc(true)}
                      className="flex items-center gap-1 text-[0.6rem] font-bold px-2 py-1 rounded mt-1"
                      style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }}>
                      <Download size={10} /> Ver documento completo
                    </button>
                  </div>
                </div>
              ) : (
                <div key={i} className={`flex ${msg.sender === 'Tú' ? 'justify-end' : 'justify-start'}`}>
                  <div className="max-w-[75%] px-3 py-2 rounded-lg text-xs" style={{
                    background: msg.sender === 'Tú' ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${msg.sender === 'Tú' ? 'rgba(212,175,55,0.2)' : 'var(--nightlife-border)'}`,
                  }}>
                    <p className="text-[0.6rem] font-bold mb-0.5" style={{ color: msg.color }}>{msg.sender}</p>
                    <p className="text-muted-foreground">{msg.text}</p>
                  </div>
                </div>
              ),
            )}
          </div>

          <div className="p-3 flex gap-2" style={{ borderTop: '1px solid var(--nightlife-border)' }}>
            <input type="text" value={inputMsg} onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Escribe..." className="nightlife-input flex-1 text-xs !py-2" />
            <button onClick={sendMessage} className="px-3 rounded-lg" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', color: '#D4AF37' }}>
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesView;
