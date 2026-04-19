import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, ChevronDown, Zap, Users, CreditCard, FileText, Radio, Star } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

// ─────────────────────────────────────────────────────────────────────
// Knowledge base — respuestas contextuales sobre XPEAK
// ─────────────────────────────────────────────────────────────────────
interface KBEntry { patterns: RegExp[]; answer: string; }

const KB: KBEntry[] = [
  {
    patterns: [/hola|buenos|buenas|hey|hi\b|saludos/i],
    answer: '¡Hola! Soy el asistente de **XPEAK**. Puedo ayudarte con el directorio, suscripciones, contratos, flash booking y más. ¿En qué te puedo ayudar?',
  },
  {
    patterns: [/qué es|que es|para qué|para que|xpeak/i],
    answer: '**XPEAK** es el directorio profesional de la industria del entretenimiento nocturno en Europa. Conectamos DJs, staff, maquilladores, media y promotores con empresarios y salas de toda España.',
  },
  {
    patterns: [/suscripci|precio|plan|tarifa|coste|costo|cuanto cuesta|cuánto cuesta/i],
    answer: 'XPEAK tiene 4 planes:\n\n• **Free** — perfil básico, visibilidad limitada\n• **Starter** — flash booking, prioridad media\n• **Business** — destacado en directorio, sin retrasos\n• **Elite / Agency** — máxima visibilidad, badge AGENCIA\n\nVe a **Suscripción** en el menú para ver precios exactos.',
  },
  {
    patterns: [/flash booking|flash|booking urgente/i],
    answer: '**Flash Booking** es el mercado de contratación rápida. Los empresarios publican ofertas de eventos inminentes y los profesionales con el toggle activado aparecen disponibles ahora mismo.\n\n→ Actívalo en *Mi Perfil > toggle Disponibilidad*\n→ Los planes Elite y Agency tienen acceso prioritario sin retraso.',
  },
  {
    patterns: [/contrato|contratos|pdf|legal|factura/i],
    answer: 'En **Herramientas → Contratos** puedes generar contratos de prestación de servicios conformes a la legislación española (Código Civil, ET art.1.1, IVA 21%, IRPF).\n\nSe generan como PDF imprimible. La firma digital eIDAS estará disponible próximamente.',
  },
  {
    patterns: [/dj|artista|música|musica|productor/i],
    answer: 'El directorio de **DJs y Artistas** incluye perfiles con géneros, audio embed (SoundCloud, Mixcloud), streaming en directo y flash booking. Filtra por ciudad y especialidad.',
  },
  {
    patterns: [/empresario|venue|local|sala|club/i],
    answer: 'El **Panel Empresario** te permite:\n• Buscar profesionales por rol y ciudad\n• Publicar demandas en Flash Booking\n• Generar contratos directamente desde el perfil\n• Ver estadísticas de contacto',
  },
  {
    patterns: [/fan club|fanclub|suscriptor/i],
    answer: '**Fan Club** permite a los profesionales crear una comunidad de seguidores con contenido exclusivo, sorteos y mensajes directos.\n\nLa monetización vía Stripe estará disponible próximamente — en desarrollo.',
  },
  {
    patterns: [/mensajes|mensaje|chat|conversar|contactar/i],
    answer: 'El sistema de **Mensajes** está en *Herramientas → Mensajes*. Puedes iniciar conversaciones desde cualquier tarjeta de perfil con el botón "Mensaje".',
  },
  {
    patterns: [/perfil|profile|foto|editar|configurar/i],
    answer: 'Edita tu perfil en **Mi Cuenta → Mi Perfil**. Puedes subir foto, añadir bio, géneros, idiomas, precio por hora, audio embed y activar el flash booking.',
  },
  {
    patterns: [/verificado|verificación|badge|verificar/i],
    answer: 'El **badge verificado** ✓ lo otorga el equipo de XPEAK tras revisar tu perfil profesional. Próximamente habrá un proceso de solicitud desde *Ajustes → Verificación*.',
  },
  {
    patterns: [/top weekend|topweekend|destacado/i],
    answer: '**TOP Weekend** es la selección editorial de los mejores profesionales disponibles este fin de semana. La selección se actualiza cada jueves.',
  },
  {
    patterns: [/escenario virtual|streaming|directo|stream/i],
    answer: 'El **Escenario Virtual** es el espacio de streaming en vivo de XPEAK. Los DJs con plan Business o superior pueden emitir desde Twitch, YouTube o Mixcloud y aparecer en el feed de directos.',
  },
  {
    patterns: [/mapa|ubicación|ubicacion|ciudad/i],
    answer: 'El **Mapa** muestra la distribución geográfica de profesionales activos en España y Europa. Filtrable por rol y ciudad.',
  },
  {
    patterns: [/estadísticas|estadisticas|stats|visitas|vistas/i],
    answer: 'En **Mi Cuenta → Estadísticas** ves tus visitas al perfil, clics de contacto, mensajes recibidos y evolución mensual.',
  },
  {
    patterns: [/problema|error|bug|falla|fallo|no funciona/i],
    answer: 'Si tienes un problema técnico, describe qué está pasando y lo reportamos al equipo. También puedes escribir a **soporte@xpeak.site** con el detalle del error.',
  },
  {
    patterns: [/gracias|thank|perfecto|genial|ok\b|vale\b/i],
    answer: '¡De nada! Si necesitas algo más, aquí estoy. 🎧',
  },
];

