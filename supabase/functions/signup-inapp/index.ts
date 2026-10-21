import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { comprobarEmail } from '../_shared/comprobarEmail.ts';

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
// Desde el 21 oct 2026 no da sesión: la cuenta queda sin confirmar y se manda el
// enlace de confirmación por correo (ver abajo).

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

    // Email desechable o dominio que no recibe correo (ver _shared/comprobarEmail.ts).
    const revision = await comprobarEmail(admin, email);
    if (!revision.ok) return json({ error: revision.error }, 400);

    // 21 oct 2026: verificación de email para todos. Antes se creaba la cuenta ya
    // confirmada y se devolvía un magic link para entrar al instante, sin demostrar
    // que el correo era suyo. Ahora generateLink('signup') crea la cuenta SIN
    // confirmar y el enlace de confirmación lo manda XPEAK (plantilla confirmar_cuenta):
    // hasta que lo pulse no entra. Al confirmar le llega "cuenta activada" con el
    // enlace a rellenar los datos obligatorios (trigger on_auth_user_confirmed).
    const redirectTo = 'https://xpeak.es/auth?confirmado=1&mode=login&redirect=' + encodeURIComponent('/dashboard?completar=1');
    const { data: link, error: linkError } = await admin.auth.admin.generateLink({
      type: 'signup',
      email,
      password,
      options: {
        redirectTo,
        data: {
          display_name: displayName,
          role: typeof meta.role === 'string' && /^[a-z_-]{1,30}$/.test(meta.role) ? meta.role : 'pending',
          hourly_rate: 0,
          category: 'pending',
          zone: typeof meta.zone === 'string' ? meta.zone.slice(0, 80) : 'España',
          marketing_consent: meta.marketing_consent === true,
          signup_via: 'inapp',
        },
      },
    });
    if (linkError || !link?.properties?.action_link) {
      const yaExiste = /already|registered|exists/i.test(linkError?.message ?? '');
      if (yaExiste) return json({ error: 'Ya hay una cuenta con este email. Pulsa "Entrar" y accede con tu contraseña.' }, 409);
      throw linkError ?? new Error('Sin enlace de confirmación');
    }

    const envio = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''}` },
      body: JSON.stringify({ type: 'confirmar_cuenta', data: { name: displayName, email, url: link.properties.action_link, user_id: link.user?.id } }),
    });
    if (!envio.ok) console.error('[signup-inapp] no se pudo mandar la confirmación', envio.status, await envio.text());

    return json({ verificar: true });
  } catch (e) {
    console.error('[signup-inapp]', e);
    return json({ error: 'No se pudo crear la cuenta' }, 500);
  }
});
