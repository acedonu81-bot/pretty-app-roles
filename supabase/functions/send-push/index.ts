import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import webpush from 'https://esm.sh/web-push@3';

const ALLOWED_ORIGIN = 'https://xpeak.es';

const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PushPayload {
  user_id: string;
  title: string;
  body: string;
  url?: string;
  tag?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { user_id, title, body, url, tag } = (await req.json()) as PushPayload;
    if (!user_id || !title || !body) {
      return new Response(JSON.stringify({ error: 'Missing user_id, title or body' }), { status: 400, headers: corsHeaders });
    }

    const vapidPublic = Deno.env.get('VAPID_PUBLIC_KEY');
    const vapidPrivate = Deno.env.get('VAPID_PRIVATE_KEY');
    if (!vapidPublic || !vapidPrivate) {
      return new Response(JSON.stringify({ error: 'VAPID not configured' }), { status: 500, headers: corsHeaders });
    }
    webpush.setVapidDetails('mailto:info@xpeak.site', vapidPublic, vapidPrivate);

    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data: subs, error: subsError } = await adminClient
      .from('push_subscriptions')
      .select('id, endpoint, p256dh, auth')
      .eq('user_id', user_id);

    if (subsError) {
      return new Response(JSON.stringify({ error: subsError.message }), { status: 500, headers: corsHeaders });
    }
    if (!subs || subs.length === 0) {
      // No es un error: el usuario simplemente no tiene push activado.
      return new Response(JSON.stringify({ sent: 0 }), { status: 200, headers: corsHeaders });
    }

    const payload = JSON.stringify({ title, body, url, tag });
    let sent = 0;

    await Promise.all(subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload,
        );
        sent++;
      } catch (err: any) {
        if (err?.statusCode === 404 || err?.statusCode === 410) {
          // Suscripción expirada/revocada por el navegador — limpieza incremental.
          // Protegido con su propio try/catch: si el delete falla, no debe tumbar
          // el Promise.all ni el resto del batch de envíos.
          try {
            await adminClient.from('push_subscriptions').delete().eq('id', sub.id);
          } catch { /* cleanup no crítico — se reintentará en el próximo envío fallido */ }
        }
      }
    }));

    return new Response(JSON.stringify({ sent }), { status: 200, headers: corsHeaders });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: corsHeaders });
  }
});
