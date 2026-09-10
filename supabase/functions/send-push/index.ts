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

// --- APNs (iOS nativo) -------------------------------------------------
//
// Los tokens de la app nativa iOS (Capacitor) se guardan con prefijo
// 'apns://' en la misma tabla que las suscripciones Web Push, pero son
// tokens de dispositivo APNs puros, no endpoints Web Push — mandarlos por
// webpush.sendNotification() (como hacía este archivo hasta el 10 sep 2026)
// fallaba siempre en silencio. APNs habla HTTP/2 + un JWT firmado con la
// clave de autenticación (.p8) de Apple Developer, no VAPID.
//
// El JWT se cachea 50 min (Apple lo acepta hasta 60) para no firmar uno
// nuevo en cada notificación.
let cachedApnsJwt: { token: string; exp: number } | null = null;

function base64url(bytes: Uint8Array): string {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function importApnsKey(pem: string): Promise<CryptoKey> {
  const clean = pem
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s/g, '');
  const der = Uint8Array.from(atob(clean), (c) => c.charCodeAt(0));
  return crypto.subtle.importKey(
    'pkcs8',
    der,
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['sign'],
  );
}

async function getApnsJwt(): Promise<string | null> {
  const now = Math.floor(Date.now() / 1000);
  if (cachedApnsJwt && cachedApnsJwt.exp > now + 60) return cachedApnsJwt.token;

  const keyId = Deno.env.get('APNS_KEY_ID');
  const teamId = Deno.env.get('APNS_TEAM_ID');
  const pem = Deno.env.get('APNS_PRIVATE_KEY');
  if (!keyId || !teamId || !pem) return null;

  const header = { alg: 'ES256', kid: keyId };
  const payload = { iss: teamId, iat: now };
  const signingInput = `${base64url(new TextEncoder().encode(JSON.stringify(header)))}.${base64url(new TextEncoder().encode(JSON.stringify(payload)))}`;

  const key = await importApnsKey(pem);
  const signature = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    key,
    new TextEncoder().encode(signingInput),
  );

  const token = `${signingInput}.${base64url(new Uint8Array(signature))}`;
  cachedApnsJwt = { token, exp: now + 50 * 60 };
  return token;
}

/**
 * Envía una notificación a un token de dispositivo APNs.
 * Devuelve 'sent' | 'invalid' (token expirado/revocado, hay que borrarlo) | 'error'.
 */
async function sendApns(deviceToken: string, title: string, body: string, url?: string, tag?: string): Promise<'sent' | 'invalid' | 'error'> {
  const jwt = await getApnsJwt();
  const bundleId = Deno.env.get('APNS_BUNDLE_ID') ?? 'com.xpeak.app';
  // Producción por defecto: la clave se registró con entorno Production en
  // Apple Developer (10 sep 2026). Solo cambia a sandbox con un build de
  // Xcode sin firmar para distribución.
  const host = Deno.env.get('APNS_USE_SANDBOX') === 'true'
    ? 'api.sandbox.push.apple.com'
    : 'api.push.apple.com';

  if (!jwt) return 'error';

  try {
    const res = await fetch(`https://${host}/3/device/${deviceToken}`, {
      method: 'POST',
      headers: {
        'authorization': `bearer ${jwt}`,
        'apns-topic': bundleId,
        'apns-push-type': 'alert',
        'apns-priority': '10',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        aps: { alert: { title, body }, sound: 'default' },
        url, tag,
      }),
    });

    if (res.ok) return 'sent';
    if (res.status === 400 || res.status === 410) return 'invalid'; // BadDeviceToken / Unregistered
    console.warn('[send-push] APNs error', res.status, await res.text().catch(() => ''));
    return 'error';
  } catch (err) {
    console.warn('[send-push] APNs fetch failed:', err);
    return 'error';
  }
}

// --- handler -------------------------------------------------------------

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { user_id, title, body, url, tag } = (await req.json()) as PushPayload;
    if (!user_id || !title || !body) {
      return new Response(JSON.stringify({ error: 'Missing user_id, title or body' }), { status: 400, headers: corsHeaders });
    }

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

    const webSubs = subs.filter((s) => !s.endpoint.startsWith('apns://') && !s.endpoint.startsWith('fcm://'));
    const apnsSubs = subs.filter((s) => s.endpoint.startsWith('apns://'));
    // fcm:// (Android nativo) registrado por pushNative.ts pero sin emisor
    // propio todavía — mismo hueco que tenía iOS hasta hoy, pendiente.

    let sent = 0;

    if (webSubs.length > 0) {
      const vapidPublic = Deno.env.get('VAPID_PUBLIC_KEY');
      const vapidPrivate = Deno.env.get('VAPID_PRIVATE_KEY');
      if (vapidPublic && vapidPrivate) {
        webpush.setVapidDetails('mailto:info@xpeak.site', vapidPublic, vapidPrivate);
        const payload = JSON.stringify({ title, body, url, tag });

        await Promise.all(webSubs.map(async (sub) => {
          try {
            await webpush.sendNotification(
              { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
              payload,
            );
            sent++;
          } catch (err: any) {
            if (err?.statusCode === 404 || err?.statusCode === 410) {
              try {
                await adminClient.from('push_subscriptions').delete().eq('id', sub.id);
              } catch { /* cleanup no crítico */ }
            }
          }
        }));
      }
    }

    if (apnsSubs.length > 0) {
      await Promise.all(apnsSubs.map(async (sub) => {
        const deviceToken = sub.endpoint.replace('apns://', '');
        const result = await sendApns(deviceToken, title, body, url, tag);
        if (result === 'sent') sent++;
        if (result === 'invalid') {
          try {
            await adminClient.from('push_subscriptions').delete().eq('id', sub.id);
          } catch { /* cleanup no crítico */ }
        }
      }));
    }

    return new Response(JSON.stringify({ sent }), { status: 200, headers: corsHeaders });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: corsHeaders });
  }
});
