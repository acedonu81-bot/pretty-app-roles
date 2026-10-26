import { useState } from 'react';
import { MessageSquare, PenSquare, MoreVertical, Trash2, Shield } from 'lucide-react';
import AvatarChat from './AvatarChat';

interface Conversation {
  id: string;
  other_user_id: string;
  other_name: string;
  other_photo?: string | null;
  last_message: string;
  last_message_at: string;
  unread: number;
}

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
  <div className="flex flex-col h-full overflow-hidden" style={{ borderRight: '1px solid rgba(139,106,0,0.14)', background: '#FFFDF9' }}>
    <div className="px-5 py-4 flex items-center justify-between flex-shrink-0"
      style={{ borderBottom: '1px solid rgba(139,106,0,0.14)' }}>
      <span className="text-[0.7rem] font-semibold uppercase" style={{ color: '#8B6A00', letterSpacing: '0.18em' }}>
        Conversaciones{conversations.length > 0 ? ` · ${conversations.length}` : ''}
      </span>
      {onNewConversation && (
        <button onClick={onNewConversation}
          title="Nueva conversación" aria-label="Nueva conversación"
          className="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-[rgba(139,106,0,0.08)]"
          style={{ color: '#8B6A00', border: '1px solid rgba(139,106,0,0.25)' }}>
          <PenSquare size={14} />
        </button>
      )}
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
          <div className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: '#FBF3DD', boxShadow: '0 0 0 1px rgba(139,106,0,0.3)' }}>
            <MessageSquare size={22} style={{ color: '#8B6A00' }} />
          </div>
          <p className="font-display text-base font-bold" style={{ color: '#2A2412' }}>Aún no hay conversaciones</p>
          <p className="text-xs leading-relaxed max-w-[200px]" style={{ color: '#5B5238' }}>Empieza desde el perfil de un profesional del directorio.</p>
        </div>
      )}
      {conversations.map(c => {
        const isActive = activeConvId === c.id;
        return (
          <div key={c.id}
            onClick={() => onSelectConversation(c)}
            className="flex items-center gap-3.5 px-5 py-4 cursor-pointer transition-colors duration-150 relative"
            style={{
              background: isActive ? '#FBF3DD' : 'transparent',
              borderBottom: '1px solid rgba(139,106,0,0.09)',
            }}
            onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = 'rgba(251,243,221,0.5)'; }}
            onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
          >
            {isActive && (
              <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: '#B8941E' }} />
            )}
            <AvatarChat name={c.other_name} photo={c.other_photo} size={46} />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-1">
                <p className="text-[0.95rem] truncate" style={{ color: '#2A2412', fontWeight: c.unread > 0 ? 700 : 600 }}>
                  {c.other_name}
                </p>
                <span className="text-[0.7rem] flex-shrink-0 ml-2" style={{ color: c.unread > 0 ? '#8B6A00' : '#7A7360', fontWeight: c.unread > 0 ? 700 : 400 }}>
                  {formatTime(c.last_message_at)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <p className="text-[0.8rem] truncate" style={{ color: c.unread > 0 ? '#3D3620' : '#6B6450', fontWeight: c.unread > 0 ? 500 : 400 }}>
                  {c.last_message.startsWith('http') && (c.last_message.includes('.jpg') || c.last_message.includes('.png') || c.last_message.includes('.webp'))
                    ? 'Foto'
                    : c.last_message || 'Nueva conversación'}
                </p>
                {c.unread > 0 && (
                  <span className="flex-shrink-0 min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center text-[0.68rem] font-bold"
                    style={{ background: '#B8941E', color: '#FFFDF7' }}>
                    {c.unread > 9 ? '9+' : c.unread}
                  </span>
                )}
              </div>
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
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4" style={{ background: 'rgba(42,36,18,0.45)' }}
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
