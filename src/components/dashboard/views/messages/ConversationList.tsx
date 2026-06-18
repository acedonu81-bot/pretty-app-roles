import { MessageSquare, PenSquare } from 'lucide-react';

interface Conversation {
  id: string;
  other_user_id: string;
  other_name: string;
  other_photo?: string | null;
  last_message: string;
  last_message_at: string;
  unread: number;
}

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
  conversations: Conversation[];
  loading: boolean;
  activeConvId: string | null;
  onSelectConversation: (conv: Conversation) => void;
  onNewConversation?: () => void;
}

const ConversationList = ({ conversations, loading, activeConvId, onSelectConversation, onNewConversation }: Props) => (
  <div className="flex flex-col h-full overflow-hidden" style={{ borderRight: '1px solid rgba(212,175,55,0.1)' }}>
    <div className="px-4 py-3 flex items-center justify-between flex-shrink-0"
      style={{ borderBottom: '1px solid rgba(212,175,55,0.08)', background: '#ffffff' }}>
      <span className="text-xs font-black tracking-widest" style={{ color: '#D4AF37' }}>
        CONVERSACIONES
      </span>
      <div className="flex items-center gap-2">
        {conversations.length > 0 && (
          <span className="text-xs font-bold px-1.5 py-0.5 rounded-full"
            style={{ background: 'rgba(212,175,55,0.12)', color: '#D4AF37' }}>
            {conversations.length}
          </span>
        )}
        {onNewConversation && (
          <button onClick={onNewConversation}
            title="Nueva conversación"
            className="w-6 h-6 flex items-center justify-center rounded-lg transition-all hover:scale-110"
            style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37' }}>
            <PenSquare size={12} />
          </button>
        )}
      </div>
    </div>

    <div className="flex-1 overflow-y-auto">
      {loading && (
        <div className="flex items-center justify-center h-32">
          <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: '#D4AF37', borderTopColor: 'transparent' }} />
        </div>
      )}
      {!loading && conversations.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center gap-3 py-16">
          <div className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.15)' }}>
            <MessageSquare size={20} style={{ color: 'rgba(212,175,55,0.4)' }} />
          </div>
          <p className="text-sm text-muted-foreground">Sin mensajes aún</p>
          <p className="text-xs text-muted-foreground leading-relaxed">Inicia contacto desde el directorio de profesionales.</p>
        </div>
      )}
      {conversations.map(c => {
        const isActive = activeConvId === c.id;
        return (
          <div key={c.id}
            onClick={() => onSelectConversation(c)}
            className="flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-all duration-150 relative"
            style={{
              background: isActive ? 'rgba(212,175,55,0.07)' : 'transparent',
              borderBottom: '1px solid rgba(0,0,0,0.03)',
            }}
            onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)'; }}
            onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
          >
            {isActive && (
              <div className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full" style={{ background: '#D4AF37' }} />
            )}
            <div className="relative flex-shrink-0">
              {c.other_photo ? (
                <img src={c.other_photo} alt={c.other_name}
                  className="w-11 h-11 rounded-full object-cover"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              ) : (
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-black"
                  style={{ background: getGradient(c.other_name), color: '#000' }}>
                  {c.other_name.charAt(0).toUpperCase()}
                </div>
              )}
              {c.unread > 0 && (
                <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[0.65rem] font-black"
                  style={{ background: '#22c55e', color: 'rgba(22,20,18,0.88)', border: '2px solid #000' }}>
                  {c.unread > 9 ? '9+' : c.unread}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-0.5">
                <p className={`text-sm font-bold truncate ${c.unread > 0 ? 'text-white' : 'text-muted-foreground'}`}>
                  {c.other_name}
                </p>
                <span className="text-[0.75rem] text-muted-foreground flex-shrink-0 ml-2">
                  {formatTime(c.last_message_at)}
                </span>
              </div>
              <p className={`text-xs truncate ${c.unread > 0 ? 'text-muted-foreground font-medium' : 'text-muted-foreground opacity-60'}`}>
                {c.last_message.startsWith('http') && (c.last_message.includes('.jpg') || c.last_message.includes('.png') || c.last_message.includes('.webp'))
                  ? '📷 Foto'
                  : c.last_message || 'Nueva conversación'}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export default ConversationList;
