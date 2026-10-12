import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Alta sin captcha para quien llega desde el navegador de Instagram/Facebook/
// TikTok. Ahí Turnstile no resuelve y Supabase exige captcha en signUp, así que
// el anuncio de Instagram trajo 34 visitas y 0 altas la primera noche (11 oct
// 2026); sacar al usuario a Chrome con intent:// solo funcionó 1 de 34 veces.
// El captcha se sustituye por: campo trampa, máximo 3 altas por IP y hora y
// un tope global por hora que corta cualquier ataque masivo.
// Devuelve un token_hash de magic link: el cliente lo canjea con verifyOtp
// (que no pide captcha) y queda con sesión, igual que tras un signUp normal.

const IN_APP_UA = /TikTok|musical_ly|Instagram|FBAN|FBAV|FB_IAB|Line\//i;
const MAX_POR_IP_HORA = 3;
const MAX_GLOBAL_HORA = 40;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'Método no permitido' }, 405);

  try {
    const { email, password, data, website } = await req.json();

    // Campo trampa: invisible para personas, los bots lo rellenan. Error
    // genérico, sin decir por qué.
    if (website) return json({ error: 'No se pudo crear la cuenta' }, 400);

    // El user-agent se puede falsificar: esto solo evita que se use por error
    // desde un navegador normal. La protección real son los límites de abajo.
    if (!IN_APP_UA.test(req.headers.get('user-agent') ?? '')) {
      return json({ error: 'Registro no disponible desde este navegador' }, 403);
    }
    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 254) {
      return json({ error: 'Email no válido' }, 400);
    }
    if (typeof password !== 'string' || password.length < 6 || password.length > 72) {
      return json({ error: 'La contraseña debe tener al menos 6 caracteres.' }, 400);
    }
    const meta = (data && typeof data === 'object') ? data : {};
    const displayName = String(meta.display_name ?? '').replace(/<[^>]*>/g, '').slice(0, 60).trim();
    if (!displayName) return json({ error: 'Introduce tu nombre profesional' }, 400);

    const admin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Solo cf-connecting-ip: lo pone Cloudflare delante de Supabase y pisa el
    // que mande el cliente. x-forwarded-for sí lo puede inventar el cliente.
    // Sin cabecera, todos caen en el mismo cubo y comparten el límite de 3.
    const ip = (req.headers.get('cf-connecting-ip') ?? '').trim() || 'desconocida';
    const haceUnaHora = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const [{ count: porIp }, { count: global }] = await Promise.all([
      admin.from('inapp_signup_attempts').select('id', { count: 'exact', head: true }).eq('ip', ip).gte('created_at', haceUnaHora),
      admin.from('inapp_signup_attempts').select('id', { count: 'exact', head: true }).gte('created_at', haceUnaHora),
    ]);
    if ((porIp ?? 0) >= MAX_POR_IP_HORA || (global ?? 0) >= MAX_GLOBAL_HORA) {
      console.warn('[signup-inapp] límite alcanzado', { ip, porIp, global });
      return json({ error: 'Demasiados intentos. Prueba de nuevo en un rato.' }, 429);
    }
    await admin.from('inapp_signup_attempts').insert({ ip });

    const { error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        display_name: displayName,
        role: typeof meta.role === 'string' && /^[a-z_-]{1,30}$/.test(meta.role) ? meta.role : 'pending',
        hourly_rate: 0,
        category: 'pending',
        zone: typeof meta.zone === 'string' ? meta.zone.slice(0, 80) : 'España',
        marketing_consent: meta.marketing_consent === true,
        signup_via: 'inapp',
      },
    });
    if (createError) {
      const yaExiste = /already|registered|exists/i.test(createError.message);
      return json({ error: yaExiste ? 'Ya hay una cuenta con este email. Pulsa "Entrar" y accede con tu contraseña.' : 'No se pudo crear la cuenta' }, yaExiste ? 409 : 400);
    }

    const { data: link, error: linkError } = await admin.auth.admin.generateLink({ type: 'magiclink', email });
    if (linkError || !link?.properties?.hashed_token) throw linkError ?? new Error('Sin token de sesión');

    return json({ token_hash: link.properties.hashed_token });
  } catch (e) {
    console.error('[signup-inapp]', e);
    return json({ error: 'No se pudo crear la cuenta' }, 500);
  }
});
