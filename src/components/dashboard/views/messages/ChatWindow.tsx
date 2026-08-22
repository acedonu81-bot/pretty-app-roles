import { useRef, useState } from 'react';
import { Send, Shield, MessageSquare, CheckCheck, Check, Image, Smile, X, ArrowLeft, Trash2, MoreVertical } from 'lucide-react';

interface Message {
  id: string;
  sender_id: string;
  content: string;
  photo_url?: string | null;
  read: boolean;
  created_at: string;
  deleted_at?: string | null;
}

const EMOJIS = [
  '😀','😂','😍','🔥','👍','🙌','💯','🎵','🎶','🎸',
  '🎤','🎧','🎷','🎺','🎻','🥁','🎹','🎼','🎙','🎚',
  '🍾','🥂','🎉','🎊','✨','⭐','💫','🌟','🏆','👑',
  '💎','💰','🤝','✅','❤️','🖤','👀','😎','🔑','🚀',
];

const avatarGradients = [
  'linear-gradient(135deg,#D4AF37,#B8941E)',
  'linear-gradient(135deg,#8B5CF6,#6D28D9)',
  'linear-gradient(135deg,#EC4899,#BE185D)',
  'linear-gradient(135deg,#10B981,#059669)',
  'linear-gradient(135deg,#3B82F6,#1D4ED8)',
  'linear-gradient(135deg,#F59E0B,#D97706)',
];
const getGradient = (name: string) => avatarGradients[name.charCodeAt(0) % avatarGradients.length];

const formatTime = (iso: string) => {
  const d = new Date(iso);
  const now = new Date();
  if (d.toDateString() === now.toDateString())
    return d.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString('es', { day: 'numeric', month: 'short' });
};

interface Props {
  messages: Message[];
  userId: string;
  activeOtherName: string;
  input: string;
  setInput: (v: string) => void;
  showEmoji: boolean;
  setShowEmoji: (v: boolean) => void;
  sending: boolean;
  uploadingPhoto: boolean;
  bottomRef: React.RefObject<HTMLDivElement>;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onSend: () => void;
  onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBack: () => void;
  onDeleteMessage?: (messageId: string) => void;
  onDeleteConversation?: () => void;
  onBlockUser?: () => void;
}