const QUICK_ACTIONS = [
  { icon: Zap,        label: 'Flash Booking',  msg: '¿Cómo funciona el flash booking?' },
  { icon: CreditCard, label: 'Planes',         msg: '¿Cuáles son los precios?' },
  { icon: FileText,   label: 'Contratos',      msg: '¿Cómo genero un contrato?' },
  { icon: Users,      label: 'Directorio',     msg: '¿Cómo funciona el directorio?' },
  { icon: Star,       label: 'Fan Club',       msg: '¿Qué es el fan club?' },
  { icon: Radio,      label: 'Streaming',      msg: '¿Cómo emito en directo?' },
];

function getResponse(input: string): string {
  const text = input.trim().toLowerCase();
  for (const entry of KB) {
    if (entry.patterns.some(p => p.test(text))) return entry.answer;
  }
  return 'No tengo una respuesta exacta para eso. Puedes escribir a **soporte@xpeak.site** o revisar la sección correspondiente del menú lateral.';
}

// ─────────────────────────────────────────────────────────────────────
// Markdown-lite renderer (bold only)
// ─────────────────────────────────────────────────────────────────────
const MsgText = ({ text }: { text: string }) => {
  const parts = text.split(/(\*\*[^*]+\*\*|\n)/g);
  return (
    <span className="whitespace-pre-wrap leading-relaxed">
      {parts.map((p, i) => {
        if (p === '\n') return <br key={i} />;
        if (p.startsWith('**') && p.endsWith('**'))
          return <strong key={i} style={{ color: '#D4AF37' }}>{p.slice(2, -2)}</strong>;
        return <span key={i}>{p}</span>;
      })}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────────────
interface Msg { from: 'bot' | 'user'; text: string; ts: number; }

const GREETING: Msg = {
  from: 'bot',
  text: '¡Hola! Soy el asistente de **XPEAK**. Estoy aquí para ayudarte con cualquier duda sobre la plataforma. ¿En qué puedo ayudarte?',
  ts: Date.now(),
};

const SupportChat = () => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, typing, open]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Msg = { from: 'user', text, ts: Date.now() };
    setMsgs(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    // Simulate thinking delay (600–1000ms)
    const delay = 600 + Math.random() * 400;
    setTimeout(() => {
      const reply = getResponse(text);
      setTyping(false);
      setMsgs(prev => [...prev, { from: 'bot', text: reply, ts: Date.now() }]);
      if (!open) setUnread(n => n + 1);
    }, delay);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  return (
    <>
      {/* ── Floating button ── */}
      <motion.button
        type="button"
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed right-4 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
        style={{
          bottom: isMobile ? 'calc(4.5rem + env(safe-area-inset-bottom))' : '1.5rem',
          background: 'linear-gradient(135deg, #D4AF37, #B8941E)',
          boxShadow: '0 4px 24px rgba(212,175,55,0.45)',
        }}
        aria-label={open ? 'Cerrar soporte' : 'Abrir soporte XPEAK'}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <ChevronDown size={22} color="#000" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <MessageCircle size={22} color="#000" />
            </motion.div>
          )}
        </AnimatePresence>
        {unread > 0 && !open && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black"
            style={{ background: '#ff5f56', color: '#fff' }}>{unread}</span>
        )}
      </motion.button>

      {/* ── Chat panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed right-4 z-50 flex flex-col rounded-2xl overflow-hidden shadow-2xl"
            style={{
              bottom: isMobile ? 'calc(7.5rem + env(safe-area-inset-bottom))' : '5.5rem',
              width: 'min(380px, calc(100vw - 2rem))',
              height: isMobile ? 'min(460px, calc(100vh - 12rem))' : 'min(520px, calc(100vh - 8rem))',
              background: '#0a0a0e',
              border: '1px solid rgba(212,175,55,0.2)',
              boxShadow: '0 8px 48px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,175,55,0.08)',
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
              style={{ background: 'linear-gradient(90deg, #0f0f14, #121218)', borderBottom: '1px solid rgba(212,175,55,0.12)' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)' }}>
                <span className="text-xs font-black text-black">X</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold leading-none">Soporte XPEAK</p>
                <p className="text-[0.7rem] mt-0.5" style={{ color: '#22c55e' }}>● En línea</p>
              </div>
              <button type="button" onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:bg-white/10"
                style={{ color: 'rgba(255,255,255,0.4)' }}>
                <X size={14} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {msgs.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.from === 'bot' && (
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mr-2 mt-0.5"
                      style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)' }}>
                      <span className="text-[9px] font-black text-black">X</span>
                    </div>
                  )}
                  <div className="max-w-[80%] px-3 py-2 rounded-xl text-xs"
                    style={m.from === 'user'
                      ? { background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.25)', color: '#fff', borderRadius: '14px 14px 4px 14px' }
                      : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.85)', borderRadius: '4px 14px 14px 14px' }
                    }>
                    <MsgText text={m.text} />
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {typing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)' }}>
                    <span className="text-[9px] font-black text-black">X</span>
                  </div>
                  <div className="px-3 py-2.5 rounded-xl flex gap-1"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    {[0, 1, 2].map(i => (
                      <motion.div key={i} className="w-1.5 h-1.5 rounded-full"
                        style={{ background: '#D4AF37' }}
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick actions */}
            {msgs.length <= 2 && (
              <div className="px-4 pb-2 flex-shrink-0">
                <p className="text-[0.65rem] font-bold uppercase tracking-wider mb-2"
                  style={{ color: 'rgba(255,255,255,0.3)' }}>Preguntas frecuentes</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {QUICK_ACTIONS.map(qa => (
                    <button key={qa.label} type="button" onClick={() => sendMessage(qa.msg)}
                      className="flex flex-col items-center gap-1 p-2 rounded-lg text-center transition-all hover:scale-105 active:scale-95"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <qa.icon size={13} style={{ color: '#D4AF37' }} />
                      <span className="text-[0.6rem] font-medium leading-tight" style={{ color: 'rgba(255,255,255,0.6)' }}>{qa.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="px-3 py-3 flex-shrink-0"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.3)' }}>
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Escribe tu pregunta..."
                  maxLength={300}
                  className="flex-1 bg-transparent outline-none text-xs py-2 px-3 rounded-xl"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                  }}
                />
                <button type="button" onClick={() => sendMessage(input)}
                  disabled={!input.trim()}
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all hover:scale-110 active:scale-95 disabled:opacity-30"
                  style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)' }}>
                  <Send size={14} color="#000" />
                </button>
              </div>
              <p className="text-[0.6rem] text-center mt-2" style={{ color: 'rgba(255,255,255,0.2)' }}>
                XPEAK · Asistente virtual
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SupportChat;
