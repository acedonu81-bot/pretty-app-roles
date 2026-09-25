import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { isDemoAccount } from './isDemoAccount.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Recordatorio de mensaje sin responder: el aviso inmediato (new_message) se
// ignora a menudo. Si a las 20-30h el mensaje sigue sin leer, un segundo
// aviso con más urgencia. Ventana de 20-30h (no "desde hace 24h en adelante")
// para que el cron diario cubra cada mensaje una sola vez sin solaparse con
// la ejecución del día siguiente. Dedupe por conversación (no por usuario):
// cada conversación sin responder genera como mucho un recordatorio.
serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  const admin = createClient(supabaseUrl, serviceKey);

  const now = Date.now();
  const windowStart = new Date(now - 30 * 60 * 60 * 1000).toISOString();
  const windowEnd = new Date(now - 20 * 60 * 60 * 1000).toISOString();

  const { data: messages, error: messagesError } = await admin
    .from('messages')
    .select('id, conversation_id, sender_id, content, read, created_at, deleted_at')
    .eq('read', false)
    .is('deleted_at', null)
    .gte('created_at', windowStart)
    .lte('created_at', windowEnd);

  if (messagesError) {
    console.error('[unread-message-reminder] fetch messages error', messagesError);
    return new Response(JSON.stringify({ error: messagesError.message }), { status: 500, headers: corsHeaders });
  }

  if (!messages || messages.length === 0) {
    return new Response(JSON.stringify({ sent: 0, message: 'No unread messages in window' }), { headers: corsHeaders });
  }

  // Una conversación puede tener varios mensajes sin leer en la ventana:
  // quedarse con el más reciente por conversation_id.
  const latestByConversation = new Map<string, typeof messages[number]>();
  for (const m of messages) {
    const prev = latestByConversation.get(m.conversation_id);
    if (!prev || new Date(m.created_at) > new Date(prev.created_at)) {
      latestByConversation.set(m.conversation_id, m);
    }
  }

  const conversationIds = [...latestByConversation.keys()];
  const { data: conversations, error: convError } = await admin
    .from('conversations')
    .select('id, participant_a, participant_b, deleted_by_a, deleted_by_b')
    .in('id', conversationIds);

  if (convError) {
    console.error('[unread-message-reminder] fetch conversations error', convError);
    return new Response(JSON.stringify({ error: convError.message }), { status: 500, headers: corsHeaders });
  }

  let sent = 0;
  const errors: string[] = [];

  for (const conv of conversations ?? []) {
    const msg = latestByConversation.get(conv.id);
    if (!msg) continue;

    const recipientId = msg.sender_id === conv.participant_a ? conv.participant_b : conv.participant_a;
    if (!recipientId) continue;

    const recipientDeleted = recipientId === conv.participant_a ? conv.deleted_by_a : conv.deleted_by_b;
    if (recipientDeleted) continue;

    try {
      const logType = `unread_message_reminder_${conv.id}`;
      const { data: existing } = await admin
        .from('email_logs' as any)
        .select('id')
        .eq('user_id', recipientId)
        .eq('type', logType)
        .maybeSingle();
      if (existing) continue;

      // Si el destinatario ya entró a la app después de que llegara el
      // mensaje, no se manda — puede que ya lo haya visto sin marcarlo
      // leído desde el chat, y no queremos molestar sin motivo.
      const { data: recipientAuth, error: recipientAuthError } = await admin.auth.admin.getUserById(recipientId);
      if (recipientAuthError || !recipientAuth?.user?.email) {
        console.warn('[unread-message-reminder] no email for', recipientId);
        continue;
      }
      if (isDemoAccount(recipientAuth.user.email)) continue;
      const lastSignIn = recipientAuth.user.last_sign_in_at;
      if (lastSignIn && new Date(lastSignIn) > new Date(msg.created_at)) continue;

      const { data: senderProfile } = await admin
        .from('profiles')
        .select('display_name')
        .eq('user_id', msg.sender_id)
        .maybeSingle();

      const res = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${serviceKey}` },
        body: JSON.stringify({
          type: 'unread_message_reminder',
          data: {
            email: recipientAuth.user.email,
            sender_name: senderProfile?.display_name ?? 'Alguien',
          },
        }),
      });

      if (!res.ok) {
        console.error('[unread-message-reminder] send failed for', recipientId, await res.text());
        errors.push(recipientId);
        continue;
      }

      try {
        await admin.from('email_logs' as any).insert({
          user_id: recipientId,
          type: logType,
          sent_at: new Date().toISOString(),
        });
      } catch { /* non-critical */ }

      sent++;
    } catch (e) {
      console.error('[unread-message-reminder] unexpected error for conversation', conv.id, e);
      errors.push(conv.id);
    }
  }

  return new Response(
    JSON.stringify({ sent, errors: errors.length, checked: conversations?.length ?? 0 }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
  );
});
