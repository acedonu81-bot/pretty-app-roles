import { useState, useEffect, useRef } from 'react';
import { Send, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { sanitizeInput } from '@/lib/contentFilter';
import { toast } from 'sonner';

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

interface Props {
  professionalProfileId: string;
  professionalUserId: string;
  isSubscribed: boolean;
}

const FanChat = ({ professionalProfileId, professionalUserId, isSubscribed }: Props) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user || !isSubscribed) return;
    const load = async () => {
      const { data, error } = await supabase
        .from('fan_messages')
        .select('id, sender_id, content, created_at')
        .eq('professional_profile_id', professionalProfileId)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: true })
        .limit(100);
      if (!error) setMessages((data as Message[]) ?? []);
    };
    load();

    // Realtime subscription
    const channel = supabase
      .channel(`fan-chat-${professionalProfileId}-${user.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'fan_messages',
        filter: `professional_profile_id=eq.${professionalProfileId}`,
      }, (payload) => {
        const msg = payload.new as Message & { receiver_id: string };
        if (msg.sender_id === user.id || msg.receiver_id === user.id) {
          setMessages(prev => prev.some(m => m.id === msg.id) ? prev : [...prev, msg]);
        }
      })
      .on('error' as any, () => toast.error('Chat desconectado. Recarga la página.'))
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, isSubscribed, professionalProfileId]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !user) return;
    const { clean, reason } = sanitizeInput(input.trim());
    if (!clean) { toast.error(reason); return; }
    const receiverId = user.id === professionalUserId ? messages[0]?.sender_id : professionalUserId;
    if (!receiverId) return;

    const { error } = await supabase.from('fan_messages').insert({
      sender_id: user.id,
      receiver_id: receiverId,
      professional_profile_id: professionalProfileId,
      content: input.trim(),
    });
    if (error) { toast.error('No se pudo enviar el mensaje'); return; }
    setInput('');
  };

  if (!isSubscribed) {
    return (
      <div className="glass-panel p-5 text-center">
        <Lock size={24} className="mx-auto mb-2 text-muted-foreground opacity-40" />
        <p className="text-sm text-muted-foreground mb-1">Chat privado exclusivo para fans</p>
        <p className="text-xs text-muted-foreground">Suscríbete por 4,99 €/mes para acceder al chat directo.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel flex flex-col" style={{ height: 320 }}>
      <div className="p-3 text-xs font-bold" style={{ borderBottom: '1px solid var(--nightlife-border)', color: '#D4AF37' }}>
        Chat Fan Club
      </div>
      <div ref={chatRef} className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-8">
            Envía el primer mensaje como fan suscriptor.
          </p>
        )}
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-[75%] px-3 py-2 rounded-lg text-xs"
              style={{
                background: m.sender_id === user?.id ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${m.sender_id === user?.id ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.05)'}`,
              }}>
              {m.content}
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 flex gap-2" style={{ borderTop: '1px solid var(--nightlife-border)' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Escribe un mensaje..."
          className="nightlife-input flex-1 text-sm"
        />
        <button onClick={handleSend}
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(90deg, #D4AF37, #B8941E)', color: '#000' }}>
          <Send size={14} />
        </button>
      </div>
    </div>
  );
};

export default FanChat;
