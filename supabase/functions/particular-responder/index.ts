import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { firmarAcceso, leerRespuesta } from '../_shared/accesoParticular.ts';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

// Respuesta del particular desde el correo, sin entrar en XPEAK (18 nov 2026,
// ficha XDS 78,7). La página xpeak.es/responder llama aquí:
//   { t, accion: 'ver' }                    → quién le ha contestado
//   { t, accion: 'responder', r: 'si'|'no' } → deja el mensaje en el chat
// El mensaje sale como el propio particular (es su respuesta) y el profesional
// recibe el aviso de siempre. Cada respuesta queda en analytics_events
// ('particular_responde_correo') para medir la Death Line de la ficha.
export const TEXTOS = {
  si: 'Me interesa. ¿Me pasas presupuesto y qué incluye?',
  no: 'Gracias por contestar. De momento no lo necesito.',
} as const;

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'Método no permitido' }, 405);
  try {
    const { t, accion, r } = await req.json();
    const d = typeof t === 'string' ? await leerRespuesta(t) : null;
    if (!d) return json({ error: 'El enlace ha caducado' }, 400);

    const url = Deno.env.get('SUPABASE_URL') ?? '';
    const service = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const admin = createClient(url, service);

    const { data: u } = await admin.auth.admin.getUserById(d.u);
    if (u?.user?.user_metadata?.particular !== 'true') return json({ error: 'El enlace no es válido' }, 400);

    const { data: pro } = await admin.from('profiles').select('display_name, photo_url, specialty, zone')
      .eq('user_id', d.p).order('is_primary', { ascending: false }).limit(1).maybeSingle();
    const { data: conv } = await admin.from('conversations').select('id')
      .or(`and(participant_a.eq.${d.u},participant_b.eq.${d.p}),and(participant_a.eq.${d.p},participant_b.eq.${d.u})`)
      .limit(1).maybeSingle();
    if (!pro || !conv) return json({ error: 'La conversación ya no existe' }, 404);

    // ¿Ya respondió con un botón? No se repite (doble clic, abrir el correo dos veces).
    const { data: previa } = await admin.from('messages').select('content')
      .eq('conversation_id', conv.id).eq('sender_id', d.u).in('content', [TEXTOS.si, TEXTOS.no])
      .limit(1).maybeSingle();
    const nombre = pro.display_name || 'El profesional';
    // El enlace de entrada al chat solo se da cuando ya hay respuesta (una
    // persona ha pulsado el botón), nunca por abrir la página.
    const enlaceChat = () => firmarAcceso(d.u,
      `/dashboard?view=messages&con=${d.p}&nombre=${encodeURIComponent(nombre.replace(/[&#?=+%]/g, '').slice(0, 60))}`);
    const ya = previa ? (previa.content === TEXTOS.si ? 'si' : 'no') : null;

    if (accion === 'ver') {
      return json({ ok: true, nombre, foto: pro.photo_url, oficio: pro.specialty, zona: pro.zone, ya, chat: ya ? await enlaceChat() : null });
    }
    if (accion !== 'responder' || (r !== 'si' && r !== 'no')) return json({ error: 'Respuesta no válida' }, 400);
    if (ya) return json({ ok: true, nombre, ya, chat: await enlaceChat() });

    const { error: e } = await admin.from('messages').insert({ conversation_id: conv.id, sender_id: d.u, content: TEXTOS[r as 'si' | 'no'] });
    if (e) { console.error('[particular-responder] insert', e); return json({ error: 'No se pudo enviar' }, 500); }
    await admin.from('conversations').update({ last_message_at: new Date().toISOString() }).eq('id', conv.id);
    // Lo que le escribió el profesional ya lo ha leído en el correo.
    await admin.from('messages').update({ read: true }).eq('conversation_id', conv.id).eq('sender_id', d.p).eq('read', false);
    await admin.from('analytics_events').insert({ event_name: 'particular_responde_correo', user_id: d.u, detalle: `${r}|${d.p}`, path: '/responder' });

    // Aviso por correo al profesional, como cuando se escribe desde el chat.
    const remitente = String(u.user.user_metadata?.display_name ?? 'Tu cliente').slice(0, 60);
    await fetch(`${url}/functions/v1/send-email`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${service}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'new_message', data: { user_id: d.p, sender_name: remitente } }),
    }).catch(err => console.warn('[particular-responder] aviso', err));

    return json({ ok: true, nombre, ya: r, chat: await enlaceChat() });
  } catch (err) {
    console.error('[particular-responder]', err);
    return json({ error: 'Error' }, 500);
  }
});
