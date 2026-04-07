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
    if (!data) return;

    const convs: Conversation[] = await Promise.all(data.map(async (c) => {
      const otherId = c.participant_a === user.id ? c.participant_b : c.participant_a;
      const { data: profileData } = await supabase
        .from('profiles').select('display_name').eq('user_id', otherId).maybeSingle();
      const { data: lastMsg } = await supabase
        .from('messages').select('content, read, sender_id')
        .eq('conversation_id', c.id).order('created_at', { ascending: false }).limit(1).maybeSingle();
      const { count } = await supabase
        .from('messages').select('id', { count: 'exact', head: true })
        .eq('conversation_id', c.id).eq('read', false).neq('sender_id', user.id);

      return {
        id: c.id,
        other_user_id: otherId,
        other_name: profileData?.display_name || 'Usuario',
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

      <div className="flex-1 overflow-hidden rounded-2xl relative"
        style={{ border: '1px solid rgba(212,175,55,0.15)', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(20px)' }}>
        <div className="grid h-full" style={{ gridTemplateColumns: isMobileChat ? '1fr' : 'minmax(0,280px) 1fr' }}>

          {(!isMobileChat || showConvList) && (
            <ConversationList
              conversations={conversations}
              loading={loading}
              activeConvId={activeConvId}
              onSelectConversation={handleSelectConversation}
            />
          )}

          {(!showConvList || !isMobileChat) && (
            <div className="flex flex-col h-full overflow-hidden">
              {!activeConvId ? (
                <EmptyChatPlaceholder />
              ) : (
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
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesView;
