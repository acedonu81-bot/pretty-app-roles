import { useState, useEffect, useRef, useCallback } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { sanitizeInput } from '@/lib/contentFilter';
import { toast } from 'sonner';
import ConversationList from './messages/ConversationList';
import ChatWindow, { EmptyChatPlaceholder } from './messages/ChatWindow';

// Los resultados de búsqueda mostraban el rol tal cual sale de BD
// ('photo-booth', 'grupo-musical'). Etiquetas legibles para el usuario.
const ROLE_LABEL: Record<string, string> = {
  dj: 'DJ / Artista', 'grupo-musical': 'Grupo musical', media: 'Media', fotografo: 'Fotógrafo',
  makeup: 'Maquillaje', maquillaje: 'Maquillaje', peluqueria: 'Peluquería', staff: 'Staff / Camarero',
  azafata: 'Azafata', promotor: 'Promotor', promotores: 'Promotor', catering: 'Catering',
  mago: 'Mago', humorista: 'Humorista', animador: 'Animador', bailarin: 'Bailarín',
  speaker: 'Speaker', vestuario: 'Vestuario', 'photo-booth': 'Photo Booth',
  'diseno-grafico': 'Diseño gráfico', 'wedding-planner': 'Wedding Planner',
  ambassador: 'Embajador', empresario: 'Empresa / Sala', rookie: 'Artista emergente',
};

interface Conversation {
  id: string;
  other_user_id: string;
  other_name: string;
  other_photo?: string | null;
  last_message: string;
  last_message_at: string;
  unread: number;
}

interface Message {
  id: string;
  sender_id: string;
  content: string;
  photo_url?: string | null;
  read: boolean;
  created_at: string;
  deleted_at?: string | null;
}

