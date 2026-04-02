import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { SMTPClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FROM = 'XPEAK <info@xpeak.site>';
const TO_ADMIN = 'info@xpeak.site';

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { type, data } = await req.json();

    let subject = '';
    let html = '';
    let replyTo = TO_ADMIN;

    if (type === 'flash_booking') {
      subject = `⚡ Flash Booking — ${data.professional_name} — ${data.event_date ?? 'Sin fecha'}`;
      replyTo = data.requester_contact?.includes('@') ? data.requester_contact : TO_ADMIN;
      html = `
        <div style="font-family:sans-serif;background:#090909;color:#fff;padding:32px;max-width:520px;margin:0 auto;border-radius:12px;border:1px solid rgba(212,175,55,0.2)">
          <div style="text-align:center;margin-bottom:24px">
            <span style="font-size:28px;font-weight:900;letter-spacing:2px">X<span style="color:#D4AF37">PEAK</span></span>
          </div>
          <div style="background:rgba(212,175,55,0.08);border:1px solid rgba(212,175,55,0.2);border-radius:8px;padding:16px;margin-bottom:20px">
            <p style="color:#D4AF37;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin:0 0 6px">Nueva solicitud Flash Booking</p>
            <p style="font-size:20px;font-weight:900;margin:0">Para: ${data.professional_name}</p>
          </div>
          <table style="width:100%;border-collapse:collapse">
            ${[
              ['Solicitante', data.requester_name],
              ['Contacto', data.requester_contact],
              ['Fecha del evento', data.event_date || '—'],
              ['Lugar', data.event_location || '—'],
              ['Descripción', data.event_description || '—'],
            ].map(([k, v]) => `
              <tr>
                <td style="padding:10px 0;color:rgba(255,255,255,0.4);font-size:12px;width:140px;border-bottom:1px solid rgba(255,255,255,0.05)">${k}</td>
                <td style="padding:10px 0;font-size:13px;font-weight:600;border-bottom:1px solid rgba(255,255,255,0.05)">${v}</td>
              </tr>`).join('')}
          </table>
          <div style="margin-top:24px;padding:16px;background:rgba(255,255,255,0.03);border-radius:8px">
            <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:0 0 4px">Responder directamente a este email contactará al solicitante.</p>
          </div>
          <div style="margin-top:24px;text-align:center">
            <p style="color:rgba(255,255,255,0.25);font-size:11px;margin:0">XPEAK · info@xpeak.site · xpeak.site</p>
          </div>
        </div>`;
    } else if (type === 'welcome') {
      subject = `Bienvenido a XPEAK, ${data.name}`;
      html = `
        <div style="font-family:sans-serif;background:#090909;color:#fff;padding:32px;max-width:520px;margin:0 auto;border-radius:12px;border:1px solid rgba(212,175,55,0.2)">
          <div style="text-align:center;margin-bottom:24px">
            <span style="font-size:28px;font-weight:900;letter-spacing:2px">X<span style="color:#D4AF37">PEAK</span></span>
          </div>
          <h2 style="font-size:22px;font-weight:900;margin:0 0 12px">Hola, ${data.name} 👋</h2>
          <p style="color:rgba(255,255,255,0.6);font-size:14px;line-height:1.7;margin:0 0 24px">
            Tu perfil en XPEAK ya está activo. Completa tu información para aparecer en el directorio y empezar a recibir contactos de empresarios de toda España.
          </p>
          <a href="https://xpeak.site/dashboard" style="display:block;text-align:center;background:linear-gradient(135deg,#D4AF37,#B8941E);color:#000;font-weight:900;font-size:14px;padding:14px;border-radius:8px;text-decoration:none;margin-bottom:24px">
            Completar mi perfil →
          </a>
          <div style="margin-top:16px;text-align:center">
            <p style="color:rgba(255,255,255,0.25);font-size:11px;margin:0">XPEAK · info@xpeak.site · xpeak.site</p>
          </div>
        </div>`;
    }

    const client = new SMTPClient({
      connection: {
        hostname: 'smtp.hostinger.com',
        port: 465,
        tls: true,
        auth: {
          username: Deno.env.get('SMTP_USER') ?? 'info@xpeak.site',
          password: Deno.env.get('SMTP_PASS') ?? '',
        },
      },
    });

    const toEmail = type === 'welcome' && data.email ? data.email : TO_ADMIN;

    await client.send({
      from: FROM,
      to: toEmail,
      replyTo,
      subject,
      html,
    });

    await client.close();

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('[send-email]', e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
