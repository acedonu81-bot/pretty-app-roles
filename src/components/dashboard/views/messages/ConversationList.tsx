import { useState } from 'react';
import { MessageSquare, PenSquare, MoreVertical, Trash2, Shield } from 'lucide-react';

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
  onDeleteConversation?: (conv: Conversation) => void;
  onBlockUser?: (conv: Conversation) => void;
}

const ConversationList = ({ conversations, loading, activeConvId, onSelectConversation, onNewConversation, onDeleteConversation, onBlockUser }: Props) => {
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{ conv: Conversation; action: 'delete' | 'block' } | null>(null);

  return (
  <div className="flex flex-col h-full overflow-hidden" style={{ borderRight: '1px solid rgba(212,175,55,0.1)' }}>
    <div className="px-4 py-3 flex items-center justify-between flex-shrink-0"
      style={{ borderBottom: '1px solid rgba(212,175,55,0.08)', background: '#ffffff' }}>
      <span className="text-xs font-black tracking-widest" style={{ color: '#8A6D0F' }}>
        CONVERSACIONES
      </span>
      <div className="flex items-center gap-2">
        {conversations.length > 0 && (
          <span className="text-xs font-bold px-1.5 py-0.5 rounded-full"
            style={{ background: 'rgba(212,175,55,0.12)', color: '#8A6D0F' }}>
            {conversations.length}
          </span>
        )}
        {onNewConversation && (
          <button onClick={onNewConversation}
            title="Nueva conversación"
            className="w-6 h-6 flex items-center justify-center rounded-lg transition-all hover:scale-110"
            style={{ background: 'rgba(212,175,55,0.1)', color: '#8A6D0F' }}>
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
                <img src={c.other_photo} alt={c.other_name} loading="lazy"
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
                  style={{ background: '#22c55e', color: '#222', border: '2px solid #fff' }}>
                  {c.unread > 9 ? '9+' : c.unread}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-0.5">
                <p className="text-sm font-bold truncate" style={{ color: c.unread > 0 ? '#111' : undefined }}>
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

            {(onDeleteConversation || onBlockUser) && (
              <div className="relative flex-shrink-0" onClick={e => e.stopPropagation()}>
                <button onClick={() => setMenuOpenFor(v => v === c.id ? null : c.id)}
                  aria-label="Más opciones"
                  title="Más opciones"
                  className="p-1 rounded-lg transition-colors hover:bg-black/10"
                  style={{ color: '#666' }}>
                  <MoreVertical size={15} />
                </button>
                {menuOpenFor === c.id && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setMenuOpenFor(null)} />
                    <div className="absolute right-0 top-full mt-1 z-30 rounded-xl overflow-hidden min-w-[180px]"
                      style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
                      {onDeleteConversation && (
                        <button onClick={() => { setMenuOpenFor(null); setConfirm({ conv: c, action: 'delete' }); }}
                          className="w-full text-left px-4 py-2.5 text-sm font-medium flex items-center gap-2 transition-colors hover:bg-black/5"
                          style={{ color: '#333' }}>
                          <Trash2 size={14} /> Eliminar chat
                        </button>
                      )}
                      {onBlockUser && (
                        <button onClick={() => { setMenuOpenFor(null); setConfirm({ conv: c, action: 'block' }); }}
                          className="w-full text-left px-4 py-2.5 text-sm font-medium flex items-center gap-2 transition-colors hover:bg-black/5"
                          style={{ color: '#dc2626' }}>
                          <Shield size={14} /> Bloquear a {c.other_name}
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>

    {confirm && (
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}
        onClick={() => setConfirm(null)}>
        <div className="rounded-2xl p-5 max-w-sm w-full" style={{ background: '#ffffff' }} onClick={e => e.stopPropagation()}>
          <p className="text-sm font-bold mb-1">
            {confirm.action === 'delete' ? 'Eliminar conversación' : `Bloquear a ${confirm.conv.other_name}`}
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            {confirm.action === 'delete'
              ? 'Se eliminará de tu bandeja. La otra persona seguirá viendo el historial.'
              : 'No podrá enviarte mensajes ni tú a ella. Podrás desbloquearla más adelante.'}
          </p>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setConfirm(null)}
              className="px-3.5 py-2 rounded-lg text-xs font-bold" style={{ background: 'rgba(0,0,0,0.05)', color: '#333' }}>
              Cancelar
            </button>
            <button onClick={() => {
              if (confirm.action === 'delete') onDeleteConversation?.(confirm.conv);
              else onBlockUser?.(confirm.conv);
              setConfirm(null);
            }}
              className="px-3.5 py-2 rounded-lg text-xs font-bold text-white" style={{ background: '#dc2626' }}>
              {confirm.action === 'delete' ? 'Eliminar' : 'Bloquear'}
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
  );
};

export default ConversationList;