const MessagesView = ({ initialUserId, initialName }: { initialUserId?: string; initialName?: string }) => {
  const { user } = useAuth();
  const { display_name: myDisplayName } = useProfile();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [activeOtherName, setActiveOtherName] = useState('');
  const [activeOtherUserId, setActiveOtherUserId] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showEmoji, setShowEmoji] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  // Solo controla la navegación en MÓVIL (lista <-> chat). En desktop ambos se ven siempre.
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [showNewConv, setShowNewConv] = useState(false);
  const [searchUsers, setSearchUsers] = useState('');
  const [userResults, setUserResults] = useState<{ user_id: string; display_name: string; role: string }[]>([]);
  const [searchingUsers, setSearchingUsers] = useState(false);
  const [blockedUserIds, setBlockedUserIds] = useState<Set<string>>(new Set());
  const bottomRef = useRef<HTMLDivElement>(null);
  const realtimeRef = useRef<RealtimeChannel | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadConversations = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('conversations')
      .select('id, participant_a, participant_b, last_message_at, deleted_by_a, deleted_by_b')
      .or(`participant_a.eq.${user.id},participant_b.eq.${user.id}`)
      .order('last_message_at', { ascending: false });

    if (error) { toast.error('Error al cargar conversaciones'); return; }
    const visible = (data ?? []).filter(c =>
      (c.participant_a === user.id && !c.deleted_by_a) || (c.participant_b === user.id && !c.deleted_by_b)
    );
    if (visible.length === 0) { setConversations([]); setLoading(false); return; }

    const convIds = visible.map(c => c.id);
    const otherIds = visible.map(c => c.participant_a === user.id ? c.participant_b : c.participant_a);

    // 4 queries totales (independiente del nº de conversaciones):
    // perfiles + mensajes + bloqueos, en paralelo.
    const [{ data: profilesData }, { data: msgsData }, { data: blockedData }] = await Promise.all([
      supabase.from('profiles').select('user_id, display_name, photo_url').in('user_id', otherIds),
      supabase.from('messages').select('conversation_id, content, read, sender_id, created_at, deleted_at')
        .in('conversation_id', convIds).order('created_at', { ascending: false }),
      supabase.from('blocked_users').select('blocked_id').eq('blocker_id', user.id),
    ]);

    const blockedIds = new Set((blockedData ?? []).map(b => b.blocked_id));
    setBlockedUserIds(blockedIds);
    const finalConvs = visible.filter(c => {
      const otherId = c.participant_a === user.id ? c.participant_b : c.participant_a;
      return !blockedIds.has(otherId);
    });

    const profileMap = new Map((profilesData ?? []).map(p => [p.user_id, { name: p.display_name, photo: p.photo_url }]));

    // Agregar en memoria: último mensaje y nº de no leídos por conversación.
    const lastMsgMap = new Map<string, { content: string }>();
    const unreadMap = new Map<string, number>();
    for (const m of msgsData ?? []) {
      if (m.deleted_at) continue;
      // Mensajes ya ordenados desc → el primero por conv es el último cronológico.
      if (!lastMsgMap.has(m.conversation_id)) lastMsgMap.set(m.conversation_id, { content: m.content });
      if (!m.read && m.sender_id !== user.id) {
        unreadMap.set(m.conversation_id, (unreadMap.get(m.conversation_id) || 0) + 1);
      }
    }

    const convs: Conversation[] = finalConvs.map((c) => {
      const otherId = c.participant_a === user.id ? c.participant_b : c.participant_a;
      return {
        id: c.id,
        other_user_id: otherId,
        other_name: profileMap.get(otherId)?.name || 'Usuario',
        other_photo: profileMap.get(otherId)?.photo,
        last_message: lastMsgMap.get(c.id)?.content || '',
        last_message_at: c.last_message_at,
        unread: unreadMap.get(c.id) || 0,
      };
    });

    setConversations(convs);
    setLoading(false);
  }, [user]);

  const loadMessages = useCallback(async (convId: string) => {
    const { data, error } = await supabase
      .from('messages').select('id, sender_id, content, read, created_at, deleted_at')
      .eq('conversation_id', convId).order('created_at', { ascending: true });
    if (error) { toast.error('Error al cargar mensajes'); return; }
    setMessages((data ?? []) as Message[]);

    if (user) {
      await supabase.from('messages').update({ read: true })
        .eq('conversation_id', convId).neq('sender_id', user.id);
    }
  }, [user]);

  const openConversationWith = useCallback(async (targetUserId: string, targetName: string) => {
    if (!user) return;
    if (blockedUserIds.has(targetUserId)) {
      toast.error('Has bloqueado a este usuario. Desbloquéalo para escribirle.');
      return;
    }
    const a = user.id < targetUserId ? user.id : targetUserId;
    const b = user.id < targetUserId ? targetUserId : user.id;

    const { data: existingData, error: fetchError } = await supabase
      .from('conversations').select('id').eq('participant_a', a).eq('participant_b', b).maybeSingle();
    if (fetchError) {
      toast.error('No se pudo abrir la conversación. Inténtalo de nuevo.');
      console.error('[MessagesView] fetch conversation error:', fetchError);
      return;
    }
    let existing = existingData;

    if (!existing) {
      const { data: created, error: insertError } = await supabase
        .from('conversations').insert({ participant_a: a, participant_b: b }).select('id').single();
      if (insertError) {
        if (insertError.code === '23505') {
          const { data: retryData, error: retryError } = await supabase
            .from('conversations').select('id').eq('participant_a', a).eq('participant_b', b).maybeSingle();
          if (retryError || !retryData) {
            toast.error('No se pudo iniciar la conversación. Inténtalo de nuevo.');
            console.error('[MessagesView] retry fetch conversation error:', retryError);
            return;
          }
          existing = retryData;
        } else {
          toast.error('No se pudo iniciar la conversación. Inténtalo de nuevo.');
          console.error('[MessagesView] create conversation error:', insertError);
          return;
        }
      } else {
        existing = created;
      }
    }

    if (existing) {
      // Si el usuario había "eliminado" este chat de su bandeja, reaparece al reabrirlo.
      const deletedField = user.id === a ? 'deleted_by_a' : 'deleted_by_b';
      await supabase.from('conversations').update({ [deletedField]: false }).eq('id', existing.id);

      setActiveConvId(existing.id);
      setActiveOtherName(targetName);
      setActiveOtherUserId(targetUserId);
      setMobileShowChat(true);
      await loadMessages(existing.id);
      await loadConversations();
    }
  }, [user, loadMessages, loadConversations, blockedUserIds]);

  useEffect(() => { loadConversations(); }, [loadConversations]);
  useEffect(() => {
    if (initialUserId && initialName) openConversationWith(initialUserId, initialName);
  }, [initialUserId, initialName, openConversationWith]);
  // Realtime subscription — replaces 5s polling
  useEffect(() => {
    if (!activeConvId || !user) return;
    if (realtimeRef.current) supabase.removeChannel(realtimeRef.current);

    realtimeRef.current = supabase
      .channel(`messages-conv-${activeConvId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${activeConvId}`,
      }, (payload) => {
        const msg = payload.new as Message;
        setMessages(prev => {
          if (prev.some(m => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
        // Auto-mark incoming messages as read
        if (msg.sender_id !== user.id) {
          supabase.from('messages').update({ read: true }).eq('id', msg.id);
          loadConversations();
        }
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      })
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR') toast.error('Chat desconectado. Recarga la página.');
      });

    return () => {
      if (realtimeRef.current) supabase.removeChannel(realtimeRef.current);
    };
  }, [activeConvId, user, loadConversations]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  useEffect(() => () => { if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current); }, []);

  const sendMessage = async (overrideContent?: string, photoUrl?: string) => {
    const text = typeof overrideContent === 'string' ? overrideContent : input.trim();
    if (!text && !photoUrl) return;
    if (!activeConvId || !user || sending) return;

    if (text) {
      const { clean, reason } = sanitizeInput(text, 'default');
      if (!clean) { toast.error(reason); return; }
    }

    setSending(true);
    const payload: Record<string, unknown> = {
      conversation_id: activeConvId, sender_id: user.id, content: text || '',
    };
    if (photoUrl) payload.photo_url = photoUrl;

    const { error } = await supabase.from('messages').insert(payload as any);
    if (error) { toast.error('Error al enviar el mensaje'); setSending(false); return; }
    await supabase.from('conversations').update({ last_message_at: new Date().toISOString() }).eq('id', activeConvId);
    setInput('');
    await loadMessages(activeConvId);
    await loadConversations();
    setSending(false);
    // Notify recipient by 2 channels: in-app notification + email (fire and forget)
    if (activeOtherUserId) {
      const senderName = myDisplayName?.trim() || user.user_metadata?.display_name || 'Un usuario';
      const preview = text ? (text.length > 80 ? text.slice(0, 80) + '…' : text) : '📷 Te ha enviado una imagen';
      // 1) In-app notification (degrades gracefully if table not yet present)
      supabase.from('notifications' as any).insert({
        user_id: activeOtherUserId,
        type: 'message',
        title: `${senderName} te ha escrito`,
        body: preview,
        link: '/dashboard',
      }).then(({ error }) => { if (error) console.warn('notif insert:', error.message); });
      // 2) Email
      if (text) {
        supabase.functions.invoke('send-email', {
          body: {
            type: 'new_message',
            data: { user_id: activeOtherUserId, sender_name: senderName },
          },
        });
      }
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Máximo 5MB por imagen'); return; }
    if (!file.type.startsWith('image/')) { toast.error('Solo se permiten imágenes'); return; }
    const allowedExts = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !allowedExts.includes(ext)) { toast.error('Formato no permitido'); return; }

    setUploadingPhoto(true);
    const path = `${user.id}/${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from('message-attachments').upload(path, file, { upsert: false });
    if (uploadError) { toast.error('Error al subir imagen'); setUploadingPhoto(false); return; }
    const { data: urlData } = supabase.storage.from('message-attachments').getPublicUrl(path);
    await sendMessage('', urlData.publicUrl);
    setUploadingPhoto(false);
    e.target.value = '';
  };

  const handleSelectConversation = async (conv: Conversation) => {
    setActiveConvId(conv.id);
    setActiveOtherName(conv.other_name);
    setActiveOtherUserId(conv.other_user_id);
    setMobileShowChat(true);
    await loadMessages(conv.id);
    loadConversations();
  };

  // Cierra el chat: en móvil vuelve a la lista; en desktop deselecciona la conversación.
  const handleCloseChat = () => {
    setMobileShowChat(false);
    setActiveConvId(null);
  };

  const searchUsersHandler = (q: string) => {
    setSearchUsers(q);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    if (q.trim().length < 2) { setUserResults([]); setSearchingUsers(false); return; }
    setSearchingUsers(true);
    // Debounce 300ms: una sola query cuando el usuario deja de teclear.
    searchDebounceRef.current = setTimeout(async () => {
      const { data } = await supabase.from('profiles')
        .select('user_id, display_name, role')
        .ilike('display_name', `%${q}%`)
        .neq('user_id', user?.id ?? '')
        .limit(10);
      setUserResults((data ?? []) as { user_id: string; display_name: string; role: string }[]);
      setSearchingUsers(false);
    }, 300);
  };

  const startNewConversation = async (targetUserId: string, targetName: string) => {
    setShowNewConv(false);
    setSearchUsers('');
    setUserResults([]);
    await openConversationWith(targetUserId, targetName);
  };

  const deleteMessage = async (messageId: string) => {
    const { error } = await supabase.from('messages')
      .update({ deleted_at: new Date().toISOString() }).eq('id', messageId);
    if (error) { toast.error('No se pudo eliminar el mensaje'); return; }
    setMessages(prev => prev.map(m => m.id === messageId ? { ...m, deleted_at: new Date().toISOString() } : m));
    if (activeConvId) loadConversations();
  };

  const deleteConversation = async (conv: Conversation) => {
    if (!user) return;
    const a = user.id < conv.other_user_id ? user.id : conv.other_user_id;
    const field = user.id === a ? 'deleted_by_a' : 'deleted_by_b';
    const { error } = await supabase.from('conversations').update({ [field]: true }).eq('id', conv.id);
    if (error) { toast.error('No se pudo eliminar la conversación'); return; }
    setConversations(prev => prev.filter(c => c.id !== conv.id));
    if (activeConvId === conv.id) handleCloseChat();
  };

  const blockUser = async (targetUserId: string) => {
    if (!user) return;
    const { error } = await supabase.from('blocked_users')
      .insert({ blocker_id: user.id, blocked_id: targetUserId });
    if (error) { toast.error('No se pudo bloquear al usuario'); return; }
    toast.success('Usuario bloqueado');
    setBlockedUserIds(prev => new Set(prev).add(targetUserId));
    setConversations(prev => prev.filter(c => c.other_user_id !== targetUserId));
    if (activeOtherUserId === targetUserId) handleCloseChat();
  };

  const totalUnread = conversations.reduce((s, c) => s + c.unread, 0);

  return (
    <div className="animate-[fadeIn_0.4s_ease] flex flex-col"
      style={{
        // 100dvh = viewport dinámico (no salta con la barra de URL móvil).
        // En móvil descuenta header (~120px) + bottom nav (64px + safe-area); en desktop solo el header.
        height: 'calc(100dvh - 120px - var(--mobile-nav-space, 0px))',
        minHeight: 380,
      }}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-0.5 flex items-center gap-2">
            <span className="text-gradient">Mensajes</span>
            {totalUnread > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                style={{ background: 'rgba(212,175,55,0.2)', color: '#8A6D0F' }}>
                {totalUnread}
              </span>
            )}
          </h2>
          <p className="text-xs text-muted-foreground">Comunicaciones directas y privadas.</p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden rounded-2xl sm:rounded-2xl relative"
        style={{ border: '1px solid rgba(0,0,0,0.08)', background: '#ffffff' }}>
        <div className="flex flex-col sm:grid h-full" style={{ gridTemplateColumns: 'minmax(0,280px) 1fr' }}>

          {/* Lista de conversaciones — siempre visible en desktop; en móvil oculta al abrir un chat */}
          <div className={`${mobileShowChat ? 'hidden' : 'flex'} sm:flex flex-col h-full overflow-hidden`}>
            <ConversationList
              conversations={conversations}
              loading={loading}
              activeConvId={activeConvId}
              onSelectConversation={handleSelectConversation}
              onNewConversation={() => setShowNewConv(true)}
              onDeleteConversation={deleteConversation}
              onBlockUser={conv => blockUser(conv.other_user_id)}
            />
          </div>

          {/* Panel derecho — placeholder si no hay chat (solo desktop), o el chat */}
          {!activeConvId ? (
            <div className="hidden sm:flex flex-col h-full overflow-hidden">
              <EmptyChatPlaceholder />
            </div>
          ) : (
            <div className={`${mobileShowChat ? 'flex' : 'hidden'} sm:flex flex-col h-full overflow-hidden`}>
              <ChatWindow
                messages={messages}
                userId={user?.id ?? ''}
                activeOtherName={activeOtherName}
                input={input}
                setInput={setInput}
                showEmoji={showEmoji}
                setShowEmoji={setShowEmoji}
                sending={sending}
                uploadingPhoto={uploadingPhoto}
                bottomRef={bottomRef}
                fileInputRef={fileInputRef}
                onSend={sendMessage}
                onPhotoUpload={handlePhotoUpload}
                onBack={handleCloseChat}
                onDeleteMessage={deleteMessage}
                onDeleteConversation={() => {
                  const conv = conversations.find(c => c.id === activeConvId);
                  if (conv) deleteConversation(conv);
                }}
                onBlockUser={() => { if (activeOtherUserId) blockUser(activeOtherUserId); }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Nueva conversación modal */}
      {showNewConv && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
          onClick={e => { if (e.target === e.currentTarget) { setShowNewConv(false); setSearchUsers(''); setUserResults([]); } }}>
          <div className="rounded-2xl p-5 w-full max-w-sm"
            style={{ background: '#0a0a0e', border: '1px solid rgba(212,175,55,0.25)', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}>
            {/* Panel oscuro (#0a0a0e): los textos heredaban el color oscuro de
                la UI clara y quedaban casi negros sobre negro, ilegibles. */}
            <p className="text-sm font-bold mb-3" style={{ color: 'rgba(255,255,255,0.92)' }}>Nueva conversación</p>
            <input
              autoFocus
              value={searchUsers}
              onChange={e => searchUsersHandler(e.target.value)}
              placeholder="Buscar por nombre..."
              className="nightlife-input w-full text-sm mb-3"
            />
            {searchingUsers && <p className="text-xs text-muted-foreground text-center py-2">Buscando...</p>}
            {!searchingUsers && userResults.length === 0 && searchUsers.length >= 2 && (
              <p className="text-xs text-muted-foreground text-center py-2">Sin resultados</p>
            )}
            <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
              {userResults.map(u => (
                <button key={u.user_id} onClick={() => startNewConversation(u.user_id, u.display_name || 'Usuario')}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all hover:scale-[1.01]"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
                    {(u.display_name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate" style={{ color: 'rgba(255,255,255,0.92)' }}>{u.display_name || 'Usuario'}</p>
                    {/* El rol se pintaba en crudo ('photo-booth', 'event_manager') */}
                    <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.55)' }}>{ROLE_LABEL[u.role] ?? u.role}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesView;
