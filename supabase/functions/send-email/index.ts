import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { SMTPClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ADMIN = 'info@xpeak.site';
const FROM = 'XPEAK <info@xpeak.site>';

// Escape user-supplied strings before inserting into HTML to prevent injection
const esc = (s: unknown): string =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const base = (content: string) => `
<div style="font-family:sans-serif;background:#090909;color:#fff;padding:32px;max-width:520px;margin:0 auto;border-radius:12px;border:1px solid rgba(212,175,55,0.2)">
  <div style="text-align:center;margin-bottom:24px">
    <a href="https://xpeak.site" style="text-decoration:none;font-size:26px;font-weight:900;letter-spacing:2px;color:#fff">X<span style="color:#D4AF37">PEAK</span></a>
  </div>
  ${content}
  <div style="margin-top:28px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.07);text-align:center">
    <p style="color:rgba(255,255,255,0.2);font-size:11px;margin:0">XPEAK · <a href="mailto:info@xpeak.site" style="color:rgba(255,255,255,0.2)">info@xpeak.site</a> · <a href="https://xpeak.site" style="color:rgba(255,255,255,0.2)">xpeak.site</a></p>
  </div>
</div>`;

const badge = (text: string, color = '#D4AF37') =>
  `<span style="background:rgba(212,175,55,0.1);border:1px solid rgba(212,175,55,0.25);border-radius:6px;padding:3px 10px;font-size:11px;font-weight:700;color:${color};text-transform:uppercase;letter-spacing:1px">${esc(text)}</span>`;

const btn = (text: string, url: string) =>
  `<a href="${esc(url)}" style="display:block;text-align:center;background:linear-gradient(135deg,#D4AF37,#B8941E);color:#000;font-weight:900;font-size:14px;padding:14px;border-radius:8px;text-decoration:none;margin:20px 0">${esc(text)}</a>`;

const rows = (pairs: [string, string][]) =>
  `<table style="width:100%;border-collapse:collapse">${pairs.map(([k, v]) =>
    `<tr><td style="padding:9px 0;color:rgba(255,255,255,0.35);font-size:12px;width:140px;border-bottom:1px solid rgba(255,255,255,0.05)">${esc(k)}</td><td style="padding:9px 0;font-size:13px;font-weight:600;border-bottom:1px solid rgba(255,255,255,0.05)">${esc(v) || '—'}</td></tr>`
  ).join('')}</table>`;

const TEMPLATES: Record<string, (d: any) => { subject: string; html: string; to: string; replyTo?: string }> = {

  // 1. Bienvenida al nuevo usuario
  welcome: (d) => ({
    subject: `Bienvenido a XPEAK, ${esc(d.name)} 👋`,
    to: d.email,
    html: base(`
      <h2 style="font-size:22px;font-weight:900;margin:0 0 10px">Hola, ${esc(d.name)} 👋</h2>
      <p style="color:rgba(255,255,255,0.55);font-size:14px;line-height:1.7;margin:0 0 6px">
        Tu perfil como <strong style="color:#D4AF37">${esc(d.role)}</strong> ya está activo en XPEAK.
      </p>
      <p style="color:rgba(255,255,255,0.55);font-size:14px;line-height:1.7;margin:0 0 20px">
        Completa tu información para aparecer en el directorio y empezar a recibir contactos de empresarios de toda España.
      </p>
      ${btn('Completar mi perfil →', 'https://xpeak.site/dashboard')}
      <p style="color:rgba(255,255,255,0.3);font-size:12px;text-align:center">Cualquier duda, responde a este email.</p>`),
  }),

  // 2. Flash Booking — aviso a admin
  flash_booking: (d) => ({
    subject: `⚡ Flash Booking — ${esc(d.professional_name)} — ${esc(d.event_date ?? 'Sin fecha')}`,
    to: ADMIN,
    replyTo: d.requester_contact?.includes('@') ? d.requester_contact : ADMIN,
    html: base(`
      <div style="background:rgba(212,175,55,0.06);border:1px solid rgba(212,175,55,0.2);border-radius:8px;padding:16px;margin-bottom:20px">
        <p style="margin:0 0 4px">${badge('Flash Booking')}</p>
        <p style="font-size:20px;font-weight:900;margin:6px 0 0">Para: ${esc(d.professional_name)}</p>
      </div>
      ${rows([
        ['Solicitante', d.requester_name],
        ['Contacto', d.requester_contact],
        ['Fecha', d.event_date],
        ['Lugar', d.event_location],
        ['Descripción', d.event_description],
      ])}
      <p style="color:rgba(255,255,255,0.3);font-size:12px;margin-top:16px">Responder a este email contacta directamente al solicitante.</p>`),
  }),

  // 3. Flash Booking — confirmación al solicitante
  flash_booking_confirm: (d) => ({
    subject: `Solicitud enviada a ${esc(d.professional_name)} ✓`,
    to: d.requester_contact,
    html: base(`
      <h2 style="font-size:20px;font-weight:900;margin:0 0 10px">Solicitud recibida ✓</h2>
      <p style="color:rgba(255,255,255,0.55);font-size:14px;line-height:1.7;margin:0 0 20px">
        Tu solicitud para <strong style="color:#D4AF37">${esc(d.professional_name)}</strong> ha sido enviada. El profesional se pondrá en contacto contigo pronto.
      </p>
      ${rows([
        ['Evento', d.event_date],
        ['Lugar', d.event_location],
      ])}
      <p style="color:rgba(255,255,255,0.3);font-size:12px;margin-top:20px;text-align:center">
        Si tienes dudas, escríbenos a <a href="mailto:info@xpeak.site" style="color:#D4AF37">info@xpeak.site</a>
      </p>`),
  }),

  // 4. Empresario registrado — aviso admin
  empresario_registered: (d) => ({
    subject: `🏢 Nuevo empresario registrado — ${esc(d.name)}`,
    to: ADMIN,
    html: base(`
      <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:16px;margin-bottom:20px">
        <p style="margin:0 0 4px">${badge('Nuevo Empresario', '#8E8EA0')}</p>
        <p style="font-size:18px;font-weight:900;margin:6px 0 0">${esc(d.name)}</p>
      </div>
      ${rows([
        ['Email', d.email],
        ['Nombre', d.name],
        ['Fecha registro', new Date().toLocaleDateString('es-ES')],
      ])}
      ${btn('Ver en panel admin →', 'https://xpeak.site/admin-beta')}`),
  }),

  // 5. Empresario — confirmación pendiente aprobación
  empresario_pending: (d) => ({
    subject: 'Tu cuenta empresario está pendiente de aprobación',
    to: d.email,
    html: base(`
      <h2 style="font-size:20px;font-weight:900;margin:0 0 10px">Solicitud recibida</h2>
      <p style="color:rgba(255,255,255,0.55);font-size:14px;line-height:1.7;margin:0 0 20px">
        Hola <strong>${esc(d.name)}</strong>, hemos recibido tu solicitud de cuenta empresario en XPEAK.<br><br>
        Nuestro equipo revisará tu perfil en las próximas <strong style="color:#D4AF37">24-48 horas</strong> y te notificaremos cuando esté activo.
      </p>
      <p style="color:rgba(255,255,255,0.3);font-size:12px;text-align:center">
        ¿Tienes prisa? Escríbenos a <a href="mailto:info@xpeak.site" style="color:#D4AF37">info@xpeak.site</a>
      </p>`),
  }),

  // 6. Cancelación de suscripción — aviso admin
  subscription_cancelled: (d) => ({
    subject: `❌ Cancelación — ${esc(d.name)} — Plan ${esc(d.plan)}`,
    to: ADMIN,
    html: base(`
      <div style="background:rgba(255,95,86,0.06);border:1px solid rgba(255,95,86,0.2);border-radius:8px;padding:16px;margin-bottom:20px">
        <p style="margin:0 0 4px">${badge('Cancelación', '#ff5f56')}</p>
        <p style="font-size:18px;font-weight:900;margin:6px 0 0">${esc(d.name)} — ${esc(d.plan)}</p>
      </div>
      ${rows([
        ['Email', d.email],
        ['Plan cancelado', d.plan],
        ['Motivo', d.reason || '—'],
        ['Comentario', d.comment || '—'],
      ])}`),
  }),

  // 7. Fan se suscribe — aviso al profesional (in-app por ahora, email futuro)
  fan_subscribed: (d) => ({
    subject: `⭐ Nuevo fan — ${esc(d.fan_name)} se ha suscrito a tu perfil`,
    to: ADMIN, // hasta que haya email del profesional en DB
    html: base(`
      <h2 style="font-size:18px;font-weight:900;margin:0 0 10px">Nuevo suscriptor ⭐</h2>
      ${rows([
        ['Profesional', d.professional_name],
        ['Fan', d.fan_name],
      ])}`),
  }),

  // 8. Formulario de contacto
  contact_form: (d) => ({
    subject: `📬 Contacto web — ${esc(d.subject ?? 'Sin asunto')}`,
    to: ADMIN,
    replyTo: d.email,
    html: base(`
      <div style="background:rgba(212,175,55,0.04);border:1px solid rgba(212,175,55,0.15);border-radius:8px;padding:16px;margin-bottom:20px">
        <p style="margin:0 0 4px">${badge('Formulario de contacto')}</p>
        <p style="font-size:18px;font-weight:900;margin:6px 0 0">${esc(d.subject ?? 'Mensaje de contacto')}</p>
      </div>
      ${rows([
        ['Nombre', d.name],
        ['Email', d.email],
        ['Teléfono', d.phone || '—'],
        ['Asunto', d.subject || '—'],
      ])}
      <div style="margin-top:16px;padding:14px;background:rgba(255,255,255,0.03);border-radius:8px">
        <p style="color:rgba(255,255,255,0.35);font-size:11px;margin:0 0 6px;text-transform:uppercase;letter-spacing:1px">Mensaje</p>
        <p style="font-size:14px;line-height:1.6;margin:0">${esc(d.message)}</p>
      </div>`),
  }),

  // 9. Solicitud de verificación sello dorado — aviso admin
  verification_request: (d) => ({
    subject: `🔰 Solicitud verificación — ${esc(d.name)}`,
    to: ADMIN,
    html: base(`
      <div style="background:rgba(212,175,55,0.06);border:1px solid rgba(212,175,55,0.2);border-radius:8px;padding:16px;margin-bottom:20px">
        <p style="margin:0 0 4px">${badge('Verificación Sello Dorado')}</p>
        <p style="font-size:18px;font-weight:900;margin:6px 0 0">${esc(d.name)}</p>
      </div>
      ${rows([
        ['Email', d.email],
        ['Rol', d.role],
        ['Zona', d.zone || '—'],
      ])}
      ${btn('Revisar perfil en admin →', 'https://xpeak.site/admin-beta')}`),
  }),

  // 10. Feature request — confirmación al usuario
  feature_request: (d) => ({
    subject: `Sugerencia recibida — XPEAK`,
    to: d.email,
    html: base(`
      <h2 style="font-size:18px;font-weight:900;margin:0 0 10px">Gracias por tu sugerencia 💡</h2>
      <p style="color:rgba(255,255,255,0.55);font-size:14px;line-height:1.7;margin:0 0 16px">
        Hemos recibido tu propuesta: <strong style="color:#D4AF37">${esc(d.feature)}</strong>.<br>
        La analizaremos y si entra en el roadmap te avisaremos.
      </p>
      <p style="color:rgba(255,255,255,0.3);font-size:12px;text-align:center">
        XPEAK está en fase beta — tu feedback es fundamental.
      </p>`),
  }),
};

async function sendMail(to: string, subject: string, html: string, replyTo?: string) {
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
  await client.send({ from: FROM, to, replyTo: replyTo ?? ADMIN, subject, html });
  await client.close();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { type, data } = await req.json();
    if (!type || typeof type !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing type' }), { status: 400, headers: corsHeaders });
    }
    const tmpl = TEMPLATES[type];
    if (!tmpl) return new Response(JSON.stringify({ error: `Unknown type: ${type}` }), { status: 400, headers: corsHeaders });

    const { subject, html, to, replyTo } = tmpl(data);

    // Validate destination email before sending
    if (!to || !to.includes('@')) {
      return new Response(JSON.stringify({ error: 'Invalid recipient email' }), { status: 400, headers: corsHeaders });
    }

    await sendMail(to, subject, html, replyTo);

    return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    console.error('[send-email]', e);
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