const ChatWindow = ({
  messages, userId, activeOtherName,
  input, setInput, showEmoji, setShowEmoji,
  sending, uploadingPhoto, bottomRef, fileInputRef,
  onSend, onPhotoUpload, onBack,
  onDeleteMessage, onDeleteConversation, onBlockUser,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [hoveredMsgId, setHoveredMsgId] = useState<string | null>(null);
  const [confirmDeleteMsgId, setConfirmDeleteMsgId] = useState<string | null>(null);
  const [showHeaderMenu, setShowHeaderMenu] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'delete-chat' | 'block' | null>(null);

  const insertEmoji = (emoji: string) => {
    setInput(input + emoji);
    setShowEmoji(false);
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Chat header */}
      <div className="px-4 py-3 flex items-center gap-3 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(212,175,55,0.08)', background: '#ffffff' }}>
        <button onClick={onBack}
          aria-label="Volver a conversaciones"
          title="Volver a conversaciones"
          className="p-1.5 rounded-lg mr-1 transition-colors hover:bg-black/10"
          style={{ background: 'rgba(0,0,0,0.05)' }}>
          <ArrowLeft size={16} />
        </button>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
          style={{ background: getGradient(activeOtherName), color: '#000' }}>
          {activeOtherName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold">{activeOtherName}</p>
          <p className="text-xs flex items-center gap-1" style={{ color: '#333' }}>
            <Shield size={9} /> Comunicación privada · XPEAK
          </p>
        </div>

        {(onDeleteConversation || onBlockUser) && (
          <div className="relative flex-shrink-0">
            <button onClick={() => setShowHeaderMenu(v => !v)}
              aria-label="Más opciones"
              title="Más opciones"
              className="p-1.5 rounded-lg transition-colors hover:bg-black/10"
              style={{ background: 'rgba(0,0,0,0.05)' }}>
              <MoreVertical size={16} />
            </button>
            {showHeaderMenu && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setShowHeaderMenu(false)} />
                <div className="absolute right-0 top-full mt-1 z-30 rounded-xl overflow-hidden min-w-[180px]"
                  style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
                  {onDeleteConversation && (
                    <button onClick={() => { setShowHeaderMenu(false); setConfirmAction('delete-chat'); }}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium flex items-center gap-2 transition-colors hover:bg-black/5"
                      style={{ color: '#333' }}>
                      <Trash2 size={14} /> Eliminar chat
                    </button>
                  )}
                  {onBlockUser && (
                    <button onClick={() => { setShowHeaderMenu(false); setConfirmAction('block'); }}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium flex items-center gap-2 transition-colors hover:bg-black/5"
                      style={{ color: '#dc2626' }}>
                      <Shield size={14} /> Bloquear a {activeOtherName}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {confirmAction && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setConfirmAction(null)}>
          <div className="rounded-2xl p-5 max-w-sm w-full" style={{ background: '#ffffff' }} onClick={e => e.stopPropagation()}>
            <p className="text-sm font-bold mb-1">
              {confirmAction === 'delete-chat' ? 'Eliminar conversación' : `Bloquear a ${activeOtherName}`}
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              {confirmAction === 'delete-chat'
                ? 'Se eliminará de tu bandeja. La otra persona seguirá viendo el historial.'
                : 'No podrá enviarte mensajes ni tú a ella. Podrás desbloquearla más adelante.'}
            </p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setConfirmAction(null)}
                className="px-3.5 py-2 rounded-lg text-xs font-bold" style={{ background: 'rgba(0,0,0,0.05)', color: '#333' }}>
                Cancelar
              </button>
              <button onClick={() => {
                if (confirmAction === 'delete-chat') onDeleteConversation?.();
                else onBlockUser?.();
                setConfirmAction(null);
              }}
                className="px-3.5 py-2 rounded-lg text-xs font-bold text-white" style={{ background: '#dc2626' }}>
                {confirmAction === 'delete-chat' ? 'Eliminar' : 'Bloquear'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.02) 0%, transparent 70%)' }}>
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <span className="text-4xl">👋</span>
            <p className="text-sm font-bold">Inicia la conversación</p>
            <p className="text-xs text-muted-foreground">Los mensajes son privados y solo visibles entre vosotros.</p>
          </div>
        )}
        {messages.map((msg, idx) => {
          const isMe = msg.sender_id === userId;
          const prevMsg = messages[idx - 1];
          const showDateSep = !prevMsg || new Date(msg.created_at).toDateString() !== new Date(prevMsg.created_at).toDateString();
          const isPhoto = msg.photo_url || (msg.content.startsWith('http') && /\.(jpg|jpeg|png|webp|gif)/i.test(msg.content));

          return (
            <div key={msg.id}>
              {showDateSep && (
                <div className="flex items-center gap-3 my-2">
                  <div className="flex-1 h-px" style={{ background: 'rgba(0,0,0,0.05)' }} />
                  <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.05)' }}>
                    {new Date(msg.created_at).toLocaleDateString('es', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </span>
                  <div className="flex-1 h-px" style={{ background: 'rgba(0,0,0,0.05)' }} />
                </div>
              )}
              <div className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'} group`}
                onMouseEnter={() => setHoveredMsgId(msg.id)}
                onMouseLeave={() => setHoveredMsgId(null)}>
                {!isMe && (
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 mb-1"
                    style={{ background: getGradient(activeOtherName), color: '#000' }}>
                    {activeOtherName.charAt(0).toUpperCase()}
                  </div>
                )}
                {isMe && onDeleteMessage && !msg.deleted_at && (
                  <button onClick={() => setConfirmDeleteMsgId(msg.id)}
                    aria-label="Eliminar mensaje"
                    title="Eliminar mensaje"
                    className="mb-1 p-1 rounded-lg transition-opacity hover:bg-black/5"
                    style={{ opacity: hoveredMsgId === msg.id ? 1 : 0, color: '#333' }}>
                    <Trash2 size={13} />
                  </button>
                )}
                <div className={`max-w-[68%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                  {msg.deleted_at ? (
                    <div className="px-4 py-2.5 rounded-2xl text-sm italic"
                      style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.05)', color: '#666' }}>
                      Mensaje eliminado
                    </div>
                  ) : isPhoto ? (
                    <div className="rounded-2xl overflow-hidden"
                      style={{
                        border: `1px solid ${isMe ? 'rgba(212,175,55,0.3)' : 'rgba(0,0,0,0.08)'}`,
                        borderBottomRightRadius: isMe ? 4 : undefined,
                        borderBottomLeftRadius: !isMe ? 4 : undefined,
                      }}>
                      <img
                        src={msg.photo_url || msg.content}
                        alt="Imagen enviada"
                        className="max-w-[200px] max-h-[200px] object-cover cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => window.open(msg.photo_url || msg.content, '_blank')}
                      />
                    </div>
                  ) : (
                    <div className="px-4 py-2.5 rounded-2xl text-sm"
                      style={{
                        background: isMe
                          ? 'linear-gradient(135deg, #D4AF37, #C9A227)'
                          : 'rgba(0,0,0,0.05)',
                        border: `1px solid ${isMe ? 'rgba(184,148,30,0.5)' : 'rgba(0,0,0,0.06)'}`,
                        borderBottomRightRadius: isMe ? 4 : undefined,
                        borderBottomLeftRadius: !isMe ? 4 : undefined,
                        boxShadow: isMe ? '0 2px 12px rgba(212,175,55,0.18)' : 'none',
                        color: isMe ? '#1a1208' : '#222',
                        fontWeight: isMe ? 600 : 400,
                        lineHeight: '1.5',
                      }}>
                      {msg.content}
                    </div>
                  )}
                  <div className={`flex items-center gap-1 mt-1 px-1 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span className="text-[0.75rem]" style={{ color: '#333' }}>
                      {formatTime(msg.created_at)}
                    </span>
                    {isMe && (msg.read
                      ? <CheckCheck size={10} style={{ color: '#8A6D0F' }} />
                      : <Check size={10} style={{ color: '#333' }} />)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {confirmDeleteMsgId && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setConfirmDeleteMsgId(null)}>
          <div className="rounded-2xl p-5 max-w-sm w-full" style={{ background: '#ffffff' }} onClick={e => e.stopPropagation()}>
            <p className="text-sm font-bold mb-1">Eliminar mensaje</p>
            <p className="text-xs text-muted-foreground mb-4">Se eliminará para ambos. Esta acción no se puede deshacer.</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setConfirmDeleteMsgId(null)}
                className="px-3.5 py-2 rounded-lg text-xs font-bold" style={{ background: 'rgba(0,0,0,0.05)', color: '#333' }}>
                Cancelar
              </button>
              <button onClick={() => { onDeleteMessage?.(confirmDeleteMsgId); setConfirmDeleteMsgId(null); }}
                className="px-3.5 py-2 rounded-lg text-xs font-bold text-white" style={{ background: '#dc2626' }}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="px-3 py-3 flex-shrink-0 relative"
        style={{ borderTop: '1px solid rgba(212,175,55,0.08)', background: '#ffffff' }}>
        {showEmoji && (
          <div className="absolute bottom-full mb-2 left-3 right-3 rounded-xl p-3 z-20"
            style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 -4px 24px rgba(0,0,0,0.08)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black tracking-widest" style={{ color: '#333' }}>EMOTICONOS</span>
              <button onClick={() => setShowEmoji(false)} className="p-0.5 rounded hover:bg-white/5">
                <X size={12} className="text-muted-foreground" />
              </button>
            </div>
            <div className="grid grid-cols-8 sm:grid-cols-10 gap-1">
              {EMOJIS.map(e => (
                <button key={e} onClick={() => insertEmoji(e)}
                  className="text-lg rounded-lg p-1.5 transition-all hover:scale-125 hover:bg-white/5 text-center leading-none">
                  {e}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setShowEmoji(!showEmoji)}
            className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all hover:scale-110"
            style={{
              background: showEmoji ? 'rgba(212,175,55,0.15)' : 'rgba(0,0,0,0.05)',
              border: `1px solid ${showEmoji ? 'rgba(212,175,55,0.3)' : 'rgba(0,0,0,0.08)'}`,
              color: showEmoji ? '#D4AF37' : '#333',
            }}>
            <Smile size={16} />
          </button>

          <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploadingPhoto}
            className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all hover:scale-110 disabled:opacity-40"
            style={{ background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.08)', color: '#444' }}>
            {uploadingPhoto
              ? <div className="w-4 h-4 rounded-full border border-t-transparent animate-spin" style={{ borderColor: '#D4AF37', borderTopColor: 'transparent' }} />
              : <Image size={16} />}
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onPhotoUpload} />

          <div className="flex-1 relative">
            <input ref={inputRef} type="text" value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend(); }
                if (e.key === 'Escape') setShowEmoji(false);
              }}
              placeholder="Escribe un mensaje..."
              maxLength={1000}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{ background: '#f9f8f6', border: '1px solid rgba(0,0,0,0.1)', color: '#111' }}
              onFocus={e => (e.target.style.borderColor = 'rgba(212,175,55,0.3)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(0,0,0,0.08)')}
            />
          </div>

          <button type="button" onClick={onSend} disabled={sending || !input.trim()}
            className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 disabled:opacity-30 disabled:hover:scale-100"
            style={{ background: input.trim() ? 'linear-gradient(135deg,#D4AF37,#B8941E)' : 'rgba(0,0,0,0.05)', color: input.trim() ? '#000' : '#333' }}>
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export const EmptyChatPlaceholder = () => (
  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-4">
    <div className="relative">
      <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
        style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.12)' }}>
        <MessageSquare size={32} style={{ color: 'rgba(212,175,55,0.3)' }} />
      </div>
      <span className="absolute -top-1 -right-1 text-lg">✨</span>
    </div>
    <div>
      <p className="text-base font-bold mb-1">Selecciona una conversación</p>
      <p className="text-xs text-muted-foreground">O inicia contacto desde el perfil de un profesional.</p>
    </div>
  </div>
);

export default ChatWindow;
