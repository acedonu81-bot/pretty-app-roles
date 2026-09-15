import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Calcula la mediana del tiempo de primera respuesta de cada profesional a
// conversaciones que ARRANCÓ el otro participante (el empresario), y la
// clasifica en un bucket estilo Wallapop. Corre 1 vez al día vía pg_cron
// (xpeak-response-bucket) y también sirve de backfill retroactivo: al no
// filtrar por fecha, cada ejecución recalcula sobre TODO el histórico de
// conversations/messages, no solo mensajes nuevos.

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function bucketFor(medianMinutes: number): string {
  if (medianMinutes < 15) return 'minutos';
  if (medianMinutes < 60) return 'menos_1h';
  if (medianMinutes < 360) return 'unas_horas';
  if (medianMinutes < 1440) return '1_dia';
  return 'mas_1_dia';
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  const admin = createClient(supabaseUrl, serviceKey);

  const { data: conversations, error: convError } = await admin
    .from('conversations')
    .select('id, participant_a, participant_b');

  if (convError) {
    console.error('[response-bucket-recalc] conversations fetch error', convError);
    return new Response(JSON.stringify({ error: convError.message }), { status: 500, headers: corsHeaders });
  }

  if (!conversations?.length) {
    return new Response(JSON.stringify({ updated: 0, message: 'No conversations' }), { headers: corsHeaders });
  }

  // response times (minutos) por profesional (user_id) -> lista de tiempos
  const responseTimesByUser = new Map<string, number[]>();

  for (const conv of conversations) {
    const { data: msgs, error: msgsError } = await admin
      .from('messages')
      .select('sender_id, created_at')
      .eq('conversation_id', conv.id)
      .order('created_at', { ascending: true });

    if (msgsError || !msgs?.length) continue;

    const first = msgs[0];
    const asker = first.sender_id as string;
    const responder = asker === conv.participant_a ? conv.participant_b : conv.participant_a;
    if (!responder || responder === asker) continue;

    const firstResponse = msgs.find((m) => m.sender_id === responder);
    if (!firstResponse) continue;

    const minutes = (new Date(firstResponse.created_at as string).getTime() - new Date(first.created_at as string).getTime()) / 60000;
    if (minutes < 0) continue;

    const list = responseTimesByUser.get(responder) ?? [];
    list.push(minutes);
    responseTimesByUser.set(responder, list);
  }

  let updated = 0;
  for (const [userId, times] of responseTimesByUser.entries()) {
    const bucket = bucketFor(median(times));
    const { error: updateError } = await admin
      .from('profiles')
      .update({ response_bucket: bucket })
      .eq('user_id', userId);
    if (updateError) {
      console.error('[response-bucket-recalc] update error for', userId, updateError);
      continue;
    }
    updated++;
  }

  return new Response(JSON.stringify({ updated, professionals: responseTimesByUser.size }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
