import { useState, useEffect, useRef, useCallback } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { sanitizeInput } from '@/lib/contentFilter';
import { toast } from 'sonner';
import ConversationList from './messages/ConversationList';
import ChatWindow, { EmptyChatPlaceholder } from './messages/ChatWindow';

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
}

const MessagesView = ({ initialUserId, initialName }: { initialUserId?: string; initialName?: string }) => {
  const { user } = useAuth();
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
  const [showConvList, setShowConvList] = useState(true);
  const [showNewConv, setShowNewConv] = useState(false);
  const [searchUsers, setSearchUsers] = useState('');
  const [userResults, setUserResults] = useState<{ user_id: string; display_name: string; role: string }[]>([]);
  const [searchingUsers, setSearchingUsers] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const realtimeRef = useRef<RealtimeChannel | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadConversations = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('conversations')
      .select('id, participant_a, participant_b, last_message_at')
      .or(`participant_a.eq.${user.id},participant_b.eq.${user.id}`)
      .order('last_message_at', { ascending: false });

    if (error) { toast.error('Error al cargar conversaciones'); return; }
    if (!data || data.length === 0) { setConversations([]); setLoading(false); return; }

    // Batch: single query for all participant profiles
    const otherIds = data.map(c => c.participant_a === user.id ? c.participant_b : c.participant_a);
    const { data: profilesData } = await supabase
      .from('profiles').select('user_id, display_name, photo_url').in('user_id', otherIds);
    const profileMap = new Map((profilesData ?? []).map(p => [p.user_id, { name: p.display_name, photo: p.photo_url }]));

    // Parallel: lastMsg + unread per conversation, all at once
    const convs: Conversation[] = await Promise.all(data.map(async (c) => {
      const otherId = c.participant_a === user.id ? c.participant_b : c.participant_a;
      const [{ data: lastMsg }, { count }] = await Promise.all([
        supabase.from('messages').select('content, read, sender_id')
          .eq('conversation_id', c.id).order('created_at', { ascending: false }).limit(1).maybeSingle(),
        supabase.from('messages').select('id', { count: 'exact', head: true })
          .eq('conversation_id', c.id).eq('read', false).neq('sender_id', user.id),
      ]);
      return {
        id: c.id,
        other_user_id: otherId,
        other_name: profileMap.get(otherId)?.name || 'Usuario',
        other_photo: profileMap.get(otherId)?.photo,
        last_message: lastMsg?.content || '',
        last_message_at: c.last_message_at,
        unread: count || 0,
      };
    }));

    setConversations(convs);
    setLoading(false);
  }, [user]);

  const loadMessages = useCallback(async (convId: string) => {
    const { data, error } = await supabase
      .from('messages').select('id, sender_id, content, read, created_at')
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
    const a = user.id < targetUserId ? user.id : targetUserId;
    const b = user.id < targetUserId ? targetUserId : user.id;

    let { data: existing } = await supabase
      .from('conversations').select('id').eq('participant_a', a).eq('participant_b', b).maybeSingle();

    if (!existing) {
      const { data: created } = await supabase
        .from('conversations').insert({ participant_a: a, participant_b: b }).select('id').single();
      existing = created;
    }

    if (existing) {
      setActiveConvId(existing.id);
      setActiveOtherName(targetName);
      setActiveOtherUserId(targetUserId);
      setShowConvList(false);
      await loadMessages(existing.id);
      await loadConversations();
    }
  }, [user, loadMessages, loadConversations]);

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

  const sendMessage = async (overrideContent?: string, photoUrl?: string) => {
    const text = overrideContent ?? input.trim();
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
      const senderName = user.user_metadata?.display_name || 'Un usuario';
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
    setShowConvList(false);
    await loadMessages(conv.id);
    loadConversations();
  };

  const searchUsersHandler = async (q: string) => {
    setSearchUsers(q);
    if (q.trim().length < 2) { setUserResults([]); return; }
    setSearchingUsers(true);
    const { data } = await supabase.from('profiles')
      .select('user_id, display_name, role')
      .ilike('display_name', `%${q}%`)
      .neq('user_id', user?.id ?? '')
      .limit(10);
    setUserResults((data ?? []) as { user_id: string; display_name: string; role: string }[]);
    setSearchingUsers(false);
  };

  const startNewConversation = async (targetUserId: string, targetName: string) => {
    setShowNewConv(false);
    setSearchUsers('');
    setUserResults([]);
    await openConversationWith(targetUserId, targetName);
  };

  const totalUnread = conversations.reduce((s, c) => s + c.unread, 0);
  const isMobileChat = !showConvList && activeConvId;

  return (
    <div className="animate-[fadeIn_0.4s_ease] flex flex-col" style={{ height: 'calc(100vh - 120px)', minHeight: 500 }}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-0.5 flex items-center gap-2">
            <span className="text-gradient">Mensajes</span>
            {totalUnread > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                style={{ background: 'rgba(212,175,55,0.2)', color: '#D4AF37' }}>
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

          {(showConvList || !activeConvId) && (
            <ConversationList
              conversations={conversations}
              loading={loading}
              activeConvId={activeConvId}
              onSelectConversation={handleSelectConversation}
              onNewConversation={() => setShowNewConv(true)}
            />
          )}

          {/* Empty placeholder — desktop only when no conversation selected */}
          {!activeConvId && (
            <div className="hidden sm:flex flex-col h-full overflow-hidden">
              <EmptyChatPlaceholder />
            </div>
          )}

          {/* Chat window — full screen on mobile, right panel on desktop */}
          {activeConvId && !showConvList && (
            <div className="flex flex-col h-full overflow-hidden">
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
                onBack={() => { setShowConvList(true); setActiveConvId(null); }}
              />
            </div>
          )}
          {/* Desktop: show chat alongside conversation list */}
          {activeConvId && showConvList && (
            <div className="hidden sm:flex flex-col h-full overflow-hidden">
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
                onBack={() => { setShowConvList(true); setActiveConvId(null); }}
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
            <p className="text-sm font-bold mb-3">Nueva conversación</p>
            <input
              autoFocus
              value={searchUsers}
              onChange={e => searchUsersHandler(e.target.value)}
              placeholder="Buscar profesional por nombre..."
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
                  style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
                    {(u.display_name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{u.display_name || 'Usuario'}</p>
                    <p className="text-xs text-muted-foreground">{u.role}</p>
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
