import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Cuando un profesional acepta una solicitud, avisa por email a quien la pidió
// con un botón que entra directo al chat con él, sin contraseña (17 oct 2026).
// Pensado para el particular que no tiene sesión: el enlace es de un solo uso y
// solo llega al email de la solicitud. Solo lo puede pedir el profesional de
// esa reserva, y la reserva tiene que estar aceptada.

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'Método no permitido' }, 405);

  try {
    const url = Deno.env.get('SUPABASE_URL') ?? '';
    const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const { booking_id } = await req.json();
    if (typeof booking_id !== 'string' || !UUID.test(booking_id)) return json({ error: 'Reserva no válida' }, 400);

    const auth = req.headers.get('Authorization') ?? '';
    const { data: u } = await createClient(url, Deno.env.get('SUPABASE_ANON_KEY') ?? '', { global: { headers: { Authorization: auth } } }).auth.getUser();
    const callerId = u?.user?.id;
    if (!callerId) return json({ error: 'Sin sesión' }, 401);

    const admin = createClient(url, key);
    const { data: b } = await admin.from('flash_bookings')
      .select('id, requester_contact, requester_name, professional_user_id, professional_name, status, event_date, event_location, created_by')
      .eq('id', booking_id).maybeSingle();
    if (!b || b.professional_user_id !== callerId || !['disponible', 'confirmed'].includes(String(b.status))) return json({ error: 'Sin reserva aceptada' }, 403);
    const email = String(b.requester_contact ?? '').trim().toLowerCase();
    if (!email.includes('@') || !b.created_by) return json({ ok: false, omitido: 'sin email o sin cuenta' });

    const { data: prof } = await admin.from('profiles').select('display_name').eq('user_id', callerId).limit(1).maybeSingle();
    const proNombre = (prof?.display_name ?? b.professional_name ?? 'Profesional').replace(/[&#?=+%]/g, '').slice(0, 60);

    const destino = `https://xpeak.es/dashboard?view=messages&con=${callerId}&nombre=${encodeURIComponent(proNombre)}`;
    const enlace = await admin.auth.admin.generateLink({ type: 'magiclink', email, options: { redirectTo: destino } });
    const actionUrl = enlace.data?.properties?.action_link;
    if (!actionUrl) { console.error('[reserva-enlace-chat] generateLink', enlace.error); return json({ error: 'No se pudo generar el enlace' }, 500); }

    const r = await fetch(`${url}/functions/v1/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        type: 'booking_status_update',
        data: {
          email, status: b.status, requester_name: b.requester_name, professional_name: proNombre,
          event_date: b.event_date, event_location: b.event_location, action_url: actionUrl,
        },
      }),
    });
    if (!r.ok) { console.error('[reserva-enlace-chat] send-email', r.status); return json({ error: 'No se pudo enviar el email' }, 502); }
    return json({ ok: true });
  } catch (err) {
    console.error('[reserva-enlace-chat]', err);
    return json({ error: 'Error' }, 500);
  }
});
