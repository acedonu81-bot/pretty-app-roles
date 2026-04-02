import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const SMTP_HOST = Deno.env.get('SMTP_HOST') ?? 'smtp.hostinger.com';
const SMTP_PORT = parseInt(Deno.env.get('SMTP_PORT') ?? '465');
const SMTP_USER = Deno.env.get('SMTP_USER') ?? 'info@xpeak.site';
const SMTP_PASS = Deno.env.get('SMTP_PASS') ?? '';
const FROM = `XPEAK <info@xpeak.site>`;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { type, data } = await req.json();
    let subject = '';
    let html = '';

    if (type === 'flash_booking') {
      subject = `⚡ Nueva solicitud Flash Booking — ${data.professional_name}`;
      html = `
        <div style="font-family:sans-serif;background:#090909;color:#fff;padding:32px;max-width:520px;margin:0 auto;border-radius:12px;border:1px solid rgba(212,175,55,0.2)">
          <div style="text-align:center;margin-bottom:24px">
            <span style="font-size:28px;font-weight:900;letter-spacing:2px">X<span style="color:#D4AF37">PEAK</span></span>
          </div>
          <div style="background:rgba(212,175,55,0.08);border:1px solid rgba(212,175,55,0.2);border-radius:8px;padding:16px;margin-bottom:20px">
            <p style="color:#D4AF37;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin:0 0 4px">Flash Booking — Nueva solicitud</p>
            <p style="font-size:20px;font-weight:900;margin:0">Para: ${data.professional_name}</p>
          </div>
          <table style="width:100%;border-collapse:collapse">
            ${[
              ['Solicitante', data.requester_name],
              ['Contacto', data.requester_contact],
              ['Fecha del evento', data.event_date],
              ['Lugar', data.event_location || '—'],
              ['Descripción', data.event_description || '—'],
            ].map(([k, v]) => `
              <tr>
                <td style="padding:8px 0;color:rgba(255,255,255,0.4);font-size:12px;width:140px">${k}</td>
                <td style="padding:8px 0;font-size:13px;font-weight:600">${v}</td>
              </tr>`).join('')}
          </table>
          <div style="margin-top:24px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.08);text-align:center">
            <p style="color:rgba(255,255,255,0.3);font-size:11px;margin:0">XPEAK · info@xpeak.site · xpeak.site</p>
          </div>
        </div>`;
    } else if (type === 'welcome') {
      subject = `Bienvenido a XPEAK, ${data.name}`;
      html = `
        <div style="font-family:sans-serif;background:#090909;color:#fff;padding:32px;max-width:520px;margin:0 auto;border-radius:12px;border:1px solid rgba(212,175,55,0.2)">
          <div style="text-align:center;margin-bottom:24px">
            <span style="font-size:28px;font-weight:900;letter-spacing:2px">X<span style="color:#D4AF37">PEAK</span></span>
          </div>
          <h2 style="font-size:22px;font-weight:900;margin:0 0 8px">Hola, ${data.name} 👋</h2>
          <p style="color:rgba(255,255,255,0.6);font-size:14px;line-height:1.6;margin:0 0 20px">
            Tu perfil en XPEAK ya está activo. Completa tu información para aparecer en el directorio y empezar a recibir contactos de empresarios.
          </p>
          <a href="https://xpeak.site/dashboard" style="display:block;text-align:center;background:linear-gradient(135deg,#D4AF37,#B8941E);color:#000;font-weight:900;font-size:14px;padding:14px;border-radius:8px;text-decoration:none;margin-bottom:20px">
            Completar mi perfil →
          </a>
          <div style="margin-top:16px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.08);text-align:center">
            <p style="color:rgba(255,255,255,0.3);font-size:11px;margin:0">XPEAK · info@xpeak.site · xpeak.site</p>
          </div>
        </div>`;
    }

    // Envío via fetch al relay SMTP de Supabase (resend fallback)
    // Por ahora usamos el endpoint de Resend si está configurado, o logueamos
    const resendKey = Deno.env.get('RESEND_API_KEY');
    const toEmail = data.requester_contact?.includes('@') ? data.requester_contact : SMTP_USER;

    if (resendKey) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: FROM, to: [SMTP_USER, toEmail], subject, html }),
      });
      if (!res.ok) throw new Error(await res.text());
    } else {
      // Sin Resend — loguear para debug, el email llega cuando se configure
      console.log('[send-email] no RESEND_API_KEY, would send:', subject, 'to', toEmail);
    }

    return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
