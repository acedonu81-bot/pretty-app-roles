import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `Eres el asistente de soporte de XPEAK, el marketplace de profesionales para eventos en España.
Ayudas a DJs, fotógrafos, staff, camareros, maquilladores y empresarios de eventos a usar la plataforma.

XPEAK ofrece:
- Directorio de profesionales (DJs, fotógrafos, staff, camareros, diseño, promotores, catering, maquillaje)
- Flash Booking: sistema de reserva rápida de profesionales para eventos
- Fan Club: contenido exclusivo para fans suscritos (audio, fotos, texto)
- Contratos PDF con firma digital
- Planes: Free (1 perfil), Starter €9.99 (2 perfiles), Business €19.99 (3 perfiles), Agency €44.99 (5 perfiles)
- Sello de Oro: verificación de identidad premium
- Calendario de bolos con exportación a Google Calendar / Apple Calendar
- Sistema de mensajes entre profesionales y empresarios

Reglas:
- Responde SIEMPRE en español
- Sé conciso y práctico (máximo 3-4 líneas por respuesta)
- Si no sabes algo específico, di "Para más detalles escríbenos a info@xpeak.es"
- No inventes precios ni funcionalidades que no existen
- Tono: profesional pero cercano, como de una startup de eventos y tecnología`;

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const RATE_LIMIT_MAX = 15;
const RATE_LIMIT_WINDOW_MIN = 10;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Rate-limit por IP ANTES de comprobar nada más — este endpoint llama a
    // la API de Anthropic (coste real por token), sin freno cualquiera con
    // el anon key público podría generar volumen ilimitado directamente por
    // fetch, sin pasar por la UI. Va primero para no depender del orden de
    // los siguientes checks ni gastar una consulta de más si ya está limitado.
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      ?? req.headers.get('x-real-ip')
      ?? 'unknown';

    const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MIN * 60 * 1000).toISOString();
    const { count } = await supabase
      .from('edge_function_rate_limit_log' as any)
      .select('id', { count: 'exact', head: true })
      .eq('endpoint', 'chat-ai')
      .eq('client_ip', clientIp)
      .gte('created_at', since);

    if (typeof count === 'number' && count >= RATE_LIMIT_MAX) {
      return new Response(
        JSON.stringify({ error: 'rate_limit_exceeded', fallback: true }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Registrar la llamada ANTES de cualquier otro corte posible (falta de
    // API key, mensaje inválido, etc.) — si no se cuenta aquí, un atacante
    // que dispare el 503/400 en cada intento nunca acumula count y el
    // rate-limit de arriba jamás se activa.
    try {
      await supabase.from('edge_function_rate_limit_log' as any).insert({ endpoint: 'chat-ai', client_ip: clientIp });
    } catch { /* non-critical */ }

    const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API key not configured', fallback: true }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { message, history = [] } = await req.json();
    if (!message || typeof message !== 'string' || message.length > 500) {
      return new Response(
        JSON.stringify({ error: 'Invalid message' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const messages = [
      ...history.slice(-6).map((m: { role: string; content: string }) => ({
        role: m.role === 'bot' ? 'assistant' : 'user',
        content: m.content,
      })),
      { role: 'user', content: message },
    ];

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':    'application/json',
        'x-api-key':       apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model:      'claude-haiku-4-5-20251001',
        max_tokens: 400,
        system:     SYSTEM_PROMPT,
        messages,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Anthropic error:', err);
      return new Response(
        JSON.stringify({ error: 'AI unavailable', fallback: true }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await res.json();
    const reply = data.content?.[0]?.text ?? 'Lo siento, no pude generar una respuesta. Escríbenos a info@xpeak.es';

    return new Response(
      JSON.stringify({ reply }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('chat-ai error:', err);
    return new Response(
      JSON.stringify({ error: 'Internal error', fallback: true }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
